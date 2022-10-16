<template>
  <div>
    <Modal
      ref="addmodal"
      v-model="showModal"
      :title="isEdit ? '编辑服务检核工单' : '新增服务检核工单'"
      :width="1200"
      :mask-closable="false"
      :closable="false"
      footer-hide
    >
      <Form
        ref="_form"
        class="forms"
        :model="formData"
        :label-width="100"
        :rules="formsRules"
      >
        <FormItem label="城市" :label-width="120" prop="cityCodeList">
          <Select
            v-model="formData.cityCodeList"
            multiple
            filterable
            style="width: 260px"
            @on-change="onCityChange"
            @on-open-change="selectOpenChange"
          >
            <Option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="司机范围" :label-width="120">
          <Button
            :type="isLeague ? 'primary' : 'default'"
            class="mr-b"
            @click="switchRange(1)"
          >选择运营商</Button>
          <Button
            :type="isDriver ? 'primary' : 'default'"
            @click="switchRange(2)"
          >司机类型标签选择</Button>
        </FormItem>
        <!-- <div class="agent-list" v-if="isLeague">
          <CheckboxGroup v-model="formData.rangeValue">
            <Checkbox
              class="a-l"
              :key="it.agentUuid"
              :label="it.agentUuid"
              v-for="(it, ix) in agentList"
              >{{ it.agentName }}</Checkbox
            >
          </CheckboxGroup>
        </div> -->
        <div v-if="isLeague">
          <FormItem label="" :label-width="120" prop="">
            <Select
              v-model="formData.rangeValue"
              multiple
              filterable
              style="width: 260px"
            >
              <Option
                v-for="item in agentList"
                :key="item.agentUuid"
                :value="item.agentUuid"
              >{{item.agentName}}</Option>
            </Select>
          </FormItem>

        </div>
        <div v-if="isDriver">
          <FormItem label="" :label-width="120" prop="">
            <Checkbox-group v-model="formData.rangeValue">
              <Checkbox
                v-for="(item, index) in driverTypes"
                :key="index"
                :label="item.value"
              >{{item.label}}</Checkbox>
            </Checkbox-group>
          </FormItem>
        </div>
        <FormItem
          :label-width="120"
          label="检核分类"
          prop="categoryFourth"
        >
          <RadioGroup v-model="formData.categoryFourth">
            <Radio v-for="item in checkTypes" :key="item.uuid" :label="item.uuid">
              {{item.name}}
            </Radio>
          </RadioGroup>
          <Input v-model="className" placeholder="添加分类,最多输入25个字" :maxlength="25" style="width: 160px" /><Icon type="ios-add-circle" size="30" @click="onAddClass" />
        </FormItem>
        <FormItem
          :label-width="120"
          label="重复检核周期"
          prop="dayCount"
        >
          <InputNumber v-model="formData.dayCount" :min="1" :step="1" :precision="0"></InputNumber>
        </FormItem>
        <FormItem label="订单范围" :label-width="120" prop=""> </FormItem>
        <FormItem label="下单时段" :label-width="140" prop="timeRange">
          <TimePicker
            v-model="formData.timeRange"
            type="timerange"
            placeholder="选择时段"
            style="width: 168px"
            @on-clear="timeClear"
          ></TimePicker>
        </FormItem>
        <FormItem label="订单状态" :label-width="140" prop="">
          <Button type="primary" class="mr-b">完成订单</Button>
        </FormItem>
        <div>
          <FormItem label="" :label-width="140" prop="">
            <Checkbox v-model="formData.comEnable">启用</Checkbox>
          </FormItem>

          <FormItem label="订单时长" :label-width="190" prop="orderDuration">
            <Input
              v-model="formData.orderDuration"
              placeholder="时长h"
              style="width: 120px"
              type="number"
              class="no-arrow"
              @on-keyup="orderDurationChange"
            />
          </FormItem>
          <!-- <FormItem v-show="formData.comEnable" label="订单状态" :label-width="190" prop="orderState">
            <Checkbox-group
              v-model="formData.orderState"
            >
              <Checkbox
                :key="index"
                :label="item.value"
                v-for="(item, index) in orderStatus"
                >{{ item.label }}</Checkbox
              >
            </Checkbox-group>
          </FormItem> -->
          <FormItem label="订单状态" :label-width="190" prop="">
            <Checkbox-group v-model="formData.orderState">
              <Checkbox
                v-for="(item, index) in orderStatus"
                :key="index"
                :label="item.value"
              >{{item.label}}</Checkbox>
            </Checkbox-group>
          </FormItem>
          <FormItem label="星级评价" :label-width="190" prop="evaluate">
            <Checkbox-group v-model="formData.evaluate">
              <Checkbox
                v-for="(item, index) in levelList"
                :key="index"
                :label="item.value"
              >{{item.label}}</Checkbox>
            </Checkbox-group>
          </FormItem>
          <FormItem label="工单生成数量" :label-width="190" prop="">
            <span v-for="(item, index) in numsKeyList" :key="index" class="mr-s">{{item.label}}：
              <Input
                v-model="formData.completedOrder[item.value]"
                placeholder=""
                style="width: 80px"
                type="number"
                class="no-arrow"
              />
            </span>
          </FormItem>
        </div>
        <div>
          <FormItem label=" " :label-width="140" prop="">
            <Button type="primary">取消订单</Button>
          </FormItem>
          <FormItem label="" :label-width="140" prop="">
            <Checkbox v-model="formData.outEnable">启用</Checkbox>
          </FormItem>
          <FormItem label="取消方" :label-width="190" prop="cancelSide">
            <Checkbox-group v-model="formData.cancelSide">
              <Checkbox :label="0">乘客取消</Checkbox>
              <Checkbox :label="1">司机取消</Checkbox>
            </Checkbox-group>
          </FormItem>
          <FormItem label="取消类型" :label-width="190" prop="cancelType">
            <Checkbox-group v-model="formData.cancelType">
              <Checkbox
                v-for="(item, index) in cancelTypes"
                :key="index"
                :label="item.value"
              >{{item.label}}</Checkbox>
            </Checkbox-group>
          </FormItem>
          <FormItem label="取消原因" :label-width="190" prop="cancelReason">
            <Checkbox-group v-model="formData.cancelReason">
              <Checkbox
                v-for="(item, index) in cancelReasons"
                :key="index"
                :label="item.value"
              >{{item.label}}</Checkbox>
            </Checkbox-group>
          </FormItem>
          <FormItem label="工单生成数量" :label-width="190" prop="">
            <span v-for="(item, index) in numsKeyList" :key="index" class="mr-s">{{item.label}}：
              <Input
                v-model="formData.outstandingOrder[item.value]"
                placeholder=""
                type="number"
                class="no-arrow"
                style="width: 80px"
              />
            </span>
          </FormItem>
        </div>
      </Form>
      <p class="but-c">
        <Button class="mr-b" @click="onCancel">取消</Button><Button type="primary" @click="onSave">确定</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
