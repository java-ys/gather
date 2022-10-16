<template>
  <div>
    <Modal
      v-model="isShow"
      :width="700"
      title="查看详情"
      class="big-img-modal"
      :footer-hide="true"
      @on-cancel="closeChange"
    >
      <Form
        :model="formItem"
        :label-width="100"
        style="padding-right: 30px;"
      >
        <Row>
            <Col span="12">
              <FormItem label="所属城市："> 
                <Input disabled="disabled" v-model="formItem.city"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="所属运营商："> 
                <Input disabled="disabled" v-model="formItem.agentName"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="司机姓名："> 
                <Input disabled="disabled" v-model="formItem.driverName"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="司机手机号："> 
                <Input disabled="disabled" v-model="formItem.driverTel"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="司机ID："> 
                <Input disabled="disabled" v-model="formItem.driverId"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="请假类型："> 
                <Input disabled="disabled" v-model="formItem.applySubType"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="开始时间："> 
                <Input disabled="disabled" v-model="formItem.applyStartTime"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="结束时间："> 
                <Input disabled="disabled" v-model="formItem.applyEndTime"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="天数："> 
                <Input disabled="disabled" v-model="formItem.applyTimes"></Input>
              </FormItem>
            </Col>
            <Col span="12" v-if="attedType!=4">
              <FormItem :label="attedType == 3 ? '补假原因：' : '请假原因：'"> 
                <Input disabled="disabled" v-model="formItem.reason"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="申请时间："> 
                <Input disabled="disabled" v-model="formItem.applyTime"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="审批状态："> 
                <Input disabled="disabled" v-model="formItem.applyStatus"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="审批人："> 
                <Input disabled="disabled" v-model="formItem.lastApproverName"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="审批时间："> 
                <Input disabled="disabled" v-model="formItem.operateTime"></Input>
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
              <FormItem label="附件："> 
                <img v-for="(item, index) in formItem.attachmentFileVoList" :key="index" :src="item.fileUrl" alt="" style="width: 25%; margin: 0 10px 10px 0;">
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="备注："> 
                <Input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" disabled="disabled" v-model="formItem.remark"></Input>
              </FormItem>
            </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { approvalDetail } from "_o/api/rest.js";
import { approveStatusList, leaveTypeList } from "./fields";

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
      isShow: this.show
    };
  },
  watch: {
    show() {
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
            agentName: data.agentName,
            applyEndTime: data.applyEndTime,
            applyStartTime: data.applyStartTime,
            applyStatus: approveStatusList(data.applyStatus),
            applySubType: leaveTypeList(data.applySubType),
            applyTime: data.applyTime,
            applyTimes: data.applyTimes,
            attachmentFileVoList: data.attachmentFileVoList,
            city: data.city,
            driverId: data.driverId,
            driverName: data.driverName,
            driverTel: data.driverTel,
            lastApproverName: data.lastApproverName,
            operateTime: data.operateTime,
            reason: this.attedType == 2 ? data.originalApplyReason : data.reason,
            remark: data.remark
          }
        }
      })
    },
    closeChange(){
      this.formItem = {
        agentName: "",
        applyEndTime: "",
        applyStartTime: "",
        applyStatus: null,
        applySubType: null,
        applyTime: "",
        applyTimes: null,
        attachmentFileVoList: [],
        city: "",
        driverId: "",
        driverName: "",
        driverTel: "",
        lastApproverName: "",
        operateTime: "",
        reason: "",
        remark: "",
      }
      this.$emit("submitChange");
    }
  }
};
</script>
<style lang="less">

</style>


