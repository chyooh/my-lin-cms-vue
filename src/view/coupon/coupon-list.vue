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
      <div class="form-item-div">
        <el-form-item label="优惠券id" prop="id">
          <el-input size="mini" type="number" clearable v-model="filterForm.id"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="状态" prop="status">
          <el-select size="mini" v-model="filterForm.status" placeholder="请选择">
            <el-option v-for="(group, index) in status" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="使用门槛" prop="threshold">
          <el-select size="mini" v-model="filterForm.threshold" placeholder="请选择">
            <el-option v-for="(group, index) in threshold" :key="index" :label="group.label" :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="面额">
          <el-form-item prop="formValues">
            <el-input
              size="mini"
              type="number"
              :min="0"
              clearable
              v-model="filterForm.formValues"
              placeholder="最小面额"
            ></el-input>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="formValuee">
            <el-input
              size="mini"
              type="number"
              :min="filterForm.formValues"
              clearable
              v-model="filterForm.formValuee"
              placeholder="最大面额"
            ></el-input>
          </el-form-item>
        </el-form-item>
      </div>
      <div class="form-item-div">
        <el-form-item label="创建时间">
          <el-form-item prop="filter_createTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createTimes"
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
          <el-form-item prop="filter_createTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_createTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return (
                    time.getTime() > Date.now() ||
                    time.getTime() < new Date(filterForm.filter_createTimes + ' 00:00:00')
                  )
                },
              }"
              placeholder="选择结束时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="优惠券起始时间">
          <el-form-item prop="filter_startTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_startTimes"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="filter_startTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_startTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() < new Date(filterForm.filter_startTimes + ' 00:00:00')
                },
              }"
              placeholder="选择结束时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </div>

      <div class="form-item-div">
        <el-form-item label="优惠券过期时间">
          <el-form-item prop="filter_endTimes">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_endTimes"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <div class="line">-</div>
          <el-form-item prop="filter_endTimee">
            <el-date-picker
              size="mini"
              v-model="filterForm.filter_endTimee"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() < new Date(filterForm.filter_endTimes + ' 00:00:00')
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
      <el-table-column fixed prop="name" label="名称" width="150"> </el-table-column>
      <el-table-column fixed label="类型" width="70">
        <template slot-scope="props">
          {{ props.row.type === 1 ? '平台券' : '券码券' }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="totalNum" label="发放总数" width="80"> </el-table-column>
      <el-table-column fixed prop="limitNum" label="每人限领" width="80"> </el-table-column>
      <el-table-column label="状态" width="50">
        <template slot-scope="props">
          {{
            props.row.status === 1 ? '上架' : props.row.status === 2 ? '下架' : props.row.status === 3 ? '草稿' : '过期'
          }}
        </template>
      </el-table-column>
      <el-table-column label="面额" width="100">
        <template slot-scope="props">
          {{ Util.getPriceString(props.row.formValue) }}
        </template>
      </el-table-column>
      <el-table-column label="领取后有效天数" prop="validDays" width="120"></el-table-column>
      <el-table-column label="门槛额度" width="80">
        <template slot-scope="props">
          {{ props.row.threshold === 1 ? '无门槛' : props.row.thresholdValue }}
        </template>
      </el-table-column>
      <el-table-column label="指定商品" width="120">
        <template slot-scope="props">
          <div v-if="props.row.assign === 1">全部商品可用</div>
          <div v-else>
            <el-tag
              class="goodsid-tag"
              v-for="item in props.row.goodsCouponVos"
              :key="item.goodsId"
              size="small"
              effect="plain"
            >
              {{ item.goodsName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否可叠加" width="90">
        <template slot-scope="props">
          {{ props.row.overlayUse === 1 ? '可叠加' : '不可叠加' }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="startTime" label="优惠券开始时间" width="150"> </el-table-column>
      <el-table-column sortable prop="endTime" label="优惠券结束时间" width="150"> </el-table-column>
      <!-- <el-table-column prop="url" label="优惠券活动页面链接" width="300"> </el-table-column> -->
      <!-- <el-table-column sortable prop="createTime" label="创建时间" width="150"> </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="props">
          <el-button
            v-permission="['admin:coupon:view', 'admin:coupon:edit']"
            type="primary"
            plain
            @click="handleEdit(props.row.id)"
            size="mini"
            >查看</el-button
          >
          <el-button
            v-permission="'admin:coupon:edit'"
            v-if="props.row.status === 2"
            type="success"
            plain
            @click="handleOn(props.row.id)"
            size="mini"
            >上架</el-button
          >
          <el-button
            v-permission="'admin:coupon:edit'"
            v-if="props.row.status === 1"
            type="info"
            plain
            @click="handleOff(props.row.id)"
            size="mini"
            >下架</el-button
          >
          <el-button
            v-permission="'admin:coupon:del'"
            type="danger"
            plain
            @click="handleDelete(props.row.id)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
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
import Coupon from '@/model/coupon'
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
      threshold: [
        { label: '不限', value: null },
        { label: '无门槛', value: 1 },
        { label: '有门槛', value: 2 },
      ],
      status: [
        { label: '不限', value: null },
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
        { label: '已过期', value: 4 },
      ],
      filterForm: {
        id: null,
        threshold: null,
        status: null,
        formValues: null,
        formValuee: null,
        filter_createTimes: null,
        filter_createTimee: null,
        filter_startTimes: null,
        filter_startTimee: null,
        filter_endTimes: null,
        filter_endTimee: null,
      },
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getGoodsList() {
      const { pageNumber, pageSize } = this
      try {
        this.loading = true
        const res = await Coupon.list({ ...this.filterForm, pageSize, pageNumber }) // eslint-disable-line
        // console.log(res)
        this.loading = false
        res.data.rows.forEach(item => {
          // item.createTime = new Date(item.createTime).toLocaleString('chinese', { hour12: false })
          item.startTime = item.startTime ? Util.getDateString(item.startTime) : item.startTime
          item.endTime = item.endTime ? Util.getDateString(item.endTime) : item.endTime
        })
        this.tableData = res.data.rows
        this.total_nums = res.data.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    handleEdit(id) {
      this.$router.push({
        path: '/coupon/add',
        query: { id },
      })
    },
    // 上架
    async handleOn(id) {
      try {
        this.loading = true
        const res = await Coupon.on(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getGoodsList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 下架
    async handleOff(id) {
      try {
        this.loading = true
        const res = await Coupon.off(id)
        this.loading = false
        this.$message.success(`${res.msg}`)
        this.getGoodsList()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          const res = await Coupon.delete(id)
          this.loading = false
          this.$message.success(`${res.msg}`)
          this.getGoodsList()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
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
