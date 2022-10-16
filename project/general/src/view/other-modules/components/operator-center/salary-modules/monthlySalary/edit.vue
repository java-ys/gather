<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-07-06 15:26:38
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-22 11:30:18
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :center="true"
    title="编辑"
    :visible.sync="modalVisiable"
    width="28%"
    @close="closeDialog"
  >
    <el-form ref="editForm" :model="formData" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="月应发合计"
            label-width="100px"
            prop="afterCorrectionTotal"
          >
            <el-input v-model="formData.afterCorrectionTotal"></el-input>
          </el-form-item>
          <el-form-item
            label="应发合计调整备注"
            label-width="100px"
          >
            <el-input
              v-model="formData.correctionReason"
              maxlength="50"
              show-word-limit
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="附加费合计"
            label-width="100px"
            prop="surchargeCorrectionAmount"
          >
            <el-input v-model="formData.surchargeCorrectionAmount"></el-input>
          </el-form-item>
          <el-form-item
            label="附加费合计调整备注"
            label-width="100px"
          >
            <el-input
              v-model="formData.surchargeCorrectionRemark"
              maxlength="50"
              show-word-limit
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="successHandle">确 定</el-button>
      <el-button type="info" @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editMonthAward } from "_o/api/salary/salaryRule";
// 输入金额校验
const validateAmount = (rule, value, callback) => {
  if (
    value &&
    value != 0 &&
    !/^(\-?)(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)
  ) {
    return callback(new Error("限制输入7位数字，可保留2位小数"));
  } else if ((value && value >= 10000000) || value <= -10000000) {
    return callback(new Error("限制输入7位数字，可保留2位小数"));
  }
  return callback();
};
export default {
  props: ["editVisiable", "salaryId"],
  data() {
    return {
      modalVisiable: false,
      formData: {
        afterCorrectionTotal: "",
        correctionReason: "",
        surchargeCorrectionAmount: "",
        surchargeCorrectionRemark: ""
      },
      rules: {
        afterCorrectionTotal: [{ validator: validateAmount, trigger: "blur" }],
        surchargeCorrectionAmount: [{ validator: validateAmount, trigger: "blur" }],
      }
    };
  },
  watch: {
    editVisiable: {
      handler(val) {
        this.modalVisiable = val;
        this.formData = {
          afterCorrectionTotal: "",
          correctionReason: "",
          surchargeCorrectionAmount: "",
          surchargeCorrectionRemark: ""
        }
      },
      immediate: true
    }
  },
  methods: {
    successHandle() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          if (!this.formData.afterCorrectionTotal && !this.formData.surchargeCorrectionAmount) {
            this.$alert("月应发合计或附加费合计至少填写一项");
            return;
          }
          editMonthAward({
            salaryId: this.salaryId,
            salaryType: 3,
            afterCorrectionTotal: this.formData.afterCorrectionTotal,
            correctionReason: this.formData.correctionReason,
            surchargeCorrectionAmount: this.formData.surchargeCorrectionAmount,
            surchargeCorrectionRemark: this.formData.surchargeCorrectionRemark
          })
            .then(res => {
              if (res.data.success) {
                this.$alert("编辑成功");
                this.$emit("handleSuccessEdit");
                this.$refs["editForm"].resetFields();
              } else {
                this.$alert(res.data.msg);
                this.$emit("closeDialogHandle", "edit");
                this.$refs["editForm"].resetFields();
              }
            })
            .catch(error => {
              this.$emit("closeDialogHandle", "edit");
              this.$alert("标记正常失败,请稍后重试");
              this.$refs["editForm"].resetFields();
            });
        }
      });
    },
    closeDialog() {
      this.$refs.editForm.resetFields();
      this.$emit("closeDialogHandle", "edit");
    }
  }
};
</script>
<style></style>
