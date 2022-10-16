<template>
  <Form ref="_form" :model="cData" :rules="rules" :label-width="120">
    <FormItem label=" " :label-width="50">
      <Button type="primary" @click="addItem">新增时段</Button>
    </FormItem>
    <FormItem
      class="ivu-form-item-required"
      label="接单后免费取消时间："
      :label-width="150"
      ><span>{{ freeCancelMinute }}分钟</span></FormItem
    >
    <div
      class="time-container"
      :key="index"
      v-for="(item, index) in cData.rules"
    >
      <div class="time-con">
        <Row>
          <FormItem
            :label-width="120"
            :label="'时段' + (index + 1) + '：'"
            :prop="'rules.' + index + '.period'"
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
              placeholder="选择时间段"
              style="width: 200px"
            />
          </FormItem>
        </Row>
        <Row class-name="r-t"> 露出条件 </Row>
        <Row>
          <FormItem
            label="露出时间："
            :prop="'rules.' + index + '.showTime'"
            :rules="rules.showTime"
          >
            <span>订单接起后</span
            ><Input-number
              v-model="item.showTime"
              :min="0"
              :max="9999"
              :step="1"
              :precision="0"
              class="input-width"
            ></Input-number
            ><span class="ml-6">秒内</span>
          </FormItem>
        </Row>
        <Row>
          <Col span="14">
            <FormItem
              label="剩余时间/里程："
              :prop="'rules.' + index + '.remainTime'"
              :rules="rules.remainTime"
            >
              <span>剩余预计接乘时长≥</span
              ><Input-number
                v-model="item.remainTime"
                :min="0"
                :max="9999"
                :step="1"
                :formatter="limitNumberone"
                class="input-width"
              ></Input-number
              ><span class="ml-6">秒</span>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem
              label="或剩余预计接乘距离≥"
              class="distance"
              :label-width="140"
              :prop="'rules.' + index + '.remainDistance'"
              :rules="rules.remainDistance"
            >
              <Input-number
                v-model="item.remainDistance"
                :min="0"
                :max="9999"
                :step="1"
                :formatter="limitNumberone"
                class="input-width"
              ></Input-number
              ><span class="ml-6">米</span>
            </FormItem>
          </Col>
        </Row>
        <Row class-name="r-t"> 派单限制 </Row>
        <Row>
          <FormItem
            label="二次派单时长："
            :prop="'rules.' + index + '.matchTime'"
            :rules="rules.matchTime"
          >
            <Select
              v-model="item.matchTime"
              placeholder="请选择"
              class="input-width"
              clearable
            >
              <Option
                v-for="item in numList"
                :key="item.value"
                :value="item.value"
                >{{ item.label }}</Option
              >
            </Select>
            <span class="ml-6">秒</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem
            label="节省时间："
            :prop="'rules.' + index + '.saveTime'"
            :rules="rules.saveTime"
          ><span>≥</span>
            <Input-number
              v-model="item.saveTime"
              :min="0"
              :max="9999"
              :step="1"
              :precision="0"
              class="input-width"
            ></Input-number
            ><span class="ml-6">秒，取消原订单，重新派单</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="等待补偿：" :rules="rules.waitMoney">
            <Input-number
              v-model="item.waitMoney"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              class="input-width"
            ></Input-number
            ><span class="ml-6">元 运营金/单</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem
            label="派单车型："
            :prop="'rules.' + index + '.carLevel'"
            :rules="rules.carLevel"
          >
            <RadioGroup v-model="item.carLevel">
              <Radio :label="1">接起车型</Radio>
              <Radio :label="2">呼叫车型</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
      </div>
      <div class="but-container">
        <template v-if="cData.rules.length > 1">
          <Icon
            class="remove-icon cp"
            size="30"
            type="ios-remove-circle-outline"
            color="#ed4014"
            @click="remove(index)"
          />
        </template>
      </div>
    </div>
  </Form>
</template>
<script>
import { itemRules as rules, default_item, numList } from "./fields";
import { deepCopy } from "@/libs/tools";

export default {
  name: "item-list",
  inject: ["getMinFee"],
  props: {
    cData: {
      type: Object,
      default: function () {
        return {
          rules: [deepCopy(default_item)],
        };
      },
    },
  },
  data() {
    return {
      rules,
      numList,
    };
  },
  computed: {
    freeCancelMinute({ getMinFee }) {
      return getMinFee();
    },
  },
  methods: {
    remove(index) {
      this.cData.rules.splice(index, 1);
    },
    addItem() {
      this.cData.rules.push(deepCopy(default_item));
    },
    reset() {
      this.$nextTick(() => {
        this.$refs?._form?.resetFields();
      });
    },
    async getData() {
      const valid = await this.$refs._form.validate();
      if (!valid) {
        return [false, null];
      }
      let params = this.cData.rules?.map((it) => {
        let p = { ...it };
        p.startTime = p.period[0];
        p.endTime = p.period[1];
        delete p.period;
        return p;
      });
      return [true, params];
    },
    limitNumberone(value) {
      if (typeof value === "string") {
        return !isNaN(value)
          ? String(value).replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3")
          : "";
      } else if (typeof value === "number") {
        return !isNaN(value)
          ? String(value).replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3")
          : "";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .distance label {
  font-weight: normal;
}
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
.default-rate {
  padding: 2px 10px;
}

.title {
  font-size: 14px;
  font-weight: bold;
  margin: 20px 0;
}
.ml-6 {
  margin-left: 6px;
}
.input-width {
  margin-left: 6px;
}
.r-t {
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: bold;
}
</style>
