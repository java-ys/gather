<template>
  <div>
    <Form ref="formValidate" :label-width="136">
      <FormItem label="排班类型：" style="position: relative;">
        <span
          style="position: absolute;left: -82px; top: 10px;color: #ed4014;line-height: 1;font-size: 12px;font-family: SimSun;display: inline-block;"
          >*</span
        >
        <Select
          :disabled="ruleType == 'X'|| ruleType =='E'"
          v-model="shiftType"
          style="width: 200px"
          @on-change="getType"
        >
          <Option :value="1">单班</Option>
          <Option :value="2">双班</Option>
        </Select>
      </FormItem>
    </Form>
    <one-rule
      :formItem="formItem"
      ref="one"
      v-if="types == 1"
      :ruleType="ruleType"
      :cityList="cityList"
      :borcolor="borcolor"
      :driverType="driverType"
      :newCity="newCity"
      @verifyTime="verifyTimeChange"
    ></one-rule>
    <two-rule
      :formItem="formItem1"
      ref="two"
      v-if="types == 2"
      :ruleType="ruleType"
      :cityList="cityList"
      :borcolor2="borcolor2"
      :driverType="driverType"
      :newCity="newCity"
      @verifyTime="verifyTimeChange2"
    ></two-rule>
    <div class="ivu-modal-footer">
      <Button
        type="text"
        size="large"
        style="margin-right: 8px"
        @click="closeChange"
        >取消</Button
      >
      <Button
        type="primary"
        v-lazy-click="handleSubmit"
        size="large"
        v-if="ruleType != 'X'"
        >确定</Button
      >
    </div>
  </div>
