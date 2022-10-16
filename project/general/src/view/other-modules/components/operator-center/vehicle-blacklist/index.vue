<template>
  <div class="lease-project">
    <Row>
      <searchList :inputList="inputList" @on-search="handleSearch" @on-reset="reset">
      </searchList>
    </Row>
    <Row>
      <div class="button-wrap">
        <Button type="primary" @click="showCreate">
          新建
        </Button>
        <import-file
          ref="importList"
          style="margin-left:20px"
          btnText="批量导入"
          otherMsg="最多导入1000条数据"
          successMsg="导入成功！"
          :baseUrlName="baseUrlName"
          :importFileUrl="uploadUrl"
          :toDownTemplateUrl="templateUrl"
          :data="{}"
          :isGet="true"
          :upname="upname"
          @on-success="getUpFile"
        >
        </import-file>
        <!-- <Button type="primary" @click="showBatchImport">批量导入</Button> -->
        <Button type="primary" @click="doBatchDelete">批量删除</Button>
      </div>
    </Row>
    <VTable
      class="staff-table-container"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="selectingRow"
    >
    </VTable>
    <Modal v-model="isShowErrorModal" :title="'校验结果'" width="600">
      <Alert type="error">存在错误数据，请修改后重新导入</Alert>
      <VTable
        :total="errorTotal"
        :current="errorCurrent"
        :pageSize="errorPageSize"
        :isLoading="true"
        :parColumns="tableColumns"
        :parTableData="errorList"
        :height="260"
        style="margin-top:12px"
        @changePage="changeErrorPage"
        @changePageSize="changeErrorPageSize"
      ></VTable>
      <div slot="footer">
        <Button type="primary" @click="reUpload">
          <span>重新导入</span>
        </Button>
        <Button @click="closeErrorModal">关闭</Button>
      </div>
    </Modal>
    <addModal ref="modal" :cityList="allCityList" @on-add-success="reset"></addModal>
  </div>
</template>

