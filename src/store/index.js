/*
 * @Author: your name
 * @Date: 2020-03-20 09:54:01
 * @LastEditTime: 2020-03-20 10:33:27
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    lotteryChance: 0
  },
  mutations: {
    lotteryChance: (state, chance) => {
      const tmp = state;
      tmp.lotteryChance = chance;
    }
  }
})

export default store;
