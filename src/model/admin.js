/* eslint-disable class-methods-use-this */
import { post, get } from '@/lin/plugin/axios'

export default class Admin {
  // 用户列表
  static async getUserList(data) {
    const res = await get('user/listNew.json', data)
    return res
  }

  // 全部菜单列表
  static async getAllMenuList() {
    const res = await post('menu/list.json')
    return res
  }

  // 角色列表
  static async getRoleList(pageSize = 99999, pageNumber = 1) {
    const res = await get('role/listNew.json', {
      pageSize,
      pageNumber,
    })
    return res
  }

  // 保存角色(新建角色)
  static async saveRole(data) {
    const res = await post('role/save', data)
    return res
  }

  // 更新角色
  static async updateRole(data) {
    const res = await post('role/update', data)
    return res
  }

  // 删除角色
  static async deleteRole(id) {
    const res = await get('role/delete.json', { id })
    return res
  }

  // 查看角色信息
  static async getRoleInfo(id) {
    const res = await post('role/getinfo', { id })
    return res
  }

  // 查看角色对应权限
  static async getRolePermission(roleId) {
    const res = await post('role/listAcl.json', { roleId })
    return res
  }

  // 修改角色对应权限
  static async updateRoleMenu(roleId, ids) {
    const res = await post('role/updateRoleMenu.json', { roleId, ids })
    return res
  }

  /**
   * 分配用户
   * @param {object} data 注册信息
   */
  // 保存用户
  static async saveUser(data) {
    const res = await post('user/save', data)
    return res
  }

  // 更新用户
  static async updateUser(data) {
    const res = await post('user/update', data)
    return res
  }

  // 删除用户
  static async deleteUser(data) {
    const res = await post('user/delete', data)
    return res
  }

  // 查看用户信息
  static async getUserInfoById(data) {
    const res = await post('user/getinfo', data)
    return res
  }

  // 还原初始密码
  static async resetPassword(id) {
    const res = await post(`user/resetPassword/${id}`)
    return res
  }

  // 禁用当前用户
  static async forbidden(id) {
    const res = await post(`user/forbidden/${id}`)
    return res
  }

  // 启用当前用户
  static async boot(id) {
    const res = await post(`user/boot/${id}`)
    return res
  }

  // 解锁当前用户
  static async unlock(id) {
    const res = await post(`user/unlock/${id}`)
    return res
  }

  // 更改用户角色参数 Long roleId, Long userId
  static async updateUserRole({ roleId, userId }) {
    const res = await post('user/updateUserRole', { roleId, userId })
    return res
  }
}
