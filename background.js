// changes made(global variable for sites)
const MAXSITES = 15;

chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.session.clear();
});
chrome.tabs.onUpdated.addListener((tabId, tab)=> {
    if (tab.status == "complete") {
        chrome.tabs.sendMessage(tabId, {start: true});
    }
});


//////////////////////
async function postData(url = '', data , contentType){
	if(contentType == 'json'){
		var datastringfy = JSON.stringify(data);
		data = datastringfy.replace( /[\r\n]+/gm, "" );
		cType = 'application/json'
	}
	else{
		cType = 'application/x-www-form-urlencoded'
	}
	// Default options are marked with *
	const response = await fetch(url, {
	method: 'POST', // *GET, POST, PUT, DELETE, etc.
	credentials: 'include',
	mode: 'cors',
	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	headers: {
	  'Content-Type': cType,
	  'Access-Control-Allow-Origin':'*'
	},
	referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	body: data // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}
////////////////////////


chrome.runtime.onMessage.addListener(async (request, sender) => {
    // changes made(only store 10 sites data) -harshit
    let data = await chrome.storage.session.get(null), storedAt = 99999999999999999999999, toRemove = null;
    if (Object.keys(data).length >= MAXSITES) {
        for (z in data) {
            if (data[z].storedAt < storedAt) {
                storedAt = data[z].storedAt;
                toRemove = z;
            }
        }

        chrome.storage.session.remove(toRemove);
    }
    
    chrome.storage.session.set({["tab"+sender.tab.id]:request}); 
    chrome.storage.session.get("tab"+sender.tab.id).then(dat => {
        
        if (request.finalScore >= 92){
            var colorString = "#32a852";
            }
        else if (request.finalScore >= 78){
                var colorString = "#8ECA2E";
        }
        else if (request.finalScore >= 67){
                var colorString = "#f4e03a";
        }
        else if (request.finalScore >= 55){
                var colorString = "#F77616";
        }
        else {
                var colorString = "#ff0d21";
        }
        
        chrome.action.setBadgeBackgroundColor({ 
            color: colorString,
            tabId: sender.tab.id
        });
        chrome.action.setBadgeText({
            text: request.finalGrade,
            tabId: sender.tab.id
        });
    });
});

// Clear Cache
chrome.tabs.onRemoved.addListener(tabId => {
    chrome.storage.session.get('tab'+tabId).then(data => {
        delete data['tab' + tabId];
    });
});

chrome.runtime.onInstalled.addListener(function (object) {
    let externalUrl = "https://ko-fi.com/globemallow#paypalModal";

    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: externalUrl }, function (tab) {
            console.log("New tab launched with http://yoursite.com/");
        });
    }
});