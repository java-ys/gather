<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="风控审核" :visible="examineVisible" width="30%" @close="closeDialog">
    <el-form ref="addForm" :inline="true" :model="addForm" :rules="rules" size="small" label-width="110px">
      <el-row class="examine-style">
        <el-col :span="24">
          <el-form-item label="是否刷单" prop="forgeFlag">
            <el-select v-model="addForm.forgeFlag" placeholder="请选择" style="width: 240px">
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="examine-style">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark" type="textarea" :rows="5" placeholder="请输入内容" maxlength="50" show-word-limit resize="none" style="width: 240px">
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
import { audit } from "_o/api/salary/riskOrder";
import { deleteEmptyProps } from "_o/common/common";
export default {
  name: "riskExamine",
  props: {
    examineVisible: { type: Boolean, required: false, default: false },
    riskId: { type: Number, required: false, default: 0 }
  },
  data() {
    return {
      addForm: {},
      rules: {
        forgeFlag: [{ required: true, message: "请选择", trigger: "change" }],
        remark: [{ required: true, message: "请输入备注内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    closeDialog() {
      this.$refs["addForm"].resetFields();
      this.$emit("closeDialogHandle", "examine");
    },
    save() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let params = { ...this.addForm, id: this.riskId };
          audit(params).then(res => {
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

<style scoped lang="scss">
.examine-style {
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
