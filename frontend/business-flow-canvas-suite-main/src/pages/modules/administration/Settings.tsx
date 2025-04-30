
import { useState } from "react";
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
  Sparkles
} from "lucide-react";

const AdminSettings = () => {
  const [updatesEnabled, setUpdatesEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackups, setAutoBackups] = useState(true);
  
  const handleSave = () => {
    toast.success("System settings updated successfully!");
  };

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
                    <Select defaultValue="en">
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
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="et">Eastern Time (ET)</SelectItem>
                        <SelectItem value="ct">Central Time (CT)</SelectItem>
                        <SelectItem value="mt">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Format</label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Format</label>
                    <Select defaultValue="12h">
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
                    checked={updatesEnabled} 
                    onCheckedChange={setUpdatesEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Usage Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Share anonymous usage data to help improve the system
                    </p>
                  </div>
                  <Switch defaultChecked />
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
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
                
                <div className="pt-4">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444"].map((color) => (
                      <div 
                        key={color}
                        className={`h-10 w-full rounded-md cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-gray-400 ${
                          color === "#3B82F6" ? "ring-black" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Layout</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Layout</label>
                  <Select defaultValue="sidebar">
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
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Quick Actions</p>
                    <p className="text-sm text-muted-foreground">
                      Display quick action buttons in the header
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Animation Effects</p>
                    <p className="text-sm text-muted-foreground">
                      Enable UI animations and transitions
                    </p>
                  </div>
                  <Switch defaultChecked />
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
                    checked={autoBackups} 
                    onCheckedChange={setAutoBackups} 
                  />
                </div>
                
                {autoBackups && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Backup Frequency</label>
                      <Select defaultValue="daily">
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
                      <Input type="number" min="1" max="365" defaultValue="30" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Storage Management</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">File Upload Size Limit (MB)</label>
                  <Input type="number" min="1" max="1000" defaultValue="50" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed File Types</label>
                  <Input defaultValue="pdf,doc,docx,xls,xlsx,jpg,png,txt" />
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
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Manual Backup</h3>
                <Button variant="outline" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>
                
                <div className="mt-4">
                  <p className="text-sm font-medium">Last Backup: Yesterday at 11:30 PM</p>
                  <p className="text-sm text-muted-foreground">Size: 128 MB</p>
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
                  <Button variant="outline" className="border-blue-300 hover:bg-blue-100">
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
        <Button variant="outline">Restore Defaults</Button>
        <Button onClick={handleSave} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
