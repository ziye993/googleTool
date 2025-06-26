import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Switch } from 'antd';
import './index.css';
import { getStorage, setStorage } from 'lib/utils';


const AgentBar: React.FC = function () {
  const [agentConfigData, setAgentConfigData] = useState();


  return (<div className='agentBar'>
    <Form
      name="agentForm"
      autoComplete="off"
      className='agentForm'
    >
      <div className='agentHead'>
        <Checkbox />  <Switch unCheckedChildren='启用' checkedChildren=""/>
      </div>
    </Form>
  </div>)
};

export default AgentBar;
