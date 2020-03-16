/*
 * @Author: your name
 * @Date: 2020-03-12 10:32:29
 * @LastEditTime: 2020-03-14 17:02:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/router/index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home/Home'

Vue.use(Router)

export default new Router({
  mode: 'history', // 去掉路由的“#”
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})
