<!--
 * @description:
 * @author: Tom Dai
 * @date: 2020-02-17 21:08:11
 * @后台人员:
!-->
<template>
  <div>
    <Tabs value="1">
        <TabPane label="运营商维度" name="1">
            <operatorPage></operatorPage>
        </TabPane>
        <TabPane label="车辆维度" name="2">
          <vehiclePage></vehiclePage>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import operatorPage from './components/operators'
import vehiclePage from './components/vehicle'
import { mapActions } from 'vuex'
export default {
  name: '',
  components: { operatorPage,vehiclePage },
  mounted() {
    //获取公用信息
    this.getCommonData()
    },
  data () {
    return {

    }
  },
  methods:{
    ...mapActions([
      'getCommonData',
    ])
  }
}
</script>
<style scoped lang='less'>
</style>
