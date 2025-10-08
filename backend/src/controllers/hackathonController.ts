import { Request, Response } from 'express';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';

// Create a new hackathon
export const createHackathon = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      submissionDeadline,
      location,
      locationType,
      maxTeams,
      maxTeamSize,
      minTeamSize,
      prizePool,
      currency,
      tags,
      categories,
      difficulty,
      requirements,
      judgingCriteria,
      rules,
      prizes,
      sponsors,
      mentors,
      resources,
      contactInfo,
      submissionStages,
      volunteers,
      status = 'draft'
    } = req.body;

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, startDate, endDate, location'
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

    // Validate judging criteria totals 100%
    if (judgingCriteria) {
      const total = Object.values(judgingCriteria).reduce((sum: number, val: any) => sum + val, 0);
      if (total !== 100) {
        return res.status(400).json({
          success: false,
          message: 'Judging criteria must total exactly 100%'
        });
      }
    }

    // Create hackathon
    const hackathon = new Hackathon({
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      registrationStart: registrationStart ? new Date(registrationStart) : undefined,
      registrationEnd: registrationEnd ? new Date(registrationEnd) : undefined,
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : undefined,
      location,
      locationType: locationType || 'physical',
      maxTeams: maxTeams || 50,
      maxTeamSize: maxTeamSize || 4,
      minTeamSize: minTeamSize || 2,
      prizePool,
      currency: currency || 'USD',
      tags: tags || [],
      categories: categories || [],
      difficulty: difficulty || 'mixed',
      requirements: requirements || {
        pitchDeck: true,
        sourceCode: true,
        demoVideo: true,
        documentation: true,
        teamPhoto: true,
        presentation: true,
        prototype: false
      },
      judgingCriteria: judgingCriteria || {
        innovation: 20,
        technical: 20,
        presentation: 20,
        impact: 20,
        creativity: 10,
        feasibility: 10
      },
      rules: rules || [],
      prizes: prizes || [],
      sponsors: sponsors || [],
      mentors: mentors || [],
      resources: resources || [],
      contactInfo: contactInfo || { email: '', phone: '', website: '', socialMedia: {} },
      submissionStages: submissionStages || [],
      volunteers: volunteers || [],
      organizerId: req.user?.id,
      status,
      participants: 0,
      teams: 0
    });

    await hackathon.save();

    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      data: hackathon
    });
  } catch (error: any) {
    console.error('Error creating hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hackathon',
      error: error.message
    });
  }
};

// Get all hackathons
export const getAllHackathons = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      organizerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (organizerId) {
      query.organizerId = organizerId;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const hackathons = await Hackathon.find(query)
      .populate('organizerId', 'firstName lastName email')
      .sort(sortOptions)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Hackathon.countDocuments(query);

    res.json({
      success: true,
      data: {
        hackathons,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hackathons',
      error: error.message
    });
  }
};

// Get hackathon by ID
export const getHackathonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id)
      .populate('organizerId', 'firstName lastName email')
      .exec();

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.json({
      success: true,
      data: hackathon
    });
  } catch (error: any) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hackathon',
      error: error.message
    });
  }
};

// Update hackathon
export const updateHackathon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.organizerId;
    delete updateData.participants;
    delete updateData.teams;
    delete updateData.createdAt;

    // Validate judging criteria if provided
    if (updateData.judgingCriteria) {
      const total = Object.values(updateData.judgingCriteria).reduce((sum: number, val: any) => sum + val, 0);
      if (total !== 100) {
        return res.status(400).json({
          success: false,
          message: 'Judging criteria must total exactly 100%'
        });
      }
    }

    const hackathon = await Hackathon.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('organizerId', 'firstName lastName email');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.json({
      success: true,
      message: 'Hackathon updated successfully',
      data: hackathon
    });
  } catch (error: any) {
    console.error('Error updating hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hackathon',
      error: error.message
    });
  }
};

// Delete hackathon
export const deleteHackathon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findByIdAndDelete(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hackathon',
      error: error.message
    });
  }
};

// Publish hackathon
export const publishHackathon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findByIdAndUpdate(
      id,
      { status: 'published', updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('organizerId', 'firstName lastName email');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.json({
      success: true,
      message: 'Hackathon published successfully',
      data: hackathon
    });
  } catch (error: any) {
    console.error('Error publishing hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish hackathon',
      error: error.message
    });
  }
};

// Get hackathons by organizer
export const getHackathonsByOrganizer = async (req: Request, res: Response) => {
  try {
    const { organizerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = { organizerId };

    if (status) {
      query.status = status;
    }

    const hackathons = await Hackathon.find(query)
      .populate('organizerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Hackathon.countDocuments(query);

    res.json({
      success: true,
      data: {
        hackathons,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching organizer hackathons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizer hackathons',
      error: error.message
    });
  }
};

// Get hackathon statistics
export const getHackathonStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const stats = {
      totalHackathons: await Hackathon.countDocuments({ organizerId: hackathon.organizerId }),
      activeHackathons: await Hackathon.countDocuments({ 
        organizerId: hackathon.organizerId, 
        status: 'active' 
      }),
      totalParticipants: hackathon.participants,
      totalTeams: hackathon.teams,
      averageScore: 0, // This would be calculated from actual submissions
      completionRate: 0 // This would be calculated from actual submissions
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Error fetching hackathon stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hackathon statistics',
      error: error.message
    });
  }
};
