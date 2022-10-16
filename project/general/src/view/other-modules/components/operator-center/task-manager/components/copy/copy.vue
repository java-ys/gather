<template>
  <div class="copy-name_wrap">
    <Modal
      v-model="isShow"
      :width="720"
      :title="modalTitle"
      :mask-closable="false"
      class="copy-name_modal"
      @on-cancel="handleCancel"
    >
      <Form
        ref="adForm"
        class="top15 copy_form"
        :model="addData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="任务名称："
          prop="taskName"
          class="ivu-form-item-required"
        >
          <Input
            v-model="addData.taskName"
            placeholder="请输入任务名称"
            class="taskName_input"
            :maxlength="20"
          />
        </FormItem>
        <FormItem
          label="任务起止日期："
          class="task_step2_item"
        > </FormItem>
        <FormItem
          label="开始日期："
          prop="startDate"
          class="ivu-form-item-required"
        >
          <DatePicker
            type="date"
            class="search-input"
            v-model="addData.startDate"
            ref="startTime_ref"
            :format="'yyyy-MM-dd'"
            :options="options"
            :style="{ width: '220px' }"
            @on-change="startDateChange"
            placeholder="请选择开始日期"
          >
          </DatePicker>
        </FormItem>
        <FormItem
          label="结束日期："
          prop="endDate"
          class="ivu-form-item-required"
        >
          <DatePicker
            type="date"
            class="search-input"
            v-model="addData.endDate"
            ref="endTime_ref"
            :options="options"
            :format="'yyyy-MM-dd'"
            :style="{ width: '220px' }"
            @on-change="endDateChange"
            placeholder="请选择结束日期"
          >
          </DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleCancel">
          取消
        </Button>
        <Button
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { copyRuleValidate as ruleValidate } from "../../config/fields"
import { copyTask } from "_o/api/task-manager";

export default {
  name: "copyTask",
  data () {
    return {
      modalTitle: "复制",
      isShow: false,
      ruleValidate: ruleValidate(this),
      addData: {
        taskName: "",
        startDate: new Date(new Date().getTime()),
        endDate: new Date(new Date().getTime()),
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    }
  },
  props: {
    basicUuid: {
      type: String,
      default () {
        return ''
      }
    }
  },
  created () {
    this.isShow = true
  },
  methods: {
    startDateChange (startDate, type) {
      console.log(startDate)
      this.addData.startDate = startDate
    },
    endDateChange (endDate, type) {
      console.log(endDate)
      this.addData.endDate = endDate
    },
    nameChange () {

    },
    handleCancel () {
      this.isShow = false
      this.$emit("update:visible")
    },
    async handleSubmit () {
      const valid = await this.$refs["adForm"].validate()
      if (!valid) {
        return false
      }
      if (this.$moment(this.addData.startDate).diff(this.$moment(this.addData.endDate), 'days') > 0) {
        this.$Message.error('开始日期不能大于结束日期')
        return false
      }
      // const res = await copyTask({
      //   taskName: this.addData.taskName,
      //   basicUuid: this.basicUuid,
      //   taskStartDate: this.$moment(this.addData.startDate).format('YYYY-MM-DD'),
      //   taskEndDate: this.$moment(this.addData.endDate).format('YYYY-MM-DD')
      // })
      // if (!res) {
      //   return false
      // }
      // if (res.data && res.data && res.data.success) {
      // this.$Message.success("复制成功")
      this.$emit("update:visible")
      this.$emit("copySuccess", this.addData)
      // } else {
      //   this.$Message.error(res.data.msg);
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.copy_form {
  /deep/ .ivu-input-wrapper {
    input {
      width: 220px;
    }
  }
}
</style>
