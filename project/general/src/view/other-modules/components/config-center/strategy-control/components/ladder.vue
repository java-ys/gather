<template>
  <Form ref="_form" :model="cData" :rules="rules" :label-width="170">
    <FormItem label="" prop="freeCancleMinute">
      <Input-number
        v-model="cData.freeCancleMinute"
        :min="0"
        :max="9999"
        class="input-width"
      ></Input-number>
      <span>分钟内取消条件</span>
    </FormItem>
    <template v-for="(item, ix) in cData.stepRulesInTime">
      <div style="display: flex; flex-direction: row">
        <div style="display: flex; flex-direction: row">
          <FormItem
            label=""
            :prop="'stepRulesInTime.' + ix + '.left'"
            :rules="rules.left"
            ><span>预约用车时间前</span
            ><Input
              v-model="item.left"
              :maxlength="10"
              class="input-width mh"
            ></Input
            ><span class="mr">分钟 ~</span>
          </FormItem>
          <FormItem
            label=""
            :label-width="0"
            :prop="'stepRulesInTime.' + ix + '.right'"
            :rules="rules.right"
            ><Input
              v-model="item.right"
              :maxlength="10"
              class="input-width"
            ></Input
            ><span class="ml">分钟</span>
          </FormItem>
          <FormItem
            label=""
            :label-width="0"
            :prop="'stepRulesInTime.' + ix + '.cancelFee'"
            :rules="rules.cancelFee"
            ><span>，取消费为</span
            ><Input-number
              v-model="item.cancelFee"
              :min="0"
              :max="9999"
              class="input-width mh"
            ></Input-number
            ><span>元</span></FormItem
          >
        </div>
        <div style="flex: 1">
          <span>
            <Icon
              v-if="cData.stepRulesInTime.length > 1"
              class="remove-icon cp"
              size="20"
              color="#ed4014"
              type="ios-remove-circle-outline"
              @click="removeInRule(ix)"
            />
            <Icon
              class="add-icon cp"
              size="20"
              color="#2d8cf0"
              type="ios-add-circle-outline"
              @click="addInRule(ix)"
            />
          </span>
        </div>
      </div>
    </template>
    <FormItem label="" prop="freeCancleMinute">
<!--      <Input-->
<!--        v-model="cData.freeCancleMinute"-->
<!--        class="input-width"-->
<!--      ></Input>-->
      <Input-number
        v-model="cData.freeCancleMinute"
        :min="0"
        :max="9999"
        class="input-width"
      ></Input-number>
      <span>分钟外取消条件</span>
    </FormItem>
    <template v-for="(item, ix) in cData.stepRulesAfterTime">
      <div style="display: flex; flex-direction: row">
        <div style="display: flex; flex-direction: row">
          <FormItem
            label=""
            :prop="'stepRulesAfterTime.' + ix + '.left'"
            :rules="rules.left"
            ><span>预约用车时间前</span
            ><Input
              v-model="item.left"
              :maxlength="10"
              class="input-width mh"
            ></Input
            ><span class="mr">分钟 ~</span>
          </FormItem>
          <FormItem
            label=""
            :label-width="0"
            :prop="'stepRulesAfterTime.' + ix + '.right'"
            :rules="rules.right"
            ><Input
              v-model="item.right"
              :maxlength="10"
              class="input-width"
            ></Input
            ><span class="mh">分钟</span>
          </FormItem>
          <FormItem label="" :label-width="0" v-if="item.left - (-1) === 0">
            <Select
              v-model="item.driverArrived"
              style="width: 130px"
              clearable
              placeholder="请选择"
            >
              <Option
                v-for="item in driverArrivedList"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem
            label=""
            :label-width="0"
            :prop="'stepRulesAfterTime.' + ix + '.cancelFee'"
            :rules="rules.cancelFee"
            ><span class="mh">，取消费为</span
            ><Input-number
              v-model="item.cancelFee"
              :min="0"
              :max="9999"
              class="input-width mh"
            ></Input-number
            ><span>元</span></FormItem
          >
        </div>
        <div style="flex: 1">
          <span>
            <Icon
              v-if="cData.stepRulesAfterTime.length > 1"
              class="remove-icon cp"
              size="20"
              color="#ed4014"
              type="ios-remove-circle-outline"
              @click="removeOutRule(ix)"
            />
            <Icon
              class="add-icon cp"
              size="20"
              color="#2d8cf0"
              type="ios-add-circle-outline"
              @click="addOutRule(ix)"
            />
          </span>
        </div>
      </div>
    </template>
    <FormItem label="" prop="driverLaterMinute">
      <span>司机可迟到时间</span>
      <Input-number
        v-model="cData.driverLaterMinute"
        :min="0"
        :max="9999"
        class="input-width"
      ></Input-number>
      <span>分钟</span>
    </FormItem>
  </Form>
</template>

<script>
import { ruleInTime, ruleOutTime } from "./fields";
import { driverArrivedList, rules } from "./ladder.js";
export default {
  name: "ladder-com",
  props: {
    cData: {
      type: Object,
      default: function () {
        return {
          freeCancleMinute: null,
          stepRulesInTime: [{ ...ruleInTime }],
          stepRulesAfterTime: [{ ...ruleOutTime }],
        };
      },
    },
  },
  data() {
    return {
      driverArrivedList,
      rules,
    };
  },
  methods: {
    async getData() {
      const valid = await this.$refs._form.validate();
      if (!valid) return [false, null];
      return [true, this.cData];
    },
    removeInRule(index) {
      this.cData.stepRulesInTime.splice(index, 1);
    },
    addInRule() {
      this.cData.stepRulesInTime.push({ ...ruleInTime });
    },
    removeOutRule(index) {
      this.cData.stepRulesAfterTime.splice(index, 1);
    },
    addOutRule() {
      this.cData.stepRulesAfterTime.push({ ...ruleOutTime });
    },
  },
};
</script>

<style scoped lang="less">
.input-width {
  width: 80px;
}
.cp {
  position: relative;
  top: 6px;
  margin-left: 12px;
}
.ml {
  margin-left: 4px;
}
.mh {
  margin: 0 4px;
}
.mr {
  margin-right: 4px;
}
</style>
