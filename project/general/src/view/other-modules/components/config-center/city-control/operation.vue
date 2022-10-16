<!--操作页面主体-->
<template>
  <div>
    <Tabs
      v-model="tabType"
      type="line"
      @on-click="changeTab"
    >
      <TabPane
        label="乘客定价策略"
        name="7"
      ></TabPane>
      <!-- <TabPane
        label="司机定价策略"
        name="9"
      ></TabPane> -->
      <TabPane
        label="跨城费策略"
        name="10"
      ></TabPane>
      <!-- <TabPane
        v-if="+tabType !== 6 && +tabType !== 5 && +params.businessType !== 4 && +params.businessType !== 2"
        label="定价策略"
        name="1"
      ></TabPane> -->
      <TabPane
        v-if="+tabType !== 6 && +tabType !== 5"
        label="坏账策略"
        name="2"
      ></TabPane>
      <!-- <TabPane label="折扣矩阵" name='3' v-if="+tabType !== 6 && +tabType !== 5"></TabPane> -->
      <TabPane
        v-if="+tabType === 6 || +tabType === 5"
        label="抽成策略"
        name="5"
      ></TabPane>
      <TabPane
        v-if="(+tabType === 6 || +tabType === 5) && +params.businessType !== 4 && +params.businessType !== 2"
        label="定价策略"
        name="6"
      ></TabPane>
      <TabPane
        label="实名认证策略"
        name="4"
      ></TabPane>
      <TabPane
        v-if="+tabType !== 6 && +tabType !== 5"
        label="异地车辆策略"
        name="8"
      ></TabPane>
    </Tabs>

    <real-name v-if="tabType === '4'"></real-name>
    <cross-city v-else-if="tabType === '10'" :parentParams="params"></cross-city>
    <div v-else>
      <SearchList
        :inputList="inputList"
        :showReset="false"
        @on-search="search"
        @on-reset="reset"
        @on-change="searchListChange"
      ></SearchList>
      <Button
        type="primary"
        @click="popView('add', {})"
      >
        {{addBtnText}}
      </Button>
      <div style="display: flex;margin-top: 16px;">
        <Card class="operation-left">
          <p class="city-name">
            {{params.cityName}}
          </p>
          <p class="province-name">
            {{params.provinceName}}
          </p>
          <p
            class="city-name"
            style="margin-top: 50px;"
          >
            {{getBusinessName(expandBizLine)}}
          </p>
          <p class="province-name">
            {{openStatusMap[params.openStatus]}}
          </p>
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
              v-if="+tabType !== 8"
              ghost
              type="warning"
              size="small"
              style="margin-right: 15px;"
              @click="popView('detail', params)"
            >
              详情
            </Button>
            <Button
              v-if="+tabType === 6 || +tabType === 5 || +tabType === 8"
              ghost
              type="warning"
              size="small"
              style="margin-right: 15px;"
              @click="popView('edit', params)"
            >
              编辑
            </Button>
            <Button
              v-if="+tabType === 7 || +tabType === 9"
              ghost
              type="warning"
              size="small"
              style="margin-right: 15px;"
              @click="popView('copy', params)"
            >
              复制
            </Button>
            <Button
              v-if="params.data.row.status === 1 && +consumerType === 2 && !params.data.row.stopStrategyFlag"
              ghost
              type="error"
              size="small"
              @click="stop(params)"
            >
              停用
            </Button>
            <Button
              v-if="params.data.row.status === 0"
              ghost
              type="error"
              size="small"
              @click="remove(params)"
            >
              删除
            </Button>
            <!--单独处理顺风车抽成策略status不统一-->
            <Button
              v-if="+tabType === 5 && params.data.row.status === 2"
              ghost
              type="error"
              size="small"
              @click="remove(params)"
            >
              删除
            </Button>
            <!-- 乘客定价策略-区县级 可废弃 -->
            <Button
              v-if="+tabType === 7 && params.data.row.status === 1 && Number(params.data.row.areaType) === 2"
              ghost
              type="error"
              size="small"
              @click="stop(params, '废弃')"
            >
              废弃
            </Button>
          </template>
        </VTable>

        <Modal
          v-model="popPriceViewStatus"
          :width="1000"
          :mask-closable="false"
          :title="popPriceViewTitle"
          footer-hide
        >
          <UpdatePrice
            v-model="popPriceViewStatus"
            :type="priceType"
            :parentParams="params"
            :area-info-by-code-list="areaInfoByCodeList"
            @on-confirm="confirm"
          >
          </UpdatePrice>
        </Modal>
        <Modal
          v-model="popPriceViewStatus1"
          :mask-closable="false"
          :title="popPriceViewTitle"
          footer-hide
          fullscreen
        >
          <PassengerpricingEdit
            v-model="popPriceViewStatus1"
            :type="priceType"
            :parentParams="params"
            :area-info-by-code-list="areaInfoByCodeList"
            @on-confirm="confirm"
          >
          </PassengerpricingEdit>
        </Modal>
        <Modal
          v-model="popBadViewStatus"
          :width="500"
          :mask-closable="false"
          :title="popBadViewTitle"
          footer-hide
        >
          <UpdateBad
            v-model="popBadViewStatus"
            :parentParams="params"
            @on-confirm="confirm"
          >
          </UpdateBad>
        </Modal>
        <Modal
          v-model="popAccountViewStatus"
          :width="750"
          :mask-closable="false"
          :title="popAccountViewTitle"
          footer-hide
        >
          <UpdateAccount
            v-model="popAccountViewStatus"
            :parentParams="params"
            @on-confirm="confirm"
          >
          </UpdateAccount>
        </Modal>
        <Modal
          v-model="popDownwindPriceViewStatus"
          :width="1000"
          :mask-closable="false"
          :title="popDownwindPriceViewTitle"
          footer-hide
          @on-cancel="cancel"
        >
          <DownwindUpdatePrice
            ref="popDownwindPriceViewAction"
            v-model="popDownwindPriceViewStatus"
            :parentParams="params"
            :popDownwindPriceViewAction="popDownwindPriceViewAction"
            @on-confirm="confirm"
          >
          </DownwindUpdatePrice>
        </Modal>
        <Modal
          v-model="popDownwindAccountViewStatus"
          :width="1000"
          :mask-closable="false"
          :title="popDownwindAccountViewTitle"
          footer-hide
        >
          <DownwindUpdatePump
            ref="popDownwindAccountViewAction"
            v-model="popDownwindAccountViewStatus"
            :parentParams="params"
            :popDownwindAccountViewAction="popDownwindAccountViewAction"
            @on-confirm="confirm"
          >
          </DownwindUpdatePump>
        </Modal>
        <Modal
          v-model="popDownwindDistanceVehicle"
          :width="750"
          :mask-closable="false"
          :title="popDownwindDistanceVehicleTitle"
          footer-hide
        >
          <UpdateVehicle
            ref="popDownwindDistanceVehicleAction"
            v-model="popDownwindDistanceVehicle"
            :parentParams="params"
            :type="popDownwindDistanceVehicleAction"
            @on-confirm="confirm"
          >
          </UpdateVehicle>
        </Modal>
      </div>
    </div>

    <fence-modal
      ref="fenceModalShow"
      :show="isPopFence"
      :uuid="fenceUuid"
      @close="closeFence"
    ></fence-modal>
  </div>
