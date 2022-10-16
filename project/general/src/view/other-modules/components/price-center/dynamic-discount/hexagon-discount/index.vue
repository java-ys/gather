<template>
  <div>
    <Form inline="inline" :label-width="85">
      <FormItem label="业务线:">
        <Select
          v-model="expandBizLine"
          style="width:260px"
          clearable
          @on-change="(v) => { changePage(1);changeExpandBizLine(v) }"
        >
          <Option
            v-for="(m, index) in businessGradeList"
            :key="index"
            :value="m.value"
          >{{m.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="产品线:">
        <Select
          v-model="serviceType"
          style="width:260px"
          clearable
          @on-change="changePage(1)"
        >
          <template v-if="expandBizLine > 0 ">
            <Option
              v-for="(m, index) in bizTypeQueryList"
              :key="index"
              :value="m.value"
            >{{m.label}}</Option>
          </template>
          <template v-else>
            <Option
              v-for="(m, index) in bizTypeList"
              :key="index"
              :value="m.value"
            >{{m.label}}</Option>
          </template>
        </Select>
      </FormItem>

      <FormItem label="城市:">
        <Select
          v-model="cityCodeList"
          multiple
          style="width:260px"
          filterable
          clearable
          @on-change="selectCity"
        >
          <Option
            v-for="(value, key, index) in authCityMap"
            :key="key"
            :value="key"
          >
            {{value}}
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
          v-model="strategyName"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">清空</Button>
      </FormItem>
    </Form>
    <Button type="primary" style="margin-bottom: 10px;" @click="addData">
      新增策略
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
    <add ref="add" :cityList="authCityMap" @reload="reload" />
    <detail ref="detail" :cityList="authCityMap" @reload="reload" />
    <log ref="log" />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import { mapActions, mapState, mapGetters } from "vuex";
import add from "./add";
import detail from "./detail";
import log from "./log";

import { hexagonList, hexagonDelete, hexagonDetail } from "_o/api/priceCenter";
export default {
  components: {
    add,
    detail,
    log
  },
  data() {
    let { columns } = listColumns;
    return {
      serviceType: 4,
      cityCodeList: [],
      status: "",
      strategyName: "",
      columns: columns(this),
      tableData: [{}],
      current: 1,
      total: 0,
      pageSize: 10,
      showModal: false,
      expandBizLine: "",
      bizTypeQueryList: []
      // businessLines: [] // 业务线
    };
  },
  computed: {
    ...mapState({
      authCityMap: state => state.common.authCityMap,
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList,
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.init();
    this.getAuthCityList()
  },
  methods: {
    ...mapActions([
      "getAuthCityList"
    ]),
    init() {
      this.serviceType = 4;
      this.cityCodeList = [];
      this.status = "";
      this.strategyName = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        serviceType: this.serviceType,
        cityCodeList: this.cityCodeList,
        status: this.status,
        strategyName: this.strategyName,
        expandBizLine: this.expandBizLine
      };
      hexagonList(params).then(res => {
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
          hexagonDelete(params).then(res => {
            this.getTableList();
            this.$Message.info("操作成功！");
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
    goDetail(uuid) {
      let params = { uuid: uuid };
      hexagonDetail(params).then(res => {
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
      this.strategyName = "";
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
    changeExpandBizLine(val) {
      if (val) {
        const { children } = this.businessGradeList.find(it => it.value === val)
        this.bizTypeQueryList = children
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-radio-group {
  margin-top: -4px;
}
</style>