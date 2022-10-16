<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @cascade-change="handleCityChange"
    ></SearchList>
    <div>
      <div class="clearfix mb-20" v-hasAuth="'ticket-provide-export'">
        <export-file
          class="fr"
          :isDisabled="exportDisable"
          exportUrl="/api/mall/web/pushCoupon/grantPaymentPage/export"
          exportFileName="薪酬发放列表.xlsx"
          :queryData="idsFilter({...searchData, ...exportParams})"
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
import { getProvinceCityList } from "_g/api/common.js";
import { getAgentByCity } from "_g/api/configData";
import { cpTranslate } from "@/libs/tools";
import { inputList, tableTitle } from "./fields.js";
import { tool } from "_o/api/baseMixin.js";
import m2Table from "_a/m2-table/v-table";
import exportFile from "_a/export-file/exportFile";
import common, { exportMixin } from "../common";
import { grantPaymentPageService } from "_o/api/coupon-manage";

export default {
  components: {
    m2Table,
    exportFile
  },
  mixins: [common, tool, exportMixin],
  data() {
    return {
      inputList,
      exportDisable: true,
      tableColumns: tableTitle(this),
      baseUrlKey: "_base4Mall",
      rangeTime: [] // 购买时间范围
    };
  },
  created() {
    this.func = grantPaymentPageService;
    this.getList();
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    // 获取省市
    async getCityList() {
      const [err, data] = await this.toResult(getProvinceCityList({}));
      if (err) {
        this.$Message.error(err.message);
        return;
      }
      let list = cpTranslate(data);
      this.cascaderList = list;
      const f = this.inputList.find(it => it.name === "cascader-input");
      if (!f) return;
      f.cascaderList = list;
    },
    // 根据城市code 获取运营商列表
    async getAgentList(cityCode) {
      if (!cityCode) return;
      let [err, data] = await this.toResult(getAgentByCity({ cityCode }));
      if (err || !data) return;
      let list = data;
      const f = this.findAgentOpt();
      if (!f) return;
      f.dropList = list.map(item => {
        return {
          label: item.name,
          value: item.uuid
        };
      });
    },
    listSuccess(data) {
      this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      this.truy("exportDisable");
    },
    handleCityChange(value) {
      const [provinceCode, citycode] = value;
      if (!provinceCode) {
        const f = this.findAgentOpt();
        if (!f) return;
        f.dropList = [];
        return;
      }
      this.getAgentList(citycode);
    },
    findAgentOpt() {
      return this.inputList.find(it => it.bind_key === "agentUuid");
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-select-dropdown {
  min-width: 165px;
}
.mb-20 {
  margin-bottom: 20px;
}
.fr {
  float: right;

  padding-left: 30px;
  padding-right: 30px;
}
</style>