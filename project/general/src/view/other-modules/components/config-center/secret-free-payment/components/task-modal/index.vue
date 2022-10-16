<template>
  <div class="modal-content">
    <SearchList
      :inputList="inputList"
      @on-search="queryData"
      @on-reset="clearQueryData"
    />
    <VTable
      ref="userGroup"
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />
    <div class="modal-foot">
      <div class="pull-right">
        <Button class="right15" @click="cancelFun">
          取消
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
  import { cacheData, parColumns } from "./conf";
  import { selectTaskPage } from "_o/api/guide-config";


  export default {
    props: {
      timeRange: {
        type: Array,
        default: []
      },
      isShow: {
        type: Boolean,
        default: false
      },
      limitNumber: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {
        ...cacheData,
        parColumns: parColumns(this)
      };
    },
    watch: {
      isShow(newVal) {
        if (newVal) {
          this.getList();
        }
      }
    },
    mounted() {
      this.getList();
    },
    beforeDestroy() {
      this.cancelFun();
    },
    methods: {
      // 条件搜索后回调方法
      queryData(data) {
        // 点击查询
        this.pageObj.current = 1;
        for (let key in this.searchData) {
          delete this.searchData[key];
        }
        for (let key in data) {
          this.searchData[key] = data[key];
        }
        this.getList(data);
      },
      clearQueryData() {
        // 点击清空
        this.pageObj.current = 1;
        for (let key in this.searchData) {
          delete this.searchData[key];
        }
        this.getList();
      },
      getList(obj) {
        let params = {
          pageSize: this.pageObj.pageSize,
          currPage: this.pageObj.current,
        };
        if (obj) {
          Object.keys(obj).forEach(key => {
            params[key] = obj[key];
          });
        }
        this.$store.commit("changeLoadingFlag", true);
        selectTaskPage(params).then(res => {
          if (res.data.success) {
            let data = res.data.data;
            this.tableData = data ? data.list : [];
            this.pageObj.total = data ? data.totalCount : 0;

            this.$store.commit("changeLoadingFlag", false);
          } else {
            this.$Message.error(res.data.msg || "服务器请求异常");
          }
        });
      },
      changePage: function(val) {
        this.pageObj.current = val;
        this.getList(this.searchData);
      },
      changePageSize: function(val) {
        this.pageObj.pageSize = val;
        this.getList(this.searchData);
      },
      cancelFun() {
        this.$emit("close");
        this.tableData.splice(0, this.tableData.length);
        this.pageObj.current = 1;
        this.pageObj.total = 100;
        this.pageObj.pageSize = 10;
        Object.keys(this.searchData).forEach(key => {
          this.searchData[key] = "";
        });
      },
      selectRow(row) {
        const { startTime, endTime } = row
        const range = this.timeRange.map(time => +this.$moment(time).format('x'))
        const start = +this.$moment(startTime).format('x')
        const end = +this.$moment(endTime).format('x')
        if (start > range[0] || end < range[1]) {
          return this.$Message.error('该任务生效时间与引导策略生效时间段不匹配')
        }
        this.$emit("selectDown", [row]);
        this.$emit("close");
      },
    }
  };
</script>
<style lang="less" scoped>
  .modal-foot {
    min-height: 45px;
    padding-top: 15px;
    border-top: 1px solid #e8eaec;
  }
</style>
