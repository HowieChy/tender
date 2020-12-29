import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import React from 'react';
// import logo from '../assets/logo.svg';
import logoPic from '../../src/assets/logo.jpg';

import styles from './UserLayout.less';


const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;

  const {} = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div style={{display:"flex",flexDirection:'column',height:'100vh'}}>
      {/* 头部 */}
      <header className={styles.header}>
        <div>
           <img className={styles.logoLogin} src={logoPic} />
            <span>中标</span>
            <Link className={styles.active} to="/">首页</Link>
            <Link to="/">功能</Link>
            <Link to="/">合作伙伴申请</Link>
            <p><Link to="/user/login">登录</Link></p>
        </div>
      </header>

      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
  
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>

      {/* 底部 */}
      <footer className={styles.footer}>
          <div>
              <Link to="/">网站首页</Link>
              <span>|</span>
              <Link to="/">帮助中心</Link>
              <span>|</span>
              <Link to="/">联系我们</Link>
              <span>|</span>
              <Link to="/">招聘信息</Link>
              <span>|</span>
              <Link to="/">客户服务</Link>
              <span>|</span>
              <Link to="/">隐私政策</Link>
              <span>|</span>
              <Link to="/">广告服务</Link>
              <span>|</span>
              <Link to="/">网站地图</Link>
              <span>|</span>
              <Link to="/">意见反馈</Link>
          </div>
          <p>Copyright © www.QiMao.cn, All Rights Reserved. 投标报价分析测算平台</p>
      </footer>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
