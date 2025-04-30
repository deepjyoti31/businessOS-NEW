
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Marketing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock campaign data
  const campaigns = [
    {
      id: "CAM-001",
      name: "Spring Product Launch",
      status: "Active",
      budget: 15000,
      spent: 7800,
      leads: 245,
      conversion: 3.8,
      startDate: "2025-03-01",
      endDate: "2025-04-15"
    },
    {
      id: "CAM-002",
      name: "Email Re-engagement",
      status: "Active",
      budget: 5000,
      spent: 2300,
      leads: 168,
      conversion: 2.5,
      startDate: "2025-03-10",
      endDate: "2025-03-31"
    },
    {
      id: "CAM-003",
      name: "Social Media Contest",
      status: "Planned",
      budget: 8000,
      spent: 0,
      leads: 0,
      conversion: 0,
      startDate: "2025-04-01",
      endDate: "2025-04-30"
    },
    {
      id: "CAM-004",
      name: "Winter Holiday Sale",
      status: "Completed",
      budget: 25000,
      spent: 24750,
      leads: 520,
      conversion: 5.2,
      startDate: "2024-11-15",
      endDate: "2024-12-31"
    },
    {
      id: "CAM-005",
      name: "Trade Show Booth",
      status: "Active",
      budget: 12000,
      spent: 9500,
      leads: 86,
      conversion: 7.3,
      startDate: "2025-03-15",
      endDate: "2025-03-18"
    },
  ];

  // Mock channel performance data
  const channelData = [
    { name: 'Social Media', value: 35 },
    { name: 'Email', value: 25 },
    { name: 'Organic Search', value: 20 },
    { name: 'Paid Search', value: 12 },
    { name: 'Referral', value: 8 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock lead conversion data
  const conversionData = [
    { month: 'Jan', leads: 120, customers: 24 },
    { month: 'Feb', leads: 150, customers: 28 },
    { month: 'Mar', leads: 180, customers: 36 },
    { month: 'Apr', leads: 220, customers: 48 },
    { month: 'May', leads: 260, customers: 56 },
    { month: 'Jun', leads: 300, customers: 68 },
  ];

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Marketing</h1>
        <p className="text-muted-foreground">
          Manage campaigns, content, and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">5 active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+15.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{campaign.name}</h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              campaign.status === "Active"
                                ? "bg-green-50 text-green-700"
                                : campaign.status === "Planned"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{campaign.id} • {campaign.startDate} to {campaign.endDate}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Spent</p>
                          <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Leads</p>
                          <p className="font-medium">{campaign.leads}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Conversion</p>
                          <p className="font-medium">{campaign.conversion}%</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No campaigns found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                  <CardDescription>
                    Upcoming content publication schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                        05<br/>Apr
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Industry Trends Q2 2025</p>
                        <p className="text-sm text-muted-foreground">Blog post • Draft ready for review</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-medium">
                        10<br/>Apr
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Customer Success Story: Acme Corp</p>
                        <p className="text-sm text-muted-foreground">Case Study • Interview scheduled</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-medium">
                        12<br/>Apr
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Product Feature Spotlight</p>
                        <p className="text-sm text-muted-foreground">Video • Script in progress</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        18<br/>Apr
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Monthly Newsletter</p>
                        <p className="text-sm text-muted-foreground">Email • Planning stage</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>
                  Most popular content this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>How to Maximize ROI</span>
                      <span className="font-medium">4.8K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2025 Industry Report</span>
                      <span className="font-medium">3.2K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Product Update Webinar</span>
                      <span className="font-medium">2.9K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '55%'}}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Customer Success Story</span>
                      <span className="font-medium">1.7K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Lead Conversion</CardTitle>
                <CardDescription>
                  Monthly leads and customer conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="customers" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Distribution by channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {channelData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Management</CardTitle>
              <CardDescription>
                Manage your social media accounts and posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                This section is under development. Check back soon for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
