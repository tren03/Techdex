import csv
import io
import json
import os
from datetime import datetime

import requests


def get_ctf_from_csv():
    SHEET_ID = (
        "1oIkCgQhaCqfphRslJC5LGQwcZtIWhEvipW9gc2B0nmU"  # Replace with your CTF sheet ID
    )
    GID = "0"  # default tab

    CSV_URL = (
        f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}"
    )

    print(f"Fetching data from: {CSV_URL}")

    try:
        response = requests.get(CSV_URL)
        print(f"Response: {response.text}")
        response.raise_for_status()

        categories = {}
        content = io.StringIO(response.text)
        reader = csv.reader(content)

        # Skip header row
        next(reader, None)

        row_count = 0
        for row in reader:
            row_count += 1
            if len(row) >= 4:  # Ensure we have all required columns
                category, name, difficulty, link = row[0], row[1], row[2], row[3]

                if category not in categories:
                    categories[category] = []

                challenge_id = f"{category.lower().replace(' ', '-')}-{len(categories[category]) + 1}"

                categories[category].append(
                    {
                        "id": challenge_id,
                        "name": name.strip(),
                        "difficulty": difficulty.strip().lower(),
                        "link": link.strip(),
                    }
                )

        print(f"Processed {row_count} rows")
        print(f"Found {len(categories)} categories")
        return categories
    except Exception as e:
        print(f"Error fetching CTF data: {e}")
        return {}


def update_ctf_json():
    # Use absolute path to avoid path issues
    script_dir = os.path.dirname(os.path.abspath(__file__))
    JSON_PATH = os.path.join(script_dir, "..", "frontend", "src", "data", "ctf.json")
    JSON_PATH = os.path.normpath(JSON_PATH)

    print(f"JSON file path: {JSON_PATH}")
    print(f"JSON file exists: {os.path.exists(JSON_PATH)}")

    # Get data from Google Sheets
    categories_data = get_ctf_from_csv()

    print(f"Categories data: {categories_data}")

    # Convert to the format expected by your frontend
    ctf_data = []
    for category, challenges in categories_data.items():
        ctf_data.append({"category": category, "challenges": challenges})

    # Save to JSON file
    try:
        with open(JSON_PATH, "w") as f:
            json.dump(ctf_data, f, indent=2)

        print(f"Successfully updated CTF data with {len(ctf_data)} categories")
        print(f"Total challenges: {sum(len(cat['challenges']) for cat in ctf_data)}")

        # Verify the file was written
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, "r") as f:
                written_data = json.load(f)
            print(f"Verification: File contains {len(written_data)} categories")
        else:
            print("ERROR: File was not created!")

    except Exception as e:
        print(f"Error writing JSON file: {e}")


if __name__ == "__main__":
    update_ctf_json()
