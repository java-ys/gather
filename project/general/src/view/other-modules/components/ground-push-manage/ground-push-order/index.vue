<!--电子围栏管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
        @on-change="selectChange"
      />
      <Button type="primary" @click="addData" v-hasAuth="'ground-push-order-add'">新建</Button>
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
        width="600"
        title="地推单数据"
        :mask-closable="false"
        :closable="false"
      >
        <div class="detail">
          <div class="detailItem">
            <div class="label">地推单名称:</div>
            <p>{{summaryData.dtName}}</p>
          </div>
          <div class="detailItem">
            <div class="label">实际首单数/目标首单数:</div>
            <p>{{summaryData.firstOrders}}/{{summaryData.firstTransCnt}}  {{summaryData.acdPer}}</p>
          </div>
          <div class="detailItem">
            <div class="label">实际多单人数/实际首单数:</div>
            <p>{{summaryData.multipleOrders}}/{{summaryData.firstOrders}}  {{summaryData.acdManyPer}}</p>
          </div>
          <div class="detailItem">
            <div class="label">异常人数:</div>
            <p>{{summaryData.abnormals}}</p>
          </div>
        </div>
      </Modal>

      <Modal
        v-model="visibleAdd"
        :title="mode === 'add' ? '新建' : mode === 'edit' ? '编辑' : '详情'"
        width="900"
        :mask-closable="false"
        :closable="false"
        :footer-hide="true"

      >
        <Form
          ref="form"
          :model="form"
          :rules="rules"
        >
          <FormItem
            label="地推单名称:"
            prop="dtName"
            :label-width="200"
          >
            <Input
              v-model="form.dtName"
              placeholder="请输入"
              style="width: 200px"
              :disabled="isDetail"
            ></Input>
          </FormItem>

          <FormItem
            label="供应商:"
            prop="supplierUuid"
            :label-width="200"
          >
            <Select v-model="form.supplierUuid" filterable style="width:200px" @on-change="supplierChange" :disabled="isDetail || isEdit">
              <Option v-for="item in options" :value="item.id" :key="item.id">{{ item.supplierName }}</Option>
            </Select>
          </FormItem>

          <FormItem
            label="城市:"
            prop="cityCode"
            :label-width="200"
          >
            <Select v-model="form.cityCode" filterable style="width:200px" :disabled="isDetail ||isEdit">
              <Option v-for="item in cityList" :value="item.cityCode" :key="item.cityCode">{{ item.cityName }}</Option>
            </Select>
          </FormItem>

          <FormItem
            prop="times"
            label="地推周期:"
            :label-width="200"
          >
            <DatePicker v-model="form.times" type="daterange" :options="disabledDate" split-panels placeholder="请选择策略生效日期" style="width: 200px" :disabled="isDetail"></DatePicker>

          </FormItem>

          <Divider />

          <h2>结算策略</h2>

          <FormItem
            label="单价:"
            prop="price"
            :label-width="200"
          >
            <InputNumber
              v-model="form.price"
              placeholder="请输入"
              class="num_input"
              type="number"
              :min="0"
              :max="100"
              :precision="1"
              :disabled="isDetail"
            />
            元/首单
          </FormItem>

          <FormItem
            label="目标首单转化量:"
            prop="firstTransCnt"
            :label-width="200"
          >
            <InputNumber
              v-model="form.firstTransCnt"
              placeholder="请输入"
              class="num_input"
              type="number"
              :min="1"
              :max="99999999"
              :precision="0"
              :disabled="isDetail"
            />
            单
          </FormItem>

          <FormItem
            label="目标多单转化率:"
            prop="manyTransPct"
            :label-width="200"
          >
            <InputNumber
              v-model="form.manyTransPct"
              placeholder="请输入"
              class="num_input"
              type="number"
              :min="1"
              :max="100"
              :precision="0"
              :disabled="isDetail"
            />
            %
            <span style="margin-left: 20px; color: #aaa;">当实际多单转化率低于配置的百分比时, 安装实际目标的百分比折算结算金额</span>
          </FormItem>

          <FormItem
            label="多单转化率下限:"
            prop="manyTransPctLower"
            :label-width="200"
          >
            <InputNumber
              v-model="form.manyTransPctLower"
              placeholder="请输入"
              class="num_input"
              type="number"
              :min="1"
              :max="100"
              :precision="0"
              :disabled="isDetail"
            />
            %
            <span style="margin-left: 20px; color: #aaa;">当实际多单转化率低于配置的百分比时, 最终结算金额减半</span>
          </FormItem>

          <FormItem
            label="完单监测周期:"
            prop="finishOrderPeriod"
            :label-width="200"
          >
            <InputNumber
              v-model="form.finishOrderPeriod"
              placeholder="请输入"
              class="num_input"
              type="number"
              :min="1"
              :max="99"
              :precision="0"
              :disabled="isDetail"
            />
            天
          </FormItem>

          <Divider />

          <FormItem
            label="地推单文件:"
            prop="dtFile"
            :label-width="200"
          >
            <!--:format="['xlsx']"-->
            <!--accept=".xlsx"-->
            <Upload
              ref="importFile"
              :data="{}"
              :action="importFileUrl_"
              :headers="{ token }"
              :show-upload-list="false"
              :on-success="importSuccess"
              :on-error="importFiled"
              :format="['pdf']"
              :max-size="100 * 1024"
              :on-exceeded-size="handleMaxSize"
              accept=".pdf"
              :before-upload="beforeUpload"
              :on-format-error="formatError"
            >
              <Button
                type="primary"
                :disabled="isDetail"
              >
                上传文件
              </Button>
            </Upload>

            <p v-show="!!this.form.dtFile" style="color: #2d8cf0; cursor: pointer;" @click="downFile">{{`地推单附件${this.form.dtFile}`}}</p>

            支持上传 PDF 格式文件

          </FormItem>


          <FormItem
            label="申请OA单号:"
            prop="oaId"
            :label-width="200"
          >
            <Input
              v-model="form.oaId"
              placeholder="请输入"
              style="width: 200px"
              :disabled="isDetail"
            ></Input>
          </FormItem>

          <FormItem
            label="作废原因:"
            prop="remark"
            :label-width="200"
            v-if="detail.configStatus === 2"
          >
           <span>{{detail.remark}}</span>
          </FormItem>
        </Form>

        <section class="footer" style="display: flex; justify-content: flex-end;">
          <Button @click="cancel" style="margin-right: 10px;">{{ mode === 'detail' ? '关闭' : '取消' }}</Button>
          <Button v-if="mode !== 'detail'" type="primary" @click="submitData">确定</Button>
        </section>
      </Modal>
    </div>
  </div>
