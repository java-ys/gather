<template>
  <div>
    <div class="but-con">
      <Button type="primary" @click="addTimeRange" :disabled="disabled"
        >新增时段</Button
      >
    </div>
    <Form ref="_form" :model="content" >
      <div
        class="time-container"
        :key="index"
        v-for="(item, index) in content.configs"
      >
        <div class="time-con">
          <Row>
            <FormItem
              :label-width="80"
              :label="'时段' + (index + 1)"
              :prop="'configs.' + index + '.period'"
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
            class="rate-c"
          >
            <div class="pick-rate">
              <!--              接起率-->
              <Row class-name="row-c">
                  <div class="div-row">
                    <FormItem
                      label="流水补足规则："
                      :label-width="110"
                      :prop="
                      'configs.' + index +
                      '.replenishRatio'
                      "
                      :rules="formItemRules.replenishRatio"
                    >
                    <span>{{"司机流水/乘客流水 ＜"}}</span>
                      <Input-number
                        v-model="item.replenishRatio"
                        :min="1"
                        :max="999"
                        class="input-width"
                        :disabled="disabled"
                        :formatter="limitNumber"
                        :precision="0"
                        :step="1"
                      ></Input-number>
                      <span style="margin-left:5px;">%</span>
                      <span style="margin-left:5px;">补足至{{item.replenishRatio?item.replenishRatio:"1"}}%</span>
                    </FormItem>
                  </div>
              </Row>
            </div>
          </div>
          <div style="width: 20px"></div>
        </div>
        <div class="but-container">
          <div v-if="!disabled">
            <Icon
              v-if="content.configs.length > 1"
              class="remove-icon cp"
              size="30"
              type="ios-remove-circle-outline"
              color="#ed4014"
              @click="remove(index, content.configs)"
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
export default {
  name: "time-frame",
  mixins: [numberFormat],
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
    content: {
      type: Object,
      default: function () {
        return {
          configs: [deepCopy(defaultOuter)],
        };
      },
    },
  },
  data() {
    return {
      formItemRules: {
        replenishRatio: [{
          required: true,
          type: "number",
          message: "请填写比率",
          // trigger: "change",
          validator: (rule, value, callback) => {
            console.log(rule, value, "00")
            // debugger
            if (value > 0) {
              callback()
            } 
            // else if(value === undefined){
            //   // debugger
            //   callback()
            // }
            else {
              callback(new Error("请填写比率"))
              // callback()
            }
          }
        }],
      }
    };
  },
  mounted(){
    // console.log(this.content)
    // debugger
  },
  methods: {
    async valid() {
      let bool = await this.$refs._form.validate()
      // console.log(this.$refs._form)
      // debugger
      // return bool && this.checkRate() && this.checkMileage()
      return bool 
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
      // this.detail.discountItems.push(deepCopy(defaultOuter));
      this.content.configs.push(deepCopy(defaultOuter));
    },
    returnParams() {
      // return this.detail.discountItems;
      return this.content.configs;
    },
  },
};
</script>

<style>
.but-con {
  margin-bottom: 20px;
}
.time-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
}
.time-con {
  border-radius: 4px;
  padding: 20px;
  flex: 1;
  border: 1px solid #e8eaec;
}
.pick-rate {
  padding: 10px 20px;
  background-color: #fafafa;
  border-radius: 4px;
}
.row-c {
  margin-bottom: 10px;
}
.t-t {
  display: inline-block;
  width: 80px;
}
.input-width {
  width: 80px;
}
.but-container {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rate-c {
  margin-bottom: 6px;
}
.div-row {
  display: flex;
  flex-direction: row;
}
.sym {
  margin: 9px 10px 0;
}
</style>
