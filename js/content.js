if (chrome) {
  let body = document.getElementsByTagName("html")[0];
  var runtime = chrome && chrome.runtime;
  var storage = chrome && chrome.storage && chrome.storage.local;

  let imageArr = [];

  function setTheme(imageUrl, config) {
    const ele = document.getElementById("demo-background");
    if (ele) {
      ele.style.backgroundImage = `url(${imageUrl})`;
      return 0;
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
    setTimeout(() => (newdiv.style.filter = "blur(5px) opacity(0.7)"), 1);
    imageArr = [];
  }

  // 主题背景图片
  storage.get("config", (res) => {
    // console.log(res,'res')
    if (res?.config?.themeStatus) {
      const path = runtime.getURL("../image/background.png");
      setTheme(path);
    }
  });
  const isHit = (item, content) => {
    if (item === '*') {
      return true
    }

    if (item[0] === '!') {
      return !content.includes(item.substring(1))
    }
    console.log(item)
    return content.includes(item)
  }

  const clearSeachList = () => storage.get("defaultSeachTool", (res) => {

    if (res?.defaultSeachTool) {
      const defaultSeachToolConfig = JSON.parse(res?.defaultSeachTool);
      console.log(defaultSeachToolConfig)
      if (!defaultSeachToolConfig.open) {
        return
      }
      const defaultSeachTool = defaultSeachToolConfig.defaultSeachTool || [];
      defaultSeachTool.forEach(st => {
        if (!st.checked) {
          return
        }
        const urlIsHit = window.location.href.includes(st.url)  //defaultSeachTool.findIndex(el => window.location.href.includes(el.url));
        if (!urlIsHit) {
          return
        }
        //命中url
        const configItems = st.config || [];
        const boxNames = st.boxName || [];
        if (!configItems.length || !boxNames.length) {
          return
        }
        boxNames.forEach(item => { //命中的所有元素
          const EleList = document.querySelectorAll(item);
          if (!EleList) {
            return
          }
          let index = 0;
          for (const child of EleList) {
            const content = child.textContent.trim();
            const cloneChild = child.cloneNode(true);
            configItems.forEach(configItem => { //需要命中的文本 * 表示所有
              if (!isHit(configItem, content)) {
                return
              }
              // configItem.forEach(item => { //需要命中的文本 * 表示所有
              //若content中包含item或者item为*则隐藏，若item的第一个字符为"!"则表示content中不包含item则隐藏
              const styles = { ...child.style };
              child.style.height = '30px';
              child.style.overflow = 'hidden';
              child.innerHTML = "";
              const newFixDiv = document.createElement("div");
              newFixDiv.innerHTML = "已被隐藏，点击恢复"
              newFixDiv.style.cursor = 'pointer';
              newFixDiv.addEventListener("click", () => {
                child.innerHTML = "";
                child.appendChild(cloneChild);
                child.style = styles;
              });
              child.appendChild(newFixDiv)
              // });
              index++;
              console.log(`已筛选结果:${configItem}`)
            });
          }
        });


      })


    }
  });
  clearSeachList();
  let previousUrl = window.location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== previousUrl) {
      console.log('URL 变化了:', currentUrl);
      previousUrl = currentUrl;
      clearSeachList()
    }
  });

  // 配置 observer 来观察整个页面的 DOM 变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {

  // });
  // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  //   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
  //   return true;
  // });
  // // https://developer.chrome.com/docs/extensions/mv3/messaging/

  // chrome?.bookmarks?.getTree?.(function (bookmarkArray) {
  //   const dataGooglebook = bookmarkArray[0].children[0].children || {};
  //   window.bookList = dataGooglebook;
  // });

};
