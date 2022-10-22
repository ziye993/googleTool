const config = {
  // 底层库 版本
  manifest_version: 3,
  name: "demo",
  //   应用版本
  version: "1.0.0",
  description: "插件说明",
  //   插件ICON
  icons: {
    18: "image/on.png",
  },
  //   作者
  author: "ziye",
  // 后台代码
  background: {
    script: "src/background.js",
  },
  //   活动状态ICON
  action: {
    default_icon: "image/icon.png",
    default_title: "主题",
    default_popup: "./build/index.html",
  },
  //   单页面运行的JS
  content_scripts: [
    {
      matches: ["<all_urls>"], // 运行在那些页面
      js: ["js/content.js"],
      run_at: "document_idle", // 何时运行
    },
  ],
  // 需要的权限
  permissions: ["tabs", "storage", "unlimitedStorage"],
  //   新tabs页
  chrome_url_overrides: {
    newtab: "html/newtab.html",
  },
  //   页面配置
  web_accessible_resources: [
    {
      resources: ["image/background.png"],
      matches: ["<all_urls>"],
    },
  ],
};
