import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import logoPic from '../assets/logo.jpg';
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);
  return (
    <PageContainer className={styles.main}>
        <header className={styles.top}>
          <img className={styles.logo} src={logoPic} />
          <Link to="/home">首页</Link>
          <Link to="/home">登录</Link>
        </header>

        {/* <Spin spinning={loading} size="large" /> */}

    </PageContainer>
  );
};
