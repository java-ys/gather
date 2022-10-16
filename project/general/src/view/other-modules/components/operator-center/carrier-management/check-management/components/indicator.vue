<template>
  <div>
    <Form v-model="it" :label-width="120">
      <FormItem label="指标名称：" prop="">
        <span>{{ it.name || it.indexName }}</span>
      </FormItem>
      <FormItem label="考核占比：" prop="">
        <Input
          v-model="it.proportion"
          style="width: 240px; margin-right: 4px"
          :maxlength="9"
          placeholder="请输入考核占比"
          @on-keyup="toNumber(it.proportion)"
        ></Input
        >%
      </FormItem>
      <!-- 子指标展示 -->
      <FormItem v-if="isParent" label="" prop="">
        <div class="sub-con">
          <div
            v-for="(item, index) in it.indexRuleJson"
            :key="item.childIndexId"
            :class="{ active: index - it._subIndex === 0 }"
            class="sub-item pr"
            @click="subTargetClick(index, it)"
          >
            <Icon
              class="close-ic"
              type="ios-close"
              size="16"
              @click.stop="deleteSubTarget(index, it)"
            ></Icon>
            {{ item.childIndexName }}
          </div>
        </div>
      </FormItem>
      <!-- 子指标展示 end -->

      <!-- 父指标的 考核规则 -->
      <FormItem v-if="isParent" label="考核规则:" prop="">
        <Row>
          <Col span="16">阶梯标准:</Col>
          <Col span="8">系数</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup
              v-model="it.indexRuleJson[+it._subIndex].indexRule.way"
              type="button"
            >
              <Radio :label="0" v-show="it.indexRuleJson[+it._subIndex].indexRule.way == 0">百分比</Radio>
              <Radio :label="1" v-show="it.indexRuleJson[+it._subIndex].indexRule.way == 1">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br />
        <Row
          :key="index"
          v-for="(item, index) in it.indexRuleJson[+it._subIndex].indexRule
            .definition"
          class-name="row-c"
        >
          <Col span="14">
            <Input
              v-model="item.min"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="numValid(item.min, 'min', item, it.indexRuleJson.way)"
            ></Input>
            <span
              v-if="`${it.indexRuleJson[+it._subIndex].indexRule.way}` === '0'"
              >%</span
            >
            <Select v-model="item.minSign" style="width: 60px">
              <Option
                :key="index"
                :value="item.value"
                v-for="(item, index) in operateList" >{{ item.label }}</Option
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
              @on-keyup="numValid(item.max, 'max', item, it.indexRuleJson.way)"
            ></Input>
            <span
              v-if="`${it.indexRuleJson[+it._subIndex].indexRule.way}` === '0'"
              >%</span
            >
          </Col>
          <Col span="10">
            <Button
              :type="item.isIndex ? 'default' : 'primary'"
              @click="typeChange(0, item)"
            >数值</Button>
            <Button
              :type="item.isIndex ? 'primary' : 'default'"
              @click="typeChange(1, item)"
              class="gap-1"
            >指标</Button>
            <Input
              v-if="!item.isIndex"
              v-model="item.coefficient"
              style="width: 100px"
              :maxlength="99"
              placeholder=""
            ></Input>
            <Button
              v-else
              style="width: 100px;"
              @click="selectRowIndicator(item)"
            >
              <span style="display: inline-block; width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ item.subIndex ? item.subIndex.name : "请选择" }}</span>
            </Button>
            <Icon
              v-if="
                it.indexRuleJson[+it._subIndex].indexRule.definition &&
                it.indexRuleJson[+it._subIndex].indexRule.definition.length > 1
              "
              @click="
                removeSubItem(
                  index,
                  it.indexRuleJson[+it._subIndex].indexRule.definition
                )
              "
              class="remove-icon"
              size="24"
              type="ios-remove-circle-outline"
            />
            <Icon
              @click="
                addSubItem(
                  it.indexRuleJson[+it._subIndex].indexRule.definition,
                  index
                )
              "
              class="add-icon"
              size="24"
              type="ios-add-circle-outline"
            />
          </Col>
        </Row>
      </FormItem>
      <FormItem v-else label="考核规则:" prop="">
        <Row>
          <Col span="16">阶梯标准:</Col>
          <Col span="8">系数</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup v-model="it.indexRuleJson.way" type="button">
              <Radio :label="0" v-show="it.indexRuleJson.way == 0">百分比</Radio>
              <Radio :label="1" v-show="it.indexRuleJson.way == 1">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br />
        <Row
          :key="index"
          v-for="(item, index) in it.indexRuleJson.definition"
          class-name="row-c"
        >
          <Col span="14">
            <Input
              v-model="item.min"
              style="width: 60px"
              :maxlength="10"
              placeholder=""
              @on-keyup="numValid(item.min, 'min', item, it.indexRuleJson.way)"
            ></Input>
            <span v-if="`${it.indexRuleJson.way}` === '0'">%</span>
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
              @on-keyup="numValid(item.max, 'max', item, it.indexRuleJson.way)"
            ></Input>
            <span v-if="`${it.indexRuleJson.way}` === '0'">%</span>
          </Col>
          <Col span="10">
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
              style="width: 100px"
              :maxlength="99"
              placeholder=""
            ></Input>
            <Button
              v-else
              style="width: 100px"
              @click="selectRowIndicator(item)"
            >
              <span style="display: inline-block; width: 80px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ item.subIndex ? item.subIndex.name : "请选择" }}</span>
            </Button>
            <Icon
              v-if="
                it.indexRuleJson.definition &&
                it.indexRuleJson.definition.length > 1
              "
              @click="removeItem(index, it.indexRuleJson.definition)"
              class="remove-icon"
              size="24"
              type="ios-remove-circle-outline"
            />
            <Icon
              @click="addItem(index, it.indexRuleJson.definition)"
              class="add-icon"
              size="24"
              type="ios-add-circle-outline"
            />
          </Col>
        </Row>
      </FormItem>
      <FormItem label="考核说明：" prop="remark">
        <Input
          type="textarea"
          v-model="it.remark"
          :rows="4"
          :maxlength="500"
          style="width: 90%"
          placeholder="请输入"
        />
      </FormItem>
      <FormItem v-if="isSys" label=" ">
        <Row class="tip"
          >重要提醒:
          该指标需要设定考核的基准目标，请在【考核指标目标设置管理】中设定。</Row
        >
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
import { operateList } from "../tool/config";
import indicatorSingle from "../city/components/indicator-single";

