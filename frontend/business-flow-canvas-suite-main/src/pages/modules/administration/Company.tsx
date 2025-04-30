
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  Building, MapPin, Globe, Phone, Mail, CreditCard, 
  Calendar, Upload, Sparkles, Save 
} from "lucide-react";

const AdminCompany = () => {
  const [companyData, setCompanyData] = useState({
    name: "Acme Inc.",
    logo: "/avatar-placeholder.png",
    industry: "Software Development",
    size: "10-50 employees",
    founded: "2015",
    website: "https://acme.example.com",
    description: "Acme Inc. is a leading software development company specializing in business automation solutions for small and medium-sized enterprises.",
    
    // Contact info
    email: "contact@acme.example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street",
    city: "Tech City",
    state: "CA",
    postalCode: "94103",
    country: "United States",
    
    // Business info
    taxId: "12-3456789",
    registrationNumber: "REG-123456",
    fiscalYear: "January - December",
  });

  const handleSave = () => {
    toast.success("Company profile updated successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAIOptimize = () => {
    toast.success("AI profile suggestions generated!");
  };

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
                  <AvatarImage src={companyData.logo} alt={companyData.name} />
                  <AvatarFallback>{companyData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Company Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Your logo will appear on invoices, reports and other business documents
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Logo
                    </Button>
                    <Button variant="ghost" size="sm">
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
                      value={companyData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value)}
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
                    value={companyData.taxId}
                    onChange={(e) => handleChange("taxId", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Registration Number
                  </label>
                  <Input
                    value={companyData.registrationNumber}
                    onChange={(e) => handleChange("registrationNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fiscal Year
                  </label>
                  <Input
                    value={companyData.fiscalYear}
                    onChange={(e) => handleChange("fiscalYear", e.target.value)}
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
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminCompany;
