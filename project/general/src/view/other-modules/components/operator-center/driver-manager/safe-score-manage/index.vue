<template>
  <div>
    <SearchList
      :inputList="inputList"
      resetTxt="重置"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <div class="right-flex">
      <column-select-btn
        :localName="localColumnName"
        :totalColumn="totalColumn"
        @reload="reloadColumn">
      </column-select-btn>
      <export-file
        v-hasAuth="'safe-manage-export'"
        type="success"
        class="right15"
        :isDisabled="tableData.length===0"
        exportUrl="/api/securityPoint/manager/export"
        exportFileName="安全分列表.pdf"
        :queryData="searchData"
        btnText="导出"
      ></export-file>
    </div>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :isLoading="isLoading"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot-scope="params" slot="action">
        <div class="middle-flex">
          <Button
            v-hasAuth="'safe-manage-detail'"
            type="text"
            size="small"
            class="textBtn"
            @click="moveToDetailList(params.data.row)"
          >明细</Button>
          <Button
            v-if="Number(params.data.row.score)<100"
            type="text"
            size="small"
            class="textBtn"
            @click="handleEvent(params.data.row)"
            v-hasAuth="'safe-manage-handle'"
          >处理</Button>
          <Dropdown @on-visible-change="changeIcon" style="margin-left:7px;">
            <div class="textBtn">
                更多
                <Icon v-show="!isUpMenu" type="ios-arrow-down"></Icon>
                <Icon v-show="isUpMenu" type="ios-arrow-up"></Icon>
            </div>
            <DropdownMenu slot="list">
                <DropdownItem class="textBtn" v-hasAuth="'safe-manage-driverD'">
                  <p @click.stop="moveToDriverDetail(params.data.row)">司机详情</p>
                </DropdownItem>
                <DropdownItem class="textBtn" v-hasAuth="'safe-manage-history'">
                  <p @click.stop="openHandleHistory(params.data.row)">处理记录</p>
                </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </template>
    </m2-table>
    <!-- 新增 -->
    <handle-modal
      :show="isHandleModal"
      :editInfo="editInfo"
      @close="isHandleModal=false"
      @refresh="getTableList"
    ></handle-modal>
    <!-- 处理记录 -->
    <handle-history-modal
      :show="isHistoryModal"
      :uuid="editInfo.driverUuid"
      @close="isHistoryModal=false"
    ></handle-history-modal>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import handleModal from "./components/handle-modal";
import handleHistoryModal from "./components/handle-history-modal";
import m2Table from "_a/m2-table/v-table";
import countyCity from "_g/mixins/countyCity";
import columnSelectMix from "_a/m2-column-select/mixin";
import ExportFile from "_a/export-file/exportFile";
import columnSelectBtn from "_a/m2-column-select/index.vue";
import {
  axiosSafeScoreManageList
} from "_o/api/driver.js";
export default {
  name: "",
  data() {
    return {
      parColumns: [],
      totalColumn: parColumns,
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: false,
      // 导出按钮disabled
      isUpMenu: false,
      isHandleModal: false,
      isHistoryModal: false,
      editInfo: {},
      localColumnName: 'safeScoreManage'
    };
  },
  components: {
    handleModal,
    handleHistoryModal,
    m2Table,
    ExportFile,
    columnSelectBtn
  },
  mounted() {
    this.getTableList();
    this.getAllCityList()
    this.inputList[4].cascaderList = this.cascaderCityList
  },
  mixins: [countyCity,columnSelectMix],
  methods: {
    changeIcon(value){
      this.isUpMenu = value
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.isLoading = true;
      axiosSafeScoreManageList(params)
        .then(res => {
          this.isLoading = false;
          let data = res.data.data;
          this.tableData = (data && data.list) || [];
          this.total = data.totalCount || 0;
        })
        .catch(err => {
          this.isLoading = false;
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
    // 点击处理按钮
    handleEvent(item) {
      this.editInfo = { ...item }
      this.isHandleModal = true
    },
    // 跳转到司机详情
    moveToDriverDetail(item){
      this.$router.push(`/opCenter/driver/staff-detail/${item.driverUuid}`)
    },
    // 跳转到明细列表
    moveToDetailList(item){
      this.$router.push(`/opCenter/driver/safe-score/detail/${item.driverUuid}`)
    },
    // 打开处理记录
    openHandleHistory(item){
      console.log(11111)
      this.editInfo = item
      this.isHistoryModal = true
    }
  }
};
</script>
<style lang="less">
.tableImg {
  width: 40px;
  height: 40px;
  margin: 5px 0;
}
</style>