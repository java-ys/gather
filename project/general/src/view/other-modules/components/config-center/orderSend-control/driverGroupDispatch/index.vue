<template>
  <div>
    <Form
      inline="inline"
      :label-width="72"
    >
      <FormItem
        label="适用城市："
        prop="city"
      >
        <Cascader
          v-model="provinceCityCode"
          :data="provinceCityList"
          placeholder="请选择城市"
          trigger="hover"
          filterable
          clearable
          style="width: 200px; display: inline-block"
        ></Cascader>
      </FormItem>

      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right: 20px; margin-left: 40px"
          @click="search"
        >
          搜索
        </Button>
        <Button @click="clear">
          清空
        </Button>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'driver_group_dispatch_add'"
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
import { listColumns, getProvinceNameByCityUuid } from "./fields";
import handle from "./handle";
import { getProvinceCityList } from "_g/api/common.js";
import {
  queryAbsStrategyList,
  deleteAbsStrategyList,
  getAbsDetail
} from "_o/api/operationAdmin.js";
import { cpTranslate } from "@/libs/tools";
import { getEnv } from "@/libs/util";
export default {
  components: {
    handle,
  },
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
    clear() {
      this.provinceCityCode = [];
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        // cityUuid: "408"
      };
      if (this.provinceCityCode.length === 1) {
        params.cityCode = this.provinceCityCode[0];
      }
      if (this.provinceCityCode.length === 2) {
        // params.provinceCode = this.provinceCityCode[0];
        params.cityCode = this.provinceCityCode[1];
      }
      const provinceCityList = this.provinceCityList;
      queryAbsStrategyList(params)
        .then((res) => {
          let data = res.data.data || {};
          this.tableData = data.list.map(item => {
            const province = getProvinceNameByCityUuid(item.cityUuid, item.cityName, provinceCityList);
            item.provinceCity = province + item.cityName;
            return item;
          });
          this.total = data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch((error) => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    search() {
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
      let params = { strategyId: uuid };
      this.$Modal.confirm({
        title: "请再次确认要执行该 删除 操作！",
        onOk: () => {
          deleteAbsStrategyList(params).then((res) => {
            this.getTableList();
            this.$Message.success("操作成功！");
          });
        },
      });
    },
    goDetail(val, isDetail) {
      // let data = JSON.parse(JSON.stringify(val));
      getAbsDetail({strategyId: val.uuid}).then(res => {
        const data = res.data.data;
        data.isDetail = isDetail;
        data.uuid = val.uuid;
        data.ruleName = val.ruleName;
        debugger
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
     goViewDetail(row){
      const env = getEnv();
      let url ="";
      if(env==="test"){
        url = `http://10.4.45.135:37799/webroot/decision/view/report?viewlet=派单策略%2F司机优先级.cpt&op=view&uuid=${row.uuid}`
      }
      if(env === "prod"){
        url = `https://bi.m2cn.cn/webroot/decision/view/report?viewlet=派单策略%2F司机优先级.cpt&op=view&uuid=${row.uuid}`
      }
      url && window.open(url)
    },
  },
};
</script>
