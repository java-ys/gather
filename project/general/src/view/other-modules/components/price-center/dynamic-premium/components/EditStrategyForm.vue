
<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-03 09:51:04
 * @Description:
-->
<template>
  <div>
    <Row :gutter="6">
      <Form
        ref="strategyForm"
        inline="inline"
        :model="formData"
        :label-width="100"
        :rules="rules"
      >
        <Col span="6">
          <FormItem label="策略名称:" prop="ruleName">
            <Input
              v-model="formData.ruleName"
              :disabled="!isEdit"
              clearable="clearable"
              style="width: 200px"
            />
          </FormItem>
          <br />
          <FormItem label="业务线:" prop="expandBizLine">
            <Select
              v-model="formData.expandBizLine"
              :disabled="!isEdit"
              clearable
              style="width: 200px"
              @on-change="changeBusiness"
            >
              <Option
                v-for="(m, index) in states.businessGradeList"
                :key="index"
                :value="m.value"
              >
                {{m.label}}
              </Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="产品线:" prop="businessType">
            <Select
              v-model="formData.businessType"
              :disabled="!isEdit"
              clearable
              style="width: 200px"
              @on-change="changeProduct"
            >
              <Option v-for="(m, index) in bizTypeList" :key="index" :value="m.value">
                {{m.label}}
              </Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="车型等级:" prop="carLevelList">
            <CheckboxGroup v-model="formData.carLevelList">
              <Checkbox
                v-for="(item, index) in carLevelList"
                :key="index"
                :disabled="!isEdit"
                :label="item.value"
              >
                {{item.label}}
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <br />
          <FormItem label="城市:" prop="cityCode">
            <Select
              v-model="formData.cityCode"
              :disabled="!isEdit"
              style="width: 200px"
              filterable
              clearable
              @on-change="onCityChange"
            >
              <Option
                v-for="value in states.cityList"
                :key="value.value"
                :value="value.value"
              >{{value.label}}</Option>
            </Select>
          </FormItem>
          <br />
          <!-- 行政区域开始 -->
          <template v-if="formData.cityCode">
            <FormItem label="行政区类型:" prop="areaType">
              <Select
                v-model="formData.areaType"
                :disabled="!isEdit"
                style="width: 200px"
                filterable
                clearable
              >
                <Option :value="1">市级</Option>
                <Option :value="2">区县级</Option>
              </Select>
            </FormItem>
            <br />
          </template>
          <template v-if="formData.areaType === 2">
            <FormItem label="行政区:" prop="areaCode">
              <Select
                v-model="formData.areaCode"
                :disabled="!isEdit"
                style="width: 200px"
                filterable
                clearable
              >
                <Option
                  v-for="item in currentAreaList"
                  :key="item.value"
                  :value="item.value"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
            <br />
          </template>
          <!-- 行政区域结束 -->
          <FormItem label="订单类型:" prop="typeTime">
            <Select
              v-model="formData.typeTime"
              clearable
              style="width: 200px"
              :disabled="!isEdit"
            >
              <Option :value="1">实时订单</Option>
              <Option :value="2">预约订单</Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="生效时间:" prop="effectiveTime">
            <DatePicker
              v-model="formData.effectiveTime"
              :disabled="!isEdit"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placement="bottom-end"
              placeholder="请选择生效时间"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <br />
          <FormItem label="溢价封顶金额:" prop="markupFareTo">
            <Input
              v-model="formData.markupFareTo"
              :disabled="!isEdit"
              clearable="clearable"
              style="width: 200px"
              :maxlength="10"
            />
          </FormItem>
          <br />
          <FormItem label="溢价封顶系数:" prop="markupRateTo">
            <Input
              v-model="formData.markupRateTo"
              :disabled="!isEdit"
              clearable="clearable"
              style="width: 200px"
              :maxlength="10"
            />
          </FormItem>
          <br />
        </Col>
      </Form>

      <Col v-if="isEdit" span="8">
        <Form ref="weekform" :model="formData" :label-width="90" :rules="rules">
          <FormItem label="基础溢价:">
            <CheckboxGroup v-model="formData.basicEnable">
              <Checkbox :label="1"> 启用 </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <div v-if="formData.basicEnable && formData.basicEnable.length">
            <FormItem label="星期值:" prop="week">
              <div class="xq-title">
                <div
                  v-for="(item, index) in weekFormData"
                  :key="index"
                  :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
                  @click="checkedWeek(index)"
                >
                  {{item.weekName}}
                  <Icon
                    type="md-close-circle"
                    class="closeIcon"
                    size="18"
                    @click="deleteWeek(index)"
                  />
                </div>
              </div>
              <div class="xq-content">
                <Button
                  :disabled="isCheckedAllWeek"
                  type="info"
                  :ghost="true"
                  style="margin-right: 10px"
                  @click="initCheckedWeek(1)"
                >
                  添加星期值
                </Button>
                <Button
                  v-show="weekFormData && weekFormData.length > 0"
                  type="success"
                  :ghost="true"
                  @click="initCheckedWeek(2)"
                >
                  编辑星期值
                </Button>
              </div>
              <div v-show="!weekFormData || weekFormData.length === 0" style="color: red">
                请先添加星期值
              </div>
            </FormItem>
          </div>
          <br />
        </Form>
        <template v-if="formData.basicEnable && formData.basicEnable.length">
          <div v-for="(item, index) in weekFormData" v-show="item.isChecked" :key="index">
            <Form
              v-for="(yItem, yIndex) in item.periodRules"
              :ref="'weekForm' + index + yIndex"
              :key="yIndex"
              :model="yItem"
              :rules="weekFormRules"
              :label-width="100"
            >
              <FormItem
                :label="'溢价时段' + (yIndex + 1) + ':'"
                prop="periods"
              >
                <div style="display: flex">
                  <TimePicker
                    v-model="yItem.periods"
                    confirm
                    type="timerange"
                    placement="bottom-end"
                    placeholder="请选择时间段"
                    style="width: 168px"
                  ></TimePicker>
                  <div
                    v-if="yItem.mileageRules && yItem.mileageRules.length > 0"
                    class="addLc"
                    @click="editLc({ index: index, yIndex: yIndex, data: yItem })"
                  >
                    编辑里程节点
                  </div>
                  <div
                    v-else
                    class="addLc"
                    @click="addLc({ index: index, yIndex: yIndex })"
                  >
                    添加里程节点
                  </div>

                  <Icon
                    type="ios-remove-circle-outline"
                    size="30"
                    style="cursor: pointer"
                    color="red"
                    @click="deleteDiscountTime(index, yIndex)"
                  />
                </div>
              </FormItem>

              <FormItem
                v-if="yItem.mileageRules && yItem.mileageRules.length > 0"
                prop="mileageRules"
                :rules="{ required: true }"
              >
                <table class="table">
                  <tr>
                    <td>里程区间&nbsp;(&nbsp;公里&nbsp;)&nbsp;</td>
                    <td>溢价系数</td>
                  </tr>
                  <tr v-for="(zItem, zIndex) in yItem.mileageRules" :key="zIndex">
                    <td>
                      {{zIndex === yItem.mileageRules.length - 1
                        ? zItem.mileStart + "以上"
                        : zItem.mileStart + "-" + zItem.mileEnd}}
                    </td>
                    <td>
                      <Form
                        :ref="'mileForm' + index + yIndex + zIndex"
                        :model="zItem"
                        :rules="lcValidate"
                        :label-width="100"
                      >
                        <FormItem prop="discountRate">
                          <Input
                            v-model="zItem.discountRate"
                            clearable="clearable"
                            style="width: 130px"
                            :maxlength="12"
                          />
                        </FormItem>
                      </Form>
                    </td>
                  </tr>
                </table>
              </FormItem>

              <FormItem v-else label="溢价系数:" prop="discountRate">
                <Input
                  v-model="yItem.discountRate"
                  clearable="clearable"
                  style="width: 170px"
                  :maxlength="12"
                />
              </FormItem>
            </Form>
            <Button
              type="dashed"
              icon="md-add"
              style="margin-left: 100px"
              @click="addDiscountTime(index)"
            >
              添加溢价时段
            </Button>
          </div>
        </template>
      </Col>
      <Col v-else span="8">
        <Form>
          <FormItem label="基础溢价:">
            <span>{{formData.basicEnable ? "启用" : "未启用"}}</span>
          </FormItem>
        </Form>
        <div v-for="(item, i) in formData.basicPeriods" :key="'p' + i">
          <Form>
            <FormItem label="星期值:">
              <div class="xq-title">
                <div v-for="(items, index) in item.week" :key="index">
                  {{getWeekName(items)}} &nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </FormItem>
            <div v-for="(item, index) in item.periodRules" :key="index">
              <FormItem>
                <div style="margin-top: 3px">
                  溢价时段{{index + 1}}&nbsp;:&nbsp;&nbsp;
                  {{item.periodBegin}}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;{{item.periodEnd}}
                </div>
                <div v-if="item.discountRate" class="mt-10">
                  溢价系数&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; {{item.discountRate}}
                </div>
                <div v-else>
                  <table class="table">
                    <tr>
                      <td>里程区间&nbsp;(&nbsp;公里&nbsp;)&nbsp;</td>
                      <td>溢价系数</td>
                    </tr>
                    <tr v-for="(yItem, yIndex) in item.mileageRules" :key="yIndex">
                      <td v-if="yIndex === item.mileageRules.length - 1">
                        {{yItem.mileStart}}以上
                      </td>
                      <td v-else>{{yItem.mileStart}}-{{yItem.mileEnd}}</td>
                      <td>{{yItem.discountRate}}</td>
                    </tr>
                  </table>
                </div>
                <br />
              </FormItem>
              <br />
            </div>
          </Form>
        </div>
      </Col>
      <Col v-if="formData.typeTime !== 2" span="10">
        <Form
          ref="floatform"
          inline="inline"
          :model="formData"
          :label-width="90"
          :rules="rules"
        >
          <FormItem label="动态溢价系数:">
            <CheckboxGroup v-if="isEdit" v-model="formData.floatEnable">
              <Checkbox :label="1"> 启用 </Checkbox>
            </CheckboxGroup>
            <span v-else>{{formData.floatEnable ? "启用" : "未启用"}}</span>
          </FormItem>
          <br />
        </Form>
        <!-- 循环表单 -->
        <template v-if="formData.floatEnable && formData.floatEnable.length">
          <Form
            v-for="(item, index) in formData.strategyInfoReqList"
            :ref="'detailForm' + index"
            :key="index"
            :model="item"
            :rules="floatValidate"
            :label-width="100"
          >
            <div class="ml-20">
              {{"策略明细" + (index + 1)}}
            </div>
            <FormItem>
              <Button
                v-if="isEdit"
                type="primary"
                :disabled="index === 0 && formData.strategyInfoReqList.length === 1"
                @click="deleteGo(index)"
              >
                删除
              </Button>
            </FormItem>

            <FormItem label="时间段:" prop="dateTime" class="ml-50">
              <TimePicker
                v-model="item.dateTime"
                confirm
                type="timerange"
                placement="bottom-end"
                placeholder="请选择时间段"
                style="width: 168px"
                :disabled="!isEdit"
                @on-change="(val) => changeDateTime(val, index)"
              ></TimePicker>
            </FormItem>

            <FormItem
              label="应答率:"
              prop="resRateFrom"
              class="ml-50"
              style="display: inline-block"
            >
              <Input
                v-model="item.resRateFrom"
                :disabled="!isEdit"
                clearable="clearable"
                style="width: 70px"
              />&nbsp;%
            </FormItem>
            <FormItem prop="resRateFromInclude" class="resRate">
              <Checkbox v-model="item.resRateFromInclude" :disabled="!isEdit">
                包含&nbsp;&nbsp;&nbsp;&nbsp;至
              </Checkbox>
            </FormItem>
            <FormItem prop="resRateTo" class="resRate">
              <Input
                v-model="item.resRateTo"
                :disabled="!isEdit"
                clearable="clearable"
                style="width: 70px"
              />&nbsp;%
            </FormItem>
            <FormItem prop="resRateToInclude" class="resRate">
              <Checkbox v-model="item.resRateToInclude" :disabled="!isEdit">
                包含
              </Checkbox>
            </FormItem>

            <FormItem
              label="最低呼叫数:"
              prop="minNum"
              class="ml-50"
              style="margin-top: 5px"
            >
              <Input
                v-model="item.minNum"
                :disabled="!isEdit"
                clearable="clearable"
                style="width: 200px"
                :maxlength="3"
              />
            </FormItem>
            <FormItem label="浮动溢价系数:" prop="rate" class="ml-50">
              <Input
                v-model="item.rate"
                :disabled="!isEdit"
                clearable="clearable"
                style="width: 200px"
                placeholder="请输入1-10，最多支持2位小数"
              />
            </FormItem>
          </Form>
          <Button v-if="isEdit" type="primary" @click="addDetail">
            添加动态溢价策略明细
          </Button>
        </template>
      </Col>
    </Row>
    <checkedWeek ref="checkedWeek" @getWeekData="getWeekData" />
    <addMileage ref="addMileage" @getAddMileage="getAddMileage" />
  </div>
