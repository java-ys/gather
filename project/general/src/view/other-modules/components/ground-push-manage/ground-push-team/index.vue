<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @on-change="selectChange"
      />
      <div style="display: flex; justify-content: space-between;">
        <section>
          <span style="font-size: 22px; font-weight: bold;">人员清单</span>
        </section>
        <section style="width: 500px; display: flex; justify-content: space-between; align-items: start;">
          <!--<ExportFile-->
            <!--exportUrl="/download/business_white_tmpl.xlsx"-->
            <!--exportFileName="模板.xlsx"-->
            <!--:queryData="{}"-->
            <!--baseUrlKey="_baseUrl4CommonWeb"-->
            <!--btnText="下载模板"-->
            <!--ajaxMethod="get"-->
            <!--style="color: #2d8cf0;background-color: #fff;border: none;font-size:13px;margin-left: 16px;text-decoration: underline;"-->
          <!--/>-->
          <ExportFile
            exportUrl="/admin/supply/downLoadFile/template"
            exportFileName="模板.xlsx"
            :queryData="{}"
            baseUrlKey="_baseUrl4Manager"
            btnText="下载模板"
            ajaxMethod="get"
            style="color: #2d8cf0;background-color: #fff;border: none;font-size:13px;margin-left: 16px;text-decoration: underline;"
          >
          </ExportFile>
          <!--<ExportFile-->
            <!--:isDisabled="false"-->
            <!--baseUrlKey="_baseUrl4CommonWeb"-->
            <!--exportUrl="/api/common/business/batchExportWhiteExcel"-->
            <!--exportFileName="白名单列表.xlsx"-->
            <!--:queryData="searchListParams"-->
            <!--btnText="批量导出"-->
          <!--&gt;</ExportFile>-->
          <Upload
            ref="importFile"
            :data="{importType: 1}"
            type="drag"
            :action="importFileUrl_"
            class="file-box"
            :headers="header"
            :on-success="importSuccess"
            :on-error="importFiled"
            :format="['xlsx']"
            accept=".xlsx"
            :on-format-error="formatError"
          >
            <Button
              v-hasAuth="'elecfence_control-add'"
              type="primary"
            >
              导入失效
            </Button>
          </Upload>
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button
              v-hasAuth="'elecfence_control-add'"
              type="primary"
            >
              导入添加
            </Button>
          </Upload>
          <Button
            v-hasAuth="'elecfence_control-add'"
            type="primary"
            @click="popView"
          >
            添加人员
          </Button>
        </section>
      </div>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        style="margin-top: 25px;"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
      />

      <Modal
        v-model="visible"
        :title="title"
        width="400"
        :mask-closable="false"
        :closable="false"
        @on-ok="addPerson"
        @on-cancel="cancel"
      >
        <Form
          ref="form"
          :model="form"
          :rules="rules"
        >
          <div style="width: 300px;">
            <FormItem prop="userName" label="姓名">
              <Input type="text" :maxlength="10" v-model="form.userName" placeholder="姓名">
              </Input>
            </FormItem>
            <FormItem prop="mobile" label="手机号">
              <Input type="tel" :maxlength="11" v-model="form.mobile" placeholder="手机号">
              </Input>
            </FormItem>
          </div>
        </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
import { returnFields, inputList, railTypeMap, statusData, serviceTypeData } from "./index"
import { queryGroundPushTeamList, groundPushAddPerson, groundPushDetail } from "_o/api/groundPush"
import { keys } from "@/libs/tools"
import { getToken } from "@/libs/util.js";
import VTable from "_a/v-table/v-table"
import SearchList from "_a/search-list/search-list"
import ExportFile from '_a/export-file/exportFile';
import { cpTranslate } from "@/libs/tools";
import {mapActions, mapGetters, mapState} from "vuex";
import {
  getPenDetail,
  updateFenceStatus,
  getCitys
} from "_o/api/configData.js"
export default {
  components: {
    VTable,
    SearchList,
    ExportFile,
  },
  data() {
    return {
      ...returnFields(this),
      importFileUrl_: this._baseUrlCommon + "/m2-manager-web/admin/supply/importExcel",
      title: "添加人员",
      header: { Authorization: getToken() },
      visible: false,
      form: {
        userName: '',
        mobile: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
        ]
      },
      tableData: [],
      inputList: [],
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      searchListParams: {} // 保存搜索条件参数
    }
  },
  computed: {
    ...mapState({ }),
    ...mapGetters({ }),
  },
  mounted() {
    this.getTableList()
    this.inputList = inputList
  },
  methods: {
    formatError() {
      this.$Message.error('支持格式 xlsx')
    },
    importFiled() {
      this.$Message.error('导入失败')
    },
    importSuccess() {
      this.$Message.success('导入成功')
    },
    addPerson() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await groundPushAddPerson(this.form)
          this.$Message.info(res.data.msg);
        } else {

        }
        this.getTableList()
      })
    },
    cancel() {
      this.visible = false
    },
    getTableList() {
      const params = this.searchListParams
      // 获取表格数据
      params.pageSize = this.pageSize
      params.currPage = this.current
      queryGroundPushTeamList(params).then(res => {
        this.tableData  = (res.data.data && res.data.data.list) || []
        // 过滤运营围栏和人车证过滤围栏
        // this.tableData = list.filter(item => item.railType !== 1 &&  item.railType !== 28)
        this.total = (res.data.data && res.data.data.totalCount) || 0
        this.$store.commit("changeLoadingFlag", false)
      })
    },
    popView() {
      this.visible = true
    },
    confirm(data) {
      if (data) this.getTableList()
      this.isPop = false
    },
    search(data) {
      this.current = 1
      this.searchListParams = { ...data }
      this.getTableList()
    },
    reset(data) {
      this.current = 1
      this.searchListParams = {}
      this.getTableList()
    },
    selectObj(val) {
      this.current = val
      this.getTableList()
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    selectChange(data,name){
    }
  }
}
</script>
<style scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
