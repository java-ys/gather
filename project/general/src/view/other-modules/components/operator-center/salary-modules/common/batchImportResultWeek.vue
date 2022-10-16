<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="导入结果详情"
    style="text-align: center;"
    :visible="resultVisible"
    @close="closeDialog"
    width="70%">
    <el-row class="detail-style">
      <p class="detail-text">
        导入总数： {{resultData.batchImportVo.successCount + resultData.batchImportVo.importFailCount}}, 
        成功： <span style="color: green">{{resultData.batchImportVo.successCount}}</span>条，
        失败： <span style="color: red"> {{resultData.batchImportVo.importFailCount}}</span>条
      </p>
      <template v-if="resultData.failedRowArrL.length == 1 && resultData.failedRowArrR.length == 0">
        <div style="margin: 25px 0 10px 5px; font-weight: bold; font-size: 18px">错误及重复信息汇总</div>
        <el-col :span="24" style="margin-bottom: 10px;">
          <el-table border size="mini" :data="resultData.failedRowArrL" style="width: 100%;">
            <el-table-column
              prop="rowNum"
              label="行数"
              width="50">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误/重复信息"
              min-width="200">
            </el-table-column>
          </el-table>
        </el-col>
      </template>
      <template v-if="resultData.failedRowArrR.length > 0">
        <div style="margin: 25px 0 10px 5px; font-weight: bold; font-size: 18px">错误及重复信息汇总</div>
        <el-col :span="12" style="margin-bottom: 10px">
          <el-table border size="mini" :data="resultData.failedRowArrL" style="width: 100%;">
            <el-table-column
              prop="rowNum"
              label="行数"
              width="50">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误/重复信息"
              min-width="200">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12" style="margin-bottom: 10px">
          <el-table border size="mini" :data="resultData.failedRowArrR" style="width: 100%;">
            <el-table-column
              prop="rowNum"
              label="行数"
              width="50">
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误/重复信息"
              min-width="200">
            </el-table-column>
          </el-table>
        </el-col>
      </template>
    </el-row>
    <el-button @click="closeDialog" type="info" style="margin-top: 15px">关闭</el-button>
  </el-dialog>
</template>

<script>
export default {
  props: {
    batchAddResultData: {
      required: false,
      type: Object,
      default: ()=> {
        return {}
      }
    },
    resultVisible: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      resultData: {}
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialogHandle', 'result');
    },
  },
  created() {
    if (this.batchAddResultData && this.batchAddResultData.response) {
      let x = eval(this.batchAddResultData.response);
      this.resultData = x.data;
      if (this.resultData.flag == 'false') {
        this.$alert('导入的简历数据超过100条，系统已对最靠前的100条记录进行筛选处理');
      }
      this.resultData.failedRowArrL = [];
      this.resultData.failedRowArrR = [];
      let count = 0;
      this.resultData.batchImportVo.failReasonMap.forEach(each => {
        for (let key in each) {
          if (each.hasOwnProperty(key)) {
            if (count % 2 == 0) {
              this.resultData.failedRowArrL.push({rowNum: key, msg: each[key]});
            }
            else {
              this.resultData.failedRowArrR.push({rowNum: key, msg: each[key]});
            }
            count++;
          }
        }
      });
    } else {
      this.$emit('errorImport');
    }
  }
}
</script>

<style scoped>
  .detail-style {
    font-size: 14px;
  }

  .detail-text {
    font-weight: bold;
    font-size: 18px;
    margin: 15px 0 10px 8px;
  }
</style>
