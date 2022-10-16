<!--
 * @Descritption:
 * @Author: xunzhibin
 * @Date: 2020-06-17 16:15:04
 * @LastEditors: xunzhibin
 * @LastEditTime: 2020-06-17 17:13:48
-->
<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible="addVisible" width="620px" @close="closeDialog">
    <div class="container">
      <el-form v-if="addForm" ref="addForm" :inline="true" :rules="rules" :model="addForm" size="small" label-width="150px" label-position="right">
        <el-form-item label="预警规则名称" prop="ruleName">
          <el-input v-model="addForm.ruleName" :disabled="isEdit" placeholder="请输入规则名称" maxlength="24" show-word-limit class="text-width"></el-input>
        </el-form-item>
        <el-form-item label="预警生效城市" prop="cityCode">
          <el-select v-model="addForm.cityCode" :disabled="isEdit" placeholder="请选择城市" class="text-width" filterable @change="setCityName">
            <el-option v-for="(cityObj, index) in cities" :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警开始时间" prop="validBeginTime">
          <el-date-picker v-model="addForm.validBeginTime" class="text-width" :disabled="isEdit" type="week" :clearable="false" placeholder="请选择开始时间" :format="'yyyy年第WW周(' + beginTimeDesc + ')'" :picker-options="pickerOptions" @blur="beginTimeBlurchange">
          </el-date-picker>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预警结束时间" prop="validEndTime">
          <el-date-picker v-model="addForm.validEndTime" class="text-width" :disabled="isEdit" :clearable="false" type="week" placeholder="请选择结束时间" :format="'yyyy年第WW周(' + endTimeDesc + ')'" :picker-options="pickerOptions" @blur="endTimeBlurchange">
          </el-date-picker>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预警业务线" prop="businessType">
          <el-select v-model="addForm.businessType" :disabled="isEdit" placeholder="请选择业务线" class="text-width" filterable>
            <el-option label="快享" :value="4"></el-option>
            <el-option label="专享" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警司机工资类型" prop="driverTag">
          <el-select v-model="addForm.driverTag" :disabled="isEdit" placeholder="预警司机工资类型" class="text-width">
            <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.itemvalue" :value="item.itemcode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励维度" prop="rulePeriod">
          <el-select v-model="addForm.rulePeriod" :disabled="isEdit" placeholder="请选择奖励维度" class="text-width" filterable>
            <el-option label="自然日" :value="3" :disabled="true"></el-option>
            <el-option label="自然周" :value="2"></el-option>
            <el-option label="自然月" :value="1" :disabled="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应发绩效奖励预警值" prop="rewardAlarmThreshold">
          <el-input v-model="addForm.rewardAlarmThreshold" placeholder="请输入预警金额" class="text-width"></el-input><span style="margin-left:10px">元</span>
        </el-form-item>
        <el-form-item label="薪酬流水比例预警值" prop="scaleAlarmThreshold">
          <el-input v-model="addForm.scaleAlarmThreshold" placeholder="请输入预警比例" class="text-width"></el-input><span style="margin-left:10px">%</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button v-show="!saving" type="primary" @click="saveRule">确定</el-button>
      <el-button type="info" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryCitiesWithAgent, getDicItemByDicCode } from "_o/api/salary/common";
