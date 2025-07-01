# GEMINI.md - Project Context for AI Assistant

This file provides essential context for the AI assistant to understand and interact with the `Techdex` project effectively.

## 1. Project Overview

`Techdex` is a web application designed to aggregate and display various tech-related content, including articles, blogs, YouTube videos, people profiles, and general resources. It features a frontend built with React and a backend (scripts) primarily in Python for data fetching and processing. The goal is to provide a centralized, searchable index of technical information.

## 2. Key Components

-   **`frontend/`**: Contains the React-based web application that serves as the user interface.
    -   `frontend/src/data/`: Stores JSON files (`articles.json`, `blogs.json`, `yt.json`, `ppl.json`, `resources.json`, `papers.json`) which act as a local data store for the application's content.
    -   `frontend/src/components/`: Reusable React components.
    -   `frontend/src/pages/`: React components representing different views/pages of the application.
-   **`scripts/`**: Houses Python scripts responsible for fetching, processing, and generating data for the frontend.
    -   `scripts/fetch_articles_sheets.py`: Likely fetches article data from Google Sheets.
    -   `scripts/fetch_youtube.py`: Fetches YouTube video data.
    -   `scripts/generate_summaries.py`: Generates summaries for content.
-   **`.github/workflows/`**: Defines GitHub Actions for continuous integration and automation, such as fetching new data.
-   **`docs/`**: Contains project documentation and design documents.

## 3. Folder Structure

```
/home/vishnu/Projects/Techdex/
├───.gitignore
├───.git/
├───.github/
│   ├───ISSUE_TEMPLATE/
│   └───workflows/
├───docs/
├───frontend/
│   ├───.gitignore
│   ├───components.json
│   ├───eslint.config.js
│   ├───index.html
│   ├───package-lock.json
│   ├───package.json
│   ├───README.md
│   ├───tsconfig.app.json
│   ├───tsconfig.json
│   ├───tsconfig.node.json
│   ├───vercel.json
│   ├───vite.config.ts
│   ├───node_modules/
│   ├───public/
│   │   ├───favicon.ico
│   │   ├───ipad-mirroring.png
│   │   └───blogs/
│   │       └───ipad-mirroring.md
│   └───src/
│       ├───App.css
│       ├───App.tsx
│       ├───index.css
│       ├───main.tsx
│       ├───models.ts
│       ├───vite-env.d.ts
│       ├───components/
│       │   ├───Blog.tsx
│       │   ├───Navbar.tsx
│       │   └───SearchAndTable.tsx
│       ├───data/
│       │   ├───articles.json
│       │   ├───blogs.json
│       │   ├───papers.json
│       │   ├───ppl.json
│       │   ├───resources.json
│       │   ├───yt_old.json
│       │   └───yt.json
│       ├───lib/
│       │   └───utils.ts
│       └───pages/
│           ├───Articles.tsx
│           ├───BlogPage.tsx
│           ├───MyBlogs.tsx
│           ├───Papers.tsx
│           ├───People.tsx
│           ├───Resources.tsx
│           └───Youtube.tsx
└───scripts/
    ├───.python-version
    ├───fetch_articles_name.py
    ├───fetch_articles_sheets.py
    ├───fetch_youtube.py
    ├───fetch_yt_transcript.py
    ├───generate_summaries.py
    ├───issue_body.md
    ├───requirements.txt
    ├───summary_functions.py
    ├───__pycache__/
    └───.venv/
```

## 4. Libraries/Frameworks Used

**Frontend (`frontend/`):**
-   **React**: JavaScript library for building user interfaces.
-   **Vite**: Fast build tool for modern web projects.
-   **TypeScript**: Superset of JavaScript that adds static types.
-   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
-   **React Router DOM**: Declarative routing for React.

**Scripts (`scripts/`):**
-   **Python**: Programming language for backend scripts.
-   **Google API Client Libraries**: For interacting with Google services (e.g., Google Sheets, YouTube Data API).
-   **`youtube-transcript-api`**: For fetching YouTube video transcripts.
-   **`python-dotenv`**: For managing environment variables.
-   **`requests`**: HTTP library for Python.

## 5. Conventions

-   **Frontend**:
    -   React functional components with TypeScript.
    -   Tailwind CSS for styling.
    -   Component-based architecture.
    -   Data stored in JSON files under `frontend/src/data/`.
-   **Scripts**:
    -   Python 3.12.0
    -   Use of `requirements.txt` for dependency management.
    -   Scripts are generally self-contained for specific data fetching/processing tasks.

## 6. Tasks & Expectations

I expect assistance with:
-   **Bug fixes**: Identifying and resolving issues in both frontend and backend scripts.
-   **Code suggestions**: Improvements to existing code, refactoring, and performance optimizations.
-   **Feature implementation**: Adding new functionalities to the application.
-   **Architectural help**: Guidance on structuring the project, data flow, and best practices.
-   **Data management**: Assistance with updating and managing the JSON data files.

## 7. Known Issues

-   None currently known.

## 8. Ignore List

When reading or editing code, please generally ignore the following directories/files unless specifically instructed:
-   `node_modules/` (in `frontend/`)
-   `__pycache__/` (in `scripts/`)
-   `.venv/` (in `scripts/`)
-   `package-lock.json` (in `frontend/`)
-   `.git/`
-   `.python-version`
-   `*.pyc`
-   `*.log`
