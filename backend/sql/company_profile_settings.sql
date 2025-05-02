-- Create company_profile table
CREATE TABLE IF NOT EXISTS public.company_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    industry TEXT,
    size TEXT,
    founded TEXT,
    website TEXT,
    description TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    tax_id TEXT,
    registration_number TEXT,
    fiscal_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    data_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, key)
);

-- Add RLS policies to company_profile table
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with 'company.read' permission can view company profile
CREATE POLICY "company_profile_select_policy" ON public.company_profile
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'company.read')
            WHERE user_has_permission = true
        )
    );

-- Only authenticated users with 'company.update' permission can update company profile
CREATE POLICY "company_profile_update_policy" ON public.company_profile
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'company.update')
            WHERE user_has_permission = true
        )
    );

-- Only authenticated users with 'company.create' permission can insert company profile
CREATE POLICY "company_profile_insert_policy" ON public.company_profile
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'company.create')
            WHERE user_has_permission = true
        )
    );

-- Add RLS policies to system_settings table
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with 'settings.read' permission can view system settings
CREATE POLICY "system_settings_select_policy" ON public.system_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'settings.read')
            WHERE user_has_permission = true
        )
    );

-- Only authenticated users with 'settings.update' permission can update system settings
CREATE POLICY "system_settings_update_policy" ON public.system_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'settings.update')
            WHERE user_has_permission = true
        )
    );

-- Only authenticated users with 'settings.create' permission can insert system settings
CREATE POLICY "system_settings_insert_policy" ON public.system_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_has_permission(auth.uid(), 'settings.create')
            WHERE user_has_permission = true
        )
    );

-- Insert default permissions for company profile and system settings
INSERT INTO public.permissions (name, description, category)
VALUES 
    ('company.read', 'View company profile information', 'Company'),
    ('company.create', 'Create company profile information', 'Company'),
    ('company.update', 'Update company profile information', 'Company'),
    ('settings.read', 'View system settings', 'Settings'),
    ('settings.create', 'Create system settings', 'Settings'),
    ('settings.update', 'Update system settings', 'Settings')
ON CONFLICT (name) DO NOTHING;

-- Insert default system settings
INSERT INTO public.system_settings (category, key, value, description, data_type)
VALUES
    -- General settings
    ('general', 'company_name', '"BusinessOS"', 'Name of the company', 'string'),
    ('general', 'date_format', '"MM/DD/YYYY"', 'Default date format', 'string'),
    ('general', 'time_format', '"12h"', 'Default time format (12h or 24h)', 'string'),
    ('general', 'timezone', '"UTC"', 'Default timezone', 'string'),
    ('general', 'language', '"en"', 'Default language', 'string'),
    
    -- Security settings
    ('security', 'password_expiry_days', '90', 'Number of days before password expires', 'number'),
    ('security', 'min_password_length', '8', 'Minimum password length', 'number'),
    ('security', 'require_special_chars', 'true', 'Require special characters in passwords', 'boolean'),
    ('security', 'session_timeout_minutes', '30', 'Session timeout in minutes', 'number'),
    ('security', 'max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'number'),
    
    -- Notification settings
    ('notifications', 'email_notifications', 'true', 'Enable email notifications', 'boolean'),
    ('notifications', 'document_upload_notification', 'true', 'Notify on document uploads', 'boolean'),
    ('notifications', 'document_share_notification', 'true', 'Notify when documents are shared', 'boolean'),
    ('notifications', 'system_update_notification', 'true', 'Notify on system updates', 'boolean'),
    
    -- Appearance settings
    ('appearance', 'theme', '"light"', 'UI theme (light or dark)', 'string'),
    ('appearance', 'primary_color', '"#0284c7"', 'Primary UI color', 'string'),
    ('appearance', 'sidebar_collapsed', 'false', 'Default sidebar state', 'boolean'),
    ('appearance', 'density', '"comfortable"', 'UI density (compact, comfortable, spacious)', 'string'),
    
    -- Storage settings
    ('storage', 'auto_backup_enabled', 'true', 'Enable automatic backups', 'boolean'),
    ('storage', 'backup_frequency_days', '7', 'Backup frequency in days', 'number'),
    ('storage', 'max_file_size_mb', '50', 'Maximum file size in MB', 'number'),
    ('storage', 'allowed_file_types', '["pdf", "docx", "xlsx", "pptx", "txt", "jpg", "png"]', 'Allowed file types', 'array')
ON CONFLICT (category, key) DO NOTHING;

-- Insert a default company profile if none exists
INSERT INTO public.company_profile (name, industry, size, founded, website, description, email, phone)
SELECT 'BusinessOS', 'Software Development', '10-50 employees', '2023', 'https://business-os.example.com', 'AI-First Business Management Platform for Small Businesses', 'contact@business-os.example.com', '+1 (555) 123-4567'
WHERE NOT EXISTS (SELECT 1 FROM public.company_profile);
