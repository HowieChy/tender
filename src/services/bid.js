import request from '@/utils/request';
import { stringify ,formats} from 'qs';
export async function delInfo() {
  return request('/api/users');
}

export async function query() {
  return request('/api/currentUser');
}
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

// export async function fakeAccountLogin(params) {
//   return request(Lib.url_mc+`/Api/Account/User/AccessToken?${stringify(params)}`);
// }
