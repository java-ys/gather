<template>
  <div class="strategy-config">
    <Card class="strategy-card">
      <Form
        ref="configForm"
        class="top15"
        :model="config"
        :rules="ruleValidate"
        :label-width="150"
      >
        <div class="class-tit bottom30">
          策略配置{{ configIndex }}
          <Button
            v-if="!isDetail"
            type="primary"
            size="large"
            @click="deleteConfig"
            style="float: right"
            >删除</Button
          >
        </div>
        <div class="flex-box">
          <FormItem label="策略时间段：" prop="startTime">
            <Input
              v-if="isDetail"
              :value="config.startTime"
              class="width200"
              disabled
            />
            <Time-picker
              v-else
              v-model="config.startTime"
              format="HH:mm:ss"
              placeholder="开始时间"
              class="width200"
            ></Time-picker>
            ～
          </FormItem>
          <FormItem label="" prop="endTime" style="margin-left: -145px;">
            <Input
              v-if="isDetail"
              :value="config.endTime"
              class="width200"
              disabled
            />
            <Time-picker
              v-else
              v-model="config.endTime"
              format="HH:mm:ss"
              placeholder="结束时间"
              class="width200"
            ></Time-picker>
          </FormItem>
          <FormItem label="重复机制：" prop="workRestDayType" class="right50">
            <Input
              v-if="isDetail"
              :value="showWeek"
              style="width: 210px"
              disabled
            />
            <Select
              v-else
              v-model="config.workRestDayType"
              multiple
              placeholder="选择重复机制"
              style="width: 300px;"
            >
              <Option
                v-for="item in repetitionMechanisms"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="每车可拼位置：" prop="seats" class="right50">
            <Input
              v-if="isDetail"
              :value="config.seats"
              class="width200"
              disabled
            />
            <Select
              v-else
              v-model="config.seats"
              placeholder="选择每车可拼位置"
              class="width200"
              :clearable="true"
            >
              <Option
                v-for="item in carpoolPositions"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="拼车露出限制：" prop="exposedType">
            <Input
              v-if="isDetail"
              :value="carpoolShowMap[config.exposedType]"
              class="width200"
              disabled
            />
            <Select
              v-else
              v-model="config.exposedType"
              placeholder="选择露出限制"
              class="width200"
              :clearable="true"
            >
              <Option
                v-for="item in carpoolShowLimits"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            v-if="config.exposedType == 2"
            label="接起率小于等于"
            prop="acceptRatio"
            class="right15"
          >
            <Input
              v-if="isDetail"
              :value="config.acceptRatio"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.acceptRatio"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
            />
            <span>%</span>
          </FormItem>
          <FormItem
            v-if="config.exposedType == 3"
            label="拼成率大于等于"
            prop="successRatio"
            class="right15"
          >
            <Input
              v-if="isDetail"
              :value="config.successRatio"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.successRatio"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
            />
            <span>%</span>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="乘客定价折扣：" prop="carpoolFareType">
            <Input
              v-if="isDetail"
              :value="pricingDiscountMap[config.carpoolFareType]"
              class="width200"
              disabled
            />
            <Select
              v-else
              v-model="config.carpoolFareType"
              placeholder="选择定价折扣"
              class="width200"
              :clearable="true"
              @on-change=" v => carpoolFareTypeChange(v, 1)"
            >
              <Option
                v-for="item in pricingDiscounts"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            v-if="config.carpoolFareType > 0"
            :label="`拼成${config.carpoolSeatFares[0].seats}人位`"
            prop="oneDiscount"
          >
            <Input
              v-if="isDetail"
              :value="config.carpoolSeatFares[0].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.oneDiscount"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setOneDiscount(1)"
            />
            <span>%</span>
          </FormItem>
          <FormItem
            v-if="config.carpoolFareType > 0"
            :label="`拼成${config.carpoolSeatFares[1].seats}人位`"
            prop="twoDiscount"
            :label-width="100"
          >
            <Input
              v-if="isDetail"
              :value="config.carpoolSeatFares[1].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.twoDiscount"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setTwoDiscount(1)"
            />
            <span>%</span>
          </FormItem>
          <FormItem
            v-if="config.carpoolFareType - 2 === 0"
            label="未拼成"
            prop="noDiscount"
            :label-width="80"
          >
            <Input
              v-if="isDetail"
              :value="config.carpoolSeatFares[2].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.noDiscount"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setNoDiscount(1)"
            />
            <span>%</span>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="司机定价折扣：" prop="driverCarpoolFareType">
            <Input
              v-if="isDetail"
              :value="driverPricingDiscountMap[config.driverCarpoolFareType]"
              class="width200"
              disabled
            />
            <Select
              v-else
              v-model="config.driverCarpoolFareType"
              placeholder="选择定价折扣"
              class="width200"
              :clearable="true"
              @on-change="v =>carpoolFareTypeChange(v, 2)"
            >
              <Option
                v-for="item in driverPricingDiscounts"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            v-if="[81, 82].includes(+config.driverCarpoolFareType)"
            :label="`拼成${config.driverCarpoolSeatFares[0].seats}人位`"
            prop="oneDiscountDriver"
          >
            <Input
              v-if="isDetail"
              :value="config.driverCarpoolSeatFares[0].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.oneDiscountDriver"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setOneDiscount(2)"
            />
            <span>%</span>
          </FormItem>
          <FormItem
            v-if="[81, 82].includes(+config.driverCarpoolFareType)"
            :label="`拼成${config.driverCarpoolSeatFares[1].seats}人位`"
            prop="twoDiscountDriver"
            :label-width="100"
          >
            <Input
              v-if="isDetail"
              :value="config.driverCarpoolSeatFares[1].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.twoDiscountDriver"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setTwoDiscount(2)"
            />
            <span>%</span>
          </FormItem>
          <FormItem
            v-if="config.driverCarpoolFareType - 82 === 0"
            label="未拼成"
            prop="noDiscountDriver"
            :label-width="80"
          >
            <Input
              v-if="isDetail"
              :value="config.driverCarpoolSeatFares[2].discount"
              style="width: 100px;"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.noDiscountDriver"
              style="width: 100px;"
              :min="0"
              :max="100"
              placeholder="请输入"
              @on-change="setNoDiscount(2)"
            />
            <span>%</span>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem
            label="乘客侧拼单上限："
            prop="passengerCarpool"
            class="right50"
          >
            <Input
              v-if="isDetail"
              :value="config.passengerCarpool"
              class="width200"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.passengerCarpool"
              style="width: 200px;"
              :min="0"
              placeholder="请输入乘客侧拼单上限"
            />
          </FormItem>
          <FormItem
            label="司机侧拼单上限："
            prop="driverCarpool"
            class="right50"
          >
            <Input
              v-if="isDetail"
              :value="config.driverCarpool"
              class="width200"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.driverCarpool"
              style="width: 200px;"
              :min="0"
              placeholder="请输入司机侧拼单上限"
            />
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="拼车单里程上限：" prop="carpoolMile" class="right50">
            <Input
              v-if="isDetail"
              :value="config.carpoolMile"
              class="width200"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.carpoolMile"
              style="width: 200px;"
              :min="0"
              placeholder="请输入拼车单里程上限"
            />
            <span>Km</span>
          </FormItem>
          <FormItem label="订单冗余时长：" prop="redundancyTimes">
            <div style="display: flex">
              <Button
                v-if="!isDetail"
                type="primary"
                size="large"
                @click="openModel"
                style="height: 40px; margin-right: 50px;"
                >添加</Button
              >
              <div
                v-if="
                  config.redundancyTimes && config.redundancyTimes.length > 0
                "
                class="showOrderRedundancyTime"
                :class="{noEdit: isDetail}"
              >
                <div
                  class="singleRedundant"
                  v-for="(item, i) in config.redundancyTimes"
                  :key="i"
                >
                  <div class="text">
                    {{ item.startMile }}Km~{{ item.endMile }}Km，冗余时长{{
                      item.redundancyTime
                    }}Min
                  </div>
                  <Button
                    v-if="!isDetail"
                    type="primary"
                    size="large"
                    @click="deleteRedundant(i)"
                    style="margin-left: 5px"
                    >删除</Button
                  >
                </div>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="绕路系数上限：" prop="distanceRatio" class="right50">
            <Input
              v-if="isDetail"
              :value="config.distanceRatio"
              class="width200"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.distanceRatio"
              style="width: 200px;"
              :min="0"
              placeholder="请输入绕路系数上限"
            />
            <span style="color: #999999;">绕路系数=拼车后起终点里程/原起终点里程</span>
          </FormItem>
          <FormItem
            label="共乘里程占比下限："
            prop="commonMileRatio"
            class="right50"
          >
            <Input
              v-if="isDetail"
              :value="config.commonMileRatio"
              class="width200"
              disabled
            />
            <InputNumber
              v-else
              type="number"
              v-model="config.commonMileRatio"
              style="width: 200px;"
              :min="0"
              :max="1"
              placeholder="请输入共乘里程占比下限"
            />
            <span style="color: #999999;">共乘里程占比=拼车后共乘路线里程/所有起终点串联里程</span>
          </FormItem>
        </div>
        <!--<div class="flex-box">
          <FormItem
            label="司机无责等待时长："
            prop="freeWaitTime"
            class="right50"
          >
            <span v-if="isDetail" class="width200">{{
              config.freeWaitTime
            }}</span>
            <Input
              v-else
              v-model="config.freeWaitTime"
              class="width200"
              :maxlength="32"
              placeholder="请输入司机无责等待时长"
            />
          </FormItem>
        </div>-->
      </Form>
    </Card>
    <Modal
      v-model="showOrderRedundancyTime"
      title="添加订单冗余时长"
      @on-ok="addRedundant"
      @on-cancel="cancel"
      width="600"
    >
      <Form
        ref="redundantForm"
        class="top15"
        :model="orderRedundantTime"
        :label-width="90"
        :rules="popRuleValidate"
      >
        <div class="flex-box">
          <FormItem label="开始里程" prop="startMile">
            <InputNumber
              type="number"
              v-model="orderRedundantTime.startMile"
              style="width: 100px"
              :min="0"
              placeholder="请输入"
            />
            <span>Km</span>
          </FormItem>
          <div class="redundant-middle">~</div>
          <FormItem label="结束里程" prop="endMile">
            <InputNumber
              type="number"
              v-model="orderRedundantTime.endMile"
              style="width: 100px"
              :min="0"
              placeholder="请输入"
            />
            <span>Km (包含该数值)</span>
          </FormItem>
        </div>
        <div class="flex-box">
          <FormItem label="冗余时长：" prop="redundancyTime">
            <InputNumber
              type="number"
              v-model="orderRedundantTime.redundancyTime"
              style="width: 100px"
              :min="0"
              placeholder="请输入"
            />
            <span>Min</span>
          </FormItem>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {
  repetitionMechanisms,
  carpoolPositions,
  carpoolShowLimits,
  carpoolShowMap,
  repetitionMap,
  pricingDiscounts,
  pricingDiscountMap,
  ruleValidate,
  popRuleValidate, driverPricingDiscounts, driverPricingDiscountMap
} from "./fields";
export default {
  name: "strategyConfig",
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    configIndex: {
      type: Number,
      default: 1,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      repetitionMechanisms,
      carpoolPositions,
      carpoolShowLimits,
      carpoolShowMap,
      repetitionMap,
      pricingDiscounts,
      driverPricingDiscounts,
      pricingDiscountMap,
      driverPricingDiscountMap,
      showOrderRedundancyTime: false, // 订单冗余时长配置标识
      orderRedundantTime: {
        startMile: null,
        endMile: null,
        redundancyTime: null,
      }, // 订单冗余时长
    };
  },
  mounted() {},
  computed: {
    ruleValidate() {
      return this.isDetail ? null : ruleValidate;
    },
    popRuleValidate() {
      return this.isDetail ? null : popRuleValidate;
    },
    showWeek() {
      let weekVO = [];
      this.config.workRestDayType &&
        this.config.workRestDayType.forEach((w) => {
          weekVO.push(repetitionMap[w]);
        });
      return weekVO.join(",");
    },
  },
  methods: {
    /**
     * 设置1人位折扣
     * 1 乘客 2 司机
     */
    setOneDiscount(type) {
      if(type - 1 === 0) {
        this.config.carpoolSeatFares[0].discount =
          this.config.oneDiscount;
      } else if (type - 2 === 0) {
        this.config.driverCarpoolSeatFares[0].discount =
          this.config.oneDiscountDriver;
      }
    },
    /**
     * 设置2人位折扣
     * 1 乘客 2 司机
     */
    setTwoDiscount(type) {
      if(type - 1 === 0) {
        this.config.carpoolSeatFares[1].discount =
          this.config.twoDiscount;
      } else if (type -2 === 0) {
        this.config.driverCarpoolSeatFares[1].discount =
          this.config.twoDiscountDriver;
      }
    },
    // 乘客侧未拼成 1 乘客 2 司机
    setNoDiscount(type) {
      if(type - 1 === 0) {
        if(!this.config.carpoolSeatFares[2]) {
          this.config.carpoolSeatFares[2] = {}
          this.config.carpoolSeatFares[2].discount =
            this.config.noDiscount;
          this.config.carpoolSeatFares[2].seats = 0;
        } else {
          this.config.carpoolSeatFares[2].discount =
            this.config.noDiscount;
        }
      } else if (type - 2 === 0) {
        if(!this.config.driverCarpoolSeatFares[2]) {
          this.config.driverCarpoolSeatFares[2] = {}
          this.config.driverCarpoolSeatFares[2].discount =
            this.config.noDiscountDriver;
          this.config.driverCarpoolSeatFares[2].seats = 0;
        } else {
          this.config.driverCarpoolSeatFares[2].discount =
            this.config.noDiscountDriver;
        }
      }
    },
    /**
     * 表单校验
     */
    async validForm() {
      let configFormValid = await this.$refs["configForm"].validate();
      return configFormValid;
    },
    /**
     * 删除配置
     */
    deleteConfig() {
      this.$Modal.confirm({
        title: "删除提醒",
        content: `确认删除策略配置${this.configIndex}?`,
        onOk: () => {
          this.$emit("delete-config", this.configIndex);
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    /**
     * 打开订单冗余时长配置
     */
    openModel() {
      this.showOrderRedundancyTime = true;
    },
    /**
     * 校验冗余历里程是否有重叠
     */
    isHasRepeatMile(data = []) {
      if (data.length === 1) return false;
      const startMileArr = [];
      const endMileArr = [];
      data.map(function (item) {
        startMileArr.push(item.startMile);
        endMileArr.push(item.endMile);
      });
      const allStartMile = startMileArr.sort((a, b) => {
        return a - b;
      });
      const allEndMile = endMileArr.sort((a, b) => {
        return a - b;
      });
      let result = 0;
      for (let k = 1; k < allStartMile.length; k++) {
        if (allStartMile[k] < allEndMile[k - 1]) {
          result += 1;
        }
      }
      return result > 0;
    },
    /**
     * 添加订单冗余时长
     */
    async addRedundant() {
      let redundantFormValid = await this.$refs.redundantForm.validate();
      if (!redundantFormValid) return;
      // 判断里程是否存在重叠
      let redundancyTimes = JSON.parse(JSON.stringify(this.config.redundancyTimes));
      redundancyTimes.push(this.orderRedundantTime);
      if (this.isHasRepeatMile(redundancyTimes)) {
        this.$message.error("订单冗余时长里程有重叠");
        return;
      }
      if (!this.config.redundancyTimes) {
        this.config.redundancyTimes = [];
      }
      this.config.redundancyTimes.push(this.orderRedundantTime);
      this.orderRedundantTime = {
        startMile: null,
        endMile: null,
        redundancyTime: null,
      };
      // 单独校验订单冗余时长
      this.$refs['configForm'].validateField('redundancyTimes');
    },
    /**
     * 删除订单冗余时长
     */
    deleteRedundant(index) {
      if (this.config.redundancyTimes) {
        this.config.redundancyTimes.splice(index, 1);
      }
      // 单独校验订单冗余时长
      this.$refs['configForm'].validateField('redundancyTimes');
    },
    /**
     * 取消
     */
    cancel() {
      this.orderRedundantTime = {
        startMile: null,
        endMile: null,
        redundancyTime: null,
      };
    },
    carpoolFareTypeChange(v, type) {
      if(type - 1 === 0 && v - 2 !== 0) {
        this.config.noDiscount = null
      }
      if(type - 2 === 0 && v - 2 !== 0) {
        this.config.noDiscountDriver = null
      }
    }
  },
};
</script>
<style lang="less" scoped>
.strategy-config {
  margin-bottom: 20px;
  width: 100%;
  height: auto;

  .showOrderRedundancyTime {
    margin-left: 10px;
    width: 280px;
    height: auto;
    border: 1px solid #dcdee2;
    border-radius: 4px;

    .singleRedundant {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      .text {
        width: 200px;
        text-align: right;
      }
    }
  }

  .noEdit {
    background-color: #f3f3f3;
    color: #ccc;
  }
}
.redundant-middle {
  height: 32px;
  line-height: 32px;
  margin-left: 20px;
}
/deep/.flex-box {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}
</style>
