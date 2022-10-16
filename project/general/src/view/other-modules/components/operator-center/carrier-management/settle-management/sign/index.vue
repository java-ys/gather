<template>
  <div class="check-management-check">
    <search-list
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></search-list>
    <m2-table
      class="top15"
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-table>
  </div>
</template>

<script>
import { inputList, tableColumns } from "./fields.js";
import m2Table from "_a/m2-table/v-table";
import common from "../tool/common";
import {
  queryProtocolByPageService,
  queryProtocolDetailService,
  signatureProtocolService,
  suspendProtocolService,
} from "_o/api/proto";
import { _getProvinceCityList, _getAgentList } from "_g/api/general";

export default {
  name: "check-management-check",
  components: {
    m2Table,
  },
  mixins: [common],
  data() {
    return {
      isLoading: false,
      inputList: JSON.parse(JSON.stringify(inputList)),
      tableColumns: tableColumns(this),

      tableConfig: {
        searchParams: {},
        current: 1,
        total: 0,
        pageSize: 10,
        tableData: [],
      },
      showAdd: false,
    };
  },
  created() {
    this.func = queryProtocolByPageService;
    this.extraParams.businessType = 2;
    this.getList();
  },
  mounted() {
    this.getCityList();
    this.getAgentList();
  },
  methods: {
    sign(row) {
      let self = this;
      this.$Modal.confirm({
        title: "提示",
        content: "是否确认签章？",
        onOk: async () => {
          const [err, data] = await self.toResult(
            signatureProtocolService({ protocolUuid: row.uuid })
          );
          if (err) {
            // this.$Message.error(err.message);
            return;
          }
          this.$Message.success("签章成功");
          self.getList();
        },
      });
    },
    async invalid(row) {
      const [err, data] = await this.toResult(
        suspendProtocolService({ protocolUuid: row.uuid })
      );
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      this.$Message.success("作废成功");
      this.getList();
    },
    async detail(row) {
      const [err, data] = await this.toResult(
        queryProtocolDetailService({ protocolUuid: row.uuid })
      );
      if (err) {
        // this.$Message.error(err.message);
        return;
      }
      data.fileUrl && window.open(data.fileUrl);
    },
    confirm() {
      this.getList();
      this.close();
    },
    close() {
      this.showAdd = false;
    },
    async getCityList() {
      const { cityList } = await _getProvinceCityList({});
      this.findBindKey("cityUuid").dropList = cityList;
    },
    async getAgentList() {
      const { list } = await _getAgentList({});
      this.findBindKey("agentUuid").dropList = list;
    },
    findBindKey(key) {
      return this.inputList.find(it => it.bind_key === key) || {};
    },
    setPageParams(p) {
      if (p.protocolDate) {
        p.protocolDate = p.protocolDate.split("-").join("");
      }
      return p;
    },
  },
};
</script>

<style scoped>
</style>
