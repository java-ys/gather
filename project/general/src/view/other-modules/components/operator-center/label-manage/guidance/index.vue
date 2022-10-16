<!--充电站-配置管理-订单管理列表-wx-->
<template>
  <div>
    <!-- 搜索栏 -->
    <per-select
      ref="perSelect"
      @on-search="queryData"
      @on-reset="clearQueryData"
    />
    <!-- 操作栏 -->
    <div style="text-align: right">
      <export-file
        exportUrl="/orion-plugin-web-api/api/plugin/evaluation/exportExcel"
        exportFileName="应用市场评价列表.xlsx"
        baseUrlKey="_baseUrlCommon"
        :queryData="
          $refs['perSelect'] ? $refs['perSelect'].getSubmitData() : searchData
        "
        btnText="批量导出"
      ></export-file>
      <Button type="success" @click="configModal = true">
        条件设置
      </Button>
    </div>
    <VTable
      class="top15"
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <!-- 模态框 -->
    <Modal v-model="configModal" title="条件设置" width="800px">
      <config v-if="configModal" ref="configModal" />
      <div slot="footer">
        <Button @click="configModal = false">
          取消
        </Button>
        <Button type="primary" @click="confirmHander">
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import PerSelect from "./select.vue";
import VTable from "_a/v-table/v-table";
import Config from "./config";
import { cacheData, returnFields } from "./fields";
import { addOrUpdateEvaluation, queryEvaluationByPage } from "_o/api/evalution";
import exportFile from "_a/export-file/exportFile";
export default {
  components: {
    VTable,
    PerSelect,
    Config,
    exportFile
  },
  data() {
    return {
      ...cacheData,
      parColumns: [],
      tableData: [],
      labelModal: false,
      labelModalData: {
        evaluationTarget: "",
        addLabelTypeStatus: 0,
        newLabelType: "",
        labelTypeUuid: "",
        labelName: "",
        evaluationQuality: ""
      },
      configModal: false
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs["perSelect"].confirmHander();
    });
  },
  methods: {
    // 条件搜索后回调方法
    queryData(data) {
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
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList: function(obj, notLoading) {
      // let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (obj) {
        for (let key in obj) {
          if (key) {
            params[key] = obj[key];
          }
        }
      }
      !notLoading && this.$store.commit("changeLoadingFlag", true);
      queryEvaluationByPage(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    // 确认按钮
    confirmHander() {
      this.$refs["configModal"].comfirmHander().then(form => {
        addOrUpdateEvaluation(form).then(() => {
          this.$Message.success("操作成功!");
          this.configModal = false;
          this.getList(this.searchData);
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.counter {
  vertical-align: bottom;
  margin-left: 12px;
}
.right-flex {
  display: flex;
  justify-content: flex-end;
}
.bottom10 {
  margin-bottom: 10px;
}
.info-modal {
  /deep/ .ivu-modal-body {
    padding-bottom: 40px;
    line-height: 30px;
  }
}
.flex-box {
  display: flex;
  justify-content: flex-start;
}
</style>
