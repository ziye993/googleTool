chrome.runtime.onInstalled.addListener(function () {
  console.log("demo 已打开");
  chrome.extension.getViews();
});

function getWindow(){
  return chrome.extension.getViews();
}