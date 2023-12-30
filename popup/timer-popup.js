document.addEventListener('DOMContentLoaded', function () {
    setInterval(() => {
        chrome.runtime.sendMessage({ action: 'getTabData' }, (response) => {
            updatePopup(response);
        });
    }, 1000);
});

function updatePopup(response) {
    const tabsListContainer = document.getElementById('tabs-list-container');
    const noTabsMessage = document.getElementById('no-tabs-message');

    tabsListContainer.innerHTML = '';

    // Check if the response object is empty (no tabs)
    if (Object.keys(response).length === 0) {
        // display the no tab message
        noTabsMessage.style.display = 'block';
    }
    else {
        // Display the list
        noTabsMessage.style.display = 'none';

        for (const [ tabId, data] of Object.entries(response)) {
            const listItem = document.createElement('li');
            const header = document.createElement('h3');

            const urlText = document.createElement('span');
            urlText.style.fontWeight = 'bold';
            urlText.textContent = 'URL: ';

            const urlValue = document.createElement('span');
            urlValue.style.fontWeight = 'normal';
            urlValue.style.fontStyle = 'italic';
            urlValue.textContent = data.url;

            header.appendChild(urlText);
            header.appendChild(urlValue);
            listItem.appendChild(header);

            const paragraph = document.createElement('p');
            paragraph.style.fontSize = '1.2em';
            paragraph.style.fontStyle = 'italic';
            paragraph.textContent = `Time Elapsed: ${formatTime(data.totalTime)}`;
            listItem.appendChild(paragraph);

            tabsListContainer.appendChild(listItem);
        }
    }
}

/**
 * Format the given time in seconds to a human-readable string.
 * @param {number} milliseconds - The time in milliseconds to be formatted.
 * @returns {string} - The formatted time string (e.g., "1h 30m 15s").
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

