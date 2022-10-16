<template>
  <div>
    <Form
      ref="_formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="102"

    >
      <FormItem label="补偿对象" class="ivu-form-item-required">
        <Button
          v-for="(item, index) in changeBtn"
          :key="item.value"
          class="check-but"
          :type="item.primary"
          @click="changeTabBtn(index)"
          >{{ item.label }}</Button
        >
      </FormItem>
      <FormItem style="width:340px;" :prop="checkProp">
        <!-- 城市选择 -->
        <Cascader
          v-if="isShowCity"
          trigger="hover"
          v-model="formValidate.cityCode"
          :data="cityList"
        ></Cascader>
        <!-- 运营商 -->
        <Select
          v-if="isShowAgent"
          v-model="formValidate.radioValue"
          filterable
          allow-create
        >
          <Option
            v-for="item in operateList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        <!-- 司机模糊搜索 -->
        <SelectSort
          v-show="isShowDriver"
          ref="nameSelect"
          :params="{ querytype: 2 }"
          queryName="driverName"
          data-key="uuid"
          data-label="name"
          :width="320"
          :axiosFun="driverNameMobileService"
          @on-success="getNameVal"
        ></SelectSort>
        <div class="ivu-form-item-error-tip" v-show="controlValidate.covFlag">
          请选择补偿的司机对象
        </div>
      </FormItem>
      <FormItem
        label="补偿类型"
        class="ivu-form-item-required"
        prop="firstCategoryVal"
      >
        <Select
          v-model="formValidate.firstCategoryVal"
          filterable
          allow-create
          @on-change="getChildList"
          style="maxWidth:260px;"
        >
          <Option
            v-for="(item, index) in typeList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem
        label="补偿子类型"
        class="ivu-form-item-required"
        :label-width="102"
        prop="secondCategoryVal"
      >
        <Select
          v-model="formValidate.secondCategoryVal"
          filterable
          allow-create
          style="maxWidth:260px;"
        >
          <Option
            v-for="(item, index) in typeList2"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="补偿时段" class="ivu-form-item-required">
        <Row>
          <i-col span="6">
            <FormItem prop="startTime">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                placeholder="补偿时间开始"
                v-model="formValidate.startTime"
                :options="timeStartOptions"
              ></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="1" class="sign">-</i-col>
          <i-col span="6">
            <FormItem prop="endTime">
              <DatePicker
                type="datetime"
                :options="timeStartOptions"
                format="yyyy-MM-dd HH:mm"
                placeholder="补偿时间结束"
                v-model="formValidate.endTime"
              ></DatePicker>
            </FormItem>
          </i-col>
        </Row>
      </FormItem>
      <FormItem label="补偿时长">
        <div>{{ compensateTimeStr }}</div>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input
          v-model="formValidate.desc"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 5 }"
        />
      </FormItem>
    </Form>
    <div class="footer-wrap">
      <Button type="primary" @click="handleSubmit()">提交</Button>
      <Button @click="handleReset()" class="ml8">取消</Button>
    </div>
  </div>
</template>

<script>
import { getProvinceCityList, getAgentList } from "_g/api/common.js"; // 城市列表  运营商接口
import { queryConfigType, addCpstBatch } from "_o/api/compensate.js"; // 新增批量补偿接口
import { driverNameMobileService } from "_o/api/m2-driver-api/common";
import SelectSort from "_a/select-sort/select-sort.vue";
// import { timeFormat } from "@/libs/util";
import { cpTranslate } from "@/libs/tools";
import { changeBtn, ruleValidate } from "./index.js";
import { timeFormat } from "../compensate-list/utils";

const SECONDS_OF_A_DAY = 24 * 60 * 60 * 1000;

const  isLeapYear = (Year) => {
  if ((Year % 4 === 0 && Year % 100 !== 0) || Year % 400 == 0) {
    return true;
  }
  return false;
}
const getLastMonthDays = (year = 0, month = 0) => {
  if (month > 1) {
    return getTotalDays(year, month - 1);
  }
  return getTotalDays(year - 1, 12);
};
const getTotalDays = (year = 0, month = 0) => {
  (year = +year), (month = +month);
  if (!(year > 0 && month > 0)) return;
  if (month - 2 === 0) {
    if (isLeapYear(year)) return 29;
    return 28;
  } else {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
    return 30;
  }
};

