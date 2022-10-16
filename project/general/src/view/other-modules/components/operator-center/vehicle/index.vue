<!--
 * @Description: 
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-11-10 13:59:02
 -->
<!--车辆管理入口-->
<template>
    <div class="vehicle">
        <Tabs v-model="TypeFlag">
          <TabPane label="快享" name="4" v-if="$checkHasBtn('vehicle-express-car-tab')">
              <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 4" :cascaderList="operatorTree"></ExpressCenter>
          </TabPane>
          <TabPane label="惠享" name="6" v-if="$checkHasBtn('vehicle-express-car-tab')">
              <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 6" :cascaderList="operatorTree"></ExpressCenter>
          </TabPane>
          <TabPane label="专享" name="2" v-if="$checkHasBtn('vehicle-special-car-tab')">
             <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 2" :cascaderList="operatorTree"></ExpressCenter>
          </TabPane>
          <TabPane label="出租车" name="1" v-if="$checkHasBtn('vehicle-taxi-tab')">
             <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 1" :cascaderList="operatorTree"></ExpressCenter>
          </TabPane>
        </Tabs>
    </div>
</template>
<script>
import ExpressCenter from './express-center.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'manage',
  components: {ExpressCenter},
  data(){
    return{
      TypeFlag:'4'
    }
  },
  mounted() {
    this.getAccessAgentList()
    let TypeFlag = this.$route.params.businessType || '4';
    switch (TypeFlag) {
      case 1: 
        this.TypeFlag = '1';
        break;
      case 2: 
        this.TypeFlag = '2';
        break;
      case 3: 
        this.TypeFlag = '3';
        break;
      case 4: 
        this.TypeFlag = '4';
        break;
      case 6: 
        this.TypeFlag = '6';
        break;
      default: 
        this.TypeFlag = '4';
    }
  },
  computed: mapState({
    operatorTree: state => state.common.accessAgentList
  }),
  methods:{
    ...mapActions([
      'getAccessAgentList',
    ])
  }
}
</script>
<style lang="less">
  .vehicle {
    .ivu-tabs {
      overflow: inherit;
    }
  }
</style>

