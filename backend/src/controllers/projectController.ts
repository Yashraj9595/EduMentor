import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { IAuthRequest } from '../types';

// Create a new project
export const createProject = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { 
      title, 
      description, 
      longDescription,
      category,
      technologies,
      startDate, 
      endDate, 
      deliverables, 
      milestones,
      tags,
      problemStatement,
      repositoryLink,
      liveUrl,
      documentationUrl,
      videoUrl,
      teamMembers,
      status,
      mentorId,
      objectives,
      challenges,
      achievements,
      gallery,
      metrics,
      featured
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, start date, and end date are required'
      });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    console.log('Creating project for user:', req.user?._id);
    
    // Create project with all fields
    const project = new Project({
      title,
      description,
      longDescription,
      category,
      technologies: technologies || [],
      startDate: start,
      endDate: end,
      studentId: req.user?._id,
      deliverables: deliverables || [],
      milestones: milestones || [],
      tags: tags || [],
      problemStatement,
      repositoryLink,
      liveUrl,
      documentationUrl,
      videoUrl,
      teamMembers: teamMembers || [],
      status: status || 'draft',
      mentorId,
      objectives: objectives || [],
      challenges: challenges || [],
      achievements: achievements || [],
      gallery: gallery || [],
      metrics: metrics || {
        views: 0,
        likes: 0,
        comments: 0,
        bookmarks: 0
      },
      featured: featured || false
    });
    
    await project.save();
    console.log('Project created with ID:', project._id);
    
    // Populate student and mentor information
    await project.populate('studentId', 'firstName lastName email');
    if (mentorId) {
      await project.populate('mentorId', 'firstName lastName email');
    }
    
    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: (error as Error).message
    });
  }
};

// Get all projects for a student
export const getStudentProjects = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('Fetching projects for user:', req.user?._id);
    const projects = await Project.find({ studentId: req.user?._id })
      .populate('mentorId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    console.log('Found projects:', projects.length);
    console.log('Projects data:', projects);
    
    return res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: (error as Error).message
    });
  }
};

// Get a specific project by ID
export const getProjectById = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log('Fetching project by ID:', id);
    console.log('Request user:', req.user);
    
    const project = await Project.findById(id)
      .populate('studentId', 'firstName lastName email')
      .populate('mentorId', 'firstName lastName email');
    
    console.log('Project found:', project);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has permission to view this project
    console.log('Project studentId:', project.studentId);
    console.log('Request user ID:', req.user?._id);
    console.log('User role:', req.user?.role);
    
    // Handle both populated and non-populated studentId
    let studentId: string;
    if (typeof project.studentId === 'object' && project.studentId !== null) {
      // If populated, get the _id from the populated object
      const populatedStudent = project.studentId as any;
      studentId = populatedStudent._id?.toString() || populatedStudent.toString();
    } else {
      // If not populated, use the string directly
      studentId = project.studentId.toString();
    }
    
    const isOwner = studentId === req.user?._id?.toString();
    const isAdmin = req.user?.role === 'admin';
    const isMentor = req.user?.role === 'mentor';
    
    console.log('Student ID for comparison:', studentId);
    console.log('Is owner:', isOwner);
    console.log('Is admin:', isAdmin);
    console.log('Is mentor:', isMentor);
    
    if (!isOwner && !isAdmin && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this project'
      });
    }
    
    return res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      error: (error as Error).message
    });
  }
};

// Update a project
export const updateProject = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      longDescription,
      category,
      technologies,
      startDate, 
      endDate, 
      deliverables, 
      milestones,
      tags,
      problemStatement,
      repositoryLink,
      liveUrl,
      documentationUrl,
      videoUrl,
      teamMembers,
      status,
      mentorId,
      objectives,
      challenges,
      achievements,
      gallery,
      metrics,
      featured
    } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has permission to update this project
    // Handle both populated and non-populated studentId
    let studentId: string;
    if (typeof project.studentId === 'object' && project.studentId !== null) {
      // If populated, get the _id from the populated object
      const populatedStudent = project.studentId as any;
      studentId = populatedStudent._id?.toString() || populatedStudent.toString();
    } else {
      // If not populated, use the string directly
      studentId = project.studentId.toString();
    }
    
    if (studentId !== req.user?._id?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this project'
      });
    }
    
    // Update all fields
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (longDescription !== undefined) project.longDescription = longDescription;
    if (category !== undefined) project.category = category;
    if (technologies !== undefined) project.technologies = technologies;
    if (startDate !== undefined) project.startDate = new Date(startDate);
    if (endDate !== undefined) project.endDate = new Date(endDate);
    if (deliverables !== undefined) project.deliverables = deliverables;
    if (milestones !== undefined) project.milestones = milestones;
    if (tags !== undefined) project.tags = tags;
    if (problemStatement !== undefined) project.problemStatement = problemStatement;
    if (repositoryLink !== undefined) project.repositoryLink = repositoryLink;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (documentationUrl !== undefined) project.documentationUrl = documentationUrl;
    if (videoUrl !== undefined) project.videoUrl = videoUrl;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;
    if (status !== undefined) project.status = status;
    if (mentorId !== undefined) project.mentorId = mentorId;
    if (objectives !== undefined) project.objectives = objectives;
    if (challenges !== undefined) project.challenges = challenges;
    if (achievements !== undefined) project.achievements = achievements;
    if (gallery !== undefined) project.gallery = gallery;
    if (metrics !== undefined) project.metrics = metrics;
    if (featured !== undefined) project.featured = featured;
    
    await project.save();
    
    // Populate related information
    await project.populate('studentId', 'firstName lastName email');
    if (project.mentorId) {
      await project.populate('mentorId', 'firstName lastName email');
    }
    
    return res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: (error as Error).message
    });
  }
};

// Delete a project
export const deleteProject = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has permission to delete this project
    // Handle both populated and non-populated studentId
    let studentId: string;
    if (typeof project.studentId === 'object' && project.studentId !== null) {
      // If populated, get the _id from the populated object
      const populatedStudent = project.studentId as any;
      studentId = populatedStudent._id?.toString() || populatedStudent.toString();
    } else {
      // If not populated, use the string directly
      studentId = project.studentId.toString();
    }
    
    if (studentId !== req.user?._id?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this project'
      });
    }
    
    await Project.findByIdAndDelete(id);
    
    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: (error as Error).message
    });
  }
};

// Get projects for a mentor
export const getMentorProjects = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    // Check if user is a mentor
    if (req.user?.role !== 'mentor' && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view mentor projects'
      });
    }
    
    const projects = await Project.find({ mentorId: req.user?._id })
      .populate('studentId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      message: 'Mentor projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    console.error('Get mentor projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentor projects',
      error: (error as Error).message
    });
  }
};