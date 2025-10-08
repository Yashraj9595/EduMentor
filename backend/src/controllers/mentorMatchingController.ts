import { Request, Response } from 'express';
import { MentorPreference, StudentPreference, MentorMatch } from '../models/MentorMatching';
import { User } from '../models/User';
import { IAuthRequest } from '../types';

export class MentorMatchingController {
  /**
   * Set mentor preferences
   */
  static async setMentorPreferences(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const {
        preferredSkills,
        preferredCategories,
        maxStudents,
        availability,
        experienceLevel,
        mentoringStyle,
        languages,
        isActive
      } = req.body;

      // Validate that the user is a mentor
      const user = await User.findById(mentorId);
      if (!user || user.role !== 'mentor') {
        res.status(403).json({
          success: false,
          message: 'Only mentors can set preferences'
        });
        return;
      }

      // Create or update mentor preferences
      const preferences = await MentorPreference.findOneAndUpdate(
        { mentorId },
        {
          mentorId,
          preferredSkills: preferredSkills || [],
          preferredCategories: preferredCategories || [],
          maxStudents: maxStudents || 5,
          availability: availability || { days: [], timeSlots: [] },
          experienceLevel: experienceLevel || 'intermediate',
          mentoringStyle: mentoringStyle || 'mixed',
          languages: languages || [],
          isActive: isActive !== undefined ? isActive : true
        },
        { new: true, upsert: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Mentor preferences saved successfully',
        data: preferences
      });
    } catch (error) {
      console.error('Set mentor preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save mentor preferences'
      });
    }
  }

  /**
   * Get mentor preferences
   */
  static async getMentorPreferences(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const preferences = await MentorPreference.findOne({ mentorId });

      res.json({
        success: true,
        message: 'Mentor preferences retrieved successfully',
        data: preferences || {}
      });
    } catch (error) {
      console.error('Get mentor preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve mentor preferences'
      });
    }
  }

  /**
   * Set student preferences
   */
  static async setStudentPreferences(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?._id;
      
      if (!studentId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const {
        interestedSkills,
        preferredCategories,
        preferredMentorExperience,
        preferredMentoringStyle,
        availability,
        languages,
        projectInterests
      } = req.body;

      // Validate that the user is a student
      const user = await User.findById(studentId);
      if (!user || user.role !== 'student') {
        res.status(403).json({
          success: false,
          message: 'Only students can set preferences'
        });
        return;
      }

      // Create or update student preferences
      const preferences = await StudentPreference.findOneAndUpdate(
        { studentId },
        {
          studentId,
          interestedSkills: interestedSkills || [],
          preferredCategories: preferredCategories || [],
          preferredMentorExperience: preferredMentorExperience || 'no-preference',
          preferredMentoringStyle: preferredMentoringStyle || 'no-preference',
          availability: availability || { days: [], timeSlots: [] },
          languages: languages || [],
          projectInterests: projectInterests || []
        },
        { new: true, upsert: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Student preferences saved successfully',
        data: preferences
      });
    } catch (error) {
      console.error('Set student preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save student preferences'
      });
    }
  }

  /**
   * Get student preferences
   */
  static async getStudentPreferences(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?._id;
      
      if (!studentId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const preferences = await StudentPreference.findOne({ studentId });

      res.json({
        success: true,
        message: 'Student preferences retrieved successfully',
        data: preferences || {}
      });
    } catch (error) {
      console.error('Get student preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve student preferences'
      });
    }
  }

  /**
   * Find matching mentors for a student
   */
  static async findMatchingMentors(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?._id;
      
      if (!studentId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Get student preferences
      const studentPreferences = await StudentPreference.findOne({ studentId });
      if (!studentPreferences) {
        res.status(400).json({
          success: false,
          message: 'Please set your preferences first'
        });
        return;
      }

      // Get all active mentor preferences
      const mentorPreferences = await MentorPreference.find({ isActive: true })
        .populate('mentorId', 'firstName lastName email bio skills');

      // Calculate match scores for each mentor
      const matches = await Promise.all(
        mentorPreferences.map(async (mentorPref) => {
          const matchScore = MentorMatchingController.calculateMatchScore(
            studentPreferences,
            mentorPref
          );
          
          return {
            mentor: mentorPref.mentorId,
            matchScore,
            matchingCriteria: matchScore.details
          };
        })
      );

      // Sort by match score (descending)
      const sortedMatches = matches.sort((a, b) => b.matchScore.score - a.matchScore.score);

      // Get top 10 matches
      const topMatches = sortedMatches.slice(0, 10);

      res.json({
        success: true,
        message: 'Matching mentors found',
        data: topMatches
      });
    } catch (error) {
      console.error('Find matching mentors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to find matching mentors'
      });
    }
  }

  /**
   * Calculate match score between student and mentor
   */
  private static calculateMatchScore(
    studentPref: any,
    mentorPref: any
  ): { score: number; details: any } {
    let totalScore = 0;
    const maxScore = 600; // 6 criteria * 100 each
    const details: any = {};

    // 1. Skill Match (100 points)
    if (studentPref.interestedSkills && mentorPref.preferredSkills) {
      const commonSkills = studentPref.interestedSkills.filter((skill: string) =>
        mentorPref.preferredSkills.includes(skill)
      );
      details.skillMatch = Math.min(100, (commonSkills.length / Math.max(1, studentPref.interestedSkills.length)) * 100);
      totalScore += details.skillMatch;
    } else {
      details.skillMatch = 0;
    }

    // 2. Category Match (100 points)
    if (studentPref.preferredCategories && mentorPref.preferredCategories) {
      const commonCategories = studentPref.preferredCategories.filter((category: string) =>
        mentorPref.preferredCategories.includes(category)
      );
      details.categoryMatch = Math.min(100, (commonCategories.length / Math.max(1, studentPref.preferredCategories.length)) * 100);
      totalScore += details.categoryMatch;
    } else {
      details.categoryMatch = 0;
    }

    // 3. Experience Match (100 points)
    if (studentPref.preferredMentorExperience !== 'no-preference' && mentorPref.experienceLevel) {
      const experienceMatch = studentPref.preferredMentorExperience === mentorPref.experienceLevel ? 100 : 30;
      details.experienceMatch = experienceMatch;
      totalScore += experienceMatch;
    } else {
      details.experienceMatch = 50; // Neutral score if no preference
      totalScore += 50;
    }

    // 4. Mentoring Style Match (100 points)
    if (studentPref.preferredMentoringStyle !== 'no-preference' && mentorPref.mentoringStyle) {
      const styleMatch = studentPref.preferredMentoringStyle === mentorPref.mentoringStyle ? 100 : 30;
      details.styleMatch = styleMatch;
      totalScore += styleMatch;
    } else {
      details.styleMatch = 50; // Neutral score if no preference
      totalScore += 50;
    }

    // 5. Language Match (100 points)
    if (studentPref.languages && mentorPref.languages) {
      const commonLanguages = studentPref.languages.filter((lang: string) =>
        mentorPref.languages.includes(lang)
      );
      details.languageMatch = Math.min(100, (commonLanguages.length / Math.max(1, studentPref.languages.length)) * 100);
      totalScore += details.languageMatch;
    } else {
      details.languageMatch = 0;
    }

    // 6. Availability Match (100 points)
    // Simplified availability matching - in a real implementation, this would be more complex
    if (studentPref.availability?.days && mentorPref.availability?.days) {
      const commonDays = studentPref.availability.days.filter((day: string) =>
        mentorPref.availability.days.includes(day)
      );
      details.availabilityMatch = Math.min(100, (commonDays.length / Math.max(1, studentPref.availability.days.length)) * 100);
      totalScore += details.availabilityMatch;
    } else {
      details.availabilityMatch = 50; // Neutral score if no availability data
      totalScore += 50;
    }

    const finalScore = Math.round((totalScore / maxScore) * 100);

    return {
      score: finalScore,
      details
    };
  }

  /**
   * Request a mentor match
   */
  static async requestMentorMatch(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user?._id;
      const { mentorId } = req.body;
      
      if (!studentId || !mentorId) {
        res.status(400).json({
          success: false,
          message: 'Student ID and Mentor ID are required'
        });
        return;
      }

      // Check if a match request already exists
      const existingMatch = await MentorMatch.findOne({
        studentId,
        mentorId,
        status: { $in: ['pending', 'accepted'] }
      });

      if (existingMatch) {
        res.status(400).json({
          success: false,
          message: 'A match request already exists with this mentor'
        });
        return;
      }

      // Create match request
      const match = new MentorMatch({
        studentId,
        mentorId,
        matchScore: 0, // Will be calculated by the system
        status: 'pending',
        requestedBy: 'student'
      });

      await match.save();

      res.json({
        success: true,
        message: 'Mentor match request sent successfully',
        data: match
      });
    } catch (error) {
      console.error('Request mentor match error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send mentor match request'
      });
    }
  }

  /**
   * Get match requests for a mentor
   */
  static async getMentorMatchRequests(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const matchRequests = await MentorMatch.find({ mentorId, status: 'pending' })
        .populate('studentId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Match requests retrieved successfully',
        data: matchRequests
      });
    } catch (error) {
      console.error('Get mentor match requests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve match requests'
      });
    }
  }

  /**
   * Accept a match request
   */
  static async acceptMatchRequest(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      const { matchId } = req.params;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const match = await MentorMatch.findById(matchId);
      
      if (!match) {
        res.status(404).json({
          success: false,
          message: 'Match request not found'
        });
        return;
      }

      if (match.mentorId.toString() !== mentorId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to accept this match request'
        });
        return;
      }

      if (match.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'This match request is no longer pending'
        });
        return;
      }

      match.status = 'accepted';
      await match.save();

      res.json({
        success: true,
        message: 'Match request accepted successfully',
        data: match
      });
    } catch (error) {
      console.error('Accept match request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept match request'
      });
    }
  }

  /**
   * Reject a match request
   */
  static async rejectMatchRequest(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      const { matchId } = req.params;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const match = await MentorMatch.findById(matchId);
      
      if (!match) {
        res.status(404).json({
          success: false,
          message: 'Match request not found'
        });
        return;
      }

      if (match.mentorId.toString() !== mentorId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to reject this match request'
        });
        return;
      }

      if (match.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'This match request is no longer pending'
        });
        return;
      }

      match.status = 'rejected';
      await match.save();

      res.json({
        success: true,
        message: 'Match request rejected successfully',
        data: match
      });
    } catch (error) {
      console.error('Reject match request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject match request'
      });
    }
  }
}