import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/finance/InvoiceForm";
import { InvoiceService, Invoice } from "@/services/InvoiceService";

const InvoiceEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError("Invoice ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const invoiceService = InvoiceService.getInstance();
        const data = await invoiceService.getInvoice(id);
        setInvoice(data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice. Please try again.");
        toast.error("Failed to load invoice. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleSubmit = (updatedInvoice: Invoice) => {
    toast.success(`Invoice ${updatedInvoice.invoice_number} updated successfully`);
    navigate("/finance/invoicing");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Invoice</h1>
            <p className="text-red-500">{error || "Invoice not found"}</p>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Invoice</h1>
          <p className="text-muted-foreground">
            Edit invoice {invoice.invoice_number}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <InvoiceForm invoice={invoice} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceEdit;
