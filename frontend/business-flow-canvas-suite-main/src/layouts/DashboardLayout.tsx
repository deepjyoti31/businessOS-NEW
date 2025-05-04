
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import EnhancedAiAssistant from "@/components/dashboard/EnhancedAiAssistant";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVisibilityProtection } from "@/hooks/use-visibility-protection";
import { usePageReloadDetection } from "@/hooks/use-page-reload-detection";
import TeamCollaboration from "@/components/dashboard/TeamCollaboration";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Use the visibility protection hook to prevent unwanted navigation
  useVisibilityProtection();

  // Use page reload detection
  const isPageReload = usePageReloadDetection();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 flex h-full flex-shrink-0 flex-col transform transition-all duration-300 bg-sidebar border-r border-border ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "fixed" : ""}`}
        style={{ width: "260px" }}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300`}
        style={{
          marginLeft: isSidebarOpen && !isMobile ? "260px" : "0",
        }}
      >
        <TopNav onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Enhanced AI Assistant */}
      <EnhancedAiAssistant />
    </div>
  );
};

export default DashboardLayout;
