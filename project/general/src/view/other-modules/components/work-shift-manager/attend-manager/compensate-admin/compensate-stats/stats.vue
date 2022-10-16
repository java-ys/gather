<template>
  <div>
    <Modal
      v-model="show"
      width="75%"
      :title="title"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <div>
        <SearchList
          :inputList="inputListDetail"
          @on-search="search"
          @on-reset="reset"
        ></SearchList>
        <div class="mb20">
          <ExportFile
            :exportUrl="exportUrl"
            :exportFileName="exportFileName"
            :columnsTitle="tableData"
            :queryData="{...searchParams, agentId: extraData.agentId}"
            :baseUrlKey="baseUrlKey"
          ></ExportFile>
        </div>
        <VTable
          :total="pageData.total"
          :current="pageData.currPage"
          :pageSize="pageData.pageSize"
          :parColumns="tableTitleState"
          :parTableData="tableData"
          :isLoading="isLoading"
          :pageSizeOpts="pageSizeOpts"
          @changePage="changePage"
          @changePageSize="changePageSize"
        >
        </VTable>
      </div>
    </Modal>
  </div>
</template>

<script>
import ExportFile from "_a/export-file/exportFile";
import { tool } from "_o/api/baseMixin.js";
import { inputListDetail, tableTitleState, pageDataTwo, getNowYearMonth } from "./fields.js";
import { compensateDetailService } from "_o/api/compensate.js";

export default {
  name: "compensate-detail",
  components: {
    ExportFile
  },
  props: ["visible", "modalData","statsDate"],
  mixins: [tool],
  data() {
    return {
      ...pageDataTwo,

      title: "查看详情",
      exportFileName: "补偿统计详情.xlsx",
      exportUrl: "/api/compensation/detailPageExport",
      baseUrlKey: "_baseUrl4Driver",
      inputListDetail,
      searchParams: {
        statsDate: ''
      },
      tableTitleState: tableTitleState(this),
      isLoading: true,
      show: this.visible,
      extraData: {}
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        this.extraData = this.modalData;
        this.searchParams.statsDate = this.statsDate
        this.getList();
        this.inputListDetail[2].value = this.statsDate.slice(0,4) + '-' + this.statsDate.slice(4,6)
      }
    }
  },
  methods: {
    /*
      agentId (string, optional): 运营商id ,
      cityCode (string, optional): 城市Code ,
      driverMobile (string, optional): 手机号 ,
      driverName (string, optional): 司机姓名 ,
      maxTimes (number, optional): 补偿时长最大值 ,
      minTimes (number, optional): 补偿时长最小值 ,
      statsDate (string, optional): 日期字符串，格式yyyyMM ,
      uuid (string, optional): 唯一标识
    */
    async getList() {
      let params = {
        currPage: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
        agentId: this.extraData.agentId,
        ...this.searchParams
      };
      const [err, data] = await this.toResult(compensateDetailService(params));
      this.falsy("isLoading");

      if (err) return;
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.pageData.total = totalCount;
      }
      return this;
    },
    search(p) {
      this.searchParams = p;
      this.searchParams.statsDate = this._remove(this.searchParams.statsDate)
      this.pageData.currPage = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.pageData.currPage = 1;
      this.pageData.pageSize = 10;
      this.getList();
    },
    changePage(page) {
      this.pageData.currPage = page;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageData.pageSize = pageSize;
      this.getList();
    },
    cancel() {
      this.tableData = [];
      this.$emit("close", {});
    },
    // 去除 - 符号
    _remove(str) {
      if(!str) return str
      return (`${str}`).replace(/-/ig, "")
    }
  }
};
</script>

<style lang="less">
.mb20 {
  margin-bottom: 20px;
}
</style>
