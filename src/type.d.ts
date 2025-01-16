declare const chrome = chrome || {}

declare module 'qrcodejs2'

declare module 'js-md5'

declare module 'jsqr'

declare global {
  interface Window {
    [key: string]: any;
  }
}
