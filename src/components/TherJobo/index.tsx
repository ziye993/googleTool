import React, { useState, useEffect, useRef } from 'react';
import { Checkbox, Input } from 'antd';
import { CloseOutlined, CopyOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import './index.css';

const data = [{
  title: "title",
  content: "content",
  url: "url",
  isEdit: true,
  checked: true,
}]
const addDataDefault = {
  title: '', url: '', isEdit: false, checked: false
}

function TherJobo(): any {
  const [therJoboData, setTherJoboData] = useState<any[]>([]);
  const [isRead, setIsRead] = useState(false);
  const addData = useRef(addDataDefault)
  const update = (item: any, index: number) => {
    setTherJoboData((prev) => {
      const data = [...prev];
      data[index] = item;
      return data
    });
  }

  const add = () => {
    console.log(addData.current.title, addData.current.url)
    if (addData.current.title && addData.current.url) {
      setTherJoboData((prev) => ([...prev, { ...addData.current, content: "", }]))
    }
  }
  const clearItem = (index: number) => {
    setTherJoboData((prev) => {
      const data = [...prev];
      data.splice(index, 1);
      return data
    });
  }

  const save = async () => {
    localStorage.setItem('therJoboData', JSON.stringify(therJoboData));
    const storage = chrome?.storage?.local;
    if (storage) {
      console.log("save", therJoboData)
      await storage.set({ therJoboData: therJoboData });
      (chrome || {})?.storage?.local?.get?.(
        "therJoboData",
        async (res: any) => {
          console.log('therJoboData', res);

        },
      );
    }
  }

  useEffect(() => { if (therJoboData.length) save() }, [therJoboData]);

  useEffect(() => {

    (chrome || {})?.storage?.local?.get?.(
      "therJoboData",
      async (res: any) => {
        console.log('therJoboData', res);
        if (res.therJoboData) {
          try {
            await setTherJoboData(res.therJoboData || []);
            await setIsRead(true);
          } catch (error) {
            console.log(error)
          }

        }

      },
    );
    if (!chrome?.storage?.local) {
      setIsRead(true);
    }
  }, []);

  if (!isRead) {
    return <>准备中</>;
  }

  return (
    <div className="TherJoboBox">
      {
        therJoboData.map((item, index) => {
          if (!item.url || !item.title) {
            return null
          }
          return <div key={"TherJoboBoxItem" + index} className={`TherJoboBoxItem ${item.isEdit ? 'TherJoboBoxItemEdit' : 'TherJoboBoxItemhidden'}`} >
            <p>
              <p onClick={() => { update({ ...item, isEdit: !item.isEdit }, index) }}>
                <Checkbox
                  className='checkbox_tool'
                  onClick={(e) => e.stopPropagation()}
                  checked={item.checked}
                // onChange={(b) => checkChange(index, b)}
                />
                {item.title}( {item.url} )
              </p>
              <CloseOutlined className='closeIcon' onClick={() => { clearItem(index) }} /></p>
            <div className='TherJoboBoxItemContent' >
              <Input.TextArea className='TherJoboBoxItemContentInput' defaultValue={item.content} onBlur={(e) => {
                console.log(e.target.value);
                update({ ...item, content: e.target.value }, index)
              }} />
            </div>
            <button className='TherJoboBoxItemSave' onClick={() => { save() }}>保存</button>
          </div>
        })
      }
      <div className='TherJoboBoxItemAdd'>
        <Input placeholder='名称' onBlur={(e) => { addData.current.title = e.target.value }} />
        <Input placeholder='地址' onBlur={(e) => { addData.current.url = e.target.value }} />
        <PlusOutlined style={{
          fontSize: '20px',
          lineHeight: '30px',
          color: '#aaa',
          padding: '0 10px 0 10px',
          cursor: 'pointer'
        }} onClick={add} />
      </div>
    </div>
  );
}

export default TherJobo;
