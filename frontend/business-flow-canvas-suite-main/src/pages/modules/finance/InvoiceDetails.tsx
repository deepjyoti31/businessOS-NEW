import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Send,
  Printer,
  Download,
  Edit,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceService, Invoice } from "@/services/InvoiceService";
import { ClientService, Client } from "@/services/ClientService";

const InvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceAndClient = async () => {
      if (!id) {
        setError("Invoice ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const invoiceService = InvoiceService.getInstance();
        const invoiceData = await invoiceService.getInvoice(id);
        setInvoice(invoiceData);

        // Fetch client data
        const clientService = ClientService.getInstance();
        const clientData = await clientService.getClient(invoiceData.client_id);
        setClient(clientData);
      } catch (err) {
        console.error("Error fetching invoice details:", err);
        setError("Failed to load invoice details. Please try again.");
        toast.error("Failed to load invoice details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceAndClient();
  }, [id]);

  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    try {
      const invoiceService = InvoiceService.getInstance();
      await invoiceService.markInvoiceAsPaid(invoice.id);
      
      // Refresh invoice data
      const updatedInvoice = await invoiceService.getInvoice(invoice.id);
      setInvoice(updatedInvoice);
      
      toast.success(`Invoice ${invoice.invoice_number} marked as paid`);
    } catch (err) {
      console.error("Error marking invoice as paid:", err);
      toast.error("Failed to mark invoice as paid");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice || !client) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/finance/invoicing")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
            <p className="text-red-500">{error || "Invoice or client not found"}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 flex justify-center">
            <Button onClick={() => navigate("/finance/invoicing")}>
              Return to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/finance/invoicing")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoice_number}</h1>
          <p className="text-muted-foreground">
            Created on {format(parseISO(invoice.created_at), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/finance/invoices/edit/${invoice.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {invoice.status !== "Paid" && (
            <Button
              variant="default"
              size="sm"
              onClick={handleMarkAsPaid}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${getStatusBadgeClass(invoice.status)}`}
            >
              {invoice.status}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {format(parseISO(invoice.due_date), "MMMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{client.name}</h3>
              {client.contact_name && <p>{client.contact_name}</p>}
            </div>
            <div className="space-y-1">
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
            </div>
            <div className="space-y-1">
              {client.address && <p>{client.address}</p>}
              {(client.city || client.state || client.zip) && (
                <p>
                  {[client.city, client.state, client.zip].filter(Boolean).join(", ")}
                </p>
              )}
              {client.country && <p>{client.country}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{invoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Invoice Date</p>
                <p className="font-medium">{format(parseISO(invoice.date), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{format(parseISO(invoice.due_date), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terms</p>
                <p className="font-medium">{invoice.terms || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({invoice.tax_rate || 0}%)</span>
              <span>${(invoice.tax_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
