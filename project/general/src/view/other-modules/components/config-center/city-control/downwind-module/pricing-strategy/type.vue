<template>
  <div class="slide-range">
    <span>{{ sliderRange.min }}</span>
    <Slider
      v-model="sliderRange.checked"
      :min="sliderRange.min"
      :max="sliderRange.max"
      :step="step"
      class="slider-style"
      show-stops
      :disabled="sliderRange.min == sliderRange.max || limitDisabled"
      @on-change="sliderChange"
    />
    <span style="margin-right: 30px;">{{ sliderRange.max }}</span>

    <slot :index="index" />

    <div :style="{ border: '1px solid #eee', padding: '20px' }">
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span class="span-label">接送里程单价：</span>
        </Col>
        <Col :span="20" >
        <list
          :formDynamic="formDynamic"
          :index="index"
        />
        </Col>
      </Row>
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span class="span-label">服务里程单价：</span>
        </Col>
        <Col :span="20" >
        <list
          :formDynamic="serviceFormDynamic"
          :index="index"
          flag="service"
        />
        </Col>
      </Row>
      <Row style="margin-bottom: 30px">
        <Col :span="4" >
        <span>时长单价（元/分钟）：</span>
        </Col>
        <Col >
        <Form
          ref="formInline"
          :rules="ruleInline"
          inline
          :model="timeFormDynamix"
        >
          <FormItem prop="fare">
            <Input
              v-model="timeFormDynamix.fare"
              placeholder=""
              size="small"
              style="width: 100px"
            />
          </FormItem>
        </Form>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import list from "./list";
export default {
  name: "type",
  components: {
    list
  },
  props: {
    sliderRange: {
      type: Object,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    index: Number,
    formDynamic: {
      type: Object,
      default: function() {
        return this.strategy.PriceOfShuttle[this.index].formDynamic;
      }
    },
    serviceFormDynamic: {
      type: Object,
      default: function() {
        return this.strategy.ServiceOfShuttle[this.index].formDynamic;
      }
    },
    timeFormDynamix: {
      type: Number | String,
      default: function() {
        return this.strategy.TimeOfShuttle[this.index];
      }
    }
  },
  data() {
    const validators = {
      validator: (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
          callback(new Error("正数且最多两位小数"));
        } else {
          callback();
        }
      }
    };
    return {
      limitDisabled: false,
      ruleInline: {
        fare: [{ trigger: "blur", validator: validators.validator }]
      },
      sliderSwitch: true
    };
  },
  inject: ["strategy"],
  methods: {
    async sliderChange(o) {
      await this.strategy.sliderChange(o, this.index);
    }
  }
};
</script>
<style lang="less" scoped>
.span-label:before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
.slider-style {
  display: inline-block;
  width: 300px;
  vertical-align: middle;
  margin: 0 20px;
}
</style>