</template>
<script>
const getBLen = (str) => {
  // 把双字节的替换成两个单字节的然后再获得长度
  if (str == null) return 0;
  if (typeof str !== "string") {
    str = String(str);
  }
  return str.replace(/[^\x00-\xff]/g, "01").length;
};
const lenValidate = (rule, val, callback) => {
  let len = getBLen(val);
  if (len > 40) {
    callback(new Error("最多输入20个字(40个字符)"));
  } else {
    callback();
  }
};
import { computed, reactive, ref, watch } from "@vue/composition-api";
import { getNewCarLevelList, callAreaInfoByCityCode } from "_gc/status-map";
import {  validatorTimeDetail, getWeekName } from "../fields";
import checkedWeek from "./checkedWeek";
import addMileage from "./addMileage";
import { hasTimesection } from "@/libs/tools.js";
export default {
  name: "EditStrategyForm",
  components: {
    checkedWeek,
    addMileage,
  },
  props: {
    remoteData: Object,
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  setup: (props, { root, refs }) => {
    const strategyForm = ref(null);
    const currentAreaList = ref([]);
    const bizTypeList = ref([]);
    const carLevelList = ref([]);
    const formData = reactive({
      ruleName: undefined,
      expandBizLine: undefined,
      businessType: undefined,
      carLevelList: [],
      cityCode: undefined,
      areaType: undefined,
      areaCode: undefined,
      typeTime: undefined,
      effectiveTime: undefined,
      basicEnable: undefined,
      markupFareTo: undefined,
      markupRateTo: undefined,
      basicPeriods: [
        {
          week: [],
          periodRules: [],
        },
      ],
      floatEnable: undefined,
      strategyInfoReqList: [
        {
          resRateFrom: undefined,
          resRateFromInclude: undefined,
          resRateTo: undefined,
          resRateToInclude: undefined,
          minNum: undefined,
          rate: undefined,
          sort: 1,
          startTime: undefined,
          endTime: undefined,
          dateTime: [],
        },
      ],
    });
    const weekFormData = ref([]);
    // store
    const state = root.$store.state;
    const states = reactive({
      // 获取 store 中的值
      cityList: computed(() => state.common.authCityList),
      bizTypeList: computed(() => state.common.bizTypeList),
      businessGradeList: computed(() => state.common.businessGradeList),
    });
    const rules = reactive({
      ruleName: [
        {
          required: true,
          message: "请填写规则名称",
        },
        {
          pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
          message: "仅支持中文英文和数字",
        },
        {
          message: "最多输入20个字(40个字符)",
          validator: lenValidate,
        },
      ],
      expandBizLine: [{ required: true, message: "必选" }],
      carLevelList: [{ required: true, message: "必填" }],
      cityCode: [{ required: true, message: "请选择城市" }],
      areaCode: [{ required: true, message: "请选择区县" }],
      areaType: [{ required: true, message: "必填" }],
      effectiveTime: [{ required: true, message: "必填" }],
      typeTime: [{ required: true, message: "必填" }],
      markupFareTo: [
        { required: true, message: "必填" },
        {
          pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/,
          message: "0~100之间，最多两位小数",
        },
      ],
      markupRateTo: [
        { required: true, message: "必填" },
        {
          pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/,
          message: "0~100之间，最多两位小数",
        },
      ],
      businessType: [
        {
          required: true,
          message: "请选择产品线",
        },
      ],
    });
    const timeListValidate = () => {
      // 时间交叉
      // 基础溢价
      let timeList = weekFormData.value;
      for (let i = 0; i < timeList.length; i++) {
        let num = 0;
        for (let j = 0; j < timeList[i].periodRules.length; j++) {
          if (!hasTimesection(timeList[i].periodRules[0].periods, timeList[i].periodRules[j].periods)) {
            num++;
          }
        }
        if (num > 1) {
          root.$Message.warning("基础溢价时段不可交叉");
          return false;
        }
      }

      // 动态溢价
      let timeList2 = formData.strategyInfoReqList;
      let num2 = 0;
      for (let i = 0; i < timeList2.length; i++) {
        if (!hasTimesection(timeList2[0].dateTime, timeList2[i].dateTime)) {
          num2++;
        }
      }
      if (num2 > 1) {
        root.$Message.warning("动态溢价时段不可交叉");
        return false;
      }
      return true;
    };
    const weekFormRules = reactive({
      periods: [
        {
          required: true,
          validator: validatorTimeDetail,
        },
      ],

      discountRate: [
        {
          required: true,
          message: "必填",
        },
        {
          pattern: /^([1-9].[0-9]{1,2}|[1-9])$/,
          message: "1~10之间，最多两位小数",
        },
      ],
    });

    const lcValidate = reactive({
      discountRate: [
        {
          required: true,
          message: "必填",
        },
        {
          pattern: /^([1-9].[0-9]{1,2}|[1-9])$/,
          message: "1~10之间，最多两位小数",
        },
      ],
    });

    const floatValidate = reactive({
      dateTime: [
        {
          required: true,
          validator: validatorTimeDetail,
        },
      ],
      resRateFrom: [
        { required: true, message: "必选" },
        {
          pattern: /^(?:0|[1-9][0-9]?|100)$/,
          message: "0-100之间的整数",
        },
      ],
      resRateTo: [
        { required: true, message: "必选" },
        {
          pattern: /^(?:0|[1-9][0-9]?|100)$/,
          message: "0-100之间的整数",
        },
      ],
      minNum: [
        { required: true, message: "必选" },
        {
          validator: (rule, value, callback) => {
            if (value > 500 || value < 0) {
              callback(new Error("请输入0-500之间的数字"));
            } else if (!/^(500|[1-4]{0,1}\d{0,1}\d)$/.test(value)) {
              callback(new Error("请输入整数"));
            }
            callback();
          },
          message: "请输入0-500之间的整数",
        },
      ],
      rate: [
        { required: true, message: "必选" },
        {
          pattern: /^([1-9].[0-9]{1,2}|[1-9]|10|10.0|10.00)$/,
          message: "1~10之间，最多两位小数",
        },
      ],
    });

    const onCityChange = (v) => {
      if (v) {
        queryArea(v);
      } else {
        formData.cityCode = undefined;
      }
    };

    const queryArea = (cityCode) => {
      formData.areaCode = undefined;
      currentAreaList.value = [];
      callAreaInfoByCityCode(cityCode, (list) => {
        currentAreaList.value = list;
      });
    };

    const changeBusiness = (val) => {
      bizTypeList.value =
        (states.businessGradeList.find((it) => it.value === val) || {}).children || [];
      carLevelList.value = [];
      formData.businessType = undefined;
      formData.carLevelList = [];
    };

    const changeProduct = (val) => {
      carLevelList.value = getNewCarLevelList(val).list;
      formData.carLevelList = [];
    };
    // 判断是否已经选中了所有星期
    const isCheckedAllWeek = computed(() => {
      let arr = [];
      weekFormData.value.forEach((item, index) => {
        arr = [...arr, ...item.week];
      });
      if (arr && arr.length === 7) {
        return true;
      } else {
        return false;
      }
    });

    // 校验
    const callValidate = async () => new Promise(async (resolve, reject) => {
      const res1 = await refs.strategyForm.validate();
      const res2 =
        formData.basicEnable && formData.basicEnable.length
          ? await refs.weekform.validate()
          : true;
      const res3 = await subVali();
      const res4 = timeListValidate();
      if (res1 && res2 && res3 && res4) {
        let params = JSON.parse(JSON.stringify(formData));
        if (!(params.floatEnable && params.floatEnable.length)) {
          params.strategyInfoReqList = [];
        }
        resolve({
          weekFormData,
          formData: params,
        });
      } else {
        reject(new Error());
      }
    });

    const getWeekData = (val) => {
      weekFormData.value = val;
      if (weekFormData.value.length === 1) {
        weekFormData.value[0].isChecked = true;
      }
    };

    const subVali = async () => {
      let res3 = true;
      if (formData.basicEnable && formData.basicEnable.length) {
        for (let i = 0; i < weekFormData.value.length; i++) {
          let vali = true;
          for (let j = 0; j < weekFormData.value[i].periodRules.length; j++) {
            vali = await refs[`weekForm${i}${j}`][0].validate();
            if (!vali) {
              res3 = false;
            }
            let vali1 = true;
            for (
              let k = 0;
              k < weekFormData.value[i].periodRules[j].mileageRules?.length;
              k++
            ) {
              vali1 = await refs[`mileForm${i}${j}${k}`][0].validate();
              if (!vali1) {
                res3 = false;
              }
            }
          }
        }
      }
      let res4 = true;
      if (formData.floatEnable && formData.floatEnable.length) {
        for (let i = 0; i < formData.strategyInfoReqList.length; i++) {
          let vali = await refs[`detailForm${i}`][0].validate();
          if (!vali) {
            res4 = false;
          }
        }
      }
      return res3 && res4;
    };
    // 星期值新增/编辑
    const initCheckedWeek = (val) => {
      // 新增
      if (val === 1) {
        refs.checkedWeek.addWeek(weekFormData.value);
      }
      // 编辑
      else {
        weekFormData.value.forEach((item, index) => {
          if (item.isChecked) {
            refs.checkedWeek.getEditWeek({
              dataSource: weekFormData.value,
              currentData: item.week,
              index: index,
            });
          }
        });
      }
    };
    // 删除星期值
    const deleteWeek = (val) => {
      weekFormData.value.splice(val, 1);
    };

    const checkedWeek = (val) => {
      weekFormData.value = weekFormData.value.map((item, index) => {
        if (index === val) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        return item;
      });
    };
    // 获取里程节点数据
    const getAddMileage = (val) => {
      let data = val.data;
      let indexFlag = val.indexFlag;
      weekFormData.value[indexFlag.index].periodRules[indexFlag.yIndex].discountRate = "";
      weekFormData.value[indexFlag.index].periodRules[
        indexFlag.yIndex
      ].mileageRules = data;
      weekFormData.value = JSON.parse(JSON.stringify(weekFormData.value));
    };
    // 添加溢价时段
    const addDiscountTime = (val) => {
      let value = weekFormData.value;
      if (value[val].periodRules.length >= 50) {
        root.$Message.warning("一个星期值区块下最多可添加50个时段");
      } else {
        value[val].periodRules.push({});
        value = JSON.parse(JSON.stringify(value));
      }
    };
    // 删除溢价时段
    const deleteDiscountTime = (index, yIndex) => {
      let value = weekFormData.value;
      value[index].periodRules.splice(yIndex, 1);
    };
    const addLc = (indexFlag) => {
      refs.addMileage.init(indexFlag);
    };

    const editLc = (val) => {
      refs.addMileage.edit(val);
    };

    const deleteGo = (index) => {
      formData.strategyInfoReqList.splice(index, 1);
    };
    const addDetail = () => {
      if (formData.strategyInfoReqList.length === 50) {
        return;
      }
      formData.strategyInfoReqList.push({
        resRateFrom: undefined,
        resRateFromInclude: undefined,
        resRateTo: undefined,
        resRateToInclude: undefined,
        minNum: undefined,
        rate: undefined,
        sort: 1,
        startTime: undefined,
        endTime: undefined,
      });
    };

    const changeDateTime = (val, i) => {
      formData.strategyInfoReqList[i].startTime = val[0];
      formData.strategyInfoReqList[i].endTime = val[1];
    };
    /* eslint-disable complexity */
    watch(
      () => props.remoteData,
      (_v) => {
        if (_v && _v.strategyInfoReqList && _v.strategyInfoReqList.length) {
          _v.strategyInfoReqList = _v.strategyInfoReqList.map((it) => {
            return {
              ...it,
              dateTime: [it.startTime, it.endTime],
            };
          });
        }
        if (_v && _v.expandBizLine) {
          bizTypeList.value =
            (states.businessGradeList.find((it) => it.value === _v.expandBizLine) || {})
              .children || [];
        }
        if (_v && _v.businessType) {
          carLevelList.value = getNewCarLevelList(_v.businessType).list;
        }
        if (_v && _v.basicEnable) {
          _v.basicEnable = [1];
        } else {
          _v.basicEnable = [];
        }
        if (_v && _v.floatEnable) {
          _v.floatEnable = [1];
        } else {
          _v.floatEnable = [];
        }
        if (_v && _v.businessType) {
          carLevelList.value = getNewCarLevelList(_v.businessType).list;
        }
        getWeekData(_v.basicPeriods.map(it => {
          let weekName = []
          for (let item of it.week) {
            weekName.push(getWeekName(item))
          }
          let periodRules = it.periodRules
          periodRules = periodRules.map(it => {
            return {
              ...it,
              periods: [it.periodBegin, it.periodEnd]
            }
          })
          return {
            ...it,
            periodRules,
            weekName: weekName.join(","),
          }
        }))
        console.log(weekFormData)
        let v = {};
        if (_v) {
          v = { ..._v, carLevelList: [_v.carLevel] } || {};
          Object.assign(formData, v);
        } else {
          Object.assign(formData, {
            ruleName: undefined,
            expandBizLine: undefined,
            businessType: undefined,
            carLevelList: [],
            cityCode: undefined,
            areaType: undefined,
            areaCode: undefined,
            typeTime: undefined,
            effectiveTime: undefined,
            basicEnable: undefined,
            markupFareTo: undefined,
            markupRateTo: undefined,
            basicPeriods: [
              {
                week: [],
                periodRules: [],
              },
            ],
            floatEnable: undefined,
            strategyInfoReqList: [
              {
                resRateFrom: undefined,
                resRateFromInclude: undefined,
                resRateTo: undefined,
                resRateToInclude: undefined,
                minNum: undefined,
                rate: undefined,
                sort: 1,
                startTime: undefined,
                endTime: undefined,
                dateTime: [],
              },
            ],
          });
        }
        if (v?.cityCode) {
          callAreaInfoByCityCode(v.cityCode, (list) => {
            currentAreaList.value = list;
          });
        } else {
          currentAreaList.value = [{ label: "全部", value: "0" }];
        }
      },
      { immediate: true }
    );
    return {
      rules,
      formData,
      weekFormData,
      states,
      onCityChange,
      changeProduct,
      changeBusiness,
      currentAreaList,
      carLevelList,
      bizTypeList,
      isCheckedAllWeek,
      callValidate,
      getWeekData,
      deleteWeek,
      initCheckedWeek,
      getAddMileage,
      checkedWeek,
      addDiscountTime,
      deleteDiscountTime,
      addLc,
      editLc,
      weekFormRules,
      lcValidate,
      floatValidate,
      deleteGo,
      addDetail,
      strategyForm,
      changeDateTime,
      getWeekName,
    };
  },
};
</script>
<style lang="less" scoped>
.xq-title {
  display: flex;
  margin-bottom: 10px;
  width: 300px;
  flex-wrap: wrap;
  .xq-item,
  .xq-item-checked {
    text-align: center;
    height: 32px;
    line-height: 12px;
    padding: 10px;
    color: #000000;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 4px;
    font-weight: bold;
    position: relative;
    padding-right: 28px;
    padding-left: 28px;
  }
  .xq-item {
    font-weight: bold;
    background: #ffffff;
    border: 1px solid #dcdee2;
  }
  .xq-item-checked {
    color: #ffffff;
    background: #2d8cf0;
    border: none;
  }
}

.addDiscountTime {
  margin-bottom: 20px;
  margin-left: 70px;
  color: #2d8cf0;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.addLc {
  margin-left: 20px;
  margin-right: 20px;
  color: #2d8cf0;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.ml-20 {
  margin-left: 20px;
}
.ml-50 {
  margin-left: 50px;
}
.mr-20 {
  margin-right: 20px;
}
.mt-10 {
  margin-top: 10px;
}
.resRate {
  display: inline-block;
  margin-left: -90px;
}

.mt-10 {
  margin-top: 10px;
}
.week {
  padding: 10px;
  height: 30px;
  line-height: 13px;
  text-align: center;
  border: 1px solid #999999;
}
.table {
  margin-top: 15px;
  border: 1px solid #999999;
  border-collapse: collapse;
  td {
    border: 1px solid #999999;
    padding: 10px;
    text-align: center;
  }
}
</style>
