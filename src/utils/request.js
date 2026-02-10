import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求加载动画实例
let loadingInstance = null;

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 显示加载动画
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    // 可以在这里添加认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  error => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close();
    ElMessage.error('请求参数错误');
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close();

    const res = response?.data;
    return res?.Response;
  },
  error => {
    // 关闭加载动画
    if (loadingInstance) loadingInstance.close();

    // 统一处理网络错误
    if (!error.response) {
      ElMessage.error('网络连接异常，请检查网络');
    } else {
      switch (error.response.status) {
        case 401:
          ElMessage.error('身份验证失败，请重新登录');
          // 可以在这里添加重定向到登录页的逻辑
          break;
        case 403:
          ElMessage.error('没有权限访问该资源');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器内部错误');
          break;
        default:
          ElMessage.error(`请求错误: ${error.response.status}`);
      }
    }

    return Promise.reject(error);
  }
);

export default service;
