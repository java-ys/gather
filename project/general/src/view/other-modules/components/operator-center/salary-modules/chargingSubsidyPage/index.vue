<template>
  <div class="app-container">


    <SearchBox>
      <div slot="content">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
          <el-row>
            <el-col :span="6">
              <el-form-item label="城市" label-width="100px">
                <el-select v-model="queryForm.cityUuid" placeholder="城市" style="width: 200px" filterable>
                  <el-option label="全部" value="-1"></el-option>
                  <template v-for="(cityObj, index) in cities">
                    <el-option :key="index" :label="cityObj.orgName" :value="cityObj.orgCode"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="车型" label-width="100px">
                <el-select v-model="carLevelCodesArray" v-loadmore="getCarTypePage" multiple collapse-tags style="width: 400px" placeholder="车型">
                  <el-option v-for="(item, index) in carTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" label-width="100px">
                <el-select v-model="queryForm.status" placeholder="状态" style="width: 200px">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="未启用" :value="1"></el-option>
                  <el-option label="启用" :value="2"></el-option>
                  <el-option label="停用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footerRight">
        <el-button v-if="hasPermission('charging-subsidy-query')" v-preventReClick="3000" size="mini" type="primary" @click="paramSelect">搜索</el-button>
        <el-button v-if="hasPermission('charging-subsidy-query')" v-preventReClick="3000" size="mini" type="info" @click="initData">重置</el-button>
      </div>
    </SearchBox>

    <div class=" buttons">
      <el-button v-if="hasPermission('charging-subsidy-add')" v-preventReClick="3000" type="primary" size="small" @click="openAdd">新增规则</el-button>
      <!-- <el-button type="primary" v-if="hasPermission('charging-subsidy-export')" v-preventReClick="3000" @click="exportExcel" size="small">批量导出</el-button> -->
      <export-button
        :loading="exportLoading"
        :queryForm="queryForm"
        queryExport="charging-subsidy-export"
        @fatherExport="exportExcel"
        @loadingStatus="loadingStatus"
      ></export-button>
    </div>
    <div style="margin-top: 60px">
      <el-table

        :row-style="{ backgroundColor: 'transparent' }"
        :data="tableData"
        style="width: 100%"
        size="mini"
        :header-cell-style="{ background: '#F5F4F2' }" fit
        highlight-current-row
        height="515"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="cityName"
          label="城市"
          min-width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="fuelType"
          label="动力类型"
          min-width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价（元/度）"
          min-width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="ratio"
          label="系数"
          min-width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="startTime"
          :formatter="startTimeFormatter"
          label="生效月份"
          min-width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{startTimeFormatter(scope.row)}}&nbsp;-&nbsp;{{endTimeFormatter(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusFormatter"
          min-width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('charging-subsidy-edit') && (scope.row.status == 1)" v-preventReClick="3000" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('charging-subsidy-detail')" v-preventReClick="3000" size="small" type="text" @click="openDetail(scope.row.uuid, scope.row.cityUuid, scope.row.cityName)">详情
            </el-button>
            <el-button v-if="hasPermission('charging-subsidy-log')" v-preventReClick="3000" size="small" type="text" @click="getLogs(scope.row.uuid, (scope.row.cityName + scope.row.fuelType + '能源账户补贴规则'))">日志
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <e-pagination
        :currPage="queryForm.currPage"
        :pageSize="queryForm.pageSize"
        :total="totalCount"
        @currentChange="handleCurrentChange"
        @pagesizeChange="handleSizeChange"
      ></e-pagination>
      <charging-subsidy-edit v-if="editVisible" :editVisible.sync="editVisible" :editForm="editForm" :title="title"
                             :isEdit="isEdit" @successHandle="successHandle" @closeDialogHandle="closeDialogHandle"
      />
      <detail :detailVisible="detailVisible" :detailData="detailData" @closeDialogHandle="closeDialogHandle" />
      <logs :logVisible="logVisible" :logTableData="logTableData" :logTotalCount="logTotalCount"
            :currentLog="currentLog" :currentId="currentId" @closeDialogHandle="closeDialogHandle"
            @handleLogsPage="handleLogsPage"
      />
    </div>
  </div>
</template>

<script>
import chargingSubsidyEdit from "./chargingSubsidyEdit";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import detail from "./chargingSubsidyDetail";
import { getLog } from "_o/api/salary/resume";
import { chargeSubsidyPage, chargeSubsidySaveOrUpdate, chargeSubsidyDetail, getCarTypePage } from "_o/api/salary/salary";
import { deleteEmptyProps, getMonthLastDay } from "_o/common/common";
import { parseTime } from "@/libs/util"
import { cityListByAll, queryCitiesWithJurisdiction, queryWaterMark, queryCitiesWithAgent } from "_o/api/salary/common";
import { chargeSubsidyExpro } from "_o/api/salary/exportApi";
import SearchBox from "_o/components/operator-center/salary-modules/searchForm/Form/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
export default {
  name: "ChargingSubsidyPage",
  components: {
    logs, chargingSubsidyEdit, detail, SearchBox, exportButton, EPagination
  },
  data() {
    return {
      exportLoading: false,
      WaterMarkInfo: "",
      carLevelCodesArray: [],
      timeArr: [],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        isDesc: "true",
        sortColumnName: "create_time",
      },
      tableData: [],

      detailVisible: false,
      logVisible: false,
      logTableData: [],
      logTotalCount: 0,
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      detailData: {},
      cities: [],
      agents: [],
      currCities: [],
      currAgents: [],
      editForm: {},
      ruleDataList: [],
      afterResetCheckBox: false,
      title: "",
      currentLog: "",
      currentId: "",
      isEdit: false,
      pageName: "",
      currentPath: "",
      editVisible: false,
      carTypes: [],
      currentPage: 1,
      fulType: {
        0: "汽油车",
        1: "纯电动汽车",
        2: "油电混合汽车",
        3: "燃料电池汽车",
        4: "增程式混动汽车",
        5: "柴油汽车",
        6: "天然气汽车",
        7: "插电式混动汽车"
      }
    }
  },
  created() {
    this.currentPath = this.$route.path;
    this.getCitiesWithAgent();
    this.getCarTypePage();
    this.getData({
      currPage: 1, pageSize: 10, isDesc: "true",
      sortColumnName: "create_time"
    });
    this.getWaterMarkInfo();
  },
  methods: {
    getWaterMarkInfo() {
      queryWaterMark().then(res => {
        if (res.data.success && res.data.data) {
          this.WaterMarkInfo = res.data.data;
        }
      }).catch(err => {
        this.$alert("获取水印数据信息失败，请刷新页面重试")
      })
    },
    // 分页查询
    getData(params) {
      let requestParams = JSON.parse(JSON.stringify(params));
      for (let propName in requestParams) {
        if (requestParams.hasOwnProperty(propName) && Number(requestParams[propName]) === -1) {
          delete requestParams[propName];
        }
      }
      if (requestParams.endTime) {
        requestParams.endTime = parseTime(getMonthLastDay(requestParams.endTime), "{y}-{m}-{d}");
      }
      chargeSubsidyPage(requestParams).then(res => {
        if (res.data.success && res.data.data) {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.totalCount;
        } else {
          this.tableData = [];
          this.totalCount = 0;
        }
      }).catch(error => {
        if (this.$route.path == this.currentPath) {
          this.$alert("获取规则分页数据失败，请稍后重试");
        }
      })
    },
    // 触发后端对列排序
    sortChange({ column, prop, order }) {
      if (column && prop) {
        this.queryForm.isDesc = order === "descending"
        if (prop === "createTime") {
          this.queryForm.sortColumnName = "create_time"
        } else if (prop === "beginTime") {
          this.queryForm.sortColumnName = "begin_time"
        }
      } else {
        delete this.queryForm.isDesc
        delete this.queryForm.sortColumnName
      }
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
    },
    // 处理页数跳转
    handleCurrentChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = val;
      this.queryForm.pageSize = this.pageSize;
      this.getData(this.queryForm);
    },
    handleSizeChange(val) {
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = val;
      this.getData(this.queryForm);
    },
    // 打开详情页
    openDetail(id, cityUuid, cityName) {
      chargeSubsidyDetail({ uuid: id, cityUuid: cityUuid }).then(res => {
        if (res.data.success && res.data.data) {
          this.detailData = res.data.data;
          this.detailData.cityName = cityName;
          this.detailVisible = true
        } else {
          this.$alert("获取规则详情数据失败，请稍后重试");
        }
      }).catch(error => {
        if (this.$route.path == this.currentPath) {
          this.$alert("获取规则详情数据失败，请稍后重试");
        }
      });
    },
    // 统一处理弹框关闭
    closeDialogHandle(type) {
      switch (type) {
        case "detail":
          this.detailVisible = false;
          break;
        case "edit":
          this.editVisible = false;
          this.editPerformanceVisible = false;
          this.editActivityVisible = false;
          this.editForm = {};
          break;
        case "log":
          this.logVisible = false;
          break;
      }
    },
    // 日志分页
    handleLogsPage(params) {
      this.getLogs(params.currentId, params.currentLog, params.currPage, params.pageSize, true);
    },
    // 根据点中的行的ID获取对应日志信息
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      let params = {
        resumeUuid: id,
        currPage: curPage,
        pageSize: pageSize,
        sortColumnName: "operate_time",
        isDesc: "true"
      }
      getLog(params).then(res => {
        if (res.data.success && res.data.data && res.data.data.list) {
          this.logTableData = res.data.data.list;
          this.logTotalCount = res.data.data.totalCount;
        } else {
          this.logTableData = [];
          this.logTotalCount = 0;
        }
        if (!hasOpenLogDialog) {
          this.currentId = id
          this.currentLog = name
          this.logVisible = true
        }
      }).catch(error => {
        this.logTableData = [];
        this.logTotalCount = 0;
        if (!hasOpenLogDialog) {
          this.currentId = id;
          this.logVisible = true
        }
      });
    },
    // 带参数查询
    paramSelect() {
      this.queryForm.carLevelCodes = "";
      if (this.carLevelCodesArray.length > 0) {
        this.carLevelCodesArray.forEach(each => this.queryForm.carLevelCodes += (each + ","));
        this.queryForm.carLevelCodes = this.queryForm.carLevelCodes.substr(0, this.queryForm.carLevelCodes.length - 1);
      }
      this.queryForm = deleteEmptyProps(this.queryForm, ["isDesc"]);
      this.currPage = 1;
      this.queryForm.currPage = 1;
      this.queryForm.pageSize = 10;
      this.getData(this.queryForm);
    },
    // 初始化数据（重置）
    initData() {
      this.carLevelCodesArray = [];
      this.timeArr = [];
      this.queryForm = {
        isDesc: "true",
        sortColumnName: "create_time"
      };
      this.getData({
        currPage: 1, pageSize: 10, isDesc: "true",
        sortColumnName: "create_time"
      });
    },
    statusFormatter(row) {
      switch (row.status) {
        case 1:
        case "1":
          return "未启用";
        case 2:
        case "2":
          return "启用";
        case 3:
        case "3":
          return "停用";
        default:
          return "未知";
      }
    },
    startTimeFormatter(row) {
      return row.startTime ? parseTime(row.startTime, "{y}-{m}") : "";
    },
    endTimeFormatter(row) {
      return row.endTime ? parseTime(row.endTime, "{y}-{m}") : "";
    },
    // 打开新增规则窗口
    openAdd() {
      this.isEdit = false;
      this.editForm = {};
      this.title = "新增能源账户补贴规则";
      this.editVisible = true;

    },

    // 打开编辑规则窗口
    edit(row) {
      this.isEdit = true;
      this.editForm = {
        uuid: row.uuid,
        carLevelCodes: row.carLevelCodes,
        cityUuid: row.cityUuid,
        cityName: row.cityName,
        ratio: row.ratio,
        price: row.price,
        startTime: row.startTime ? row.startTime : "",
        endTime: row.endTime ? row.endTime : ""
      };
      this.title = "编辑能源账户补贴规则";
      this.editVisible = true;
    },
    successHandle() {
      if (!this.isEdit) {
        this.queryForm.currPage = 1
        this.queryForm.pageSize = 10
      }
      this.getData(deleteEmptyProps(this.queryForm, ["isDesc"]));
      this.editActivityVisible = false;
      this.editVisible = false;
      this.editPerformanceVisible = false;
      this.$alert(this.isEdit ? "规则修改成功" : "规则新增成功");
    },
    // 切换规则状态
    changeStatus(row, index, status) {
      let operateName = status === 2 ? "启用" : "停用";
      this.$confirm("是否" + operateName + "该规则? ", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      }).then(() => {
        chargeSubsidySaveOrUpdate({
          uuid: row.uuid,
          status: status,
          carLevelCodes: row.carLevelCodes,
          cityUuid: row.cityUuid
        }).then(res => {
          if (res.data.success) {
            this.$set(this.tableData[index], "status", status);
            if (this.$route.path === this.currentPath) {
              this.$alert("规则" + operateName + "成功");
            }
          } else {
            if (this.$route.path === this.currentPath) {
              this.$alert(res.data.msg);
            }
          }
        }).catch(error => {
          if (this.$route.path === this.currentPath) {
            this.$alert("规则" + operateName + "失败");
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "操作已取消"
        });
      });
    },
    getCitiesWithAgent() {
      queryCitiesWithAgent({}).then(res => {
        if (res.data.success && res.data.data) {
          if (res.data.data.length === 0) {
            this.$alert("获取开通城市数据信息失败，请刷新页面重试");
          } else {
            this.cities = res.data.data.cities;
          }
        }
      }).catch(err => {
        console.log("123")
        this.$alert("获取数据信息失败，请刷新页面重试")
      })
    },
    // 获取车型
    getCarTypePage() {
      getCarTypePage({ currPage: this.currentPage, pageSize: 100 }).then(res => {
        if (res.data.success && res.data.data) {
          this.currentPage += 1;
          const list = res.data.data.list;
          if (list.length > 0) {
            this.carTypes.push(...list);
            this.carTypes = this.carTypes.map(item => ({
              ...this.carTypes,
              ...{
                label: item.brandName + "-" + item.seriesName + "-" + item.carLevelCode + "-" + item.carLevelName + "-" + this.fulType[item.fuelType],
                value: item.carLevelCode
              }
            }))
          }
        } else {
          this.$alert("获取车型失败，请稍后重试")
        }
      }).catch(() => this.$alert("获取车型失败，请稍后重试"))
    },
    loadingStatus() {
      this.exportLoading = false
    },
    // 导出
    exportExcel() {
      this.exportLoading = true
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (requestParams.hasOwnProperty(propName) && Number(requestParams[propName]) === -1) {
          delete requestParams[propName];
        }
      }
      // this.queryForm.excelTitle = '简历数据';
      chargeSubsidyExpro(deleteEmptyProps(requestParams)).then(res => {
        // 这里res.data是返回的blob对象
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=utf-8" }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "能源账户补贴规则数据.xls"; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }).catch(error => {
        this.$alert("导出excel数据失败，请稍后重试");
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .selectBar {
    margin: 10px;
  }

  .main {
    margin-left: 15px;
  }
</style>
