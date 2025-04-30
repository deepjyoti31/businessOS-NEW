
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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerService = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock tickets data
  const tickets = [
    {
      id: "TIC-1024",
      subject: "Cannot login to dashboard",
      customer: "John Smith",
      customerEmail: "john.smith@example.com",
      priority: "High",
      status: "Open",
      assignedTo: "Emily Davis",
      assigneeAvatar: "ED",
      createdAt: "2025-03-25 09:23 AM",
      updatedAt: "2025-03-25 10:15 AM"
    },
    {
      id: "TIC-1023",
      subject: "Billing discrepancy on latest invoice",
      customer: "Sarah Johnson",
      customerEmail: "sarah.j@example.com",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Michael Wilson",
      assigneeAvatar: "MW",
      createdAt: "2025-03-24 02:45 PM",
      updatedAt: "2025-03-25 09:30 AM"
    },
    {
      id: "TIC-1022",
      subject: "Feature request: Export to PDF",
      customer: "Robert Brown",
      customerEmail: "r.brown@example.com",
      priority: "Low",
      status: "Open",
      assignedTo: "Unassigned",
      assigneeAvatar: "",
      createdAt: "2025-03-24 11:05 AM",
      updatedAt: "2025-03-24 11:05 AM"
    },
    {
      id: "TIC-1021",
      subject: "Integration with third-party API failing",
      customer: "Jennifer Lee",
      customerEmail: "jennifer.lee@example.com",
      priority: "Critical",
      status: "In Progress",
      assignedTo: "David Clark",
      assigneeAvatar: "DC",
      createdAt: "2025-03-23 08:12 AM",
      updatedAt: "2025-03-25 08:45 AM"
    },
    {
      id: "TIC-1020",
      subject: "Password reset not working",
      customer: "Michael Thompson",
      customerEmail: "m.thompson@example.com",
      priority: "High",
      status: "Resolved",
      assignedTo: "Emily Davis",
      assigneeAvatar: "ED",
      createdAt: "2025-03-22 03:30 PM",
      updatedAt: "2025-03-24 04:15 PM"
    },
  ];

  // Mock ticket status data
  const statusData = [
    { name: 'Open', value: 14 },
    { name: 'In Progress', value: 8 },
    { name: 'Pending', value: 5 },
    { name: 'Resolved', value: 23 },
  ];

  // Mock response time data
  const responseTimeData = [
    { name: 'Monday', time: 35 },
    { name: 'Tuesday', time: 28 },
    { name: 'Wednesday', time: 42 },
    { name: 'Thursday', time: 30 },
    { name: 'Friday', time: 25 },
    { name: 'Saturday', time: 15 },
    { name: 'Sunday', time: 18 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Filter tickets based on search term
  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700';
      case 'Pending':
        return 'bg-amber-50 text-amber-700';
      case 'Resolved':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Customer Service</h1>
        <p className="text-muted-foreground">
          Manage customer support tickets and knowledge base
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">5 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 min</div>
            <p className="text-xs text-muted-foreground">-8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Input
              placeholder="Search tickets..."
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
              Create Ticket
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.subject}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{ticket.customer}</p>
                            <p className="text-xs text-muted-foreground">{ticket.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTo !== "Unassigned" ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{ticket.assigneeAvatar}</AvatarFallback>
                              </Avatar>
                              <span>{ticket.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>{ticket.updatedAt}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No tickets found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search knowledge base..."
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
              New Article
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Basic guides and tutorials for new users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Account setup guide</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Dashboard overview</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Setting up your first project</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">User roles and permissions</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account & Billing</CardTitle>
                <CardDescription>
                  Payment, subscription, and account management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Managing your subscription</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Payment methods</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Invoices and receipts</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Account security</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>
                  Solutions for common issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Login and authentication issues</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Data import/export problems</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Integration troubleshooting</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Performance optimization</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Status</CardTitle>
                <CardDescription>
                  Current distribution of tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {statusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>
                  Average response time by day (in minutes)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={responseTimeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="time" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Management</CardTitle>
              <CardDescription>
                Customer chat sessions and agent assignments
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

export default CustomerService;
