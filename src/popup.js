const urls = {},
    tempUrls = new Set();

function createLists(tabs) {
    const fragment = document.createDocumentFragment();

    tabs.forEach((tab) => {
        const element = document.createElement('li');
        element.classList.add('individual-tab');

        const labelChild = document.createElement('label');
        labelChild.classList.add('tab-label');

        const inputChild = document.createElement('input');
        inputChild.classList.add('tab-input');
        inputChild.type = 'checkbox';
        inputChild.id = tab.id;

        const titleChild = document.createElement('div');
        titleChild.classList.add('tab-title');
        titleChild.textContent = tab.title;

        const urlChild = document.createElement('small');
        urlChild.classList.add('tab-url');
        urlChild.textContent = tab.url;

        labelChild.appendChild(inputChild);
        labelChild.appendChild(titleChild);
        labelChild.appendChild(urlChild);

        element.appendChild(labelChild);

        fragment.appendChild(element);

        urls[tab.id] = { title: tab.title, url: tab.url };
    });

    document.getElementById('tab-group').appendChild(fragment);
}

chrome.tabs.query({ currentWindow: true }, createLists);

function handleSelectedInfo() {
    const tempUrlsSize = tempUrls.size;
    if (tempUrlsSize) {
        const countNode = document.getElementById('selectedCount');
        countNode.classList.remove('selected-count-hide');
        if (tempUrlsSize == 1) {
            countNode.textContent = '1 Tab selected';
        } else {
            countNode.textContent = `${tempUrlsSize} Tabs selected`;
        }
    } else {
        const countNode = document.getElementById('selectedCount');
        countNode.classList.add('selected-count-hide');
    }
}


function handleSelectAll(event) {
    event.stopPropagation();

    const sizeOfTempUrl = tempUrls.size;
    if (sizeOfTempUrl != 0 && sizeOfTempUrl <= Object.keys(urls).length) {
        tempUrls.clear();
        document.getElementById('selectAll').checked = false;

        Object.keys(urls).forEach((id) => {
            document.getElementById(id).checked = false;
        });
    } else {
        Object.keys(urls).forEach((id) => {
            tempUrls.add(id);
            document.getElementById(id).checked = true;
        });
        document.getElementById('selectAll').checked = true;
    }

    handleSelectedInfo();
}

function handleChange(event) {
    event.stopPropagation();

    const { id } = event.target;

    const newId = id;

    if (urls[newId] && tempUrls.has(newId)) {
        tempUrls.delete(newId);
    } else {
        tempUrls.add(newId);
    }

    const sizeOfTempUrl = tempUrls.size;

    if (sizeOfTempUrl == Object.keys(urls).length) {
        document.getElementById('selectAll').checked = true;
        document.getElementById('selectAll').indeterminate = false;
    } else if (sizeOfTempUrl === 0) {
        document.getElementById('selectAll').checked = false;
        document.getElementById('selectAll').indeterminate = false;
    } else {
        document.getElementById('selectAll').indeterminate = true;
    }

    handleSelectedInfo();
}

function download(e) {
    e.preventDefault();

    const newUrls = Array.from(tempUrls);

    let data = '<html><head></head><body>';
    for (let i = 0; i < newUrls.length; i++) {
        const { title } = urls[newUrls[i]];
        const { url } = urls[newUrls[i]];
        data += `<a href="${url}">${title}</a><br/>`;
    }
    data += '</body></html>';

    const blob = new Blob([data], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.download = 'tabs.html';
    a.href = url;
    a.click();
}


window.onload = function () {
    const submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', download);

    document.getElementById('tab-group').addEventListener('change', handleChange);

    document
        .getElementById('selectAll')
        .addEventListener('change', handleSelectAll);
};