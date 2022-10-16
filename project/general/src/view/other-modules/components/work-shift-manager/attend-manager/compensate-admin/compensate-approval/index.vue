<template>
  <div>
    <div class="customer">
      <SearchList :inputList="inputList" @on-search="searchBtn" @on-reset="resetBtn"></SearchList>
    </div>
    <div>
      <div class="log">
        <Button type="primary" style="float:right;">日志</Button>
      </div>
      <VTable
        :total="total"
        :current="currentPage"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></VTable>

      <Modal v-model="detailModalShow" width="50%" :title="modalTitle" :mask-closable="false">
        <!-- <detail :detailObj="detailObj"></detail> -->
        <cancel :detailObj="detailObj"></cancel>
        <div slot="footer">
          <Button type="primary" @click="detailModalShow = false" v-if="modalTitle==='时长补偿详情'">返回</Button>
          <Button type="primary" @click="receiveApproval" v-if="btnFlag">审批通过</Button>
          <Button type="default" @click="rejectApproval" v-if="btnFlag">审批驳回</Button>
          
        </div>
      </Modal>
      <!-- <Modal
        v-model="cancelModalShow"
        width="50%"
        title="时长补偿取消"
        :mask-closable="false"
        ok-text="补偿取消"
        cancel-text="返回"
        @on-ok="compensatebtn"
      >
        <cancel :detailObj="detailObj"></cancel>
      </Modal> -->
    </div>
  </div>
</template>
<script>
import { getProvinceCityAllList, getConfigCityList } from "_g/api/common.js";
import vTable from "_a/v-table/v-table.vue";
import searchList from "_a/search-list/search-list.vue";
import cancel from "./cancel.vue";
import ExportFile from "_a/export-file/exportFile";
import { compensateList } from "./index.js";
import { deepClone } from "./utils.js";
import { cpTranslate } from "@/libs/tools";
export default {
  components: {
    ExportFile,
    vTable,
    searchList,
    cancel
  },
  data() {
    const { inputList, columns } = deepClone({}, compensateList);
    return {
      exportUrl: "/healthCar/mask/mask/export",
      inputList,
      columns: columns(this),
      tableData: [
        {
          driverName: "张三",
          phoneNum: "1353778765",
          licensePlate: "苏AD88888",
          director: "李四",
          mobilePhone: "18115188999",
          status: "故障",
          subtype: "车机故障",
          apply: "2019/12/2 10:11",
          interval: "2019/12/2 10:00 - 2019/12/20 14:00",
          duration: "4",
          state: "待审批",
          approval: "hello",
          id: 0
        },
        {
          cityName: "苏州",
          cityCode: "南京通有领行科技有限公司",
          driverName: "李四",
          mobilePhone: "13537787685",
          licensePlate: "苏AD88888",
          status: "故障",
          subtype: "车机故障",
          apply: "2019/12/2 10:11",
          interval: "2019/12/2 10:00 - 2019/12/2 14:00",
          duration: "4",
          state: "待审批",
          approval: "hello",
          id: 1
        }
      ],
      detailModalShow: false,
      cancelModalShow: false,
      detailObj: {},
      searchParams: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      modalTitle: "",
      btnFlag: false
    };
  },
  mounted() {
    this.getCityList();
    this.inputList[1].cascaderList = JSON.parse(
      localStorage.getItem("pcOperatorList")
    );
    // 使其表格不一直保持加載中
    this.$store.commit("changeLoadingFlag", false);
    // this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
  },
  methods: {
    // 获取城市列表
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data);
          this.inputList[0].cascaderList = list;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    searchBtn(params) {
      console.log(params);
      this.searchParams = params;
    },
    resetBtn() {
      this.searchParams = {};
    },
    changePage() {},
    changePageSize() {},

    // 点击详情删除进行的操作
    viewDetail(rowData) {
      console.log("在这里打印", rowData);
      this.detailObj = this.tableData[rowData.id];
      this.modalTitle = "时长补偿详情";
      this.btnFlag = false;
    },
    viewCancel(rowData) {
      this.detailObj = this.tableData[rowData.id];
      this.modalTitle = "时长补偿取消"
      this.btnFlag = true;
    },
    // 补偿取消确认按钮
    receiveApproval() {
      // 取消补偿，取消补偿后，司机考勤重新计算，涉及薪酬部分再下一周期扣减
      // 需求： 通过-提示操作成功 


      console.log('审批通过')
      this.$Message.success('审批通过，操作成功')

    },
    rejectApproval() {
      this.detailModalShow = false;
      console.log('審批駁回')
      
      // 需求： 驳回：提示操作成功
      this.$Message.warning('审批通过，操作成功')
    }
  }
};
</script>
<style lang="less">
.log {
  overflow: hidden;
  margin-bottom: 10px;
}
.new-rule-modal {
  .ivu-modal-body {
    padding: 16px 0 !important;
  }
}
</style>
