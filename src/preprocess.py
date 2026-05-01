import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder

os.makedirs("data/processed", exist_ok=True)

df = pd.read_csv("data/raw/customer_churn_data.csv")

df.drop_duplicates(inplace=True)

df["avg_charge_per_month"] = df["total_charges"] / (df["tenure_months"] + 1)
df["support_intensity"] = df["support_tickets"] / (df["tenure_months"] + 1)
df["usage_category"] = pd.cut(
    df["usage_hours"],
    bins=[0, 20, 60, 100],
    labels=["Low", "Medium", "High"]
)

categorical_cols = [
    "contract_type",
    "payment_method",
    "internet_service",
    "usage_category"
]

encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

df.to_csv("data/processed/processed_churn_data.csv", index=False)

print("Preprocessing completed successfully!")
print(df.head())
print(df.shape)