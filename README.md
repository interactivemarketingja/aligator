# Appwrite Auth Demo

A lightweight login/sign-up page that uses [Appwrite](https://appwrite.io/) email/password authentication and then redirects users to a main social feed area.

## Features

- Configure Appwrite endpoint + project ID in UI
- Login with email/password and redirect to feed
- Sign up, auto-login, and redirect to feed
- Main feed page verifies active session before showing content
- Logout from auth page or feed page

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
4. Use your endpoint and project ID in the login page config form.

## Flow

- `index.html`: Auth/config page
- `feed.html`: Main social feed area shown after successful sign-up or login
