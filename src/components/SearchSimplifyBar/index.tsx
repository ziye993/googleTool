import React, { useEffect, useState } from 'react';
import { CloseOutlined, CopyOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import './index.css'
import { Checkbox, Input, message, Switch } from 'antd';
import { isURLorIP } from 'lib/utils';
import { AccordingToLimitCheckBox } from 'components/AccordingToLimitCheckBox';

interface IData {
  open: boolean,
  allChecked: boolean,
  defaultSeachTool: {
    title: string,
    url: string,
    isDefault: boolean,
    config: string[],
    hidden?: boolean,
    boxName: string[],
    edit?: boolean,
    checked?: boolean,
  }[]
};
type IAnyObj = {
  [key: string]: any
}
let defaultData = {
  open: true,
  allChecked: false,
  defaultSeachTool: [
    {
      title: '百度',
      url: 'baidu.com',
      isDefault: true,
      boxName: [],
      config: [],
    }, {
      title: '谷歌',
      url: "google.com",
      isDefault: true,
      config: [],
      boxName: [],
    },
    {
      title: '必应',
      url: "bing.com",
      isDefault: true,
      config: [],
      boxName: ['.b_algo', '.test'],
    },
    {
      title: '360',
      url: "360.com",
      isDefault: true,
      config: [],
      boxName: [],
    },
    {
      title: '搜狗',
      url: "sogou.com",
      isDefault: true,
      config: [],
      boxName: [],
    }
  ]
}
const storageConfigData = localStorage.getItem('defaultSeachTool');

if (storageConfigData) {
  defaultData = JSON.parse(storageConfigData);

}

const BoxName = (props: any) => {
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    }
  }, [isEdit])
  return <span className='seachTitleEdit' onClick={(e) => {
    e.stopPropagation();
    setIsEdit(true);
    console.log(inputRef.current)
    // inputRef.current?.focus();
    return false;
  }}>
    {!isEdit && props.titles.map((item: string, index: number) => {
      return <span className='classSpanName' key={`classSpanName_${index}`}>
        {item}
      </span>
    })}
    {!props.titles.length && <span className='classSpanName'>未设置</span>}
    <input
      className={(isEdit ? '' : 'hideClassBoxInput') + ' input'}
      defaultValue={props.titles.join('/')}
      ref={inputRef}
      onChange={() => { }}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          props.onChange(e.target.value);
          setIsEdit(false)
        }
      }}
      onBlur={() => {
        setIsEdit(false)
      }}
    />
  </span>
}

