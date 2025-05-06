from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
import pyrebase
from models import SignUpSchema, LoginSchema, ChatRequest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    description="This is firebase auth server",
    title="Firebase Auth",
    docs_url="/"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv
import os
import json

load_dotenv()
service_account_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if service_account_json and not firebase_admin._apps:
    cred = credentials.Certificate(json.loads(service_account_json))
    firebase_admin.initialize_app(cred)


firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL": ""
}
firebase = pyrebase.initialize_app(firebaseConfig)


@app.post("/signup")
async def create_an_account(user_data: SignUpSchema):
    email = user_data.email
    password = user_data.password

    try:
        user = auth.create_user(email=email, password=password)
        return JSONResponse(content={"message": f"User created successfully for user {user.uid}."}, status_code=201)

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail= f"User already created for email {email}.")


@app.post("/login")
async def create_access_token(user_data: LoginSchema):
    email = user_data.email
    password = user_data.password

    try:
        user = firebase.auth().sign_in_with_email_and_password(email=email, password=password)
        token = user['idToken']
        return JSONResponse(content={"token": token}, status_code=200)

    except:
        raise HTTPException(status_code=400, detail="Invalid email or password.")


@app.post("/ping")
async def validate_token(request: Request):
    headers = request.headers
    jwt = headers.get("Authorization")

    user = auth.verify_id_token(jwt)
    return user["user_id"]



from nse_data import get_data

last_data = []
@app.get("/stocks")
async def run_script():
    global last_data

    try:
        result = get_data()
        last_data = result["data"]["data"]
        return {"data": last_data}


    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"data": last_data}



import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = "You are an AI finance assistant, skilled in providing comprehensive support for all finance-related queries. Your expertise spans personal finance, investment strategies, tax planning, budgeting, financial markets, corporate finance, and financial analysis. You are patient, precise, and capable of explaining complex financial concepts in a simple and practical manner. Tailor your responses to the user's level of financial knowledge and always provide actionable insights."
        additional = ("Addition information - total portfolio value is ₹2,000,000, where fixed deposits is ₹500,000, "
                      "stocks ₹1,200,000, mutual funds ₹300,000, Fixed deposit yield 7.5%, Stocks Growth 24.8%, "
                      "MF returns 15.2%. Use this information if required.")
        response = model.generate_content(prompt + additional + request.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

