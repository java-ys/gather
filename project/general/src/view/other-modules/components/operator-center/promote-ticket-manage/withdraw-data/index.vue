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
        <span class="title-name" style="width: 70px">提现时间：</span>
        <el-date-picker
          v-model="rangeTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :clearable="false"
          :editable="false"
          size="small"
          style="width: 380px"
          align="left"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        />
      </div>
    </SearchList>
    <div>
      <div class="clearfix mb-20" v-hasAuth="'withdraw-data-export'">
        <export-file
          class="fr"
          btnText="导出"
          exportUrl="/api/mall/web/pushCoupon/withdrawDataPage/export"
          exportFileName="提现数据列表.xlsx"
          :isDisabled="exportDisable"
          :baseUrlKey="baseUrlKey"
          :queryData="idsFilter({...searchData, ...extraParams, ...exportParams})"
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
        @selectHandle="selectHandleSpecial"
      ></m2-table>
    </div>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import exportFile from "_a/export-file/exportFile";
import { inputList, tableTitle } from "./fields.js";
import { tool } from "_o/api/baseMixin.js";
import common, { exportMixin } from "../common";
import { withdrawDataPageService } from "_o/api/coupon-manage";
import { timeFormat } from "@/libs/util";

// 默认前一天00:00:00 - 23:59:59
const lastDay = timeFormat(+new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
const defaultStartDate = `${lastDay}00:00:00`;
const defaultEndDate = `${lastDay}23:59:59`;

export default {
  components: {
    m2Table,
    exportFile
  },
  props: {
    activeTab:{
      type: String,
      default: '3'
    }
  },
  mixins: [tool, common, exportMixin],
  data() {
    return {
      inputList,
      exportDisable: true,
      baseUrlKey: "_base4Mall",
      tableColumns: tableTitle(this),
      rangeTime: [defaultStartDate, defaultEndDate] // 购买时间范围
    };
  },
  watch: {
    rangeTime: {
      handler(newValue, oldValue) {
        if (this.rangeTime && this.rangeTime.length) {
          const [startTime = "", endTime = ""] = this.rangeTime;
          this.extraParams.withdrawStartTime = startTime;
          this.extraParams.withdrawEndTime = endTime;
        } else {
          this.extraParams.withdrawStartTime = "";
          this.extraParams.withdrawEndTime = "";
        }
      }
    }
  },
  created() {
    this.extraParams.withdrawStartTime = defaultStartDate;
    this.extraParams.withdrawEndTime = defaultEndDate;
    this.func = withdrawDataPageService;
    this.getList();
  },
  methods: {
    listSuccess(data) {
      this[data && data.length ? "falsy" : "truy"]("exportDisable");
    },
    listError(err) {
      this.truy("exportDisable");
    },
    // 提现数据导出, 由于中台兼容性问题, 不能只传[id], 需要传行数据
    selectHandleSpecial(rowList) {
      this.selectionList = rowList;
      const ids = this.selectionList.map(it => ({...it}));
      if (ids && ids.length) {
        this.exportParams.ids = ids;
      } else {
        this.exportParams.ids = null;
      }
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