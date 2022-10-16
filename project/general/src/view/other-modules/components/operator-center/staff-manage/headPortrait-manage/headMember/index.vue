<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    ></SearchList>
    <div class="buttontext">
      <importTable
        v-if="Number(recordStatus)===3"
        :data="parameter"
        style="margin-right: 50px;"
        :importFileUrl="importFileUrl"
        :toDownTemplateUrl="toDownTemplateUrl"
        :btnText="toLeadText"
        @on-change="importData"
      ></importTable>
      <ExportFile
        exportUrl="/admin/driverGroupMember/export"
        exportFileName="司机列表.xlsx"
        :queryData="queryAjaxPramas"
        :btnText="deriveText"
      ></ExportFile>
    </div>
    <VTable
      :total="total"
      :current="currPage"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      class="top15"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <div class="cloose">
      <Button
        type="error"
        @click="close"
      >
        关闭
      </Button>
    </div>
  </div>
</template>
<script>
import { returnFields, inputList } from "./fields.js";
import ExportFile from "_a/export-file/exportFile";
import importTable from "_a/import-file/index";
import VTable from "_a/v-table/v-table";
import {
  headPortraitHeadMemberList,
  headPortraitHeadMemberRemove
} from "_o/api/driver.js";

export default {
  components: {
    ExportFile,
    importTable,
    VTable
  },
  data() {
    return {
      inputList,
      queryAjaxPramas: {
        groupId: this.$route.query.uuid
      },
      deriveText: "导出",
      parameter: {
        groupId: this.$route.query.uuid
      },
      importFileUrl: "/admin/driverGroupMember/importExcel",
      toDownTemplateUrl: "/download/driver_group_member.xlsx",
      toLeadText: "导入",
      total: 0,
      currPage: 1,
      pageSize: 10,
      returnFields,
      parColumns: [],
      recordStatus: this.$route.query.recordStatus,
      uuid: this.$route.query.uuid,
      tableData: []
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.recordStatus = this.$route.query.recordStatus;
    this.uuid = this.$route.query.uuid;
    this.parameter = {
      groupId: this.$route.query.uuid
    };
    this.queryAjaxPramas = {
      groupId: this.$route.query.uuid
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let params = {
        groupId: this.uuid,
        currPage: this.currPage,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      headPortraitHeadMemberList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.pageSize = res.data.data.pageSize;
        this.tableData = res.data.data.list;
      });
    },
    queryData(data) {
      this.currPage = 1;
      this.queryAjaxPramas = data;
      this.getList();
    },
    clearQueryData() {
      this.queryAjaxPramas = {};
      this.currPage = 1;
      this.getList();
    },
    changePage: function (val) {
      this.currPage = val;
      this.getList();
    },
    changePageSize: function (val) {
      this.pageSize = val;
      this.getList();
    },
    close() {
      this.$store.commit("setChangeTab", this.$route);
      this.$router.push({ path: "headPortrait-manage/" });
    },
    removes(id) {
      headPortraitHeadMemberRemove(id).then(res => {
        this.getList();
      });
    },
    importData(id) {
      if (!id) {
        this.getList()
      }
    }
  }
};
</script>
<style lang="less" scoped>
.buttontext {
  display: flex;
}
.cloose {
  text-align: center;
}
.indetai {
  p {
    margin-bottom: 15px;
  }
}
</style>
