
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HRTimeOff = () => {
  // Mock time off data would go here
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Time Off</h1>
        <p className="text-muted-foreground">
          Manage employee time off requests and policies
        </p>
      </div>

      {/* This would contain the time off management interface */}
      <Card>
        <CardHeader>
          <CardTitle>Time Off Requests</CardTitle>
          <CardDescription>View and manage employee time off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This page will contain the time off management interface.</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Time Off Assistant */}
      <Card>
        <CardHeader>
          <CardTitle>AI Time Off Assistant</CardTitle>
          <CardDescription>
            Get help managing time off policies and requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI about time off management:
          </p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about time off management..."
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

export default HRTimeOff;
