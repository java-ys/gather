<template>
  <Form :model="cData" :label-width="170">
    <FormItem label="">
      <span>{{ cData.freeCancleMinute }}分钟内取消条件</span>
    </FormItem>
    <template v-for="(item, ix) in cData.stepRulesInTime">
      <div style="display: flex; flex-direction: row">
        <div style="display: flex; flex-direction: row">
          <FormItem label=""
            ><span>预约用车时间前</span><span class="mh">{{ item.left }}</span
            ><span>分钟 ~</span>
          </FormItem>
          <FormItem label="" :label-width="0">
            <span class="mh">{{ item.right }}</span>
            <span>分钟</span>
          </FormItem>
          <FormItem label="" :label-width="0"
            ><span>，取消费为{{ item.cancelFee }}</span
            ><span>元</span></FormItem
          >
        </div>
      </div>
    </template>
    <FormItem label="">
      <span>{{ cData.freeCancleMinute }}分钟外取消条件</span>
    </FormItem>
    <template v-for="(item, ix) in cData.stepRulesAfterTime">
      <div style="display: flex; flex-direction: row">
        <div style="display: flex; flex-direction: row">
          <FormItem label=""
            ><span>预约用车时间前</span>
            <span class="mh">{{ item.left }}</span>
            <span class="mr">分钟 ~</span>
          </FormItem>
          <FormItem label="" :label-width="0">
            <span class="mh">{{ item.right }}</span>
            <span class="mh">分钟</span>
          </FormItem>
          <FormItem label="" :label-width="0">
            {{ driverArrivedMap[item.driverArrived] }}
          </FormItem>
          <FormItem label="" :label-width="0"
            ><span class="mh">，取消费为</span
            ><span class="mh">{{ item.cancelFee }}</span
            ><span>元</span></FormItem
          >
        </div>
      </div>
    </template>
    <FormItem label=" ">
      <span>司机可迟到时间{{ cData.driverLaterMinute }}分钟</span>
    </FormItem>
  </Form>
</template>

<script>
import { ruleInTime, ruleOutTime } from "./fields";
import { driverArrivedMap } from "./ladder.js";
export default {
  name: "ladder-detail-com",
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
      driverArrivedMap,
    };
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
