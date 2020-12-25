import request from '@/utils/request';
import { stringify ,formats} from 'qs';
export async function fakeAccountLogin(params) {
  return request('/api/v1/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}


//图片验证码
export async function captcha() {
  return request(`/api/v1/captcha`);
}

//短信验证码
export async function send_sms(params) {
  return request(`/api/v1/send_sms?${stringify(params)}`);
}


export async function logoutApi() {
  return request(`/api/v1/logout`,{
    method: 'POST',
  });
}