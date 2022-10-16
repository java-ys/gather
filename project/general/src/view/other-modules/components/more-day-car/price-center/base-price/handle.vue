<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="1100px"
    :z-index="999"
    :mask-closable="false"
  >
    <div class="title">
      基础信息
    </div>
    <Form
      ref="form1"
      :rules="formValidate1"
      :model="addData"
      :label-width="85"
      :inline="true"
    >
      <FormItem
        label="策略名称:"
        prop="strategyName"
      >
        <Input
          v-model="addData.strategyName"
          clearable="clearable"
          style="width: 150px"
          :maxlength="50"
          :disabled="isDetail"
        />
      </FormItem>
      <FormItem
        label="产品线:"
        prop="productLine"
      >
        <Select
          v-model="addData.productLine"
          clearable
          style="width: 150px"
          :disabled="isDetail"
        >
          <Option :value="4">
            快享
          </Option>
          <Option :value="2">
            专享
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="生效时间:"
        prop="effectiveTime"
      >
        <span v-if="isDetail">
          {{ addData.effectiveTime }}
        </span>
        <DatePicker
          v-else
          v-model="addData.effectiveTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placement="bottom-end"
          placeholder="请选择生效时间"
          style="width: 200px"
        ></DatePicker>
      </FormItem>
      <FormItem
        label="城市:"
        prop="cityCode"
      >
        <Select
          v-model="addData.cityCode"
          :disabled="isDetail"
          style="width: 150px"
          filterable
          clearable
        >
          <Option
            v-for="(value, key, index) in cityList"
            :key="key"
            :value="key"
          >
            {{ value }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="车型等级:"
        prop="vehicleLevel"
      >
        <Select
          v-model="addData.vehicleLevel"
          clearable
          style="width: 150px"
          :disabled="isDetail"
        >
          <Option
            v-if="addData.productLine===4"
            :value="1"
          >
            经济型
          </Option>
          <Option
            v-if="addData.productLine===2"
            :value="2"
          >
            舒适型
          </Option>
          <Option
            v-if="addData.productLine===2"
            :value="3"
          >
            行政型
          </Option>
          <Option
            v-if="addData.productLine===2"
            :value="4"
          >
            商务型
          </Option>
          <Option
            v-if="addData.productLine===2"
            :value="5"
          >
            尊贵型
          </Option>
          <Option
            v-if="addData.productLine===2"
            :value="9"
          >
            豪华型
          </Option>
        </Select>
      </FormItem>
    </Form>
    <div class="title">
      策略明细
    </div>
    <Checkbox
      v-model="addData.baseFare.isStartFares"
      :disabled="isDetail"
      style="margin-left: 50px"
    >
      起步费&nbsp;&nbsp;&nbsp;
    </Checkbox>
    <!-- 起步费 -->
    <Form
      v-for="(item, index) in addData.baseFare.startFares"
      v-if="addData.baseFare.isStartFares"
      :ref="'form2' + index"
      :key="'form2' + index"
      :model="item"
      :label-width="180"
      :inline="true"
      style="margin-left: 70px; margin-top: 20px"
      :rules="formValidate2"
    >
      <FormItem
        :label="'起步时段' + (index + 1) + ' ：'"
        prop="time"
        :label-width="100"
      >
        <TimePicker
          v-model="item.time"
          :disabled="isDetail"
          class="right30"
          :editable="false"
          type="timerange"
          placeholder="请选择时段"
          style="width: 168px"
        >
        </TimePicker>
      </FormItem>
      <FormItem
        :label="'起步费'"
        prop="startFare"
        :label-width="80"
      >
        <InputNumber
          v-model="item.startFare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
        <span class="lh-32">
          元
        </span>
      </FormItem>

      <FormItem
        :label="'起步里程'"
        prop="startTrip"
        :label-width="80"
      >
        <InputNumber
          v-model="item.startTrip"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem><span class="lh-32">
        公里
      </span>
      <FormItem
        :label="'起步时长'"
        prop="startDuration"
        :label-width="80"
      >
        <InputNumber
          v-model="item.startDuration"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem><span class="lh-32">
        分钟
      </span>
      <Icon
        v-if="addData.baseFare.startFares.length !== 1 && !isDetail"
        type="ios-remove-circle-outline"
        size="30"
        style="cursor: pointer"
        color="red"
        @click="deleteStart(index)"
      />
    </Form>
    <Button
      v-if="addData.baseFare.isStartFares && !isDetail"
      type="primary"
      size="small"
      class="add-style"
      style="margin-left: 80px"
      @click="addStartFares"
    >
      +添加起步时段
    </Button>
    <br />
    <!-- 最低消费1 -->
    <Checkbox
      v-model="addData.baseFare.isLow"
      :disabled="isDetail"
      style="margin-left: 50px; margin-top: 30px"
    >
      最低消费&nbsp;&nbsp;&nbsp;
    </Checkbox>
    <Form
      v-if="addData.baseFare.isLow"
      ref="form3"
      :model="addData.baseFare"
      :rules="formValidate3"
      :label-width="85"
      :inline="true"
      class="mt-20"
      style="margin-left: 30px"
    >
      <FormItem
        :label="'最低消费金额'"
        prop="lowestFare"
        :label-width="150"
      >
        <InputNumber
          v-model="addData.baseFare.lowestFare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
      <FormItem
        :label="'最低消费计算节点'"
        prop="lowestModel"
        :label-width="150"
      >
        <Select
          v-model="addData.baseFare.lowestModel"
          :disabled="isDetail"
          placeholder="请选择"
          style="width: 200px"
        >
          <Option :value="1">
            计算折扣矩阵前
          </Option>
          <Option :value="2">
            计算折扣矩阵后
          </Option>
        </Select>
      </FormItem>
    </Form>
    <!-- 里程时段 -->
    <Form
      v-for="(item, index) in addData.tripFares"
      :ref="'form4' + index"
      :key="'form4' + index"
      :model="item"
      :rules="formValidate4"
      :label-width="180"
      :inline="true"
      style="margin-left: 40px; margin-top: 20px"
    >
      <FormItem
        :label="'里程时段' + (index + 1) + ' ：'"
        prop="time"
        :label-width="100"
      >
        <TimePicker
          v-model="item.time"
          :disabled="isDetail"
          class="right30"
          :editable="false"
          type="timerange"
          placeholder="请选择时段"
          style="width: 168px"
        >
        </TimePicker>
      </FormItem>
      <FormItem
        :label="'里程费'"
        prop="fare"
        :label-width="80"
      >
        <InputNumber
          v-model="item.fare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
      <span class="lh-32">
        元/公里
      </span>
      <Icon
        v-if="addData.tripFares.length !== 1 && !isDetail"
        type="ios-remove-circle-outline"
        size="30"
        style="cursor: pointer"
        color="red"
        @click="deleteTripFares(index)"
      />
    </Form>
    <Button
      v-if="!isDetail"
      type="primary"
      size="small"
      class="add-style"
      @click="addTripFares"
    >
      +添加里程时段
    </Button>
    <!-- 时长时段 -->
    <Form
      v-for="(item, index) in addData.timeFares"
      :ref="'form5' + index"
      :key="'form5' + index"
      :model="item"
      :rules="formValidate5"
      :label-width="180"
      :inline="true"
      style="margin-left: 40px; margin-top: 20px"
    >
      <FormItem
        :label="'时长时段' + (index + 1) + ' ：'"
        prop="time"
        :label-width="100"
      >
        <TimePicker
          v-model="item.time"
          :disabled="isDetail"
          class="right30"
          :editable="false"
          type="timerange"
          placeholder="请选择时段"
          style="width: 168px"
        >
        </TimePicker>
      </FormItem>
      <FormItem
        :label="'时长费'"
        prop="fare"
        :label-width="80"
      >
        <InputNumber
          v-model="item.fare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
      <span class="lh-32">
        元/公里
      </span>
      <Icon
        v-if="addData.timeFares.length !== 1 && !isDetail"
        type="ios-remove-circle-outline"
        size="30"
        style="cursor: pointer"
        color="red"
        @click="deleteTimeFares(index)"
      />
    </Form>
    <Button
      v-if="!isDetail"
      type="primary"
      size="small"
      class="add-style"
      @click="addTimeFares"
    >
      +添加时长时段
    </Button>
    <br />

    <!-- 远途时段 -->
    <Form
      v-for="(item, index) in addData.longTripFares"
      :ref="'form9' + index"
      :key="'form9' + index"
      :model="item"
      :rules="formValidate9"
      :label-width="180"
      :inline="true"
      style="margin-left: 40px; margin-top: 20px"
    >
      <FormItem
        :label="'远途时段' + (index + 1) + ' ：'"
        prop="time"
        :label-width="100"
      >
        <TimePicker
          v-model="item.time"
          :disabled="isDetail"
          class="right30"
          :editable="false"
          type="timerange"
          placeholder="请选择时段"
          style="width: 168px"
        >
        </TimePicker>
        <Form
          v-for="(yItem, yIndex) in item.longTripFareDtos"
          :ref="'form10' + index + yIndex"
          :key="'form10' + index + yIndex"
          :model="yItem"
          :rules="formValidate10"
          :label-width="250"
          :inline="true"
          style="margin-left: 40px; margin-top: 20px"
          class="long-form"
        >
          <FormItem
            :label="'远途里程' + (yIndex + 1) + ' ：'"
            prop="longTrip"
            :label-width="100"
          >
            <InputNumber
              v-model="yItem.longTrip"
              :disabled="isDetail"
              :min="0"
              :max="999.99"
              placeholder="请输入"
            ></InputNumber>
            <span class="lh-32">
              公里
            </span>
          </FormItem>
          <FormItem
            :label="'远途费用'"
            prop="fare"
            :label-width="100"
          >
            <InputNumber
              v-model="yItem.fare"
              :disabled="isDetail"
              :min="0"
              :max="999.99"
              placeholder="请输入"
            ></InputNumber>
            <span class="lh-32">
              元/公里
            </span>
          </FormItem>
          <Icon
            v-if="item.longTripFareDtos.length !== 1 && !isDetail"
            type="ios-remove-circle-outline"
            size="30"
            style="cursor: pointer"
            color="red"
            @click="deleteLongLc(index, yIndex)"
          />
        </Form>
        <Button
          v-if="!isDetail"
          style="margin-top:25px"
          type="primary"
          size="small"
          class="add-style"
          @click="addLongLc(index)"
        >
          +添加远途里程
        </Button>
      </FormItem>

      <Icon
        v-if="addData.longTripFares.length !== 1 && !isDetail"
        type="ios-remove-circle-outline"
        size="30"
        style="cursor: pointer"
        color="red"
        @click="deleteLong(index)"
      />
    </Form>
    <Button
      v-if="!isDetail"
      type="primary"
      size="small"
      class="add-style"
      @click="addLong"
    >
      +添加远途时段
    </Button>
    <br />
    <!-- 超时等待费 -->
    <Checkbox
      v-model="addData.isOver"
      :disabled="isDetail"
      style="margin-left: 50px; margin-top: 30px"
    >
      超时等待费&nbsp;&nbsp;&nbsp;
    </Checkbox>
    <Form
      v-if="addData.isOver"
      ref="form6"
      :model="addData"
      :rules="formValidate6"
      :label-width="85"
      :inline="true"
      class="mt-20"
      style="margin-left: 10px"
    >
      <FormItem
        :label="'超时等待费'"
        prop="beyondTimeFare"
        :label-width="150"
      >
        <InputNumber
          v-model="addData.beyondTimeFare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
      <FormItem
        :label="'免费等待时长'"
        prop="freeWaitTime"
        :label-width="150"
      >
        <InputNumber
          v-model="addData.freeWaitTime"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
    </Form>
    <br />
    <!-- 夜间费 -->
    <Checkbox
      v-model="addData.isNight"
      :disabled="isDetail"
      style="margin-left: 50px; margin-top: 30px"
    >
      夜间费&nbsp;&nbsp;&nbsp;
    </Checkbox>
    <Form
      v-if="addData.isNight"
      ref="form7"
      :model="addData.nightFares[0]"
      :rules="formValidate7"
      :label-width="85"
      :inline="true"
      class="mt-20"
      style="margin-left: -10px"
    >
      <FormItem
        :label="'夜间费'"
        prop="fare"
        :label-width="150"
      >
        <InputNumber
          v-model="addData.nightFares[0].fare"
          :disabled="isDetail"
          :min="0"
          :max="999.99"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
      <FormItem
        :label="'夜间时段'"
        prop="time"
        :label-width="100"
      >
        <TimePicker
          v-model="addData.nightFares[0].time"
          :disabled="isDetail"
          class="right30"
          :editable="false"
          type="timerange"
          placeholder="请选择时段"
          style="width: 168px"
        >
        </TimePicker>
      </FormItem>
    </Form>
    <br />

    <!-- 信用金比例 -->
    <Checkbox
      v-model="addData.isCreditRate"
      :disabled="isDetail"
      style="margin-left: 50px; margin-top: 30px"
    >
      信用金比例
      请选择费用预估及预付款计算折扣后费用后按照信用金比例上浮&nbsp;&nbsp;&nbsp;
    </Checkbox>
    <Form
      v-if="addData.isCreditRate"
      ref="form8"
      :model="addData"
      :rules="formValidate8"
      :label-width="85"
      :inline="true"
      class="mt-20"
      style="margin-left: 50px"
    >
      <FormItem
        :label="'信用金比例（%）'"
        prop="creditRate"
        :label-width="150"
      >
        <InputNumber
          v-model="addData.creditRate"
          :disabled="isDetail"
          :min="0"
          :max="100"
          placeholder="请输入"
        ></InputNumber>
      </FormItem>
    </Form>
    <br />
    <div
      v-if="isDetail"
      slot="footer"
    >
      <Button @click="showModal = false">
        关闭
      </Button>
    </div>
    <div
      v-else
      slot="footer"
    >
      <Button @click="showModal = false">
        取消
      </Button>
      <Button
        v-lazy-click="saveData"
        type="primary"
      >
        保存
      </Button>
    </div>
  </Modal>
</template>

<script>
import { basicPricingAdd } from "_o/api/more-day-car";
import {
  addData,
  formValidate1,
  formValidate2,
  formValidate3,
  formValidate4,
  formValidate5,
  formValidate6,
  formValidate7,
  formValidate8,
  formValidate9,
  formValidate10,
} from "./fields.js";
export default {
  name: "base-price-handle",
  props: ["cityList"],
  data() {
    return {
      showModal: false,
      title: "新增策略",
      addData: JSON.parse(JSON.stringify(addData)),
      formValidate1,
      formValidate2,
      formValidate3,
      formValidate4,
      formValidate5,
      formValidate6,
      formValidate7,
      formValidate8,
      formValidate9,
      formValidate10,
      isDetail: false,
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.isDetail = false;
      this.resetForm();
      // 新增
      if (!val) {
        this.addData = JSON.parse(JSON.stringify(addData));
      }
      // 复制
      else {
        if (val.isDetail) {
          this.isDetail = true;
        }
        this.addData = JSON.parse(JSON.stringify(val));
        setTimeout(() => {
          // 处理时间格式
          if (
            this.addData.baseFare.startFares &&
            this.addData.baseFare.startFares.length > 0
          ) {
            this.$set(this.addData.baseFare, "isStartFares", true);
            this.addData.baseFare.startFares = this.addData.baseFare.startFares.map((item) => {
              item.time = [item.startTime, item.endTime];
              return item;
            });
          } else {
            this.addData.baseFare.startFares = [
              {
                startDuration: null,
                startTrip: null,
                startTime: "",
                endTime: "",
                startFare: null,
                time: [],
              },
            ];
          }
        }, 300);

        if (this.addData.baseFare.lowestFare) {
          this.$set(this.addData.baseFare, "isLow", true);
        }
        this.addData.tripFares = this.addData.tripFares.map((item) => {
          item.time = [item.startTime, item.endTime];
          return item;
        });
        this.addData.timeFares = this.addData.timeFares.map((item) => {
          item.time = [item.startTime, item.endTime];
          return item;
        });
        this.addData.longTripFares = this.addData.longTripFares.map((item) => {
          item.time = [item.startTime, item.endTime];
          return item;
        });
        this.addData.nightFares = this.addData.nightFares.map((item) => {
          item.time = [item.startTime, item.endTime];
          return item;
        });
        if (this.addData.beyondTimeFare) {
          this.$set(this.addData, "isOver", true);
        }
        if (this.addData.creditRate) {
          this.$set(this.addData, "isCreditRate", true);
        }
        if (this.addData.nightFares.length > 0) {
          this.$set(this.addData, "isNight", true);
        } else {
          this.addData.nightFares = [
            {
              fare: null,
              startTime: "",
              endTime: "",
              time: [],
            },
          ];
        }
      }
    },
    saveData() {
      let flag1 = true;
      let flag2 = true;
      let flag3 = true;
      let flag4 = true;
      let flag5 = true;
      let flag6 = true;
      let flag7 = true;
      let flag8 = true;
      let flag9 = true;
      let flag10 = true;
      // 基础信息
      this.$refs.form1
        .validate()
        .then((status) => {
          flag1 = status;
          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          // 起步费
          this.addData.baseFare.startFares.forEach((item, index) => {
            let key = "form2" + index;
            if (this.$refs[key][0]) {
              this.$refs[key][0].validate().then((status) => {
                if (!status) {
                  flag2 = false;
                }
              });
            }
          });
          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          if (this.$refs.form3) {
            // 最低消费
            this.$refs.form3.validate().then((status) => {
              flag3 = status;
            });
          }

          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          // 里程时段
          this.addData.tripFares.forEach((item, index) => {
            let key = "form4" + index;
            this.$refs[key][0].validate((status) => {
              if (!status) {
                flag4 = false;
              }
            });
          });
          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          // 时长时段
          this.addData.timeFares.forEach((item, index) => {
            let key = "form5" + index;
            this.$refs[key][0].validate().then((status) => {
              if (!status) {
                flag5 = false;
              }
            });
          });
          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          // 远途时段+远途里程
          this.addData.longTripFares.forEach((item, index) => {
            let key = "form9" + index;
            this.$refs[key][0].validate().then((status1) => {
              if (!status1) {
                flag9 = false;
              }
              item.longTripFareDtos.forEach((yItem, yIndex) => {
                let key2 = "form10" + index + yIndex;
                this.$refs[key2][0].validate().then((status2) => {
                  if (!status2) {
                    flag10 = false;
                  }
                });
              });
            });
          });
          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          if (this.$refs.form6) {
            // 超时等待费
            this.$refs.form6.validate((status) => {
              flag6 = status;
            });
          }

          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          if (this.$refs.form7) {
            // 夜间费
            this.$refs.form7.validate((status) => {
              flag7 = status;
            });
          }

          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          if (this.$refs.form8) {
            // 信用金比例
            this.$refs.form8.validate((status) => {
              flag8 = status;
            });
          }

          return new Promise((resolve) => {
            resolve();
          });
        })
        .then(() => {
          // console.log(1, flag1);
          // console.log(2, flag2);
          // console.log(3, flag3);
          // console.log(4, flag4);
          // console.log(5, flag5);
          // console.log(6, flag6);
          // console.log(7, flag7);
          // console.log(8, flag8);
          // console.log(9, flag9);
          // console.log(10, flag10);
          if (
            flag1 &&
            flag2 &&
            flag3 &&
            flag4 &&
            flag5 &&
            flag6 &&
            flag7 &&
            flag8 &&
            flag9 &&
            flag10
          ) {
            this.submit();
          }
        });
    },

    submit() {
      let params = JSON.parse(JSON.stringify(this.addData));
      // 处理时间格式
      params.baseFare.startFares = params.baseFare.startFares.map((item) => {
        item.startTime = item.time[0];
        item.endTime = item.time[1];
        return item;
      });
      params.longTripFares = params.longTripFares.map((item) => {
        item.startTime = item.time[0];
        item.endTime = item.time[1];
        return item;
      });
      params.nightFares = params.nightFares.map((item) => {
        item.startTime = item.time[0];
        item.endTime = item.time[1];
        return item;
      });
      params.tripFares = params.tripFares.map((item) => {
        item.startTime = item.time[0];
        item.endTime = item.time[1];
        return item;
      });
      params.timeFares = params.timeFares.map((item) => {
        item.startTime = item.time[0];
        item.endTime = item.time[1];
        return item;
      });
      params.cityName = this.cityList[params.cityCode];
      // 处理checkbox
      if (!params.baseFare.isStartFares) {
        delete params.baseFare.startFares;
      }
      if (!params.baseFare.isLow) {
        delete params.baseFare.lowestFare;
        delete params.baseFare.lowestModel;
      }
      if (!params.isOver) {
        delete params.beyondTimeFare;
        delete params.freeWaitTime;
      }
      if (!params.isNight) {
        delete params.nightFares;
      }
      if (!params.isCreditRate) {
        delete params.creditRate;
      }

      console.log("params", params);
      basicPricingAdd(params).then((res) => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    },
    // 新增起步费
    addStartFares() {
      this.addData.baseFare.startFares.push({
        startDuration: null,
        startTrip: null,
        startTime: "",
        endTime: "",
        startFare: null,
        time: [],
      });
    },
    // 删除起步费
    deleteStart(index) {
      this.addData.baseFare.startFares.splice(index, 1);
    },
    // 添加里程时段
    addTripFares() {
      this.addData.tripFares.push({
        fare: null,
        startTime: "",
        endTime: "",
        time: [],
      });
    },
    // 删除里程时段
    deleteTripFares(index) {
      this.addData.tripFares.splice(index, 1);
    },
    // 添加时长时段
    addTimeFares() {
      this.addData.timeFares.push({
        fare: null,
        startTime: "",
        endTime: "",
        time: [],
      });
    },
    // 删除时长时段
    deleteTimeFares(index) {
      this.addData.timeFares.splice(index, 1);
    },
    // 添加远途时段
    addLong() {
      this.addData.longTripFares.push({
        longTripFareDtos: [
          {
            fare: null,
            longTrip: null,
          },
        ],
        time: [],
        startTime: "",
        endTime: "",
      });
    },
    // 删除远途时段
    deleteLong(index) {
      this.addData.longTripFares.splice(index, 1);
    },
    addLongLc(index) {
      this.addData.longTripFares[index].longTripFareDtos.push({
        fare: null,
        longTrip: null,
      });
    },
    // 删除远途里程
    deleteLongLc(index, yIndex) {
      this.addData.longTripFares[index].longTripFareDtos.splice(yIndex, 1);
    },
    resetForm() {
      this.$refs.form1.resetFields();
      this.$refs.form20 &&
        this.$refs.form20[0] &&
        this.$refs.form20[0].resetFields();
      this.$refs.form3 && this.$refs.form3.resetFields();
      this.$refs.form40 &&
        this.$refs.form40[0] &&
        this.$refs.form40[0].resetFields();
      this.$refs.form50 &&
        this.$refs.form50[0] &&
        this.$refs.form50[0].resetFields();
      this.$refs.form6 && this.$refs.form6.resetFields();
      this.$refs.form7 && this.$refs.form7.resetFields();
      this.$refs.form8 && this.$refs.form8.resetFields();
      this.$refs.form90 &&
        this.$refs.form90[0] &&
        this.$refs.form90[0].resetFields();
      this.$refs.form1000 &&
        this.$refs.form1000[0] &&
        this.$refs.form1000[0].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
  position: relative;
  color: #000000;
  padding-left: 5px;
  margin-bottom: 15px;
  margin-left: 20px;
}
.title::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 20px;
  left: -10px;
  top: 1px;
  background: #2d8cf0;
}
.lh-32 {
  line-height: 32px;
}
.add-style {
  margin-left: 60px;
}
.mt-20 {
  margin-top: 20px;
}
.long-form {
}
/deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
  margin-left: 100px !important;
}
/deep/ .ivu-modal-wrap {
  z-index: 999;
}
</style>
