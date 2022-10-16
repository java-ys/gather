<template>
  <div class="history-modal-c">
    <VTable
      :height="520"
      :total="total"
      :current="current"
      :page-size="pageSize"
      :par-columns="columns"
      :par-table-data="tableData"
      style="margin-top: 15px;"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
  </div>
</template>

<script>
import {
  axiosOperationRecords,
  axios4MarketOperationRecords
} from "_g/api/common";
import { timeFormat } from "@/libs/util";
import { mapState } from "vuex";
const defaultColumns = [
  {
    title: "序号",
    type: "index",
    width: 80,
    align: "center"
  },
  {
    title: "操作人",
    key: "userName",
    tooltip: true,
    minWidth: 100
  },
  {
    title: "操作类型",
    key: "operationType",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      let val = params.row.operationType;
      if (val === "状态变更") {
        let status = params.row.modifiedValue.split("=")[1];
        status === 1 && (val = "启用");
        status === 2 && (val = "停用");
      }
      return h("div", val);
    }
  },
  {
    title: "操作时间",
    key: "logTime",
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h("div", timeFormat(params.row.logTime, "yyyy-mm-dd"));
    }
  }
];
const valueColumns = [
  {
    title: "序号",
    type: "index",
    width: 60,
    align: "center"
  },
  {
    title: "操作人",
    key: "userName",
    tooltip: true,
    width: 100
  },
  {
    title: "操作类型",
    key: "operationType",
    tooltip: true,
    width: 90
  },
  {
    title: "修改项",
    key: "operationName",
    tooltip: true,
    minWidth: 240,
    render: (h, params) => {
      let list = [];
      for (let key in params.row.modfiedValueMap) {
        if (params.row.modfiedValueMap.hasOwnProperty(key)) {
          list.push(h("p", key));
        }
      }
      return h(
        "div",
        {
          style: {
            "padding-top": "6px",
            "padding-bottom": "6px"
          }
        },
        list
      );
    }
  },
  {
    title: "修改后值",
    key: "modifiedValue",
    minWidth: 210,
    render: (h, params) => {
      let list = [];
      for (let key in params.row.modfiedValueMap) {
        if (params.row.modfiedValueMap.hasOwnProperty(key)) {
          // 活动管理-活动规则的值有500字，此处做处理，最多一行，hover显示全部
          list.push(h(
            "Tooltip",
            {
              props: {
                content: params.row.modfiedValueMap[key],
                "max-width": "400",
                placement: "top",
                transfer: true
              },
              class: {
                "lang-val": true
              }
            },
            [h("span", params.row.modfiedValueMap[key])]
          ));
        }
      }
      return h(
        "div",
        {
          style: {
            "padding-top": "6px",
            "padding-bottom": "6px"
          }
        },
        list
      );
    }
  },
  {
    title: "操作时间",
    key: "logTime",
    tooltip: true,
    width: 160,
    render: (h, params) => {
      return h("div", timeFormat(params.row.logTime, "yyyy-mm-dd"));
    }
  }
];
export default {
  props: {
    code: {
      default: "",
      type: String
    },
    columnsType: {
      type: String,
      default: "1"
    },
    isShow: {
      type: Boolean,
      default: false
    },
    uuid: {
      type: String,
      default: ""
    }
  },
  data() {
    let columns = this.columnsType === "2" ? valueColumns : defaultColumns;
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      columns: columns
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId
    })
  },
  watch: {
    isShow(newVal) {
      newVal && this.getTableList();
    }
  },
  mounted() {},
  methods: {
    getTableList() {
      this.$store.commit("changeLoadingFlag", true);
      let params = {
        extendValue: this.uuid,
        apiGroup: this.code,
        pageSize: this.pageSize,
        currPage: this.current
      };
      let axiosFun =
        this.code === "1"
          ? axios4MarketOperationRecords
          : axiosOperationRecords;
      axiosFun(params)
        .then(res => {
          let resdata = res.data.data || {};
          this.tableData = (resdata && resdata.list) || [];
          this.total = resdata && resdata.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    }
  }
};
</script>
<style lang="less">
.ivu-tooltip.lang-val {
  .ivu-tooltip-rel span {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    max-width: 226px;
  }
}
.history-modal-c {
  .ivu-tooltip {
    display: block;
    height: 18px;
    line-height: 18px;
  }
}
</style>
