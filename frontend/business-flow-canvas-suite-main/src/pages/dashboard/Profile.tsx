import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, User, Mail, Building, Phone, MapPin, Shield, Save } from "lucide-react";
import UserService, { UserProfile, UserProfileUpdate } from "@/services/UserService";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfileUpdate>({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userData = await UserService.getCurrentUserProfile();
        setProfile(userData);
        
        if (userData) {
          setFormData({
            name: userData.name,
            company: userData.company,
            role: userData.role,
            department: userData.department,
            job_title: userData.job_title,
            avatar_url: userData.avatar_url,
            contact_info: userData.contact_info || {},
            preferences: userData.preferences || {},
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...(prev.contact_info || {}),
        [field]: value
      }
    }));
  };

  const handlePreferencesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...(prev.preferences || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      await UserService.updateUser(user.id, formData);
      toast.success("Profile updated successfully");
      
      // Update local profile data
      setProfile(prev => prev ? { ...prev, ...formData } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    try {
      setSaving(true);
      const avatarUrl = await UserService.uploadAvatar(user.id, file);
      
      // Update form data with new avatar URL
      setFormData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));
      
      // Update profile object to show the new avatar
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center">
          <User className="mr-2 h-6 w-6" />
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading your profile...</span>
        </div>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={formData.avatar_url || "/avatar-placeholder.png"} />
                        <AvatarFallback>{profile?.name?.charAt(0) || user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex flex-col items-center">
                        <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          Change Photo
                        </Label>
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            value={user.email || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company || ""}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Your company"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="job_title">Job Title</Label>
                          <Input
                            id="job_title"
                            value={formData.job_title || ""}
                            onChange={(e) => handleInputChange("job_title", e.target.value)}
                            placeholder="Your job title"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department || ""}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          placeholder="Your department"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Update your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.contact_info?.phone || ""}
                        onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        value={formData.contact_info?.mobile || ""}
                        onChange={(e) => handleContactInfoChange("mobile", e.target.value)}
                        placeholder="Your mobile number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.contact_info?.address || ""}
                      onChange={(e) => handleContactInfoChange("address", e.target.value)}
                      placeholder="Your address"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.contact_info?.city || ""}
                        onChange={(e) => handleContactInfoChange("city", e.target.value)}
                        placeholder="Your city"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.contact_info?.state || ""}
                        onChange={(e) => handleContactInfoChange("state", e.target.value)}
                        placeholder="Your state/province"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={formData.contact_info?.postal_code || ""}
                        onChange={(e) => handleContactInfoChange("postal_code", e.target.value)}
                        placeholder="Your postal code"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.contact_info?.country || ""}
                      onChange={(e) => handleContactInfoChange("country", e.target.value)}
                      placeholder="Your country"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Account Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                      </div>
                      <Switch 
                        checked={formData.preferences?.email_notifications || false}
                        onCheckedChange={(checked) => handlePreferencesChange("email_notifications", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Enable two-factor authentication for added security</p>
                      </div>
                      <Switch 
                        checked={formData.preferences?.two_factor_auth || false}
                        onCheckedChange={(checked) => handlePreferencesChange("two_factor_auth", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
