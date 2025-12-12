// changes made(global variable for sites)
const MAXSITES = 12;

chrome.runtime.onInstalled.addListener(function (object) {
  chrome.storage.session.clear();
  chrome.storage.local.clear();
  let externalUrl = "https://ko-fi.com/globemallow#paypalModal";

  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: externalUrl }, function (tab) {
      //console.log("New tab launched with http://yoursite.com/");
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.status == "complete") {
    chrome.tabs.sendMessage(tabId, { start: true });
  }
});

//////////////////////
async function postData(url = "", data, contentType) {
  if (contentType == "json") {
    var datastringfy = JSON.stringify(data);
    data = datastringfy.replace(/[\r\n]+/gm, "");
    cType = "application/json";
  } else {
    cType = "application/x-www-form-urlencoded";
  }
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    credentials: "include",
    mode: "cors",
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": cType,
      "Access-Control-Allow-Origin": "*",
    },
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
////////////////////////

// background.js - Service Worker for badge updates

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ANALYSIS_COMPLETE") {
    const data = message.data;
    const score = data.auditData.finalScore;
    const grade = data.auditData.finalGrade;

    // Set badge color based on score
    let color = "#ff0d21"; // Red (F)
    if (score >= 92)
      color = "#32a852"; // Green (A)
    else if (score >= 78)
      color = "#8ECA2E"; // Light green (B)
    else if (score >= 67)
      color = "#f4e03a"; // Yellow (C)
    else if (score >= 55) color = "#F77616"; // Orange (D)

    // Update badge
    if (sender.tab) {
      chrome.action.setBadgeBackgroundColor({
        color: color,
        tabId: sender.tab.id,
      });

      chrome.action.setBadgeText({
        text: grade,
        tabId: sender.tab.id,
      });
    }
  }
});

// Clear badge when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({ text: "", tabId });
});
