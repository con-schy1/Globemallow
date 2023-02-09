// changes below -harshit
const AVERAGE = 70;
const MAX = AVERAGE * 2;

const ctx = document.querySelector("#myChart").getContext('2d');

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
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Score, storageData[z].Sustainability));
      
      continue;
    }

    let added = false;
    for (let i=0; i<hosts.length; i++) {
      let y = hosts[i];
      if (storageData[z].storedAt < y.time) {
        let firstHalf = hosts.splice(0, i);
        firstHalf.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Score, storageData[z].Sustainability));
        hosts = firstHalf.concat(hosts);

        added = true;
        break;
      }
    }

    if (!added) {
      hosts.push(new Hosts(storageData[z].storedAt, storageData[z].hostURL, storageData[z].Score, storageData[z].Sustainability))
    }
  }


  const labels = ["Sustainability", "Score"];
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
    datasets: [new Dataset(labels.join(" "), dataTotal)]
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
      
    if (window.location.hash == "#Requests") {
      requestDiv.innerHTML = "";
      for (x in data) {
        listSiteInfo(data[x].hostURL, data[x].imgNotLLArray, data[x].emptySRCArray, data[x].imgNotGoodFormat);
      }
    }
  });
});


// changes below -harshit
// ----------------- iframe and image list DOM -----------------
const requestDiv = document.querySelector("#requestDiv");
const siteInfoTemplate = document.querySelector("#site-info-template");

function listSiteInfo(name, notLL, emptySrc, format) {
  let clone = siteInfoTemplate.content.cloneNode(true);

  let siteName = clone.querySelector(".site-name");
  let siteMore = clone.querySelector(".site-more");
  let siteImageList = clone.querySelector(".site-image-list");
  let siteFrameList = clone.querySelector(".site-frame-list");
  let siteFormatList = clone.querySelector(".site-format-list");
  let listsections = clone.querySelectorAll(".list-sections");

  siteName.innerText = name;
  siteMore.addEventListener('click', e => {
    listsections.forEach(z => {z.classList.toggle("list-sections")});
    e.currentTarget.classList.toggle("site-more-rotated");
  });

//Connor Try / Catch    
//try{
try{
  notLL.forEach(z => {
    if (z && z != "") siteImageList.innerHTML += `<li>${z}</li>`;
  });
}
    catch (e){
        console.log(11);
    }
  emptySrc.forEach(z => {
    if (z && z != "") siteFrameList.innerHTML += `<li>${z}</li>`;
  });
  format.forEach(z => {
    if (z && z != "") siteFormatList.innerHTML += `<li>${z}</li>`;
  });
    
requestDiv.appendChild(clone);
    

    
//}
    //catch(e){
        
    //}

  
}

//Chart Code to display requestDiv and hide chartDiv
window.addEventListener("hashchange", async function() {
  if(location.hash === "#Requests"){
    document.getElementById("chartDiv").style.display = "none";
    document.getElementById("requestDiv").style.display = "block";

    // changes below -harshit
    requestDiv.innerHTML = "";
    await chrome.storage.session.get(null).then(data => {
      for (x in data) {
        listSiteInfo(data[x].hostURL, data[x].imgNotLLArray, data[x].emptySRCArray, data[x].imgNotGoodFormat);
      }
    });
  }else{
    document.getElementById("chartDiv").style.display = "block";
    document.getElementById("requestDiv").style.display = "none";
  }
});