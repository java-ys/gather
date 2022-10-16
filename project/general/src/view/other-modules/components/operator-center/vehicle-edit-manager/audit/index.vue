<template>
  <div class="audit-exchange">
    <baseInfo :changeCarOrderUuid="changeCarOrderUuid" @getInfo="getInfo"></baseInfo>
    <div class="btn-group">
      <Button type="primary" @click="closePage">取消</Button>
      <Button type="success" @click="applyAudit">审批通过</Button>
      <Button type="error" @click="rejectAudit">审批驳回</Button>
    </div>
    <Modal
      v-model="isShow"
      :width="500"
      title="确认信息"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <Form ref="rejectForm" :model="rejctData" :rules="ruleValidate" :label-width="110">
        <FormItem label="驳回原因：" prop="reason">
          <Input
            v-model="rejctData.remark"
            type="textarea"
            :rows="5"
            placeholder="请输入..."
            style="width: 320px"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="ensureRejectAudit">确定</Button>
        <Button type="text" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import baseInfo from "../components/info";
import { audit } from "_o/api/vehicle-edit.js";
export default {
  components: {
    baseInfo
  },
  data() {
    return {
      changeCarOrderUuid: "",
      info: {},
      isShow: false,
      rejctData: {
        reason: ""
      },
      ruleValidate: {
        remark: [
          { required: true, message: "驳回原因不能为空", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    this.changeCarOrderUuid = this.$route.query.changeCarOrderUuid
  },
  methods: {
    getInfo(info) {
      this.info = info
    },
    rejectAudit() {
      this.isShow = true
    },
    cancel() {
      this.$refs["rejectForm"].resetFields();
      this.rejctData.reason = ""
      this.isShow = false
    },
    applyAudit() {
      this.$Modal.confirm({
        title: "确认信息",
        content: "确认信息无误，并审批通过？",
        onOk: () => {
          this.ensureApplyAudit()
        }
      });
    },
    ensureRejectAudit() {
      this.$refs.rejectForm.validate((valid) => {
        if (valid) {
          audit({
            "id": this.info.id,//主键ID
            "auditStatus": 2,//审批的状态，0-待审核、1-审核通过、2-审核驳回
            "vin": this.info.vin,//车架号
            "plateNum": this.info.plateNum,//车牌号
            ...this.rejctData
        }).then(res => {
            // console.log(res)
            if (res.data.success) {
              this.cancel()
              this.$Message.success("驳回成功！");
              this.closePage()
            } else {
              this.$Message.error(res.data.msg);
            }
          })
        }
      })
    },
    ensureApplyAudit() {
      audit({
        "id": this.info.id,//主键ID
        "auditStatus": 1,//审批的状态，0-待审核、1-审核通过、2-审核驳回
        "vin": this.info.vin,//车架号
        "plateNum": this.info.plateNum,//车牌号
        }).then(res => {
            if (res.data.success) {
            this.cancel()
            this.$Message.success("审核成功！");
            this.closePage()
            } else {
            this.$Message.error(res.data.msg);
            }
        })
    },
    closePage() {
      this.$route.meta.closeAlert = false;
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ name: "vehicle-edit-audit" });
    },
  }
};
</script>
<style lang="less" scoped>
.change-car-base{
  padding:16px ;
}

.ivu-col {
  padding: 3px;
}
.audit-exchange{
  .btn-group {
    margin: 10px 0 30px 0;
    display: flex;
    justify-content: center;
    button{
      margin-right: 10px;
    }
  }
}
</style>
