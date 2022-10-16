<template>
  <div>
    <el-button v-if="show" v-preventReClick="3000" type="primary" :size="btnSize" :disabled="loading" @click="exportExcel">{{btnText}}</el-button>
    <p v-if="loading">数据导出中，请稍等...</p>
  </div>
</template>

<script>
import { exportResumeRcCnt } from "_o/api/salary/exportApi";
import { excelDownload } from "_o/common/common";
export default {
  name: "Export",
  props: {
    queryForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    queryExport: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    btnSize: {
      type: String,
      default: "small"
    },
    btnText: {
      type: String,
      default: "批量导出"
    }
  },
  data() {
    return {
      show: true
    };
  },
  watch: {
    // queryForm:{//深度监听，可监听到对象、数组的变化
    //     handler(val, oldVal){
    //         console.log(this.loading)
    //         this.$emit('loadingStatus')
    //     },
    //     deep:true
    // }
  },
  mounted() {
    if (this.queryExport) {
      this.show = this.hasPermission(this.queryExport);
    }
  },
  methods: {
    // 导出- 版本二
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "currPage" ||
          propName === "pageSize" ||
          propName === "sortColumnName" ||
          propName === "isDesc" ||
          (requestParams[propName] instanceof Array &&
            requestParams[propName].length === 0)
        ) {
          delete requestParams[propName];
        }
      }
      if (this.loading) {
        return;
      }
      if (Object.keys(requestParams).length === 0) {
        this.$confirm("请先选择筛选条件", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        return;
      }
      new Promise(resolve => {
        this.$emit("fatherExport");
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.$emit("loadingStatus");
        }, 5000);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div {
  display: inline;
  margin-left: 10px;
}
p {
  display: inline;
  font-size: 13px;
  line-height: 32px;
}
::v-deep .el-button.is-disabled,
::v-deep .el-button.is-disabled:focus,
::v-deep .el-button.is-disabled:hover {
  background: #ccc;
  border-color: #ccc;
}
</style>
