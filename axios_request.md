```typescript
import { AxiosStatic, AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from '@ohos/axios'
import axios from '@ohos/axios'
import Storage from '../utils/localStorage'
import hilog from '@ohos.hilog'

const TAG = 'request'

// 本案例使用网易云API测试

const request: AxiosInstance = axios.create({
  baseURL: 'https://service-0d24xesq-1301866298.gz.apigw.tencentcs.com/release/',
  timeout: 3000
})

let localStorage = new Storage();

// 请求拦截器
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  hilog.info(0x00, `${TAG}`, 'axios request interceptors,url:', config.url, ',params:', config.params, ',data:', config.data, ',method:', config.method);
  let token = await localStorage.getToken();
  hilog.info(0x00, `${TAG}`, 'axios request token', token.toString());
  // 所有接口添加时间戳，避免部分获取到缓存数据
  let timerstamp = new Date().getTime();
  switch (config.method!.toLocaleLowerCase()) {
    case 'get': {
      if (config.params) {
        config.params.timerstamp = timerstamp;
      } else {
        config.params = { timerstamp: timerstamp };
      }
      // 请求中添加登录凭证
      if (token) {
        config.params.cookie = token;
      }
      break;
    }
    case 'post': {
      if (config.data) {
        config.data.timerstamp = timerstamp;
      } else {
        config.data = { timerstamp: timerstamp };
      }
      // 请求中添加登录凭证
      if (token) {
        config.params.cookie = token;
      }
      break;
    }
  }

  return config
}, (error: AxiosError) => {
  hilog.error(0x00, `${TAG}`, 'axios request interceptors error');
  AlertDialog.show(
    {
      title: 'Request fail',
      message: `:${error.message}`,//todo: unblock ${error.config.url == undefined ? 'undefined' : error.config.url}
      autoCancel: true,
      alignment: DialogAlignment.Bottom,
      gridCount: 4,
      offset: { dx: 0, dy: -20 }
    }
  )
  Promise.reject(error);
})

// 响应拦截器
request.interceptors.response.use((res: AxiosResponse) => {
  hilog.info(0x00, `${TAG}`, 'axios response interceptors:', res);
  if (res.status != 200) {
    return Promise.reject(res.data);
  }
  if (res.data?.code?.[0] == 3) {
    AlertDialog.show(
      {
        title: 'Fetch fail',
        message: `Please login: ${res.config.url} request failed`,
        autoCancel: true,
        alignment: DialogAlignment.Bottom,
        gridCount: 4,
        offset: { dx: 0, dy: -20 }
      }
    )
  }
  return res;
}, (error: AxiosError) => {
  hilog.error(0x00, `${TAG}`, 'axios response interceptors error:', error);
  let errorMsg = `Wrong info:${error.message}`
  if (error.response?.status == 301) {
    errorMsg = `Login first！`
  }
  AlertDialog.show(
    {
      title: 'Request error',
      message: errorMsg,
      autoCancel: true,
      alignment: DialogAlignment.Bottom,
      gridCount: 4,
      offset: { dx: 0, dy: -20 }
    }
  )
  return Promise.reject(error);
}
)

export default request
```