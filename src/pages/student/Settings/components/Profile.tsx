import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../contexts/ToastContext';
import { GraduationCap, MapPin, Calendar, Award, BookOpen, Users, TrendingUp } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    university: (user as any)?.university || '',
    major: (user as any)?.major || '',
    year: (user as any)?.year || '',
    gpa: (user as any)?.gpa || '',
    studentId: (user as any)?.studentId || '',
    graduationYear: (user as any)?.graduationYear || '',
    bio: (user as any)?.bio || '',
    skills: (user as any)?.skills || [],
    interests: (user as any)?.interests || [],
    linkedin: (user as any)?.linkedin || '',
    github: (user as any)?.github || '',
    portfolio: (user as any)?.portfolio || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Check if form is dirty (has changes)
  useEffect(() => {
    if (user) {
      const hasChanges = 
        formData.firstName !== user.firstName ||
        formData.lastName !== user.lastName ||
        formData.mobile !== user.mobile ||
        formData.university !== (user as any)?.university ||
        formData.major !== (user as any)?.major ||
        formData.year !== (user as any)?.year ||
        formData.gpa !== (user as any)?.gpa ||
        formData.studentId !== (user as any)?.studentId ||
        formData.graduationYear !== (user as any)?.graduationYear ||
        formData.bio !== (user as any)?.bio ||
        formData.linkedin !== (user as any)?.linkedin ||
        formData.github !== (user as any)?.github ||
        formData.portfolio !== (user as any)?.portfolio;
      setIsDirty(hasChanges);
    }
  }, [formData, user]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        break;
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        break;
      case 'mobile':
        if (value && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) 
          return 'Please enter a valid phone number';
        break;
      case 'university':
        if (value && value.length < 3) return 'University name must be at least 3 characters';
        break;
      case 'major':
        if (value && value.length < 2) return 'Major must be at least 2 characters';
        break;
      case 'gpa':
        if (value && (!/^\d*\.?\d+$/.test(value) || parseFloat(value) < 0 || parseFloat(value) > 4)) 
          return 'GPA must be between 0 and 4';
        break;
      case 'studentId':
        if (value && value.length < 3) return 'Student ID must be at least 3 characters';
        break;
      case 'graduationYear':
        if (value && (!/^\d{4}$/.test(value) || parseInt(value) < 2020 || parseInt(value) > 2030)) 
          return 'Graduation year must be between 2020 and 2030';
        break;
      case 'linkedin':
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) 
          return 'Please enter a valid LinkedIn profile URL';
        break;
      case 'github':
        if (value && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(value)) 
          return 'Please enter a valid GitHub profile URL';
        break;
      case 'portfolio':
        if (value && !/^https?:\/\/.+/.test(value)) 
          return 'Please enter a valid portfolio URL';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate field
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'email' && key !== 'skills' && key !== 'interests') { // Skip email and arrays
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the user context with new data
      if (user) {
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobile: formData.mobile,
          university: formData.university,
          major: formData.major,
          year: formData.year,
          gpa: formData.gpa,
          studentId: formData.studentId,
          graduationYear: formData.graduationYear,
          bio: formData.bio,
          skills: formData.skills,
          interests: formData.interests,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio
        };
        setUser(updatedUser);
        showSuccess('Success', 'Profile updated successfully');
        setIsDirty(false);
      }
    } catch (error) {
      showError('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      university: (user as any)?.university || '',
      major: (user as any)?.major || '',
      year: (user as any)?.year || '',
      gpa: (user as any)?.gpa || '',
      studentId: (user as any)?.studentId || '',
      graduationYear: (user as any)?.graduationYear || '',
      bio: (user as any)?.bio || '',
      skills: (user as any)?.skills || [],
      interests: (user as any)?.interests || [],
      linkedin: (user as any)?.linkedin || '',
      github: (user as any)?.github || '',
      portfolio: (user as any)?.portfolio || ''
    });
    setErrors({});
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Student Analytics Overview */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-card-foreground">Student Analytics</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Your academic progress and achievements</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-primary" size={20} />
                <span className="font-medium text-foreground">Projects</span>
              </div>
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-green-500" size={20} />
                <span className="font-medium text-foreground">Achievements</span>
              </div>
              <div className="text-2xl font-bold text-green-500">8</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-500" size={20} />
                <span className="font-medium text-foreground">Collaborations</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">15</div>
              <div className="text-sm text-muted-foreground">Team Projects</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-purple-500" size={20} />
                <span className="font-medium text-foreground">Progress</span>
              </div>
              <div className="text-2xl font-bold text-purple-500">85%</div>
              <div className="text-sm text-muted-foreground">Overall</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Personal Information */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Update your personal details here</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                placeholder="Enter your last name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                disabled
              />
              <Input
                label="Phone"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.mobile}
                placeholder="Enter your phone number"
              />
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Academic Information */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-card-foreground">Academic Information</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Your educational background and academic details</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="University"
                name="university"
                value={formData.university}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.university}
                placeholder="University of Technology"
              />
              <Input
                label="Major/Field of Study"
                name="major"
                value={formData.major}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.major}
                placeholder="Computer Science"
              />
              <Select
                label="Academic Year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                options={[
                  { value: '', label: 'Select Year' },
                  { value: '1st', label: '1st Year' },
                  { value: '2nd', label: '2nd Year' },
                  { value: '3rd', label: '3rd Year' },
                  { value: '4th', label: '4th Year' },
                  { value: '5th', label: '5th Year' },
                  { value: 'graduate', label: 'Graduate' },
                  { value: 'postgraduate', label: 'Postgraduate' }
                ]}
              />
              <Input
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.studentId}
                placeholder="Enter your student ID"
              />
              <Input
                label="GPA"
                name="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.gpa}
                placeholder="3.75"
              />
              <Input
                label="Expected Graduation Year"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.graduationYear}
                placeholder="2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself, your interests, and goals..."
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Skills and Interests */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <Award className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-card-foreground">Skills & Interests</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Showcase your technical skills and areas of interest</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 pt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Technical Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill (e.g., JavaScript, Python, React)"
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addSkill(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Areas of Interest</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add an interest (e.g., AI/ML, Web Development, Data Science)"
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addInterest(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Professional Links */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-card-foreground">Professional Links</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Connect your professional profiles and portfolios</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="LinkedIn Profile"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.linkedin}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <Input
                label="GitHub Profile"
                name="github"
                value={formData.github}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.github}
                placeholder="https://github.com/yourusername"
              />
              <Input
                label="Portfolio Website"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.portfolio}
                placeholder="https://yourportfolio.com"
                className="md:col-span-2"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Form Actions */}
      <Card className="shadow-sm border border-border">
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full sm:w-auto" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto" 
              disabled={loading || !isDirty}
              onClick={handleSubmit}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {/* Additional Profile Actions */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Additional Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Change Email Address</h3>
                <p className="text-sm text-muted-foreground mt-1">Update your primary email address</p>
              </div>
              <Button variant="secondary" size="sm">Request Change</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Profile Visibility</h3>
                <p className="text-sm text-muted-foreground mt-1">Control who can see your profile</p>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Download Profile Data</h3>
                <p className="text-sm text-muted-foreground mt-1">Export your profile information</p>
              </div>
              <Button variant="secondary" size="sm">Download</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};