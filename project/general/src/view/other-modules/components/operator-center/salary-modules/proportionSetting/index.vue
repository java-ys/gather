<template>
  <div class="app-container">


    <div class="selectBar">
      <el-form ref="search-list" :inline="true" :model="queryForm" class="demo-form-inline" size="mini" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="城市" label-width="100px">
              <el-select v-model="queryForm.cityCode" placeholder="城市" style="width: 200px" filterable>
                <el-option label="全部" value="-1"></el-option>
                <template v-for="(cityObj, index) in cities">
                  <el-option :key="index" :label="cityObj.label" :value="cityObj.value"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运营模式" label-width="100px">
              <el-select v-model="queryForm.operationType" placeholder="请选择运营模式" style="width: 200px">
                <el-option label="UP模式" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机工资类别" label-width="100px">
              <el-select v-model="queryForm.driverSalaryType" placeholder="请选择司机类别" style="width: 200px">
                <el-option v-for="(item,index) in driverTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" label-width="100px">
              <el-select v-model="queryForm.taxStatus" placeholder="状态" style="width: 200px">
                <el-option label="待生效" value="1"></el-option>
                <el-option label="生效中" value="2"></el-option>
                <el-option label="已停用" value="4"></el-option>
                <el-option label="已终止" value="3"></el-option>
                <el-option label="已过期" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item style="float: right">
            <el-button v-preventReClick="3000" type="primary" @click="filterList">搜索</el-button>
            <el-button v-preventReClick="3000" type="info" @click="resetList">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="main buttons">
      <el-button v-if="hasPermission('proportionSetting-add')" v-preventReClick="3000" type="primary" size="small" @click="openAdd">新增个税比例</el-button>
      <export-button :loading="exportLoading" queryExport="proportionSetting-export" :queryForm="queryForm" @fatherExport="batchExport" @loadingStatus="loadingStatus"></export-button>
    </div>
    <div style="margin-top: 60px">
      <el-table :row-style="{ backgroundColor: 'transparent' }" :data="tableData" style="width: 100%" size="mini" :header-cell-style="{ background: '#F5F4F2' }" fit highlight-current-row>
        <el-table-column prop="serialNumber" label="序号" min-width="110">
        </el-table-column>
        <el-table-column prop="time" label="生效时间" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.effectiveStartTime | parseDate}}~{{scope.row.effectiveEndTime | parseDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cityName" label="城市" min-width="110">
        </el-table-column>
        <el-table-column prop="operationType" label="运营模式" :formatter="operationTypeFormatter" min-width="110">
        </el-table-column>
        <el-table-column prop="driverSalaryTypeName" label="司机工资类别" :show-overflow-tooltip="true" min-width="110">
        </el-table-column>
        <el-table-column prop="taxProportion" label="个税比例(%)" min-width="110">
        </el-table-column>
        <el-table-column prop="taxStatus" label="状态" :formatter="statusFormatter" min-width="110">
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="110">
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="200" class-name="td_bgf">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('proportionSetting-edit') && scope.row.taxStatus == 1" size="small" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="hasPermission('proportionSetting-stop') && scope.row.taxStatus == 2" size="small" type="text" @click="stop(scope.row)">停用</el-button>
            <el-button v-if="hasPermission('proportionSetting-termination') && scope.row.taxStatus == 1" size="small" type="text" @click="stop(scope.row)">终止</el-button>
            <el-button v-if="hasPermission('proportionSetting-detail')" size="small" type="text" @click="detail(scope.row)">详情</el-button>
            <el-button v-if="hasPermission('proportionSetting-logs')" size="small" type="text" @click="getLogs(String(scope.row.id), scope.row.serialNumber)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <e-pagination :currPage="currPage" :pageSize="pageSize" :total="totalCount" @currentChange="changeCurrent" @pagesizeChange="handleSizeChange"></e-pagination>
    </div>

    <!-- 个税比例-新增 -->
    <add :title="title" :addVisible="addVisible" :isEdit="isEdit" :addForm="addForm" @closeDialogHandle="closeDialogHandle" />
    <!-- 详情 -->
    <detail :title="title" :detailVisible="detailVisible" :detailData="detailData" @closeDialogHandle="closeDialogHandle" />

    <logs :logVisible="logVisible" :logTableData="logTableData" :logTotalCount="logTotalCount" :currentLog="currentLog" :currentId="currentId" @closeDialogHandle="closeDialogHandle" @handleLogsPage="handleLogsPage" />
  </div>
</template>

<script>
import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index";
import exportButton from "_o/components/operator-center/salary-modules/common/export";
import logs from "_o/components/operator-center/salary-modules/common/operateLogs";
import { parseTime } from "@/libs/util";
import {
  queryWaterMark,
  queryCitiesWithOrgan,
  getDicItemByDicCode,
  operationLogInfo
} from "_o/api/salary/common";
import { excelDownload } from "_o/common/common";
import mixin from "./mixin";
import { deleteEmptyProps } from "_o/common/common";
import add from "./add";
import detail from "./detail";
import { listService, operateService, exportService } from "_o/api/salary/proportionSetting";
export default {
  name: "proportionSetting",
  components: {
    EPagination,
    add,
    detail,
    exportButton,
    logs
  },
  filters: {
    parseDate(val) {
      if (val) {
        return parseTime(val, "{y}-{m}-{d}");
      }
      return;
    }
  },
  mixins: [mixin],
  provide() {
    return {
      getRow: () => this.currentRow,
      getCities: () => this.cities,
      getDriverTypeList: () => this.driverTypeList
    };
  },
  data() {
    return {
      queryForm: {
        cityCode: "",
        operationType: 2,
        driverSalaryType: "J",
        taxStatus: ""
      },
      logTableData: [],
      logTotalCount: 0,
      currentLog: "",
      currentId: "",
      exportLoading: false,
      WaterMarkInfo: "", // 水印
      currPage: 1,
      pageSize: 10,
      cities: [], // 开通城市与待开通城市
      driverTypeList: [], // 司机工资类别
      tableData: [],
      totalCount: 0,
      detailData: {}, // 详情
      addForm: {
        cityCode: [], // 城市code
        operationType: "", // 运营模式
        driverSalaryType: [], // 司机工资类别
        taxProportion: "", // 个税比例
        validBeginTime: "", // 生效起始周
        validEndTime: "", // 生效结束周
        remark: "" // 备注
      },
      title: "",
      isEdit: false, // 是否编辑
      addVisible: false, // 新增/编辑弹窗
      detailVisible: false, // 详情
      logVisible: false // 日志
    };
  },
  created() {
    this.getList();
    this.getCityList();
    this.getDriverTypeList();
  },
  methods: {
    handleLogsPage(params) {
      this.getLogs(
        params.currentId,
        params.currentLog,
        params.currPage,
        params.pageSize,
        true
      );
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    // 重置
    resetList() {
      this.queryForm = {};
      this.currPage = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 搜索
    filterList() {
      this.currPage = 1
      this.pageSize = 10;
      this.getList();
    },
    stop(row) {
      let operateName =
        row.taxStatus == 2 ? "停用" : row.taxStatus == 1 ? "终止" : "";
      let operateType = row.taxStatus == 2 ? 2 : row.taxStatus == 1 ? 1 : "";
      this.$confirm("是否" + operateName + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      }).then(() => {
        this.call(
          operateService,
          { id: row.id, operateType: operateType },
          this.stopSuccess,
          this.stopError
        );
      });
    },
    stopSuccess() {
      this.getList();
    },
    stopError() {
      this.getList();
    },
    statusFormatter(row) {
      if (row.taxStatus == 1) {
        return "待生效";
      } else if (row.taxStatus == 2) {
        return "生效中";
      } else if (row.taxStatus == 3) {
        return "已终止";
      } else if (row.taxStatus == 4) {
        return "已停用";
      } else if (row.taxStatus == 5) {
        return "已过期";
      }
    },
    SalaryTypeFormatter(row) {
      let name = "暂无";
      this.driverTypeList.forEach((item, index) => {
        if (row.driverSalaryType == item.itemcode) {
          name = item.itemvalue;
        }
      });
      return name;
    },
    operationTypeFormatter(row) {
      if (row.operationType == 1) {
        return "自营";
      } else if (row.operationType == 2) {
        return "UP";
      }
    },
    batchExport() {
      let requestParams = JSON.parse(JSON.stringify(this.queryForm));
      for (let propName in requestParams) {
        if (
          !requestParams[propName] ||
          propName === "currPage" ||
          propName === "pageSize" ||
          propName === "userUuid" ||
          (requestParams[propName] instanceof Array &&
            requestParams[propName].length >= 0)
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
        exportService(requestParams).then(res => {
          excelDownload(res.data, "个税比例数据信息");
        });
      }
    },
    edit(params) {
      this.title = "编辑个税比例规则";
      let data = JSON.parse(JSON.stringify(params));
      data.cityCode = [params.cityCode];
      data.driverSalaryType = params.driverSalaryType.split(",");
      this.addForm = data;
      this.addVisible = true;
      this.isEdit = true;
    },
    detail(row) {
      this.title = "个税比例详情";
      this.detailData = row;
      this.detailVisible = true;
    },
    getLogs(id, name, curPage, pageSize, hasOpenLogDialog) {
      curPage = curPage ? curPage : 1;
      pageSize = pageSize ? pageSize : 10;
      let params = {
        businessId: id,
        businessType: 8,
        currPage: curPage,
        pageSize: pageSize
      };
      operationLogInfo(params)
        .then(res => {
          if (res.data.success && res.data.data && res.data.data.list) {
            this.logTableData = res.data.data.list;
            this.logTotalCount = res.data.data.totalCount;
          }
          if (!hasOpenLogDialog) {
            this.currentId = id;
            this.currentLog = name;
            this.logVisible = true;
          }
        })
        .catch(error => {
          this.logTableData = [];
          this.logTotalCount = 0;
          if (!hasOpenLogDialog) {
            this.currentId = id;
            this.logVisible = true;
          }
        });
    },
    getCityList() {
      this.call(queryCitiesWithOrgan, {}, this.citySuccess, this.cityError);
    },
    citySuccess(data) {
      if (data) {
        this.cities = data.cities;
        this.cities = this.cities.map(it => ({
          ...it,
          ...{
            label: it.orgName,
            value: it.orgCode
          }
        }));
      }
    },
    cityError({ msg }) {
      this.$alert(msg || "获取城市列表失败");
    },
    getDriverTypeList() {
      this.call(
        getDicItemByDicCode,
        {},
        this.driverTypeSuccess,
        this.driverTypeError
      );
    },
    driverTypeSuccess(data) {
      if (data) {
        this.driverTypeList = data;
        this.driverTypeList = this.driverTypeList.map(it => ({
          ...it,
          ...{
            label: it.itemvalue,
            value: it.itemcode
          }
        }));
      }
    },
    driverTypeError({ msg }) {
      this.$alert(msg || "获取司机工资类别失败");
    },
    // 操作项关闭
    closeDialogHandle(type) {
      switch (type) {
        case "add":
          this.addVisible = false;
          this.getList(this.queryForm);
          break;
        case "detail":
          this.detailVisible = false;
          break;
        case "log":
          this.logVisible = false;
          break;
        case "close":
          this.addVisible = false;
          break;
      }
    },
    changeCurrent(val) {
      this.currPage = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.currPage = 1
      this.pageSize = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      const {
        cityCode,
        operationType,
        driverSalaryType,
        taxStatus
      } = this.queryForm;
      const p = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        taxStatus: taxStatus,
        operationType: operationType,
        driverSalaryType: driverSalaryType - -1 !== 0 ? driverSalaryType : "",
        cityCode: cityCode - -1 !== 0 ? cityCode : ""
      };
      this.call(
        listService,
        this.clearObjectFalsy(p),
        this.listSuccess,
        this.listError
      );
    },
    listSuccess(data) {
      this.falsy("listLoading");
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.totalCount = totalCount;
      }
    },
    listError({ msg }) {
      this.falsy("listLoading");
      this.$alert(msg || "获取个税比例列表失败");
    },
    openAdd() {
      (this.addForm = {
        cityCode: [],
        operationType: 2,
        driverSalaryType: [],
        taxProportion: "",
        effectiveStartTime: "",
        effectiveEndTime: "",
        remark: ""
      }),
      (this.title = "新增个税比例规则");
      this.addVisible = true;
      this.isEdit = false;
    }
  }
};
</script>

<style>
</style>
