<template>
  <div>
    <Form ref="_form" :model="formData" :label-width="150" :rules="rules">
      <Row>
        <FormItem label="分佣周期：" prop="commissionCycle">
          <RadioGroup v-model="formData.commissionCycle">
            <Radio :label="1">月度</Radio>
          </RadioGroup>
        </FormItem>
      </Row>
      <Row>
        <FormItem label="分佣维度：" prop="commissionDimension">
          <RadioGroup v-model="formData.commissionDimension">
            <Radio :label="1">流水</Radio>
          </RadioGroup>
        </FormItem>
      </Row>
      <Row>
        <FormItem label="统计维度：" prop="statisticsDimension">
          <RadioGroup v-model="formData.statisticsDimension">
            <Radio :label="1">司机</Radio>
            <Radio :label="2">运营商</Radio>
          </RadioGroup>
        </FormItem>
      </Row>
      <Row>
        <FormItem label="分佣比例：" prop="calMode">
          <RadioGroup v-model="formData.calMode">
            <Radio :label="1">阶梯</Radio>
            <Radio :label="2">非阶梯</Radio>
            <Radio :label="3" v-if="formData.statisticsDimension - 2 === 0"
              >浮动比例</Radio
            >
          </RadioGroup>
        </FormItem>
      </Row>
      <!--      浮动比例没有考核标准 默认1-->
      <FormItem
        label="考核标准:"
        prop="standard"
        v-if="formData.calMode - 3 !== 0"
      >
        <Row>
          <Col span="12">标准:</Col>
          <Col span="12">比例</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup
              v-model="formData.standard.way"
              type="button"
              @on-change="radioChange"
            >
<!--              <Radio :label="0" :disabled="true">百分比</Radio>-->
              <Radio :label="1">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br />
        <Row
          class-name="row-c"
          :key="index"
          v-for="(item, index) in formData.standard.definition"
        >
          <Col span="12">
            <Input
              v-model="item.min"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="toNumber(item.min, item, 'min')"
            ></Input>
            <span v-if="!formData.standard.way">%</span>
            <Select v-model="item.minSign" style="width: 60px" placeholder="">
              <Option key="1" value=">">></Option>
              <Option key="2" value="<"><</Option>
              <Option key="3" value="=">=</Option>
              <Option key="4" value="<=">≤</Option>
              <Option key="5" value=">=">≥</Option> </Select
            ><span class="sym">X</span>
            <Select v-model="item.maxSign" style="width: 60px" placeholder="">
              <Option key="1" value=">">></Option>
              <Option key="2" value="<"><</Option>
              <Option key="3" value="=">=</Option>
              <Option key="4" value="<=">≤</Option>
              <Option key="5" value=">=">≥</Option>
            </Select>
            <Input
              v-model="item.max"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="toNumber(item.max, item, 'max')"
            ></Input>
            <span v-if="!formData.standard.way">%</span>
          </Col>
          <Col span="12">
            <Button
              :type="item.isIndex ? 'default' : 'primary'"
              @click="typeChange(0, item)"
              >数值</Button
            >
            <Button
              :type="item.isIndex ? 'primary' : 'default'"
              @click="typeChange(1, item)"
              class="gap-1"
              >指标</Button
            >
            <Input
              v-if="!item.isIndex"
              v-model="item.coefficient"
              class="w-w"
              :maxlength="10"
              placeholder=""
            ></Input>
            <Button
              v-else
              class="w-i w-w"
              @click="selectRowIndicator(item)"
            >
              <span style="display: inline-block; width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ item.subIndex ? item.subIndex.name : "请选择" }}</span>
            </Button>
<!--            <div-->
<!--            ></div>-->
            <Icon
              v-if="formData.standard.definition.length > 1"
              class="remove-icon cp"
              size="24"
              type="ios-remove-circle-outline"
              @click="removeCommission(index, item)"
            />
            <Icon
              class="add-icon cp"
              size="24"
              type="ios-add-circle-outline"
              @click="addCommission(item)"
            />
          </Col>
        </Row>
      </FormItem>
    </Form>
    <indicator-single
      :visible="indicatorShow"
      :extra-params="indicatorParams"
      :selected="indicatorSelected"
      @close="indicatorClose"
    ></indicator-single>
  </div>
</template>

