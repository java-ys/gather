<template>
  <div class="mt-20">
    <Form v-model="formData" :label-width="150">
      <FormItem label="扣减事项：">
        <span>{{ formData.name || formData.indexName }}</span>
      </FormItem>
      <FormItem label="扣减说明：">
        <span>{{ formData.remark }}</span>
      </FormItem>
      <FormItem v-if="isParent" label=" ">
        <div class="sub-con">
          <div
            v-for="(item, index) in formData.indexRuleJson"
            :key="index"
            :class="{ active: index - formData._subIndex === 0 }"
            class="sub-item"
            @click="subTargetClick(index, item)"
          >
            {{ item.childIndexName }}
          </div>
        </div>
      </FormItem>
      <FormItem v-if="isParent" label=" " prop="">
        <Row>
          <Col span="12">阶梯标准:</Col>
          <Col span="12">系数</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup v-model="way" type="button">
              <Radio :label="0" :disabled="!!way">百分比</Radio>
              <Radio :label="1" :disabled="way - 1 !== 0">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <br />
        <Row
          class-name="row-c"
          :key="index"
          v-for="(item, index) in formData.indexRuleJson[formData._subIndex]
            .indexRule.definition"
        >
          <Col span="12">
            <span v-if="item.min !== ''">{{ item.min }}</span>
            <span v-if="formData.indexRuleJson.way - 1 !== 0 && item.min !== ''"
              >%</span
            >
            <span v-if="item.min !== ''">{{ item.minSign | singFmt }}</span>
            <span class="sym">X</span>
            <span v-if="item.max !== ''">{{ item.maxSign | singFmt }}</span>
            <span v-if="item.max !== ''">{{ item.max }}</span>
            <span v-if="formData.indexRuleJson.way - 1 !== 0 && item.max !== ''"
              >%</span
            >
          </Col>
          <Col span="12">
            <span>{{ item.coefficient }}</span>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="" v-if="!isParent">
        <Row>
          <Col span="12">阶梯标准:</Col>
          <Col span="12">系数</Col>
        </Row>
        <Row>
          <Col span="24">
            <RadioGroup v-model="formData.indexRuleJson.way" type="button">
              <Radio :label="0">百分比</Radio>
              <Radio :label="1">数值</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row
          class-name="row-c"
          :key="index"
          v-for="(item, index) in formData.indexRuleJson.definition"
        >
          <Col span="12">
            <span v-if="item.min !== ''">{{ item.min }}</span>
            <span v-if="formData.indexRuleJson.way - 1 !== 0 && item.min !== ''"
              >%</span
            >
            <span v-if="item.min !== ''">{{ item.minSign | singFmt }}</span>
            <span class="sym">X</span>
            <span v-if="item.max !== ''">{{ item.maxSign | singFmt }}</span>
            <span v-if="item.max !== ''">{{ item.max }}</span>
            <span v-if="formData.indexRuleJson.way - 1 !== 0 && item.max !== ''"
              >%</span
            >
          </Col>
          <Col span="12">
            <Button :type="!item.isIndex ? 'primary' : 'default'">数值</Button>
            <Button :type="!!item.isIndex ? 'primary' : 'default'">指标</Button>
            <span>{{ !!item.isIndex ? item.subIndex.name : item.coefficient }}</span>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>

<script>
// 扣减指标详情
export default {
  name: "deduct-detail",
  props: {
    cData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {
    isParent({ cData }) {
      return cData.parentFlag - 1 === 0;
    },
    way({ formData }) {
      return formData.indexRuleJson[formData._subIndex].indexRule.way;
    },
  },
  filters: {
    singFmt(val) {
      return val === "<=" ? "≤" : val === ">=" ? "≥" : val;
    },
  },
  data() {
    return {
      formData: JSON.parse(JSON.stringify(this.cData)),
    };
  },
  methods: {
    subTargetClick(i, item) {
      this.formData._subIndex = i;
    },
  },
};
</script>

<style lang="less" scoped>
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

.mt-20 {
  margin-top: 20px;
}
</style>
