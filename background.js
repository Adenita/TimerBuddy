let tabData = {};
let tabDomainMap = {};

getTabDataFromStorage();

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    const currentTime = new Date().getTime();
    chrome.tabs.get(tabId, (tab) => {
        const url = tab.url;
        const domain = extractDomain(url);
        tabDomainMap[tabId] = domain;

        if (!tabData[domain]) {
            tabData[domain] = {
                startTime: currentTime,
                totalTime: 0,
                url: url
            }
            saveTabDataToStorage();
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const domain = tabDomainMap[tabId];
    const currentTabUrl = tab.url;
    const previousTabUrl = tabData[domain] && tabData[domain].url;

    if (currentTabUrl && previousTabUrl && currentTabUrl !== previousTabUrl) {
        const changedDomain = extractDomain(tab.url);
        if (domain === changedDomain) {
            tabData[domain].url = changeInfo.url;
            tabData[domain].startTime = Date.now();
        }
        else {
            tabDomainMap[tabId] = changedDomain;
            if (!tabData[changedDomain]) {
                tabData[changedDomain] = {
                    startTime: Date.now(),
                    totalTime: 0,
                    url: tab.url
                }
                saveTabDataToStorage();
            }
        }
    }
});

function saveTabDataToStorage() {
    chrome.storage.local.set({ 'tabData': tabData }, () => {});
}

function getTabDataFromStorage() {
    chrome.storage.local.get(['tabData'], function(result) {
        tabData = result.tabData || {};
    });
}

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabData[tabId]) {
        delete tabData[tabId];
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabData") {
        sendResponse(tabData);
    }
});

function domainsMatch(url1, url2) {
    return extractDomain(url1) === extractDomain(url2);
}

function extractDomain(url) {
    if (url === "") {
        return "newtab";
    }

    if (url.startsWith('chrome://')) {
        const parts = url.split('/');
        return parts[2] || null;
    }

    const matches = url.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)|^[^:]+/i);
    return matches && matches[1];
}


function updateTotalTime() {
    chrome.tabs.query({ active: true }, activeTabs => {
        if (activeTabs.length === 0) {
            clearInterval(intervalId);
        }

        activeTabs.forEach(tab => {
            const tabDomain = extractDomain(tab.url);
            if (tabData[tabDomain]) {
                tabData[tabDomain].totalTime += 1;
            }
        });
    });
}

intervalId = setInterval(updateTotalTime, 1000);