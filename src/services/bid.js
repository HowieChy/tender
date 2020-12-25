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

//广告轮播
export async function ads() {
  return request('/api/v1/ads?key=slides');
}
// export async function fakeAccountLogin(params) {
//   return request(Lib.url_mc+`/Api/Account/User/AccessToken?${stringify(params)}`);
// }

export async function tenders() {
  return request('/api/v1/tenders');
}


export async function dictionaries() {
  return request('/api/v1/dictionaries');
}

