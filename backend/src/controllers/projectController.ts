import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { ProjectProgressTimeline } from '../models/ProjectProgressTimeline';
import { Notification } from '../models/Notification';
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
      mentorId,  // Should be a valid MongoDB ObjectId string, not an email
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
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Validate mentorId format if provided
    if (mentorId && typeof mentorId === 'string') {
      // Check if it's a valid ObjectId format (24-character hex string)
      if (!/^[0-9a-fA-F]{24}$/.test(mentorId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid mentor ID format. Please provide a valid user ID.'
        });
      }
    }
    
    console.log('Creating project for user:', req.user._id);
    
    // Create project with all fields
    const project = new Project({
      title,
      description,
      longDescription,
      category,
      technologies: technologies || [],
      startDate: start,
      endDate: end,
      studentId: req.user._id, // This is the key field that must be valid
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
    
    // Create default progress timeline for the project
    const defaultTimelineSteps = [
      {
        id: 'planning',
        title: 'Project Planning',
        description: 'Define project scope, objectives, and create detailed project plan with timelines and deliverables.',
        status: 'upcoming',
        progress: 0,
        points: 100,
        gems: 5,
        level: 1,
        specialEffect: 'sparkle'
      },
      {
        id: 'research',
        title: 'Research & Analysis',
        description: 'Conduct thorough research, gather requirements, and analyze existing solutions and best practices.',
        status: 'upcoming',
        progress: 0,
        points: 150,
        gems: 8,
        level: 2,
        specialEffect: 'gem'
      },
      {
        id: 'design',
        title: 'Design & Architecture',
        description: 'Create system architecture, database design, and user interface mockups and prototypes.',
        status: 'upcoming',
        progress: 0,
        points: 200,
        gems: 12,
        level: 3,
        specialEffect: 'diamond'
      },
      {
        id: 'development',
        title: 'Development Phase',
        description: 'Implement core functionality, develop APIs, and build the main application features.',
        status: 'upcoming',
        progress: 0,
        points: 300,
        gems: 15,
        level: 4,
        specialEffect: 'crown'
      },
      {
        id: 'testing',
        title: 'Testing & Review',
        description: 'Conduct comprehensive testing, code reviews, and mentor feedback sessions.',
        status: 'upcoming',
        progress: 0,
        points: 400,
        gems: 20,
        level: 5,
        specialEffect: 'trophy'
      }
    ];
    
    const progressTimeline = new ProjectProgressTimeline({
      projectId: project._id,
      studentId: req.user._id,
      mentorId: mentorId || null,
      timelineSteps: defaultTimelineSteps,
      overallProgress: 0,
      totalPoints: 0,
      totalGems: 0,
      currentLevel: 1,
      nextLevelPoints: 100
    });
    
    await progressTimeline.save();
    
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
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    
    // Check if mentorId is being updated (mentor request)
    const isMentorRequest = mentorId !== undefined && project.mentorId !== mentorId;
    const previousMentorId = project.mentorId;
    
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
    
    // Send notification to mentor when requested
    if (isMentorRequest && mentorId) {
      try {
        const student = await User.findById(req.user?._id);
        const mentor = await User.findById(mentorId);
        
        if (student && mentor) {
          const notification = new Notification({
            title: 'Mentor Request',
            message: `${student.firstName} ${student.lastName} has requested you as a mentor for the project "${project.title}"`,
            userId: mentorId,
            senderId: req.user?._id,
            type: 'mentor_request',
            priority: 'high',
            relatedProjectId: project._id,
            relatedEntityType: 'mentor_request'
          });
          
          await notification.save();
          console.log('Mentor request notification sent to mentor:', mentorId);
        }
      } catch (error) {
        console.error('Failed to send mentor request notification:', error);
      }
    }
    
    // Update progress timeline with new mentorId if it changed
    if (mentorId !== undefined) {
      await ProjectProgressTimeline.findOneAndUpdate(
        { projectId: project._id },
        { mentorId: mentorId || null }
      );
    }
    
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
    
    // Delete associated progress timeline
    await ProjectProgressTimeline.deleteMany({ projectId: id });
    
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

// Get all projects for exploration (public projects)
export const getAllProjects = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('Fetching all projects for exploration');
    
    // Get query parameters for filtering
    const { 
      category, 
      technology, 
      status, 
      sortBy = 'createdAt', 
      limit = 50,
      page = 1 
    } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (technology && technology !== 'all') {
      filter.technologies = { $in: [technology] };
    }
    
    // Build sort object
    let sort: any = { createdAt: -1 };
    switch (sortBy) {
      case 'trending':
        sort = { 'metrics.views': -1, 'metrics.likes': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'most_liked':
        sort = { 'metrics.likes': -1 };
        break;
      case 'most_viewed':
        sort = { 'metrics.views': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    console.log('Filter:', filter);
    console.log('Sort:', sort);
    console.log('Pagination:', { skip, limit: Number(limit) });
    
    // First, let's check if there are any projects at all
    const totalProjects = await Project.countDocuments(filter);
    console.log('Total projects found:', totalProjects);
    
    if (totalProjects === 0) {
      return res.json({
        success: true,
        message: 'No projects found',
        data: [],
        pagination: {
          currentPage: Number(page),
          totalPages: 0,
          totalProjects: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
    
    // Try to find projects with better error handling
    let projects;
    try {
      // First, get all projects without population to check for data integrity
      const rawProjects = await Project.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));
      
      console.log('Raw projects found:', rawProjects.length);
      
      // Filter out projects with invalid ObjectId references
      const validProjects = rawProjects.filter(project => {
        try {
          // Check if studentId is a valid ObjectId string (24 hex characters)
          const studentIdStr = project.studentId?.toString() || '';
          const studentIdValid = studentIdStr && 
            typeof studentIdStr === 'string' && 
            /^[0-9a-fA-F]{24}$/.test(studentIdStr) &&
            !studentIdStr.includes('@'); // Ensure it's not an email
          
          // Check if mentorId is valid (either not set or a valid ObjectId)
          const mentorIdStr = project.mentorId?.toString() || '';
          const mentorIdValid = !project.mentorId || 
            (typeof mentorIdStr === 'string' && 
             /^[0-9a-fA-F]{24}$/.test(mentorIdStr) &&
             !mentorIdStr.includes('@')); // Ensure it's not an email
          
          if (!studentIdValid) {
            console.warn(`Invalid studentId in project ${project._id}: ${studentIdStr}`);
          }
          if (!mentorIdValid) {
            console.warn(`Invalid mentorId in project ${project._id}: ${mentorIdStr}`);
          }
          
          return studentIdValid && mentorIdValid;
        } catch (filterError) {
          console.error('Error filtering project:', project._id, filterError);
          return false;
        }
      });
      
      console.log('Valid projects after filtering:', validProjects.length);
      
      // Try to populate only valid projects
      const populatedProjects = [];
      for (const project of validProjects) {
        try {
          const populatedProject = await Project.findById(project._id)
            .populate('studentId', 'firstName lastName email')
            .populate('mentorId', 'firstName lastName email');
          if (populatedProject) {
            populatedProjects.push(populatedProject);
          }
        } catch (populateError) {
          console.error('Error populating project:', project._id, populateError);
          // Add the project without population if population fails
          populatedProjects.push(project);
        }
      }
      
      projects = populatedProjects;
      console.log('Final populated projects:', projects.length);
    } catch (findError) {
      console.error('Error finding projects:', findError);
      // If find fails, return empty array
      projects = [];
    }
    
    console.log('Found valid projects:', projects.length);
    
    return res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProjects / Number(limit)),
        totalProjects: projects.length,
        hasNextPage: skip + Number(limit) < totalProjects,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Please check that all ID fields contain valid user IDs, not email addresses.',
        error: 'Some projects contain invalid ObjectId references. Please contact support.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Please check that all ID fields contain valid user IDs, not email addresses.',
        error: 'Database contains invalid data format.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
};

// Debug endpoint to check project data
export const debugProjects = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('Debug: Checking project data...');
    
    // Get all projects without populate to see raw data
    const projects = await Project.find({}).limit(10);
    
    const projectAnalysis = projects.map(p => {
      const studentIdStr = p.studentId?.toString() || '';
      const mentorIdStr = p.mentorId?.toString() || '';
      
      // Check if studentId is a valid ObjectId
      const isStudentIdValidObjectId = /^[0-9a-fA-F]{24}$/.test(studentIdStr);
      const isStudentIdEmail = studentIdStr.includes('@');
      
      // Check if mentorId is a valid ObjectId (if present)
      const isMentorIdValidObjectId = !p.mentorId || /^[0-9a-fA-F]{24}$/.test(mentorIdStr);
      const isMentorIdEmail = p.mentorId && mentorIdStr.includes('@');
      
      return {
        id: p._id,
        title: p.title,
        studentId: studentIdStr,
        mentorId: mentorIdStr,
        studentIdType: typeof p.studentId,
        mentorIdType: typeof p.mentorId,
        isStudentIdValidObjectId,
        isStudentIdEmail,
        isMentorIdValidObjectId,
        isMentorIdEmail,
        hasInvalidReferences: isStudentIdEmail || isMentorIdEmail
      };
    });
    
    // Count projects with invalid references
    const invalidProjects = projectAnalysis.filter(p => p.hasInvalidReferences);
    
    console.log('Project analysis:', projectAnalysis);
    console.log('Invalid projects count:', invalidProjects.length);
    
    return res.json({
      success: true,
      message: 'Debug data retrieved',
      data: {
        totalProjects: await Project.countDocuments({}),
        invalidProjectsCount: invalidProjects.length,
        sampleProjects: projectAnalysis.slice(0, 5),
        hasInvalidData: invalidProjects.length > 0
      }
    });
  } catch (error) {
    console.error('Debug projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: (error as Error).message
    });
  }
};

// Create a test project with clean data
export const createTestProject = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('Creating test project...');
    
    // Create a simple test project with valid data
    const testProject = new Project({
      title: 'Test AI Project',
      description: 'This is a test project to verify the API is working correctly.',
      category: 'AI/ML',
      technologies: ['Python', 'TensorFlow', 'React'],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      studentId: req.user?._id, // Use the authenticated user's ID
      status: 'completed',
      deliverables: ['Working prototype', 'Documentation'],
      milestones: [{
        title: 'Research Phase',
        description: 'Research and planning',
        dueDate: new Date(),
        status: 'completed'
      }],
      tags: ['ai', 'machine-learning', 'test'],
      problemStatement: 'Test problem statement',
      metrics: {
        views: 50,
        likes: 5,
        comments: 2,
        bookmarks: 1
      },
      featured: false
    });
    
    await testProject.save();
    console.log('Test project created with ID:', testProject._id);
    
    return res.json({
      success: true,
      message: 'Test project created successfully',
      data: testProject
    });
  } catch (error) {
    console.error('Create test project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create test project',
      error: (error as Error).message
    });
  }
};

