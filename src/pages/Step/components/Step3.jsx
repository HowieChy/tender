import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin ,Button } from 'antd';
import styles from './index.less';
import {history} from 'umi';



export default (props) => {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 300);
  // }, []);
  const {go} = props;
  
  return (
    <div>
      <Button  onClick={()=>history.push('/bid/bidrecord/step4')}>下一步</Button>
    </div>
  );
};
