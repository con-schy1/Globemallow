// panel.js - Complete DevTools Panel with Environmental Metrics - FIXED VERSION

const ANALYSIS_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_PREFIX = "globemallow_analysis:";

// Energy and carbon constants
const DEFAULT_CARBON_INTENSITY_G_PER_KWH = 519;
const KWH_PER_BYTE_DATACENTER = 0.000000000072;
const KWH_PER_BYTE_NETWORK = 0.000000000152;
const KWH_PER_MINUTE_DEVICE = 0.00021;
const DEFAULT_MONTHLY_VIEWS = 5000;

// Benchmark thresholds
const GOOD_TRANSFER_SIZE = 700000; // 0.7 MB
const GOOD_CO2_PER_VIEW = 1.8; // grams

// Metric explanations
const METRIC_EXPLANATIONS = {
  "Green Hosting": {
    title: "Green Hosting",
    description:
      "Green hosting means your website is hosted on servers powered by renewable energy. This significantly reduces the carbon footprint of your website. Switching to green hosting is one of the easiest ways to make your site more sustainable.",
  },
  "CO₂ per Page View": {
    title: "CO₂ Emissions per Page View",
    description:
      "This shows how much carbon dioxide is emitted every time someone loads your page. It includes energy used by data centers, networks, and user devices. Lower is better - aim for under 1.8g per page view.",
  },
  "Transfer Size": {
    title: "Transfer Size",
    description:
      "The amount of data sent over the network when loading your page. Smaller transfer sizes mean faster loading and less energy consumption. Compress images, minify code, and enable gzip compression to reduce this.",
  },
  CSS: {
    title: "CSS Resources",
    description:
      "Stylesheets that control how your page looks. Too many CSS files or large CSS files slow down your page. Combine and minify CSS files, and remove unused styles to improve performance.",
  },
  JavaScript: {
    title: "JavaScript Resources",
    description:
      "Scripts that add interactivity to your page. Heavy JavaScript increases load time and energy consumption. Minify your code, remove unused scripts, and consider lazy loading non-critical scripts.",
  },
  Images: {
    title: "Image Resources",
    description:
      "Images often make up the largest portion of page weight. Use modern formats like WebP or AVIF, compress images, implement lazy loading, and use responsive images to reduce their impact.",
  },
  Fonts: {
    title: "Font Resources",
    description:
      "Custom fonts require additional downloads. Consider using system fonts which are already on user devices, or limit the number of font variants you load to improve performance.",
  },
  "Lazy Loading": {
    title: "Lazy Loading",
    description:
      'Lazy loading delays loading images and other resources until they\'re needed (when scrolling into view). This reduces initial page load and saves bandwidth for content users never see. Add loading="lazy" to your images.',
  },
  "Modern Formats (WebP/AVIF)": {
    title: "Modern Image Formats",
    description:
      "WebP and AVIF provide much better compression than JPEG/PNG while maintaining quality. This means smaller file sizes, faster loading, and less energy consumption. Convert your images to these formats for significant savings.",
  },
  "Responsive Images": {
    title: "Responsive Images",
    description:
      "Responsive images serve different image sizes based on the user's device. This prevents mobile users from downloading huge desktop images. Use srcset and picture elements to implement responsive images.",
  },
  "Load Time": {
    title: "Page Load Time",
    description:
      "How long it takes for your page to fully load. Faster pages use less energy and provide better user experience. Aim for under 3 seconds. Optimize images, reduce JavaScript, and use browser caching.",
  },
  "JS Heap Size": {
    title: "JavaScript Heap Size",
    description:
      "The amount of memory JavaScript uses on the user's device. Large heap sizes slow down the page and drain battery on mobile devices. Reduce by removing unused code and optimizing algorithms.",
  },
  "Unused JS (est.)": {
    title: "Unused JavaScript",
    description:
      "JavaScript code that gets downloaded but never executed. This wastes bandwidth and processing power. Use code splitting and remove unnecessary libraries to reduce unused code.",
  },
  HTTPS: {
    title: "HTTPS Security",
    description:
      "HTTPS encrypts data between your server and users. All modern websites should use HTTPS for security. Mixed content (HTTP resources on HTTPS pages) creates security vulnerabilities.",
  },
  "Compression (gzip/br)": {
    title: "File Compression",
    description:
      "Gzip and Brotli compress your files before sending them over the network. This dramatically reduces transfer size. Enable compression on your server - it's one of the easiest optimizations.",
  },
  "JS Minification": {
    title: "JavaScript Minification",
    description:
      "Minification removes whitespace and shortens variable names in your code. This reduces file size without changing functionality. Always minify JavaScript in production.",
  },
  Caching: {
    title: "Browser Caching",
    description:
      "Caching stores resources in the user's browser so they don't need to be downloaded again. Set proper cache headers on your server to enable effective caching and reduce repeat visits' impact.",
  },
  "Third-party Scripts": {
    title: "Third-party Scripts",
    description:
      "Scripts loaded from other domains (analytics, ads, social media). Each third-party script adds overhead and potential privacy concerns. Minimize and carefully evaluate each one.",
  },
  "Potential Savings": {
    title: "Image Optimization Savings",
    description:
      "The estimated amount of data (and CO₂) you could save by properly optimizing your images. This includes compression, modern formats, and responsive images.",
  },
};

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
const exportBtn = document.getElementById("exportBtn");
const statusText = document.getElementById("statusText");
const loadingState = document.getElementById("loadingState");
const loadingDetail = document.getElementById("loadingDetail");
const resultsContainer = document.getElementById("resultsContainer");
const emptyState = document.getElementById("emptyState");

