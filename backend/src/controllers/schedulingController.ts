import { Request, Response } from 'express';
import { Meeting, Availability, Reminder } from '../models/Scheduling';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { IAuthRequest } from '../types';

export class SchedulingController {
  /**
   * Set user availability
   */
  static async setAvailability(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { days, timezone } = req.body;

      // Create or update availability
      const availability = await Availability.findOneAndUpdate(
        { userId },
        { userId, days, timezone },
        { new: true, upsert: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Availability saved successfully',
        data: availability
      });
    } catch (error) {
      console.error('Set availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save availability'
      });
    }
  }

  /**
   * Get user availability
   */
  static async getAvailability(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const availability = await Availability.findOne({ userId });

      res.json({
        success: true,
        message: 'Availability retrieved successfully',
        data: availability || { days: [], timezone: 'UTC' }
      });
    } catch (error) {
      console.error('Get availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve availability'
      });
    }
  }

  /**
   * Get mentor availability (public)
   */
  static async getMentorAvailability(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { mentorId } = req.params;

      const availability = await Availability.findOne({ userId: mentorId });

      res.json({
        success: true,
        message: 'Mentor availability retrieved successfully',
        data: availability || { days: [], timezone: 'UTC' }
      });
    } catch (error) {
      console.error('Get mentor availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve mentor availability'
      });
    }
  }

  /**
   * Schedule a meeting
   */
  static async scheduleMeeting(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { mentorId, studentId, title, description, startTime, endTime, meetingType, location, meetingLink } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Determine who is scheduling the meeting
      let mentor, student;
      
      // If mentorId is provided and matches the authenticated user, user is a mentor
      if (mentorId && mentorId === userId) {
        mentor = await User.findById(mentorId);
        student = await User.findById(studentId);
      } 
      // If studentId is provided and matches the authenticated user, user is a student
      else if (studentId && studentId === userId) {
        student = await User.findById(studentId);
        mentor = await User.findById(mentorId);
      } 
      // If neither matches, authenticated user is scheduling for someone else (admin)
      else {
        const currentUser = await User.findById(userId);
        if (currentUser?.role !== 'admin') {
          res.status(403).json({
            success: false,
            message: 'You can only schedule meetings for yourself or your students'
          });
          return;
        }
        mentor = await User.findById(mentorId);
        student = await User.findById(studentId);
      }

      // Validate users
      if (!mentor || !student) {
        res.status(400).json({
          success: false,
          message: 'Mentor and student must be valid users'
        });
        return;
      }

      // Validate that mentor is actually a mentor and student is actually a student
      if (mentor.role !== 'mentor') {
        res.status(400).json({
          success: false,
          message: 'User is not a mentor'
        });
        return;
      }

      if (student.role !== 'student') {
        res.status(400).json({
          success: false,
          message: 'User is not a student'
        });
        return;
      }

      // Validate time
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
        return;
      }

      if (start >= end) {
        res.status(400).json({
          success: false,
          message: 'End time must be after start time'
        });
        return;
      }

      // Check for conflicts
      const conflictingMeetings = await Meeting.find({
        $or: [
          { mentor: mentorId, startTime: { $lt: end }, endTime: { $gt: start } },
          { student: studentId, startTime: { $lt: end }, endTime: { $gt: start } }
        ],
        status: { $in: ['scheduled', 'confirmed'] }
      });

      if (conflictingMeetings.length > 0) {
        res.status(400).json({
          success: false,
          message: 'This time slot conflicts with an existing meeting'
        });
        return;
      }

      // Create meeting
      const meeting = new Meeting({
        title,
        description,
        mentor: mentorId,
        student: studentId,
        startTime: start,
        endTime: end,
        meetingType,
        location,
        meetingLink,
        status: 'scheduled'
      });

      await meeting.save();

      // Populate related information
      await meeting.populate('mentor', 'firstName lastName email');
      await meeting.populate('student', 'firstName lastName email');

      // Create notifications
      const mentorNotification = new Notification({
        title: 'New Meeting Scheduled',
        message: `A new meeting has been scheduled with ${student.firstName} ${student.lastName}`,
        userId: mentorId,
        type: 'meeting',
        priority: 'medium',
        relatedMeetingId: meeting._id,
        relatedEntityType: 'meeting'
      });

      const studentNotification = new Notification({
        title: 'New Meeting Scheduled',
        message: `A new meeting has been scheduled with ${mentor.firstName} ${mentor.lastName}`,
        userId: studentId,
        type: 'meeting',
        priority: 'medium',
        relatedMeetingId: meeting._id,
        relatedEntityType: 'meeting'
      });

      await Promise.all([
        mentorNotification.save(),
        studentNotification.save()
      ]);

      // Create reminders (24 hours before and 1 hour before)
      const reminder24h = new Reminder({
        meeting: meeting._id,
        recipient: mentorId,
        reminderTime: new Date(start.getTime() - 24 * 60 * 60 * 1000), // 24 hours before
        method: 'email'
      });

      const reminder1h = new Reminder({
        meeting: meeting._id,
        recipient: studentId,
        reminderTime: new Date(start.getTime() - 60 * 60 * 1000), // 1 hour before
        method: 'notification'
      });

      await Promise.all([
        reminder24h.save(),
        reminder1h.save()
      ]);

      res.status(201).json({
        success: true,
        message: 'Meeting scheduled successfully',
        data: meeting
      });
    } catch (error) {
      console.error('Schedule meeting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to schedule meeting'
      });
    }
  }

  /**
   * Get meetings for the current user
   */
  static async getMyMeetings(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { status, limit = 20 } = req.query;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Build filter
      const filter: any = {
        $or: [
          { mentor: userId },
          { student: userId }
        ]
      };

      if (status && status !== 'all') {
        filter.status = status;
      }

      const meetings = await Meeting.find(filter)
        .populate('mentor', 'firstName lastName email')
        .populate('student', 'firstName lastName email')
        .sort({ startTime: 1 })
        .limit(Number(limit));

      res.json({
        success: true,
        message: 'Meetings retrieved successfully',
        data: meetings
      });
    } catch (error) {
      console.error('Get meetings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve meetings'
      });
    }
  }

  /**
   * Get meeting by ID
   */
  static async getMeetingById(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const meeting = await Meeting.findById(id)
        .populate('mentor', 'firstName lastName email')
        .populate('student', 'firstName lastName email');

      if (!meeting) {
        res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
        return;
      }

      // Check if user has permission to view this meeting
      if (meeting.mentor._id.toString() !== userId && meeting.student._id.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to view this meeting'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Meeting retrieved successfully',
        data: meeting
      });
    } catch (error) {
      console.error('Get meeting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve meeting'
      });
    }
  }

  /**
   * Update meeting
   */
  static async updateMeeting(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;
      const { title, description, startTime, endTime, meetingType, location, meetingLink, status } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const meeting = await Meeting.findById(id);

      if (!meeting) {
        res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
        return;
      }

      // Check if user has permission to update this meeting
      if (meeting.mentor._id.toString() !== userId && meeting.student._id.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to update this meeting'
        });
        return;
      }

      // Update fields if provided
      if (title !== undefined) meeting.title = title;
      if (description !== undefined) meeting.description = description;
      if (startTime !== undefined) meeting.startTime = new Date(startTime);
      if (endTime !== undefined) meeting.endTime = new Date(endTime);
      if (meetingType !== undefined) meeting.meetingType = meetingType;
      if (location !== undefined) meeting.location = location;
      if (meetingLink !== undefined) meeting.meetingLink = meetingLink;
      if (status !== undefined) meeting.status = status;

      await meeting.save();

      // Populate related information
      await meeting.populate('mentor', 'firstName lastName email');
      await meeting.populate('student', 'firstName lastName email');

      res.json({
        success: true,
        message: 'Meeting updated successfully',
        data: meeting
      });
    } catch (error) {
      console.error('Update meeting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update meeting'
      });
    }
  }

  /**
   * Cancel meeting
   */
  static async cancelMeeting(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const meeting = await Meeting.findById(id);

      if (!meeting) {
        res.status(404).json({
          success: false,
          message: 'Meeting not found'
        });
        return;
      }

      // Check if user has permission to cancel this meeting
      if (meeting.mentor.toString() !== userId && meeting.student.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to cancel this meeting'
        });
        return;
      }

      meeting.status = 'cancelled';
      await meeting.save();

      // Populate related information
      await meeting.populate('mentor', 'firstName lastName email');
      await meeting.populate('student', 'firstName lastName email');

      // Create notifications
      const mentorNotification = new Notification({
        title: 'Meeting Cancelled',
        message: `Your meeting with ${(meeting.student as any).firstName} ${(meeting.student as any).lastName} has been cancelled`,
        userId: meeting.mentor,
        type: 'meeting',
        priority: 'medium',
        relatedMeetingId: meeting._id,
        relatedEntityType: 'meeting'
      });

      const studentNotification = new Notification({
        title: 'Meeting Cancelled',
        message: `Your meeting with ${(meeting.mentor as any).firstName} ${(meeting.mentor as any).lastName} has been cancelled`,
        userId: meeting.student,
        type: 'meeting',
        priority: 'medium',
        relatedMeetingId: meeting._id,
        relatedEntityType: 'meeting'
      });

      await Promise.all([
        mentorNotification.save(),
        studentNotification.save()
      ]);

      res.json({
        success: true,
        message: 'Meeting cancelled successfully',
        data: meeting
      });
    } catch (error) {
      console.error('Cancel meeting error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel meeting'
      });
    }
  }

  /**
   * Get available time slots for a mentor
   */
  static async getAvailableTimeSlots(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { mentorId, date } = req.query;

      if (!mentorId || !date) {
        res.status(400).json({
          success: false,
          message: 'Mentor ID and date are required'
        });
        return;
      }

      // Get mentor availability
      const availability = await Availability.findOne({ userId: mentorId });

      if (!availability) {
        res.status(404).json({
          success: false,
          message: 'Mentor availability not found'
        });
        return;
      }

      // Get the day of the week for the requested date
      const requestedDate = new Date(date as string);
      const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // Find availability for that day
      const dayAvailability = availability.days.find(day => day.day === dayOfWeek);

      if (!dayAvailability || !dayAvailability.isAvailable) {
        res.json({
          success: true,
          message: 'No available time slots for this day',
          data: []
        });
        return;
      }

      // Get existing meetings for that day to exclude booked slots
      const startOfDay = new Date(requestedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(requestedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingMeetings = await Meeting.find({
        mentor: mentorId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['scheduled', 'confirmed'] }
      });

      // Filter out booked time slots
      const availableSlots = dayAvailability.timeSlots
        .filter(slot => !slot.isBooked)
        .map(slot => {
          // Check if this slot conflicts with any existing meetings
          const isBooked = existingMeetings.some(meeting => {
            const slotStart = new Date(`${date}T${slot.startTime}`);
            const slotEnd = new Date(`${date}T${slot.endTime}`);
            
            return (
              (slotStart >= meeting.startTime && slotStart < meeting.endTime) ||
              (slotEnd > meeting.startTime && slotEnd <= meeting.endTime) ||
              (slotStart <= meeting.startTime && slotEnd >= meeting.endTime)
            );
          });

          return {
            ...slot,
            isBooked
          };
        })
        .filter(slot => !slot.isBooked);

      res.json({
        success: true,
        message: 'Available time slots retrieved successfully',
        data: availableSlots
      });
    } catch (error) {
      console.error('Get available time slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available time slots'
      });
    }
  }
}