import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Col, Row, Form, Input, Checkbox, DatePicker, Cascader, Select,Tag ,Tooltip } from 'antd';
import styles from './index.less';
import { useHistory ,useParams ,history } from 'umi';
// import options from '../../../utils/cascader-address-options';
import moment from 'moment';
import cascaderOptions, { DivisionUtil } from '@pansy/china-division';
const { Option } = Select;

// console.log('cascaderOptions',cascaderOptions);

import { PlusOutlined } from '@ant-design/icons';

import {EditableTagGroup} from './EditableTagGroup'

import { tendersDetail,dictionaries,editTenders } from '@/services/bid';


export default (props) => {
  //hooks，获取 params 对象。 params 对象为动态路由（例如：/users/:id）里的参数键值对。
  const params = useParams()

  const [tags1, setTags1] = useState([]);
  const [tags2, setTags2] = useState([]);
  const [tags3, setTags3] = useState([]);
  const [door, setDoor] = useState(false);

  const [tender_id, setTender_id] = useState();
  
  //投标详情
  const detail=async(params)=>{
    return await tendersDetail(params.detailId)
  }



  useEffect(async() => {
    console.log('useHistory ',params)
    getDictionaries()
    const result= await detail(params)
    console.log(1226,result);

    if(result.code!=0){
      return false
    }
    localStorage.setItem('num1Val',result.data.selected_adjustment_coefficient);
    localStorage.setItem('num2Val',result.data.selected_compound_coefficient);
    localStorage.setItem('num3Val',result.data.selected_float_coefficient);
    localStorage.setItem('tender_id',result.data.id)
    // localStorage.setItem('step2',JSON.stringify(result.data.result))
    setTender_id(result.data.id);
    var obj=result.data;
    var address=[];
    result.data.bid_open_address.map(item=>{
      address.push(item.id)
    })

    obj={
      name:obj.project_name,
      price:obj.budget_price,
      time:obj.bid_open_time,
      method:obj.bid_evaluation_method_dict_id,
      num1:obj.adjustment_coefficient,
      num2:JSON.parse(obj.compound_coefficient),  
      num3:obj.float_coefficient,  
      person1:obj.project_manager,
      person2:obj.project_general,
      book:obj.tender_preparation,
      proxy:obj.proxy_agent,
      address:address
    }

    console.log(123,obj);

    localStorage.setItem('step1Detail',JSON.stringify(obj))

    if(localStorage.getItem('step1Detail')){
      // form.setFieldsValue({
      //   time:moment("2020-12-23T08:43:33.184Z")
      // });
      var step1=JSON.parse(localStorage.getItem('step1Detail'));
      console.log(step1);
      for(var i in step1){
        // console.log(i, step1[i] );
        var obj=JSON.parse(`{"${i}":"${step1[i]}"}`);
        if(i=='time'){
          form.setFieldsValue({
            time:moment(step1[i] )
          });
        }else if(i=="address"){
          form.setFieldsValue({
            address:step1[i] 
          });
        }else if(i=='num1'){
          console.log('step1[i]',step1[i])
          setTags1(step1[i])
          form.setFieldsValue({
            num1:step1[i]
          });
        }else if(i=='num2'){
     
          setTags2(step1[i])
          form.setFieldsValue({
            num2:step1[i]
          });
        }else if(i=='num3'){
     
          setTags3(step1[i])
          form.setFieldsValue({
            num3:step1[i]
          });
        }else if(i=='method'){
          form.setFieldsValue({
            method:parseInt(step1[i])
          });
        }
        else{
          form.setFieldsValue(obj);
        }
      
      }
  
    }
  }, []);


  //评标办法
  const [evaluation,setEvaluation]=useState([])
  const getDictionaries=async() =>{
    var result =await dictionaries();
    console.log('评标办法',result.data.bid_evaluation_method)
    setEvaluation(result.data.bid_evaluation_method);
  }

  const onFinish = async(values) => {
    console.log('Success:', values);
    console.log(values.time)
    localStorage.setItem('step1Detail',JSON.stringify(values));
    var parmas={
      // project_name:values.name,
      // bid_open_time:moment(values.time).format().split('T')[0]+' '+moment(values.time).format().split('T')[1].split('+')[0],
      // bid_open_address:JSON.stringify(arr),
      // budget_price:values.price,
      // bid_evaluation_method_dict_id:values.method,
      // adjustment_coefficient:JSON.stringify(values.num1),
      // compound_coefficient:JSON.stringify(values.num2),
      // float_coefficient:JSON.stringify(values.num3),
      project_manager:values.person1,
      project_general:values.person2,
      tender_preparation:values.book,
      proxy_agent:values.proxy,
      tender_id:tender_id
    }
    console.log(JSON.stringify(parmas));

    if(door){
      //下一步
      const result=await edit(parmas);
      console.log('编辑',result)
      history.push(`/bid/bidrecord/step2Detail/${params.detailId}`);
    }else{
      const result=await edit(parmas)
      console.log('编辑',result)
      localStorage.removeItem('tender_id');
      history.go(-1)
    }

    // if(door){
    //   history.push('/bid/bidrecord/step2Detail')
    // }
  };

  
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    console.log(errorInfo.values.time, moment(errorInfo.values.time).format());
    localStorage.setItem('step1Detail',JSON.stringify(errorInfo.values));

  

  };


  const [form] = Form.useForm();
  // console.log(form)
  const getNum1=(val)=>{
    console.log('num1',val)
    form.setFieldsValue({ num1: val });
  }
  const getNum2=(val)=>{
    console.log('num2',val)
    form.setFieldsValue({ num2: val });
  }
  const getNum3=(val)=>{
    console.log('num3',val)
    form.setFieldsValue({ num3: val });
  }

    //编辑投标
    const edit=async(val)=>{
      const result=await editTenders(val);
      console.log(result)
      return result
    }
  
  return (
    <>
      <div className={styles.card}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.tip}>项目信息</div>
                <Form.Item
                  label="项目名称"
                  name="name"
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input disabled={true} maxLength={30}/>
                </Form.Item>

                <Form.Item
                  label="开标时间"
                  name="time"
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <DatePicker disabled={true} style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item
                  label="开标地点"
                  name="address"
                  rules={[{ required: true, message: '请选择地点' }]}
                >
                  <Cascader
                    disabled={true}
                    options={cascaderOptions}
                  />
                </Form.Item>

                <Form.Item
                  label="招标预算价"
                  name="price"
                  rules={[{ required: true, message: '请输入招标预算价' }]}
                >
                  <Input disabled={true} prefix="￥" type='number' />
                </Form.Item>

              </div>

            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.tip}>人员设置</div>
                <Form.Item
                  label="项目经理"
                  name="person1"
                  rules={[{ required: true, message: '请输入项目经理' }]}
                >
                  <Input maxLength={10}/>
                </Form.Item>
                <Form.Item
                  label="项目总工"
                  name="person2"
                  rules={[{ required: true, message: '请输入项目总工' }]}
                >
                  <Input maxLength={10}/>
                </Form.Item>
                <Form.Item
                  label="标书制作"
                  name="book"
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input maxLength={10}/>
                </Form.Item>
                <Form.Item
                  label="委托代理"
                  name="proxy"
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input maxLength={10}/>
                </Form.Item>

              </div>

              </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.tip}>评估办法</div>
                <Form.Item
                  label="评估办法"
                  name="method"
                  // initialValue={'0'}
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Select  disabled={true} style={{ width: '100%' }}  >
                    {evaluation.map((item,index)=>
                       <Option key={index} value={item.id}>{item.value}</Option>
                    )}
                 
                  </Select>
                 
                </Form.Item>
                

                <Form.Item
                  label="调整系数"
                  name="num1"
                  rules={[{ required: true, message: '请增加调整系数' }]}
                >
               
                  {/* {!isEdit&&tags1.length>0&&<EditableTagGroup tags={tags1} getChild={getNum1}/>}
                  {!isEdit&&tags1.length==0&&<EditableTagGroup tags={tags1} getChild={getNum1}/>} */}
                    {tags1.map((item,index)=><span style={{border:'1px solid #d9d9d9',padding:'0px 6px',marginRight:10}} key={index}>{item}</span>)}
                </Form.Item>
                <Form.Item
                  label="复合系数"
                  name="num2"
                  rules={[{ required: true, message: '请增加复合系数' }]}
                >
                  {/* {!isEdit&&tags2.length>0&&<EditableTagGroup tags={tags2} getChild={getNum2}/>}
                  {!isEdit&&tags2.length==0&&<EditableTagGroup tags={tags2} getChild={getNum2}/>} */}
                  {tags2.map((item,index)=><span style={{border:'1px solid #d9d9d9',padding:'0px 6px',marginRight:10}} key={index}>{item}</span>)}
                </Form.Item>
                <Form.Item
                  label="下浮系数"
                  name="num3"
                  rules={[{ required: true, message: '请增加下浮系数' }]}
                >
               
                  {/* {!isEdit&&tags3.length>0&&<EditableTagGroup tags={tags3} getChild={getNum3}/>}
                  {!isEdit&&tags3.length==0&&<EditableTagGroup tags={tags3} getChild={getNum3}/>} */}
                  {tags3.map((item,index)=><span style={{border:'1px solid #d9d9d9',padding:'0px 6px',marginRight:10}} key={index}>{item}</span>)}
                </Form.Item>

              </div>

            </Col>
          </Row >
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button onClick={()=>  setDoor(false)} style={{ marginRight: 20 }} type="primary" htmlType="submit">
              暂存
            </Button>
            <Button  htmlType="submit" onClick={() => {
              console.log(form)
              setDoor(true)
              form.validateFields()
             
            }}>下一步</Button>
          </div>
        </Form>
      </div>
      {/* <Button  onClick={()=>go(1)}>下一步</Button> */}


    </>
  );
};
