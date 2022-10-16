<template>
  <div>
    <searchForm
      :applyRentCompanyList="applyRentCompanyList"
      :contractNameList="contractNameList"
      @on-reset="handleReset"
      @on-search="handleSearch"
    ></searchForm>
    <div class="btn-wrap">
      <!-- <ExportFile :queryData="searchData" :exportUrl="exportUrl">导出</ExportFile> -->
      <Button type="primary" @click="onCreate">新增租赁合同</Button>
    </div>
    <addmodal v-model="modalShow"
              :type="type"
              :modalTitle="modalTitle"
              :contractId="contractId"
              @on-confirm="addConfirm"
    ></addmodal>
    <viewmodal v-model="viewShow"
               :contractId="contractId"
    ></viewmodal>
    <VTable :total="total"
            :current="currPage"
            :pageSize="pageSize"
            :isLoading="isLoading"
            :parColumns="parColumns"
            :parTableData="tableData"
            class="lease-table-container"
            @changePage="changePage"
            @changePageSize="changePageSize"
            @selectHandle="getCurrentRowData"
    ></VTable>
  </div>
</template>

<script>
// import VTable from "_a/v-table/v-table.vue";
import searchForm from "./searchForm.vue";
import addmodal from "./addmodal.vue"
import viewmodal from "./view.vue"
import { searchData, parColumns } from "./config.js";
// import ExportFile from "_a/export-file/exportFile";
import {
  queryContractPage,
  queryContractNames,
  // queryApplyRentCompany,
  queryRentCompany,
  updateContractStatus
} from "_o/api/lease";
export default {
  name: "contract-manager",
  components: {
    // VTable,
    searchForm,
    // ExportFile,
    addmodal,
    viewmodal
  },
  data() {
    return {
      searchData: { ...searchData.searchData },
      tableData: [],
      currPage: 1,
      pageSize: 20,
      isLoading: true,
      total: 10,
      parColumns: parColumns(this),
      applyRentCompanyList: [],
      contractNameList: [],
      exportUrl: "/api/assets/v1/tools/excel/export",
      modalShow: false,
      viewShow: false,
      type: 1, // 1 表示新增，2表示编辑，3表示查看
      modalTitle: "新增租赁合同",
      contractId: 0
    }
  },
  computed: {

  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.getList();
      this.getContractNames();
      this.getApplyRentCompanyList();
    },
    async getList() {
      const {
        contractName,
        cpIdList,
        customizationFlag,
        contractStatus,
      } = this.searchData
      let params = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        customizationFlag,
        contractStatus,
        contractType: 1
      }
      contractName && contractName.length > 0 ? params.contractName = contractName : "";
      cpIdList && cpIdList.length > 0 ? params.cpIdList = cpIdList : "";
      const {
        data: {
          success,
          data: { list = [], totalCount }
        }
      } = await queryContractPage(params);
      if (success) {
        this.tableData = list;
        this.total = totalCount;
      }
    },
    async getContractNames() {
      let params = {
        contractType: 1  // 1 租赁合同 2 代扣合同
      }
      const {
        data: {
          success,
          data = []
        }
      } = await queryContractNames(params);
      if (success) {
        this.contractNameList = data;
        console.log(this.contractNameList)
      }
    },
    async getApplyRentCompanyList() {
      const {
        data: {
          data = [],
          success
        }
      } = await queryRentCompany();
      if (success) {
        this.applyRentCompanyList = data;
      }
    },
    handleReset(val) {
      this.searchData = val;
      this.getList();
    },
    handleSearch(val) {
      this.currPage = 1;
      this.pageSize = 20;
      this.searchData = val;
      console.log(this.searchData)
      this.getList();
    },
    changePage(val) {
      this.currPage = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getCurrentRowData(row) {
      // console.log(row);
      // todo
    },
    async updateContractStatus(row) {
      const {
        status,
        id,
        signNum
      } = row
      let params = {
        contractId: id,
        contractType: 1, // 合同类型：1 租赁合同，2 代扣合同
        contractStatus: status === 1 ? 2 : 1,
        signNum: signNum
      }
      try {
        const {
          data: {
            success
          }
        } = await updateContractStatus(params)
        if (success) {
          this.getList();
          this.$Message.success("成功");
        }
      } catch (e) {
        console.log(e)
      }
    },
    navtoEdit(row) {
      const { id } = row;
      this.contractId = id;
      this.type = 2;
      this.modalTitle = "编辑租赁合同"
      this.modalShow = true;
    },
    navtoContractDetail(row) {
      const { id } = row;
      this.contractId = id;
      this.viewShow = true;
    },
    onCreate() {
      this.type = 1;
      this.modalTitle = "新增租赁合同"
      this.modalShow = true;
    },
    addConfirm() {
      this.getList();
      this.getContractNames()
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-wrap {
    margin: 0 0 10px;
    button {
      margin: 0 0 0 10px;
      background-color: #FF8533;
      border-color: #FF8533;
      color: #fff;
    }
  }
  .lease-table-container {
    min-width: 1050px;
  }
</style>
