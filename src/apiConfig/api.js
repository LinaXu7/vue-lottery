/*
 * @Author: your name
 * @Date: 2020-03-14 16:41:56
 * @LastEditTime: 2020-03-18 11:08:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/apiConfig/api.js
 */
import service from './request';

export const getprizeInfo = () => {
  return service.request({
    url: '/api/prizeInfo.json',
    method: 'get'
  })
}

export const getSudokuInfo = () => {
  return service.request({
    url: '/api/sudokuInfo.json',
    method: 'get'
  })
}
