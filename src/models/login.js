import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin ,logoutApi} from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    data:null
  },
  effects: {
    *login({ payload }, { call, put }) {
      console.log('payload',payload)
      const response = yield call(fakeAccountLogin, payload);
      console.log('response',response)


      if (response.code == 0) {

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        }); // Login successfully

        
        const urlParams = new URL(window.location.href);

        const params = getPageQuery();
        message.success('登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/bid/bidrecord';
            return;
          }
        }
        history.replace(redirect || '/bid/bidrecord');
      }else{
        message.error(response.message);
      }
    },

    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      const response = yield call(logoutApi, payload);
      console.log('登出',response)

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        localStorage.clear()
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log('payload',payload)
      setAuthority('admin');
      localStorage.setItem('token',`${payload.data.token.token_type} ${payload.data.token.access_token}`)
      localStorage.setItem('expires_in',new Date().getTime()+payload.data.token.expires_in*1000)
      localStorage.setItem('loginTime',new Date().getTime())
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
