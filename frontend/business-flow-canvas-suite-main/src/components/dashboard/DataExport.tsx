
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileDown, Calendar, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DataExport = () => {
  const [fileFormat, setFileFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("last30");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState("finance");
  const [reportName, setReportName] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [recipients, setRecipients] = useState("");

  const handleExport = () => {
    setIsLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      
      const moduleNames: {[key: string]: string} = {
        finance: "Finance",
        sales: "Sales",
        hr: "Human Resources",
        marketing: "Marketing",
        inventory: "Inventory"
      };
      
      const formatNames: {[key: string]: string} = {
        pdf: "PDF",
        excel: "Excel",
        csv: "CSV"
      };
      
      toast.success(
        `${reportName || moduleNames[selectedModule]} report exported as ${formatNames[fileFormat]}`,
        {
          description: "Your file is ready for download"
        }
      );
    }, 1500);
  };

  const handleSchedule = () => {
    setIsLoading(true);
    
    // Simulate scheduling process
    setTimeout(() => {
      setIsLoading(false);
      
      toast.success(
        `Report scheduled successfully`,
        {
          description: `The report will be sent ${scheduleFrequency} to the specified recipients`
        }
      );
    }, 1500);
  };

  const modules = [
    { id: "finance", name: "Finance", icon: <FileText size={16} /> },
    { id: "sales", name: "Sales", icon: <FileText size={16} /> },
    { id: "hr", name: "Human Resources", icon: <FileText size={16} /> },
    { id: "marketing", name: "Marketing", icon: <FileText size={16} /> },
    { id: "inventory", name: "Inventory", icon: <FileText size={16} /> }
  ];

  const recentReports = [
    { 
      id: "1",
      name: "Q2 Financial Summary",
      date: "Jun 30, 2024",
      type: "PDF",
      module: "Finance"
    },
    { 
      id: "2",
      name: "Monthly Sales Report",
      date: "Jul 1, 2024",
      type: "Excel",
      module: "Sales"
    },
    { 
      id: "3",
      name: "Inventory Status",
      date: "Jul 3, 2024",
      type: "CSV",
      module: "Inventory"
    }
  ];
  
  const scheduledReports = [
    { 
      id: "1",
      name: "Weekly Sales Summary",
      frequency: "Weekly",
      nextRun: "Jul 10, 2024",
      format: "PDF"
    },
    { 
      id: "2",
      name: "Monthly Financial Report",
      frequency: "Monthly",
      nextRun: "Aug 1, 2024",
      format: "Excel"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <FileDown className="mr-2 h-4 w-4" />
          <span>Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Data Export & Reports</DialogTitle>
          <DialogDescription>
            Generate and download reports or schedule automated reports
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="export" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Now</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* Export Now Tab */}
          <TabsContent value="export" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module" className="text-right">
                  Module
                </Label>
                <Select 
                  value={selectedModule}
                  onValueChange={(value) => setSelectedModule(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        <div className="flex items-center">
                          {module.icon}
                          <span className="ml-2">{module.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Report Name
                </Label>
                <Input
                  id="name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="format" className="text-right">
                  File Format
                </Label>
                <Select 
                  value={fileFormat}
                  onValueChange={(value) => setFileFormat(value)}
                >
                  <SelectTrigger id="format" className="col-span-3">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateRange" className="text-right">
                  Date Range
                </Label>
                <Select 
                  value={dateRange}
                  onValueChange={(value) => setDateRange(value)}
                >
                  <SelectTrigger id="dateRange" className="col-span-3">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7">Last 7 Days</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox 
                    id="includeCharts" 
                    checked={includeCharts}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') setIncludeCharts(checked);
                    }}
                  />
                  <label
                    htmlFor="includeCharts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include charts and visualizations
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-module" className="text-right">
                  Module
                </Label>
                <Select 
                  value={selectedModule}
                  onValueChange={(value) => setSelectedModule(value)}
                >
                  <SelectTrigger id="schedule-module" className="col-span-3">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        <div className="flex items-center">
                          {module.icon}
                          <span className="ml-2">{module.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-name" className="text-right">
                  Report Name
                </Label>
                <Input
                  id="schedule-name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-frequency" className="text-right">
                  Frequency
                </Label>
                <Select 
                  value={scheduleFrequency}
                  onValueChange={(value) => setScheduleFrequency(value)}
                >
                  <SelectTrigger id="schedule-frequency" className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-format" className="text-right">
                  File Format
                </Label>
                <Select 
                  value={fileFormat}
                  onValueChange={(value) => setFileFormat(value)}
                >
                  <SelectTrigger id="schedule-format" className="col-span-3">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipients" className="text-right">
                  Recipients
                </Label>
                <Input
                  id="recipients"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="email@example.com, email2@example.com"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox 
                    id="includeCharts-schedule" 
                    checked={includeCharts}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') setIncludeCharts(checked);
                    }}
                  />
                  <label
                    htmlFor="includeCharts-schedule"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include charts and visualizations
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="py-4">
            <Tabs defaultValue="recent">
              <TabsList className="w-full">
                <TabsTrigger value="recent" className="flex-1">Recent Reports</TabsTrigger>
                <TabsTrigger value="scheduled" className="flex-1">Scheduled Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="pt-4">
                <div className="space-y-2">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">{report.module} • {report.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">
                        <FileDown size={14} className="mr-1" />
                        {report.type}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scheduled" className="pt-4">
                <div className="space-y-2">
                  {scheduledReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.frequency} • Next: {report.nextRun}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">
                        <AlertCircle size={14} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" type="button">
            Cancel
          </Button>
          {isLoading ? (
            <Button disabled>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              Processing...
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={scheduleEnabled ? handleSchedule : handleExport}
            >
              {scheduleEnabled ? "Schedule Report" : "Export Now"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataExport;
