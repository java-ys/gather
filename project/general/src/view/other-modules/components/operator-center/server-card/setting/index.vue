<template>
  <div>
    <SearchList :inputList="inputList" @on-search="search" @on-reset="search"></SearchList>
    <div class="text-right">
      <Button v-hasAuth="'servercard-setting-add'" type="primary" @click="handleItem(1)">
        新建服务卡
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
    >
      <template slot-scope="params" slot="action">
        <!-- 非失效状态 -->
        <Button
          v-if="params.data.row.scStatus!==2"
          v-hasAuth="'servercard-setting-edit'"
          ghost type="warning" size="small" class="tableBtn"
          @click="handleItem(2,params.data.row)"
        >编辑</Button>
        <!-- 未开始和生效中 -->
        <Button
          v-if="params.data.row.scStatus!==2"
          v-hasAuth="'servercard-setting-stop'"
          ghost type="error" size="small" class="tableBtn"
          @click="shiftItem(params.data.row,2)"
        >停用</Button>
        <Button
          v-hasAuth="'servercard-setting-detail'"
          ghost type="info" size="small"
          @click="handleItem(3,params.data.row)"
        >查看</Button>
      </template>
    </m2-table>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns,businessLine } from "./fields";
import {
  axiosRecordPageList,
  axiosRecordStatus,
} from "_o/api/operator-center/server-card";
import { getAppointedCityList } from '_g/api/common.js'

export default {
  name: "",
  data() {
    return {
      parColumns:parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      isLoading: true
    };
  },
  components: {
    m2Table
  },
  mounted() {
    this.getCityList()
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    // 根据产品线获取城市列表
    getCityList() {
      let params = {
        businessLineList: businessLine
      }
      getAppointedCityList(params).then(res=>{
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList||[]
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        transformData.unshift({label:'全部',value:'111111'})
        this.inputList[1].dropList = transformData
      })
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      params.cityCode && ( params.cityCode = params.cityCode.join(',') )
      params.plType && ( params.plType = params.plType.join(',') )
      this.isLoading = true
      axiosRecordPageList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData  = data.list || [];
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
      this.current = 1
      this.getTableList();
    },
    // type，同 2-编辑，3-详情
    handleItem(type,item){
      if(type===1){
        // 新增server-card-add
        this.$router.push(`/opCenter/server-card/setting-add?type=${type}`)
      }else{
        this.$router.push(`/opCenter/server-card/setting-add/${item.recordUuid}?type=${type}`)
      }
    },
    // 点击停用/启用
    shiftItem(item,value){
      let params = {
        recordUuid: item.recordUuid,
        scStatus: value,
        cityCode: item.cityCode,
        plType: item.plType
      }
      if(value===1){
        // 当前为未生效状态
        this.axiosShiftItem(params)
      }else{
        // 当前为启用状态，点击停用
        let that = this
        this.$Modal.confirm({
          title: '是否确认停用当前服务卡？',
          onOk() {
            that.axiosShiftItem(params)
          }
        });
      }
    },
    // 请求停用启用接口
    axiosShiftItem(params){
      let that = this
      let msg = params.scStatus === 1 ? '启用成功！' : '停用成功！'
      axiosRecordStatus(params).then(res => {
        that.$Message.success(msg)
        that.getTableList()
      });
    }
  }
};
</script>
<style scoped lang='less'>
</style>