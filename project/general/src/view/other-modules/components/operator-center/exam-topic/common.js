import { tool, isArray, isFunc, isPlainObject } from "_o/api/baseMixin.js";

export default {
  data() {
    return {
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 30, 50, 100],
      tableData: [],
      searchData: {}, // 搜索条件参数
      extraParams: {}, // 额外的入参
      func: null // 获取列表的方法
    };
  },
  mixins: [tool],
  methods: {
    async getList() {
      if (!this.func) return;
      let p = this.filterEmptyParams({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.searchData,
        ...this.extraParams
      });
      this.truy("isLoading");
      const [err, data] = await this.toResult(this.func(p));
      this.falsy("isLoading");

      if (err) {
        isFunc(this.listError) && this.listError(err);
        return;
      }
      let list = [],
        totalCount = 0;
      if (isArray(data)) {
        list = data;
      } else if (isPlainObject(data)) {
        list = data.list;
        totalCount = data.totalCount;
      }
      this.tableData = list;
      this.total = totalCount;
      isFunc(this.listSuccess) && this.listSuccess(list);
    },
    queryData(data) {
      this.searchData = {};
      Object.keys(data).forEach(it => {
        this.searchData[it] = data[it];
      });
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      this.selectionList = [];
      isFunc(this.initData) && this.initData();
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    changePage(current) {
      this.current = current;
      this.getList();
    }
  }
};
