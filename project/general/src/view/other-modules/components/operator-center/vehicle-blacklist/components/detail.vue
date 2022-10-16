<!--
 * @Author: NapierPLUS
 * @Date: 2021-07-20 21:14:45
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-08-19 15:28:31
 * @Description:
-->
<template>
  <Modal
    ref="addmodal"
    v-model="showModal"
    title="申报单详情"
    :width="1400"
    :mask-closable="false"
    closable
  >
    <p class="info-title">基本信息</p>
    <Row>
      <Col span="6">
      <span>公司名称：{{detailData.authName}}</span>
      </Col>
      <Col span="6">
      <span>收款单位：{{detailData.collectionCompany}}</span>
      </Col>
      <Col span="6">
      <span>开户行：{{detailData.accountBank}}</span>
      </Col>
      <Col span="6">
      <span>提报日期：{{$moment(detailData.createTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
      </Col>
    </Row>
    <Row></Row>
    <p class="info-title">代扣明细</p>
    <Row>
      <searchList ref="searchList" :inputList="inputList" @on-search="handleSearch" @on-reset="reset">
      </searchList>
    </Row>
    <export-file
      exportUrl="/api/assets/v1/deductionDeclarationAudit/exportDeclarationDetail"
      baseUrlKey="_base4Asset"
      exportFileName="对账单导出.xlsx"
      :queryData="searchData"
      btnText="导出"
      style="margin-bottom:20px"
    ></export-file>
    <VTable
      :total="total"
      :current="pageNum"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="detailColumns"
      :parTableData="tableData"
      :height="300"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
    <div slot="footer">
      <Button @click="showModal = false">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import VTable from "_a/v-table/v-table.vue"
import { inputList, detailColumns } from "./fields"
import { declarationDetail, queryDeductionRunning, queryDeclareDetailList } from "_o/api/lease"

import exportFile from "_a/export-file/exportFile";
export default {
  components: {
    VTable,
    exportFile
  },
  props: {
    detailData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      showModal: false,
      fileName: "",
      fileUuid: "",
      inputList,
      detailColumns: detailColumns(this),
      pageSize: 10,
      pageNum: 1,
      total: 0,
      isLoading: true,
      tableData: [],
      searchData: {},
      showSubModal: false,
      billid: ""
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.$refs.searchList.resetData()
      } else {
        this.init()
      }
    }
  },
  mounted() {
  },
  methods: {
    init() {
      this.reset()
    },
    changeShowModal() {
      this.showModal = !this.showModal;
    },
    handleSearch(val) {
      this.getList(val)
    },
    getDetail(row) {
      this.detailId = row.id
      this.detailData = row
      this.$refs.detailModal.changeShowModal();
    },
    getList(val = {}) {
      let params = {
        ...val,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        // uuid:this.detailData.uuid,
        declareUuid: this.detailData.uuid,

      }
      this.searchData = {
        ...val,
        pageSize: this.pageSize,
        currPage: this.pageNum,
        declareUuid: this.detailData.uuid,
      }
      // queryDeclareDetailList(params).then(res =>{
      queryDeclareDetailList(params).then(res => {
        if (res.data && res.data.success) {
          this.tableData = res.data.data.list || []
          this.total = res.data.data.totalCount
        }
      })
    },
    reset() {
      this.getList()
    },
    showDetailModal(row) {
      this.billid = row.billId
      this.showSubModal = true
    },
    changePage(val) { // 列表换页
      this.pageNum = val;
      this.getList()
    },
    changePageSize(val) { // 设置列表行数
      this.pageSize = val;
      this.getList()
    },
  }
};
</script>

<style lang="less" scoped>
.info-title {
      font-size: 20px;
      font-weight: bold;
      padding: 15px 0;
    }
</style>
