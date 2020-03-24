<template>
  <div id="wrapper" class="wrapper">
    <div class="luckyHead">
      <img :src="luckyLottery" class="luckyLottery"/>
    </div>
    <div class="fixed_back" v-if="!layerShowLottery" @touchmove.prevent>
      <div class="prize-wrapper">
        <div class="prize-content">
          <div class="prize-btn" 
               :class="[isClick ? 'lottery-tb-btn-d' : '']" 
               @click="startLottery">抽奖
          </div>
          <ul>
            <li v-for="(item,i) in list" :class="i==index?'on':''" :key="i"> 
              <div class="prize-img-box">
                <img :src="item.img" alt="">
              </div>
              <p>{{item.name}}</p>
            </li>
          </ul>
        </div>
        <p class="prize-times">抽奖机会剩余<span>{{award.chance}}</span>次</p>
        <!-- <div class="modal-close-prize" @click="layerShowLottery = false"></div> -->
      </div>
    </div>
    <div class="lottery-alert" v-if="showToast">
      <div :class="['lottery-wrapper',prize_msg.name=='谢谢参与'? 'lottery-wrapper-no': '' ]">
        <div class="prize_result">
          <h2>{{prize_msg.name}}</h2>
        </div>
        <!-- <h2>{{prize_msg.name}}</h2> -->
        <div class="btn-save" @click="showToast=false" v-if="prize_msg.name=='谢谢参与'">确定</div> 
        <div class="btn-save" @click="to" v-else>立即领取</div> 
        <div class="modal-close-prize" @click="showToast = false"></div>
      </div>
    </div>  
</div>
</template>

<script>
import luckyLottery from '../../../assets/img/lotteryLogo.png'
import lotteryResult from '../../../assets/img/cardLogo.png'
import { getSudokuInfo } from './../../../apiConfig/api'

export default {
  name: 'SudokuLottery',
  data() {
    return {
      luckyLottery,
      lotteryResult,
      layerShowLottery: false,
        award:{
          chance: 1,
        },
        prize_msg:{
        },
        isClick: false,
        score: 10, // 如果有积分，消耗积分
        list: [],
        index: -1,  // 当前转动到哪个位置，起点位置
        count: 8,  // 总共有多少个位置
        timer: 0,  // 每次转动定时器
        speed: 200,  // 初始转动速度s
        times: 0,    // 转动次数
        cycle: 50,   // 转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize: -1,   // 中奖位置
        click: true,
        showToast: false, //显示中奖弹窗
    }
  },
  methods: {
    fnResize() {
      var deviceWidth = document.documentElement.clientWidth || window.innerWidth
      if (deviceWidth >= 750) {
      deviceWidth = 750
      }
      if (deviceWidth <= 320) {
      deviceWidth = 320
      }
      document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
    },
    initLottery() { // 获取九宫格奖品数据
      var that = this;
      getSudokuInfo().then((res) => {
        that.list = res.list;
        console.log(this.list);
      });
    },
    startLottery() {
      var that = this;
      if (!that.click) {
        return
      }
      if(that.award.chance <= 0) {
        that.$dialog.alert({
          message: "抽奖机会已用完",
        })
        return;
      }
      that.click = false;
      that.award.chance -= 1;
      localStorage.setItem('awardChance', that.award.chance);
      setTimeout(function(){
        const prize_index = parseInt(Math.random() * 8, 0) || 0;
        console.log(prize_index);
        var res = that.list[prize_index];
        that.startRoll();
        var id = res.id;
        for(var i=0;i<that.list.length;i++){
          if(id == that.list[i].id){
            that.prize = i; 
            that.prize_msg = res;  
          }
        }
        that.click = true;
      }, 800)
    },
    startRoll() {
      this.times += 1; // 转动次数
      this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化 
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.index) {
        clearTimeout(this.timer) // 清除转动定时器，停止转动
        this.prize = -1 
        this.times = 0 
        this.speed = 200;
        this.click = true;
        var that = this;
        this.award.times = this.prize_msg.chance;
        setTimeout(res => {
          that.showToast = true; //显示中奖弹窗
        },500)
      } else {
        if (this.times <= this.cycle) {
            this.speed -= 10 // 加快转动速度
        // } else if (this.times === this.cycle) { // 随机获得一个中奖位置
        //     const index = parseInt(Math.random() * 10, 0) || 0;
        //     this.prize = index; // 中奖位置,可由后台返回 
        //     if (this.prize > 7) {
        //         this.prize = 7
        // }
        } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 7) || this.prize === this.index + 1)) {
          this.speed += 110 // 慢了
        } else {
          this.speed += 20  // 60>num 不满足后面情况
        }
        if (this.speed < 40) { // 控制过快的速度
          this.speed = 40
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    },
    oneRoll() { // 每一次转动
      let index = this.index    // 当前转动到哪个位置/起点位置
      const count = this.count  // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.index = index
      localStorage.setItem('index', this.index);
    },
    to() {
      window.location.href = this.prize_msg.toUrl;
      this.showToast = false;
    }
  },
  mounted() {
    this.initLottery();
    this.fnResize();
    this.$nextTick(() => {
      if(localStorage.getItem('awardChance')) {
        this.award.chance = localStorage.getItem('awardChance');
        this.index = localStorage.getItem('index');
        localStorage.removeItem('awardChance');
        localStorage.removeItem('index');
      }
    })
  }
}
</script>

