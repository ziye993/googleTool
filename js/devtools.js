
/*global chrome*/
if (chrome) {
  chrome.devtools.panels.create("My Panel",
    "../image/icon.png",
    "../html/devtools.html",
    function (panel) {
      // code invoked on panel creation
    }
  );
}
