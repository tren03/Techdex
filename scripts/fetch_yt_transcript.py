import json
import os
import re

from generate_summaries import generate_summary_with_gemini, setup_gemini_api
from youtube_transcript_api import YouTubeTranscriptApi


def get_video_transcript(video_id):
    """
    Get transcript for a YouTube video with error handling
    """
    try:
        # Get transcript
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id)
        formatted_transcript = ""
        for snippet in transcript:
            formatted_transcript += snippet.text
        print(f"Formatted transcript for video {video_id} succesfully fetched")
        return formatted_transcript

    except Exception as e:
        print(f"Error getting transcript for video {video_id}: {e}")
        return None


def extract_video_id_from_url(url):
    """
    Extract video ID from YouTube URL
    Supports various YouTube URL formats
    """
    # Handle different YouTube URL formats
    patterns = [
        r"(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)",
        r"youtube\.com\/watch\?.*v=([^&\n?#]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


def get_transcript_for_url(url):
    """
    Gets transcript from url
    """
    return get_video_transcript(extract_video_id_from_url(url))


def load_transcripts_from_json(json_file_path, output_file_path=None):
    """
    Load transcripts for all videos in the JSON file and add them as transcript fields
    """
    # Read the JSON file
    try:
        with open(json_file_path, "r", encoding="utf-8") as f:
            videos = json.load(f)
    except FileNotFoundError:
        print(f"Error: File {json_file_path} not found")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {json_file_path}: {e}")
        return

    print(f"Found {len(videos)} videos in {json_file_path}")

    # Process each video
    for i, video in enumerate(videos, 1):
        print(
            f"\nProcessing video {i}/{len(videos)}: {video.get('title', 'Unknown title')}"
        )

        # Skip if already has a summary
        if "transcript" in video:
            print("  Skipping - already has transcript")
            continue

        # Extract video ID from URL
        url = video.get("url", "")
        video_id = extract_video_id_from_url(url)

        if not video_id:
            print(f"  Error: Could not extract video ID from URL: {url}")
            video["transcript"] = None
            continue

        print(f"Video ID: {video_id}")

        # Fetch transcript
        transcript = get_video_transcript(video_id)

        if transcript:
            video["transcript"] = transcript
            print(f"✓ Transcript added ({len(transcript)} characters)")
        else:
            video["transcript"] = None
            print("✗ Failed to get transcript")

    # Save the updated JSON
    output_path = output_file_path or json_file_path
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(videos, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Updated JSON saved to: {output_path}")
    except Exception as e:
        print(f"Error saving file: {e}")


def main():
    # Default paths
    json_file_path = "../frontend/src/data/yt.json"

    # Check if file exists
    if not os.path.exists(json_file_path):
        print(f"Error: {json_file_path} not found")
        print(
            "Please make sure the yt_with_transcripts.json file exists in the frontend/src/data/ directory"
        )
        return

    # for each video, we will fetch transcript -> send it to gemini,
    # get the summary as save as json in one flow

    # get vids that need summary
    yt_vids_to_get_summary = []
    with open(json_file_path, "r", encoding="utf-8") as f:
        yt_vids = json.load(f)
        for vids in yt_vids:
            if vids.get("summary") == None:
                vids["summary"] = ""
            if vids.get("summary") == "":
                yt_vids_to_get_summary.append(vids)

    print(f"attempting to fetch summaries for {len(yt_vids_to_get_summary)}")

    # now we can process all the videos without summary, or summary field missing
    total_vids = len(yt_vids_to_get_summary)
    i = 1
    for vid in yt_vids_to_get_summary:
        print(vid)
        try:
            url = vid.get("url")
            title = vid.get("title")
            if not url or not title:
                raise KeyError()
        except KeyError as e:
            print("url/title not present in vid object")
            raise e from e

        transcript = get_transcript_for_url(url)
        if not transcript:
            print(f"could not fetch transcript for video {title}")
        print(f"fetching summary for {title} {i}/{total_vids}")
        summary = ""
        if transcript:
            gemini_client = setup_gemini_api()
            summary = generate_summary_with_gemini(
                client=gemini_client,
                content=transcript,
                title=title,
                content_type="Youtube transcript",
            )
            print(summary)
        vid["summary"] = summary
        i += 1

    # update only the objects that need summary update and write to file
    with open(json_file_path, "r+", encoding="utf-8") as f:
        yt_vids = json.load(f)
        for vids in yt_vids:
            for new_vids in yt_vids_to_get_summary:
                if vids["url"] == new_vids["url"]:
                    if vids.get("summary") is None:
                        vids["summary"] = ""
                    vids["summary"] = new_vids["summary"]

    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(yt_vids, f, indent=2)


if __name__ == "__main__":
    main()
