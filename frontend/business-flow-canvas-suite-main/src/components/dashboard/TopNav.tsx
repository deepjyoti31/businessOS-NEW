
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  Menu,
  Search,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationCenter from "./NotificationCenter";
import DataExport from "./DataExport";

interface TopNavProps {
  onMenuClick: () => void;
}

const TopNav = ({ onMenuClick }: TopNavProps) => {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu size={20} />
        </Button>

        {/* Search input - desktop */}
        <div className="hidden md:block relative w-64">
          <Input
            placeholder="Search..."
            className="max-w-64 pl-8"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Search button - mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </Button>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="absolute left-0 top-16 w-full border-b border-border bg-background p-4 md:hidden">
          <div className="relative">
            <Input
              placeholder="Search..."
              className="pl-8"
              autoFocus
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Data Export Component */}
        <DataExport />

        {/* Notifications Component */}
        <NotificationCenter />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-normal">
                {user?.name}
              </span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm font-medium">{user?.email}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;
