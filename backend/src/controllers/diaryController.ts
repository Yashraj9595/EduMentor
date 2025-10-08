import { Response } from 'express';
import { IAuthRequest } from '../types';
import { ProjectDiary } from '../models/ProjectDiary';
import { ProjectReview } from '../models/ProjectReview';
import { ProjectMilestone } from '../models/ProjectMilestone';
import { ProjectProgress } from '../models/ProjectProgress';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { ProjectProgressTimeline } from '../models/ProjectProgressTimeline';

// Student Diary Management
export const createDiaryEntry = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId, entryType, title, content, attachments } = req.body;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: User not authenticated' 
      });
    }

    // Validate required fields
    if (!projectId || !entryType || !title || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: projectId, entryType, title, and content are required' 
      });
    }

    // Check if project exists and belongs to the student
    const project = await Project.findOne({ _id: projectId, studentId });
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found or you do not have permission to add diary entries to this project' 
      });
    }

    const diaryEntry = new ProjectDiary({
      projectId,
      studentId,
      entryType,
      title,
      content,
      attachments: attachments || [],
      status: 'draft'
    });

    await diaryEntry.save();
    
    // Populate references for the response
    await diaryEntry.populate('projectId', 'title');
    await diaryEntry.populate('studentId', 'firstName lastName');
    
    return res.status(201).json({ 
      success: true,
      message: 'Diary entry created successfully',
      data: diaryEntry
    });
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getDiaryEntries = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10, entryType, status } = req.query;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: User not authenticated' 
      });
    }

    // Check if project exists and belongs to the student
    const project = await Project.findOne({ _id: projectId, studentId });
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found or you do not have permission to view diary entries for this project' 
      });
    }

    const filter: any = { projectId, studentId };
    if (entryType) filter.entryType = entryType;
    if (status) filter.status = status;

    const entries = await ProjectDiary.find(filter)
      .sort({ entryDate: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('projectId', 'title')
      .exec();

    const total = await ProjectDiary.countDocuments(filter);

    return res.json({
      success: true,
      message: 'Diary entries retrieved successfully',
      data: {
        entries,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getDiaryEntry = async (req: IAuthRequest, res: Response) => {
  try {
    const { entryId } = req.params;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: User not authenticated' 
      });
    }

    // Validate entryId
    if (!entryId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required parameter: entryId' 
      });
    }

    const entry = await ProjectDiary.findOne({ _id: entryId, studentId })
      .populate('projectId', 'title')
      .populate('studentId', 'firstName lastName');

    if (!entry) {
      return res.status(404).json({ 
        success: false,
        message: 'Diary entry not found or you do not have permission to view it' 
      });
    }

    return res.json({
      success: true,
      message: 'Diary entry retrieved successfully',
      data: entry
    });
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateDiaryEntry = async (req: IAuthRequest, res: Response) => {
  try {
    const { entryId } = req.params;
    const { title, content, attachments, status } = req.body;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: User not authenticated' 
      });
    }

    // Validate entryId
    if (!entryId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required parameter: entryId' 
      });
    }

    const entry = await ProjectDiary.findOneAndUpdate(
      { _id: entryId, studentId },
      { title, content, attachments, status },
      { new: true }
    ).populate('projectId', 'title');

    if (!entry) {
      return res.status(404).json({ 
        success: false,
        message: 'Diary entry not found or you do not have permission to update it' 
      });
    }

    return res.json({
      success: true,
      message: 'Diary entry updated successfully',
      data: entry
    });
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mentor access to project diary entries
export const getDiaryEntriesByProject = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: User not authenticated' 
      });
    }

    // Check if project exists and is assigned to the mentor
    const project = await Project.findOne({ _id: projectId, mentorId });
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found or you do not have permission to view diary entries for this project' 
      });
    }

    const entries = await ProjectDiary.find({ projectId })
      .sort({ entryDate: -1 })
      .populate('projectId', 'title')
      .populate('studentId', 'firstName lastName')
      .exec();

    return res.json({
      success: true,
      message: 'Diary entries retrieved successfully',
      data: entries
    });
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mentor Review Management
export const createReview = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId, reviewType, title, description, scheduledDate, evaluationCriteria } = req.body;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const review = new ProjectReview({
      projectId,
      mentorId,
      reviewType,
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      evaluationCriteria,
      status: 'scheduled'
    });

    await review.save();
    return res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReviews = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10, status, reviewType } = req.query;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const filter: any = { projectId, mentorId };
    if (status) filter.status = status;
    if (reviewType) filter.reviewType = reviewType;

    const reviews = await ProjectReview.find(filter)
      .sort({ scheduledDate: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('projectId', 'title')
      .exec();

    const total = await ProjectReview.countDocuments(filter);

    return res.json({
      reviews,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReview = async (req: IAuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { overallScore, feedback, mentorNotes, status } = req.body;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const review = await ProjectReview.findOneAndUpdate(
      { _id: reviewId, mentorId },
      { overallScore, feedback, mentorNotes, status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Milestone Management
export const createMilestone = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId, title, description, type, dueDate, weight, requirements, deliverables } = req.body;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const milestone = new ProjectMilestone({
      projectId,
      title,
      description,
      type,
      dueDate: new Date(dueDate),
      weight,
      requirements: requirements || [],
      deliverables: deliverables || [],
      status: 'pending'
    });

    await milestone.save();
    return res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMilestones = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10, status, type } = req.query;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const filter: any = { projectId };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const milestones = await ProjectMilestone.find(filter)
      .sort({ dueDate: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .populate('projectId', 'title')
      .exec();

    const total = await ProjectMilestone.countDocuments(filter);

    return res.json({
      milestones,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMilestone = async (req: IAuthRequest, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const { status, mentorApproval, studentNotes } = req.body;
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const milestone = await ProjectMilestone.findOneAndUpdate(
      { _id: milestoneId },
      { status, mentorApproval, studentNotes },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    return res.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Progress Tracking
export const getProjectProgress = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const progress = await ProjectProgress.findOne({ projectId, studentId: userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    return res.json(progress);
  } catch (error) {
    console.error('Error fetching project progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Progress Timeline Management
export const getProjectProgressTimeline = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      });
    }

    // Check if project exists and user has permission to view it
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    // Check permissions
    const isProjectOwner = project.studentId.toString() === userId.toString();
    const isMentor = project.mentorId && project.mentorId.toString() === userId.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isProjectOwner && !isMentor && !isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'You do not have permission to view this project progress timeline' 
      });
    }

    const timeline = await ProjectProgressTimeline.findOne({ projectId });
    
    if (!timeline) {
      return res.status(404).json({ 
        success: false,
        message: 'Progress timeline not found' 
      });
    }

    return res.json({
      success: true,
      message: 'Progress timeline retrieved successfully',
      data: timeline
    });
  } catch (error) {
    console.error('Error fetching project progress timeline:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateProjectProgressTimeline = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { timelineSteps } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      });
    }

    // Check if project exists and user has permission to update it
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
    }

    // Authorization logic:
    // 1. Mentors can always edit progress timeline
    // 2. Admins can edit only if no mentor is assigned
    // 3. Project owners (students) cannot edit progress timeline
    const isMentor = project.mentorId && project.mentorId.toString() === userId.toString();
    const isAdmin = req.user?.role === 'admin';
    const hasMentorAssigned = project.mentorId && project.mentorId.toString().length > 0;

    let isAuthorized = false;
    
    if (isMentor) {
      // Mentors can always edit
      isAuthorized = true;
    } else if (isAdmin && !hasMentorAssigned) {
      // Admins can edit only if no mentor is assigned
      isAuthorized = true;
    }
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update the project progress timeline'
      });
    }

    // Update or create progress timeline
    let timeline = await ProjectProgressTimeline.findOne({ projectId });
    
    if (!timeline) {
      // Create new timeline if it doesn't exist
      timeline = new ProjectProgressTimeline({
        projectId,
        studentId: project.studentId,
        mentorId: project.mentorId,
        timelineSteps: timelineSteps || [],
        overallProgress: 0,
        totalPoints: 0,
        totalGems: 0,
        currentLevel: 1,
        nextLevelPoints: 100
      });
    } else {
      // Update existing timeline
      timeline.timelineSteps = timelineSteps || timeline.timelineSteps;
    }
    
    // Recalculate overall progress
    if (timeline.timelineSteps && timeline.timelineSteps.length > 0) {
      const totalProgress = timeline.timelineSteps.reduce((sum, step) => sum + step.progress, 0);
      timeline.overallProgress = Math.round(totalProgress / timeline.timelineSteps.length);
      
      // Recalculate total points and gems
      timeline.totalPoints = timeline.timelineSteps.reduce((sum, step) => sum + step.points, 0);
      timeline.totalGems = timeline.timelineSteps.reduce((sum, step) => sum + step.gems, 0);
    }
    
    await timeline.save();

    return res.json({
      success: true,
      message: 'Project progress timeline updated successfully',
      data: timeline
    });
  } catch (error) {
    console.error('Error updating project progress timeline:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mentor Dashboard
export const getMentorDashboard = async (req: IAuthRequest, res: Response) => {
  try {
    const mentorId = req.user?._id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get projects assigned to this mentor
    const projects = await Project.find({ mentorId })
      .populate('studentId', 'firstName lastName email')
      .exec();

    // Get recent diary entries
    const recentEntries = await ProjectDiary.find({ 
      projectId: { $in: projects.map(p => p._id) }
    })
      .sort({ entryDate: -1 })
      .limit(10)
      .populate('projectId', 'title')
      .populate('studentId', 'firstName lastName')
      .exec();

    // Get upcoming reviews
    const upcomingReviews = await ProjectReview.find({
      projectId: { $in: projects.map(p => p._id) },
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
      .sort({ scheduledDate: 1 })
      .limit(5)
      .populate('projectId', 'title')
      .exec();

    return res.json({
      projects,
      recentEntries,
      upcomingReviews,
      totalProjects: projects.length
    });
  } catch (error) {
    console.error('Error fetching mentor dashboard:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};