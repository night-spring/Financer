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



import requests
import pandas as pd
last_data = []
@app.get("/stocks")
def get_stock_data():
    global last_data
    session = requests.Session()
    urltofetch = 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20TOTAL%20MARKET'
    nseheaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': '_ga=GA1.1.82098543.1742974458; AKA_A2=A; bm_mi=6ADD3DB87782C0D659AD6862968925C4~YAAQzKTUF2n6C7OVAQAApq6W2BufUXVAcsqSWUDlQUE3ppci6B7xx7jsQJCusqy7rFT2eCKQ6pvhMeidBpBof/hID7FrhM8QcjMrQ13KbO9aSEDhGowUARitltcq9uQZjI//Uy7HlpjjM/fF7xhG4Rw723YTalnMT25lbwN6pqVHHPSfDIEZJi+KZHj4YFr/kZ04aqX4ln/v9ne+ni6T5SIeUtwB3xJZEluiFBqEICnhJJEJ5QYMSFH1OLQB2QoeurrHoWWSq167dXvtHFsLFl2UwFk92u9mZxRqTNcv+klM3DE9IubN7QILsmRjTqP81P8le5AbZKojDxUxzN1CBVQu~1; nsit=7xLe0wOVoDnLf8VU3iO1jvkf; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTc0MzA5NTUxMiwiZXhwIjoxNzQzMTAyNzEyfQ.wRC0H0rTPH-YWQJCK9IXZ5wSuY3L9xvfh2ViXhauJMI; bm_sz=8AAF17F11632DA596851F8953F0CFB33~YAAQzKTUFwH+C7OVAQAAlr+W2BvXxxx24i+i8oQDUwk9z22y54YEZQVc7Z7eCuPp1wR/hp/cIoNxleSp4OqWxu22QhtyYSzWVNF/HbB5CB89QtBJQPW8v0OUwB7FlW7FPkVUdbSnRmQErbjhJPXQdvF3mn4xxnBjeTPK/BjsjhucN+YWibni9nLGFRsSGZcGGXCNJZHnj2y9Q09WZXxrBOUiuJ3CNEWaWNiGX+7bNz6TaoTEP2Oj09qbDiyc/B5PltOjdCZvpcEnSL1RqAqEzZVoV9z3S+1EKczOHslqJaInVxaoklzC5l6bvv8C2jEFaT+04zS9VM7jZ1e/bCgqRfL8ArjdtWkixh/0voQ28L2sI3akpIJuMgaV4g1lAMDSjiMZAkfOaG5627er5blkWkiNpsYTKqLpRvU6mLoQtI15by0MqKvC6Hzfm4Tma3Ybh19lN0XpGhd+Yrc4eIKmzkHokSJeVQaSPVnTjd74LxcgMA==~4340036~3425333; _ga_E0LYHCLJY3=GS1.1.1743095499.5.1.1743095514.0.0.0; ak_bmsc=1AAE50456D100FC764CCDE1866F39AE2~000000000000000000000000000000~YAAQzKTUFyr/C7OVAQAAJ8SW2Bs0264sJFLl8WQFxPiOuw9/xWHgz1h/YmSrTzqiaUJSUYl1aIIbqrqpPQqJ+LW4pPwbSH+sxmxd3S61DvmwNmisD8rN4gbyAX9KWX9vuqCAPDrPr+qYiO+fYWUPsGOkLI+65y4liSVetCaKzHdRuV4JZKRROLwOQExayY29An76CbbbmNeBChpGZPWHvidlAY4eM9+RWhfnGdh3T5fLMgR+w/7HbobnKXiqmPdon2v7vJl8C3TKL/966nZKWx/ZqUIaFStPGAUDXA0E0HyF3YfjQSVvLcM1yEh2hVk+jFy+aNyw7mlH5kndSmj9Xv3j+VKbWMPZoGnxepJGniE5Y8BdJXBp0TBLoVChD493smjzevJ9dsy83pBnW58qJdXPvfBndr3q5Q3fzNKVgCRo4j7+0dyeLuMcl9W6G1T9VWOdoptYwT96DcYjUHwVnBMYR9qatnITJbnFUOHPnWs7JI3SO6X9xOf2F3Rl2fHp3SIKvg==; _ga_87M7PJ3R97=GS1.1.1743095515.6.1.1743095515.60.0.0; _ga_WM2NSQKJEK=GS1.1.1743095515.6.0.1743095515.0.0.0; RT="z=1&dm=nseindia.com&si=e27b5afe-ba70-4c68-86c9-8f984a2aae72&ss=m8rm2a0r&sl=1&se=8c&tt=22o&bcn=%2F%2F684d0d46.akstat.io%2F&ld=276"; bm_sv=663F244ED54FE444074CC58966E67D4C~YAAQzKTUF9MDDLOVAQAAVdyW2BsDQiH9vnEmt3CLQ3bjBbqVSN2VYzdazGRwhZqCqsANDZ2dgWP5jmR6W0sf6V7Sp7iFNI4sHY8QkJH99h7Z25m3O/DSfW4zgSvgjuzRhBgkZSkp9vBGzWK9rrRT2EBfOuV1mRGOts33s2URVzF5QneIa3SFvZvb6bBJj9lGu3RqY7B9SD5beJiZDb7EvzTUP987LQz+v8SJugqgoGyUFY3xuVkmmFOXGDlfzLgGdkM=~1; _abck=6DF0E3EB54A1F018B0523881454D2581~0~YAAQnkw5FyARVLWVAQAAVMqW2A3XSeAB1X8dbvHwv7DJJ81s/jC61kjTpJ7ZkokdW7cXtnxVcgyOHKDz+/KQqMg9HrBBF+YCn0KAnAtA/6Vekwu4Yzgcb9PK7NFstyS6hDdTEt5LBlvfAr8rbthIniY9SiYixQziEdlvV3A9/ZcmbsGZA3bVmvMjlo+2Xwed7nS+68ew9wX/OzDWALc5UE/FERJvFzW7+rKLhIGpu+ZHiQRcY0POdo1sxkB0sPWza/lI0yUnbCFaXpR5z9WfDUjPFuF2gdqh9iDshotyNYUrkp6WytMLNCSIQyLW4lV9KxbJ3runPfIsqMbCvdB8FwFhCj2Pjy+pDyZlzJ3nilJau3IRQ57SaedjGCDRjIMkPUnMW5krJbJ6wQ0V/WnIq+vhNV8ZUVlDIr9KS3Z0HGJJ/4jRn6eadM/rpIQ7IivcAbrRG8ep6D93ZBTP1+LnfRVsgmw7pNhswIhmT41pvnuVf1DgeagvEKAod7p/fLZsJHk+8J0LJDvquy7NGdujYCTyKObzC5R+bRuv~-1~-1~-1'
    }
    try:
        stockdata = session.get(url=urltofetch, headers=nseheaders)
        data = stockdata.json()
        last_data = data['data']
        return JSONResponse(content={"data": last_data}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"data":last_data}, status_code=200)


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

