
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Loader2, UserPlus, Download, Filter } from "lucide-react";
import HRService, { Employee, EmployeeFilter } from "@/services/HRService";

const HREmployees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [onLeaveEmployees, setOnLeaveEmployees] = useState(0);
  const [averageTenure, setAverageTenure] = useState(0);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // Prepare filter
        const filter: EmployeeFilter = {
          search: searchTerm || undefined,
          department: departmentFilter !== "all" ? departmentFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          employment_type: employmentTypeFilter !== "all" ? employmentTypeFilter : undefined,
        };

        // Fetch employees
        const response = await HRService.getEmployees(
          page,
          pageSize,
          "last_name",
          "asc",
          filter
        );

        setEmployees(response.items);
        setTotalPages(response.pagination.total_pages);
        setTotalEmployees(response.pagination.total_count);

        // Count active and on leave employees
        const active = response.items.filter(emp => emp.status === "Active").length;
        const onLeave = response.items.filter(emp => emp.status === "On Leave").length;
        setActiveEmployees(active);
        setOnLeaveEmployees(onLeave);

        // Calculate average tenure
        const now = new Date();
        const totalDays = response.items.reduce((sum, emp) => {
          const hireDate = new Date(emp.hire_date);
          const diffTime = Math.abs(now.getTime() - hireDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0);

        const avgYears = totalDays / 365 / response.items.length || 0;
        setAverageTenure(parseFloat(avgYears.toFixed(1)));

        // Fetch departments for filter
        const departmentsData = await HRService.getDepartments();
        const uniqueDepartments = Array.from(
          new Set(departmentsData.map(dept => dept.name))
        );
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          title: "Error",
          description: "Failed to load employees data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [page, pageSize, searchTerm, departmentFilter, statusFilter, employmentTypeFilter, toast]);

  // Get initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700";
      case "on leave":
        return "bg-amber-50 text-amber-700";
      case "terminated":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Export employees to CSV
  const exportToCSV = () => {
    if (employees.length === 0) return;

    const headers = [
      "ID", "First Name", "Last Name", "Email", "Position",
      "Department", "Hire Date", "Status", "Employment Type"
    ];

    const csvData = employees.map(emp => [
      emp.id,
      emp.first_name,
      emp.last_name,
      emp.email,
      emp.position,
      emp.department,
      emp.hire_date,
      emp.status,
      emp.employment_type
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employees_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Employees</h1>
        <p className="text-muted-foreground">
          Manage your company's employee directory
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-60"
          />
          <div className="flex gap-2">
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={employmentTypeFilter}
              onValueChange={setEmploymentTypeFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/dashboard/hr/employees/new")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `${activeEmployees} active, ${onLeaveEmployees} on leave`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Tenure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTenure}</div>
            <p className="text-xs text-muted-foreground">Years per employee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeaveEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {totalEmployees > 0
                ? `${((onLeaveEmployees / totalEmployees) * 100).toFixed(1)}% of workforce`
                : "0% of workforce"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{getInitials(employee.first_name, employee.last_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{format(new Date(employee.hire_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(employee.status)}`}
                        >
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/hr/employees/${employee.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigate(`/dashboard/hr/employees/${employee.id}`);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No employees found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className={p === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              onClick={() => setPage(p)}
              disabled={isLoading}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>AI HR Assistant</CardTitle>
          <CardDescription>
            Get AI-powered insights and assistance for employee management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI to help you with employee management tasks:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Team performance analysis</Button>
            <Button variant="outline" size="sm">Onboarding checklist</Button>
            <Button variant="outline" size="sm">Talent assessment</Button>
            <Button variant="outline" size="sm">Scheduling optimization</Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about your employees..."
              className="w-full pr-24"
            />
            <Button className="absolute right-1 top-1">
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HREmployees;