import { addRules, updateRules } from "_o/api/salary/salaryWarning";
import { deleteEmptyProps } from "_o/common/common";
import { parseTime } from "@/libs/util";
export default {
  props: {
    title: { required: false, type: String },
    isEdit: { type: Boolean, required: true },
    addVisible: { type: Boolean, required: false },
    addForm: { type: Object, required: false, default: {}},
    getData: { default: null, type: Function }
  },
  data() {
    return {
      driverTypeList: [], // 司机工资类型
      cities: [],
      beginTimeDesc: "",
      endTimeDesc: "",
      saving: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return this.disabledDateFn(time);
        }
      },
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        driverTag: [
          {
            required: true,
            message: "请选择预警司机工资类型",
            trigger: "change"
          }
        ],
        validBeginTime: [
          { required: true, message: "请选择预警开始时间", trigger: "blur" },
          { validator: this.validateValidTime, trigger: "blur" }
        ],
        validEndTime: [
          { required: true, message: "请选择预警结束时间", trigger: "blur" },
          { validator: this.validateValidTime, trigger: "blur" }
        ],
        businessType: [
          { required: true, message: "请选择业务线", trigger: "change" }
        ],
        rulePeriod: [
          { required: true, message: "请选择奖励维度", trigger: "change" }
        ],
        rewardAlarmThreshold: [
          { required: true, message: "请输入预警金额", trigger: "blur" },
          { validator: this.validNumber, trigger: "blur" }
        ],
        scaleAlarmThreshold: [
          { required: true, message: "请输入预警比例", trigger: "blur" },
          { validator: this.validPercent, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "addForm.validBeginTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            begin = parseTime(val, "{y}-{m}-{d}");
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.beginTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    },
    "addForm.validEndTime": {
      handler(val) {
        if (val) {
          let D; let begin; let
            end;
          D = new Date(val);
          if (Object.prototype.toString.call(val) == "[object String]") {
            end = parseTime(val, "{y}-{m}-{d}");
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24 * 6),
              "{y}-{m}-{d}"
            );
          } else {
            begin = parseTime(
              new Date(D.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            end = parseTime(
              new Date(D.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          }
          this.endTimeDesc = begin + "~" + end;
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getDicItemByDicCode();
    this.getCities();
  },
  methods: {
    // 预警金额-大于0的任意7位整数,允许保留两位小数
    validNumber(rule, val, callback) {
      let reg = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
      if (!reg.test(val)) {
        callback(new Error("请输入大于0的数,最大7位整数,可保留2位小数"));
      } else if (!val || val > 9999999.99) {
        callback(new Error("请输入大于0的数,最大7位整数,可保留2位小数"));
      } else {
        callback();
      }
    },
    // 预警比例-100以内的任意整数,允许保留两位小数
    validPercent(rule, val, callback) {
      let reg = /^\d\.([0-9]{0,2}|[0-9][1-9])$|^[0-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
      if (!reg.test(val)) {
        callback(new Error("请输入0-100之间的数,可保留2位小数"));
      } else if (!val || val > 100) {
        callback(new Error("请输入0-100之间的数,可保留2位小数"));
      } else {
        callback();
      }
    },
    // 过期时间禁止点击
    disabledDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime();
      return times < Date.now();
    },
    // 预警开始/结束时间校验
    validateValidTime(rule, value, callback) {
      let desc; let
        compareDate;
      if (rule.field === "validBeginTime") {
        desc = "开始";
        compareDate = new Date(this.addForm.validEndTime);
      } else {
        desc = "结束";
        compareDate = new Date(this.addForm.validBeginTime);
      }

      let inputDate = new Date(value);
      let now = new Date();
      if (!value) {
        return callback(new Error("请选择预警" + desc + "时间"));
      } else if (
        desc === "开始" &&
        inputDate.getTime() > compareDate.getTime()
      ) {
        return callback(new Error("预警开始时间不能晚于预警结束时间"));
      } else if (
        desc === "结束" &&
        inputDate.getTime() < compareDate.getTime()
      ) {
        return callback(new Error("预警结束时间不能早于预警开始时间"));
      } else {
        return callback();
      }
    },
    // 失去焦点开始时间校验，跨度为12周
    beginTimeBlurchange() {
      if (this.addForm.validEndTime) {
        let end =
          (new Date(this.addForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间
        let begin =
          (new Date(this.addForm.validBeginTime).getTime() -
            1000 * 60 * 60 * 24) /
          1000; // 开始时间
        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 139)) {
          this.$message.warning("预警开始时间与预警结束时间跨度为12周");
          this.beginTimeDesc = "";
          this.addForm.validBeginTime = "";
        }
      }
    },
    // 失去焦点结束时间校验，跨度为12周
    endTimeBlurchange() {
      if (this.addForm.validBeginTime) {
        let begin;
        if (this.isEdit) {
          begin = new Date(this.addForm.validBeginTime).getTime() / 1000; // 开始时间
        } else {
          begin =
            (new Date(this.addForm.validBeginTime).getTime() -
              1000 * 60 * 60 * 24) /
            1000; // 开始时间
        }
        let end =
          (new Date(this.addForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间

        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 139)) {
          this.$message.warning("预警开始时间与预警结束时间跨度为12周");
          this.endTimeDesc = "";
          this.addForm.validEndTime = "";
        }
      }
    },
    closeDialog() {
      this.$refs["addForm"].resetFields();
      this.$emit("closeDialogHandle", "add");
    },
    getCities() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.cities.length === 0) {
            this.$message.error("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      });
    },
    setCityName(val) {
      queryCitiesWithAgent({ cityCode: val }).then(res => {
        if (res.data.success && res.data.data) {
          let obj = {};
          obj = this.cities.find(item => {
            return item.orgCode === val; // 筛选出匹配数据
          });
          if (obj === undefined) {
            return;
          }
          this.addForm.cityName = obj.orgName;
          this.addForm.cityCode = obj.orgCode;
        }
      });
    },
    // 获取司机工资类别
    getDicItemByDicCode() {
      getDicItemByDicCode().then(res => {
        if (res.data.success) {
          this.driverTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    saveRule() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (
            Object.prototype.toString.call(this.addForm.validBeginTime) ==
            "[object Date]"
          ) {
            this.addForm.validBeginTime = parseTime(
              new Date(this.addForm.validBeginTime.getTime() - 1000 * 60 * 60 * 24),
              "{y}-{m}-{d}"
            );
            this.addForm.validEndTime = parseTime(
              new Date(this.addForm.validEndTime.getTime() + 1000 * 60 * 60 * 24 * 5),
              "{y}-{m}-{d}"
            );
          } else {
            this.addForm.validBeginTime = parseTime(
              this.addForm.validBeginTime,
              "{y}-{m}-{d}"
            );
            this.addForm.validEndTime = parseTime(
              this.addForm.validEndTime,
              "{y}-{m}-{d}"
            );
          }
          if (this.isEdit) {
            // 编辑规则
            updateRules(deleteEmptyProps({ ...this.addForm, ruleType: 4 })).then(res => {
              if (res.data.success) {
                this.$message.success(res.data.msg);
                this.$emit("successHandle");
              } else {
                this.saving = false;
                this.$message.error(res.data.msg);
              }
            });
          } else {
            // 新增规则
            addRules({ ...this.addForm, ruleType: 4 }).then(res => {
              if (res.data.success) {
                this.$message.success(res.data.msg);
                this.$emit("successHandle");
              } else {
                this.saving = false;
                this.$message.error(res.data.msg);
              }
            });
          }
          this.$refs["addForm"].resetFields();
          this.closeDialog();
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  margin-left: 50px;
}
.text-width {
  width: 280px !important;
}
.footer {
  width: 93%;
  margin: 5px;
  display: flex;
  justify-content: center;
}
</style>
