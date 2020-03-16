/*
 * @Author: your name
 * @Date: 2020-03-14 16:41:56
 * @LastEditTime: 2020-03-16 12:06:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/apiConfig/api.js
 */
// import axios from './request';
import axios from 'axios';

export const getprizeInfo = () => {
  return axios.request({
    url: '/static/mock/prizeInfo.json',
    method: 'get'
  })
}
