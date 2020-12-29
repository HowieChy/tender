import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect,useCallback,useMemo,useRef } from 'react';
import { Spin ,Button ,Select, message} from 'antd';
import styles from './index.less';
import {history,useParams} from 'umi';
import {EditableTable,} from './Step2Table'
import { editTender_quotations,tender_quotations } from '@/services/bid';
const { Option } = Select;

export default (props) => {
  const params = useParams()

   const [num1, setNum1] = useState([]);
   const [num1Val, setNum1Val] = useState();
   const [num2, setNum2] = useState([]);
   const [num2Val, setNum2Val] = useState();
   const [num3, setNum3] = useState([]);
   const [num3Val, setNum3Val] = useState();

  useEffect(() => {
    getDetail()
  }, []);

  //获取数据
  const getDetail=async()=>{
    // localStorage.setItem('tender_id',params.detailId)
    // const result = await tender_quotations(params.detailId);
    // console.log('获取数据',result)
    const {num1,num2,num3}=JSON.parse(localStorage.getItem('step1'));
    console.log(233,num1,num2,num3);
    var num1Val=localStorage.getItem('num1Val')?localStorage.getItem('num1Val'):num1[0];
    var num2Val=localStorage.getItem('num2Val')?localStorage.getItem('num2Val'):num2[0];
    var num3Val=localStorage.getItem('num3Val')?localStorage.getItem('num3Val'):num3[0];
    setNum1(num1)
    setNum1Val(num1Val)
    setNum2(num2)
    setNum2Val(num2Val)
    setNum3(num3)
    setNum3Val(num3Val);
    localStorage.setItem('num1Val',num1Val);
    localStorage.setItem('num2Val',num2Val);
    localStorage.setItem('num3Val',num3Val);
 
  }

  const sum=()=>{
      // console.log(this.child.state)
 
      childRef.current.sumAll()
  } 

  // const getData=(val)=>{
  //   console.log('子组件数据',val)
  //   var newArr=[];
  //   val.map((item=>{
  //     newArr.push({
  //       ...item, 
  //       name:1
  //     })
  //   }))

  // }

  const edit=async()=>{
    // var quotations=[];
    var quotations=[];
    var info=JSON.parse(localStorage.getItem('step2'))

    info.map(item=>{
      if(!item.has){
        return false
      }
      quotations.push({
        // ...item,
        bidder:item.name,
        quotation:item.price,
        manual_float_rate:parseFloat(item.float)+'',//手动下浮率%
        other_score:item.other,
        remark:item.remark
      })
    })
    console.log('quotations',quotations)
    var parmas={
      quotations:JSON.stringify(quotations),
      tender_id:localStorage.getItem('tender_id'),
      selected_adjustment_coefficient:num1Val,
      selected_compound_coefficient:num2Val,
      selected_float_coefficient:num3Val,
      result:JSON.stringify(info)
    }
    const result = await editTender_quotations(parmas);
    console.log('编辑结果',result);
    if(result.code==-1){
      message.error(result.message)
    }
    if(result.code==0){
      message.success(result.message)
      history.push('/bid/bidrecord');
    }
 
  }

  // const EditableTable=useMemo(()=>{
  //   <EditableTable   data={getData}/>
  // })

  const childRef = useRef();
  // console.log(childRef.current.sumAll(99);)

  const onRef=useCallback((ref)=>{
    console.log('ref',ref)
    childRef.current=ref;
  },[])



  // const onRef=(ref)=>{
  //   console.log(ref)
  //   childRef.current=ref;
  // }
  return (
    <div className={styles.step2}>
          <div className={styles.top}>
            <span style={{fontSize:20,marginRight:20}}>预估抽球</span>
            <div>
              <span>调整系数</span>
              <Select value={num1Val} style={{ width: '100px' }} onChange={(val)=>{
              setNum1Val(val)
              localStorage.setItem('num1Val',val);
              sum()
              
              }} >
                {num1.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
            <div>
              <span>复合系数</span>
              <Select value={num2Val} style={{ width: '100px' }}   onChange={(val)=>{
                setNum2Val(val)
                localStorage.setItem('num2Val',val);
                sum()
              }}>
                {num2.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
            <div>
              <span>下浮系数</span>
              <Select value={num3Val} style={{ width: '100px' }}  onChange={(val)=>{
                setNum3Val(val)
                localStorage.setItem('num3Val',val);
                sum()
              }}  >
                {num3.map(item=>
                  <Option key={item} value={item}>{item}</Option>
                )}
              </Select>
            </div>
          </div>
   
          <EditableTable onRef={onRef}  />
          <div style={{textAlign: 'right'}}>
            <Button  style={{ marginRight: 20 }} onClick={()=>{
              localStorage.setItem('stepEdit',true);
              history.push({
                pathname: `/bid/bidrecord/step1Detail/${params.detailId}`,
                query: {
                  isFrom: true,
                }})
            }}>上一步</Button>
            <Button  style={{ marginRight: 20 }} onClick={sum}>计算</Button>
            <Button  type='primary' onClick={edit}>归档</Button>
          </div>
    </div>
  );
};