// Clean up invalid data in projects
export const cleanupInvalidData = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('Starting data cleanup...');
    
    // Only allow admins to run cleanup
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can run data cleanup'
      });
    }
    
    // Find all projects with invalid data
    const allProjects = await Project.find({});
    const invalidProjects = [];
    const validProjects = [];
    
    for (const project of allProjects) {
      const studentIdStr = project.studentId?.toString() || '';
      const mentorIdStr = project.mentorId?.toString() || '';
      
      // Check if studentId is invalid (contains @ or not a valid ObjectId)
      const isStudentIdInvalid = studentIdStr.includes('@') || 
        (studentIdStr && !/^[0-9a-fA-F]{24}$/.test(studentIdStr));
      
      // Check if mentorId is invalid (contains @ or not a valid ObjectId)
      const isMentorIdInvalid = mentorIdStr.includes('@') || 
        (mentorIdStr && !/^[0-9a-fA-F]{24}$/.test(mentorIdStr));
      
      if (isStudentIdInvalid || isMentorIdInvalid) {
        invalidProjects.push({
          id: project._id,
          title: project.title,
          studentId: studentIdStr,
          mentorId: mentorIdStr,
          issues: {
            invalidStudentId: isStudentIdInvalid,
            invalidMentorId: isMentorIdInvalid
          }
        });
      } else {
        validProjects.push(project._id);
      }
    }
    
    console.log(`Found ${invalidProjects.length} invalid projects out of ${allProjects.length} total`);
    
    // For now, just report the issues. In a real scenario, you might want to:
    // 1. Delete invalid projects
    // 2. Try to find correct user IDs by email
    // 3. Set default values
    
    return res.json({
      success: true,
      message: 'Data cleanup analysis completed',
      data: {
        totalProjects: allProjects.length,
        invalidProjects: invalidProjects.length,
        validProjects: validProjects.length,
        invalidProjectDetails: invalidProjects.slice(0, 10), // Show first 10 for debugging
        recommendation: 'Consider deleting or fixing invalid projects'
      }
    });
  } catch (error) {
    console.error('Data cleanup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run data cleanup',
      error: (error as Error).message
    });
  }
};

