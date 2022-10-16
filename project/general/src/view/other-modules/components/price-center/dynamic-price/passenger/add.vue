<template>
  <div>
    <Modal
      v-model="visible"
      :title="title"
      width="880"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="_form" :model="addForm" :label-width="150" :rules="formRule">
        <Row>
          <FormItem label="策略名称：" prop="ruleName">
            <Input
              v-model="addForm.ruleName"
              class="item-width"
              :maxlength="50"
              clearable
              :disabled="isPreview"
              placeholder="请输入策略名称"
            ></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="城市：" prop="cityCode">
            <Select
              v-model="addForm.cityCode"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
              @on-change="cityChange"
            >
              <Option
                v-for="(item, index) in cityList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="区县：" prop="areaCode">
            <Select
              v-model="addForm.areaCode"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in areaList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
            <span class="o-text">选填，为空则策略针对城市生效</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="业务线：" prop="expandBizLine">
            <Select
              v-model="addForm.expandBizLine"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in expandBizLineList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="产品线：" prop="bizType">
            <Select
              v-model="addForm.bizType"
              class="input-width item-width"
              filterable
              clearable
              :disabled="isPreview"
              @on-change="bizTypeChange"
            >
              <Option
                v-for="(item, index) in bizTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="车型：" prop="vehicleLevel">
            <Select
              v-model="addForm.vehicleLevel"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in carList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="订单类型：" prop="typeTime">
            <Select
              v-model="addForm.typeTime"
              placeholder="请选择"
              class="item-width"
              filterable
              clearable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in orderTypeList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="工作日/休息日：" prop="workRestDayType">
            <Select
              v-model="addForm.workRestDayType"
              placeholder="请选择"
              class="item-width"
              filterable
              :disabled="isPreview"
            >
              <Option
                v-for="(item, index) in dayList"
                :value="item.value"
                :key="index"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="有效期：" prop="timeRange">
            <DatePicker
              v-model="addForm.timeRange"
              type="datetimerange"
              class="item-width"
              :options="options"
              :disabled="isPreview"
              placeholder="请选择有效期"
              :editable="false"
            >
            </DatePicker>
          </FormItem>
        </Row>
      </Form>
      <template>
        <Divider orientation="left">策略详情</Divider>
        <div style="margin-left: 46px" v-if="visible">
          <time-component
            ref="_time"
            :disabled="isPreview"
            :detail="detail.discountItems ? detail : detail.discountItems"
          ></time-component>
        </div>
      </template>
      <div slot="footer">
        <Button v-if="!isPreview" type="primary" :loading="submitLoading" @click="(e) => save()">
          <span>确定</span>
        </Button>
        <Button type="primary" ghost @click="(e) => cancel()">{{ !isPreview ? '取消' : '关闭' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { _getAreaInfoByCityCode } from "_g/api/general";
import { createService } from "_o/api/dynamic-price";
import { freeze, tool } from "@/mixins/base";
import ModalMixin from "@/mixins/modal.js";
import TimeComponent from "../components/time.vue";
import { formRules } from "../fields";
import { dayList, orderTypeList } from "../config";
import { deepCopy } from "@/libs/tools";

/*
保存校验
①所有必填字段不得为空，且字段合法
②策略至少包含1个时段

*/
const default_params = {
  ruleName: "",
  cityCode: "",
  areaCode: "",
  expandBizLine: "",
  bizType: "",
  vehicleLevel: "",
  typeTime: "",
  workRestDayType: '',
  timeRange: [],
};
const Day_Millisecond = 24 * 60 * 60 * 1000;
const YMD_Format = "YYYY-MM-DD HH:mm:ss";
export default {
  name: "add-price-strategy",
  components: {
    TimeComponent,
  },
  inject: ["getCityList", "getBizTypeList", "getExpandBizLineList"],
  mixins: [tool, ModalMixin],
  data() {
    return {
      title: "新增策略",
      submitLoading: false,
      formRules,
      addForm: deepCopy(default_params),
      dayList,
      orderTypeList,
      carList: [], // 车型
      areaList: [], // 区县
      options: freeze({
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - Day_Millisecond;
        },
      }),
    };
  },
  computed: {
    formRule({isPreview}) {
      return isPreview ? {} : formRules
    },
    cityList() {
      return this.getCityList();
    },
    bizTypeList() {
      return this.getBizTypeList();
    },
    expandBizLineList() {
      return this.getExpandBizLineList();
    },
    isPreview({detail}) {
      return detail.isDetail
    }
  },
  watch: {
    visible(v) {
      if(v) {
        this.init();
      } else {
        // this.$refs._form.resetFields();
      }
    },
  },
  methods: {
    init() {
      if (this.detail.uuid) {
        const { effectiveTime, failureTime, discountItems, isCopy, isDetail } =
          this.detail;
        Object.keys(default_params).forEach((key) => {
          this.addForm[key] = this.detail[key];
        });
        discountItems?.forEach((item) => {
          item.period = [item.startTime || "", item.endTime || ""];
        });
        this.addForm.timeRange = [effectiveTime, failureTime];
        this.cityChange(this.addForm.cityCode);
        this.bizTypeChange(this.addForm.bizType);
        if (isDetail) {
          this.title = "策略详情";
        } else if (isCopy) {
          // 复制操作:
          //   除策略名称、有效期外，所有字段默认带入系统保存的值
          this.title = "复制策略";
          this.addForm.ruleName = "";
          this.addForm.timeRange = [];
        } else {
          this.title = "新增策略";
        }
      }
    },
    async save() {
      const valid = await this.$refs._form.validate();
      const timeValid= await this.$refs._time.valid()
      if (!valid || !timeValid) return;
      let p = this.getCommitParams();
      const [bool, msg] = this.checkPeriodTime(p.discountItems)
      if(!bool) {
        this.$Message.error(msg)
        return
      }
      let handleMsg = this.detail.isCopy ? "复制" : "新增";
      const [err, data] = await this.toResult(createService(p));
      if (err) {
        return;
      }
      this.$message.success(`${handleMsg}成功`);
      this.cancel(true);
    },
    getCommitParams() {
      const {
        ruleName,
        cityCode,
        areaCode,
        expandBizLine,
        bizType,
        vehicleLevel,
        typeTime,
        workRestDayType,
        timeRange,
      } = this.addForm;
      return {
        ruleName,
        cityCode,
        areaCode,
        expandBizLine,
        bizType,
        vehicleLevel,
        typeTime,
        workRestDayType,
        effectiveTime: this.dateFormat(timeRange[0]),
        failureTime: this.dateFormat(timeRange[1]),
        ...this.getTimeParams(),
      };
    },
    getTimeParams() {
      let timeComponentParams = this.$refs._time.returnParams();
      let discountItems = timeComponentParams.map((it) => {
        const { period, acceptItemDetails, defaultDiscountDetails } = it;
        return {
          acceptItemDetails,
          startTime: period[0],
          endTime: period[1],
          defaultDiscountDetails
        };
      });
      return {
        discountItems,
      };
    },
    // 时段左开右闭  不能有交集
    // 完全覆盖00:00:00~23:59:59且无重叠
    checkPeriodTime(list = []) {
      // if(list.length < 2) return [true]
      let _periodTime = []; // 策略时间段
      list.forEach(item => {
        _periodTime.push([item.startTime.split(':').join(""), item.endTime.split(':').join("")]);
      })
      let sum = 0;
      let len = list.length
      for(let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if(this.timeIntersection(_periodTime[i], _periodTime[j])) {
            return [false, '时段有重叠']
          }
        }
        sum += _periodTime[i][1] - _periodTime[i][0]
      }
      if(sum - 235959 !== 0) {
        return [false, '时段需完全覆盖00:00:00~23:59:59且无重叠']
      }
      return [true]
    },
    // 00:00:00 - 23:59:59 校验时段
    timeIntersection(date1, date2) {
      if(date1.filter(Boolean).length < 2 || date2.filter(Boolean).length < 2) {
        return false
      }
      return !(date2[1] <= date1[0] || date2[0] >= date1[1])
    },
    dateFormat(v, type = YMD_Format) {
      return this.$moment(v).format(type);
    },
    cancel(refresh) {
      this.restore();
      this.$emit("close", refresh);
    },
    restore() {
      Object.keys(default_params).forEach((key) => {
        this.addForm[key] = default_params[key];
      });
      this.$refs._form.resetFields();
    },
    bizTypeChange(value) {
      if (!value) {
        this.carList = [];
        return;
      }
      let f = this.bizTypeList.find((it) => `${it.value}` === `${value}`);
      this.carList = f?.children || [];
    },
    async cityChange(value) {
      if (!value) {
        this.areaList = [];
        this.addForm.areaCode = ''
        return;
      }
      const { list } = await _getAreaInfoByCityCode(value);
      this.areaList = list;
    },
  },
};
</script>

<style scoped lang="less">
.item-width {
  width: 320px;
}
.o-text {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
</style>
