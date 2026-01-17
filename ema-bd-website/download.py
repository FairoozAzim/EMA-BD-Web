import pandas as pd
import requests
import os

# Function to download image from Google Drive link
def download_image_from_drive(url, save_path):
    file_id = url.split('id=')[-1]
    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    response = requests.get(download_url, stream=True)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    else:
        print(f"Failed to download image from {url}")

# Read the Excel file
excel_path = 'abc.xlsx'
df = pd.read_excel(excel_path)

# Assume the column with Google Drive links is named 'Photograph (Professional Photo Recommended)- Optional'
# Assume the ID column is named 'ID'
image_links = df['Your Profile Picture  (File Type: png or jpg)']
ids = df['ID']

# Specify the save folder
save_folder = 'Students_pictures'
if not os.path.exists(save_folder):
    os.makedirs(save_folder)

# Loop through the links and download images
for idx, link in enumerate(image_links):
    if pd.notna(link):  # Check if the link is not NaN
        file_id = ids[idx]  # Get the corresponding ID
        save_path = os.path.join(save_folder, f'{file_id}.jpg')  # Use ID as the file name
        download_image_from_drive(link, save_path)
        print(f"Downloaded and saved image to {save_path}")

print("All images downloaded.")
