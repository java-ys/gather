<template>
  <div>
    <div class="customer">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
    </div>
    <div>
      <Tabs v-model="type" @on-click="changetab">
        <TabPane label="出勤"  name="name1">
          <components ref="child1" :attedType="1"></components>
        </TabPane>
        <TabPane label="休息"  name="name2">
          <components ref="child2" :attedType="2"></components>
        </TabPane>
        <TabPane label="请假"  name="name3">
          <components ref="child3" :attedType="3"></components>
        </TabPane>
        <TabPane label="旷工"  name="name4">
          <components ref="child4" :attedType="6"></components>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script>
import { inputList } from "./index.js";
import components from "./components.vue"
export default {
  components: {
    components
  },
  data() {
    return {
      inputList,
      type: this.$route.query.actualDutyType,
      params: {}
    };
  },
  mounted(){
    inputList[0].value = ""
    this.getParList()
  },
  methods: {
    getParList() {
      switch(this.type) {
        case  "name1":
          this.$refs.child1.getList()
          break
        case "name2":
          this.$refs.child2.getList()
          break
        case "name3":
          this.$refs.child3.getList()
          break
        case "name4":
          this.$refs.child4.getList()
          break
      }
    },
    reset() {
      switch(this.type) {
        case  "name1":
          this.$refs.child1.resetChil()
          break
        case "name2":
          this.$refs.child2.resetChil()
          break
        case "name3":
          this.$refs.child3.resetChil()
          break
        case "name4":
          this.$refs.child4.resetChil()
          break
      }
    },
    changetab(){
      let data = {}
      if(inputList[0].value){
        data = {driverName: inputList[0].value}
      }
      this.search(data)
    },
    search(data) {
      switch(this.type) {
        case  "name1":
          this.$refs.child1.searchChil(data)
          break
        case "name2":
          this.$refs.child2.searchChil(data)
          break
        case "name3":
          this.$refs.child3.searchChil(data)
          break
        case "name4":
          this.$refs.child4.searchChil(data)
          break
      }
    },
  }
};
</script>
