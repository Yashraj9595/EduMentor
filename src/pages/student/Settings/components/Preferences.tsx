import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Select } from '../../../../components/ui/Select';
import { Checkbox } from '../../../../components/ui/Checkbox';
import { Button } from '../../../../components/ui/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { Palette, Globe, Monitor, Save, RefreshCw } from 'lucide-react';

export const Preferences: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'utc',
    darkMode: true,
    autoSave: true,
    compactMode: false,
    animations: true
  });
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Check if form is dirty
  useEffect(() => {
    // In a real app, we would compare with saved preferences
    setIsDirty(true);
  }, [preferences]);

  const handleSelectChange = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const handleCheckboxChange = (name: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Success', 'Preferences saved successfully');
      setIsDirty(false);
    } catch (error) {
      showError('Error', 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to default values
    setPreferences({
      language: 'en',
      timezone: 'utc',
      darkMode: true,
      autoSave: true,
      compactMode: false,
      animations: true
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default values?')) {
      setPreferences({
        language: 'en',
        timezone: 'utc',
        darkMode: true,
        autoSave: true,
        compactMode: false,
        animations: true
      });
      showSuccess('Success', 'Preferences reset to default values');
    }
  };

  const sections = [
    {
      title: "Display",
      icon: <Monitor size={20} />,
      options: [
        { id: 'darkMode', label: 'Dark mode' },
        { id: 'compactMode', label: 'Compact mode' },
        { id: 'animations', label: 'Enable animations' }
      ]
    },
    {
      title: "Functionality",
      icon: <Save size={20} />,
      options: [
        { id: 'autoSave', label: 'Auto-save drafts' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">General Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your application experience</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8 pt-4">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Globe size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Localization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-2">
                  <Select
                    label="Language"
                    value={preferences.language}
                    onChange={(e) => handleSelectChange('language', e)}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                      { value: 'jp', label: 'Japanese' },
                    ]}
                  />
                  <Select
                    label="Timezone"
                    value={preferences.timezone}
                    onChange={(e) => handleSelectChange('timezone', e)}
                    options={[
                      { value: 'utc', label: 'UTC' },
                      { value: 'est', label: 'Eastern Time' },
                      { value: 'pst', label: 'Pacific Time' },
                      { value: 'cet', label: 'Central European Time' },
                      { value: 'ist', label: 'Indian Standard Time' },
                    ]}
                  />
                </div>
              </div>
              
              {sections.map((section, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{section.title}</h3>
                  </div>
                  <div className="space-y-3 pl-2">
                    {section.options.map((option) => (
                      <Checkbox 
                        key={option.id}
                        label={option.label}
                        checked={preferences[option.id as keyof typeof preferences] as boolean}
                        onChange={() => handleCheckboxChange(option.id as keyof typeof preferences)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
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
                  type="button" 
                  variant="secondary" 
                  className="w-full sm:w-auto" 
                  onClick={handleResetDefaults}
                  disabled={loading}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset Defaults
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
      
      {/* Additional Preferences */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Advanced Preferences</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Palette size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Theme Customization</h3>
                  <p className="text-sm text-muted-foreground mt-1">Customize colors and appearance</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Customize</Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-accent rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage your data preferences</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Configure</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};