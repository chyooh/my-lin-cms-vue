<template>
  <div id="app"><router-view /></div>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'

export default {
  data() {
    return {
      timer: null,
      eventBus: new Vue(),
    }
  },
  mounted() {
    document.getElementById('loader').style.display = 'none'
  },
  provide() {
    // eventBus挂载的事件： addGroup addUser
    return {
      eventBus: this.eventBus,
    }
  },
  methods: {
    ...mapActions(['loginOut']),
  },
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition-delay: 99999s;
    transition: color 99999s ease-out, background-color 99999s ease-out;
  }
  .my-draw {
    .el-drawer__body {
      overflow-y: auto;
    }
    :focus {
      outline: 0;
    }
  }
  .my-draw:focus {
    outline: 0;
  }
  .el-radio--small.is-bordered {
    margin-bottom: 10px;
  }
  .form-container {
    table {
      .el-button {
        margin: 0 10px 10px 0;
      }

      .el-table__expanded-cell {
        border-bottom: 1px solid #ebeef5;
      }
    }
    .form-item-long {
      .el-input--mini .el-input__inner {
        width: 210px;
      }
    }
    .el-input--mini .el-input__inner {
      width: 130px;
      padding-right: 10px;
    }
    .el-form--inline .el-form-item__label {
      padding-right: 10px;
    }
    .line {
      display: inline-block;
      width: 20px;
      text-align: center;
    }

    .form-item-div {
      display: inline-block;
      margin-right: 15px;
    }
  }

  .el-form--inline .el-form-item {
    // margin-bottom: 0px !important;
    margin-right: 0;
  }
  .el-form--inline .el-form-item__content {
    margin-bottom: 0;
  }
  .margin-bottom10 {
    margin-bottom: 10px;
  }
  .margin-right10 {
    margin-right: 10px;
  }
  .goods-create {
    // .el-form-item__content {
    //   margin-bottom: 0px;
    // }
    .add-container {
      .el-form-item__content {
        margin-bottom: 10px;
      }
    }
  }
  .child-container {
    .el-form-item {
      .el-form-item__label {
        line-height: 30px;
        white-space: nowrap;
      }
      .el-form-item__content {
        line-height: 30px;
      }
      .el-input__inner {
        width: 80px;
      }
    }
  }
}
</style>