<style scoped>
  img {
  width: 100%;
  height: 100%;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    font-size:14px; 
    font-family: "PingFangSC", Arial, Helvetica, STHeiTi, sans-serif;
    background-image: url("../../../assets/img/background1.png");
    background-size:cover;
  }
  .wrapper .luckyHead .luckyLottery {
    width: 75%;
  }

  .wrapper .luckyHead .lotteryTitle {
    width: 70%;
  }
  .fixed_back {
    width: 100%;
  }
  .lottery-alert {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 101;
  }
  .lottery-wrapper {
    box-sizing: border-box;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 7.5rem;
    height: 8.61rem;
    background: url('../../../assets/img/award_yet.png') no-repeat center;
    background-size: 100%;
    text-align: center;
    padding-top: 3rem;
  }
  .lottery-wrapper .prize_result {
    width: 4.3rem;
    height: 1.73rem;
    margin-left: 1.6rem;
    background: url('../../../assets/img/cardLogo.png') no-repeat;
    background-size: cover;
  }
  .lottery-wrapper .prize_result h2 {
    margin-left: 0.95rem;
    padding: 0.6rem 0.5rem;
    height: 0.8rem;
    font-size: 0.46rem;
    font-weight: 500;
    color: #4E4E4E;
  }
  
  .lottery-wrapper h2 {
    margin: 0.4rem 0;
    
  }
  .lottery-wrapper .modal-close-prize {
    bottom: -0.08rem;
  }
  .lottery-wrapper-no {
    background: url('../../../assets/img/award_no.png') no-repeat center;
    background-size: 100%;
    padding-top: 3.3rem;
  }
  .lottery-wrapper-no img {
    width: 1.22rem;
    height: 1.22rem;
  }
  .btn-save {
    display: inline-block;
    width: 2.42rem;
    height: 0.6rem;
    line-height: 0.6rem;
    margin-top: 0.45rem;
    font-size: 0.26rem;
    color: #fff;
    text-align: center;
    background: #FF473A;
    border-radius: 0.3rem;
  }
  .prize-wrapper {
    box-sizing: border-box;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5.16rem;
    height: 5.66rem;
    padding-top: 0.26rem;
    background:#f95f53;
    border-radius: 0.15rem;
  }
  .prize-wrapper .prize-content {
    box-sizing: border-box;
    position: relative;
    width: 4.64rem;
    height: 4.64rem;
    margin: 0 auto;
    padding: 0.06rem;
    background-color: #ffeeed;
  }
  .prize-wrapper .prize-btn {
    position: absolute;
    top: 1.54rem;
    left: 1.61rem;
    width: 1.42rem;
    height: 1.42rem;
    line-height: 1.42rem;
    text-align: center;
    overflow: hidden;
    color:#ffeeed;
    font-size: 0.4rem;
    background: url('../../../assets/img/flip_button.png') no-repeat;
    background-position: 0 0;
    background-size: 98%;
    /* background-color: #96A7B9; */
    z-index: 10000;
  }
  .lottery-tb-btn-d {
    background-position: -0.05rem -1.62rem;
    line-height: 1.65rem;
  }
  .prize-wrapper ul {
    position: relative;
    width: 4.47rem;
    height: 4.47rem;
  }
  .prize-wrapper ul .on {
    background: #f95f53;
  }
  .prize-wrapper ul li {
    position: absolute;
    width: 1.42rem;
    height: 1.42rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .prize-wrapper ul li .prize-img-box {
    width: 0.9rem;
    height: 0.9rem;
  }
  .prize-wrapper ul li p {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.6rem;
    line-height: 0.19rem;
    font-size: 5px;
    color: #4E4E4E;
    text-align: center;
  }
  .prize-wrapper ul li:nth-child(1) {
    top: 0;
    left: 0.02rem;
  }
  .prize-wrapper ul li:nth-child(2) {
    top: 0;
    left: 1.54rem;
  }
  .prize-wrapper ul li:nth-child(3) {
    top: 0;
    right: 0;
  }
  .prize-wrapper ul li:nth-child(4) {
    top: 1.45rem;
    right: 0;
  }
  .prize-wrapper ul li:nth-child(5) {
    top: 3rem;
    right: 0;
  }
  .prize-wrapper ul li:nth-child(6) {
    top: 3rem;
    left: 1.54rem;
  }
  .prize-wrapper ul li:nth-child(7) {
    top: 3rem;
    left: 0.02rem;
  }
  .prize-wrapper ul li:nth-child(8) {
    left: 0.02rem;
    top: 1.45rem;
  }
  .prize-wrapper .prize-times {
    margin-top: 0.1rem;
    font-size: 0.28rem;
    color: #4E4E4E;
    text-align: center;
  }
  .prize-wrapper .prize-times span {
    margin: 0 0.05rem;
    line-height: 0.54rem;
    font-size: 0.5rem;
    color: #8A2126;
  }
  .modal-close-prize {
    position: absolute;
    left: 50%;
    bottom: -1rem;
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    margin-left: -0.3rem;
    background: url('../../../assets/img/icon_close@2x.png') no-repeat center center;
    background-size: 99%;
  }

</style>