const MAX_RULE_NUM = 5;
const standard = {
  coefficient: "", // 系数
  max: "", // 范围大值
  maxSign: "", // 范围结束条件符号
  min: "", // 范围小值
  minSign: "", // 范围开始条件符号
};
export default {
  name: "indicator-cp",
  props: {
    cData: {
      type: Object,
      default: function () {
        return {
          indexRuleJson: "",
        };
      },
    },
  },
  components: { indicatorSingle },
  computed: {
    // 系统指标
    isSys({it}) {
      return it?.type - 1 === 0
    },
    // 父子标
    isParent({it}) {
      return it?.parentFlag - 1 === 0
    }
  },
  data() {
    return {
      indicatorShow: false,
      selectedRow: {},
      indicatorParams: {},
      indicatorSelected: undefined,
      operateList,
      it: JSON.parse(JSON.stringify(this.cData)),
    };
  },
  methods: {
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
    typeChange(v, item) {
      item.isIndex = v;
      this.$forceUpdate()
    },
    getData() {
      return this.$data;
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
    addSubItem(list) {
      if (list.length < MAX_RULE_NUM) {
        list.push({ ...standard });
      }
    },
    // 删除子指标
    deleteSubTarget(i, json) {
      let list = json.indexRuleJson;
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
    numValid(val, key, item, ori) {
      // 百分比 数值 设置 不做任何校验
      return;
      let v = `${val}`;
      v = `${val}`.replace(/[^\d\.\-]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      // if (ori - 1 !== 0) {
      //   if (v > 100) {
      //     v = 100;
      //   } else if (v < 0) {
      //     v = 0;
      //   }
      // }
      // this.addForm.standard.definition[index][key] = v;
      item[key] = v;
    },
    toNumber(val) {
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 6) {
        v = Number(v).toFixed(6);
      }
      if (v > 100) {
        v = 100;
      } else if (v < 0) {
        v = 0;
      }
      this.it.proportion = v;
      this.$emit("proportion-change")
    },
  },
};
</script>


<style scoped lang="less">
/deep/ textarea.ivu-input {
  height: 160px;
  resize: none;
}
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
.opt-content {
  background-color: rgba(238, 238, 238, 0.3);
  position: relative;
  padding: 20px 0;
  margin: 0 40px 20px;

  .delete {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 99;
    color: #2d8cf0;
    padding: 10px;
  }
}
.reg-text {
  color: #2d8cf0;
  margin: 0 8px;
}
.agent-list {
  max-height: 160px;
  overflow-y: auto;
  margin-bottom: 20px;
}
.a-l {
  margin: 0 6px 10px;
}
.item-width {
  width: 300px;
}
.sub-con {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
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
.all-s {
  margin-right: 60px;
  color: #2d8cf0;
}
.tip {
  color: #ed4014;
}
</style>
