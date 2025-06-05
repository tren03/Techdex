import requests
import csv
import io
import json
import random
from datetime import datetime


def get_links_from_csv():
    SHEET_ID = "1aVrLxB2e1EUb-1AR8nTHOfifFx1IMC-Z_YcWMpF2YKU"
    GID = "0"  # default tab

    CSV_URL = (
        f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}"
    )

    try:
        response = requests.get(CSV_URL)
        response.raise_for_status()

        links = []
        content = io.StringIO(response.text)
        reader = csv.reader(content)

        for row in reader:
            for cell in row:
                links.append(cell.strip())

        print("GSHEET LINKS ", links)
        return links
    except Exception as e:
        print(e)


to_append_articles = []


def merge_new_links_to_json():
    """if link exists in json -> skip, else add item to json and keep title empty"""
    JSON_PATH = "../frontend/src/data/articles.json"
    with open(JSON_PATH) as f:
        articles = json.load(f)
        print("OLD ARTICLES", articles)

    incoming_links = get_links_from_csv()
    existing_links = [article["url"] for article in articles]

    for link in incoming_links:
        if link not in existing_links:
            to_append_articles.append(
                {
                    "id": random.randint(100000, 999999),
                    "title": "",
                    "url": link,
                    "addedAt": datetime.now().strftime("%m/%d/%Y"),
                }
            )
    print("TO APPEND ", to_append_articles)

    merged = articles + to_append_articles
    with open(JSON_PATH, "w") as f:
        json.dump(merged, f, indent=2)
    print(f"Saved updated articles to {JSON_PATH}")


if __name__ == "__main__":
    links = merge_new_links_to_json()
