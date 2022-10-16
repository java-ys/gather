<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="编辑" :visible="editVisible" width="30%" @close="closeDialog">
    <el-form ref="editForm" :inline="true" :model="editForm" :rules="rules" size="small" label-width="110px">
      <el-row class="customer-style">
        <el-col :span="24">
          <el-form-item label="补扣款" prop="manualFare">
            <el-input v-model="editForm.manualFare" type="text" placeholder="请输入金额" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="customer-style">
        <el-col :span="24">
          <el-form-item label="备注" prop="operateRemark">
            <el-input v-model="editForm.operateRemark" type="textarea" :rows="4" placeholder="请说明原因" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button-group" style="margin-top:20px;text-align:center">
      <el-button type="info" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateOrder } from "_o/api/salary/customerAdjustment";
import { deleteEmptyProps } from "_o/common/common";
export default {
  name: "edit",
  props: {
    id: { type: String, required: false, default: "" },
    editVisible: { type: Boolean, required: false, default: false },
    editForm: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      rules: {
        manualFare: [
          { required: true, message: "请输入补扣款金额", trigger: "blur" },
          { validator: this.validNumber, trigger: "blur" }
        ],
        operateRemark: [
          { required: true, message: "请输入备注内容", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 补扣款校验-任意7位整数,允许保留两位小数
    validNumber(rule, val, callback) {
      let reg = /^[-+]?0\.[-+]?([0-9]|\d[0-9])$|^[-+]?[1-9]\d{0,7}\.\d{0,2}$|^[-+]?([0-9]\d{0,6})$/;
      if (!reg.test(val)) {
        callback(new Error("最大7位整数,可保留2位小数"));
      } else if (!val || val > 9999999.99) {
        callback(new Error("最大7位整数,可保留2位小数"));
      } else {
        callback();
      }
    },
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    save() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let params = { ...this.editForm, id: this.id };
          updateOrder(params).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.closeDialog();
              this.$emit("successHandle");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.customer-style {
  font-size: 15px;
  margin: 0 0 10px 30px;
  line-height: 1.6;
}
</style>
