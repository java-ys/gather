<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
      @on-change="queryChange"
    >
      <div slot="extendInput" class="text-input">
        <span class="title-name" style="width: 70px">购买时间：</span>
        <el-date-picker
          v-model="rangeTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :clearable="true"
          :editable="false"
          size="small"
          style="width: 380px"
          align="left"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="chooseTime"
        />
      </div>
    </SearchList>
    <div>
      <div class="clearfix mb-20" v-hasAuth="'ticket-value-export'">
        <export-file
          class="fr"
          :isDisabled="exportDisable"
          exportUrl="/api/mall/web/pushCoupon/rewardPage/export"
          exportFileName="推券酬金列表.xlsx"
          :queryData="idsFilter({...queryData,...extraParams, ...exportParams })"
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
import common, { exportMixin } from "../common";
import exportFile from "_a/export-file/exportFile";
import { rewardPageService } from "_o/api/coupon-manage";

export default {
  components: {
    m2Table,
    exportFile
  },
  mixins: [tool, common, exportMixin],
  data() {
    return {
      inputList,
      exportDisable: true,
      baseUrlKey: "_base4Mall",
      tableColumns: tableTitle(this),
      rangeTime: [] // 购买时间范围
    };
  },
  created() {
    this.func = rewardPageService;
    this.getList();
  },
  methods: {
    chooseTime() {
      if (this.rangeTime && this.rangeTime.length) {
        const [startTime = "", endTime = ""] = this.rangeTime;
        this.extraParams.startPayTime = startTime;
        this.extraParams.endPayTime = endTime;
      } else {
        this.extraParams.startPayTime = "";
        this.extraParams.endPayTime = "";
      }
    },
    listSuccess(data) {
      this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      this.truy("exportDisable");
    },
    orderDetail({ orderCode }) {
      this.$router.pushToAnotherModule("/m2-web-member", {
        path: "/record-query",
        query: { orderCode }
      });
    },
    queryChange() {
      let r = {};
      this.inputList.forEach(it => {
        if (it.bind_key) r[it.bind_key] = it.value;
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