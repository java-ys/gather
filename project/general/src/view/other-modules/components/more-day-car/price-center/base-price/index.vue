<template>
  <div>
    <Form
      inline="inline"
      :label-width="85"
    >
      <FormItem label="城市:">
        <Select
          v-model="searchParams.cityCodeList"
          style="width: 250px"
          filterable
          clearable
        >
          <Option
            v-for="(value, key, index) in authCityMap"
            :key="key"
            :value="key"
          >
            {{ value }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="状态"
        prop="states"
      >
        <Select
          v-model="searchParams.states"
          clearable
          style="width: 150px"
        >
          <Option :value="1">
            生效中
          </Option>
          <Option :value="0">
            待生效
          </Option>
          <Option :value="-2">
            已失效
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="产品线"
        prop="productLine"
      >
        <Select
          v-model="searchParams.productLine"
          clearable
          style="width: 150px"
        >
          <Option :value="4">
            快享
          </Option>
          <Option :value="2">
            专享
          </Option>
        </Select>
      </FormItem>
      <br />
      <FormItem label="策略名称:">
        <Input
          v-model="searchParams.strategyName"
          clearable="clearable"
          style="width: 250px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="创建人:">
        <Input
          v-model="searchParams.creatorName"
          clearable="clearable"
          style="width: 150px"
          :maxlength="20"
        />
      </FormItem>
      <FormItem
        label="车型等级:"
        prop="vehicleLevel"
      >
        <Select
          v-model="searchParams.vehicleLevel"
          clearable
          style="width: 150px"
        >
          <!--  1经济型 2舒适型 3行政型 4商务型 5尊贵型 -->
          <Option :value="1">
            经济型
          </Option>
          <Option :value="2">
            舒适型
          </Option>
          <Option :value="3">
            行政型
          </Option>
          <Option :value="4">
            商务型
          </Option>
          <Option :value="5">
            尊贵型
          </Option>
          <Option :value="9">
            豪华型
          </Option>
        </Select>
      </FormItem>

      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right: 20px; margin-left: 40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">
          清空
        </Button>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'day-baseprice-add'"
      type="primary"
      style="margin-bottom: 10px"
      @click="addData"
    >
      新增策略
    </Button>
    <v-table
      :currPage="searchParams.currPage"
      :total="searchParams.total"
      :pageSize="searchParams.pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <handle
      ref="handle"
      :cityList="authCityMap"
      @reload="reload"
    />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import { mapActions, mapState } from "vuex";
import handle from "./handle";

import {
  basicPricingQueryPage,
  basicPricingDelete,
  basicPricingDetail,
} from "_o/api/more-day-car";
export default {
  components: {
    handle,
  },
  data() {
    let { columns } = listColumns;
    return {
      columns: columns(this),
      copyData: "",
      tableData: [],
      defaulstSearchParams: {
        cityCodeList: [],
        states: "",
        productLine: "",
        strategyName: "",
        creatorName: "",
        vehicleLevel: "",
        currPage: 1,
        total: 0,
        pageSize: 10,
      },
      searchParams: {},
    };
  },
  mounted() {
    this.init();
    this.getAuthCityList();
  },
  computed: mapState({
    authCityMap: (state) => state.common.authCityMap,
  }),
  methods: {
    ...mapActions(["getAuthCityList"]),
    init() {
      this.searchParams = JSON.parse(JSON.stringify(this.defaulstSearchParams));
      this.getTableList();
    },
    getTableList() {
      let params = JSON.parse(JSON.stringify(this.searchParams));
      if (params.states || params.states === 0) {
        params.states = [this.searchParams.states];
      } else {
        delete params.states;
      }
      if (params.cityCodeList) {
        params.cityCodeList = [this.searchParams.cityCodeList]
      }
      basicPricingQueryPage(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.searchParams.total = data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    search() {
      this.searchParams.currPage = 1;
      this.getTableList();
    },
    changePage(page) {
      this.searchParams.currPage = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.searchParams.pageSize = pageSize;
      this.getTableList();
    },
    deleteData(uuid) {
      let params = { multidayStrategyUuid: uuid };
      this.$Modal.confirm({
        title: "操作",
        content: "<p>确认要删除吗？</p>",
        onOk: () => {
          basicPricingDelete(params).then((res) => {
            this.getTableList();
            this.$Message.success("删除成功");
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    goDetail(uuid) {
      let params = { multidayStrategyUuid: uuid };
      basicPricingDetail(params).then((res) => {
        this.$refs.handle.init({ ...res.data.data, isDetail: true });
      });
    },
    copy(uuid) {
      let params = { multidayStrategyUuid: uuid };
      basicPricingDetail(params).then((res) => {
        this.copyData = res.data.data;
        this.$refs.handle.init(this.copyData);
      });
    },
    addData() {
      this.$refs.handle.init();
    },
    reload() {
      this.searchParams = JSON.parse(JSON.stringify(this.defaulstSearchParams));
      this.copyData = "";
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-radio-group {
  margin-top: -4px;
}
</style>
