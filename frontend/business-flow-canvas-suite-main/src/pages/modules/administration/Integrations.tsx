
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Globe,
  Plus,
  Search,
  CreditCard,
  Mail,
  Github,
  Calendar,
  FileText,
  MessageSquare,
  Lock,
  Save,
  RefreshCw,
  Sparkles
} from "lucide-react";

const AdminIntegrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Integration status toggles
  const [activeIntegrations, setActiveIntegrations] = useState<{[key: string]: boolean}>({
    'stripe': true,
    'gmail': true,
    'github': false,
    'calendar': true,
    'slack': false,
    'dropbox': false,
    'chatgpt': true,
    'zapier': false
  });
  
  const handleIntegrationToggle = (key: string) => {
    setActiveIntegrations(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      toast(newState[key] ? "Integration enabled" : "Integration disabled", {
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} integration has been ${newState[key] ? "enabled" : "disabled"}`,
      });
      return newState;
    });
  };

  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing integration',
      icon: <CreditCard className="h-10 w-10 text-indigo-500" />,
      category: 'Finance',
      setupStatus: 'Configured'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Email service integration',
      icon: <Mail className="h-10 w-10 text-red-500" />,
      category: 'Communication',
      setupStatus: 'Configured'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Code repository integration',
      icon: <Github className="h-10 w-10 text-gray-700" />,
      category: 'Development',
      setupStatus: 'Not Configured'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Calendar and scheduling integration',
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
      category: 'Productivity',
      setupStatus: 'Configured'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team messaging integration',
      icon: <MessageSquare className="h-10 w-10 text-amber-500" />,
      category: 'Communication',
      setupStatus: 'Not Configured'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'File storage integration',
      icon: <FileText className="h-10 w-10 text-blue-700" />,
      category: 'Storage',
      setupStatus: 'Not Configured'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT API',
      description: 'AI assistant integration',
      icon: <Sparkles className="h-10 w-10 text-green-600" />,
      category: 'AI Services',
      setupStatus: 'Configured'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Workflow automation integration',
      icon: <RefreshCw className="h-10 w-10 text-orange-500" />,
      category: 'Automation',
      setupStatus: 'Not Configured'
    }
  ];

  // Filter integrations based on search term
  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 flex items-center">
            <Globe className="mr-2 h-6 w-6" />
            Integrations
          </h1>
          <p className="text-muted-foreground">
            Connect your system with external services and APIs
          </p>
        </div>
        
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Search and filter */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Integrations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {integration.icon}
                <Switch 
                  checked={activeIntegrations[integration.id]} 
                  onCheckedChange={() => handleIntegrationToggle(integration.id)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="mt-2">{integration.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={integration.setupStatus === 'Configured' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'}
                >
                  {integration.setupStatus}
                </Badge>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm">
                <span className="font-medium">Category:</span> {integration.category}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <Button variant="outline" size="sm">Configure</Button>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* API Keys Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Lock className="mr-2 h-5 w-5" />
          API Keys & Authentication
        </h2>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Stripe API Key</p>
                  <p className="text-sm text-muted-foreground">Payment processing integration</p>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="relative">
                <Input value="sk_test_•••••••••••••••••••••••••" type="password" readOnly />
                <Button className="absolute right-1 top-1" size="sm">
                  Show
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">ChatGPT API Key</p>
                  <p className="text-sm text-muted-foreground">AI services integration</p>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="relative">
                <Input value="sk-•••••••••••••••••••••••••••••••" type="password" readOnly />
                <Button className="absolute right-1 top-1" size="sm">
                  Show
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Update Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OAuth Applications */}
      <div className="mt-4">
        <h2 className="text-lg font-medium mb-4">OAuth Connected Applications</h2>
        
        <div className="space-y-2">
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="font-medium">Google Workspace</p>
                <p className="text-sm text-muted-foreground">Connected on Apr 15, 2023</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Disconnect</Button>
          </Card>
          
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-muted-foreground">Connected on Apr 15, 2023</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Disconnect</Button>
          </Card>
        </div>
      </div>

      {/* AI Integration Assistant */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-10 w-10 text-blue-500" />
            <div>
              <h3 className="font-medium">AI Integration Assistant</h3>
              <p className="text-sm mt-1 text-muted-foreground">
                Based on your business needs, we recommend integrating with Slack to improve team communication and Zapier to automate repetitive tasks.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-100">
                  Show Recommendations
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIntegrations;
