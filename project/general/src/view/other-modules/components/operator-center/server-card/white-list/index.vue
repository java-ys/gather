<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <div class="text-right">
      <Button
        v-hasAuth="'servercard-white-add'"
        type="primary"
        class="right15"
        @click="isAddDriver=true"
      >
        添加司机
      </Button>
      <Button
        v-hasAuth="'servercard-white-batchre'"
        type="error"
        ghost
        @click="batchRemove()"
      >
        批量移除
      </Button>
    </div>

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
      @selectHandle="selectHandle"
    >
      <template
        slot-scope="params"
        slot="action"
      >
        <!-- 非失效状态 -->
        <Button
          v-hasAuth="'servercard-white-remove'"
          ghost
          type="error"
          size="small"
          @click="shiftItem(params.data.row)"
        >移除白名单</Button>
      </template>
    </m2-table>
    <add-driver
      :show="isAddDriver"
      @close="isAddDriver=false"
      @getList="getTableList"
    ></add-driver>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import addDriver from './add.vue'
import { inputList, parColumns } from "./fields";
import {
  axiosRecordWhiteList,
  axiosRecordWhiteRemove,
} from "_o/api/operator-center/server-card";

export default {
  name: "",
  data () {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: true,
      selectList: [],
      isAddDriver: false
    };
  },
  components: {
    m2Table,
    addDriver
  },
  mounted () {
    this.getTableList();
  },
  methods: {
    search (data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList () {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };

      this.isLoading = true
      axiosRecordWhiteList(params).then(res => {
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
    changePage (val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize (val) {
      this.current = 1
      this.pageSize = val;
      this.getTableList();
    },
    // 点击移除白名单
    shiftItem (item) {
      let that = this
      this.$Modal.confirm({
        title: '移除白名单',
        content: '确认将该司机移除白名单?',
        onOk () {
          that.axiosRemote([item.reportUuid])
        }
      });
    },
    // 批量选择
    selectHandle (list) {
      this.selectList = list.map(item => item.reportUuid)
    },
    // 批量移除
    batchRemove () {
      let that = this
      if(that.selectList.length===0){
        this.$Message.warning('请先选择需要批量移除的数据！')
        return false
      }
      this.$Modal.confirm({
        title: '移除白名单',
        content: '确认批量移除白名单？',
        onOk: () => {
          that.axiosRemote(that.selectList)
        }
      })
    },
    // 移除请求
    axiosRemote(list){
      axiosRecordWhiteRemove({ reportUuidList: list }).then(res => {
        this.$Message.success('移除成功！')
        this.selectList = []
        this.getTableList()
      })
    }
  }
};
</script>
<style scoped lang='less'>
</style>