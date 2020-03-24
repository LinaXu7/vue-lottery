<!--
 * @Author: your name
 * @Date: 2020-03-14 16:27:29
 * @LastEditTime: 2020-03-24 13:45:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-lottery/src/pages/Home/Home.vue
 -->
<template>
  <div class="home">
    <lottery-turn v-if="rests"></lottery-turn>
    <sudoku-lottery v-else></sudoku-lottery>
    <div class="desc">
      <p>本页面展示的奖券信息由南京伴盾网络科技有限公司提供，信息的真实性、准确性、合法性以及商品所载服务内容的安全性由南京伴盾网络科技有限公司负责</p>
    </div>
  </div>
</template>

<script>
import LotteryTurn from '../Home/components/LotteryTurn'
import SudokuLottery from '../Home/components/SudokuLottery'


export default {
  name: 'Home',
  data() {
    return {
      //奖品类别
      rests: 1
    }
  },
  components: {
    LotteryTurn,
    SudokuLottery
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
  .home .desc {
    width:89%;
    position:fixed;
    left: 5%;
    bottom: 0;
    color:white;
    font-size: 14px;
  }
</style>