<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-24 14:32:34
 * @LastEditors: wangp
 * @LastEditTime: 2020-06-29 15:26:51
-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    :visible="editVisible"
    width="70%"
    @close="closeDialog"
  >
    <el-form
      id="baseWageItem"
      ref="editForm"
      :inline="true"
      :model="editForm"
      :rules="rules"
      class="demo-form-inline"
      size="small"
      label-width="120px"
    >
      <el-row>
        <el-col v-if="isEdit && submitType == 2" :span="12">
          <el-form-item label="规则代码">
            <el-input
              v-model="editForm.ruleCode"
              placeholder="规则代码"
              readonly="readonly"
              class="win-300"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="ruleName">
            <el-input
              v-model="editForm.ruleName"
              placeholder="规则名称"
              maxlength="16"
              class="win-300"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="cityCode">
            <el-select
              v-model="editForm.cityCode"
              :disabled="isEdit && submitType == 2"
              placeholder="城市"
              filterable
              class="win-300"
              @change="setCityName"
            >
              <template v-for="(cityObj, index) in cities">
                <el-option
                  :label="cityObj.orgName"
                  :value="cityObj.orgCode"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isEdit && submitType == 2" :span="12">
          <el-form-item label="业务线" prop="businessType">
            <el-select
              v-model="editForm.businessType"
              placeholder="业务线"
              class="win-300"
              @change="getElectronicFenceInfo"
            >
              <el-option label="出租车" :value="1"></el-option>
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效起始周" prop="validBeginTime">
            <el-date-picker
              v-model="editForm.validBeginTime"
              class="win-300"
              :disabled="isEdit && submitType == 2"
              type="week"
              :clearable="false"
              placeholder="选择生效起始周"
              :format="'yyyy年第WW周(' + beginTimeDesc + ')'"
              :picker-options="pickerOptions"
              @blur="beginTimeBlurchange"
              @change="beginTimeDescFormatter"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生效结束周" prop="validEndTime">
            <el-date-picker
              v-model="editForm.validEndTime"
              class="win-300"
              :disabled="isEdit && submitType == 2"
              :clearable="false"
              type="week"
              placeholder="选择生效结束周"
              :format="'yyyy年第WW周(' + endTimeDesc + ')'"
              :picker-options="pickerOptions"
              @blur="endTimeBlurchange"
              @change="endTimeDescFormatter"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="!isEdit" :span="12">
          <el-form-item label="业务线" prop="businessType">
            <el-select
              v-model="editForm.businessType"
              placeholder="业务线"
              class="win-300"
              @change="getElectronicFenceInfo"
            >
              <el-option label="专享" :value="2"></el-option>
              <el-option label="快享" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机工资类别" prop="driverTag">
            <el-select
              v-model="editForm.driverTag"
              placeholder="司机工资类别"
              class="win-300"
            >
              <el-option
                v-for="(item, index) in driverTypeList"
                :key="index"
                :label="item.itemvalue"
                :value="item.itemcode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 93%;margin: 5px 30px;">
        <template>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="阶梯绩效抽成奖励" name="royaltyAward">
            </el-tab-pane>
            <el-tab-pane label="阶梯绩效固定奖励" name="fixedAward">
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <el-col :span="3" style="margin-top: 5px">
                <el-checkbox
                  v-if="activeName == 'royaltyAward'"
                  v-model="ruleCheck"
                  true-label="1"
                  false-label="0"
                  @change="handleChange"
                >阶梯绩效抽成奖励
                </el-checkbox>
                <el-checkbox
                  v-else
                  v-model="ruleCheck"
                  true-label="1"
                  false-label="0"
                  @change="handleChange"
                >阶梯绩效固定奖励
                </el-checkbox>
              </el-col>
            </span>
          </div>
          <template v-if="!showForm">
            <span class="check-text">(勾选后，阶梯绩效奖励生效)</span><br />
          </template>
          <template v-else>
            <el-row>
              <el-col :span="14">
                <el-form-item label="订单流水周期：" size="mini">
                  <template>
                    <el-radio-group v-model="editForm.statPeriod">
                      <el-radio label="1">日流水</el-radio>
                      <el-radio label="2">周流水</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
              <el-col v-if="activeName == 'royaltyAward'" :span="8">
                <el-form-item label="奖励上限" size="mini" label-width="100px">
                  <el-input
                    v-model="editForm.upperThreshold"
                    placeholder="元"
                    style="width: 80px"
                  ></el-input><span>&nbsp;元</span>
                  <div class="el-form-item__error">{{validateData.msg}}</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <span style="margin-left: 2px;color: #606266;font-weight: bold">奖励规则：</span>
              </el-col>
            </el-row>
            <el-row>
              <div
                v-for="(item, index) in editForm.rulesList"
                :key="index"
                class="text item"
              >
                <el-row style="margin-top:10px">
                  <el-col :span="10" :offset="1">
                    <span
                      style="line-height: 1.9; font-weight: bold;margin-right:10px"
                    >规则{{index + 1}}</span>
                    <el-form-item
                      label="订单流水区间"
                      size="mini"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.orderIntervalStart"
                        placeholder="元"
                        style="width: 80px"
                      ></el-input><span>&nbsp;元</span>
                      <div class="el-form-item__error">
                        {{validateData.msg}}
                      </div>
                    </el-form-item>
                    <el-form-item label=" - " size="mini" label-width="16px">
                      <el-input
                        v-model="item.orderIntervalEnd"
                        placeholder="元"
                        :class="[
                          validateData.success ? '' : 'border-validate-red'
                        ]"
                        style="width: 80px"
                        @blur="ruleValidate('P2', index)"
                      ></el-input><span>&nbsp;元</span>
                      <div class="el-form-item__error">
                        {{validateData.msg}}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      v-if="activeName == 'royaltyAward'"
                      label="奖励订单流水"
                      size="mini"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.rewardValue"
                        placeholder="百分比"
                        :class="[
                          validateData.success ? '' : 'border-validate-red'
                        ]"
                        style="width: 80px"
                        @blur="ruleValidate('P3', index)"
                      ></el-input><span>&nbsp;%</span>
                      <div class="el-form-item__error">
                        {{validateData.msg}}
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-else
                      label="奖励金额"
                      size="mini"
                      label-width="100px"
                    >
                      <el-input
                        v-model="item.objectValue"
                        :class="[
                          validateData.success ? '' : 'border-validate-red'
                        ]"
                        style="width: 80px"
                        @blur="ruleValidate('P3', index)"
                      ></el-input><span>&nbsp;元</span>
                      <div class="el-form-item__error">
                        {{validateData.msg}}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      type="info"
                      size="mini"
                      @click="handleMinus(index)"
                    >-
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-row>
            <div class="button-group-mini-plus">
              <el-row>
                <el-col :span="20"> &nbsp; </el-col>
                <el-col :span="2">
                  <el-button type="primary" size="mini" @click="handlePlus">
                    +
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-card>
      </el-row>
    </el-form>
    <div
      class="footer"
      style="width:93%;margin:5px 30px;display:flex;display:inline-block"
    >
      <div class="button-group" style="float:right;">
        <el-button v-show="!saving" type="primary" @click="handleSave">保存</el-button>
        <el-button v-print="'#baseWageItem'" type="primary">打印</el-button>
        <el-button type="info" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { queryElectronicFenceInfo } from "_o/api/salary/salary";
