import { Account, Client, ID } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm";

const storageKey = "appwriteAuthConfig";
const feedUrl = "feed.html";

const configForm = document.getElementById("config-form");
const endpointInput = document.getElementById("endpoint");
const projectIdInput = document.getElementById("project-id");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const statusEl = document.getElementById("status");
const sessionState = document.getElementById("session-state");
const refreshSessionBtn = document.getElementById("refresh-session");
const logoutBtn = document.getElementById("logout");

let account;

function showStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function setActiveTab(tab) {
  const isLogin = tab === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
}

function redirectToFeed() {
  window.location.assign(feedUrl);
}

async function refreshSession({ redirectOnSuccess = false } = {}) {
  if (!account) {
    sessionState.textContent = "Not initialized.";
    return null;
  }

  try {
    const user = await account.get();
    sessionState.textContent = JSON.stringify(user, null, 2);
    showStatus(`Logged in as ${user.email}.`, "success");

    if (redirectOnSuccess) {
      redirectToFeed();
      return null;
    }

    return user;
  } catch (error) {
    sessionState.textContent = "No active session.";
    showStatus(error?.message ?? "Unable to fetch session.", "error");
    return null;
  }
}

function loadConfig() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    endpointInput.value = parsed.endpoint ?? "";
    projectIdInput.value = parsed.projectId ?? "";

    if (parsed.endpoint && parsed.projectId) {
      initializeClient(parsed.endpoint, parsed.projectId);
      showStatus("Loaded saved Appwrite configuration.", "success");
      refreshSession({ redirectOnSuccess: true });
    }
  } catch {
    showStatus("Could not parse saved config. Re-enter Appwrite values.", "error");
  }
}

function initializeClient(endpoint, projectId) {
  const client = new Client();
  client.setEndpoint(endpoint).setProject(projectId);
  account = new Account(client);
}

configForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const endpoint = endpointInput.value.trim();
  const projectId = projectIdInput.value.trim();

  if (!endpoint || !projectId) {
    showStatus("Endpoint and project ID are required.", "error");
    return;
  }

  initializeClient(endpoint, projectId);
  localStorage.setItem(storageKey, JSON.stringify({ endpoint, projectId }));
  showStatus("Appwrite initialized.", "success");
  refreshSession();
});

tabLogin.addEventListener("click", () => setActiveTab("login"));
tabSignup.addEventListener("click", () => setActiveTab("signup"));

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!account) {
    showStatus("Initialize Appwrite first.", "error");
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await account.createEmailPasswordSession(email, password);
    showStatus("Login successful. Redirecting to your feed...", "success");
    redirectToFeed();
  } catch (error) {
    showStatus(error?.message ?? "Login failed.", "error");
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!account) {
    showStatus("Initialize Appwrite first.", "error");
    return;
  }

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try {
    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    showStatus("Account created. Redirecting to your feed...", "success");
    redirectToFeed();
  } catch (error) {
    showStatus(error?.message ?? "Sign up failed.", "error");
  }
});

logoutBtn.addEventListener("click", async () => {
  if (!account) {
    showStatus("Initialize Appwrite first.", "error");
    return;
  }

  try {
    await account.deleteSession("current");
    sessionState.textContent = "No active session.";
    showStatus("Logged out.", "success");
  } catch (error) {
    showStatus(error?.message ?? "Logout failed.", "error");
  }
});

refreshSessionBtn.addEventListener("click", () => refreshSession());

setActiveTab("login");
loadConfig();
