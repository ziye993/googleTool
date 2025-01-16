import React, { useEffect, useState } from 'react';
import { Tabs, Switch } from 'antd';
import ThemeBar from 'components/ThemeBar';
import SearchSimplifyBar from 'components/SearchSimplifyBar';
import ToolContent from 'components/Tool';
import './index.css';
import Translate from 'components/Translate';
import AgentBar from 'components/AgentBar';

const items = [
  { label: '翻译', key: 'translate', children: <Translate /> },
  { label: '搜索精简', key: 'searchSimplify', children: <SearchSimplifyBar /> },
  { label: '二维码转换', key: 'tool', children: <ToolContent /> },
  { label: '主题', key: 'theme', children: <ThemeBar /> },
  { label: '代理', key: 'proxy', children: <AgentBar /> },

] as any[];

const Home: React.FC = function (props) {
  const [isRead, setIsRead] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    (chrome || {})?.storage?.local?.get?.('config', (res: any) => {
      setStatus(res?.config?.status || false);
      setIsRead(true);
    });
    if (!chrome?.storage?.local) {
      setIsRead(true);
    }
  }, []);

  const switchChange = (checked: boolean) => {
    (chrome || {})?.storage?.local?.get?.('config', (res: any = {}) => {
      const config = res.config || {};
      config.status = checked;
      (chrome || {})?.storage?.local?.set?.({ config: config }, () => []);
    });
  };
useEffect(()=>{
  // fetch("https://www.baidu.com/")
},[])

  if (!isRead) {
    return <></>;
  }

  return (
    <>
      <div className='allSwitch'>
        <Switch
          checkedChildren='开'
          unCheckedChildren='关'
          defaultChecked={status}
          onChange={switchChange}
        />
      </div>
      <Tabs items={items} defaultActiveKey='translate' />
    </>
  );
};

export default Home;
