<template>
  <div>
    <SearchList
      :inputList="inputList"
      :searchTxt="'查询'"
      :resetTxt="'重置'"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template
        slot="action"
        slot-scope="params"
      >
        <Button
          v-hasAuth="''"
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="openDetail(params.data.row)"
        >
          详情
        </Button>
        <Button
          v-hasAuth="''"
          v-if="params.data.row.reviewStatus===1"
          ghost
          type="success"
          size="small"
          class="tableBtn"
          @click="passItem(params.data.row)"
        >
          审核通过
        </Button>
        <Button
          v-hasAuth="''"
          v-if="params.data.row.reviewStatus===1"
          ghost
          type="error"
          size="small"
          @click="failItem(params.data.row)"
        >
          审核不通过
        </Button>
      </template>
    </m2-table>
    <detail-modal
      :show="openDetailModal"
      :info="editInfo"
      @close="openDetailModal = false"
    >
    </detail-modal>
    <fail-modal
      :show="openFailModal"
      :info="editInfo"
      @close="openFailModal = false"
      @getList="getTableList"
    >
    </fail-modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns } from "./fields";
import detailModal from "./components/detail-modal"
import failModal from "./components/fail-modal"
import {
  certificateList,
  certificatePass
} from "_o/api/passenger.js";
export default {
  name: "",
  components: {
    m2Table,
    detailModal,
    failModal
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {
        reviewStatus:1
      },
      openDetailModal: false,
      openFailModal: false,
      editInfo: "",
      isLoading: true,
      cityList: []
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      this.isLoading = true
      certificateList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 详情
    openDetail(item) {
      this.editInfo = item || {}
      this.openDetailModal = true
    },
    // 审核不通过
    failItem(item){
      this.editInfo = item || {}
      this.openFailModal = true
    },
    // 审核通过
    passItem(item) {
      let that = this
      this.$Modal.confirm({
        title: "是否确认审核通过？",
        onOk() {
          certificatePass({ uuid: item.uuid }).then(res => {
            that.$Message.success("操作成功！")
            that.getTableList()
          });
        }
      });
    }
  }
};
</script>
<style scoped lang='less'>
</style>
