import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcodejs2';
import { Input } from 'antd';
import jsQR from "jsqr";
import { copyText } from 'lib/utils';

// function isValidBase64String(str: string) {
//   try {
//     return btoa(atob(str)) === str;
//   } catch (error) {
//     return false;
//   }
// }


const ToolContent: React.FC = function () {
  const qrCodeRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [resInfo, setResInfo] = useState("")
  useEffect(() => {
    const url = localStorage.getItem("qrcodeUrl");
    setInputValue(url || '');
    function pasteQrcode(e: any) {
      let items = (e.clipboardData || e?.originalEvent?.clipboardData)?.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          let blob = items[i].getAsFile();
          let reader = new FileReader();
          reader.onload = function (event) {
            const base64String = event?.target?.result as string;
            const img = new Image();
            img.src = base64String;
            img.onload = () => {
              // 创建一个 canvas 元素
              let canvas: HTMLCanvasElement = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              let context = canvas.getContext('2d');
              // 在 canvas 上绘制图像
              context?.drawImage(img, 0, 0);
              // 获取图像数据
              let imageData = context?.getImageData?.(0, 0, canvas.width, canvas.height);
              let qrCode: any = "";
              if (imageData?.data) {
                qrCode = jsQR(imageData?.data, imageData.width, imageData.height);
              }
              // 检查是否成功解码二维码
              if (qrCode) {
                renderQrcode(qrCode.data);
                setInputValue(qrCode.data);
                copyText(qrCode.data);
              } else {
                setResInfo("无法解码二维码")
              }
            };
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    }
    document.addEventListener('paste', pasteQrcode);
    return () => { document.removeEventListener('paste', pasteQrcode) };
  }, []);

  const renderQrcode = (value: string) => {
    if (!value) {
      return
    }
    if (qrCodeRef.current) {
      qrCodeRef.current.makeCode(value);
    } else {
      try {
        qrCodeRef.current = new QRCode(document.getElementById('qrcode') as HTMLElement, {
          text: value,
          width: 256,
          height: 256,
        });
        localStorage.setItem("qrcodeUrl", value);
      } catch (error) {
        setResInfo("二维码生成失败");
      }

    }
  }

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) { // 按下的是回车键
      renderQrcode(e.target.value)
    }
  }
  return (
    <div id='p'>
      <div className='qrcodeTrslate'><span>url:</span> <Input onKeyDown={onKeyDown} value={inputValue} onChange={(e: any) => { setInputValue(e.target.value) }} /></div>
      {resInfo && <div><span style={{ color: 'red' }}>{resInfo}</span></div>}
      <div id='qrcode' style={{ marginTop: '30px' }}></div>
    </div>
  )
}
export default ToolContent;