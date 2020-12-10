<template>
  <div class="container">
    <el-row :gutter="20" type="flex" justify="space-between">
      <el-col :lg="10" :md="16" :sm="20" :xs="20">
        <div class="flex-container">
          <div class="header">{{ title }}</div>
          <span v-if="type === 'edit'" class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
        </div>
        <el-form
          status-icon
          :rules="rules1"
          :model="form1"
          ref="form1"
          label-position="right"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="规格名称" prop="goodsPublicSpecName">
            <el-input size="medium" clearable v-model="form1.goodsPublicSpecName"></el-input>
          </el-form-item>
          <el-form-item label="一级分类" prop="firstCategoryId">
            <el-select
              size="medium"
              v-model="form1.firstCategoryId"
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
            <el-select size="medium" v-model="form1.secondCategoryId" placeholder="请选择">
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
            <el-input size="medium" type="number" clearable v-model="form1.orderNumber"></el-input>
          </el-form-item>
          <el-form-item label="是否为多选" prop="onlyOneSelect1">
            <el-switch v-model="form1.onlyOneSelect1"> </el-switch>
          </el-form-item>
          <el-form-item label="是否为必选" prop="mustSelect1">
            <el-switch v-model="form1.mustSelect1"> </el-switch>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" :loading="loading1" @click="submitForm('form1')">保 存</el-button>
            <el-button @click="resetForm('form1')">重 置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- <el-col :lg="14" :md="20" :sm="24" :xs="24">
        <div class="flex-container">
          <div class="header">
            <div>规格值列表</div>
            <el-button type="primary" plain @click="create" size="medium">添加规格值</el-button>
          </div>
          <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
        </div>

        <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
          <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
          <el-table-column fixed prop="goodsPublicSpecValue" label="规格值名称" width="100"> </el-table-column>
          <el-table-column label="是否为结束标记" width="100">
            <template slot-scope="props">
              <span>{{ props.row.end === 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="orderNumber" label="排序" width="100"> </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" min-width="200"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="235">
            <template slot-scope="props">
              <el-button type="primary" plain @click="handleEdit(props.row)" size="mini">编辑</el-button>
              <el-button type="danger" plain @click="handleDelete(props.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col> -->
    </el-row>
    <!-- 弹窗 -->
    <!-- <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogFormVisible" class="groupListInfoDialog">
      <div style="margin-top: -25px">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="140px"
          :model="form"
          label-position="right"
          :rules="rules"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="规格值名称" prop="goodsPublicSpecValue">
            <el-input size="medium" clearable v-model="form.goodsPublicSpecValue"></el-input>
          </el-form-item>
          <el-form-item label="规格值排序" prop="orderNumber">
            <el-input size="medium" type="number" clearable v-model="form.orderNumber"></el-input>
          </el-form-item>
          <el-form-item label="是否为结束标记" prop="end">
            <el-switch v-model="form.end1"> </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left: 5px">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Public from '@/model/public-spec'
import Category from '@/model/category'

export default {
  components: {},
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('规格名不能为空'))
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
      type: 'add',
      title: '新建规格',
      id: 0, // 角色id
      tableData: [], // 表格数据
      dialogFormVisible: false, // 是否弹窗
      baseForm: {
        // 表单信息
        goodsPublicSpecValue: '',
        orderNumber: 1,
        end1: false,
      },
      form: {
        // 表单信息
        goodsPublicSpecValue: '',
        orderNumber: 1,
        end1: false,
      },
      cacheForm: {
        // 缓存第一次的表单信息
        goodsPublicSpecValue: '',
        orderNumber: 1,
        end1: false,
      },
      loading: false,
      loading1: false,
      rules: {
        // 表单验证规则
        goodsPublicSpecValue: [{ required: true, message: '规格值名称不能为空', trigger: 'blur' }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },
      goodsPublicSpecId: 0,
      form1: {
        goodsPublicSpecName: '',
        orderNumber: 1,
        firstCategoryId: null,
        secondCategoryId: null,
        onlyOneSelect1: false,
        mustSelect1: true,
      },
      rules1: {
        goodsPublicSpecName: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        orderNumber: [{ validator: checkOrder, trigger: ['blur', 'change'], required: true }],
      },

      categoryList: [],
      firstCategoryId: [],
      secondCategoryId: [],
    }
  },

  methods: {
    async getInfoList() {
      try {
        this.loading = true
        const res = await Public.infoList(this.goodsPublicSpecId)
        if (res.data.length) {
          res.data.forEach(item => {
            item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
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
    async confirmEdit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (
            this.cacheForm.goodsPublicSpecValue !== this.form.goodsPublicSpecValue
            || this.cacheForm.orderNumber !== this.form.orderNumber
            || this.cacheForm.end1 !== this.form.end1
          ) {
            try {
              let res
              this.form.goodsPublicSpecId = this.goodsPublicSpecId
              this.form.end = this.form.end1 ? 1 : 0
              if (this.type === 'add') {
                res = await Public.infoSave(this.form)
              } else {
                this.form.id = this.id
                res = await Public.infoUpdate(this.form)
              }
              this.$message.success(`${res.msg}`)
              this.dialogFormVisible = false
              this.getInfoList()
            } catch (e) {
              console.log(e)
            }
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
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      this.id = val.id
      this.form.goodsPublicSpecValue = val.goodsPublicSpecValue
      this.form.orderNumber = val.orderNumber
      this.form.end1 = val.end === 1
      this.cacheForm = { ...this.form }
      this.type = 'edit'
      this.dialogFormVisible = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该规格值, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Public.infoDelete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getInfoList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    create() {
      console.log('create')
      this.form = { ...this.baseForm }
      this.cacheForm = { ...this.baseForm }
      this.type = 'add'
      this.dialogFormVisible = true
    },

    async submitForm(formName) {
      if (!this.form1.firstCategoryId) {
        this.$message.error('请选择一级分类')
        return false
      }
      if (!this.form1.secondCategoryId) {
        this.$message.error('请选择二级分类')
        return false
      }
      this.setFirstCategoryName(this.form1.firstCategoryId)
      this.setSecondCategoryName(this.form1.secondCategoryId)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.form1.onlyOneSelect = this.form1.onlyOneSelect1 ? 1 : 0
            this.form1.mustSelect = this.form1.mustSelect1 ? 1 : 0
            this.form1.id = this.goodsPublicSpecId
            this.loading1 = true
            let res
            if (this.type === 'add') {
              res = await Public.save(this.form1)
            } else {
              res = await Public.update(this.form1)
            }
            this.loading1 = false
            this.$message.success(`${res.msg}`)
          } catch (e) {
            this.loading1 = false
            console.log(e)
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
    // 获取所有分类
    async getAllCategory() {
      try {
        this.loading = true
        const res = await Category.categoryList()
        if (res.data.rows.length) {
          this.categoryList = res.data.rows
          this.categoryList.forEach(item => {
            const { catName, id } = item
            this.firstCategoryId.push({ catName, id })
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    firstCategoryIdChange(val) {
      if (val) {
        this.form1.secondCategoryId = null
        this.secondCategoryId = []
        const obj = this.categoryList.find(item => item.id === val)
        if (obj.children.length) {
          obj.children.forEach(item => {
            const { catName, id } = item
            this.secondCategoryId.push({ catName, id })
          })
        }
      }
    },
    back() {
      this.$router.go(-1)
    },
    setFirstCategoryName(id) {
      const obj = this.firstCategoryId.find(item => item.id === id)
      this.form.firstCategoryName = obj.catName
    },
    setSecondCategoryName(id) {
      const obj = this.secondCategoryId.find(item => item.id === id)
      this.form.secondCategoryName = obj.catName
    },
  },
  async created() {
    await this.getAllCategory()

    if (this.$route.query.val) {
      const val = JSON.parse(this.$route.query.val)
      this.type = 'edit'
      this.title = '编辑规格'
      this.goodsPublicSpecId = val.id
      this.form1.goodsPublicSpecName = val.goodsPublicSpecName
      this.form1.firstCategoryId = val.firstCategoryId || null
      this.firstCategoryIdChange(this.form1.firstCategoryId)
      this.form1.secondCategoryId = val.secondCategoryId || null
      this.form1.orderNumber = val.orderNumber
      this.form1.onlyOneSelect1 = val.onlyOneSelect === 1
      this.form1.mustSelect1 = val.mustSelect === 1
    }
    // await this.getInfoList()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .header {
    display: flex;
    align-items: center;
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    div {
      margin-right: 30px;
    }
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
