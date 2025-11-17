document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
  setupEventListeners();
});

function setupEventListeners() {
  document
    .getElementById("urlInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        shortenURL();
      }
    });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.getElementById("navLinks").addEventListener("click", function (e) {
    const rect = e.target.getBoundingClientRect();
    const isPseudoClick =
      e.clientX > rect.right - 50 && e.clientY < rect.top + 50;
    if (e.target === this && isPseudoClick) {
      toggleMenu();
    }
  });
}

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function checkAuthStatus() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    showLoggedOutState();
    return;
  }

  try {
    const response = await fetch("/user/auth/check", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      showLoggedInState(data.user.name);
    } else {
      localStorage.removeItem("authToken");
      showLoggedOutState();
    }
  } catch (error) {
    console.error("Auth check failed due to a network error:", error);
    showLoggedOutState();
  }
}

function showLoggedInState(userName) {
  document.getElementById("loginBtn").classList.add("hidden");
  document.getElementById("signupBtn").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  const userInfo = document.getElementById("userInfo");
  userInfo.classList.remove("hidden");
  userInfo.textContent = `Welcome, ${userName}`;

  document.getElementById("analyticsSection").classList.remove("hidden");
  document.getElementById("loginPrompt").classList.add("hidden");

  loadAllURLs();
}

function showLoggedOutState() {
  document.getElementById("loginBtn").classList.remove("hidden");
  document.getElementById("signupBtn").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
  document.getElementById("userInfo").classList.add("hidden");

  document.getElementById("analyticsSection").classList.add("hidden");
  document.getElementById("loginPrompt").classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.reload();
}

function toggleMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const body = document.body;

  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  body.classList.toggle("menu-open");

  if (navLinks.classList.contains("active")) {
    let overlay = document.querySelector(".nav-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "nav-overlay active";
      overlay.onclick = toggleMenu;
      document.body.appendChild(overlay);
    }
  } else {
    const overlay = document.querySelector(".nav-overlay");
    if (overlay) {
      overlay.remove();
    }
  }
}

function closeMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.querySelector(".nav-overlay");
  const body = document.body;

  if (hamburger) hamburger.classList.remove("active");
  if (navLinks) navLinks.classList.remove("active");
  body.classList.remove("menu-open");
  if (overlay) overlay.remove();
}

async function shortenURL() {
  const urlInput = document.getElementById("urlInput");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");
  const loadingDiv = document.getElementById("loading");
  const shortenBtn = document.getElementById("shortenBtn");
  const url = urlInput.value.trim();

  if (!url) {
    showError("Please enter a URL.");
    return;
  }
  if (!isValidURL(url)) {
    showError("Please enter a valid URL (e.g., https://example.com).");
    return;
  }

  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");
  shortenBtn.disabled = true;

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        showError("Please log in to shorten URLs.");
        setTimeout(() => (window.location.href = "/login.html"), 2000);
        return;
      }
      throw new Error(data.error || "Failed to shorten URL.");
    }

    const shortURL = `${window.location.origin}/${data.id}`;
    document.getElementById("shortURL").value = shortURL;
    document.getElementById("visitLink").href = shortURL;

    resultDiv.classList.remove("hidden");
    loadingDiv.classList.add("hidden");
    urlInput.value = "";
    loadAllURLs();
  } catch (error) {
    showError(error.message);
    loadingDiv.classList.add("hidden");
  } finally {
    shortenBtn.disabled = false;
  }
}

async function loadAllURLs() {
  const analyticsLoading = document.getElementById("analyticsLoading");
  const analyticsContainer = document.getElementById("analyticsContainer");
  const noData = document.getElementById("noData");

  analyticsLoading.classList.remove("hidden");
  analyticsContainer.classList.add("hidden");
  noData.classList.add("hidden");

  try {
    const response = await fetch("/api/urls", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to load your URLs.");
    }

    const urls = await response.json();
    analyticsLoading.classList.add("hidden");

    if (urls.length === 0) {
      noData.classList.remove("hidden");
      return;
    }

    analyticsContainer.innerHTML = "";
    analyticsContainer.classList.remove("hidden");
    urls.forEach((url) => {
      const urlCard = createURLCard(url);
      analyticsContainer.appendChild(urlCard);
    });
  } catch (error) {
    console.error("Error loading analytics:", error);
    analyticsLoading.classList.add("hidden");
    noData.classList.remove("hidden");
  }
}

function createURLCard(url) {
  const card = document.createElement("div");
  card.className = "url-card";

  const shortURL = `${window.location.origin}/${url.shortId}`;
  const createdDate = new Date(url.createdAt).toLocaleString();
  const historyItems = url.visitHistory
    .map(
      (visit, i) => `
    <div class="history-item">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="history-number">${i + 1}</span>
        <span>Visit ${i + 1}</span>
      </div>
      <span class="history-time">${new Date(
        visit.timestamp
      ).toLocaleString()}</span>
    </div>
  `
    )
    .join("");

  card.innerHTML = `
    <div class="url-card-header">
      <div class="url-info">
        <div class="original-url"><strong>Original:</strong> ${escapeHtml(
          url.redirectURL
        )}</div>
        <div class="short-url-display">
          <a href="${shortURL}" target="_blank" class="short-url-link">${shortURL}</a>
          <button onclick="copyToClipboard('${shortURL}', this)" class="copy-small-btn">📋</button>
        </div>
      </div>
      <div class="stats-badge">👁️ ${url.totalClicks} ${
    url.totalClicks === 1 ? "visit" : "visits"
  }</div>
    </div>
    <div class="url-meta">
      <span>🆔 ${url.shortId}</span>
      <span>📅 ${createdDate}</span>
    </div>
    <div class="visit-history">
      <button onclick="toggleHistory(this, '${
        url.shortId
      }')" class="history-toggle">
        ${url.totalClicks > 0 ? "📊 Show Visit History" : "📊 No Visits Yet"}
      </button>
      <div class="history-list hidden" id="history-${url.shortId}">
        ${
          url.visitHistory.length > 0
            ? historyItems
            : '<div class="empty-history">No visits recorded yet</div>'
        }
      </div>
    </div>
  `;
  return card;
}

function toggleHistory(button, shortId) {
  const historyList = document.getElementById(`history-${shortId}`);
  const isHidden = historyList.classList.contains("hidden");

  if (isHidden) {
    historyList.classList.remove("hidden");
    button.textContent = "📊 Hide Visit History";
  } else {
    historyList.classList.add("hidden");
    const hasVisits = historyList.children.length > 1;
    button.textContent = hasVisits
      ? "📊 Show Visit History"
      : "📊 No Visits Yet";
  }
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(
    () => {
      const originalText = button.textContent;
      button.textContent = "✓";
      button.style.background = "#4caf50";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
    },
    (err) => {
      console.error("Async: Could not copy text: ", err);
      alert("Failed to copy URL automatically.");
    }
  );
}

function copyURL() {
  const shortURLInput = document.getElementById("shortURL");
  const copyBtn = document.querySelector(".result .copy-btn");
  copyToClipboard(shortURLInput.value, copyBtn);
}

function showError(message) {
  const errorDiv = document.getElementById("error");
  errorDiv.textContent = `❌ ${message}`;
  errorDiv.classList.remove("hidden");
  setTimeout(() => errorDiv.classList.add("hidden"), 5000);
}

function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
