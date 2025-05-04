-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    client_id UUID NOT NULL REFERENCES public.clients(id),
    invoice_number TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue')),
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_rate DECIMAL(5, 2),
    tax_amount DECIMAL(12, 2),
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,
    terms TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies to invoices table
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own invoices
CREATE POLICY "invoices_select_policy" ON public.invoices
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only authenticated users can insert their own invoices
CREATE POLICY "invoices_insert_policy" ON public.invoices
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own invoices
CREATE POLICY "invoices_update_policy" ON public.invoices
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Only authenticated users can delete their own invoices
CREATE POLICY "invoices_delete_policy" ON public.invoices
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies to invoice_items table
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view invoice items for their own invoices
CREATE POLICY "invoice_items_select_policy" ON public.invoice_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.user_id = auth.uid()
        )
    );

-- Only authenticated users can insert invoice items for their own invoices
CREATE POLICY "invoice_items_insert_policy" ON public.invoice_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.user_id = auth.uid()
        )
    );

-- Only authenticated users can update invoice items for their own invoices
CREATE POLICY "invoice_items_update_policy" ON public.invoice_items
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.user_id = auth.uid()
        )
    );

-- Only authenticated users can delete invoice items for their own invoices
CREATE POLICY "invoice_items_delete_policy" ON public.invoice_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.user_id = auth.uid()
        )
    );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_client_id_idx ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON public.invoice_items(invoice_id);

-- Insert some sample data for testing
-- First, get a client ID to reference
DO $$
DECLARE
    client_id_1 UUID;
    client_id_2 UUID;
    client_id_3 UUID;
    user_id_1 UUID;
    invoice_id_1 UUID;
    invoice_id_2 UUID;
    invoice_id_3 UUID;
BEGIN
    -- Get the first user ID
    SELECT id INTO user_id_1 FROM auth.users LIMIT 1;

    -- Get client IDs
    SELECT id INTO client_id_1 FROM public.clients WHERE name = 'ABC Corp' LIMIT 1;
    SELECT id INTO client_id_2 FROM public.clients WHERE name = 'XYZ Ltd' LIMIT 1;
    SELECT id INTO client_id_3 FROM public.clients WHERE name = 'Acme Inc' LIMIT 1;

    -- Insert invoices one by one to get their IDs
    -- Insert first invoice
    INSERT INTO public.invoices (
        user_id, client_id, invoice_number, date, due_date, status,
        subtotal, tax_rate, tax_amount, total, notes, terms
    ) VALUES
        (user_id_1, client_id_1, 'INV-001', NOW(), NOW() + INTERVAL '30 days', 'Paid',
         12500.00, 8.25, 1031.25, 13531.25, 'Thank you for your business', 'Net 30')
    RETURNING id INTO invoice_id_1;

    -- Insert second invoice
    INSERT INTO public.invoices (
        user_id, client_id, invoice_number, date, due_date, status,
        subtotal, tax_rate, tax_amount, total, notes, terms
    ) VALUES
        (user_id_1, client_id_2, 'INV-002', NOW(), NOW() + INTERVAL '30 days', 'Sent',
         9750.00, 8.25, 804.38, 10554.38, 'Thank you for your business', 'Net 30')
    RETURNING id INTO invoice_id_2;

    -- Insert third invoice
    INSERT INTO public.invoices (
        user_id, client_id, invoice_number, date, due_date, status,
        subtotal, tax_rate, tax_amount, total, notes, terms
    ) VALUES
        (user_id_1, client_id_3, 'INV-003', NOW(), NOW() + INTERVAL '30 days', 'Draft',
         5300.00, 8.25, 437.25, 5737.25, 'Thank you for your business', 'Net 30')
    RETURNING id INTO invoice_id_3;

    -- Insert invoice items for the first invoice
    INSERT INTO public.invoice_items (
        invoice_id, description, quantity, unit_price, amount
    ) VALUES
        (invoice_id_1, 'Web Development Services', 50, 150.00, 7500.00),
        (invoice_id_1, 'UI/UX Design', 40, 125.00, 5000.00);

    -- Insert invoice items for the second invoice
    INSERT INTO public.invoice_items (
        invoice_id, description, quantity, unit_price, amount
    ) VALUES
        (invoice_id_2, 'Mobile App Development', 65, 150.00, 9750.00);

    -- Insert invoice items for the third invoice
    INSERT INTO public.invoice_items (
        invoice_id, description, quantity, unit_price, amount
    ) VALUES
        (invoice_id_3, 'SEO Services', 20, 150.00, 3000.00),
        (invoice_id_3, 'Content Creation', 23, 100.00, 2300.00);
END $$;