</template>
<script>
import oneRule from "./oneRule.vue";
import twoRule from "./twoRule.vue";
import { getProvinceCityAllList, axiosSetCityList } from "_g/api/common.js";
import { getDriverLabel } from "_o/api/m2-driver-api/common.js";
import { ruleAdd, ruleDetail, ruleEdit } from "_o/api/m2-driver-api/rule.js";
import moment from "moment";
export default {
  props: {
    ruleType: {
      type: String,
      default: "A"
    },
    modal: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    oneRule,
    twoRule
  },
  watch: {
    modal() {
      this.borcolor = false;
      this.borcolor2 = [
        {
          label: "1",
          value: false
        },
        {
          label: "2",
          value: false
        },
        {
          label: "3",
          cut: false
        },
        {
          label: "4",
          cut: false
        }
      ];
      if (this.modal) {
        if (this.ruleType == "E" || this.ruleType == "X") {
          this.newCity = true;
          ruleDetail({ shiftUuid: this.id }).then(res => {
            if (res.data.success) {
              let data = res.data.data;
              if (res.data.data.shiftType == 1) {
                this.shiftType = 1;
                this.types = 1;
                // 单班编辑详情使用
                let formItem = Object.assign(
                  data,
                  data.shiftRuleDetailsDtoList[0]
                );
                if(this.$refs.one) {
                  this.$refs.one.$refs.formValidate.resetFields();
                  this.$refs.one.$refs.formValidateChild.resetFields();
                }
                this.formItem.cityCode = formItem.cityCode;
                this.formItem.shiftType = formItem.shiftType;
                this.formItem.shiftUuid = formItem.shiftUuid;
                this.formItem.driverTag = formItem.driverTag;
                let dtoList = data.shiftRuleDetailsDtoList[0];
                let dutyDurationGradientApiDtoList = [];
                let dutyDurationGradientApiDtoList2 = [];
                let peakTimeDetailsApiDtoList = [];
                if (dtoList.dutyDurationGradientDtoList.length) {
                  dtoList.dutyDurationGradientDtoList.forEach((item, index) => {
                    if (item.durationType == 1) {
                      dutyDurationGradientApiDtoList.push({
                        durationType: 1,
                        intervalLvalue: String(item.intervalLvalue),
                        intervalRvalue: String(item.intervalRvalue),
                        dutyDays: item.dutyDays
                      });
                    }
                    if (item.durationType == 2) {
                      dutyDurationGradientApiDtoList2.push({
                        durationType: 2,
                        intervalLvalue: String(item.intervalLvalue),
                        intervalRvalue: String(item.intervalRvalue),
                        dutyDays: item.dutyDays
                      });
                    }
                  });
                  if (!dutyDurationGradientApiDtoList.length) {
                    dutyDurationGradientApiDtoList.push({
                      durationType: 1,
                      intervalLvalue: "",
                      intervalRvalue: "",
                      dutyDays: ""
                    });
                  }
                  if (!dutyDurationGradientApiDtoList2.length) {
                    dutyDurationGradientApiDtoList2.push({
                      durationType: 2,
                      intervalLvalue: "",
                      intervalRvalue: "",
                      dutyDays: ""
                    });
                  }
                } else {
                  dutyDurationGradientApiDtoList.push({
                    durationType: 1,
                    intervalLvalue: "",
                    intervalRvalue: "",
                    dutyDays: ""
                  });
                  dutyDurationGradientApiDtoList2.push({
                    durationType: 2,
                    intervalLvalue: "",
                    intervalRvalue: "",
                    dutyDays: ""
                  });
                }
                if (dtoList.peakTimeDetailsDtoList.length) {
                  dtoList.peakTimeDetailsDtoList.forEach((key, i) => {
                    peakTimeDetailsApiDtoList.push({
                      peakStartTime: key.peakStartTime,
                      peakEndTime: key.peakEndTime
                    });
                  });
                } else {
                  peakTimeDetailsApiDtoList.push({
                    peakStartTime: "",
                    peakEndTime: ""
                  });
                }

                this.formItem.dutyDurationGradientApiDtoList = dutyDurationGradientApiDtoList;
                this.formItem.dutyDurationGradientApiDtoList2 = dutyDurationGradientApiDtoList2;
                this.formItem.peakTimeDetailsApiDtoList = peakTimeDetailsApiDtoList;
                this.formItem.effectiveTime = new Date(formItem.effectiveTime);

                this.formItem.shiftName = formItem.shiftName;
                this.formItem.shiftStartTime = formItem.shiftStartTime;
                this.formItem.shiftEndTime = formItem.shiftEndTime;
                this.formItem.cutTime = String(formItem.cutTime)
                this.formItem.onlineDuration = String(formItem.onlineDuration);
                this.formItem.peakDuration = String(formItem.peakDuration);
                this.formItem.chargeDuration = String(formItem.chargeDuration);
              } else {
                // 双班编辑详情使用
                this.types = 2;
                this.shiftType = 2;
                let formItem = data;
                let dtoList = data.shiftRuleDetailsDtoList;
                dtoList.forEach((item, index) => {
                  let peakTimeDetailsApiDtoList = [];
                  if (item.peakTimeDetailsDtoList.length) {
                    item.peakTimeDetailsDtoList.forEach((key, i) => {
                      peakTimeDetailsApiDtoList.push({
                        peakStartTime: key.peakStartTime,
                        peakEndTime: key.peakEndTime
                      });
                    });
                  } else {
                    peakTimeDetailsApiDtoList.push({
                      peakStartTime: "",
                      peakEndTime: ""
                    });
                  }
                  this.formItem.shiftType = 2;
                  let dutyDurationGradientApiDtoList = [];
                  let dutyDurationGradientApiDtoList2 = [];
                  if (item.dutyDurationGradientDtoList.length) {
                    item.dutyDurationGradientDtoList.forEach((key, i) => {
                      if (key.durationType == 1) {
                        dutyDurationGradientApiDtoList.push({
                          durationType: 1,
                          intervalLvalue: String(key.intervalLvalue),
                          intervalRvalue: String(key.intervalRvalue),
                          dutyDays: key.dutyDays
                        });
                      }
                      if (key.durationType == 2) {
                        dutyDurationGradientApiDtoList2.push({
                          durationType: 2,
                          intervalLvalue: String(key.intervalLvalue),
                          intervalRvalue: String(key.intervalRvalue),
                          dutyDays: key.dutyDays
                        });
                      }
                    });
                    if (!dutyDurationGradientApiDtoList.length) {
                      dutyDurationGradientApiDtoList.push({
                        durationType: 1,
                        intervalLvalue: "",
                        intervalRvalue: "",
                        dutyDays: ""
                      });
                    }
                    if (!dutyDurationGradientApiDtoList2.length) {
                      dutyDurationGradientApiDtoList2.push({
                        durationType: 2,
                        intervalLvalue: "",
                        intervalRvalue: "",
                        dutyDays: ""
                      });
                    }
                  } else {
                    dutyDurationGradientApiDtoList.push({
                      durationType: 1,
                      intervalLvalue: "",
                      intervalRvalue: "",
                      dutyDays: ""
                    });
                    dutyDurationGradientApiDtoList2.push({
                      durationType: 2,
                      intervalLvalue: "",
                      intervalRvalue: "",
                      dutyDays: ""
                    });
                  }
                  item.peakTimeDetailsApiDtoList = peakTimeDetailsApiDtoList;
                  item.dutyDurationGradientApiDtoList = dutyDurationGradientApiDtoList;
                  item.dutyDurationGradientApiDtoList2 = dutyDurationGradientApiDtoList2;
                  item.onlineDuration = String(item.onlineDuration);
                  item.peakDuration = String(item.peakDuration);
                  item.chargeDuration = String(item.chargeDuration);
                });
                formItem.data = dtoList;
                this.formItem1 = JSON.parse(JSON.stringify(formItem));
                this.formItem1.shiftUuid = formItem.shiftUuid
                this.formItem1.effectiveTime = new Date(formItem.effectiveTime);
              }
            }
          });
        } else {
          //  新增时清空数据
          this.types = 1;
          this.shiftType = 1;
          this.formItem.shiftType = 1;
          this.formItem.cityCode = "";
          this.formItem.driverTag = "";
          this.formItem.shiftName = "";
          this.formItem.effectiveTime = "";
          this.formItem.shiftStartTime = "";
          this.formItem.shiftEndTime = "";
          this.formItem.cutTime = "";
          this.formItem.onlineDuration = "";
          this.formItem.peakDuration = "";
          this.formItem.chargeDuration = "";

          this.formItem.peakTimeDetailsApiDtoList = [
            {
              peakStartTime: "",
              peakEndTime: ""
            }
          ];
          this.formItem.dutyDurationGradientApiDtoList = [
            {
              durationType: 1,
              intervalLvalue: null,
              intervalRvalue: null,
              dutyDays: ""
            }
          ];
          this.formItem.dutyDurationGradientApiDtoList2 = [
            {
              durationType: 2,
              intervalLvalue: null,
              intervalRvalue: null,
              dutyDays: ""
            }
          ];
        }
      } else {
        //  移除校验
        this.newCity = true;
        if (this.types == 1) {
          this.$refs.one.$refs.formValidate.resetFields();
          this.$refs.one.$refs.formValidateChild.resetFields();
        } else {
          this.$refs.two.$refs.formValidate.resetFields();
          this.$refs.two.$refs.wrapRef.forEach(item => {
            item.resetFields();
          });
          this.$refs.two.$refs.refChild1.forEach(item => {
            item.resetFields();
          });
        }
      }
    }
  },
  data() {
    return {
      borcolor: false,
      shiftType: 1,
      borcolor2: [
        {
          label: "1",
          value: false
        },
        {
          label: "2",
          value: false
        },
        {
          label: "3",
          cut: false
        },
        {
          label: "4",
          cut: false
        }
      ],
      newCity: true,
      formItem: {
        shiftType: 1,
        onlineDuration: "",
        peakDuration: "",
        chargeDuration: "",
        driverTag: "",
        shiftName: "",
        effectiveTime: "",
        shiftStartTime: "",
        cutTime: "",
        cityCode: "",
        peakTimeDetailsApiDtoList: [
          {
            peakStartTime: "",
            peakEndTime: ""
          }
        ],
        dutyDurationGradientApiDtoList: [
          {
            durationType: 1,
            intervalLvalue: "",
            intervalRvalue: "",
            dutyDays: ""
          }
        ],
        dutyDurationGradientApiDtoList2: [
          {
            durationType: 2,
            intervalLvalue: "",
            intervalRvalue: "",
            dutyDays: ""
          }
        ]
      },
      formItem1: {
        shiftType: 2,
        data: [
          {
            peakTimeDetailsApiDtoList: [
              {
                peakStartTime: "",
                peakEndTime: ""
              }
            ],
            dutyDurationGradientApiDtoList: [
              {
                durationType: 1,
                intervalLvalue: "",
                intervalRvalue: "",
                dutyDays: ""
              }
            ],
            dutyDurationGradientApiDtoList2: [
              {
                durationType: 2,
                intervalLvalue: "",
                intervalRvalue: "",
                dutyDays: ""
              }
            ]
          },
          {
            peakTimeDetailsApiDtoList: [
              {
                peakStartTime: "",
                peakEndTime: "",
                time: []
              }
            ],
            dutyDurationGradientApiDtoList: [
              {
                durationType: 1,
                intervalLvalue: "",
                intervalRvalue: "",
                dutyDays: ""
              }
            ],
            dutyDurationGradientApiDtoList2: [
              {
                durationType: 2,
                intervalLvalue: "",
                intervalRvalue: "",
                dutyDays: ""
              }
            ]
          }
        ]
      },
      defaultForm: {},
      types: "1",
      cityList: [],
      driverType: [],
      timeData: []
    };
  },
  mounted() {
    this.getCityList();
    this.getDriverTypeList();
  },
  methods: {
    // 获取城市列表
    getCityList() {
      axiosSetCityList({}).then(res => {
        if (res.data.success) {
          let cityList = res.data.data;
          this.cityList = cityList;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    getDriverTypeList() {
      getDriverLabel().then(res => {
        if (res.data.success) {
          this.driverType = res.data.data;
        }
      });
    },
    handleSubmit() {
      if (this.types == "1") {
        // 单班
        this.singleChange();
      } else {
        this.dualChange();
      }
    },
    singleChange() {
      let bo11,
        bo12,
        bol3,
        bol4 = false;
      let formItem = this.formItem;
      let list = formItem.dutyDurationGradientApiDtoList.concat(
        formItem.dutyDurationGradientApiDtoList2
      );
      let promise = new Promise(function(resolve, reject) {
        resolve();
      });
      promise
        .then(() => {
          this.$refs.one.$refs.formValidate.validate(valid => {
            if (valid) {
              bo11 = true;
              this.borcolor = false;
            } else {
              bo11 = false;
              this.$Message.warning("请检查规则项是否维护正确或完整");
              this.borcolor = true;
            }
          });
        })
        .then(() => {
          if (bo11) {
            if(formItem.cutTime > "03:00") {
                bo12 = false;
                return Promise.reject("切换时间点不得迟于三点");
            }
            let _timeWayArray = formItem.peakTimeDetailsApiDtoList

            //formItem.shiftStartTime 排班开始时间
            //formItem.shiftEndTime 排班结束
            //peakStartTime高峰开始   peakEndTime// 高峰结束
            // 需求，高峰时段必须在排班时段内
            let shiftStartTime = formItem.shiftStartTime;
            let shiftEndTime = formItem.shiftEndTime;
            // 排班时间和高峰时间同时存在判断
              if (
                shiftStartTime &&
                shiftEndTime &&
                _timeWayArray[0].peakStartTime &&
                _timeWayArray[0].peakEndTime
              ) {
                for (
                  let j = 0, length = _timeWayArray.length;
                  j < length;
                  j++
                ) {
                  let peakStartTime = _timeWayArray[j].peakStartTime;
                  let peakEndTime = _timeWayArray[j].peakEndTime;
                  // let peakStartTime高峰开始时间
                  // let shiftEndTime高峰开始时间
                  if (shiftStartTime >= shiftEndTime) {
                    // 开始时间大于结束时间存在跨天
                    if (
                      peakStartTime >= shiftStartTime &&
                      peakEndTime <= shiftEndTime
                    ) {
                      bo12 = true;
                    } else {
                      if (
                        peakStartTime <= shiftEndTime &&
                        peakEndTime <= shiftEndTime &&
                        peakStartTime < peakEndTime
                      ) {
                        bo12 = true;
                      } else if(peakStartTime >= shiftStartTime && peakStartTime >= shiftEndTime && peakEndTime >= shiftStartTime && peakEndTime >= shiftEndTime){
                        bo12 = true;

                      }else {
                         bo12 = false;
                        return Promise.reject("高峰时段必须在排班时间内");
                      }
                    }
                  } else {
                    // 不跨天
                    if (
                      peakStartTime >= shiftStartTime &&
                      peakEndTime <= shiftEndTime &&
                      peakStartTime <= peakEndTime
                    ) {
                      bo12 = true;
                    } else {
                       bo12 = false;
                      return Promise.reject("高峰时段必须在排班时间内");
                    }
                  }
                }
              } else {
                // 如果高峰时段只填了一个
                if (
                  _timeWayArray[0].peakStartTime ||
                  _timeWayArray[0].peakEndTime
                ) {
                  bo12 = false;
                  return Promise.reject("请填写高峰时段起始时间");
                } else {
                  bo12 = true;
                }
              }


          }
        })
        .then(() => {
          let __timeWayArray = JSON.parse(
            JSON.stringify(formItem.peakTimeDetailsApiDtoList)
          );
          if (__timeWayArray.length > 1) {
            for (let k = 0; k < __timeWayArray.length; k++) {
              if (
                __timeWayArray[k].peakStartTime &&
                __timeWayArray[k].peakEndTime
              ) {
                let __start = __timeWayArray[k].peakStartTime;
                let __end = __timeWayArray[k].peakEndTime;
                for (let j = 0; j < __timeWayArray.length; j++) {
                  if (j > k) {
                    let __startNew = __timeWayArray[j].peakStartTime;
                    let __endNew = __timeWayArray[j].peakEndTime;
                    if (__startNew >= __end || __endNew <= __start) {
                      bol4 = true;
                    } else {
                      bol4 = false;
                      return Promise.reject("高峰时段时间存在交叉");
                    }
                  }
                }
              }
            }
          } else {
            bol4 = true;
          }
        })
        .then(() => {
          if (bo11) {
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              if (
                (item.intervalLvalue && item.intervalRvalue && item.dutyDays) ||
                (!item.intervalLvalue && !item.intervalRvalue && !item.dutyDays)
              ) {
                bol3 = true;
              } else {
                if (item.durationType == 1 || item.durationType == 2) {
                  bol3 = false;
                  return Promise.reject(
                    `${
                      item.durationType == 1 ? "旷工规则上线时长" : "高峰时长"
                    }信息请填写完整`
                  );
                }
              }
            }
          }

        })
        .then(() => {
          let list1 = formItem.dutyDurationGradientApiDtoList;
          let list2 = formItem.dutyDurationGradientApiDtoList2;
          if (list1.length >= 1) {
            for (let k = 0; k < list1.length; k++) {
              let __start = Number(list1[k].intervalLvalue);
              let __end = Number(list1[k].intervalRvalue);
              if (__start < __end) {
                for (let j = 0; j < list1.length; j++) {
                  if (j > k) {
                    let __startNew = Number(list1[j].intervalLvalue);
                    let __endNew = Number(list1[j].intervalRvalue);
                    if (__startNew >= __end || __endNew <= __start) {
                      bol3 = true;
                    } else {
                      bol3 = false;
                      return Promise.reject("旷工规则维护不正确");
                    }
                  }
                }
              } else {
                if (__start || (__end && __start == __end)) {
                  bol3 = false;
                  return Promise.reject("旷工规则维护不正确");
                }

              }
            }
          } else {
            if (
              ( Number(list1[0].intervalLvalue) || Number(list1[0].intervalRvalue)) &&
              Number(list1[0].intervalLvalue) == Number(list1[0].intervalRvalue)
            ) {
              bol3 = false;
              return Promise.reject("旷工规则维护不正确");
            }
          }
          if (list2.length >= 1) {
            for (let k = 0; k < list2.length; k++) {
              let __start = Number(list2[k].intervalLvalue);
              let __end = Number(list2[k].intervalRvalue);
              if (__start < __end) {
                for (let j = 0; j < list2.length; j++) {
                  if (j > k) {
                    let __startNew = Number(list2[j].intervalLvalue);
                    let __endNew = Number(list2[j].intervalRvalue);
                    if (__startNew >= __end || __endNew <= __start) {
                      bol3 = true;
                    } else {
                      bol3 = false;
                      return Promise.reject("旷工规则维护不正确");
                    }
                  }
                }
              } else {
                if (__start || (__end && __start == __end)) {
                  bol3 = false;
                  return Promise.reject("旷工规则维护不正确");
                }

              }
            }
          } else {
            if (
              (Number(list2[0].intervalLvalue) || Number(list2[0].intervalRvalue)) &&
              Number(list2[0].intervalLvalue) == Number(list2[0].intervalRvalue)
            ) {
              bol3 = false;
              this.$Message.warning("旷工规则维护不正确");
            }
          }
        })
        .then(() => {
          if (bo11 && bo12 && bol3 && bol4) {
            if (formItem.shiftStartTime < formItem.shiftEndTime) {
              if (
                formItem.cutTime == formItem.shiftEndTime ||
                formItem.cutTime == formItem.shiftStartTime ||
                formItem.cutTime > formItem.shiftEndTime ||
                formItem.cutTime < formItem.shiftStartTime
              ) {
              } else {
                return Promise.reject("切换时间点不能在排班时段内");
              }
            } else if( formItem.cutTime > formItem.shiftStartTime || formItem.cutTime < formItem.shiftEndTime){
              return Promise.reject("切换时间点不能在排班时段内");
            }
            let newArray = [];
            formItem.peakTimeDetailsApiDtoList.forEach(item => {
              if (item.peakEndTime && item.peakStartTime) {
                newArray.push({
                  peakEndTime: item.peakEndTime,
                  peakStartTime: item.peakStartTime
                });
              }
            });

            let data = {};
            data.shiftName = this.formItem.shiftName; // 排班名称
            data.cityCode = this.formItem.cityCode; // 城市code
            data.shiftType = this.shiftType; // 排班类型
            data.shiftUuid = formItem.shiftUuid
            data.effectiveTime = moment(
              new Date(this.formItem.effectiveTime)
            ).format("YYYY-MM-DD HH:mm:ss"); // 生效时间
            data.shiftRuleDetailsApiDtoList = [{}];
            data.shiftRuleDetailsApiDtoList[0]["shiftStartTime"] =
              formItem.shiftStartTime;
            data.shiftRuleDetailsApiDtoList[0]["shiftEndTime"] =
              formItem.shiftEndTime;
            data.shiftRuleDetailsApiDtoList[0]["cutTime"] = formItem.cutTime;
            data.shiftRuleDetailsApiDtoList[0]["driverTag"] =
              formItem.driverTag;
            data.shiftRuleDetailsApiDtoList[0].peakTimeDetailsApiDtoList = newArray;
            data.shiftRuleDetailsApiDtoList[0]["onlineDuration"] =
              formItem.onlineDuration;
            data.shiftRuleDetailsApiDtoList[0]["peakDuration"] =
              formItem.peakDuration;
            data.shiftRuleDetailsApiDtoList[0]["chargeDuration"] =
              formItem.chargeDuration;

            data.shiftRuleDetailsApiDtoList[0].dutyDurationGradientApiDtoList = list;
            if (this.ruleType == "A") {
              ruleAdd(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(res.data.msg);
                  this.$emit("submitChange");
                } else {
                  this.$Message.error(res.data.msg);
                }
              });
            } else {
              ruleEdit(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(res.data.msg);
                  this.$emit("submitChange");
                } else {
                  this.$Message.error(res.data.msg);
                }
              });
            }
          }
        })
        .catch(val => {
          this.$Message.warning(val);
        });
    },
    dualChange() {
      let rule1,
        rule2,
        rule3,
        rule4,
        rule6,
        rule5 = false;
      let formItem = this.formItem1;
      let dtoList = [];
      let promise = new Promise(function(resolve, reject) {
        resolve();
      });
      promise
        .then(() => {
          this.$refs.two.$refs.formValidate.validate(valid => {
            if (valid) {
              rule1 = true;
            } else {
              rule1 = false;
            }
          });
          let num2 = [];
          this.$refs.two.$refs.wrapRef.forEach((item, index) => {
            item.validate(valid => {
              num2.push(valid);
              if (num2.every(key => key)) {
                rule2 = true;
                this.borcolor2[index].value = false;
                this.borcolor2[index].cut = false;
              } else {
                rule2 = false;
                this.borcolor2[index].value = true;
                this.borcolor2[index].cut = true;
              }
            });
          });
          if(rule1 && rule2) {
          }else {
            this.$Message.warning("请检查规则项是否维护正确或完整");
          }
        })
        .then(() => {
          if (rule1 && rule2) {
            let data = JSON.parse(JSON.stringify(formItem.data));
            for (let i = 0; i < data.length; i++) {
              let _timeWayArray = JSON.parse(
                JSON.stringify(data[i].peakTimeDetailsApiDtoList)
              );

              //formItem.shiftStartTime 排班开始时间
              //formItem.shiftEndTime 排班结束
              //peakStartTime高峰开始   peakEndTime// 高峰结束
              // 需求，高峰时段必须在排班时段内
              let shiftStartTime = data[i].shiftStartTime;
              let shiftEndTime = data[i].shiftEndTime;
              // 排班时间和高峰时间同时存在判断
                if (
                  shiftStartTime &&
                  shiftEndTime &&
                  _timeWayArray[0].peakStartTime &&
                  _timeWayArray[0].peakEndTime
                ) {
                  for (
                    let j = 0, length = _timeWayArray.length;
                    j < length;
                    j++
                  ) {
                    let peakStartTime = _timeWayArray[j].peakStartTime;
                    let peakEndTime = _timeWayArray[j].peakEndTime;
                    // let peakStartTime高峰开始时间
                    // let shiftEndTime高峰开始时间
                    if (shiftStartTime >= shiftEndTime) {
                      // 开始时间大于结束时间存在跨天
                      if (
                        peakStartTime >= shiftStartTime &&
                        peakEndTime <= shiftEndTime
                      ) {
                        rule3 = true;
                      } else {
                        if (
                          peakStartTime <= shiftEndTime &&
                          peakEndTime <= shiftEndTime &&
                          peakStartTime < peakEndTime
                        ) {
                          rule3 = true;
                        } else if(peakStartTime >= shiftStartTime && peakStartTime >= shiftEndTime && peakEndTime >= shiftStartTime && peakEndTime >= shiftEndTime){
                          rule3 = true;
                        }else {
                          rule3 = false;
                          return Promise.reject(`班段规则${i + 1}：高峰时段必须在排班时间内`);
                        }
                      }
                    } else {
                      // 不跨天
                      if (
                        peakStartTime >= shiftStartTime &&
                        peakEndTime <= shiftEndTime &&
                        peakStartTime < peakEndTime
                      ) {
                        rule3 = true;
                      } else {
                          rule3 = false;
                          return Promise.reject( `班段规则${i + 1}：高峰时段必须在排班时间内`);
                      }
                    }
                  }
                } else {
                  // 如果高峰时段只填了一个
                  if (
                    _timeWayArray[0].peakStartTime ||
                    _timeWayArray[0].peakEndTime
                  ) {

                    rule3 = false;
                    return Promise.reject(  `班段规则${i + 1}：请填写高峰时段起始时间`);
                  } else {
                    rule3 = true;
                  }
                }

            }
          }
        })
        .then(() => {
          if(rule1 && rule2) {
            let list;
            for (let k = 0; k < formItem.data.length; k++) {
              list = formItem.data[k].dutyDurationGradientApiDtoList.concat(
                formItem.data[k].dutyDurationGradientApiDtoList2
              );
              for (let i = 0; i < list.length; i++) {
                if (
                  (list[i].intervalLvalue &&
                    list[i].intervalRvalue &&
                    list[i].dutyDays) ||
                  (!list[i].intervalLvalue &&
                    !list[i].intervalRvalue &&
                    !list[i].dutyDays)
                ) {
                  rule5 = true;
                } else {
                  if (list[i].durationType == 1 || list[i].durationType == 2) {
                    rule5 = false;
                    return Promise.reject( `班段规则${k + 1}的${
                        list[i].durationType == 1 ? "上时长" : "高峰时长"
                      }信息请填写完整`);
                  }
                }
              }
            }
          }

        }).then(() =>{
          if(rule1 && rule2) {
            for (let j = 0; j < formItem.data.length; j++) {
              let list1 = formItem.data[j].dutyDurationGradientApiDtoList;
              let list2 = formItem.data[j].dutyDurationGradientApiDtoList2;
              if (list1.length >= 1) {
                for (let k = 0; k < list1.length; k++) {
                  let __start = list1[k].intervalLvalue;
                  let __end = list1[k].intervalRvalue;
                  if (__start < __end) {
                    for (let j = 0; j < list1.length; j++) {
                      if (j > k) {
                        let __startNew = list1[j].intervalLvalue;
                        let __endNew = list1[j].intervalRvalue;
                        if (__startNew >= __end || __endNew <= __start) {
                          rule5 = true;
                        } else {
                          rule5 = false;
                          return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                        }
                      }
                    }
                  } else {
                    if (__start || (__end && __start == __end)) {
                      rule5 = false;
                      return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                    }
                  }
                }
              } else {
                if (
                  (list1[0].intervalLvalue || list1[0].intervalRvalue) &&
                  list1[0].intervalLvalue == list1[0].intervalRvalue
                ) {
                  rule5 = false;
                  return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                }
              }
              if (list2.length >= 1) {
                for (let k = 0; k < list2.length; k++) {
                  let __start = list2[k].intervalLvalue;
                  let __end = list2[k].intervalRvalue;
                  if (__start < __end) {
                    for (let j = 0; j < list2.length; j++) {
                      if (j > k) {
                        let __startNew = list2[j].intervalLvalue;
                        let __endNew = list2[j].intervalRvalue;
                        if (__startNew >= __end || __endNew <= __start) {
                          rule5 = true;
                        } else {
                          rule5 = false;
                          return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                        }
                      }
                    }
                  } else {
                    if (__start || (__end && __start == __end)) {
                      rule5 = false;
                      return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                    }
                  }
                }
              } else {
                if (
                  (list2[0].intervalLvalue || list2[0].intervalRvalue) &&
                  list2[0].intervalLvalue == list2[0].intervalRvalue
                ) {
                  rule5 = false;
                  return Promise.reject(`班段规则${j + 1}旷工规则维护不正确`);
                }
              }
            }
            }
        })
        .then(() => {
          if(rule1 && rule2) {
            for (let i = 0; i < formItem.data.length; i++) {
              let __timeWayArray = JSON.parse(
                JSON.stringify(formItem.data[i].peakTimeDetailsApiDtoList)
              );
              if (__timeWayArray.length > 1) {
                for (let k = 0; k < __timeWayArray.length; k++) {
                  if (
                    __timeWayArray[k].peakStartTime &&
                    __timeWayArray[k].peakEndTime
                  ) {
                    let __start = __timeWayArray[k].peakStartTime;
                    let __end = __timeWayArray[k].peakEndTime;
                    for (let j = 0; j < __timeWayArray.length; j++) {
                      if (j > k) {
                        let __startNew = __timeWayArray[j].peakStartTime;
                        let __endNew = __timeWayArray[j].peakEndTime;
                        if (__startNew >= __end || __endNew <= __start) {
                          rule4 = true;
                        } else {
                          rule4 = false;
                          return Promise.reject(`班段规则${i + 1}高峰时段时间存在交叉`);
                        }
                      }
                    }
                  }
                }
              } else {
                rule4 = true;
              }
              if (rule4) {
                let item = formItem.data[i];
                if (item.shiftStartTime < item.shiftEndTime) {
                  if (
                    item.cutTime == item.shiftEndTime ||
                    item.cutTime == item.shiftStartTime ||
                    item.cutTime > item.shiftEndTime ||
                    item.cutTime < item.shiftStartTime
                  ) {
                    rule6 = true;
                  } else {
                    rule6 = false;
                    return Promise.reject(`班段规则${i + 1}切换时间点不能在排班时段内`);
                  }
                } else {
                  if (
                    item.cutTime > item.shiftStartTime ||
                    item.cutTime < item.shiftEndTime
                  ) {
                    rule6 = false;
                    return Promise.reject( `班段规则${i + 1}切换时间点不能在排班时段内`);
                  }
                }
              }
            }
          }
        })
        .then(() => {



          for (let i = 0; i < formItem.data.length; i++) {
            let newArray = [];
            let item = formItem.data[i];
            formItem.data[i].peakTimeDetailsApiDtoList.forEach(res => {
              if (res.peakStartTime) {
                newArray.push({
                  peakStartTime: res.peakStartTime,
                  peakEndTime: res.peakEndTime
                });
              }
            });
            dtoList.push({
              ruleName: item.ruleName,
              driverTag: item.driverTag,
              shiftStartTime: item.shiftStartTime,
              shiftEndTime: item.shiftEndTime,
              changeStartTime: item.changeStartTime,
              changeEndTime: item.changeEndTime,
              cutTime: item.cutTime,
              onlineDuration: item.onlineDuration,
              peakDuration: item.peakDuration,
              chargeDuration: item.chargeDuration,
              dutyDurationGradientApiDtoList: item.dutyDurationGradientApiDtoList.concat(
                item.dutyDurationGradientApiDtoList2
              ),
              peakTimeDetailsApiDtoList: newArray
            });
          }
          if (rule1 && rule2 && rule3 && rule4 && rule5 && rule6) {
            //  shiftStartTime 排班时段开始
            //  shiftEndTime 排班时段开始
            //  changeStartTime 排班时段开始
            //  changeEndTime 排班时段开始
            // 规则1 换班时段开始时间>=排班时段结束时间 && 换班时段开始时间<=规则2的排班时段开始时间



            // if( !(formItem.data[0].changeStartTime >= formItem.data[0].shiftEndTime && formItem.data[0].changeStartTime <= formItem.data[1].shiftStartTime) ) {
            //   this.$Message.warning('班段规则1的换班时段开始时间选择不正确');
            //   return
            // }
            // // 换班时段结束时间>换班时段开始时间 && 换班时段结束时间<=规则2的排班时间开始时间
            // if( !(formItem.data[0].changeEndTime > formItem.data[0].changeStartTime && formItem.data[0].changeEndTime <= formItem.data[1].shiftStartTime) ) {
            //   this.$Message.warning('班段规则1的换班时段结束时间选择不正确');
            //   return
            // }
            // // 规则2 换班时段开始时间>=排班时段结束时间 && 换班时段开始时间<=规则1的排班时段开始时间
            // if(formItem.data[1].changeStartTime < formItem.data[1].changeEndTime) {
            //   if( !(formItem.data[1].changeStartTime >= formItem.data[1].shiftEndTime && formItem.data[1].changeStartTime <= formItem.data[0].shiftStartTime) ) {
            //     this.$Message.warning('班段规则2的换班时段开始时间选择不正确');
            //     return
            //   }

            //   if( !(formItem.data[1].changeEndTime > formItem.data[1].changeStartTime && formItem.data[1].changeEndTime <= formItem.data[0].shiftStartTime) ) {
            //     this.$Message.warning('班段规则2的换班时段结束时间选择不正确');
            //     return
            //   }
            // }else {
            //   if( !(formItem.data[1].changeStartTime >= formItem.data[1].shiftEndTime && formItem.data[1].changeStartTime >= formItem.data[0].shiftStartTime) ) {
            //     this.$Message.warning('班段规则2的换班时段开始时间选择不正确');
            //     return
            //   }
            //   if( !( (formItem.data[1].changeEndTime > formItem.data[1].changeStartTime || formItem.data[1].changeEndTime < formItem.data[0].shiftStartTime )) ) {
            //     this.$Message.warning('班段规则2的换班时段结束时间选择不正确');
            //     return
            //   }
            // }
            let data = {};
            data.shiftType = this.shiftType;
            data.shiftName = formItem.shiftName;
            data.cityCode = formItem.cityCode;
            data.effectiveTime = moment(
              new Date(formItem.effectiveTime)
            ).format("YYYY-MM-DD HH:mm:ss"); // 生效时间
            // data.changeStartTime = formItem.changeStartTime;
            // data.changeEndTime = formItem.changeEndTime;
            data.shiftUuid = formItem.shiftUuid;
            data.shiftRuleDetailsApiDtoList = dtoList;
            if (this.ruleType == "A") {
              ruleAdd(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(res.data.msg);
                  this.$emit("submitChange");
                } else {
                  this.$Message.error(res.data.msg);
                }
              });
            } else {
              ruleEdit(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(res.data.msg);
                  this.$emit("submitChange");
                } else {
                  this.$Message.error(res.data.msg);
                }
              });
            }
          }
        }).catch((val) =>{
          this.$Message.warning(val);
        })
    },
    closeChange() {
      if(this.ruleType != 'X') {
          this.$Modal.confirm({
          title: "确认取消？",
          onOk: () => {
            this.$emit("closeChange");
          }
        });
      }else {
         this.$emit("closeChange");
      }

    },
    //  校验
    verifyTimeChange(value) {
      if (value) {
        this.borcolor = false;
      } else {
        this.borcolor = true;
      }
    },
    //  自己画的校验框排班时段
    verifyTimeChange2(data, index,value) {
      if(value == 'value') {
        if (data) {
          this.borcolor2[index].cut = false;
        } else {
          this.borcolor2[index].cut = true;
        }
      }else {
        if (data) {
          this.borcolor2[index].cut = false;
        } else {
          this.borcolor2[index].cut = true;
        }
      }

    },
    getType(value) {
      if (this.types == value) {
        return;
      }
      this.types = value;
      this.newCity = false;
      if (value == 1) {
        this.formItem = {
          shiftType: 1,
          onlineDuration: null,
          peakDuration: null,
          chargeDuration: null,
          driverTag: "",
          shiftName: null,
          effectiveTime: null,
          shiftStartTime: null,
          cutTime: null,
          peakTimeDetailsApiDtoList: [
            {
              peakStartTime: "",
              peakEndTime: ""
            }
          ],
          dutyDurationGradientApiDtoList: [
            {
              durationType: 1,
              intervalLvalue: null,
              intervalRvalue: null,
              dutyDays: null
            }
          ],
          dutyDurationGradientApiDtoList2: [
            {
              durationType: 2,
              intervalLvalue: null,
              intervalRvalue: null,
              dutyDays: null
            }
          ]
        };
      } else {
        this.formItem1 = {
          shiftType: 2,
          data: [
            {
              peakTimeDetailsApiDtoList: [
                {
                  peakStartTime: "",
                  peakEndTime: ""
                }
              ],
              dutyDurationGradientApiDtoList: [
                {
                  durationType: 1,
                  intervalLvalue: null,
                  intervalRvalue: null,
                  dutyDays: null
                }
              ],
              dutyDurationGradientApiDtoList2: [
                {
                  durationType: 2,
                  intervalLvalue: null,
                  intervalRvalue: null,
                  dutyDays: null
                }
              ]
            },
            {
              peakTimeDetailsApiDtoList: [
                {
                  peakStartTime: "",
                  peakEndTime: "",
                  time: []
                }
              ],
              dutyDurationGradientApiDtoList: [
                {
                  durationType: 1,
                  intervalLvalue: null,
                  intervalRvalue: null,
                  dutyDays: null
                }
              ],
              dutyDurationGradientApiDtoList2: [
                {
                  durationType: 2,
                  intervalLvalue: null,
                  intervalRvalue: null,
                  dutyDays: null
                }
              ]
            }
          ]
        };
      }
    }
  }
};
</script>
<style lang="less">
.ivu-select-selection {
  background: none !important;
}
</style>
