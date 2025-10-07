import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { Bell, Mail, MessageSquare, Clock, Smartphone, Shield } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    weeklySummary: true,
    marketing: false,
    security: true
  });
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [frequency, setFrequency] = useState('immediately');

  // Check if form is dirty
  useEffect(() => {
    // In a real app, we would compare with saved preferences
    setIsDirty(true);
  }, [notifications, frequency]);

  const handleCheckboxChange = (name: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to save notification preferences
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Success', 'Notification preferences saved successfully');
      setIsDirty(false);
    } catch (error) {
      showError('Error', 'Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to default values
    setNotifications({
      email: true,
      sms: false,
      push: true,
      weeklySummary: true,
      marketing: false,
      security: true
    });
    setFrequency('immediately');
  };

  const categories = [
    {
      title: "Communication",
      icon: <MessageSquare size={20} />,
      options: [
        { id: 'email', label: 'Email notifications' },
        { id: 'sms', label: 'SMS notifications' },
        { id: 'push', label: 'Push notifications' }
      ]
    },
    {
      title: "Updates",
      icon: <Bell size={20} />,
      options: [
        { id: 'weeklySummary', label: 'Weekly summary' },
        { id: 'marketing', label: 'Marketing emails' }
      ]
    },
    {
      title: "Security",
      icon: <Shield size={20} />,
      options: [
        { id: 'security', label: 'Security alerts' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose how you want to be notified</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8 pt-4">
              {categories.map((category, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{category.title}</h3>
                  </div>
                  <div className="space-y-3 pl-2">
                    {category.options.map((option) => (
                      <Checkbox 
                        key={option.id}
                        label={option.label}
                        checked={notifications[option.id as keyof typeof notifications]}
                        onChange={() => handleCheckboxChange(option.id as keyof typeof notifications)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Notification Frequency</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-2">
                  <button
                    type="button"
                    onClick={() => handleFrequencyChange('immediately')}
                    className={`p-3 rounded-lg border text-left ${
                      frequency === 'immediately'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium">Immediately</div>
                    <div className="text-sm text-muted-foreground">Get notified right away</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFrequencyChange('daily')}
                    className={`p-3 rounded-lg border text-left ${
                      frequency === 'daily'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium">Daily Digest</div>
                    <div className="text-sm text-muted-foreground">Get a daily summary</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFrequencyChange('weekly')}
                    className={`p-3 rounded-lg border text-left ${
                      frequency === 'weekly'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm text-muted-foreground">Get a weekly summary</div>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
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
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
      
      {/* Notification Channels */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Notification Channels</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Mobile App Notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage push notifications for the mobile app</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Email Preferences</h3>
                  <p className="text-sm text-muted-foreground mt-1">Customize email notification content</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};