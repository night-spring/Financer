import requests
import json

def get_nse_data(url="https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET"):
    session = requests.Session()

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
    }
    session.headers.update(headers)

    main_page_url = "https://www.nseindia.com/market-data/live-equity-market"
    try:
        session.headers["Referer"] = ""
        response = session.get(main_page_url, timeout=15)
        response.raise_for_status()
        #print(f"Main page visited (status: {response.status_code})")
        # Debug:
        # print(f"Cookies after main page: {session.cookies.get_dict()}")
        # print(f"Main page URL: {response.url}")

        # API request
        session.headers["Referer"] = main_page_url
        session.headers["Sec-Fetch-Site"] = "same-origin"
        response = session.get(url, timeout=20)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return None


result = get_nse_data()
print(json.dumps(result))