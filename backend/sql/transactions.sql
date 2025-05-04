-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category TEXT,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT positive_income_amount CHECK (
        (type = 'Income' AND amount > 0) OR
        (type = 'Expense' AND amount < 0)
    )
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- Create index on date for faster date range queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);

-- Create index on type for faster filtering
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- Create index on is_deleted for faster filtering of non-deleted transactions
CREATE INDEX IF NOT EXISTS idx_transactions_is_deleted ON public.transactions(is_deleted);

-- Row Level Security Policies

-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select only their own transactions
CREATE POLICY transactions_select_policy ON public.transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy for users to insert only their own transactions
CREATE POLICY transactions_insert_policy ON public.transactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update only their own transactions
CREATE POLICY transactions_update_policy ON public.transactions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy for users to delete only their own transactions
CREATE POLICY transactions_delete_policy ON public.transactions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policy for admins to access all transactions
-- This assumes there's a 'is_admin' function or a way to check if a user is an admin
CREATE POLICY transactions_admin_policy ON public.transactions
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'Admin'
        )
    );

-- Create trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.transactions (user_id, date, type, description, amount, category, reference)
VALUES 
    -- Replace with actual user IDs from your auth.users table
    ((SELECT id FROM auth.users LIMIT 1), NOW(), 'Income', 'Client payment - ABC Corp', 12500.00, 'Sales', 'INV-001'),
    ((SELECT id FROM auth.users LIMIT 1), NOW() - INTERVAL '1 day', 'Expense', 'Office rent payment', -3500.00, 'Rent', 'RENT-001'),
    ((SELECT id FROM auth.users LIMIT 1), NOW() - INTERVAL '2 days', 'Expense', 'Software subscription', -299.00, 'Software', 'SUB-001'),
    ((SELECT id FROM auth.users LIMIT 1), NOW() - INTERVAL '3 days', 'Income', 'Client payment - XYZ Ltd', 9750.00, 'Sales', 'INV-002'),
    ((SELECT id FROM auth.users LIMIT 1), NOW() - INTERVAL '4 days', 'Expense', 'Marketing expenses', -1250.00, 'Marketing', 'MKT-001')
ON CONFLICT DO NOTHING;
