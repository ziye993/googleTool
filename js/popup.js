const getTabsEle = document.getElementsByClassName("getTabs")[0];
const checkFileEle = document.getElementsByClassName("file")[0];
let cTabs = chrome.tabs;

// 获取图片的base64
function getBase64Image(img, width, height, callback) {
  const canvas = document.createElement("canvas");
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL();
  const allLength = dataURL.length;
  const length = Math.ceil(allLength / height);
  let arr = [];
  console.log(length);
  for (let i = 0; i < height; i++) {
    let start = i * length;
    let end = i === height ? allLength : (i + 1) * length;
    arr.push(dataURL.substring(start, end));
  }
  console.log(arr[arr.length - 1].length, length);
  callback(canvas);
  return arr;
}

// 加载新的Images
function loadImage(url, callback) {
  var img = new Image(); //创建一个Image对象，实现图片的预下载
  img.src = url;
  if (img.complete) {
    // 如果图片已经存在于浏览器缓存，直接调用回调函数
    callback(img);
    return; // 直接返回，不用再处理onload事件
  }
  img.onload = function () {
    //图片下载完毕时异步调用callback函数。
    callback(img);
  };
}

// 压缩base64
function compress(
  base64, // 源图片
  rate, // 缩放比例
  callback // 回调
) {
  //处理缩放，转格式
  var _img = new Image();
  _img.src = base64;
  _img.onload = function () {
    var _canvas = document.createElement("canvas");
    var w = this.width / rate;
    var h = this.height / rate;
    _canvas.setAttribute("width", w);
    _canvas.setAttribute("height", h);
    _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
    var base64 = _canvas.toDataURL("image/jpeg");
    _canvas.toBlob(function (blob) {
      if (blob.size > 750 * 1334) {
        //如果还大，继续压缩
        compress(base64, rate, callback);
      } else {
        callback(base64);
      }
    }, "image/jpeg");
  };
}

/**
 *
 * @param {Array} arr 缩放值
 * @param {number} proportion 比例
 * @param {string} zoom 缩/放 'smaller'
 */
function isometriciZoom(arr, proportion) {
  return arr.map((item) => {
    return item * proportion;
  });
}

// 持续消息发收器
function continuedMessage(id, strArr, index, errorNum) {
  const isEnd = index === strArr.length;
  const param = { path: strArr[index], end: isEnd };
  cTabs.sendMessage(id, param, function (response) {
    if (isEnd || errorNum > 2) return;
    if (response.status) {
      continuedMessage(id, strArr, index + 1);
    } else {
      continuedMessage(id, strArr, index, errorNum < 2 ? errorNum + 1 : 0);
    }
  });
}

// 设置图片;
function setImage(srcValue, id, isBase64, callback) {
  const imgBox = document.getElementsByClassName("imagesBox")[0];
  if (isBase64) {
    let num = Math.floor(srcValue.length / 5000000);
    let newImage = new Image();
    if (num < 1) {
      newImage.src = srcValue;
      newImage.onload = () => {
        imgBox.appendChild(newImage);
        callback?.();
      };
    } else {
      compress(srcValue, num, (res) => {
        newImage.src = res;
        newImage.onload = () => {
          imgBox.appendChild(newImage);
          callback?.();
        };
      });
    }
  } else {
    loadImage(srcValue, (res) => {
      const arr = isometriciZoom([res.width, res.height], 300 / res.height);
      let base64 = getBase64Image(res, arr[0], arr[1]);
      let newImage = new Image();
      newImage.src = base64;
      newImage.onload = () => {
        imgBox.appendChild(newImage);
        callback?.();
      };
    });
  }
}

// 返回活动窗口对象
function activeTabs(callback) {
  cTabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs.length) {
      callback(tabs[0]);
    }
  });
}

getTabsEle.addEventListener("click", function (e) {
  activeTabs((res) => {
    const inputEle = document.getElementsByClassName("input")[0];
    const value = inputEle.value;
    setImage(value, res.id, false, () => {});
  });
});

checkFileEle.addEventListener("change", function (e) {
  let file = e.target.files[0];
  let file_reader = new FileReader(file);
  file_reader.readAsDataURL(file);
  file_reader.onload = (res) => {
    activeTabs((tabRes) => {
      setImage(res.target.result, tabRes.id, true, () => {});
    });
  };
});

