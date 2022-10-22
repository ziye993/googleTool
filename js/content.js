const body = document.getElementsByTagName("html")[0];
var runtime = chrome && chrome.runtime;
var storage = chrome && chrome.storage && chrome.storage.local;

function setTheme(imageUrl, config) {
  console.log(imageUrl);
  const ele = document.getElementById("demo-background");
  if (ele) {
    ele.style.backgroundImage = `url(${imageUrl})`;
    return;
  }
  let newdiv = document.createElement("div");
  let body = document.getElementsByTagName("html")[0];
  let path = imageUrl;
  let urlStr = `url(${path})`;
  newdiv.setAttribute("id", "demo-background");
  newdiv.setAttribute(
    "style",
    `
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: cover;
    max-width:100vw;
    max-height:100vh;
    z-index:-99999;
    filter:blur(0px) opacity(0);
    transition: all 0.5s;
    background-color: rgba(196, 196, 215, 0.5);
  `
  );
  newdiv.style.backgroundImage = urlStr;
  newdiv.style.backgroundSize = "cover";
  body.prepend(newdiv);
  setTimeout(() => {
    newdiv.style.filter = "blur(5px) opacity(0.7)";
  }, 1);
}



// 主题背景图片
storage.get("config", (res) => {
  console.log("asdasdasdasd", res);
 
  if (res?.config?.themeStatus) {
    const path = runtime.getURL("../image/background.png");
    setTheme(path);
  }
});
let imageArr = [];
// 消息
console.log("asdasd");
runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request && request.path) {
    imageArr.push(request.path);
    sendResponse({
      status: true, // 获取id是hello的元素发过去
    });
  } else if (request.end) {
    setTheme(imageArr.join(""), "");
    imageArr = [];
  } else {
    sendResponse({
      status: false, // 获取id是hello的元素发过去
    });
  }
});
