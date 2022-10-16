<!--
 * @Author: NapierPLUS
 * @Date: 2021-08-03 11:28:11
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-08-03 12:03:37
 * @Description:
-->
<template>
  <div>
    <Modal
      v-model="visible"
      title="推荐奖励配置详情"
      width="900"
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="form" :model="detail" :label-width="150">
        <FormItem label="指标分类：">
          <span>{{ detail.classifyEx }}</span>
        </FormItem>
        <FormItem label="指标类型：">
          <span>{{ detail.typeEx }}</span>
        </FormItem>
        <FormItem label="指标名称：">
          <span>{{ detail.name }}</span>
        </FormItem>
        <FormItem label="指标说明:">
          <span>{{ detail.remark }}</span>
        </FormItem>
        <FormItem label="是否父指标:">
          <RadioGroup
            v-model="detail.parentFlag"
          >
            <Radio :label="0" disabled>否</Radio>
            <Radio :label="1" disabled>是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否主策略:">
          <RadioGroup
            v-model="detail.strategyType"
          >
            <Radio :label="0" disabled>是</Radio>
            <Radio :label="1" disabled>否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="isParent" label="" prop="">
            <div class="sub-con">
              <div
                v-for="(item, index) in detail._stardard"
                :key="item.childIndexId"
                :class="{ active: index - detail._subIndex === 0 }"
                class="sub-item"
                @click="subTargetClick(index, detail, item)"
              >
                {{ item.childIndexName }}
              </div>
            </div>
          </FormItem>
        <FormItem label="考核标准:" prop="">
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
            v-for="(item, index) in (isParent ? detail._stardard[detail._subIndex].indexRule.definition : detail._stardard.definition)"
          >
            <Col span="12">
            <span v-if="item.min !== ''">{{item.min}}</span>
            <span v-if="way - 1 !== 0 && item.min !== ''">%</span>
            <span v-if="item.min !== ''">{{item.minSign|singFmt}}</span>
            <span class="sym">X</span>
            <span v-if="item.max !== ''">{{item.maxSign|singFmt}}</span>
            <span v-if="item.max !== ''">{{item.max}}</span>
            <span v-if="way - 1 !== 0 && item.max !== ''">%</span>
            </Col>
            <Col span="12">
              <span>{{ item.coefficient }}</span>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost @click="cancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>


<script>
export default {
  name: "target-detail",
  filters: {
    singFmt(val) {
      return val === "<=" ? "≤" : val === ">=" ? "≥" : val
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: [Object],
  },
  computed: {
    isParent({detail}) {
      return detail.parentFlag - 1 === 0
    }
  },
  data() {
    return {
      way: this.detail._stardard ? this.detail._stardard.way : 0,
    };
  },
  methods: {
    cancel() {
      this.$emit("close");
    },
    subTargetClick(i, detail, item) {
      detail._subIndex = i
      this.way = item.indexRule.way
      this.$forceUpdate()
    },
  },
};
</script>


<style scoped lang="less">
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
</style>
