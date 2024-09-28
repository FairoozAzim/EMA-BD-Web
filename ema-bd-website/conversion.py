import pandas as pd
import json

# Load CSV file into a DataFrame
csv_file_path = 'EMA-BD Team for 2023.csv'  # Replace with your CSV file path
df = pd.read_csv(csv_file_path)

# Convert DataFrame to JSON format
json_data = df.to_json(orient='records', indent=4)

# Save the JSON data to a file
json_file_path = 'prev_team.json'  # Specify the output JSON file path
with open(json_file_path, 'w') as json_file:
    json_file.write(json_data)

print(f"CSV successfully converted to JSON and saved to {json_file_path}")
