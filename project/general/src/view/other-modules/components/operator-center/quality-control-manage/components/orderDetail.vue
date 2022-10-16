<!--suppress ALL -->
<template>
  <div>
    <search-list :inputList="inputList" :spreadStatus="true" @on-search="searchData" @on-reset="resetData"></search-list>
    <export-file exportUrl="/admin/driver/compliance/workOrderList/export" btnText="批量导出" :queryData="searchParams"
      exportFileName="工单明细.xls" style="margin-bottom: 20px;" v-hasAuth="'order-detail-export'"></export-file>
    <v-table :current="current" :page-size="pageSize" :total="total" :par-columns="columns" :par-table-data="tableData"
      @changePage="changePage" @changePageSize="changePageSize"></v-table>

    <order-detail-modal ref="orderDetailModal"></order-detail-modal>
  </div>
</template>

<script>
import { orderDetail } from './fields';
import orderDetailModal from './orderDetailModal';
import exportFile from '_a/export-file/exportFile.vue';
import { mixins } from './fields.js';
import { getConfigCityList } from '_g/api/common.js';
import { getOrderDetailList, getOrderDetail, toResult, getOrderTypeData } from '_o/api/quality-control.js';

let { inputList, columns } = orderDetail;
export default {
  name: 'orderDetail',
  components: { orderDetailModal, exportFile },
  props: {
    cityList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      inputListMap: {
        cityList: 4
      },
      searchParams: {},

      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: []
    };
  },
  mixins: [mixins],
  async mounted() {
    await this.setInputList();
    this.getTableData();
  },
  methods: {
    async setInputList() {
      const [err, data] = await toResult(getOrderTypeData());
      if (err) this.inputList[2].cascaderList = [];
      let list = this.translateData(data.children);
      this.inputList[2].cascaderList = list;
    },
    translateData(arr) {
      let list = [];
      for (let i = 0, length = arr.length; i < length; i++) {
        let obj = {};
        if (arr[i].children) {
          obj.children = this.translateData(arr[i].children);
        }
        obj.label = arr[i].description;
        obj.value = arr[i].node.orderLevelCode;
        list.push(obj);
      }
      return list;
    },
    searchData(params) {
      this.$store.commit('changeLoadingFlag', false);
      if(!!params.handleStartTime !== !!params.handleEndTime) {
        this.$Message.error('请输入完整处理耗时');
        return
      }
      if(params.handleStartTime && (params.handleStartTime > 9999 || params.handleEndTime > 9999)) {
        this.$Message.error('处理耗时输入不能大于9999');
        return
      }
      params.cityName && (params.cityName = params.cityName.split('-')[1]);
      // 结束时间为当天的23:59:59
      params.createEndTime && (params.createEndTime = params.createEndTime + 1000 * 60 * 60 * 23 + 1000 * 60 * 59 + 1000 * 59);
      this.searchParams = params;
      this.current = 1;
      this.getTableData();
    },
    resetData() {
      this.searchParams = {};
      this.current = 1;
      this.getTableData();
    },

    async getTableData() {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      Object.assign(conf, this.searchParams);

      let [err, data] = await toResult(getOrderDetailList(conf));
      if (err) return;
      this.tableData = data.list;
      this.total = data.totalCount;
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.current = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },

    showDetailModal(params) {
      this.$refs.orderDetailModal.getData(params.orderId);
    }
  }
};
</script>
