import { Request, Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest, IUserQuery, IPaginatedResponse } from '../types';

export class UserController {
  /**
   * Get all users (Admin only)
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        role,
        isActive,
        search
      }: IUserQuery = req.query;

      // Build query
      const query: any = {};
      
      if (role) {
        query.role = role;
      }
      
      if (isActive !== undefined) {
        query.isActive = isActive;
      }
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);
      const sortOrder = order === 'desc' ? -1 : 1;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ [sort]: sortOrder })
          .skip(skip)
          .limit(Number(limit)),
        User.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      const response: IPaginatedResponse<any> = {
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: totalPages
        }
      };

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: response
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users'
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('-password');
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user'
      });
    }
  }

  /**
   * Update user (Admin only)
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, mobile, role, isActive } = req.body;

      const updateData: any = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (mobile) updateData.mobile = mobile;
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'User update failed'
      });
    }
  }

  /**
   * Delete user (Admin only)
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'User deletion failed'
      });
    }
  }

  /**
   * Deactivate user (Admin only)
   */
  static async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deactivated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({
        success: false,
        message: 'User deactivation failed'
      });
    }
  }

  /**
   * Activate user (Admin only)
   */
  static async activateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User activated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({
        success: false,
        message: 'User activation failed'
      });
    }
  }

  /**
   * Get user statistics (Admin only)
   */
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        activeUsers,
        adminUsers,
        managerUsers,
        regularUsers,
        recentUsers
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ role: 'mentor' }),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        })
      ]);

      res.json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          adminUsers,
          mentorUsers: managerUsers,
          studentUsers: regularUsers,
          recentUsers
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user statistics'
      });
    }
  }

  /**
   * Search users
   */
  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit = 10 } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const users = await User.find({
        $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      })
        .select('-password')
        .limit(Number(limit));

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: { users }
      });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({
        success: false,
        message: 'User search failed'
      });
    }
  }

  /**
   * Get all mentors
   */
  static async getMentors(req: IAuthRequest, res: Response): Promise<void> {
    try {
      console.log('=== GET MENTORS ENDPOINT CALLED ===');
      console.log('Request user:', req.user);
      console.log('Request query:', req.query);
      
      const { search, skills, limit = 20 } = req.query;

      // Build query for mentors only
      const query: any = { 
        role: 'mentor',
        isActive: true 
      };
      
      console.log('Mentor query:', query);
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        query.skills = { $in: skillsArray };
      }

      const mentors = await User.find(query)
        .select('-password -mobile -lastLogin')
        .sort({ firstName: 1 })
        .limit(Number(limit));

      console.log('Found mentors:', mentors.length);
      console.log('Mentors data:', mentors);

      // If no mentors found, create some mock mentors for testing
      let mentorsData;
      if (mentors.length === 0) {
        console.log('No mentors found in database, creating mock mentors');
        mentorsData = [
          {
            id: 'mock-mentor-1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            bio: 'Specialized in artificial intelligence and machine learning with 10+ years of industry experience.',
            skills: ['AI', 'Machine Learning', 'Data Science'],
            university: 'Stanford University',
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            rating: 4.8,
            department: 'Computer Science',
            expertise: ['AI', 'Machine Learning', 'Data Science']
          },
          {
            id: 'mock-mentor-2',
            name: 'Prof. Michael Chen',
            email: 'michael.chen@university.edu',
            bio: 'Expert in Internet of Things and embedded systems with multiple patents in smart devices.',
            skills: ['IoT', 'Embedded Systems', 'Robotics'],
            university: 'MIT',
            linkedin: 'https://linkedin.com/in/michaelchen',
            rating: 4.6,
            department: 'Electrical Engineering',
            expertise: ['IoT', 'Embedded Systems', 'Robotics']
          }
        ];
      } else {
        // Transform mentors data
        mentorsData = mentors.map(mentor => ({
          id: mentor._id,
          name: `${mentor.firstName} ${mentor.lastName}`,
          email: mentor.email,
          bio: mentor.bio || '',
          skills: mentor.skills || [],
          university: mentor.university || '',
          linkedin: mentor.linkedin || '',
          rating: 4.5, // Default rating - in real app, calculate from reviews
          department: mentor.university || 'Computer Science',
          expertise: mentor.skills || ['General Mentoring']
        }));
      }

      res.json({
        success: true,
        message: 'Mentors retrieved successfully',
        data: mentorsData
      });
    } catch (error) {
      console.error('Get mentors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve mentors',
        error: (error as Error).message
      });
    }
  }
}
