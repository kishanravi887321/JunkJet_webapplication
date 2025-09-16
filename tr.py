import plotly.express as px
import pandas as pd

# Example ARGO-like dataset
data = {
    "FloatID": [2903304, 2903304, 2903304, 2901205, 2901205, 2901205],
    "Latitude": [1.0, 1.0, 1.0, -2.0, -2.0, -2.0],
    "Longitude": [160.0, 160.0, 160.0, 150.0, 150.0, 150.0],
    "Date": pd.to_datetime([
        "2023-03-05", "2023-03-05", "2023-03-05",
        "2023-03-12", "2023-03-12", "2023-03-12"
    ]),
    "Depth": [0, 500, 1000, 0, 500, 1000],
    "Salinity": [34.5, 34.8, 35.0, 34.6, 34.9, 35.1]
}
df = pd.DataFrame(data)

# Filter: Equator region (-5 to +5 lat), March 2023
mask = (df["Latitude"].between(-5, 5)) & (df["Date"].dt.month == 3) & (df["Date"].dt.year == 2023)
df_filtered = df[mask]

# Plot salinity profiles
fig = px.line(
    df_filtered,
    x="Salinity",
    y="Depth",
    color="FloatID",
    markers=True,
    title="Salinity Profiles near the Equator (March 2023)",
    labels={"Salinity": "Salinity (PSU)", "Depth": "Depth (m)"}
)

# Reverse y-axis (depth increases downward in ocean)
fig.update_yaxes(autorange="reversed")

fig.show()
