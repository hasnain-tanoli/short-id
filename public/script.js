document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
});

function checkAuthStatus() {
  const user = localStorage.getItem("user");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");
  const analyticsSection = document.getElementById("analyticsSection");
  const loginPrompt = document.getElementById("loginPrompt");

  if (user) {
    const userData = JSON.parse(user);
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    userInfo.classList.remove("hidden");
    userInfo.textContent = `Welcome, ${userData.name}`;

    analyticsSection.classList.remove("hidden");
    loginPrompt.classList.add("hidden");

    loadAllURLs();
  } else {
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    userInfo.classList.add("hidden");

    analyticsSection.classList.add("hidden");
    loginPrompt.classList.remove("hidden");
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}

async function shortenURL() {
  const urlInput = document.getElementById("urlInput");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");
  const loadingDiv = document.getElementById("loading");
  const shortenBtn = document.getElementById("shortenBtn");

  const url = urlInput.value.trim();

  if (!url) {
    showError("Please enter a URL");
    return;
  }

  if (!isValidURL(url)) {
    showError("Please enter a valid URL (e.g., https://example.com)");
    return;
  }

  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");
  shortenBtn.disabled = true;

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to shorten URL");
    }

    const shortURL = `${window.location.origin}/${data.id}`;
    document.getElementById("shortURL").value = shortURL;
    document.getElementById("visitLink").href = shortURL;

    resultDiv.classList.remove("hidden");
    loadingDiv.classList.add("hidden");

    urlInput.value = "";

    const user = localStorage.getItem("user");
    if (user) {
      loadAllURLs();
    }
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

  const user = localStorage.getItem("user");
  if (!user) {
    return;
  }

  analyticsLoading.classList.remove("hidden");
  analyticsContainer.classList.add("hidden");
  noData.classList.add("hidden");

  try {
    const response = await fetch("/api/urls");
    const urls = await response.json();

    analyticsLoading.classList.add("hidden");

    if (urls.length === 0) {
      noData.classList.remove("hidden");
      return;
    }

    analyticsContainer.innerHTML = "";
    analyticsContainer.classList.remove("hidden");

    urls.forEach((url, index) => {
      const urlCard = createURLCard(url, index);
      analyticsContainer.appendChild(urlCard);
    });
  } catch (error) {
    console.error("Error loading analytics:", error);
    analyticsLoading.classList.add("hidden");
    noData.classList.remove("hidden");
  }
}

function createURLCard(url, index) {
  const card = document.createElement("div");
  card.className = "url-card";

  const shortURL = `${window.location.origin}/${url.shortId}`;
  const createdDate = new Date(url.createdAt).toLocaleString();

  card.innerHTML = `
        <div class="url-card-header">
            <div class="url-info">
                <div class="original-url">
                    <strong>Original:</strong> ${url.redirectURL}
                </div>
                <div class="short-url-display">
                    <a href="${shortURL}" target="_blank" class="short-url-link">
                        ${shortURL}
                    </a>
                    <button onclick="copyToClipboard('${shortURL}', this)" class="copy-small-btn">
                        📋
                    </button>
                </div>
            </div>
            <div class="stats-badge">
                👁️ ${url.totalClicks} ${
    url.totalClicks === 1 ? "visit" : "visits"
  }
            </div>
        </div>
        
        <div class="url-meta">
            <span>🆔 ${url.shortId}</span>
            <span>📅 ${createdDate}</span>
        </div>
        
        <div class="visit-history">
            <button onclick="toggleHistory(this, '${
              url.shortId
            }')" class="history-toggle">
                ${
                  url.totalClicks > 0
                    ? "📊 Show Visit History"
                    : "📊 No Visits Yet"
                }
            </button>
            <div class="history-list hidden" id="history-${url.shortId}">
                ${
                  url.visitHistory.length > 0
                    ? url.visitHistory
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
                        .join("")
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
    button.textContent = "📊 Show Visit History";
  }
}

function copyToClipboard(text, button) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalText = button.textContent;
      button.textContent = "✓";
      button.style.background = "#4caf50";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
    })
    .catch((err) => {
      alert("Failed to copy: " + err);
    });
}

function showError(message) {
  const errorDiv = document.getElementById("error");
  errorDiv.textContent = "❌ " + message;
  errorDiv.classList.remove("hidden");
}

function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function copyURL() {
  const shortURLInput = document.getElementById("shortURL");
  shortURLInput.select();
  shortURLInput.setSelectionRange(0, 99999);

  navigator.clipboard
    .writeText(shortURLInput.value)
    .then(() => {
      const copyBtn = document.querySelector(".copy-btn");
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      copyBtn.style.background = "#4caf50";

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = "";
      }, 2000);
    })
    .catch((err) => {
      alert("Failed to copy: " + err);
    });
}

document
  .getElementById("urlInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      shortenURL();
    }
  });
