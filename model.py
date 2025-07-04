import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans

def analyze_risk(data):
    df = pd.DataFrame(data)

    # ML: Anomaly Detection
    iso = IsolationForest(contamination=0.25, random_state=42)
    df["risk_flag"] = iso.fit_predict(df[["bp", "heart_rate", "stress_level"]])

    # ML: Clustering
    kmeans = KMeans(n_clusters=3, random_state=42)
    df["risk_group"] = kmeans.fit_predict(df[["bp", "heart_rate", "activity_level"]])

    # Risk Level Assignment
    def determine_risk_level(row):
        if row["risk_flag"] == -1 and row["risk_group"] == 0:
            return "High"
        elif row["risk_flag"] == 1 and row["risk_group"] == 2:
            return "Low"
        else:
            return "Medium"

    df["risk_level"] = df.apply(determine_risk_level, axis=1)

    # Recommendation based on risk level
    def assign_recommendation(level):
        return {
            "High": "Doctor Check-up",
            "Medium": "Mental Wellness Program",
            "Low": "Physical Fitness Program"
        }.get(level, "General Wellness Advice")

    df["recommendation"] = df["risk_level"].apply(assign_recommendation)

    # Add missing fields for frontend compatibility
    if "id" not in df.columns:
        df["id"] = df["employee_id"]
    if "name" not in df.columns:
        df["name"] = ["Employee " + str(i + 1) for i in range(len(df))]
    if "hours_worked" not in df.columns:
        df["hours_worked"] = [40 + i * 2 for i in range(len(df))]

    return df.to_dict(orient="records")
