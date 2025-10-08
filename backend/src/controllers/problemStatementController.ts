import { Request, Response } from 'express';
import { ProblemStatement } from '../models/ProblemStatement';
import { IAuthRequest } from '../types';

// Create a new problem statement
export const createProblemStatement = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { 
      title, 
      description, 
      category,
      technologies,
      difficulty,
      estimatedDuration,
      skillsRequired
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !difficulty || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, difficulty, and estimated duration are required'
      });
    }
    
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Validate user role (only mentors can create problem statements)
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can create problem statements'
      });
    }
    
    // Create problem statement
    const problemStatement = new ProblemStatement({
      title,
      description,
      category,
      technologies: technologies || [],
      difficulty,
      estimatedDuration,
      skillsRequired: skillsRequired || [],
      postedBy: req.user._id,
      isActive: true,
      projectCount: 0
    });
    
    await problemStatement.save();
    
    // Populate postedBy information
    await problemStatement.populate('postedBy', 'firstName lastName email');
    
    return res.status(201).json({
      success: true,
      message: 'Problem statement created successfully',
      data: problemStatement
    });
  } catch (error) {
    console.error('Create problem statement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create problem statement',
      error: (error as Error).message
    });
  }
};

// Get all problem statements for a mentor
export const getMentorProblemStatements = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Validate user role (only mentors can access their problem statements)
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can access problem statements'
      });
    }
    
    const problemStatements = await ProblemStatement.find({ postedBy: req.user._id })
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      message: 'Problem statements retrieved successfully',
      data: problemStatements
    });
  } catch (error) {
    console.error('Get problem statements error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problem statements',
      error: (error as Error).message
    });
  }
};

// Get all active problem statements (for students to browse)
export const getActiveProblemStatements = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const problemStatements = await ProblemStatement.find({ isActive: true })
      .populate('postedBy', 'firstName lastName email university')
      .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      message: 'Active problem statements retrieved successfully',
      data: problemStatements
    });
  } catch (error) {
    console.error('Get active problem statements error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active problem statements',
      error: (error as Error).message
    });
  }
};

// Get a specific problem statement by ID
export const getProblemStatementById = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const problemStatement = await ProblemStatement.findById(id)
      .populate('postedBy', 'firstName lastName email university department');
    
    if (!problemStatement) {
      return res.status(404).json({
        success: false,
        message: 'Problem statement not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Problem statement retrieved successfully',
      data: problemStatement
    });
  } catch (error) {
    console.error('Get problem statement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve problem statement',
      error: (error as Error).message
    });
  }
};

// Update a problem statement
export const updateProblemStatement = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      category,
      technologies,
      difficulty,
      estimatedDuration,
      skillsRequired,
      isActive
    } = req.body;
    
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Find the problem statement
    const problemStatement = await ProblemStatement.findById(id);
    
    if (!problemStatement) {
      return res.status(404).json({
        success: false,
        message: 'Problem statement not found'
      });
    }
    
    // Check if user is the owner of the problem statement
    if (problemStatement.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this problem statement'
      });
    }
    
    // Update fields
    if (title) problemStatement.title = title;
    if (description) problemStatement.description = description;
    if (category) problemStatement.category = category;
    if (technologies) problemStatement.technologies = technologies;
    if (difficulty) problemStatement.difficulty = difficulty;
    if (estimatedDuration) problemStatement.estimatedDuration = estimatedDuration;
    if (skillsRequired) problemStatement.skillsRequired = skillsRequired;
    if (typeof isActive === 'boolean') problemStatement.isActive = isActive;
    
    await problemStatement.save();
    
    // Populate postedBy information
    await problemStatement.populate('postedBy', 'firstName lastName email');
    
    return res.json({
      success: true,
      message: 'Problem statement updated successfully',
      data: problemStatement
    });
  } catch (error) {
    console.error('Update problem statement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update problem statement',
      error: (error as Error).message
    });
  }
};

// Delete a problem statement
export const deleteProblemStatement = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Find the problem statement
    const problemStatement = await ProblemStatement.findById(id);
    
    if (!problemStatement) {
      return res.status(404).json({
        success: false,
        message: 'Problem statement not found'
      });
    }
    
    // Check if user is the owner of the problem statement
    if (problemStatement.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this problem statement'
      });
    }
    
    // Delete the problem statement
    await ProblemStatement.findByIdAndDelete(id);
    
    return res.json({
      success: true,
      message: 'Problem statement deleted successfully'
    });
  } catch (error) {
    console.error('Delete problem statement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete problem statement',
      error: (error as Error).message
    });
  }
};

// Toggle active status of a problem statement
export const toggleProblemStatementActive = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Validate user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Find the problem statement
    const problemStatement = await ProblemStatement.findById(id);
    
    if (!problemStatement) {
      return res.status(404).json({
        success: false,
        message: 'Problem statement not found'
      });
    }
    
    // Check if user is the owner of the problem statement
    if (problemStatement.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this problem statement'
      });
    }
    
    // Toggle active status
    problemStatement.isActive = typeof isActive === 'boolean' ? isActive : !problemStatement.isActive;
    
    await problemStatement.save();
    
    // Populate postedBy information
    await problemStatement.populate('postedBy', 'firstName lastName email');
    
    return res.json({
      success: true,
      message: `Problem statement ${problemStatement.isActive ? 'activated' : 'deactivated'} successfully`,
      data: problemStatement
    });
  } catch (error) {
    console.error('Toggle problem statement active error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update problem statement status',
      error: (error as Error).message
    });
  }
};