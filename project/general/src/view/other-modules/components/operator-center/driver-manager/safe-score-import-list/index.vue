<template>
  <div>
    <SearchList
      :inputList="inputList"
      resetTxt="重置"
      :showNumber="7"
      :spreadStatus="true"
      @on-search="search"
      @on-reset="search"
      @loadData="loadData"
    ></SearchList>
    <div class="right-flex">
      <column-select-btn
        :localName="localColumnName"
        :totalColumn="totalColumn"
        @reload="reloadColumn">
      </column-select-btn>
      <Button
        v-hasAuth="'safe-import-batchDelete'"
        type="error"
        class="right15"
        @click="deleteItem(true)"
        :disabled="selectList.length===0"
      >批量删除</Button>
      <ImportFile
        v-hasAuth="'safe-import-import'"
        class="import-btn right15"
        :toDownTemplateUrl="downloadUrl"
        :importFileUrl="importUrl"
        btnText="导入"
        type="success"
        @refresh="getTableList"
      ></ImportFile>
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
      @selectHandle="selectHandle"
    >
      <template slot-scope="params" slot="action">
        <div class="middle-flex">
          <Button
            v-hasAuth="'safe-import-detail'"
            type="text"
            size="small"
            class="textBtn"
            @click="openDetail(params.data.row,true)"
          >详情</Button>
          <Button
            v-hasAuth="'safe-import-edit'"
            type="text"
            size="small"
            class="textBtn"
            @click="openDetail(params.data.row,false)"
          >编辑</Button>
          <Dropdown @on-visible-change="changeIcon" style="margin-left:7px;">
            <div class="textBtn">
                更多
                <Icon v-show="!isUpMenu" type="ios-arrow-down"></Icon>
                <Icon v-show="isUpMenu" type="ios-arrow-up"></Icon>
            </div>
            <DropdownMenu slot="list">
                <DropdownItem class="textBtn" v-hasAuth="'safe-import-delete'">
                  <p @click.stop="deleteItem(false,params.data.row)">删除</p>
                </DropdownItem>
                <DropdownItem class="textBtn" v-hasAuth="'safe-import-history'">
                  <p @click.stop="openHandleHistory(params.data.row)">操作日志</p>
                </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </template>
    </m2-table>
    <!-- 编辑 -->
    <!-- 详情 -->
    <detail-modal
      :show="isDetailModal"
      :uuid="editInfo.uuid"
      :isDetail="isDetail"
      @close="isDetailModal=false"
      @refresh="getTableList"
    ></detail-modal>
    <!-- 操作日志 -->
    <history-modal
      :show="isHistoryModal"
      :uuid="editInfo.uuid"
      @close="isHistoryModal=false"
    ></history-modal>
  </div>
</template>
<script>
import { inputList, parColumns } from "./fields";
import m2Table from "_a/m2-table/v-table";
import countyCity from "_g/mixins/countyCity";
import ImportFile from "./components/import-file.vue";
import detailModal from "./components/detail-modal";
import historyModal from "./components/history-modal";
import columnSelectBtn from "_a/m2-column-select/index.vue";
import columnSelectMix from "_a/m2-column-select/mixin";
import {
  axiosSafeScoreEachLevelList,
  axiosSafeScoreImportList,
  axiosSafeScoreDelete
} from "_o/api/driver.js";
export default {
  name: "",
  data() {
    return {
      localColumnName: 'safeScoreImportListColumn',   //local存储的本页面column唯一key值
      parColumns: [],                      //table绑定的parColumns值
      totalColumn: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: false,
      // 导出按钮disabled
      isExportBtn:false,
      // 下载导入模板
      downloadUrl: "/download/security_import_tmpl.xlsx",
      // 上传导入接口
      importUrl: "/api/securityPoint/import/upload",
      isUpMenu: false,
      isHistoryModal: false,
      isDetailModal: false,
      editInfo: {},
      selectList: [],
      isDetail: true
    };
  },
  components: {
    m2Table,
    ImportFile,
    detailModal,
    historyModal,
    columnSelectBtn
  },
  mounted() {
    this.getTableList();
    this.getAllCityList()
    this.getClasses()
    this.inputList[6].cascaderList = this.cascaderCityList
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
    formatTime(obj,key){
      if(obj[key]){
        obj[key] = this.$moment(obj[key]).format('YYYY-MM-DD')
      }
    },
    getTableList() {
      let params = {
        ...this.searchData,
        pageSize: this.pageSize,
        currPage: this.current
      };
      this.formatTime(params,'entryEndTime')
      this.formatTime(params,'entryStartTime')
      this.formatTime(params,'occurEndTime')
      this.formatTime(params,'occurStartTime')
      this.formatTime(params,'createStartTime')
      this.formatTime(params,'createEndTime')

      this.isLoading = true;
      axiosSafeScoreImportList(params)
        .then(res => {
          this.isLoading = false;
          let data = res.data.data;
          this.tableData = (data && data.list) || [];
          this.total = data.totalCount || 0;
          this.selectList.splice(0,this.selectList.length)
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
    // 删除item
    deleteItem(isBatch,item){
      this.$Modal.confirm({
        title: "警告",
        content:
          "<p>删除分类后将无法进行对应项的安全分扣除，确定要删除吗？</p>",
        onOk: () => {
          let params = {
            uuids: isBatch ? this.selectList : [item.uuid]
          };
          axiosSafeScoreDelete(params).then(res => {
            this.$Message.success("删除成功!");
            this.getTableList();
          });
        }
      });
    },
    // 打开处理记录
    openHandleHistory(item){
      console.log(123)
      this.editInfo = item
      this.isHistoryModal = true
    },
    getClasses() {
      axiosSafeScoreEachLevelList({levelType:1}).then(res => {
        let data = res.data.data;
        this.inputList[9].cascaderList = this.formatCascader(data, false);
      });
    },
    formatCascader(list, isAll = true, level=1) {
      let resData = []
      list.forEach(item => {
        let obj = {
          label: item,
          value: item,
          level: level,
          children: []
        }
        level<5 && ( obj.loading = false )
        resData.push(obj)
      });
      return resData
    },
    // 级联懒加载
    loadData (item, callback) {
      item.loading = true;
      let params = {
        levelType: item.level+1,
        levelName: item.value
      }
      axiosSafeScoreEachLevelList(params).then(res => {
        let data = res.data.data || []
        if(data.length>0){
          item.children = this.formatCascader(data,true,item.level+1)
          item.loading = false
          callback();
        }else{
          item.loading = false
          delete item.loading
          callback();
        }
      })
    },
    // 详情
    openDetail(item,isDetail) {
      this.editInfo = { ...item }
      this.isDetailModal = true;
      this.isDetail = isDetail
    },
    // 批量选择列表
    selectHandle(list){
      this.selectList = list.map(item=>item.uuid)
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