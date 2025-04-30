
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Shield,
  Building,
  BarChart2,
  Settings,
  FileArchive,
  Globe,
  Database
} from "lucide-react";

const AdminDashboard = () => {
  const adminModules = [
    {
      title: "Users & Access",
      description: "Manage users and their access rights",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      href: "/dashboard/administration/users",
      stats: "15 active users",
    },
    {
      title: "Roles & Permissions",
      description: "Configure roles and set permissions",
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      href: "/dashboard/administration/roles",
      stats: "5 roles defined",
    },
    {
      title: "Company Profile",
      description: "Update your company information",
      icon: <Building className="h-8 w-8 text-indigo-500" />,
      href: "/dashboard/administration/company",
      stats: "Last updated 14 days ago",
    },
    {
      title: "AI Assistants",
      description: "Configure AI assistants for workflows",
      icon: <BarChart2 className="h-8 w-8 text-emerald-500" />,
      href: "/dashboard/administration/ai",
      stats: "3 assistants active",
    },
    {
      title: "System Settings",
      description: "Customize system preferences",
      icon: <Settings className="h-8 w-8 text-amber-500" />,
      href: "/dashboard/administration/settings",
      stats: "7 configurable settings",
    },
    {
      title: "Audit Logs",
      description: "Monitor system activities",
      icon: <FileArchive className="h-8 w-8 text-rose-500" />,
      href: "/dashboard/administration/logs",
      stats: "217 activities this month",
    },
    {
      title: "Integrations",
      description: "Connect external services",
      icon: <Globe className="h-8 w-8 text-sky-500" />,
      href: "/dashboard/administration/integrations",
      stats: "2 active integrations",
    },
    {
      title: "Backup & Data",
      description: "Manage data and backups",
      icon: <Database className="h-8 w-8 text-teal-500" />,
      href: "/dashboard/administration/data",
      stats: "Last backup 3 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Administration</h1>
        <p className="text-muted-foreground">
          Manage your business operations and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {adminModules.map((module) => (
          <Link key={module.href} to={module.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {module.icon}
                </div>
                <CardTitle className="mt-2">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-muted-foreground">
                  {module.stats}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Administration Assistant</CardTitle>
          <CardDescription>
            Get help with common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Our AI assistant can help you with various administrative tasks. Try asking about:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Suggest user permissions</Button>
            <Button variant="outline" size="sm">Optimize system settings</Button>
            <Button variant="outline" size="sm">Security recommendations</Button>
            <Button variant="outline" size="sm">Data backup plan</Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask the AI administration assistant..."
              className="w-full pr-24"
            />
            <Button className="absolute right-1 top-1">
              Ask
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
