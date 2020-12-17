<template>
  <div class="container">
    <div class="header">
      <!-- <div class="title">分类列表</div> -->
      <el-button v-permission="'admin:pickup:time:add'" type="primary" plain @click="create" size="medium"
        >创建取件时间</el-button
      >
    </div>

    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
      <el-table-column fixed prop="name" label="名称" width="100"> </el-table-column>

      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="props">
          <el-button type="primary" plain @click="goToChildren(props.row)" size="mini">查看范围</el-button>
          <!-- <el-button type="info" plain @click="handleEdit(props.row)" size="mini">编辑</el-button> -->
          <el-button
            v-permission="'admin:pickup:time:del'"
            type="danger"
            plain
            @click="handleDelete(props.row)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogFormVisible" class="groupListInfoDialog">
      <div style="margin-top: -25px">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="form"
          label-position="right"
          :rules="rules"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="时间日期" prop="week">
            <el-select v-model="form.week" placeholder="请选择" size="medium">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left: 5px">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Time from '@/model/pickup-time'

export default {
  data() {
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      dialogFormVisible: false, // 是否弹窗
      baseForm: {
        // 表单信息
        week: null,
      },
      form: {
        // 表单信息
        week: null,
      },
      cacheForm: {
        // 缓存第一次的表单信息
        week: null,
      },
      loading: false,
      rules: {
        // 表单验证规则
        week: [{ required: true, message: '请选择取件时间', trigger: 'blur' }],
      },
      type: 'add',
      options: [
        {
          value: 7,
          label: '星期日',
        },
        {
          value: 1,
          label: '星期一',
        },
        {
          value: 2,
          label: '星期二',
        },
        {
          value: 3,
          label: '星期三',
        },
        {
          value: 4,
          label: '星期四',
        },
        {
          value: 5,
          label: '星期五',
        },
        {
          value: 6,
          label: '星期六',
        },
      ],
    }
  },
  computed: {
    title() {
      let title
      if (this.type === 'add') {
        title = '新建取件时间'
      } else {
        title = '编辑取件时间'
      }
      return title
    },
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getDayList() {
      try {
        this.loading = true
        const res = await Time.list()
        if (res.data.length) {
          res.data.forEach(item => {
            item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
            item.name = this.getWeekName(item.dayValue)
          })
          this.tableData = res.data
        } else {
          this.tableData = []
        }

        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    getWeekName(day) {
      // eslint-disable-next-line default-case
      switch (day) {
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        case 7:
          return '星期日'
      }
    },
    confirmEdit() {
      // 修改角色信息
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.cacheForm.week !== this.form.week) {
            // eslint-disable-line
            try {
              let res
              if (this.type === 'add') {
                res = await Time.save(this.form.week)
              } else {
                res = await Time.update(this.id, this.form.week)
              }
              this.$message.success(`${res.msg}`)
              this.dialogFormVisible = false
              this.getDayList()
            } catch (e) {
              console.log(e)
            }
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    // handleEdit(val) {
    //   this.id = val.id
    //   this.form.week = val.dayValue
    //   this.cacheForm = { ...this.form }
    //   this.type = 'edit'
    //   this.dialogFormVisible = true
    // },
    goToChildren(val) {
      this.$router.push({ path: '/pickup/hour', query: { parentId: val.id } })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该取件日期, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Time.delete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getDayList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    create() {
      this.form = { ...this.baseForm }
      this.cacheForm = { ...this.baseForm }
      this.type = 'add'
      this.dialogFormVisible = true
    },
  },
  created() {
    this.getDayList()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .header {
    display: flex;
    align-items: center;

    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    margin-right: 30px;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
.groupListInfoDialog /deep/ .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}
.groupListInfoDialog /deep/ .el-dialog__header {
  padding-left: 30px;
}

.groupListInfoDialog /deep/ .el-dialog__body {
  padding: 30px;
}
</style>
