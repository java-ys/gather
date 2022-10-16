import {
  tool,
  isArray,
  isFunc,
  isPlainObject,
  getObjKeys
} from "_o/api/baseMixin.js";
import { timeFormat } from "@/libs/util";
// 默认前一天00:00:00 - 23:59:59
const lastDay = timeFormat(+new Date() - 24 * 3600 * 1000, "yyyy-MM-dd");
const defaultStartDate = `${lastDay}00:00:00`;
const defaultEndDate = `${lastDay}23:59:59`;
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
      extraParams: {}, // 额外的入参(非searchList参数和行选中参数)
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

      const [err, data] = await this.toResult(this.func(p));

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
      if (this.activeTab == "3") {
        if (!(this.rangeTime && this.rangeTime.length)) {
          this.$Message.warning("请选择提现时间后搜索");
          return;
        }
      }
      this.searchData = {};
      getObjKeys(data).forEach(it => {
        this.searchData[it] = data[it];
      });
      this.getList();
    },
    clearQueryData() {
      this.current = 1;
      this.searchData = {};
      this.rangeTime = [];
      if (this.activeTab == "3") {
        this.extraParams = {};
        this.rangeTime = [defaultStartDate, defaultEndDate];
        this.searchData.withdrawStartTime = defaultStartDate;
        this.searchData.withdrawEndTime = defaultEndDate;
      }

      this.selectionList = [];
      if (this.exportParams) this.exportParams.ids = null;

      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.selectionList = [];
      this.getList();
    },
    changePage(current) {
      this.current = current;
      this.getList();
    }
  }
};

export const exportMixin = {
  data() {
    return {
      selectionList: [], // 选择的行
      // 选择行的id列表
      exportParams: {
        ids: null
      }
    };
  },
  methods: {
    selectHandle(rowList) {
      this.selectionList = rowList;
      const ids = this.selectionList.map(it => it.id);
      if (ids && ids.length) {
        this.exportParams.ids = ids;
      } else {
        this.exportParams.ids = null;
      }
    },
    idsFilter(obj) {
      // console.log(obj)
      let o = this.filterEmptyParams(obj);
      if (!o.ids || !o.ids.length) {
        delete o.ids;
      }
      return o;
    }
  }
};
