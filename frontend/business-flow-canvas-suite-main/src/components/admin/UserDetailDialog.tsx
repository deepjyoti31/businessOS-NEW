import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, User, Mail, Building, Shield, Phone, MapPin } from "lucide-react";
import UserService, { UserProfile, UserProfileUpdate } from "@/services/UserService";

interface UserDetailDialogProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const UserDetailDialog = ({ userId, isOpen, onClose, onUserUpdated }: UserDetailDialogProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UserProfileUpdate>({});
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch user data when dialog opens
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !isOpen) return;
      
      try {
        setLoading(true);
        const userData = await UserService.getUserById(userId);
        setUser(userData);
        
        // Initialize form data with user data
        setFormData({
          name: userData.name,
          company: userData.company,
          role: userData.role,
          department: userData.department,
          job_title: userData.job_title,
          avatar_url: userData.avatar_url,
          contact_info: userData.contact_info || {},
          preferences: userData.preferences || {},
          status: userData.status
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user details");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId, isOpen, onClose]);
  
  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle contact info changes
  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...(prev.contact_info || {}),
        [field]: value
      }
    }));
  };
  
  // Handle save
  const handleSave = async () => {
    if (!userId || !user) return;
    
    try {
      setSaving(true);
      await UserService.updateUser(userId, formData);
      toast.success("User updated successfully");
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    try {
      setSaving(true);
      const avatarUrl = await UserService.uploadAvatar(userId, file);
      
      // Update form data with new avatar URL
      setFormData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));
      
      // Update user object to show the new avatar
      setUser(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setSaving(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading user details...</span>
          </div>
        ) : user ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <User className="mr-2 h-5 w-5" />
                User Details
              </DialogTitle>
              <DialogDescription>
                View and edit user information
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar_url || "/avatar-placeholder.png"} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col items-center">
                      <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                        Change Avatar
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
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={formData.role || "User"} 
                          onValueChange={(value) => handleInputChange("role", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Administrator</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status || "active"} 
                          onValueChange={(value) => handleInputChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company || ""}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department || ""}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="job_title">Job Title</Label>
                      <Input
                        id="job_title"
                        value={formData.job_title || ""}
                        onChange={(e) => handleInputChange("job_title", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.contact_info?.phone || ""}
                      onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.contact_info?.mobile || ""}
                      onChange={(e) => handleContactInfoChange("mobile", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.contact_info?.address || ""}
                    onChange={(e) => handleContactInfoChange("address", e.target.value)}
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
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.contact_info?.state || ""}
                      onChange={(e) => handleContactInfoChange("state", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={formData.contact_info?.postal_code || ""}
                      onChange={(e) => handleContactInfoChange("postal_code", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.contact_info?.country || ""}
                    onChange={(e) => handleContactInfoChange("country", e.target.value)}
                  />
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                    </div>
                    <Switch 
                      checked={formData.preferences?.email_notifications || false}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          preferences: {
                            ...(prev.preferences || {}),
                            email_notifications: checked
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Enable two-factor authentication for added security</p>
                    </div>
                    <Switch 
                      checked={formData.preferences?.two_factor_auth || false}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          preferences: {
                            ...(prev.preferences || {}),
                            two_factor_auth: checked
                          }
                        }));
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex justify-center items-center py-12 text-red-500">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
