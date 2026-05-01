from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Customer Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/churn_model.pkl")
columns = joblib.load("models/model_columns.pkl")


class CustomerData(BaseModel):
    age: int
    tenure_months: int
    monthly_charges: float
    total_charges: float
    contract_type: int
    payment_method: int
    internet_service: int
    support_tickets: int
    usage_hours: float
    last_payment_days_ago: int
    is_autopay: int
    discount_used: int
    avg_charge_per_month: float
    support_intensity: float
    usage_category: int


@app.get("/")
def home():
    return {"message": "Customer Churn Prediction API is running"}


def get_action(probability):
    if probability >= 0.70:
        return "High Risk", "Offer discount + priority support call"
    elif probability >= 0.40:
        return "Medium Risk", "Send personalized retention email"
    else:
        return "Low Risk", "Continue normal engagement"


@app.post("/predict")
def predict_churn(data: CustomerData):
    input_df = pd.DataFrame([data.dict()])
    input_df = input_df[columns]

    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]
    risk_level, action = get_action(probability)

    return {
        "prediction": "Churn" if prediction == 1 else "No Churn",
        "churn_probability": round(probability * 100, 2),
        "risk_level": risk_level,
        "recommended_action": action
    }


@app.get("/customers")
def get_customers():
    df = pd.read_csv("data/processed/processed_churn_data.csv")
    sample = df.sample(8, random_state=10)

    customers = []

    for _, row in sample.iterrows():
        input_df = pd.DataFrame([row.drop(["customer_id", "churn"])])
        input_df = input_df[columns]

        prob = model.predict_proba(input_df)[0][1]
        prediction = model.predict(input_df)[0]
        risk_level, action = get_action(prob)

        customers.append({
            "customer_id": row["customer_id"],
            "age": int(row["age"]),
            "tenure_months": int(row["tenure_months"]),
            "monthly_charges": round(float(row["monthly_charges"]), 2),
            "support_tickets": int(row["support_tickets"]),
            "usage_hours": round(float(row["usage_hours"]), 2),
            "prediction": "Churn" if prediction == 1 else "No Churn",
            "churn_probability": round(prob * 100, 2),
            "risk_level": risk_level,
            "recommended_action": action
        })

    return customers