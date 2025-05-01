"""
Test script for the FastAPI server.

This script tests the API endpoints to ensure they are working correctly.
"""

import os
import sys
import json
import httpx
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API base URL
API_BASE_URL = f"http://localhost:{os.getenv('API_PORT', '8000')}"


async def test_health_check():
    """Test the health check endpoint."""
    print("\n=== Testing Health Check Endpoint ===")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200


async def test_documents_status():
    """Test the documents status endpoint."""
    print("\n=== Testing Documents Status Endpoint ===")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{API_BASE_URL}/api/documents/status")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200


async def test_document_search():
    """Test the document search endpoint."""
    print("\n=== Testing Document Search Endpoint ===")
    search_request = {
        "query_text": "test document",
        "match_threshold": 0.5,
        "match_count": 5
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE_URL}/api/documents/search",
            json=search_request
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200


async def main():
    """Run all tests."""
    print("=== Starting API Tests ===")
    
    # Test health check
    health_check_success = await test_health_check()
    
    # Test documents status
    documents_status_success = await test_documents_status()
    
    # Test document search
    document_search_success = await test_document_search()
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"Health Check: {'✅ Passed' if health_check_success else '❌ Failed'}")
    print(f"Documents Status: {'✅ Passed' if documents_status_success else '❌ Failed'}")
    print(f"Document Search: {'✅ Passed' if document_search_success else '❌ Failed'}")
    
    # Overall result
    overall_success = all([
        health_check_success,
        documents_status_success,
        document_search_success
    ])
    
    print(f"\nOverall Result: {'✅ All tests passed' if overall_success else '❌ Some tests failed'}")
    
    return 0 if overall_success else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
