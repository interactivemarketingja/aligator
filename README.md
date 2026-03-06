# Appwrite Auth Demo

A lightweight login/sign-up page that uses [Appwrite](https://appwrite.io/) email/password authentication.

## Features

- Configure Appwrite endpoint + project ID in UI
- Login with email/password
- Sign up and auto-login
- Check current authenticated user session
- Logout current session

## Run locally

Because this page imports the Appwrite SDK as an ES module from a CDN, serve it with a local HTTP server:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Appwrite setup checklist

1. Create an Appwrite project.
2. Enable **Email/Password** authentication.
3. Add your local URL (e.g., `http://localhost:4173`) as an allowed platform / origin in Appwrite.
4. Use your endpoint and project ID in the page config form.
