<!--
 * @Author: your name
 * @Date: 2020-03-14 16:27:29
 * @LastEditTime: 2020-03-16 12:00:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/pages/Home/Home.vue
 -->
<template>
  <div class="home">
    <lottery-turn></lottery-turn>
  </div>
</template>

<script>
import LotteryTurn from '../Home/components/LotteryTurn'


export default {
  name: 'Home',
  data() {
    return {
      //奖品类别
      // rests:[],
    }
  },
  components: {
    LotteryTurn
  },
  methods: {
    
  },
  mounted() {
    
  }
}
</script>

<style>
  .home {
    width: 100%;
    height: 100%;
    background: url('../../assets/img/13.png');
  }
</style>