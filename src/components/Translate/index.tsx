import { getTranlateData } from 'lib/service';
// import { copyText } from 'lib/utils';
import React, { useEffect, useState } from 'react';
import { languages } from './languages';
import { Input, Select } from 'antd'
import { copyText } from 'lib/utils';

interface IFormData {
  originStrType: string;
  targetStrType: string;
  appid: string;
  originStr: string;
  res: any[],
  key: string;
}

const Translate: React.FC = function () {


  const [formData, setFormData] = useState<IFormData>({
    originStrType: 'auto',
    targetStrType: 'zh',
    appid: "",
    key: '',
    originStr: '',
    res: [],
  })
  useEffect(() => {
    const data = localStorage.getItem("translatrFormData");
    if (data) {
      setFormData(JSON.parse(data));
    }
  }, [])
  const onKeyDown = async (e: any) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      const text = e.target.value;
      const tData = await getTranlateData(text, formData.originStrType, formData.targetStrType, formData.appid, formData.key);
      if (tData) {
        setFormData(v => {
          localStorage.setItem("translatrFormData", JSON.stringify({
            ...v,
            originStr: text,
            res: tData
          }));
          return { ...v, res: tData }
        });
        return
      }
      setFormData(v => ({ ...v, res: [{ dst: "请求错误！" }] }));
    };
  }

  return (<div className='TranslateBox'>
    <div className='TranslateSet'>
      <span>将</span>
      <Select value={formData.originStrType} className='tsg' onChange={(value) => {
        setFormData(v => ({ ...v, originStrType: value }))
      }}>{
          languages.map((item, index) => {
            return <Select.Option key={item.code}>{item.name}</Select.Option>
          })
        }</Select>
      <span className='tagCenter'>翻译为</span>
      <Select value={formData.targetStrType} className='tsg' onChange={(value) => {
        setFormData(v => ({ ...v, targetStrType: value }))
      }}>{
          languages.filter(item => item.code !== "auto").map((item, index) => {
            return <Select.Option key={item.code}>{item.name}</Select.Option>
          })
        }</Select>
      <span className='appidSpan'>Appid: </span>
      <Input
        className='appidInput'
        placeholder='已有默认值'
        value={formData.appid}
        onChange={(e) => setFormData(d => ({ ...d, appid: e.target.value }))}
      />
      <span className='appidSpan'>key: </span>
      <Input
        className='appidInput'
        placeholder='已有默认值'
        value={formData.key}
        onChange={(e) => setFormData(d => ({ ...d, key: e.target.value }))}
      />
    </div>
    <div className='trResBox'>
      <textarea
        onKeyDown={onKeyDown}
        style={{ width: '400px', height: "150px" }}
        value={formData.originStr}
        onChange={(e) => { setFormData(v => ({ ...v, originStr: e.target.value })); }} />
      <div className='trRes'>
        {formData.res.map((item, index) => {
          return <span key={`res_${index}`} onClick={() => copyText(item.dst)}>{item.dst}</span>
        })}
      </div>
    </div>
  </div>


  )
}
export default Translate;