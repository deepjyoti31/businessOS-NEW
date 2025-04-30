
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Since @hello-pangea/dnd is not installed, let's create mock components to avoid errors
const MockDragDropContext = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const MockDroppable = ({ children }: { children: React.ReactNode }) => <div className="min-h-[500px] p-4 bg-muted/30 rounded-md">{children}</div>;
const MockDraggable = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// Using the mock components
const DragDropContextMock = MockDragDropContext;
const DroppableMock = MockDroppable;
const DraggableMock = MockDraggable;

const SalesPipeline = () => {
  // Mock pipeline data
  const pipelineStages = [
    {
      id: "qualification",
      name: "Qualification",
      deals: [
        {
          id: "deal-001",
          name: "Software Integration Project",
          company: "Bright Ideas LLC",
          value: 35000,
          owner: "James Rodriguez",
          dueDate: "2025-06-30",
        },
        {
          id: "deal-002",
          name: "Cloud Migration Services",
          company: "Nova Systems",
          value: 42000,
          owner: "Emily Chen",
          dueDate: "2025-07-15",
        }
      ]
    },
    {
      id: "discovery",
      name: "Discovery",
      deals: [
        {
          id: "deal-003",
          name: "Annual Maintenance Contract",
          company: "Summit Solutions",
          value: 28000,
          owner: "David Wilson",
          dueDate: "2025-06-10",
        }
      ]
    },
    {
      id: "proposal",
      name: "Proposal",
      deals: [
        {
          id: "deal-004",
          name: "Enterprise Software Subscription",
          company: "Acme Corp",
          value: 75000,
          owner: "Alex Johnson",
          dueDate: "2025-05-15",
        }
      ]
    },
    {
      id: "negotiation",
      name: "Negotiation",
      deals: [
        {
          id: "deal-005",
          name: "Consulting Services Package",
          company: "TechGrowth Inc",
          value: 45000,
          owner: "Michelle Smith",
          dueDate: "2025-05-02",
        }
      ]
    },
    {
      id: "closed",
      name: "Closed Won",
      deals: [
        {
          id: "deal-006",
          name: "Product Expansion",
          company: "Global Innovations",
          value: 120000,
          owner: "Sarah Chen",
          dueDate: "2025-04-22",
        }
      ]
    }
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate pipeline metrics
  const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.deals.length, 0);
  const totalValue = pipelineStages.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0);
  }, 0);

  const handleDragEnd = (result: any) => {
    // This would handle the drag and drop functionality in a real implementation
    console.log("Deal moved:", result);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Sales Pipeline</h1>
        <p className="text-muted-foreground">
          Visualize and manage your sales process stages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Across {totalDeals} deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sales Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36 days</div>
            <p className="text-xs text-muted-foreground">-4 days from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="kanban" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {pipelineStages.map((stage) => (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{stage.name}</h3>
                  <Badge variant="outline">{stage.deals.length}</Badge>
                </div>
                
                <DroppableMock>
                  <div className="space-y-3">
                    {stage.deals.map((deal) => (
                      <DraggableMock key={deal.id}>
                        <Card className="bg-white shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1.5">
                                <h4 className="font-medium text-sm">{deal.name}</h4>
                                <p className="text-xs text-muted-foreground">{deal.company}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Deal</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Change Stage</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-3 text-sm font-medium">{formatCurrency(deal.value)}</div>
                            <div className="mt-2 flex justify-between text-xs">
                              <span className="text-muted-foreground">Owner: {deal.owner}</span>
                              <span className="text-muted-foreground">Due: {deal.dueDate}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </DraggableMock>
                    ))}
                  </div>
                </DroppableMock>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Deals</CardTitle>
              <CardDescription>View all deals across your sales pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineStages.map((stage) => (
                  <div key={stage.id} className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      {stage.name} 
                      <Badge variant="outline" className="text-xs">{stage.deals.length} deals</Badge>
                    </h3>
                    {stage.deals.map((deal) => (
                      <div key={deal.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{deal.name}</p>
                          <p className="text-sm text-muted-foreground">{deal.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(deal.value)}</p>
                          <p className="text-sm text-muted-foreground">Due: {deal.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesPipeline;
