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
        tabsListContainer.style.display = 'none';
    }
    else {
        // Display the list
        noTabsMessage.style.display = 'none';

        const titleRow = document.createElement('li');
        titleRow.classList.add('tabs-list-title', 'tabs-list-grid-format');

        const activeTitle = document.createElement('label');
        activeTitle.textContent = 'Active Page';
        activeTitle.classList.add('tabs-title-columns')
        titleRow.appendChild(activeTitle);

        const timeTitle = document.createElement('label');
        timeTitle.textContent = 'Time';
        timeTitle.classList.add('tabs-title-columns')
        titleRow.appendChild(timeTitle);

        const xTitle = document.createElement('label');
        xTitle.textContent = 'X';
        xTitle.classList.add('tabs-title-columns');
        xTitle.style.paddingLeft = '3px';
        titleRow.appendChild(xTitle);

        tabsListContainer.appendChild(titleRow);

        for (const [ domain, data] of Object.entries(response)) {
            const listItem = document.createElement('li');
            listItem.classList.add('tabs-list-grid-format');

            const headerContainer = document.createElement('div')
            const header = document.createElement('h3');
            header.style.paddingLeft = '10px'
            header.textContent = domain;

            headerContainer.classList.add('container')
            headerContainer.appendChild(header);

            const paragraphContainer = document.createElement('div')
            const paragraph = document.createElement('p');
            paragraph.style.fontSize = '1.2em';
            paragraph.style.fontStyle = 'italic';
            paragraph.style.paddingLeft = '10px'
            paragraph.textContent = `${formatTime(data.totalTime)}`;

            paragraphContainer.classList.add('container')
            paragraphContainer.appendChild(paragraph)

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete-button');

            deleteButton.addEventListener('click', () => {
                deleteDomain(domain)
            });

            listItem.appendChild(headerContainer);
            listItem.appendChild(paragraphContainer);
            listItem.appendChild(deleteButton);

            tabsListContainer.appendChild(listItem);
        }
    }

}

/**
 * Format the given time in seconds to a human-readable string.
 * @param {number} seconds - The time in seconds to be formatted.
 * @returns {string} - The formatted time string (e.g., "1h 30m 15s").
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

/**
 * Make request to backend script to delete tab data for domain.
 * @param {string} domain - the domain to be deleted.
 * @returns void.
 */
function deleteDomain(domain) {
    chrome.runtime.sendMessage({ action: 'deleteDomain', domain }, () => {});
}
