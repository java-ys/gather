// 第三步的设置奖励模块
<template>
  <div class="step3-award-module_wrap">
    <FormItem label="奖励配置" class="finishOrderConfig"> </FormItem>
    <div>
      <FormItem
        label="奖励计算方式："
        prop="awardCalculate"
        class="ivu-form-item-required"
      >
        <Select
          v-model="addData.awardCalculate"
          @on-change="awardTypeChange"
          :disabled="isDetail"
        >
          <Option
            v-for="item in awardTypeOptions"
            :key="item.value"
            :value="item.value"
            :disabled="((isHasOnlineDay||isHasOnlineHour) && item.value==1) || (!isHasFlow && item.value == 4) || (isHasFlow && item.value == 1)"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <div>
        <FormItem
          v-if="
            addData.awardCalculate == 1 &&
            addData.taskStandardList.length == 1 &&
            isHasOrder
          "
          label="是否每单都给奖励："
          :prop="addData.eachOrderReward + ''"
          class="ivu-form-item-required"
        >
          <RadioGroup
            v-model="addData.eachOrderReward"
            @on-change="rewardChange"
            :disabled="isDetail"
          >
            <Radio :label="1" :disabled="isDetail">是</Radio>
            <Radio :label="0" :disabled="isDetail">否</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    <!-- 流水分成奖 -->
    <FormItem
      v-if="
        addData.awardCalculate == 4
      "
      label="流水分成奖励上限："
      prop="awardMax"
    >
      <InputNumber
        v-model="addData.awardMax"
        placeholder="请输入上限"
        class="awardMax_input"
        :disabled="isDetail"
        type="number"
        :min="0"
        :max="100000"
      />
    </FormItem>
    <!-- 流水分成奖励方式配置-->
    <div
      v-if="
       addData.awardCalculate == 4
      "
      class="radio-group-wrapper"
    >
      <RadioGroup v-model="addData.orderFlowConfig" type="button" size="large">
        <Radio
          v-for="item in orderFlowMap"
          :key="item.value"
          :value="item.value"
          :label="item.value"
          :disabled="isDetail"
          >{{ item.label }}
        </Radio>
      </RadioGroup>
      <Tooltip
        placement="right"
        class="radio-group-text"
        max-width="400"
        theme="light"
      >
        <Icon type="md-help" class="md-help" />
        <div slot="content">
          <h3>奖励计算方式说明:</h3>
          <p>
            <i>方式一:</i>流水金额30元，达到奖励5%；流水金额60元，达到奖励10%，实际流水100元。奖励金额为：（60-30）*5%+(100-60)*10%；
          </p>
          <p>
            <i>方式二:</i>流水金额50元，达到奖励10%，流水金额100元，达到奖励20%，实际流水120。奖励金额为：120* 20%
          </p>
        </div>
      </Tooltip>
    </div>
    <div v-if="addData.taskStandardList.length>0">
       <div v-for="(item, index) in addData.setRewardList" :key="index" class="reward-wrap">
        <div class="line_wrap">
          <FormItem
            v-if="isHasOrder"
            :label="
              addData.taskStandardList.length == 1 &&
              isHasOrder &&
              addData.awardCalculate == 1 &&
              addData.eachOrderReward == 1
                ? '奖励门槛：完单数'
                : '完单数：'
            "
            :prop="'setRewardList.' + index + '.completeCount'"
            class="ivu-form-item-required"
            :rules="ruleValidate.completeCount"
          >
            <InputNumber
              v-model="addData.setRewardList[index].completeCount"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
              :min="addData.eachOrderReward == 1 ? 0 : 1"
              :max="100000"
            />
          </FormItem>
          <FormItem
            v-if="isHasFlow"
            label="流水金额："
            :prop="'setRewardList.' + index + '.shareStartAmount'"
            :rules="ruleValidate.shareStartAmount"
            class="ivu-form-item-required"
          >
            <Input
              v-model="addData.setRewardList[index].shareStartAmount"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
              :min="0.01"
            />
          </FormItem>
          <FormItem
            v-if="isHasOnlineHour"
            label="在线时长："
            :prop="'setRewardList.' + index + '.onlineDuration'"
            :rules="ruleValidate.onlineDuration"
            class="ivu-form-item-required"
          >
            <Input
              v-model="addData.setRewardList[index].onlineDuration"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
              :min="0.01"
              :max="100000"
            />
          </FormItem>
          <FormItem
            v-if="isHasOnlineDay"
            label="在线天数："
            :prop="'setRewardList.' + index + '.onlineDays'"
            :rules="ruleValidate.onlineDays"
            class="ivu-form-item-required"
          >
            <Input
              v-model="addData.setRewardList[index].onlineDays"
              placeholder="请输入"
              class="num_input"
              :disabled="isDetail"
              type="number"
              :min="1"
              :max="24"
            />
          </FormItem>
          <FormItem
            v-if="addData.awardCalculate == 4"
            label="流水分成："
            class="flowPercent_wrap ivu-form-item-required"
            :prop="'setRewardList.' + index + '.shareProportion'"
            :rules="ruleValidate.shareProportion"
          >
            <Input
              v-model="addData.setRewardList[index]['shareProportion']"
              placeholder="请输入流水分成"
              class="flowPercent_input"
              :disabled="isDetail"
              type="number"
              :min="0.01"
              :max="100"
            />
            <div style="margin-left: 4px">%</div>
          </FormItem>
          <!-- 奖励类型 -->
          <FormItem
            label="奖励类型："
            prop="taskAwardType"
            class="ivu-form-item-required"
            v-if="addData.awardCalculate != 4"
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
            </div>
          </FormItem>
        </div>
        <!-- 只有是 任务指标只有完单、奖励计算方式是叠加、是否每单都给奖励选择是  的情况下才会不展示添加。此场景setRewardList只能有一条数据-->
        <div
          class="add-item"
          v-if="
            !(
              addData.taskStandardList.length == 1 &&
              isHasOrder &&
              addData.awardCalculate == 1 &&
              addData.eachOrderReward == 1
            )
          "
        >
          <div
            class="delete"
            @click="$emit('handleDeleteModule', index)"
            v-if="index >= 0 && !isDetail && addData.setRewardList.length > 1"
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
  awardTypeOptions,
  orderFlowMap,
} from "../../../../config/fields";

