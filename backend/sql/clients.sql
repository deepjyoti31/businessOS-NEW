-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Add RLS policies to clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own clients
CREATE POLICY "clients_select_policy" ON public.clients
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only authenticated users can insert their own clients
CREATE POLICY "clients_insert_policy" ON public.clients
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own clients
CREATE POLICY "clients_update_policy" ON public.clients
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Only authenticated users can delete their own clients
CREATE POLICY "clients_delete_policy" ON public.clients
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);

-- Create index on name for faster search
CREATE INDEX IF NOT EXISTS clients_name_idx ON public.clients(name);

-- Insert some sample data for testing
INSERT INTO public.clients (user_id, name, contact_name, email, phone, address, city, state, zip, country)
VALUES 
    -- Replace with actual user IDs from your auth.users table
    ((SELECT id FROM auth.users LIMIT 1), 'ABC Corp', 'John Smith', 'john.smith@abccorp.com', '+1 (555) 123-4567', '123 Main St', 'New York', 'NY', '10001', 'USA'),
    ((SELECT id FROM auth.users LIMIT 1), 'XYZ Ltd', 'Sarah Johnson', 'sarah.j@xyzltd.com', '+1 (555) 234-5678', '456 Park Ave', 'Chicago', 'IL', '60601', 'USA'),
    ((SELECT id FROM auth.users LIMIT 1), 'Acme Inc', 'Michael Brown', 'michael.b@acmeinc.com', '+1 (555) 345-6789', '789 Oak Rd', 'Los Angeles', 'CA', '90001', 'USA'),
    ((SELECT id FROM auth.users LIMIT 1), 'Tech Solutions', 'Emily Davis', 'emily.d@techsolutions.com', '+1 (555) 456-7890', '101 Pine St', 'San Francisco', 'CA', '94101', 'USA'),
    ((SELECT id FROM auth.users LIMIT 1), 'Global Services', 'Robert Wilson', 'robert.w@globalservices.com', '+1 (555) 567-8901', '202 Maple Ave', 'Boston', 'MA', '02101', 'USA');
