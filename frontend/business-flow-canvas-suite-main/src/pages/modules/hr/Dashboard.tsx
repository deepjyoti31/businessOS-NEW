
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, UserCheck, Clock, BarChart2, Loader2 } from "lucide-react";
import HRService from "@/services/HRService";
import { useToast } from "@/components/ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";

// Helper function to format dates in a user-friendly way
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

const HRDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [onLeaveEmployees, setOnLeaveEmployees] = useState(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [recentHires, setRecentHires] = useState<any[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch employees
        const employeesResponse = await HRService.getEmployees(1, 100);
        setTotalEmployees(employeesResponse.pagination.total_count);

        // Count active and on leave employees
        const active = employeesResponse.items.filter(emp => emp.status === "Active").length;
        const onLeave = employeesResponse.items.filter(emp => emp.status === "On Leave").length;
        setActiveEmployees(active);
        setOnLeaveEmployees(onLeave);

        // Get recent hires (sort by hire date descending)
        const sortedEmployees = [...employeesResponse.items].sort((a, b) =>
          new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime()
        );
        setRecentHires(sortedEmployees.slice(0, 3));

        // Fetch departments
        const departmentsData = await HRService.getDepartments();
        setDepartments(departmentsData.map(dept => dept.name));
      } catch (error) {
        console.error("Error fetching HR dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load HR dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Quick stats with real data
  const quickStats = [
    {
      title: "Total Employees",
      value: isLoading ? "..." : totalEmployees.toString(),
      change: isLoading ? "Loading..." : `${activeEmployees} active, ${onLeaveEmployees} on leave`,
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Departments",
      value: isLoading ? "..." : departments.length.toString(),
      change: isLoading ? "Loading..." : "Active departments",
      icon: <UserCheck className="h-5 w-5 text-green-600" />
    },
    {
      title: "Recent Hires",
      value: isLoading ? "..." : recentHires.length.toString(),
      change: isLoading ? "Loading..." : "In the last 30 days",
      icon: <Clock className="h-5 w-5 text-amber-600" />
    },
    {
      title: "Employee Retention",
      value: isLoading ? "..." : "100%",
      change: isLoading ? "Loading..." : "No terminations this quarter",
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                  <span className="block font-medium mb-1 text-blue-700">Department Analysis</span>
                  <span>
                    {departments.length > 0
                      ? `You have ${departments.length} departments with ${totalEmployees} employees. Consider reviewing department balance.`
                      : "You haven't set up any departments yet. Start by creating departments and assigning employees."}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                  <span className="block font-medium mb-1 text-amber-700">Employee Status</span>
                  <span>
                    {totalEmployees > 0
                      ? `${activeEmployees} active employees (${Math.round((activeEmployees / totalEmployees) * 100)}% of workforce), ${onLeaveEmployees} on leave.`
                      : "No employees in the system yet. Start by adding your first employee."}
                  </span>
                </div>
                <Link to="/dashboard/ai-assistants">
                  <Button className="w-full">Ask HR Assistant</Button>
                </Link>
              </>
            )}
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentHires.length > 0 ? (
              <div className="space-y-4">
                {recentHires.map((employee, index) => (
                  <div key={employee.id} className="flex gap-3 items-start">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New employee onboarded</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.first_name} {employee.last_name} joined as {employee.position}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(employee.hire_date)}
                      </p>
                    </div>
                  </div>
                ))}

                {recentHires.length < 3 && (
                  <div className="flex gap-3 items-start">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Department Distribution</p>
                      <p className="text-xs text-muted-foreground">
                        {departments.length} active departments with employees
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Updated today</p>
                    </div>
                  </div>
                )}

                {recentHires.length < 2 && (
                  <div className="flex gap-3 items-start">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <BarChart2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Employee Status</p>
                      <p className="text-xs text-muted-foreground">
                        {activeEmployees} active, {onLeaveEmployees} on leave
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Updated today</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No recent HR activity to display</p>
                <Button variant="outline" className="mt-2" asChild>
                  <Link to="/dashboard/hr/employees/new">Add First Employee</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
