<template>
  <div>
    <Modal
      v-model="isShow"
      :width="632"
      :title="title"
      class="big-img-modal"
      :footer-hide="true"
      @on-cancel="closeChange"
    >
      <Row>
        <Col span="12">司机ID ：{{formItem.driverId}}</Col>
        <Col span="12">司机姓名：{{formItem.driverName}}</Col>
      </Row>
      <Row>
        <Col span="12">司机手机号：{{formItem.driverTel}}</Col>
        <Col span="12">请假类型：{{formItem.applySubType}}</Col>
      </Row>
      <Row>
        <Col span="12">开始时间 ：{{formItem.applyStartTime}}</Col>
        <Col span="12">结束时间 ：{{formItem.applyEndTime}}</Col>
      </Row>
      <Row>
        <Col span="12">天数：{{formItem.applyTimes}}</Col>
        <Col span="12">申请时间：{{formItem.applyTime}}</Col>
      </Row>
      <Row>
        <Col span="24">{{attedType==4 ? '当月累计休息：' : '当月累计请假：'}}{{formItem.totalQuantity}}天</Col>
      </Row>
      <Row>
        <Col span="24" v-if="attedType!=4"
          >{{attedType == 3 ? '补假事由：' : '请假事由：'}}"{{formItem.reason}}
        </Col>
      </Row>
      <Row>
        <Col span="24"
          >附件：
            <img v-for="(item, index) in formItem.attachmentFileVoList" 
                :key="index" :src="item.fileUrl"  
                style="width: 25%; margin:0 10px 10px 0;">
        </Col>
      </Row>
      <Form
        ref="formValidate"
        :model="form"
        :label-width="80"
        style="width: 500px"
      >
        <FormItem label="备注：" :label-width="60">
          <Input
            v-model="form.desc"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            :maxlength="100"
          ></Input>
        </FormItem>
      </Form>
      <div class="ivu-modal-footer">
			<Button
				type="text"
				size="large"
				style="margin-right: 8px"
				@click="handleSubmit(3)"
				>驳回</Button
			>
			<Button
				type="primary"
				@click="handleSubmit(2)"
				size="large"
				>同意</Button
			>
		</div>
    </Modal>
  </div>
</template>

<script>
import { approvalDetail, approvalOperate } from "_o/api/rest.js";
import { leaveTypeList } from "./fields";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    id: {
      type: Number
    },
    attedType: {
      type: Number
    }
  },
  data() {
    return {
      formItem: {},
      form: {
        desc: ""
      },
      isShow: this.show
    };
  },
  watch: {
    show() {
      this.form.desc = ""
      this.isShow = this.show;
      if(this.isShow){
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail(){
      approvalDetail({id: this.id}).then((res) =>{
        if(res.data.success) {
          let data = res.data.data
          this.formItem = {
            driverId: data.driverId,
            driverName: data.driverName,
            driverTel: data.driverTel,
            applySubType: leaveTypeList(data.applySubType),
            applyEndTime: data.applyEndTime,
            applyStartTime: data.applyStartTime,
            applyTime: data.applyTime,
            applyTimes: data.applyTimes,
            attachmentFileVoList: data.attachmentFileVoList,
            reason: this.attedType == 2 ? data.originalApplyReason : data.reason,
            totalQuantity: data.totalQuantity
          }
        }
      })
    },
    handleSubmit(val){
      let data = {
        approveStatus: val,
        id: this.id,
        remark: this.form.desc
      }
      console.log(data)
      approvalOperate(data).then(res => {
        if(res.data.success){
          this.$Message.success("操作成功");
          this.$emit("submitChange");
          this.formItem = {}
        }
      })
    },
    closeChange(){
      console.log("关闭")
      this.$emit("closeChange");
      this.formItem = {}
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-row {
  margin-bottom: 14px;
}
</style>