import { fetchCityList } from "_o/api/work-order/work-order-config";
import { cityQueryAgentListService } from "_o/api/city-check";
import {
  hjAddService,
  hjUpdateService,
  postCheckType,
  queryCheckTypeList
} from "_o/api/work-order/serve-check.js";
import { tool } from "@/mixins/base";
import {
  driverTypes,
  cancelTypes,
  cancelReasons,
  orderStatus,
  levelList,
  freeze,
} from "./fields";
const numsKeyList = [
  { value: "monGenOrderNum", label: "周一" },
  { value: "tueGenOrderNum", label: "周二" },
  { value: "wedGenOrderNum", label: "周三" },
  { value: "thuGenOrderNum", label: "周四" },
  { value: "friGenOrderNum", label: "周五" },
  { value: "satGenOrderNum", label: "周六" },
  { value: "sunGenOrderNum", label: "周日" },
];
const numKeyList = numsKeyList.map((it) => it.value);

const _formData = {
  dayCount: null,
  cityCodeList: [],
  rangeType: 1, // 1 运营商 2 司机类型标签
  rangeValue: [],
  timeRange: [], // 下单时段
  // orderStartTime: "",
  // orderEndTime: "",
  completedOrder: {
    // 完成订单参数
    monGenOrderNum: "",
    tueGenOrderNum: "",
    wedGenOrderNum: "",
    thuGenOrderNum: "",
    friGenOrderNum: "",
    satGenOrderNum: "",
    sunGenOrderNum: "",
  },
  comEnable: false,
  orderDuration: "",
  orderState: [],
  evaluate: [],

  outstandingOrder: {
    // 取消订单参数
    monGenOrderNum: "",
    tueGenOrderNum: "",
    wedGenOrderNum: "",
    thuGenOrderNum: "",
    friGenOrderNum: "",
    satGenOrderNum: "",
    sunGenOrderNum: "",
  },
  outEnable: false,
  cancelSide: [],
  cancelType: [],
  cancelReason: [],
  categoryFourth: "J00011"
}

