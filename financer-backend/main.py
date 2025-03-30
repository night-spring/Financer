import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
import pyrebase
from models import SignUpSchema, LoginSchema
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    description="This is firebase auth server",
    title="Firebase Auth",
    docs_url="/"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

firebaseConfig = {
  "apiKey": "AIzaSyCHbEP4wFiVb0jFnolhg6AwWzzM6OyeTMY",
  "authDomain": "financer-fastapi-auth.firebaseapp.com",
  "projectId": "financer-fastapi-auth",
  "storageBucket": "financer-fastapi-auth.firebasestorage.app",
  "messagingSenderId": "996601250965",
  "appId": "1:996601250965:web:59b564590b4a3f32a3c79c",
  "measurementId": "G-338VMGKVYC",
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



import subprocess
import json
from pathlib import Path


last_data = []
@app.post("/stocks")
async def run_script():
    script_path = Path("nse_data.py")  # Ensure this file exists

    try:
        result = subprocess.run(["python", str(script_path)], capture_output=True, text=True, check=True)
        data = json.loads(result.stdout.strip())
        last_data = [data]
        return {"data": last_data}
    except subprocess.CalledProcessError as e:
        return {"data": last_data}



import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load API Key
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Use a valid model
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

