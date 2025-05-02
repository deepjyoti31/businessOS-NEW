import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://epgrylrflsrxkvpeieud.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZ3J5bHJmbHNyeGt2cGVpZXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NTI4MDAsImV4cCI6MjAzMTAyODgwMH0.Wd9JKx5R6Jf4yHYlbF2aGFQlPEZ7qiGIgafMY9i9Ric';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
