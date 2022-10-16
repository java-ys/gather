<template>
  <div class="app-container">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
        <el-breadcrumb-item>司机钱包账户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr class="tophr" />
    <SearchBox>
      <div slot="content">
        <el-form
          ref="search-list"
          class="resume-form-inline"
          :inline="true"
          :model="queryForm"
          size="mini"
          label-position="left"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="城市" size="mini" label-width="100px">
                <el-select
                  v-model="queryForm.cityCode"
                  placeholder="请选择"
                  filterable=""
                  style="width: 200px"
                  @change="cityChange"
                >
                  <el-option label="全部" value="-1"></el-option>
                  <el-option
                    v-for="(cityObj, index) in cities"
                    :key="index"
                    :label="cityObj.label"
                    :value="cityObj.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="运营商"
                label-width="100px"
              >
                <el-select
                  v-model="queryForm.agentUuid"
                  placeholder="请选择"
                  filterable
                  style="width: 200px"
                  size="mini"
                >
                  <el-option
                    v-for="(agentObj, index) in agentList"
                    :key="index"
                    :label="agentObj.label"
                    :value="agentObj.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="司机Id" size="mini" label-width="100px">
                <el-input
                  v-model="queryForm.driverId"
                  placeholder="请输入"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名" size="mini" label-width="100px">
                <el-input
                  v-model="queryForm.driverName"
                  placeholder="请输入"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="司机手机号" size="mini" label-width="100px">
                <el-input
                  v-model="queryForm.driverMobile"
                  placeholder="请输入"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="司机身份证号"
                size="mini"
                label-width="100px"
              >
                <el-input
                  v-model="queryForm.driverIdentityCard"
                  placeholder="请输入"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" label-width="100px">
                <el-select
                  v-model="queryForm.driverStatus"
                  placeholder="请选择"
                  style="width: 200px"
                >
                  <el-option
                    v-for="(it, ix) in driverTypeList"
                    :key="ix"
                    :label="it.label"
                    :value="it.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="司机类型" label-width="100px">
                <el-select v-model="queryForm.driverType" placeholder="请选择" style="width: 200px" size="mini">
                  <el-option v-for="(obj, index) in driverList" :key="index" :label="obj.label" :value="obj.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footerRight">
        <el-button
          v-if="isPermitted(permissions.search)"
          id="assign-manage-query"
          v-preventReClick="3000"
          type="primary"
          size="mini"
          @click="filterList"
        >搜索</el-button>
        <el-button
          v-if="isPermitted(permissions.search)"
          v-preventReClick="3000"
          type="info"
          size="mini"
          @click="resetList"
        >重置</el-button>
      </div>
    </SearchBox>
    <hr class="hr" />
    <div class="main buttons">
      <export-button
        :loading="exportLoading"
        queryExport="wallet-manage-export"
        :queryForm="queryForm"
        @fatherExport="batchExport"
        @loadingStatus="loadingStatus"
      />
    </div>
    <div class="table-con">
      <el-table
        v-loading="listLoading"
        :row-style="{ backgroundColor: 'transparent' }"
        :data="tableData"
        size="small"
        height="515"
        element-loading-text="正在加载"
        :header-cell-style="{ background: '#F5F4F2' }"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          v-for="(it, ix) in tHead"
          :key="ix"
          :type="it.type"
          :prop="it.prop"
          :label="it.label"
          :formatter="it.formatter"
          :min-width="it.minWidth"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="操作"
          min-width="250"
          fixed="right"
          class-name="td_bgf"
        >
          <template slot-scope="scope">
            <template v-for="btn in colBtns">
              <el-button
                v-if="!btn.isVisible || btn.isVisible(scope.row)"
                :key="btn.text"
                v-preventReClick="3000"
                size="mini"
                type="text"
                @click="btn.clickHandler(scope.row)"
              >{{btn.text}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <NoTotalPagination
        :currPage="currPage"
        :pageSize="pageSize"
        :data-length="tableData.length"
        @currentChange="handleCurrentChange"
        @pageSizeChange="handleSizeChange"
      />
      <!--      <e-pagination-->
      <!--        :currPage="currPage"-->
      <!--        :pageSize="pageSize"-->
      <!--        :total="totalCount"-->
      <!--        @currentChange="handleCurrentChange"-->
      <!--        @pagesizeChange="handleSizeChange"-->
      <!--      />-->
    </div>
    <!-- 冻结/解冻 -->
    <frozen :visible="operateVisible" :type="type" @close-dialog="closeLog('operateVisible')" />
    <!-- 提现 -->
    <edit :visible="editVisible" @close-dialog="closeLog('editVisible')" />
    <!-- 入账记录 -->
    <entry-record :visible="entryRecordVisible" @close-dialog="closeLog('entryRecordVisible')" />
    <!-- 提现记录 -->
    <withdrawal-record :visible="withdrawalVisible" @close-dialog="closeLog('withdrawalVisible')" />
    <!-- 日志 -->
    <logs :visible="logVisible" @close-dialog="closeLog('logVisible')" />
    <AccountManageConfirm ref="accountManageConfirm" />
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import SearchBox from "_o/components/operator-center/salary-modules/searchForm/Form/index";
// import EPagination from "_o/components/operator-center/salary-modules/e-pagination/index.vue";
import exportButton from "_o/components/operator-center/salary-modules/common/export.vue";
import {
  logs,
  frozen,
  edit,
  entryRecord,
  withdrawalRecord,
} from "./component";
import {
  listService,
  agentListService,
  exportService,
  updateAccountStatus,
} from "./api";
import {
  tHead,
  driverTypeList,
  withdrawalMode,
  PERMISSION__FREEZE_ACCOUNT,
  PERMISSION__UNFREEZE_ACCOUNT,
  isFreezeAccountVisible,
  isUnfreezeAccountVisible,
} from "./filed";
import { excelDownload } from "@/libs/util";
import mixin from "./mixin";
import { queryCitiesWithAgent } from "_o/api/salary/common";
import { hasPermission } from "_o/common/common";
import {
  Component as AccountManageConfirm,
  CONFIRM_TYPE__FREEZE,
  CONFIRM_TYPE__UNFREEZE,
} from "./component/AccountManageConfirm";
import NoTotalPagination from "_o/components/operator-center/salary-modules/noTotalPagination";
import { getAllDriverTypeList } from "_o/api/salary/businessCommon";

export default {
  name: "walletManage",
  components: {
    NoTotalPagination,
    SearchBox,
    // EPagination,
    logs,
    frozen,
    edit,
    entryRecord,
    withdrawalRecord,
    exportButton,
    AccountManageConfirm,
  },
  mixins: [mixin],
  setup: () => ({
    isPermitted: permissionId => hasPermission(permissionId),
    permissions: {
      freeze: "wallet-manage-frozen",
      unfreeze: "wallet-manage-thaw",
      withdraw: "wallet-manage-withdrawal",
      entryRecord: "wallet-manage-entryRecord",
      withdrawalRecord: "wallet-manage-withdrawalRecord",
      log: "wallet-manage-logs",
      search: "wallet-manage-query",
      freezeAccount: PERMISSION__FREEZE_ACCOUNT,
      unfreezeAccount: PERMISSION__UNFREEZE_ACCOUNT,
    },
  }),
  provide() {
    return {
      getRow: () => this.currentRow,
      getCities: () => this.cities,
    };
  },
  data() {
    tHead.forEach(head => {
      if (head.formatterName) {
        head.formatter = this[head.formatterName];
      }
    });
    return {
      tHead,
      driverTypeList,
      logVisible: false,
      listLoading: false,
      exportLoading: false,
      queryForm: {
        driverStatus: "1",
      },
      cities: [], // 城市列表
      agentList: [], // 运营商列表
      tableData: [], // table 列表
      type: 1, // 1:冻结 2:解冻
      operateVisible: false, // 冻结/解冻开关
      editVisible: false, // 提现
      entryRecordVisible: false, // 入账记录
      withdrawalVisible: false, // 提现记录
      driverList: []
    };
  },
  computed: {
    colBtns() {
      const list = [
        {
          text: "冻结",
          permission: this.permissions.freeze,
          clickHandler: row => this.frozenHandle(1, row),
        },
        {
          text: "解冻",
          permission: this.permissions.unfreeze,
          clickHandler: row => this.frozenHandle(2, row),
        },
        {
          text: "提现",
          permission: this.permissions.withdraw,
          clickHandler: row => this.withdrawalHandle(row),
        },
        {
          text: "入账记录",
          permission: this.permissions.entryRecord,
          clickHandler: row => this.entryRecordHandle(row),
        },
        {
          text: "支出记录",
          permission: this.permissions.withdrawalRecord,
          clickHandler: row => this.withdrawalRecordHandle(row),
        },
        {
          text: "日志",
          permission: this.permissions.log,
          clickHandler: row => this.getLogs(row),
        },
        {
          text: "冻结账户",
          permission: this.permissions.freezeAccount,
          clickHandler: row => this.callFreezeAccountConfirm(row),
          isVisible: row => isFreezeAccountVisible(row),
        },
        {
          text: "解冻账户",
          permission: this.permissions.unfreezeAccount,
          clickHandler: row => this.callUnfreezeAccountConfirm(row),
          isVisible: row => isUnfreezeAccountVisible(row),
        },
      ];
      return list.filter(({ permission }) => (permission ? hasPermission(permission) : true));
    },
  },
  created() {
    this.getCityList();
    this.getList();
    // eslint-disable-next-line handle-callback-err
    getAllDriverTypeList().then(({ err, data }) => {
      if (data && data.length) {
        this.driverList = data.map(driver => ({ label: driver.message, value: driver.code }))
      }
    })
  },
  methods: {
    batchExport() {
      const requestParams = JSON.parse(JSON.stringify(this.queryForm));
      Object.keys(requestParams).forEach(propName => {
        if (
          !requestParams[propName]
          || propName === "currPage"
          || propName === "pageSize"
          || propName === "userUuid"
          || (requestParams[propName] instanceof Array
            && requestParams[propName].length >= 0)
        ) {
          delete requestParams[propName];
        }
      });
      if (Object.keys(requestParams).length === 0 || !requestParams["cityCode"]) {
        this.$alert("请先选择筛选条件");
      } else {
        Object.keys(requestParams).forEach(propName => {
          if (Number(requestParams[propName]) === -1 || requestParams[propName] === "") {
            delete requestParams[propName];
          }
        });
        this.exportLoading = true;
        exportService(requestParams).then(res => {
          excelDownload(res.data, "司机钱包数据信息");
        });
      }
    },
    loadingStatus() {
      this.exportLoading = false;
    },
    frozenHandle(v, row) {
      this.type = v;
      this.setCurrentRow(row);
      this.operateVisible = true;
    },
    checkStatus(row) {
      const v = driverTypeList.find(item => item.value - row.driverStatus === 0);
      return v ? v.label : "";
    },
    checkMode(row) {
      const v = withdrawalMode.find(item => item.value - row.withdrawalMode === 0);
      return v ? v.label : "";
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
      this.currPage = 1;
      this.pageSize = 10;
      this.getList();
    },
    getList() {
      this.listLoading = false;
      const {
        driverName,
        cityCode,
        agentUuid,
        driverId,
        driverMobile,
        driverStatus,
        driverIdentityCard,
        driverType
      } = this.queryForm;
      const p = {
        currPage: this.currPage,
        pageSize: this.pageSize,
        cityCode: cityCode - -1 !== 0 ? cityCode : "",
        driverName,
        agentUuid,
        driverMobile,
        driverId,
        driverStatus,
        driverIdentityCard,
        driverType
      };
      this.call(
        listService,
        this.clearObjectFalsy(p),
        this.listSuccess,
        this.listError,
      );
    },
    listError({ msg }) {
      this.listLoading = false;
      this.$alert(msg || "获取钱包账户列表失败");
    },
    listSuccess(data) {
      this.listLoading = false;
      if (data) {
        const { list, totalCount } = data;
        this.tableData = list;
        this.totalCount = totalCount;
      }
    },
    getCityList() {
      this.call(queryCitiesWithAgent, {}, this.citySuccess, this.cityError);
    },
    cityError({ msg }) {
      this.$alert(msg || "获取城市列表失败");
    },
    citySuccess(data) {
      if (data && data.cities && data.cities.length) {
        this.cities = data.cities.map(it => ({
          ...it,
          label: it.orgName,
          value: it.orgCode,
        }));
      }
    },
    // 切换分页
    handleCurrentChange(nPage) {
      this.currPage = nPage;
      this.getList();
    },
    handleSizeChange(val) {
      this.currPage = 1;
      this.pageSize = val;
      this.getList();
    },
    setCurrentRow(row) {
      this.currentRow = row;
    },
    // 日志
    getLogs(row) {
      this.setCurrentRow(row);
      this.logVisible = true;
    },
    // 提现
    withdrawalHandle(row) {
      this.setCurrentRow(row);
      this.editVisible = true;
    },
    // 入账记录
    entryRecordHandle(row) {
      this.setCurrentRow(row);
      this.entryRecordVisible = true;
    },
    // 提现记录
    withdrawalRecordHandle(row) {
      this.setCurrentRow(row);
      this.withdrawalVisible = true;
    },
    /** 唤起冻结账户确认 */
    callFreezeAccountConfirm(row) {
      this.$refs.accountManageConfirm.open(
        CONFIRM_TYPE__FREEZE,
        reason => {
          if (!reason) {
            MessageBox.alert("请输入冻结原因");
            return false;
          }
          return this.updateDriverAccountStatus(true, row.driverUuid, reason);
        },
      );
    },
    /** 唤起解冻账户确认 */
    callUnfreezeAccountConfirm(row) {
      this.$refs.accountManageConfirm.open(
        CONFIRM_TYPE__UNFREEZE,
        reason => this.updateDriverAccountStatus(false, row.driverUuid, reason),
      );
    },
    closeLog(v) {
      this[v] = false;
      this.getList(this.queryForm);
    },
    cityChange(index) {
      const fi = this.cities.find(it => it.value === index);
      if (!fi) {
        this.agentList = [];
        return;
      }
      this.call(
        agentListService,
        { cityCode: fi.value },
        this.agentSuccess,
        this.agentError,
      );
    },
    agentError({ msg }) {
      this.$alert(msg || "获取城市运营商失败");
    },
    agentSuccess(data) {
      if (data) {
        this.agentList = data;
        this.agentList.forEach(it => {
          it.label = it.name;
          it.value = it.uuid;
        });
      }
    },
    updateDriverAccountStatus(isFreeze, driverUuid, remark) {
      return new Promise(resolve => {
        this.call(
          updateAccountStatus,
          {
            driverUuid,
            flag: isFreeze ? 0 : 1,
            remark,
          },
          () => {
            this.getList();
            resolve(true);
          },
          ({ msg }) => {
            this.$alert(msg || "操作失败");
            resolve(false);
          },
        );
      });
    },
  },
};
</script>

<style scoped lang="scss">
.breadcrumb {
  margin-top: 15px;
}
.tophr {
  height: 1px;
  background-color: #eef1f6;
  border: none;
  margin: 20px 0px;
}
.hr {
  height: 1px;
  background-color: #eef1f6;
  border: none;
  margin-bottom: 10px;
}
</style>