// Update project progress timeline with proper authorization
export const updateProjectProgress = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { progressTimeline } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check user authorization
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
    
    const userId = req.user?._id?.toString();
    const userRole = req.user?.role;
    
    // Authorization logic:
    // 1. Mentors can always edit progress timeline
    // 2. Admins can edit only if no mentor is assigned
    // 3. Project owners (students) cannot edit progress timeline
    const isMentor = userRole === 'mentor';
    const isAdmin = userRole === 'admin';
    const isProjectOwner = studentId === userId;
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
    let timeline = await ProjectProgressTimeline.findOne({ projectId: id });
    
    if (!timeline) {
      // Create new timeline if it doesn't exist
      timeline = new ProjectProgressTimeline({
        projectId: id,
        studentId: project.studentId,
        mentorId: project.mentorId,
        timelineSteps: progressTimeline || [],
        overallProgress: 0,
        totalPoints: 0,
        totalGems: 0,
        currentLevel: 1,
        nextLevelPoints: 100
      });
    } else {
      // Update existing timeline
      timeline.timelineSteps = progressTimeline || timeline.timelineSteps;
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
    
    // Populate related information
    await project.populate('studentId', 'firstName lastName email');
    if (project.mentorId) {
      await project.populate('mentorId', 'firstName lastName email');
    }
    
    return res.json({
      success: true,
      message: 'Project progress timeline updated successfully',
      data: timeline
    });
  } catch (error) {
    console.error('Update project progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project progress timeline',
      error: (error as Error).message
    });
  }
};

// Get project progress timeline
export const getProjectProgress = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Check if user has permission to view this project
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
    
    const userId = req.user?._id?.toString();
    const userRole = req.user?.role;
    
    const isProjectOwner = studentId === userId;
    const isMentor = userRole === 'mentor';
    const isAdmin = userRole === 'admin';
    
    if (!isProjectOwner && !isMentor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view the project progress timeline'
      });
    }
    
    // Get progress timeline
    const timeline = await ProjectProgressTimeline.findOne({ projectId: id });
    
    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Project progress timeline not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Project progress timeline retrieved successfully',
      data: timeline
    });
  } catch (error) {
    console.error('Get project progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve project progress timeline',
      error: (error as Error).message
    });
  }
};

// Export all controller functions
export default {
  createProject,
  getStudentProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMentorProjects,
  getAllProjects,
  debugProjects,
  createTestProject,
  cleanupInvalidData,
  updateProjectProgress,
  getProjectProgress
};
