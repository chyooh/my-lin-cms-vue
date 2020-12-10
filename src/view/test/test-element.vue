<template>
  <div class="container" ref="container">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-form label-width="220px">
      <el-form-item label="普通示例">
        <upload-imgs ref="uploadEle3" :rules="rules" :multiple="true" />
        <div><el-button @click="getValue('uploadEle3')">获取当前图像数据</el-button></div>
      </el-form-item></el-form
    >
  </div>
</template>

<script type="text/ecmascript-6">
import UploadImgs from '@/component/base/upload-image'

/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
}
export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
  },
  mounted() {
    // const headerHeight = 72
    // const { clientHeight } = document.body
    // this.$refs.container.style.height = `${clientHeight - headerHeight}px`
  },
}
</script>

<style scoped lang="scss">
.container {
}
</style>
