import { Response } from 'express';
import { IAuthRequest } from '../types';
import { ProjectDiary } from '../models/ProjectDiary';
import { ProjectReview } from '../models/ProjectReview';
import { ProjectMilestone } from '../models/ProjectMilestone';
import { ProjectProgress } from '../models/ProjectProgress';
import { Project } from '../models/Project';
import { User } from '../models/User';

// Student Diary Management
export const createDiaryEntry = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId, entryType, title, content, attachments } = req.body;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized' });
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
    return res.status(201).json(diaryEntry);
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDiaryEntries = async (req: IAuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10, entryType, status } = req.query;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized' });
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
      entries,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDiaryEntry = async (req: IAuthRequest, res: Response) => {
  try {
    const { entryId } = req.params;
    const { title, content, attachments, status } = req.body;
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const entry = await ProjectDiary.findOneAndUpdate(
      { _id: entryId, studentId },
      { title, content, attachments, status },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Diary entry not found' });
    }

    return res.json(entry);
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return res.status(500).json({ message: 'Internal server error' });
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