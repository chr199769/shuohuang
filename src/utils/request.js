import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { mockData } from './mockData';

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  // 添加 mock adapter
  adapter: config => {
    // 尝试解析请求数据
    let data = {};
    try {
      if (typeof config.data === 'string') {
        data = JSON.parse(config.data);
      } else {
        data = config.data || {};
      }
    } catch (e) {
      console.warn('Parse config data failed', e);
    }

    const action = data.Action;

    // 如果有对应的 mock 数据
    if (action && mockData[action]) {
      console.log(`[Mock] Intercepted action: ${action}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              Response: mockData[action](data)
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          });
        }, 500); // 模拟网络延迟
      });
    }

    // 如果没有 mock 数据，且我们知道后端不可用，直接返回错误，避免长时间等待
    // 或者你可以尝试发起真实请求（但在当前环境下会失败）
    // 为了演示效果，这里可以默认尝试真实请求，或者直接报错
    // 这里我们尝试使用 axios 默认的适配器（如果存在）或者手动发起 XHR

    // 由于 axios 在不同环境（node/browser）adapter 实现不同，
    // 在浏览器端通常是 xhr。我们可以直接抛出错误，或者尝试 fetch。
    // 简单起见，如果未命中 mock，我们直接返回一个模拟的空响应或错误，
    // 因为已知后端不可用。

    // 但为了代码的通用性，如果未来后端好了，我们应该允许透传。
    // axios 默认 adapter 不容易直接获取（它内部判断环境）。
    // 我们可以删除 adapter 配置来使用默认，但我们需要拦截。
    // 这里的 trick 是：如果定义了 adapter，axios 就只用这个 adapter。
    // 所以我们需要在这个 adapter 里实现 XHR 或者 fetch。

    // 为了简化，我们假设当前全走 mock，未命中 mock 的报错。
    return Promise.reject(new Error(`后端接口不可用，且未找到Action: ${action} 的Mock数据`));
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