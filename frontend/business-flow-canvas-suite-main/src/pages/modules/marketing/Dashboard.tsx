
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon } from "lucide-react";

// Mock data for marketing dashboard
const campaignPerformanceData = [
  { name: 'Email', leads: 120, conversions: 45, roi: 320 },
  { name: 'Social', leads: 98, conversions: 22, roi: 210 },
  { name: 'Search', leads: 86, conversions: 36, roi: 480 },
  { name: 'Content', leads: 99, conversions: 28, roi: 390 },
  { name: 'Events', leads: 45, conversions: 12, roi: 250 },
];

const trafficSourceData = [
  { name: 'Direct', value: 30 },
  { name: 'Organic Search', value: 25 },
  { name: 'Paid Search', value: 15 },
  { name: 'Social Media', value: 20 },
  { name: 'Referral', value: 10 },
];

const leadTrendData = [
  { month: 'Jan', leads: 45 },
  { month: 'Feb', leads: 52 },
  { month: 'Mar', leads: 48 },
  { month: 'Apr', leads: 61 },
  { month: 'May', leads: 68 },
  { month: 'Jun', leads: 73 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MarketingDashboard = () => {
  // Calculate totals
  const totalLeads = campaignPerformanceData.reduce((sum, item) => sum + item.leads, 0);
  const totalConversions = campaignPerformanceData.reduce((sum, item) => sum + item.conversions, 0);
  
  // Calculate month-over-month lead growth
  const currentMonthLeads = leadTrendData[leadTrendData.length - 1].leads;
  const previousMonthLeads = leadTrendData[leadTrendData.length - 2].leads;
  const leadGrowth = ((currentMonthLeads - previousMonthLeads) / previousMonthLeads) * 100;

  // Calculate conversion rate
  const conversionRate = (totalConversions / totalLeads) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Marketing Dashboard</h1>
        <p className="text-muted-foreground">
          Track your marketing performance and campaign results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <div className="text-xs text-muted-foreground">
              {leadGrowth >= 0 ? "+" : ""}{leadGrowth.toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">
              +2.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-muted-foreground">
              Across 4 channels
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$27.50</div>
            <div className="text-xs text-muted-foreground">
              -5.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Generation Trend</CardTitle>
            <CardDescription>Monthly lead acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={leadTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Leads" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Website traffic distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Lead generation and conversion by channel</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Last 30 days</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="leads" fill="#8884d8" name="Leads" />
                <Bar yAxisId="left" dataKey="conversions" fill="#82ca9d" name="Conversions" />
                <Bar yAxisId="right" dataKey="roi" fill="#ffc658" name="ROI (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Top Campaigns</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="social">Social Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Summer Promotion Email</h4>
                      <p className="text-muted-foreground text-sm">Email Campaign</p>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Product Launch Webinar</h4>
                      <p className="text-muted-foreground text-sm">Event Campaign</p>
                    </div>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Google Search Campaign</h4>
                      <p className="text-muted-foreground text-sm">PPC Campaign</p>
                    </div>
                    <span className="text-sm font-medium">63%</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Instagram Story Ads</h4>
                      <p className="text-muted-foreground text-sm">Social Campaign</p>
                    </div>
                    <span className="text-sm font-medium">54%</span>
                  </div>
                  <Progress value={54} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Ultimate Guide to Product X</h4>
                      <p className="text-muted-foreground text-sm">Blog Post • 12,540 views</p>
                    </div>
                    <span className="text-sm font-medium">92 leads</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Industry Trends Report 2025</h4>
                      <p className="text-muted-foreground text-sm">Whitepaper • 8,230 views</p>
                    </div>
                    <span className="text-sm font-medium">78 leads</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Product Demo Video</h4>
                      <p className="text-muted-foreground text-sm">Video • 15,620 views</p>
                    </div>
                    <span className="text-sm font-medium">65 leads</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Customer Success Story: Acme Corp</h4>
                      <p className="text-muted-foreground text-sm">Case Study • 7,850 views</p>
                    </div>
                    <span className="text-sm font-medium">53 leads</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-muted-foreground text-sm">5,280 followers • 12,450 impressions</p>
                    </div>
                    <span className="text-sm font-medium">68 leads</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-muted-foreground text-sm">8,540 followers • 22,780 impressions</p>
                    </div>
                    <span className="text-sm font-medium">45 leads</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Facebook</h4>
                      <p className="text-muted-foreground text-sm">12,350 followers • 18,920 impressions</p>
                    </div>
                    <span className="text-sm font-medium">38 leads</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 items-center">
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-muted-foreground text-sm">6,720 followers • 15,340 impressions</p>
                    </div>
                    <span className="text-sm font-medium">24 leads</span>
                  </div>
                  <Progress value={24} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingDashboard;
