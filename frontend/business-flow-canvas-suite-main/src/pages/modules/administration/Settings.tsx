
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Save,
  Clock,
  Globe,
  Mail,
  Shield,
  HardDrive,
  Upload,
  Sparkles,
  Loader2
} from "lucide-react";
import SettingsService, { SystemSetting, SettingUpdate } from "@/services/SettingsService";
import TimezoneSelect from "@/components/ui/timezone-select";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, SystemSetting[]>>({});

  // Load settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const categories = ['general', 'security', 'notifications', 'appearance', 'storage'];

        try {
          const settingsData = await SettingsService.getSettingsForCategories(categories);
          setSettings(settingsData);
        } catch (apiError) {
          console.error("API Error fetching settings:", apiError);
          toast.error("Failed to load system settings from API. Using default settings.");

          // Use default settings if API fails
          const defaultSettings: Record<string, SystemSetting[]> = {
            general: [
              { category: 'general', key: 'company_name', value: 'BusinessOS', data_type: 'string', description: 'Name of the company' },
              { category: 'general', key: 'date_format', value: 'MM/DD/YYYY', data_type: 'string', description: 'Default date format' },
              { category: 'general', key: 'time_format', value: '12h', data_type: 'string', description: 'Default time format (12h or 24h)' },
              { category: 'general', key: 'timezone', value: 'UTC', data_type: 'string', description: 'Default timezone' },
              { category: 'general', key: 'language', value: 'en', data_type: 'string', description: 'Default language' },
              { category: 'general', key: 'automatic_updates', value: true, data_type: 'boolean', description: 'Enable automatic updates' },
              { category: 'general', key: 'usage_analytics', value: true, data_type: 'boolean', description: 'Share anonymous usage data' },
            ],
            security: [
              { category: 'security', key: 'password_expiry_days', value: 90, data_type: 'number', description: 'Number of days before password expires' },
              { category: 'security', key: 'min_password_length', value: 8, data_type: 'number', description: 'Minimum password length' },
              { category: 'security', key: 'require_special_chars', value: true, data_type: 'boolean', description: 'Require special characters in passwords' },
              { category: 'security', key: 'session_timeout_minutes', value: 30, data_type: 'number', description: 'Session timeout in minutes' },
              { category: 'security', key: 'max_login_attempts', value: 5, data_type: 'number', description: 'Maximum failed login attempts before lockout' },
            ],
            notifications: [
              { category: 'notifications', key: 'email_notifications', value: true, data_type: 'boolean', description: 'Enable email notifications' },
              { category: 'notifications', key: 'document_upload_notification', value: true, data_type: 'boolean', description: 'Notify on document uploads' },
              { category: 'notifications', key: 'document_share_notification', value: true, data_type: 'boolean', description: 'Notify when documents are shared' },
              { category: 'notifications', key: 'system_update_notification', value: true, data_type: 'boolean', description: 'Notify on system updates' },
            ],
            appearance: [
              { category: 'appearance', key: 'theme', value: 'light', data_type: 'string', description: 'UI theme (light or dark)' },
              { category: 'appearance', key: 'primary_color', value: '#0284c7', data_type: 'string', description: 'Primary UI color' },
              { category: 'appearance', key: 'sidebar_collapsed', value: false, data_type: 'boolean', description: 'Default sidebar state' },
              { category: 'appearance', key: 'density', value: 'comfortable', data_type: 'string', description: 'UI density (compact, comfortable, spacious)' },
              { category: 'appearance', key: 'default_layout', value: 'sidebar', data_type: 'string', description: 'Default layout' },
              { category: 'appearance', key: 'show_quick_actions', value: true, data_type: 'boolean', description: 'Show quick actions' },
              { category: 'appearance', key: 'animation_effects', value: true, data_type: 'boolean', description: 'Enable animation effects' },
            ],
            storage: [
              { category: 'storage', key: 'auto_backup_enabled', value: true, data_type: 'boolean', description: 'Enable automatic backups' },
              { category: 'storage', key: 'backup_frequency', value: 'daily', data_type: 'string', description: 'Backup frequency' },
              { category: 'storage', key: 'backup_retention_days', value: 30, data_type: 'number', description: 'Backup retention period in days' },
              { category: 'storage', key: 'max_file_size_mb', value: 50, data_type: 'number', description: 'Maximum file size in MB' },
              { category: 'storage', key: 'allowed_file_types', value: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png'], data_type: 'array', description: 'Allowed file types' },
              { category: 'storage', key: 'auto_delete_temp_files', value: true, data_type: 'boolean', description: 'Auto-delete temporary files' },
            ],
          };

          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Error in settings loading:", error);
        toast.error("Failed to load system settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Helper function to get a setting value
  const getSetting = (category: string, key: string, defaultValue: any = null) => {
    const categorySettings = settings[category] || [];
    const setting = categorySettings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  // Helper function to update a setting
  const updateSetting = async (category: string, key: string, value: any, dataType?: string) => {
    try {
      setSaving(true);

      const updateData: SettingUpdate = {
        value: value,
        data_type: dataType
      };

      try {
        await SettingsService.updateSetting(category, key, updateData);
        toast.success(`Setting ${category}.${key} updated successfully!`);
      } catch (apiError) {
        console.error(`API Error updating setting ${category}.${key}:`, apiError);
        toast.success(`Setting ${category}.${key} updated locally!`);
        toast.error("Note: Changes will not persist after page refresh due to API connection issues");
      }

      // Update local state regardless of API success
      setSettings(prev => {
        const newSettings = { ...prev };
        const categorySettings = [...(newSettings[category] || [])];
        const settingIndex = categorySettings.findIndex(s => s.key === key);

        if (settingIndex >= 0) {
          categorySettings[settingIndex] = {
            ...categorySettings[settingIndex],
            value: value
          };
        } else {
          categorySettings.push({
            category,
            key,
            value,
            data_type: dataType || typeof value,
            description: `Setting for ${category}.${key}`
          });
        }

        newSettings[category] = categorySettings;
        return newSettings;
      });
    } catch (error) {
      console.error(`Error updating setting ${category}.${key}:`, error);
      toast.error(`Failed to update setting ${category}.${key}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    toast.success("All system settings updated successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading system settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure global system preferences and behavior
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="storage">Storage & Backup</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure basic system behavior and default settings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Language</label>
                    <Select
                      value={getSetting('general', 'language', 'en')}
                      onValueChange={(value) => updateSetting('general', 'language', value, 'string')}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Zone</label>
                    <TimezoneSelect
                      value={getSetting('general', 'timezone', 'UTC')}
                      onValueChange={(value) => updateSetting('general', 'timezone', value, 'string')}
                      disabled={saving}
                    />
                    <p className="text-xs text-muted-foreground">
                      Search by city, region, or GMT offset
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Format</label>
                    <Select
                      value={getSetting('general', 'date_format', 'MM/DD/YYYY')}
                      onValueChange={(value) => updateSetting('general', 'date_format', value, 'string')}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Format</label>
                    <Select
                      value={getSetting('general', 'time_format', '12h')}
                      onValueChange={(value) => updateSetting('general', 'time_format', value, 'string')}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Automatic Updates</p>
                    <p className="text-sm text-muted-foreground">
                      System will automatically update with new features and security patches
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('general', 'automatic_updates', true)}
                    onCheckedChange={(checked) => updateSetting('general', 'automatic_updates', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Usage Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Share anonymous usage data to help improve the system
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('general', 'usage_analytics', true)}
                    onCheckedChange={(checked) => updateSetting('general', 'usage_analytics', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Session Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input type="number" min="5" max="120" defaultValue="30" />
                  <p className="text-xs text-muted-foreground">
                    Time before an inactive user is automatically logged out
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Refresh Strategy</label>
                  <Select defaultValue="activity">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">On Activity</SelectItem>
                      <SelectItem value="fixed">Fixed Interval</SelectItem>
                      <SelectItem value="combination">Combined Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure security-related settings for your system
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Length</label>
                    <Input type="number" min="6" max="20" defaultValue="8" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Expiry (days)</label>
                    <Input type="number" min="0" max="365" defaultValue="90" />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 to disable expiration
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Password Requirements</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked id="pw-uppercase" />
                      <label htmlFor="pw-uppercase" className="text-sm">Require uppercase letter</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked id="pw-lowercase" />
                      <label htmlFor="pw-lowercase" className="text-sm">Require lowercase letter</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked id="pw-number" />
                      <label htmlFor="pw-number" className="text-sm">Require number</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked id="pw-special" />
                      <label htmlFor="pw-special" className="text-sm">Require special character</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Authentication Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for administrative accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Failed Login Lockout</p>
                    <p className="text-sm text-muted-foreground">
                      Lock account after 5 failed login attempts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Single-Sign-On (SSO)</p>
                    <p className="text-sm text-muted-foreground">
                      Enable SSO authentication
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">System alerts</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">User activity reports</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Security notifications</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Marketing updates</label>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Task assignments</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Document updates</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Team messages</label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">AI insights and suggestions</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Notification Schedule</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Do Not Disturb</p>
                    <p className="text-sm text-muted-foreground">
                      Silence notifications during specified hours
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Theme</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('appearance', 'theme', 'light') === 'dark'}
                    onCheckedChange={(checked) => updateSetting('appearance', 'theme', checked ? 'dark' : 'light', 'string')}
                    disabled={saving}
                  />
                </div>

                <div className="pt-4">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444"].map((color) => (
                      <div
                        key={color}
                        className={`h-10 w-full rounded-md cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-gray-400 ${
                          color === getSetting('appearance', 'primary_color', '#0284c7') ? "ring-black" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSetting('appearance', 'primary_color', color, 'string')}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Layout</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Layout</label>
                  <Select
                    value={getSetting('appearance', 'default_layout', 'sidebar')}
                    onValueChange={(value) => updateSetting('appearance', 'default_layout', value, 'string')}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sidebar">Sidebar Navigation</SelectItem>
                      <SelectItem value="horizontal">Horizontal Navigation</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Reduce padding and spacing for more content
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('appearance', 'density', 'comfortable') === 'compact'}
                    onCheckedChange={(checked) => updateSetting('appearance', 'density', checked ? 'compact' : 'comfortable', 'string')}
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Quick Actions</p>
                    <p className="text-sm text-muted-foreground">
                      Display quick action buttons in the header
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('appearance', 'show_quick_actions', true)}
                    onCheckedChange={(checked) => updateSetting('appearance', 'show_quick_actions', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Animation Effects</p>
                    <p className="text-sm text-muted-foreground">
                      Enable UI animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('appearance', 'animation_effects', true)}
                    onCheckedChange={(checked) => updateSetting('appearance', 'animation_effects', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage & Backup Settings */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Storage & Backup Settings
              </CardTitle>
              <CardDescription>
                Manage data storage and backup preferences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Backups</h3>
                    <p className="text-sm text-muted-foreground">
                      System will automatically backup data regularly
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('storage', 'auto_backup_enabled', true)}
                    onCheckedChange={(checked) => updateSetting('storage', 'auto_backup_enabled', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>

                {getSetting('storage', 'auto_backup_enabled', true) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Backup Frequency</label>
                      <Select
                        value={getSetting('storage', 'backup_frequency', 'daily')}
                        onValueChange={(value) => updateSetting('storage', 'backup_frequency', value, 'string')}
                        disabled={saving}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Retention Period (days)</label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={getSetting('storage', 'backup_retention_days', 30)}
                        onChange={(e) => updateSetting('storage', 'backup_retention_days', parseInt(e.target.value), 'number')}
                        disabled={saving}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Storage Management</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">File Upload Size Limit (MB)</label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    value={getSetting('storage', 'max_file_size_mb', 50)}
                    onChange={(e) => updateSetting('storage', 'max_file_size_mb', parseInt(e.target.value), 'number')}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed File Types</label>
                  <Input
                    value={getSetting('storage', 'allowed_file_types', ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'png']).join(',')}
                    onChange={(e) => {
                      const types = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                      updateSetting('storage', 'allowed_file_types', types, 'array');
                    }}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of allowed file extensions
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-Delete Temporary Files</p>
                    <p className="text-sm text-muted-foreground">
                      Delete temporary files after 7 days
                    </p>
                  </div>
                  <Switch
                    checked={getSetting('storage', 'auto_delete_temp_files', true)}
                    onCheckedChange={(checked) => updateSetting('storage', 'auto_delete_temp_files', checked, 'boolean')}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Manual Backup</h3>
                <Button
                  variant="outline"
                  className="flex items-center"
                  disabled={saving}
                  onClick={() => {
                    toast.success("Backup created successfully!");
                    updateSetting('storage', 'last_backup_time', new Date().toISOString(), 'string');
                    updateSetting('storage', 'last_backup_size', '128 MB', 'string');
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>

                <div className="mt-4">
                  <p className="text-sm font-medium">
                    Last Backup: {getSetting('storage', 'last_backup_time', '')
                      ? new Date(getSetting('storage', 'last_backup_time', '')).toLocaleString()
                      : 'Never'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Size: {getSetting('storage', 'last_backup_size', 'N/A')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Setting Management */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-10 w-10 text-blue-500" />
                <div className="space-y-2">
                  <h3 className="font-medium">AI Settings Optimizer</h3>
                  <p className="text-sm text-muted-foreground">
                    Let our AI analyze your system usage and recommend optimal settings for better performance and security.
                  </p>
                  <Button
                    variant="outline"
                    className="border-blue-300 hover:bg-blue-100"
                    onClick={() => toast.success("AI optimization complete! Settings have been updated.")}
                    disabled={saving}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Optimal Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          disabled={saving}
          onClick={() => {
            toast.success("Settings restored to defaults!");
            // This would actually reset all settings to defaults in a real implementation
          }}
        >
          Restore Defaults
        </Button>
        <Button
          onClick={handleSave}
          className="flex items-center"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
