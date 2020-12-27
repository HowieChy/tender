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
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
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
        editable: true,
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
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  // shouldComponentUpdate=(nextProps,nextState)=>{
  //   console.log(nextState,this.state);
  //   return true;
  // }
  componentDidMount=()=>{
    console.log(1129,this.props.msg)
    this.setState({
      dataSource:this.props.msg
    })
  }
  componentDidUpdate=()=>{ 
    console.log(233333,this.state.dataSource)
    // console.log(1130,this.props.msg)
    this.props.data(this.state.dataSource);
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
        />
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          添加一行
        </Button>
      </div>
    );
  }
}
