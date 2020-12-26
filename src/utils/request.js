/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification,message } from 'antd';
import {history} from 'umi';
import { stringify } from 'querystring';

const { REACT_APP_ENV } = process.env;

console.log(REACT_APP_ENV)

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix:process.env.API_ENV=='master'?'http://tender.sasvalue.com':null
});

message.config({
  maxCount:1
})
 
// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  // console.log('url',url)
  let c_token = localStorage.getItem("token");
  let expires_in= localStorage.getItem('expires_in');
  
  if (c_token) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': c_token
    };
    //如果是刷新token就跳过不拦截
    if(url==='/api/v1/refresh'||url==='/api/v1/captcha'||url==='v1/send_sms'){
      console.log('刷新token不拦截')
      return (
        {
          url: url,
          options: { ...options, headers: headers },
        }
      );
    }
    const nowTime=new Date().getTime();
    const maxTime=parseInt(localStorage.getItem('expires_in'));
    const loginTime=parseInt(localStorage.getItem('loginTime'))
    // console.log(nowTime,maxTime)
    if(nowTime>=maxTime){
      //token过期，而且延期token也过去了，那么，清空你的数据，直接返回登录，不允许操作了
      message.warning('请重新登录');
      localStorage.clear()
      // history.replace('/user/login');
      // history.replace({
      //   pathname: '/user/login',
      //   search: stringify({
      //     redirect: window.location.href,
      //   }),
      // });
      return;
    }
    if(nowTime>=(loginTime+60*60*24*10*1000)){
       //如果过期了还没请求新token,那就请求新token 记得带上旧token
      request('/api/v1/refresh',{
          method: 'POST',
          data:{}    
      }).then((res)=>{
          console.log('res',res)
          if( res.code == 0 ){
              localStorage.setItem('token',`${res.data.token_type} ${res.data.access_token}`)
              localStorage.setItem('expires_in',new Date().getTime()+res.data.expires_in*1000)
              localStorage.setItem('loginTime',new Date().getTime())
          }else{
            message.warning('请重新登录2')
            localStorage.clear();
            history.replace('/');
          }
      })
      return ({
        url: url,
        options: { ...options, headers: headers },
      });
    }
    return (
      {
        url: url,
        options: { ...options, headers: headers },
      }
    );
  } else {
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'Authorization': c_token
    // };
    return (
      {
        url: url,
        options: { ...options },
      }
    );
  }

})

// response拦截器, 处理response
// request.interceptors.response.use((response, options) => {
//   let token = response.headers.get("token");
//   if (token) {
//     localStorage.setItem("token", token);
//   }
//   return response;
// });


export default request;
