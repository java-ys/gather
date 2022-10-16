<template>
  <div class="quality-control-manage">
    <div class="tab-list">
      <span class="tab-item" v-for="list in tabList" :key="list.value" :class="{'chosen-item': list.value === tabName}"
        @click="chooseItem(list)">
        {{list.label}}
      </span>
    </div>
    <!--需要缓存时加上-->
    <!--<keep-alive></keep-alive>-->
    <transition name="fade" mode="out-in" appear>
      <component :is="tabName" :cityList="cityList"></component>
    </transition>
  </div>
</template>
<script>
import orderDetail from './components/orderDetail.vue';
import orderCollect from './components/orderCollect.vue';
import appealOrderDetail from './components/appealOrderDetail.vue';
import appealOrderCollect from './components/appealOrderCollect.vue';
import orderVideo from './components/orderVideo.vue';
import { getConfigCityList } from '_g/api/common.js';
import { toResult } from '_o/api/quality-control.js';

export default {
  name: 'quality-control-manage',
  components: { orderDetail, orderCollect, appealOrderDetail, appealOrderCollect, orderVideo },
  data() {
    return {
      tabName: 'orderDetail',
      tabList: [
        { label: '工单明细', value: 'orderDetail' },
        { label: '工单汇总统计', value: 'orderCollect' },
        { label: '申诉工单明细', value: 'appealOrderDetail' },
        { label: '申诉工单汇总统计', value: 'appealOrderCollect' },
        { label: '工单视频查看申请审批', value: 'orderVideo' }
      ],

      cityList: []
    };
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    async getCityList() {
      const [err, data] = await toResult(getConfigCityList({}));
      if (!err) {
        this.cityList = data.map(item => {
          return { label: item.city, value: `${item.cityId}-${item.city}` };
        });
      }
    },
    chooseItem(list) {
      this.tabName = list.value;
    }
  }
};
</script>
<style lang="less" src="./components/index.less"></style>
<style lang="less">
.quality-control-manage {
  .tab-list {
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    .tab-item {
      display: inline-block;
      padding: 5px 0;
      border-left: 1px solid #ccc;
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
      cursor: pointer;
      width: 200px;
      text-align: center;
    }

    span:not(:first-child) {
      border-left: none;
    }

    .chosen-item {
      text-decoration: underline;
      font-weight: bold;
    }
  }
}
</style>
