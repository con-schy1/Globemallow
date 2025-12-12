// panel.js - DevTools Panel Logic with chrome.devtools APIs

const ANALYSIS_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_PREFIX = "globemallow_analysis:";

// Energy and carbon constants
const DEFAULT_CARBON_INTENSITY_G_PER_KWH = 519;
const KWH_PER_BYTE_DATACENTER = 0.000000000072;
const KWH_PER_BYTE_NETWORK = 0.000000000152;
const KWH_PER_MINUTE_DEVICE = 0.00021;
const DEFAULT_MONTHLY_VIEWS = 5000;

// SiteAnalysis Class
class SiteAnalysis {
  constructor(url, auditData) {
    this.url = url;
    this.domain = new URL(url).hostname;
    this.timestamp = Date.now();
    this.expiresAt = Date.now() + ANALYSIS_EXPIRY_MS;
    this.auditData = auditData;
    this.greenHosting = null;
    this.kwhTotal = 0;
    this.co2Total = 0;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }

  getTimeRemaining() {
    const remaining = this.expiresAt - Date.now();
    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  }

  toJSON() {
    return {
      url: this.url,
      domain: this.domain,
      timestamp: this.timestamp,
      expiresAt: this.expiresAt,
      auditData: this.auditData,
      greenHosting: this.greenHosting,
      kwhTotal: this.kwhTotal,
      co2Total: this.co2Total,
    };
  }

  static fromJSON(data) {
    const analysis = new SiteAnalysis(data.url, data.auditData);
    analysis.timestamp = data.timestamp;
    analysis.expiresAt = data.expiresAt;
    analysis.greenHosting = data.greenHosting;
    analysis.kwhTotal = data.kwhTotal;
    analysis.co2Total = data.co2Total;
    return analysis;
  }

  async save() {
    const key = STORAGE_PREFIX + this.domain;
    await chrome.storage.local.set({ [key]: this.toJSON() });
  }

  static async load(url) {
    const domain = new URL(url).hostname;
    const key = STORAGE_PREFIX + domain;
    const result = await chrome.storage.local.get(key);

    if (result[key]) {
      const analysis = SiteAnalysis.fromJSON(result[key]);
      if (analysis.isExpired()) {
        await chrome.storage.local.remove(key);
        return null;
      }
      return analysis;
    }
    return null;
  }

  static async delete(url) {
    const domain = new URL(url).hostname;
    const key = STORAGE_PREFIX + domain;
    await chrome.storage.local.remove(key);
  }
}

// UI Elements
const analyzeBtn = document.getElementById("analyzeBtn");
const statusText = document.getElementById("statusText");
const loadingState = document.getElementById("loadingState");
const loadingDetail = document.getElementById("loadingDetail");
const resultsContainer = document.getElementById("resultsContainer");
const emptyState = document.getElementById("emptyState");

let currentUrl = "";
let networkRequests = [];
let performanceMetrics = {};

// Initialize
async function init() {
  currentUrl = chrome.devtools.inspectedWindow.tabId
    ? await getInspectedUrl()
    : window.location.href;

  // Check for existing analysis
  const savedAnalysis = await SiteAnalysis.load(currentUrl);
  if (savedAnalysis && !savedAnalysis.isExpired()) {
    displayResults(savedAnalysis);
    statusText.textContent = `Cached analysis (${savedAnalysis.getTimeRemaining()})`;
  }

  // Setup listeners
  analyzeBtn.addEventListener("click", startAnalysis);
}

// Get inspected page URL
function getInspectedUrl() {
  return new Promise((resolve) => {
    chrome.devtools.inspectedWindow.eval("window.location.href", (result) => {
      resolve(result);
    });
  });
}

