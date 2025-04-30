
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
import { Progress } from "@/components/ui/progress";

const ProjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock projects data
  const projects = [
    {
      id: "PRJ-001",
      name: "Website Redesign",
      client: "Acme Corp",
      progress: 75,
      status: "In Progress",
      dueDate: "2025-04-30",
      budget: 24000,
      spent: 16500,
      manager: "John Doe",
      managerAvatar: "JD",
      team: ["Jane Smith", "Robert Johnson", "Emily Davis"],
      teamAvatars: ["JS", "RJ", "ED"]
    },
    {
      id: "PRJ-002",
      name: "Mobile App Development",
      client: "Globex Inc",
      progress: 30,
      status: "In Progress",
      dueDate: "2025-06-15",
      budget: 45000,
      spent: 12000,
      manager: "Sarah Wilson",
      managerAvatar: "SW",
      team: ["Michael Brown", "David Clark", "Jennifer Lee"],
      teamAvatars: ["MB", "DC", "JL"]
    },
    {
      id: "PRJ-003",
      name: "Marketing Campaign",
      client: "Wayne Enterprises",
      progress: 100,
      status: "Completed",
      dueDate: "2025-03-15",
      budget: 18000,
      spent: 17500,
      manager: "Emily Davis",
      managerAvatar: "ED",
      team: ["Robert Johnson", "Jennifer Lee"],
      teamAvatars: ["RJ", "JL"]
    },
    {
      id: "PRJ-004",
      name: "ERP Implementation",
      client: "Stark Industries",
      progress: 10,
      status: "In Progress",
      dueDate: "2025-09-30",
      budget: 120000,
      spent: 15000,
      manager: "David Clark",
      managerAvatar: "DC",
      team: ["John Doe", "Sarah Wilson", "Michael Brown", "Emily Davis"],
      teamAvatars: ["JD", "SW", "MB", "ED"]
    },
    {
      id: "PRJ-005",
      name: "Office Relocation",
      client: "Internal",
      progress: 0,
      status: "Not Started",
      dueDate: "2025-07-01",
      budget: 35000,
      spent: 0,
      manager: "Robert Johnson",
      managerAvatar: "RJ",
      team: ["Jane Smith", "David Clark"],
      teamAvatars: ["JS", "DC"]
    }
  ];

  // Mock tasks data
  const tasks = [
    {
      id: "TSK-101",
      title: "Create wireframes for homepage",
      project: "Website Redesign",
      assignee: "Jane Smith",
      assigneeAvatar: "JS",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-04-05",
    },
    {
      id: "TSK-102",
      title: "Content audit of existing pages",
      project: "Website Redesign",
      assignee: "Robert Johnson",
      assigneeAvatar: "RJ",
      status: "Completed",
      priority: "Medium",
      dueDate: "2025-03-28",
    },
    {
      id: "TSK-103",
      title: "Database schema design",
      project: "Mobile App Development",
      assignee: "David Clark",
      assigneeAvatar: "DC",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-04-10",
    },
    {
      id: "TSK-104",
      title: "User authentication implementation",
      project: "Mobile App Development",
      assignee: "Michael Brown",
      assigneeAvatar: "MB",
      status: "Not Started",
      priority: "Medium",
      dueDate: "2025-04-15",
    },
    {
      id: "TSK-105",
      title: "Create project timeline",
      project: "Office Relocation",
      assignee: "Robert Johnson",
      assigneeAvatar: "RJ",
      status: "In Progress",
      priority: "Critical",
      dueDate: "2025-04-03",
    },
  ];

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700';
      case 'Not Started':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700';
      case 'High':
        return 'bg-orange-50 text-orange-700';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'Low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Project Management</h1>
        <p className="text-muted-foreground">
          Manage projects, tasks, and team collaboration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 due this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search projects..."
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
              New Project
            </Button>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{project.name}</h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.id} • {project.client}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Due:</span>
                          <span className="font-medium">{project.dueDate}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Budget</p>
                            <p className="text-sm font-medium">${project.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Spent</p>
                            <p className="text-sm font-medium">${project.spent.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Team</p>
                            <div className="flex -space-x-2">
                              {project.teamAvatars.map((avatar, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px]">{avatar}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-xs text-muted-foreground mb-1">Manager</p>
                            <div className="flex items-center gap-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{project.managerAvatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{project.manager}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No projects found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search tasks..."
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
              New Task
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{task.assigneeAvatar}</AvatarFallback>
                            </Avatar>
                            <span>{task.assignee}</span>
                          </div>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No tasks found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage team members and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Project Manager</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs">86% allocated</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">UX Designer</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-xs">100% allocated</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">Product Manager</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs">60% allocated</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>ED</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Emily Davis</p>
                    <p className="text-sm text-muted-foreground">Content Writer</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs">75% allocated</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">David Clark</p>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-xs">95% allocated</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>MB</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Michael Brown</p>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs">80% allocated</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Calendar</CardTitle>
              <CardDescription>
                Schedule and timeline management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                This section is under development. Check back soon for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagement;
