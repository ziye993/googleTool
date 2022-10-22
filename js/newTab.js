document.getElementById('click').addEventListener('click', function (e) {
  let text = document.getElementById('baiduInput').value;
  window.open(`https://cn.bing.com/search?q=${text}&PC=U316&FORM=CHROMN`);
});
document.getElementById('baiduInput').addEventListener('keypress', function (e) {
  let keyCode = null;
  if (e.which) keyCode = e.which;
  else if(e.keyCode) keyCode = e.keyCode;
  console.log(chrome.runtime.getURL('C:\\Users\\ziye\\Desktop\\100CANON\\IMG_8772.JPG'));
  if(keyCode===13){
    window.open(`https://cn.bing.com/search?q=${e.target.value}&PC=U316&FORM=CHROMN`);
    // window.open('https://www.baidu.com/s?wd=' + e.target.value);
    return false
  }
  return true
})