import { addStepPerformance, updateStepPerformance } from "_o/api/salary/salaryRule";
import {
  cityListByAll,
  queryCitiesWithJurisdiction,
  queryCitiesWithAgent,
  getDicItemByDicCode
} from "_o/api/salary/common";
import { parseTime } from "@/libs/util";
import royaltyAward from "./ruleEditTab/royaltyAward";
import fixedAward from "./ruleEditTab/fixedAward";
export default {
  components: {
    royaltyAward,
    fixedAward
  },
  props: {
    isEdit: { type: Boolean, required: false, default: false },
    submitType: {
      type: Number,
      default: 1
    },
    title: { type: String, required: false },
    editVisible: { type: Boolean, required: true },
    editForm: {
      type: Object,
      required: false
    },
    rulesList: {
      type: Array,
      required: false,
      default: []
    },
    afterResetCheckBox: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      saving: false,
      showForm: false,
      activeName: "royaltyAward",
      beginTimeDesc: "",
      endTimeDesc: "",
      cities: [],
      driverTypeList: [],
      performanceLimitData: {},
      orderAwardData: {},
      floatWaterAwardData: {},
      royaltyAwardData: {},
      fixedAwardData: {},
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
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        driverTag: [
          { required: true, message: "请选择司机类别", trigger: "change" }
        ],
        validBeginTime: [
          { validator: this.validateValidTime, trigger: "change" }
        ],
        validEndTime: [{ validator: this.validateValidTime, trigger: "change" }]
      }
    };
  },
  created() {
    this.getDicItem();
    this.getCities();
  },
  methods: {
    disabledDateFn(time) {
      let date = new Date();
      let day = date.getDay();
      let times = new Date(time).getTime() + 1000 * 60 * 60 * 24 * day;
      return times < Date.now();
    },
    beginTimeBlurchange() {
      this.isSubmitStart = true;
      if (this.editForm.validEndTime) {
        let end =
          (new Date(this.editForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间
        let begin =
          (new Date(this.editForm.validBeginTime).getTime() -
            1000 * 60 * 60 * 24) /
          1000; // 开始时间
        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 13)) {
          this.$message({
            message: "请选择相邻的两周",
            type: "warning"
          });
          this.beginTimeDesc = "";
          this.editForm.validBeginTime = "";
        }
      }
    },
    // 开始时间回显包装
    beginTimeDescFormatter(val) {
      if (val) {
        this.SubmitStart = true;
        let begin = parseTime(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        let end = parseTime(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
        this.beginTimeDesc = begin + "~" + end;
        // if (this.submitType == 3) {
        //   this.resetFullDayData();
        //   this.resetSpecialDayData();
        // }
      }
    },
    endTimeBlurchange() {
      this.isSubmitEnd = true;
      if (this.editForm.validBeginTime) {
        let begin;
        if (this.isEdit) {
          begin = new Date(this.editForm.validBeginTime).getTime() / 1000; // 开始时间
        } else {
          begin =
            (new Date(this.editForm.validBeginTime).getTime() -
              1000 * 60 * 60 * 24) /
            1000; // 开始时间
        }
        let end =
          (new Date(this.editForm.validEndTime).getTime() +
            1000 * 60 * 60 * 24 * 5) /
          1000; // 结束时间

        let time = (end - begin) / 60 / 60 / 24;
        if (!(time <= 13)) {
          this.$message({
            message: "请选择相邻的两周",
            type: "warning"
          });
          this.endTimeDesc = "";
          this.editForm.validEndTime = "";
        }
      }
    },
    // 结束时间回显包装
    endTimeDescFormatter(val) {
      if (val) {
        // this.SubmitStart = true;
        let begin = parseTime(
          new Date(val.getTime() - 1000 * 60 * 60 * 24),
          "{y}-{m}-{d}"
        );
        let end = parseTime(
          new Date(val.getTime() + 1000 * 60 * 60 * 24 * 5),
          "{y}-{m}-{d}"
        );
        this.endTimeDesc = begin + "~" + end;
        // if (this.submitType == 3) {
        //   this.resetFullDayData();
        //   this.resetSpecialDayData();
        // }
      }
    },
    setCityName(val) {
      for (let idx in this.cities) {
        if (val == this.cities[idx].orgCode) {
          this.editForm.cityName = this.cities[idx].cityName;
        }
      }
      this.getElectronicFenceInfo();
    },
    getCities() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.length === 0) {
              this.$alert("获取开通城市数据信息失败，请刷新页面重试");
            } else {
              this.cities = res.data.data.cities;
              this.trailCities = res.data.data.cities;
              this.ladderFormList = res.data.data.cities;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    },
    getDicItem() {
      getDicItemByDicCode().then(res => {
        this.driverTypeList = res.data.data;
      });
    },
    getElectronicFenceInfo() {
      if (this.editForm.cityCode && this.editForm.businessType) {
        queryElectronicFenceInfo({
          cityCode: this.editForm.cityCode,
          serviceType: this.editForm.businessType,
          status: "1"
        })
          .then(res => {
            if (res.data.success && res.data.data) {
              if (res.data.data.length === 0) {
                this.$alert("当前所选城市业务线不存在电子围栏数据，如需添加流水抽成奖励规则，请重新选择城市和业务线，或者联系运营商添加相关数据");
              }
            } else {
              this.$alert(res.data.msg);
            }
          })
          .catch(error => {});
      }
    },
    validateValidTime(rule, value, callback) {
      let desc; let
        compareDate;
      if (rule.field === "validBeginTime") {
        desc = "起始";
        compareDate = new Date(this.editForm.validEndTime);
      } else {
        desc = "结束";
        compareDate = new Date(this.editForm.validBeginTime);
      }

      let inputDate = new Date(value);
      let now = new Date();
      if (!value) {
        return callback(new Error("请选择生效" + desc + "时间"));
      } else if (
        desc === "起始" &&
        inputDate.getTime() > compareDate.getTime()
      ) {
        return callback(new Error("起始周不能晚于结束周"));
      } else if (
        desc === "结束" &&
        inputDate.getTime() < compareDate.getTime()
      ) {
        return callback(new Error("结束周不能早于起始周"));
      } else {
        return callback();
      }
      // else if (inputDate.getTime() - 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 24 * 7 >= now.getTime()) {
      //   return callback();
      // } else {
      //   return callback(new Error('生效' + desc + '周不能早于当前周'));
      // }
    },
    closeDialog() {
      this.$refs["editForm"].resetFields();
      this.$emit("closeDialogHandle", "edit");
    },
    handleSave() {
      this.editForm.validBeginTime = parseTime(
        new Date(new Date(this.editForm.validBeginTime).getTime() - 1000 * 60 * 60 * 24),
        "{y}-{m}-{d}"
      );
      this.editForm.validEndTime = parseTime(
        new Date(new Date(this.editForm.validEndTime).getTime() +
          1000 * 60 * 60 * 24 * 6),
        "{y}-{m}-{d}"
      );
      if (this.isEdit) {
        addStepPerformance(this.editForm).then(res => {
          if (res.data.success) {
            this.$emit("successHandle");
          } else {
            this.saving = false;
            this.$message.error(res.data.msg);
          }
        });
      } else {
        console.log("editForm", this.editForm);
        addStepPerformance(this.editForm).then(res => {
          if (res.data.success) {
            this.$emit("successHandle");
          } else {
            this.saving = false;
            this.$messge.error(res.data.msg);
          }
        });
      }
    },
    handleChange() {
      this.showForm = !this.showForm;
    },
    ruleValidate() {},
    handlePlus() {
      if (this.editForm.ruleDataList.length < 5) {
        this.editForm.ruleDataList.push({
          orderIntervalEnd: "",
          orderIntervalStart: "",
          rewardValue: ""
        });
      } else {
        this.$alert("无法新增，最多创建5条规则！");
      }
    },
    handleMinus(index) {
      this.editForm.ruleDataList.length > 1
        ? this.editForm.ruleDataList.splice(index, 1)
        : this.$alert("须至少存在一条数据，不允许删除此行");
    }
  }
};
</script>
<style lang="scss" scoped>
.win-300 {
  width: 300px;
}
</style>
