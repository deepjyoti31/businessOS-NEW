
import { useState } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const handleSaveProfile = () => {
    toast.success("Profile information updated successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated successfully!");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">User Profile</h1>
      <p className="text-muted-foreground mb-6">
        Manage your account settings and preferences
      </p>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-2xl">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-muted-foreground mt-1">{user?.role}</p>

            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    defaultValue={user?.name?.split(" ")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    defaultValue={user?.name?.split(" ")[1] || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  defaultValue={user?.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" placeholder="+1 (555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job title</Label>
                <Input id="title" placeholder="Job title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Department" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Write a short bio..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred theme
                    </p>
                  </div>
                  <div>
                    <select
                      id="theme"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="density">Interface Density</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust the density of the user interface
                    </p>
                  </div>
                  <div>
                    <select
                      id="density"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Language & Region</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred language
                    </p>
                  </div>
                  <div>
                    <select
                      id="language"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose how dates are displayed
                    </p>
                  </div>
                  <div>
                    <select
                      id="dateFormat"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="mdy">MM/DD/YYYY</option>
                      <option value="dmy">DD/MM/YYYY</option>
                      <option value="ymd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose how time is displayed
                    </p>
                  </div>
                  <div>
                    <select
                      id="timeFormat"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="12">12-hour (AM/PM)</option>
                      <option value="24">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Preferences</Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>Project updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails about project changes and updates
                    </span>
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="task-notifications" className="flex flex-col space-y-1">
                    <span>Task assignments</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails when tasks are assigned to you
                    </span>
                  </Label>
                  <Switch id="task-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="comment-notifications" className="flex flex-col space-y-1">
                    <span>Comments and mentions</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails when someone comments or mentions you
                    </span>
                  </Label>
                  <Switch id="comment-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="news-notifications" className="flex flex-col space-y-1">
                    <span>News and updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails about new features and product updates
                    </span>
                  </Label>
                  <Switch id="news-notifications" />
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">In-App Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="desktop-notifications" className="flex flex-col space-y-1">
                    <span>Desktop notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Show desktop notifications for important updates
                    </span>
                  </Label>
                  <Switch id="desktop-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sound-notifications" className="flex flex-col space-y-1">
                    <span>Sound notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Play sounds for notifications
                    </span>
                  </Label>
                  <Switch id="sound-notifications" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">Change Password</Button>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="2fa" className="flex flex-col space-y-1">
                    <span>Enable Two-Factor Authentication</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </span>
                  </Label>
                  <Switch id="2fa" />
                </div>
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Sessions</h3>

              <div className="space-y-4">
                <div className="rounded-md border border-border">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Started: Today at 10:24 AM • Chrome on Windows
                      </p>
                    </div>
                    <div className="flex h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <Separator />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Previous Session</p>
                      <p className="text-sm text-muted-foreground">
                        Yesterday at 3:16 PM • Safari on MacOS
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive">Sign Out All Sessions</Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
