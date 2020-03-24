let defaultChance = 1
try {
  if (localStorage.lotteryChance) {
    defaultChance = localStorage.lotteryChance
  }
} catch (e) {

}

export default {
  lotteryChance: defaultChance
}