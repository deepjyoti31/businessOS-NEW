-- Create budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    total_amount DECIMAL(12, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    fiscal_year TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Draft', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create budget_categories table
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES public.budgets(id),
    name TEXT NOT NULL,
    description TEXT,
    allocated_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create budget_expenses table
CREATE TABLE IF NOT EXISTS public.budget_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_category_id UUID NOT NULL REFERENCES public.budget_categories(id),
    transaction_id UUID REFERENCES public.transactions(id),
    amount DECIMAL(12, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Add RLS policies for budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budgets"
    ON public.budgets
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
    ON public.budgets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
    ON public.budgets
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
    ON public.budgets
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for budget_categories
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget categories"
    ON public.budget_categories
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = budget_categories.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own budget categories"
    ON public.budget_categories
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = budget_categories.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own budget categories"
    ON public.budget_categories
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = budget_categories.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own budget categories"
    ON public.budget_categories
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.budgets
            WHERE budgets.id = budget_categories.budget_id
            AND budgets.user_id = auth.uid()
        )
    );

-- Add RLS policies for budget_expenses
ALTER TABLE public.budget_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budget expenses"
    ON public.budget_expenses
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.budget_categories
            JOIN public.budgets ON budget_categories.budget_id = budgets.id
            WHERE budget_categories.id = budget_expenses.budget_category_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own budget expenses"
    ON public.budget_expenses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.budget_categories
            JOIN public.budgets ON budget_categories.budget_id = budgets.id
            WHERE budget_categories.id = budget_expenses.budget_category_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own budget expenses"
    ON public.budget_expenses
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.budget_categories
            JOIN public.budgets ON budget_categories.budget_id = budgets.id
            WHERE budget_categories.id = budget_expenses.budget_category_id
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own budget expenses"
    ON public.budget_expenses
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.budget_categories
            JOIN public.budgets ON budget_categories.budget_id = budgets.id
            WHERE budget_categories.id = budget_expenses.budget_category_id
            AND budgets.user_id = auth.uid()
        )
    );
