<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="产品线:">
        <RadioGroup
          v-model="businessType"
          type="button"
          @on-change="changePage(1)"
        >
          <Radio :label="4">快享</Radio>
          <Radio :label="2">专享</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="城市:">
        <Select
          multiple
          style="width: 260px"
          v-model="cityCodeList"
          filterable
          clearable
          @on-change="selectCity"
        >
          <Option
            v-for="(value, key, index) in authCityMap"
            :value="key"
            :key="key"
            >{{ value }}
          </Option>
        </Select>
      </FormItem>

      <FormItem label="生效状态:">
        <RadioGroup v-model="status">
          <Radio label="">
            <span>全部</span>
          </Radio>
          <Radio :label="1">
            <span>生效中</span>
          </Radio>
          <Radio :label="0">
            <span>待生效</span>
          </Radio>
          <Radio :label="-2">
            <span>已失效</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <br />

      <FormItem label="策略名称:">
        <Input
          v-model="ruleName"
          clearable="clearable"
          style="width: 250px"
          :maxlength="50"
      /></FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          @click="search"
          style="margin-right: 20px; margin-left: 40px"
          >查询</Button
        >
        <Button @click="init">清空</Button>
      </FormItem>
    </Form>
    <Button
      v-hasAuth="'day-hexagondiscount-add'"
      type="primary"
      style="margin-bottom: 10px"
      @click="addData"
      >新增策略</Button
    >
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <add ref="add" :cityList="authCityMap" @reload="reload()" />
    <detail ref="detail" :cityList="authCityMap" @reload="reload()" />
    <log ref="log" />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import { mapActions, mapState } from "vuex";
import add from "./add";
import detail from "./detail";
import log from "./log";

import { hexagonList, hexagonDelete, hexagonDetail } from "_o/api/more-day-car";
export default {
  components: {
    add,
    detail,
    log,
  },
  mounted() {
    this.init();
    this.getAuthCityList();
  },
  data() {
    let { columns } = listColumns;
    return {
      businessType: 4,
      cityCodeList: [],
      status: "",
      ruleName: "",
      columns: columns(this),
      tableData: [{}],
      current: 1,
      total: 0,
      pageSize: 10,
      showModal: false,
    };
  },
  computed: mapState({
    authCityMap: (state) => state.common.authCityMap,
  }),
  methods: {
    ...mapActions(["getAuthCityList"]),
    init() {
      this.businessType = 4;
      this.cityCodeList = [];
      this.status = "";
      this.ruleName = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        businessType: this.businessType,
        cityCodeList: this.cityCodeList,
        status: this.status,
        ruleName: this.ruleName,
      };
      hexagonList(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list;
        this.total = data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      console.log(page);
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
        title: "操作",
        content: "<p>确认要删除吗？</p>",
        onOk: () => {
          hexagonDelete(params).then((res) => {
            this.getTableList();
            this.$Message.success("删除成功！");
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    goDetail(uuid) {
      let params = { uuid: uuid };
      hexagonDetail(params).then((res) => {
        this.$refs.detail.init(res.data.data);
      });
    },
    goLog(uuid) {
      this.$refs.log.init(uuid);
    },
    addData() {
      this.$refs.add.init();
    },
    reload() {
      this.cityCodeList = [];
      this.status = "";
      this.ruleName = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    selectCity(val) {
      if (val.length > 15) {
        this.$Message.warning("最多只能选择15个城市");
        this.cityCodeList.pop();
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-radio-group {
  margin-top: -4px;
}
</style>