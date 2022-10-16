<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="提现"
    width="40%"
    :visible="visible"
    @close="modalClose"
  >
    <el-form :model="addForm" ref="addForm" :rules="rules">
      <h3>司机基础信息</h3>
      <el-row>
        <el-col :span="12">
          <el-form-item label="司机姓名:" :label-width="formLabelWidth">{{
            currentRow.driverName
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号:" :label-width="formLabelWidth">{{
            currentRow.driverMobile
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号:" :label-width="formLabelWidth">{{
            currentRow.driverIdentityCard
          }}</el-form-item>
        </el-col>
      </el-row>
      <h3>提现信息</h3>
      <el-row>
        <el-col :span="24">
          <el-form-item label="提现方式：" :label-width="formLabelWidth">{{
            withdrawalMode[0].label
          }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="银行卡号："
            size="mini"
            :label-width="formLabelWidth"
            prop="pan"
          >
            <el-input
              v-model.trim="addForm.pan"
              placeholder="请输入"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="开户行："
            size="mini"
            :label-width="formLabelWidth"
            prop="bankName"
          >
            <el-input
              v-model="addForm.bankName"
              :disabled="true"
              placeholder="请输入"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="银行预留手机号："
            size="mini"
            :label-width="formLabelWidth"
            prop="driverMobile"
          >
            <el-input
              v-model="addForm.driverMobile"
              placeholder="请输入"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="edit">修 改</el-button>
        </el-col>
      </el-row>
      <h3>账户信息</h3>
      <el-row>
        <el-col :span="24">
          <el-form-item label="可提现余额:" :label-width="formLabelWidth">{{
            currentRow.availableBalance
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="currentRow.driverType === PATROL_CONSTANT">
        <el-col :span="12">
          <el-form-item label="网约车账户余额:" :label-width="formLabelWidth">{{
            currentRow.onlineAcctBalance
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打表计价账户余额:" :label-width="formLabelWidth">{{
            currentRow.offlineAcctBalance
          }}</el-form-item>         
        </el-col>        
      </el-row>
    </el-form>
    <div slot="footer" style="display: flex; justify-content: center">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mixin from "../mixin";
import { withdrawalService, updateBindCardInfo, getBankCardInfo } from "../api";
import { rules, withdrawalMode, PATROL_CONSTANT } from "../filed";
export default {
  props: {
    visible: { type: Boolean, required: false, default: false },
  },
  inject: ["getRow"],
  mixins: [mixin],
  data() {
    return {
      rules: rules,
      formLabelWidth: "140px",
      addForm: {
        pan: "",
        bankName: "",
        driverMobile: "",
      },
      withdrawalMode,
      PATROL_CONSTANT
    };
  },
  computed: {
    currentRow: {
      cache: false,
      get() {
        let rowTmp = this.getRow();
        let tmp = { ...rowTmp };
        return tmp;
      },
    }
  },
  watch: {
    visible(v) {
      if (!v) {
        this.$refs["addForm"].resetFields();
      } else {
        this.addForm = {
          pan: this.currentRow.pan || "",
          bankName: this.currentRow.bankName || "",
          driverMobile: this.currentRow.driverMobile || "",
        };
      }
    },
    'addForm.pan'() {
      if (this.addForm.pan.length >=15 && this.addForm.pan.length <=30) {
        return this.getBankCardInfo() || {}
      }
    },
  },
  methods: {
    edit() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          let { pan, bankName, driverMobile } = this.addForm;
          const p = {
            accountId: this.currentRow.accountId,
            driverMobile: driverMobile,
            bankName: bankName,
            driverIdentityCard: this.currentRow.driverIdentityCard,
            driverName: this.currentRow.driverName,
            driverUuid: this.currentRow.driverUuid,
            oldBankName: this.currentRow.bankName,
            oldPan: this.currentRow.pan,
            pan: pan,
          };
          this.call(updateBindCardInfo, p, this.updateBindCardSuccess);
          }
      });
    },
    updateBindCardSuccess(data) {
      this.$message.success("修改成功");
      return
    },
    getBankCardInfo() {
      // 查询银行卡信息
      let { pan } = this.addForm;
      this.call(getBankCardInfo, { pan: pan }, this.getBankCardSuccess, this.getBankCardErr);
    },
    getBankCardSuccess(data) {
      if (data) {
        let { bankName } = data;
        this.addForm.bankName = bankName;
      } 
    },
    getBankCardErr({ msg }) {
      msg = msg || "失败";
      return;
    },
    confirm() {
      this.$refs["addForm"].validate((valid) => {
        if (!valid) return false;
        const p = {
          driverName: this.currentRow.driverName,
          driverUuid: this.currentRow.driverUuid,
          withdrawalAmt: this.currentRow.availableBalance,
          pan: this.addForm.pan,
          // withdrawalAmt: 0.1,
        };
        if (this.currentRow.availableBalance <= 0) {
          this.$message.warning("可提现余额需大于0");
          return;
        }
        this.call(withdrawalService, p, this.success, this.error);
      });
    },
    error({ msg }) {
      msg = msg || "失败";
      this.$alert(msg);
    },
    success(data) {
      this.modalClose(true);
    },
    modalClose() {
      this.$emit("close-dialog");
    },
  },
};
</script>

<style>
</style>
