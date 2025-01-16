import React, { useEffect, useState } from 'react';
import { Checkbox, Input, Switch } from 'antd';
import { AccordingToLimitCheckBox } from 'components/AccordingToLimitCheckBox';
import { CloseOutlined, CopyOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import './index.css';
interface IAgentConfigData {
  open: boolean,
  agentList: {
    originUrl: string,
    targetUrl: string,
    isDefault: boolean,
    config: string[],
    hidden?: boolean,
    boxName: string[],
    edit?: boolean,
    checked?: boolean,
  }[];
  allChecked: boolean,
  formData?: {
    originUrl: string,
    targetUrl: string,
  },
  actionIndex: number,
};

let getDefaultData = {
  open: true,
  agentList: [],
  allChecked: false,
  formData: {
    originUrl: '',
    targetUrl: '',
  },
  actionIndex: -1,
}
const data = localStorage.getItem('agentConfigData');
if (data) {
  getDefaultData = JSON.parse(data);
}

const AgentBar: React.FC = function () {
  const [agentConfigData, setAgentConfigData] = useState<IAgentConfigData>(getDefaultData);

  const save = () => {
    localStorage.setItem('agentConfigData', JSON.stringify(agentConfigData));
    const storage = chrome?.storage?.local;
    if (storage) {
      storage.set({ agentConfigData: JSON.stringify(data) });

      chrome?.runtime?.sendMessage?.({ type: "updataRule" }, function (response: any) {
      });


    }
  }

  const changeAll = (e: any) => {
    const newData = agentConfigData.agentList;
    newData.forEach(item => {
      item.checked = e.target.checked;
    })
    setAgentConfigData((prev) => ({
      ...prev,
      allChecked: e.target.checked,
      agentList: newData,
    }))
  }
  const checkChange = (index: number, b: any) => {
    const newData = agentConfigData.agentList;
    newData[index].checked = b.target.checked;
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const copyItem = (index: number) => {
    const newData = agentConfigData.agentList;
    newData[index].checked = !newData[index].checked;
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const editItem = (index: number) => {
    const newData = agentConfigData.agentList;
    newData[index].edit = true;
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const clearItem = (index: number) => {
    const newData = agentConfigData.agentList;
    newData.splice(index, 1);
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const nameItemChange = (e: any, index: number) => {
    const newData = agentConfigData.agentList;
    newData[index].originUrl = e.target.value;
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const urlItemChange = (e: any, index: number) => {
    const newData = agentConfigData.agentList;
    newData[index].targetUrl = e.target.value;
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
    }))
  }
  const saveItem = (e: any, index: number) => {
    if (e.key === 'Enter') {
      const newData = agentConfigData.agentList;
      newData[index].edit = false;
      setAgentConfigData((prev) => ({
        ...prev,
        agentList: newData,
      }))
    }
  }
  const addList = () => {
    const newData = agentConfigData.agentList;
    newData.push({
      originUrl: agentConfigData.formData?.originUrl || '',
      targetUrl: agentConfigData.formData?.targetUrl || '',
      isDefault: true,
      config: [],
      boxName: [],
      edit: false,
      checked: false,
    });
    setAgentConfigData((prev) => ({
      ...prev,
      agentList: newData,
      formData: {
        originUrl: '',
        targetUrl: '',
      },
    }))
  }
  const updataFormData = (data: any) => {
    setAgentConfigData((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...data,
      },
    }))
  }

  useEffect(() => {
    save();
  }, [agentConfigData]);
  const AccordingToLimitCheckBoxValue = agentConfigData.agentList.reduce((pre, item) => {
    if (item.checked) {
      return pre + 1;
    } else {
      return pre;
    }
  }, 0);

  return <div className='agentBox'>
    <div className='agentStatus'>
      <div>
        <AccordingToLimitCheckBox
          onChange={changeAll}
          value={AccordingToLimitCheckBoxValue}
          max={agentConfigData.agentList.length}
          min={0} />
      </div>
      <div>
        开启筛选：
        <Switch checked={agentConfigData.open} onChange={(value) => { setAgentConfigData((d: any) => ({ ...d, open: value })) }} />
      </div>
    </div>
    <div>
      {agentConfigData.agentList.map((item, index) => {
        return <div key={'url' + index} className='agentListBox'>
          <div
            onClick={() => setAgentConfigData(prev => ({ ...prev, actionIndex: prev.actionIndex > -1 ? -1 : index }))}
            className='agentTitleBoxName'
          >
            <Checkbox
              className='checkbox_tool'
              onClick={(e) => e.stopPropagation()}
              checked={item.checked}
              onChange={(b) => checkChange(index, b)}
            />
            <span className='agentTitles'>
              {
                item.edit
                  ? <>
                    将 <Input className='input' onClick={e => e.stopPropagation()} value={item.originUrl} onKeyDown={(e) => saveItem(e, index)} onChange={(e) => nameItemChange(e, index)} />
                    代理到 <Input className='input' onClick={e => e.stopPropagation()} value={item.targetUrl} onKeyDown={(e) => saveItem(e, index)} onChange={(e) => urlItemChange(e, index)} />
                  </>
                  : <>{`将 ${item.originUrl || ''} 代理到 ${item.targetUrl}`}</>
              }</span>

          </div>
          <CopyOutlined className='copyIcon' onClick={() => copyItem(index)} />
          <EditOutlined className='editIcon' onClick={() => editItem(index)} />
          <CloseOutlined className='closeIcon' onClick={() => { clearItem(index) }} />
          <div className={"agentRequestData " + (agentConfigData.actionIndex === index ? "agentShowReqData" : 'hiddenlAgentReqData')}>
            <Input.TextArea className='TextArea' />
          </div>
        </div>
      })}
      <div key={'url_last'} className='agentBoxAdd'>
        <Input className='input' placeholder='代理地址' onChange={e => updataFormData({ originUrl: e.target.value })} value={agentConfigData.formData?.originUrl} />
        <Input className='input' placeholder='目标地址' onChange={e => updataFormData({ targetUrl: e.target.value })} value={agentConfigData.formData?.targetUrl} />
        <PlusOutlined style={{
          fontSize: '20px',
          lineHeight: '30px',
          color: '#aaa',
          padding: '0 10px 0 10px',
          cursor: 'pointer'
        }} onClick={addList} />
      </div>
    </div>
  </div>;
};

export default AgentBar;
