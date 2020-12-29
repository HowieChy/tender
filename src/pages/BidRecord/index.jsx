import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin,Button,Tabs,Radio,Table,Modal,Space } from 'antd';
import { history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
const { TabPane } = Tabs;
const { confirm } = Modal;

import { delInfo ,tenders,dictionaries} from '@/services/bid';


export default () => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('0');
  const [currentNum,setCurrentNum]=useState(1);
  const [data,setData]=useState([])
  useEffect(() => {
    getTenders()

  }, []);

  const [evaluation,setEvaluation]=useState([])
  //获取投标列表
  const getTenders=async() =>{

     var result =await tenders();
      //评标办法
     var result2 =await dictionaries();
     console.log('评标办法',result2.data.bid_evaluation_method)
     console.log('投标列表',result.data.data)

     var arr=[];
    
     if(result.code==0){
      result.data.data.map((item,index)=>{
        arr.push({
          id:item.id,
          key: index,
          name: item.project_name,
          time: item.bid_open_time,
          address: item.bid_open_address[0].name+item.bid_open_address[1].name+item.bid_open_address[2].name,
          adjustment:result2.data.bid_evaluation_method.filter((atem)=>{
            return atem.id==item.bid_evaluation_method_dict_id
          })[0].value,
          coefficient:item.selected_adjustment_coefficient,//选中的调整系数
          complex:item.selected_compound_coefficient,//选中的复合系数
          float:item.selected_float_coefficient,//选中的下浮系数
          remark:'',
          status:item.status==1?'开标记录':'报价测算'
        })
      })
     }
     setData(arr)
     setCurrentNum(localStorage.getItem('current')?Number(localStorage.getItem('current')):1)
     setLoading(false)
     console.log(localStorage.getItem('current'))

  }

  const handleModeChange=(e)=>{
    const mode = e.target.value;
    console.log(mode);
    setMode(mode)
  }
  const go=(val)=>{
    console.log('gogogo',val)
    history.push(`/bid/bidrecord/step1Detail/${val.id}`);
  }
  //表头
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (text, record) =>
      <div style={{color:'#1890ff',cursor:"pointer"}} onClick={go.bind(this,record)}>{record.name}</div>
       
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
  const [selectedVal, setSelectedVal] = useState();
  const onSelectChange = (selectedRowKeys,selectedVal) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys,selectedVal);
    setSelectedVal(selectedVal)
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //表格数据
  // const data=[{
  //   key: 0,
  //   name: `项目1`,
  //   time: '2019-12-01 09:30',
  //   address: `浙江省宁波市江北区`,
  //   adjustment:'0.95',
  //   coefficient:'0.35',
  //   complex:'0.3',
  //   float:'1,2,3',
  //   remark:'2333',
  //   status:'归档'
  // }]

  async function showConfirm() {
    console.log(selectedVal)
    return false
    confirm({
      title: '请问确定删除吗',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        console.log('OK');
        // const result = await query();
        // return new Promise((resolve, reject) => {
        //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        // }).catch(() => console.log('Oops errors!'));
        return query().then((val) =>{
          console.log(val)
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const changeNum=(val)=>{
    console.log('val',val);
    setCurrentNum(val);
    localStorage.setItem('current',val)
  }
  return (
      
      <div className={styles.bid}>
         <Space>
        </Space>
        <div className={styles.top}>
          <span>全部招投标信息</span>
          <Button onClick={()=>{
            localStorage.removeItem('tender_id');
            localStorage.removeItem('step1');
            localStorage.removeItem('step2');
            history.push('/bid/bidrecord/step1')
          }} 
          type="primary">新建</Button>
        </div>
        <div className={styles.content}>
        <Radio.Group size={'large'} onChange={handleModeChange} value={mode}  style={{marginTop:20}}>
          <Radio.Button style={{ marginBottom: 8,width:100 ,textAlign: 'center' }} value="0">全部</Radio.Button>
          {/* <Radio.Button value="left">Vertical</Radio.Button> */}
        </Radio.Group>
        {/* 表格 */}
        <Table  pagination={{
          current:currentNum,
          onChange:changeNum
          }} loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} />
        <div>
     
        </div>
          <Button style={{marginRight:20}}  type="primary">归档</Button>
          <Button onClick={showConfirm} type="danger">删除</Button>
        </div>
       
        {/* <Spin spinning={loading} size="large" /> */}
      </div>

  );
};
