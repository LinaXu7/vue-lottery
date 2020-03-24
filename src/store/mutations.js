export default {
  getChance (state, lotteryChance) {
    state.lotteryChance = lotteryChance
    try {
      localStorage.lotteryChance = lotteryChance
    } catch (e) {

    }
  }
}
