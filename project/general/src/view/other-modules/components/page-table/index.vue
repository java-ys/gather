<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search" v-if="inputList.length" />
    <slot></slot>
    <m2-Table
      class="top15"
      :total="tableParams.total"
      :isLoading="isLoading"
      :current="tableParams.current"
      :pageSize="tableParams.pageSize"
      :parColumns="parColumns"
      :parTableData="tableParams.tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </m2-Table>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
export default {
  name: "page-table",
  props: {
    // 条件框
    inputList: {
      type: [Array, Function],
      default: () => []
    },
    // 表格的顶栏
    parColumns: {
      type: [Array, Function],
      default: () => []
    },
    // 接口请求的方法
    fn: {
      type: Function,
      default: () => {
        return Promise.resolve({ data: { code: 200, success: true, data: { totalCount: 0, list: [{}] } } });
      }
    },
    // 结果是否需要自定义
    formatResult: {
      type: Boolean,
      default: false
    },
    // 是否需要格式化请求参数
    formatParams: {
      type: Boolean,
      default: false
    },
    tableParams: {
      type: Object,
      default : () => {
        return {
          total: 0, // 总计
          current: 1, // 当前页码
          pageSize: 10, // 最大条数
          tableData: [], // 表格数据
        }
      }
    },
    otherParams: { // 选择的搜索条件
      type: Object,
      default: () => {
        return {
          params: {}
        }
      }
    }
  },
  components: {
    m2Table
  },
  data() {
    return {
      isLoading: false, // 请求中提示
    };
  },
  computed: {
    params() {
      // 接口请求参数
      return {
        currPage: this.tableParams.current,
        pageSize: this.tableParams.pageSize,
        ...this.otherParams.params
      };
    }
  },
  mounted() {
    this.getTableList(this.params);
  },
  methods: {
    onShow() {
      this.getTableList(this.params);
    },
    async search(v) {
      this.otherParams.params = v;
      if (this.formatParams) {
        this.$emit("formatParams", v)
      }
      this.tableParams.current = 1;
      this.getTableList(this.params);
    },
    changePage(val) {
      this.tableParams.current = val;
      this.getTableList(this.params);
    },
    changePageSize(val) {
      this.tableParams.pageSize = val;
      this.tableParams.current = 1;
      this.getTableList(this.params);
    },
    async getTableList(params) {
      this.isLoading = true;
      this.fn(params)
        .then(res => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.success) {
            if (this.formatResult) {
              this.$emit("formatResult", res.data.data);
              return;
            }
            this.tableParams.total = res.data.data.totalCount;
            this.tableParams.tableData = res.data.data.list;
          }
        })
        .catch(reason => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped></style>
