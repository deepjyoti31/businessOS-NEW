
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FileArchive, Search, Download, Sparkles, CalendarRange } from "lucide-react";

const AdminAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock audit log data
  const logs = [
    {
      id: "log001",
      timestamp: "2023-04-29T10:30:00Z",
      user: "john.doe@example.com",
      action: "User Login",
      details: "Successful login from IP 192.168.1.1",
      category: "Authentication",
      severity: "Info"
    },
    {
      id: "log002",
      timestamp: "2023-04-29T11:15:00Z",
      user: "jane.smith@example.com",
      action: "User Created",
      details: "New user account created for robert.johnson@example.com",
      category: "User Management",
      severity: "Info"
    },
    {
      id: "log003",
      timestamp: "2023-04-29T12:05:00Z",
      user: "admin@example.com",
      action: "Permission Changed",
      details: "Role 'Manager' permission updated: Added 'Export Data'",
      category: "Access Control",
      severity: "Warning"
    },
    {
      id: "log004",
      timestamp: "2023-04-29T13:22:00Z",
      user: "system",
      action: "Failed Login Attempt",
      details: "5 failed login attempts for user emily.davis@example.com",
      category: "Authentication",
      severity: "Error"
    },
    {
      id: "log005",
      timestamp: "2023-04-29T14:10:00Z",
      user: "michael.wilson@example.com",
      action: "Data Export",
      details: "Exported customer data report (512 records)",
      category: "Data Access",
      severity: "Info"
    },
    {
      id: "log006",
      timestamp: "2023-04-29T15:45:00Z",
      user: "system",
      action: "System Update",
      details: "System updated to version 2.3.0",
      category: "System",
      severity: "Info"
    },
    {
      id: "log007",
      timestamp: "2023-04-29T16:30:00Z",
      user: "admin@example.com",
      action: "Settings Changed",
      details: "System backup frequency changed from 'Weekly' to 'Daily'",
      category: "Configuration",
      severity: "Info"
    },
    {
      id: "log008",
      timestamp: "2023-04-29T17:20:00Z",
      user: "john.doe@example.com",
      action: "Unauthorized Access Attempt",
      details: "Attempted to access restricted area: Financial Reports",
      category: "Security",
      severity: "Error"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter logs based on search term
  const filteredLogs = logs.filter((log) =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Error': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Info': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 flex items-center">
            <FileArchive className="mr-2 h-6 w-6" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">
            Monitor and track system activities and user actions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button variant="default" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
            <FileArchive className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              3 Critical
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Active Users Today</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              +5 from yesterday
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="users">User Management</SelectItem>
              <SelectItem value="access">Access Control</SelectItem>
              <SelectItem value="data">Data Access</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
        </div>
      </div>

      {/* Logs table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {log.details}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {log.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No logs found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* AI Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium">AI Insights</h3>
              <p className="text-sm mt-1 text-muted-foreground">
                We detected an unusual number of failed login attempts in the last 24 hours. 
                Consider reviewing authentication policies or implementing additional security measures.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-100">
                  View Detailed Analysis
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLogs;
