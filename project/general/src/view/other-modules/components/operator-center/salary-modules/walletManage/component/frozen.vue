<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    width="30%"
    :visible="visible"
    @close="modalClose"
  >
    <el-form :model="addForm" ref="addForm" :rules="rules">
      <el-form-item label="账户余额：" :label-width="formLabelWidth">{{
        currentRow.balance
      }}</el-form-item>
      <el-row v-if="currentRow.driverType === PATROL_CONSTANT">
        <el-col :span="12">
          <el-form-item label="网约车账户余额：" :label-width="formLabelWidth">{{
            currentRow.onlineAcctBalance
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打表计价账户余额：" :label-width="formLabelWidth">{{
            currentRow.offlineAcctBalance
          }}</el-form-item>
        </el-col>
      </el-row>          
      <el-form-item label="已冻结金额：" :label-width="formLabelWidth">{{
        currentRow.freezeBalance
      }}</el-form-item>
      <el-row v-if="currentRow.driverType === PATROL_CONSTANT">
        <el-col :span="12">
          <el-form-item label="已冻结网约车账户金额：" :label-width="formLabelWidth">{{
            currentRow.onlineFreezeBalance
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已冻结打表计价账户金额：" :label-width="formLabelWidth">{{
            currentRow.offlineFreezeBalance
          }}</el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="currentRow.driverType === PATROL_CONSTANT"
        :label="`${type === 1 ? '冻结网约车账户金额：' : '解冻网约车账户金额：'}`"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="addForm.freezeAmt"
          placeholder="请输入"
          style="width: 200px"
        ></el-input>
        <span class="operateHandel" @click="operateHandel(currentRow)"
          >{{type === 1 ? "全部冻结" : "全部解冻"}}</span
        >
      </el-form-item>       
      <el-form-item
        v-else
        :label="`${type === 1 ? '冻结账户金额：' : '解冻账户金额：'}`"
        :label-width="formLabelWidth"
        prop="freezeAmt"
      >
        <el-input
          v-model="addForm.freezeAmt"
          placeholder="请输入"
          style="width: 200px"
        ></el-input>
        <span class="operateHandel" @click="operateHandel(currentRow)"
          >{{type === 1 ? "全部冻结" : "全部解冻"}}</span
        >
      </el-form-item>      
      <el-form-item
         v-if="currentRow.driverType === PATROL_CONSTANT"
        :label="`${type === 1 ? '冻结打表计价账户金额：' : '解冻打表计价账户金额：'}`"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="addForm.offlineFreezeAmt"
          placeholder="请输入"
          style="width: 200px"
        ></el-input>
        <span class="operateHandel" @click="handelNet(currentRow)"
          >{{type === 1 ? "全部冻结" : "全部解冻"}}</span
        >
      </el-form-item>           
      <el-form-item label="备注：" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="addForm.remark"
          maxlength="32"
          :rows="6"
          style="width: 200px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="display: flex; justify-content: center">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="modalClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mixin from "../mixin";
import { rules, PATROL_CONSTANT } from "../filed";
import { frozenService, thawService } from "../api";
export default {
  props: {
    visible: { type: Boolean, required: false, default: false },
    type: { type: Number, required: false, default: 1 },
  },
  inject: ["getRow"],
  mixins: [mixin],
  data() {
    return {
      addForm: {
        freezeAmt: "",
        offlineFreezeAmt: "",
        remark: "",
      },
      rules: rules,
      formLabelWidth: "180px",
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
    },
    title() {
      return this.type === 1 ? "冻结" : "解冻";
    },
  },
  watch: {
    visible(v) {
      if (!v) {
        this.addForm = { freezeAmt: "", offlineFreezeAmt: "", emark: "" }
      }
    },
  },
  methods: {
    operateHandel(v) {
      if (this.type === 1 && v.driverType !== PATROL_CONSTANT) {
        this.addForm.freezeAmt = v.availableBalance;
      } 
      if (this.type === 2 && v.driverType !== PATROL_CONSTANT) {
        this.addForm.freezeAmt = v.freezeBalance;
      }
      // 针对巡网出租车
      if (this.type === 1 && v.driverType === PATROL_CONSTANT) {
        this.addForm.freezeAmt = v.onlineAcctBalance - v.onlineFreezeBalance;
      }
      if (this.type === 2 && v.driverType === PATROL_CONSTANT) {
        this.addForm.freezeAmt = v.onlineFreezeBalance;
      }      
    },
    handelNet(v) {
      if (this.type === 1) {
        this.addForm.offlineFreezeAmt = v.offlineAcctBalance - v.offlineFreezeBalance;
      }
      if (this.type === 2) {
        this.addForm.offlineFreezeAmt = v.offlineFreezeBalance;
      } 
    },
    confirm() {
      this.$refs["addForm"].validate((valid) => {
        if (!valid) return false;
        let { freezeAmt, offlineFreezeAmt, remark } = this.addForm;
        let { freezeBalance, offlineFreezeBalance, balance, onlineAcctBalance, onlineFreezeBalance, offlineAcctBalance, accountId, driverUuid, driverType } = this.currentRow;
        const p = {
          balance: driverType === PATROL_CONSTANT ? onlineAcctBalance : balance,
          freezeAmt: this.type === 1 ? freezeAmt : -freezeAmt,
          frozenAmt: driverType === PATROL_CONSTANT ? onlineFreezeBalance : freezeBalance,
          remark: remark,
          accountId: accountId,
          driverUuid: driverUuid
        };
        const params = {
          offlineBalance: offlineAcctBalance,
          offlineFreezeAmt: this.type === 1 ? offlineFreezeAmt : -offlineFreezeAmt,
          offlineFrozenAmt: offlineFreezeBalance,
        }
        if (driverType === PATROL_CONSTANT) {
          const reg = /^(0\.\d{0,1}[1-9]|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/;
          if (!reg.test(freezeAmt) && !reg.test(offlineFreezeAmt)) {
            this.$message.warning("请输入正确得数字,并最多保留两位小数");
            return;
          }
          if ((!freezeAmt || freezeAmt >= 1000000) && (!offlineFreezeAmt || offlineFreezeAmt >= 1000000)) {
            this.$message.warning("只能输入100万以内的金额数");
            return;
          }
          Object.assign(p, params)
        }        
        this.call(frozenService, p, this.success, this.error);
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
  }
};
</script>

<style scoped>
.operateHandel {
  color: rgb(0, 132, 255);
  margin-left: 10px;
  cursor: pointer;
}
</style>