</template>

<script>
import { returnFields, inputList, railTypeMap, statusData, serviceTypeData } from "./index"
import InputNumber from "_c/number-input/input-number"
import { querySupplierList, addGroundPush, updateGroundPush, groundPushDetail, updateGroundPushStatus, queryGroundPushOrderList, queryBoardSummary } from "_o/api/groundPush"
import { cityList } from "_o/api/assetSupplier.js"
import { getProvinceCityList } from "_g/api/common";
import { keys, cpLabelValue } from "@/libs/tools"
import VTable from "_a/v-table/v-table"
import SearchList from "_a/search-list/search-list"
import { cpTranslate } from "@/libs/tools";
import {mapActions, mapGetters, mapState} from "vuex";
import { getFileToken } from '_o/api/file'
import fileDownload from "js-file-download";
import axios from 'axios'
import {
  getCitys
} from "_o/api/configData.js"
import { getToken } from "@/libs/util.js"
import config from "@/config/config";
const uploadUrl =
  process.env.NODE_ENV === "development"
    ? config.uploadUrl.dev
    : config.uploadUrl.pro; //获取资源请求链接

export default {
  components: {
    VTable,
    SearchList,
    InputNumber,
  },
  data() {
    return {
      ...returnFields(this),
      disabledDate: {
        disabledDate: (date) => {
          const disabledDay = date.getDate();
          return (this.mode === 'add') && date && date.valueOf() < Date.now() - 86400000;
        }
      },
      currentId: '',
      title: "新增",
      mode: 'add',
      token: '',
      visible: false,
      visibleAdd: false,
      remark: '平台作废',
      importFileUrl_: uploadUrl + "/file/upload/private",
      form: {
        dtName: '',
        cityCode: '',
        supplierUuid: '',
        times: [],
        price: null,
        firstTransCnt: null,
        manyTransPct: null,
        manyTransPctLower: null,
        finishOrderPeriod: null,
        dtFile: '',
        oaId: '',
      },
      rules: {
        dtName: [
          { required: true, message: '请输入', trigger: 'blur', max: 20, message: '最多输入20位' }
        ],
        cityCode: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        supplierUuid: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        times: [
          { required: true, validator: (rule, value, callback) => {
              if (!value[0] || !value[1]) {
                callback(new Error(rule.message));
              } else {
                callback();
              }
            }, message: '请选择', trigger: 'change' },
        ],
        price: [
          { required: true, type: 'number', max: 100, min: 0, trigger: 'blur', validator: (rule, value, callback) => {
              if (value <= 0) {
                return callback(new Error('请输入大于0小于100的正整数'))
              }
              callback()
            } },
        ],
        firstTransCnt: [
          { required: true, type: 'number', max: 99999999, min: 0, message: '请输入', trigger: 'blur' },
        ],
        manyTransPct: [ // 目标多单转化率
          { required: false, type: 'number', max: 100, min: 0, validator: (rule, value, callback) => {
            // manyTransPctLower < manyTransPct is true
              if (value && this.form.manyTransPctLower) {
                if (value <= this.form.manyTransPctLower) {
                  return callback(new Error('多单转化率下限需小于目标多单转化率'))
                }
              }
              if (this.form.manyTransPctLower && !value) {
                return callback(new Error('多单转化率下限、目标多单转化率需一同填写'))
              }
              callback()
            }, trigger: 'blur' },
        ],
        manyTransPctLower: [ // 多单转化率下限
          { required: false, type: 'number', max: 100, min: 0, validator: (rule, value, callback) => {
              // manyTransPctLower < manyTransPct is true
              if (value && this.form.manyTransPct) {
                if (value > this.form.manyTransPct) {
                  return callback(new Error('多单转化率下限需小于目标多单转化率'))
                }
              }
              if (this.form.manyTransPct && !value) {
                return callback(new Error('多单转化率下限、目标多单转化率需一同填写'))
              }
              callback()
            }, trigger: 'blur' },
        ],
        finishOrderPeriod: [
          { required: true, type: 'number', max: 99, min: 0, message: '请输入小于100的正整数', trigger: 'blur' },
        ],
        dtFile: [
          { required: true, type: 'number', message: '请上传', trigger: 'blur', validator: (rule, value, callback) => {
            if (this.form.dtFile) return callback()
            callback(new Error('请上传'))
            } },
        ],
        oaId: [
          { required: true, message: '请输入', trigger: 'blur', max: 20, message: '最多输入20位' }
        ],
      },
      tableData: [],
      inputList: [],
      isLoading: true,
      pageSize: 10,
      currPage: 1,
      searchListParams: {}, // 保存搜索条件参数
      options: [],
      detail: {},
      summaryData: {},
      cascaderList: []
    }
  },
  computed: {
    ...mapState({ }),
    ...mapGetters({ }),
    isDetail() {
      return this.mode === 'detail'
    },
    isEdit() {
      return this.mode === 'edit'
    },
    cityList() {
      const supplier = this.options.find(item => item.id === this.form.supplierUuid)
      return supplier
        ? supplier.cityList.length === 0
          ? this.cityArray
          : supplier.cityList
        : []
    },
    cityArray() {
      if (this.cascaderList.length === 0) {
        return [];
      }
      const arr = this.cascaderList.reduce((pre, cur) => {
        const list = cur.children.map(item => ({ cityName: item.label, cityCode: item.orgCode }))
        pre = [...pre, ...list]
        return pre
      }, [])
      return arr
    }
  },
  async mounted() {
    await this.getAllCityList()
    await this.queryOptions()
    this.getTableList()
    this.inputList = inputList
    this.setProvinceCity()
  },
  methods: {
    getAllCityList() {
      cityList({}).then(res => {
        let list = res.data.data || []
        let params = {
          list: list,
          labelKey: "provinceName",
          valueKey: "provinceCode",
          children: "cityDtoList",
          sonLableKey: "orgName",
          sonValueKey: "orgCode",
          isDeep: true,
        }
        list = cpLabelValue(params)
        this.cascaderList = list
      });
    },
    handleMaxSize(file) {
      this.$Message.error('文件最大上传100M')
    },
    viewData(dtNo) {
      queryBoardSummary({ dtNo }).then(res => {
        if (!res.data.success) return this.$Message.error(res.data.msg)
        this.summaryData = res.data.data || {}
        this.popView()
      })
    },
    submitData() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { times, ...ext } = this.form
          const { cityCode, supplierUuid } = ext
          const supplier = this.options.find(item => item.id === supplierUuid)
          const city = this.cityArray.find(item => item.cityCode === cityCode)
          const params = {
            ...ext,
            supplierName: supplier.supplierName,
            cityName: city.cityName,
            startDate: this.$moment(times[0]).format("YYYY-MM-DD"),
            endDate: this.$moment(times[1]).format("YYYY-MM-DD"),
          }
          let res;
          if (this.mode === 'add') res = await addGroundPush(params)
          if (this.mode === 'edit') res = await updateGroundPush({ id: this.currentId, ...params, })
          if (!res.data.success) return this.$Message.error(res.data.msg)
          this.visibleAdd = false
          this.setDefaultForm()
          this.getTableList()
        }
      })
    },
    cancel() {
      this.detail = {}
      this.visibleAdd = false
    },
    supplierChange(val) {
      this.form.supplierUuid = String(val)
      this.form.cityCode = ''
    },
    async queryOptions() {
      const res = await querySupplierList()
      if (res.data.success) {
        this.options = res.data.data
        this.options.forEach(item => item.id = String(item.id))
      }
    },
    async downFile() {
      const res = await getFileToken()
      const token = res.data.data
      const downloadUrl = uploadUrl + "/file/download/view/" + this.form.dtFile;
      axios(downloadUrl, {
        headers: { Authorization: getToken(), token },
        responseType: 'blob'
      }).then(res => {
        if (res.data) fileDownload(res.data, this.form.dtFileName || '地推单附件.pdf')
      })
    },
    async beforeUpload() {
      const res = await getFileToken()
      const token = res.data.data
      this.token = token
    },
    formatError() {
      this.$Message.error('支持格式 pdf')
    },
    importFiled() {
      this.$Message.error('导入失败')
    },
    importSuccess(response, file, fileList) {
      if (response.success) {
        const { uuid, fileName } = response.data
        this.form.dtFile = uuid
        this.form.dtFileName = fileName
      }
      this.$Message.success('导入成功')
    },
    addData() {
      this.visibleAdd = true
      this.$refs.form.resetFields();
      this.mode = 'add'
    },
    async stop(id) {
      this.$Modal.confirm({
        title: '提示',
        render: (h) => (
          <div>
            <RadioGroup v-model={this.remark} onOn-change={e => {}}>
              <Radio label="平台作废"></Radio>
              <Radio label="供应商作废"></Radio>
            </RadioGroup>
          </div>
        ),
        onOk: async () => {
          const res = await updateGroundPushStatus({ id, configStatus: 2, remark: this.remark })
          if (!res.data.success) return this.$Message.error(res.data.msg)
          this.$Message.success('作废成功')
          this.getTableList()
        },
        onCancel: () => {
        }
      })
    },
    async editData(id) {
      await this.$refs.form.resetFields();

      const res = await groundPushDetail({ id })
      if (!res.data.success) return this.$Message.error(res.data.msg)
      this.currentId = id
      const { dtName, cityCode, supplierUuid, startDate, endDate, price, firstTransCnt, manyTransPct, manyTransPctLower, finishOrderPeriod, dtFile, dtFileName, oaId } = this.detail = res.data.data
      this.form = { dtName, cityCode, supplierUuid, times: [startDate, endDate], price, firstTransCnt, manyTransPct, manyTransPctLower, finishOrderPeriod, dtFile, dtFileName, oaId }
      this.visibleAdd = true
    },
    setDefaultForm() {
      this.form = {
        dtName: '',
        cityCode: '',
        supplierUuid: '',
        times: [],
        price: null,
        firstTransCnt: null,
        manyTransPct: null,
        manyTransPctLower: null,
        finishOrderPeriod: null,
        dtFileName: '',
        dtFile: '',
        oaId: '',
      }
    },
    async setProvinceCity() {
      const f = this.inputList.find(it => it.name === "cascader-input");
      if (!f) return;
      const { list } = await this.getCityList();
      this.provinceCityList = list;
      f.cascaderList = list;
    },
    getCityList() {
      return new Promise((resolve) => {
        getProvinceCityList({}).then(res => {
          let list = cpTranslate(res.data.data || []);
          resolve({ list })
        });
      })

    },
    getTableList() {
      const params = this.searchListParams
      // 获取表格数据
      params.pageSize = this.pageSize
      params.currPage = this.current
      queryGroundPushOrderList(params).then(res => {
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
<style lang="less" scoped>
.carrier-header {
  margin-top: 10px;
}
  .detail {
    .detailItem {
      font-size: 14px;
      display: flex;
      align-items: center;
      height: 38px;
      .label {
        flex-basis: 200px;
        text-align: end;
        margin-right: 14px;
      }
    }
  }

.ploy-detail {
  padding-left: 50px;
  .detailItem {
    font-size: 14px;
    display: flex;
    align-items: center;
    height: 38px;
    .label {
      flex-basis: 120px;
      text-align: end;
      margin-right: 14px;
    }
  }
}
</style>
