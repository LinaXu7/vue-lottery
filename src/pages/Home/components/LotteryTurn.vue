<template>
  <div class="wrapper">
    <div class="luckyHead">
      <img :src="luckyLottery" class="luckyLottery"/>
      <img :src="lotteryTitle" class="lotteryTitle"/>
      <button class="lotteryChance">你还有 {{lotteryChance}} 次抽奖机会</button>
    </div>
    <div class="banner">
      <div class="turnplate">
        <canvas class="item" id="wheelcanvas" width="420px" height="420px" :style="`transform: rotate(${wheelDeg + 90}deg)`"></canvas>
        <img id="pointer" class="pointer" :src="imgSrc" @click="startGame"/>
      </div>
      <img :src="shanImg" id="shan-img" style="display:none;"/>
      <img :src="sorryImg" id="sorry-img" style="display:none;"/>
    </div>
    <div class="desc">
      <p>本页面展示的奖券信息由南京伴盾网络科技有限公司提供，信息的真实性、准确性、合法性以及商品所载服务内容的安全性由南京伴盾网络科技有限公司负责</p>
    </div>
    <div class="result" v-show="showResult">
    </div>
    <div v-show="showResult" class="center">
      <img v-if="!!result" :src="winImg" alt="" />
      <img v-else :src="pityImg" alt="" />
      <div class="info" v-if="result">奖品：{{result.name}}</div>
      <div class="info" v-else>很遗憾，未中奖</div>
      <div class="btn" @click="close(result)">
        <img :src="yBtn" alt="" />
        <div class="btn-title">{{!!result ? "免费领取" : "确定"}}</div>
      </div>
    </div>
  </div>