<script>
import { freeze, undef } from "@/mixins/base";
import { commissionRule, isStr } from "./fields";
import indicatorSingle from "../city/components/indicator-single";
const commissionKey = [
  "commissionCycle",
  "commissionDimension",
  "statisticsDimension",
  "calMode",
  "standard",
];

const def = {
  min: "",
  minSign: "",
  max: "",
  maxSign: "",
  coefficient: 0,
  isIndex: false, // 0 数值 1 指标
  subIndex: null, // 指标
};
const default_standard = {
  way: 1,
  definition: [
    {
      ...def,
    },
  ],
};

// 主策略分佣
export default {
  name: "main-commission",
  components: { indicatorSingle },
  props: {
    cData: {
      type: Object,
      default: function () {
        return {
          commissionCycle: 1,
          commissionDimension: 1,
          statisticsDimension: "",
          calMode: "",
          standard: JSON.parse(JSON.stringify(default_standard)),
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {},
      rules: commissionRule,
      indicatorShow: false,
      indicatorParams: {},
      indicatorSelected: undefined,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let other = {};
      try {
        other.standard = isStr(this.cData.standard)
          ? JSON.parse(this.cData.standard)
          : this.cData.standard;
      } catch {
        other.standard = default_standard;
      }
      if (this.cData.calMode - 3 !== 0) {
        other.standard?.definition.forEach((it) => {
          if (undef(it.isIndex)) {
            it.isIndex = false;
            it.subIndex = null;
          }
        });
      }
      if(!other.standard.definition?.length) {
        other.standard.definition = [{...def}]
        other.standard.way = 0
      }
      this.formData = {
        ...this.cData,
        ...other,
      };
    },
    async valid() {
      let valid = await this.$refs._form.validate();
      if(!valid) return [valid, null]
      return [true, this.getParams()]
    },
    getParams() {
      const {
        standard,
        commissionCycle,
        commissionDimension,
        statisticsDimension,
        calMode,
      } = this.formData;
      let other = {};
      if (calMode - 3 !== 0) {
        try {
          other.standard = JSON.stringify(standard);
        } catch {
          other = {};
        }
      } else {
        other.standard = JSON.stringify({ coefficient: 1 });
      }
      return {
        basicCommissionDTO: {
          commissionCycle,
          commissionDimension,
          statisticsDimension,
          calMode,
          ...other,
        },
      };
    },
    removeCommission(index) {
      this.formData.standard.definition.splice(index, 1);
    },
    addCommission() {
      this.formData.standard.definition.push({ ...def });
    },
    radioChange(v) {
      // if (this.detail.id) {
      //   let originStandard = JSON.parse(this.detail.standard);
      //   if (v - originStandard.way === 0) {
      //     this.addForm.standard.definition = originStandard.definition;
      //   } else {
      //     this.addForm.standard.definition = [];
      //     this.addForm.standard.definition.push({ ...def });
      //   }
      // } else {
      //   this.addForm.standard.definition = [];
      //   this.addForm.standard.definition.push({ ...def });
      // }
    },
    toNumber(val, it, key) {
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      if (v > 100) {
        // v = 100;
      } else if (v < 0) {
        v = 0;
      }
      it[key] = v;
    },
    typeChange(v, item) {
      item.isIndex = v;
    },
    isNum(v) {
      return `${v}` === "0";
    },
    isIndicator(v) {
      return `${v}` === "1";
    },
    selectRowIndicator(item) {
      this.indicatorShow = true;
      this.selectedRow = item
      if(item.isIndex - 1 === 0 && item.subIndex?.indexRuleJSON) {
        let { name, indexUuid, indexRuleJSON, parentFlag } = item.subIndex
        this.indicatorSelected = {
          name,
          uuid: indexUuid,
          indexUuid,
          parentFlag,
          _subIndex: 0,
          standard: indexRuleJSON
        }
      }
    },
    indicatorClose(indicator) {
      this.indicatorShow = false;
      if(!indicator) {
        return
      }
      const { name, uuid, standard, parentFlag } = indicator;
      this.selectedRow.subIndex = {
        name,
        indexUuid: uuid,
        parentFlag,
        indexRuleJSON: standard,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.row-c {
  margin-bottom: 8px;
}
.gap-1 {
  margin: 0 12px;
}
.w-w {
  width: 110px;
}
/deep/ .w-i {
  border-radius: 4px;
  text-align: center;
  border: 1px solid #dcdee2;
  span {
    width: 80px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
