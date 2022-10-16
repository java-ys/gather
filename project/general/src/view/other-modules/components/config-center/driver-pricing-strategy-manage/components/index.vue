<template>
  <div>
    <SearchList
      :inputList="inputList"
      :showReset="true"
      :resetTxt="'重置'"
      @on-search="search"
      @on-reset="reset"
      @on-change="searchListChange"
    ></SearchList>
    <Button
      v-hasAuth="'driver_pricing_strategy_add'"
      type="primary"
      @click="popView('add', {})"
    >
      新建司机定价策略
    </Button>
    <Button
      v-hasAuth="'driver_pricing_strategy_check'"
      type="primary"
      @click="popView('check', {})"
    >
      查询乘客定价策略
    </Button>
    <div style="display: flex;margin-top: 16px;">
      <Card class="operation-left">
        <p class="city-name">
          {{params.cityName}}
        </p>
        <p class="province-name">
          {{params.provinceName}}
        </p>
        <p class="city-name" style="margin-top: 50px;">
          市级
        </p>
        <p class="province-name">
          行政级别
        </p>
        <!-- <p
          class="city-name"
          style="margin-top: 50px;"
        >
          {{getBusinessName(expandBizLine)}}
        </p> -->
        <!-- <p class="province-name">
          {{openStatusMap[params.openStatus]}}
        </p> -->
      </Card>
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        style="width: calc(100% - 300px)"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
        <template
          slot="index"
          slot-scope="params"
        >
          <span>{{(current - 1) * pageSize + params.data.index + 1}}</span>
        </template>
        <template
          slot="action"
          slot-scope="params"
        >
          <Button
            v-hasAuth="'driver_pricing_strategy_detail'"
            ghost
            type="warning"
            size="small"
            style="margin-right: 15px;"
            @click="popView('detail', params)"
          >
            详情
          </Button>
          <Button
            v-hasAuth="'driver_pricing_strategy_copy'"
            ghost
            type="warning"
            size="small"
            style="margin-right: 15px;"
            @click="popView('copy', params)"
          >
            复制
          </Button>
          <Button
            v-hasAuth="'driver_pricing_strategy_add2'"
            ghost
            type="warning"
            size="small"
            style="margin-right: 15px;"
            @click="popView('add', params)"
          >
            新建司机定价策略
          </Button>
          <Button
            v-if="params.data.row.status === 0"
            v-hasAuth="'driver_pricing_strategy_cancellation'"
            ghost
            type="error"
            size="small"
            @click="stop(params, '作废')"
          >
            作废
          </Button>
        </template>
      </VTable>

      <Modal
        v-model="popPriceViewStatus"
        :mask-closable="false"
        :title="popPriceViewTitle"
        footer-hide
        fullscreen
      >
        <DriverPricingEdit
          v-model="popPriceViewStatus"
          :type="priceType"
          :parentParams="params"
          :driver-type-list="driverTypeList"
          :driver-type-map="driverTypeMap"
          :area-info-by-code-list="areaInfoByCodeList"
          @on-confirm="confirm"
        >
        </DriverPricingEdit>
      </Modal>
      <Modal
        v-model="popPassPriceViewStatus"
        :mask-closable="false"
        title="乘客定价策略详情"
        footer-hide
        fullscreen
      >
        <PassengerPricingEdit
          v-model="popPassPriceViewStatus"
          :type="priceType"
          :parentParams="params"
          :driver-type-list="driverTypeList"
          :driver-type-map="driverTypeMap"
          :area-info-by-code-list="areaInfoByCodeList"
          @on-confirm="confirm"
        >
        </PassengerPricingEdit>
      </Modal>
      <Modal
        v-model="popPassengerViewStatus"
        :width="1200"
        :mask-closable="false"
        :title="popPriceViewTitle"
        footer-hide
      >
        <PassengerModal v-if="popPassengerViewStatus" :params="params" :businessGradeName="businessGradeName" @detail="onDetail" @add="onAdd"></PassengerModal>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import PassengerModal from "./passenger-strategy-list/index.vue"
