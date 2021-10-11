
let urls = []

function createLists(tabs){

  console.log(tabs[0])
  let fragment = document.createDocumentFragment();

  tabs.forEach((tab, index)=>{
    let element = document.createElement("li")
    let inputChild = document.createElement("input")
    inputChild.classList.add("custom-control-input")
    inputChild.type = "checkbox"
    inputChild.id = "list"+index

    let labelChild = document.createElement("label")
    labelChild.classList.add("custom-control-label")
    labelChild.htmlFor = "list"+index
    labelChild.textContent  = tab.title

    element.appendChild(inputChild)
    element.appendChild(labelChild)

    fragment.appendChild(element)

    urls.push({title: tab.title, url: tab.url})

  })

  document.getElementById("top").appendChild(fragment)

}

chrome.tabs.query({currentWindow:true}, createLists);


window.onload=function(){
  const form = document.getElementById("form")
  form.addEventListener("submit", download)
}

function download(e) {
	e.preventDefault();
	var data = '<html><head></head><body>';
	for (var i = 0; i < urls.length; i++) {
			data+='<a href="'+urls[i].url+'">'+urls[i].title+'</a><br/>';
		}
	data+='</body></html>';

	var blob = new Blob([data], {type: "text/html;charset=utf-8"});
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	
	a.download = "tabs.html";
	a.href = url;
	a.click();

  }



