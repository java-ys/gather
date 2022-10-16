<!--
 * @Descritption:
 * @Author: wangp
 * @Date: 2020-06-18 14:12:40
 * @LastEditors: wangp
 * @LastEditTime: 2020-07-28 16:15:07
-->
<template>
  <div class="app-container">
    <div class="selectBar">
      <el-form
        ref="queryForm"
        inline
        :model="queryForm"
        class="demo-form-inline"
        size="mini"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="奖励/扣款" label-width="100px">
              <el-select
                v-model="querytype"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option label="奖励" value="0"></el-option>
                <el-option label="扣款" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类目" label-width="100px">
              <el-select
                v-model="childrenType"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option v-if="querytype == '0'" label="司机服务奖励" value="11"></el-option>
                <el-option v-if="querytype == '0'" label="营销（税前）" value="12"></el-option>
                <el-option v-if="querytype == '0'" label="推荐司机" value="13"></el-option>
                <el-option v-if="querytype == '0'" label="推荐乘客" value="14"></el-option>
                <el-option v-if="querytype == '0'" label="城市补发" value="15"></el-option>
                <el-option v-if="querytype == '0'" label="司机关怀" value="16"></el-option>
                <el-option v-if="querytype == '1'" label="司机服务违规扣款" value="41"></el-option>
                <el-option v-if="querytype == '1'" label="风控（税前）" value="42"></el-option>
                <el-option v-if="querytype == '1'" label="城市扣减" value="44"></el-option>
                <el-option v-if="querytype == '0'" label="司机座谈会补贴" value="8"></el-option>
                <el-option v-if="querytype == '0'" label="线下活动奖励" value="18"></el-option>
                <el-option v-if="querytype == '0'" label="租金返还补贴" value="19"></el-option>
                <el-option v-if="querytype == '0'" label="A转UP补贴" value="7"></el-option>
                <el-option v-if="querytype == '0'" label="其他" value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖励周" label-width="100px">
              <el-date-picker
                v-model="week"
                type="week"
                :clearable="false"
                format="yyyy 第 WW 周"
                :picker-options="pickerOptions"
                placeholder="选择周"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select
                v-model="queryForm.cityCode"
                placeholder="城市"
                style="width: 200px"
                filterable
              >
                <el-option label="全部" value="-1"></el-option>
                <el-option
                  v-for="(cityObj, index) in cities"
                  :key="index"
                  :label="cityObj.orgName"
                  :value="cityObj.orgCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select
                v-model="queryForm.batchStatus"
                placeholder="请选择"
                style="width: 200px"
              >
                <el-option label="初始" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="审批通过" value="2"></el-option>
                <el-option label="审核驳回" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button
              v-if="hasPermission('offlineRewards-query')"
              v-preventReClick="3000"
              type="primary"
              @click="paramSelect"
            >搜索</el-button>
            <el-button
              v-if="hasPermission('offlineRewards-query')"
              v-preventReClick="3000"
              type="info"
              @click="reset"
            >重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <hr class="tophr" />
    <div class="main buttons">
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="offlineRewards-export-week"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
      <el-button
        v-if="hasPermission('offlineRewards-import-week')"
        v-preventReClick="3000"
        style="margin-left:10px"
        type="primary"
        size="small"
        @click="importExcel"
      >批量导入</el-button>
    </div>

    <div style="margin-top: 60px">
      <m2-el-table
        :tableData="tableData"
        :columns="weekList"
        :pageObj="pageObj"
        :options="options"
        @on-pagesize-change="pageSizeChange"
        @on-sort-change="sortChange"
        @pagesizeChange="sizeChange"
      >
        <el-table-column slot="rewardWeek" label="奖励周" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | parseDate}}~{{scope.row.endTime | parseDate}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="itemType" label="奖励/扣款">
          <template slot-scope="scope">
            <span>{{scope.row.itemType | parseType}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="batchType" label="类目">
          <template slot-scope="scope">
            <span>{{scope.row.batchTypes | parseCategory}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="奖励项" slot="batchType">
          <template slot-scope="scope">
            <span>{{ scope.row.batchTypes | parseType }}</span>
          </template>
        </el-table-column> -->
        <el-table-column slot="batchStatus" prop="batchStatus" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.batchStatus | parseStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column slot="action" label="操作项" min-width="120">
          <template slot-scope="scope">
            <el-button
              v-if="hasPermission('offlineRewards-detail')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-if="hasPermission('offlineRewards-delete-week') &&
                btnCheck(scope.row.batchStatus, 1) && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')"
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <!-- <el-button
              v-if="
                hasPermission('offlineRewards-check-week') &&
                  btnCheck(scope.row.batchStatus, 0) &&
                  scope.row.auditorUuid == userId &&
                  scope.row.auditNodeId == scope.row.selectNodeId
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleAudit(scope.row)"
            >审核</el-button> -->
            <el-button
              v-if="
                hasPermission('offlineRewards-submit-week') &&
                  btnCheck(scope.row.batchStatus, 1) && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="handleSubmit(scope.row)"
            >提交审核</el-button>
            <!-- <el-button
              v-if="
                hasPermission('offlineRewards-cancelSubmit-week') &&
                  btnCheck(scope.row.batchStatus, 0) &&
                  scope.row.auditNodeId == scope.row.selectNodeId && (scope.row.applicantUuid == userId || scope.row.applicantUuid == '')
              "
              v-preventReClick="3000"
              size="small"
              type="text"
              @click="cancelSubmit(scope.row)"
            >取消审核</el-button> -->
          </template>
        </el-table-column>
      </m2-el-table>
    </div>
    <batch-import
      v-if="batchInsertVisible"
      :batchInsertVisible="batchInsertVisible"
      title="批量导入奖励项"
      :type="weekType"
      :importParams="importParams"
      :templateHref="templateHref"
      :importAction="importAction"
      :interface="offlineRewardsImport"
      @handleSuccessImport="handleSuccessImport"
      @closeDialogHandle="closeDialogHandle"
    ></batch-import>
    <approval-modal
      v-if="audit.visible"
      :optionId="optionId"
      :importantType="importantType"
      :auditBatchType="auditBatchType"
      :auditOptionsType="auditOptionsType"
      @ruleSubmit="approvalSubmit"
    ></approval-modal>
    <audit-modal
      v-if="audit.dialogVisible"
      @reviewSubmit="approvalAudit"
    ></audit-modal>
    <detail
      v-if="detailVisible"
      :detailVisible="detailVisible"
      :batchNo="batchNo"
      @closeDialogHandle="closeDialogHandle"
    ></detail>
  </div>
</template>

<script>
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import m3elTable from "_o/components/operator-center/salary-modules/common/m3elTable";
import { weekList } from "./fields";
import { dateTimeFormat, deleteEmptyProps, getUserIdFromLocalStorage } from "_o/common/common";
import {
  queryWaterMark,
  queryCitiesWithAgent,
  auditSubmit,
  cancelAudit,
  submitVerify,
  passAudit,
  refusedAudit,
  offlineRewardsImport
} from "_o/api/salary/common";
import { toResult, deepClone } from "_o/common/salaryMixin";
import approvalModal from "../components/approvalModal";
import { approval } from "../components/index.js";
import auditModal from "../components/auditModal";
import detail from "./weekDetail";
import { queryOfflineRewards, exportOfflineRewards, deleteOfflineRewards } from "_o/api/salary/salaryRule";
import { excelDownload } from "_o/common/common";
import batchImport from "_o/components/operator-center/salary-modules/common/salaryImport/index";
import config from "@/config/config";
const apiUrl = isDev ? config.baseUrl.dev : config.baseUrl.pro
import { parseTime } from "@/libs/util";
import { isDev } from "@/micro/registerApp/appEntry";
export default {
  components: {
    exportButton,
    batchImport,
    approvalModal,
    auditModal,
    detail,
    m3elTable
  },
  filters: {
    parseDate(val) {
      if (val) {
        return parseTime(val, "{y}-{m}-{d}");
      }
      return;
    },
    parseStatus(val) {
      switch (val) {
        case 0:
          return "初始";
          break;
        case 1:
          return "审核中";
          break;
        case 2:
          return "审批通过";
          break;
        case 3:
          return "审批驳回";
          break;
      }
    },
    parseType(val) {
      if (val == 1) {
        return "奖励";
      } else if (val == 2) {
        return "扣款";
      }
    },
    parseCategory(val) {
      if (val == 11) {
        return "司机服务奖励";
      }
      if (val == 12) {
        return "营销（税前）";
      }
      if (val == 13) {
        return "推荐司机";
      }
      if (val == 14) {
        return "推荐乘客";
      }
      if (val == 15) {
        return "城市补发";
      }
      if (val == 16) {
        return "司机关怀奖励";
      }
      if (val == 41) {
        return "司机服务违规扣款";
      }
      if (val == 42) {
        return "风控（税前）";
      }
      if (val == 43) {
        return "车辆租金代扣（税前）";
      }
      if (val == 44) {
        return "城市扣减";
      }
      if (val == 18) {
        return "线下活动奖励";
      }
      if (val == 19) {
        return "租金返还补贴";
      }
      if (val == 7) {
        return "A转UP补贴";
      }
      if (val == 8) {
        return "司机座谈会补贴";
      }
      if (val == 9) {
        return "其他";
      }
    }
  },
  data() {
    return {
      importantType: 1,
      offlineRewardsImport,
      weekList,
      weekType: "week",
      toResult,
      ...approval,
      optionId: "",
      auditBatchType: 0,
      auditOptionsType: 2,
      userId: getUserIdFromLocalStorage(),
      batchNo: "",
      querytype: "",
      childrenType: "",
      week: "",
      WaterMarkInfo: "",
      pageObj: {
        size: 20,
        total: 0,
        currentPage: 1
      },
      options: {
        selection: false
      },
      pickerOptions: {
        firstDayOfWeek: 1
      },
      importParams: {
        salaryType: 2
      },
      queryForm: {
        currPage: 1,
        pageSize: 20,
        batchTypes: ["11", "12", "13", "14", "15", "16", "41", "42", "44", "18", "19", "7", "8", "9"],
        userUuid: getUserIdFromLocalStorage()
      },
      rewardDetailData: {
        talent: {},
        talentScout: {}
      },
      selectedRows: [],
      cities: [],
      tableData: [],
      exportLoading: false,
      detailVisible: false,
      batchInsertVisible: false,
      // 批量导入提示图片数组
      notePictureArr: [],
      // 导入模板下载链
      templateHref:
        apiUrl + "/salary-web-api/" + "downloadExcel/offlineReward-week.xlsx",
      // 上传excel的api地址
      importAction: "/api/salary/v1/offlineRewards/uploadData"
    };
  },
  watch: {
    querytype: {
      handler(val) {
        if (val && !this.childrenType) {
          switch (val) {
            case "0":
              this.queryForm.batchTypes = [11, 12, 13, 14, 15, 16, 18, 19, 7, 8, 9];
              break;
            case "1":
              this.queryForm.batchTypes = [41, 42, 44];
              break;
          }
        } else {
          this.childrenType = "";
        }
      },
      immediate: true
    },
    childrenType: {
      handler(val) {
        if (val) {
          this.queryForm.batchTypes = [];
          this.queryForm.batchTypes.push(this.childrenType);
        }
      },
      immediate: true
    },
    week: {
      handler(val) {
        if (val) {
          this.queryForm.beginTime = parseTime(
            new Date(this.week.getTime() - 1000 * 60 * 60 * 24),
            "{y}-{m}-{d}"
          );
          this.queryForm.endTime = parseTime(
            new Date(this.week.getTime() + 1000 * 60 * 60 * 24 * 5),
            "{y}-{m}-{d}"
          );
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getPage(this.queryForm);
    this.getWaterMarkInfo();
    this.getCitiesWithAgent();
  },
  methods: {
    importExcel() {
      this.batchInsertVisible = true;
    },
    handleSuccessImport() {
      this.batchInsertVisible = false;
      this.getPage(this.queryForm);
    },
    getWaterMarkInfo() {
      queryWaterMark()
        .then(res => {
          if (res.data.success && res.data.data) {
            this.WaterMarkInfo = res.data.data;
          }
        })
        .catch(err => {
          this.$alert("获取水印数据信息失败，请刷新页面重试");
        });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    // 带参数查询
    paramSelect() {
      this.pageObj.currentPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = this.pageObj.size;
      this.getPage(this.queryForm);
    },
    // 打开提交审核页面
    handleSubmit(row) {
      // this.audit.visible = true;
      // this.optionId = String(row.id);
      // this.auditBatchType = row.batchTypes;
      this.$confirm("确定提交至OA审批吗", {confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"}).then(() => {
        this.approvalSubmit({ auditBatchType: row.batchTypes, auditOptionsType: 2, optionId: row.id, timePeriod: 2 });
      })
    },
    handleDelete(row) {
      deleteOfflineRewards({ id: row.id }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          this.getPage(this.queryForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 打开审核页面
    handleAudit(row) {
      this.audit.dialogVisible = true;
      this.optionId = String(row.id);
      this.auditBatchType = row.batchTypes;
    },
    // 提交审核
    async approvalSubmit(params) {
      submitVerify(params).then(res => {
        if (res.data.success) {
          auditSubmit(params).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.paramSelect();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
        this.$message.error(res.data.msg);
        return;
        }
      })
    },
    // 取消审核
    cancelSubmit(row) {
      this.$confirm("确定取消审核吗?", "取消审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelAudit({
            auditOptionsType: 2,
            auditBatchType: row.batchTypes,
            optionId: String(row.id)
          }).then(res => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "取消成功!"
              });
              this.paramSelect();
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 审核
    async approvalAudit(params) {
      let queryParams = {
        auditOptionsType: this.auditOptionsType,
        auditBatchType: this.auditBatchType,
        optionId: this.optionId,
        remark: params.remark
      };
      const [err, data] = await this.toResult(this.requestType(queryParams, params.reviewStatus));
      if (err) {
        this.$alert(err.message);
        return;
      }
      this.audit.dialogVisible = false;
      this.$message.success(data.msg);
      this.paramSelect();
    },
    requestType(params, flag) {
      if (flag == 1) {
        return passAudit(params);
      } else {
        return refusedAudit(params);
      }
    },
    // 重置
    reset() {
      this.queryForm = {
        currPage: 1,
        pageSize: this.pageObj.size,
        batchTypes: ["11", "12", "13", "14", "15", "16", "41", "42", "44", "18", "19", "7", "8", "9"],
        userUuid: this.userId
      };
      this.pageObj.currentPage = 1;
      this.querytype = "";
      this.childrenType = "";
      this.week = "";
      this.getPage(this.queryForm);
    },
    handleImportSuccess() {
      this.batchInsertVisible = false;
      this.getPage(this.queryForm);
    },
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "batchAdd":
          this.batchInsertVisible = false;
          break;
      }
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 导出
    exportExcel() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "currPage" ||
          propName === "pageSize" ||
          propName === "userUuid" ||
          (requestParams[propName] instanceof Array &&
            requestParams[propName].length === 5)
        ) {
          delete requestParams[propName];
        }
      }
      if (Object.keys(requestParams).length === 0) {
        this.$alert("请先选择筛选条件");
      } else {
        for (let propName in requestParams) {
          if (
            requestParams.hasOwnProperty(propName) &&
            (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
          ) {
            delete requestParams[propName];
          }
        }
        this.exportLoading = true;
        exportOfflineRewards(this.queryForm).then(res => {
          excelDownload(res.data, "周奖励数据");
        });
      }
    },
    // 获得分页数据并解析
    getPage(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (
          requestParams.hasOwnProperty(propName) &&
          (Number(requestParams[propName]) === -1 || requestParams[propName] === "")
        ) {
          delete requestParams[propName];
        }
      }
      // 获取司机奖励发放列表
      queryOfflineRewards(deleteEmptyProps(requestParams))
        .then(res => {
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.list;
            this.pageObj.total = res.data.data.totalCount;
          } else if (!res.data.success) {
            this.$alert(res.data.msg);
            this.tableData = [];
            this.pageObj.total = 0;
          }
        })
        .catch(error => {
          this.$alert("获取分页列表数据失败，请稍后重试");
        });
    },
    pageSizeChange(v) {
      this.pageObj.currentPage = v;
      this.queryForm.currPage = v;
      this.getPage(this.queryForm);
    },
    sizeChange(v) {
      this.pageObj.currentPage = 1;
      this.pageObj.size = v;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = v;
      this.getPage(this.queryForm);
    },
    sortChange() {},
    getCitiesWithAgent() {
      queryCitiesWithAgent({})
        .then(res => {
          if (res.data.success && res.data.data) {
            if (res.data.data.cities.length === 0) {
              this.$alert("暂无开通城市数据信息，请先联系相关运营人员进行开通城市操作");
            } else {
              this.cities = res.data.data.cities;
            }
            if (res.data.data.agentInfoVos.length === 0) {
              this.$alert("获取代理商下拉选择列表数据失败，请刷新页面重试");
            } else {
              this.agents = res.data.data.agentInfoVos;
            }
          }
        })
        .catch(err => {
          this.$alert("获取数据信息失败，请刷新页面重试");
        });
    },
    handleDetail(row) {
      this.detailVisible = true;
      this.batchNo = row.id;
    },
    btnCheck(val, flag) {
      if (flag === 0) {
        const auditStatusMap = [1];
        return auditStatusMap.includes(val);
      }
      if (flag === 1) {
        const submitStatusMap = [0, 3];
        return submitStatusMap.includes(val);
      }
    }
  }
};
</script>
