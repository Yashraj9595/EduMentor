import { Request, Response } from 'express';
import { MentorAnalytics } from '../models/MentorAnalytics';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { IAuthRequest } from '../types';

export class MentorAnalyticsController {
  /**
   * Get mentor analytics dashboard data
   */
  static async getMentorAnalytics(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Get current period (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Get projects mentored by this mentor
      const projects = await Project.find({ 
        mentorId: mentorId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate('studentId', 'firstName lastName email');

      // Calculate metrics
      const totalStudents = new Set(projects.map(p => p.studentId.toString())).size;
      const activeStudents = projects.filter(p => p.status !== 'completed').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      
      // Calculate average progress
      let totalProgress = 0;
      let projectCount = 0;
      projects.forEach(project => {
        if (project.metrics && typeof project.metrics.progress === 'number') {
          totalProgress += project.metrics.progress;
          projectCount++;
        }
      });
      const averageProgress = projectCount > 0 ? totalProgress / projectCount : 0;

      // Get project scores (assuming metrics.rating exists)
      let totalScore = 0;
      let scoredProjects = 0;
      projects.forEach(project => {
        if (project.metrics && typeof project.metrics.rating === 'number') {
          totalScore += project.metrics.rating;
          scoredProjects++;
        }
      });
      const avgProjectScore = scoredProjects > 0 ? totalScore / scoredProjects : 0;

      // Prepare response data
      const analyticsData = {
        period: {
          startDate,
          endDate
        },
        studentMetrics: {
          totalStudents,
          activeStudents,
          completedProjects,
          averageProgress: Math.round(averageProgress),
          studentSatisfaction: 0 // Would be calculated from feedback
        },
        mentoringActivity: {
          totalSessions: projects.length,
          totalHours: projects.length * 1.5, // Assuming 1.5 hours per session
          avgSessionDuration: 1.5,
          feedbackProvided: projects.filter(p => p.mentorFeedback).length
        },
        projectMetrics: {
          projectsMentored: projects.length,
          onTimeCompletion: 0, // Would calculate based on deadlines
          avgProjectScore: Math.round(avgProjectScore * 10) / 10,
          innovationScore: 0 // Would be calculated from project reviews
        },
        recentProjects: projects.slice(0, 5).map(project => ({
          id: project._id,
          title: project.title,
          student: project.studentId ? `${project.studentId.firstName} ${project.studentId.lastName}` : 'Unknown',
          progress: project.metrics?.progress || 0,
          status: project.status
        })),
        skillDevelopment: {
          technicalSkills: {},
          softSkills: {}
        }
      };

      res.json({
        success: true,
        message: 'Mentor analytics retrieved successfully',
        data: analyticsData
      });
    } catch (error) {
      console.error('Get mentor analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve mentor analytics'
      });
    }
  }

  /**
   * Get detailed student progress data
   */
  static async getStudentProgress(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Get projects with populated student data
      const projects = await Project.find({ mentorId })
        .populate('studentId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      // Transform data for progress visualization
      const studentProgressData = projects.map(project => ({
        studentId: project.studentId?._id || 'unknown',
        studentName: project.studentId ? `${project.studentId.firstName} ${project.studentId.lastName}` : 'Unknown',
        projectId: project._id,
        projectTitle: project.title,
        progress: project.metrics?.progress || 0,
        status: project.status,
        lastUpdated: project.updatedAt,
        milestonesCompleted: project.milestones ? project.milestones.filter(m => m.status === 'completed').length : 0,
        totalMilestones: project.milestones ? project.milestones.length : 0
      }));

      res.json({
        success: true,
        message: 'Student progress data retrieved successfully',
        data: studentProgressData
      });
    } catch (error) {
      console.error('Get student progress error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve student progress data'
      });
    }
  }

  /**
   * Get mentoring effectiveness metrics
   */
  static async getMentoringEffectiveness(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const mentorId = req.user?._id;
      
      if (!mentorId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // This would integrate with a feedback system
      const effectivenessData = {
        feedbackScore: 0, // Average of student feedback
        improvementRate: 0, // Measured progress improvement
        retentionRate: 0, // Percentage of students who continue projects
        skillTransfer: {
          technical: 0, // How well students learn technical skills
          soft: 0 // How well students develop soft skills
        }
      };

      res.json({
        success: true,
        message: 'Mentoring effectiveness data retrieved successfully',
        data: effectivenessData
      });
    } catch (error) {
      console.error('Get mentoring effectiveness error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve mentoring effectiveness data'
      });
    }
  }
}