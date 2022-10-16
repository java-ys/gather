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
            v-model="rejctData.reason"
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
import { auditPass, auditNoPass } from "_o/api/joinwithcar-exchange.js";
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
        reason: [
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
      const {agentUuid, agentUuidOriginal, driverName}  = this.info
      let content = "确认司机" + driverName + "换车信息无误，并审批通过？"
      if(agentUuidOriginal && (agentUuid !== agentUuidOriginal)) {
        content = "更换的车辆不在该司机所对应的运营商下，是否确认换车"
      }
      this.$Modal.confirm({
        title: "确认信息",
        content,
        onOk: () => {
          this.ensureApplyAudit()
        }
      });
    },
    ensureRejectAudit() {
      this.$refs.rejectForm.validate((valid) => {
        if (valid) {
          auditNoPass({
            changeCarOrderUuid: this.info.changeCarOrderUuid,
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
      auditPass({
        changeCarOrderUuid: this.info.changeCarOrderUuid,
      }).then(res => {
        // console.log(res)
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
      this.$router.push({ name: "joindriver-manager" });
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
