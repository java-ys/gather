<template>
  <div>
    <Tabs v-model="tab" :value="tab" class="tabs" type="card" size="small">
      <Tab-pane
        v-for="(tab, index) in tabList"
        :key="tab.value"
        :label="tab.label"
        :name="tab.value"
      >
        <base-punish
          v-if="contentList[index].basicPunish"
          :data="contentList[index].basicPunish"></base-punish>
        <ladder-punish
          v-else-if="contentList[index].ladderCityConfigs.length"
          :list="contentList[index].ladderCityConfigs"></ladder-punish>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
import BasePunish from "./components/basePunish";
import LadderPunish from "./components/ladderPunish";
export default {
  components: {BasePunish, LadderPunish},
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    id: {
      type: [Number, String]
    }
  },
  watch: {
    id() {
      this.tab = '0'
    }
  },
  computed: {
    tabList({list, id}) {
      return this.sepData(list, id).tabs
    },
    contentList({list, id}) {
      return this.sepData(list, id).list
    }
  },
  data() {
    return {
      tab: "0"
    }
  },
  methods: {
    sepData(list, id) {
      let arr = `${id}`.split("|")
      if(arr.length > 1) {
        return this.handleCascadeList(list, arr);
      }
      return this.handleList(list, id);
    },
    handleList(list, id) {
      let f = list.find(it => `${it.id}` === `${id}`);
      let p = []
      let ll = []
      if(f) {
        [{tabs: p, list: ll}] = [this.getPunish(f)];
      }
      return {
        tabs: p,
        list: ll
      }
    },
    // 有子处罚数据
    handleCascadeList(list, ids) {
      let p = []
      let ll = []
      let _this = this
      // 递归获取子处罚
      function getChild(lst, idList) {
        idList.forEach((id, index) => {
          let f = lst.find(it => `${it.id}` === `${id}`);
          if(f) {
            if(f?.children?.length) {
              getChild(f.children, ids.slice(index + 1))
            } else {
              [{tabs: p, list: ll}] = [_this.getPunish(f)];
            }
          }
        })
      }
      getChild(list, ids)
      return {
        tabs: p,
        list: ll
      }
    },
    getPunish(f={}) {
      let p = []
      let ll = []
      if (f.basicPunish && Object.keys(f.basicPunish).length) {
        p.push({
          value: '0',
          label: "固定处罚"
        })
        ll.push({basicPunish : f.basicPunish})
      }
      if (f.openLadderPunish && f.ladderPunish && Object.keys(f.ladderPunish).length) {
        p.push({
          value: '1',
          label: "阶梯处罚"
        })

        let r = [];
        f?.ladderPunish?.ladderConfigs?.forEach(item => {
          item?.ladderCityConfigs?.forEach(it => {
            r = r.concat(it)
          })
        })
        ll.push({ladderCityConfigs: r})
      }
      return {
        tabs: p,
        list: ll
      }
    }
  }
}
</script>
