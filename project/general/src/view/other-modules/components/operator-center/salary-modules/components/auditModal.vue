<template>
  <div class="auditWrap">
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="审核" :visible="audit.dialogVisible" width="30%" @close="cancel">
      <div class="reviewDialog">
        <el-form ref="auditForm" label-width="70px" :rules="rules" :model="queryForm">
          <el-form-item label="处理：">
            <el-radio v-model="queryForm.reviewStatus" label="1">通过</el-radio>
            <el-radio v-model="queryForm.reviewStatus" label="2">驳回</el-radio>
          </el-form-item>
          <el-form-item label="意见：" prop="remark">
            <el-input v-model="queryForm.remark" placeholder="请输入处理意见" show-word-limit resize="none" type="textarea" maxlength="100" :autosize="{ minRows: 4, maxRows: 4 }"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div v-if="rewardType == 1 && isShow && salaryStatusList.btnStatus == '1' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1" style="padding:0 0 0 15px">
      <p>{{warnForm.cityName}}{{warnForm.currentYear}}年第{{warnForm.warnReward}}周周奖励初始计算结果,总人数{{details.totalPersonNum}},工资总额{{details.totalSalary}}元,平均薪资{{details.averageSalary}}元</p>
      <p>其中,有{{details.personNumOverAverage}}人本周周奖励高于三周平均薪资,超出额大于20%&nbsp;{{details.personNumOverTwentyPercent}}人,超出额大于50%&nbsp;{{details.personNumOverFiftyPercent}}人,超出额大于80%&nbsp;{{details.personNumOverEightyPercent}}人,具体可点击下载下方预警报表</p>
      </div> -->
      <!-- <div v-else-if="rewardType == 2 && isShow && salaryStatusList.btnStatus == '1' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1" style="padding:0 0 0 15px">
        <p>{{warnForm.cityName}}{{warnForm.salaryMonth ? warnForm.salaryMonth.split('-')[0] : ''}}年{{warnForm.salaryMonth ? warnForm.salaryMonth.split('-')[1] : ''}}月月工资初始计算结果,总人数{{details.totalPersonNum}},工资总额{{details.totalSalary}}元,平均薪资{{details.averageSalary}}元</p>
        <p>其中,有{{details.personNumOverAverage}}人本月月工资高于三月平均薪资,超出额大于20%&nbsp;{{details.personNumOverTwentyPercent}}人,超出额大于50%&nbsp;{{details.personNumOverFiftyPercent}}人,超出额大于80%&nbsp;{{details.personNumOverEightyPercent}}人,具体可点击下载下方预警报表</p>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="salaryStatusList.btnStatus == '1' && salaryStatusList.flowLevel == '1' && salaryStatusList.appShow != 1" @click="exportExcel(rewardType)">下载预警报表</el-button> -->
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { approval } from "./index.js";
import { reviewSubmit } from "_o/api/salary/common";
import { getWeekSalaryWarning, getMonthSalaryWarning } from "_o/api/salary/salary";
import {
  downLoadWeekSalaryWarning,
  downLoadMonthSalaryWarning
} from "_o/api/salary/exportApi";
import { excelDownload } from "_o/common/common";
export default {
  props: {
    ruleUuid: {
      type: String,
      default: ""
    },
    rewardType: {
      type: Number,
      default: 1
    },
    salaryStatusList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    warnForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      ...approval,
      queryForm: {
        reviewStatus: "1",
        remark: "",
        details: {
          totalPersonNum: "",
          totalSalary: "",
          averageSalary: "",
          personNumOverAverage: "",
          personNumOverTwentyPercent: "",
          personNumOverFiftyPercent: "",
          personNumOverEightyPercent: ""
        }
      },
      isShow: false,
      rules: {
        remark: [
          { required: true, message: "请输入处理意见", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    audit: {
      handler(value) {
        if (!this.audit.dialogVisible) {
          if (this.$refs["auditForm"]) {
            this.$refs["auditForm"].resetFields();
          }
        }
      },
      deep: true
    }
  },
  methods: {
    exportExcel(rewardType) {
      let params = {};
      if (rewardType == 1) {
        params = {
          cityCode: this.warnForm.cityCode,
          queryWeek: this.warnForm.queryWeek
        };
        downLoadWeekSalaryWarning(params).then(res => {
          excelDownload(res.data, "周奖励预警报表数据信息");
        });
      } else {
        params = {
          cityCode: this.warnForm.cityCode,
          salaryMonth: this.warnForm.salaryMonth
        };
        downLoadMonthSalaryWarning(params).then(res => {
          excelDownload(res.data, "月奖励预警报表数据信息");
        });
      }
    },
    getWeekData() {
      let params = {
        cityCode: this.warnForm.cityCode,
        queryWeek: this.warnForm.queryWeek
      };
      getWeekSalaryWarning(params).then(res => {
        if (res.data.success) {
          this.details = res.data.data;
          this.isShow = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    getMonthData() {
      let params = {
        cityCode: this.warnForm.cityCode,
        salaryMonth: this.warnForm.salaryMonth
      };
      getMonthSalaryWarning(params).then(res => {
        if (res.data.success) {
          this.details = res.data.data;
          this.isShow = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    cancel() {
      this.audit.dialogVisible = false;
      this.queryForm.reviewStatus = "1";
    },
    submit() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          this.$emit("reviewSubmit", this.queryForm);
        } else {
          this.$message({
            message: "请输入处理意见",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.auditWrap label {
  font-weight: normal;
}
.auditWrap .el-form-item {
  margin-bottom: 12px;
}
.reviewDialog {
  .is-required {
    height: 60px;
  }
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
