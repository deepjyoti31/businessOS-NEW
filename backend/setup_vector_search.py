"""
Script to set up vector search in Supabase.

This script provides instructions for setting up vector search in Supabase.
Since we can't directly execute SQL statements through the Supabase API,
you'll need to run these SQL statements in the Supabase SQL Editor.
"""

import os
import sys
from dotenv import load_dotenv
import supabase

# Load environment variables
load_dotenv()

# Get Supabase credentials
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in the .env file")
    sys.exit(1)

# Initialize Supabase client
try:
    print(f"Connecting to Supabase at {supabase_url}")
    supabase_client = supabase.create_client(supabase_url, supabase_key)
    print("Connected to Supabase")
except Exception as e:
    print(f"Error connecting to Supabase: {e}")
    sys.exit(1)

# Read the migration SQL
migration_path = os.path.join(os.path.dirname(__file__), "supabase", "migrations", "20240430_vector_search.sql")
try:
    with open(migration_path, "r") as f:
        migration_sql = f.read()
    print(f"Read migration SQL from {migration_path}")
except Exception as e:
    print(f"Error reading migration SQL: {e}")
    sys.exit(1)

# Print instructions for setting up vector search
print("\n" + "=" * 80)
print("INSTRUCTIONS FOR SETTING UP VECTOR SEARCH IN SUPABASE")
print("=" * 80)
print("\n1. Log in to your Supabase dashboard")
print("2. Go to the SQL Editor")
print("3. Create a new query")
print("4. Copy and paste the following SQL statements:")
print("\n" + "-" * 40 + " SQL STATEMENTS " + "-" * 40)
print(migration_sql)
print("-" * 80)
print("\n5. Run the SQL statements")
print("\nOnce you've run these SQL statements, vector search will be set up in your Supabase database.")
print("You can then use the document processing and search endpoints in the FastAPI server.")

# Check if the document_embeddings table exists
try:
    print("\nChecking if document_embeddings table exists...")
    response = supabase_client.table("document_embeddings").select("count", count="exact").limit(1).execute()
    print("document_embeddings table exists!")
    print(f"Response: {response}")
except Exception as e:
    print(f"document_embeddings table does not exist yet: {e}")
    print("Please run the SQL statements in the Supabase SQL Editor to create the table.")

print("\nSetup instructions complete")
