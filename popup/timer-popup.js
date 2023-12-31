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
        displayNoTabsMessage(noTabsMessage, tabsListContainer);
    } else {
        hideNoTabsMessage(noTabsMessage);
        displayTabsList(tabsListContainer, response);
    }
}

function displayNoTabsMessage(noTabsMessage, tabsListContainer) {
    noTabsMessage.style.display = 'block';
    tabsListContainer.style.display = 'none';
}

function hideNoTabsMessage(noTabsMessage) {
    noTabsMessage.style.display = 'none';
}

function displayTabsList(tabsListContainer, response) {
    const titleRow = createTitleRow();
    tabsListContainer.appendChild(titleRow);

    for (const [domain, data] of Object.entries(response)) {
        const listItem = createListItem(domain, data);
        tabsListContainer.appendChild(listItem);
    }
}

function createTitleRow() {
    const titleRow = document.createElement('li');
    titleRow.classList.add('tabs-list-title', 'tabs-list-grid-format');

    ['Active Page', 'Time', '/'].forEach(titleText => {
        const title = createLabel(titleText, 'tabs-title-columns');
        titleRow.appendChild(title);
    });

    return titleRow;
}

function createLabel(text, className) {
    const label = document.createElement('label');
    label.textContent = text;
    label.classList.add(className);
    return label;
}

function createListItem(domain, data) {
    const listItem = document.createElement('li');
    listItem.classList.add('tabs-list-grid-format');

    const headerContainer = createContainer();
    headerContainer.appendChild(createHeader(domain));

    const paragraphContainer = createContainer();
    paragraphContainer.appendChild(createParagraph(formatTime(data.totalTime)));

    const deleteButton = createDeleteButton(() => deleteDomain(domain));

    listItem.appendChild(headerContainer);
    listItem.appendChild(paragraphContainer);
    listItem.appendChild(deleteButton);

    return listItem;
}

function createContainer() {
    const container = document.createElement('div');
    container.classList.add('container');
    return container;
}

function createHeader(text) {
    const header = document.createElement('h3');
    header.style.paddingLeft = '10px';
    header.textContent = text;
    return header;
}

function createParagraph(text) {
    const paragraph = document.createElement('p');
    paragraph.style.fontSize = '1.2em';
    paragraph.style.fontStyle = 'italic';
    paragraph.style.paddingLeft = '10px';
    paragraph.textContent = text;
    return paragraph;
}

function createDeleteButton(clickHandler) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', clickHandler);
    return deleteButton;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

function deleteDomain(domain) {
    chrome.runtime.sendMessage({ action: 'deleteDomain', domain }, () => {});
}
