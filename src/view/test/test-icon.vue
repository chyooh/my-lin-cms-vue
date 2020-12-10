<template>
  <div class="container" ref="container">
    <div><i class="iconfont icon-rizhiguanli"></i> <span>rizhiguanli</span></div>
    <div><i class="iconfont icon-weibiaoti"></i> <span>weibiaoti</span></div>
    <div><i class="iconfont icon-moshubang"></i> <span>moshubang</span></div>
    <div><i class="iconfont icon-zidingyi"></i> <span>zidingyi</span></div>
    <div><i class="iconfont icon-icon-test"></i> <span>icon-test</span></div>
    <div><i class="iconfont icon-xsaaa"></i> <span>xsaaa</span></div>
    <div><i class="iconfont icon-jiemiansheji"></i> <span>jiemiansheji</span></div>
    <div><i class="iconfont icon-tushuguanli"></i> <span>tushuguanli</span></div>
    <div><i class="iconfont icon-erjituandui"></i> <span>erjituandui</span></div>
    <div><i class="iconfont icon-weibiaoti"></i> <span>dingdanguanli</span></div>
    <div><i class="iconfont icon-weibiaoti"></i> <span>dingdanguanli</span></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  mounted() {
    // const headerHeight = 72
    // const { clientHeight } = document.body
    // this.$refs.container.style.height = `${clientHeight - headerHeight}px`
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .page-404 {
    width: 349px;
    height: 190px;
  }
  .page-logo {
    position: absolute;
    right: 40px;
    bottom: 40px;
    width: 60px;
    height: 98px;
  }
  .icon-dingdanguanli {
    color: red;
  }
}
</style>
