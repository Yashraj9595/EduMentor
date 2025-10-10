import { Response } from 'express';
import { IAuthRequest } from '../types';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';

// Register for a hackathon
export const registerForHackathon = async (req: IAuthRequest, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const {
      teamName,
      teamDescription,
      members,
      projectIdea,
      technologies,
      experience,
      motivation,
      previousHackathons,
      availability,
      specialRequirements,
      emergencyContact
    } = req.body;

    // Validate required fields
    if (!teamName || !teamDescription || !members || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: teamName, teamDescription, members'
      });
    }

    // Check if hackathon exists and is open for registration
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    if (hackathon.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Hackathon is not open for registration'
      });
    }

    // Check if registration is within the allowed period
    const now = new Date();
    if (hackathon.registrationStart && now < new Date(hackathon.registrationStart)) {
      return res.status(400).json({
        success: false,
        message: 'Registration has not started yet'
      });
    }

    if (hackathon.registrationEnd && now > new Date(hackathon.registrationEnd)) {
      return res.status(400).json({
        success: false,
        message: 'Registration has ended'
      });
    }

    // Check team size constraints
    if (members.length < hackathon.minTeamSize || members.length > hackathon.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Team size must be between ${hackathon.minTeamSize} and ${hackathon.maxTeamSize} members`
      });
    }

    // Check if user is already registered
    const existingRegistration = await Hackathon.findOne({
      _id: hackathonId,
      'registrations.teamLead': req.user?._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this hackathon'
      });
    }

    // Create registration
    const registration = {
      teamLead: req.user?._id,
      teamName,
      teamDescription,
      members: members.map((member: any) => ({
        name: member.name,
        email: member.email,
        role: member.role,
        skills: member.skills || [],
        phone: member.phone,
        university: member.university,
        year: member.year
      })),
      projectIdea,
      technologies: technologies || [],
      experience: experience || 'beginner',
      motivation,
      previousHackathons,
      availability,
      specialRequirements,
      emergencyContact,
      registeredAt: new Date(),
      status: 'registered'
    };

    // Add registration to hackathon
    await Hackathon.findByIdAndUpdate(hackathonId, {
      $push: { registrations: registration },
      $inc: { participants: members.length, teams: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for hackathon',
      data: registration
    });
  } catch (error: any) {
    console.error('Error registering for hackathon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for hackathon',
      error: error.message
    });
  }
};

// Get hackathon registrations for a user
export const getUserRegistrations = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = {
      'registrations.teamLead': userId
    };

    if (status) {
      query['registrations.status'] = status;
    }

    const hackathons = await Hackathon.find(query)
      .populate('organizerId', 'firstName lastName email')
      .select('title description startDate endDate location status registrations')
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
    console.error('Error fetching user registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

// Cancel hackathon registration
export const cancelRegistration = async (req: IAuthRequest, res: Response) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Find and remove the registration
    const registration = hackathon.registrations.find(
      (reg: any) => reg.teamLead.toString() === req.user?._id
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if cancellation is allowed (e.g., before hackathon starts)
    const now = new Date();
    if (now >= new Date(hackathon.startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after hackathon has started'
      });
    }

    // Remove registration and update counts
    await Hackathon.findByIdAndUpdate(hackathonId, {
      $pull: { registrations: { teamLead: req.user?._id } },
      $inc: { participants: -registration.members.length, teams: -1 }
    });

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error: any) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message
    });
  }
};

// Get hackathon participants
export const getHackathonParticipants = async (req: IAuthRequest, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const hackathon = await Hackathon.findById(hackathonId)
      .populate('registrations.teamLead', 'firstName lastName email')
      .select('title registrations participants teams');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const registrations = hackathon.registrations
      .slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    res.json({
      success: true,
      data: {
        hackathon: {
          title: hackathon.title,
          participants: hackathon.participants,
          teams: hackathon.teams
        },
        registrations,
        pagination: {
          current: Number(page),
          pages: Math.ceil(hackathon.registrations.length / Number(limit)),
          total: hackathon.registrations.length
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching hackathon participants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
};
