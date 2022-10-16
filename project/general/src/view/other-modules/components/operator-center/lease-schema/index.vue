<template>
  <div class="lease-project">
    <SearchBlock
      @on-search="handleSearch"
      @on-reset="reset"
    >
    </SearchBlock>
    <!-- <div class="operate-wrap">
      <ExportFile
        :exportUrl="exportUrl"
        exportFileName="租赁方案列表.xlsx"
        :queryData="exportParams"
        baseUrlKey="_baseUrl"
        btnText="批量导出"
        ajaxMethod="post"
        style="font-size:13px;margin-left: 16px;margin-bottom:10px"
      >
      </ExportFile>
    </div> -->
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      width="800px"
      footer-hide
    >
      <detail-modal
        v-if="modalShow"
        :modal-title="modalTitle"
        :schemaId="schemaId"
        @on-Close="onClose"
      ></detail-modal>
    </Modal>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      class="lease-project-table-container"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
  </div>
</template>

<script>
import SearchBlock from "./SearchBlock";
// import ExportFile from "_a/export-file/exportFile.vue"
import VTable from "_a/v-table/v-table";
import { tableColumns } from "./config"
import { queryLeaseSchemaList, stopSaleSchema, saleSchema } from "_o/api/lease";
import detailModal from "./detailModal";

/**
 * @Desc: m2-web-asset
 * @Author: zhangke
 * @CreateTime: 2020/12/17 15:35
 */
export default {
  name: "index",
  components: {
    VTable,
    SearchBlock,
    // ExportFile,
    detailModal
  },
  data() {
    return {
      schemaId: "",
      modalShow: false,
      modalTitle: "新建方案",
      exportLogUrl: "",
      tableColumns: tableColumns(this),
      exportUrl: "",
      total: 0,
      current: 1,
      pageSize: 20,
      isLoading: false,
      searchData: {},
      tableData: [],
      exportParams: {}
    }
  },
  methods: {
    changePage(val) {
      this.current = val;
      this.getTableData();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableData();
    },
    onClose() {
      this.modalShow = false;
    },
    handleSearch(val) {
      this.current = 1;
      this.pageSize = 20;
      this.searchData = val;
      this.getTableData();
    },
    getTableData() {
      let params = this.deleteEmptyProps(this.searchData);
      params.currPage = this.current;
      params.pageSize = this.pageSize;
      this.isLoading = true;
      queryLeaseSchemaList(params).then(res => {
        if (res && res.data && res.data.success) {
          let { data } = res.data;
          this.tableData = data.list && data.list.length ? data.list : [];
          this.total = data.totalCount;
          this.isLoading = false;
        } else {
          this.$Message.error("查询列表失败")
        }
      })
    },
    // 删除表单空值属性
    deleteEmptyProps(form) {
      for (let paramName in form) {
        if (form.hasOwnProperty(paramName)) {
          if (!form[paramName]) {
            delete form[paramName];
          }
        }
      }
      return form;
    },
    // 1:上架/0:下架
    changeState(type, schemaId) {
      let interfaceName = type === 0 ? stopSaleSchema : saleSchema;
      interfaceName({ schemaId: schemaId }).then(res => {
        if (res && res.data && res.data.success) {
          this.getTableData();
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    reset(val) {
      this.searchData = val;
      this.getTableData();
    }
  }
}
</script>

<style scoped lang="less">
  .buttons {
    margin-bottom: 10px;

    .export_log, .create-btn {
      margin-right: 10px;
    }
  }

  .lease-project-table-container {
    min-width: 1050px;
  }

  /deep/ .project-edit-row {
    > a {
      &:first-child {
        margin: 0;
      }

      margin: 0 3px;
    }
  }
</style>
