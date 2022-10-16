<template>
  <div>
    <Modal
      v-model="show"
      width="1000"
      :title="title"
      :mask-closable="false"
      class="modal-s"
      @on-cancel="cancel"
    >
      <div class="pr">
        <div class="_mask" v-if="isDetail"></div>
        <Form
          ref="_form"
          :model="addForm"
          :label-width="150"
          :rules="validateRules"
        >
          <Row type="flex" justify="space-around">
            <Col span="12">
              <FormItem label="任务名称：" prop="taskName">
                <Input
                  v-model="addForm.taskName"
                  class="item-width"
                  :maxlength="15"
                  placeholder="请输入任务名称"
                ></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="任务类型：" prop="sendType">
                <Select
                  v-model="addForm.sendType"
                  class="input-width item-width"
                >
                  <Option
                    v-for="(item, index) in timesList"
                    :value="item.value"
                    :key="index"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="12">
              <FormItem label="触发时间：" prop="sendTime" v-if="isSingle">
                <DatePicker
                  v-model="addForm.sendTime"
                  type="datetime"
                  class="item-width"
                  style="width: 240px"
                  placeholder="请选择时间"
                  :editable="false"
                >
                </DatePicker>
                <span class="b-time">请避开准点时间</span>
              </FormItem>
              <FormItem label="产品线：">
                <Select
                  v-if="configs.bizTypeList"
                  v-model="addForm.bizType"
                  class="input-width item-width"
                  multiple
                >
                  <Option :key="-1" :value="-1" :disabled="!hasAllProductLine && addForm.bizType.length>0">全部</Option>
                  <Option
                    v-for="(item, index) in configs.bizTypeList"
                    :value="item.bizType"
                    :key="index"
                    :disabled="hasAllProductLine"
                    >{{ item.bizTypeName }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem label="业务线：">
                <Select
                  v-if="configs.expandBizLineList"
                  v-model="addForm.expandBizLine"
                  class="input-width item-width"
                  multiple
                >
                  <Option :key="-1" :value="-1" :disabled="!hasAllBusinessLine && addForm.expandBizLine.length>0">全部</Option>
                  <Option
                    v-for="(item, index) in configs.expandBizLineList"
                    :value="item.expandBizLine"
                    :key="index"
                    :disabled="hasAllBusinessLine"
                    >{{ item.expandBizLineName }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
          </Row>

          <!-- <Row type="flex" justify="space-around">
          <Col span="12">1
            <FormItem label="产品线：" v-if="isSingle" >
              <Select
                v-model="addForm.bizType"
                class="input-width item-width"
                multiple
              >
                <Option
                  v-for="(item, index) in lineList"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="12"> </Col>
        </Row> -->
          <div v-if="!isSingle">
            <div class="flex-c">
              <FormItem label="周期：" prop="cycleType">
                <Select
                  v-model="addForm.cycleType"
                  class="input-width item-width"
                  label-in-value
                >
                  <Option
                    v-for="(item, index) in periodList"
                    :value="item.value"
                    :key="index"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
              <div class="ml-20" v-if="addForm.cycleType - 1 === 0">
                <span class="">每</span>
                <Input
                  v-model="cycleHour"
                  style="width: 80px"
                  type="text"
                  :maxlength="4"
                  placeholder="输入小时"
                />
                <span>小时</span>
              </div>
              <div class="ml-20" v-else-if="addForm.cycleType - 2 === 0">
                <!-- <Select
                v-model="cycleValue"
                class="input-width item-width it-width"
                filterable
                label-in-value
              >
                <Option
                  v-for="(item, index) in hourList"
                  :value="item.value"
                  :key="index"
                  >{{ item.label }}</Option
                >
              </Select> -->
                <TimePicker
                  v-model="cycleTime"
                  type="time"
                  placeholder="选择时间点"
                  class="it-width"
                ></TimePicker>
                <span class="b-time">请避开准点时间</span>
              </div>
              <div class="ml-20" v-else-if="addForm.cycleType - 3 === 0">
                <Select
                  v-model="cycleValue"
                  class="input-width item-width it-width"
                  placeholder="选择星期"
                  label-in-value
                >
                  <Option
                    v-for="(item, index) in weekList"
                    :value="item.value"
                    :key="index"
                    >{{ item.label }}</Option
                  >
                </Select>
                <TimePicker
                  v-model="cycleTime"
                  type="time"
                  placeholder="选择时间点"
                  class="it-width"
                ></TimePicker>
                <span class="b-time">请避开准点时间</span>
              </div>
              <div class="ml-20" v-else-if="addForm.cycleType - 4 === 0">
                <Select
                  v-model="cycleValue"
                  class="input-width item-width it-width"
                  label-in-value
                  placeholder="选择每月几号"
                >
                  <Option
                    v-for="(item, index) in dayList"
                    :value="item.value"
                    :key="index"
                    >{{ item.label }}号</Option
                  >
                </Select>
                <TimePicker
                  v-model="cycleTime"
                  type="time"
                  placeholder="选择时间点"
                  class="it-width"
                ></TimePicker>
                <span class="b-time">请避开准点时间</span>
              </div>
            </div>
            <!-- <Row>
            <FormItem label="起止时间：" prop="dateRange">
              <TimePicker
                v-model="addForm.dateRange"
                type="timerange"
                class="item-width"
                style="width: 320px"
                placeholder="请选择时间"
                :editable="false"
                @on-change="dateTimeChange"
              >
              </TimePicker>
            </FormItem>
          </Row> -->
            <Row>
              <FormItem label="起止日期：" prop="dateRange">
                <DatePicker
                  v-model="addForm.dateRange"
                  type="daterange"
                  class="item-width"
                  placeholder="请选择日期"
                  :editable="false"
                  @on-change="dateChange"
                >
                </DatePicker>
              </FormItem>
            </Row>
          </div>
          <Row>
            <FormItem label="催收城市：">
              <RadioGroup v-model="cityType" vertical style="width: 100%">
                <div class="flex-r mb-10">
                  <!-- -1是选择全国 -->
                  <Radio :label="1"
                    ><span>指定城市(可多选,默认全国)</span></Radio
                  >
                  <Select
                    v-if="cityType - 1 === 0"
                    v-model="addForm.cityCode"
                    class="input-width item-width"
                    style="width: 320px"
                    filterable
                    multiple
                    @on-change="selectCityChange"
                  >
                    <Option :key="-1" value="-1">全国</Option>

                    <Option
                      v-for="(item, index) in cityList"
                      :value="item.value"
                      :key="index"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </div>
                <div class="flex-r">
                  <!-- -1是不排除任何城市 -->
                  <Radio :label="2"><span>排除下列城市(可多选)</span></Radio>
                  <Select
                    v-model="addForm.excludeCityCode"
                    class="input-width item-width"
                    style="width: 320px; margin-left: 26px"
                    filterable
                    multiple
                    v-if="cityType - 2 === 0"
                  >
                    <Option
                      v-for="(item, index) in cityList"
                      :value="item.value"
                      :key="index"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </div>
              </RadioGroup>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="催收人群：" prop="filterRuleDto">
              <p><span style="display: inline-block;margin-right: 10px;width:6em;text-align:right;">完单量</span><InputNumber v-model="addForm.filterRuleDto.minFinOrderCnt" :min="0" :max="999999999" />&nbsp;单&nbsp;--&nbsp;<InputNumber v-model="addForm.filterRuleDto.maxFinOrderCnt" :min="0" :max="999999999"  />&nbsp;单</p>
              <p><span style="display: inline-block;margin-right: 10px;width:6em;text-align:right;">未支付金额</span><InputNumber v-model="addForm.filterRuleDto.minUnpaidAmount" :min="0" :max="999999999" />&nbsp;元&nbsp;--&nbsp;<InputNumber v-model="addForm.filterRuleDto.maxUnpaidAmount" :min="0" :max="999999999"  />&nbsp;元</p>
              <p><span style="display: inline-block;margin-right: 10px;width:6em;text-align:right;">累计实付金额</span><InputNumber v-model="addForm.filterRuleDto.minPaidAmount" :min="0" :max="999999999" />&nbsp;元&nbsp;--&nbsp;<InputNumber v-model="addForm.filterRuleDto.maxPaidAmount" :min="0" :max="999999999"  />&nbsp;元</p>
            </FormItem>
          </Row>
          <!-- 支付时间设置 -->
          <pay-time ref="_payTime"></pay-time>
          <!-- 触达方式 -->
          <touch-way ref="_touchWay" :template="template" @select="$emit('select')"></touch-way>
        </Form>
      </div>
      <div slot="footer">
        <Button v-if="!isDetail" type="primary" ghost @click="(e) => cancel()"
          >取消</Button
        >
        <Button
          v-if="!isDetail"
          type="primary"
          :loading="submitLoading"
          @click="save"
        >
          <span>提交</span>
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// 接口参数说明 参考 read.md
import m2Table from "_a/m2-table/v-table";
import { tool, freeze, pick } from "@/mixins/base";
import { pressSaveService, queryProductAndBusinessList } from "_o/api/urge";
import {
  lineList,
  timesList,
  periodList,
  weekList,
  dayList,
  hourList,
} from "../fields";
import PayTime from "./payTime";
import TouchWay from "./touchWay";

const rules = {
  taskName: [
    {
      required: true,
      message: "请输入任务名称",
      trigger: "change",
    },
  ],
  cityCode: [
    {
      type: "array",
      required: true,
      message: "请选择城市",
    },
  ],
  excludeCityCode: [
    {
      type: "array",
      required: true,
      message: "请选择排除的城市",
    },
  ],
  bizType: [{ required: true, message: "请选择产品线" }],
  sendType: [{ required: true, message: "请选择任务类型" }],
  sendTime: [{ required: true, message: "请选择触发时间" }],
  filterRuleDto: {
    validator(_, value, cb) {
      if (!value) return cb();
      const valid = Object.keys(value).filter(k => k.startsWith("min")).every(k => {
        const max = k.replace("min","max");
        if (typeof value[k] === "number" && typeof value[max] === "number") {
          return value[k] <= value[max];
        }
        return true;
      })
      cb(valid ? void 0 : new Error("请检查数值，须前小后大"))
    }
  }
};
const _addForm = {
  taskName: "", // 任务名称
  sendType: 1, // 1:单次 2:多次
  bizType: "", // 产品线 逗号间隔
  expandBizLine: "",
  filterRuleDto: {
    minFinOrderCnt: null,
    maxFinOrderCnt: null,
    minUnpaidAmount: null,
    maxUnpaidAmount: null,
    minPaidAmount: null,
    maxPaidAmount: null
  },
  cityCode: [], // 逗号间隔，全部不传
  excludeCityCode: [], // 排除的城市 逗号间隔
  startTime: "", // 多次任务 开始时段 Date
  endTime: "", // 多次任务 结束时段 Date
  dateRange: "", // 多次的起止日期
};
export default {
  name: "urge-edit",
  mixins: [tool],
  components: {
    PayTime,
    TouchWay,
  },
  inject: ["getCityList"],
  props: {
    template: Object,
  },
  data() {
    return {
      cityCode: [],
      cityType: 1, // 1 指定城市 2 排除城市
      lineList: freeze(lineList),
      timesList: freeze(timesList),
      periodList: freeze(periodList),
      weekList: freeze(weekList),
      dayList: freeze(dayList),
      hourList: freeze(hourList),
      validateRules: freeze(rules),

      submitLoading: false,
      show: false,
      cycleHour: "", // 周期每小时
      cycleTime: "", // 时间点
      cycleValue: "",

      addForm: JSON.parse(JSON.stringify(_addForm)),
      cityList: [],

      pageData: {},
      title: "",
      configs: {}
    };
  },
  computed: {
    // 是否编辑
    isEdit() {
      return !!this.pageData.id;
    },
    // 是否查看详情
    isDetail() {
      return !!this.pageData._detail;
    },
    // 任务类型是否单次
    isSingle() {
      return this.addForm.sendType - 1 === 0;
    },
    hasAllProductLine() {
      return this.addForm.bizType?.some?.(v => v === -1) || false;
    },
    hasAllBusinessLine() {
      return this.addForm.expandBizLine?.some?.(v => v === -1) || false;
    }
  },
  created() {
    queryProductAndBusinessList().then(res => {
      if (!res.data.success) return;
      this.configs = res.data.data;
    })
  },
  methods: {
    init(p = {}) {
      this.cityList = this.getCityList();
      this.pageData = p;
      this.initData().showModal();
    },
    initData() {
      if (!Object.keys(this.pageData).length) {
        this.title = "新增";
        return this;
      }

      this.title = this.pageData.id ? "编辑" : "复制";
      if (this.pageData._detail) {
        this.title = "查看详情";
      }
      const {
        taskName,
        cityCode,
        excludeCityCode,
        bizType,
        sendRuleDto,
        filterRuleDto,
        touchRuleDto,
        startTime,
        endTime,
        expandBizLine,
      } = this.pageData;
      this.addForm = {
        taskName,
        bizType: bizType ? bizType.split(",").map(Number) : [],
        expandBizLine: expandBizLine ? expandBizLine.split(",").map(Number) : [],
        sendType: sendRuleDto.sendType,
        sendTime: sendRuleDto.sendTime,
        cycleType: sendRuleDto.cycleType,
        filterRuleDto: Object.keys(_addForm.filterRuleDto).reduce((res,k) => (res[k] = filterRuleDto[k], res), {}),
      };
      // 排除城市有值且不为-1  才被选中, 否则选中指定城市
      if (excludeCityCode && excludeCityCode - -1 !== 0) {
        this.cityType = 2;
        this.addForm.excludeCityCode = excludeCityCode.split(",");
      } else {
        this.cityType = 1;
        this.$set(this.addForm, "cityCode", cityCode.split(","));
      }
      if (sendRuleDto.sendType - 2 === 0) {
        this.addForm.startTime = startTime;
        this.addForm.endTime = endTime;
        this.addForm.dateRange = [startTime, endTime];
        this.cycleHour = sendRuleDto.cycleHour;
        this.cycleValue = sendRuleDto.cycleValue;
        this.cycleTime = sendRuleDto.cycleTime;
      }
      this.$refs._payTime.init(filterRuleDto);
      this.$refs._touchWay.init(touchRuleDto);

      return this;
    },
    save() {
      this.$refs._form.validate((valid) => {
        if (!valid) return;
        let p = this.getSaveParams();

        if (!this.checkParams(p)) return;

        this.$Modal.confirm({
          title: "提示",
          content: `确定提交吗?`,
          onOk: async () => {
            const [err, data] = await this.toResult(pressSaveService(p));
            if (err) {
              return;
            }
            this.$Message.success(`${this.title}成功`);
            this.$emit("refresh");
            this.cancel();
          }
        })
        // this.$nextTick(this.clear);
      });
    },
    getSaveParams() {
      let p = {};
      if (this.isSingle) {
        p = this.getSingleParams();
      } else {
        p = this.getParams();
      }
      return p || {};
    },
    // 单次计划入参
    getSingleParams() {
      let p = {
        ...this.getBaseParams(),
        sendRuleDto: {
          sendType: 1,
          sendTime: this.addForm.sendTime,
        },
      };
      return p;
    },
    // 重复计划入参
    getParams() {
      const { startTime, endTime } = this.addForm;
      let cT = this.addForm.cycleType;
      let r = {
        cycleType: cT,
      };
      if (cT - 1 === 0) {
        r.cycleHour = this.cycleHour;
      } else {
        r.cycleTime = this.cycleTime;
        r.cycleValue = this.cycleValue;
      }
      let p = {
        ...this.getBaseParams(),
        startTime,
        endTime,
        sendRuleDto: {
          sendType: 2,
          ...r,
        },
      };
      return p;
    },
    // 单次/多次 共有的参数
    getBaseParams() {
      const { taskName, cityCode, excludeCityCode, bizType, sendType, expandBizLine, filterRuleDto } =
        this.addForm;

      let p = {
        taskName,
        cityCode: "-1", // 默认都传-1
        excludeCityCode: "-1", // 默认都传-1
        filterRuleDto: { ...filterRuleDto, ...this.getFilterParams() },
        touchRuleDto: this.getTouchParams(),
      };
      if (bizType) {
        p.bizType = bizType.join(",");
      }
      if (expandBizLine) {
        p.expandBizLine = expandBizLine.join(",")
      }
      if (this.cityType - 1 === 0) {
        if (cityCode && cityCode.length) {
          p.cityCode = cityCode.join(",");
        }
      } else if (this.cityType - 2 === 0) {
        if (excludeCityCode && excludeCityCode.length) {
          p.excludeCityCode = excludeCityCode.join(",");
        }
      }
      if (this.pageData.id) p.id = this.pageData.id;
      return p;
    },
    // 筛选规则参数
    getFilterParams() {
      let {
        typeOuter,
        typeSub,
        startHour,
        endHour,
        startDay,
        endDay,
        dateTime,
      } = this.$refs._payTime;
      let p = {
        filterType: typeOuter - 3 === 0 ? typeOuter : typeSub,
      };
      let t = {};
      if (typeOuter - 3 === 0) {
        t = { filterStartTime: dateTime[0], filterEndTime: dateTime[1] };
      } else if (typeSub - 1 === 0) {
        t = { startHour, endHour };
      } else if (typeSub - 2 === 0) {
        t = {
          startDay,
          endDay,
        };
      }

      return { ...p, ...t };
    },
    // 触达方式参数
    getTouchParams() {
      let {
        touchType,
        smsContent,
        pushTitle,
        pushSubTitle,
        pushUrl,
        rewardUuid,
        subRewardUuid,
        rewardName,
        subRewardName,
        check,
        intervalCallHour,
      } = this.$refs._touchWay;
      let p = { touchType };

      if (touchType.includes(1)) {
        const tmp = this.template || {}
        p.smsContent = tmp.content || "";
        p.templateCode = tmp.templateCode;
      }
      if (touchType.includes(2)) {
        p.pushTitle = pushTitle;
        p.pushSubTitle = pushSubTitle;
        p.pushUrl = pushUrl;
      }
      if (touchType.includes(3)) {
        p.rewardName = rewardName;
        p.subRewardName = subRewardName;
        p.rewardUuid = rewardUuid;
        p.subRewardUuid = subRewardUuid;
      }

      if (touchType.includes(4) && check) {
        p.intervalCallHour = intervalCallHour;
      }
      return p;
    },
    checkParams(p) {
      if (!p.filterRuleDto.filterType) {
        this.$Message.error("请设置未支付时间");
        return;
      }
      if (!(p.touchRuleDto.touchType && p.touchRuleDto.touchType.length)) {
        this.$Message.error("请设置触达方式");
        return;
      }
      if(this.addForm.sendType - 2 === 0) {
        if(!p.startTime || !p.endTime) {
          this.$Message.error("请设置起止日期");
          return;
        }
      }
      return true;
    },
    clear() {
      this.addForm = JSON.parse(JSON.stringify(_addForm));
      this.$refs._form.resetFields();
      this.$refs._touchWay.restore();
      this.$refs._payTime.restore();
      return this;
    },
    cancel() {
      this.clear().hideModal();
      return this;
    },
    showModal() {
      this.show = true;
      return this;
    },
    hideModal() {
      this.show = false;
      return;
    },
    dateChange(v) {
      const [start, end] = v || [];
      this.dateRange = v;
      this.addForm.startTime = start;
      this.addForm.endTime = end;
    },
    // 选择全国, 其他城市就不能选中
    selectCityChange(v) {
      if (v.find((it) => it - -1 === 0)) {
        v.splice(0, v.length, "-1");
      }
    },
  },
};
</script>

<style scoped lang="less">
.modal-s {
  background-color: #f2f2f2;
}
.mb-40 {
  margin-bottom: 40px;
}
.t {
  font-size: 16px;
  margin-bottom: 10px !important;
}
.item-width {
  width: 240px;
}
.flex-c {
  display: flex;
  flex-direction: row;
}
.ml-20 {
  margin-left: 20px;
}
.it-width {
  width: 140px;
}
.flex-r {
  display: flex;
  flex-direction: row;
}
.mb-10 {
  margin-bottom: 10px;
}
.b-time {
  color: #ed4014;
}
</style>
