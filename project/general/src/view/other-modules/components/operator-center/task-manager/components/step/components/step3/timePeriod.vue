<template>
  <div class="step2-time-period-module_wrap">
    <div>
      <div
        v-for="(item, index) in addData[parentItem]"
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
                v-model="addData[parentItem][index][startTime]"
                ref="startTime_ref"
                :format="'HH:mm:ss'"
                :style="{ width: '150px' }"
                :disabled="isDetail"
                placeholder="请选择开始时间"
              >
              </TimePicker>
            </div>
            <div class="right">
              <TimePicker
                type="time"
                class="search-input"
                v-model="addData[parentItem][index][endTime]"
                ref="endTime_ref"
                :format="'HH:mm:ss'"
                :style="{ width: '150px' }"
                :disabled="isDetail"
                placeholder="请选择结束时间"
              >
              </TimePicker>
            </div>
            <div class="item">
              <div
                class="delete"
                @click="handleDeleteModule(index)"
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
                @click="handleAddModule"
                v-if="index === addData[parentItem].length - 1 && !isDetail && addData[parentItem].length <= 4"
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
  name: "step3_time-period-module",
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
    },
    parentItem:"",
    startTime:"",
    endTime:""
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
    addData: {
      immediate: true,
      handler (newValue) {
        console.log("newValue", newValue)
        this.addData = newValue
      }
    }
  },
  methods: {
     // 删除到达围栏的奖励模块
    handleDeleteModule (index) {
      this.addData[this.parentItem].splice(index, 1)
    },
    // 添加到达围栏的奖励模块
    handleAddModule () {
      this.addData[this.parentItem].push({
        [this.startTime]: '00:00:00',
        [this.endTime]: '23:59:59'
      })
    },
    startTimeChange (startTime, type, index) {
      console.log(startTime)
      this.addData[this.parentItem][index][this.startTime] = startTime
    },
    endTimeChange (endTime, type, index) {
      console.log(endTime)
      this.addData[this.parentItem][index][this.endTime] = endTime
    },
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
  margin-top: 8px;
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
