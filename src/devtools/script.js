// devtools.js - Entry point for DevTools integration

// Create a DevTools panel
chrome.devtools.panels.create(
  "Globemallow",
  "icons/icon48.png",
  "panel.html",
  (panel) => {
    let panelWindow = null;
    let isAnalyzing = false;

    panel.onShown.addListener((window) => {
      panelWindow = window;
      // Panel is shown, send message to panel
      if (panelWindow && panelWindow.onPanelShown) {
        panelWindow.onPanelShown();
      }
    });

    panel.onHidden.addListener(() => {
      panelWindow = null;
    });
  },
);
