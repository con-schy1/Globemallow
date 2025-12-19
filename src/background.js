// background.js (fixed + exact unused JS via chrome.debugger)

const MAXSITES = 12;
const DEBUGGER_PROTOCOL_VERSION = "1.3";

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.session.clear();
  chrome.storage.local.clear();

  const externalUrl = "https://ko-fi.com/globemallow#paypalModal";
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl });
  }
});

// Optional helper (kept)
async function postData(url = "", data, contentType = "json") {
  let body = data;
  let cType = "application/x-www-form-urlencoded";

  if (contentType === "json") {
    body = JSON.stringify(data).replace(/[\r\n]+/gm, "");
    cType = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": cType,
      "Access-Control-Allow-Origin": "*",
    },
    referrerPolicy: "no-referrer",
    body,
  });

  return response.json();
}

function sendCommand(target, method, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand(target, method, params, (result) => {
      const err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else resolve(result);
    });
  });
}

function attachDebugger(target) {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach(target, DEBUGGER_PROTOCOL_VERSION, () => {
      const err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else resolve();
    });
  });
}

function detachDebugger(target) {
  return new Promise((resolve) => {
    chrome.debugger.detach(target, () => resolve());
  });
}

// Computes exact unused JS bytes for the current tab session using precise coverage.
async function computeExactUnusedJsBytes(tabId) {
  const target = { tabId };

  await attachDebugger(target);

  try {
    // Enable profiler + start precise coverage.
    await sendCommand(target, "Profiler.enable");
    await sendCommand(target, "Profiler.startPreciseCoverage", {
      callCount: false,
      detailed: true,
    });

    // Wait a moment to let the page execute startup code (panel already triggers a reload).
    await new Promise((r) => setTimeout(r, 2500));

    const { result } = await sendCommand(
      target,
      "Profiler.takePreciseCoverage",
    );

    // Stop coverage to reduce overhead.
    await sendCommand(target, "Profiler.stopPreciseCoverage");
    await sendCommand(target, "Profiler.disable");

    let totalBytes = 0;
    let usedBytes = 0;

    for (const script of result || []) {
      // Ignore anonymous/extension/internal scripts.
      if (!script.url || script.url.startsWith("chrome-extension://")) continue;

      for (const fn of script.functions || []) {
        for (const range of fn.ranges || []) {
          const bytes = Math.max(
            0,
            (range.endOffset ?? 0) - (range.startOffset ?? 0),
          );
          totalBytes += bytes;
          if ((range.count ?? 0) > 0) usedBytes += bytes;
        }
      }
    }

    const unusedBytes = Math.max(0, totalBytes - usedBytes);

    return {
      totalBytes,
      usedBytes,
      unusedBytes,
    };
  } finally {
    await detachDebugger(target);
  }
}

// Listen for messages from panel.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Panel should call this BEFORE/AROUND reload if you want startup coverage.
  // If you can't change panel yet, this still gives coverage for "post-load" window.
  if (
    message?.type === "REQUEST_UNUSED_JS" &&
    Number.isInteger(message.tabId)
  ) {
    const tabId = message.tabId;
    // attach debugger to { tabId }
    (async () => {
      try {
        const coverage = await computeExactUnusedJsBytes(tabId);

        chrome.runtime.sendMessage({
          type: "UNUSED_JS_RESULT",
          data: {
            tabId,
            unusedJSBytes: coverage.unusedBytes,
            usedJSBytes: coverage.usedBytes,
            totalJSBytes: coverage.totalBytes,
          },
        });
      } catch (e) {
        chrome.runtime.sendMessage({
          type: "UNUSED_JS_RESULT",
          error: e.message || String(e),
        });
      }
    })();

    // async
    return true;
  }

  if (message?.type === "ANALYSIS_COMPLETE" && message.data) {
    try {
      const data = message.data;
      const tabId = message.tabId || sender.tab?.id;

      const score = data.score ?? data.auditData?.finalScore ?? "N/A";
      const grade = data.grade ?? data.auditData?.finalGrade ?? "N/A";
      const co2 = data.co2 ?? data.co2Total ?? "N/A";
      const greenHosting =
        data.greenHosting !== undefined ? data.greenHosting : null;
      const url = data.url || "unknown";

      console.log("Analysis complete for:", url);
      console.log(" Score:", score);
      console.log(" Grade:", grade);
      console.log(" CO₂:", co2);
      console.log(" Green Hosting:", greenHosting);

      // ✨ UPDATE BADGE WITH GRADE
      if (grade !== "N/A" && tabId) {
        updateBadge(tabId, grade);
      }
    } catch (error) {
      console.error("Error processing analysis data:", error);
    }
  }

  return false;
});

function getBadgeColor(grade) {
  if (grade === "A+" || grade === "A" || grade === "A-") return "#1d7874";
  if (grade === "B+" || grade === "B" || grade === "B-") return "#4caf50";
  if (grade === "C+" || grade === "C" || grade === "C-") return "#ff9800";
  if (grade === "D+" || grade === "D" || grade === "D-") return "#e74c3c";
  return "#999999";
}

// ✨ NEW FUNCTION: Update badge with grade
function updateBadge(tabId, grade) {
  const badgeText = grade.substring(0, 2); // Truncate to 2 chars for display
  const badgeColor = getBadgeColor(grade);

  chrome.action.setBadgeText({
    tabId: tabId,
    text: badgeText,
  });

  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: badgeColor,
  });
}

// ✨ OPTIONAL: Clear badge when navigating away
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ tabId: tabId, text: "" });
  }
});
