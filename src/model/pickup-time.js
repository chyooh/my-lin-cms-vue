import { get, post } from '@/lin/plugin/axios'

class Time {
  // 添加一个星期有哪几天取件的时间
  async save(week) {
    const res = await post('pickup/time/day/save.json', { week })
    return res
  }

  // 更新星期几
  async update(id, dayValue) {
    const res = await post('pickup/time/pickday/update.json', { id, dayValue })
    return res
  }

  // 删除取件时间星期
  async delete(id) {
    const res = await post('pickup/time/day/delete.json', { id })
    return res
  }

  // 添加一天取件的时间范围
  async saveHour(from, to, dayId) {
    const res = await post('pickup/time/hour/save.json', { from, to, dayId })
    return res
  }

  // 添加一天取件的时间范围
  async updateHour(id, fromHour, toHour, dayId) {
    const res = await post('pickup/time/pickupHours/update.json', { id, fromHour, toHour, dayId })
    return res
  }

  // 删除取件时间小时范围
  async deleteHour(id) {
    const res = await post('pickup/time/hour/delete.json', { id })
    return res
  }

  // 取件时间天所有列表查询
  async list() {
    const res = await get('pickup/time/day/list.json')
    return res
  }

  // 取件时间小时所有的时间列表查询
  // async hourList() {
  //   const res = await get('pickup/time/hour/list.json')
  //   return res
  // }

  // 根据天的ID查询一天的回收时间范围
  async findByDayId(id) {
    const res = await get('pickup/time/findByDayId.json', { id })
    return res
  }
}

export default new Time()
