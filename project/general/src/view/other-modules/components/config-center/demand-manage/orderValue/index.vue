<!--产品线管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <!-- <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList> -->
      <Form inline="inline" :label-width="85">
        <FormItem label="省/市" prop="">
          <Cascader
            v-model="cityCodeArr"
            :data="cityList"
            style="width: 200px;"
            filterable
            @on-change="editCascaderChange"
            @on-clear="clearCascader"
          ></Cascader>
        </FormItem>
        <FormItem label="产品线" prop="">
          <Select
            v-model="searchListParams.businessType"
            clearable
            style="width: 150px;"
            placeholder="请选择产品线"
          >
            <Option value="4">快享</Option>
            <Option value="2">专享</Option>
            <Option value="1">出租车</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="0">
          <Button
            type="primary"
            @click="search"
            style="margin-right: 20px; margin-left: 40px;"
            >查询</Button
          >
          <Button @click="reset()">重置</Button>
        </FormItem>
      </Form>
      <Button
        type="primary"
        @click="popView"
        v-hasAuth="'orderValue-add'"
        >新增策略
      </Button>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
        style="margin-top: 25px;"
      ></VTable>
    </div>
    <add ref="add" @reload="getTableList()" />
  </div>
</template>

<script>
import {
  returnFields,
  inputList,
  statusData,
  businessTypeData,
} from "./fields";
import { keys } from "@/libs/tools";
import VTable from "_a/v-table/v-table";
import SearchList from "_a/search-list/search-list";
import {
  highLowList,
  updateProductLineStatus,
  highLowDelete,
} from "_o/api/configData.js";
import { getProvinceCityAllList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import add from "./add.vue";
export default {
  components: {
    VTable,
    SearchList,
    add,
  },
  data() {
    return {
      ...returnFields(this),
      title: "",
      cityUuid: "",
      tableData: [],
      cityList: [],
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      searchListParams: {}, // 保存搜索条件参数
      cityCodeArr: [],
    };
  },
  mounted() {
    this.getProvinceCityList();
    this.getTableList();
  },
  methods: {
    getProvinceCityList() {
      getProvinceCityAllList().then((res) => {
        // 获取已开通省、市级联列表
        let list = cpTranslate(res.data.data);
        this.cityList = list;
      });
    },
    getTableList() {
      const params = this.searchListParams;
      // 获取表格数据
      params.pageSize = this.pageSize;
      params.currPage = this.current;
      if (!params.cityUuid) {
        delete params.cityUuid;
      }
      highLowList(params).then((res) => {
        this.tableData = (res.data.data && res.data.data.list) || [];
        this.total = (res.data.data && res.data.data.totalCount) || 0;
      });
    },
    search() {
      this.current = 1;
      // this.searchListParams = { ...data };
      this.getTableList();
    },
    reset() {
      this.current = 1;
      this.searchListParams = {};
      this.clearCascader();
      this.getTableList();
    },
    selectObj(val) {
      this.current = val;
      this.getTableList();
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    goDetail(val) {
      this.$refs.add.init({
        from: "detail",
        uuid: val.uuid,
        businessType: val.businessType,
        cityList: this.cityList,
      });
    },
    goEdit(val) {
      this.$refs.add.init({
        from: "edit",
        uuid: val.uuid,
        businessType: val.businessType,
        cityList: this.cityList,
      });
    },
    popView() {
      this.$refs.add.init({
        from: "add",
        cityList: this.cityList,
      });
    },
    deleteData(uuid) {
      let params = { uuid: uuid };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>请再次确实要执行该删除操作!</p>",
        onOk: () => {
          highLowDelete(params).then((res) => {
            this.$Message.info("删除成功！");
            this.getTableList();
          });
        },
        onCancel: () => {
          this.$Message.info("已取消");
        },
      });
    },
    clearCascader() {
      this.searchListParams.cityUuid = "";
      this.cityCodeArr = [];
    },
    editCascaderChange(value, selectedData) {
      if (value && value.length) {
        this.searchListParams.cityUuid =
          selectedData[selectedData.length - 1]["cityUuid"];
      } else {
        this.searchListParams.cityUuid = "";
      }
    },
  },
};
</script>
<style scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
