import pandas as pd
import numpy as np
import os

np.random.seed(42)

os.makedirs("data/raw", exist_ok=True)

n = 3000

data = {
    "customer_id": [f"CUST_{i}" for i in range(1, n + 1)],
    "age": np.random.randint(18, 70, n),
    "tenure_months": np.random.randint(1, 72, n),
    "monthly_charges": np.random.uniform(20, 120, n).round(2),
    "total_charges": np.random.uniform(100, 8000, n).round(2),
    "contract_type": np.random.choice(["Month-to-month", "One year", "Two year"], n, p=[0.55, 0.25, 0.20]),
    "payment_method": np.random.choice(["Credit Card", "Bank Transfer", "UPI", "Cash"], n),
    "internet_service": np.random.choice(["DSL", "Fiber Optic", "No"], n, p=[0.35, 0.50, 0.15]),
    "support_tickets": np.random.randint(0, 8, n),
    "usage_hours": np.random.uniform(1, 100, n).round(2),
    "last_payment_days_ago": np.random.randint(1, 45, n),
    "is_autopay": np.random.choice([0, 1], n, p=[0.45, 0.55]),
    "discount_used": np.random.choice([0, 1], n, p=[0.65, 0.35]),
}

df = pd.DataFrame(data)

churn_score = (
    (df["contract_type"] == "Month-to-month") * 2
    + (df["monthly_charges"] > 80) * 1.5
    + (df["support_tickets"] > 3) * 2
    + (df["tenure_months"] < 12) * 1.5
    + (df["usage_hours"] < 20) * 1.5
    + (df["last_payment_days_ago"] > 25) * 1
    + (df["is_autopay"] == 0) * 1
)

probability = 1 / (1 + np.exp(-(churn_score - 4)))
df["churn"] = np.random.binomial(1, probability)

df.to_csv("data/raw/customer_churn_data.csv", index=False)

print("Synthetic customer churn dataset created successfully!")
print(df.head())
print("Dataset shape:", df.shape)