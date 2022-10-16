<template>
  <div class="message_wrap">
    <div class="header">消息提醒配置：</div>
    <div class="content">
      <div class="line">
        <div class="left">
          <FormItem
            label="任务启用消息内容："
            prop="messageEnableContent"
            class="ivu-form-item-required"
          >
            <Input
              v-model="addData.message.content"
              placeholder="请输入，100字内"
              type="text"
              class="messageContent_input"
              @on-change="contentChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
        <div class="middle">
          <FormItem label="跳转链接：">
            <Input
              v-model="addData.message.url"
              placeholder="请输入"
              type="text"
              class="url_input"
              @on-change="urlChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务启用提前通知时间："
            :label-width="10"
          >
            <InputNumber
              v-model="addData.message.hour"
              placeholder=""
              type="number"
              :min="0"
              :max="12"
              class="messageHour_input"
              @on-change="hourChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">小时</div>
            <InputNumber
              v-model="addData.message.min"
              placeholder=""
              type="number"
              :min="0"
              :max="59"
              class="messageMin_input"
              @on-change="minChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">分钟</div>
          </FormItem>
        </div>
      </div>
      <div class="line">
        <div class="left">
          <FormItem
            label="任务停用消息内容："
            prop="messageDisableContent"
          >
            <Input
              v-model="addData.message.disableContent"
              placeholder="请输入，100字内"
              type="text"
              class="messageContent_input"
              @on-change="contentChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
        <div class="middle">
          <FormItem label="跳转链接：">
            <Input
              v-model="addData.message.disableUrl"
              placeholder="请输入"
              type="text"
              class="url_input"
              @on-change="urlChange"
              :disabled="isDetail"
            />
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务停用提前通知时间："
            :label-width="10"
          >
            <InputNumber
              v-model="addData.message.disableHour"
              placeholder=""
              type="number"
              :min="0"
              :max="2"
              class="disableHour_input"
              @on-change="hourChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">小时</div>
            <InputNumber
              v-model="addData.message.disableMin"
              placeholder=""
              type="number"
              :min="0"
              :max="59"
              class="messageMin_input"
              @on-change="minChange"
              :disabled="isDetail || addData.isRealtime === 0"
            />
            <div class="unit">分钟</div>
          </FormItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/libs/util.js";
import {
  // messageTypeOptions
} from "../../../../config/fields"

export default {
  name: 'message',
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
  created () {
    console.log('this.addData', this.addData)
  },
  methods: {
    contentChange () { },
    urlChange () { },
    hourChange () { },
    minChange () { }
  },
}
</script>

<style lang="less" scoped>
.message_wrap {
  border: 1px solid #ddd;
  padding: 12px;
  width: 1200px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 120px;
  margin-top: 12px;
  .header {
    font-size: 15px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 8px;
    .line {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .left {
      .messageContent_wrap {
        /deep/ .ivu-form-item-content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-end;
        }
      }
    }
    .left,
    .middle,
    .right {
      flex: 0.3333;
      width: 33.33%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: no-wrap;
      white-space: nowrap;
    }
    .middle {
      /deep/ .ivu-form-item-label {
        // width: 80px !important;
      }
      /deep/ .ivu-form-item-content {
        margin-left: 0px !important;
      }
    }
    .right {
      /deep/ .ivu-form-item-label {
        // width: 120px !important;
      }
      /deep/ .ivu-form-item-content {
        margin-left: 150px !important;
      }
      /deep/ .ivu-input-wrapper {
        input {
          width: 80px !important;
        }
        textarea {
          width: 400px !important;
          height: 100px;
        }
      }
    }
    .right {
      .unit {
        margin-left: 4px;
        margin-right: 4px;
      }
    }
  }
  /deep/ .ivu-form-item-content {
    // margin-left: 100px !important;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  /deep/ .ivu-input-wrapper {
    input {
      width: 200px !important;
    }
    textarea {
      width: 400px !important;
      height: 100px;
    }
  }
  /deep/ .ivu-select {
    width: 150px;
  }
}
</style>
