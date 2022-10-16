<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="基本工资规则详情" width="70%" :visible="detailVisible" @close="closeDialog">
    <!-- 基本 -->
    <el-form v-if="editForm" id="baseWageItem" ref="editForm" :inline="true" :model="editForm" size="small" label-width="130px" label-position="left">
      <el-row style="margin: 5px 30px;">
        <el-col :span="12">
          <el-form-item label="规则代码:">{{editForm.ruleCode}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则名称:">{{editForm.ruleName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市:">{{editForm.cityName}}</el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="司机档案所属区县:">{{editForm.countryName}}</el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="生效起始月份:">{{parseTimeDetail(editForm.validBeginTime)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束月份:">{{parseTimeDetail(editForm.validEndTime)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品线:">{{businessTypeWrapper(editForm.businessType)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机工资类别:">{{SalaryTypeFormatter(editForm.driverTag)}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营模式:">{{operationTypeFormatter(editForm.operationType)}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="运营商:">
            <span v-for="(agent, index) in editForm.agentInfoList" :key="agent.agentUuid">{{agent.agentName}} {{(index === editForm.agentInfoList.length - 1) ? '' : ','}} </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 93%;margin: 5px 30px;">
        <template>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="考勤工资" name="attendanceSalary"></el-tab-pane>
            <el-tab-pane label="工龄工资" name="workSalary"></el-tab-pane>
            <el-tab-pane label="等级工资" name="levelSalary"></el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
    </el-form>
    <!-- 考勤工资 -->
    <el-form v-if="attendanceForm" ref="attendanceForm" :inline="true" :model="attendanceForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'attendanceSalary'">
        <el-card class="box-card">
          <div>
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">工资规则:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="月考勤工资:" label-width="100px" size="mini">{{attendanceForm.dutySalary ? attendanceForm.dutySalary + '元' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="日薪标准:" label-width="100px" size="mini">{{attendanceForm.dailyWageStandard ? attendanceForm.dailyWageStandard + '元' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="每天缺勤扣减标准:" label-width="140px" size="mini">{{attendanceForm.absenceDeductStandard ? attendanceForm.absenceDeductStandard + '元' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">扣款场景:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="旷工扣款:" label-width="100px" size="mini">{{attendanceForm.absentDeduct ? attendanceForm.absentDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="事假扣款:" label-width="100px" size="mini">{{attendanceForm.casualLeaveDeduct ? attendanceForm.casualLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时长未达标扣款:" label-width="140px" size="mini">{{attendanceForm.dutyAbnormalDeduct ? attendanceForm.dutyAbnormalDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="病假扣款:" label-width="100px" size="mini">{{attendanceForm.sickLeaveDeduct ? attendanceForm.sickLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="婚假扣款:" label-width="100px" size="mini">{{attendanceForm.marriageLeaveDeduct ? attendanceForm.marriageLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="丧假扣款:" label-width="140px" size="mini">{{attendanceForm.funeralLeaveDeduct ? attendanceForm.funeralLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="陪产假扣款:" label-width="100px" size="mini">{{attendanceForm.parentalLeaveDeduct ? attendanceForm.parentalLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="产假扣款:" label-width="100px" size="mini">{{attendanceForm.maternityLeaveDeduct ? attendanceForm.maternityLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工伤扣款:" label-width="140px" size="mini">{{attendanceForm.injuryLeaveDeduct ? attendanceForm.injuryLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="年假扣款:" label-width="100px" size="mini">{{attendanceForm.annualLeaveDeduct ? attendanceForm.annualLeaveDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="事故假扣款:" label-width="100px" size="mini">{{attendanceForm.accidentDeduct ? attendanceForm.accidentDeduct + '%' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-form>
    <!-- 工龄工资 -->
    <el-form v-if="workForm" ref="workForm" :inline="true" :model="workForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'workSalary'">
        <el-card class="box-card">
          <div>
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">奖励规则:</el-col>
              <el-col :span="22">
                <el-row class="box-text">
                  <el-col :span="8">
                    <el-form-item label="基础工龄工资:" label-width="110px" size="mini">{{workForm.basicSenioritySalary ? workForm.basicSenioritySalary + '元' : ''}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="每年递增标准:" label-width="110px" size="mini">{{workForm.seniorityGradSalary ? workForm.seniorityGradSalary + '元' : ''}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-form>
    <!-- 等级工资 -->
    <el-form v-if="levelForm" :inline="true" :model="levelForm" size="small" label-width="120px" label-position="left">
      <el-row v-if="activeName == 'levelSalary'">
        <el-card class="box-card">
          <div>
            <el-row class="box-text">
              <el-col :span="24" class="mb-10">计算周期:&nbsp;&nbsp;&nbsp;每月</el-col>
            </el-row>
            <el-row class="box-text">
              <el-col :span="1.5" class="mt-2">工资规则:</el-col>
              <el-col :span="22">
                <div v-for="(item, index) in levelForm.levelRuleDataList" :key="index">
                  <el-row class="box-text">
                    <el-col :span="8">
                      <el-form-item label="司机等级:" size="mini" label-width="100px">{{levelFormatter(item.driverLevel)}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="等级标准:" size="mini" label-width="100px">{{item.levelValue ? item.levelValue + '元' : ''}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          </div>
        </el-card>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { parseTime } from "@/libs/util";

export default {
  props: {
    detailVisible: { type: Boolean, required: false, default: false },
    editForm: {
      type: Object,
      required: false,
      default: {}
    },
    attendanceForm: {
      type: Object,
      required: false,
      default: {}
    },
    workForm: {
      type: Object,
      required: false,
      default: {}
    },
    levelForm: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    driverTypeList: { type: Array, required: false, default: [] }
  },
  data() {
    return {
      activeName: "attendanceSalary"
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "detail");
    },
    levelFormatter(level) {
      switch (level) {
        case "0":
          return "初级";
        case "1":
          return "中级";
        case "2":
          return "高级";
        default:
          return "";
      }
    },
    SalaryTypeFormatter(type) {
      let key = "";
      let arr = this.driverTypeList.map((item, index) => {
        if (type == item.itemcode) {
          key = item.itemvalue;
        }
      });
      return key;
    },
    operationTypeFormatter(value) {
      switch (value) {
        case 1:
          return "自营司机";
        case 2:
          return "UP司机";
        default:
          return "";
      }
    },
    statusWrapper(ruleStatus) {
      if (ruleStatus == "0") {
        return "初始";
      } else if (ruleStatus == "1") {
        return "审核中";
      } else if (ruleStatus == "2") {
        return "启用";
      } else if (ruleStatus == "3") {
        return "驳回";
      }
    },
    // 2:专车; 4:快车;
    businessTypeWrapper(value) {
      switch (value) {
        case 2:
          return "专享";
        case 4:
          return "快享";
        case 6:
          return "惠享";
        default:
          return "";
      }
    },
    businessTypeOther(value) {
      switch (value) {
        case "1":
          return "按周";
        case "2":
          return "按月";
        default:
          return "";
      }
    },
    parseTimeDetail(time) {
      return parseTime(time, "{y}-{m}");
    }
  }
};
</script>

<style scoped>
.button-group {
  margin: 20px 0;
}
.button-group button {
  margin: 0 15px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 93%;
  margin: 5px 30px;
}
.check-text {
  margin-left: 25px;
  font-size: 11px;
  color: gray;
}
.box-text {
  margin: 0 0 5px 10px;
  color: #666666;
  line-height: 26px;
}
.mt-2 {
  margin-top: 2px;
}
.mb-10 {
  margin-bottom: 10px;
}
.text-width {
  width: 140px;
}
</style>
