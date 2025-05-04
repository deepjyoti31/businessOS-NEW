
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Search, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { InvoiceService, Invoice, InvoiceSummary } from "@/services/InvoiceService";
import { ClientService, Client } from "@/services/ClientService";

const FinanceInvoicing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientMap, setClientMap] = useState<Record<string, Client>>({});
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy] = useState("date");
  const [sortOrder] = useState("desc");

  // Fetch invoices
  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invoiceService = InvoiceService.getInstance();
      const filters = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };
      const data = await invoiceService.getInvoices(
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters
      );
      setInvoices(data);
      // Calculate total pages (this is a placeholder - in a real app, you'd get this from the API)
      setTotalPages(Math.ceil(data.length / pageSize) || 1);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
      toast.error("Failed to load invoices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const clientService = ClientService.getInstance();
      const data = await clientService.getClients(1, 100); // Get all clients
      setClients(data);

      // Create a map of client IDs to client objects for easy lookup
      const map: Record<string, Client> = {};
      data.forEach(client => {
        map[client.id] = client;
      });
      setClientMap(map);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to load clients. Some client names may not display correctly.");
    }
  };

  // Fetch invoice summary
  const fetchSummary = async () => {
    try {
      const invoiceService = InvoiceService.getInstance();
      const data = await invoiceService.getInvoiceSummary();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching invoice summary:", err);
      toast.error("Failed to load invoice summary statistics.");
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchInvoices();
    fetchSummary();
  }, [page, pageSize, sortBy, sortOrder, searchTerm, statusFilter]);

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Filter invoices based on search term and status filter (client-side filtering for already fetched data)
  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = clientMap[invoice.client_id]?.name || "";

    const matchesSearch = searchTerm === "" ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      invoice.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700";
      case "sent":
        return "bg-blue-50 text-blue-700";
      case "draft":
        return "bg-gray-50 text-gray-700";
      case "overdue":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Invoicing</h1>
        <p className="text-muted-foreground">
          Create and manage invoices for your clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <>
                <div className="text-2xl font-bold">${summary.total_invoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{summary.invoice_count} invoices total</p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <>
                <div className="text-2xl font-bold">${summary.outstanding_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <>
                <div className="text-2xl font-bold text-red-600">${summary.overdue_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Past due date</p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <>
                <div className="text-2xl font-bold text-green-600">${summary.paid_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">{summary.status_counts.Paid} invoices paid</p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/finance/clients")}>
            Manage Clients
          </Button>
          <Button onClick={() => navigate("/finance/invoices/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={fetchInvoices}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{clientMap[invoice.client_id]?.name || "Unknown Client"}</TableCell>
                      <TableCell>${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>{format(parseISO(invoice.date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{format(parseISO(invoice.due_date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/finance/invoices/${invoice.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/finance/invoices/edit/${invoice.id}`)}
                          >
                            Edit
                          </Button>
                          {invoice.status !== 'Paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const invoiceService = InvoiceService.getInstance();
                                invoiceService.markInvoiceAsPaid(invoice.id)
                                  .then(() => {
                                    toast.success(`Invoice ${invoice.invoice_number} marked as paid`);
                                    fetchInvoices();
                                    fetchSummary();
                                  })
                                  .catch(err => {
                                    console.error("Error marking invoice as paid:", err);
                                    toast.error("Failed to mark invoice as paid");
                                  });
                              }}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No invoices found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant="outline"
            size="sm"
            className={pageNum === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            onClick={() => setPage(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Invoicing Assistant</CardTitle>
          <CardDescription>
            Get help managing your invoices with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI to help you with invoice management:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Create payment reminders</Button>
            <Button variant="outline" size="sm">Forecast cash flow</Button>
            <Button variant="outline" size="sm">Invoice optimization</Button>
            <Button variant="outline" size="sm">Payment analysis</Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about your invoices..."
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

export default FinanceInvoicing;
