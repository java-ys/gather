<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 17:05:52
 * @LastEditTime: 2021-11-05 17:34:35
 * @Description: 订单价值优先级策略
-->
<template>
  <Form
    ref="orderPriceform"
    inline="inline"
    :model="orderPriceform"
    class="orderPriceform"
  >
    <div class="sub-title">
      订单价值优先级策略
    </div>
    <div class="button_btn20">
      <Button v-if="fromSource !== 3" type="primary" @click="addOrderPricePriority">
        添加等级策略
      </Button>
    </div>
    <div
      v-for="(item,index) in orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs"
      :key="index"
      class="level_container order_level_container"
    >
      <div class="left">
        <FormItem
          :label="`等级${index + 1}`"
          :prop="
            'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' +
              index +
              '.levelValBegin'
          "
          :rules="ruleValidate.level"
        >
          <Input
            v-model="
              orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index]
                .levelValBegin
            "
            placeholder="请输入等级"
            style="width: 120px"
            :disabled="fromSource === 3"
          />
          <span>&nbsp;元</span>
        </FormItem>
        <div
          style="line-height: 33px;height: 33px;margin-bottom:18px;margin-left: 5px;margin-right: 5px;"
        >
          -
        </div>
        <FormItem
          label=""
          :prop="
            'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' + index + '.levelValEnd'
          "
          :rules="ruleValidate.level"
          :disabled="fromSource === 3"
        >
          <Input
            v-model="
              orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index]
                .levelValEnd
            "
            placeholder="请输入等级"
            style="width: 120px"
            :disabled="fromSource === 3"
          />
          <span>&nbsp;元</span>
        </FormItem>
      </div>
      <div class="right">
        <FormItem
          label="系数："
          :prop="'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' + index + '.rate'"
          :rules="ruleValidate.rate"
        >
          <Input
            v-model="
              orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index].rate
            "
            placeholder="请输入系数"
            style="width: 120px"
            :disabled="fromSource === 3"
          />
        </FormItem>
        <div
          v-if="index > 0 && fromSource !== 3"
          class="delete_icon"
          @click="removeOrderPriorityHeatLevel(index)"
        >
          <Icon type="ios-remove-circle-outline" />
        </div>
      </div>
    </div>
  </Form>
</template>

<script>
import { validLevel, validCofficient } from "../fields"
import { deepClone } from "@/libs/util"
export default {
  props: {
    infoData: {
      type: Object
    }
  },
  data() {
    return {
      fromSource: 1, // 新增 、编辑、详情
      ruleValidate: {
        // 等级
        level: [
          {
            required: true,
            message: "请输入等级"
          },
          {
            trigger: "blur",
            validator: validLevel
          }
        ],
        // 等级
        rate: [
          {
            required: true,
            message: "请输入系数"
          },
          {
            trigger: "blur",
            validator: validCofficient
          }
        ]
      },
      // 订单价值表单
      orderPriceform: {
        orderPricePriorityStrategySaveReq: {
          priceLevelStrategyReqs: []
        }
      },
    }
  },
  watch: {
    infoData: {
      handler: function(obj) {
        // 用详情更新表单数据
        this.$nextTick(() => {
          this.orderPriceform = Object.assign(this.orderPriceform, deepClone({}, obj))
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 添加
    addOrderPricePriority() {
      this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.push({
        levelValBegin: "",
        levelValEnd: "",
        rate: ""
      });
    },
    // 移除等级策略表单
    removeOrderPriorityHeatLevel(index) {
      this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs = this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.filter((item, i) => i !== index);
    },
    getFormData() {
      return new Promise((resolve, reject) => {
        const { orderPricePriorityStrategySaveReq: { priceLevelStrategyReqs }} = this.orderPriceform
        if (!priceLevelStrategyReqs.length) {
          resolve(this.orderPriceform)
        }
        this.$refs.orderPriceform.validate((valide) => {
          if (valide) {
            resolve(this.orderPriceform)
          } else {
            resolve(null)
          }
        })
      })
    }
  },
}
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>