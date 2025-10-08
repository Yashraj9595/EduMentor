import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Bell,
  Shield,
  Database,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

interface InstitutionSettings {
  general: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    hackathonUpdates: boolean;
    studentRegistrations: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
    loginAttempts: number;
  };
  integrations: {
    emailService: string;
    smsService: string;
    analytics: boolean;
    backupEnabled: boolean;
  };
  features: {
    advancedAnalytics: boolean;
    customFields: boolean;
    bulkOperations: boolean;
    apiAccess: boolean;
    auditLogs: boolean;
  };
}

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<InstitutionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations' | 'features'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Mock data - in a real app, this would come from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings({
        general: {
          name: user?.university || 'University Name',
          email: user?.email || 'admin@university.edu',
          phone: '+1 (555) 123-4567',
          address: '123 University Ave, City, State 12345',
          website: 'https://university.edu',
          description: 'Leading educational institution focused on innovation and excellence.'
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          weeklyReports: true,
          hackathonUpdates: true,
          studentRegistrations: true
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordPolicy: 'strong',
          loginAttempts: 5
        },
        integrations: {
          emailService: 'smtp',
          smsService: 'twilio',
          analytics: true,
          backupEnabled: true
        },
        features: {
          advancedAnalytics: true,
          customFields: true,
          bulkOperations: true,
          apiAccess: false,
          auditLogs: true
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock save - in a real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: keyof InstitutionSettings, field: string, value: any) => {
    if (settings) {
      setSettings(prev => ({
        ...prev!,
        [section]: {
          ...prev![section],
          [field]: value
        }
      }));
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'features', label: 'Features', icon: Users }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Institution Settings</h1>
          <p className="text-muted-foreground">Configure your institution's settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadSettings}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardBody className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                        isActive ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">General Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Institution Name"
                    value={settings.general.name}
                    onChange={(e) => handleInputChange('general', 'name', e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                  />
                  <Input
                    label="Phone"
                    value={settings.general.phone}
                    onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                  />
                  <Input
                    label="Website"
                    value={settings.general.website}
                    onChange={(e) => handleInputChange('general', 'website', e.target.value)}
                  />
                </div>
                <Input
                  label="Address"
                  value={settings.general.address}
                  onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={settings.general.description}
                    onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Notification Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'smsNotifications' && 'Receive notifications via SMS'}
                          {key === 'pushNotifications' && 'Receive push notifications in browser'}
                          {key === 'weeklyReports' && 'Get weekly summary reports'}
                          {key === 'hackathonUpdates' && 'Get updates about hackathon events'}
                          {key === 'studentRegistrations' && 'Get notified of new student registrations'}
                        </p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${
                        value ? 'bg-primary' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'transform translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Security Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Two-Factor Authentication</span>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${
                      settings.security.twoFactorAuth ? 'bg-primary' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.security.twoFactorAuth ? 'transform translate-x-5' : 'translate-x-0.5'
                      }`}></div>
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      options={[
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '120', label: '2 hours' },
                        { value: '480', label: '8 hours' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Password Policy</label>
                    <Select
                      value={settings.security.passwordPolicy}
                      onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
                      options={[
                        { value: 'basic', label: 'Basic (8+ characters)' },
                        { value: 'strong', label: 'Strong (12+ characters, mixed case, numbers, symbols)' },
                        { value: 'very-strong', label: 'Very Strong (16+ characters, complex requirements)' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Max Login Attempts</label>
                    <Select
                      value={settings.security.loginAttempts.toString()}
                      onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                      options={[
                        { value: '3', label: '3 attempts' },
                        { value: '5', label: '5 attempts' },
                        { value: '10', label: '10 attempts' },
                        { value: 'unlimited', label: 'Unlimited' }
                      ]}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Integration Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Service</label>
                    <Select
                      value={settings.integrations.emailService}
                      onChange={(e) => handleInputChange('integrations', 'emailService', e.target.value)}
                      options={[
                        { value: 'smtp', label: 'SMTP' },
                        { value: 'sendgrid', label: 'SendGrid' },
                        { value: 'mailgun', label: 'Mailgun' },
                        { value: 'ses', label: 'Amazon SES' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SMS Service</label>
                    <Select
                      value={settings.integrations.smsService}
                      onChange={(e) => handleInputChange('integrations', 'smsService', e.target.value)}
                      options={[
                        { value: 'twilio', label: 'Twilio' },
                        { value: 'aws-sns', label: 'AWS SNS' },
                        { value: 'messagebird', label: 'MessageBird' },
                        { value: 'none', label: 'None' }
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.integrations).filter(([key]) => typeof settings.integrations[key as keyof typeof settings.integrations] === 'boolean').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {key === 'analytics' && 'Enable analytics tracking'}
                          {key === 'backupEnabled' && 'Enable automatic backups'}
                        </p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${
                        value ? 'bg-primary' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'transform translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleInputChange('integrations', key, e.target.checked)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'features' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Feature Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-4">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {key === 'advancedAnalytics' && 'Enable advanced analytics and reporting features'}
                          {key === 'customFields' && 'Allow custom fields for user profiles'}
                          {key === 'bulkOperations' && 'Enable bulk operations for account management'}
                          {key === 'apiAccess' && 'Enable API access for third-party integrations'}
                          {key === 'auditLogs' && 'Enable audit logging for security and compliance'}
                        </p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer ${
                        value ? 'bg-primary' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'transform translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleInputChange('features', key, e.target.checked)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
