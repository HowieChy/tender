
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Link } from 'umi';
import logoPic from '../../../../src/assets/logo.jpg';
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);
  return (
        <header className={styles.top}>
          <img className={styles.logo} src={logoPic} />
          <Link to="/home">首页</Link>
          <Link to="/user/login">登录</Link>
        </header>
  );
};
