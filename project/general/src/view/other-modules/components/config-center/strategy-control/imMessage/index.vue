<template>
  <div class="im_message_wrap">
    <div class="title">
      司乘IM消息限制策略
    </div>
    <div class="label">
      发送频率限制：
    </div>
    <div class="form-theriod">
      <Form
        ref="theriodForm"
        :model="theriodModelData"
        :rules="intervalMillsRules"
        :label-width="0"
      >
        <FormItem
          label=""
          prop="intervalMills"
        >
          <span style="margin-right: 6px;">每</span>
          <input
            v-model="theriodModelData.intervalMills"
            type="text"
          >
          <span>秒内，乘客端仅可发送一次IM消息。</span>
        </FormItem>
      </Form>
    </div>
    <div class="label">
      发送数量限制：
    </div>
    <div class="form-num">
      <Form
        ref="numForm"
        :model="numModelData"
        :rules="totalDayNumRules"
        :label-width="0"
      >
        <FormItem
          label=""
          prop="totalDayNum"
        >
          <span style="margin-right: 6px;">乘客端每天发送IM消息总量上限为</span>
          <input
            v-model="numModelData.totalDayNum"
            type="text"
          >
          <span style="margin-left: 4px;">条。</span>
        </FormItem>
      </Form>
    </div>
    <div class="footer">
      <Button
        v-lazy-click="handleSubmit"
        v-hasAuth="'im-message_add'"
        type="primary"
      >
        完成
      </Button>
    </div>
  </div>
</template>

<script>
import {
  savePassengerImLimit,
  updatePassengerImLimit,
  passengerImLimitDetail,
} from "_o/api/configData";

export default {
  name: "IMMessage",
  data() {
    const validTotalDayNum = (rule, value, callback) => {
      if (!value) {
        callback()
        return true
      }
      if (String(value).indexOf(".") > -1) {
        callback(new Error("发送数量限制数值必须为整数数值"))
        return false
      }
      const newValue = Number(value)
      if (Number.isNaN(newValue)) {
        callback(new Error("发送数量限制必须为数值类型"))
        return false
      }
      if (newValue < 50) {
        callback(new Error("发送数量限制数值必须大于等于50"))
        return false
      }
      if (newValue > 100) {
        callback(new Error("发送数量限制数值必须小于等于100"))
        return false
      }
      callback()
    }

    const validIntervalMills = (rule, value, callback) => {
      if (!value) {
        callback()
        return true
      }
      if (String(value).indexOf(".") > -1) {
        callback(new Error("发送频率限制数值必须为整数数值"))
        return false
      }
      const newValue = Number(value)
      if (Number.isNaN(newValue)) {
        callback(new Error("发送频率限制必须为数值类型"))
        return false
      }
      if (newValue < 5) {
        callback(new Error("发送频率限制数值必须大于等于5"))
        return false
      }
      if (newValue > 30) {
        callback(new Error("发送频率限制数值必须小于等于30"))
        return false
      }
      callback()
    }

    let intervalMillsRules = {
      intervalMills: [{
        trigger: "change",
        validator: validIntervalMills
      }]
    }

    let totalDayNumRules = {
      totalDayNum: [{
        trigger: "change",
        validator: validTotalDayNum
      }],
    }

    return {
      numModelData: {
        totalDayNum: "",
      },
      theriodModelData: {
        intervalMills: ""
      },
      totalDayNumRules,
      intervalMillsRules,
      editUuid: ""
    }
  },
  created() {

  },
  mounted() {
    this.getPassengerImLimitDetail()
  },
  methods: {
    async getPassengerImLimitDetail() {
      const res = await passengerImLimitDetail()
      if (!res) {
        this.editUuid = ""
        return false
      }
      if (res && res.data && res.data.code === 200 && res.data.success) {
        const { uuid: editUuid, totalDayNum, intervalMills } = res.data.data || {}
        this.editUuid = editUuid
        this.numModelData.totalDayNum = totalDayNum
        this.theriodModelData.intervalMills = intervalMills
      } else {
        this.editUuid = ""
      }
    },
    async handleSubmit() {
      const theriodFormValidRes = await this.$refs["theriodForm"].validate()
      if (!theriodFormValidRes) {
        return false
      }
      const numFormValidRes = await this.$refs["numForm"].validate()
      if (!numFormValidRes) {
        return false
      }
      if (theriodFormValidRes && theriodFormValidRes) {
        let requestParams = {}
        let requestApi = ""
        if (this.editUuid) {
          requestParams = {
            ...requestParams,
            uuid: this.editUuid,
          }
          requestApi = updatePassengerImLimit
        } else {
          requestParams = {
            ...requestParams,
          }
          requestApi = savePassengerImLimit
        }
        if (this.numModelData.totalDayNum) {
          requestParams = {
            ...requestParams,
            totalDayNum: this.numModelData.totalDayNum,
          }
        }
        if (this.theriodModelData.intervalMills) {
          requestParams = {
            ...requestParams,
            intervalMills: this.theriodModelData.intervalMills
          }
        }
        const res = await requestApi({
          ...requestParams
        })
        if (!res) {
          this.$Message.error("提交失败");
        }
        if (res && res.data && res.data.code === 200 && res.data.success) {
          this.$Message.success("提交成功");
          this.getPassengerImLimitDetail()
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.im_message_wrap {
  display: block;
  border: 1px solid #ddd;
  margin-left: 12px;
  margin-top: 12px;
  padding: 12px;
  .title {
    color: black;
    font-size: 18px;
    margin-bottom: 12px;
  }
  .label {
    margin-bottom: 12px;
    color: #000;
  }
  /deep/ .ivu-form-item-content {
    color: #000;
    input {
      width: 120px;
      outline: none;
      border: 1px solid #ddd;
      text-align: left;
      height: 30px;
      border-radius: 4px;
    }
    input::-webkit-placeholder {
      margin-left: 4px;
    }
  }
}
</style>
