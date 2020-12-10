/* eslint-disable class-methods-use-this */
import Vue from 'vue'
import { post, get } from '@/lin/plugin/axios'
import store from '@/store'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class User {
  async login(username, password) {
    await post('login.json', {
      username,
      password,
    })
  }

  async getCurrentInfo() {
    const info = await get('user/getCurrentInfo.json')
    console.log(info)
    const { admin, avatar, email, id, nickname } = info.data

    const storeUser = store.getters.user === null ? {} : store.getters.user
    storeUser.permissions = info.data.role.authorities
    return Object.assign({ ...storeUser }, { admin, avatar, email, id, nickname })
  }

  /**
   * 获取当前用户信息，并返回User实例
   */
  async getInformation() {
    const info = await get('cms/user/information')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} confirmPassword 确认新密码
   * @param {string} oldPassword 旧密码
   */
  // updatePassword({ old_password, new_password, confirm_password }) {
  //   return put('cms/user/change_password', {
  //     new_password,
  //     confirm_password,
  //     old_password,
  //   })
  // }

  // 用户登出
  async logout() {
    const res = await post('logout.json')
    return res
  }

  // 查看当前用户拥有的权限
  async getPermissions() {
    const info = await post('user/listAcl.json')
    return info
  }

  // 修改密码
  updatePassword({ oldPassword, newPassword }) {
    return post('user/updatePassword', {
      oldPassword,
      newPassword,
    })
  }

  // 上传文件
  upload(file) {
    // return post('file/upload', data)
    return Vue.prototype.$axios({
      method: 'post',
      url: '/file/upload',
      data: {
        file,
      },
    })
  }

  // 修改头像
  update(data) {
    return post('user/update', data)
  }
}

export default new User()
