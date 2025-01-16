if (chrome) {
  // const runtime = chrome.runtime;
  // const cTabs = chrome.tabs;
  // chrome.runtime.onMessage.addListener();
  var storage = chrome && chrome.storage && chrome.storage.local;
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "translate") {
      translate(request.query).then(function (response) {
        sendResponse({ success: true, data: response });
      }).catch(function (error) {
        sendResponse({ success: false, error: error.message });
      });
      // 返回 true，表示响应是异步的
      return true;
    }
  });

  async function translate(query) {
    const apiUrl = query;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('API 请求失败');
    }
    const data = await response.json();
    return data;
  }

  let lastRulesIds = [];
  const updataRule = () => {
    chrome.runtime.onInstalled.addListener(() => {
      const rules = [];
      storage.get("agentConfigData", (res) => {
        if (!res.agentConfigData) {
          return
        }
        const agentConfigData = JSON.parse(res.agentConfigData) || {};
        if (!agentConfigData.open) {
          return
        }
        const agentList = agentConfigData.agentList;

        if (!agentList.length) {
          return
        }

        // 格式化规则
        agentList.forEach((item, index) => {
          if (!item.checked) {
            return
          }
          rules.push({
            id: index,
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                url: item.targeturl // 将 def.com/path 替换为 abc.cn/path
              }  
            },
            condition: {
              urlFilter: item.originUrl, // 拦截所有请求
              resourceTypes: ["xhr", "fetch"]
            }
          })
        });
        // 注册规则
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: rules,
          removeRuleIds: lastRulesIds
        });
        lastRulesIds = agentList.map((v, i) => i);
      })
    });  
  }

  updataRule();
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updataRule") {
      updataRule();
      console.log(" 规则更新了")
    }
  });
}