export async function groupBase64(base64: string, height: number) {
  const allLength = await base64.length;
  const length = Math.ceil(allLength / height);
  const arr: any[] = [];
  for (let i = 0; i < height; i++) {
    const start = i * length;
    const end = i === height ? allLength : (i + 1) * length;
    arr.push(base64.substring(start, end));
  }
  return arr;
}
const cTabs: any = (chrome || {}).tabs;
// 压缩base64
export function compress(base64: string, biobSize: number, callback: (base64: string, config: any) => void) {
  // const length = base64.length;// 处理缩放，转格式
  const _img = new Image();
  _img.src = base64;
  _img.onload = function () {
    const _canvas = document.createElement('canvas');
    const self = this as any;
    const biz = 500 / self.height;
    const w = Math.floor(self.width * biz);
    const h = Math.floor(500);
    _canvas.setAttribute('width', String(w));
    _canvas.setAttribute('height', String(h));
    (_canvas.getContext('2d') as any).drawImage(self, 0, 0, w, h);
    const base = _canvas.toDataURL('image/jpeg');
    callback(base, {width: w, height: h});
  };
}
// 持续消息发收器
export function continuedMessage(id: string | number, strArr: any[], index: number, errorNum?: number) {
  const isEnd = index === strArr.length - 1;
  const param = {path: strArr[index], end: isEnd};
  cTabs.sendMessage(id, param, function (response: any) {
    if (isEnd || (errorNum || 1) > 3) {
      return; 
    }
    if (response.status) {
      continuedMessage(id, strArr, index + 1);
    } else {
      continuedMessage(id, strArr, index, (errorNum || 1) < 2 ? (errorNum || 1) + 1 : 0);
    }
  });
}
// 返回活动窗口对象
export function activeTabs(callback: (tableItem: number | string) => void) {
  cTabs.query({currentWindow: true, active: true}, function (tabs: any) {
    if (tabs.length) {
      callback(tabs[0]);
    }
  });
}
export const switchChange = (checked: boolean) => {
  (chrome || {})?.storage?.local?.get?.('config', (res: any) => {
    const config = res.config || {};
    config.themeStatus = checked;
    (chrome || {})?.storage?.local?.set?.({config: config}, () => []);
  });
};
export const setThemeConfig = (e: any, key: any) => {
  const width = e?.children?.[0]?.children?.[0]?.width;
  const height = e?.children?.[0]?.children?.[0]?.height;
  (chrome || {})?.storage?.local?.get('themeImageConfig', (res: any) => {
    const themeImageConfig = res.themeImageConfig || {};
    themeImageConfig[key] = {width, height};
    (chrome || {})?.storage?.local?.set?.(
      {themeImageConfig: themeImageConfig},
      () => [],
    );
  });
};
export const handUseTheme = (key: string) => {
  activeTabs((tab: any) => {
    (chrome || {})?.storage?.local?.get?.(key, ((ziye_: any) => {
      continuedMessage(tab.id, ziye_[key], 0);
    }));
  });
};
