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
import { getFakeCaptcha ,captcha} from '@/services/login';
import styles from './index.less';



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
  console.log(1,intervalRef)
  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  const [captchaVal, setCaptchaVal] = useState('获取验证码');
  const getYam=async()=>{
    // if (!form.getFieldValue('mobile')) {
    //   message.error('请先输入正确手机号');
    //   console.log(form,form.getFieldValue('mobile'))
    //   return false;
    // }
    // if (!form.getFieldValue('yzm')) {
    //   message.error('请先输入正确验证码');
    //   console.log(form.getFieldValue('yzm'))
    //   return false;
    // }
    var num=30;
    const timer=setInterval(()=>{
      setCaptchaVal(`${num--}秒后重新获取`)
    },1000)
    intervalRef.current = timer;
    console.log(2,intervalRef)
  }

  useEffect(async() => {
    // const result = await captcha();
    //console.log(666,result)
    return ()=>clearInterval(intervalRef.current)
  }, []);

  return (
    <div className={styles.main}>
      <ProForm
        // form={ProForm}
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          console.log('账号验证码',values)
          handleSubmit(values);
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
                ]}
              />
              <div style={{marginLeft:20,height:40,fontSize:16,width:120}}>
                <img src=''/>
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
              <Button onClick={getYam} style={{marginLeft:20,height:40,fontSize:16,width:120}}>{captchaVal}</Button>
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
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
