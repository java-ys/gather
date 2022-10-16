<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="queryChange"
    ></SearchList>
    <div>
      <div class="clearfix mb-20">
        <export-file
          class="fr"
          :isDisabled="exportDisable"
          exportUrl="/api/mall/driver/coupon/open/applicationListExport"
          exportFileName="申请司机列表.xlsx"
          :queryData="idsFilter({...searchData, ...exportParams})"
          :extraQueryData="extraParams"
          :baseUrlKey="baseUrlKey"
          btnText="导出"
          :isMastQuery="true"
        ></export-file>
      </div>
      <m2-table
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @selectHandle="selectHandle"
      ></m2-table>
    </div>
  </div>
</template>

<script>
import { inputList, tableTitle } from "./fields.js";
import { tool } from "_o/api/baseMixin.js";
import m2Table from "_a/m2-table/v-table";
import exportFile from "_a/export-file/exportFile";
import common, { exportMixin } from "../common";
import { applicationListService } from "_o/api/coupon-manage";

export default {
  components: {
    m2Table,
    exportFile
  },
  mixins: [tool, common, exportMixin],
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      exportDisable: true,
      baseUrlKey: "_base4Mall",
      tableColumns: tableTitle(this)
    };
  },
  created() {
    this.func = applicationListService;
    const { agentUuid, id } = this.getRouteParams();
    this.extraParams.agentUuid = agentUuid;
    this.extraParams.configId = id;
    this.getList();
  },
  methods: {
    listSuccess(data) {
      this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      this.truy("exportDisable");
    },
    getRouteParams() {
      return this.$route.query;
    },
    queryChange() {
      let r = {};
      this.inputList.forEach(it => {
        r[it.bind_key] = it.value;
      });
      this.exportParams = {
        ...this.exportParams,
        ...r
      };
    }
  }
};
</script>

<style scoped lang="less">
.mb-20 {
  margin-bottom: 20px;
}
.fr {
  float: right;

  padding-left: 30px;
  padding-right: 30px;
}
</style>