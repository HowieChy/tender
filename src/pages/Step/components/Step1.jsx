import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Button, Card, Col, Row, Form, Input, Checkbox, DatePicker, Cascader, Select,Tag ,Tooltip } from 'antd';
import styles from './index.less';
import { history } from 'umi';
// import options from '../../../utils/cascader-address-options';
import moment from 'moment';
import cascaderOptions, { DivisionUtil } from '@pansy/china-division';
const { Option } = Select;


// console.log('cascaderOptions',cascaderOptions);

import { PlusOutlined } from '@ant-design/icons';

import {EditableTagGroup} from './EditableTagGroup'

export default (props) => {
  const [tags1, setTags1] = useState([]);
  const [tags2, setTags2] = useState([]);
  const [tags3, setTags3] = useState([]);
  useEffect(() => {
    if(localStorage.getItem('step1')){
      // form.setFieldsValue({
      //   time:moment("2020-12-23T08:43:33.184Z")
      // });
      var step1=JSON.parse(localStorage.getItem('step1'));
      console.log(step1);
      for(var i in step1){
        console.log(i, step1[i] );
        var obj=JSON.parse(`{"${i}":"${step1[i]}"}`);
        console.log(666,obj)
        if(i=='time'){
          form.setFieldsValue({
            time:moment("2020-12-23T08:43:33.184Z")
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
        }
        else{
          form.setFieldsValue(obj);
        }
      
      }
  
    }
  }, []);
  // const {go} = props;

  const onFinish = values => {
    console.log('Success:', values);
    console.log(values.time)
    localStorage.setItem('step1',JSON.stringify(values));
  };

  
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    console.log(errorInfo.values.time, moment(errorInfo.values.time).format());
    localStorage.setItem('step1',JSON.stringify(errorInfo.values));
  };


  // function onChange(value, dateString) {
  //   console.log('Selected Time: ', value);
  //   console.log('Formatted Selected Time: ', dateString);
  // }

  // function onOk(value) {
  //   console.log('onOk: ', value);
  // }


  // const getNum1=(val)=>{
  //   console.log('num1',val)
  // }
  // const getNum2=(val)=>{
  //   console.log('num2',val)
  // }
  // const getNum3=(val)=>{
  //   console.log('num3',val)
  // }
  const [form] = Form.useForm();
  console.log(form)
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
                  <Input />
                </Form.Item>

                <Form.Item
                  label="开标时间"
                  name="time"
                  rules={[{ required: true, message: '请选择时间' }]}
                >
                  <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item
                  label="开标地点"
                  name="address"
                  rules={[{ required: true, message: '请选择地点' }]}
                >
                  <Cascader
                    options={cascaderOptions}
                  />
                </Form.Item>

                <Form.Item
                  label="招标预算价"
                  name="price"
                  rules={[{ required: true, message: '请输入招标预算价' }]}
                >
                  <Input prefix="￥" />
                </Form.Item>

              </div>

            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.tip}>人员设置</div>
                <Form.Item
                  label="项目经理"
                  name="person1"
                // rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="项目总工"
                  name="person2"
                // rules={[{ required: true, message: '请输入招标预算价' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="标书制作"
                  name="book"
                // rules={[{ required: true, message: '请输入招标预算价' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="委托代理"
                  name="proxy"
                // rules={[{ required: true, message: '请输入招标预算价' }]}
                >
                  <Input />
                </Form.Item>

              </div>

            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.tip}>评估办法</div>
                <Form.Item
                  label="评估办法"
                  name="method"
                  initialValue={'0'}
                  rules={[{ required: true, message: '请输入项目名称' }]}
                >
                  <Select  style={{ width: '100%' }}  >
                    <Option value="0">综合评价法</Option>
                    {/* <Option value="1">算术平均法</Option>
                    <Option value="2">去高低算术平均法</Option> */}
                  </Select>
                 
                </Form.Item>
                

                <Form.Item
                  label="调整系数"
                  name="num1"
                  rules={[{ required: true, message: '请增加调整系数' }]}
                >
                  {/* <Input disabled={true}/> */}
                  {tags1.length>0&&<EditableTagGroup tags={tags1} getChild={getNum1}/>}
                  {tags1.length==0&&<EditableTagGroup tags={tags1} getChild={getNum1}/>}
                </Form.Item>
                <Form.Item
                  label="复合系数"
                  name="num2"
                  rules={[{ required: true, message: '请增加复合系数' }]}
                >
                    {/* <EditableTagGroup getChild={getNum2}/> */}
                    {tags2.length>0&&<EditableTagGroup tags={tags2} getChild={getNum2}/>}
                  {tags2.length==0&&<EditableTagGroup tags={tags2} getChild={getNum2}/>}
                </Form.Item>
                <Form.Item
                  label="下浮系数"
                  name="num3"
                  rules={[{ required: true, message: '请增加下浮系数' }]}
                >
                  {/* <EditableTagGroup getChild={getNum3}/> */}
                  {tags3.length>0&&<EditableTagGroup tags={tags3} getChild={getNum3}/>}
                  {tags3.length==0&&<EditableTagGroup tags={tags3} getChild={getNum3}/>}
                </Form.Item>

              </div>

            </Col>
          </Row >
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Button style={{ marginRight: 20 }} type="primary" htmlType="submit">
              暂存
                </Button>
            <Button onClick={() => history.push('/bid/bidrecord/step2')}>下一步</Button>
          </div>
        </Form>
      </div>
      {/* <Button  onClick={()=>go(1)}>下一步</Button> */}


    </>
  );
};
