import requests
import os
from dotenv import load_dotenv
from fetch_articles_sheets import get_links_from_csv
import json

load_dotenv()

api_counter = 0


def get_title(url):
    PEEKLINK_KEY = os.getenv("PEEKLINK_KEY")
    response = requests.post(
        "https://api.peekalink.io/",
        json={"link": url},
        headers={"Authorization": f"Bearer {PEEKLINK_KEY}"},
    )
    title = response.json().get("title", "No title found")
    print("title from api", title)
    return title


JSON_PATH = "../frontend/src/data/articles.json"
with open(JSON_PATH) as f:
    articles = json.load(f)
    print("OLD ARTICLES", articles)

new_articles = []
for article in articles:
    if article.get("title") == "":
        print("article ", article)
        title = get_title(article.get("url"))
        api_counter += 1
        new_articles.append(
            {
                "id": article.get("id"),
                "title": title,
                "url": article.get("url"),
                "addedAt": article.get("addedAt"),
            }
        )
    else:
        new_articles.append(article)

print("NUMBER OF API HITS ", api_counter)
print("NEW ARTICLES ", new_articles)

os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
with open(JSON_PATH, "w") as f:
    json.dump(new_articles, f, indent=2)
