import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin,Carousel,Button } from 'antd';
import styles from './index.less';
import { Link,history } from 'umi';

import { ads} from '@/services/bid';

export default () => {
  const [ad, setAd] = useState([]);
  useEffect(() => {
    getAds();
  }, []);

  const getAds=async()=>{
    var result=await ads();
    console.log('ads',result,result.data.data);
    setAd(result.data.data);
  }
  const contentStyle = {
    height: '460px',
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
  };
  
  const onChange=(val)=>{
    console.log(val)
  };
  const go=()=>{
    console.log(233)
    history.push('/user/login')

  }
  return (
    <PageContainer className={styles.main}>
        <h2>投标报价分析测算， </h2>
        <h2>为您项目中标保驾护航</h2>
        <h3>这是一款投标报价分析软件，可以管理您公司的投标项目，并通过大数据分析帮助您的竞争对手的报价，指导您的报价策略</h3>
        <Button onClick={go} style={{margin:20}} type="danger" size="large">立即登录使用</Button>
        <div className={styles.ad}>
          <Carousel afterChange={onChange}>
            {ad.map((item,index)=>
              <img src={item.image_format} key={index}/>
            )}
          </Carousel>
        </div>
     
        {/* <Spin spinning={loading} size="large" /> */}

    </PageContainer>
  );
};
