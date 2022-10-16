<template>
  <div>
    <Search :cityList="provinceCityList" @search="search" @reset="clear" />
    <Button
      v-hasAuth="'business_strategy_add'"
      type="primary"
      style="margin-bottom: 10px"
      @click="addData"
    >
      新建策略
    </Button>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <handle
      ref="handle"
      :provinceCityList="provinceCityList"
      @reload="reload"
    />
  </div>
</template>

<script>
import { columns } from "./fields";
import handle from "./handle";
import Search from "./components/search.vue";
import { getProvinceCityList } from "_g/api/common.js";
import {
  bizList,
  bizDetail,
  bizChangeStatus,
} from "_o/api/operationAdmin.js";
import { cpTranslate } from "@/libs/tools";
export default {
  components: {
    handle,
    Search
  },
  data() {
    return {
      provinceCityList: [],
      provinceCityCode: [],
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {} // 查询数据
    };
  },
  mounted() {
    this.getCityList().then(() => {
      this.init();
    }).catch(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.provinceCityCode = [];
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    // 获取城市列表
    getCityList() {
      return getProvinceCityList({}).then((res) => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "cityID", "cityID");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.provinceCityList = listCopy;
        }
      });
    },
    // 表单清空
    clear() {
      this.searchData = {};
      this.provinceCityCode = [];
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    // 列表查询
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        ...this.searchData,
        currPage: this.current,
        pageSize: this.pageSize,
      };
      bizList(params)
        .then(res => {
          let data = res.data.data || {};
          this.tableData = data.list || [];
          this.total = data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((error) => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    search(params) {
      this.searchData = params;
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    // 详情编辑事件
    goDetail(id, isDetail) {
      bizDetail({ id }).then(res => {
        const data = res.data.data;
        data.isDetail = isDetail;
        this.$refs.handle.init(data);
      }).catch(err => {
        console.log(err, "*********")
      });
    },
    addData() {
      this.$refs.handle.init();
    },
    reload() {
      this.getTableList();
    },
    // 切换状态
    changeStatus({ ruleStatus, id }) {
      const newStatus = ruleStatus === 0 ? 1 : 0;
      // 调接口
      bizChangeStatus({ id, ruleStatus: newStatus }).then(res => {
        const data = res.data;
        if (data.code === 200) {
          this.$Message.success("状态更新成功");
          this.getTableList();
        }
      }).catch(err => {
        console.log(err, "*********")
      });
    },

  },
};
</script>
