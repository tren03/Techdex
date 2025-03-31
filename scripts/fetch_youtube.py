# fetch_youtube.py
import hashlib
import os
import json
from datetime import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

def main():
    api_key = os.environ.get("YT_API")
    playlist_id = "PLkoraQhs622SHMColalnQDomOlcMz9bzX"

    url = f"https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&key={api_key}"

    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        videos = response.json()
        video_info = []

        for item in videos["items"]:
            title = item["snippet"]["title"]
            video_id = item["snippet"]["resourceId"]["videoId"]
            yt_url = f"https://www.youtube.com/watch?v={video_id}"
            added_at_iso = item["snippet"]["publishedAt"]
            added_at_epoch = int(datetime.strptime(added_at_iso, "%Y-%m-%dT%H:%M:%SZ").timestamp())
            obj_id = hashlib.sha1(title.encode("utf-8")).hexdigest()

            video_info.append({
                "id": obj_id[0:6],
                "title": title,
                "url": yt_url,
                "addedAt": added_at_epoch
            })

        output_path = "../frontend/src/data/yt.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(video_info, f, indent=2)
        print(video_info)
    else:
        print(f"Error: Status code {response.status_code}")


if __name__ == "__main__":
    main()

