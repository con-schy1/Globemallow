const notice = document.getElementById("notice");
const openHelpBtn = document.getElementById("open-help");
const openDevtoolsBtn = document.getElementById("open-devtools");

function showNotice(text) {
  notice.hidden = false;
  notice.textContent = text;
}

openDevtoolsBtn.addEventListener("click", () => {
  // Chrome extensions cannot open DevTools programmatically for the user.
  showNotice(
    "DevTools can’t be opened automatically. Use Ctrl+Shift+I (Windows/Linux) or ⌘⌥I (Mac), then open the “Globemallow” tab in DevTools.",
  );
});

openHelpBtn.addEventListener("click", async () => {
  // Optional: open a help page (replace with your own docs URL)
  const url = "https://ko-fi.com/globemallow";
  await chrome.tabs.create({ url });
});
