
import { useState } from "react";
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

const HREmployees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Mock employees data
  const employees = [
    {
      id: "EMP001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      department: "Engineering",
      position: "Senior Developer",
      status: "Active",
      joinDate: "2023-06-15",
    },
    {
      id: "EMP002",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      department: "Marketing",
      position: "Marketing Manager",
      status: "Active",
      joinDate: "2023-08-01",
    },
    {
      id: "EMP003",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      department: "Finance",
      position: "Financial Analyst",
      status: "Active",
      joinDate: "2024-01-10",
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      department: "HR",
      position: "HR Specialist",
      status: "On Leave",
      joinDate: "2022-11-05",
    },
    {
      id: "EMP005",
      name: "David Martinez",
      email: "david.martinez@example.com",
      department: "Engineering",
      position: "QA Engineer",
      status: "Active",
      joinDate: "2024-02-20",
    },
    {
      id: "EMP006",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      department: "Sales",
      position: "Sales Representative",
      status: "Active",
      joinDate: "2023-09-12",
    },
  ];

  // Filter employees based on search term and department filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      employee.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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

  // List of departments for filter
  const departments = ["Engineering", "Marketing", "Finance", "HR", "Sales", "Operations"];

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
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>
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
            className="mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">+3 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Tenure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.3</div>
            <p className="text-xs text-muted-foreground">Years per employee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">7.4% of workforce</p>
          </CardContent>
        </Card>
      </div>
          
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(employee.status)}`}
                      >
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">Previous</Button>
        <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
      
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
