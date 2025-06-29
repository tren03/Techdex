import json
import os
import time
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from google import genai

# Load environment variables from .env file
load_dotenv()


def setup_gemini_api(api_key: str):
    """
    Setup Gemini API with the provided API key
    """
    try:
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"Error setting up Gemini API: {e}")
        return None


def generate_summary_with_gemini(
    client, content: str, title: str, content_type: str = "content"
) -> Optional[str]:
    """
    Generate a summary using Gemini API

    Args:
        client: Gemini API client
        content: The content to summarize (transcript, text, etc.)
        title: Title of the content
        content_type: Type of content (e.g., "transcript", "article", "text")
    """
    try:
        # Create a prompt for summarization
        prompt = f"""
        Please provide a concise summary of the following {content_type}. 
        Focus on the key points, main ideas, and important insights.
        
        Title: {title}
        
        {content_type.capitalize()}:
        {content}  # Limit content length to avoid token limits
        
        Please provide a summary in 2-3 paragraphs (around 200-300 words) that captures the main content and value.
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )

        if response and response.text:
            return response.text.strip()
        else:
            print("  Warning: Empty response from Gemini API")
            return None

    except Exception as e:
        print(f"  Error generating summary with Gemini: {e}")
        return None


def process_items_summaries(
    items: List[Dict[str, Any]],
    content_field: str = "transcript",
    title_field: str = "title",
    summary_field: str = "summary",
    content_type: str = "transcript",
    api_key: Optional[str] = None,
) -> bool:
    """
    Process a list of items and generate summaries for those that need them

    Args:
        items: List of dictionaries containing items to process
        content_field: Field name containing the content to summarize
        title_field: Field name containing the title
        summary_field: Field name to store the generated summary
        content_type: Type of content for the prompt (e.g., "transcript", "article")
        api_key: Gemini API key (will use environment variable if not provided)

    Returns:
        bool: True if successful, False otherwise
    """
    # Get API key from environment if not provided
    if not api_key:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print(
                "Error: No Gemini API key provided. Set GEMINI_API_KEY environment variable or pass it as argument."
            )
            return False

    # Setup Gemini API
    client = setup_gemini_api(api_key)
    if not client:
        return False

    print(f"Found {len(items)} items to process")

    # Count items that need summaries - only summarize items that have content to summarize
    items_to_process = []
    for item in items:
        has_content = item.get(content_field) and str(item[content_field]).strip()
        has_summary = item.get(summary_field) and str(item[summary_field]).strip()

        if has_content and not has_summary:
            items_to_process.append(item)
        elif not has_content:
            # Set empty summary for items without content
            item[summary_field] = ""

    print(f"Processing {len(items_to_process)} items that need summaries...")

    # Process each item
    success_count = 0
    for i, item in enumerate(items_to_process, 1):
        title = item.get(title_field, "Unknown title")
        content = str(item.get(content_field, ""))

        print(f"\nProcessing item {i}/{len(items_to_process)}: {title}")

        if not content.strip():
            print("  Skipping - no content available")
            item[summary_field] = ""
            continue

        print(f"  Content length: {len(content)} characters")

        # Generate summary
        summary = generate_summary_with_gemini(client, content, title, content_type)

        if summary:
            item[summary_field] = summary
            success_count += 1
            print(f"✓ Summary generated ({len(summary)} characters)")
        else:
            item[summary_field] = ""
            print("✗ Failed to generate summary")

        # Add a small delay to avoid rate limiting
        time.sleep(1)

    print(
        f"\n✓ Successfully generated {success_count}/{len(items_to_process)} summaries"
    )
    return True


def load_json_file(file_path: str) -> Optional[List[Dict[str, Any]]]:
    """
    Load items from a JSON file

    Args:
        file_path: Path to the JSON file

    Returns:
        List of items or None if error
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {file_path}: {e}")
        return None


def save_json_file(items: List[Dict[str, Any]], file_path: str) -> bool:
    """
    Save items to a JSON file

    Args:
        items: List of items to save
        file_path: Path to save the JSON file

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        print(f"✓ Updated JSON saved to: {file_path}")
        return True
    except Exception as e:
        print(f"Error saving file: {e}")
        return False

