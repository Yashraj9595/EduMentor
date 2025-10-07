import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../contexts/ToastContext';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    mobile: user?.mobile || '',
    email: user?.email || ''
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
        formData.mobile !== user.mobile;
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
      if (key !== 'email') { // Skip email as it's disabled
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
          mobile: formData.mobile
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
      email: user?.email || ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Update your personal details here</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
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
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
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
          </div>
        </CardBody>
      </Card>
    </div>
  );
};