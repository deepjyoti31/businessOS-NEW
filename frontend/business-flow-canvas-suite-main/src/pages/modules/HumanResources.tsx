
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HumanResources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock employee data
  const employees = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      position: "Software Engineer",
      department: "Engineering",
      startDate: "2023-01-05",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      position: "Product Manager",
      department: "Product",
      startDate: "2022-06-15",
      status: "Active",
    },
    {
      id: "EMP003",
      name: "Michael Johnson",
      email: "michael.johnson@company.com",
      position: "Sales Director",
      department: "Sales",
      startDate: "2021-09-20",
      status: "Active",
    },
    {
      id: "EMP004",
      name: "Emily Brown",
      email: "emily.brown@company.com",
      position: "Marketing Specialist",
      department: "Marketing",
      startDate: "2023-02-10",
      status: "Active",
    },
    {
      id: "EMP005",
      name: "David Wilson",
      email: "david.wilson@company.com",
      position: "Customer Support",
      department: "Support",
      startDate: "2022-11-03",
      status: "On Leave",
    },
  ];

  // Mock job openings
  const jobOpenings = [
    {
      id: "JOB001",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time",
      applicants: 24,
      posted: "2025-03-10",
    },
    {
      id: "JOB002",
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      applicants: 18,
      posted: "2025-03-15",
    },
    {
      id: "JOB003",
      title: "Marketing Manager",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "Full-time",
      applicants: 12,
      posted: "2025-03-20",
    },
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Human Resources</h1>
        <p className="text-muted-foreground">
          Manage employees, recruitment, and HR operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Employee Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="time-off">Time Off</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://avatar.vercel.sh/${employee.id}`} alt={employee.name} />
                              <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.startDate}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              employee.status === "Active"
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No employees found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Job Openings</h3>
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
              Post New Job
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobOpenings.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.department} • {job.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posted:</span>
                      <span>{job.posted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Applicants:</span>
                      <span>{job.applicants}</span>
                    </div>
                    <Button variant="outline" className="w-full">View Applicants</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="time-off" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Off Requests</CardTitle>
              <CardDescription>
                Manage employee time off requests and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>DW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">David Wilson</p>
                        <p className="text-sm text-muted-foreground">Vacation: Apr 10 - Apr 17, 2025 (5 work days)</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>EB</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Emily Brown</p>
                        <p className="text-sm text-muted-foreground">Sick Leave: Apr 5, 2025 (1 work day)</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">Recently Approved</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Jane Smith</p>
                          <p className="text-xs text-muted-foreground">Personal: Apr 3, 2025</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Approved</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>MJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Michael Johnson</p>
                          <p className="text-xs text-muted-foreground">Vacation: Mar 25-28, 2025</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Training Programs</CardTitle>
              <CardDescription>
                Manage learning and development activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Upcoming Training Sessions</h4>
                  <div className="grid gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Leadership Development Workshop</p>
                      <p className="text-sm text-muted-foreground">April 15, 2025 • 10:00 AM - 3:00 PM</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Management</div>
                        <div className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Leadership</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Customer Service Excellence</p>
                      <p className="text-sm text-muted-foreground">April 20, 2025 • 1:00 PM - 4:00 PM</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Support</div>
                        <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Sales</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="font-medium">Cybersecurity Awareness</p>
                      <p className="text-sm text-muted-foreground">April 25, 2025 • Online • Self-paced</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Security</div>
                        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">All Employees</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button className="w-full">
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
                    Schedule New Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HumanResources;