// Start Analysis
async function startAnalysis() {
  analyzeBtn.disabled = true;
  emptyState.style.display = "none";
  resultsContainer.style.display = "none";
  loadingState.style.display = "block";
  statusText.textContent = "Analyzing...";

  networkRequests = [];
  performanceMetrics = {};

  try {
    // Step 1: Collect network data
    updateLoadingDetail("Collecting network requests...");
    await collectNetworkData();

    // Step 2: Collect performance metrics
    updateLoadingDetail("Gathering performance metrics...");
    await collectPerformanceMetrics();

    // Step 3: Analyze page content
    updateLoadingDetail("Analyzing page content...");
    const pageMetrics = await analyzePageContent();

    // Step 4: Calculate scores
    updateLoadingDetail("Calculating sustainability score...");
    const auditData = calculateAuditData(
      networkRequests,
      performanceMetrics,
      pageMetrics,
    );

    // Step 5: Create analysis
    const analysis = new SiteAnalysis(currentUrl, auditData);

    // Calculate energy & CO2
    const { kwhTotal, co2Total } = computeEnergyAndEmissions(auditData);
    analysis.kwhTotal = kwhTotal;
    analysis.co2Total = co2Total;

    // Check green hosting
    updateLoadingDetail("Checking green hosting...");
    analysis.greenHosting = await lookupGreenHosting(analysis.domain);

    // Save analysis
    await analysis.save();

    // Send to background for badge update
    await notifyBackground(analysis);

    // Display results
    loadingState.style.display = "none";
    displayResults(analysis);
    statusText.textContent = `Analysis complete (${analysis.getTimeRemaining()})`;
  } catch (error) {
    console.error("Analysis failed:", error);
    updateLoadingDetail(`Error: ${error.message}`);
    statusText.textContent = "Analysis failed";
  } finally {
    analyzeBtn.disabled = false;
  }
}

function updateLoadingDetail(text) {
  loadingDetail.textContent = text;
}

// Collect Network Data using DevTools API
function collectNetworkData() {
  return new Promise((resolve) => {
    // Clear existing requests
    networkRequests = [];

    // Listen for network requests
    const listener = (request) => {
      networkRequests.push(request);
    };

    chrome.devtools.network.onRequestFinished.addListener(listener);

    // Reload page to capture all requests
    chrome.devtools.inspectedWindow.reload({
      ignoreCache: false,
      userAgent: undefined,
    });

    // Wait for page load
    chrome.devtools.network.onNavigated.addListener(function onNav() {
      chrome.devtools.network.onNavigated.removeListener(onNav);

      // Wait a bit more for async resources
      setTimeout(() => {
        chrome.devtools.network.onRequestFinished.removeListener(listener);
        resolve();
      }, 2000);
    });
  });
}

// Collect Performance Metrics
async function collectPerformanceMetrics() {
  return new Promise((resolve) => {
    chrome.devtools.inspectedWindow.eval(
      `
      (function() {
        const timing = performance.getEntriesByType('navigation')[0];
        const memory = performance.memory;

        return {
          loadTime: timing ? (timing.loadEventEnd - timing.fetchStart) / 1000 : 0,
          domContentLoaded: timing ? (timing.domContentLoadedEventEnd - timing.fetchStart) / 1000 : 0,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime / 1000 || 0,
          jsHeapSize: memory ? memory.usedJSHeapSize : 0,
          totalJSHeapSize: memory ? memory.totalJSHeapSize : 0,
          redirects: performance.navigation ? performance.navigation.redirectCount : 0
        };
      })()
    `,
      (result, error) => {
        if (!error) {
          performanceMetrics = result;
        }
        resolve();
      },
    );
  });
}

// Analyze Page Content
async function analyzePageContent() {
  return new Promise((resolve) => {
    chrome.devtools.inspectedWindow.eval(
      `
      (function() {
        // Image analysis
        const images = Array.from(document.getElementsByTagName('img'));
        const lazyImages = images.filter(img =>
          img.loading === 'lazy' ||
          img.classList.contains('lazy') ||
          img.classList.contains('lazyload') ||
          img.classList.contains('lozad')
        );

        const modernImages = images.filter(img =>
          /\\.(svg|webp|avif)$/i.test(img.src)
        );

        const responsiveImages = images.filter(img =>
          img.hasAttribute('srcset') ||
          img.closest('picture')
        );

        // Stylesheets
        const inlineStyles = document.getElementsByTagName('style').length;
        const externalStyles = document.styleSheets.length;

        // Cookies
        const cookies = document.cookie.split(';').filter(c => c.trim());

        // Empty src attributes
        const emptySrc = document.querySelectorAll('[src=""], [href=""]').length;

        // HTML size
        const htmlSize = document.documentElement.innerHTML.length;

        // Fonts
        const hasFonts = document.head.innerHTML.match(/@font-face|fonts\\.googleapis|fonts\\.gstatic/);

        return {
          totalImages: images.length,
          lazyImages: lazyImages.length,
          modernImages: modernImages.length,
          responsiveImages: responsiveImages.length,
          inlineStyles,
          externalStyles,
          cookieCount: cookies.length,
          emptySrcCount: emptySrc,
          htmlSize,
          hasFonts: !!hasFonts
        };
      })()
    `,
      (result, error) => {
        if (!error) {
          resolve(result);
        } else {
          resolve({});
        }
      },
    );
  });
}

