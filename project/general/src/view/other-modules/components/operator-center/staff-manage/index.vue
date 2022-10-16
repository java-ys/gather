<!--
  人员管理
  backEnd: 车厘子-彭旭
-->
<template>
  <div>
    <div
      v-show="!isShowAudit"
      class="driver_info_wrap"
    >
      <Form
        :model="searchData"
        inline
        :label-width="75"
      >
        <FormItem label="司机姓名：">
          <Input
            v-model="searchData.name"
            placeholder="请输入司机姓名"
            style="width: 200px;"
          ></Input>
        </FormItem>
        <FormItem label="手机号：">
          <Input
            v-model="searchData.mobile"
            placeholder="请输入手机号"
            style="width: 200px;"
          ></Input>
        </FormItem>
        <FormItem label="车型：">
          <Input
            v-model="searchData.modelName"
            placeholder="请输入车型"
            style="width: 200px;"
          ></Input>
        </FormItem>
        <FormItem
          v-show="isShowMore"
          label="城市："
        >
          <Select
            v-model="searchData.cityUuid"
            filterable
            style="width:200px"
          >
            <!-- eslint-disable -->
            <Option
              v-for="(item, index) in cityList"
              :key="index"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem
          v-show="isShowMore"
          label="运营商："
        >
          <Cascader
            v-model="operatorArr"
            :data="operatorTree"
            trigger="hover"
            placeholder="请选择运营商"
            style="width:190px;"
          >
          </Cascader>
        </FormItem>
        <FormItem
          v-show="isShowMore"
          label="车牌号："
        >
          <Input
            v-model="searchData.plateNum"
            placeholder="请输入车牌号"
            style="width: 200px;"
          ></Input>
        </FormItem>
        <FormItem
          v-show="isShowMore"
          label="入职时间："
        >
          <DatePicker
            v-model="joinTime"
            split-panels
            type="daterange"
            format="yyyy-MM-dd"
            style="width:200px"
            @on-change="selectDate"
          >
          </DatePicker>
        </FormItem>
        <FormItem
          v-show="isShowMore"
          label="状态："
        >
          <Select
            v-model="searchData.status"
            filterable
            style="width:150px"
          >
            <!-- eslint-disable -->
            <Option :value="1">正常</Option>
            <Option :value="2">短期封号</Option>
            <Option :value="3">长期封号</Option>
            <Option :value="6">离职</Option>
            <Option :value="7">黑名单</Option>
            <Option :value="8">强制下线</Option>
            <Option :value="9">冻结</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <!-- 拉黑次数 -->
        <FormItem
          v-show="isShowMore"
          label="拉黑次数："
          :label-width="100"
        >
          <input
            ref="unFriendNumMin_ref"
            v-model="searchData.unFriendNumMin"
            placeholder="请输入最小值"
            style="width: 110px;"
            type="text"
            :min="0"
            class="unFriendNumMin"
            :max="99998"
            @input="(e) => changeInput(e, 'unFriendNumMin')"
            @keydown.delete="e=>{onKeydown(e.target.value, 'unFriendNumMin')}"
          />
          <span> - </span>
          <input
            ref="unFriendNumMax_ref"
            v-model="searchData.unFriendNumMax"
            placeholder="请输入最大值"
            style="width: 110px;"
            type="text"
            :min="1"
            class="unFriendNumMax"
            :max="99999"
            @keydown.delete="e=>{onKeydown(e.target.value, 'unFriendNumMax')}"
            @input="(e) => changeInput(e, 'unFriendNumMax')"
          ></input>
        </FormItem>
        <!--  -->
        <FormItem
          v-show="isShowMore"
          label="星级评价分数："
          :label-width="100"
        >
          <input
            ref="scoreMin_ref"
            v-model="searchData.scoreMin"
            placeholder="请输入最小值"
            style="width: 110px;"
            class="scoreMin"
            type="text"
            :min="0.1"
            :max="4.9"
            @keydown.delete="e=>{onKeydown(e.target.value, 'scoreMin')}"
            @input="(e) => changeInput(e, 'scoreMin')"
          ></input>
          <span> - </span>
          <input
            ref="scoreMax_ref"
            v-model="searchData.scoreMax"
            placeholder="请输入最大值"
            style="width: 110px;"
            class="scoreMax"
            type="text"
            :min="0.2"
            :max="5.0"
            @keydown.delete="e=>{onKeydown(e.target.value, 'scoreMax')}"
            @input="(e) => changeInput(e, 'scoreMax')"
          ></input>
        </FormItem>
        <FormItem :label-width="0">
          <div class="query-btn">
            <a
              class="show-more"
              @click="isShowMore = !isShowMore"
            >
              <Icon
                v-show="isShowMore"
                type="md-remove"
              />
              <Icon
                v-show="!isShowMore"
                type="md-add"
              />
              <span v-show="!isShowMore">查看更多</span>
              <span v-show="isShowMore">收起更多</span>
            </a>
            <Button @click="clearQueryData">
              清空
            </Button>
            <Button
              type="primary"
              @click="queryData"
            >
              查询
            </Button>
          </div>
        </FormItem>
      </Form>
      <div class="operate-wrap">
        <ExportFile
          :exportUrl="exportDriverUrl"
          exportFileName="司机人员列表.xlsx"
          :queryData="exportParams"
          baseUrlKey="_baseUrl"
          btnText="批量导出"
          ajaxMethod="post"
          style="font-size:13px;margin-left: 16px;"
          :isMastQuery="false"
          :exportCheckBefore="exportCheckBefore"
        >
        </ExportFile>
      </div>

      <VTable
        class="staff-table-container"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @sortHandle="sortChange"
      >
      </VTable>
    </div>
    <!-- 修改 或者 详情
        <Detail v-show='isShowAudit' :isAudit='isAudit' :auditId='auditId'></Detail>
        <div v-show='isShowAudit' class="back-container">
          <Button type="default" :size='"large"' @click="backList">返回列表</Button>
        </div>-->
    <!-- 封号 -->
    <Modal
      v-model="isShowBlockade"
      :title="blockadeTitle"
      :mask-closable="false"
      width="800"
    >
      <Form
        ref="blockForm"
        :model="commonFormData"
        :label-width="80"
        :rules="blockadeRule"
      >
        <FormItem label="司机ID">
          <Input
            v-model="commonFormData.driverNo"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="司机姓名">
          <Input
            v-model="commonFormData.name"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="司机电话">
          <Input
            v-model="commonFormData.mobile"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="身份证号">
          <Input
            v-model="commonFormData.idCard"
            readonly
          ></Input>
        </FormItem>
        <FormItem
          label="封号类型"
          prop="type"
        >
          <Select
            v-model="commonFormData.type"
            style="width:200px"
            @on-change="changeStatus"
          >
            <!-- eslint-disable -->
            <Option :value="3">长期封号</Option>
            <Option :value="2">短期封号</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem
          v-if="isShowUnblockTime"
          label="解封时间"
          prop="blockEnd"
        >
          <DatePicker
            v-model="commonFormData.blockEnd"
            type="date"
            placeholder="请选择日期"
            style="width: 200px"
            @on-change="slectBlockDate"
          ></DatePicker>
        </FormItem>
        <FormItem
          label="备注"
          prop="operateRemark"
        >
          <Input
            v-model="commonFormData.operateRemark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click.native="isShowBlockade = false">
          关闭
        </Button>
        <Button
          type="primary"
          @click.native="blockadeConfirm"
        >
          确定
        </Button>
      </div>
    </Modal>
    <!-- 加入黑名单 离职 移出黑名单 解封、冻结、解冻-->
    <Modal
      v-model="isShowOtherModal"
      :title="otherOperateModalTitle"
      width="800"
      :mask-closable="false"
    >
      <Form
        ref="operateForm"
        :model="commonFormData"
        :label-width="80"
        :rules="otherOperateRule"
      >
        <FormItem label="司机ID">
          <Input
            v-model="commonFormData.driverNo"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="司机姓名">
          <Input
            v-model="commonFormData.name"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="司机电话">
          <Input
            v-model="commonFormData.mobile"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="身份证号">
          <Input
            v-model="commonFormData.idCard"
            readonly
          ></Input>
        </FormItem>
        <FormItem v-show="isShowAlert">
          <Alert type="warning">
            离职后司机将解除运营商、司管和车辆关系, 请确定司机是否离职
          </Alert>
        </FormItem>
        <FormItem
          label="备注"
          prop="operateRemark"
        >
          <Input
            v-model="commonFormData.operateRemark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click.native="isShowOtherModal = false">
          关闭
        </Button>
        <Button
          type="primary"
          @click.native="otherOperateConfirm"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
