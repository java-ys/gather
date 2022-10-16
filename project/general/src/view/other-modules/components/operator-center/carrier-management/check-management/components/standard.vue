<template>
  <div>
    <div class="indicator-name">
      {{ comData.name }}
    </div>
    <!--    父指标-->
    <div v-if="isParent">
      <div class="sub-con">
        <div
          v-for="(item, index) in comData.standard"
          :key="item.childIndexId"
          :class="{ active: index - comData._subIndex === 0 }"
          class="sub-item pr"
          @click="subTargetClick(index, comData)"
        >
          <Icon
            class="close-ic"
            type="ios-close"
            size="16"
            @click.stop="deleteSubTarget(index, comData)"
          ></Icon>
          {{ item.childIndexName }}
        </div>
      </div>
      <div>
        <Row>
          <Col span="16">标准:</Col>
          <Col span="8">系数</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup
              v-model="comData.standard[+comData._subIndex].indexRule.way"
              type="button"
            >
              <Radio :label="0" v-show="comData.standard[+comData._subIndex].indexRule.way == 0">百分比</Radio>
              <Radio :label="1" v-show="comData.standard[+comData._subIndex].indexRule.way == 1">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br />
        <Row
          :key="index"
          v-for="(item, index) in comData.standard[+comData._subIndex].indexRule
            .definition"
          class-name="row-c"
        >
          <Col span="14">
            <Input
              v-model="item.min"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="numValid(item.min, 'min', item, comData.standard.way)"
            ></Input>
            <span
              v-if="
                `${comData.standard[+comData._subIndex].indexRule.way}` === '0'
              "
              >%</span
            >
            <Select v-model="item.minSign" style="width: 60px">
              <Option
                :key="index"
                :value="item.value"
                v-for="(item, index) in operateList"
                >{{ item.label }}</Option
              > </Select
            ><span class="sym">X</span>
            <Select v-model="item.maxSign" style="width: 60px">
              <Option
                :key="index"
                :value="item.value"
                v-for="(item, index) in operateList"
                >{{ item.label }}</Option
              >
            </Select>
            <Input
              v-model="item.max"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="numValid(item.max, 'max', item, comData.standard.way)"
            ></Input>
            <span
              v-if="
                `${comData.standard[+comData._subIndex].indexRule.way}` === '0'
              "
              >%</span
            >
          </Col>
          <Col span="10"
            ><Input
              v-model="item.coefficient"
              style="width: 160px"
              :maxlength="99"
              placeholder=""
            ></Input>
            <Icon
              v-if="
                comData.standard[+comData._subIndex].indexRule.definition &&
                comData.standard[+comData._subIndex].indexRule.definition
                  .length > 1
              "
              @click="
                removeSubItem(
                  index,
                  comData.standard[+comData._subIndex].indexRule.definition
                )
              "
              class="remove-icon"
              size="24"
              type="ios-remove-circle-outline"
            />
            <Icon
              @click="
                addSubItem(
                  comData.standard[+comData._subIndex].indexRule.definition,
                  index
                )
              "
              class="add-icon"
              size="24"
              type="ios-add-circle-outline"
            />
          </Col>
        </Row>
      </div>
    </div>
    <!--    子指标-->
    <div v-else>
      <Row class-name="t-t">
        <Col span="16">标准:</Col>
        <Col span="8">系数</Col>
      </Row>
      <Row>
        <Col span="24">
          <RadioGroup v-model="comData.standard.way" type="button">
            <Radio :label="0" v-show="comData.standard.way == 0">百分比</Radio>
            <Radio :label="1" v-show="comData.standard.way == 1">数值</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <br />
      <Row
        :key="index"
        v-for="(item, index) in comData.standard.definition"
        class-name="row-c"
      >
        <Col span="14">
          <Input
            v-model="item.min"
            style="width: 60px"
            :maxlength="10"
            placeholder=""
            @on-keyup="numValid(item.min, 'min', item, comData.standard.way)"
          ></Input>
          <span v-if="`${comData.standard.way}` === '0'">%</span>
          <Select v-model="item.minSign" style="width: 60px">
            <Option
              :key="index"
              :value="item.value"
              v-for="(item, index) in operateList"
              >{{ item.label }}</Option
            > </Select
          ><span class="sym">X</span>
          <Select v-model="item.maxSign" style="width: 60px">
            <Option
              :key="index"
              :value="item.value"
              v-for="(item, index) in operateList"
              >{{ item.label }}</Option
            >
          </Select>
          <Input
            v-model="item.max"
            style="width: 60px"
            :maxlength="10"
            placeholder=""
            @on-keyup="numValid(item.max, 'max', item, comData.standard.way)"
          ></Input>
          <span v-if="`${comData.standard.way}` === '0'">%</span>
        </Col>
        <Col span="10"
          ><Input
            v-model="item.coefficient"
            style="width: 160px"
            :maxlength="99"
            placeholder=""
          ></Input>
          <Icon
            v-if="
              comData.standard.definition &&
              comData.standard.definition.length > 1
            "
            @click="removeItem(index, comData.standard.definition)"
            class="remove-icon"
            size="24"
            type="ios-remove-circle-outline"
          />
          <Icon
            @click="addItem(index, comData.standard.definition)"
            class="add-icon"
            size="24"
            type="ios-add-circle-outline"
          />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { operateList } from "../tool/config";
