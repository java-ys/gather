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
        <FormItem label="指标说明:" prop="person">
          <span>{{ detail.remark }}</span>
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
            v-for="(item, index) in detail._stardard.definition"
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
        <Button type="primary" ghost @click="cancle">关闭</Button>
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
  data() {
    console.log(this.detail._stardard);
    return {
      way: this.detail._stardard ? this.detail._stardard.way : 0,
    };
  },
  methods: {
    cancle() {
      this.$emit("close");
    },
  },
};
</script>


<style scoped>
.sym {
  margin: 0 10px;
}
.row-c {
  margin-bottom: 8px;
}
</style>