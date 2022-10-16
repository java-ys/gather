<template>
  <div class="sms_wrap">
    <div class="header">短信配置：</div>
    <div class="content">
      <div class="line">
        <div class="left">
          <FormItem
            label="任务启用短信内容："
            class="sms_content_wrap"
          >
            <Input
              v-model="addData.sms.content"
              placeholder="请输入，100字内"
              type="text"
              class="smsContent_input"
              @on-change="contentChange"
            />
            <div class="c_len">({{ addData.sms.content ? addData.sms.content.length: 0 }}/ 100)</div>
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务启用提前通知时间："
            :label-width="200"
          >
            <Input
              v-model="addData.sms.hour"
              placeholder=""
              type="text"
              class="smsHour_input"
              @on-change="hourChange"
            />
            <div class="unit">小时</div>
            <Input
              v-model="addData.sms.min"
              placeholder=""
              type="text"
              class="smsMin_input"
              @on-change="minChange"
            />
            <div class="unit">分钟</div>
          </FormItem>
        </div>
      </div>
      <div class="line">
        <div class="left">
          <FormItem label="任务停用消息内容：">
            <Input
              v-model="addData.sms.disableContent"
              placeholder="请输入，100字内"
              type="text"
              class="smsContent_input"
              @on-change="contentChange"
            />
          </FormItem>
        </div>
        <div class="right">
          <FormItem
            label="任务停用提前通知时间："
            :label-width="200"
          >
            <Input
              v-model="addData.sms.disableHour"
              placeholder=""
              type="text"
              class="disableHour_input"
              @on-change="hourChange"
            />
            <div class="unit">小时</div>
            <Input
              v-model="addData.sms.disableHourMin"
              placeholder=""
              type="text"
              class="smsMin_input"
              @on-change="minChange"
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

export default {
  name: 'sms',
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
    hourChange () { },
    minChange () { }
  },
}
</script>

<style lang="less" scoped>
.sms_wrap {
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
      width: 100%;
    }
    .left {
      .smsContent_wrap {
        /deep/ .ivu-form-item-content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-end;
        }
        .c_len {
          margin-left: 4px;
          white-space: nowrap;
        }
      }
    }
    .left,
    .right {
      flex: 0.5;
      width: 50%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: no-wrap;
      white-space: nowrap;
    }
    .right {
      justify-content: center;
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
      width: 300px !important;
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
