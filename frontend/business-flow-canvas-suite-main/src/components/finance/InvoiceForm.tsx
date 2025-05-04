import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientList } from "./ClientList";
import { InvoiceService, Invoice, InvoiceCreate, InvoiceUpdate, InvoiceItemCreate } from "@/services/InvoiceService";
import { ClientService, Client } from "@/services/ClientService";

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (invoice: Invoice) => void;
}

export const InvoiceForm = ({ invoice, onSubmit }: InvoiceFormProps) => {
  const [formData, setFormData] = useState<InvoiceCreate>({
    client_id: "",
    invoice_number: "",
    date: format(new Date(), "yyyy-MM-dd"),
    due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    status: "Draft",
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 0,
    notes: "",
    terms: "Net 30",
    items: [
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");

  // Fetch clients and next invoice number on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientService = ClientService.getInstance();
        const data = await clientService.getClients(1, 100);
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        toast.error("Failed to load clients");
      }
    };

    const generateNextInvoiceNumber = async () => {
      try {
        const invoiceService = InvoiceService.getInstance();
        const invoices = await invoiceService.getInvoices(1, 1, "invoice_number", "desc");
        
        if (invoices.length > 0) {
          // Extract the numeric part of the last invoice number and increment it
          const lastInvoiceNumber = invoices[0].invoice_number;
          const match = lastInvoiceNumber.match(/INV-(\d+)/);
          
          if (match && match[1]) {
            const nextNumber = parseInt(match[1], 10) + 1;
            const paddedNumber = nextNumber.toString().padStart(3, "0");
            setNextInvoiceNumber(`INV-${paddedNumber}`);
            
            // Update form data with the next invoice number
            setFormData(prev => ({
              ...prev,
              invoice_number: `INV-${paddedNumber}`
            }));
          } else {
            setNextInvoiceNumber("INV-001");
            
            // Update form data with the default invoice number
            setFormData(prev => ({
              ...prev,
              invoice_number: "INV-001"
            }));
          }
        } else {
          setNextInvoiceNumber("INV-001");
          
          // Update form data with the default invoice number
          setFormData(prev => ({
            ...prev,
            invoice_number: "INV-001"
          }));
        }
      } catch (err) {
        console.error("Error generating next invoice number:", err);
        setNextInvoiceNumber("INV-001");
        
        // Update form data with the default invoice number
        setFormData(prev => ({
          ...prev,
          invoice_number: "INV-001"
        }));
      }
    };

    fetchClients();
    
    if (!invoice) {
      generateNextInvoiceNumber();
    }
  }, [invoice]);

  // Initialize form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        date: format(new Date(invoice.date), "yyyy-MM-dd"),
        due_date: format(new Date(invoice.due_date), "yyyy-MM-dd"),
        status: invoice.status,
        subtotal: invoice.subtotal,
        tax_rate: invoice.tax_rate || 0,
        tax_amount: invoice.tax_amount || 0,
        total: invoice.total,
        notes: invoice.notes || "",
        terms: invoice.terms || "",
        items: invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        })),
      });
      
      // Find the selected client
      const client = clients.find(c => c.id === invoice.client_id);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [invoice, clients]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setFormData(prev => ({ ...prev, client_id: client.id }));
    setIsClientDialogOpen(false);
    
    // Clear error for client_id
    if (errors.client_id) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.client_id;
        return newErrors;
      });
    }
  };

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    
    // Update the specified field
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    
    // If quantity or unit_price changed, recalculate amount
    if (field === "quantity" || field === "unit_price") {
      const quantity = field === "quantity" ? Number(value) : newItems[index].quantity;
      const unitPrice = field === "unit_price" ? Number(value) : newItems[index].unit_price;
      newItems[index].amount = Number((quantity * unitPrice).toFixed(2));
    }
    
    // Update form data with new items
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
    
    // Recalculate totals
    recalculateTotals(newItems);
  };

  // Add a new item
  const addItem = () => {
    const newItems = [
      ...formData.items,
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ];
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  // Remove an item
  const removeItem = (index: number) => {
    if (formData.items.length <= 1) {
      toast.error("Invoice must have at least one item");
      return;
    }
    
    const newItems = formData.items.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
    
    // Recalculate totals
    recalculateTotals(newItems);
  };

  // Recalculate subtotal, tax amount, and total
  const recalculateTotals = (items: InvoiceItemCreate[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = formData.tax_rate || 0;
    const taxAmount = Number((subtotal * taxRate / 100).toFixed(2));
    const total = Number((subtotal + taxAmount).toFixed(2));
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total,
    }));
  };

  // Handle tax rate change
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxRate = Number(e.target.value);
    const taxAmount = Number((formData.subtotal * taxRate / 100).toFixed(2));
    const total = Number((formData.subtotal + taxAmount).toFixed(2));
    
    setFormData(prev => ({
      ...prev,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.client_id) {
      newErrors.client_id = "Client is required";
    }
    
    if (!formData.invoice_number?.trim()) {
      newErrors.invoice_number = "Invoice number is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Invoice date is required";
    }
    
    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }
    
    // Validate items
    const itemErrors: Record<string, string> = {};
    formData.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        itemErrors[`items[${index}].description`] = "Description is required";
      }
      
      if (item.quantity <= 0) {
        itemErrors[`items[${index}].quantity`] = "Quantity must be positive";
      }
      
      if (item.unit_price < 0) {
        itemErrors[`items[${index}].unit_price`] = "Unit price cannot be negative";
      }
    });
    
    setErrors({ ...newErrors, ...itemErrors });
    return Object.keys(newErrors).length === 0 && Object.keys(itemErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const invoiceService = InvoiceService.getInstance();
      let result: Invoice;
      
      if (invoice) {
        // Update existing invoice
        const updateData: InvoiceUpdate = {
          client_id: formData.client_id,
          invoice_number: formData.invoice_number,
          date: formData.date,
          due_date: formData.due_date,
          status: formData.status,
          subtotal: formData.subtotal,
          tax_rate: formData.tax_rate,
          tax_amount: formData.tax_amount,
          total: formData.total,
          notes: formData.notes,
          terms: formData.terms,
        };
        
        result = await invoiceService.updateInvoice(invoice.id, updateData);
      } else {
        // Create new invoice
        result = await invoiceService.createInvoice(formData);
      }
      
      onSubmit(result);
    } catch (err) {
      console.error("Error saving invoice:", err);
      toast.error(invoice ? "Failed to update invoice" : "Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_id">
            Client <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsClientDialogOpen(true)}
              >
                {selectedClient ? selectedClient.name : "Select Client"}
              </Button>
              {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id}</p>}
            </div>
            <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Select Client</DialogTitle>
                  <DialogDescription>
                    Choose a client for this invoice or create a new one.
                  </DialogDescription>
                </DialogHeader>
                <ClientList onClientSelect={handleClientSelect} selectable={true} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoice_number">
            Invoice Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            placeholder="e.g., INV-001"
            className={errors.invoice_number ? "border-red-500" : ""}
          />
          {errors.invoice_number && <p className="text-red-500 text-sm">{errors.invoice_number}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">
            Invoice Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="due_date">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            className={errors.due_date ? "border-red-500" : ""}
          />
          {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="terms">Terms</Label>
          <Input
            id="terms"
            name="terms"
            value={formData.terms || ""}
            onChange={handleChange}
            placeholder="e.g., Net 30"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label htmlFor={`item-${index}-description`} className="text-xs">
                  Description
                </Label>
                <Input
                  id={`item-${index}-description`}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  placeholder="Item description"
                  className={errors[`items[${index}].description`] ? "border-red-500" : ""}
                />
                {errors[`items[${index}].description`] && (
                  <p className="text-red-500 text-xs">{errors[`items[${index}].description`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-quantity`} className="text-xs">
                  Quantity
                </Label>
                <Input
                  id={`item-${index}-quantity`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                  className={errors[`items[${index}].quantity`] ? "border-red-500" : ""}
                />
                {errors[`items[${index}].quantity`] && (
                  <p className="text-red-500 text-xs">{errors[`items[${index}].quantity`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-unit-price`} className="text-xs">
                  Unit Price
                </Label>
                <Input
                  id={`item-${index}-unit-price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)}
                  className={errors[`items[${index}].unit_price`] ? "border-red-500" : ""}
                />
                {errors[`items[${index}].unit_price`] && (
                  <p className="text-red-500 text-xs">{errors[`items[${index}].unit_price`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Label htmlFor={`item-${index}-amount`} className="text-xs">
                  Amount
                </Label>
                <Input
                  id={`item-${index}-amount`}
                  type="number"
                  value={item.amount}
                  readOnly
                  className="bg-muted"
                />
              </div>
              
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="h-10 w-10"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            placeholder="Additional notes for the client"
            rows={4}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal:</span>
            <span>${formData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tax Rate (%):</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax_rate || 0}
                onChange={handleTaxRateChange}
                className="w-20"
              />
            </div>
            <span>${formData.tax_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</span>
          </div>
          
          <div className="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${formData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {invoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};