<script>
import { inputList, parColumns } from "./config";
import VTable from "_a/v-table/v-table.vue";
import importFile from "_a/import-file/index.vue";
import { queryBlacklist, deleteByPlateNum, queryBlacklistCheckResult, batchAddBlackList } from "_o/api/lease"
import { getProvinceCityAllList } from "_g/api/common.js";
import addModal from "./components/add.vue"
export default {
  name: "withhold-declare-manage",
  components: {
    VTable,
    addModal,
    importFile
  },
  data() {
    return {
      tableData: [],
      current: 1,
      pageSize: 20,
      isLoading: true,
      total: 0,
      parColumns: parColumns(this),
      inputList,
      type: 0, // 0 新增 1编辑
      detailData: {},
      authCoList: [],
      allCityList: [],
      selectRow: [],
      templateUrl: "/download/addBlacklist.xlsx",
      uploadUrl: "/api/assets/v1/vehicleBlacklist/checkInfo",
      baseUrlName: "_base4Asset",
      upname: "multipartFile",
      timer: null,
      errorList: [],
      errorTotal: 0,
      errorCurrent: 1,
      errorPageSize: 10,
      isShowErrorModal: false,
      tableColumns: [
        {
          title: "行数",
          key: "errorLineCount",
          ellipsis: true,
          tooltip: true,
          minWidth: 140
        },
        {
          title: "错误描述",
          key: "message",
          ellipsis: true,
          tooltip: true,
          minWidth: 400
        }
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getCityList();
      this.getList()
    },
    // 获取租赁城市
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          this.setAllCityList(res.data.data);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    setAllCityList(data) {
      if (data.length) {
        data.forEach(e => {
          if (e.nodes.length) {
            e.nodes.forEach(ele => {
              this.allCityList.push({
                cityName: ele.city,
                cityUuid: ele.cityID
              });
            });
          }
        });
        this.inputList.forEach((item, index) => {
          if (item.bind_key === "cityUuid") {
            item.dropList = this.allCityList.map(it => {
              return {
                value: it.cityUuid,
                label: it.cityName
              }
            });
          }
        })
      }
    },
    getList(val) {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      params = Object.assign(params, val)
      queryBlacklist(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list || []
          this.total = res.data.data.totalCount
        }
        this.isLoading = false
      })
    },
    handleSearch(val) {
      this.getList(val)
    },
    getDetail(row) {
      this.detailId = row.id
      this.detailData = row
      this.$refs.detailModal.changeShowModal();
    },
    reset() {
      this.selectRow = []
      this.fileCacheKey = ""
      this.errorList = []
      this.errorTotal = 0
      this.errorCurrent = 1
      this.errorPageSize = 10
      this.getList()
    },
    changePage(val) { // 列表换页
      this.current = val;
      this.getList()
    },
    changePageSize(val) { // 设置列表行数
      this.pageSize = val;
      this.getList()
    },
    showCreate() {
      this.$refs.modal.changeShowModal();
    },
    async doBatchDelete() {
      this.$Modal.confirm({
        title: "确定移除车辆黑名单吗",
        onOk: async () => {
          let plateNums = []
          this.selectRow.forEach(item => {
            plateNums.push(item.plateNum)
          })
          await this.deleteByPlateNum({ plateNums })
        }
      });
    },
    async deleteByPlateNum(params) {
      const {
        data: {
          success,
          msg
        }
      } = await deleteByPlateNum(params)
      if (success) {
        this.$Message.success("删除成功！")
        this.reset()
      } else {
        this.$Message.error(msg || "删除失败!");
      }
    },
    deleteUnit(row) {
      const plateNums = [row.plateNum]
      this.$Modal.confirm({
        title: "确定移除车辆黑名单吗",
        onOk: async () => {
          await this.deleteByPlateNum({ plateNums })
        }
      });
    },
    selectingRow(items) {
      this.selectRow = items;
    },
    getUpFile({ data, success }) {
      if (success) {
        this.fileCacheKey = data
        this.handleValidateFile()
      }
    },
    handleValidateFile() {
      // 查询接口
      this.timer = setInterval(() => {
        this.current = 1;
        this.queryValiResult();
      }, 3000);
      this.$Modal.confirm({
        width: 300,
        content: "数据校验中，请稍等",
        okText: "终止",
        cancelText: "关闭",
        onOk: () => {
          clearInterval(this.timer);
          this.timer = null;
          this.fileCacheKey = ""
        }
      });
    },
    queryValiResult() {
      queryBlacklistCheckResult({
        "key": this.fileCacheKey,
        "pageSize": this.errorPageSize,
        "currPage": this.errorCurrent,
      }).then(res => {
        if (res.data && res.data.code === 200) {
          this.$Modal.remove()
          clearInterval(this.timer);
          this.timer = null;
          const { data } = res.data
          this.errorList = data ? data.list || [] : []
          if (this.errorList.length) {
            this.isShowErrorModal = true
          } else {
            this.handleBatchAdd()
          }
        }
      }).catch(err => {
        this.$Modal.remove()
        clearInterval(this.timer);
        this.timer = null;
        console.log(err)
      })
    },
    handleBatchAdd() {
      batchAddBlackList({
        key: this.fileCacheKey
      }).then(res => {
        if (res.data.success) {
          this.$Message.success("批量添加成功！")
          this.$refs.importList.isShowUpModal = false
        } else {
          this.$Message.success(res.data.msg || "添加失败")
          this.$refs.importList.isShowUpModal = false
        }
        this.reset()
      }).catch(() => {
        // this.$Message.error("添加失败")
        this.$refs.importList.isShowUpModal = false
      })
    },
    changeErrorPage(val) { // 列表换页
      this.errorCurrent = val;
      this.queryValiResult()
    },
    changeErrorPageSize(val) { // 设置列表行数
      this.errorPageSize = val;
      this.queryValiResult()
    },
    reUpload() {
      this.isShowErrorModal = false
      this.$refs.importList.importFile()
    },
    closeErrorModal() {
      this.isShowErrorModal = false
      this.$refs.importList.isShowUpModal = false
      this.fileCacheKey = null
    }
  }
}
</script>

<style lang="less" scoped>
.clickFiles,
.clickFiles:hover {
  color: #ff8533;
  border: 1px solid #ff8533;
}
 .addBut{
    background: #FF8533;
    color: #fff;
    margin:10px 0;
 }
.button-wrap {
    margin-bottom: 20px;
    display:flex;

    button {
        margin-left:20px;
    }
  }
</style>

