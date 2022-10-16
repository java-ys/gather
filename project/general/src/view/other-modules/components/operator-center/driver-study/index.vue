<template>
  <div>
    <SearchList
      ref="searchList"
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></SearchList>
    <div>
      <div class="clearfix">
        <Button
          class="new-add"
          type="primary"
          @click="addNew"
          v-hasAuth="'driver-study-add'"
          >新建</Button
        >
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
      >
      </m2-table>
    </div>
    <!-- 新建/编辑 -->
    <add :visible="onAdd" :modal-data="currentRow" @close="hideAdd"></add>
    <!-- 详情 -->
    <detail
      :visible="onDetail"
      :modal-data="currentRow"
      @close="hideDetail"
    ></detail>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { timeFormat } from "@/libs/util";
import { inputList, tableTitle, tableKey, inputListKey } from "./fields.js";
import s from "_o/api/study-exam";
import add from "./components/add";
import detail from "./components/detail";
import { tool } from "_o/api/baseMixin.js";
import common from "./common";
// import { Switch } from "iview";

export default {
  name: "driver-study",
  components: { m2Table, add, detail },
  mixins: [tool, common],
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      currentRow: {},
      onAdd: false,
      onDetail: false,
      cateList: [], //  学习分类列表
    };
  },
  created() {
    this.func = s.studyList;
    this.getList();
  },
  mounted() {
    this.getCate();
  },
  methods: {
    // 获取学习分类选项
    async getCate() {
      const [err, data] = await this.toResult(
        s.cataQuery({ pageSize: 2000, currpage: 0 })
      );
      if (err) {
        return;
      }
      let f = inputList.find((it) => it.bind_key === inputListKey[5]);
      if (!f) return;
      if (data && data.list.length) {
        const ll = data.list
          .filter((it) => it.recStatus - 1 === 0)
          .map((it) => {
            return { label: it.cateName, value: it.id };
          });
        this.cateList = ll;
        f.dropList = ll;
      }
    },
    addNew() {
      this.currentRow = {};
      this.currentRow._cate = this.cateList;
      this.showSet();
    },
    hideAdd({ refresh }) {
      this.hideSet();
      if (refresh) {
        this.getList();
      }
    },
    toDetail(row) {
      this.currentRow = row;
      this.showDetail();
    },
    toEdit(row) {
      this.currentRow = row;
      this.currentRow._cate = this.cateList;
      this.showSet();
    },
    showSet() {
      this.truy("onAdd");
      return this;
    },
    hideSet() {
      this.falsy("onAdd");
      return this;
    },
    showDetail() {
      this.truy("onDetail");
      return this;
    },
    hideDetail() {
      this.falsy("onDetail");
      return this;
    },
    handleSearchData() {
      let { publishTime, offTime } = this.searchData;
      this.searchData.publishTime = timeFormat(publishTime, "yyyy-mm-dd");
      this.searchData.offTime = timeFormat(offTime, "yyyy-mm-dd");
      if (
        new Date(this.searchData.publishTime) >
        new Date(this.searchData.offTime)
      ) {
        this.$Message.warning("下线时间不得小于上线时间");
        this.func = null;
        return;
      }
      this.current = 1;
      this.func = s.studyList;
    },
    handleClearQuery() {
      if (!this.func) this.func = s.studyList;
    },
    async switch({ row, index }, val) {
      // 已下线, 开启失败，提示学习任务上线状态才可开启
      // 1 是 2 否
      const [err, data] = await this.toResult(
        s.studyChangeOnlineStatus({
          id: row.id,
          onlineStatus: row.onlineStatus - 1 === 0 ? 2 : 1,
        })
      );
      if (err) {
        return;
      }
    },
    viewDetail({ id }) {
      this.$router.push({ name: "study-list", query: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
.mt-20 {
  margin-top: 20px;
}
.new-add {
  float: right;
  padding-left: 30px;
  padding-right: 30px;
}
</style>