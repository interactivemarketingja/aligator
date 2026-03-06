import { Account, Client } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

const storageKey = "appwriteAuthConfig";
const loginUrl = "index.html";

const sessionState = document.getElementById("session-state");
const statusEl = document.getElementById("status");
const logoutBtn = document.getElementById("logout");

function showStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function redirectToLogin() {
  window.location.assign(loginUrl);
}

function getAccountFromStorage() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.endpoint || !parsed.projectId) {
      return null;
    }

    const client = new Client();
    client.setEndpoint(parsed.endpoint).setProject(parsed.projectId);
    return new Account(client);
  } catch {
    return null;
  }
}

async function loadUser() {
  const account = getAccountFromStorage();
  if (!account) {
    showStatus("Missing Appwrite configuration. Redirecting to login.", "error");
    redirectToLogin();
    return null;
  }

  try {
    const user = await account.get();
    sessionState.textContent = JSON.stringify(user, null, 2);
    showStatus(`Welcome, ${user.name || user.email}!`, "success");
    return account;
  } catch {
    showStatus("Session expired. Redirecting to login.", "error");
    redirectToLogin();
    return null;
  }
}

let accountRef;

logoutBtn.addEventListener("click", async () => {
  if (!accountRef) {
    redirectToLogin();
    return;
  }

  try {
    await accountRef.deleteSession("current");
    showStatus("Logged out. Redirecting...", "success");
  } catch {
    showStatus("Could not logout cleanly. Redirecting...", "error");
  }

  redirectToLogin();
});

accountRef = await loadUser();
