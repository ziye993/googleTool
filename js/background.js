chrome.runtime.onInstalled.addListener(function () {
  console.log("demo 已打开");
  chrome.extension.getViews();
});

function getWindow() {
  return chrome.extension.getViews();
}

browser.browserAction.setBadgeText({ text: "1234" });
browser.browserAction.setBadgeBackgroundColor({ color: "red" });

browser.browserAction.onClicked.addListener(() => {
  browser.browserAction.setBadgeBackgroundColor({ color: "green" });
});

