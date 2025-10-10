import { Request, Response } from 'express';
import { MentorConnection, MentorGroup, MentorDiscussion } from '../models/MentorNetworking';
import { User } from '../models/User';
import { IAuthRequest } from '../types';
import mongoose from 'mongoose';

export class MentorNetworkingController {
  /**
   * Send a connection request to another mentor
   */
  static async sendConnectionRequest(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { mentorId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Validate that both users are mentors
      const [currentUser, targetUser] = await Promise.all([
        User.findById(userId),
        User.findById(mentorId)
      ]);

      if (!currentUser || currentUser.role !== 'mentor') {
        res.status(403).json({
          success: false,
          message: 'Only mentors can connect with other mentors'
        });
        return;
      }

      if (!targetUser || targetUser.role !== 'mentor') {
        res.status(400).json({
          success: false,
          message: 'Target user is not a mentor'
        });
        return;
      }

      // Check if connection already exists
      const existingConnection = await MentorConnection.findOne({
        $or: [
          { mentor1: userId, mentor2: mentorId },
          { mentor1: mentorId, mentor2: userId }
        ]
      });

      if (existingConnection) {
        res.status(400).json({
          success: false,
          message: 'Connection request already exists or you are already connected'
        });
        return;
      }

      // Create connection request
      const connection = new MentorConnection({
        mentor1: userId,
        mentor2: mentorId,
        requestedBy: userId,
        status: 'pending'
      });

      await connection.save();

      res.status(201).json({
        success: true,
        message: 'Connection request sent successfully',
        data: connection
      });
    } catch (error) {
      console.error('Send connection request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send connection request'
      });
    }
  }

  /**
   * Get connection requests for the current mentor
   */
  static async getConnectionRequests(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const connections = await MentorConnection.find({
        mentor2: userId,
        status: 'pending'
      })
        .populate('mentor1', 'firstName lastName email bio skills')
        .populate('requestedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Connection requests retrieved successfully',
        data: connections
      });
    } catch (error) {
      console.error('Get connection requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve connection requests'
      });
    }
  }

  /**
   * Accept a connection request
   */
  static async acceptConnectionRequest(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { connectionId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const connection = await MentorConnection.findById(connectionId);

      if (!connection) {
        res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
        return;
      }

      if (connection.mentor2.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to accept this connection request'
        });
        return;
      }

      if (connection.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'This connection request is no longer pending'
        });
        return;
      }

      connection.status = 'accepted';
      connection.connectedAt = new Date();
      await connection.save();

      res.json({
        success: true,
        message: 'Connection request accepted successfully',
        data: connection
      });
    } catch (error) {
      console.error('Accept connection request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept connection request'
      });
    }
  }

  /**
   * Reject a connection request
   */
  static async rejectConnectionRequest(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { connectionId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const connection = await MentorConnection.findById(connectionId);

      if (!connection) {
        res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
        return;
      }

      if (connection.mentor2.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to reject this connection request'
        });
        return;
      }

      if (connection.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'This connection request is no longer pending'
        });
        return;
      }

      connection.status = 'rejected';
      await connection.save();

      res.json({
        success: true,
        message: 'Connection request rejected successfully',
        data: connection
      });
    } catch (error) {
      console.error('Reject connection request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject connection request'
      });
    }
  }

  /**
   * Get connected mentors
   */
  static async getConnectedMentors(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const connections = await MentorConnection.find({
        $or: [
          { mentor1: userId },
          { mentor2: userId }
        ],
        status: 'accepted'
      })
        .populate('mentor1', 'firstName lastName email bio skills')
        .populate('mentor2', 'firstName lastName email bio skills');

      // Extract the connected mentors (excluding the current user)
      const connectedMentors = connections.map(connection => {
        if (connection.mentor1._id.toString() === userId) {
          return connection.mentor2;
        } else {
          return connection.mentor1;
        }
      });

      res.json({
        success: true,
        message: 'Connected mentors retrieved successfully',
        data: connectedMentors
      });
    } catch (error) {
      console.error('Get connected mentors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve connected mentors'
      });
    }
  }

  /**
   * Create a mentor group
   */
  static async createGroup(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { name, description, isPublic, initialMembers } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Validate that the user is a mentor
      const user = await User.findById(userId);
      if (!user || user.role !== 'mentor') {
        res.status(403).json({
          success: false,
          message: 'Only mentors can create groups'
        });
        return;
      }

      // Create the group
      const group = new MentorGroup({
        name,
        description,
        createdBy: userId,
        members: [new mongoose.Types.ObjectId(userId)], // Add creator as first member
        admins: [new mongoose.Types.ObjectId(userId)], // Add creator as admin
        isPublic: isPublic !== undefined ? isPublic : false,
        joinRequests: []
      });

      // Add initial members if provided
      if (initialMembers && Array.isArray(initialMembers)) {
        // Validate that all initial members are mentors
        const mentors = await User.find({
          _id: { $in: initialMembers },
          role: 'mentor'
        });
        
        const validMentorIds = mentors.map(mentor => new mongoose.Types.ObjectId(mentor._id.toString()));
        group.members = [...group.members, ...validMentorIds];
      }

      await group.save();

      // Populate the group with creator info
      await group.populate('createdBy', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Group created successfully',
        data: group
      });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create group'
      });
    }
  }

  /**
   * Get all groups (with filtering)
   */
  static async getGroups(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { search, isPublic } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Build filter
      const filter: any = {};

      if (isPublic !== undefined) {
        filter.isPublic = isPublic === 'true';
      }

      if (search) {
        filter.$text = { $search: search as string };
      }

      const groups = await MentorGroup.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Groups retrieved successfully',
        data: groups
      });
    } catch (error) {
      console.error('Get groups error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve groups'
      });
    }
  }

  /**
   * Get group by ID
   */
  static async getGroupById(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const group = await MentorGroup.findById(id)
        .populate('createdBy', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
        .populate('admins', 'firstName lastName email');

      if (!group) {
        res.status(404).json({
          success: false,
          message: 'Group not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Group retrieved successfully',
        data: group
      });
    } catch (error) {
      console.error('Get group error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve group'
      });
    }
  }

  /**
   * Join a group
   */
  static async joinGroup(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const group = await MentorGroup.findById(id);

      if (!group) {
        res.status(404).json({
          success: false,
          message: 'Group not found'
        });
        return;
      }

      // Check if user is already a member
      if (group.members.some(member => (member as any).toString() === userId)) {
        res.status(400).json({
          success: false,
          message: 'You are already a member of this group'
        });
        return;
      }

      if (group.isPublic) {
        // Directly add to members
        group.members.push(new mongoose.Types.ObjectId(userId));
        await group.save();
      } else {
        // Add to join requests
        const existingRequest = group.joinRequests.find(req => (req.user as any).toString() === userId);
        if (existingRequest) {
          res.status(400).json({
            success: false,
            message: 'You have already requested to join this group'
          });
          return;
        }

        group.joinRequests.push({
          user: new mongoose.Types.ObjectId(userId),
          status: 'pending',
          requestedAt: new Date()
        });
        await group.save();
      }

      res.json({
        success: true,
        message: group.isPublic 
          ? 'Successfully joined the group' 
          : 'Join request sent successfully',
        data: group
      });
    } catch (error) {
      console.error('Join group error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to join group'
      });
    }
  }

  /**
   * Create a discussion post
   */
  static async createDiscussion(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { title, content, groupId, tags } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Validate that the user is a mentor
      const user = await User.findById(userId);
      if (!user || user.role !== 'mentor') {
        res.status(403).json({
          success: false,
          message: 'Only mentors can create discussions'
        });
        return;
      }

      // If groupId is provided, verify the user is a member of the group
      if (groupId) {
        const group = await MentorGroup.findById(groupId);
        if (!group) {
          res.status(404).json({
            success: false,
            message: 'Group not found'
          });
          return;
        }

        if (!group.members.some(member => (member as any).toString() === userId)) {
          res.status(403).json({
            success: false,
            message: 'You must be a member of the group to post in it'
          });
          return;
        }
      }

      // Create the discussion
      const discussion = new MentorDiscussion({
        title,
        content,
        author: new mongoose.Types.ObjectId(userId),
        groupId: groupId ? new mongoose.Types.ObjectId(groupId) : undefined,
        tags: tags || [],
        likes: [],
        replies: [],
        views: 0,
        isPinned: false
      });

      await discussion.save();

      // Populate author info
      await discussion.populate('author', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Discussion created successfully',
        data: discussion
      });
    } catch (error) {
      console.error('Create discussion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create discussion'
      });
    }
  }

  /**
   * Get discussions (with filtering)
   */
  static async getDiscussions(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { groupId, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      // Build filter
      const filter: any = {};

      if (groupId) {
        filter.groupId = groupId;
      }

      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];
        filter.tags = { $in: tagsArray };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

      const discussions = await MentorDiscussion.find(filter)
        .populate('author', 'firstName lastName email')
        .populate('groupId', 'name')
        .sort(sort);

      res.json({
        success: true,
        message: 'Discussions retrieved successfully',
        data: discussions
      });
    } catch (error) {
      console.error('Get discussions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve discussions'
      });
    }
  }

  /**
   * Like a discussion
   */
  static async likeDiscussion(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const discussion = await MentorDiscussion.findById(id);

      if (!discussion) {
        res.status(404).json({
          success: false,
          message: 'Discussion not found'
        });
        return;
      }

      // Check if user has already liked
      const hasLiked = discussion.likes.some(like => (like as any).toString() === userId);

      if (hasLiked) {
        // Unlike
        discussion.likes = discussion.likes.filter(like => (like as any).toString() !== userId);
      } else {
        // Like
        discussion.likes.push(new mongoose.Types.ObjectId(userId));
      }

      await discussion.save();

      res.json({
        success: true,
        message: hasLiked ? 'Discussion unliked successfully' : 'Discussion liked successfully',
        data: {
          likes: discussion.likes.length,
          hasLiked: !hasLiked
        }
      });
    } catch (error) {
      console.error('Like discussion error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like discussion'
      });
    }
  }
}