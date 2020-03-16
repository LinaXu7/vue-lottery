/*
 * @Author: your name
 * @Date: 2020-03-14 12:03:25
 * @LastEditTime: 2020-03-14 16:44:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery-turntable-master/src/apiConfig/request.js
 */
import axios from 'axios';

var page = this;

axios.interceptors.request.use(request => {
  request.headers = {
    'Content-Type':'application/x-www-form-urlencoded'
  }
  return request;
});

axios.interceptors.response.use(response =>
  new Promise((resolve, reject) => {
    switch (response.data.code) {
      case 500: if (response.data.message) {
        page.$dialog.alert({
          message: response.data.message,
        });
      } reject(response.data); break;
      case 401: reject(); break;
      default: if (response.data.code) {
        if (response.data.message) {
          page.$dialog.alert({
            message: response.data.message,
          });
        }
      } resolve(response.data);
    }
    if (response.data.status && response.data.status < 0) {
      if (response.data.message) {
        page.$dialog.alert({
          message: response.data.message,
        });
      }
      reject();
    } else {
      resolve(response.data);
    }
  }), () => {
    page.$toast({
      message: response.data.message,
    });
});

export default axios;