import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meetingType: 'in-person' | 'video' | 'phone';
  location?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface Availability {
  days: {
    day: string;
    isAvailable: boolean;
    timeSlots: {
      startTime: string;
      endTime: string;
      isBooked: boolean;
    }[];
  }[];
  timezone: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const SchedulingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availability, setAvailability] = useState<Availability>({
    days: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [loading, setLoading] = useState(true);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  const [scheduleForm, setScheduleForm] = useState({
    studentId: '',
    title: '',
    description: '',
    meetingType: 'video' as 'in-person' | 'video' | 'phone',
    location: '',
    meetingLink: ''
  });
  
  const [timeSlotForm, setTimeSlotForm] = useState({
    startTime: '09:00',
    endTime: '17:00'
  });

  // Initialize availability days
  useEffect(() => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    setAvailability(prev => ({
      ...prev,
      days: daysOfWeek.map(day => ({
        day,
        isAvailable: false,
        timeSlots: []
      }))
    }));
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchMeetings(),
        fetchAvailability()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await apiService.get<ApiResponse<Meeting[]>>('/api/v1/scheduling/meetings');
      if (response.data && response.data.success) {
        setMeetings(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await apiService.get<ApiResponse<Availability>>('/api/v1/scheduling/availability');
      if (response.data && response.data.success) {
        if (response.data.data) {
          setAvailability(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const fetchAvailableSlots = async (mentorId: string, date: string) => {
    try {
      // Build query string
      const queryParams = new URLSearchParams({
        mentorId,
        date
      });
      
      const response = await apiService.get<ApiResponse<TimeSlot[]>>(`/api/v1/scheduling/availability/slots?${queryParams.toString()}`);
      if (response.data && response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
    }
  };

  const handleScheduleMeeting = async () => {
    try {
      // Find the selected time slot
      const selectedSlot = availableSlots.find(slot => 
        slot.startTime === timeSlotForm.startTime && slot.endTime === timeSlotForm.endTime
      );

      if (!selectedSlot) {
        alert('Please select a valid time slot');
        return;
      }

      const meetingData = {
        ...scheduleForm,
        startTime: `${selectedDate}T${timeSlotForm.startTime}:00`,
        endTime: `${selectedDate}T${timeSlotForm.endTime}:00`
      };

      const response = await apiService.post<ApiResponse<Meeting>>('/api/v1/scheduling/meetings', meetingData);
      if (response.data && response.data.success) {
        alert('Meeting scheduled successfully!');
        setShowScheduleForm(false);
        setScheduleForm({
          studentId: '',
          title: '',
          description: '',
          meetingType: 'video',
          location: '',
          meetingLink: ''
        });
        fetchMeetings();
      }
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      alert('Failed to schedule meeting');
    }
  };

  const handleSaveAvailability = async () => {
    try {
      const response = await apiService.post<ApiResponse<Availability>>('/api/v1/scheduling/availability', availability);
      if (response.data && response.data.success) {
        alert('Availability saved successfully!');
        setShowAvailabilityForm(false);
        fetchAvailability();
      }
    } catch (err) {
      console.error('Error saving availability:', err);
      alert('Failed to save availability');
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) {
      return;
    }

    try {
      const response = await apiService.delete<ApiResponse<any>>(`/api/v1/scheduling/meetings/${meetingId}`);
      if (response.data && response.data.success) {
        alert('Meeting cancelled successfully!');
        fetchMeetings();
      }
    } catch (err) {
      console.error('Error cancelling meeting:', err);
      alert('Failed to cancel meeting');
    }
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setAvailability(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        isAvailable: !newDays[dayIndex].isAvailable
      };
      return { ...prev, days: newDays };
    });
  };

  const addTimeSlot = (dayIndex: number) => {
    setAvailability(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        timeSlots: [
          ...newDays[dayIndex].timeSlots,
          { startTime: '09:00', endTime: '10:00', isBooked: false }
        ]
      };
      return { ...prev, days: newDays };
    });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        timeSlots: newDays[dayIndex].timeSlots.filter((_, i) => i !== slotIndex)
      };
      return { ...prev, days: newDays };
    });
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: string, value: string) => {
    setAvailability(prev => {
      const newDays = [...prev.days];
      const newSlots = [...newDays[dayIndex].timeSlots];
      newSlots[slotIndex] = {
        ...newSlots[slotIndex],
        [field]: value
      };
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        timeSlots: newSlots
      };
      return { ...prev, days: newDays };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'in-person':
        return '📍';
      case 'phone':
        return '📞';
      default:
        return '📅';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Scheduling</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Schedule Meeting
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'meetings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Meetings
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'availability'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Availability
          </button>
        </nav>
      </div>

      {/* Schedule Meeting Tab */}
      {activeTab === 'schedule' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Schedule Meeting
            </button>
          </div>

          {showScheduleForm && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.studentId}
                    onChange={(e) => setScheduleForm({...scheduleForm, studentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={scheduleForm.meetingType}
                    onChange={(e) => setScheduleForm({...scheduleForm, meetingType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Video Call</option>
                    <option value="in-person">In Person</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {scheduleForm.meetingType === 'in-person' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.location}
                      onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                
                {scheduleForm.meetingType === 'video' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.meetingLink}
                      onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    // Fetch available slots for the selected date
                    // fetchAvailableSlots('mentor-id', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setTimeSlotForm({
                        startTime: slot.startTime,
                        endTime: slot.endTime
                      })}
                      className={`p-2 border rounded-md text-sm ${
                        timeSlotForm.startTime === slot.startTime && timeSlotForm.endTime === slot.endTime
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      disabled={slot.isBooked}
                    >
                      {slot.startTime} - {slot.endTime}
                      {slot.isBooked && <span className="block text-xs text-red-600">Booked</span>}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Meetings Tab */}
      {activeTab === 'meetings' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Meetings</h2>
          </div>
          
          {meetings.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getMeetingTypeIcon(meeting.meetingType)}</span>
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">With:</span> {meeting.student.firstName} {meeting.student.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(meeting.startTime).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {new Date(meeting.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(meeting.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    {meeting.meetingLink && (
                      <div>
                        <span className="font-medium">Link:</span> <a href={meeting.meetingLink} className="text-blue-600 hover:underline">{meeting.meetingLink}</a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    {meeting.status !== 'cancelled' && meeting.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelMeeting(meeting._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Availability Tab */}
      {activeTab === 'availability' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Availability</h2>
            <button
              onClick={() => setShowAvailabilityForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Availability
            </button>
          </div>
          
          {showAvailabilityForm ? (
            <div className="mt-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={availability.timezone}
                  onChange={(e) => setAvailability({...availability, timezone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                </select>
              </div>
              
              <div className="space-y-6">
                {availability.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 capitalize">{day.day}</h3>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-600">Available</span>
                        <button
                          onClick={() => toggleDayAvailability(dayIndex)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            day.isAvailable ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              day.isAvailable ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {day.isAvailable && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Time Slots</h4>
                          <button
                            onClick={() => addTimeSlot(dayIndex)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            + Add Slot
                          </button>
                        </div>
                        
                        {day.timeSlots.length === 0 ? (
                          <p className="text-sm text-gray-500">No time slots added yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {day.timeSlots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex items-center space-x-2">
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'startTime', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'endTime', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                                />
                                <button
                                  onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAvailabilityForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvailability}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Availability
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Timezone: </span>
                <span className="text-sm text-gray-900">{availability.timezone}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availability.days.map((day, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 capitalize">{day.day}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        day.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {day.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    {day.isAvailable && day.timeSlots.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {day.timeSlots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulingDashboard;