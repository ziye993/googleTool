import getSign from "./getSign";

declare global {
  interface Window {
    [key: string]: any;
  }
}

function jsonp(param: { [key: string]: any }) {
  const params = new URLSearchParams(param);
  const url = `https://api.fanyi.baidu.com/api/trans/vip/translate?${params.toString()}`;
  return new Promise<void>((resolve, reject) => {
    chrome?.runtime?.sendMessage?.({
      action: "translate",
      query: url
    }, (response: any) => {
      if (response?.success) {
        resolve(response?.data)
      } else {
        resolve()
      }
    });
  })
}


const fanyiBodyFetch = async (api: string, param: any) => {
  let res = null;
  try {
    res = await jsonp(param);
  } catch (error) {
    console.error(error)
  }
  return res;
}

export const getTranlateData = async (data: any, form: string, to: string, userAppid?: string, userKey?: string) => {
  const encoder = new TextEncoder();
  const appid = userAppid || '20231109001875285';
  const q = data;
  const salt = Number(Math.random().toString().split('.')[1]);
  const key = userKey || 'PQVEEvqcU1pdwNAylh3X';
  const str = `${appid}${q}${salt}${key}`;
  const sign = getSign(str);
  const param = {
    q: q,
    // q: encoder.encode(q),
    from: form,
    to,
    appid,
    salt,
    sign
  }
  const tranlateData: any = await fanyiBodyFetch(`translate`, param);
  return tranlateData?.trans_result as any[];
}