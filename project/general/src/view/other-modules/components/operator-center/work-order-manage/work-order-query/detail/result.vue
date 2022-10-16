<!--
 * @Author: NapierPLUS
 * @Date: 2021-10-17 11:21:20
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-08 09:40:46
 * @Description:
-->
<template>
  <Card>
    <p slot="title">判责结果</p>
    <Row v-for="(item, index) in tailInfo" :key="index" class="tail">
      <Col span="6">判责结果：司机{{ item.judgeResult === 1 ? "有" : "无" }}责</Col>
      <template v-if="item.judgeResult === 1">
        <Col span="6">判责类型：{{ item.judgeType }}</Col>
        <Col span="6">违规等级：{{ item.illegalLevel }}</Col>
        <Col span="6">处罚金额：{{ item.forfeit }}元</Col>
      </template>
        <Col span="6">处罚类型：{{item.punishTypes | punishTypeF}}</Col>
        <Col span="6">处罚标准：{{item | standardF}}</Col>
    </Row>
  </Card>
</template>

<script>
import { punishTypesMap } from "_o/components/operator-center/work-order-manage/work-order-config/condemn/fields";

export default {
  name: "result",
  props: {
    tailInfo: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    standardF({punishTypes, serviceScore, forfeit}) {
      let s = []
      punishTypes?.forEach(type => {
        if(type - 1 === 0) {
          s.push(forfeit > 0 ? -forfeit : 0)
        } else if(type - 2 === 0 && serviceScore) {
          s.push(typeof serviceScore === 'object' ? serviceScore.value : serviceScore)
        }
      })
      return s.length ? s.join(", ") : "-"
    },
    punishTypeF(v) {
      return v?.map(it => punishTypesMap[it]).join(", ")
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.tail:not(:first-child) {
  margin: 25px 0 0;
}
.class-tit {
  font-size: 17px;
  &::before {
    content: "";
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: none;
    border: 2px solid #98ce62;
    margin-right: 6px;
    position: relative;
  }
}
</style>
