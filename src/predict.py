import pandas as pd
import joblib

model = joblib.load("models/churn_model.pkl")
columns = joblib.load("models/model_columns.pkl")

sample_customer = {
    "age": 28,
    "tenure_months": 5,
    "monthly_charges": 95.50,
    "total_charges": 480.00,
    "contract_type": 0,
    "payment_method": 2,
    "internet_service": 1,
    "support_tickets": 5,
    "usage_hours": 12.5,
    "last_payment_days_ago": 30,
    "is_autopay": 0,
    "discount_used": 0,
    "avg_charge_per_month": 80.0,
    "support_intensity": 0.83,
    "usage_category": 1
}

df = pd.DataFrame([sample_customer])
df = df[columns]

prediction = model.predict(df)[0]
probability = model.predict_proba(df)[0][1]

print("Prediction:", "Churn" if prediction == 1 else "No Churn")
print("Churn Probability:", round(probability * 100, 2), "%")