function exportCurrentReport() {
  if (!currentUrl) return;
  SiteAnalysis.load(currentUrl).then((analysis) => {
    if (!analysis) return;

    const json = JSON.stringify(analysis.toJSON(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `globemallow-report-${analysis.domain}-${new Date(analysis.timestamp).toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  });
}

if (exportBtn) exportBtn.addEventListener("click", exportCurrentReport);

let currentUrl = "";
let networkRequests = [];
let performanceMetrics = {};
let isAnalyzing = false;
let coverageResult = null;
let coveragePromiseResolve = null;
let coveragePromise = null;

function waitForCoverage(timeoutMs = 15000) {
  if (coverageResult) return Promise.resolve(coverageResult);

  coveragePromise = new Promise(
    (resolve) => (coveragePromiseResolve = resolve),
  );

  return Promise.race([
    coveragePromise,
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

// Initialize
async function init() {
  currentUrl = chrome.devtools.inspectedWindow.tabId
    ? await getInspectedUrl()
    : window.location.href;

  // Check for existing analysis
  const savedAnalysis = await SiteAnalysis.load(currentUrl);
  if (savedAnalysis && !savedAnalysis.isExpired()) {
    // Force proper state
    if (loadingState) loadingState.style.display = "none";
    if (emptyState) emptyState.style.display = "none";
    displayResults(savedAnalysis);
    statusText.textContent = `Cached analysis (${savedAnalysis.getTimeRemaining()})`;
  }

  // Setup listeners
  analyzeBtn.addEventListener("click", startAnalysis);
}
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "UNUSED_JS_RESULT" && message.data) {
    coverageResult = {
      unusedJSBytes: message.data.unusedJSBytes || 0,
      totalJSBytes: message.data.totalJSBytes || 0,
    };

    if (coveragePromiseResolve) {
      coveragePromiseResolve(coverageResult);
      coveragePromiseResolve = null;
    }
  }
});

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
  if (isAnalyzing) return;

  isAnalyzing = true;
  analyzeBtn.disabled = true;

  // Force UI state
  if (emptyState) emptyState.style.display = "none";
  if (resultsContainer) resultsContainer.style.display = "none";
  if (loadingState) loadingState.style.display = "block";

  statusText.textContent = "Analyzing...";
  networkRequests = [];
  performanceMetrics = {};
  coverageResult = null; // reset

  try {
    // NEW: ask background to start coverage & compute unused JS
    chrome.runtime.sendMessage({
      type: "REQUEST_UNUSED_JS",
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    // Step 1: Collect network data
    updateLoadingDetail("Collecting network requests...");
    await collectNetworkData();

    // Step 2: Collect performance metrics
    updateLoadingDetail("Gathering performance metrics...");
    await collectPerformanceMetrics();

    // Step 3: Analyze page content
    updateLoadingDetail("Analyzing page content...");
    const pageMetrics = await analyzePageContent();

    updateLoadingDetail("Calculating unused JS coverage...");
    await waitForCoverage(10000);

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

    // Send to background
    await notifyBackground(analysis);

    // Display results - FORCE hide loading first
    if (loadingState) loadingState.style.display = "none";
    displayResults(analysis);
    statusText.textContent = `Analysis complete (${analysis.getTimeRemaining()})`;
  } catch (error) {
    console.error("Analysis failed:", error);
    updateLoadingDetail(`Error: ${error.message}`);
    statusText.textContent = "Analysis failed";
    if (loadingState) loadingState.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
  } finally {
    analyzeBtn.disabled = false;
    isAnalyzing = false;
  }
}

function updateLoadingDetail(text) {
  if (loadingDetail) loadingDetail.textContent = text;
}

// Collect Network Data
function collectNetworkData() {
  return new Promise((resolve) => {
    networkRequests = [];

    const listener = (request) => {
      networkRequests.push(request);
    };

    chrome.devtools.network.onRequestFinished.addListener(listener);

    chrome.devtools.inspectedWindow.reload({
      ignoreCache: false,
      userAgent: undefined,
    });

    chrome.devtools.network.onNavigated.addListener(function onNav() {
      chrome.devtools.network.onNavigated.removeListener(onNav);
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
      `(function() {
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
      })()`,
      (result, error) => {
        if (!error && result) {
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
      `(function() {
        try {
          const images = Array.from(document.getElementsByTagName('img'));

          const lazyImages = images.filter(img =>
            img.loading === 'lazy' ||
            img.classList.contains('lazy') ||
            img.classList.contains('lazyload') ||
            img.classList.contains('lozad') ||
            img.classList.contains('b-lazy') ||
            img.classList.contains('lazyloaded')
          );

          const modernImages = images.filter(img =>
            /\\.(svg|webp|avif)$/i.test(img.src)
          );

          const responsiveImages = images.filter(img =>
            img.hasAttribute('srcset') || img.closest('picture')
          );

          const imgNotLazyLoaded = images
            .filter(img => !lazyImages.includes(img))
            .map(img => img.src)

          const imgNotGoodFormat = images
            .filter(img => !modernImages.includes(img))
            .map(img => img.src)

          const imgNotResponsive = images
            .filter(img => !responsiveImages.includes(img))
            .map(img => img.src)

          const inlineStyles = document.getElementsByTagName('style').length;
          const externalStyles = Array.from(document.styleSheets).filter(sheet => {
            try {
              return sheet.href !== null;
            } catch(e) {
              return false;
            }
          }).length;

          const cookies = document.cookie.split(';').filter(c => c.trim());
          const emptySrc = document.querySelectorAll('[src=""], [href=""]').length;
          const htmlSize = document.documentElement.innerHTML.length;
          const hasFonts = document.head.innerHTML.match(/@font-face|fonts\\.googleapis|fonts\\.gstatic/);

          const bodyBg = window.getComputedStyle(document.body).backgroundColor;

          function rgbToLuminance(rgbString) {
            const rgb = rgbString.match(/\\d+/g);
            if (!rgb || rgb.length < 3) return 0;
            const [r, g, b] = rgb.map(Number);
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          }

          const bgLuminance = rgbToLuminance(bodyBg);
          let colorScore = "something";
          if (bgLuminance < 0.1) colorScore = "black";
          else if (bgLuminance < 0.3) colorScore = "black/grey";
          else if (bgLuminance > 0.9) colorScore = "white";
          else if (bodyBg.includes('blue')) colorScore = "blue";

          return {
            totalImages: images.length,
            lazyImages: lazyImages.length,
            modernImages: modernImages.length,
            responsiveImages: responsiveImages.length,
            imgNotLazyLoaded: imgNotLazyLoaded,
            imgNotGoodFormat: imgNotGoodFormat,
            imgNotResponsive: imgNotResponsive,
            inlineStyles,
            externalStyles,
            cookieCount: cookies.length,
            emptySrcCount: emptySrc,
            htmlSize,
            hasFonts: !!hasFonts,
            colorScore: colorScore
          };
        } catch(e) {
          return {
            totalImages: 0,
            lazyImages: 0,
            modernImages: 0,
            responsiveImages: 0,
            imgNotLazyLoaded: [],
            imgNotGoodFormat: [],
            imgNotResponsive: [],
            inlineStyles: 0,
            externalStyles: 0,
            cookieCount: 0,
            emptySrcCount: 0,
            htmlSize: 0,
            hasFonts: false,
            colorScore: "something"
          };
        }
      })()`,
      (result, error) => {
        if (!error && result) {
          resolve(result);
        } else {
          resolve({
            totalImages: 0,
            lazyImages: 0,
            modernImages: 0,
            responsiveImages: 0,
            imgNotLazyLoaded: [],
            imgNotGoodFormat: [],
            imgNotResponsive: [],
            inlineStyles: 0,
            externalStyles: 0,
            cookieCount: 0,
            emptySrcCount: 0,
            htmlSize: 0,
            hasFonts: false,
            colorScore: "something",
          });
        }
      },
    );
  });
}

// Calculate Audit Data
function calculateAuditData(requests, perfMetrics, pageMetrics) {
  const categories = { css: [], js: [], images: [], fonts: [], other: [] };
  let transferTotal = 0,
    decodedTotal = 0,
    compressedCount = 0;
  let minifiedCount = 0,
    httpsCount = 0,
    thirdPartyCount = 0,
    cacheableCount = 0;
  const currentDomain = new URL(currentUrl).hostname;

  requests.forEach((req) => {
    try {
      const url = req.request.url;
      const transferSize =
        typeof req.response._transferSize === "number"
          ? req.response._transferSize
          : Math.max(0, req.response.bodySize || 0);
      const decodedSize = Math.max(0, req.response.content?.size || 0);
      const duration = req.time || 0;

      transferTotal += transferSize;
      decodedTotal += decodedSize;

      if (url.startsWith("https://")) httpsCount++;

      const encoding = req.response.headers.find(
        (h) => h.name.toLowerCase() === "content-encoding",
      );
      if (
        encoding &&
        (encoding.value.includes("gzip") || encoding.value.includes("br"))
      ) {
        compressedCount++;
      }

      const cacheControl = req.response.headers.find(
        (h) => h.name.toLowerCase() === "cache-control",
      );
      if (cacheControl && !cacheControl.value.includes("no-cache")) {
        cacheableCount++;
      }

      try {
        const reqDomain = new URL(url).hostname;
        if (reqDomain !== currentDomain) thirdPartyCount++;
      } catch (e) {}

      if (/\.css/i.test(url)) {
        categories.css.push({ url, transferSize, decodedSize, duration });
      } else if (/\.(js|json)/i.test(url)) {
        categories.js.push({ url, transferSize, decodedSize, duration });
        if (url.includes(".min.js") || transferSize < decodedSize * 0.7)
          minifiedCount++;
      } else if (/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)/i.test(url)) {
        categories.images.push({ url, transferSize, decodedSize, duration });
      } else if (/\.(woff|woff2|ttf|otf|eot)/i.test(url)) {
        categories.fonts.push({ url, transferSize, decodedSize, duration });
      } else {
        categories.other.push({ url, transferSize, decodedSize, duration });
      }
    } catch (e) {
      console.warn("Error processing request:", e);
    }
  });

  const cssTransSize = categories.css.reduce(
    (sum, r) => sum + r.transferSize,
    0,
  );
  const jsTransSize = categories.js.reduce((sum, r) => sum + r.transferSize, 0);
  const imageTransSize = categories.images.reduce(
    (sum, r) => sum + r.transferSize,
    0,
  );
  const fontTransSize = categories.fonts.reduce(
    (sum, r) => sum + r.transferSize,
    0,
  );
  const otherTransSize = categories.other.reduce(
    (sum, r) => sum + r.transferSize,
    0,
  );

  const allResources = [
    ...categories.css,
    ...categories.js,
    ...categories.images,
    ...categories.fonts,
    ...categories.other,
  ];

  const sortedByTotal = [...allResources].sort(
    (a, b) => b.decodedSize - a.decodedSize,
  );
  //sortedByDuration.slice(0, 3)
  const top3Total = sortedByTotal.map((r) => ({
    url: r.url,
    size: r.decodedSize,
    label: formatBytes(r.decodedSize),
  }));

  const sortedByTransfer = [...allResources].sort(
    (a, b) => b.transferSize - a.transferSize,
  );
  const top3Transfer = sortedByTransfer.map((r) => ({
    url: r.url,
    size: r.transferSize,
    label: formatBytes(r.transferSize),
    percent:
      transferTotal > 0
        ? ((r.transferSize / transferTotal) * 100).toFixed(2)
        : "0",
  }));

  const sortedByDuration = [...allResources].sort(
    (a, b) => b.duration - a.duration,
  );
  const top3Loading = sortedByDuration.map((r) => ({
    url: r.url,
    duration: r.duration,
    label:
      r.duration >= 1000
        ? `${(r.duration / 1000).toFixed(2)} secs`
        : `${r.duration.toFixed(2)} ms`,
  }));

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
  const cachePercent =
    requests.length > 0 ? (cacheableCount / requests.length) * 100 : 0;

  const estimatedOptimizedSize = imageTransSize * 0.7;
  const imgCompressKBSaved = Math.round(
    (imageTransSize - estimatedOptimizedSize) / 1024,
  );

  let unusedJSKB = 0;
  console.log(coverageResult);
  if (coverageResult && coverageResult.unusedJSBytes != null) {
    unusedJSKB = Math.round(coverageResult.unusedJSBytes / 1024);
    console.log(
      unusedJSKB,
      coverageResult.unusedJSBytes,
      Math.round(coverageResult.unusedJSBytes / 1024),
    );
  } else {
    // fallback heuristic if coverage failed
    const estimatedUnusedJS = jsTransSize * 0.3;
    unusedJSKB = Math.round(estimatedUnusedJS / 1024);
  }

  const percentCSS =
    transferTotal > 0 ? (cssTransSize / transferTotal) * 100 : 0;
  const percentJS = transferTotal > 0 ? (jsTransSize / transferTotal) * 100 : 0;
  const percentImg =
    transferTotal > 0 ? (imageTransSize / transferTotal) * 100 : 0;
  const percentFont =
    transferTotal > 0 ? (fontTransSize / transferTotal) * 100 : 0;
  const percentOther =
    transferTotal > 0 ? (otherTransSize / transferTotal) * 100 : 0;

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
    colorScore: pageMetrics.colorScore || "something",
    cachePercent,
  });

  const maxScore = 15.3;
  const metricWeights = calculateMetricWeights(finalScore, maxScore);

  const recommendations = generateRecommendations({
    lazyLoadPercent,
    modernImagePercent,
    responsiveImagePercent,
    transferTotal,
    loadTime: perfMetrics.loadTime || 0,
    emptySrcCount: pageMetrics.emptySrcCount || 0,
    inlineStyles: pageMetrics.inlineStyles || 0,
    externalStyles: pageMetrics.externalStyles || 0,
    cookieCount: pageMetrics.cookieCount || 0,
    redirects: perfMetrics.redirects || 0,
    hasFonts: pageMetrics.hasFonts,
    compressionPercent,
    httpsPercent:
      requests.length > 0 ? (httpsCount / requests.length) * 100 : 100,
    minificationPercent:
      categories.js.length > 0
        ? (minifiedCount / categories.js.length) * 100
        : 100,
    imgNotLazyLoaded: pageMetrics.imgNotLazyLoaded || [],
    imgNotGoodFormat: pageMetrics.imgNotGoodFormat || [],
    imgNotResponsive: pageMetrics.imgNotResponsive || [],
  });

  return {
    finalScore: finalScore.score,
    finalGrade: finalScore.grade,
    transferTotal,
    transferLabel: formatBytes(transferTotal),
    fullTotal: decodedTotal,
    sizeLabel: formatBytes(decodedTotal),
    cssTransSize,
    jsTransSize,
    imageTransSize,
    fontTransSize,
    otherTransSize,
    CSSSizeLab: formatBytes(cssTransSize),
    jsSizeLab: formatBytes(jsTransSize),
    imgTransSizeLab: formatBytes(imageTransSize),
    importedFontSizeLab: formatBytes(fontTransSize),
    imgNotLazyLoaded: pageMetrics.imgNotLazyLoaded || [],
    imgNotGoodFormat: pageMetrics.imgNotGoodFormat || [],
    imgNotResponsive: pageMetrics.imgNotResponsive || [],
    otherTransSizeLab: formatBytes(otherTransSize),
    percentCSS: percentCSS.toFixed(2),
    percentJS: percentJS.toFixed(2),
    percentImg: percentImg.toFixed(2),
    percentFont: percentFont.toFixed(2),
    percentOther: percentOther.toFixed(2),
    top3Total,
    top3Transfer,
    top3Loading,
    lazyLoadPercent: lazyLoadPercent.toFixed(1),
    modernImagePercent: modernImagePercent.toFixed(1),
    responsiveImagePercent: responsiveImagePercent.toFixed(1),
    imgCompressKBSaved,
    jsHeapSize: perfMetrics.jsHeapSize || 0,
    unusedJSKB,
    loadTime: perfMetrics.loadTime || 0,
    cachePercent: cachePercent.toFixed(1),
    compressionPercent: compressionPercent.toFixed(1),
    thirdPartyScripts: thirdPartyCount,
    minificationEnabled: minifiedCount > categories.js.length * 0.5,
    gzipEnabled: compressionPercent > 50,
    httpsEnabled: httpsCount === requests.length,
    metricWeights,
    recommendations,
    storedAt: Date.now(),
  };
}

// Calculate Final Score
function calculateFinalScore(metrics) {
  let score = 0;
  const maxScore = 15.3;
  const weights = {
    size: 0,
    transfer: 0,
    lazyLoad: 0,
    modernImage: 0,
    jsHeap: 0,
    htmlSize: 0,
    loadTime: 0,
    fonts: 0,
    responsiveImage: 0,
    stylesheets: 0,
    redirects: 0,
    cookies: 0,
    emptySrc: 0,
    color: 0,
    cache: 0,
  };

  if (metrics.decodedTotal <= 150000) {
    score += 3;
    weights.size = 3;
  } else if (metrics.decodedTotal <= 1048576) {
    score += 2.6;
    weights.size = 2.6;
  } else if (metrics.decodedTotal <= 3145728) {
    score += 2;
    weights.size = 2;
  } else {
    score += 1;
    weights.size = 1;
  }

  if (metrics.transferTotal <= 150000) {
    score += 4;
    weights.transfer = 4;
  } else if (metrics.transferTotal <= 1048576) {
    score += 3.25;
    weights.transfer = 3.25;
  } else if (metrics.transferTotal <= 3145728) {
    score += 2.5;
    weights.transfer = 2.5;
  } else {
    score += 2;
    weights.transfer = 2;
  }

  if (metrics.lazyLoadPercent >= 65) {
    score += 0.4;
    weights.lazyLoad = 0.4;
  } else if (metrics.lazyLoadPercent >= 40) {
    score += 0.3;
    weights.lazyLoad = 0.3;
  } else if (metrics.lazyLoadPercent > 0) {
    score += 0.2;
    weights.lazyLoad = 0.2;
  } else {
    score += 0.1;
    weights.lazyLoad = 0.1;
  }

  if (metrics.modernImagePercent >= 70) {
    score += 0.4;
    weights.modernImage = 0.4;
  } else if (metrics.modernImagePercent >= 50) {
    score += 0.3;
    weights.modernImage = 0.3;
  } else if (metrics.modernImagePercent > 0) {
    score += 0.2;
    weights.modernImage = 0.2;
  } else {
    score += 0.1;
    weights.modernImage = 0.1;
  }

  if (metrics.jsHeapSize <= 10000000) {
    score += 2;
    weights.jsHeap = 2;
  } else if (metrics.jsHeapSize <= 20000000) {
    score += 1.5;
    weights.jsHeap = 1.5;
  } else if (metrics.jsHeapSize <= 40000000) {
    score += 0.5;
    weights.jsHeap = 0.5;
  } else {
    score += 0.25;
    weights.jsHeap = 0.25;
  }

  if (metrics.htmlSize <= 250000) {
    score += 1;
    weights.htmlSize = 1;
  } else if (metrics.htmlSize <= 500000) {
    score += 0.75;
    weights.htmlSize = 0.75;
  } else if (metrics.htmlSize <= 1000000) {
    score += 0.5;
    weights.htmlSize = 0.5;
  } else {
    score += 0.25;
    weights.htmlSize = 0.25;
  }

  if (metrics.loadTime <= 2) {
    score += 2;
    weights.loadTime = 2;
  } else if (metrics.loadTime <= 3.5) {
    score += 1.75;
    weights.loadTime = 1.75;
  } else if (metrics.loadTime <= 5) {
    score += 1.5;
    weights.loadTime = 1.5;
  } else if (metrics.loadTime <= 8) {
    score += 0.75;
    weights.loadTime = 0.75;
  } else {
    score += 0.5;
    weights.loadTime = 0.5;
  }

  if (metrics.hasFonts) {
    score += 0.1;
    weights.fonts = 0.1;
  } else {
    score += 0.4;
    weights.fonts = 0.4;
  }

  if (metrics.responsiveImagePercent >= 70) {
    score += 0.4;
    weights.responsiveImage = 0.4;
  } else if (metrics.responsiveImagePercent >= 50) {
    score += 0.35;
    weights.responsiveImage = 0.35;
  } else if (metrics.responsiveImagePercent > 0) {
    score += 0.25;
    weights.responsiveImage = 0.25;
  } else {
    score += 0.2;
    weights.responsiveImage = 0.2;
  }

  if (metrics.inlineStyles <= 2) {
    score += 0.2;
    weights.stylesheets += 0.2;
  } else if (metrics.inlineStyles <= 5) {
    score += 0.1;
    weights.stylesheets += 0.1;
  }

  if (metrics.externalStyles <= 2) {
    score += 0.2;
    weights.stylesheets += 0.2;
  } else if (metrics.externalStyles <= 5) {
    score += 0.15;
    weights.stylesheets += 0.15;
  }

  if (metrics.redirects === 0) {
    score += 0.1;
    weights.redirects = 0.1;
  }

  if (metrics.cookieCount <= 3) {
    score += 0.4;
    weights.cookies = 0.4;
  } else if (metrics.cookieCount <= 7) {
    score += 0.3;
    weights.cookies = 0.3;
  } else if (metrics.cookieCount <= 10) {
    score += 0.2;
    weights.cookies = 0.2;
  } else if (metrics.cookieCount <= 15) {
    score += 0.1;
    weights.cookies = 0.1;
  }

  if (metrics.emptySrcCount <= 2) {
    score += 0.2;
    weights.emptySrc = 0.2;
  } else if (metrics.emptySrcCount <= 4) {
    score += 0.1;
    weights.emptySrc = 0.1;
  }

  switch (metrics.colorScore) {
    case "black":
    case "black/grey":
      score += 0.2;
      weights.color = 0.2;
      break;
    case "something":
      score += 0.15;
      weights.color = 0.15;
      break;
    case "white":
      score += 0.13;
      weights.color = 0.13;
      break;
    case "blue":
      score += 0.1;
      weights.color = 0.1;
      break;
  }

  if (metrics.cachePercent >= 80) {
    score += 0.4;
    weights.cache = 0.4;
  } else if (metrics.cachePercent >= 60) {
    score += 0.3;
    weights.cache = 0.3;
  } else if (metrics.cachePercent >= 40) {
    score += 0.2;
    weights.cache = 0.2;
  } else {
    score += 0.1;
    weights.cache = 0.1;
  }

  const percentage = Math.round((score / maxScore) * 100);
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

  return { score: percentage, grade, weights };
}

function calculateMetricWeights(finalScoreData, maxScore) {
  const currentScore = (finalScoreData.score / 100) * maxScore;
  const weights = finalScoreData.weights || {};

  return {
    lazyLoadMax: Math.round(
      ((currentScore - (weights.lazyLoad || 0) + 0.4) / maxScore) * 100,
    ),
    emptySrcMax: Math.round(
      ((currentScore - (weights.emptySrc || 0) + 0.2) / maxScore) * 100,
    ),
    cookieMax: Math.round(
      ((currentScore - (weights.cookies || 0) + 0.4) / maxScore) * 100,
    ),
    redirectMax: Math.round(
      ((currentScore - (weights.redirects || 0) + 0.1) / maxScore) * 100,
    ),
    ssFileMax: Math.round(
      ((currentScore - (weights.stylesheets || 0) / 2 + 0.2) / maxScore) * 100,
    ),
    intSSMax: Math.round(
      ((currentScore - (weights.stylesheets || 0) / 2 + 0.2) / maxScore) * 100,
    ),
    resMax: Math.round(
      ((currentScore - (weights.responsiveImage || 0) + 0.4) / maxScore) * 100,
    ),
    transMax: Math.round(
      ((currentScore - (weights.transfer || 0) + 4) / maxScore) * 100,
    ),
    fontMax: Math.round(
      ((currentScore - (weights.fonts || 0) + 0.4) / maxScore) * 100,
    ),
    timeMax: Math.round(
      ((currentScore - (weights.loadTime || 0) + 2) / maxScore) * 100,
    ),
    lengthMax: Math.round(
      ((currentScore - (weights.htmlSize || 0) + 1) / maxScore) * 100,
    ),
    imgTypeMax: Math.round(
      ((currentScore - (weights.modernImage || 0) + 0.4) / maxScore) * 100,
    ),
    jsMax: Math.round(
      ((currentScore - (weights.jsHeap || 0) + 2) / maxScore) * 100,
    ),
    sizeMax: Math.round(
      ((currentScore - (weights.size || 0) + 3) / maxScore) * 100,
    ),
    cacheMax: Math.round(
      ((currentScore - (weights.cache || 0) + 0.4) / maxScore) * 100,
    ),
    colorMax: Math.round(
      ((currentScore - (weights.color || 0) + 0.2) / maxScore) * 100,
    ),
  };
}

function generateRecommendations(metrics) {
  const highRec = [],
    medRec = [],
    lowRec = [];

  if (metrics.transferTotal > 3145728) {
    highRec.push({
      id: 107,
      title: "High Transfer Size",
      description: `Page transfer size is ${formatBytes(metrics.transferTotal)}. Consider reducing resources, enabling compression, and optimizing images.`,
      priority: "high",
    });
  } else if (metrics.transferTotal > 1048576) {
    medRec.push({
      id: 207,
      title: "Moderate Transfer Size",
      description: `Page transfer size is ${formatBytes(metrics.transferTotal)}. Room for optimization.`,
      priority: "medium",
    });
  }

  if (metrics.loadTime > 8) {
    highRec.push({
      id: 105,
      title: "Slow Page Load",
      description: `Page takes ${metrics.loadTime.toFixed(2)}s to load. Optimize resources and consider lazy loading.`,
      priority: "high",
    });
  } else if (metrics.loadTime > 5) {
    medRec.push({
      id: 205,
      title: "Moderate Load Time",
      description: `Page loads in ${metrics.loadTime.toFixed(2)}s. Could be faster.`,
      priority: "medium",
    });
  }

  if (
    metrics.lazyLoadPercent < 40 &&
    metrics.imgNotLazyLoaded &&
    metrics.imgNotLazyLoaded.length > 0
  ) {
    medRec.push({
      id: 201,
      title: "Lazy Loading Not Implemented",
      description: `Only ${metrics.lazyLoadPercent.toFixed(1)}% of images use lazy loading. Add loading="lazy" attribute.`,
      images: metrics.imgNotLazyLoaded.slice(0, 5),
      priority: "medium",
    });
  }

  if (
    metrics.modernImagePercent < 50 &&
    metrics.imgNotGoodFormat &&
    metrics.imgNotGoodFormat.length > 0
  ) {
    medRec.push({
      id: 202,
      title: "Use Modern Image Formats",
      description: `Only ${metrics.modernImagePercent.toFixed(1)}% use modern formats (WebP/AVIF). Convert images for better compression.`,
      images: metrics.imgNotGoodFormat.slice(0, 5),
      priority: "medium",
    });
  }

  if (
    metrics.responsiveImagePercent < 50 &&
    metrics.imgNotResponsive &&
    metrics.imgNotResponsive.length > 0
  ) {
    medRec.push({
      id: 203,
      title: "Responsive Images",
      description: `Only ${metrics.responsiveImagePercent.toFixed(1)}% of images are responsive. Use srcset or picture elements.`,
      images: metrics.imgNotResponsive.slice(0, 5),
      priority: "medium",
    });
  }

  if (metrics.emptySrcCount > 4) {
    medRec.push({
      id: 213,
      title: "Empty SRC Attributes",
      description: `Found ${metrics.emptySrcCount} elements with empty src/href. Remove or fix these.`,
      priority: "medium",
    });
  } else if (metrics.emptySrcCount > 2) {
    lowRec.push({
      id: 313,
      title: "Empty SRC Attributes",
      description: `Found ${metrics.emptySrcCount} elements with empty src/href.`,
      priority: "low",
    });
  }

  if (metrics.hasFonts) {
    medRec.push({
      id: 206,
      title: "Imported Fonts",
      description:
        "Page uses imported fonts. Consider system fonts for better performance.",
      priority: "medium",
    });
  }

  if (metrics.compressionPercent < 50) {
    highRec.push({
      id: 108,
      title: "Enable Compression",
      description: `Only ${metrics.compressionPercent.toFixed(1)}% of resources are compressed. Enable gzip/brotli on server.`,
      priority: "high",
    });
  }

  if (metrics.httpsPercent < 100) {
    highRec.push({
      id: 109,
      title: "Mixed Content",
      description: `${(100 - metrics.httpsPercent).toFixed(1)}% of resources use HTTP. Use HTTPS for all resources.`,
      priority: "high",
    });
  }

  if (metrics.minificationPercent < 50) {
    medRec.push({
      id: 208,
      title: "Minify JavaScript",
      description: `Only ${metrics.minificationPercent.toFixed(1)}% of JS files appear minified. Minify all JS.`,
      priority: "medium",
    });
  }

  if (metrics.cookieCount > 15) {
    lowRec.push({
      id: 314,
      title: "Too Many Cookies",
      description: `Page has ${metrics.cookieCount} cookies. Review and remove unnecessary cookies.`,
      priority: "low",
    });
  }

  if (metrics.redirects > 0) {
    lowRec.push({
      id: 315,
      title: "Page Redirects",
      description: `Page has ${metrics.redirects} redirect(s). Eliminate redirects for faster loading.`,
      priority: "low",
    });
  }

  return {
    high: highRec,
    medium: medRec,
    low: lowRec,
    all: [...highRec, ...medRec, ...lowRec],
  };
}

function computeEnergyAndEmissions(auditData) {
  const transferBytes = auditData.transferTotal || 0;
  const durationMinutes = (auditData.loadTime || 0) / 60;

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

async function notifyBackground(analysis) {
  try {
    await chrome.runtime.sendMessage({
      type: "ANALYSIS_COMPLETE",
      data: {
        url: analysis.url,
        score: analysis.auditData.finalScore,
        grade: analysis.auditData.finalGrade,
        co2: analysis.co2Total,
        greenHosting: analysis.greenHosting,
      },
    });
  } catch (e) {
    console.log("Could not notify background:", e);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 bytes";
  if (bytes < 1024) return bytes.toFixed(0) + " bytes";
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1073741824) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

function displayResults(analysis) {
  // FORCE hide loading state first
  if (loadingState) loadingState.style.display = "none";

  if (!resultsContainer || !emptyState) return;

  resultsContainer.style.display = "block";
  emptyState.style.display = "none";
  if (exportBtn) exportBtn.style.display = "inline-flex";

  const data = analysis.auditData;
  if (!data) return;

  const summaryGrade = document.getElementById("summaryGrade");
  const summaryScore = document.getElementById("summaryScore");
  const summaryCO2 = document.getElementById("summaryCO2");
  const summarySize = document.getElementById("summarySize");

  if (summaryGrade) summaryGrade.textContent = data.finalGrade || "—";
  if (summaryScore) summaryScore.textContent = data.finalScore || "—";
  if (summaryCO2)
    summaryCO2.textContent = analysis.co2Total ? `${analysis.co2Total}g` : "—";
  if (summarySize) summarySize.textContent = data.sizeLabel || "—";

  const metricsContent = document.getElementById("metricsContent");
  if (!metricsContent) return;

  metricsContent.innerHTML = generateMetricsHTML(data, analysis);

  // IMPORTANT: Setup click handlers for metrics AFTER HTML is inserted
  setupMetricClickHandlers();
}

// NEW FUNCTION: Setup click handlers for metric items
function setupMetricClickHandlers() {
  const metricItems = document.querySelectorAll(".metric-item");
  const metricDetailTitle = document.getElementById("metricTitle");
  const metricDetailBody = document.getElementById("metricBody");

  if (!metricDetailTitle || !metricDetailBody) return;

  metricItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      metricItems.forEach((mi) => mi.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Get the metric label text
      const labelElement = this.querySelector(".metric-label");
      if (!labelElement) return;

      const labelText = labelElement.textContent.trim();

      // Find explanation in our dictionary
      const explanation = METRIC_EXPLANATIONS[labelText];

      if (explanation) {
        metricDetailTitle.textContent = explanation.title;
        metricDetailBody.textContent = explanation.description;
      } else {
        // Fallback if no explanation found
        metricDetailTitle.textContent = labelText;
        metricDetailBody.textContent = `This metric shows information about ${labelText.toLowerCase()}. Click on different metrics to learn more about each one.`;
      }
    });
  });
}

function generateMetricsHTML(data, analysis) {
  const top3Total = data.top3Total || [];
  const top3Transfer = data.top3Transfer || [];
  const top3Loading = data.top3Loading || [];
  const recommendations = data.recommendations || { all: [] };

  // Calculate environmental metrics
  const co2PerView = analysis.co2Total || 0;
  const transferSize = data.transferTotal || 0;
  const kwhTotal = analysis.kwhTotal || 0;
  const monthlyCO2 = (co2PerView * DEFAULT_MONTHLY_VIEWS) / 1000;

  // Calculate phone charging equivalent (assume 3000mAh battery * 3.7V = 11.1Wh)
  const phoneChargeEquivalent = (kwhTotal * 1000) / 11.1;

  // Calculate potential savings from optimizations
  const potentialSavings = data.imgCompressKBSaved
    ? (
        data.imgCompressKBSaved *
        1024 *
        KWH_PER_BYTE_NETWORK *
        DEFAULT_CARBON_INTENSITY_G_PER_KWH
      ).toFixed(2)
    : 0;

  // Daily device usage (assume 8 hours = 0.00168 kWh)
  const dailyDeviceUsage = 0.00168;
  const deviceUsagePercent = ((kwhTotal / dailyDeviceUsage) * 100).toFixed(1);
  const lazyLinks = data.imgNotLazyLoaded || []; // for Lazy Loading %
  const modernLinks = data.imgNotGoodFormat || []; // for Modern Formats (WebP/AVIF) %
  const responsiveLinks = data.imgNotResponsive || []; // for Responsive Images %

  return `
    <!-- Environmental Impact Summary -->
    <div class="metric-group" style="background: linear-gradient(135deg, rgba(29, 120, 116, 0.1) 0%, rgba(29, 120, 116, 0.05) 100%); border-left: 4px solid var(--accent); padding: var(--sp-lg); border-radius: 6px; margin-bottom: var(--sp-xl);">
      <h3 style="color: var(--accent); margin-bottom: var(--sp-lg);">Environmental Impact Summary</h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-lg); margin-bottom: var(--sp-lg);">
        <div style="background: var(--bg-primary); padding: var(--sp-md); border-radius: 4px;">
          <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px;">CO₂ per Page Load</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${co2PerView.toFixed(5)}g</div>
          <div style="font-size: 10px; color: var(--text-secondary);">Equal to charging a phone for ${phoneChargeEquivalent.toFixed(1)} hrs</div>
        </div>

        <div style="background: var(--bg-primary); padding: var(--sp-md); border-radius: 4px;">
          <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px;">Energy Consumed</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${kwhTotal.toFixed(6)} kWh</div>
          <div style="font-size: 10px; color: var(--text-secondary);">${deviceUsagePercent}% of daily device usage</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-lg);">
        <div style="background: var(--bg-primary); padding: var(--sp-md); border-radius: 4px;">
          <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px;">Potential Savings</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--status-good); margin-bottom: 4px;">-${potentialSavings}g CO₂</div>
          <div style="font-size: 10px; color: var(--text-secondary);">With recommended optimizations</div>
        </div>

        <div style="background: var(--bg-primary); padding: var(--sp-md); border-radius: 4px;">
          <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px;">Monthly CO₂</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${monthlyCO2.toFixed(1)} kg</div>
          <div style="font-size: 10px; color: var(--text-secondary);">For ${DEFAULT_MONTHLY_VIEWS.toLocaleString()} monthly visitors</div>
        </div>
      </div>
    </div>

    <!-- Green Hosting & Benchmarks -->
    <div class="metric-group">
      <h3>Hosting & Benchmarks</h3>

      <div class="metric-item ${analysis.greenHosting ? "good" : "warning"}">
        <div style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="metric-label">Green Hosting</span>
            <span class="metric-value ${analysis.greenHosting ? "good" : "warning"}">
              ${analysis.greenHosting === true ? "✓ renewable energy" : analysis.greenHosting === false ? "✗ standard hosting" : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div class="metric-item">
        <div style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="metric-label">CO₂ per Page View</span>
            <span class="metric-value">${co2PerView.toFixed(5)}g</span>
          </div>
          <div style="font-size: 10px; color: var(--text-secondary);">≤ ${GOOD_CO2_PER_VIEW}g</div>
        </div>
      </div>

      <div class="metric-item ${transferSize <= GOOD_TRANSFER_SIZE ? "good" : "warning"}">
        <div style="width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="metric-label">Transfer Size</span>
            <span class="metric-value ${transferSize <= GOOD_TRANSFER_SIZE ? "good" : "warning"}">${data.transferLabel}</span>
          </div>
          <div style="font-size: 10px; color: var(--text-secondary);">≤ ${formatBytes(GOOD_TRANSFER_SIZE)}</div>
        </div>
      </div>
    </div>

    <!-- Resource Breakdown -->
    <div class="metric-group">
      <h3>Resource Breakdown</h3>
      <div class="metric-item">
        <span class="metric-label">CSS</span>
        <span class="metric-value">${data.CSSSizeLab} (${data.percentCSS}%)</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">JavaScript</span>
        <span class="metric-value">${data.jsSizeLab} (${data.percentJS}%)</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Images</span>
        <span class="metric-value">${data.imgTransSizeLab} (${data.percentImg}%)</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Fonts</span>
        <span class="metric-value">${data.importedFontSizeLab} (${data.percentFont}%)</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Other</span>
        <span class="metric-value">${data.otherTransSizeLab} (${data.percentOther}%)</span>
      </div>
    </div>

    <!-- Top 3 Largest Resources -->
    <div class="metric-group metric-group--overflow">
      <h3>Largest Resources (Total Size)</h3>
      ${
        top3Total.length > 0
          ? top3Total
              .map(
                (r, i) => `
        <div class="metric-item">
          <span class="metric-label" title="${r.url}">${i + 1}. ${truncateUrl(r.url, 40)}</span>
          <span class="metric-value">${r.label}</span>
        </div>
      `,
              )
              .join("")
          : '<div class="metric-item"><span class="metric-label">No resources to display</span></div>'
      }
    </div>

    <!-- Top 3 Transfer -->
    <div class="metric-group metric-group--overflow">
      <h3>Largest Transfer</h3>
      ${
        top3Transfer.length > 0
          ? top3Transfer
              .map(
                (r, i) => `
        <div class="metric-item">
          <span class="metric-label" title="${r.url}">${i + 1}. ${truncateUrl(r.url, 40)}</span>
          <span class="metric-value">${r.label} (${r.percent}%)</span>
        </div>
      `,
              )
              .join("")
          : '<div class="metric-item"><span class="metric-label">No resources to display</span></div>'
      }
    </div>

    <!-- Top 3 Loading Time -->
    <div class="metric-group metric-group--overflow">
      <h3>Longest Loading</h3>
      ${
        top3Loading.length > 0
          ? top3Loading
              .map(
                (r, i) => `
        <div class="metric-item">
          <span class="metric-label" title="${r.url}">${i + 1}. ${truncateUrl(r.url, 40)}</span>
          <span class="metric-value">${r.label}</span>
        </div>
      `,
              )
              .join("")
          : '<div class="metric-item"><span class="metric-label">No resources to display</span></div>'
      }
    </div>

    <!-- Image Optimization -->
    <div class="metric-group ">
      <h3>Image Optimization</h3>
      <div class="metric-item ${parseFloat(data.lazyLoadPercent) >= 65 ? "good" : "warning"}">
        <span class="metric-label">Lazy Loading</span>
        <span class="metric-value ${parseFloat(data.lazyLoadPercent) >= 65 ? "good" : "warning"}">${data.lazyLoadPercent}%</span>
        ${
          lazyLinks.length
            ? `
          <details style="margin:4px 0 12px 0; font-size:11px;">
            <summary style="cursor:pointer; color:var(--accent);">
              Show images not lazy-loaded (${lazyLinks.length})
            </summary>
            <ul style="margin:4px 0 0 16px; padding:0;">
              ${lazyLinks.map((u) => `<li title="${u}" style="margin:2px 0; overflow:hidden; text-overflow:ellipsis;">${truncateUrl(u, 50)}</li>`).join("")}
            </ul>
          </details>
        `
            : ""
        }
      </div>
      <div class="metric-item ${parseFloat(data.modernImagePercent) >= 70 ? "good" : "warning"}">
        <span class="metric-label">Modern Formats (WebP/AVIF)</span>
        <span class="metric-value ${parseFloat(data.modernImagePercent) >= 70 ? "good" : "warning"}">${data.modernImagePercent}%</span>
        ${
          modernLinks.length
            ? `
          <details style="margin:4px 0 12px 0; font-size:11px;">
            <summary style="cursor:pointer; color:var(--accent);">
              Show old formats (${modernLinks.length})
            </summary>
            <ul style="margin:4px 0 0 16px; padding:0;">
              ${modernLinks.map((u) => `<li title="${u}" style="margin:2px 0; overflow:hidden; text-overflow:ellipsis;">${truncateUrl(u, 50)}</li>`).join("")}
            </ul>
          </details>
        `
            : ""
        }
      </div>
      <div class="metric-item ${parseFloat(data.responsiveImagePercent) >= 70 ? "good" : "warning"}">
        <span class="metric-label">Responsive Images</span>
        <span class="metric-value ${parseFloat(data.responsiveImagePercent) >= 70 ? "good" : "warning"}">${data.responsiveImagePercent}%</span>
        ${
          responsiveLinks.length
            ? `
          <details style="margin:4px 0 12px 0; font-size:11px;">
            <summary style="cursor:pointer; color:var(--accent);">
              Show non-responsive images (${responsiveLinks.length})
            </summary>
            <ul style="margin:4px 0 0 16px; padding:0;">
              ${responsiveLinks.map((u) => `<li title="${u}" style="margin:2px 0; overflow:hidden; text-overflow:ellipsis;">${truncateUrl(u, 50)}</li>`).join("")}
            </ul>
          </details>
        `
            : ""
        }
      </div>
      <div class="metric-item">
        <span class="metric-label">Potential Savings</span>
        <span class="metric-value">${data.imgCompressKBSaved} KB</span>
      </div>
    </div>

    <!-- Performance -->
    <div class="metric-group">
      <h3>Performance</h3>
      <div class="metric-item ${(data.loadTime || 0) <= 3.5 ? "good" : "warning"}">
        <span class="metric-label">Load Time</span>
        <span class="metric-value ${(data.loadTime || 0) <= 3.5 ? "good" : "warning"}">${(data.loadTime || 0).toFixed(2)}s</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">JS Heap Size</span>
        <span class="metric-value">${formatBytes(data.jsHeapSize || 0)}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Unused JS (post-function est.)</span>
        <span class="metric-value">${data.unusedJSKB || 0} KB</span>
      </div>
    </div>

    <!-- Best Practices -->
    <div class="metric-group">
      <h3>Best Practices</h3>
      <div class="metric-item ${data.httpsEnabled ? "good" : "poor"}">
        <span class="metric-label">HTTPS</span>
        <span class="metric-value ${data.httpsEnabled ? "good" : "poor"}">${data.httpsEnabled ? "✓ Enabled" : "✗ Mixed Content"}</span>
      </div>
      <div class="metric-item ${data.gzipEnabled ? "good" : "warning"}">
        <span class="metric-label">Compression (gzip/br)</span>
        <span class="metric-value ${data.gzipEnabled ? "good" : "warning"}">
          ${data.gzipEnabled ? "✓ Enabled" : "✗ Disabled"} (${data.compressionPercent}%)
        </span>
      </div>
      <div class="metric-item ${data.minificationEnabled ? "good" : "warning"}">
        <span class="metric-label">JS Minification</span>
        <span class="metric-value ${data.minificationEnabled ? "good" : "warning"}">${data.minificationEnabled ? "✓ Yes" : "△ Partial"}</span>
      </div>
      <div class="metric-item ${parseFloat(data.cachePercent) >= 60 ? "good" : "warning"}">
        <span class="metric-label">Caching</span>
        <span class="metric-value ${parseFloat(data.cachePercent) >= 60 ? "good" : "warning"}">${data.cachePercent}%</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Third-party Scripts</span>
        <span class="metric-value">${data.thirdPartyScripts || 0}</span>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="metric-group">
      <h3>Recommendations</h3>
      ${
        recommendations.all.length === 0
          ? '<div class="metric-item good"><span class="metric-label">✓ No major issues found!</span></div>'
          : recommendations.all
              .map(
                (rec) => `
        <div class="metric-item ${rec.priority === "high" ? "poor" : rec.priority === "medium" ? "warning" : ""}">
          <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="metric-label" style="font-weight: 600;">${rec.title}</span>
              <span class="badge ${rec.priority}">${rec.priority}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
              ${rec.description}
            </div>
            ${
              rec.images && rec.images.length > 0
                ? `
              <details style="margin-top: 8px; font-size: 11px;">
                <summary style="cursor: pointer; color: var(--accent);">Show affected resources (${rec.images.length})</summary>
                <ul style="margin: 4px 0 0 16px; padding: 0;">
                  ${rec.images.map((img) => `<li title="${img}" style="margin: 2px 0; overflow: hidden; text-overflow: ellipsis;">${truncateUrl(img, 50)}</li>`).join("")}
                </ul>
              </details>
            `
                : ""
            }
          </div>
        </div>
      `,
              )
              .join("")
      }
    </div>
  `;
}

function truncateUrl(url, maxLength = 60) {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  const start = url.substring(0, maxLength - 20);
  const end = url.substring(url.length - 17);
  return `${start}...${end}`;
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
