<template>
  <div class="auditWrap">
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="个税导入"
      :visible="audit.batchInsertVisible"
      width="30%"
      @close="cancel"
    >
      <div>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { approval } from "./index.js";
import { reviewSubmit } from "_o/api/salary/common";
export default {
  props: {
    ruleUuid: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      ...approval,

    };
  },
  methods: {
    cancel() {
      this.audit.batchInsertVisible = false;
    },
    submit() {

    }
  }
};
</script>
<style>
  .auditWrap label{
		font-weight: normal
	}
  .auditWrap .el-form-item{
		margin-bottom: 12px
	}
  .auditWrap .el-form-item__content{
    line-height: 34px;
    height: 34px;
  }
  .auditWrap .el-input__inner{
    line-height: 34px;
    height: 34px;
  }
  .auditWrap .el-form-item__label{
    line-height: 34px;
  }
</style>
