<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-08 13:47:08
 * @LastEditTime: 2021-12-02 10:07:59
 * @Description: 新增表单弹窗
-->
<template>
  <Form ref="priceForm" :model="formData" :label-width="120" :rules="formRules">
    <div class="form-item flex">
      <FormItem label="策略名称" prop="fareTypeNote">
        <Input
          v-model="formData.fareTypeNote"
          placeholder="请输入策略名称"
        ></Input>
      </FormItem>
      <FormItem label="所选城市" prop="provinceCityCode">
        <Cascader
          v-model="formData.provinceCityCode"
          :data="cityList"
          placeholder="请选择城市"
          trigger="hover"
          filterable
          style="width: 200px; display: inline-block"
        ></Cascader>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="业务线" prop="expandBizLine">
        <Select
          v-model="formData.expandBizLine"
          @on-change="handleChangeBusiness"
        >
          <Option
            v-for="(item, index) in businessList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="产品线" prop="businessType">
        <Select
          v-model="formData.businessType"
          @on-change="handleChangeProduct"
        >
          <Option
            v-for="item in productList"
            :key="item.bizType"
            :value="item.bizType"
          >
            {{item.bizTypeName}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="车型等级" prop="carLevels">
        <Select v-model="formData.carLevels" multiple>
          <Option
            v-for="item in carLevelList"
            :key="item.vehicleLevel"
            :value="item.vehicleLevel"
          >
            {{item.vehicleName}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="渠道" prop="source">
        <Select v-model="formData.source" filterable>
          <Option
            v-for="(item, index) in channelList"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>

      <FormItem label="订单类型" prop="typeTime">
        <Select v-model="formData.typeTime">
          <Option
            v-for="(item, index) in orderTypes"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="生效时间" prop="effectiveTime">
        <DatePicker
          v-model="formData.effectiveTime"
          :options="DatePickerOption"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder=""
          style="width: 200px"
        ></DatePicker>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="起步费">
        <Checkbox v-model="formData.startFareStatus">
          起步费
        </Checkbox>
      </FormItem>
    </div>
    <!-- 最低消费 -->
    <div v-if="formData.startFareStatus" class="form-item flex">
      <FormItem label="起步费(元)" prop="startFare">
        <InputNumber v-model="formData.startFare" :min="0"></InputNumber>
      </FormItem>
      <FormItem label="起步里程(公里)" prop="startTrip">
        <InputNumber v-model="formData.startTrip" :min="0"></InputNumber>
      </FormItem>
      <FormItem label="起步时长(分钟)" prop="startDuration">
        <InputNumber v-model="formData.startDuration" :min="0"></InputNumber>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem label="最低消费">
        <Checkbox v-model="formData.lowestFareStatus">
          最低消费
        </Checkbox>
      </FormItem>
    </div>
    <!-- 最低消费 -->
    <div v-if="formData.lowestFareStatus" class="form-item flex">
      <FormItem label="最低消费(元)">
        <InputNumber v-model="formData.lowestFare" :min="0"></InputNumber>
      </FormItem>
      <FormItem label="最低消费计算节点" :label-width="120">
        <Select v-model="formData.model">
          <Option
            v-for="(item, index) in calculateNodes"
            :key="index"
            :value="item.value"
          >
            {{item.label}}
          </Option>
        </Select>
      </FormItem>
    </div>
    <!-- 新增里程时段费 -->
    <div class="form-item flex column-box">
      <div class="column-title">里程时段</div>
      <div class="tip">
        <Icon type="ios-alert-outline" />时段必须组成完整的00:00:00至23:59:59
      </div>
    </div>
    <div>
      <div
        v-for="(item, index) in formData.tripFare"
        :key="index"
        class="form-item flex"
      >
        <FormItem
          label="里程时段"
          :prop="'tripFare.' + index + '.time'"
          :rules="{
            required: true,
            validator: tripValidate,
            trigger: 'change'
          }"
        >
          <TimePicker
            v-model="item.time"
            type="timerange"
            placement="bottom-end"
            placeholder="里程时段"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <FormItem
          label="里程费（元/公里）"
          :label-width="150"
          :prop="'tripFare.' + index + '.fare'"
          :rules="{
            type: 'number',
            required: true,
            message: '里程费不能为空',
            trigger: 'blur'
          }"
        >
          <InputNumber v-model="item.fare" :min="0"></InputNumber>
        </FormItem>
        <div class="delete-icon">
          <Icon
            v-if="index > 0"
            type="md-close-circle"
            size="24"
            @click="deletePricing(1, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addPricing(1)">新增里程时段费</Button>
    </FormItem>
    <!-- 新增时长时段费用 -->
    <div class="form-item flex column-box">
      <div class="column-title">时长时段</div>
      <div class="tip">
        <Icon type="ios-alert-outline" />时段必须组成完整的00:00:00至23:59:59
      </div>
    </div>
    <div>
      <div
        v-for="(item, index) in formData.timeFare"
        :key="index"
        class="form-item flex"
      >
        <FormItem
          label="时长时段"
          :prop="'timeFare.' + index + '.time'"
          :rules="{
            required: true,
            validator: timeValidate,
            trigger: 'change'
          }"
        >
          <TimePicker
            v-model="item.time"
            type="timerange"
            placement="bottom-end"
            placeholder="时长时段"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <FormItem
          label="时长费（元/分）"
          :label-width="150"
          :prop="'timeFare.' + index + '.fare'"
          :rules="{
            type: 'number',
            required: true,
            message: '时长费不能为空',
            trigger: 'blur'
          }"
        >
          <InputNumber v-model="item.fare" :min="0"></InputNumber>
        </FormItem>
        <div class="delete-icon">
          <Icon
            v-if="index > 0"
            type="md-close-circle"
            size="24"
            @click="deletePricing(2, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addPricing(2)">新增时长时段费用</Button>
    </FormItem>
    <!-- 最低消费end -->
    <!-- 远途分段 -->
    <div class="form-item flex column-box">
      <div class="column-title">远途分段</div>
    </div>
    <div>
      <div
        v-for="(item, index) in formData.longTripFareRuleDto
          .capacityRuleDetails"
        :key="index"
        class="form-item flex"
      >
        <FormItem
          label="分段起始"
          :prop="
            'longTripFareRuleDto.capacityRuleDetails.' +
              index +
              '.startCapacity'
          "
          :rules="{
            type: 'number',
            required: true,
            message: '分段起始不能为空',
            trigger: 'change'
          }"
        >
          <Select v-model="item.startCapacity">
            <Option
              v-for="(item, index) in startPriods"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="分段结束"
          :label-width="80"
          :prop="
            'longTripFareRuleDto.capacityRuleDetails.' + index + '.endCapacity'
          "
          :rules="{
            type: 'number',
            validator: distanceValide(item),
            trigger: 'change'
          }"
        >
          <Select v-model="item.endCapacity">
            <Option
              v-for="(item, index) in endPriods"
              :key="index"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="远途里程费（元/公里）"
          :label-width="150"
          :prop="
            'longTripFareRuleDto.capacityRuleDetails.' + index + '.unitPrice'
          "
          :rules="{
            type: 'number',
            required: true,
            message: '远途里程费不能为空',
            trigger: 'blur'
          }"
        >
          <InputNumber
            v-model="item.unitPrice"
            :min="0"
            style="width: 120px"
            placeholder="远途里程费"
          ></InputNumber>
        </FormItem>
        <div class="delete-icon">
          <Icon
            v-if="index > 0"
            type="md-close-circle"
            size="24"
            @click="deletePricing(3, index)"
          />
        </div>
      </div>
    </div>
    <FormItem>
      <Button type="primary" @click="addPricing(3)">新增分段</Button>
    </FormItem>
    <!-- 远途分段end -->
    <div class="form-item flex">
      <FormItem label="夜间费（元/公里）">
        <InputNumber
          v-model="formData.nightTripFare"
          :min="0"
          placeholder="夜间费"
        ></InputNumber>
      </FormItem>
      <FormItem
        label="附加费系数"
        :label-width="120"
        prop="thirdAdditionalRate"
      >
        <InputNumber
          v-model="formData.thirdAdditionalRate"
          :min="0"
          placeholder="附加费系数"
        ></InputNumber>
      </FormItem>
    </div>
    <div class="form-item flex">
      <FormItem
        label="免费等待时长（分钟）"
        :label-width="150"
        prop="freeWaitTime"
      >
        <InputNumber
          v-model="formData.freeWaitTime"
          :min="0"
          placeholder="免费等待时长"
          style="width: 120px"
        ></InputNumber>
      </FormItem>
      <FormItem
        label="超时等待费（元/分钟）"
        :label-width="150"
        prop="beyondWaitFare"
      >
        <InputNumber
          v-model="formData.beyondWaitFare"
          :min="0"
          placeholder="超时等待费"
          style="width: 120px"
        ></InputNumber>
      </FormItem>
    </div>

    <div class="form-item flex form-button">
      <Button type="primary" @click="handleSubmit">确定</Button>
      <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
    </div>
  </Form>
