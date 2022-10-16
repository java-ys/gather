// 第三步的设置奖励模块
<template>
  <div class="step3-award-module_wrap">
    <div>
      <div v-for="(item, index) in addData.setRewardList" :key="index">
        <div class="line_wrap">
          <!-- 是否需要有级联条件 -->
          <!-- 譬如完单需要配置完单 并且 设置奖励 -->
          <FormItem
            v-if="item.hasBindPrefix && item.prefixProp === 'completeCount'"
            :label="
              addData.eachOrderReward == 1
                ? '奖励门槛：' + item.prefixName
                : item.prefixName
            "
            :prop="'setRewardList.' + index + '.completeCount'"
            class="ivu-form-item-required"
            :rules="ruleValidate.completeCount"
          >
            <InputNumber
              v-model="addData.setRewardList[index][item.prefixProp]"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
              :min="addData.eachOrderReward == 1 ? 0 : 1"
              :max="100000"
            />
          </FormItem>
          <FormItem
            v-if="item.prefixProp === 'shareStartAmount' && item.hasBindPrefix"
            :label="item.prefixName"
            :prop="'setRewardList.' + index + '.shareStartAmount'"
            :rules="ruleValidate.shareStartAmount"
            class="ivu-form-item-required"
          >
            <Input
              v-if="item.prefixProp === 'shareStartAmount'"
              v-model="addData.setRewardList[index][item.prefixProp]"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
            />
          </FormItem>
          <!-- 奖励类型 -->
          <FormItem
            label="奖励类型："
            prop="taskAwardType"
            class="ivu-form-item-required"
          >
            <div class="line">
              <div class="item">
                <Button
                  v-if="
                    addData.setRewardList[index] &&
                    addData.setRewardList[index].parentRewardList &&
                    addData.setRewardList[index].parentRewardList.length ===
                      0 &&
                    !isDetail
                  "
                  type="primary"
                  @click="$emit('setUp', index)"
                >
                  设置奖励
                </Button>
              </div>
              <div class="item award_list">
                <div
                  v-for="(c, ci) in addData.setRewardList[index]
                    .parentRewardList"
                  :key="c.prCode + ci"
                  class="item"
                >
                  <div
                    v-for="(cc, cci) in c.subRewardList"
                    :key="cc.srCode + cci"
                    class="item"
                  >
                    <span class="name" @click="goAwardDetail(c)"
                      >{{ c.prName }}-{{ cc.srName }}</span
                    >
                    <span
                      class="delete_award"
                      v-if="!isDetail"
                      @click="$emit('handleDeleteAward', index, ci, cci)"
                      >X</span
                    >
                  </div>
                </div>
                <div class="item">
                  <Button
                    v-if="
                      addData.setRewardList[index] &&
                      addData.setRewardList[index].parentRewardList &&
                      addData.setRewardList[index].parentRewardList.length ===
                        1 &&
                      addData.setRewardList[index].parentRewardList[0]
                        .subRewardList.length === 1 &&
                      !isDetail
                    "
                    type="primary"
                    @click="$emit('addSetUp', index)"
                  >
                    增加奖励
                  </Button>
                </div>
              </div>
              <div class="item" v-if="addData.eachOrderReward != 1">
                <div
                  class="delete"
                  @click="$emit('handleDeleteModule', index)"
                  v-if="
                    index >= 0 && !isDetail && addData.setRewardList.length > 1
                  "
                >
                  <!-- <div class="delete_icon"></div> -->
                  <img :src="deleteicon" alt="" />
                </div>
                <div
                  class="add"
                  @click="$emit('handleAddModule')"
                  v-if="index === addData.setRewardList.length - 1 && !isDetail"
                >
                  <img :src="addicon" alt="" />
                </div>
              </div>
            </div>
          </FormItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addicon from "_o/assets/add_icon.png";
import deleteicon from "_o/assets/delete_icon.png";

import {
  orderSourceOptions,
  awardCalculateOptions,
} from "../../../../config/fields";

export default {
  name: "step3_award-module",
  props: {
    addData: {
      type: Object,
      default() {
        return {};
      },
    },
    isDetail: {
      type: Boolean,
      default() {
        return false;
      },
    },
    ruleValidate: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      addicon,
      deleteicon,
      orderSourceOptions,
      awardCalculateOptions,
    };
  },
  watch: {
    addData: {
      immediate: true,
      handler(newValue) {
        console.log("addData", newValue);
      },
    },
  },
  created() {
    console.log("setRewardList", this.addData.setRewardList);
  },
  methods: {
    goAwardDetail(it) {
      this.$router.pushToAnotherModule("/m2-web-marketing", {
        path: `/rewardCenters/reward-detail/${it.prUuid}`,
      });
    },
    rewardChange(val){
      console.log(val)
      // 1 的时候只能有一个奖励门槛
      if(val==1){
        this.addData.setRewardList.splice(1,this.addData.setRewardList.length-1)
      }
    }
  },
};
</script>

<style lang="less" scoped>
.step3-award-module_wrap {
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
  white-space: nowrap;
  /deep/ .ivu-input-number {
    width: 220px;
  }
  /deep/ .ivu-form-item-content {
    margin-bottom: 16px;
  }
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
        cursor: pointer;
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