export default {
  components: {
    SelectSort
  },
  props: {
    modalShow: Boolean
  },
  data() {
    const validObj = {
      radioValue: "", // 运营商的值
      startTime: "",
      endTime: "",
      desc: "", // 补偿说明
      firstCategoryVal: "", // 补偿类型
      secondCategoryVal: "", // 补偿子类型
      cityCode: [] // 城市的值
    };
    const ts = new Date();
    const fullYear = ts.getFullYear();
    const month = ts.getMonth() + 1;
    const days = ts.getDate();

    return {
      timeStartOptions: {
        // 如果是1-5号 可以选到上个月，其他时间只能选当月1号到昨天
        disabledDate(date) {
          const ds = date && date.valueOf();
          if (!ds) return false;
          if (days > 5) {
            return (
              ds > Date.now() - SECONDS_OF_A_DAY ||
              ds < Date.now() - SECONDS_OF_A_DAY * days
            );
          } else {
            return (
              ds <
                Date.now() -
                  SECONDS_OF_A_DAY *
                    (getLastMonthDays(fullYear, month) + days) ||
              ds > Date.now()
            );
          }
        }
      },
      compensateTime: "", // 补偿时间
      driverNameMobileService, // 模糊查询Fn
      changeBtn,
      isShowCity: true,
      isShowAgent: false,
      isShowDriver: false,
      typeList: [], // 补偿列;
      typeList2: [], // 补偿子类型
      cityList: [], // 城市列表
      operateList: [], // 运营商列表
      driverUuidList: [], // 选中的司机列表
      formValidate: validObj,
      ruleValidate,
      controlValidate: {
        covFlag: false // 司机搜索校验
      },
      isSubmit: true
    };
  },
  computed: {
    checkProp() {
      return this.isShowCity
        ? "cityCode"
        : this.isShowAgent
        ? "radioValue"
        : "";
    },
    compensateTimeStr() {
      const { startTime, endTime } = this.formValidate;
      if (startTime && endTime) {
        const sDiff = endTime.getTime() - startTime.getTime();
        const hour = (sDiff / 1000 / 3600).toFixed(2);
        this.compensateTime = hour;
        return hour >= 0 ? `${hour}小时` : "-";
      } else {
        this.compensateTime = "";
      }
      return "-";
    }
  },
  watch: {
    driverUuidList: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.isShowDriver) {
          this.controlValidate.covFlag = !this.driverUuidList.length;
        } else {
          this.controlValidate.covFlag = false;
        }
      }
    },
    modalShow() {
      this.controlValidate.covFlag = false;
      if(!this.modalShow) {
        this.$refs.nameSelect.clearValue()
        this.driverUuidList = [];
      }
    }
  },
  mounted() {
    this.getProvinceCityList();
    this.getOperaterData();
    this.getConfigType();
  },
  methods: {
    // 表单提交
    handleSubmit() {
      // 司机模糊搜索单独处理error信息
      if (this.isShowDriver && !this.driverUuidList.length) {
        this.controlValidate.covFlag = true;
      }
      this.$refs["_formValidate"].validate(valid => {
        if (!valid) {
          return;
        }
        const { endTime, startTime } = this.formValidate;
        if (endTime && startTime && endTime.getTime() <= startTime.getTime()) {
          this.$Message.error("补偿结束时间需大于开始时间");
          return;
        }

        this.$Modal.confirm({
          title: "确定进行批量补偿吗",
          onOk: () => {
            this.addBathch();
          }
        });
      });
    },
    handleReset() {
      this.$refs["_formValidate"].resetFields();
      // 重置表单
      this.formValidate = {
        radioValue: "", // 运营商的值
        startTime: "",
        endTime: "",
        desc: "", // 补偿说明
        firstCategoryVal: "",
        secondCategoryVal: "",
        cityCode: [] // 城市的值
      };
      this.driverUuidList = [];
      this.isShowCity = true;
      this.isShowAgent = false;
      this.isShowDriver = false;
      this.changeTabBtn(0);
      // 返回列表页
      this.$emit("handleCloseModal", false);
      this.controlValidate.covFlag = false;
    },
    // tab切换
    changeTabBtn(index) {
      for (let i = 0; i < changeBtn.length; i += 1) {
        changeBtn[i].primary = "default";
      }
      changeBtn[index].primary = "primary";
      this.isShowCity = false;
      this.isShowAgent = false;
      this.isShowDriver = false;
      if (index === 0) {
        this.isShowCity = true;
      } else if (index === 1) {
        this.isShowAgent = true;
      } else if (index === 2) {
        this.isShowDriver = true;
      }
    },
    // 司机模糊查询
    getNameVal(res) {
      this.driverUuidList = res;
    },
    // 获取省市列表 / 获取已经开通的城市
    getProvinceCityList() {
      getProvinceCityList().then(res => {
        let list = cpTranslate(res.data.data);
        this.cityList = list;
      });
    },
    // 获取补偿类型
    getConfigType() {
      queryConfigType({}).then(res => {
        let { data } = res.data;
        if (res.data.success) {
          this.typeList = data.map(it => {
            return {
              label: it.categoryName,
              value: +it.id,
              childList: JSON.parse(JSON.stringify(it.childList))
            };
          });
        }
      });
    },
    getChildList(value) {
      this.typeList.forEach(item => {
        if (value === item.value) {
          this.typeList2 = item.childList.map(it => {
            return {
              label: it.categoryName,
              value: it.id
            };
          });
        }
      });
    },
    // 获取运营商
    getOperaterData() {
      getAgentList({}).then(res => {
        if (res.data.success) {
          let { data } = res.data;
          this.operateList = data.map(item => {
            return {
              label: item.name,
              value: item.uuid
            };
          });
        }
      });
    },
    // 新增批量
    addBathch() {
      const {
        cityCode,
        radioValue,
        startTime,
        endTime,
        firstCategoryVal,
        secondCategoryVal,
        desc
      } = this.formValidate;
      console.log(cityCode, "1111111111111111");
      let start_time = this.timeFormatCopy(startTime);
      let end_time = this.timeFormatCopy(endTime);
      let params = {
        ...(this.isShowCity ? { cityCode } : {}),
        ...(this.isShowAgent ? { agentUuid: [radioValue] } : {}),
        ...(this.isShowDriver ? { driverUuidList: this.driverUuidList } : {}),
        startTime: start_time,
        endTime: end_time,
        outageCategoryId: firstCategoryVal,
        outageSubCategoryId: secondCategoryVal,
        times: this.compensateTime,
        description: desc
      };
      if (this.isShowCity) {
        console.log(params.cityCode);
        params.cityCode = [params.cityCode[1]];
      }
      // return;
      addCpstBatch(params).then(res => {
        // console.log(res, "新增批量");
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.$refs["_formValidate"].resetFields();
          // 重置表单
          this.formValidate = {
            radioValue: "", // 运营商的值
            startTime: "",
            endTime: "",
            desc: "", // 补偿说明
            firstCategoryVal: "",
            secondCategoryVal: "",
            cityCode: [] // 城市的值
          };
          this.driverUuidList = [];
          this.$emit("handleCloseModal", false);
          // 触发渲染列表的方法
          this.$emit("sendFn", "");
        }
      });
    },
    timeFormatCopy(date) {
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() + 1 < 10
          ? "0" + date.getSeconds()
          : date.getSeconds();
      let DD =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      return Y + M + DD + h + m + s;
    }
  }
};
</script>

<style lang="less" scoped>
.footer-wrap {
  margin-top: 50px;
  margin-left: 40%;
}
.el-range-editor--small.el-input__inner {
  width: 260px !important;
}
.check-but {
  width: 100px;
  margin-right: 6px;
}
.sign {
  text-align: center;
  margin-right: 8px;
}
.ml8 {
  margin-left: 8px;
}
</style>
