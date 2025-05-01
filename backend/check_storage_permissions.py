"""
Script to check Supabase Storage permissions.

This script checks if the service key has the necessary permissions to access files in the Supabase Storage bucket.
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

# Check if the documents bucket exists
try:
    print("\nChecking if the documents bucket exists...")
    
    # Try lowercase bucket name
    try:
        bucket_name = "documents"
        print(f"Trying with lowercase bucket name: {bucket_name}")
        response = supabase_client.storage.get_bucket(bucket_name)
        print(f"Bucket '{bucket_name}' exists!")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error with lowercase bucket name: {e}")
        
        # Try uppercase bucket name
        try:
            bucket_name = "Documents"
            print(f"Trying with uppercase bucket name: {bucket_name}")
            response = supabase_client.storage.get_bucket(bucket_name)
            print(f"Bucket '{bucket_name}' exists!")
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error with uppercase bucket name: {e}")
            print("Could not find the documents bucket. Please create it in the Supabase dashboard.")
            sys.exit(1)
except Exception as e:
    print(f"Error checking if the documents bucket exists: {e}")
    sys.exit(1)

# List files in the bucket
try:
    print("\nListing files in the bucket...")
    
    # Try lowercase bucket name
    try:
        bucket_name = "documents"
        print(f"Trying with lowercase bucket name: {bucket_name}")
        response = supabase_client.storage.from_(bucket_name).list()
        print(f"Files in bucket '{bucket_name}':")
        for item in response:
            print(f"- {item.get('name')} (ID: {item.get('id')})")
    except Exception as e:
        print(f"Error listing files with lowercase bucket name: {e}")
        
        # Try uppercase bucket name
        try:
            bucket_name = "Documents"
            print(f"Trying with uppercase bucket name: {bucket_name}")
            response = supabase_client.storage.from_(bucket_name).list()
            print(f"Files in bucket '{bucket_name}':")
            for item in response:
                print(f"- {item.get('name')} (ID: {item.get('id')})")
        except Exception as e:
            print(f"Error listing files with uppercase bucket name: {e}")
            print("Could not list files in the bucket. Check your service key permissions.")
except Exception as e:
    print(f"Error listing files in the bucket: {e}")

# Check if we can query the files table
try:
    print("\nChecking if we can query the files table...")
    response = supabase_client.table("files").select("*").limit(5).execute()
    print("Successfully queried the files table!")
    print(f"Found {len(response.data)} files:")
    for file in response.data:
        print(f"- {file.get('name')} (ID: {file.get('id')})")
        print(f"  Storage path: {file.get('storage_path')}")
        print(f"  URL: {file.get('metadata', {}).get('url', 'No URL')}")
        
        # Try to download this file
        try:
            file_id = file.get('id')
            storage_path = file.get('storage_path')
            file_name = file.get('name')
            
            print(f"\nTrying to download file {file_name} (ID: {file_id})...")
            
            # Try with storage path
            try:
                print(f"Trying with storage path: {storage_path}")
                response = supabase_client.storage.from_(bucket_name).download(storage_path)
                print(f"Successfully downloaded file with storage path! Size: {len(response)} bytes")
            except Exception as e:
                print(f"Error downloading with storage path: {e}")
                
                # Try with fixed path (remove double slash)
                try:
                    fixed_path = storage_path.replace("//", "/")
                    print(f"Trying with fixed path: {fixed_path}")
                    response = supabase_client.storage.from_(bucket_name).download(fixed_path)
                    print(f"Successfully downloaded file with fixed path! Size: {len(response)} bytes")
                except Exception as e:
                    print(f"Error downloading with fixed path: {e}")
                    
                    # Try with just the file name
                    try:
                        print(f"Trying with just the file name: {file_name}")
                        response = supabase_client.storage.from_(bucket_name).download(file_name)
                        print(f"Successfully downloaded file with just the file name! Size: {len(response)} bytes")
                    except Exception as e:
                        print(f"Error downloading with just the file name: {e}")
                        print(f"Could not download file {file_name} (ID: {file_id})")
        except Exception as e:
            print(f"Error trying to download file: {e}")
except Exception as e:
    print(f"Error querying the files table: {e}")

print("\nStorage permissions check complete")
