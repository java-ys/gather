<template>
  <div>
    <Row :key="idx" v-for="(it, idx) in list">
      <Col span="6">违规次数: {{it.violationCount}}</Col>
      <Col span="6">等级: {{it.violationLevel | levelF}}</Col>
      <Col span="6">处罚类型: {{it.punishTypes | punishTypeF}}</Col>
      <Col span="6">处罚标准: {{it | standardF}}</Col>
    </Row>
  </div>
</template>

<script>
import {violationLevelMap, punishTypesMap} from "../fields"

export default {
  name: "ladder-punish",
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
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
    levelF(v) {
      return violationLevelMap[v] || "-"
    },
    punishTypeF(v) {
      return v?.map(it => punishTypesMap[it]).join(",")
    }
  },
  data() {
    return {

    }
  }
}
</script>
