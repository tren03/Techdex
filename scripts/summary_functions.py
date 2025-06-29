#!/usr/bin/env python3
"""
Example usage of the reusable summary generation functions
"""

from generate_summaries import load_json_file, process_items_summaries, save_json_file


def process_yt_articles(input_file: str, output_file: str = ""):
    """
    Example: Process articles with summaries
    """
    # Load articles
    yt = load_json_file(input_file)
    if not yt:
        return False

    # Process summaries for articles
    success = process_items_summaries(
        items=yt,
        content_field="transcript",  # Field containing article text
        title_field="title",  # Field containing article title
        summary_field="summary",  # Field to store generated summary
        content_type="video transcript",  # Type for the prompt
    )

    if success:
        output_path = output_file or input_file
        return save_json_file(yt, output_path)

    return False


def process_articles_summaries(input_file: str, output_file: str = ""):
    """
    Example: Process articles with summaries
    """
    # Load articles
    articles = load_json_file(input_file)
    if not articles:
        return False

    # Process summaries for articles
    success = process_items_summaries(
        items=articles,
        content_field="url",  # Field containing article text
        title_field="title",  # Field containing article title
        summary_field="summary",  # Field to store generated summary
        content_type="website",  # Type for the prompt
    )

    if success:
        output_path = output_file or input_file
        return save_json_file(articles, output_path)

    return False


def process_papers_summaries(input_file: str, output_file: str = ""):
    """
    Example: Process research papers with summaries
    """
    # Load papers
    papers = load_json_file(input_file)
    if not papers:
        return False

    # Process summaries for papers
    success = process_items_summaries(
        items=papers,
        content_field="abstract",  # Field containing paper abstract
        title_field="title",  # Field containing paper title
        summary_field="summary",  # Field to store generated summary
        content_type="research paper",  # Type for the prompt
    )

    if success:
        output_path = output_file or input_file
        return save_json_file(papers, output_path)

    return False


def process_blog_posts_summaries(input_file: str, output_file: str = ""):
    """
    Example: Process blog posts with summaries
    """
    # Load blog posts
    posts = load_json_file(input_file)
    if not posts:
        return False

    # Process summaries for blog posts
    success = process_items_summaries(
        items=posts,
        content_field="body",  # Field containing blog post content
        title_field="title",  # Field containing post title
        summary_field="summary",  # Field to store generated summary
        content_type="blog post",  # Type for the prompt
    )

    if success:
        output_path = output_file or input_file
        return save_json_file(posts, output_path)

    return False


def process_custom_data_summaries(
    items: list,
    content_field: str,
    title_field: str,
    summary_field: str = "summary",
    content_type: str = "content",
    output_file: str = "",
):
    """
    Example: Process any custom data structure
    """
    # Process summaries for custom data
    success = process_items_summaries(
        items=items,
        content_field=content_field,
        title_field=title_field,
        summary_field=summary_field,
        content_type=content_type,
    )

    if success and output_file:
        return save_json_file(items, output_file)

    return success

    
