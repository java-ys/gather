<template>
  <div>
    <SearchList ref="searchList" :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    <div class="right-flex">
      <Button class="new-add" type="primary" @click="add" v-hasAuth="'study-category-add'">新建</Button>
    </div>
    <m2-table class="mt-20" :total="total" :current="current" :pageSize="pageSize" :isLoading="isLoading" :parColumns="tableColumns" :parTableData="tableData" @changePage="changePage" @changePageSize="changePageSize"></m2-table>
    <!-- 新建/编辑 -->
    <Modal v-model="onAdd" :width="500" :title="title" :mask-closable="false" @on-cancel="cancel" footer-hide>
      <add ref="child" :title="title" :isEdit="isEdit" @on-confirm="confirm" @cancel="cancel" :editForm="editForm"></add>
    </Modal>
  </div>
</template>

<script>
import SearchList from "_a/search-list/search-list";
import m2Table from "_a/m2-table/v-table";
import { inputList, tableTitle } from "./fields.js";
import {
  getStudyCategoryList,
  studyCategoryAdd,
  studyCategoryEdit,
  isInit,
  isOn
} from "_o/api/study-category";
import add from "./components/add";
export default {
  name: "study-category",
  components: { SearchList, m2Table, add },
  data() {
    return {
      inputList,
      tableColumns: tableTitle(this),
      total: 20,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchParams: {},
      onAdd: false,
      isEdit: false,
      isLoading: true,
      title: "",
      editForm: {}
    };
  },
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
      this.title = "新建学习分类";
      this.onAdd = true;
      this.isEdit = false;
      this.editForm = {
        cateName: "",
        sortOrder: ""
      };
    },
    edit(row) {
      this.title = "编辑学习分类";
      this.onAdd = true;
      this.isEdit = true;
      let { cateName, sortOrder, id } = JSON.parse(JSON.stringify(row));
      this.editForm = {
        id: id,
        cateName: cateName,
        sortOrder: String(sortOrder)
      };
    },
    isShelf(row) {
      let { recStatus, id } = row;
      if (recStatus == 0) {
        this.isOn(id);
      } else {
        this.isInit(id);
      }
    },
    isInit(id) {
      isInit({ id: id }).then(res => {
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.getList();
        } else {
          this.$Message.success(res.data.msg);
        }
      });
    },
    isOn(id) {
      isOn({ id: id }).then(res => {
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.getList();
        } else {
          this.$Message.success(res.data.msg);
        }
      });
    },
    // 确认新增
    confirm() {
      this.$refs["child"].$refs["editForm"].resetFields();
      this.getList();
      this.onAdd = false;
    },
    // 取消新增
    cancel() {
      this.$refs["child"].$refs["editForm"].resetFields();
      this.onAdd = false;
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      let params = JSON.parse(JSON.stringify(this.searchParams));
      params.pageSize = this.pageSize;
      params.currPage = this.current;
      getStudyCategoryList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data;
          this.tableData = (data && data.list) || [];
          this.total = data.totalCount || 0;
          this.current = data.currPage !== 0 ? data.currPage : 1;
          this.pageSize = data.pageSize || 10;
          this.isLoading = false;
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.clearfix {
  clear: both;
}
.mt-20 {
  margin-top: 20px;
}
.new-add {
  float: right;
  padding-left: 30px;
  padding-right: 30px;
}
</style>