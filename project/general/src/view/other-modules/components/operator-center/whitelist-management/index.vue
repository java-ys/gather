<template>
  <div>
    <SearchList ref="searchList" :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    <div class="right-flex">
      <!-- <column-select-btn :localName="localColumnName" :totalColumn="totalColumn" @reload="reloadColumn">
      </column-select-btn> -->
      <Button class="new-add" type="primary" @click="add" v-hasAuth="'whitelist-management-add'">新建</Button>
      <Button class="new-add" type="primary" @click="batchRemoval" v-hasAuth="'whitelist-management-batchRemoval'">批量移出</Button>
      <ExportFile exportUrl='/api/study/whitelist/export' baseUrlKey="_base4Driver" exportFileName='白名单管理列表.xlsx' btnText='导出' :queryData='searchParams' v-hasAuth="'whitelist-management-export'">
      </ExportFile>
    </div>
    <m2-table class="mt-20" :total="total" :current="current" :pageSize="pageSize" :isLoading="isLoading" :parColumns="tableColumns" :parTableData="tableData" @changePage="changePage" @changePageSize="changePageSize" @selectHandle="selectHandle"></m2-table>
    <Modal v-model="onAdd" :width="500" title="新建" :mask-closable="false" footer-hide>
      <add @on-confirm="confirm" @cancel="cancel" :formData="formData"></add>
    </Modal>
  </div>
</template>

<script>
// import columnSelectBtn from "_a/m2-column-select/index.vue";
// import columnSelectMix from "_a/m2-column-select/mixin";
import SearchList from "_a/search-list/search-list";
import m2Table from "_a/m2-table/v-table";
import ExportFile from "_a/export-file/exportFile.vue";
import add from "./components/add";
import { inputList, tableTitle } from "./fields.js";
import { getDriverWhiteList, batchRemoval } from "_o/api/study-category";
export default {
  name: "whitelist-management",
  components: { SearchList, m2Table, ExportFile, add },
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      isLoading: true,
      total: 20,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchParams: {},
      // columnType: 1,
      selectList: [],
      formData: {},
      // localColumnName: "whiteListManagement",
      // totalColumn: tableTitle(this),
      onAdd: false
    };
  },
  // mixins: [columnSelectMix],
  methods: {
    search(data) {
      this.current = 1;
      this.searchParams = data;
      this.getList();
    },
    reset(data) {
      this.searchParams = data;
      this.getList();
    },
    add() {
      this.onAdd = true;
      this.formData = {
        person: ""
      };
    },
    confirm() {
      this.onAdd = false;
      this.getList();
    },
    cancel() {
      this.onAdd = false;
    },
    Removal(ids) {
      let that = this;
      this.$Modal.confirm({
        title: "确认移除吗？",
        key: "1",
        onOk: () => {
          batchRemoval({ ids: ids }).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              this.getList();
            }
          });
        }
      });
    },
    batchRemoval() {
      if (this.selectList.length > 0) {
        this.Removal(this.selectList);
      } else {
        this.$Message.warning("请先勾选一条记录");
        return;
      }
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    selectHandle(list) {
      this.selectList = list.map(item => item.id);
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.searchParams);
      getDriverWhiteList(obj).then(res => {
        let data = res.data.data;
        this.tableData = (data && data.list) || [];
        this.total = data.totalCount || 0;
        this.current = data.currPage !== 0 ? data.currPage : 1;
        this.pageSize = data.pageSize || 10;
        this.isLoading = false;
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.mt-20 {
  margin-top: 20px;
}
.new {
  float: left;
}
.new-add {
  margin: 0 10px;
  padding-left: 30px;
  padding-right: 30px;
}
</style>