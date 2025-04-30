import { useState } from "react";
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
  Database
} from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import CalendarView from "@/components/dashboard/CalendarView";

const Dashboard = () => {
  // Mock data for dashboard
  const kpis = [
    {
      title: "Total Revenue",
      value: "$125,430.00",
      change: { value: 12.5, percentage: true },
      trend: "up" as const,
    },
    {
      title: "Active Projects",
      value: "15",
      change: { value: 3, percentage: false },
      trend: "up" as const,
    },
    {
      title: "Open Tickets",
      value: "38",
      change: { value: -5, percentage: false },
      trend: "down" as const,
    },
    {
      title: "New Leads",
      value: "27",
      change: { value: 8.3, percentage: true },
      trend: "up" as const,
    },
  ];

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

  const activities = [
    {
      id: 1,
      type: "task",
      title: "New task assigned: Update sales dashboard",
      time: "10 minutes ago",
      user: "Jane Cooper",
    },
    {
      id: 2,
      type: "comment",
      title: "Comment on Project X: Let's schedule a meeting",
      time: "1 hour ago",
      user: "Wade Warren",
    },
    {
      id: 3,
      type: "file",
      title: "New file uploaded: Q3 Financial Report.pdf",
      time: "3 hours ago",
      user: "Esther Howard",
    },
    {
      id: 4,
      type: "sale",
      title: "New deal closed with Acme Corp: $12,500",
      time: "Yesterday",
      user: "Cameron Williamson",
    },
    {
      id: 5,
      type: "meeting",
      title: "Team meeting scheduled for tomorrow at 10:00 AM",
      time: "Yesterday",
      user: "Brooklyn Simmons",
    },
  ];

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
                    ) : activity.type === "comment" ? (
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
                  </div>
                </div>
              ))}
            </div>
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
                <h3 className="text-base font-medium">Business Optimizer</h3>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                  <span className="block font-medium mb-1 text-business-700">Cash Flow Optimization</span>
                  <span>Based on current trends, optimizing payment terms could improve your cash flow by 15%.</span>
                </div>
                <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                  <span className="block font-medium mb-1 text-business-700">Sales Performance</span>
                  <span>Your sales team is 24% more effective on Tuesdays and Wednesdays. Consider scheduling more client calls on these days.</span>
                </div>
                <div className="p-3 bg-business-50 rounded-md border border-business-100 text-sm">
                  <span className="block font-medium mb-1 text-business-700">Inventory Alert</span>
                  <span>Product SKU-1242 is projected to run out of stock in 2 weeks based on current sales velocity.</span>
                </div>
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
