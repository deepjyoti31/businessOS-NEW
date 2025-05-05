import { useState, useEffect } from "react";
import {
  Settings,
  Users,
  FileText,
  ShoppingCart,
  BarChart2,
  Mail,
  Calendar,
  FolderClosed,
  PackageCheck,
  Database,
  Loader2
} from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import CalendarView from "@/components/dashboard/CalendarView";
import { useToast } from "@/components/ui/use-toast";
import { TransactionService } from "@/services/TransactionService";
import HRService from "@/services/HRService";
import { documentService } from "@/services/documentServiceInstances";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState([
    {
      title: "Total Revenue",
      value: "Loading...",
      change: { value: 0, percentage: true },
      trend: "neutral" as const,
    },
    {
      title: "Total Employees",
      value: "Loading...",
      change: { value: 0, percentage: false },
      trend: "neutral" as const,
    },
    {
      title: "Documents",
      value: "Loading...",
      change: { value: 0, percentage: false },
      trend: "neutral" as const,
    },
    {
      title: "Departments",
      value: "Loading...",
      change: { value: 0, percentage: false },
      trend: "neutral" as const,
    },
  ]);

  // Fetch real data for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Create an array to hold our KPI data
        const kpiData = [...kpis];

        // Fetch financial data
        try {
          const transactionService = TransactionService.getInstance();
          const summary = await transactionService.getTransactionSummary();

          if (summary) {
            kpiData[0] = {
              title: "Total Revenue",
              value: formatCurrency(summary.total_income || 0),
              change: {
                value: summary.income_change || 0,
                percentage: true
              },
              trend: (summary.income_change || 0) >= 0 ? "up" : "down" as const,
            };
          }
        } catch (error) {
          console.error("Error fetching financial data:", error);
        }

        // Fetch HR data
        try {
          const employeesResponse = await HRService.getEmployees(1, 100);
          const departmentsData = await HRService.getDepartments();

          if (employeesResponse) {
            kpiData[1] = {
              title: "Total Employees",
              value: employeesResponse.pagination.total_count.toString(),
              change: {
                value: employeesResponse.items.filter(emp =>
                  new Date(emp.hire_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length,
                percentage: false
              },
              trend: "up" as const,
            };
          }

          if (departmentsData) {
            kpiData[3] = {
              title: "Departments",
              value: departmentsData.length.toString(),
              change: { value: 0, percentage: false },
              trend: "neutral" as const,
            };
          }
        } catch (error) {
          console.error("Error fetching HR data:", error);
        }

        // Fetch document data
        try {
          const allFiles = await documentService.getAllFiles();

          if (allFiles) {
            const documentCount = allFiles.filter(file => !file.isFolder).length;
            const processedCount = allFiles.filter(file => !file.isFolder && file.processing_status === 'completed').length;

            kpiData[2] = {
              title: "Documents",
              value: documentCount.toString(),
              change: {
                value: processedCount,
                percentage: false
              },
              trend: "up" as const,
            };
          }
        } catch (error) {
          console.error("Error fetching document data:", error);
        }

        // Update KPIs with real data
        setKpis(kpiData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const modules = [
    {
      title: "Administration",
      icon: <Settings size={24} />,
      path: "/dashboard/administration",
      description: "Manage users, roles, and system settings",
    },
    {
      title: "Finance",
      icon: <Database size={24} />,
      path: "/dashboard/finance",
      description: "Accounting, invoicing, and financial reporting",
    },
    {
      title: "HR",
      icon: <Users size={24} />,
      path: "/dashboard/hr",
      description: "Employee management and recruitment",
    },
    {
      title: "Sales",
      icon: <ShoppingCart size={24} />,
      path: "/dashboard/sales",
      description: "Lead management and sales pipeline",
    },
    {
      title: "Marketing",
      icon: <BarChart2 size={24} />,
      path: "/dashboard/marketing",
      description: "Campaigns, content, and analytics",
    },
    {
      title: "Customer Service",
      icon: <Mail size={24} />,
      path: "/dashboard/customer-service",
      description: "Support tickets and knowledge base",
    },
    {
      title: "Projects",
      icon: <Calendar size={24} />,
      path: "/dashboard/projects",
      description: "Project planning and task management",
    },
    {
      title: "Documents",
      icon: <FileText size={24} />,
      path: "/dashboard/documents",
      description: "Store, organize, and share files",
    },
    {
      title: "Inventory",
      icon: <PackageCheck size={24} />,
      path: "/dashboard/inventory",
      description: "Product catalog and stock management",
    },
    {
      title: "Business Intelligence",
      icon: <BarChart2 size={24} />,
      path: "/dashboard/business-intelligence",
      description: "Advanced reporting and analytics",
    },
  ];

  const [activities, setActivities] = useState<any[]>([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      setIsActivitiesLoading(true);
      try {
        const AuditLogService = (await import('@/services/AuditLogService')).default;
        const auditLogService = AuditLogService.getInstance();
        const recentLogs = await auditLogService.getRecentActivity(5);

        // Transform audit logs to activity format
        const transformedActivities = recentLogs.map(log => {
          // Determine activity type based on category and action
          let type = "task";
          if (log.category === "DOCUMENT_MANAGEMENT") type = "file";
          else if (log.category === "FINANCE") type = "sale";
          else if (log.category === "USER_MANAGEMENT") type = "user";
          else if (log.category === "SYSTEM") type = "system";

          // Format the title based on action and details
          let title = log.action;
          if (log.details && log.details.message) {
            title = log.details.message;
          }

          // Format the time
          const logTime = new Date(log.created_at);
          const now = new Date();
          const diffMs = now.getTime() - logTime.getTime();
          const diffMins = Math.round(diffMs / 60000);
          const diffHours = Math.round(diffMs / 3600000);
          const diffDays = Math.round(diffMs / 86400000);

          let time = "";
          if (diffMins < 60) {
            time = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
          } else if (diffHours < 24) {
            time = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          } else {
            time = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          }

          return {
            id: log.id,
            type,
            title,
            time,
            user: log.email || "System",
            category: log.category,
            severity: log.severity
          };
        });

        setActivities(transformedActivities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setActivities([]);
      } finally {
        setIsActivitiesLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your business operations center
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Calendar View (New Component) */}
      <CalendarView />

      {/* Main content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <button className="text-sm text-business-600 hover:text-business-800">
              View all
            </button>
          </div>
          <div className="bg-card rounded-lg border shadow-sm">
            {isActivitiesLoading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-business-600" />
                <span className="ml-2 text-sm text-muted-foreground">Loading activity data...</span>
              </div>
            ) : activities.length > 0 ? (
              <div className="divide-y divide-border">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-4">
                    <div className="bg-business-50 rounded-full p-2">
                      {activity.type === "task" ? (
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
                          className="text-business-600"
                        >
                          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      ) : activity.type === "user" ? (
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
                          className="text-business-600"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      ) : activity.type === "file" ? (
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
                          className="text-business-600"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      ) : activity.type === "sale" ? (
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
                          className="text-business-600"
                        >
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      ) : (
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
                          className="text-business-600"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time} by {activity.user}
                      </p>
                      {activity.category && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {activity.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No recent activity found.</p>
                <p className="text-sm mt-1">Activity will appear here as you use the system.</p>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">AI Insights</h2>
            <div className="bg-card rounded-lg border shadow-sm p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-business-100 border border-business-300 flex items-center justify-center">
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
                    className="text-business-600"
                  >
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
                    <path d="m14 7 3 3"></path>
                    <path d="M5 6v4"></path>
                    <path d="M19 14v4"></path>
                    <path d="M10 2v2"></path>
                    <path d="M7 8H3"></path>
                    <path d="M21 16h-4"></path>
                    <path d="M11 3H9"></path>
                  </svg>
                </div>
                <h3 className="text-base font-medium">Business Insights</h3>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-business-600" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading insights...</span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                      <span className="block font-medium mb-1 text-business-700">System Setup</span>
                      <span>
                        {kpis[1].value !== "Loading..." && parseInt(kpis[1].value) > 0
                          ? `You have ${kpis[1].value} employees in the system. Consider setting up departments and roles for better organization.`
                          : "Welcome to BusinessOS! Start by adding employees and setting up your company profile."}
                      </span>
                    </div>
                    <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                      <span className="block font-medium mb-1 text-business-700">Document Management</span>
                      <span>
                        {kpis[2].value !== "Loading..." && parseInt(kpis[2].value) > 0
                          ? `You have ${kpis[2].value} documents in the system. ${kpis[2].change.value} documents have been processed with AI analysis.`
                          : "Upload your first document to start using AI-powered document analysis and insights."}
                      </span>
                    </div>
                    <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                      <span className="block font-medium mb-1 text-business-700">Financial Overview</span>
                      <span>
                        {kpis[0].value !== "Loading..." && kpis[0].value !== "$0.00"
                          ? `Your current revenue is ${kpis[0].value}. ${kpis[0].trend === "up" ? "Revenue is trending upward." : "Consider strategies to increase revenue."}`
                          : "Set up your financial accounts to start tracking revenue and expenses."}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar with modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Business Modules</h2>
          <div className="grid grid-cols-2 gap-3">
            {modules.slice(0, 6).map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                icon={module.icon}
                path={module.path}
                description={module.description}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <button className="text-sm text-business-600 hover:text-business-800">
              View all modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
