<template>
  <div>
    <Form v-if="$parent.$parent.popDownwindDistanceVehicle"
          ref="formValidate"
          :model="params"
          :rules="ruleUser"
          :label-width="180"
    >
      <FormItem label="产品线:" prop="businessType">
        <div v-if="type === 'detail'">{{getProductName(params.businessType)}}</div>
        <Select v-else v-model="params.businessType" style="width:200px" placeholder="请选择产品线">
          <Option v-for="item in bizTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="策略:" prop="strategyType">
        <div v-if="type === 'detail'">{{checkStrategy}}</div>
        <Select v-else v-model="params.strategyType" placeholder="请选择策略" style="width:200px">
          <Option v-for="item in strategyTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="电子围栏:" prop="fenceUuid">
        <div v-if="type === 'detail'">{{checkelectronicFence}}</div>
        <Select v-else v-model="params.fenceUuid" style="width:200px" placeholder="请选择电子围栏">
          <Option v-for="item in electronicFence" :key="item.uuid" :value="item.uuid">{{item.name}}</Option>
        </Select>
      </FormItem>
      <Row v-if="params.strategyType === 1 || params.strategyType === 2">
        <FormItem label="子策略:" prop="subStrategyType">
          <div v-if="type === 'detail'">{{checksubStrategy}}</div>
          <Select v-else v-model="params.subStrategyType" style="width:200px" placeholder="请选择子策略">
            <Option v-for="item in subStrategyTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Row>
      <!-- todo -->
      <FormItem label="订单筛选条件:" :label-width="180" prop="orderFilterType">
        <CheckboxGroup v-model="params.orderFilterType" style="width:200px">
          <Checkbox :label="0">出发地</Checkbox>
          <Checkbox :label="1">途径地</Checkbox>
          <Checkbox :label="2">目的地</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <!-- 新增需求星期添加 -->
      <FormItem
        label="重复机制:"
        prop="strategy"
        :label-width="180"
      >
        <div style="display: flex" class="topTo10">
          <div class="xq-title">
            <div
              v-for="({ circulateTimes,isChecked }, index) in params.strategy"
              :key="
                circulateTimes.map(v => weekMap[v]).join('、')
              "
              class="xq-primary"
              :class="[isChecked ? 'xq-item-checked' : 'xq-item']"
              @click="checkedWeek(index)"
            >
              {{circulateTimes.map(v => weekMap[v]).join("、")}}
              <Icon
                v-if="type !== 'detail'"
                type="md-close-circle"
                class="closeIcon"
                size="18"
                @click.stop="deleteWeek(index)"
              />
            </div>
          </div>
          <div v-if="type !== 'detail'" class="xq-content">
            <Button
              :disabled="isCheckedAllWeek()"
              type="info"
              :ghost="true"
              style="margin-right: 5px; margin-left: 5px"
              @click="initCheckedWeek(1, 'checkedWeek')"
            >
              添加重复机制
            </Button>
            <Button
              v-show="
                params.strategy && params.strategy.length > 0
              "
              type="success"
              :ghost="true"
              @click="initCheckedWeek(2, 'checkedWeek')"
            >
              编辑重复机制
            </Button>
          </div>
        </div>
      </FormItem>

      <div
        v-for="({ circulateTimes,isChecked,timeConf }, index) in params.strategy"
        v-show="isChecked"
        :key="circulateTimes.map((v) => weekMap[v]).join('、')"
        class="timeDiv"
      >
        <Form
          v-for="(yItem, yIndex) in timeConf"
          :ref="'timeForm_' + index + '_' + yIndex"
          :key="yIndex"
          :model="yItem"
          :label-width="180"
          label-position="right"
          :rules="periodValidate"
        >
          <Row>
            <Col span="12">
              <FormItem
                :label="'时段' + (yIndex + 1) + '：'"
                prop="periods"
              >
                <div v-if="type !== 'detail'" style="display: flex">
                  <TimePicker
                    v-model="yItem.periods"
                    confirm
                    type="timerange"
                    :editable="false"
                    placement="bottom-end"
                    placeholder="请选择时间段"
                    style="width: 168px"
                  ></TimePicker>
                  <div
                    v-if="type !== 'detail' && yIndex > 0"
                    class="delete_icon"
                    style="margin-left: 5px"
                    @click="deleteTime(index, yIndex)"
                  >
                    <Icon type="ios-remove-circle-outline" />
                  </div>
                </div>
                <div v-else>
                  {{yItem.periods.join(" - ")}}
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div>
          <Button
            v-if="fromSource !== 3"
            type="info"
            :ghost="true"
            @click="addTime(index)"
          >
            新增时段
          </Button>
        </div>
      </div>

    </Form>
    <div class="popView-footer-wrap">
      <Button v-if="type !== 'detail'" size="large" type="text" style="margin-right: 8px;" @click="commit(0)">取消</Button>
      <Button v-if="type === 'detail'" size="large" type="primary" @click="commit(0)">确定</Button>
      <Button v-else size="large" type="primary" @click="commit(1)">确定</Button>
    </div>
    <checked-week ref="checkedWeek" @getWeekData="getWeekData" />
  </div>
