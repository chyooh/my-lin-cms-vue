// 保留两位小数
const Util = {}
Util.getPriceString = (val, num = 2) => {
  let value = val
  if (typeof val !== 'number') {
    value = Math.floor(parseFloat(val) * 100) / 100
  }
  return `￥${value.toFixed(num)}`
}
export default Util
