import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect,useCallback,useMemo } from 'react';
import { Spin ,Button ,Select, message} from 'antd';
import styles from './index.less';
import {history} from 'umi';
import {EditableTable,} from './Step2Table'
import { editTender_quotations } from '@/services/bid';
const { Option } = Select;

export default (props) => {
   const [num1, setNum1] = useState([]);
   const [num1Val, setNum1Val] = useState();
   const [num2, setNum2] = useState([]);
   const [num2Val, setNum2Val] = useState();
   const [num3, setNum3] = useState([]);
   const [num3Val, setNum3Val] = useState();

  const [allData, setallData] = useState([]);

  useEffect(() => {
    const {num1,num2,num3}=JSON.parse(localStorage.getItem('step1'));
    console.log(233,num1,num2,num3);
    var num1Val=localStorage.getItem('num1Val')?localStorage.getItem('num1Val'):num1[0];
    var num2Val=localStorage.getItem('num2Val')?localStorage.getItem('num2Val'):num2[0];
    var num3Val=localStorage.getItem('num3Val')?localStorage.getItem('num3Val'):num3[0];
    // num1Val=num1.includes(num1Val)?num1Val:num1[0];
    // num2Val=num2.includes(num2Val)?num2Val:num2[0];
    // num3Val=num3.includes(num3Val)?num3Val:num3[0];
    setNum1(num1)
    setNum1Val(num1Val)
    setNum2(num2)
    setNum2Val(num2Val)
    setNum3(num3)
    setNum3Val(num3Val);
    const step2=localStorage.getItem('step2');
    if(step2){
      console.log(123,step2)
      setallData(JSON.parse(step2))
    }
  }, []);

  const sum=()=>{
      // console.log(this.child.state)
      console.log(allData)
  } 

  const getData=(val)=>{
    console.log('子组件数据',val)
    setallData(val)
  }

  const edit=async()=>{
    // var quotations=[];
    var quotations=[];
    allData.map(item=>{
      quotations.push({
        bidder:item.name
      })
    })
    var parmas={
      quotations:JSON.stringify(quotations),
      tender_id:localStorage.getItem('tender_id'),
      selected_adjustment_coefficient:num1,
      selected_compound_coefficient:num2,
      selected_float_coefficient:num3
    }
    const result = await editTender_quotations(parmas);
    console.log('编辑结果',result);
    if(result.code==-1){
      message.error(result.message)
    }
    //history.push('/bid/bidrecord');
  }

  // const EditableTable=useMemo(()=>{
  //   <EditableTable   data={getData}/>
  // })
  
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
          {allData.length>0&&  <EditableTable  msg={allData}  data={getData}/>}
          {allData.length==0&&  <EditableTable  msg={allData}  data={getData}/>}
          <div style={{textAlign: 'right'}}>
            <Button  style={{ marginRight: 20 }} onClick={()=>{
              localStorage.setItem('step2',JSON.stringify(allData))
              localStorage.setItem('num1Val',num1Val);
              localStorage.setItem('num2Val',num2Val);
              localStorage.setItem('num3Val',num3Val);
              history.go(-1)
            }}>上一步</Button>
            <Button  style={{ marginRight: 20 }} onClick={sum}>计算</Button>
            <Button  type='primary' onClick={edit}>归档</Button>
          </div>
    </div>
  );
};
