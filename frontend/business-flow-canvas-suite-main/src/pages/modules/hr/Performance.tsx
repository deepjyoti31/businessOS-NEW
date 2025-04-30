
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HRPerformance = () => {
  // Mock performance data would go here
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Performance Management</h1>
        <p className="text-muted-foreground">
          Track and manage employee performance metrics
        </p>
      </div>

      {/* This would contain the performance management interface */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Performance</CardTitle>
          <CardDescription>View and manage performance reviews and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This page will contain the performance management interface.</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Assistant */}
      <Card>
        <CardHeader>
          <CardTitle>AI Performance Assistant</CardTitle>
          <CardDescription>
            Get help analyzing and improving employee performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI about performance management:
          </p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about performance management..."
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

export default HRPerformance;
