<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-23 17:05:01
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-09 23:14:41
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
              >日订单量达标奖励
              </el-checkbox>
            </el-col>
          </span>
        </div>
        <template v-if="!showForm">
          <span class="check-text">(勾选后，日订单量达标奖励生效)</span><br />
        </template>
        <template v-else>
          <el-card
            v-for="(item, index) in formData.ruleList"
            :key="index"
            style="margin-top: 10px"
          >
            <el-row>
              <el-col :span="22">
                <el-form-item label="生效日期：" size="mini" label-width="85px">
                  <el-select
                    v-model="item.dataTimeList"
                    multiple
                    :prop="'ruleList.' + index + '.dataTimeList'"
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
                <el-row>
                  <el-col :span="9">
                    <span
                      style="margin-left: 2px;color: #606266;font-weight: bold"
                    >奖励限制：自然日</span>
                  </el-col>
                </el-row>
                <el-row style="margin-top:15px">
                  <el-col :span="9">
                    <el-form-item
                      label="奖励规则：自然日累计成单数达 "
                      label-width="210px"
                      size="mini"
                      :prop="'ruleList.' + index + '.lowerThreshold'"
                      :rules="[
                        { validator: validateIntAmount, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="item.lowerThreshold"
                        placeholder="单"
                        style="width: 100px"
                      ></el-input>
                      <span>&nbsp;单</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item
                      label="奖励金额"
                      size="mini"
                      label-width="110px"
                      :prop="'ruleList.' + index + '.rewardValue'"
                      :rules="[
                        { validator: validateIntAmount, trigger: 'blur' }
                      ]"
                    >
                      <el-input
                        v-model="item.rewardValue"
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
                  style="margin-top:50%"
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
const listData = [
  {
    dataTimeList: [],
    incentiveType: "2",
    lowerThreshold: "",
    rewardValue: ""
  }
];
import { parseTime } from "@/libs/util";
import {
  validateAmount,
  isEmptyObject,
  isEmptyArray,
  validateIntAmount
} from "_o/common/salaryMixin";
export default {
  props: ["orderAwardData", "isEdit", "beginTime"],
  data() {
    return {
      validateIntAmount,
      limitCheck: "",
      validateAmount,
      isEmptyObject,
      isEmptyArray,
      showForm: false,
      formData: {
        ruleList: JSON.parse(JSON.stringify(listData))
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
        this.pickList = [];
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
              localStorage.setItem("orderQuantityData", JSON.stringify(this.formData));
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
      if (this.isEdit && this.orderAwardData.length) {
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
    // validateDateList(rule, value, callback) {
    //   if (value && !value.length) return callback(new Error("请选择生效日期"));
    //   return callback();
    // },
    checkStatus() {
      if (this.isEdit && this.orderAwardData.length) {
        this.limitCheck = "1";
        this.formData.ruleList = JSON.parse(JSON.stringify(this.orderAwardData));
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
          this.formData.ruleList.push({
            dataTimeList: [],
            incentiveType: "2",
            lowerThreshold: "",
            rewardValue: ""
          });
        } else {
          let i; let
            m;
          m = this.formData.ruleList.length;
          i = this.formData.ruleList[m - 1];
          this.formData.ruleList.push({
            dataTimeList: [],
            incentiveType: "2",
            lowerThreshold: i.lowerThreshold,
            rewardValue: i.rewardValue
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
    handleChange() {
      if (this.beginTime) {
        this.showForm = !this.showForm;
      } else {
        this.$message({
          message: "请先选择起始周",
          type: "warning"
        });
        this.limitCheck = "0";
      }
    }
  }
};
</script>
<style lang="" scoped>
.new-demo-ruleForm .el-form-item__content {
  margin-left: 0 !important;
}
.new-demo-ruleForm .el-form-item__error {
  width: 220px !important;
}
.new-demo-ruleForm .item {
  padding-top: 40px;
}
.new-demo-ruleForm .item:first-child {
  padding-top: 0;
}
.new-demo-ruleForm
  .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label:before {
  content: "";
  margin-right: 0;
}
</style>
