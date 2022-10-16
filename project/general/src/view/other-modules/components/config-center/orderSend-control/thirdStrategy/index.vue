<template>
  <div>
    <search :cityList="provinceCityList" @search="search" @reset="clear" />
    <Button
      v-hasAuth="'strategy_control-priorityAdd'"
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
  </div>
</template>

<script>
import { listColumns } from "./fields";
import { getWholeRegion } from "_g/api/common.js";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  getallOrderDispatchQuery,
  delStrategy,
  getAreaInfoByCityCode
} from "_o/api/configData.js";
import { cpTranslate } from "@/libs/tools";
import { getEnv } from "@/libs/util";
import search from "./search.vue";
export default {
  components: { search },
  data() {
    let { columns } = listColumns;
    return {
      provinceCityList: [],
      channelSource: "",
      provinceCityCode: [],
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      searchData: {} // 查询数据
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: state => state.common.bizTypeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  watch: {

  },
  mounted() {
    this.init();
    this.getCityList();
  },
  methods: {
    ...mapActions([
      "getGradeList"
    ]),
    init() {
      this.channelSource = "";
      this.provinceCityCode = [];
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
      this.getGradeList();
    },
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
    clear() {
      this.searchData = {}
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      const params = {
        ...this.searchData,
        currPage: this.current,
        pageSize: this.pageSize
      }
      getallOrderDispatchQuery(params)
        .then((res) => {
          let data = res.data.data || {};
          this.tableData = data.list;
          this.total = data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((error) => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    search(params) {
      this.searchData = params
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
    deleteData(uuid) {
      let params = { uuid: uuid };
      this.$Modal.confirm({
        title: "请再次确认要执行该 删除 操作！",
        onOk: () => {
          delStrategy(params).then((res) => {
            this.getTableList();
            this.$Message.info("操作成功！");
          });
        },
      });
    },
    goDetail(val) {
      // let data = JSON.parse(JSON.stringify(val));
      // data.isDetail = true;
      this.$router.push({
        path: "/configCenter/orderFirstRule_add",
        query: {
          fromSource: 3,
          uuid: val.uuid
        }
      })
      // this.$refs.handle.init(data);
    },
    goEdit(val) {
      // let data = JSON.parse(JSON.stringify(val));
      this.$router.push({
        path: "/configCenter/orderFirstRule_edit",
        query: {
          fromSource: 2,
          uuid: val.uuid
        }
      })
      // this.$refs.handle.init(data);
    },
    goCopy(val) {
      this.$router.push({
        path: "/configCenter/orderFirstRule_copy",
        query: {
          uuid: val.uuid
        }
      })
    },
    goViewDetail(row) {
      const env = getEnv();
      let url = "";
      if (env === "test") {
        url = `http://10.4.45.135:37799/webroot/decision/view/report?viewlet=派单策略%2F订单优先级.cpt&op=view&uuid=${row.uuid}`
      }
      if (env === "prod") {
        url = `https://bi.m2cn.cn/webroot/decision/view/report?viewlet=派单策略%2F订单优先级.cpt&op=view&uuid=${row.uuid}`
      }
      url && window.open(url)
    },
    addData() {
      // this.$refs.handle.init();
      this.$router.push({
        path: "/configCenter/orderFirstRule_add",
        query: {
          fromSource: 1
        }
      })
    },
    reload() {
      this.getTableList();
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-radio-group {
  margin-top: -4px;
}
</style>
