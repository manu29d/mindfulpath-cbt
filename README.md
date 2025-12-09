# MindfulPath CBT Journal

MindfulPath is a mood journaling and cognitive behavioral therapy (CBT) application designed to help users identify cognitive distortions and track their emotional well-being. It is powered by the Gemini API to provide intelligent insights and balanced perspectives on negative thoughts.

## Features

- **Mood Tracking**: Log your daily mood and intensity.
- **Thought Records**: Structured CBT exercises to challenge automatic negative thoughts.
- **AI Analysis**: Uses Google's Gemini API to identify cognitive distortions and suggest balanced thoughts.
- **Insights Dashboard**: Visualize mood trends over time.
- **Privacy First**: All data is stored locally in your browser.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add your API key:
    ```
    VITE_API_KEY=your_gemini_api_key_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment to GitHub Pages

You can deploy this application automatically using GitHub Actions (recommended) or manually from your local machine.

### Prerequisites

**Update `package.json`**:
Change the `homepage` field to match your GitHub repository URL:
```json
"homepage": "https://<your-username>.github.io/<repo-name>"
```

### Option 1: Automated Deployment (Recommended)

This project includes a GitHub Actions workflow that automatically deploys your app whenever you push to the `main` branch.

1.  **Configure the API Key Secret**:
    - Go to your GitHub Repository.
    - Navigate to **Settings** > **Secrets and variables** > **Actions**.
    - Click **New repository secret**.
    - **Name**: `VITE_API_KEY`
    - **Value**: Paste your Gemini API key.

2.  **Trigger Deployment**:
    - Push your changes to the `main` branch.
    - The `Deploy to GitHub Pages` action will start automatically.

3.  **Verify GitHub Pages Settings**:
    - After the action completes, go to **Settings** > **Pages**.
    - Ensure the **Source** is set to `Deploy from a branch` and the branch is `gh-pages` / `/ (root)`.

### Option 2: Manual Deployment

You can also deploy directly from your local terminal.

1.  Ensure you have your `.env` file configured.
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    This builds the application and pushes the `dist` folder to the `gh-pages` branch.

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Google Gemini API (`@google/genai`)
- Vite
