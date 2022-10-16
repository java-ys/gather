<template>
  <div class="insurance-info">
    <searchList
      :inputList="inputList"
      :spreadStatus="true"
      @on-search="searchData"
      @on-reset="resetData"
    >
    </searchList>
    <v-table
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <detail ref="detail" />
  </div>
</template>
<script>
import searchList from "_a/search-list/search-list.vue";
import vTable from "_a/v-table/v-table.vue";
import { inputList, tableColumns } from "./conf";
import { getInsuranceList, queryInsuranceFile } from "_o/api/insurance.js";
import detail from "./detail";
export default {
  name: "insurance-info",
  components: { searchList, vTable, detail },
  data() {
    return {
      // 深拷贝用于页面关闭后不缓存数据
      inputList: JSON.parse(JSON.stringify(inputList)),
      searchParams: {},
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: tableColumns(this),
      tableData: []
    };
  },
  mounted() {
    this.getTableData();
  },
  activated() {
    this.getTableData();
  },
  methods: {
    searchData(params) {
      this.current = 1;
      this.searchParams = params;
      this.getTableData(params);
    },
    resetData() {
      this.current = 1;
      this.searchParams = {};
      this.getTableData();
    },
    getTableData(params = this.searchParams) {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      conf = Object.assign(conf, params);

      getInsuranceList(conf).then(res => {
        // 关闭表格loading
        this.$store.commit("changeLoadingFlag", false);

        let data = res.data.data.list;
        this.tableData = data;
        this.total = res.data.data.totalCount;
      });
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    goDetail(val) {
      this.$Spin.show({
        render: h => {
          return h("div", [
            h("Icon", {
              class: "demo-spin-icon-load",
              props: {
                type: "ios-loading",
                size: 18
              }
            }),
            h("div", "加载中...")
          ]);
        }
      });
      queryInsuranceFile({
        insuranceId: val.insuranceId
      })
        .then(res => {
          this.$Spin.hide();
          let params = res.data.data || {};
          if (params.fileId[0] === "{") {
            let fileId = JSON.parse(params.fileId);
            this.$Message.error(fileId.data.responseMsg);
          } else {
            this.$refs.detail.init(params);
          }
        })
        .catch(error => {
          this.$Spin.hide();
        });
    }
  }
};
</script>
<style lang="less">
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>
