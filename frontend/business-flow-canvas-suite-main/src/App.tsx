import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import VisibilityProtection from "./components/VisibilityProtection";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";


// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import UserProfile from "./pages/dashboard/UserProfile";
import Settings from "./pages/dashboard/Settings";
import TeamCollaborationPage from "./pages/dashboard/TeamCollaborationPage";
import ChatPage from "./pages/dashboard/ChatPage";
import TaskManagerPage from "./pages/dashboard/TaskManagerPage";
import DataAnalyticsPage from "./pages/dashboard/DataAnalyticsPage";
import UserActivityPage from "./pages/dashboard/UserActivityPage";
import DocumentEditorPage from "./pages/dashboard/DocumentEditorPage";

// Module Pages
import Administration from "./pages/modules/Administration";
import Finance from "./pages/modules/Finance";
import HumanResources from "./pages/modules/HumanResources";
import Sales from "./pages/modules/Sales";
import Marketing from "./pages/modules/Marketing";
import CustomerService from "./pages/modules/CustomerService";
import ProjectManagement from "./pages/modules/ProjectManagement";
import DocumentManagement from "./pages/modules/DocumentManagement";
import Inventory from "./pages/modules/Inventory";
import BusinessIntelligence from "./pages/modules/BusinessIntelligence";

// Documents Module Pages
import DocumentsDashboard from "./pages/modules/documents/Dashboard";
import AllFiles from "./pages/modules/documents/AllFiles";
import Analysis from "./pages/modules/documents/Analysis";
import Shared from "./pages/modules/documents/Shared";
import Templates from "./pages/modules/documents/Templates";
import Archive from "./pages/modules/documents/Archive";

// Administration Subpages
import AdminDashboard from "./pages/modules/administration/Dashboard";
import AdminUsers from "./pages/modules/administration/Users";
import AdminRoles from "./pages/modules/administration/Roles";
import AdminCompany from "./pages/modules/administration/Company";
import AdminAIAssistants from "./pages/modules/administration/AIAssistants";
import AdminSettings from "./pages/modules/administration/Settings";
import AdminAuditLogs from "./pages/modules/administration/AuditLogs";
import AdminIntegrations from "./pages/modules/administration/Integrations";
import AdminData from "./pages/modules/administration/Data";

// Finance Subpages
import FinanceDashboard from "./pages/modules/finance/Dashboard";
import FinanceTransactions from "./pages/modules/finance/Transactions";
import FinanceReports from "./pages/modules/finance/Reports";
import FinanceInvoicing from "./pages/modules/finance/Invoicing";
import FinanceBudgeting from "./pages/modules/finance/Budgeting";

// HR Subpages
import HRDashboard from "./pages/modules/hr/Dashboard";
import HREmployees from "./pages/modules/hr/Employees";
import HRRecruitment from "./pages/modules/hr/Recruitment";
import HRTimeOff from "./pages/modules/hr/TimeOff";
import HRPerformance from "./pages/modules/hr/Performance";

// Sales Subpages
import SalesDashboard from "./pages/modules/sales/Dashboard";
import SalesLeads from "./pages/modules/sales/Leads";
import SalesDeals from "./pages/modules/sales/Deals";
import SalesPipeline from "./pages/modules/sales/Pipeline";
import SalesCustomers from "./pages/modules/sales/Customers";

// Marketing Subpages
import MarketingDashboard from "./pages/modules/marketing/Dashboard";
import MarketingCampaigns from "./pages/modules/marketing/Campaigns";

// Other Pages
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <VisibilityProtection />
          <Routes>
              {/* Root route */}
              <Route path="/" element={<Index />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team-collaboration" element={<TeamCollaborationPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="tasks" element={<TaskManagerPage />} />
              <Route path="analytics" element={<DataAnalyticsPage />} />
              <Route path="activity" element={<UserActivityPage />} />
              <Route path="document-editor" element={<DocumentEditorPage />} />

              {/* Administration Module with Subpages */}
              <Route path="administration">
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="company" element={<AdminCompany />} />
                <Route path="ai" element={<AdminAIAssistants />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="logs" element={<AdminAuditLogs />} />
                <Route path="integrations" element={<AdminIntegrations />} />
                <Route path="data" element={<AdminData />} />
              </Route>

              {/* Finance Module with Subpages */}
              <Route path="finance">
                <Route index element={<FinanceDashboard />} />
                <Route path="transactions" element={<FinanceTransactions />} />
                <Route path="reports" element={<FinanceReports />} />
                <Route path="invoicing" element={<FinanceInvoicing />} />
                <Route path="budgeting" element={<FinanceBudgeting />} />
              </Route>

              {/* HR Module with Subpages */}
              <Route path="hr">
                <Route index element={<HRDashboard />} />
                <Route path="employees" element={<HREmployees />} />
                <Route path="recruitment" element={<HRRecruitment />} />
                <Route path="time-off" element={<HRTimeOff />} />
                <Route path="performance" element={<HRPerformance />} />
              </Route>

              {/* Sales Module with Subpages */}
              <Route path="sales">
                <Route index element={<SalesDashboard />} />
                <Route path="leads" element={<SalesLeads />} />
                <Route path="deals" element={<SalesDeals />} />
                <Route path="pipeline" element={<SalesPipeline />} />
                <Route path="customers" element={<SalesCustomers />} />
              </Route>

              {/* Marketing Module with Subpages */}
              <Route path="marketing">
                <Route index element={<MarketingDashboard />} />
                <Route path="campaigns" element={<MarketingCampaigns />} />
              </Route>

              {/* Other Module pages - placeholder routes that will be implemented later */}
              <Route path="customer-service" element={<CustomerService />} />
              <Route path="projects" element={<ProjectManagement />} />

              {/* Documents Module with Subpages */}
              <Route path="documents">
                <Route index element={<DocumentsDashboard />} />
                <Route path="all-files" element={<AllFiles />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="shared" element={<Shared />} />
                <Route path="templates" element={<Templates />} />
                <Route path="archive" element={<Archive />} />
              </Route>

              <Route path="inventory" element={<Inventory />} />
              <Route path="business-intelligence" element={<BusinessIntelligence />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );

export default App;
