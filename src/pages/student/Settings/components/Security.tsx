import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { Eye, EyeOff, Shield, Key, Lock } from 'lucide-react';

export const Security: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Check if form is dirty
  useEffect(() => {
    const hasChanges = 
      formData.currentPassword.length > 0 ||
      formData.newPassword.length > 0 ||
      formData.confirmNewPassword.length > 0;
    setIsDirty(hasChanges);
  }, [formData]);

  // Calculate password strength
  useEffect(() => {
    if (formData.newPassword) {
      let strength = 0;
      if (formData.newPassword.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.newPassword)) strength += 25;
      if (/[0-9]/.test(formData.newPassword)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.newPassword)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.newPassword]);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'currentPassword':
        if (!value) return 'Current password is required';
        break;
      case 'newPassword':
        if (!value) return 'New password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain a number';
        if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain a special character';
        break;
      case 'confirmNewPassword':
        if (!value) return 'Please confirm your new password';
        if (value !== formData.newPassword) return 'Passwords do not match';
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
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Success', 'Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordStrength(0);
      setIsDirty(false);
    } catch (error) {
      showError('Error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setErrors({});
    setPasswordStrength(0);
  };

  // Get password strength label and color
  const getPasswordStrengthInfo = () => {
    if (passwordStrength === 0) return { label: '', color: '' };
    if (passwordStrength <= 25) return { label: 'Weak', color: 'bg-red-500' };
    if (passwordStrength <= 50) return { label: 'Fair', color: 'bg-orange-500' };
    if (passwordStrength <= 75) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Security Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your password and security preferences</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-5">
              <div className="relative">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.currentPassword}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="New Password"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.newPassword}
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Password Strength:</span>
                      <span className={strengthInfo.color ? `font-medium ${strengthInfo.color.replace('bg-', 'text-')}` : ''}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${strengthInfo.color}`} 
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <ul className="text-xs text-muted-foreground grid grid-cols-2 gap-1 mt-1">
                      <li className={formData.newPassword.length >= 8 ? 'text-green-500' : ''}>
                        • 8+ characters
                      </li>
                      <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Uppercase letter
                      </li>
                      <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Number
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-500' : ''}>
                        • Special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmNewPassword}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      
      {/* Additional Security Features */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Additional Security</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Enable</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Security Keys</h3>
                  <p className="text-sm text-muted-foreground mt-1">Register hardware security keys</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Login History</h3>
                  <p className="text-sm text-muted-foreground mt-1">View your recent login activity</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">View</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};