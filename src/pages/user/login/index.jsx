import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs,Button } from 'antd';
import React, { useState ,useEffect,useRef} from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import { getFakeCaptcha ,captcha,send_sms} from '@/services/login';
import styles from './index.less';
import logo from '../../../assets/logo.jpg';


const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('account');
  const intl = useIntl();
  const [form] = ProForm.useForm();

  const intervalRef = useRef(null);
  // console.log(1,intervalRef)
  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  const [captchaVal, setCaptchaVal] = useState('获取验证码');
  const [door, setDoor] = useState(false);


  //短信验证码
  const getYam=async()=>{
    console.log(form.getFieldValue())
    if (!form.getFieldValue('mobile')) {
      message.error('请先输入正确手机号');
      console.log(form,form.getFieldValue('mobile'))
      return false;
    }
    if (!form.getFieldValue('yzm')) {
      message.error('请先输入验证码');
      console.log(form.getFieldValue('yzm'))
      return false;
    }

    var params={
      captcha_value:form.getFieldValue('yzm'),
      captcha_key:captcha_key,
      mobile:form.getFieldValue('mobile')
    };
    var result = await send_sms(params);
    console.log('短信验证码',result);
    if(result.code==-1){
      message.error(result.message);
      return false;
    }else if(result.code==0){
      message.success(result.message);
    }

    var num=30;
    setCaptchaVal(`${num}秒后获取`);
    setDoor(true);
    const timer=setInterval(()=>{
      setCaptchaVal(`${--num}秒后获取`);
      if(num==0){
        clearInterval(intervalRef.current);
        setCaptchaVal(`获取验证码`)
        setDoor(false);
      }
    },1000);
 
    intervalRef.current = timer;
    console.log(2,intervalRef)
  }
  const [pic, setPic] = useState('');
  const [captcha_key, setCaptcha_key] = useState('');
   //获取图片验证码
  const getPic=async()=>{
    var result = await captcha();
    console.log(666,result)
    setPic(result.data.img)
    setCaptcha_key(result.data.key)
  }
  useEffect(() => {
    getPic()
    return ()=>{
      console.log(13,intervalRef.current)
      clearInterval(intervalRef.current)
    }
  }, []);

  return (
    <div className={styles.logo}>
      <h2>用户登录</h2>
      <div className={styles.content2}>
      <div style={{textAlign: 'center'}}>
        {/* <img style={{width:80}} src={logo}/> */}
      </div>
      <ProForm
        form={form}
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          searchConfig: {
            submitText: '登录',
          },
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
              marginTop: '60px'
            },
          },
        }}
        onFinish={(values) => {
          console.log('账号验证码',values)
          var params={
            code:values.yzmPic,
            mobile:values.mobile
          }
          handleSubmit(params);
          return Promise.resolve();
        }}
      >


        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
  
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileTwoTone className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '手机号是必填项！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '不合法的手机号！',
                },
              ]}
            />
            {/* <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              // captchaTextRender={(timing, count) => {
              //   console.log(timing,count);

              // //   if (!form.getFieldValue('mobile')) {
              // //     message.error('请先输入手机号');
              // //     return;
              // //  }

              //   if (timing) {
              //     return `${count}S获取验证码`;
              //   }

              //   return '获取验证码';
              // }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async (mobile) => {
                
                if (!form.getFieldValue('mobile')) {
                      message.error('请先输入手机号');
                      console.log(mobile)
                      return false;
                }
                console.log('mobile',mobile)
                const result = await getFakeCaptcha(mobile);
                console.log(result)
                if (result === false) {
                  return;
                }

                // message.success('获取验证码成功！验证码为：1234');
              }}
            /> */}
       

            <div className={styles.items} >
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailTwoTone className={styles.prefixIcon} />,
                }}
                name="yzm"
                placeholder={'图片验证码'}
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                  // {
                  //   validator:  ((rule, value) => {
                  //     console.log(rule,value);
                  //     if(value=="1"){
                  //       return Promise.reject('验证码错误');
                  //     }else if(value=='123'){
                  //       return Promise.resolve()
                  //     }else{
                  //       return Promise.reject('验证码是必填项！');
                  //     }
                  //   }),
                  // },
                ]}
              />
              <div style={{marginLeft:20,height:40,fontSize:16,width:120}}>
                <img onClick={getPic} src={pic}/>
              </div>
            </div>
            
            <div className={styles.items} >
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailTwoTone className={styles.prefixIcon} />,
                }}
                name="yzmPic"
                placeholder={'手机验证码'}
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
              />
              <Button type='primary' disabled={door} onClick={getYam} style={{marginLeft:20,height:40,fontSize:14,width:'140px'}}>{captchaVal}</Button>
            </div>
          </>
      
        {/* <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码 ?
          </a>
        </div> */}
      </ProForm>
      {/* <Space className={styles.other}>
        其他登录方式 :
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
      </Space> */}
      </div>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
