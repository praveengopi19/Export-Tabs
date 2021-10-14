let urls = {};

let tempUrls = new Set();

function createLists(tabs) {

  let fragment = document.createDocumentFragment();

  tabs.forEach((tab, index) => {
    let element = document.createElement("li");
    element.classList.add("individual-tab")

    let labelChild = document.createElement("label");
    labelChild.classList.add("tab-label");

    let inputChild = document.createElement("input");
    inputChild.classList.add("tab-input");
    inputChild.type = "checkbox";
    inputChild.id = tab.id;

    let titleChild = document.createElement("div");
    titleChild.classList.add("tab-title");
    titleChild.textContent = tab.title

    let urlChild = document.createElement("small")
    urlChild.classList.add("tab-url")
    urlChild.textContent = tab.url

    // labelChild.htmlFor = tab.id;

    labelChild.appendChild(inputChild);
    labelChild.appendChild(titleChild);
    labelChild.appendChild(urlChild);

    // element.appendChild(inputChild);
    element.appendChild(labelChild);

    fragment.appendChild(element);

    urls[tab.id] = { title: tab.title, url: tab.url };
  });

  document.getElementById("tab-group").appendChild(fragment);
}

chrome.tabs.query({ currentWindow: true }, createLists);

window.onload = function () {
  const form = document.getElementById("submit");

  form.addEventListener("click", download);

  document.getElementById("tab-group").addEventListener("change", handleChange);

  document
    .getElementById("selectAll")
    .addEventListener("change", handleSelectAll);
};

function handleSelectAll(event) {
  event.stopPropagation();

  let sizeOfTempUrl = tempUrls.size;
  console.log(sizeOfTempUrl);
  if (sizeOfTempUrl != 0 && sizeOfTempUrl <= Object.keys(urls).length) {
    tempUrls.clear();
    document.getElementById("selectAll").checked = false;

    Object.keys(urls).forEach((id) => {
      document.getElementById(id).checked = false;
    });
  } else {
    console.log("Fill");
    Object.keys(urls).forEach((id) => {
      tempUrls.add(id);
      document.getElementById(id).checked = true;
    });
    document.getElementById("selectAll").checked = true;
  }

  handleSelectedInfo()
}

function handleSelectedInfo(){
  const tempUrlsSize = tempUrls.size
  if(tempUrlsSize){
    const countNode = document.getElementById("selectedCount")
    countNode.classList.remove("selected-count-hide")
    if(tempUrlsSize==1){
      countNode.textContent = "1 Tab selected"
    }else{
      countNode.textContent = `${tempUrlsSize} Tabs selected`
    }
  }else{
    const countNode = document.getElementById("selectedCount")
    countNode.classList.add("selected-count-hide")
  }
}

function handleChange(event) {
  event.stopPropagation();

  const { id } = event.target;

  let newId = id;

  if (urls[newId] && tempUrls.has(newId)) {
    tempUrls.delete(newId);
  } else {
    tempUrls.add(newId);
  }

  handleSelectedInfo()

}

function download(e) {
  e.preventDefault();

  let newUrls = Array.from(tempUrls);

  var data = "<html><head></head><body>";
  for (var i = 0; i < newUrls.length; i++) {
    const title = urls[newUrls[i]].title;
    const url = urls[newUrls[i]].url;
    data += '<a href="' + url + '">' + title + "</a><br/>";
  }
  data += "</body></html>";

  var blob = new Blob([data], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");

  a.download = "tabs.html";
  a.href = url;
  a.click();
}
