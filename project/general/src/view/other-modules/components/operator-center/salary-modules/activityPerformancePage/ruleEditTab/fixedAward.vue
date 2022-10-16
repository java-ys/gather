<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-23 17:05:01
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-15 09:43:24
-->
<template>
  <div>
    <el-form ref="editForm" :model="formData" class="new-demo-ruleForm">
      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>
            <el-col :span="3" style="margin-top: 5px">
              <el-checkbox
                v-model="limitCheck"
                true-label="1"
                false-label="0"
                @change="handleChange"
              >流水时段固定奖励
              </el-checkbox>
            </el-col>
          </span>
        </div>
        <template v-if="!showForm">
          <span class="check-text">(勾选后，流水时段固定奖励生效)</span><br />
        </template>
        <template v-else>
          <el-card
            v-for="(item, index) in formData.ruleList"
            :key="index"
            style="margin-top: 10px"
          >
            <el-row>
              <el-col :span="14">
                <el-form-item label="生效日期：" size="mini" label-width="85px">
                  <el-select
                    v-model="item.dataTimeList"
                    multiple
                    :prop="'ruleList.' + index + '.dataTimeList'"
                    :rules="[{ required: true, message: '请选择生效日期' }]"
                    placeholder="请选择"
                    style="width:200px"
                  >
                    <el-option
                      v-for="it in dateList"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value"
                      :disabled="it.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 15px">
              <el-col :span="9">
                <span style="margin-left: 2px;color: #606266;font-weight: bold">奖励规则：</span>
              </el-col>
            </el-row>
            <el-row style="margin-left: 25px">
              <el-col :span="22">
                <el-row v-for="(it, idx) in item.cfgList" :key="idx">
                  <el-col :span="8">
                    <el-form-item
                      :label="`时段${idx + 1}:`"
                      size="mini"
                      :prop="
                        'ruleList.' + index + '.cfgList.' + idx + '.periodStart'
                      "
                      :rules="[
                        {
                          required: true,
                          message: '必填字段',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-time-picker
                        v-model="it.periodStart"
                        format="HH:mm"
                        value-format="HH:mm"
                        arrow-control
                        placeholder="起始时间"
                        style="width:120px"
                        @change="
                          handlePeriodStart(
                            it.periodStart,
                            it.periodEnd,
                            index,
                            idx
                          )
                        "
                      >
                      </el-time-picker>
                    </el-form-item>
                    <el-form-item
                      label="-"
                      size="mini"
                      :prop="
                        'ruleList.' + index + '.cfgList.' + idx + '.periodEnd'
                      "
                      :rules="[
                        {
                          required: true,
                          message: '必填字段',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-time-picker
                        v-model="it.periodEnd"
                        format="HH:mm"
                        value-format="HH:mm"
                        arrow-control
                        placeholder="结束时间"
                        style="width:120px"
                        @change="
                          handlePeriodEnd(
                            it.periodEnd,
                            it.periodStart,
                            index,
                            idx
                          )
                        "
                      >
                      </el-time-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="时段订单流水达"
                      size="mini"
                      label-width="120px"
                      :prop="
                        'ruleList.' +
                          index +
                          '.cfgList.' +
                          idx +
                          '.lowerThreshold'
                      "
                      :rules="[
                        { validator: validateIntAmount, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="it.lowerThreshold"
                        placeholder="元"
                        style="width: 100px"
                      ></el-input>
                      <span>&nbsp;元</span>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="true" :span="8">
                    <el-form-item
                      label="奖励金额"
                      size="mini"
                      label-width="120px"
                      :prop="
                        'ruleList.' + index + '.cfgList.' + idx + '.rewardValue'
                      "
                      :rules="[
                        { validator: validateIntAmount, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="it.rewardValue"
                        placeholder="元"
                        style="width: 100px"
                      ></el-input>
                      <span>&nbsp;元</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button
                  type="info"
                  size="mini"
                  style="margin-top:35%"
                  @click="handleMinus(index)"
                >移除
                </el-button>
              </el-col>
            </el-row>
          </el-card>
          <div
            class="button-group-mini-plus"
            style="margin-top:15px;text-align: right;"
          >
            <el-row>
              <el-button type="primary" size="mini" @click="handlePlus('copy')">
                &nbsp;复制上一条&nbsp;
              </el-button>
              <el-button type="primary" size="mini" @click="handlePlus('add')">
                &nbsp;新增&nbsp;
              </el-button>
            </el-row>
          </div>
        </template>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { fixedAwardListData } from "./fields";
import {
  validateAmount,
  validatePercent,
  isEmptyObject,
  isEmptyArray,
  validateIntAmount
} from "_o/common/salaryMixin";
export default {
  props: ["fixedAwardData", "isEdit", "beginTime"],
  data() {
    return {
      validateIntAmount,
      validatePercent,
      limitCheck: "",
      validateAmount,
      showForm: false,
      formData: {
        ruleList: JSON.parse(JSON.stringify(fixedAwardListData))
      },
      dateList: [],
      pickList: []
    };
  },
  watch: {
    limitCheck: {
      handler(val) {
        if (val == "1") {
          this.showForm = true;
        } else {
          this.showForm = false;
        }
      },
      immediate: true
    },
    "formData.ruleList": {
      handler(val) {
        let list;
        list = [];
        // this.pickList = [];
        val.forEach(item => {
          list = list.concat(item.dataTimeList);
        });
        this.pickList = [...new Set(list)];
      },
      immediate: true,
      deep: true
    },
    pickList: {
      handler(val) {
        this.dateList.forEach(item => {
          item.disabled = false;
        });
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.dateList.length; j++) {
            val[i] == this.dateList[j].value || val[i] == this.dateList[j].label
              ? (this.dateList[j].disabled = true)
              : "";
          }
        }
      },
      immediate: true,
      deep: true
    },
    beginTime: {
      handler(val) {
        val && this.setDates(val, this.isEdit);
      },
      immediate: true
    }
  },
  created() {
    this.checkStatus();
    this.setDataTimeList();
  },
  methods: {
    ruleValidate() {
      if (this.showForm) {
        let flag = false;
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let num = 0;
            this.formData.ruleList.forEach(item => {
              if (!item.dataTimeList.length) {
                num++;
              }
            });
            if (!num) {
              localStorage.setItem("fixedAwardData", JSON.stringify(this.formData));
              flag = true;
            } else {
              this.$alert("生效日期不能为空");
            }
          }
        });
        return flag;
      }
    },
    setDataTimeList() {
      if (this.isEdit && this.fixedAwardData.length) {
        this.formData.ruleList.forEach(item => {
          let Y; let M; let D; let MD; let
            YMD;
          Y = new Date(item.dataTimeList[0]).getFullYear();
          M = new Date(item.dataTimeList[0]).getMonth() + 1;
          D = new Date(item.dataTimeList[0]).getDate();
          M < 10 ? (M = "0" + M) : "";
          D < 10 ? (D = "0" + D) : "";
          MD = M + "月" + D + "日";
          YMD = Y + "-" + M + "-" + D;
          item.dataTimeList[0] = YMD;
        });
      }
    },
    checkStatus() {
      if (this.isEdit && this.fixedAwardData.length) {
        this.limitCheck = "1";
        // this.showForm = true;
        this.formData.ruleList = JSON.parse(JSON.stringify(this.fixedAwardData));
      }
    },
    setDates(val, isEdit) {
      this.formData.ruleList.forEach(item => {
        item.dataTimeList = [];
      });
      let dateArr; let firstDate; let Y; let M; let D; let MD; let
        YMD;
      dateArr = [];
      for (let i = 0; i < 7; i++) {
        if (Object.prototype.toString.call(val) == "[object String]") {
          firstDate = new Date(new Date(val).getTime());
        } else {
          firstDate = new Date(val.getTime() - 1000 * 60 * 60 * 24);
        }
        firstDate.setDate(firstDate.getDate() + i);
        Y = firstDate.getFullYear();
        M = firstDate.getMonth() + 1;
        M < 10 ? (M = "0" + M) : "";
        D = firstDate.getDate();
        D < 10 ? (D = "0" + D) : "";
        MD = M + "月" + D + "日";
        YMD = Y + "-" + M + "-" + D;
        dateArr.push({
          label: YMD,
          value: YMD,
          disabled: false
        });
      }
      this.dateList = dateArr;
    },
    handlePlus(val) {
      if (this.formData.ruleList.length < 7) {
        if (val == "add") {
          this.formData.ruleList.push(JSON.parse(JSON.stringify(fixedAwardListData[0])));
        } else {
          let i; let
            m;
          m = this.formData.ruleList.length;
          i = this.formData.ruleList[m - 1];
          this.formData.ruleList.push({
            dataTimeList: [],
            incentiveMode: "2",
            cfgList: JSON.parse(JSON.stringify(i.cfgList))
          });
        }
      } else {
        this.$alert("无法新增，最多创建7条规则！");
      }
    },
    handleMinus(index) {
      if (this.formData.ruleList.length > 1) {
        this.formData.ruleList.splice(index, 1);
      } else {
        this.$message({
          message: "至少存在一条数据，不允许删除此行",
          type: "warning"
        });
      }
    },
    handleChange(val) {
      if (this.beginTime) {
        if (val == "1") {
          this.$emit("handleChoose", "fixedAward");
        } else {
          this.showForm = false;
        }
      } else {
        this.$message({
          message: "请先选择起始周",
          type: "warning"
        });
        this.limitCheck = "0";
      }
    },
    handlePeriodStart(val, endVal, index, idx) {
      let H; let M; let h; let m; let
        list;
      if (val) {
        H = parseInt(val.split(":")[0]);
        M = parseInt(val.split(":")[1]);
        list = this.formData.ruleList[index].cfgList.filter((it, i) => i !== idx);
        if (endVal) {
          h = parseInt(endVal.split(":")[0]);
          m = parseInt(endVal.split(":")[1]);
          if (H > h || (H == h && M >= m)) {
            this.$alert("起始时间需小于结束时间");
            this.formData.ruleList[index].cfgList[idx].periodStart = "";
          }
        }
        list.forEach(item => {
          if (item.periodStart && item.periodEnd) {
            let HH; let MM; let hh; let
              mm;
            HH = parseInt(item.periodStart.split(":")[0]);
            MM = parseInt(item.periodStart.split(":")[1]);
            hh = parseInt(item.periodEnd.split(":")[0]);
            mm = parseInt(item.periodEnd.split(":")[1]);
            if (
              !(H < HH || H > hh || (H == HH && M < MM) || (H == hh && M > mm))
            ) {
              this.$alert("奖励时段不可重叠！");
              this.formData.ruleList[index].cfgList[idx].periodStart = "";
            }
            if (
              endVal &&
              ((H < HH && h > HH) ||
                (H < HH && h == HH && m > MM) ||
                (H == HH && h > HH) ||
                (H == HH && M < MM && h == HH && m > MM))
            ) {
              this.$alert("奖励时段不可重叠！");
              this.formData.ruleList[index].cfgList[idx].periodStart = "";
            }
          }
        });
      }
    },
    handlePeriodEnd(val, startVal, index, idx) {
      let H; let M; let h; let m; let
        list;
      if (val) {
        H = parseInt(val.split(":")[0]);
        M = parseInt(val.split(":")[1]);
        list = this.formData.ruleList[index].cfgList.filter((it, i) => i !== idx);
        if (startVal) {
          h = parseInt(startVal.split(":")[0]);
          m = parseInt(startVal.split(":")[1]);
          if (H < h || (H == h && M <= m)) {
            this.$alert("结束时间需大于起始时间");
            this.formData.ruleList[index].cfgList[idx].periodEnd = "";
          }
        }
        list.forEach(item => {
          if (item.periodStart && item.periodEnd) {
            let HH; let MM; let hh; let
              mm;
            HH = parseInt(item.periodStart.split(":")[0]);
            MM = parseInt(item.periodStart.split(":")[1]);
            hh = parseInt(item.periodEnd.split(":")[0]);
            mm = parseInt(item.periodEnd.split(":")[1]);
            if (
              !(H < HH || H > hh || (H == HH && M < MM) || (H == hh && M > mm))
            ) {
              this.$alert("奖励时段不可重叠！");
              this.formData.ruleList[index].cfgList[idx].periodEnd = "";
            }
            if (
              startVal &&
              ((h < HH && H > HH) || (h < HH && H == HH && M > MM))
            ) {
              this.$alert("奖励时段不可重叠！");
              this.formData.ruleList[index].cfgList[idx].periodEnd = "";
            }
            if (
              (h == HH && m < MM && H > HH) ||
              (h == HH && m < MM && (H == HH && M > MM))
            ) {
              this.$alert("奖励时段不可重叠！");
              this.formData.ruleList[index].cfgList[idx].periodEnd = "";
            }
          }
        });
      }
    }
  }
};
</script>
