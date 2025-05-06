import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def get_nse_data():
    session = requests.Session()
    url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com/",
        "DNT": "1"
    }

    try:
        # Initial request to get cookies
        session.get("https://www.nseindia.com", headers=headers)
        time.sleep(2)  # Add delay between requests
        
        # Second request to maintain session
        session.get("https://www.nseindia.com/market-data/live-equity-market", 
                   headers=headers)
        time.sleep(2)
        
        # Main API request
        response = session.get(url, headers=headers)
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

def get_data():
    result = get_nse_data()
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "data": result
    }