// Calculate Audit Data from collected metrics
function calculateAuditData(requests, perfMetrics, pageMetrics) {
  // Categorize requests
  const categories = {
    css: [],
    js: [],
    images: [],
    fonts: [],
    other: [],
  };

  let transferTotal = 0;
  let decodedTotal = 0;
  let compressedCount = 0;
  let minifiedCount = 0;
  let httpsCount = 0;
  let thirdPartyCount = 0;

  const currentDomain = new URL(currentUrl).hostname;

  requests.forEach((req) => {
    const url = req.request.url;
    const transferSize = req.response.bodySize || 0;
    const decodedSize = req.response.content?.size || 0;

    transferTotal += transferSize;
    decodedTotal += decodedSize;

    // Check HTTPS
    if (url.startsWith("https://")) httpsCount++;

    // Check compression
    const encoding = req.response.headers.find(
      (h) => h.name.toLowerCase() === "content-encoding",
    );
    if (
      encoding &&
      (encoding.value.includes("gzip") || encoding.value.includes("br"))
    ) {
      compressedCount++;
    }

    // Check third-party
    const reqDomain = new URL(url).hostname;
    if (reqDomain !== currentDomain) thirdPartyCount++;

    // Categorize
    if (/\.css/i.test(url)) {
      categories.css.push({ url, transferSize, decodedSize });
    } else if (/\.(js|json)/i.test(url)) {
      categories.js.push({ url, transferSize, decodedSize });
      // Simple minification check
      if (url.includes(".min.js") || transferSize < decodedSize * 0.7) {
        minifiedCount++;
      }
    } else if (/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)/i.test(url)) {
      categories.images.push({ url, transferSize, decodedSize });
    } else if (/\.(woff|woff2|ttf|otf|eot)/i.test(url)) {
      categories.fonts.push({ url, transferSize, decodedSize });
    } else {
      categories.other.push({ url, transferSize, decodedSize });
    }
  });

  // Calculate percentages
  const lazyLoadPercent =
    pageMetrics.totalImages > 0
      ? (pageMetrics.lazyImages / pageMetrics.totalImages) * 100
      : 0;

  const modernImagePercent =
    pageMetrics.totalImages > 0
      ? (pageMetrics.modernImages / pageMetrics.totalImages) * 100
      : 0;

  const responsiveImagePercent =
    pageMetrics.totalImages > 0
      ? (pageMetrics.responsiveImages / pageMetrics.totalImages) * 100
      : 0;

  const compressionPercent =
    requests.length > 0 ? (compressedCount / requests.length) * 100 : 0;

  // Calculate image compression savings (estimated)
  const imageTransferSize = categories.images.reduce(
    (sum, img) => sum + img.transferSize,
    0,
  );
  const estimatedOptimizedSize = imageTransferSize * 0.7; // Assume 30% savings possible
  const imgCompressKBSaved = Math.round(
    (imageTransferSize - estimatedOptimizedSize) / 1024,
  );

  // Calculate unused JS (simplified - would need Coverage API for accuracy)
  const jsSize = categories.js.reduce((sum, js) => sum + js.transferSize, 0);
  const estimatedUnusedJS = jsSize * 0.3; // Rough estimate: 30% unused
  const unusedJSKB = Math.round(estimatedUnusedJS / 1024);

  // Calculate CSS usage
  const cssTransferSize = categories.css.reduce(
    (sum, css) => sum + css.transferSize,
    0,
  );
  const cssPercent =
    transferTotal > 0 ? (cssTransferSize / transferTotal) * 100 : 0;

  // Calculate final score (using similar logic to original)
  const finalScore = calculateFinalScore({
    decodedTotal,
    transferTotal,
    lazyLoadPercent,
    modernImagePercent,
    jsHeapSize: perfMetrics.jsHeapSize || 0,
    htmlSize: pageMetrics.htmlSize || 0,
    loadTime: perfMetrics.loadTime || 0,
    hasFonts: pageMetrics.hasFonts,
    responsiveImagePercent,
    inlineStyles: pageMetrics.inlineStyles || 0,
    externalStyles: pageMetrics.externalStyles || 0,
    redirects: perfMetrics.redirects || 0,
    cookieCount: pageMetrics.cookieCount || 0,
    emptySrcCount: pageMetrics.emptySrcCount || 0,
  });

  return {
    // Original format for compatibility
    finalScore: finalScore.score,
    finalGrade: finalScore.grade,

    // Resource data
    transferTotal,
    transferLabel: formatBytes(transferTotal),
    transferSizeChart: transferTotal,

    fullTotal: decodedTotal,
    sizeLabel: formatBytes(decodedTotal),

    // Images
    lazyLoadChart: lazyLoadPercent.toFixed(1),
    svgChart: modernImagePercent.toFixed(1),
    resImgChart: responsiveImagePercent.toFixed(1),
    imgCompressKBSaved,

    // JS & CSS
    jsSizeLab: formatBytes(jsSize),
    jssSizeLabel: formatBytes(jsSize),
    jsChart: perfMetrics.jsHeapSize || 0,
    jsMax: Math.round((finalScore.score / 15.3) * 100),
    unusedJSKB,

    percentCSS: cssPercent.toFixed(1),

    // Performance
    duration: perfMetrics.loadTime || 0,
    loadTimeChart: perfMetrics.loadTime || 0,

    // Best practices
    cookieMax: 100 - pageMetrics.cookieCount * 10,
    cacheMax: 80, // Placeholder
    redirectsax: perfMetrics.redirects || 0,

    // New metrics
    thirdPartyScripts: thirdPartyCount,
    minificationEnabled: minifiedCount > categories.js.length * 0.5,
    gzipEnabled: compressionPercent > 50,
    httpsEnabled: httpsCount === requests.length,

    // Scores by category
    sizeMax: Math.round((finalScore.score / 15.3) * 100),

    // Timestamp
    storedAt: Date.now(),
  };
}

