import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin,Button,Tabs,Radio,Table } from 'antd';
import { history } from 'umi';
import styles from './index.less';
const { TabPane } = Tabs;
export default () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('0');
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);
  const handleModeChange=(e)=>{
    const mode = e.target.value;
    console.log(mode);
    setMode(mode)
  }
  //表头
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '开标时间',
      dataIndex: 'time',
    },
    {
      title: '开标地点',
      dataIndex: 'address',
    },
    {
      title: '评标方法',
      dataIndex: 'adjustment',
    },
    {
      title: '调整系数',
      dataIndex: 'coefficient',
    },
    {
      title: '复合系数',
      dataIndex: 'complex',
    },
    {
      title: '下浮系数',
      dataIndex: 'float',
    },
    {
      title: '备注标签',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (selectedRowKeys,selectedVal) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys,selectedVal);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //表格数据
  const data=[{
    key: 0,
    name: `项目1`,
    time: '2019-12-01 09:30',
    address: `浙江省宁波市江北区`,
    adjustment:'0.95',
    coefficient:'0.35',
    complex:'0.3',
    float:'1,2,3',
    remark:'2333',
    status:'归档'
  }]
  return (
  
      <div className={styles.bid}>
        <div className={styles.top}>
          <span>全部招投标信息</span>
          <Button onClick={()=>history.push('/bid/bidrecord/step1')} type="primary">新建</Button>
        </div>
        <div className={styles.content}>
        <Radio.Group size={'large'} onChange={handleModeChange} value={mode}  style={{marginTop:20}}>
          <Radio.Button style={{ marginBottom: 8,width:100 ,textAlign: 'center' }} value="0">全部</Radio.Button>
          {/* <Radio.Button value="left">Vertical</Radio.Button> */}
        </Radio.Group>
        {/* 表格 */}
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
        <div>

        </div>
          <Button style={{marginRight:20}}  type="primary">归档</Button>
          <Button  type="danger">删除</Button>
        </div>
        {/* <Spin spinning={loading} size="large" /> */}
      </div>

  );
};
