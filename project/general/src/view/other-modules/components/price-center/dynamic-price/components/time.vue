<template>
  <div>
    <div class="but-con">
      <Button type="primary" @click="addTimeRange" :disabled="disabled"
        >新增时段</Button
      >
    </div>
    <Form ref="_form" :model="detail" :rules="formItemRules">
      <div
        class="time-container"
        :key="index"
        v-for="(item, index) in detail.discountItems"
      >
        <div class="time-con">
          <Row>
            <FormItem
              :label-width="80"
              :label="'时段' + (index + 1)"
              :prop="'discountItems.' + index + '.period'"
              :rules="{
                required: true,
                type: 'array',
                message: '选择时间',
                trigger: 'change',
                fields: {
                  0: { type: 'string', required: true, message: '选择时间' },
                  1: { type: 'string', required: true, message: '选择时间' },
                },
              }"
            >
              <TimePicker
                v-model="item.period"
                type="timerange"
                :disabled="disabled"
                placeholder="选择时间段"
                style="width: 200px"
              />
            </FormItem>
          </Row>
          <div
            :key="idx"
            v-for="(it, idx) in item.acceptItemDetails"
            class="rate-c"
          >
            <div class="pick-rate">
              <!--              接起率-->
              <Row class-name="row-c">
                <Col span="15">
                  <div class="div-row">
                    <FormItem
                      label="接起率"
                      :label-width="80"
                      :prop="
                        'discountItems.' +
                        index +
                        '.acceptItemDetails.' +
                        idx +
                        '.resRateFrom'
                      "
                      :rules="formItemRules.resRateFrom"
                    >
                      <Input-number
                        v-model="it.resRateFrom"
                        :min="0"
                        :max="100"
                        class="input-width"
                        :disabled="disabled"
                        :formatter="limitNumber"
                      ></Input-number>
                      <span>%</span>
                    </FormItem>
                    <span class="sym">-</span>
                    <FormItem
                      label=""
                      :prop="
                        'discountItems.' +
                        index +
                        '.acceptItemDetails.' +
                        idx +
                        '.resRateTo'
                      "
                      :rules="formItemRules.resRateTo"
                    >
                      <Input-number
                        v-model="it.resRateTo"
                        :min="0"
                        :max="100"
                        class="input-width"
                        :disabled="disabled"
                        :formatter="limitNumber"
                      ></Input-number>
                      <span>%（含）</span>
                    </FormItem>
                  </div>
                </Col>
                <Col span="9"
                  >
                  <FormItem
                    label="最低呼叫数"
                    :label-width="80"
                  >
                  <Input-number
                    v-model="it.minNum"
                    :min="0"
                    :max="9999"
                    class="input-width"
                    :disabled="disabled"
                    :formatter="limitNumber"
                  ></Input-number>
                  <span v-if="!disabled">
                    <Icon
                      v-if="item.acceptItemDetails.length > 1"
                      class="remove-icon cp"
                      size="24"
                      color="#ed4014"
                      type="ios-remove-circle-outline"
                      @click="remove(idx, item.acceptItemDetails)"
                    />
                    <Icon
                      class="add-icon cp"
                      size="24"
                      color="#2d8cf0"
                      type="ios-add-circle-outline"
                      @click="addRate(idx, item.acceptItemDetails)"
                    />
                  </span>
                  </FormItem>
                </Col>
              </Row>
              <!--              里程区间-->
              <template v-for="(itm, ix) in it.discountDetails">
                <Row class-name="row-c">
                  <Col span="15">
                    <div class="div-row">
                    <FormItem
                      label="里程区间"
                      :label-width="80"
                      :prop="
                        'discountItems.' +
                        index +
                        '.acceptItemDetails.' +
                        idx +
                        '.discountDetails.' +
                        ix +
                        '.startCapacity'
                      "
                      :rules="formItemRules.startCapacity"
                    >
                    <Input-number
                      v-model="itm.startCapacity"
                      :min="0"
                      :max="9999"
                      class="input-width"
                      :disabled="disabled"
                      :formatter="limitNumberone"
                    ></Input-number>
                    <span>KM（含）</span>
                    </FormItem>
                    <span class="sym">-</span>
                    <FormItem
                      label=""
                      :prop="
                        'discountItems.' +
                        index +
                        '.acceptItemDetails.' +
                        idx +
                        '.discountDetails.' +
                        ix +
                        '.endCapacity'
                      "
                      :rules="formItemRules.endCapacity"
                    >
                    <Input-number
                      v-model="itm.endCapacity"
                      :min="0"
                      :max="9999"
                      class="input-width"
                      :disabled="disabled"
                      :formatter="limitNumberone"
                    ></Input-number>
                    <span>KM</span>
                    </FormItem>
                    </div>
                  </Col>
                  <Col span="9"
                    >
                    <FormItem
                      label="系数"
                      :label-width="80"
                      :prop="
                        'discountItems.' +
                        index +
                        '.acceptItemDetails.' +
                        idx +
                        '.discountDetails.' +
                        ix +
                        '.discountRate'
                      "
                      :rules="formItemRules.discountRate"
                    >
                    <Input-number
                      v-model="itm.discountRate"
                      :min="0"
                      :max="10"
                      class="input-width"
                      :disabled="disabled"
                      :formatter="limitNumbertwo"
                    ></Input-number>
                    <span v-if="!disabled">
                      <Icon
                        v-if="it.discountDetails.length > 1"
                        class="remove-icon cp"
                        size="20"
                        color="#ed4014"
                        type="ios-remove-circle-outline"
                        @click="remove(ix, it.discountDetails)"
                      />
                      <Icon
                        class="add-icon cp"
                        size="20"
                        color="#2d8cf0"
                        type="ios-add-circle-outline"
                        @click="addMileage(ix, it.discountDetails)"
                      />
                    </span>
                    </FormItem>
                  </Col>
                </Row>
              </template>
            </div>
          </div>
          <p class="title">兜底系数</p>
          <template
            v-for="(itm, ixx) in item.defaultDiscountDetails"
          >
            <div class="pick-rate default-rate">
              <Row>
                <Col span="15">
                  <div class="div-row">
                    <FormItem
                      :label="`里程区间${ixx+1}`"
                      :label-width="100"
                      :prop="
                        'discountItems.' +
                        index +
                        '.defaultDiscountDetails.' +
                        ixx +
                        '.startCapacity'
                        "
                      :rules="formItemRules.startCapacity"
                    >
                      <Input-number
                        v-model="itm.startCapacity"
                        :min="0"
                        :max="9999"
                        class="input-width"
                        :disabled="disabled"
                        :formatter="limitNumberone"
                      ></Input-number>
                      <span>KM（含）</span>
                    </FormItem>
                    <span class="sym">-</span>
                    <FormItem
                      label=""
                      :prop="
                        'discountItems.' +
                        index +
                        '.defaultDiscountDetails.' +
                        ixx +
                        '.endCapacity'
                        "
                      :rules="formItemRules.endCapacity"
                    >
                      <Input-number
                        v-model="itm.endCapacity"
                        :min="0"
                        :max="9999"
                        class="input-width"
                        :disabled="disabled"
                        :formatter="limitNumberone"
                      ></Input-number>
                      <span>KM</span>
                    </FormItem>
                  </div>
                </Col>
                <Col span="9"
                >
                  <FormItem
                    label="系数"
                    :label-width="80"
                    :prop="
                      'discountItems.' +
                      index +
                      '.defaultDiscountDetails.' +
                      ixx +
                      '.discountRate'
                      "
                    :rules="formItemRules.discountRate"
                  >
                    <Input-number
                      v-model="itm.discountRate"
                      :min="0"
                      :max="10"
                      class="input-width"
                      :disabled="disabled"
                      :formatter="limitNumbertwo"
                    ></Input-number>
                    <span v-if="!disabled">
                      <Icon
                        class="remove-icon cp"
                        size="20"
                        v-if="item.defaultDiscountDetails.length > 1"
                        color="#ed4014"
                        type="ios-remove-circle-outline"
                        @click="removeDefaultStrategy(ixx, item.defaultDiscountDetails)"
                      />
                      <Icon
                        class="add-icon cp"
                        size="20"
                        color="#2d8cf0"
                        type="ios-add-circle-outline"
                        @click="addDefaultStrategy(ixx, item.defaultDiscountDetails)"
                      />
                    </span>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </template>
        </div>
        <div class="but-container">
          <div v-if="!disabled">
            <Icon
              v-if="detail.discountItems.length > 1"
              class="remove-icon cp"
              size="30"
              type="ios-remove-circle-outline"
              color="#ed4014"
              @click="remove(index, detail.discountItems)"
            />
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { defaultInner, defaultCenter, defaultOuter } from "../fields";
import { deepCopy } from "@/libs/tools";
import numberFormat from "_o/components/price-center/dynamic-price/components/numberFormat";
import { freeze } from "@/mixins/base";
import BasicStrategy from "../mixin/basicStrategy";
import {formRules} from "./fields"
export default {
  name: "time-frame",
  mixins: [numberFormat, BasicStrategy],
  props: {
    detail: {
      type: Object,
      default: function () {
        return {
          discountItems: [deepCopy(defaultOuter)],
        };
      },
    },
    // 是否可编辑
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formItemRules: freeze(formRules)
    };
  },
  methods: {
    async valid() {
      let bool = await this.$refs._form.validate()
      return bool && this.checkRate() && this.checkMileage() && this.checkDefaultStrategy(this.detail.discountItems)
    },
    remove(index, list) {
      list.splice(index, 1);
    },
    addMileage(index, list) {
      list.splice(index + 1, 0, deepCopy(defaultInner));
    },
    addRate(index, list) {
      list.splice(index + 1, 0, deepCopy(defaultCenter));
    },
    addStrategy(index, list) {
      list.splice(index + 1, 0, deepCopy(defaultOuter));
    },
    addTimeRange() {
      this.detail.discountItems.push(deepCopy(defaultOuter));
    },
    returnParams() {
      return this.detail.discountItems;
    },
    // 接起率
    checkRate() {
      let result = true;
      this.detail.discountItems.map((item, index) => {
        if (!this.checkRateItem(item.acceptItemDetails, index)) {
          result = false
        }
      })
      return result
    },
    // 数组范围是否有交集 [80, 100] [0, 80]
    numberIntersection(date1, date2) {
      if(date1.length < 2 || date2.length < 2) {
        return false
      }
      return !(date2[1] <= date1[0] || date2[0] >= date1[1])
    },
    checkRateItem(list=[], index) {
      let result = true
      // let [stList, edList] = [list.map(item => {
      //   return Number(item.resRateFrom)
      // }), list.map(item => {
      //   return Number(item.resRateTo)
      // })]
      // for (let i = 0; i < stList.length; i++) {
      //   if (stList[i] >= edList[i]) {
      //     this.$Message.error(`第${index + 1}个时段区间里的第${i + 1}个接起率范围错误`)
      //     result = false
      //     break;
      //   } else {
      //     if (stList[i + 1] < edList[i]) {
      //       this.$Message.error(`第${index + 1}个时段区间里的第${i + 2}个接起率重复`)
      //       result = false
      //       break;
      //     }
      //   }
      // }
      let rateList = list.map(item => {
        return [item.resRateFrom, item.resRateTo]
      })
      let len = rateList.length;
      let sum = 0
      for(let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if(this.numberIntersection(rateList[i], rateList[j])) {
            this.$Message.error(`第${index + 1}个时段区间里的第${i + 2}个接起率重复`)
            result = false
            break
          }
        }
        sum += rateList[i][1] - rateList[i][0]
      }
      // 每个时段的接起率总和为100
      // if(result) {
      //   if(sum !== 100) {
      //     this.$Message.error(`第${index + 1}个时段区间里接起率范围错误`)
      //     result = false
      //   }
      // }
      return result
    },
    checkMileage() {
      let result = true;
      this.detail.discountItems.map((item, index) => {
        item.acceptItemDetails.map((i, idx) => {
          if (!this.checkMileageItem(i.discountDetails, index, idx)) {
            result = false
          }
        })
      })
      return result
    },
    checkMileageItem(list=[], index, idx) {
      let result = true
      let [stList, edList] = [list.map(item => {
        return Number(item.startCapacity)
      }), list.map(item => {
        return Number(item.endCapacity)
      })]
      for (let i = 0; i < stList.length; i++) {
        if (stList[i] >= edList[i]) {
          this.$Message.error(`第${index + 1}个时段区间里的第${idx + 1}个接起率里的第${i + 1}个里程区间范围错误`)
          result = false
          break;
        } else {
          if (stList[i + 1] < edList[i]) {
            this.$Message.error(`第${index + 1}个时段区间里的第${idx + 1}个接起率里的第${i + 2}个里程区间重复`)
            result = false
            break;
          }
        }
      }
      return result
    },
  },
};
</script>

<style lang="less">
@import "./time.less";
</style>
