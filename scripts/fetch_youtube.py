import hashlib
import json
import os
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()


def fetch_all_videos(api_key, playlist_id):
    all_videos = []
    page_token = None

    while True:
        url = (
            f"https://youtube.googleapis.com/youtube/v3/playlistItems"
            f"?part=snippet&playlistId={playlist_id}&maxResults=50&key={api_key}"
        )
        if page_token:
            url += f"&pageToken={page_token}"

        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            raise Exception(f"Error: {response.status_code} {response.text}")

        data = response.json()
        items = data.get("items", [])

        for item in items:
            snippet = item["snippet"]
            title = snippet["title"]
            video_id = snippet["resourceId"]["videoId"]
            yt_url = f"https://www.youtube.com/watch?v={video_id}"
            added_at_iso = snippet["publishedAt"]
            added_at_formatted = datetime.strptime(
                added_at_iso, "%Y-%m-%dT%H:%M:%SZ"
            ).strftime("%m/%d/%Y")

            obj_id = hashlib.sha1(title.encode("utf-8")).hexdigest()
            all_videos.append(
                {
                    "id": obj_id[:6],
                    "title": title,
                    "url": yt_url,
                    "addedAt": added_at_formatted,
                }
            )

        page_token = data.get("nextPageToken")
        if not page_token:
            break

    return all_videos


def main():
    api_key = os.environ.get("YT_API")
    playlist_id = "PLkoraQhs622SHMColalnQDomOlcMz9bzX"

    output_path = "../frontend/src/data/yt.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Load existing videos if file exists
    existing_videos = []
    if os.path.exists(output_path):
        try:
            with open(output_path, "r") as f:
                existing_videos = json.load(f)
            print(f"Loaded {len(existing_videos)} existing videos.")
        except (json.JSONDecodeError, FileNotFoundError):
            print("No existing videos file found or invalid JSON, starting fresh.")
            existing_videos = []

    # Create a set of existing video URLs for quick lookup
    existing_urls = {video["url"] for video in existing_videos}

    # Fetch all videos from YouTube
    all_videos = fetch_all_videos(api_key, playlist_id)

    # Filter out videos that already exist
    new_videos = []
    for video in all_videos:
        if video["url"] not in existing_urls:
            new_videos.append(video)

    # Append new videos to existing list
    if new_videos:
        existing_videos.extend(new_videos)
        print(f"Added {len(new_videos)} new videos.")
    else:
        print("No new videos found.")

    # Save the combined list back to file
    with open(output_path, "w") as f:
        json.dump(existing_videos, f, indent=2)

    print(f"Total videos in file: {len(existing_videos)}")


if __name__ == "__main__":
    main()
