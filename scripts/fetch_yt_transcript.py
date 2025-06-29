import json
import os
import re

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
    output_file_path = "../frontend/src/data/yt.json"

    # Load transcripts
    load_transcripts_from_json(json_file_path, output_file_path)

if __name__ == "__main__":
    main()
