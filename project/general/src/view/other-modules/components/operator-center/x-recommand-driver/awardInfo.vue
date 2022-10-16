<template>
  <div>
    <div class="passenger-recommand-detail">
      <div class="basic-info">
        <Row type="flex" :gutter="20" style="align-items:center;margin-bottom: 10px;">
          <Col><label for="">规则ID：</label></Col>
          <Col :span="5"><Input v-model="searchParams.ruleId"></Input></Col>
          <Col><Button type="primary" @click="searchData">搜索</Button></Col>
        </Row>
        <div>
          <Form
            ref="form"
            :model="basicInfo"
            label-position="left"
            style="padding-left: 30px;"
          >
            <Row v-for="list in basicInfoFields" :key="list.index">
              <Col v-for="item in list" :span="item.span" :key="item.index">
                <FormItem :label="item.title" :label-width="item.labelWidth">
                  <span v-if="item.render">{{
                    item.render(basicInfo[item.value], basicInfo)
                  }}</span>
                  <span v-else>{{ basicInfo[item.value] }}</span>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div class="reward-list">
        <p class="title"><b>奖励列表</b></p>
        <search-list
          ref="searchForm"
          :inputList="detailInputList"
          @on-change="setExportParams"
          @cascade-change="setExportParams"
          @clear-cascade="setExportParams"
          @on-search="searchData"
          @on-reset="resetData"
        ></search-list>
        <div style="display: flex">
          <export-file
            :queryData="{ ...exportParams }"
            exportUrl="/api/resource/recruit/recommend/passenger/reward/export"
            btnText="导出查询结果"
            baseUrlKey="_baseResourceRecruit"
            exportFileName="推荐奖励列表.csv"
            v-hasAuth="'x-passenger-award-export'"
          ></export-file>
          <Button
            type="primary"
            style="margin-left: 20px;margin-right: 20px"
            @click="batchTableData"
            v-hasAuth="'x-passenger-award'"
            >批量设为已发放</Button
          >
          <ImportFile
            v-hasAuth="'x-passenger-import'"
            btnText="导入现金发放记录"
            sameMessage="每次最多导入500条，超过500条的系统将只对前500条进行处理。"
            on-success="uploadSuc"
            :importFileUrl="importUrl"
            baseUrlName="_baseResourceRecruit"
            :toDownTemplateUrl="downLoadUrl"
            @on-success="uploadSuccess"
          >
          </ImportFile>
        </div>
        <v-table
          :current="current"
          :total="total"
          :pageSize="pageSize"
          :parColumns="tableColumns"
          :parTableData="tableData"
          style="margin-top: 20px;"
          @selectHandle="selectionChange"
          @changePage="tablePageChange"
          @changePageSize="tablePageSizeChange"
        ></v-table>
      </div>
    </div>
     <Modal
      v-model="showRecord"
      title="操作记录"
    >
      <div class="showRecord-content">
        <v-table
          :parColumns="modalTable.tableColumns"
          :parTableData="modalTable.tableData"
          :isShowPage="false"
        />
      </div>
      <div slot="footer">
        <Button
          type="primary"
          @click="showRecord = false"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  basicInfoFields,
  detailInputList,
  detailTableColumns,
  detailRecordColumns
} from "./conf";
import exportFile from "_a/export-file/exportFile";
import ImportFile from '_a/import-file/index.vue'
import {
  getDetailBasicInfo,
  getPassengerAwards,
  exportListData,
  passengerReward,
  passengerCancelReward,
  axiosGetBankList,
  getDetailRecord,
  axiosReference,
  queryTotalInfo
} from "_o/api/operator-carrier";
export default {
	components: { exportFile,ImportFile },
	props: {
		ruleId: {
			type: String,
			default: ''
		}
	},
  data() {
    return {
      basicInfoFields,
      importUrl: '/api/resource/recruit/recommend/passenger/reward/import',
      downLoadUrl: '/downloadExcel/乘推司导入现金发放记录.xlsx',
      detailInputList: JSON.parse(JSON.stringify(detailInputList)),
      basicInfo: {
        talentCount: '',
        talentScoutCount: '',
        issuedRewardAmount: '',
        unissuedRewardAmount: ''
      },
      searchParams: {},
      current: 1,
      total: 0,
      pageSize: 10,
      showRecord: false,
      tableColumns: detailTableColumns(this),
      tableData: [],
      selectionTableData: [],
      modalTable: {
        current: 1,
        pageSize: 10,
        tableColumns: detailRecordColumns(this),
        tableData: []
      },
      exportParams: {}
    };
  },
  mounted() {
    this.getBasicInfo();
    this.getTableData();
    this.getBankList();
  },
  methods: {
    uploadSuccess() {
      this.getTableData();
    },
    getBasicInfo() {
      const params = {};
      const ruleId =  this.searchParams.ruleId
      if(this.searchParams.ruleId) {
        params.ruleId = ruleId
      }
      queryTotalInfo(params).then(res => {
          let data = res.data.data;
          this.basicInfo = data;
        });
      // if(this.ruleId) {
        
      // }else {
      //   axiosReference().then((res) =>{
      //     this.basicInfo = res.data.data;
      //   })
      // }
    },
    getBankList() {
      axiosGetBankList({}).then(res => {
        let list = res.data.data;
        let result = list.map(item => {
          return { value: item.bankName, label: item.bankName };
        });
        this.detailInputList[6].dropList = result;
      });
    },
    searchData() {
      this.current = 1;
      this.getTableData();
      this.getBasicInfo()
    },
    resetData() {
      this.current = 1;
      this.searchParams = {};
      this.getTableData();
    },
    // 批量设置数据
    batchTableData() {
      let _this = this;
      let arr = [];
      this.selectionTableData.map(item => {
        arr.push(item.id);
      });
      if (arr.length <= 0) {
        this.$Message.warning("请先勾选一条记录");
        return;
      }
      this.$Modal.confirm({
        title: "确定将已选择的记录设置为已发放？",
        onOk() {
          passengerReward({
            idList: arr,
            rewardTime: _this.translateTime(new Date())
          }).then(res => {
            const { data } = res
            if(data.success) {
              _this.$Message.success("批量发放奖励成功");
              _this.getTableData();
              _this.getBasicInfo();
            }else {
              let list = data.data.rewardFailedList;
              for (let i = 0, length = list.length; i < length; i++) {
                let str = "";
                str += "被推荐司机：" + list[i].talentName;
                str += " 推荐人姓名: " + list[i].talentScoutName;
                str += "奖励失败， 原因: " + list[i].failedReason;
                this.$Message.warning(str);
              }
            }
          });
        }
      });
    },
    // 获取列表数据
    getTableData() {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      const searchData = this.$refs.searchForm.getSearchData()
      // 时间处理
      searchData.rewardValidTimeBegin &&
        (searchData.rewardValidTimeBegin = this.translateTime(
          searchData.rewardValidTimeBegin
        ));
      searchData.rewardValidTimeEnd &&
        (searchData.rewardValidTimeEnd = this.translateTime(
          searchData.rewardValidTimeEnd
        ));

      const params = Object.assign(conf, searchData, this.searchParams);
      getPassengerAwards(params).then(res => {
        this.$store.commit("changeLoadingFlag", false);
        let list = res.data.data.list;
        list.forEach(item => {
          if (item.rewardStatus === 1 || item.rewardType != 1) {
            item._disabled = true;
          }
        });
        this.tableData = list;
        this.total = res.data.data.totalCount;
      });
    },
    tablePageChange(page) {
      this.current = page;
      this.getTableData();
    },
    tablePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTableData();
    },
    // 表格选中事件
    selectionChange(selection) {
      this.selectionTableData = selection;
    },
    // 奖励与取消奖励事件
    rewardOrCancle(data) {
      let _this = this;
      let status = data.rewardStatus;
      // 奖励
      if (status !== 1) {
        this.$Modal.confirm({
          title: "是否确认发放奖励?",
          onOk() {
            passengerReward({
              idList: [data.id],
              rewardTime: _this.translateTime(new Date())
            }).then(res => {
              _this.$Message.success("发放奖励成功");
              _this.getTableData();
              _this.getBasicInfo();
            });
          }
        });
      } else {
        // 取消奖励
        this.$Modal.confirm({
          title: "是否确认取消奖励?",
          onOk() {
            passengerCancelReward({
              id: data.id
            }).then(res => {
              _this.$Message.success("取消奖励成功");
              _this.getTableData();
              _this.getBasicInfo();
            });
          }
        });
      }
    },
    translateTime(date) {
      let now = new Date(date);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let day = now.getDate();
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    // 获取操作记录列表
    getModalTableData(data) {
      getDetailRecord({
        inviteRecordId: data.id
      }).then(res => {
        let list = res.data.data.list;
        this.modalTable.tableData = list;
      });
    },
    setExportParams() {
      this.exportParams = this.$refs.searchForm.getSearchData()
    }
  }
};
</script>
<style lang="less">

.passenger-recommand-detail {
  .title {
    font-size: 16px;
    margin: 10px 0;
  }

  .basic-info {
    border-bottom: 1px solid #aaa;
  }

  .ivu-form-item {
    margin-bottom: 10px;

    .ivu-form-item-label,
    .ivu-form-item-content {
      font-size: 14px;
    }
  }
}
 .new-label1 .ivu-form-item-label{
      width: 96px!important;
  }
  .new-label1:nth-child(2) .ivu-form-item-label{
      width: 70px!important;
  }
  .new-label{
    display: flex;
    .ivu-form-item{
      width: 210px;
    }
    .ivu-form-item-label{
      width: 82px!important;
    }
  }
  .passenger-name{
    margin-left:10px;
    position: relative;
    span{
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #02a7f0;
      position: absolute;
      left: -10px;
      top: 8px
    }
  }
</style>


