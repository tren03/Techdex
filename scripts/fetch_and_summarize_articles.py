import os
import sys
import time

import requests
from bs4 import BeautifulSoup

sys.path.append(os.path.dirname(__file__))
from generate_summaries import (
    generate_summary_with_gemini,
    load_json_file,
    save_json_file,
    setup_gemini_api,
)


def extract_readable_text_from_url(url: str) -> str:
    """
    Fetch the HTML content from the URL and extract readable text using BeautifulSoup.
    """
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        # Remove script and style elements
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        # Try to get main content if possible
        main = soup.find("main")
        if main:
            text = main.get_text(separator=" ", strip=True)
        else:
            text = soup.get_text(separator=" ", strip=True)
        return text
    except Exception as e:
        print(f"  Error fetching/extracting from {url}: {e}")
        return ""


def ensure_article_summaries(
    input_file: str = "../frontend/src/data/articles.json", output_file: str = ""
):
    articles = load_json_file(input_file)
    if not articles:
        print("No articles loaded.")
        return False

    api_key = os.getenv("GEMINI_API_KEY") or ""
    client = setup_gemini_api(api_key)
    if not client:
        print("Gemini API client setup failed.")
        return False

    updated = False
    for idx, article in enumerate(articles):
        summary = article.get("summary", "").strip()
        url = article.get("url", "").strip()
        title = article.get("title", "Untitled")
        if not summary:
            print(f"\n[{idx + 1}/{len(articles)}] Processing: {title}")
            if not url:
                print("  No URL found, skipping.")
                article["summary"] = ""
                continue
            text = extract_readable_text_from_url(url)
            if not text:
                print("  No readable text extracted, skipping.")
                article["summary"] = ""
                continue
            print(f"  Extracted {len(text)} characters from {url}")
            summary = generate_summary_with_gemini(
                client, text, title, content_type="website"
            )
            if summary:
                article["summary"] = summary
                print(f"  ✓ Summary generated ({len(summary)} chars)")
                updated = True
            else:
                article["summary"] = ""
                print("  ✗ Failed to generate summary")
            time.sleep(1)
    out_path = output_file or input_file
    if updated:
        save_json_file(articles, out_path)
    else:
        print("No new summaries generated.")
    return True


if __name__ == "__main__":
    ensure_article_summaries()