const SearchSimplifyBar: React.FC = function () {
  const [data, sd] = useState<IData>(defaultData);
  const [actionItem, setActionItem] = useState<number | null>(null)
  const [formData, setFormatData] = useState({ name: '', url: '' });

  const setData = (data: IAnyObj | Function) => {
    if (typeof data === 'function') {
      const newData = data((v: any) => ({ ...v, ...data(v) }))
      sd(v => ({ ...v, ...newData }))
      return
    }
    sd(v => ({ ...v, ...data }))
  }

  const updataFormData = (data: IAnyObj | null) => {
    if (data === null) {
      setFormatData({
        name: '',
        url: ''
      });
      return;
    }
    setFormatData(v => ({ ...v, ...data }))
  }

  const clearItem = (index: number) => {
    const newData = data.defaultSeachTool;
    newData.splice(index, 1);
    setData({
      defaultSeachTool: newData
    });
    save()
  }

  const setAction = (index: number) => {
    // if (!data.defaultSeachTool[index].config.length) return;
    setActionItem(prve => prve === index ? null : index);
  }

  const addkeyWord = (e: any) => {
    // e.preventDefault();
    if (e.keyCode === 13) {
      const newData = data.defaultSeachTool;
      newData[actionItem!].config.push(e.target.value);
      setData({
        defaultSeachTool: newData
      });
      console.log(e)
      e.target.value = '';
      save()
    }
  }

  const addList = () => {
    if (!formData.url) return;
    const ipOrUrl = isURLorIP(formData.url);

    console.log(ipOrUrl)
    if (!ipOrUrl) {
      message.info("请输入正确的url或ip");
      return;
    };
    const newData = data.defaultSeachTool;
    newData.push({
      title: formData.name,
      hidden: false,
      url: formData.url,
      isDefault: false,
      config: [],
      boxName: []
    })
    setData({
      defaultSeachTool: newData
    });
    updataFormData(null);
    save();
  }

  const deleteKeyWord = (cngi: number) => {
    const newData = data.defaultSeachTool;
    newData[actionItem!].config.splice(cngi, 1);
    setData({
      defaultSeachTool: newData
    })
  }

  function save() {
    localStorage.setItem('defaultSeachTool', JSON.stringify(data));
    const storage = chrome?.storage?.local;
    if (storage) {
      
      storage.set({ defaultSeachTool: JSON.stringify(data) })
    }
  }

  const classChange = (value: string, index: number) => {
    const newData = data.defaultSeachTool;
    newData[index].boxName = value.split('/');
    setData({
      defaultSeachTool: newData
    });
  }

  const copyItem = (i: number) => {
    const newData = data.defaultSeachTool;
    const v = newData[i];
    newData.push(v);
    setData({
      defaultSeachTool: newData
    });

  }

  const editItem = (i: number) => {
    const newData = data.defaultSeachTool;
    newData[i].edit = true;
    setData({
      defaultSeachTool: newData
    });
  }

  const saveItem = (e: any, i: number) => {
    if (e.keyCode === 13) {
      const newData = data.defaultSeachTool;
      newData[i].edit = false;
      setData({
        defaultSeachTool: newData
      });
    }

  }

  const urlItemChange = (e: any, index: number) => {
    const newData = data.defaultSeachTool;
    newData[index].url = e.target.value;
    if (e.keyCode === 13) {
      newData[index].edit = false;
    }
    setData({
      defaultSeachTool: newData
    });

  }

  const nameItemChange = (e: any, index: number) => {
    console.log(e)
    const newData = data.defaultSeachTool;
    newData[index].title = e.target.value;
    if (e.keyCode === 13) {
      newData[index].edit = false;
    }
    setData({
      defaultSeachTool: newData
    });
  }

  const checkChange = (index: number, e: any) => {
    e.stopPropagation();
    // e.preventDefault()
    const newData = data.defaultSeachTool;
    newData[index].checked = e.target.checked;
    setData({
      defaultSeachTool: newData
    })
  }

  const changeAll = (e: any) => {

    const newData = data.defaultSeachTool;
    newData.forEach(item => {
      item.checked = e.target.checked;
    })
    setData({
      allChecked: e.target.checked,
      defaultSeachTool: newData
    })
  }

  useEffect(() => {
    save();

  }, [data]);

  const AccordingToLimitCheckBoxValue = data.defaultSeachTool.reduce((pre, item) => {
    if (item.checked) {
      return pre + 1;
    } else {
      return pre;
    }
  }, 0)

  return <div className='seachBox'>
    <div className='seachStatus'>
      <div>
        <AccordingToLimitCheckBox
          onChange={changeAll}
          value={AccordingToLimitCheckBoxValue}
          max={data.defaultSeachTool.length}
          min={0} />
      </div>
      <div>
        开启筛选：
        <Switch checked={data.open} onChange={(value) => { setData((d: any) => ({ ...d, open: value })) }} />
      </div>
    </div>
    {data.defaultSeachTool.map((item, index) => {
      if (item?.hidden && !item.url) {
        return <React.Fragment key={'url' + index} />
      }
      return <div key={'url' + index} className='toolBox'>
        <div
          onClick={() => setAction(index)}
          className='toolBoxName'
        >
          <Checkbox
            className='checkbox_tool'
            onClick={(e) => e.stopPropagation()}
            checked={item.checked}
            onChange={(b) => checkChange(index, b)} />
          <span>
            {
              item.edit
                ? < >
                  名称：<Input className='input' onClick={e => e.stopPropagation()} value={item.title} onKeyDown={(e) => saveItem(e, index)} onChange={(e) => nameItemChange(e, index)} />
                  url: <Input className='input' onClick={e => e.stopPropagation()} value={item.url} onKeyDown={(e) => saveItem(e, index)} onChange={(e) => urlItemChange(e, index)} />
                </>
                : <>{`${item.title || ''}_${item.url}`}</>
            }</span>

          <span> 目标元素：</span> <BoxName
            titles={item?.boxName}
            onChange={(value: string) => classChange(value, index)} />
        </div>
        <CopyOutlined className='copyIcon' onClick={() => copyItem(index)} />
        <EditOutlined className='editIcon' onClick={() => editItem(index)} />
        <CloseOutlined className='closeIcon' onClick={() => { clearItem(index) }} />
        <div className={"urlSet " + (actionItem === index ? "actionUrlSet" : 'hiddenUrlSet')}>
          {item.config.map((cng, cngi) => {
            return <span key={'url_key_' + cngi} className='cngKeyItem'>
              {cng}
              <CloseOutlined onClick={() => deleteKeyWord(cngi)} />
            </span>
          })}
          <input className='input' placeholder='关键字' onKeyDown={addkeyWord} />
        </div>
      </div>
    })}
    <div key={'url_last'} className='toolBoxAdd'>
      <Input className='input' placeholder='名称' onChange={e => updataFormData({ name: e.target.value })} value={formData.name} />
      <Input className='input' placeholder='url' onChange={e => updataFormData({ url: e.target.value })} value={formData.url} />
      <PlusOutlined style={{
        fontSize: '20px',
        lineHeight: '30px',
        color: '#aaa',
        padding: '0 10px 0 10px',
        cursor: 'pointer'
      }} onClick={addList} />
    </div>
  </div >;
};

export default SearchSimplifyBar;