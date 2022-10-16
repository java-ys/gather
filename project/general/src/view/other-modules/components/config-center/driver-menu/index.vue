<template>
  <div class="menu-config">
    <Form inline="inline" :label-width="85">
      <FormItem label="菜单名称:">
        <Input
          v-model="menuName"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem label="展示顺序:">
        <Input
          v-model="displayOrder"
          clearable="clearable"
          style="width:250px"
          :maxlength="50"
        />
      </FormItem>
      <FormItem :label-width="0">
        <Button
          type="primary"
          style="margin-right:20px;margin-left:40px"
          @click="search"
        >
          查询
        </Button>
        <Button @click="init">清空</Button>
      </FormItem>
    </Form>
    <Button v-hasAuth="'driver-menu-add'" type="primary" style="margin-bottom:20px" @click="addData">
      新增菜单
    </Button>
    <v-table
      :current="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></v-table>
    <add ref="add" @reload="getTableList" />
  </div>
</template>

<script>
import { listColumns } from "./fields";
import VTable from "_a/v-table/v-table";
import add from "./add";

import {
  driverMenuList,
  driverMenuDelete
} from "_o/api/configData";

export default {
  components: {
    VTable,
    add
  },
  data() {
    let { columns } = listColumns;
    return {
      menuName: "",
      displayOrder: null,
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.menuName = "";
      this.displayOrder = "";
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.getTableList();
    },
    getTableList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        displayOrder: this.displayOrder || null,
        menuName: this.menuName || null
      };
      driverMenuList(params).then(res => {
        this.tableData = res.data.data.list || [];
        this.total = res.data.data.totalCount || 0;
      });
    },
    search() {
      this.current = 1;
      this.getTableList();
    },
    changePage(page) {
      this.current = page;
      this.getTableList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    addData() {
      this.$refs.add.init();
    },
    goEdit(item) {
      this.$refs.add.init(item);
    },
    // 删除菜单
    deleteMenu(row) {
      this.$Modal.confirm({
        title: "确定删除该菜单吗？",
        onOk: () => {
          driverMenuDelete({
            id: row.id
          }).then(res => {
            if (res && res.data && res.data.success) {
              this.$Message.info("删除成功！");
              this.getTableList();
            } else {
              this.$Message.info("删除失败，" + res.data.msg || "");
            }
          })
        },
        onCancel: () => {

        }
      })
    }
  }
};
</script>
<style>

</style>
