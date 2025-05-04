import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/finance/InvoiceForm";
import { Invoice } from "@/services/InvoiceService";

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (invoice: Invoice) => {
    toast.success(`Invoice ${invoice.invoice_number} created successfully`);
    navigate("/finance/invoicing");
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">
            Create a new invoice for your client
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <InvoiceForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceCreate;
