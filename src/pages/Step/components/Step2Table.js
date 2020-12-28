import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form ,Switch} from 'antd';
import {
  CloseCircleOutlined,
} from '@ant-design/icons';


const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [oldVal, setOldVal] = useState();
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(async() => {
    if (editing) {
      inputRef.current.focus();
      const values = await form.validateFields();
      setOldVal(values)
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    console.log(dataIndex)
    try {
      
      const values = await form.validateFields();
      console.log(2,oldVal,values,record);
      var isEdit=(JSON.stringify(oldVal)!=JSON.stringify(values));
      console.log(isEdit)
      toggleEdit();
      handleSave({ ...record, ...values ,dataIndex,isEdit});
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        // rules={[
        //   {
        //     required: true,
        //     message: `${title} is required.`,
        //   },
        // ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '',
        dataIndex: 'index',
        width: '2%',
        // render: (text, record) =>
        //   <div style={{backgroundColor:'#ccc'}} >{record.index}</div>
       
      },
      {
        title: '投标人',
        dataIndex: 'name',
        width: '5%',
        // editable: true,
      },
      {
        title: '投标报价',
        dataIndex: 'price',
        width: '5%',
        editable: true,
      },
      {
        title: '手动下浮率',
        dataIndex: 'float',
        width: '5%',
        // editable: true,
      },
      {
        title: '其他得分',
        dataIndex: 'other',
        width: '5%',
        editable: true,
      },
      {
        title: '备注标签',
        dataIndex: 'remark',
        width: '10%',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '3%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <div style={{display: 'flex',alignItems: 'center'}}>
              <Switch checked ={record.has}  onClick={()=>this.change(record)}/>
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.key)}>
                <CloseCircleOutlined  style={{marginLeft:6,fontSize:'22px',color:"red"}}/>
              </Popconfirm>
            </div>
          ) : null,
      },
      {
        title: '球数',
        dataIndex: 'num1',
        width: '4%',
      },
      {
        title: '中标签位',
        dataIndex: 'num2',
        width: '4%',
      },
      {
        title: '区间位置',
        dataIndex: 'num3',
        width: '4%',
      },
      {
        title: '总名次',
        dataIndex: 'num4',
        width: '4%',
      },
      {
        title: '总得分',
        dataIndex: 'num5',
        width: '4%',
        render: (text, record) =>
        <span>{record.num5&&parseFloat(record.num5).toFixed(2)}</span>
      },
      {
        title: '报价名次',
        dataIndex: 'num6',
        width: '4%',
      },
      {
        title: '报价分',
        dataIndex: 'num7',
        width: '4%',
        render: (text, record) =>
        <span>{record.num7&&parseFloat(record.num7).toFixed(2)}</span>
      },
      {
        title: '偏差值',
        dataIndex: 'num8',
        width: '4%',
      },
    ];
    this.state = {
      dataSource: []
      // count: 0,
    };
  }
  change=(val)=>{
    console.log(val);
    const dataSource = [...this.state.dataSource];
    dataSource[val.key].has=false;
    this.setState({
      dataSource: dataSource,
    });
  }
  handleDelete = (key) => {
    console.log(key)
    const dataSource = [...this.state.dataSource];
    console.log(dataSource)
    var arr=dataSource.filter((item) => item.key !== key);
    console.log(arr)
    var newArr=[];
    arr.map((item,index) =>{
      newArr.push({
        ...item,
        key:index,
        index:index+1,
      })
    })
    console.log('newArr',newArr)
    this.setState({
      dataSource: newArr,
    });
  };
  handleAdd = () => {
    const {  dataSource } = this.state;
    const newData = {
      key: dataSource.length,
      index:dataSource.length+1,
      name:`投标人${dataSource.length+1}`,
      has:true
    };
    this.setState({
      dataSource: [...dataSource, newData],
      // count: count + 1,
    });
  };
  handleSave = (row) => {
    console.log(row,!row.isEdit)
    if(!row.isEdit){
      console.log('不用编辑')
      return false
    }
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    // if(!Number.prototype._toFixed) {    Number.prototype._toFixed = Number.prototype.toFixed;}Number.prototype.toFixed =function(n) {return(this + 1e-14)._toFixed(n);};

    //投标预算价
    var budgetPrice=parseFloat(JSON.parse(localStorage.getItem('step1')).price)
    var newArr=[];
    if(row.dataIndex=='price'){
      newData.map(item=>{
        newArr.push({
          ...item, 
          num1:null,
          num2:null,
          num3:null,
          num4:null,
          num5:null,
          num6:null,
          num7:null,
          num8:null,
          float:item.price?((budgetPrice-item.price)/budgetPrice*100).toFixed(3)+'%':null
        })
      })
    }

    if(row.dataIndex=='other'){
      newData.map(item=>{
        newArr.push({
          ...item, 
          num1:null,
          num2:null,
          num3:null,
          num4:null,
          num5:null,
          num6:null,
          num7:null,
          num8:null,
        })
      })
    }


    if(row.dataIndex=='remark'){
      newData.map(item=>{
        newArr.push({
          ...item, 
        })
      })
    }
 
    console.log('编辑后',row,newData,budgetPrice)
    this.setState({
      dataSource: newArr,
    });
  };

  // shouldComponentUpdate=(nextProps,nextState)=>{
  //   console.log(nextState,this.state);
  //   return true;
  // }
  componentDidMount=()=>{
    // console.log(1129,this.props.msg)
    // this.setState({
    //   dataSource:this.props.msg
    // })
    var step2=localStorage.getItem('step2')?JSON.parse(localStorage.getItem('step2')):[];
    this.setState({
      dataSource:step2
    })

    this.props.onRef(this)
  }
  componentDidUpdate=()=>{ 
    console.log('表格数据',this.state.dataSource)

    // var newArr=[];
    // this.state.dataSource.map(item=>{
 
    //   newArr.push({
    //     ...item, 
    //     float:item.price?(budgetPrice-item.price)/budgetPrice/100+'%':null
    //   })
    // })
    // console.log(1130,this.props.msg)
    // this.props.data(this.state.dataSource);
  }
  //计算
  sumAll=()=>{
    console.log('sumAll',this.state.dataSource)

    //A=控制价=投标预算价*调整系数（调整系数由开标的时候随机抽取）
    const A=parseFloat(JSON.parse(localStorage.getItem('step1')).price)*localStorage.getItem('num1Val');
    //K=复合系数=0.3/0.35/0.4(这个由开标的时候随机获取）
    const K=localStorage.getItem('num2Val');
    //i=下浮系数=1,2,3（这个由开标的时候随机获取）
    const i=localStorage.getItem('num3Val');
    console.log('A',A,'k',K,'i',i)
    //B=平均值
    let B;
    var arr=[...this.state.dataSource];
    var numArr=[];
    var num=0;
    var price=0;
     //十个区间
    var intervalArr=[];
    var intervalNumArr=[[],[],[],[],[],[],[],[],[],[]];
    arr.map(item=>{
      num++;
      price+=parseFloat(item.price);
      numArr.push(parseFloat(item.price))
    })
    if(num<=5){
      B=price/num
    }else if(num<=12){
      console.log(numArr);
      numArr.sort((a,b)=>
        a-b
      )
      //去掉最小值
      numArr.shift()
      //去掉最大值
      numArr.pop();
      var price2=0;
      numArr.map(item=>{
        price2+=parseFloat(item);
      })
      B=price2/(num-2)

    }else if(num>12){
      numArr.sort((a,b)=>
        a-b
      )
      console.log('原始值',numArr)
      //去掉最小值
      var minNum=numArr.shift()
      //去掉最大值
      var maxNum=numArr.pop();
      var difference = (numArr[numArr.length-1]-numArr[0])/10;
      console.log('区间值',difference)
     
      for (let j = 0; j < 10; j++) {
        intervalArr.push([numArr[0]+j*difference,numArr[0]+(j+1)*difference])
      }
      
      numArr.map((item,itemIndex)=>{
        intervalArr.map((atem,index)=>{
          if(item>=atem[0]&&item<atem[1]){
            intervalNumArr[index].push(item)
          }
        })
        if(itemIndex==numArr.length-1){
          intervalNumArr[9].push(item)
        }
      })

      var interIndex=0;
      var allInterPrice=0;
      intervalNumArr.map(item=>{
        var interPirce=0;
        if(item.length>0){
          console.log(233,item)
          interIndex++;
          var allPrice=0;
          item.map(atem=>{
            allPrice+=atem
          })
          interPirce=allPrice/item.length;
          allInterPrice+=interPirce
        }
      })
      console.log(allInterPrice,interIndex)
      B=allInterPrice/interIndex;
      console.log('十个区间',intervalArr,intervalNumArr)

    }
    console.log('平均值',num,B);
    const C=A*K+B*(1-K)*(100-i)/100;
    console.log('基准价',C);

    var newTableArr=[];
    //总名次数组
    var num4Arr=[];
    //报价分名次数组
    var num6Arr=[];
    //偏差值
    arr.map(item=>{

      //去掉最小值和最大值的计算
      if(parseFloat(item.price)==minNum||parseFloat(item.price)==maxNum){
        newTableArr.push({
          ...item
        })
        return false
      }
  
      //区间位置
      var num3=1;
      if(intervalArr.length==10){
        intervalArr.map((atem,index)=>{
          if(parseFloat(item.price)>=atem[0]&&parseFloat(item.price)<atem[1]){
            num3=index+1
          }
          if(parseFloat(item.price)==intervalArr[9][1]){
            num3=10
          }
        })
      }
      //偏差值
      var num8=(item.price-C)/C*100;
      //报价分
      var num7=item.price>C?(98-num8*1.2):(98+num8*1.0);
      //总得分
      var num5=num7+(item.other?parseFloat(item.other):0)
      num4Arr.push(num5);
      num6Arr.push(num7)
  
      newTableArr.push({
        ...item,
        //偏差值
        num8:num8.toFixed(2)+'%',
        //报价分
        num7:num7,
        //总得分
        num5:num5,
        //区间位置
        num3:num3
      })
    })
    var newTableArr2=[];
    num4Arr.sort((a,b)=>b-a);
    num6Arr.sort((a,b)=>b-a)
    console.log('num4Arr',num4Arr,num6Arr)
    newTableArr.map(item=>{
      var num4,num6;
      num4Arr.map((atem,index)=>{
        if(atem==parseFloat(item.num5)){
          num4=index+1
        }
      })
      num6Arr.map((atem,index)=>{
        if(atem==parseFloat(item.num7)){
          num6=index+1
        }
      })
      newTableArr2.push({
        ...item,
        num4:num4,
        num6:num6,
      })
    })
    console.log('newTableArr2',newTableArr2)
    this.setState({
      dataSource:newTableArr2
    })
    
    
    localStorage.setItem('step2',JSON.stringify(this.state.dataSource))
  }
  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
   
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          添加一行
        </Button>
      </div>
    );
  }
}