</template>
<script>
import {
  addVehicleStrategy,
  editVehicleStrategy,
  selectNewPen
} from "_g/api/openCity"
import { mapState, mapGetters } from "vuex";
import {
  getPeriods,
  validatorTimeDetail
} from "./fields";
import checkedWeek from "./cheek-work-days.vue";
// 星期转换
const weekMap = {
  1: "工作日",
  2: "节假日",
}
export default {
  components: {
    checkedWeek,
  },
  props: {
    parentParams: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default() {
        return {}
      }
    },
    type: {
      type: String,
      // 对象或数组默认值必须从一个工厂函数获取
      default() {
        return ""
      }
    }
  },
  data() {
    const strategyType = (rule, value, callback) => {
      if (!value) callback(new Error("策略不能为空"))
      else callback()
    }
    const fenceUuid = (rule, value, callback) => {
      if (!value) callback(new Error("电子围栏不能为空"))
      else callback()
    }
    const subStrategyType = (rule, value, callback) => {
      if (!value) callback(new Error("子策略不能为空"))
      else callback()
    }
    const orderFilterTypeCheck = (rule, value, callback) => {
      if (value.length === 0) callback(new Error("订单筛选条件不能为空"))
      else callback()
    }
    const strategyCheck = (rule, value, callback) => {
      if (value.length === 0) callback(new Error("重复机制不能为空"))
      else callback()
    }
    return {
      fromSource: 1,
      weekMap, // 星期
      strategyTypeList: [{
        value: 1,
        label: "允许异地车辆接城市范围内订单"
      }, {
        value: 2,
        label: "允许异地车辆接城市范围内划定区域订单"
      }, {
        value: 3,
        label: "不允许异地车辆接城市范围内订单"
      }], // 策略下拉
      subStrategyTypeList: [{
        value: 1,
        label: "异地车辆只允许接目的地为其归属地订单"
      }],
      electronicFence: [], // 电子围栏数据
      uuid: null, // 详情标识
      // initParams: {
      //   businessType: null,
      //   cityUuid: null,
      //   offSiteVehicleDto: null,
      //   orderFilterType: [], // 订单筛选条件
      //   strategy: [], // 重复机制
      // },
      addViewStatus: false, // true：新增  false：详情
      params: {
        businessType: null,
        strategyType: null,
        fenceUuid: null,
        subStrategyType: null,
        orderFilterType: [], // 订单筛选条件
        strategy: [], // 重复机制
      },
      ruleUser: {
        businessType: [{
          required: true,
          message: "请选择产品线"
        }],
        strategyType: [{
          required: true, validator: strategyType, trigger: "change"
        }],
        fenceUuid: [{
          required: true, validator: fenceUuid, trigger: "change"
        }],
        subStrategyType: [{
          required: true, validator: subStrategyType, trigger: "change"
        }],
        orderFilterType: [{
          required: true, validator: orderFilterTypeCheck, trigger: "change"
        }],
        strategy: [{
          required: true, validator: strategyCheck, trigger: "change"
        }],
      },
      checkStrategy: "", // 详情默认
      checkelectronicFence: "",
      checksubStrategy: "",
      // 新增判断条件
      currentEditWeekIndex: 0, // 当前星期的索引
      // 当前对星期的操作
      handleWeek: 1, // 1:新增  2:编辑
      periodValidate: {
        periods: [
          {
            required: true,
            validator: validatorTimeDetail,
          },
        ],
      },

    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
  },
  mounted() {
    this.getElectronicFenceList()
    this.init()
  },
  methods: {
    init() {
      // this.initParams.cityUuid = this.$route.query.cityUuid || ""
    },
    goDetail(data) { // 获取详情
      this.params.businessType = data.businessType
      this.params.strategyType = data && data.offSiteVehicleDto && data.offSiteVehicleDto.strategyType
      this.params.fenceUuid = data && data.offSiteVehicleDto && data.offSiteVehicleDto.fenceUuid
      this.params.subStrategyType = data && data.offSiteVehicleDto && data.offSiteVehicleDto.subStrategyType
      this.uuid = data.uuid
      this.strategyTypeList.forEach(val => { // 处理详情
        if (val.value === this.params.strategyType) {
          this.checkStrategy = val.label
        }
      })
      this.electronicFence.forEach(val => {
        if (val.uuid === this.params.fenceUuid) {
          this.checkelectronicFence = val.name
        }
      })
      this.subStrategyTypeList.forEach(val => {
        if (val.value === this.params.subStrategyType) {
          this.checksubStrategy = val.label
        }
      })
      // 处理新增字段
      this.params.orderFilterType = data && data.offSiteVehicleDto && data.offSiteVehicleDto.orderFilterType || [];
      // 转化 strategy 为页面展示内容
      this.params.strategy = data && data.offSiteVehicleDto && data.offSiteVehicleDto.strategy.map(({ week, timeConf }, index) => {
        const timeConfNew = timeConf.map(({ startTime, stopTime }) => {
          return {
            periods: [startTime, stopTime],
          };
        });
        const i = {
          circulateTimes: week,
          timeConf: timeConfNew,
          isChecked: index === 0 ? true : false,
        };
        return i;
      }) || [];

    },
    getElectronicFenceList() { // 获取电子围栏数据
      const params = { cityCode: null, railType: null, status: 1, railType: 17 }
      // 获取表格数据
      if (this.$route.query.cityId) params.cityCode = this.$route.query.cityId
      selectNewPen(params).then(res => {
        this.electronicFence = res.data.data || []
        this.$store.commit("changeLoadingFlag", false)
      })
    },
    // 整合规则中的数据变为提交时的格式
    formatStrategy(strategy) {
      const list = strategy.map(({ circulateTimes, timeConf }) => {
        const timeConfNew = timeConf.map(({ periods }) => {
          return {
            startTime: periods[0],
            stopTime: periods[1],
          };
        });
        const i = {
          week: circulateTimes,
          timeConf: timeConfNew,
        };
        return i;
      });
      return list || []
    },
    // 整合offSiteVehicleDto 对象
    hasSub() {
      let { strategyType, fenceUuid, subStrategyType, orderFilterType, strategy } = this.params;
      const obj = {
        strategyType,
        fenceUuid,
        subStrategyType,
        orderFilterType,
        strategy: this.formatStrategy(JSON.parse(JSON.stringify(strategy)))
      }
      if (!subStrategyType) {
        delete obj.subStrategyType
      }
      return obj
    },
    // 接口提交
    submit() {
      let { businessType } = this.params;
      const params = {
        businessType,
        cityUuid: this.$route.query.cityUuid || "",
        offSiteVehicleDto: this.hasSub(),
      }
      if (this.type === "add") {
        addVehicleStrategy(params).then(res => {
          this.$Message.success("添加成功")
          // 新增运营商成功之后，刷新机构
          this.$emit("input", false)
          this.$emit("on-confirm")
        })
      } else if (this.type === "edit") {
        params.uuid = this.uuid
        editVehicleStrategy(params).then(res => {
          this.$Message.success("修改成功")
          this.$emit("input", false)
          this.$emit("on-confirm")
        })
      }
    },
    // 检测时段是否相交
    validateRangeJoin() {
      // 校验
      let contentList = JSON.parse(JSON.stringify(this.params.strategy));
      let info = {
        flag: true,
        index_1: null,
      };
      let flagOver = true;
      contentList.forEach(({ timeConf }, index) => {
        if (!flagOver) {
          return Promise.resolve(info);
        }
        timeConf && timeConf.forEach(({ periods }, index2) => {
          if (!flagOver) {
            return Promise.resolve(info);
          }
          if (timeConf.length > 1) {
            const times = timeConf.map(({ periods }) => {
              return {
                min: parseInt(periods[0].split(":").join(), 10),
                max: parseInt(periods[1].split(":").join(), 10),
              };
            });

            times.forEach((itOne, indexOne) => {
              times.forEach((it, idx) => {
                if (idx > indexOne) {
                  if (
                    (it.min >= itOne.min && it.min < itOne.max) ||
                    (it.max > itOne.min && it.max <= itOne.max) ||
                    (it.min <= itOne.min && it.max >= itOne.max)
                  ) {
                    info = {
                      flag: false,
                      index_1: index,
                    };
                    flagOver = false;
                  }
                }
              });
            });
          }
        });
      });
      return Promise.resolve(info);
    },
    // 提交事件
    commit(temp) {
      if (temp) {
        // 校验时间端是否重合
        const promises = [];
        promises.push(this.$refs.formValidate.validate());
        for (let key in this.$refs) {
          if (key.indexOf("timeForm") > -1) {
            this.$refs[key].forEach(item => {
              promises.push(item.validate());
            });
          }
        }
        Promise.all(promises)
          .then(values => {
            if (!values.includes(false)) {
              this.validateRangeJoin().then((res) => {
                if (res.flag) {
                  this.submit();
                } else {
                  this.$Message.error({
                    content: `第${
                      res.index_1 + 1
                    }个重复机制时段有交叉`,
                    duration: 3,
                  });
                }
              });
            } else {
              console.log("校验失败");
            }
          })
          .catch((err) => {
            console.log("校验失败:", err);
          });

      } else {
        this.$emit("input", false)
      }
    },
    resetForm() {
      this.$refs && this.$refs.formValidate && this.$refs.formValidate.resetFields();
      // 表单重置
      for (let key in this.$refs) {
        if (key.indexOf("timeForm") > -1) {
          this.$refs[key].forEach((item) => {
            item.resetFields();
          });
        }
      }
      // this.$refs.timeFare0 && this.$refs.timeFare0[0] && this.$refs.timeFare0[0].resetFields();
      // this.$refs.tripFare0 && this.$refs.tripFare0[0] && this.$refs.tripFare0[0].resetFields();
      // this.initParams = {
      //   businessType: null,
      //   cityUuid: null,
      //   offSiteVehicleDto: null
      // },
      this.params = {
        strategyType: null,
        fenceUuid: null,
        subStrategyType: null,
        businessType: null,
        orderFilterType: [],
        strategy: [],
      }
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    // todo
    // 切换星期选中
    checkedWeek(_index) {
      // 保存切换的索引
      this.currentEditWeekIndex = _index;
      this.params.strategy.forEach((item, index) => {
        if (index === _index) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      });
    },

    // 删除星期值
    deleteWeek(_index) {
      this.params.strategy.splice(_index, 1);
    },

    // 判断是否已经选中了所有星期
    isCheckedAllWeek() {
      let arr = [];
      let max = 2;
      this.params.strategy && this.params.strategy.forEach((item, index) => {
        arr = [...arr, ...item.circulateTimes];
      });
      if (arr && arr.length === max) {
        return true;
      } else {
        return false;
      }
    },

    // 星期值新增/编辑   val  1：添加 2：编辑
    initCheckedWeek(val, refName) {
      let data = this.params.strategy;
      // 新增
      if (val === 1) {
        this.handleWeek = 1;
        this.$refs[refName].addWeek(data);
      }
      // 编辑
      else {
        this.handleWeek = 2;
        data.forEach((item, index) => {
          if (item.isChecked) {
            this.$refs[refName].getEditWeek({
              dataSource: data,
              currentData: item.circulateTimes,
              index: index,
            });
          }
        });
      }
    },

    // 获取星期数据
    getWeekData(val) {
      // index是当前星期的索引
      let index = this.currentEditWeekIndex;
      console.log(val);
      console.log("我要添加东西");
      let length = val.length;
      let handleWeek = this.handleWeek;
      let data = this.params.strategy;
      // 用于判断是新增还是编辑
      if (handleWeek === 1) {
        data.push({
          circulateTimes: val[length - 1].circulateTimes,
          isChecked: false,
          timeConf: [getPeriods(this)],
        });
        if (data.length === 1) {
          data[0].isChecked = true;
          // 校验下表单
          // this.$refs.subForm.validateField(
          //   "content." + index + ".strategyTimes"
          // );
        }
      } else if (handleWeek === 2) {
        const selectInfo = val.filter((item) => item.isChecked === true)[0];
        data[index].circulateTimes = selectInfo.circulateTimes;
        console.log(selectInfo);
      }
    },

    // 添加时段
    addTime(index) {
      const timeDtoList = this.params.strategy[index].timeConf;
      if (timeDtoList.length >= 50) {
        this.$Message.warning("最多可添加50个时段");
      } else {
        timeDtoList.push(getPeriods(this));
      }
    },
    // 删除时段
    deleteTime(index, yIndex) {
      const timeDtoList = this.params.strategy[index].timeConf;
      timeDtoList.splice(yIndex, 1);
    },
  }
}
</script>
<style lang='less' scoped>
 .delete_icon {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    /deep/ .ivu-icon {
      margin-right: -15px;
      font-size: 20px;
      color: red;
      font-weight: 600;
    }
}
.timeDiv {
  /deep/ .ivu-select-dropdown {
    left: 0 !important;
  }
  max-height: 450px;
  overflow: auto;
  min-height: 300px;
}
.xq-title {
  display: flex;
  margin-right: 30px;
  .xq-primary {
    text-align: center;
    line-height: 18px;
    padding: 7px;
    // color: #000000;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 4px;
    font-weight: bold;
    position: relative;
    padding-right: 28px;
    padding-left: 28px;
  }
  .xq-item-checked {
    color: #ffffff;
    background: #2d8cf0;
    border: none;
  }
  .xq-item {
    color: #000000;
    background: #ffffff;
    border: 1px solid #dcdee2;
  }
  .closeIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>