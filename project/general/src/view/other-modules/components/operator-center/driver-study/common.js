import { tool, isArray, isFunc, isPlainObject } from "_o/api/baseMixin.js";

import { getDownloadToken } from "_o/api/file.js";

import axios from "axios";

export const getImageUrl = (param, cb) => {
  if (!param) return;
  getDownloadToken({}).then(({ data }) => {
    const token = data.msg;
    axios({
      method: "get",
      headers: {
        token: token
      },
      url: `${param.baseUrl}/file/get/imageUrl/${param.uuid}`
    }).then(r => {
      cb(r);
    });
  });
};

export const getVideoUrl = (param, cb) => {
  if (!param) return;
  getDownloadToken({}).then(({ data }) => {
    const token = data.msg;
    let formData = new FormData();
    formData.append("uuid", param.uuid);
    console.log();
    axios({
      method: "post",
      headers: {
        token: token
      },
      data: formData,
      url: `${param.baseUrl}/file/view/media`
    }).then(r => {
      cb(r);
    });
  });
};

export const splitStrInDot = str => {
  let r = `${str}`.replace(/(,|，)/gim, "|");
  return r.split("|").filter(Boolean);
};

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

export const toResult = p => {
  return p
    .then(v => {
      if (v.data.success && v.data.code === 200) {
        return Promise.resolve([null, v.data]);
      } else {
        return Promise.reject(new ErrorResult(v.data));
      }
    })
    .catch(e => Promise.resolve([e, null]));
};

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
      isFunc(this.handleSearchData) && this.handleSearchData();
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      if (this.selectionList && this.selectionList.length) {
        this.selectionList = [];
      }
      isFunc(this.handleClearQuery) && this.handleClearQuery();
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
