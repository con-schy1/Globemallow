// changes below -harshit
const AVERAGE = 70;
const MAX = AVERAGE * 2;

const ctx = document.querySelector("#myChart").getContext('2d');

let hosts = [];
class Hosts {
  constructor(time, url, finalScore, iframes) {
    this.time = time;
    this.url = url;
    this.finalScore = finalScore;
    this.iframes = 0;
  }
}
class Dataset {
  constructor(label, data) {
    this.base = AVERAGE;
    this.label = label;
    this.data = data;//hosts.map(z => z[label]);
    this.backgroundColor = (context) => {
      const index = context.dataIndex;
      const value = context.dataset.data[index];
      return value < this.base ? 'rgba(200, 0, 0, 0.6)' : 'rgba(0, 200, 0, 0.6)'
    };
    this.borderColor = this.backgroundColor;
    this.borderWidth = 2;
    this.borderRadius = 5;
    this.borderSkipped = false;
    this.fill= {
      target: AVERAGE,
      above: "green",
      below: "red"
    }
  }
}

function chartConfig(storageData) {
  hosts.length = 0;
  for (z in storageData) {
    if (!hosts.length) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].finalScore, storageData[z].iFrames));
      
      continue;
    }

    let added = false;
    for (let i=0; i<hosts.length; i++) {
      let y = hosts[i];
      if (storageData[z].storedAt < y.time) {
        let firstHalf = hosts.splice(0, i);
        firstHalf.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].finalScore, storageData[z].iFrames));
        hosts = firstHalf.concat(hosts);

        added = true;
        break;
      }
    }

    if (!added) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].finalScore, storageData[z].iFrames))
    }
  }


  const labels = ["iframes", "finalScore"];
  const dataTotal = [];
  hosts.forEach(z => {
    let temp = 0;
    let tempLabel = "";
    labels.forEach(y => {
      temp += z[y];
    });
    dataTotal.push(temp);
  });

  const data = {
    labels: hosts.map(z => z.url),
    datasets: [new Dataset(labels.join(" & "), dataTotal)]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: false,
          text: 'Chart.js Bar Chart'
        }
      },
      scales: {
        x: {
        },
        y: {
          min: 30,
          max: 100,
          ticks: {
            stepSize: 5,
          }
        }
      }
    },
  };

  return config;
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
chrome.storage.session.get(null).then(data => {
  chart = createChart(chartConfig, data);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  chrome.storage.session.get(null).then(data => {
    chart.destroy();
    chart = createChart(chartConfig, data);
  });
});