</template>

<script>
import { mapState } from "vuex";
import { createPricingStrategy } from "_o/api/airportPickUp.js";
import { ORDER_TYPES, CALCULATE_NODE, REMOTE_SEGMENT } from "../../nums";
import { effectiveTime } from "../../validate";
export default {
  props: {
    cityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tripValidate: (rule, value, callback) => {
        const [start, end] = value;
        if (!start && !end) {
          callback(new Error("时段不能为空"));
        }
        if (start === end) {
          callback(new Error("开始时段不能小于等于结束时段"));
        }
        // 判断是否有交叉
        const crossItem = this.formData.tripFare.find(v => {
          const firstValue = v.time[0] < value[0] && value[0] < v.time[1];
          const secondValue = v.time[0] < value[1] && value[1] < v.time[1];
          const cross = v.time[0] > value[0] && value[1] > v.time[0];
          return firstValue || secondValue || cross;
        }); // 字符串对比判断
        if (crossItem) {
          callback(new Error("时段不能交叉"));
        }
        callback();
      },
      timeValidate: (rule, value, callback) => {
        const [start, end] = value;
        if (!start && !end) {
          callback(new Error("时段不能为空"));
        }
        if (start === end) {
          callback(new Error("开始时段不能小于等于结束时段"));
        }
        // 判断是否有交叉
        const crossItem = this.formData.timeFare.find(v => {
          const firstValue = v.time[0] < value[0] && value[0] < v.time[1];
          const secondValue = v.time[0] < value[1] && value[1] < v.time[1];
          const cross = v.time[0] > value[0] && value[1] > v.time[0];
          return firstValue || secondValue || cross;
        }); // 字符串对比判断
        if (crossItem) {
          callback(new Error("时段不能交叉"));
        }
        callback();
      },
      distanceValide: item => (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error("分段结束不能为空"));
        }
        if (item.startCapacity === value) {
          callback(new Error("分段起始与结束不能一致"));
        }
        callback();
      },

      DatePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formRules: {
        fareTypeNote: [
          { required: true, message: "策略名称不能为空", trigger: "blur" }
        ],
        provinceCityCode: [
          {
            type: "array",
            required: true,
            message: "请选择城市",
            trigger: "change"
          }
        ],
        expandBizLine: [
          {
            type: "number",
            required: true,
            message: "请选择业务线",
            trigger: "change"
          }
        ],
        businessType: [
          {
            type: "number",
            required: true,
            message: "请选择产品线",
            trigger: "change"
          }
        ],
        carLevels: [
          {
            type: "array",
            required: true,
            message: "请选择车型等级",
            trigger: "change"
          }
        ],
        source: [
          {
            type: "number",
            required: true,
            message: "请选择渠道",
            trigger: "change"
          }
        ],
        typeTime: [
          {
            type: "number",
            required: true,
            message: "请选择订单类型",
            trigger: "change"
          }
        ],
        effectiveTime: [
          {
            type: "date",
            required: true,
            message: "生效时间不能为空",
            trigger: "change"
          },
          { validator: effectiveTime, trigger: "change" }
        ],
        freeWaitTime: [
          {
            type: "number",
            required: true,
            message: "免费等待时长不能为空",
            trigger: "blur"
          }
        ],
        startFare: [
          {
            type: "number",
            required: true,
            message: "起步费不能为空",
            trigger: "blur"
          }
        ],
        startTrip: [
          {
            type: "number",
            required: true,
            message: "起步里程不能为空",
            trigger: "blur"
          }
        ],
        startDuration: [
          {
            type: "number",
            required: true,
            message: "起步时长不能为空",
            trigger: "blur"
          }
        ]
      },
      formData: {
        fareTypeNote: "",
        provinceCityCode: [],
        expandBizLine: "",
        businessType: "",
        carLevels: [],
        source: "",
        typeTime: "",
        effectiveTime: "",
        startFareStatus: false, // 是否选择起步费
        startFare: null, // 起步费(元)
        startTrip: null, // 起步里程（公里）
        startDuration: null, // 起步时长（分钟）
        lowestFareStatus: false,
        lowestFare: null,
        model: null,
        nightTripFare: null,
        thirdAdditionalRate: null,
        freeWaitTime: null,
        beyondWaitFare: null,
        tripFare: [
          {
            // 里程时段费
            fare: null,
            time: []
          }
        ],
        timeFare: [
          {
            // 时长时段费
            fare: null,
            time: []
          }
        ],
        longTripFareRuleDto: {
          capacityRuleDetails: [
            {
              startCapacity: null,
              endCapacity: null,
              unitPrice: null
            }
          ]
        }
      },
      calculateNodes: CALCULATE_NODE,
      orderTypes: ORDER_TYPES,
      productList: [], // 产品线
      carLevelList: [] // 车型等级
    };
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel,
      businessGradeList: state => state.common.businessGradeList
    }),
    businessList() {
      // 业务线： 过滤接送机业务线
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9);
      return list;
    },
    startPriods() {
      const list = REMOTE_SEGMENT();
      return list;
    },
    endPriods() {
      const list = REMOTE_SEGMENT();
      return [
        ...list,
        {
          value: 10000,
          label: `100公里以上`
        }
      ];
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.priceForm.validate(valid => {
        if (valid) {
          // 判断时段是否满足完整的时间段
          const completeTrip = this.judgePeriod(this.formData.tripFare);
          const completeTime = this.judgePeriod(this.formData.timeFare);
          if (!completeTrip || !completeTime) {
            this.$Message.warning("时段必须组成完整的00:00:00至23:59:59");
            return false;
          }
          const completeDistancePeriod = this.judgeDistancePeriod(this.formData.longTripFareRuleDto.capacityRuleDetails);
          if (!completeDistancePeriod) {
            this.$Modal.confirm({
              title: "提示",
              content: `两个分段之间不能有间隔或者交叉<br>
                      分段结束最后一条是：及以上 <br>
                      请参考例子：30-40公里:40元，40公里及以上80元`
            });
            return false;
          }
          const [proviceCode, cityCode] = this.formData.provinceCityCode;
          this.formData.cityCode = cityCode;
          this.formData.proviceCode = proviceCode;
          this.handleCreate(this.formData);
        }
      });
    },
    // 创建保存
    async handleCreate(params) {
      this.$Spin.show();
      try {
        const res = await createPricingStrategy({ ...params });
        const { success, msg } = res.data;
        this.$Spin.hide();
        if (success) {
          this.$Message.success("保存成功");
          this.$emit("update");
          this.formData.startFareStatus = false;
          this.formData.lowestFareStatus = false;
          this.$refs.priceForm.resetFields();
        } else {
          this.$Message.error(msg);
        }
      } catch (error) {
        this.$Spin.hide();
      }
    },
    // 判断时段
    judgePeriod(list) {
      const set = new Set();
      for (let item of list) {
        item.time[0] && set.add(item.time[0]);
        item.time[1] && set.add(item.time[1]);
      }
      set.add("00:00:00");
      set.add("23:59:59");
      return set.size === list.length + 1;
    },
    // 判断分段
    judgeDistancePeriod(list) {
      const set = new Set();
      for (let item of list) {
        set.add(item.startCapacity);
        set.add(item.endCapacity);
      }
      set.add(10000); // 参考下拉复制，这个10000写死的
      return set.size === list.length + 1;
    },

    handleCancel() {
      this.$emit("close");
      this.formData.startFareStatus = false;
      this.formData.lowestFareStatus = false;
      this.$refs.priceForm.resetFields();
    },
    // 业务线下拉change
    handleChangeBusiness(val) {
      const business = this.businessList.find(v => v.value === val);
      this.$nextTick(() => {
        this.productList = business.children;
        // 清空数据
        this.formData.businessType = "";
        this.formData.carLevels = [];
        this.carLevelList = [];
      });
    },
    // 产品线下拉change
    handleChangeProduct(val) {
      const product = this.productList.find(v => v.bizType === val);
      this.$nextTick(() => {
        this.carLevelList = product.levels;
        // 清空数据
        this.formData.carLevels = [];
      });
    },
    deletePricing(type, index) {
      // 删除项
      switch (type) {
        case 1:
          // 里程
          this.formData.tripFare.splice(index, 1);
          break;
        case 2:
          // 时长
          this.formData.timeFare.splice(index, 1);
          break;
        case 3:
          // 分段
          this.formData.longTripFareRuleDto.capacityRuleDetails.splice(
            index,
            1
          );
          break;
        default:
          break;
      }
    },
    addPricing(type) {
      // 新增项
      const item = {
        // 里程时段费
        fare: null,
        time: []
      };
      switch (type) {
        case 1:
          // 里程
          this.formData.tripFare.push(item);
          break;
        case 2:
          // 时长
          this.formData.timeFare.push(item);
          break;
        case 3:
          // 分段
          if (
            this.formData.longTripFareRuleDto.capacityRuleDetails.length === 10
          ) {
            this.$Message.warning("远途分段最大只能10个分段");
            return false;
          }
          this.formData.longTripFareRuleDto.capacityRuleDetails.push({
            startCapacity: null,
            endCapacity: null,
            unitPrice: null
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.form-button {
  justify-content: flex-end;
  text-align: right;
}
.form-item {
  width: 100%;
  .ivu-form-item {
    flex: 1;
  }
  .delete-icon {
    width: 24px;
    height: 24px;
    margin-left: 16px;
    margin-bottom: 24px;
  }
  .add-button {
    margin-bottom: 24px;
  }
}
.column-box {
  margin-bottom: 24px;
  .column-title {
    border-left: 4px solid #2d8cf0;
    padding-left: 8px;
    font-size: 14px;
    font-weight: 700;
    margin-left: 24px;
  }
  .tip {
    display: flex;
    align-items: center;
    margin-left: 24px;
    color: #999999;
  }
}
</style>
