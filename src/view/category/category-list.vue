<template>
  <div class="container">
    <div class="header">
      <!-- <div class="title">分类列表</div> -->
      <el-button v-permission="'admin:category:add'" type="primary" plain @click="create" size="medium"
        >创建分类</el-button
      >
    </div>

    <el-table :data="tableData" :default-sort="{ prop: 'id', order: 'descending' }" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" sortable width="100"> </el-table-column>
      <!-- <el-table-column fixed prop="coverImage" label="图片" width="100">
        <template slot-scope="props">
          <el-image :src="props.row.coverImage" fit="contain"></el-image>
        </template>
      </el-table-column> -->
      <el-table-column fixed prop="catName" label="名称" width="100"> </el-table-column>
      <el-table-column sortable prop="orderNumber" label="排序" width="100"> </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="235">
        <template slot-scope="props">
          <el-button type="primary" plain @click="goToChildren(props.row)" size="mini">子分类</el-button>
          <el-button v-permission="'admin:category:edit'" type="info" plain @click="handleEdit(props.row)" size="mini"
            >编辑</el-button
          >
          <el-button
            v-permission="'admin:category:del'"
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
          <el-form-item label="名称" prop="catName">
            <el-input size="medium" clearable v-model="form.catName"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNumber">
            <el-input size="medium" type="number" clearable v-model="form.orderNumber"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="coverImage" label="图片">
            <upload-imgs
              ref="uploadImgs"
              :value="initImg"
              :rules="rules1"
              :max-num="1"
              :remote-fuc="remoteFuc"
              @onChange="handleChange('uploadImgs')"
              @upload="handleUpload"
            />
          </el-form-item> -->
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
import Category from '@/model/category'
import Util from '@/util/util'
// import User from '@/model/user'
// import UploadImgs from '@/component/base/upload-image'

/** 生成随机字符串 */
// function createId() {
//   return Math.random().toString(36).substring(2)
// }
export default {
  // components: {
  //   UploadImgs,
  // },
  data() {
    return {
      id: 0, // 角色id
      tableData: [], // 表格数据
      dialogFormVisible: false, // 是否弹窗
      baseForm: {
        // 表单信息
        catName: '',
        orderNumber: 1,
        coverImage: '',
      },
      form: {
        // 表单信息
        catName: '',
        orderNumber: 1,
        coverImage: '',
      },
      cacheForm: {
        // 缓存第一次的表单信息
        catName: '',
        orderNumber: 1,
        coverImage: '',
      },
      loading: false,
      rules: {
        // 表单验证规则
        catName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        coverImage: [{ required: true }],
        orderNumber: [{ required: true, message: '请输入分类排序', trigger: 'blur' }],
      },
      rules1: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      type: 'add',
      initImg: [],
    }
  },
  computed: {
    title() {
      let title
      if (this.type === 'add') {
        title = '新建分类'
      } else {
        title = '编辑分类'
      }
      return title
    },
  },
  methods: {
    // 获取所有角色并传给table渲染
    async getCategoryList() {
      try {
        this.loading = true
        const res = await Category.categoryList()
        if (res.data.rows.length) {
          res.data.rows.forEach(item => {
            item.createTime = Util.getDateString(item.createTime)
          })
          this.tableData = res.data.rows
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
      // 修改角色信息
      if (this.form.catName === '') {
        this.$message.warning('请将信息填写完整')
        return
      }
      if (this.form.orderNumber < 1) {
        this.$message.warning('请输入分类排序')
        return
      }
      // if (this.form.coverImage === '') {
      //   this.$message.warning('请选择分类的图片')
      //   return
      // }
      if (
        this.cacheForm.catName !== this.form.catName ||
        this.cacheForm.orderNumber !== this.form.orderNumber ||
        this.cacheForm.coverImage !== this.form.coverImage
      ) {
        // eslint-disable-line
        try {
          let res
          if (this.type === 'add') {
            res = await Category.save(this.form)
          } else {
            this.form.id = this.id
            res = await Category.update(this.form)
          }
          this.$message.success(`${res.msg}`)
          this.dialogFormVisible = false
          this.getCategoryList()
        } catch (e) {
          console.log(e)
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      this.id = val.id
      this.form.catName = val.catName
      this.form.orderNumber = val.orderNumber
      this.form.coverImage = val.coverImage
      // if (val.coverImage) {
      //   this.initImg = [
      //     {
      //       id: createId(),
      //       display: val.coverImage,
      //       src: '',
      //       imgId: createId(),
      //     },
      //   ]
      // }
      this.cacheForm = { ...this.form }
      this.type = 'edit'
      this.dialogFormVisible = true
    },
    goToChildren(val) {
      this.$router.push({ path: '/category/child', query: { parentId: val.id, title: val.catName } })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Category.delete(val.id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getCategoryList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    create() {
      // console.log('create')
      this.form = { ...this.baseForm }
      this.cacheForm = { ...this.baseForm }
      this.initImg = []
      this.type = 'add'
      this.dialogFormVisible = true
    },

    // async remoteFuc(img) {
    //   try {
    //     const res = await User.upload(img.file)
    //     const data = { url: img.display, path: JSON.parse(res.data).base, id: img.id }
    //     return data
    //   } catch (e) {
    //     console.log(e)
    //   }
    // },
    // async handleChange(name) {
    //   await this.$refs[name].getValue()
    // },
    // handleUpload(result) {
    //   if (result.length) {
    //     this.form.coverImage = result[0].src
    //   } else {
    //     this.form.coverImage = ''
    //   }
    // },
  },
  async created() {
    await this.getCategoryList()
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