import DriverPricingEdit from "./strategy-modal/driver-pricing-edit"
import PassengerPricingEdit from "./strategy-modal/passenger-pricing-edit"
import {
  openStatusMap,
  operationColumns,
  customerPriceInputList
} from "./index";
import {
  getCityPriceStrategyList
} from "_o/api/configData.js";
import {
  getAreaInfoByCode,
  discardPriceStrategy,
  stopPriceStrategy,
  deletePriceStrategy
} from "_g/api/openCity"
export default {
  name: "driver_pricing_strategy",
  components: {
    PassengerModal,
    DriverPricingEdit,
    PassengerPricingEdit
  },
  data() {
    return {
      expandBizLine: this.$route.query.expandBizLine, // 业务线
      areaType: this.$route.query.areaType,
      inputList: [],
      total: 0,
      vehicleInputList: [
        {
          name: "cascader-input", // 文本输入框名
          bind_key: ["provinceID", "cityID"], // 返回数据的key名
          placeholder: "请选择省/市",
          value: [], // 绑定返回数据
          cascaderList: [], // 级联列表
          title: "省/市：", // 展示的字段名
          changeOnSelect: true
        }
      ],
      current: 1,
      pageSize: 10,
      searchParams: {},
      columns: [],
      tableData: [],
      popPriceViewStatus: false,      // 弹出定价策略新建/详情弹窗
      popPassPriceViewStatus: false, // 弹出乘客详情
      popPassengerViewStatus: false,      // 弹出乘客定价策略弹窗
      popPriceViewTitle: "",          // 定价策略弹窗标题
      priceType: "",
      // 司机类型列表
      driverTypeList: [],
      driverTypeMap: {},
      // 行政区列表
      areaInfoByCodeList: [],
      /*
      * 新增/详情所要的参数
      */
      params: {
        uuid: null,                 // 一条开通城市记录的uuid
        cityId: "",
        cityCode: "",
        cityUuid: "",
        businessType: "",
        cityName: "",
        provinceName: "",
        openStatus: "",
        detailUuid: "",             // 查看详情/删除用uuid
        provinceId: "",
        consumerType: ""
      },
      openStatusMap,
      operationColumns: operationColumns(this)
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : "" // 业务线
    this.init()
    this.getAreaInfoByCode()
  },
  activated() {
    this.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : "" // 业务线
    this.init()
    this.getAreaInfoByCode()
  },
  methods: {
    stop(params, str = "停用") {
      this.$Modal.confirm({
        title: "提示",
        content: `<p>确定要${str}该策略吗？</p>`,
        onOk: () => {
          if (params.data.row.status === -1) { // 失效中
            this.$Message.warning(`策略已失效，无法${str}`)
          } else {
            deletePriceStrategy({ uuid: params.data.row.uuid }).then(res => {
              this.$Message.success(`${str}成功`)
              this.getTableList()
            })
          }
        }
      })
    },
    async getAreaInfoByCode() {
      try {
        const res = await getAreaInfoByCode({ cityCode: this.params.cityId });
        if (res.data.success) {
          this.areaInfoByCodeList = res.data.data.map((m) => {
            return {
              label: m.orgName,
              value: m.orgCode,
            };
          });
        }
      } catch (e) {}
    },
    init() {
      this.current = 1
      this.pageSize = 10
      this.searchParams = {}
      this.params.uuid = this.$route.query.uuid
      this.params.cityId = this.$route.query.cityId
      this.params.cityCode = this.$route.query.cityId
      this.params.cityUuid = this.$route.query.cityUuid
      this.params.cityName = this.$route.query.city
      this.params.provinceName = this.$route.query.province
      this.params.openStatus = this.$route.query.status
      this.params.businessType = this.bizTypeList ? this.bizTypeList[0].value : ""
      // this.searchParams.businessType = this.bizTypeList ? this.bizTypeList[0].value : ""
      this.columns = [...this.operationColumns]
      this.params.consumerType = this.$route.query.consumerType
      this.params.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : ""

      customerPriceInputList[0].dropList = this.bizTypeList
      // customerPriceInputList[0].value = this.bizTypeList[0].value // 默认第一个值
      this.inputList = JSON.parse(JSON.stringify(customerPriceInputList))
      this.inputList[5].dropList = this.businessGradeList;

      this.columns = [...this.operationColumns]

      this.getTableList()
    },
    getTableList() {
      // this.params = Object.assign(this.params, this.searchParams)
      let params = { ...this.searchParams }
      params = Object.assign(params, this.params)
      params.pageSize = this.pageSize
      params.currPage = this.current
      params.expandBizLine = this.searchParams.expandBizLine
      params.businessType = this.searchParams.businessType
      params.consumerType = 2
      this.$store.commit("changeLoadingFlag", true)
      getCityPriceStrategyList(params).then(res => {
        let data = res.data.data
        this.$store.commit("changeLoadingFlag", false)
        this.tableData = data.pageResult && data.pageResult.list || []
        this.total = data.pageResult && data.pageResult.totalCount || 0
      })
    },
    confirm() {
      this.getTableList()
    },
    search(data) {
      this.current = 1
      this.searchParams = data
      this.getTableList()
    },
    reset(data) {
      console.log(data, "000")
      this.current = 1
      this.searchParams = data
      this.getTableList()
    },
    changePageSize(val) {
      this.pageSize = val
      this.getTableList()
    },
    changePage(val) {
      this.current = val
      this.getTableList()
    },
    popView(type, params) {
      this.params.detailUuid = params.data && params.data.row && params.data.row.uuid || null
      this.params.relationStrategyUuid = params.data && params.data.row && params.data.row.relationStrategyUuid || null
      if (type === "add") {
        this.params.consumerType = "2";
        this.popPriceViewStatus = true      // 弹出定价策略
        this.priceType = type
        this.popPriceViewTitle = "新增司机定价策略"
      } else if (type === "check") {
        this.popPassengerViewStatus = true      // 弹出乘客定价策略列表
        this.popPriceViewTitle = "乘客定价策略列表"
      } else if (type === "copy") {
        this.params.consumerType = "2";
        this.popPriceViewStatus = true      // 弹出定价策略
        this.priceType = type
        this.popPriceViewTitle = "新增司机定价策略"
      } else if (type === "detail") {
        this.params.consumerType = "2";
        this.popPriceViewStatus = true      // 弹出定价策略
        this.priceType = type
        this.popPriceViewTitle = "司机定价策略详情"
      }
    },
    onDetail(params) {
      console.log(params, "000");
      this.params.detailUuid = params.data && params.data.row && params.data.row.uuid || null
      this.params.relationStrategyUuid = params.data && params.data.row && params.data.row.relationStrategyUuid || null
      this.params.consumerType = "1";
      this.popPassPriceViewStatus = true      // 弹出定价策略
      this.priceType = "detail"
      this.popPriceViewTitle = "乘客定价策略详情"
    },
    onAdd(params) {
      this.params.relationStrategyUuid = params.data && params.data.row && params.data.row.uuid || null
      this.params.consumerType = "2";
      this.popPriceViewStatus = true      // 弹出定价策略
      this.priceType = "add"
      this.popPriceViewTitle = "新增司机定价策略"
    },
    searchListChange(value, key) {
      console.log(value, key);
      if (key === "areaType") {
        if (value !== 2) {
          this.inputList.splice(6, 1);
        } else {
          this.inputList.push({
            name: "drop-input",
            bind_key: "areaCode",
            placeholder: "全部",
            dropList: this.areaInfoByCodeList,
            value: "", // 用于数据绑定
            title: "行政区：", // 展示的字段名
            titleWidth: 55, // 展示的字段名的宽度
            inputWidth: 200, // input框的宽度
          })
        }
      }
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    },
  },
}
</script>

<style scoped>
  .city-name{
    font-size: 22px;
    font-weight: bold;
  }
  .province-name{
    font-size: 16px;
  }
  .operation-left{
    width: 300px;
    height: 666px;
  }
</style>