// import CustomColumns from "_a/custom-columns/custom-columns.vue"
import {
  addToBlacklist,
  blocking,
  freezeAndUnfreeze,
  leave,
  querySimpleInfo,
  removeFromBlacklist,
  staffList,
  unblocking
} from "_o/api/driver.js"
import { setTableTitle } from "_g/api/common.js"
import ExportFile from "_a/export-file/exportFile.vue"
import { driverList as getDriverList, pageData } from "./fields.js"
// import Detail from "./detail.vue"
// import VUpload from "_a/v-upload/v-upload"
// import ImportFile from "_a/import-file/index.vue"

const EXPORT_EXCEPT_PARAMS = ["currPage", "pageSize", "unFriendNumOrder", "scoreOrder"]

export default {
  components: {
    // VUpload,
    // CustomColumns,
    // Detail,
    // ImportFile,
    ExportFile
  },
  data() {
    return {
      unFriendCls: {
        class: "unFriend_default_cls"
      },
      scoreCls: {
        class: ""
      },
      driverList: [],
      operatorArr: [],
      exportDriverUrl: "/admin/driver/exportDrivers",
      exportUrl: "/admin/driver/exportDriverInfo",
      importUrl: "/admin/driver/importDriverInfo",
      resourceId: this.$route.name,
      ...pageData,
      exportParams: {},
      unFriendNumOrder: "",
      scoreOrder: ""
    }
  },
  computed: mapState({
    cityList: state => state.common.accessCityList,
    operatorTree: state => state.common.accessAgentList,
    exportCheckBefore() {
      return JSON.stringify(Object.keys(this.exportParams)) !== JSON.stringify(EXPORT_EXCEPT_PARAMS)
    }
  }),
  created() {
    this.driverList = getDriverList(this)
    this.getTableColumns()
    this.getList()
    this.getAccessAgentList()
  },
  activated() {
    for (let key in this.searchData) {
      this.searchData[key] = "";
    }
    this.getList();
  },
  methods: {
    ...mapActions([
      "getAccessAgentList",
    ]),
    onKeydown(value, type) {
      this.hasKeyDelete = true
    },
    changeInput(e, type) {
      if (this.hasKeyDelete) {
        this.hasKeyDelete = false
        return
      }
      let value = e.target.value;
      let val = Number(value)
      if (Number.isNaN(val)) {
        this.searchData[type] = ""
        return
      }
      let finalVal = ""
      if (type === "unFriendNumMin") {
        if (val < 0) {
          finalVal = 0
        } else if (val >= 99999) {
          finalVal = 99998
        } else {
          finalVal = val.toFixed(0)
        }
      }
      if (type === "unFriendNumMax") {
        if (val < 0) {
          finalVal = 0
        } else if (val >= 99999) {
          finalVal = 99999
        } else {
          finalVal = val.toFixed(0)
        }
      }
      val = Number(value).toFixed(1)
      if (type === "scoreMin") {
        if (val < 0.1) {
          finalVal = 0.1
        } else if (val > 5.0) {
          finalVal = 5.0
        } else {
          finalVal = val
        }
      }
      if (type === "scoreMax") {
        if (val < 0.2) {
          finalVal = 0.2
        } else if (val > 5.0) {
          finalVal = 5.0
        } else {
          finalVal = val
        }
      }
      this.searchData[type] = finalVal
    },
    sortChange(params) {
      console.log(params)
      const { key, order } = params
      if (key === "unFriendNum") {
        this.unFriendNumOrder = order === "default" ? "" : order
        this.unFriendCls.class = `unFriend_${order}_cls`
        this.scoreOrder = ""
        this.scoreCls.class = "score_default_cls"
      } else if (key === "score") {
        this.scoreOrder = order === "default" ? "" : order
        this.scoreCls.class = `score_${order}_cls`
        this.unFriendNumOrder = ""
        this.unFriendCls.class = "unFriend_default_cls"
      }
      this.getList()
    },
    clearQueryData() {
      this.current = 1
      this.pageSize = 10
      this.searchData = {}
      this.joinTime = ""
      this.queryAjaxPramas = {}
      this.operatorArr = []

      this.getList()
    },
    queryData() {
      if ((this.searchData.unFriendNumMin && !this.searchData.unFriendNumMax) || (!this.searchData.unFriendNumMin && this.searchData.unFriendNumMax)) {
        this.$Message.error("拉黑次数最小值和最大值必须同时存在！")
        return false
      }
      if ((this.searchData.scoreMin && !this.searchData.scoreMax) || (!this.searchData.scoreMin && this.searchData.scoreMax)) {
        this.$Message.error("星级评价分数最小值和最大值必须同时存在！")
        return false
      }
      if (this.searchData.scoreMin && this.searchData.scoreMax && Number(this.searchData.scoreMin) >= Number(this.searchData.scoreMax)) {
        this.$Message.error("星级评价分数最大值必须大于最小值！")
        return false
      }
      if (this.searchData.unFriendNumMin && this.searchData.unFriendNumMax && Number(this.searchData.unFriendNumMin) >= Number(this.searchData.unFriendNumMax)) {
        this.$Message.error("拉黑次数最大值必须大于最小值！")
        return false
      }
      this.queryAjaxPramas = {}
      this.searchData.agentUuid = this.operatorArr[2]
      this.current = 1
      Object.keys(this.searchData).map(key => {
        let item = this.searchData[key]
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item
        }
        return key;
      })

      this.getList()
    },
    getList(notLoading) {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        unFriendNumOrder: this.unFriendNumOrder.toUpperCase(),
        scoreOrder: this.scoreOrder.toUpperCase()
      }
      let obj = Object.assign(params, this.queryAjaxPramas)
      !notLoading && this.$store.commit("changeLoadingFlag", true)
      // 导出参数
      this.exportParams = {
        ...obj
      }
      staffList(obj).then(res => {
        this.$store.commit("changeLoadingFlag", false)
        this.$nextTick(() => {
          this.driverList = {}
          this.driverList = getDriverList(this)
          this.total = res.data.data.totalCount
          this.tableData = res.data.data.list
          this.getTableColumns()
        })
      })
    },
    changeTableTitle(data) {
      this.tableColumnsChecked = data
      this.getTableColumns()
    },
    getTableColumns() {
      let data = []
      let action = {
        title: "操作",
        key: "action",
        fixed: "right",
        minWidth: 270,
        render: (h, params) => {
          return h("div", [
            /* h('Button', {
                              props: {
                                type: 'warning',
                                size: 'small'
                              },
                              attrs: {
                                ghost: 'ghost'
                              },
                              style: {
                                marginRight: '5px',
                                编辑暂时砍掉隐藏起来（叶进大佬说的）
                                display: 'none'
                              },
                              on: {
                                click: () => {
                                  this.auditHandle(params.row.uuid);
                                }
                              }
                            }, '编辑'), */
            h("Button", {
              props: {
                type: "success",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-detail"
              }],
              style: {
                marginRight: "12px"
              },
              attrs: {
                ghost: "ghost"
              },
              on: {
                click: () => {
                  this.detailHandle(params.row.uuid)
                }
              }
            }, "详情"),
            h("Button", {
              props: {
                type: "warning",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-frozen"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                marginRight: "12px",
                display: params.row.status === 1 ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.switchFrozen(params.row.uuid, "冻结")
                }
              }
            }, "冻结"),
            h("Button", {
              props: {
                type: "info",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-unfrozen"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                marginRight: "12px",
                display: (params.row.status === 9) ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.switchFrozen(params.row.uuid, "解冻")
                }
              }
            }, "解冻"),
            h("Button", {
              props: {
                type: "warning",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-blockade"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                marginRight: "12px",
                display: (params.row.status === 1 || params.row.status === 9) ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.blockadeHandle(params.row.uuid)
                }
              }
            }, "封号"),
            h("Button", {
              props: {
                type: "info",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-unblockade"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                marginRight: "12px",
                display: (params.row.status === 2 || params.row.status === 3) ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.unblock(params.row.uuid)
                }
              }
            }, "解封"),
            h("Button", {
              props: {
                type: "primary",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-addToBlack"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                display: params.row.status === 7 ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.removeBlack(params.row.uuid)
                }
              }
            }, "解除黑名单"),
            h("Button", {
              props: {
                type: "error",
                size: "small"
              },
              directives: [{
                name: "hasAuth",
                value: "staff-manage-addToBlack"
              }],
              attrs: {
                ghost: "ghost"
              },
              style: {
                display: params.row.status === 6 ? "inline-block" : "none"
              },
              on: {
                click: () => {
                  this.blacklistHandle(params.row.uuid)
                }
              }
            }, "加入黑名单")
            /* h('Button', {
                              props: {
                                type: 'info',
                                size: 'small'
                              },
                              attrs: {
                                ghost: 'ghost'
                              },
                              style: {
                                marginRight: '5px',
                                display: params.row.status !== 6 ? 'inline-block' : 'none'
                              },
                              on: {
                                click: () => {
                                  this.leaveJobHandle(params.row.uuid);
                                }
                              }
                            }, '离职'), */
          ])
        }
      }
      this.tableColumnsChecked.forEach(col => data.push(this.driverList[col]))
      data.push(action)
      this.tableColumns = data
    },
    changePageSize(val) {
      this.pageSize = val
      this.getList()
    },
    selectDate(data) {
      if (data) {
        this.searchData.startTime = data[0]
        this.searchData.endTime = data[1]
      }
    },
    changePage(val) {
      this.current = val
      this.getList()
    },
    auditHandle(id) { // 修改
      this.isAudit = true
      this.isShowAudit = true
      this.auditId = id
    },
    detailHandle(id) { // 详情
      this.auditId = id
      this.isAudit = false
      this.$router.push({ path: "staff-detail/" + id })
    },
    queryDriverInfo(id) { // 查看司机基本信息
      let params = {
        driverUuid: id
      }
      querySimpleInfo(params).then(res => {
        if (res.data.success) {
          this.commonFormData = res.data.data
        }
      })
    },
    // 冻结、解冻
    switchFrozen(id, title) {
      this.queryDriverInfo(id)
      this.isShowOtherModal = true
      this.otherOperateModalTitle = title
      this.commonFormData = {}
    },
    blockadeHandle(id) { // 封号
      this.isShowBlockade = true
      this.commonFormData = {}
      this.queryDriverInfo(id)
    },
    blacklistHandle(id) { // 加入黑名单
      this.isShowOtherModal = true
      this.isShowAlert = false
      this.commonFormData = {}
      this.otherOperateModalTitle = "加入黑名单"
      this.queryDriverInfo(id)
    },
    leaveJobHandle(id) {
      this.isShowOtherModal = true
      this.isShowAlert = true
      this.commonFormData = {}
      this.otherOperateModalTitle = "离职"
      this.queryDriverInfo(id)
    },
    removeBlack(id) { // 移出黑名单
      this.isShowOtherModal = true
      this.isShowAlert = false
      this.commonFormData = {}
      this.otherOperateModalTitle = "移出黑名单"
      this.queryDriverInfo(id)
    },
    unblock(id) { // 解封
      this.isShowOtherModal = true
      this.isShowAlert = false
      this.commonFormData = {}
      this.otherOperateModalTitle = "解封"
      this.queryDriverInfo(id)
    },
    changeStatus(status) {
      if (status == 3) {
        delete this.commonFormData.blockEnd
        this.isShowUnblockTime = false
      } else {
        this.isShowUnblockTime = true
      }
      this.commonFormData.type = status
    },
    slectBlockDate(date) {
      if (date) {
        this.commonFormData.blockEnd = date
      }
    },
    blockadeConfirm() { // 封号操作
      this.$refs.blockForm.validate(valid => {
        if (!valid) return false
        let params = {
          driverUuid: this.commonFormData.uuid,
          blockEnd: this.commonFormData.blockEnd,
          type: this.commonFormData.type,
          operateRemark: this.commonFormData.operateRemark
        }
        blocking(params).then(res => {
          if (res.data.success) {
            this.$Message.success("封号成功!")
            this.isShowBlockade = false
            this.getList(true)
          } else {
            let errormsg = res.data.errorMsg || "服务器错误!"
            this.$Message.error(errormsg)
          }
        })
      })
    },
    otherOperateConfirm() {
      this.$refs.operateForm.validate(valid => {
        if (!valid) return false
        let params = {
          driverUuid: this.commonFormData.uuid,
        }
        switch (this.otherOperateModalTitle) {
          case "加入黑名单":
            params.operateRemark = this.commonFormData.operateRemark
            this.addToBlackHandle(params)
            break
          case "离职":
            params.dimissionRemark = this.commonFormData.operateRemark
            this.leaveHandle(params)
            break
          case "移出黑名单":
            params.operateRemark = this.commonFormData.operateRemark
            this.removeBlackHandle(params)
            break
          case "解封":
            params.operateRemark = this.commonFormData.operateRemark
            this.unblockHandle(params)
            break
          case "冻结":
            params.type = 1
            params.operateRemark = this.commonFormData.operateRemark
            params.option = "冻结"
            this.axiosSwitchFrozen(params)
            break
          case "解冻":
            params.type = 2
            params.operateRemark = this.commonFormData.operateRemark
            params.option = "解冻"
            this.axiosSwitchFrozen(params)
            break
        }
        this.isShowOtherModal = true
      })
    },
    // 冻结、解冻
    axiosSwitchFrozen(params) { // 解封
      freezeAndUnfreeze(params).then(res => {
        if (res.data.success) {
          this.$Message.success("操作成功!")
          this.getList(true)
          return this.isShowOtherModal = false
        } else {
          let errormsg = res.data.errorMsg || "服务器错误!"
          this.$Message.error(errormsg)
        }
      })
    },
    addToBlackHandle(params) { // 加入黑名单
      addToBlacklist(params).then(res => {
        if (res.data.success) {
          this.$Message.success("加入黑名单成功!")
          this.getList(true)
          return this.isShowOtherModal = false
        } else {
          let errormsg = res.data.errorMsg || "服务器错误!"
          this.$Message.error(errormsg)
        }
      })
    },
    leaveHandle(params) { // 离职操作
      leave(params).then(res => {
        if (res.data.success) {
          this.$Message.success("离职操作成功!")
          this.getList(true)
          return this.isShowOtherModal = false
        } else {
          let errormsg = res.data.errorMsg || "服务器错误!"
          this.$Message.error(errormsg)
        }
      })
    },
    removeBlackHandle(params) { // 移出黑名单
      removeFromBlacklist(params).then(res => {
        if (res.data.success) {
          this.$Message.success("移出黑名单成功!")
          this.getList(true)
          return this.isShowOtherModal = false
        } else {
          let errormsg = res.data.errorMsg || "服务器错误!"
          this.$Message.error(errormsg)
        }
      })
    },
    unblockHandle(params) { // 解封
      unblocking(params).then(res => {
        if (res.data.success) {
          this.$Message.success("解封成功!")
          this.getList(true)
          return this.isShowOtherModal = false
        } else {
          let errormsg = res.data.errorMsg || "服务器错误!"
          this.$Message.error(errormsg)
        }
      })
    },
    storeTableHandle(data) { // 将选择的表头发送到云端
      let params = {
        resourceId: this.resourceId,
        tableColumns: data
      }
      setTableTitle(params).then(res => {
        if (res.data.success) {
          this.$Message.success("表头设置成功!")
          this.getTableColumns()
        } else {
          let errorMsg = res.data.errorMsg || "表头设置失败！"
          this.$Message.error(errorMsg)
        }
      })
    },
    backList() {
      this.isShowAudit = false
      this.isAudit = false
    },
    importSuccess() {
      this.getList()
    }
  }
}
</script>
<style lang='less'>
@import "./index.less";
</style>
