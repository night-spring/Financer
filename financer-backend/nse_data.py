import requests
import json
import sys
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def get_nse_data():
    session = requests.Session()
    url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET"
    
    # Configure retry strategy
    retries = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    session.mount('https://', HTTPAdapter(max_retries=retries))

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com/",
        "DNT": "1"
    }

    try:
        # Initial request to get cookies
        session.get("https://www.nseindia.com", headers=headers, timeout=15)
        time.sleep(2)  # Add delay between requests
        
        # Second request to maintain session
        session.get("https://www.nseindia.com/market-data/live-equity-market", 
                   headers=headers, timeout=15)
        time.sleep(2)
        
        # Main API request
        response = session.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        
        return {
            "data": response.json().get("data", []),
            "error": None
        }
        
    except requests.exceptions.RequestException as e:
        return {
            "data": [],
            "error": f"Request failed: {str(e)}"
        }
    except Exception as e:
        return {
            "data": [],
            "error": f"Unexpected error: {str(e)}"
        }
