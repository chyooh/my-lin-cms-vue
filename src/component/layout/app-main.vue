<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <keep-alive>
        <transition name="fade-transform" mode="out-in" v-if="$route.meta.keepAlive">
          <router-view class="router-view"></router-view>
        </transition>
      </keep-alive>
      <transition name="fade-transform" mode="out-in" v-if="!$route.meta.keepAlive">
        <router-view class="router-view"></router-view>
      </transition>
      <!-- <router-view></router-view> -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  watch: {
    $route() {
      if (this.$previewInstance) {
        this.$previewInstance.destroy()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