export default {
  name: "step3_award-module-new",
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
    isHasOrder: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHasFlow: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHasOnlineHour: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isHasOnlineDay: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      addicon,
      deleteicon,
      orderSourceOptions,
      awardCalculateOptions,
      awardTypeOptions,
      orderFlowMap,
    };
  },
  watch: {
    addData: {
      immediate: true,
      handler(newValue) {
        console.log("addData", newValue);
      },
    },
    isHasOnlineHour:{
      immediate: true,
      handler(newValue) {
        // 如果选中了在线时长。奖励计算方式不能有叠加奖。
       if(newValue && this.addData.awardCalculate ===1){
         this.addData.awardCalculate = ''
       }
      },
    },
    isHasOnlineDay:{
      immediate: true,
      handler(newValue) {
        // 如果选中了在线天数。奖励计算方式不能有叠加奖。
       if(newValue && this.addData.awardCalculate ===1){
         this.addData.awardCalculate = ''
       }
      },
    },
    isHasFlow:{
      immediate: true,
      handler(newValue) {
        // 如果没有选中流水。奖励计算方式是流水分成的时候。吧奖励计算方式清空
       if(!newValue && this.addData.awardCalculate ===4){
         this.addData.awardCalculate = ''
       }
       // 如果选中流水。奖励计算方式是叠加奖的时候。吧奖励计算方式清空
       if(newValue && this.addData.awardCalculate === 1){
          this.addData.awardCalculate = ''
       }
      },
    }
  },
  created() {
    console.log("setRewardList", this.addData.setRewardList);
  },
  methods: {
    awardTypeChange(value) {},
    goAwardDetail(it) {
      this.$router.pushToAnotherModule("/m2-web-marketing", {
        path: `/rewardCenters/reward-detail/${it.prUuid}`,
      });
    },
    rewardChange(val) {
      console.log(val);
      // 1 的时候只能有一个奖励门槛
      if (val == 1) {
        this.addData.setRewardList.splice(
          1,
          this.addData.setRewardList.length - 1
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.step3-award-module_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.reward-wrap{
  display: flex;
  align-items: center;
  margin-top: 16px;
}
.flowPercent_input{
  width: auto;
}
.add-item{
  margin-left: 8px;
}
.line_wrap {
  // width: ~"calc(100vw - 300px)";
  // margin-left: -60%;
  // display: flex;
  width: 511px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-top: 25px;
  // justify-content: flex-start;
  // flex-direction: row;
  // white-space: nowrap;
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
.finishOrderConfig {
  /deep/ .ivu-form-item-label {
    font-size: 16px;
  }
}
.flowPercent_wrap {
  /deep/ .ivu-form-item-content {
    white-space: nowrap;
    display: flex;
  }
}

</style>
