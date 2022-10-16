<template>
  <div>
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <export-file exportUrl="/admin/driver/compliance/appealWorkOrderStatistics/export" btnText="批量导出" :queryData="searchParams"
      exportFileName="申诉工单汇总统计.xls" style="margin-bottom: 20px;" v-hasAuth="'appeal-order-collect-export'"></export-file>
    <v-table :current="current" :page-size="pageSize" :total="total" :par-columns="columns" :par-table-data="tableData"
      @changePage="changePage" @changePageSize="changePageSize"></v-table>
  </div>
</template>

<script>
import { appealOrderCollect } from './fields';
import exportFile from '_a/export-file/exportFile.vue';
import { mixins } from './fields.js';
import { toResult, getAppealOrderCollectList, getAgentByCity } from '_o/api/quality-control.js';

const { inputList, columns } = appealOrderCollect;
export default {
  name: 'appealOrderCollect',
  components: { exportFile },
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
        cityList: 0,
        agentList: 1
      },
      searchParams: {},

      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns,
      tableData: [{}]
    };
  },
  computed: {
    inputCityList() {
      return this.inputList[this.inputListMap['cityList']];
    }
  },
  mixins: [mixins],
  mounted() {
    this.getTableData();
  },
  methods: {
    async changeCity(value) {
      if(!value) return this.resetInputList({ agentList: [] });
      const [err, data] = await toResult(getAgentByCity({ cityId: value.split('-')[0] }));
      if (err) return this.resetInputList({ agentList: [] });
      if (!data) return this.resetInputList({ agentList: [] });
      this.resetInputList({
        agentList: data.map(item => {
          return {
            label: item.name,
            value: item.name
          };
        })
      });
    },
    searchData(params) {
      // 结束时间为当天的23:59:59
      params.endTime && (params.endTime = params.endTime + 1000 * 60 * 60 * 23 + 1000 * 60 * 59 + 1000 * 59);
      params.cityName && (params.cityName = params.cityName.split('-')[1]);
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
      this.$store.commit('changeLoadingFlag', false);

      const [err, data] = await toResult(getAppealOrderCollectList(conf));
      if (err) return;
      this.tableData = data.pageResult.list;
      this.total = data.pageResult.totalCount;
      if (this.current === 1) {
        this.tableData.unshift({
          createTime: '总计',
          count: data.totalCount
        });
      }
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.current = 1;
      this.pageSize = pageSize;
      this.getTableData();
    }
  },
  watch: {
    inputCityList: {
      handler(value) {
        this.changeCity(value.value);
      },
      deep: true
    }
  }
};
</script>

<style scoped>
</style>
