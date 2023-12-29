// Initialize tabData object to track active tabs
let tabData = {};

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    const currentTime = new Date().getTime();

    chrome.tabs.get(tabId, (tab) => {
        const url = tab.url;
        if (!tabData[tabId]) {
            tabData[tabId] = {
                startTime: currentTime,
                totalTime: 0,
                url: url
            };
        } else {
            const elapsedTime = currentTime - tabData[tabId].startTime;
            tabData[tabId].totalTime += elapsedTime;
            tabData[tabId].startTime = currentTime;
        }
    })
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabData[tabId]) {
        // Remove tabData entry
        delete tabData[tabId];
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTabData") {
        sendResponse(tabData);
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabData[tabId] && changeInfo.url) {
        tabData[tabId].url = changeInfo.url;
        tabData[tabId].startTime = Date.now();
    }
});
