<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="editVisible" width="30%" @close="closeDialog">
    <el-form ref="editForm" :inline="true" :model="editForm" :rules="rules" size="small" label-width="110px">
      <el-row class="customer-style">
        <el-col :span="24">
          <el-form-item label="备注" prop="operateRemark">
            <el-input v-model="editForm.operateRemark" type="textarea" :rows="5" :placeholder="operateStatus == 1 ? '请输入正常核算说明' : '请输入暂停核算原因说明'" show-word-limit maxlength="50" resize="none" style="width: 260px">
            </el-input>
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
import { normalGrant } from "_o/api/salary/abnormalOrder";
import { deleteEmptyProps } from "_o/common/common";
export default {
  name: "edit",
  props: {
    title: { type: String, required: false, default: "" },
    operateStatus: { type: Number, required: false, default: 1 },
    id: { type: Number, required: false },
    businessId: { type: Number, required: false },
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
        operateRemark: [
          { required: true, message: "请输入备注内容", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    save() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let params = {
            id: this.id,
            operateStatus: this.operateStatus,
            businessId: this.businessId,
            operateRemark: this.editForm.operateRemark
          };
          // grantType-1:正常核算；2：暂停核算
          normalGrant(params).then(res => {
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

<style scoped lang='scss'>
.customer-style {
  font-size: 15px;
  margin: 0 0 10px 30px;
  line-height: 1.6;
}
::v-deep .el-textarea .el-input__count {
  color: #909399 !important;
  background: #fff !important;
  position: absolute !important;
  font-size: 12px !important;
  bottom: 5px !important;
  right: 10px !important;
}
</style>