export default {
  name: "serve-check-com",
  mixins: [tool],
  props: ["detailData", "cityList"],
  data() {
    return {
      showModal: false,
      pageData: {},
      title: "新建服务检核工单",
      formDataCopy: JSON.parse(JSON.stringify(_formData)),
      formData: JSON.parse(JSON.stringify(_formData)),
      formsRules: freeze({
        cityCodeList: [
          {
            required: true,
            type: "array",
            message: "请选择出城市",
            trigger: "change",
          },
        ],
        timeRange: [
          {
            required: true,
            type: "array",
            message: "请设置下单时段",
            trigger: "change",
          },
        ],
        dayCount: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error("请填写重复检核周期"))
              }
            },
            trigger: "blur",
          }
        ]
      }),
      // cityList: [], // 城市列表
      agentList: [], // 运营商列表
      numsKeyList: freeze(numsKeyList),
      driverTypes: freeze(driverTypes),
      cancelTypes: freeze(cancelTypes),
      cancelReasons: freeze(cancelReasons),
      orderStatus: freeze(orderStatus),
      levelList: freeze(levelList),
      checkTypes: [],
      className: "",
    };
  },
  computed: {
    isLeague({ formData }) {
      return formData.rangeType - 1 === 0;
    },
    isDriver({ formData }) {
      return formData.rangeType - 2 === 0;
    },
    isEdit({ pageData }) {
      return !!pageData.id;
    },
  },
  watch: {
    detailData: function(val) {
      if (val) {
        this.getList()
      } else {
        this.formData = JSON.parse(JSON.stringify(_formData))
        this.pageData = this.formData
      }
    },
  },
  created() {
    this.driverTypes = driverTypes;
    this.getList();
    this.updateCheckTypes();
  },
  methods: {
    changeShowModal() {
      this.showModal = !this.showModal;
      if (!this.showModal) {
        this.formData = JSON.parse(JSON.stringify(_formData))
        this.$nextTick(() => {
          for (let item of this.$refs._form.fields) {
            if (item.prop === "cityCodeList" || item.prop === "dayCount") {
              item.resetField();
            }
          }
        })
      }
    },
    // 暂没有设置列表页, 所以获取列表第一条数据 作为配置的编辑数据
    getList() {
      // const [err, data] = await this.toResult(hjListService({}));
      // if (err || !data.length) {
      //   return;
      // }
      if (!this.detailData || !Object.keys(this.detailData).length) {
        return
      }
      this.pageData = this.detailData
      const {
        dayCount,
        cityCodeList,
        driverRange: { rangeType, rangeValue },
        orderState: {
          orderStartTime,
          orderEndTime,
          completedOrder,
          outstandingOrder,
        },
        categoryFourth
      } = this.pageData;
      this.formData.cityCodeList = cityCodeList;
      if (this.formData.cityCodeList.length) {
        this.getAgentListByCityCode();
      }
      this.formData.dayCount = dayCount;
      this.formData.categoryFourth = categoryFourth;
      this.formData.rangeValue = rangeValue;
      this.formData.rangeType = rangeType;
      this.formData.timeRange = [orderStartTime, orderEndTime];
      if (completedOrder) {
        this.formData.comEnable = completedOrder.enable;
        this.formData.orderDuration = completedOrder.orderDuration;
        this.formData.orderState = completedOrder.orderState;
        this.formData.evaluate = completedOrder.evaluate;
        numKeyList.forEach((k) => {
          this.formData.completedOrder[k] = completedOrder[k];
        });
      }
      if (outstandingOrder) {
        this.formData.outEnable = outstandingOrder.enable;
        this.formData.cancelSide = outstandingOrder.cancelSide;
        this.formData.cancelType = outstandingOrder.cancelType;
        this.formData.cancelReason = outstandingOrder.cancelReason;
        numKeyList.forEach((k) => {
          this.formData.outstandingOrder[k] = outstandingOrder[k];
        });
      }
    },
    onCancel() {
      this.changeShowModal()
      // this.$emit("update:showModal", false)
    },
    onSave() {
      this.$refs._form.validate(async (valid) => {
        if (!valid) return;
        const {
          cityCodeList,
          timeRange,
          rangeType,
          rangeValue,
          comEnable,
          outEnable,
          orderState,
          evaluate,
          orderDuration,
          completedOrder,
          outstandingOrder,
          cancelSide,
          cancelType,
          cancelReason,
          categoryFourth,
          dayCount
        } = this.formData;
        let p = {
          dayCount,
          cityCodeList,
          driverRange: {
            rangeType,
            rangeValue,
          },
          orderState: {
            orderStartTime: timeRange[0],
            orderEndTime: timeRange[1],
          },
        };
        // if (categoryFourth > 0) {
        p.categoryFourth = categoryFourth
        // }
        if (comEnable) {
          p.orderState.completedOrder = {
            enable: comEnable,
            orderDuration,
            orderState,
            evaluate,
            ...completedOrder,
          };
        }
        if (outEnable) {
          p.orderState.outstandingOrder = {
            enable: outEnable,
            cancelSide,
            cancelType,
            cancelReason,
            ...outstandingOrder,
          };
        }
        if (!this.validParams(p)) {
          return;
        }
        // return;
        let func = hjAddService;
        let msg = "新增成功";
        if (this.isEdit) {
          func = hjUpdateService;
          p.id = this.pageData.id;
          msg = "编辑成功";
        }
        const [err, data] = await this.toResult(func(p));
        if (err) {
          return;
        }
        this.$Message.success(msg);
        this.$emit("update-list")
        this.changeShowModal()
      });
    },
    validParams(p) {
      const { comEnable, outEnable } = this.formData;
      if (!comEnable && !outEnable) {
        this.$Message.error("请启用订单状态");
        return;
      }
      if (comEnable) {
        let {
          completedOrder: { orderState, orderDuration },
        } = p.orderState;
        if (!orderDuration) {
          this.$Message.error("请输入订单时长");
          return;
        }
        if (!orderState.length) {
          this.$Message.error("请设置订单状态");
          return;
        }
        if (numKeyList.some((k) => !p.orderState.completedOrder[k])) {
          this.$Message.error("请填写完成订单的工单生成数量");
          return;
        }
      }
      if (outEnable) {
        let {
          outstandingOrder: { cancelType, cancelSide, cancelReason },
        } = p.orderState;
        if (!cancelSide.length) {
          this.$Message.error("请选择取消方");
          return;
        }
        if (!cancelType.length) {
          this.$Message.error("请选择取消类型");
          return;
        }
        if (!cancelReason.length) {
          this.$Message.error("请选择取消原因");
          return;
        }
        if (numKeyList.some((k) => !p.orderState.outstandingOrder[k])) {
          this.$Message.error("请填写取消订单的工单生成数量");
          return;
        }
      }

      return true;
    },
    timeClear() {
      this.formData.timeRange = []
    },
    switchRange(v) {
      if (v - this.formData.rangeType !== 0) {
        this.formData.rangeValue = [];
        this.formData.rangeType = v;
      }
    },
    onCityChange(v) {
      const idx = v.indexOf("100000");
      if (idx === -1) return;
      if (v[v.length - 1] === "100000") {
        this.formData.cityCodeList = ["100000"];
      } else {
        let arr = v.slice();
        arr.splice(idx, 1);
        this.formData.cityCodeList = arr;
      }
    },
    selectOpenChange(b) {
      // 下拉框关闭的时候 获取运营商
      if (!b) {
        this.getAgentListByCityCode();
      }
    },
    async getCityList() {
      let param = {
        bizTypes: [1, 2, 4, 6, 7],
        showAllCity: 1
      }
      const [err, data] = await this.toResult(fetchCityList(param));
      if (err) {
        return;
      }

      let fAllIndex = data.findIndex(it => it.cityName === "全国")
      let list = data;
      if (fAllIndex > -1) {
        list = [...data.splice(fAllIndex, 1), ...data]; // 全国选项放在第一个
      }
      this.cityList = list.map(it => {
        return {
          label: it.cityName,
          value: it.cityCode
        }
      });
    },
    async getAgentListByCityCode() {
      const { cityCodeList } = this.formData
      let p = { cityCodeList };
      if (p.cityCodeList.length - 1 === 0 && p.cityCodeList[0] === "100000") {
        p.cityCodeList = []
      }
      const [err, data = []] = await this.toResult(cityQueryAgentListService(p));
      this.agentList = data;
    },
    orderDurationChange(ev) {
      let v = ev.target.value;
      if (`${v}`.includes(".")) {
        this.formData.orderDuration = (+v).toFixed(1);
      }
    },
    onAddClass() {
      postCheckType({
        appId: "520315b4d7524001a27a3bde5d052c51",
        name: this.className,
        classStatus: 1,
        level: 3,
        parentUuid: "J0001",
      }).then(() => {
        this.updateCheckTypes();
        this.className = "";
      }).catch(err => this.$Message.error(err.msg))
    },
    updateCheckTypes() {
      queryCheckTypeList({appId: "520315b4d7524001a27a3bde5d052c51", classStatus: 1, level: 3, parentUuid:"J0001"}).then(res => this.checkTypes = res||[]);
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.mr-b {
  margin-right: 8px;
}
.mr-s {
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 10px;
}
.but-c {
  margin-right: 20px;
  text-align: right;
}
.agent-list {
  margin-left: 160px;
  max-height: 160px;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>
