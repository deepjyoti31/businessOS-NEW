
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DatabaseIcon,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  FileCog,
  Clock,
  FileArchive,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const AdminData = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleBackup = () => {
    setBackupInProgress(true);
    setProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          toast.success("Backup completed successfully!");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  const backups = [
    {
      id: "backup001",
      name: "Full System Backup",
      date: "2023-04-28 23:00",
      size: "245 MB",
      type: "Automated",
      status: "Complete"
    },
    {
      id: "backup002",
      name: "User Data Backup",
      date: "2023-04-27 23:00",
      size: "118 MB",
      type: "Automated",
      status: "Complete"
    },
    {
      id: "backup003",
      name: "Configuration Backup",
      date: "2023-04-26 15:30",
      size: "32 MB",
      type: "Manual",
      status: "Complete"
    },
    {
      id: "backup004",
      name: "Document Storage Backup",
      date: "2023-04-25 23:00",
      size: "89 MB",
      type: "Automated",
      status: "Complete"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1 flex items-center">
          <DatabaseIcon className="mr-2 h-6 w-6" />
          Backup & Data Management
        </h1>
        <p className="text-muted-foreground">
          Manage backups, exports, and system data
        </p>
      </div>

      {/* Storage overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="mr-2 h-5 w-5" />
            Storage Overview
          </CardTitle>
          <CardDescription>
            Current storage usage and allocation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used Storage: 1.2 GB</span>
              <span>Total: 5 GB</span>
            </div>
            <Progress value={24} className="h-2" />
            <p className="text-xs text-muted-foreground">24% of your storage has been used</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <FileCog className="h-8 w-8 text-blue-500" />
                  <Badge>250 MB</Badge>
                </div>
                <h3 className="font-medium mt-2">System Data</h3>
                <p className="text-xs text-muted-foreground">Configuration and settings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <FileArchive className="h-8 w-8 text-purple-500" />
                  <Badge>650 MB</Badge>
                </div>
                <h3 className="font-medium mt-2">Document Storage</h3>
                <p className="text-xs text-muted-foreground">Files and attachments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <DatabaseIcon className="h-8 w-8 text-green-500" />
                  <Badge>300 MB</Badge>
                </div>
                <h3 className="font-medium mt-2">Database</h3>
                <p className="text-xs text-muted-foreground">Business records and user data</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Backup and Restore */}
      <Tabs defaultValue="backup">
        <TabsList className="mb-4">
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Backup</CardTitle>
              <CardDescription>
                Create a new backup of your system data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Type</label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full System Backup</SelectItem>
                      <SelectItem value="user">User Data Only</SelectItem>
                      <SelectItem value="config">Configuration Only</SelectItem>
                      <SelectItem value="documents">Document Storage Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Compression Level</label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Faster)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="maximum">Maximum (Smaller size)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {backupInProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backing up system data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Last backup: April 28, 2023 at 11:00 PM
              </div>
              <Button 
                onClick={handleBackup} 
                disabled={backupInProgress}
                className="flex items-center"
              >
                {backupInProgress ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileArchive className="mr-2 h-4 w-4" />
                )}
                Create Backup
              </Button>
            </CardFooter>
          </Card>

          <h3 className="text-lg font-medium mt-6 mb-3">Recent Backups</h3>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <h4 className="font-medium">{backup.name}</h4>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                      <span>Created: {backup.date}</span>
                      <span>Size: {backup.size}</span>
                      <Badge variant="outline">{backup.type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">Restore</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restore System</CardTitle>
              <CardDescription>
                Restore your system from a backup file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">Upload Backup File</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop a backup file or click to browse
                </p>
                <Button variant="secondary" className="mt-4">
                  Browse Files
                </Button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Warning</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Restoring from a backup will overwrite all current data. This action cannot be undone.
                    Make sure you have a current backup before proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Restore Points</h3>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {backups.map((backup) => (
                <div key={backup.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium">{backup.name}</h4>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                      <span>Created: {backup.date}</span>
                      <span>Size: {backup.size}</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore to this point
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export specific data from your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col h-full">
                  <h3 className="font-medium mb-2">Export Options</h3>
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="users" className="rounded" defaultChecked />
                      <label htmlFor="users" className="text-sm">User data</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="content" className="rounded" defaultChecked />
                      <label htmlFor="content" className="text-sm">Content and documents</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="settings" className="rounded" />
                      <label htmlFor="settings" className="text-sm">System settings</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="logs" className="rounded" />
                      <label htmlFor="logs" className="text-sm">Activity logs</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Export Format</h3>
                  <Select defaultValue="json">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <h3 className="font-medium mt-4 mb-2">Date Range</h3>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline">
                Schedule Export
              </Button>
              <Button className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export Now
              </Button>
            </CardFooter>
          </Card>

          <h3 className="text-lg font-medium mt-6 mb-3">Recent Exports</h3>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">User Data Export</h4>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                    <span>Created: April 25, 2023</span>
                    <span>Format: JSON</span>
                    <span>Records: 154</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">Activity Logs Export</h4>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                    <span>Created: April 22, 2023</span>
                    <span>Format: CSV</span>
                    <span>Records: 1,248</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Import data into your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Import Type</h3>
                  <Select defaultValue="merge">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merge">Merge with existing data</SelectItem>
                      <SelectItem value="replace">Replace existing data</SelectItem>
                      <SelectItem value="new">Import as new entries</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <h3 className="font-medium mt-4 mb-2">Data Validation</h3>
                  <Select defaultValue="strict">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict (fail on any error)</SelectItem>
                      <SelectItem value="warn">Warn only (continue on error)</SelectItem>
                      <SelectItem value="ignore">Ignore errors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-2 border-dashed rounded-md p-6 text-center h-full flex flex-col justify-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Upload Data File</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports CSV, JSON, XML formats
                  </p>
                  <Button variant="secondary" className="mt-4 mx-auto">
                    Browse Files
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Pro Tip</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    For large imports, we recommend using the CSV template to ensure your data is formatted correctly.
                    <Button variant="link" className="p-0 h-auto text-sm text-blue-700 underline font-normal">
                      Download template
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Data Management Assistant */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Sparkles className="h-10 w-10 text-blue-600" />
            <div>
              <h3 className="font-medium">AI Data Management Assistant</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your system data is growing quickly. Based on your usage patterns, our AI recommends:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li>Increase backup frequency to daily</li>
                <li>Archive activity logs older than 90 days</li>
                <li>Optimize document storage (potential 35% space saving)</li>
              </ul>
              <Button variant="outline" className="mt-3 border-blue-300 hover:bg-blue-100">
                Apply AI Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminData;
