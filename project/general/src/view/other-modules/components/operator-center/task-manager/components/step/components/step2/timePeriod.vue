<template>
  <div class="step2-time-period-module_wrap">
    <div>
      <div
        v-for="(item, index) in addData.timePeriodList"
        :key="index"
        class="line_wrap"
      >
        <!-- 奖励类型 -->
        <FormItem
          :label="`时段${index + 1}：`"
          prop="timePeriod"
          class="ivu-form-item-required"
        >
          <div class="line">
            <div class="left">
              <TimePicker
                type="time"
                class="search-input"
                v-model="addData.timePeriodList[index].startTime"
                ref="startTime_ref"
                :format="'HH:mm:ss'"
                :style="{ width: '150px' }"
                :disabled="isDetail"
                @on-change="
                  (time, type) => $emit('startTimeChange', time, type, index)
                "
                placeholder="请选择开始时间"
              >
              </TimePicker>
            </div>
            <div class="right">
              <TimePicker
                type="time"
                class="search-input"
                v-model="addData.timePeriodList[index].endTime"
                ref="endTime_ref"
                :format="'HH:mm:ss'"
                :style="{ width: '150px' }"
                :disabled="isDetail"
                @on-change="
                  (time, type) => $emit('endTimeChange', time, type, index)
                "
                placeholder="请选择结束时间"
              >
              </TimePicker>
            </div>
            <div class="item">
              <div
                class="delete"
                @click="$emit('handleDeleteModule', index)"
                v-if="index >= 1 && !isDetail"
              >
                <!-- <div class="delete_icon"></div> -->
                <img
                  :src="deleteicon"
                  alt=""
                >
              </div>
              <div
                class="add"
                @click="$emit('handleAddModule')"
                v-if="index === addData.timePeriodList.length - 1 && !isDetail && addData.timePeriodList.length <= 4"
              >
                <!-- <div class="add_horizontal_icon"></div>
                <div class="add_vertical_icon"></div> -->
                <img
                  :src="addicon"
                  alt=""
                >
              </div>
            </div>
          </div>
        </FormItem>
      </div>
    </div>
  </div>
</template>

<script>
import addicon from "_o/assets/add_icon.png";
import deleteicon from "_o/assets/delete_icon.png";

import {
  orderSourceOptions,
  awardCalculateOptions
} from "../../../../config/fields"

export default {
  name: "step2_time-period-module",
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
      addicon,
      deleteicon,
      orderSourceOptions,
      awardCalculateOptions,
      // addData: this.addData,
    }
  },
  watch: {
    // addData: {
    //   immediate: true,
    //   handler (newValue) {
    //     console.log("newValue", newValue)
    //     this.addData = newValue
    //   }
    // }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.step2-time-period-module_wrap {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  /deep/ .ivu-input-wrapper {
    input {
      width: 150px !important;
    }
  }
}
.line_wrap {
  // width: ~"calc(100vw - 300px)";
  // margin-left: -60%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  white-space: nowrap;
  .line {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    .right {
      margin-left: 16px;
    }
    .item {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      margin-left: 10px;
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
</style>
