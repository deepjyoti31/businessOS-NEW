
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Building, MapPin, Globe, Phone, Mail, CreditCard,
  Calendar, Upload, Sparkles, Save, Loader2
} from "lucide-react";
import CompanyService, { CompanyProfile, CompanyProfileUpdate } from "@/services/CompanyService";

const AdminCompany = () => {
  const [companyData, setCompanyData] = useState<CompanyProfile>({
    name: "Loading...",
    logo_url: "/avatar-placeholder.png",
    industry: "",
    size: "",
    founded: "",
    website: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    tax_id: "",
    registration_number: "",
    fiscal_year: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input

  // Load company profile data
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        const profile = await CompanyService.getCompanyProfile();
        setCompanyData({
          ...profile,
          // Map backend field names to frontend field names if needed
          postal_code: profile.postal_code || "",
          tax_id: profile.tax_id || "",
          registration_number: profile.registration_number || "",
          fiscal_year: profile.fiscal_year || "",
        });
      } catch (error) {
        console.error("Error fetching company profile:", error);
        toast.error("Failed to load company profile. Please check API connection.");
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    fetchCompanyProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare data for update
      const updateData: CompanyProfileUpdate = {
        name: companyData.name,
        industry: companyData.industry,
        size: companyData.size,
        founded: companyData.founded,
        website: companyData.website,
        description: companyData.description,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        postal_code: companyData.postal_code,
        country: companyData.country,
        tax_id: companyData.tax_id,
        registration_number: companyData.registration_number,
        fiscal_year: companyData.fiscal_year,
      };

      try {
        // Update company profile
        await CompanyService.updateCompanyProfile(updateData);
        toast.success("Company profile updated successfully!");
      } catch (apiError) {
        console.error("API Error updating company profile:", apiError);
        toast.success("Company profile updated successfully! (Local only)");
        toast.error("Note: Changes will not persist after page refresh due to API connection issues");
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      try {
        await CompanyService.uploadLogo(file);

        // Refresh company profile to get the new logo URL
        const profile = await CompanyService.getCompanyProfile();
        setCompanyData(prev => ({ ...prev, logo_url: profile.logo_url }));

        toast.success("Logo uploaded successfully!");
      } catch (apiError) {
        console.error("API Error uploading logo:", apiError);

        // Create a local URL for the file to display it
        const localUrl = URL.createObjectURL(file);
        setCompanyData(prev => ({ ...prev, logo_url: localUrl }));

        toast.success("Logo updated locally!");
        toast.error("Note: Logo will not persist after page refresh due to API connection issues");
      }

      // Reset file input
      setFileInputKey(Date.now());
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setSaving(true);

      try {
        await CompanyService.updateCompanyProfile({ logo_url: "" });
        toast.success("Logo removed successfully!");
      } catch (apiError) {
        console.error("API Error removing logo:", apiError);
        toast.success("Logo removed locally!");
        toast.error("Note: Changes will not persist after page refresh due to API connection issues");
      }

      // Update local state regardless of API success
      setCompanyData(prev => ({ ...prev, logo_url: "" }));
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo");
    } finally {
      setSaving(false);
    }
  };

  const handleAIOptimize = () => {
    toast.success("AI profile suggestions generated!");
    // This would be implemented with actual AI functionality in the future
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading company profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center">
          <Building className="mr-2 h-6 w-6" />
          Company Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your company information and business details
        </p>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact & Location</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Company Logo */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={companyData.logo_url || "/avatar-placeholder.png"} alt={companyData.name} />
                  <AvatarFallback>{companyData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Company Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Your logo will appear on invoices, reports and other business documents
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center relative"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Logo
                        </>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        key={fileInputKey}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                      disabled={!companyData.logo_url || saving}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={companyData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input
                    value={companyData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Size</label>
                  <Input
                    value={companyData.size}
                    onChange={(e) => handleChange("size", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year Founded</label>
                  <Input
                    value={companyData.founded}
                    onChange={(e) => handleChange("founded", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={companyData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Description</label>
                <Textarea
                  rows={4}
                  value={companyData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Enhancement Card */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-10 w-10 text-blue-500" />
                <div className="space-y-2">
                  <h3 className="font-medium">AI Company Profile Enhancement</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI can analyze your company profile and suggest improvements to make it more engaging and professional.
                  </p>
                  <Button variant="outline" onClick={handleAIOptimize} className="border-blue-300 hover:bg-blue-100">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Suggestions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Location Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    value={companyData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Number
                  </label>
                  <Input
                    value={companyData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street Address</label>
                    <Input
                      value={companyData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={companyData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State/Province</label>
                    <Input
                      value={companyData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Postal/ZIP Code</label>
                    <Input
                      value={companyData.postal_code}
                      onChange={(e) => handleChange("postal_code", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      value={companyData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Details Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Tax ID
                  </label>
                  <Input
                    value={companyData.tax_id}
                    onChange={(e) => handleChange("tax_id", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Registration Number
                  </label>
                  <Input
                    value={companyData.registration_number}
                    onChange={(e) => handleChange("registration_number", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fiscal Year
                  </label>
                  <Input
                    value={companyData.fiscal_year}
                    onChange={(e) => handleChange("fiscal_year", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Color Scheme</h3>
                <div className="flex flex-wrap gap-2">
                  {["#3B82F6", "#10B981", "#6366F1", "#F59E0B", "#EF4444"].map((color) => (
                    <div
                      key={color}
                      className={`h-10 w-10 rounded-md cursor-pointer ring-2 ring-transparent hover:ring-gray-400 ${
                        color === "#3B82F6" ? "ring-black" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <h3 className="font-medium mt-6">Brand Assets</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Logo (Dark)
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Logo (Light)
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Favicon
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Document Header
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={saving}>Cancel</Button>
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminCompany;
