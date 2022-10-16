<template>
  <div class="step3-study_wrap">
    <!-- 学习任务 -->
    <!-- 奖励模块 -->
    <award-module
      :addData="addData"
      @handleDeleteModule="(index) => $emit('handleDeleteModule', index)"
      @handleAddModule="() => $emit('handleAddModule')"
      @handleDeleteAward="(index, ci, cci) => $emit('handleDeleteAward', index, ci, cci)"
      @addSetUp="(index, ci) => $emit('addSetUp', index, ci)"
      @setUp="(index) => $emit('setUp', index)"
      :isDetail="isDetail"
    ></award-module>
  </div>
</template>

<script>
import award_module from './award-module'

export default {
  name: "step3_study",
  components: {
    'award-module': award_module
  },
  props: {
    addData: {
      type: Object,
      default () {
        return {}
      }
    },
    isDetail: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  watch: {
    // addData: {
    //   immediate: true,
    //   handler (newValue) {
    //     console.log("newValue", newValue)
    //     this.addData = newValue
    //   }
    // },
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.step3-study_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.line_wrap {
  // width: ~"calc(100vw - 300px)";
  // margin-left: -60%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  .line {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    .item {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
    }
    .delete {
      font-size: 16px;
      color: red;
      margin-left: 4px;
      font-weight: 600;
      cursor: pointer;
      width: 20px;
      height: 20px;
      background-color: red;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-top: 4px;
      .delete_icon {
        font-size: 30px;
        height: 2px;
        color: #fff;
        z-index: 10;
        border-top: 1px solid #fff;
        width: 60%;
      }
    }
    .add {
      font-size: 16px;
      color: #2fc809;
      margin-left: 4px;
      font-weight: 600;
      cursor: pointer;
      width: 20px;
      height: 20px;
      background-color: #2fc809;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      margin-top: 4px;
      position: relative;
      margin-right: 4px;
      .add_horizontal_icon {
        font-size: 30px;
        height: 2px;
        color: #fff;
        z-index: 10;
        border-top: 1px solid #fff;
        width: 60%;
        position: absolute;
      }
      .add_vertical_icon {
        font-size: 30px;
        height: 60%;
        color: #fff;
        z-index: 10;
        border-right: 1px solid #fff;
        width: 1px;
        // margin-left: 50%;
        position: absolute;
      }
    }
  }
}
.adForm {
  .line {
    display: flex;
    justify-content: flex-start;
    // margin-top: 4px;
    .item {
      margin-right: 4px;
      .name {
        font-size: 15px;
      }
      .name {
        font-size: 15px;
      }
      .delete_award {
        font-size: 16px;
        color: red;
        margin-left: 4px;
        font-weight: 600;
        cursor: pointer;
        width: 20px;
        height: 20px;
      }
    }
    .fence_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 4px;
    }
  }
  /deep/ .ivu-input-wrapper {
    input {
      width: 220px;
    }
  }
  /deep/ .ivu-select {
    width: 220px;
  }
  /deep/ .operator {
    .ivu-input-wrapper {
      input {
        width: 100%;
      }
    }
  }
  .cancel_btn {
    margin-left: 8px;
  }
}
</style>
