import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Icons
import {
  Grid3x3,
  Users,
  Settings,
  User,
  BarChart,
  DatabaseIcon,
  HelpCircle,
  Building,
  UserCheck,
  ShoppingCart,
  MessageSquare,
  CheckSquare,
  BarChart2,
  FileText,
  Clock,
  Shield,
  Globe,
  FileArchive,
  Bell,
  Wallet,
  Headphones,
  Folder,
  Megaphone
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [openSubmenus, setOpenSubmenus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const path = location.pathname;
    setActiveItem(path);

    // Auto-expand submenu based on active path
    if (path.includes('/dashboard/administration/')) {
      setOpenSubmenus(prev => ({ ...prev, administration: true }));
    }
    if (path.includes('/dashboard/finance/')) {
      setOpenSubmenus(prev => ({ ...prev, finance: true }));
    }
    if (path.includes('/dashboard/hr/')) {
      setOpenSubmenus(prev => ({ ...prev, hr: true }));
    }
    if (path.includes('/dashboard/sales/')) {
      setOpenSubmenus(prev => ({ ...prev, sales: true }));
    }
    if (path.includes('/dashboard/marketing/')) {
      setOpenSubmenus(prev => ({ ...prev, marketing: true }));
    }
    if (path.includes('/dashboard/customer-service/')) {
      setOpenSubmenus(prev => ({ ...prev, customerService: true }));
    }
    if (path.includes('/dashboard/projects/')) {
      setOpenSubmenus(prev => ({ ...prev, projects: true }));
    }
    if (path.includes('/dashboard/documents/')) {
      setOpenSubmenus(prev => ({ ...prev, documents: true }));
    }
    if (path.includes('/dashboard/inventory/')) {
      setOpenSubmenus(prev => ({ ...prev, inventory: true }));
    }
    if (path.includes('/dashboard/business-intelligence/')) {
      setOpenSubmenus(prev => ({ ...prev, businessIntelligence: true }));
    }
  }, [location]);

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSubmenuActive = (basePath: string) => {
    return location.pathname.startsWith(basePath);
  };

  // Define userNavItems that was missing
  const userNavItems = [
    {
      title: "My Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "#",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  // Main nav items
  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Grid3x3 className="h-5 w-5" />,
      color: "text-sky-500",
    },
    {
      title: "Team Chat",
      href: "/dashboard/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      color: "text-amber-500",
    },
    {
      title: "Document Editor",
      href: "/dashboard/document-editor",
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "User Activity",
      href: "/dashboard/activity",
      icon: <Clock className="h-5 w-5" />,
      color: "text-rose-500",
    },
    {
      title: "Team Collaboration",
      href: "/dashboard/team-collaboration",
      icon: <Users className="h-5 w-5" />,
      color: "text-indigo-500",
    }
  ];

  // Administration submenu items
  const administrationItems = [
    {
      title: "Dashboard",
      href: "/dashboard/administration",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Users & Access",
      href: "/dashboard/administration/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Roles & Permissions",
      href: "/dashboard/administration/roles",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      title: "Company Profile",
      href: "/dashboard/administration/company",
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "AI Assistants",
      href: "/dashboard/administration/ai",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "System Settings",
      href: "/dashboard/administration/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Audit Logs",
      href: "/dashboard/administration/logs",
      icon: <FileArchive className="h-4 w-4" />,
    },
    {
      title: "Integrations",
      href: "/dashboard/administration/integrations",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      title: "Backup & Data",
      href: "/dashboard/administration/data",
      icon: <DatabaseIcon className="h-4 w-4" />,
    },
  ];

  // Finance submenu items
  const financeItems = [
    {
      title: "Dashboard",
      href: "/dashboard/finance",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Transactions",
      href: "/dashboard/finance/transactions",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/dashboard/finance/reports",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Invoicing",
      href: "/dashboard/finance/invoicing",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Budgeting",
      href: "/dashboard/finance/budgeting",
      icon: <DatabaseIcon className="h-4 w-4" />,
    },
  ];

  // HR submenu items
  const hrItems = [
    {
      title: "Dashboard",
      href: "/dashboard/hr",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Employees",
      href: "/dashboard/hr/employees",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Recruitment",
      href: "/dashboard/hr/recruitment",
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      title: "Time Off",
      href: "/dashboard/hr/time-off",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Performance",
      href: "/dashboard/hr/performance",
      icon: <BarChart2 className="h-4 w-4" />,
    },
  ];

  // Sales submenu items
  const salesItems = [
    {
      title: "Dashboard",
      href: "/dashboard/sales",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Leads",
      href: "/dashboard/sales/leads",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Deals",
      href: "/dashboard/sales/deals",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Pipeline",
      href: "/dashboard/sales/pipeline",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Customers",
      href: "/dashboard/sales/customers",
      icon: <UserCheck className="h-4 w-4" />,
    },
  ];

  // Marketing submenu items
  const marketingItems = [
    {
      title: "Dashboard",
      href: "/dashboard/marketing",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Campaigns",
      href: "/dashboard/marketing/campaigns",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/marketing/analytics",
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      title: "Content",
      href: "/dashboard/marketing/content",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Social Media",
      href: "/dashboard/marketing/social",
      icon: <Globe className="h-4 w-4" />,
    },
  ];

  // Customer Service submenu items
  const customerServiceItems = [
    {
      title: "Dashboard",
      href: "/dashboard/customer-service",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Tickets",
      href: "/dashboard/customer-service/tickets",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Knowledge Base",
      href: "/dashboard/customer-service/knowledge",
      icon: <Folder className="h-4 w-4" />,
    },
    {
      title: "Chat Support",
      href: "/dashboard/customer-service/chat",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Feedback",
      href: "/dashboard/customer-service/feedback",
      icon: <Headphones className="h-4 w-4" />,
    },
  ];

  // Projects submenu items
  const projectsItems = [
    {
      title: "Dashboard",
      href: "/dashboard/projects",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "All Projects",
      href: "/dashboard/projects/list",
      icon: <Folder className="h-4 w-4" />,
    },
    {
      title: "Tasks",
      href: "/dashboard/projects/tasks",
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/projects/calendar",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Team",
      href: "/dashboard/projects/team",
      icon: <Users className="h-4 w-4" />,
    },
  ];

  // Documents submenu items
  const documentsItems = [
    {
      title: "Dashboard",
      href: "/dashboard/documents",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "All Files",
      href: "/dashboard/documents/all-files",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Shared",
      href: "/dashboard/documents/shared",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Templates",
      href: "/dashboard/documents/templates",
      icon: <Folder className="h-4 w-4" />,
    },
    {
      title: "Archive",
      href: "/dashboard/documents/archive",
      icon: <FileArchive className="h-4 w-4" />,
    },
  ];

  // Inventory submenu items
  const inventoryItems = [
    {
      title: "Dashboard",
      href: "/dashboard/inventory",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Products",
      href: "/dashboard/inventory/products",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Stock",
      href: "/dashboard/inventory/stock",
      icon: <DatabaseIcon className="h-4 w-4" />,
    },
    {
      title: "Suppliers",
      href: "/dashboard/inventory/suppliers",
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/dashboard/inventory/orders",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  // BI submenu items
  const businessIntelligenceItems = [
    {
      title: "Dashboard",
      href: "/dashboard/business-intelligence",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/dashboard/business-intelligence/reports",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/business-intelligence/analytics",
      icon: <BarChart2 className="h-4 w-4" />,
    },
    {
      title: "Data Sources",
      href: "/dashboard/business-intelligence/sources",
      icon: <DatabaseIcon className="h-4 w-4" />,
    },
    {
      title: "AI Insights",
      href: "/dashboard/business-intelligence/insights",
      icon: <BarChart className="h-4 w-4" />,
    },
  ];

  // Replace the simple module nav items with collapsible submenus
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border",
        className
      )}
    >
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold">BusinessOS</h2>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Main
            </h3>
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={activeItem === item.href ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", item.color)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-3 py-2">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Modules
            </h3>
            <nav className="space-y-1">
              {/* Administration submenu */}
              <Collapsible
                open={openSubmenus.administration || isSubmenuActive("/dashboard/administration")}
                onOpenChange={() => toggleSubmenu("administration")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/administration") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/administration") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5" />
                      <span className="ml-3">Administration</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.administration || isSubmenuActive("/dashboard/administration")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {administrationItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Finance submenu */}
              <Collapsible
                open={openSubmenus.finance || isSubmenuActive("/dashboard/finance")}
                onOpenChange={() => toggleSubmenu("finance")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/finance") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/finance") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5" />
                      <span className="ml-3">Finance</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.finance || isSubmenuActive("/dashboard/finance")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {financeItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* HR submenu */}
              <Collapsible
                open={openSubmenus.hr || isSubmenuActive("/dashboard/hr")}
                onOpenChange={() => toggleSubmenu("hr")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/hr") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/hr") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5" />
                      <span className="ml-3">Human Resources</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.hr || isSubmenuActive("/dashboard/hr")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {hrItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Sales submenu */}
              <Collapsible
                open={openSubmenus.sales || isSubmenuActive("/dashboard/sales")}
                onOpenChange={() => toggleSubmenu("sales")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/sales") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/sales") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="ml-3">Sales</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.sales || isSubmenuActive("/dashboard/sales")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {salesItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Marketing submenu */}
              <Collapsible
                open={openSubmenus.marketing || isSubmenuActive("/dashboard/marketing")}
                onOpenChange={() => toggleSubmenu("marketing")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/marketing") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/marketing") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Megaphone className="h-5 w-5" />
                      <span className="ml-3">Marketing</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.marketing || isSubmenuActive("/dashboard/marketing")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {marketingItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Customer Service submenu */}
              <Collapsible
                open={openSubmenus.customerService || isSubmenuActive("/dashboard/customer-service")}
                onOpenChange={() => toggleSubmenu("customerService")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/customer-service") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/customer-service") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5" />
                      <span className="ml-3">Customer Service</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.customerService || isSubmenuActive("/dashboard/customer-service")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {customerServiceItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Projects submenu */}
              <Collapsible
                open={openSubmenus.projects || isSubmenuActive("/dashboard/projects")}
                onOpenChange={() => toggleSubmenu("projects")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/projects") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/projects") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <Folder className="h-5 w-5" />
                      <span className="ml-3">Projects</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.projects || isSubmenuActive("/dashboard/projects")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {projectsItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Documents submenu */}
              <Collapsible
                open={openSubmenus.documents || isSubmenuActive("/dashboard/documents")}
                onOpenChange={() => toggleSubmenu("documents")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/documents") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/documents") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5" />
                      <span className="ml-3">Documents</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.documents || isSubmenuActive("/dashboard/documents")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {documentsItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Inventory submenu */}
              <Collapsible
                open={openSubmenus.inventory || isSubmenuActive("/dashboard/inventory")}
                onOpenChange={() => toggleSubmenu("inventory")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/inventory") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/inventory") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="ml-3">Inventory</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.inventory || isSubmenuActive("/dashboard/inventory")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {inventoryItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>

              {/* Business Intelligence submenu */}
              <Collapsible
                open={openSubmenus.businessIntelligence || isSubmenuActive("/dashboard/business-intelligence")}
                onOpenChange={() => toggleSubmenu("businessIntelligence")}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSubmenuActive("/dashboard/business-intelligence") ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      isSubmenuActive("/dashboard/business-intelligence") ? "bg-secondary text-secondary-foreground" : ""
                    )}
                  >
                    <div className="flex items-center">
                      <BarChart2 className="h-5 w-5" />
                      <span className="ml-3">Business Intelligence</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform duration-200 ${
                        (openSubmenus.businessIntelligence || isSubmenuActive("/dashboard/business-intelligence")) ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 pt-1">
                  <nav className="space-y-1">
                    {businessIntelligenceItems.map((item) => (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={activeItem === item.href ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm h-9"
                          size="sm"
                        >
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </Button>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t border-border">
        <nav className="space-y-1">
          {userNavItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={activeItem === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
