// 保留两位小数
const Util = {}
Util.getPriceString = (val, num = 2) => {
  let value = val
  if (typeof val !== 'number') {
    value = Math.floor(parseFloat(val) * 100) / 100
  }
  return `￥${value.toFixed(num)}`
}
Util.getDateString = date => new Date(date).toLocaleString('chinese', { hour12: false }).replace(/\//g, '-').replace('24:00:00', '00:00:00')

export default Util
