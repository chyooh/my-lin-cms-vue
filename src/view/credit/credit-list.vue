<template>
  <div class="container form-container">
    <div class="title">信用额度列表</div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <el-table :data="tableData" stripe v-loading="loading">
          <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
          <el-table-column fixed prop="riskinfoNsfCommon" label="信用等级" width="100">
            <template slot-scope="props">
              <el-tag type="danger">{{
                props.row.riskinfoNsfCommon === 'rank1' ? '高' : props.row.riskinfoNsfCommon === 'rank2' ? '中' : '低'
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed prop="precent" label="百分比(%)" width="180"> </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="props">
              <el-button
                v-permission="'admin:credit:payment:edit'"
                type="primary"
                plain
                @click="handleEdit(props.row)"
                size="mini"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog
      title="编辑信用额度"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      class="groupListInfoDialog"
    >
      <div style="margin-top: -25px">
        <el-form
          v-if="dialogFormVisible"
          status-icon
          :rules="rules"
          :model="form"
          ref="form"
          label-position="right"
          label-width="120px"
          @submit.native.prevent
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="信用等级" prop="riskinfoNsfCommon">
            <el-radio-group v-model="form.riskinfoNsfCommon" size="medium" disabled>
              <el-radio label="rank1" border>高</el-radio>
              <el-radio label="rank2" border>中</el-radio>
              <el-radio label="rank3" border>低</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="百分比(%)" prop="precent">
            <el-input size="medium" type="number" :min="0" :max="100" v-model="form.precent"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left: 5px">
        <el-button type="primary" :loading="loading1" @click="submitForm('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Credit from '@/model/credit'
import Util from '@/util/util'

export default {
  data() {
    const checkPrice = (rule, value, callback) => {
      if (!value || value > 100) {
        return callback(new Error('百分比只能为0-100'))
      }
      callback()
    }

    return {
      pageNumber: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      tableData: [], // 表格数据
      loading: false,
      Util,
      form: {
        id: null,
        precent: null,
        riskinfoNsfCommon: 'rank1',
      },

      cacheForm: {
        // 缓存第一次的表单信息
        id: null,
        precent: null,
        riskinfoNsfCommon: 'rank1',
      },
      rules: {
        precent: [{ validator: checkPrice, required: true }],
      },
      loading1: false,
      dialogFormVisible: false,
    }
  },

  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getCreditList() {
      // const { pageNumber, pageSize } = this
      try {
        this.loading = true
        const res = await Credit.list() // eslint-disable-line
        // console.log(res)
        this.loading = false
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
          item.precent = parseFloat((item.precent * 100).toPrecision(12))
        })
        this.tableData = res.data.rows
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    handleEdit(row) {
      const { id, precent, riskinfoNsfCommon } = row
      this.form = { id, precent, riskinfoNsfCommon }
      this.cacheForm = { ...this.form }
      this.dialogFormVisible = true
    },

    // 提交商品表单
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          if (this.cacheForm.precent !== this.form.precent) {
            try {
              this.loading1 = true
              const { id, precent, riskinfoNsfCommon } = this.form
              const res = await Credit.update({
                id,
                precent: precent / 100,
                riskinfoNsfCommon,
              })
              this.loading1 = false
              this.$message.success(`${res.msg}`)
              this.dialogFormVisible = false
              this.getCreditList()
            } catch (e) {
              this.loading1 = false
              // console.log(e)
            }
          } else {
            this.dialogFormVisible = false
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
  },
  created() {
    this.getCreditList()
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 10px;
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 20px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
.my-draw {
  .form {
    padding: 0 20px;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
.goodsid-tag {
  margin: 2px 5px 2px 0;
}
</style>
