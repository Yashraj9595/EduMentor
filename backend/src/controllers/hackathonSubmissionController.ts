import { Request, Response } from 'express';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';

// Submit project for hackathon
export const submitProject = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const {
      projectTitle,
      projectDescription,
      problemStatement,
      solution,
      technologies,
      features,
      challenges,
      learnings,
      futurePlans,
      demoUrl,
      repositoryUrl,
      presentationUrl,
      files,
      teamMembers,
      acknowledgments,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!projectTitle || !projectDescription || !problemStatement || !solution) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: projectTitle, projectDescription, problemStatement, solution'
      });
    }

    // Check if hackathon exists and is accepting submissions
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    if (hackathon.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Hackathon is not currently accepting submissions'
      });
    }

    // Check if submission is within the allowed period
    const now = new Date();
    if (hackathon.submissionDeadline && now > new Date(hackathon.submissionDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed'
      });
    }

    // Check if user is registered for this hackathon
    const registration = hackathon.registrations.find(
      (reg: any) => reg.teamLead.toString() === req.user?.id
    );

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'You must be registered for this hackathon to submit a project'
      });
    }

    // Check if user has already submitted
    const existingSubmission = hackathon.submissions.find(
      (sub: any) => sub.teamLead.toString() === req.user?.id
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a project for this hackathon'
      });
    }

    // Create submission
    const submission = {
      teamLead: req.user?.id,
      projectTitle,
      projectDescription,
      problemStatement,
      solution,
      technologies: technologies || [],
      features: features || [],
      challenges: challenges || [],
      learnings: learnings || [],
      futurePlans,
      demoUrl,
      repositoryUrl,
      presentationUrl,
      files: files || [],
      teamMembers: teamMembers || [],
      acknowledgments,
      additionalNotes,
      submittedAt: new Date(),
      status: 'submitted',
      scores: {
        innovation: 0,
        technical: 0,
        presentation: 0,
        impact: 0,
        creativity: 0,
        feasibility: 0,
        total: 0
      },
      reviews: []
    };

    // Add submission to hackathon
    await Hackathon.findByIdAndUpdate(hackathonId, {
      $push: { submissions: submission }
    });

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: submission
    });
  } catch (error: any) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit project',
      error: error.message
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    const query: any = {
      'submissions.teamLead': userId
    };

    if (status) {
      query['submissions.status'] = status;
    }

    const hackathons = await Hackathon.find(query)
      .populate('organizerId', 'firstName lastName email')
      .select('title description startDate endDate location status submissions')
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
    console.error('Error fetching user submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

// Update submission
export const updateSubmission = async (req: Request, res: Response) => {
  try {
    const { hackathonId, submissionId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.teamLead;
    delete updateData.submittedAt;
    delete updateData.status;
    delete updateData.scores;
    delete updateData.reviews;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Find the submission
    const submission = hackathon.submissions.find(
      (sub: any) => sub._id.toString() === submissionId && sub.teamLead.toString() === req.user?.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission can still be updated
    if (submission.status === 'judged') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update submission after judging has started'
      });
    }

    // Update submission
    Object.assign(submission, updateData, { updatedAt: new Date() });

    await hackathon.save();

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission
    });
  } catch (error: any) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission',
      error: error.message
    });
  }
};

// Delete submission
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const { hackathonId, submissionId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Find the submission
    const submission = hackathon.submissions.find(
      (sub: any) => sub._id.toString() === submissionId && sub.teamLead.toString() === req.user?.id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission can be deleted
    if (submission.status === 'judged') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete submission after judging has started'
      });
    }

    // Remove submission
    hackathon.submissions = hackathon.submissions.filter(
      (sub: any) => sub._id.toString() !== submissionId
    );

    await hackathon.save();

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission',
      error: error.message
    });
  }
};

// Get hackathon submissions
export const getHackathonSubmissions = async (req: Request, res: Response) => {
  try {
    const { hackathonId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const hackathon = await Hackathon.findById(hackathonId)
      .populate('submissions.teamLead', 'firstName lastName email')
      .select('title submissions participants teams');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    let submissions = hackathon.submissions;

    // Filter by status if provided
    if (status) {
      submissions = submissions.filter((sub: any) => sub.status === status);
    }

    // Paginate results
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);
    const paginatedSubmissions = submissions.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        hackathon: {
          title: hackathon.title,
          participants: hackathon.participants,
          teams: hackathon.teams
        },
        submissions: paginatedSubmissions,
        pagination: {
          current: Number(page),
          pages: Math.ceil(submissions.length / Number(limit)),
          total: submissions.length
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching hackathon submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

// Get submission details
export const getSubmissionDetails = async (req: Request, res: Response) => {
  try {
    const { hackathonId, submissionId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId)
      .populate('submissions.teamLead', 'firstName lastName email')
      .select('title submissions');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const submission = hackathon.submissions.find(
      (sub: any) => sub._id.toString() === submissionId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        hackathon: {
          title: hackathon.title
        },
        submission
      }
    });
  } catch (error: any) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission details',
      error: error.message
    });
  }
};
