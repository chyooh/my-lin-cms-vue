<template>
  <div class="container">
    <div class="header">
      <!-- <div class="title">分类列表</div> -->
      <el-button type="primary" plain @click="create" size="medium">创建私有规格</el-button>
    </div>

    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
      <el-table-column fixed prop="goodsPrivateSpecName" label="名称" width="100"> </el-table-column>
      <el-table-column label="分类" width="150">
        <template slot-scope="props">
          {{ `${props.row.secondCategoryName}-${props.row.firstCategoryName}` }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="orderNumber" label="排序" width="100"> </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="235">
        <template slot-scope="props">
          <el-button type="primary" plain @click="goToChildren(props.row)" size="mini">查看</el-button>
          <!-- <el-button type="info" plain @click="handleEdit(props.row)" size="mini">编辑</el-button> -->
          <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <el-dialog
      title="创建私有规格"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      class="groupListInfoDialog"
    >
      <div style="margin-top: -25px">
        <el-form
          status-icon
          :rules="rules"
          :model="form"
          ref="form"
          label-position="right"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="规格名名称" prop="goodsPrivateSpecName">
            <el-input size="medium" clearable v-model="form.goodsPrivateSpecName"></el-input>
          </el-form-item>
          <el-form-item label="一级分类" prop="firstCategoryId">
            <el-select
              size="medium"
              v-model="form.firstCategoryId"
              placeholder="请选择"
              @change="firstCategoryIdChange"
            >
              <el-option
                v-for="(group, index) in firstCategoryId"
                :key="index"
                :label="group.catName"
                :value="group.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="secondCategoryId">
            <el-select size="medium" v-model="form.secondCategoryId" placeholder="请选择">
              <el-option
                v-for="(group, index) in secondCategoryId"
                :key="index"
                :label="group.catName"
                :value="group.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格排序" prop="orderNumber">
            <el-input size="medium" type="number" clearable v-model="form.orderNumber"></el-input>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" :loading="loading" @click="submitForm('form')">保 存</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Private from '@/model/private-spec'
import Category from '@/model/category'
import Util from '@/util/util'

export default {
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名称不能为空'))
      }
      callback()
    }
    const checkOrder = (rule, value, callback) => {
      if (!value || value < 1) {
        return callback(new Error('排序只能为大于0的数字'))
      }
      callback()
    }
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      dialogFormVisible: false, // 是否弹窗
      form: {
        goodsPrivateSpecName: '',
        orderNumber: 1,
        firstCategoryId: null,
        secondCategoryId: null,
      },
      rules: {
        goodsPrivateSpecName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      loading: false,
      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],
    }
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getSpecList() {
      try {
        this.loading = true
        const res = await Private.list()
        res.data.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
        })
        this.tableData = res.data
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async submitForm(formName) {
      if (!this.form.firstCategoryId) {
        this.$message.error('请选择一级分类')
        return false
      }
      if (!this.form.secondCategoryId) {
        this.$message.error('请选择二级分类')
        return false
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const res = await Private.save(this.form)
            this.loading = false
            this.$message.success(`${res.msg}`)
            this.resetForm('form')
            this.dialogFormVisible = false
            this.getSpecList()
          } catch (e) {
            this.loading = false
            console.log(e)
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    goToChildren(val) {
      this.$router.push({ path: '/spec-private/view', query: { val: JSON.stringify(val) } })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该规格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Private.delete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getSpecList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    create() {
      console.log('create')
      this.dialogFormVisible = true
    },
    // 获取所有分类
    async getAllCategory() {
      try {
        this.loading = true
        const res = await Category.categoryList()
        this.categoryList = res.data.rows
        this.categoryList.forEach(item => {
          const { catName, id } = item
          this.firstCategoryId.push({ catName, id })
        })
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    firstCategoryIdChange(val) {
      this.form.secondCategoryId = null
      this.secondCategoryId = []
      const obj = this.categoryList.find(item => item.id === val)
      if (obj.children.length) {
        obj.children.forEach(item => {
          const { catName, id } = item
          this.secondCategoryId.push({ catName, id })
        })
      }
    },
  },
  created() {
    this.getSpecList()
    this.getAllCategory()
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