// Calculate Final Score (simplified version)
function calculateFinalScore(metrics) {
  let score = 0;
  const maxScore = 15.3;

  // Page size (3 points max)
  if (metrics.decodedTotal <= 150000) score += 3;
  else if (metrics.decodedTotal <= 1048576) score += 2.6;
  else if (metrics.decodedTotal <= 3145728) score += 2;
  else score += 1;

  // Transfer size (4 points max)
  if (metrics.transferTotal <= 150000) score += 4;
  else if (metrics.transferTotal <= 1048576) score += 3.25;
  else if (metrics.transferTotal <= 3145728) score += 2.5;
  else score += 2;

  // Lazy loading (0.4 points max)
  if (metrics.lazyLoadPercent >= 65) score += 0.4;
  else if (metrics.lazyLoadPercent >= 40) score += 0.3;
  else if (metrics.lazyLoadPercent > 0) score += 0.2;
  else score += 0.1;

  // Modern images (0.4 points max)
  if (metrics.modernImagePercent >= 70) score += 0.4;
  else if (metrics.modernImagePercent >= 50) score += 0.3;
  else if (metrics.modernImagePercent > 0) score += 0.2;
  else score += 0.1;

  // JS Heap (2 points max)
  if (metrics.jsHeapSize <= 10000000) score += 2;
  else if (metrics.jsHeapSize <= 20000000) score += 1.5;
  else if (metrics.jsHeapSize <= 40000000) score += 0.5;
  else score += 0.25;

  // HTML size (1 point max)
  if (metrics.htmlSize <= 250000) score += 1;
  else if (metrics.htmlSize <= 500000) score += 0.75;
  else if (metrics.htmlSize <= 1000000) score += 0.5;
  else score += 0.25;

  // Load time (2 points max)
  if (metrics.loadTime <= 2) score += 2;
  else if (metrics.loadTime <= 3.5) score += 1.75;
  else if (metrics.loadTime <= 5) score += 1.5;
  else if (metrics.loadTime <= 8) score += 0.75;
  else score += 0.5;

  // Fonts (0.4 points max)
  score += metrics.hasFonts ? 0.1 : 0.4;

  // Responsive images (0.4 points max)
  if (metrics.responsiveImagePercent >= 70) score += 0.4;
  else if (metrics.responsiveImagePercent >= 50) score += 0.35;
  else if (metrics.responsiveImagePercent > 0) score += 0.25;
  else score += 0.2;

  // Stylesheets (0.4 points max)
  if (metrics.inlineStyles <= 2) score += 0.2;
  else if (metrics.inlineStyles <= 5) score += 0.1;

  if (metrics.externalStyles <= 2) score += 0.2;
  else if (metrics.externalStyles <= 5) score += 0.15;

  // Redirects (0.1 points max)
  score += metrics.redirects === 0 ? 0.1 : 0;

  // Cookies (0.4 points max)
  if (metrics.cookieCount <= 3) score += 0.4;
  else if (metrics.cookieCount <= 7) score += 0.3;
  else if (metrics.cookieCount <= 10) score += 0.2;
  else if (metrics.cookieCount <= 15) score += 0.1;

  // Empty src (0.2 points max)
  if (metrics.emptySrcCount <= 2) score += 0.2;
  else if (metrics.emptySrcCount <= 4) score += 0.1;

  const percentage = Math.round((score / maxScore) * 100);

  // Calculate grade
  let grade = "F";
  if (percentage >= 95) grade = "A+";
  else if (percentage >= 92) grade = "A";
  else if (percentage >= 88) grade = "A-";
  else if (percentage >= 85) grade = "B+";
  else if (percentage >= 82) grade = "B";
  else if (percentage >= 78) grade = "B-";
  else if (percentage >= 75) grade = "C+";
  else if (percentage >= 73) grade = "C";
  else if (percentage >= 68) grade = "C-";
  else if (percentage >= 63) grade = "D+";
  else if (percentage >= 59) grade = "D";
  else if (percentage >= 55) grade = "D-";

  return { score: percentage, grade };
}

