<template>
  <div class="c-c">
    <Row>
      <Col
        ><span class="tit">{{ extraParams.title }}</span></Col
      >
    </Row>
    <Row v-if="radioList.length">
      <Col span="24">
        <RadioGroup v-model="radioType" type="button">
          <Radio
            :label="radio.value"
            :key="index"
            :disabled="readOnly"
            v-for="(radio, index) in radioList"
            >{{ radio.label }}</Radio
          >
        </RadioGroup>
      </Col>
    </Row>
    <br />
    <Row class-name="row-c" :key="index" v-for="(item, index) in list">
      <Col span="18">
        <span>{{ extraParams.rowTitle }}</span>
        <Select
          v-model="item.sign"
          style="width: 60px"
          placeholder=""
          :disabled="readOnly"
        >
          <Option
            v-for="(equ, ix) in equatorList"
            :key="ix"
            :value="equ.value"
            >{{ equ.label }}</Option
          >
        </Select>
        <!--        <InputNumber-->
        <!--          v-model="item.value"-->
        <!--          :min="0"-->
        <!--          :step="0.01"-->
        <!--          placeholder="值"-->
        <!--          :disabled="readOnly"-->
        <!--        ></InputNumber>-->
        <Input
          v-model="item.value"
          :maxlength="20"
          type="number"
          class="no-arrow"
          :disabled="readOnly"
          style="width: 100px; "
          placeholder="值"
          @on-keyup="e => vChange(e, item)"
        ></Input>
        <Input
          v-model="item.coefficient"
          :maxlength="20"
          type="number"
          class="no-arrow input-width"
          :disabled="readOnly"
          :placeholder="extraParams.placeholder"
          @on-keyup="e => coeChange(e, item)"
        ></Input>
<!--        <InputNumber-->
<!--          v-model="item.coefficient"-->
<!--          :min="0"-->
<!--          :precision="0"-->
<!--          :step="0.01"-->
<!--          :placeholder="extraParams.placeholder"-->
<!--          :disabled="readOnly"-->
<!--          class="input-width"-->
<!--        ></InputNumber>-->
        <span>%</span>
      </Col>
      <Col span="6" v-if="!readOnly">
        <Icon
          v-if="list.length > 1"
          @click="removeRow(index, item)"
          class="remove-icon"
          size="24"
          type="ios-remove-circle-outline"
        />
        <Icon
          @click="addRow(item)"
          class="add-icon"
          size="24"
          type="ios-add-circle-outline"
        />
      </Col>
    </Row>
    <Row>
      补充说明
      <Input
        v-model="desc"
        type="textarea"
        :rows="4"
        :maxlength="200"
        placeholder="请输入..."
        :disabled="readOnly"
        class="text-area"
      ></Input>
    </Row>
  </div>
</template>

<script>
import { equatorList } from "../fields";
import { freeze } from "@/mixins/base";
import {getMostDecimal, positiveNumber, undef} from "@/mixins/base";
const defaultItem = { sign: ">", value: null, coefficient: null };

export default {
  props: {
    radioList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    baseData: {
      type: Object,
      default: function() {
        return {
          desc: "",
          ladderList: [],
          type: "", // 类型
          radio: "" // 0订单量，1订单流水 2 服务扣减，3合规扣减
        };
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    extraParams: {
      type: Object,
      default: function() {
        return {
          title: "", // 标题
          rowTitle: "", // 行标题
          placeholder: "" // 系数placeholder
        };
      }
    },
    defaultRow: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    "baseData.ladderList": {
      handler: function(v) {
        this.list = v && v.length ? v : [{ ...defaultItem }];
      },
      immediate: true
    },
    "baseData.desc": {
      handler: function(v) {
        this.desc = v;
      },
      immediate: true
    },
    "baseData.radio": {
      handler: function(v) {
        let { radioList } = this
        this.radioType = undef(v) ? (radioList && radioList.length ? radioList[0].value : "") : `${v}`
      },
      immediate: true
    }
  },
  data() {
    const { radio } = this.baseData;
    let { radioList } = this

    return {
      equatorList: freeze(equatorList),
      list: [{ ...defaultItem }],
      desc: "",
      radioType:
        radio ||
        (radioList && radioList.length ? radioList[0].value : "")
    };
  },
  methods: {
    vChange(ev, item) {
      let v = +ev.target.value;
      if (isNaN(v)) {
        item.value = ""
        return;
      }
      if(`${v}` === '0') {
        return
      }
      item.value = positiveNumber(v) ? getMostDecimal(v, 2) : 0
    },
    coeChange(ev, item) {
      let v = +ev.target.value;
      if (isNaN(v)) {
        item.coefficient = ""
        return;
      }
      if(`${v}` === '0') {
        return
      }
      item.coefficient = positiveNumber(v) ? getMostDecimal(v, 2) : 0
    },
    removeRow(index) {
      this.list.splice(index, 1);
    },
    addRow() {
      this.list.push({ ...defaultItem });
    },
    exportData() {
      let { desc, list, radioType, baseData } = this;
      return {
        desc,
        list,
        radioType,
        type: baseData.type
      };
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.tit {
  font-size: 14px;
  font-weight: bold;
}
.row-c {
  margin-bottom: 8px;
}
.input-width {
  width: 200px;
}
</style>
