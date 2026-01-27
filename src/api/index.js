import request from '../utils/request';

/**
 * 用户登录
 * @param {Object} params - 请求参数
 * @param {string} params.username - 用户名
 * @param {string} params.phone - 手机号
 * @returns {Promise<Object>} 登录响应
 */
export function userLogin(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'UserLogin',
      ...params
    }
  }).then(response => {
    return response;
  });
}

/**
 * 用户注册
 * @param {Object} params - 请求参数
 * @param {string} params.username - 用户名
 * @param {string} params.phone - 手机号
 * @param {string} params.password - 密码
 * @returns {Promise<Object>} 注册响应
 */
export function userRegister(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'UserRegister',
      ...params
    }
  }).then(response => {
    return response;
  });
}

/**
 * 获取业务数据列表
 * @param {Object} params - 请求参数
 * @param {string} params.Mark - 筛选标记
 * @param {string} params.Date - 筛选日期
 * @param {number} params.Offset - 偏移量
 * @returns {Promise<Object>} 响应数据
 */
export function describeBizList(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'DescribeBizList',
      ...params
    }
  }).then(response => {
    return response;
  });
}

/**
 * 获取设备列表 (DescribeEqList)
 * @param {Object} params - 请求参数
 * @param {string} params.Mark - 筛选标记 (设备名/部门名/站名)
 * @param {string} params.Date - 筛选日期
 * @param {number} params.Offset - 偏移量
 * @returns {Promise<Object>} 响应数据
 */
export function describeEqList(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'DescribeEqList',
      ...params
    }
  }).then(response => {
    return response;
  });
}

/**
 * 获取设备链上信息 (DescribeEqChainInfo)
 * @param {Object} params - 请求参数
 * @param {string} params.EqID - 设备ID
 * @returns {Promise<Object>} 响应数据
 */
export function describeEqChainInfo(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'DescribeEqChainInfo',
      ...params
    }
  }).then(response => {
    return response;
  });
}

/**
 * 获取业务链上信息 (DescribeBizChainInfo)
 * @param {Object} params - 请求参数
 * @param {string} params.BizID - 业务ID
 * @returns {Promise<Object>} 响应数据
 */
export function describeBizChainInfo(params) {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'DescribeBizChainInfo',
      ...params
    }
  }).then(response => {
    return response;
  });
}