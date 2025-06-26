import { message } from "antd";

export function copyText(text: string) {
  if (!text) return;

  // 创建一个临时的 textarea 元素
  let tempTextarea = document.createElement('textarea');
  tempTextarea.value = text;
  document.body.appendChild(tempTextarea);

  // 选中 textarea 中的文本
  tempTextarea.select();

  // 使用 Document.execCommand() 方法将文本复制到粘贴板
  document.execCommand('copy');
  // if (success) {
  //   console.log("文本已成功复制到粘贴板");
  // } else {
  //   console.error("无法复制文本到粘贴板");
  // }

  // 删除临时的 textarea 元素
  document.body.removeChild(tempTextarea);
  message.success(`复制成功！`)
}

export function isURLorIP(str: string) {
  // const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/[^\s]*)?$|^(\d{1,3}\.){3}\d{1,3}$/;
  // return regex.test(str);
  return true
}


// 设置数据：传入 key 和 data 对象
export function setStorage(id: string, data: any) {
  if (chrome?.storage?.local === undefined && localStorage) {
    localStorage.setItem(id, JSON.stringify(data));
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ [id]: data }, () => resolve(true));
  });
}

// 获取数据：传入 key，返回对应值
export function getStorage(id: string) {
  if (chrome?.storage?.local === undefined && localStorage) {
    return Promise.resolve(localStorage.get(id));
  }
  return new Promise((resolve) => {
    chrome.storage.local.get(id, (result: any) => {
      resolve(result[id]);
    });
  });
}