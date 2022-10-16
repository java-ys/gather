<template>
  <div>
    <!--<SearchList
      :inputList="inputList"
      @on-change="onSearchFieldChange"
      @on-search="search"
      @on-reset="search"
    />-->
    <Search
      :cityList="provinceCityList"
      @searchCarpool="search"
      @resetCarpool="clear"
    />
    <Button v-hasAuth="'carpool-strategy-add'" type="primary" @click="operation(1)"
      >新建策略</Button
    >
    <v-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="params">
        <Button
          v-if="params.data.row.status !== -2"
          ghost
          size="small"
          type="primary"
          style="margin-right: 15px"
          v-hasAuth="'carpool-strategy-disabled'"
          @click="operation(0, params.data.row)"
          >停用</Button
        >
        <Button
          v-if="params.data.row.status !== -2"
          ghost
          size="small"
          type="warning"
          style="margin-right: 15px"
          v-hasAuth="'carpool-strategy-edit'"
          @click="operation(2, params.data.row)"
          >编辑</Button
        >
        <Button
          ghost
          size="small"
          type="success"
          style="margin-right: 15px"
          v-hasAuth="'carpool-strategy-view'"
          @click="operation(3, params.data.row)"
          >查看</Button
        >
        <Button
          ghost
          size="small"
          type="warning"
          style="margin-right: 15px"
          v-hasAuth="'carpool-strategy-copy'"
          @click="operation(4, params.data.row)"
          >复制</Button
        >
      </template>
    </v-table>
  </div>
</template>
<script>
import { getWholeRegion } from "_g/api/common.js";
// import m2Table from "_a/m2-table/v-table";
import Search from "./components/search.vue";
import { parColumns } from "./fields";
import { cpTranslate } from "@/libs/tools";
import { queryCarpoolStrategy, stopCarpoolStrategy } from "_o/api/carpoolConfig.js";
export default {
  name: "carpool-strategy",
  components: {
    // m2Table,
    Search,
  },
  data() {
    return {
      provinceCityList: [],
      parColumns: parColumns(this),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: false,
      showModal: false,
      confirmAction: "",
      filterData: null,
    };
  },
  mounted() {
    this.getCityList();
    this.getTableList();
  },
  methods: {
    // 获取城市列表
    getCityList() {
      getWholeRegion({}).then((res) => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.provinceCityList = listCopy;
        }
      });
    },
    /**
     * 获取策略列表数据
     */
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.filterData
      };
      queryCarpoolStrategy(params)
        .then((res) => {
          let resdata = res.data.data || {};
          this.tableData = (resdata && resdata.list) || [];
          this.total = resdata && resdata.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((err) => {
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    /**
     * 搜索
     */
    search(data) {
      this.filterData = data || {};
      this.current = 1;
      this.getTableList();
    },
    /**
     * 清空
     */
    clear() {
      this.filterData = null;
      this.current = 1;
      this.getTableList();
    },
    /**
     * 操作
     * @param {1|2|3} index 1-启/停，2-编辑，3-详情，4-复制
     * @param {object} row 行数据
     */
    operation(index, row) {
      if (index === 0) {
        this.updateStatus(index, row);
      } else if (index === 4) {
        this.$Modal.confirm({
          title: "复制提醒",
          content: "确认复制该策略?",
          onOk: () => {
            this.$router.push({
              name: "add-carpool-strategy",
              params: row ? { uuid: row.uuid } : null,
              query: { type: index },
            });
          },
          onCancel: () => {
            this.$Message.info("已取消");
          },
        });
      } else {
        this.$router.push({
          name: "add-carpool-strategy",
          params: row ? { uuid: row.uuid } : null,
          query: { type: index },
        });
      }
    },
    /**
     * 启/停用
     */
    updateStatus(index, row) {
      if (index === 0) {
        let s = "停"; // row.status === 0 ? "启" : "停";
        this.$Modal.confirm({
          title: `${s}用提醒`,
          content: `确认${s}用该策略?`,
          onOk: () => {
            stopCarpoolStrategy({
              uuid: row.uuid
            }).then(res => {
              let d = res.data || {};
              if (200 === d.code) {
                this.$message.success(`停用成功`);
                this.getTableList();
              } else {
                this.$message.success(`停用失败`);
              }
            })
          },
          onCancel: () => {
            this.$Message.info("已取消");
          },
        });
      }
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
  },
};
</script>
<style lang="less" scoped></style>
