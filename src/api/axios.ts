import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {message as msgBox} from 'antd';

// API响应消息体
export interface APIResponse<T = any> {
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  code: string;
  message: string;
  response: T;
}

// API请求方法调用签名
export interface APIRequest<T> {
  (...requestData: any): Promise<APIResponse<T>>;
}

const profiles = process.env.PROFILES as any;

const defaultConfig: AxiosRequestConfig = {
  baseURL: profiles.baseURL,
  timeout: 120 * 1000, //超时
  withCredentials: true, //允许跨域携带cookie
  headers: {
    // content-type 可以先和后端沟通使用JSON还是表单，后面有少数不一样的特殊处理就行
    'content-type': 'application/json'//'application/x-www-form-urlencoded'
  }
};

const DEFAULT_INSTANCE: AxiosInstance = axios.create(defaultConfig); //使用传入的config覆盖默认

// http request 拦截器
DEFAULT_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  }
);

// http response 拦截器
DEFAULT_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => {
    const {status, message} = response.data;

    if (status == 'ERROR') {
      msgBox.error(message);
      return Promise.reject(response.data);
    }

    return Promise.resolve(response.data);
  },
  (error: any) => {
    const {response} = error;
    if (response) {
      const {status, data} = response;
      //const dataDesc = JSON.stringify(data);
      if (status == 404) {
        //msgBox.error(`[请求地址出错] ${dataDesc}`);
        return Promise.reject(data);
      }
    }

    //msgBox.error(JSON.stringify(error));
    return Promise.resolve(error);
  }
);

export default DEFAULT_INSTANCE;
