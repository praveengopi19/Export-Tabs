let urls = {};

let tempUrls = new Set();

function createLists(tabs) {

  let fragment = document.createDocumentFragment();

  tabs.forEach((tab, index) => {

    let element = document.createElement("li");
    let inputChild = document.createElement("input");
    inputChild.classList.add("custom-control-input");
    inputChild.type = "checkbox";
    inputChild.id =  tab.id;

    let labelChild = document.createElement("label");
    labelChild.classList.add("custom-control-label");
    labelChild.htmlFor =  tab.id;
    labelChild.textContent = tab.title;

    element.appendChild(inputChild);
    element.appendChild(labelChild);

    fragment.appendChild(element);

    urls[tab.id] ={ title: tab.title, url: tab.url } 
  });

  document.getElementById("top").appendChild(fragment);
}

chrome.tabs.query({ currentWindow: true }, createLists);

window.onload = function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", download);

  document.getElementById("top").addEventListener("change", handleChange);

  document.getElementById("selectAll").addEventListener("change", handleSelectAll);
};

function handleSelectAll(event){
  event.stopPropagation();


  let sizeOfTempUrl = tempUrls.size
  console.log(sizeOfTempUrl)
  if(sizeOfTempUrl != 0 && sizeOfTempUrl <= Object.keys(urls).length){

    tempUrls.clear()
    document.getElementById("selectAll").checked = false

    Object.keys(urls).forEach((id)=>{
      document.getElementById(id).checked = false
    })

  }else{
    console.log("Fill")
    Object.keys(urls).forEach((id)=>{
      tempUrls.add(id)
      document.getElementById(id).checked = true
    })
    document.getElementById("selectAll").checked = true
  }

}

function handleChange(event) {
  event.stopPropagation();
  
  const {id} = event.target

  let newId = id


  if(urls[newId] && tempUrls.has(newId)){
    tempUrls.delete(newId)
  }else{
    tempUrls.add(newId)
  }

}

function download(e) {
  e.preventDefault();

  let newUrls = Array.from(tempUrls)

  var data = "<html><head></head><body>";
  for (var i = 0; i < newUrls.length; i++) {
    const title = urls[newUrls[i]].title
    const url = urls[newUrls[i]].url
    data += '<a href="' + url + '">' +title + "</a><br/>";
  }
  data += "</body></html>";

  var blob = new Blob([data], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");

  a.download = "tabs.html";
  a.href = url;
  a.click();
}
