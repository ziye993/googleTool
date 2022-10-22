import React, { useEffect, useState } from "react";
import { Tabs, Switch } from "antd";
import ThemeBar from "components/ThemeBar";
import AgentBar from "components/AgentBar";
import SearchSimplifyBar from "components/SearchSimplifyBar";
import "./index.css";

const items = [
  { label: "主题", key: "theme", children: <ThemeBar /> },
  { label: "代理", key: "proxy", children: <AgentBar /> },
  { label: "搜索精简", key: "searchSimplify", children: <SearchSimplifyBar /> },
] as any[];

const Home: React.FC = function (props) {
  const [isRead, setIsRead] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    (chrome || {})?.storage?.local?.get?.("config", (res: any) => {
      setStatus(res?.config?.status || false);
      setIsRead(true);
    });
  }, []);

  const switchChange = (checked: boolean) => {
    (chrome || {})?.storage?.local?.get?.("config", (res: any = {}) => {
      const config = res.config || {};
      config.status = checked;
      (chrome || {})?.storage?.local?.set?.({ config: config }, () => []);
    });
  };
  if (!isRead) {
    return <></>;
  }

  return (
    <div>
      <div className="allSwitch">
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          defaultChecked={status}
          onChange={switchChange}
        />
      </div>
      <Tabs items={items} />
    </div>
  );
};

export default Home;
