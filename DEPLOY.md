# Deployment Guide

This blog is configured to deploy automatically to GitHub Pages using GitHub Actions.

## Prerequisites

1.  A GitHub repository.
2.  The repository must be public (for free GitHub Pages) or you must have a Pro account.

## Setup Steps

1.  **Push to GitHub**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/itsjoeyrighthere/itsjoeyrighthere.github.io.git
    git push -u origin main
    ```

2.  **Configure GitHub Pages**:
    - Go to your repository on GitHub.
    - Navigate to **Settings** > **Pages**.
    - Under **Build and deployment**, select **GitHub Actions** as the source.
    - (Optional) If you don't see "GitHub Actions", ensure your repository is public.

3.  **Verify Deployment**:
    - Go to the **Actions** tab in your repository.
    - You should see the "Deploy to GitHub Pages" workflow running.
    - Once completed, your site will be live at `https://<username>.github.io/<repo-name>/`.

## Local Development

To run the project locally:

```bash
npm run dev
```

To build locally (to test the export):

```bash
npm run build
# The static output will be in the `out` directory
```
