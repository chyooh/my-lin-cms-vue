<template>
  <div class="container form-container">
    <!-- <div class="title">优惠券列表</div> -->
    <el-form
      :model="filterForm"
      status-icon
      label-position="right"
      ref="filterForm"
      @submit.native.prevent
      class="form"
      inline
    >
      <!-- <div class="form-item-div">
        <el-form-item label="优惠券id" prop="id">
          <el-input size="mini" type="number" clearable v-model="filterForm.id"></el-input>
        </el-form-item>
      </div> -->
      <div class="form-item-div">
        <el-form-item label="用户名" prop="username">
          <el-input size="mini" clearable v-model="filterForm.username"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="风险等级" prop="riskinfoNsfCommon">
          <el-select size="mini" v-model="filterForm.riskinfoNsfCommon" placeholder="请选择">
            <el-option
              v-for="(group, index) in riskinfoNsfCommon"
              :key="index"
              :label="group.label"
              :value="group.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="创建时间">
          <el-form-item prop="createTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.createTimes"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now()
                },
              }"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="createTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.createTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now() || time.getTime() < new Date(filterForm.createTimes + ' 00:00:00')
                },
              }"
              placeholder="选择结束时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item class="submit">
          <el-button size="mini" type="primary" @click="submitFilterForm('filterForm')">搜 索</el-button>
          <el-button size="mini" @click="resetFilterForm('filterForm')">重 置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" stripe v-loading="loading">
      <el-table-column fixed prop="id" label="id" width="50"> </el-table-column>
      <el-table-column fixed prop="riskinfoNsfCommon" label="风险等级" width="150">
        <template slot-scope="props">
          <el-tag type="danger">{{
            props.row.riskinfoNsfCommon === 'rank1' ? '低' : props.row.riskinfoNsfCommon === 'rank2' ? '中' : '高'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed prop="username" label="用户名称" width="150"> </el-table-column>
      <el-table-column fixed prop="userId" label="用户id" width="180"> </el-table-column>
      <el-table-column fixed prop="uniqueId" label="唯一识别码" width="280"> </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageSize"
        :current-page="pageNumber"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Credit from '@/model/credit'
import Util from '@/util/util'

export default {
  data() {
    return {
      total_nums: 0, // 分组内的用户总数
      pageNumber: 1, // 默认获取第一页的数据
      pageSize: 10, // 每页10条数据
      tableData: [], // 表格数据
      loading: false,
      Util,
      riskinfoNsfCommon: [
        { label: '不限', value: null },
        { label: 'rank1', value: 'rank1' },
        { label: 'rank2', value: 'rank2' },
        { label: 'rank3', value: 'rank3' },
      ],
      filterForm: {
        id: null,
        riskinfoNsfCommon: null,
        createTimes: null,
        createTimee: null,
      },
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getGoodsList() {
      const { pageNumber, pageSize } = this
      try {
        this.loading = true
        const res = await Credit.userCreditlist({ ...this.filterForm, pageSize, pageNumber }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        res.data.rows.forEach(item => {
          item.createTime = Util.getDateString(item.createTime)
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 切换table页
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getGoodsList()
    },
    submitFilterForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          this.pageNumber = 1
          await this.getGoodsList()
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetFilterForm(formName) {
      this.$refs[formName].resetFields()
      this.getGoodsList()
    },
  },
  created() {
    this.getGoodsList()
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
