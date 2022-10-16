<template>
  <div>
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
    />

    <slot
      name="search-suffix"
    />

    <v-table
      style="margin-top: 20px"
      class="task-table-container"
      :total="total"
      :current="current"
      :isLoading="isLoading"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
  </div>
</template>

<script>

export default {
  name: "general-table",
  props: {
    inputList: {
      type: Array,
      default: () => []
    },
    getListFn: {
      type: Function,
      default: () => {}
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    showOrder: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      current: 1,
      pageSize: 20,
      query: {},
      isLoading: false,
      tableData: [],
      total: 0
    }
  },
  computed: {
    columns() {
      const list = [
        ...this.tableColumns
      ]
      if (list.length > 0 && this.showOrder) {
        list.unshift({
          title: "序号",
          key: "num",
          tooltip: true,
          width: 70,
          render: (h, params) => {
            return h(
              "div",
              this.pageSize * (this.current - 1) + params.index + 1
            )
          }
        })
      }
      return list
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchData(query) {
      this.query = query
      this.getList()
    },
    resetData() {
      this.query = {}
      this.getList()
    },
    changePage(page) {
      this.current = page
      this.getList()
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize
      this.getList()
    },
    // 获取表格
    async getList() {
      this.isLoading = true
      try {
        const res = await this.getListFn({
          ...this.query,
          currPage: this.current,
          pageSize: this.pageSize
        })
        if (res.data.success) {
          this.tableData = res.data?.data?.list || []
          this.total = res.data?.data?.totalCount || 0
        }
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
  }
}
</script>

<style scoped>

</style>
