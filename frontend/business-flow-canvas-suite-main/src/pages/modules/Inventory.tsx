
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
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock inventory data
  const products = [
    {
      id: "PRD-001",
      name: "Ergonomic Office Chair",
      sku: "FURN-1001",
      category: "Furniture",
      inStock: 24,
      reserved: 5,
      reorderPoint: 10,
      unitPrice: 199.99,
      supplier: "Office Supplies Ltd",
      location: "Warehouse A",
      lastUpdated: "2025-03-25"
    },
    {
      id: "PRD-002",
      name: "Wireless Keyboard",
      sku: "TECH-2034",
      category: "Electronics",
      inStock: 45,
      reserved: 12,
      reorderPoint: 20,
      unitPrice: 59.99,
      supplier: "TechVendor Inc",
      location: "Warehouse B",
      lastUpdated: "2025-03-26"
    },
    {
      id: "PRD-003",
      name: "LED Monitor 24-inch",
      sku: "TECH-5021",
      category: "Electronics",
      inStock: 8,
      reserved: 3,
      reorderPoint: 15,
      unitPrice: 179.99,
      supplier: "TechVendor Inc",
      location: "Warehouse B",
      lastUpdated: "2025-03-24"
    },
    {
      id: "PRD-004",
      name: "Premium Notebook",
      sku: "STAT-3042",
      category: "Stationery",
      inStock: 120,
      reserved: 15,
      reorderPoint: 50,
      unitPrice: 12.99,
      supplier: "Paper Products Co",
      location: "Warehouse A",
      lastUpdated: "2025-03-27"
    },
    {
      id: "PRD-005",
      name: "Standing Desk",
      sku: "FURN-2056",
      category: "Furniture",
      inStock: 5,
      reserved: 2,
      reorderPoint: 8,
      unitPrice: 349.99,
      supplier: "Office Supplies Ltd",
      location: "Warehouse A",
      lastUpdated: "2025-03-20"
    },
    {
      id: "PRD-006",
      name: "Wireless Mouse",
      sku: "TECH-2035",
      category: "Electronics",
      inStock: 38,
      reserved: 10,
      reorderPoint: 20,
      unitPrice: 29.99,
      supplier: "TechVendor Inc",
      location: "Warehouse B",
      lastUpdated: "2025-03-26"
    }
  ];

  // Mock inventory movement data
  const movementData = [
    { date: '03/20', inbound: 45, outbound: 32 },
    { date: '03/21', inbound: 30, outbound: 25 },
    { date: '03/22', inbound: 20, outbound: 18 },
    { date: '03/23', inbound: 35, outbound: 30 },
    { date: '03/24', inbound: 50, outbound: 42 },
    { date: '03/25', inbound: 25, outbound: 30 },
    { date: '03/26', inbound: 40, outbound: 35 },
  ];

  // Mock suppliers
  const suppliers = [
    { name: "Office Supplies Ltd", items: 24, reliability: 98, leadTime: "3-5 days" },
    { name: "TechVendor Inc", items: 37, reliability: 95, leadTime: "5-7 days" },
    { name: "Paper Products Co", items: 12, reliability: 92, leadTime: "2-4 days" },
    { name: "Furniture Wholesale", items: 18, reliability: 90, leadTime: "7-10 days" }
  ];

  // Mock categories data
  const categoryData = [
    { name: 'Electronics', value: 125 },
    { name: 'Furniture', value: 80 },
    { name: 'Stationery', value: 210 },
    { name: 'Office Supplies', value: 175 },
    { name: 'IT Equipment', value: 95 }
  ];

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stock status
  const getStockStatus = (inStock, reorderPoint) => {
    if (inStock <= 0) return { label: "Out of Stock", className: "bg-red-50 text-red-700" };
    if (inStock < reorderPoint) return { label: "Low Stock", className: "bg-amber-50 text-amber-700" };
    return { label: "In Stock", className: "bg-green-50 text-green-700" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
        <p className="text-muted-foreground">
          Product catalog and stock management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">685</div>
            <p className="text-xs text-muted-foreground">Across 12 categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128,450</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search products..."
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
              Add Product
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const status = getStockStatus(product.inStock, product.reorderPoint);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <p>{product.inStock}</p>
                              {product.reserved > 0 && (
                                <p className="text-xs text-muted-foreground">{product.reserved} reserved</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </TableCell>
                          <TableCell>${product.unitPrice}</TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell>{product.lastUpdated}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No products found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Inventory Movement</CardTitle>
                <CardDescription>
                  Inbound and outbound products over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={movementData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="inbound" stroke="#4f46e5" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="outbound" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest inventory transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2 pb-3 border-b">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Inbound</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Wireless Keyboard (15 units)</p>
                      <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 pb-3 border-b">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Outbound</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">LED Monitor 24-inch (2 units)</p>
                      <p className="text-xs text-muted-foreground">Today, 9:15 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 pb-3 border-b">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Adjustment</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Premium Notebook (-5 units)</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 4:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Inbound</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Standing Desk (3 units)</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Supplier Directory</h3>
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
              Add Supplier
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((supplier, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-medium">{supplier.name}</h4>
                      <p className="text-sm text-muted-foreground">{supplier.items} items in inventory</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Reliability</p>
                        <p className="font-medium">{supplier.reliability}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Lead Time</p>
                        <p className="font-medium">{supplier.leadTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Order</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                Purchase orders awaiting fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Ordered Date</TableHead>
                    <TableHead>Expected Arrival</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">PO-2025-042</TableCell>
                    <TableCell>TechVendor Inc</TableCell>
                    <TableCell>5 products</TableCell>
                    <TableCell>$2,450</TableCell>
                    <TableCell>2025-03-22</TableCell>
                    <TableCell>2025-03-29</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                        In Transit
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PO-2025-041</TableCell>
                    <TableCell>Office Supplies Ltd</TableCell>
                    <TableCell>12 products</TableCell>
                    <TableCell>$5,850</TableCell>
                    <TableCell>2025-03-20</TableCell>
                    <TableCell>2025-03-25</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700">
                        Processing
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>
                  Distribution of products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Inventory Insights</CardTitle>
                <CardDescription>
                  Key metrics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <p className="font-medium text-blue-700">Low Stock Alert</p>
                    </div>
                    <p className="mt-1 text-sm text-blue-600">5 products are below their reorder points and need attention.</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <p className="font-medium text-green-700">Optimization Potential</p>
                    </div>
                    <p className="mt-1 text-sm text-green-600">Excess stock identified in 8 products with slow turnover.</p>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <p className="font-medium text-amber-700">Seasonal Demand</p>
                    </div>
                    <p className="mt-1 text-sm text-amber-600">Prepare for increased demand in office furniture next quarter.</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Automatic Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Order 20 more units of LED Monitors to meet projected demand.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Run a promotion for Premium Notebooks to reduce excess inventory.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <span>Adjust the reorder point for Wireless Keyboards to optimize stock levels.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