import { isStr } from "@/mixins/base";

const MAX_RULE_NUM = 5;
const standard = {
  coefficient: "", // 系数
  max: "", // 范围大值
  maxSign: "", // 范围结束条件符号
  min: "", // 范围小值
  minSign: "", // 范围开始条件符号
};

const default_standard = {
  definition: [{ ...standard }],
  way: 0,
};

export default {
  name: "standard-list",
  props: {
    cData: {
      type: Object,
      default: function () {
        return {
          standard: JSON.stringify(default_standard),
        };
      },
    },
  },
  watch: {
    cData: {
      handler(v) {
        if (isStr(v.standard)) {
          v.standard = JSON.parse(v.standard);
        }
        this.comData = v;
      },
      deep: true,
    },
  },
  computed: {
    isParent({ cData }) {
      return cData.parentFlag - 1 === 0;
    },
  },
  data() {
    let d = JSON.parse(JSON.stringify(this.cData));
    try {
      d.standard = isStr(d.standard) ? JSON.parse(d.standard) : d.standard;
    } catch {
      d.standard = {
        definition: [{ ...standard }],
        way: 0,
      };
    }
    return {
      operateList,
      comData: d,
    };
  },
  methods: {
    getData() {
      console.log(this.comData, '选择的指标数据')
      return this.comData.standard; // this.$data
    },
    removeItem(index, item) {
      if (item?.length > 1) {
        item.splice(index, 1);
      }
    },
    addItem(index, item) {
      if (item?.length < MAX_RULE_NUM) {
        item.push({
          ...standard,
        });
      }
    },
    removeSubItem(index, list) {
      if (list.length > 1) {
        list.splice(index, 1);
      }
    },
    // 删除子指标
    deleteSubTarget(i, json) {
      let list = json.standard;
      if (list.length === 1) {
        this.$Message.error("最少保留一个子指标!");
        return;
      }
      // 当前选中索引是数组最后一个元素
      if (json._subIndex - i === 0 && list.length - i === 1) {
        json._subIndex = i - 1;
      }
      list.splice(i, 1);
    },
    // 子指标切换显示
    subTargetClick(i, item) {
      item._subIndex = i;
      this.$forceUpdate();
    },
    // 百分比 数值 设置 不做任何校验
    numValid(val, key, item, ori) {
      // let v = `${val}`;
      // v = `${val}`.replace(/[^\d\.\-]/g, "");
      // let vArr = v.split(".");
      // if (vArr.length > 2) {
      //   v = vArr.slice(0, 2).join(".");
      // }
      // if (vArr[1] && vArr[1].length > 2) {
      //   v = Number(v).toFixed(6);
      // }
      // item[key] = v;
    },
    addSubItem(list) {
      if (list.length < MAX_RULE_NUM) {
        list.push({ ...standard });
      }
    },
  },
};
</script>

<style scoped lang="less">
.t-t {
  margin-bottom: 10px;
}
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}

.sub-con {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .sub-item {
    padding: 6px 10px;
    cursor: pointer;
    line-height: 22px;
    max-height: 90px;
    margin-right: 12px;
    margin-bottom: 12px;
    display: inline-block;
    background: #fff;
    width: 220px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    &.active {
      background-color: #2d8cf0;
      color: #fff;
    }
  }
}
.pr {
  position: relative;
}
.close-ic {
  position: absolute;
  right: -6px;
  top: -6px;
  border-radius: 50%;
  background-color: #bbb8b8;
  z-index: 9;
}
.rule-width {
  width: 60px;
}
.indicator-name {
  font-size: 14px;
  margin-bottom: 12px;
}
</style>
