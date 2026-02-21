# HubFly Templates

This repository contains a collection of starter templates for **HubFly** applications. Each template is a minimal, containerized application designed to be easily deployed using Docker.

## Project Structure

```
hubfly-templates/
├── nodejs/           # Node.js (Express) starter template
│   ├── Dockerfile
│   └── index.js
├── nextjs/           # Next.js starter template
│   ├── Dockerfile
│   ├── package.json
│   └── app/
├── python/           # Python (Flask) starter template
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
└── deploy.sh         # Automated deployment script
```

## Available Templates

### 1. Node.js
A simple Express.js server running on port `3000`.
- **Base Image:** `node:20-alpine`
- **Port:** 3000

### 2. Python
A simple Flask server running on port `8000`.
- **Base Image:** `python:3.9-slim`
- **Port:** 8000

### 3. Next.js
A Next.js App Router template with API routes, server actions, tests, and image optimization.
- **Base Image:** `node:20-alpine`
- **Port:** 3000

### 4. Static HTML
A minimal static website template.
- **Base Image:** `nginx:alpine`
- **Port:** 80

## Docker Image Names

The deployment script publishes these tags:

- `bonheur15/hubfly-template-nodejs:latest`
- `bonheur15/hubfly-template-python:latest`
- `bonheur15/hubfly-template-nextjs:latest`
- `bonheur15/hubfly-template-static-html:latest`

## Usage

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed.
- Logged into Docker Hub (`docker login`).

### Automatic Deployment
Use the included `deploy.sh` script to automatically build, tag, and push all templates to Docker Hub.

1. **Make the script executable** (if not already):
   ```bash
   chmod +x deploy.sh
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

   This script will:
   - Detect all folders containing a `Dockerfile`.
   - Show exact tag mapping before build/push.
   - Build the image as `hubfly-template-<directory_name>`.
   - Push `bonheur15/hubfly-template-<directory_name>:latest`.

## Adding a New Template

To add a new language or framework:

1. Create a new directory (e.g., `go-lang`).
2. Add your application code.
3. Create a `Dockerfile` inside that directory.
4. Run `./deploy.sh`. The script will automatically pick it up and deploy it.
