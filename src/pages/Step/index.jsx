import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin ,Steps } from 'antd';
import styles from './index.less';
const { Step } = Steps;

import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step1Detail';
import Step4 from './components/Step2Detail';

const getCurrentStepAndComponent = () => {
  console.log(window.location.pathname.split('/')[4]);
  const current=window.location.pathname.split('/')[4];
  switch (current) {
    case 'step1':
      return {
        step: 0,
        component: <Step1 />,
      };

    case 'step2':
      return {
        step: 1,
        component: <Step2 />,
      };

    case 'step1Detail':
      return {
        step: 0,
        component: <Step3 />,
      };
      
    case 'step2Detail':
      return {
        step: 1,
        component: <Step4 />,
      };
 
  }
};

export default () => {
  const [current, setCurrent] = useState(0);
  const [stepComponent, setStepComponent] = useState();
  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent();
    setCurrent(step);
    setStepComponent(component);
    
  }, [current]);
  // const getChild=(value) => { 
  //   console.log(value)
  //   setCurrent(value)
  // }
  return (
    <div style={{backgroundColor:'#fff',padding:20}}>
      <Steps current={current}>
        <Step title="投标信息" />
        <Step title="报价测算" />
        {/* <Step title="开标记录" />
        <Step title="归档" /> */}
      </Steps>
      {stepComponent}
      
    </div>
  );
};
