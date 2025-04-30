
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles,
  MessageSquare,
  Settings,
  Save,
  Lock,
  BarChart,
  Plus,
  CheckSquare,
  FileText,
  Users
} from "lucide-react";

const AdminAIAssistants = () => {
  const [activeAssistant, setActiveAssistant] = useState("customer-support");
  
  const assistants = [
    {
      id: "customer-support",
      name: "Customer Support Assistant",
      type: "Chat",
      description: "Helps customers with common questions and issues",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      enabled: true,
      model: "gpt-4o",
      temperature: 0.7,
      modules: ["Customer Service", "Sales", "Knowledge Base"],
      stats: { usage: "432 queries", satisfaction: "94%" }
    },
    {
      id: "data-analyst",
      name: "Business Intelligence Assistant",
      type: "Analytics",
      description: "Analyzes business data and suggests insights",
      icon: <BarChart className="h-8 w-8 text-purple-500" />,
      enabled: true,
      model: "gpt-4o",
      temperature: 0.2,
      modules: ["Finance", "Business Intelligence", "Sales"],
      stats: { usage: "215 analyses", satisfaction: "92%" }
    },
    {
      id: "task-manager",
      name: "Task Assistant",
      type: "Productivity",
      description: "Helps organize and prioritize tasks",
      icon: <CheckSquare className="h-8 w-8 text-green-500" />,
      enabled: true,
      model: "gpt-4o-mini",
      temperature: 0.5,
      modules: ["Projects", "Tasks"],
      stats: { usage: "356 tasks managed", satisfaction: "88%" }
    },
    {
      id: "content-creator",
      name: "Document Assistant",
      type: "Content",
      description: "Helps draft and edit business documents",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      enabled: false,
      model: "gpt-4o-mini",
      temperature: 0.8,
      modules: ["Documents", "Marketing"],
      stats: { usage: "124 documents", satisfaction: "90%" }
    },
    {
      id: "hr-assistant",
      name: "HR Assistant",
      type: "HR",
      description: "Assists with employee-related questions and tasks",
      icon: <Users className="h-8 w-8 text-rose-500" />,
      enabled: false,
      model: "gpt-4o-mini",
      temperature: 0.6,
      modules: ["HR", "Administration"],
      stats: { usage: "98 queries", satisfaction: "87%" }
    }
  ];
  
  const findAssistant = (id: string) => assistants.find(a => a.id === id);
  const currentAssistant = findAssistant(activeAssistant) || assistants[0];
  
  const handleSave = () => {
    toast.success("AI Assistant settings saved successfully!");
  };
  
  const toggleAssistant = (id: string, enabled: boolean) => {
    // In a real app, this would update the state
    toast(enabled ? "Assistant enabled" : "Assistant disabled", {
      description: `${findAssistant(id)?.name} is now ${enabled ? "enabled" : "disabled"}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center">
          <Sparkles className="mr-2 h-6 w-6" />
          AI Assistants
        </h1>
        <p className="text-muted-foreground">
          Configure AI assistants to help your team with various tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistants List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Available Assistants</h2>
            <Button size="sm" variant="outline" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Assistant
            </Button>
          </div>
          
          <div className="space-y-3">
            {assistants.map((assistant) => (
              <Card 
                key={assistant.id} 
                className={`cursor-pointer transition-all hover:border-primary ${
                  activeAssistant === assistant.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setActiveAssistant(assistant.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {assistant.icon}
                    <div>
                      <h3 className="font-medium flex items-center">
                        {assistant.name}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {assistant.type}
                        </Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {assistant.enabled ? "Active" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={assistant.enabled}
                    onCheckedChange={(checked) => toggleAssistant(assistant.id, checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Assistant Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentAssistant.icon}
                  <div>
                    <CardTitle>{currentAssistant.name}</CardTitle>
                    <CardDescription>{currentAssistant.description}</CardDescription>
                  </div>
                </div>
                <Switch checked={currentAssistant.enabled} />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue="general">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assistant Name</label>
                      <Input defaultValue={currentAssistant.name} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assistant Type</label>
                      <Select defaultValue={currentAssistant.type.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        defaultValue={currentAssistant.description} 
                        placeholder="Describe what this assistant does"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI Model</label>
                      <Select defaultValue={currentAssistant.model}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o (Powerful)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast)</SelectItem>
                          <SelectItem value="gpt-4.5-turbo">GPT-4.5 Turbo (Advanced)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Temperature</label>
                        <span className="text-sm text-muted-foreground">{currentAssistant.temperature}</span>
                      </div>
                      <Slider 
                        defaultValue={[currentAssistant.temperature * 100]} 
                        max={100} 
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>More precise</span>
                        <span>More creative</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="knowledge" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Knowledge Sources</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Source
                      </Button>
                    </div>
                    
                    <Card className="border-dashed">
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Source Type</label>
                            <Select defaultValue="document">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="document">Document Library</SelectItem>
                                <SelectItem value="website">Website</SelectItem>
                                <SelectItem value="database">Database</SelectItem>
                                <SelectItem value="api">API</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Source Name</label>
                            <Input placeholder="Company Knowledge Base" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <h3 className="font-medium">Enable in Modules</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {currentAssistant.modules.map((module) => (
                        <div key={module} className="flex items-center space-x-2">
                          <Switch id={`module-${module}`} defaultChecked />
                          <label htmlFor={`module-${module}`} className="text-sm">
                            {module}
                          </label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Switch id="module-inventory" />
                        <label htmlFor="module-inventory" className="text-sm">
                          Inventory
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="module-projects" />
                        <label htmlFor="module-projects" className="text-sm">
                          Project Management
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4 pt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium flex items-center mb-4">
                        <Lock className="mr-2 h-4 w-4" />
                        Access Control
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Access User Data</p>
                            <p className="text-xs text-muted-foreground">
                              Allow assistant to read user profiles and activity
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Access Company Data</p>
                            <p className="text-xs text-muted-foreground">
                              Allow assistant to read company information and records
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Write Access</p>
                            <p className="text-xs text-muted-foreground">
                              Allow assistant to create or modify data
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">External API Access</p>
                            <p className="text-xs text-muted-foreground">
                              Allow assistant to call external services
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">System Prompt</label>
                      <Textarea 
                        rows={5}
                        placeholder="You are a helpful AI assistant for a small business..."
                        defaultValue="You are an AI assistant for a small business. Your primary role is to help users with their questions related to our products and services. Be professional but friendly, and always try to provide accurate information."
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Define how the AI assistant should behave and what context it should have
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Response Length</label>
                        <Input type="number" defaultValue={500} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Context Window</label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (5 messages)</SelectItem>
                            <SelectItem value="medium">Medium (10 messages)</SelectItem>
                            <SelectItem value="large">Large (20 messages)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Usage Limits</label>
                      <Input 
                        type="number" 
                        defaultValue={1000}
                        placeholder="Maximum queries per month" 
                      />
                      <p className="text-xs text-muted-foreground">
                        Set to 0 for unlimited usage (not recommended)
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Usage Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total Usage</p>
                      <p className="text-xl font-bold">{currentAssistant.stats.usage}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                      <p className="text-xl font-bold">{currentAssistant.stats.satisfaction}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAIAssistants;