// Compute Energy & CO2
function computeEnergyAndEmissions(auditData) {
  const transferBytes = auditData.transferTotal || 0;
  const durationMinutes = (auditData.duration || 0) / 60;

  const kwhDCT = transferBytes * KWH_PER_BYTE_DATACENTER;
  const kwhNT = transferBytes * KWH_PER_BYTE_NETWORK;
  const kwhDT = durationMinutes * KWH_PER_MINUTE_DEVICE;

  const gesDCT = kwhDCT * DEFAULT_CARBON_INTENSITY_G_PER_KWH;
  const gesNT = kwhNT * DEFAULT_CARBON_INTENSITY_G_PER_KWH;
  const gesDT = kwhDT * 493;

  const kwhTotal = (kwhDCT + kwhNT + kwhDT) / 2;
  const co2Total = Number(((gesDCT + gesNT + gesDT) / 2).toPrecision(2));

  return { kwhTotal, co2Total };
}

// Green Hosting Lookup
async function lookupGreenHosting(domain) {
  try {
    const response = await fetch(
      `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${domain}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    return !!data.green;
  } catch {
    return null;
  }
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return "0 bytes";
  if (bytes < 1024) return bytes.toFixed(0) + " bytes";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1073741824) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

// Display Results
function displayResults(analysis) {
  resultsContainer.style.display = "block";
  emptyState.style.display = "none";

  const data = analysis.auditData;

  // Summary
  document.getElementById("summaryGrade").textContent = data.finalGrade || "—";
  document.getElementById("summaryScore").textContent = data.finalScore || "—";
  document.getElementById("summaryCO2").textContent = analysis.co2Total
    ? `${analysis.co2Total}g`
    : "—";
  document.getElementById("summarySize").textContent = data.sizeLabel || "—";

  // Detailed metrics
  const metricsHTML = `
    <div class="metric-group">
      <h3>🚀 Performance</h3>
      <div class="metric-item">
        <span class="metric-label">Page Load Time</span>
        <span class="metric-value">${data.duration?.toFixed(2) || "—"} s</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">JavaScript Heap</span>
        <span class="metric-value">${formatBytes(data.jsChart || 0)}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Redirects</span>
        <span class="metric-value">${data.redirectsax || 0}</span>
      </div>
    </div>

    <div class="metric-group">
      <h3>🖼️ Resources</h3>
      <div class="metric-item">
        <span class="metric-label">Page Size (decoded)</span>
        <span class="metric-value">${data.sizeLabel || "—"}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Transfer Size</span>
        <span class="metric-value">${data.transferLabel || "—"}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Modern Images</span>
        <span class="metric-value">${data.svgChart || 0}%</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Lazy Loaded Images</span>
        <span class="metric-value">${data.lazyLoadChart || 0}%</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Responsive Images</span>
        <span class="metric-value">${data.resImgChart || 0}%</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Image Compression Potential</span>
        <span class="metric-value">${data.imgCompressKBSaved || 0} KB</span>
      </div>
    </div>

    <div class="metric-group">
      <h3>⚡ Code Efficiency</h3>
      <div class="metric-item">
        <span class="metric-label">JavaScript Size</span>
        <span class="metric-value">${data.jsSizeLab || "—"}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Estimated Unused JS</span>
        <span class="metric-value">${data.unusedJSKB || 0} KB</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Third-party Scripts</span>
        <span class="metric-value">${data.thirdPartyScripts || 0}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">CSS Usage</span>
        <span class="metric-value">${data.percentCSS || 0}% of transfer</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Minification</span>
        <span class="metric-value ${data.minificationEnabled ? "good" : "poor"}">
          ${data.minificationEnabled ? "✓ Enabled" : "✗ Not detected"}
        </span>
      </div>
    </div>

    <div class="metric-group">
      <h3>🔒 Best Practices</h3>
      <div class="metric-item">
        <span class="metric-label">HTTPS</span>
        <span class="metric-value ${data.httpsEnabled ? "good" : "poor"}">
          ${data.httpsEnabled ? "✓ Enabled" : "✗ Not enabled"}
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">GZIP Compression</span>
        <span class="metric-value ${data.gzipEnabled ? "good" : "poor"}">
          ${data.gzipEnabled ? "✓ Enabled" : "✗ Not detected"}
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Cookies</span>
        <span class="metric-value">${data.cookieCount || 0}</span>
      </div>
    </div>

    <div class="metric-group">
      <h3>🌍 Sustainability</h3>
      <div class="metric-item">
        <span class="metric-label">CO₂ per View</span>
        <span class="metric-value">${analysis.co2Total}g</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Energy Consumed</span>
        <span class="metric-value">${analysis.kwhTotal.toPrecision(2)} kWh</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Green Hosting</span>
        <span class="metric-value ${analysis.greenHosting ? "good" : "warning"}">
          ${analysis.greenHosting === null ? "—" : analysis.greenHosting ? "✓ Yes" : "✗ No"}
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Monthly CO₂ (${DEFAULT_MONTHLY_VIEWS.toLocaleString()} views)</span>
        <span class="metric-value">${((analysis.co2Total * DEFAULT_MONTHLY_VIEWS) / 1000).toFixed(2)} kg</span>
      </div>
    </div>
  `;

  document.getElementById("metricsContent").innerHTML = metricsHTML;
}

// Notify background script
async function notifyBackground(analysis) {
  try {
    await chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      data: analysis.toJSON(),
    });
  } catch (error) {
    console.log("Could not notify background:", error);
  }
}

// Panel shown callback
window.onPanelShown = function () {
  console.log("Panel shown");
};

// Initialize on load
init();
