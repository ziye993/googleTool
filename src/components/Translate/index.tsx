import { getTranlateData } from 'lib/service';
// import { copyText } from 'lib/utils';
import React, { useEffect, useState } from 'react';
import { languages } from './languages';
import { Checkbox, Input, Select } from 'antd'
import { copyText } from 'lib/utils';

interface IFormData {
  originStrType: string;
  targetStrType: string;
  appid: string;
  originStr: string;
  res: any,
  key: string;
  underline?: boolean,
  hump?: boolean;
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
      const tData = await getTranlateData(text, formData.originStrType, formData.targetStrType, formData.appid, formData.key);// 目标
      const zhData = formData.targetStrType !== 'zh' ? await getTranlateData(text, formData.originStrType, "zh", formData.appid, formData.key) : null;//中
      const enData = formData.targetStrType !== 'en' ? await getTranlateData(text, formData.originStrType, "en", formData.appid, formData.key) : null;//英
      const resData: any = {
        tData,
        enData,
        zhData,
        error: null,
      }

      if (tData) {
        setFormData(v => {
          localStorage.setItem("translatrFormData", JSON.stringify({
            ...v,
            originStr: text,
            res: resData
          }));
          return { ...v, res: resData }
        });
        return
      }
      setFormData(v => ({ ...v, res: { error: '请求失败' } }));
    };
  }

  const uniRegest = /\s+/g;
  const humpRegest = /\s+([a-z])/gi;

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
      <div className='trsCode'>
        <textarea
          onKeyDown={onKeyDown}
          style={{ width: '400px', height: "150px" }}
          value={formData.originStr}
          onChange={(e) => { setFormData(v => ({ ...v, originStr: e.target.value })); }}
        />
        <div style={{ margin: '0 0 0 20px', maxWidth: '350px', minWidth: '300px' }}>
          <span style={{ fontWeight: 700, marginBottom: '0px' }}>代码{`(如果已设置)`}：
          </span>
          <div className='codebox'>
            <div className='code_underline'>
              <p><Checkbox style={{ fontWeight: 100, margin: '0 0px 0 10px' }} checked={formData.underline} onChange={(value) => setFormData(_ => ({ ..._, underline: value.target.checked }))} />下划线连接</p>
              {formData.underline && formData?.res?.tData?.map((item: any, index: number) => {
                const copy = item.dst.toLowerCase().replace(uniRegest, "_")
                return <p key={`res_${index}`} className='trspan' onClick={() => copyText(copy)}>{copy}</p>
              })}
            </div>
            <div className='code_hump'>
              <p> <Checkbox style={{ fontWeight: 100, margin: '0 0px 0 10px' }} checked={formData.hump} onChange={(value) => setFormData(_ => ({ ..._, hump: value.target.checked }))} />驼峰连接</p>
              {formData.hump && formData?.res?.tData?.map((item: any, index: number) => {
                const copy = item.dst.toLowerCase().replace(humpRegest, (_: any, c: any) => c.toUpperCase());
                return <p key={`res_${index}`} className='trspan' onClick={() => copyText(copy)}>{copy}</p>
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='trRes'>

        <div className='trRes_item'>
          <span style={{ fontWeight: 700, }}>目标语言{`(如果已设置)`}：</span>
          {formData?.res?.tData?.map((item: any, index: number) => {
            return <span key={`res_${index}`} className='trspan' onClick={() => copyText(item.dst)}>{item.dst}</span>
          })}
          <span>{formData?.res?.error || ''}</span>
        </div>
        <div className='trRes_item'>
          <span style={{ fontWeight: 700 }}>中：</span>
          {formData?.res?.zhData?.map((item: any, index: number) => {
            return <span key={`res_${index}`} className='trspan' onClick={() => copyText(item.dst)}>{item.dst}</span>
          })}
        </div>
        <div className='trRes_item'>
          <span style={{ fontWeight: 700, }}>英：</span>
          {formData?.res?.enData?.map((item: any, index: number) => {
            return <span key={`res_${index}`} className='trspan' onClick={() => copyText(item.dst)}>{item.dst}</span>
          })}
        </div>

      </div>
    </div>
  </div>


  )
}
export default Translate;