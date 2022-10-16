<template>
  <m2-table
    :total="total"
    :current="current"
    :pageSize="pageSize"
    :parColumns="columns"
    :parTableData="list"
    @changePage="changePage"
    @changePageSize="changePageSize"
  >
    <template slot="action" slot-scope="params">
      <Button @click="$emit('use', params.data.row)">使用</Button>
    </template>
  </m2-table>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { queryLinkList } from "_o/api/reach-platform";
export default {
  name: "LinkTable",
  components: { m2Table },
  data: () => ({
    current: 1,
    pageSize: 10,
    total: 0,
    list: [],
    columns: [
      {
        title: "链接名称",
        key: "linkName",
        minWidth: 120
      },
      {
        title: "长链接",
        key: "link",
        minWidth: 80,
      },
      {
        title: "链接说明",
        key: "remark",
        minWidth: 80,
      },
      {
        title: "操作",
        key: "action",
        width: 245,
        slot: "action"
      }
    ],
  }),
  created() {
    this.updateList();
  },
  methods: {
    changePage(val) {
      this.current = val;
      this.updateList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.updateList();
    },
    updateList() {
      queryLinkList({ currPage: this.current, pageSize: this.pageSize }).then(res => {
        this.list = res.list || [];
        this.total = res.totalCount;
      });
    }
  }
};
</script>

<style lang="less" scoped>

</style>