</template>
<style>
  .wrapper {
    width: 100%;
    height: 100%;
    background-image: url("../../../assets/img/background1.png");
    background-size:cover;
  }
  .wrapper .luckyHead {
    margin-bottom: 10%;
  }
  .wrapper .luckyHead .luckyLottery {
    width: 75%;
    height: 33%;
    margin-top: 40px;
  }

  .wrapper .luckyHead .lotteryTitle {
    width: 70%;
    height: 20%;
    margin-bottom: 10%;
  }

  .wrapper .luckyHead .lotteryChance {
    width: 60%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid rgb(211, 121, 69);
    border-radius: 27px;
    background-color: rgb(211, 121, 69);
    color:wheat;
    font-size: 16px;
  }
  .banner {
    display: block;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .banner .turnplate {
    display: block;
    width: 70%;
    height: auto;
    position: relative;
    margin: 0 auto;
    background-image: url('../../../assets/img/turnplate-bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    transition: transform 8s ease-in-out;
  }

  .banner .turnplate img.pointer {
    position: absolute;
    width: 31.5%;
    height: 42.5%;
    left: 34.6%;
    top: 23%;
    z-index: 3;
    cursor: pointer;
  }

  .banner .turnplate canvas.item {
    width: 100%;
    overflow: hidden;
    transition: transform 8s ease-in-out;
    z-index: 2;
  }

  .wrapper .desc {
    width:89%;
    position:fixed;
    left: 5%;
    bottom: 0;
    color:white;
    font-size: 16px;
  }

  .wrapper .result {
    position: fixed;
    z-index: 12;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    top: 0;
    left: 0;
    z-index: 99;
  }
  .center {
    position: absolute;
    top: 55%;
    left: 65%;
    transform: translate(-70%, -70%);
    z-index: 999;
    width: 65%;
  }

  .center img {
    width: 100%;
  }

  .center .info {
    background: #fff;
    color: #a16f0f;
    font-size: 26px;
    font-weight: 500;
    text-align: center;
    line-height: 55px;
    margin-top: -5px;
  }
  
  .center .btn {
    display: block;
    margin-top: 50px;
    text-align: center;
    height: 50px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .center .btn img {
    display: block;
    font-size: 0;
    margin: 0 auto;
    width: auto;
    height: 55px;
  }

  .center .btn .btn-title {
    color: #a16f0f;
    font-size: 26px;
    font-weight: bold;
    line-height: 55px;
    margin-top: -55px;
  }

</style>
<script>
  // import LotteryDial from './dial'
  import imgSrc from '../../../assets/img/center.png'
  import shanImg from '../../../assets/img/1.png'
  import sorryImg from '../../../assets/img/2.png'
  import winImg from '../../../assets/img/zhong.png'
  import pityImg from '../../../assets/img/wei.png'
  import yBtn from '../../../assets/img/yBtn.png'
  import luckyLottery from '../../../assets/img/lottery.png'
  import lotteryTitle from '../../../assets/img/lotteryTitle.png'
  import { getprizeInfo } from '../../../apiConfig/api'

  export default{
    data(){
      return {
        imgSrc,
        shanImg,
        sorryImg,
        pityImg,
        yBtn,
        winImg,
        luckyLottery,
        lotteryTitle,
        lottery: null,
        showResult: false,
        result: null,
        rolling: false,
        wheelDeg: 0,
        lotteryChance: 1,
        restaraunts:[],
        turnplate: {
          outsideRadius: 192,			//大转盘外圆的半径
          textRadius: 145,				//大转盘奖品位置距离圆心的距离
          insideRadius: 55,			//大转盘内圆的半径
          startAngle: 1.5 * Math.PI,				//开始角度
        },
      }
    },

    computed: {
      oldrestaraunts() {
        return this.restaraunts.reverse()
      }
    },

    mounted() {
      this.loadImgs(() => {
        // this.prepareLottery()
        this.getLotteryInfo();
      })  
    },

    methods: {
      getLotteryInfo() {
        return new Promise((resolve, reject) => {
          getprizeInfo().then((res) => {
            const resData = res.data;
            this.restaraunts = resData.list;
            this.drawRouletteWheel();
            resolve();
          }).catch(() => {
            reject();
          });
        });
      },
      drawRouletteWheel() {
        var canvas = document.getElementById("wheelcanvas");
        var turnplate = this.turnplate
        if (!canvas.getContext) {
          return
        }
        //根据奖品个数计算圆周角度
        var len = this.restaraunts.length;
        var arc = Math.PI / (len / 2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0, 0, 422, 422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '22px Microsoft YaHei';
        for (var i = 0; i < len; i++) {
          var angle = turnplate.startAngle + i * arc;
          ctx.fillStyle = i % 2 === 0 ? '#ffdb37' : '#ffb725'; //设置每个扇形区域的颜色
          ctx.beginPath();
          //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
          ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
          ctx.stroke();
          ctx.fill();
          //锁画布(为了保存之前的画布状态)
          ctx.save();

          //----绘制奖品开始----
          ctx.fillStyle = "#e9311f";
          var text = this.restaraunts[i].name;
          var line_height = 17;
          //translate方法重新映射画布上的 (0,0) 位置
          ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

          //rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2);

          /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
          if (text.indexOf("M") > 0) {//流量包
            var texts = text.split("M");
            for (var j = 0; j < texts.length; j++) {
              ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
              if (j == 0) {
                ctx.fillText(texts[j] + "M", -ctx.measureText(texts[j] + "M").width / 2, j * line_height);
              } else {
                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
              }
            }
          } else if (text.indexOf("M") == -1 && text.length > 6) {//奖品名称长度超过一定范围
            text = text.substring(0, 6) + "||" + text.substring(6);
            var texts = text.split("||");
            for (var j = 0; j < texts.length; j++) {
              ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
            }
          } else {
            //在画布上绘制填色的文本。文本的默认颜色是黑色
            //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
          }

          //添加对应图标
          if (text.indexOf("闪币") > 0) {
            var img = document.getElementById("shan-img");
            ctx.drawImage(img, -15, 10);
          } else if (text.indexOf("谢谢参与") >= 0) {
            var img = document.getElementById("sorry-img");
            ctx.drawImage(img, -15, 10);
          }
          //把当前画布返回（调整）到上一个save()状态之前
          ctx.restore();
          //----绘制奖品结束----
        }

      },
      startGame(){
        const page = this;
        // this.lottery.draw()
        if(this.lotteryChance <= 0) {
          page.$dialog.alert({
            message: "抽奖机会已用完",
          })
          return;
        }
        this.lotteryChance -= 1;
        if (this.showResult) {
          this.showResult = false;
          return;
        }
        if (this.rolling) {
          return;
        }
        this.rolling = true
        // 这里应该从后台获取中奖结果，我们随便模拟一下中奖结果
        var winIndex = parseInt(Math.random() * (this.restaraunts.length + 1), 10);
        // var winIndex = 5;
        console.log(this.restaraunts[winIndex].name);
        this.result = this.restaraunts[winIndex];
        if (this.result.name === '谢谢参与') {
          this.result = null;
        }
        // 计算中奖的旋转角度
        this.wheelDeg = this.wheelDeg - this.wheelDeg % 360 + 3600 + (360 - 360 / this.restaraunts.length * winIndex) - (
          180 - 360 / this.restaraunts.length);
        
        // 关闭中奖结果
        setTimeout(() => {
          this.showResult = true;
          this.rolling = false;
        }, 8500)
      },
      close(result) {
        if(!!result) {
          window.location.href = result.img.imgUrl;
        } 
        this.showResult = false;
      },
      loadImgs(suc) {
        var c = 0
        var images = [document.getElementById('shan-img'), document.getElementById('sorry-img')]
        for (var i = 0, len = images.length; i < len; i++) {
          (function loadImage(image) {
            image.onload = function () {
              c++
              c === images.length && suc && suc()
            }
          })(images[i])
        }
      }
    },
    components: {}
  }
</script>
