const AVERAGE = 0;
const MAX = AVERAGE * 2;

const ctx = document.querySelector("#myChart").getContext("2d");

let hosts = [];
class Hosts {
  constructor(time, url, Sustainability, Score) {
    this.time = time;
    this.url = url;
    this.Score = Score;
    this.Sustainability = Sustainability;
  }
}
class Dataset {
  constructor(label, data) {
    this.base = AVERAGE;
    this.label = label;
    this.data = data; //hosts.map(z => z[label]);
    this.backgroundColor = (context) => {
      const index = context.dataIndex;
      const value = context.dataset.data[index];
      return value < this.base
        ? "rgba(200, 0, 0, 0.6)"
        : "rgba(0, 200, 0, 0.6)";
    };
    this.borderColor = this.backgroundColor;
    this.borderWidth = 2;
    this.borderRadius = 5;
    this.borderSkipped = false;
    this.fill = {
      target: AVERAGE,
      above: "green",
      below: "red",
    };
  }
}

function normalizeRecord(rec) {
  if (!rec || typeof rec !== "object") return null;

  const audit = rec.auditData || {};
  console.log(audit, audit.finalScore);
  return {
    time: audit.storedAt ?? rec.timestamp ?? Date.now(),
    url: rec.url ?? rec.hostURL ?? rec.domain ?? "Unknown",
    // Use finalScore as "Score"
    Score: typeof audit.finalScore === "number" ? audit.finalScore : 0,
    // You don't have Sustainability in the new object; pick a definition:
    // Option A: use finalScore again (so chart shows overall score trend)
    // Sustainability: typeof audit.finalScore === "number" ? audit.finalScore : 0,
    // Option B (better): compute from emissions/transfer, if you want—ask and I’ll wire it.
  };
}

function chartConfig(storageData) {
  hosts.length = 0;

  for (const k in storageData) {
    const n = normalizeRecord(storageData[k]);
    if (!n) continue;

    hosts.push(new Hosts(n.time, n.url, n.Sustainability, n.Score));
  }

  // Sort by time ascending (simple + reliable)
  hosts.sort((a, b) => a.time - b.time);

  const labels = ["Score"];
  const dataTotal = hosts.map((h) => (h.Sustainability || 0) + (h.Score || 0));

  return {
    type: "bar",
    data: {
      labels: hosts.map((h) => h.url),
      datasets: [new Dataset(labels.join(" "), dataTotal)],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { min: 30, max: 100, ticks: { stepSize: 5 } } },
    },
  };
}

function createChart(callback, storageData) {
  if (!callback) return 0;

  return new Chart(ctx, callback(storageData));
}
function updateChartData(x) {
  //chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [x.totalTot, x.totalDiff];
  });
  chart.update();
}

let chart = null;
function isReportObject(v) {
  return (
    v &&
    typeof v === "object" &&
    typeof v.url === "string" &&
    typeof v.timestamp === "number"
  );
}

async function loadAllReports() {
  // If your data truly is session-only, keep session; otherwise local is the usual correct place.
  const data = await chrome.storage.local.get(null); // <-- key change
  console.log(data);
  const onlyReports = {};

  for (const k in data) {
    if (isReportObject(data[k])) onlyReports[k] = data[k];
  }
  return onlyReports;
}

loadAllReports().then((data) => {
  chart = createChart(chartConfig, data);
});

chrome.storage.onChanged.addListener((_changes, namespace) => {
  if (namespace !== "local") return; // <-- matches the storage area above

  loadAllReports().then((data) => {
    if (chart) chart.destroy();
    chart = createChart(chartConfig, data);
  });
});

// changes below -harshit
// ----------------- iframe and image list DOM -----------------
const requestDiv = document.querySelector("#requestDiv");
const siteInfoTemplate = document.querySelector("#site-info-template");

function listSiteInfo(name, notLL, format, notResp) {
  let clone = siteInfoTemplate.content.cloneNode(true);

  let siteName = clone.querySelector(".site-name");
  let siteMore = clone.querySelector(".site-more");
  let siteImageList = clone.querySelector(".site-image-list");
  let siteFormatList = clone.querySelector(".site-format-list");
  let siteRespList = clone.querySelector(".site-responsive-list");
  let listsections = clone.querySelectorAll(".list-sections");

  siteName.innerText = name;
  siteMore.addEventListener("click", (e) => {
    listsections.forEach((z) => {
      z.classList.toggle("list-sections");
    });
    e.currentTarget.classList.toggle("site-more-rotated");
  });

  //Connor Try / Catch
  try {
    notLL.forEach((z) => {
      if (z && z != "") siteImageList.innerHTML += `<li>${z}</li>`;
    });

    format.forEach((z) => {
      if (z && z != "") siteFormatList.innerHTML += `<li>${z}</li>`;
    });

    notResp.forEach((z) => {
      if (z && z != "") siteRespList.innerHTML += `<li>${z}</li>`;
    });

    requestDiv.appendChild(clone);
  } catch (e) {}
}