</template>

<script>
import {
  openStatusMap,
  vehicleColumns,
  operationColumns,
  inputList,
  badInputList,
  priceColumns,
  customerPriceColumns,
  priceInputList,
  priceInputListSpecil,
  hitchColumns,
  hitchInputList,
  hitchCutPolicyColumns,
  hitchCutPolicyInputList,
  customerPriceInputList,
} from "./index";
import { typeModuleMap } from "_g/config/status-map";
import {
  getDistanceVehicleList,
  getPriceStrategyList,
  deletePriceStrategy,
  getBadDebtList,
  deleteBadDebt,
  getDiscountList,
  deleteDiscount,
  stopPriceStrategy,
  discardPriceStrategy,
  getAllDriverType,
  getAreaInfoByCode
} from "_g/api/openCity"
import UpdatePrice from "./components/update-price.vue"
// import UpdatePriceDriver from "./components/update-price-driver.vue"
import UpdateBad from "./components/update-bad.vue"
import UpdateAccount from "./components/update-account.vue"
import UpdateVehicle from "./components/update-vehicle.vue"
import DownwindUpdatePrice from "./downwind-module/pricing-strategy/index"
import DownwindUpdatePump from "./downwind-module/pumping-strategy/index"
import PassengerpricingEdit from "./components/strategy-modal/passenger-pricing-edit.vue"
import {
  cutPolicyDeleteCutPolicy,
  cutPolicySelectList,
  deletePricePolicy,
  pricePolicySelectList
} from "_o/api/cityOpen";
import realName from "./components/real-name/index.vue"
import CrossCity from "./components/cross-city/index.vue"
import fenceModal from "_a/fence-modal/index"
import { mapState, mapGetters } from "vuex";

