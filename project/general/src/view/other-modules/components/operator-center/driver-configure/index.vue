<template>
  <div class="driver-configure">
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <div class="button-wrap">
      <Button type="primary" v-hasAuth="'driver-configure-add'" @click="addConfigure">新增推荐奖励页面</Button>
    </div>
    <v-table ref="driverList" :current="tableConfig.current" :total="tableConfig.total" :pageSize="tableConfig.pageSize" :parColumns="tableColumns" :parTableData="tableConfig.tableData" @changePage="tablePageChange" @changePageSize="tablePageSizeChange">
    </v-table>
    <!-- 操作记录弹框 -->
    <Modal v-model="showRecord" width="960" title="操作记录">
      <div class="showRecord-content">
        <v-table :current="modalTable.current" :pageSize="modalTable.pageSize" :total="modalTable.total" :parColumns="modalTable.tableColumns" :parTableData="modalTable.tableData" :isShowPage="true" @changePage="modalTablePageChange" @changePageSize="modalTablePageSizeChange">
        </v-table>
      </div>
      <div slot="footer">
        <Button type="primary" @click="showRecord = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>


<script>
import { mapActions, mapGetters, mapMutations } from "vuex"
import { cpTranslate } from "@/libs/tools";
import { inputList, tableColumns, modalTableColumns } from "./conf";
import {
  getCityList,
  getRecommendList,
  recommendOpen,
  recommendClose,
  recommendLog
} from "_o/api/operator-carrier";

export default {
  name: "driver-configure",
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      cityList: [], // 城市
      showRecord: false, // 操作记录
      id: "",
      tableColumns: tableColumns(this),
      // tableConfig: {
      //   searchParams: {},
      //   current: 1,
      //   total: 0,
      //   pageSize: 10,
      //   tableColumns: tableColumns(this),
      //   tableData: []
      // },
      modalTable: {
        current: 1,
        pageSize: 10,
        total: 0,
        tableColumns: modalTableColumns(this),
        tableData: []
      }
    };
  },
  mounted() {
    this.translateCityList();
    this.getTableConfigData();
  },
  computed: {
    tableConfig() {
      return this.$store.state['operator-center/dirver-reward-page-config'].tableConfig;
    }
  },
  methods: {
    addConfigure() {
      this.$router.push({
        path: "/opCenter/recomd-driver-manage/driver-reward-page-config/create"
      });
    },
    editConfigure(id) {
      this.$router.push({
        path:
          "/opCenter/recomd-driver-manage/driver-reward-page-config/edit/" + id
      });
    },
    translateCityList() {
      getCityList({}).then(res => {
        let list = cpTranslate(res.data.data);
        this.inputList[3].cascaderList = [
          { label: "全国所有城市", value: 1 },
          ...list
        ];
        this.cityList = [{ label: "全国所有城市", value: 1 }, ...list];
      });
    },
    // 获取列表数据
    getTableConfigData(params = this.tableConfig.searchParams) {
      let conf = {
        currPage: this.tableConfig.current,
        pageSize: this.tableConfig.pageSize
      };
      params = Object.assign(conf, params);
      getRecommendList(params).then(res => {
        let list = res.data.data.list;
        this.tableConfig.tableData = list;
        this.tableConfig.total = res.data.data.totalCount;
      });
      this.$store.commit("changeLoadingFlag", false);
    },
    // 终止数据
    finishData(data) {
      recommendClose({
        id: data.id
      }).then(res => {
        this.$Message.success("推荐奖励配已被终止");
        this.getTableConfigData();
      });
    },
    // 启用数据
    openData(data) {
      recommendOpen({
        id: data.id
      }).then(res => {
        this.$Message.success("推荐奖励配已被启用");
        this.getTableConfigData();
      });
    },
    // 获取操作记录列表数据
    getModalTableData(id) {
      this.id = id;
      recommendLog({
        businessCode: 1,
        businessId: id,
        currPage: this.modalTable.current,
        pageSize: this.modalTable.pageSize
      }).then(res => {
        this.modalTable.tableData = res.data.data.list;
        this.modalTable.total = res.data.data.totalCount;
      });
    },
    searchData(params) {
      // 全国所有城市
      if (params.provinceCode === "1") {
        params.cityCode = "1";
      }
      this.tableConfig.searchParams = params;
      this.tableConfig.current = 1;
      this.getTableConfigData();
    },
    resetData() {
      // 重置搜索条件与分页
      this.tableConfig.current = 1;
      this.tableConfig.searchParams = {};
      this.getTableConfigData();
    },
    tablePageChange(page) {
      this.tableConfig.current = page;
      this.getTableConfigData();
    },
    tablePageSizeChange(pageSize) {
      this.tableConfig.pageSize = pageSize;
      this.getTableConfigData();
    },
    modalTablePageChange(page) {
      this.modalTable.current = page;
      this.getModalTableData(this.id);
    },
    modalTablePageSizeChange(pageSize) {
      this.modalTable.pageSize = pageSize;
      this.getModalTableData(this.id);
    }    
  }
};
</script>

<style lang="less">
.driver-configure {
  .button-wrap {
    margin-bottom: 20px;
  }
}
</style>