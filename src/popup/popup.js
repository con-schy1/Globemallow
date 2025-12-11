// ========== COLLAPSIBLE SECTIONS ==========
function toggleSection(element) {
  const section = element.closest(".audit-section");
  if (section) {
    section.classList.toggle("open");
    const header = section.querySelector(".section-header");
    if (header) {
      header.classList.toggle("open");
    }
  }
}

// ========== OPTIMIZATION PANEL ==========
function openOptimizations() {
  const panel = document.getElementById("optimizationPanel");
  const overlay = document.getElementById("panelOverlay");
  if (panel && overlay) {
    panel.classList.add("open");
    overlay.classList.add("open");
  }
}

function closeOptimizations() {
  const panel = document.getElementById("optimizationPanel");
  const overlay = document.getElementById("panelOverlay");
  if (panel && overlay) {
    panel.classList.remove("open");
    overlay.classList.remove("open");
  }
}

function exportReport() {
  alert("Exporting audit report as PDF...");
}

// ========== METRIC DETAIL LOGIC + EVENT WIRING ==========
window.addEventListener("DOMContentLoaded", () => {
  const metricTitleEl = document.getElementById("metricTitle");
  const metricBodyEl = document.getElementById("metricBody");

  const metricInfo = {
    // Performance
    fcp: {
      title: "First Contentful Paint",
      body: "Shows how quickly the first text or image appears on screen. Lower times feel snappier and help users trust the site.",
    },
    lcp: {
      title: "Largest Contentful Paint",
      body: "Measures when the main content finishes loading. If this is slow, the page feels sluggish even if smaller items appear earlier.",
    },
    cls: {
      title: "Cumulative Layout Shift",
      body: "Captures how much things jump around while the page loads. Lower values mean a more stable, less frustrating experience.",
    },
    tbt: {
      title: "Total Blocking Time",
      body: "Shows how long the page is too busy to respond to taps, clicks, or typing. High values usually mean heavy JavaScript.",
    },

    // Resource optimization
    "modern-images": {
      title: "Modern Image Formats",
      body: "Indicates how many images use newer formats like WebP or AVIF, which deliver good quality with much smaller file sizes.",
    },
    "image-compression": {
      title: "Image Compression",
      body: "Shows how many kilobytes could be saved by compressing images more efficiently without noticeable quality loss.",
    },
    "lazy-loading": {
      title: "Lazy Loading Images",
      body: "Shows how many images only load when a user scrolls near them, which speeds up the initial view and saves energy.",
    },
    "responsive-images": {
      title: "Responsive Images",
      body: "Checks whether images adapt to screen size using srcset or picture, so mobile devices do not download oversized images.",
    },
    "css-usage": {
      title: "CSS Usage",
      body: "Indicates how much of your CSS is actually used. Unused CSS still has to be downloaded and parsed by browsers.",
    },

    // Code efficiency
    "bundle-size": {
      title: "Main Bundle Size",
      body: "Shows how big the main JavaScript bundle is. Larger bundles take longer to download and can slow down the page.",
    },
    "unused-js": {
      title: "Unused JavaScript",
      body: "Estimates how much JavaScript is loaded but not needed. Removing it cuts both load time and resource use.",
    },
    "third-party-scripts": {
      title: "Third-party Scripts",
      body: "Counts external scripts such as analytics and widgets. Each one adds extra work for the browser.",
    },
    minification: {
      title: "Minification",
      body: "Indicates whether code has been compacted to remove whitespace and comments, slightly reducing file size.",
    },

    // Best practices
    "browser-caching": {
      title: "Browser Caching",
      body: "Shows how long files can be reused without re-downloading. Good caching makes return visits much faster.",
    },
    "cookie-count": {
      title: "Cookie Count",
      body: "Counts cookies set by the page. Fewer, smaller cookies mean less data sent on each request.",
    },
    gzip: {
      title: "GZIP Compression",
      body: "Checks whether text assets like HTML, CSS, and JS are compressed before being sent, reducing transfer size.",
    },
    https: {
      title: "HTTPS",
      body: "Confirms that traffic is encrypted, which is now the standard for both security and browser features.",
    },
    redirects: {
      title: "Redirects",
      body: "Shows whether users are bounced through extra URLs before reaching the final page, which adds delay.",
    },
    "page-size": {
      title: "Page Size",
      body: "Reports the total size of all resources loaded on first view. Smaller pages load faster and use less energy.",
    },

    // Sustainability
    "green-hosting": {
      title: "Green Hosting",
      body: "Indicates whether the hosting provider reports using renewable energy or has taken steps to reduce emissions.",
    },
    "co2-per-view": {
      title: "CO₂ per Page View",
      body: "Estimates how much carbon dioxide is emitted each time someone loads this page, based on data transfer and device use.",
    },
    "transfer-size": {
      title: "Transfer Size",
      body: "Shows how much data is sent over the network on load. Reducing this lowers both load time and energy use.",
    },
  };

  // Metric detail on click
  if (metricTitleEl && metricBodyEl) {
    document.querySelectorAll(".audit-item").forEach((item) => {
      item.addEventListener("click", function (event) {
        // prevent section toggle when clicking a metric card
        event.stopPropagation();
        const key = this.getAttribute("data-metric");
        if (key && metricInfo[key]) {
          metricTitleEl.textContent = metricInfo[key].title;
          metricBodyEl.textContent = metricInfo[key].body;
        }
      });
    });
  }

  // Section dropdowns (no inline onclick)
  document.querySelectorAll(".audit-section").forEach((section) => {
    section.addEventListener("click", function (event) {
      // if click bubbled from an audit-item, it was already handled above
      toggleSection(this);
    });
  });

  // Footer buttons
  const exportBtn = document.getElementById("exportReportBtn");
  const optimizationsBtn = document.getElementById("optimizationsBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportReport);
  }
  if (optimizationsBtn) {
    optimizationsBtn.addEventListener("click", openOptimizations);
  }

  // Overlay + close button
  const overlay = document.getElementById("panelOverlay");
  const closeBtn = document.getElementById("panelCloseBtn");
  if (overlay) {
    overlay.addEventListener("click", closeOptimizations);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeOptimizations);
  }
});
