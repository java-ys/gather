<template>
  <div>
    <Row>
      <Col span="8">等级: {{data.violationLevel | levelF}}</Col>
      <Col span="8">处罚类型: {{data.punishTypes | punishTypeF}}</Col>
      <Col span="8">处罚标准: {{data | standardF}}</Col>
    </Row>
  </div>
</template>

<script>
import {violationLevelMap, punishTypesMap} from "../fields"

export default {
  name: "base-punish",
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
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
