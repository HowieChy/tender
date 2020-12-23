import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin ,Button ,Select} from 'antd';
import styles from './index.less';
import {history} from 'umi';
import {EditableTable} from './Step2Table'

const { Option } = Select;

export default (props) => {
   const [num1, setNum1] = useState([]);
   const [num1Val, setNum1Val] = useState();
   const [num2, setNum2] = useState([]);
   const [num2Val, setNum2Val] = useState();
   const [num3, setNum3] = useState([]);
   const [num3Val, setNum3Val] = useState();
  useEffect(() => {
    const {num1,num2,num3}=JSON.parse(localStorage.getItem('step1'));
    console.log(233,num1,num2,num3)
    setNum1(num1)
    setNum1Val(num1[0])
    setNum2(num2)
    setNum2Val(num2[0])
    setNum3(num3)
    setNum3Val(num3[0])
  }, []);

  const sum=()=>{

  }
  
  return (
    <div className={styles.step2}>
          <div className={styles.top}>
            <span style={{fontSize:20,marginRight:20}}>预估抽球</span>
            <div>
              <span>调整系数</span>
              <Select value={num1Val} style={{ width: '100px' }} onChange={(val)=>setNum1Val(val)} >
                {num1.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
            <div>
              <span>复合系数</span>
              <Select value={num2Val} style={{ width: '100px' }}   onChange={(val)=>setNum2Val(val)}>
                {num2.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
            <div>
              <span>下浮系数</span>
              <Select value={num3Val} style={{ width: '100px' }}  onChange={(val)=>setNum3Val(val)}  >
                {num3.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
          </div>
          <EditableTable/>
          <div style={{textAlign: 'right'}}>
            <Button  style={{ marginRight: 20 }} onClick={()=>history.go(-1)}>上一步</Button>
            <Button  style={{ marginRight: 20 }} onClick={sum}>计算</Button>
            <Button  type='primary' onClick={()=>history.push('/bid/bidrecord')}>归档</Button>
          </div>
    </div>
  );
};
