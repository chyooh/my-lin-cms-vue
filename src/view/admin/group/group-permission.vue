<template>
  <div class="container" v-loading="loading">
    <div class="group">
      <div class="label">
        <label>{{ title }}</label>
      </div>
      <div class="details">
        <div class="permissions-box" v-for="(permission, moduleName) in allPermissions" :key="moduleName">
          <el-checkbox-group v-model="permission_module_name">
            <div class="module-box">
              <el-checkbox
                @change="moduleCheck($event, permission, moduleName)"
                class="module"
                :label="moduleName"
                :indeterminate="halfPermissions.includes(moduleName)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
          <ul class="permissions-ul">
            <li class="permissions-li" v-for="(item, key) in permission" :key="key">
              <el-checkbox
                :label="item.name"
                :value="permission_module_ids.indexOf(item.id) > -1"
                @change="singleCheck(item.id, permission, moduleName)"
              ></el-checkbox>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Admin from '@/model/admin'

export default {
  props: ['id', 'title'],
  data() {
    return {
      loading: false,
      cacheFlag: true,
      allAuthIds: [],
      allPermissions: {}, // 所有角色权限
      halfPermissions: [], // 该分类下的权限没有全选中
      permission_module_ids: [], // 权限组 集合 id
      permission_module_name: [], // 权限组 module name
    }
  },
  async created() {
    try {
      this.loading = true
      await this.getGroupPermissions()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(e)
    }
  },
  methods: {
    // 获取角色权限
    async getGroupPermissions() {
      this.allPermissions = []
      this.halfPermissions = []
      this.permission_module_ids = []
      this.permission_module_name = []
      const result = await Admin.getAllMenuList()
      const list = result.data.rows
      // console.log(list)
      const tempObj = {}
      const permissions = []
      const permissionsWithoutFold = []
      list.forEach(item => {
        const obj = {}
        permissions.push(item)
        if (item.children.length) {
          obj[item.menuName] = []
          item.children.forEach(children1 => {
            permissions.push(children1)
            if (children1.children.length) {
              children1.children.forEach(children2 => {
                const obj2 = {}
                obj2.id = children2.id
                obj2.module = item.menuName
                obj2.name = children2.menuName
                obj[item.menuName].push(obj2)
                permissions.push(children2)
                permissionsWithoutFold.push(children2)
              })
            } else {
              const obj1 = {}
              obj1.id = children1.id
              obj1.module = item.menuName
              obj1.name = children1.menuName
              obj[item.menuName].push(obj1)
              permissionsWithoutFold.push(children1)
            }
          })
        }
        Object.assign(tempObj, obj)
      })
      // console.log(tempObj)
      this.allPermissions = tempObj
      // 通过判断有没有传入id，来判断当前页面是添加角色还是编辑角色
      // console.log(permissions)
      if (this.id) {
        const res = await Admin.getRolePermission(this.id)
        // console.log(res)
        res.rows.forEach(item => {
          item.name = item.menuName
          let temItem = permissions.find(item1 => item.parentId === item1.id)
          // console.log(temItem)
          if (temItem) {
            item.module = temItem.menuName
            if (temItem.parentId === 0) {
              item.module = temItem.menuName
            } else {
              temItem = permissions.find(item1 => temItem.parentId === item1.id)
              if (temItem.parentId === 0) {
                item.module = temItem.menuName
              }
            }
          } else {
            item.module = item.menuName
          }
        })
        // console.log(res)
        let temp = []
        const cache = {}
        res.rows.forEach(v => {
          temp.push(v.module)
        })
        const filterPermissions = res.rows.filter(item => permissionsWithoutFold.find(item1 => item.id === item1.id))
        filterPermissions.forEach(v => {
          this.permission_module_ids.push(v.id)
          // 每个module拥有权限个数
          if (!cache[v.module]) {
            cache[v.module] = 1
          } else {
            cache[v.module]++
          }
        })
        temp = Array.from(new Set(temp))
        // 半选
        // console.log(filterPermissions)
        // console.log(this.allPermissions)
        // console.log(cache)
        // console.log(temp)
        temp.forEach(item => {
          if (this.allPermissions[item].length !== cache[item]) {
            this.halfPermissions.push(item)
          }
        })
        this.permission_module_name = Array.from(new Set(temp))
        this.$emit('getCacheAuthIds', this.permission_module_ids.slice())
      }
      this.$emit('updatePermissions', this.permission_module_ids)
      this.$emit('updateAllPermissions', this.allPermissions)
    },

    // 批量选中
    moduleCheck(checked, ids, moduleName) {
      const _ids = ids.map(item => item.id)
      if (checked) {
        this.permission_module_ids = Array.from(new Set(this.permission_module_ids.concat(_ids)))
        this.permission_module_name.push(moduleName)
        this.halfPermissions = this.halfPermissions.filter(v => v !== moduleName)
      } else {
        this.permission_module_ids = this.permission_module_ids.filter(v => !_ids.includes(v))
        this.permission_module_name = this.permission_module_name.filter(v => v !== moduleName)
      }
      this.$emit('updatePermissions', this.permission_module_ids)
    },

    // 单选
    singleCheck(id, permission, moduleName) {
      const _ids = permission.map(item => item.id)
      let count = 0
      const index = this.permission_module_ids.indexOf(id)
      if (index === -1) {
        this.permission_module_ids.push(id)
      } else {
        this.permission_module_ids.splice(index, 1)
      }
      _ids.forEach(item => {
        if (this.permission_module_ids.indexOf(item) > -1) {
          count++
        }
        // 全选状态
        if (_ids.length === count) {
          this.permission_module_name.push(moduleName)
          this.halfPermissions = this.halfPermissions.filter(v => v !== moduleName)
        } else if (count === 0) {
          // 未选中状态
          this.permission_module_name = this.permission_module_name.filter(v => v !== moduleName)
          this.halfPermissions = this.halfPermissions.filter(v => v !== moduleName)
        } else {
          // 半选状态
          this.permission_module_name = this.permission_module_name.filter(v => v !== moduleName)
          this.halfPermissions.push(moduleName)
        }
      })
      this.$emit('updatePermissions', this.permission_module_ids)
    },
  },
}
</script>

<style lang="scss" scoped>
.group {
  margin-left: -95px;

  .label {
    margin-bottom: 10px;
    width: 70px;
    margin-left: 20px;
    float: left;
    font-weight: 500;

    label {
      color: #333333;
      font-size: 14px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
    }

    .necessary {
      color: #e46a76;
      font-size: 14px;
      font-weight: 500px;
      margin-right: 5px;
      font-size: 16px;
    }
  }

  .details {
    display: inline-block;
    width: calc(100% - 95px);
    margin-top: 5px;
    margin-left: 5px;

    .text-input {
      height: 40px;
      width: 780px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #dee2e6;
      text-indent: 20px;

      &::placeholder {
        font-size: 14px;
        font-weight: 400;
        color: #c4c9d2;
        text-indent: 20px;
      }
    }
    .permissions-box {
      .module {
        height: 20px;
        font-size: 13px;
        color: #45526b;
        line-height: 20px;
        margin-bottom: 10px;
      }

      .permissions-ul {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        padding: 20px 20px 0;
        background: #f5f5f6;
        margin-bottom: 20px;

        .permissions-li {
          width: 155px;
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          vertical-align: text-top;
          margin-right: 10px;

          .check {
            transform: translateY(2px);
            margin-right: 5px;
          }

          .permissions-name {
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #596c8e;
            line-height: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
