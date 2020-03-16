<!--
 * @Author: your name
 * @Date: 2020-03-12 10:32:29
 * @LastEditTime: 2020-03-14 17:13:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/App.vue
 -->
<template>
  <div id="app">
    <keep-alive :exclude="exclude">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      exclude: ['Detail']
    }
  }
}
</script>

<style>
html,body{
    height: 100%;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