export default {
  name: "city_control_operation",
  components: {
    UpdatePrice,    // 新建定价策略/详情弹窗
    // UpdatePriceDriver, // 司机定价
    UpdateBad,      // 新建坏账策略/详情弹窗
    UpdateVehicle, // 新建异地车辆策略/详情弹窗
    UpdateAccount,   // 新建折扣矩阵/详情弹窗
    DownwindUpdatePrice,  // 新建顺风车定价策略/详情弹窗
    DownwindUpdatePump, // 新建顺风车抽成策略/详情弹框
    realName, // 实名认证策略右侧框
    CrossCity,  // 跨城策略
    fenceModal, // 围栏组件
    PassengerpricingEdit,
  },
  data() {
    return {
      expandBizLine: this.$route.query.expandBizLine, // 业务线
      priceType: "",
      inputList: [],
      isPopFence: false, // 控制围栏是否显示
      fenceUuid: "0", // 围栏数据
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
      popDownwindPriceViewAction: "",
      popDownwindAccountViewAction: "",
      popDownwindDistanceVehicleAction: null,
      tabType: "7",       // 1: 定价策略  2: 坏账策略  3: 折扣矩阵  4: 顺风车定价策略 5: 顺风车抽成策略
      consumerType: null,  // 1: 乘客  2：司机


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
        consumerType: "",
        driverOpenType: ""
      },

      addBtnText: "",                 // 新增按钮的文字
      popPriceViewStatus: false,      // 弹出定价策略新建/详情弹窗
      popPriceViewStatus1: false,
      popPriceViewStatusDriver: false,
      popBadViewStatus: false,        // 弹出坏账策略新建/详情弹窗
      popAccountViewStatus: false,    // 弹出折扣矩阵新建/详情弹窗
      popDownwindPriceViewStatus: false, // 弹出顺风车定价策略新建/详情弹窗
      popDownwindDistanceVehicle: false, // 异地车辆策略新建/详情弹窗
      popDownwindAccountViewStatus: false, // 弹出顺风车抽成策略新建/详情弹窗
      popPriceViewTitle: "",          // 定价策略弹窗标题
      popBadViewTitle: "",            // 坏账策略弹窗标题
      popAccountViewTitle: "",        // 折扣矩阵弹窗标题
      popDownwindPriceViewTitle: "",  // 顺风车定价策略弹窗标题
      popDownwindAccountViewTitle: "", // 顺风车抽成策略弹窗标题
      popDownwindDistanceVehicleTitle: "", // 异地车辆策略
      typeModuleMap,
      openStatusMap,
      operationColumns,
      vehicleColumns,
      priceColumns,
      customerPriceColumns,
      hitchColumns,
      hitchCutPolicyColumns,
      // 司机类型列表
      // driverTypeList: [],
      // driverTypeMap: {},
      // 行政区列表
      areaInfoByCodeList: []
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    hitchParams() { // 顺风车定价策略查询请求参数
      return {
        cityUuid: this.$route.query.cityUuid,
        currPage: this.current,
        bizCode: "5",
        pageSize: this.pageSize,
        ...this.searchParams
      }
    },
  },
  watch: {
    "$route.query.uuid"() {
      this.tabType = this.$route.query.tabType
      this.init()
    },
    "$route.query.driverOpenType"() {
      this.tabType = this.$route.query.tabType
      this.init()
    },
    "popDownwindDistanceVehicle"() {
      if (this.popDownwindDistanceVehicle === false) { // 每次跨城策略关闭清除数据
        this.$refs.popDownwindDistanceVehicleAction.resetForm()
      }
      if (this.popDownwindDistanceVehicle === true) { // 每次跨城策略开启，请求围栏
        this.$refs.popDownwindDistanceVehicleAction.getElectronicFenceList()
      }
    }
  },
  mounted() {
    this.tabType = this.$route.query.tabType
    this.consumerType = this.$route.query.consumerType
    this.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : ""// 业务线
    this.init()
    // this.getAllDriverTypeList()
    this.getAreaInfoByCode()
  },
  activated() {
    console.log("activated")
    // 修复区县缓存
    this.tabType = this.$route.query.tabType
    this.consumerType = this.$route.query.consumerType
    this.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : "" // 业务线
    this.init()
    this.getAreaInfoByCode()
  },
  methods: {
    // async getAllDriverTypeList() {
    //   try {
    //     const res = await getAllDriverType()
    //     if (res.data.success) {
    //       this.driverTypeList = res.data.data.driverTypeDtos
    //       const driverTypeMap = {}
    //       this.driverTypeList.forEach(item => {
    //         driverTypeMap[item.driverType] = item.desc
    //       })
    //       this.driverTypeMap = driverTypeMap
    //     }
    //   } catch (e) {}
    // },
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
    closeFence() { // 关闭围栏
      this.isPopFence = false
    },
    init() {
      console.log("init - driverOpenType", this.$route.query.driverOpenType)
      console.log("init - tabType", this.tabType)
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
      this.params.driverOpenType = this.$route.query.driverOpenType
      this.searchParams.businessType = this.bizTypeList ? this.bizTypeList[0].value : ""
      this.columns = [...this.operationColumns]
      this.params.consumerType = this.$route.query.consumerType
      this.params.expandBizLine = this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine) : ""
      //  以下处理 inputList 、 columns、 addBtnText 等tab内容区域
      // 4-实名认证策略，10-跨城费策略，独立组件，不在此维护
      if (this.tabType === "4" || this.tabType === "10") {
        return false
      }
      inputList[0].dropList = this.bizTypeList
      inputList[0].value = this.bizTypeList[0].value // 默认第一个值
      this.inputList = JSON.parse(JSON.stringify(inputList))
      if (Number(this.$route.query.businessType) === 5) {
        if (this.tabType === "6") { // 顺风车定价策略
          this.columns = this.hitchColumns;
        } else { // 顺风车抽成策略
          this.columns = this.hitchCutPolicyColumns;
        }

      } else {
        this.columns = [...this.operationColumns]
      }
      if (this.$route.query.tabType === "8") {
        this.columns = this.vehicleColumns(this)
      }
      if (Number(this.$route.query.businessType) !== 5) { // 单独处理顺风车查询类型
        this.inputList = JSON.parse(JSON.stringify(inputList));
      } else {
        if (this.tabType === "4") {
          this.inputList = JSON.parse(JSON.stringify(hitchInputList))
        } else {
          this.inputList = JSON.parse(JSON.stringify(hitchCutPolicyInputList))
        }
      }
      if (this.tabType === "1") {
        this.addBtnText = "新增定价策略"
        this.columns = this.priceColumns(this)
        if (this.$route.query.businessType === "4") {
          this.inputList = JSON.parse(JSON.stringify(priceInputList)) // 快享
        } else {
          this.inputList = JSON.parse(JSON.stringify(priceInputListSpecil)) // 专车
        }
        this.columns[1].key = "fareTypeNote"
      } else if (this.tabType === "2") {
        this.addBtnText = "新增坏账策略"
        // badInputList[0].dropList = this.businessGradeList
        badInputList[0].dropList = this.bizTypeList
        badInputList[0].value = this.bizTypeList[0].value
        this.inputList = JSON.parse(JSON.stringify(badInputList))
        this.columns[1].key = "name"
      } else if (this.tabType === "3") {
        this.addBtnText = "新增折扣矩阵"
        this.columns[1].key = "ruleName"
      } else if (this.tabType === "6") {
        this.addBtnText = "新增定价策略"
      } else if (this.tabType === "7") {
        // 乘客定价策略
        this.columns = this.customerPriceColumns(this)
        this.params.consumerType = "1";
        this.consumerType = "1";
        this.addBtnText = "新增定价策略"
        this.inputList = JSON.parse(JSON.stringify(customerPriceInputList));
        this.columns[1].key = "fareTypeNote"
      } else if (this.tabType === "9") {
        this.columns = this.priceColumns(this)
        this.params.consumerType = "2";
        this.consumerType = "2";
        this.addBtnText = "新增定价策略"
        this.columns[1].key = "fareTypeNote"
      } else if (this.tabType === "8") {
        this.columns = this.vehicleColumns(this)
        inputList[0].dropList = this.bizTypeList
        this.inputList = inputList.slice(0, 1)
        this.addBtnText = "新增"
      } else {
        this.addBtnText = "新增抽成策略"
      }
      if (this.tabType === "2") this.columns.splice(3, 1)
      this.getTableList()
    },
    changeTab(name) {
      this.init()
    },
    showPanel(data) { // 显示围栏
      this.fenceUuid = data.row && data.row.offSiteVehicleDto && data.row.offSiteVehicleDto.fenceUuid
      this.isPopFence = true
    },
    getTitle(type, title) {
      if (type === "add") return "新建" + title
      if (type === "detail") return title + "详情"
      if (type === "copy") return "复制" + title
      if (type === "edit") return "编辑" + title
    },
    popView(type, params) {
      this.params.detailUuid = params.data && params.data.row && params.data.row.uuid || null
      this.params.relationStrategyUuid = params.data && params.data.row && params.data.row.relationStrategyUuid || null
      if (this.tabType === "1") {
        if (this.params.driverOpenType == 1) {
          this.popPriceViewStatus1 = true;
        } else {
          this.popPriceViewStatus = true      // 弹出定价策略
        }
        this.popPriceViewTitle = this.getTitle(type, "定价策略")
      } else if (this.tabType === "7") {
        this.params.consumerType = "1";
        if (this.params.driverOpenType == 1) {
          this.popPriceViewStatus1 = true;
        } else {
          this.popPriceViewStatus = true      // 弹出定价策略
        }
        this.priceType = type
        this.popPriceViewTitle = this.getTitle(type, "定价策略")
      } else if (this.tabType === "9") {
        this.params.consumerType = "2";
        this.popPriceViewStatusDriver = true      // 弹出定价策略
        this.priceType = type
        this.popPriceViewTitle = this.getTitle(type, "定价策略")
      } else if (this.tabType === "2") {
        this.popBadViewStatus = true        // 弹出坏账策略
        this.popBadViewTitle = this.getTitle(type, "坏账策略")
      } else if (this.tabType === "3") {
        this.popAccountViewStatus = true    // 弹出折扣矩阵
        if (type === "add") this.popAccountViewTitle = "新建折扣矩阵"
        else this.popAccountViewTitle = "折扣矩阵详情"
      } else if (this.tabType === "6") {
        this.popDownwindPriceViewStatus = true; // 弹出顺风车定价策略
        this.popDownwindPriceViewTitle = this.getTitle(type, "定价策略")
        this.popDownwindPriceViewAction = type;
        if (type !== "add") {
          this.$refs.popDownwindPriceViewAction.goDetail(params.data.row.uuid)
        }
      } else if (this.tabType === "8") {
        this.popDownwindDistanceVehicle = true; // 异地产量策略
        this.popDownwindDistanceVehicleAction = type;
        this.popDownwindDistanceVehicleTitle = this.getTitle(type, "异地车辆策略");
        if (type !== "add") {
          this.$refs.popDownwindDistanceVehicleAction.goDetail(params.data.row)
        }
      } else {
        this.popDownwindAccountViewStatus = true; // 弹出顺风车抽成策略
        this.popDownwindAccountViewAction = type;
        this.popDownwindAccountViewTitle = this.getTitle(type, "抽成策略");
        if (type !== "add") {
          this.$refs.popDownwindAccountViewAction.goDetail(params.data.row.uuid)
        }
      }
    },
    stop(params, str = "停用") {
      this.$Modal.confirm({
        title: "提示",
        content: `<p>确定要${str}该策略吗？</p>`,
        onOk: () => {
          if (params.data.row.status === -1) { // 失效中
            this.$Message.warning(`策略已失效，无法${str}`)
          } else {
            if (this.tabType === "9") {
              stopPriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success(`${str}成功`)
                this.getTableList()
              })
            }
            if (this.tabType === "7") {
              discardPriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success(`${str}成功`)
                this.getTableList()
              })
            }
          }
        }
      })
    },
    remove(params) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除该策略吗？</p>",
        onOk: () => {
          if (params.data.row.status === 1) { // 生效中
            this.$Message.warning("策略正在生效中，不可删除")
          } else {
            if (this.tabType === "1") {
              deletePriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList()
              })
            } else if (this.tabType === "7") {
              deletePriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList()
              })
            } else if (this.tabType === "9") {
              deletePriceStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList()
              })
            } else if (this.tabType === "2") {
              deleteBadDebt({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList()
              })
            } else if (this.tabType === "6") { // 顺风车删除定价策略
              deletePricePolicy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功");
                this.getTableList();
              })
            } else if (this.tabType === "5") { // 顺风车删除抽成策略
              cutPolicyDeleteCutPolicy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功");
                this.getTableList();
              })
            } else {
              deleteDiscount({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList()
              })
            }
          }
        }
      })
    },
    getTableList() {
      let params = { ...this.searchParams }
      params = Object.assign(params, this.params)
      params.pageSize = this.pageSize
      params.currPage = this.current
      params.expandBizLine = this.searchParams.expandBizLine || this.params.expandBizLine,
      params.businessType = this.searchParams.businessType
      this.$store.commit("changeLoadingFlag", true)
      if (this.tabType === "1") {
        getPriceStrategyList(params).then(res => {
          let data = res.data.data
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.pageResult && data.pageResult.list || []
          this.total = data.pageResult && data.pageResult.totalCount || 0
        })
      } else if (this.tabType === "7") {
        params.cityCode = params.cityCode
        delete params.cityUuid
        getPriceStrategyList(params).then(res => {
          let data = res.data.data
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.pageResult && data.pageResult.list || []
          this.total = data.pageResult && data.pageResult.totalCount || 0
        })
      } else if (this.tabType === "9") {
        params.cityCode = params.cityCode
        delete params.cityUuid
        getPriceStrategyList(params).then(res => {
          let data = res.data.data
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.pageResult && data.pageResult.list || []
          this.total = data.pageResult && data.pageResult.totalCount || 0
        })
      } else if (this.tabType === "2") {
        getBadDebtList(params).then(res => {
          let data = res.data.data
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.list && data.list || []
          this.total = data.totalCount && data.totalCount || 0
        })
      } else if (this.tabType === "3") { // 折扣矩阵
        getDiscountList(params).then(res => {
          let data = res.data.data;
          this.$store.commit("changeLoadingFlag", false);
          this.tableData = (data.pageResult && data.pageResult.list) || [];
          this.total = (data.pageResult && data.pageResult.totalCount) || 0;
        });
      } else if (this.tabType === "6") { // 顺风车定价策略
        pricePolicySelectList(this.hitchParams).then(res => {
          let data = res.data.data;
          this.$store.commit("changeLoadingFlag", false);
          this.tableData = (data.list && data.list) || [];
          this.total = (data && data.totalCount) || 0;
        }).catch(res => {
          this.tableData = [];
          this.total = 0;
        })
      } else if (this.tabType === "5") { // 顺风车抽成策略
        cutPolicySelectList(this.hitchParams).then(res => {
          let data = res.data.data;
          this.$store.commit("changeLoadingFlag", false);
          this.tableData = (data.list && data.list) || [];
          this.total = (data && data.totalCount) || 0;
        }).catch(res => {
          this.tableData = [];
          this.total = 0;
        })
      } else if (this.tabType === "8") { // 异地车辆策略
        getDistanceVehicleList({
          "businessType": params.businessType, // 产品线1-出租车，2-专车，4-快车
          "cityUuid": this.$route.query.cityUuid, // 城市uuid
          "current": this.current,
          "pageSize": this.pageSize,
        }).then(res => {
          let data = res.data.data || {};
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.list;
          this.total = data.totalCount;
        }).catch(res => {
          this.tableData = [];
          this.total = 0;
        })
      }
    },
    // 搜索区域on-change回调
    searchListChange(value, key) {
      // 乘客定价策略-行政区类型发生变化
      if (key === "areaType") {
        if (value !== 2) {
          this.inputList.splice(5, 1);
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
    search(data) {
      this.current = 1
      this.searchParams = data
      this.getTableList()
    },
    cancel() {
      this.popDownwindPriceViewStatus = false;
    },
    reset(data) {
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
    confirm() {
      this.getTableList()
    },
    getBusinessName(val) {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[val] || ""
    },
  }
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
        /* flex: 0.25; */
        width: 300px;
        height: 666px;
    }
</style>
