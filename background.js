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
        }
    })
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabData[tabId] && changeInfo.url) {
        tabData[tabId].url = changeInfo.url;
        tabData[tabId].totalTime = 0;
        tabData[tabId].startTime = Date.now();
    }
});

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

function updateTotalTime() {
    chrome.tabs.query({ active: true }, activeTabs => {
        activeTabs.forEach(tab => {
            const tabId = tab.id;
            if (tabData[tabId]) {
                tabData[tabId].totalTime += 1;
            }
        });

        if (activeTabs.length === 0) {
            clearInterval(intervalId);
        }
    });
}

intervalId = setInterval(updateTotalTime, 1000);