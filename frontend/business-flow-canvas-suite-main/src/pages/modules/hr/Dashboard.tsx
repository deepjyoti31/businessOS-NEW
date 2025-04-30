
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, UserCheck, Clock, BarChart2 } from "lucide-react";

const HRDashboard = () => {
  // Quick stats
  const quickStats = [
    {
      title: "Total Employees",
      value: "27",
      change: "+3 this quarter",
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Open Positions",
      value: "4",
      change: "2 in final interviews",
      icon: <UserCheck className="h-5 w-5 text-green-600" />
    },
    {
      title: "Time Off Requests",
      value: "8",
      change: "3 pending approval",
      icon: <Clock className="h-5 w-5 text-amber-600" />
    },
    {
      title: "Avg. Performance",
      value: "8.2",
      change: "+0.4 vs. last review",
      icon: <BarChart2 className="h-5 w-5 text-purple-600" />
    }
  ];

  // Quick links for HR module
  const quickLinks = [
    {
      title: "Employees",
      description: "View and manage employee directory",
      path: "/dashboard/hr/employees",
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Recruitment",
      description: "Manage job openings and candidates",
      path: "/dashboard/hr/recruitment",
      icon: <UserCheck className="h-6 w-6 text-green-600" />
    },
    {
      title: "Time Off",
      description: "Handle employee time off requests",
      path: "/dashboard/hr/time-off",
      icon: <Clock className="h-6 w-6 text-amber-600" />
    },
    {
      title: "Performance",
      description: "Track employee performance metrics",
      path: "/dashboard/hr/performance",
      icon: <BarChart2 className="h-6 w-6 text-purple-600" />
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">HR Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your workforce and human resources operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>HR Operations</CardTitle>
            <CardDescription>
              Quick access to key HR functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link.path} className="block">
                  <div className="group rounded-lg border p-4 hover:bg-muted transition-colors h-full flex flex-col">
                    <div className="mb-3">{link.icon}</div>
                    <h3 className="font-medium mb-1">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* AI HR Assistant */}
        <Card>
          <CardHeader>
            <CardTitle>AI HR Assistant</CardTitle>
            <CardDescription>
              Get AI-powered advice for HR operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
              <span className="block font-medium mb-1 text-blue-700">Hiring Recommendation</span>
              <span>Based on current team composition, you should prioritize hiring a UX Designer to balance your engineering team.</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
              <span className="block font-medium mb-1 text-amber-700">Employee Satisfaction</span>
              <span>Recent feedback suggests scheduling flexibility is the top request from employees.</span>
            </div>
            <Button className="w-full">Ask HR Assistant</Button>
          </CardContent>
        </Card>
        
        {/* Recent HR Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent HR Activity</CardTitle>
            <CardDescription>
              Latest updates in your HR operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New employee onboarded</p>
                  <p className="text-xs text-muted-foreground">Alex Johnson joined as Senior Developer</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time off request approved</p>
                  <p className="text-xs text-muted-foreground">Emily Davis - 5 days vacation</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BarChart2 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Performance review completed</p>
                  <p className="text-xs text-muted-foreground">4 team members in Engineering</p>
                  <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
