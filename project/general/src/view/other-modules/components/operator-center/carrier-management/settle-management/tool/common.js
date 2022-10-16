import { tool, isArray, isFunc, isPlainObject } from "_o/api/baseMixin.js";

export const numToArray = n => {
  return Array.apply(null, { length: +n }).map((item, index) => {
    return index;
  });
};

export class ErrorResult extends Error {
  constructor(data) {
    super();
    this.code = data.code;
    this.msg = data.msg;
  }
}
function filterEmptyParams(o) {
  let tar = {};
  Object.keys(o).forEach(i => {
    if (o[i] - -1 !== 0) {
      tar[i] = o[i];
    }
  });
  return tar;
}

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
      this.truy("isLoading");
      let p = filterEmptyParams({
        currPage: this.current,
        pageSize: this.pageSize,
        ...this.searchData,
        ...this.extraParams
      });
      if (typeof this.setPageParams === "function") {
        p = this.setPageParams(p);
      }

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
      isFunc(this.handleSearchData) && this.handleSearchData();
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      this.selectionList = [];
      if (this.exportParams) {
        delete this.exportParams.ids;
      }
      this.selectedSum = 0;
      this.selectedIds = new Set();
      this.selectedData = new Set();
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
