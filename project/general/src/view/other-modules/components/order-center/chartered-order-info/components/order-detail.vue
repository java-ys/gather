<template>
  <div style="display: flex;">
    <table class="order-detail-table">
      <tr v-for="(item, index) in orderLeftData" :key="index">
        <td>{{ item.title }}</td>
        <td>
          <Col
            v-for="(cell, index) in item.value"
            :span="cell.span"
            :key="index"
          >
            <Form class="display-div">
              <!--评价内容-->
              <FormItem
                :label="cell.name + ' :'"
                style="display: flex;align-items: center;"
                v-if="cell.star"
              >
                <Rate v-model="cell.value" disabled />
              </FormItem>
              <FormItem :label="item.name + ' :'" v-else-if="item.content">
                <p
                  class="detail-content"
                  style="word-wrap: break-word;width: 240px;"
                >
                  {{ item.value }}
                </p>
              </FormItem>

              <!-- title -->
              <FormItem
                :label="cell.name"
                v-else-if="cell.title"
                style="border-bottom: 1px solid #e3e3e3;padding-bottom: 10px;"
              ></FormItem>

              <!-- 标签 -->
              <FormItem :label="cell.name" v-else-if="cell.tag">
                <p class="right-detail-content" style="height: 60px;">
                  <span v-if="cell.value == '暂无'">{{ cell.value }}</span>
                  <span v-else v-for="list in cell.value" class="evalute-tag">{{
                    list
                  }}</span>
                </p>
              </FormItem>

              <!--其他内容-->
              <FormItem :label="cell.name + ' :'" v-else>
                <!--不带车辆位置、带有跳转链接的字段-->
                <p
                  @click="trunToPage(cell)"
                  class="right-detail-content link-content"
                  v-if="
                    typeof cell.link !== 'undefined' && cell.link !== 'position'
                  "
                >
                  {{ cell.value }}
                </p>

                <!-- 动态折扣版本 -->
                <p
                  v-else-if="cell.discount"
                  class="right-detail-content link-content"
                  @click="showDiscountModal(cell)"
                >
                  {{ cell.value }}
                </p>

                <!-- 乘客计费-定价规则版本 -->
                <p
                  v-else-if="cell.ruleVersion"
                  class="right-detail-content link-content"
                  @click="showRuletModal(cell)"
                >
                  {{ cell.value }}
                </p>

                <!-- 司机计费-定价规则版本 -->
                <p
                  v-else-if="cell.fareRuleVersion"
                  class="right-detail-content link-content"
                  @click="showDriverRuletModal(cell)"
                >
                  {{ cell.value }}
                </p>                

                <!--带车辆位置的字段-->
                <div
                  style="line-height: 20px; color: #515a6e;"
                  v-else-if="cell.link === 'position'"
                >
                  <div v-if="cell.value.vin">
                    <span class="link-position" @click="popMapView(cell.value)"
                      >地图查看</span
                    >
                    <span
                      class="link-position"
                      @click="popDetailView(cell.value)"
                      >车辆实时状态</span
                    >
                  </div>
                  <div v-else>
                    <span class="link-position">暂无</span>
                  </div>
                </div>

                <!--含有修改前价格的字段-->
                <div
                  style="line-height: 20px; color: #515a6e;"
                  v-else-if="typeof cell.adjust !== 'undefined'"
                >
                  <span>
                    {{ cell.adjust }}元
                    <span
                      v-if="
                        (cell.value !== '' &&
                          cell.value !== null &&
                          cell.value !== 0) ||  cell.value == '暂无'
                      "
                      >（修改前{{ cell.value }}）</span
                    >
                    <span v-else>（修改前{{ cell.value }}元）</span>
                  </span>
                </div>

                <!--其他字段-->
                <p class="right-detail-content" v-else>
                  <span v-if="cell.value == '暂无'">{{ cell.value }}</span>
                  <span v-else>{{ cell.value }}{{ cell.unit }}</span>
                </p>
              </FormItem>
            </Form>
          </Col>
        </td>
      </tr>
    </table>

    <div style="flex: 0.3;">
      <Card
        class="order-detail-card"
        v-for="(item, index) in orderRightData"
        :key="index"
      >
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          {{ item.title }}
        </p>
        <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
          <Form class="display-div">
            <FormItem :label="cell.name + ' :'">
              <p
                class="right-detail-content link-content"
                v-if="cell.link"
                @click="trunToPage(cell)"
              >
                {{ cell.value }}
              </p>
              <p class="right-detail-content" v-else>{{ cell.value }}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
    </div>
    <Modal
      footer-hide
      :width="400"
      :mask-closable="false"
      v-model="popDetail"
      title="车辆实时状态"
    >
      <CarDetail
        v-model="popDetail"
        :orderCarStatus="orderCarStatus"
      ></CarDetail>
    </Modal>
    <Modal
      footer-hide
      :width="800"
      :mask-closable="false"
      v-model="popMap"
      title="地图查看"
    >
      <CarMap v-model="popMap" :orderCarStatus="orderCarStatus"></CarMap>
    </Modal>

    <!-- 乘客计费-套餐管理 -->
    <Modal
      :width="900"
      :mask-closable="false"
      :title="popPriceViewTitle"
      v-model="popPriceViewStatus"
      footer-hide
    >
      <PackageVersion
        :parentParams="params"
        v-model="popPriceViewStatus"
        @on-confirm="confirm"
      >
      </PackageVersion>
    </Modal>
    <!-- 司机计费-套餐管理 -->
		<Modal
			:mask-closable="false"
			:width="620"
			:title="popPriceViewTitle"
			v-model="popDriverPriceViewStatus"
      footer-hide
      >
      <PackageVersion
        :parentParams="params"
        v-model="popDriverPriceViewStatus"
        @on-confirm="confirm"
      >
      </PackageVersion>
		</Modal>

    <Modal
      :width="750"
      :mask-closable="false"
      :title="popAccountViewTitle"
      v-model="popAccountViewStatus"
      footer-hide
    >
      <UpdateAccount
        :parentParams="paramsDiscount"
        v-model="popAccountViewStatus"
        @on-confirm="confirm"
      >
      </UpdateAccount>
    </Modal>
    <Modal
      v-model="invoiceDetail"
      title="发票详情"
      :width="550"
      :mask-closable="false"
    >
      <p class="invoiceDetailTitle" style="margin-top: 0;">乘客信息</p>
      <div class="top15">
        <div class="detailName">乘客姓名：</div>
        <div class="details">{{ detailForm.passengerName }}</div>
      </div>
      <div class="top15">
        <div class="detailName">乘客手机号：</div>
        <div class="details">{{ detailForm.passengerMobile }}</div>
      </div>
      <br />
      <p class="invoiceDetailTitle">发票信息</p>
      <div class="top15">
        <div class="detailName">发票类型：</div>
        <div class="details">
          <span v-if="detailForm.invoiceType == '1'">电子发票</span>
          <span v-if="detailForm.invoiceType == '2'">纸质发票</span>
          <span
            v-if="detailForm.invoiceType == '1'"
            @click="lookInvoice(detailForm.invoiceUrl)"
            class="check-invoice-btn"
            >查看发票
          </span>
        </div>
      </div>
      <div class="top15">
        <div class="detailName">抬头类型：</div>
        <div class="details" v-if="detailForm.headerType == 1">企业单位</div>
        <div class="details" v-if="detailForm.headerType == 2">
          个人/非企业单位
        </div>
      </div>
      <div class="top15">
        <div class="detailName">发票抬头：</div>
        <div class="details">{{ detailForm.header }}</div>
      </div>
      <div class="top15" v-if="detailForm.headerType == 1">
        <div class="detailName">税号：</div>
        <div class="details">{{ detailForm.taxNum }}</div>
      </div>
      <div class="top15">
        <div class="detailName">发票内容：</div>
        <div class="details">{{ detailForm.content }}</div>
      </div>
      <div class="top15">
        <div class="detailName">发票金额：</div>
        <div class="details">{{ detailForm.money }}元</div>
      </div>
      <div class="top15">
        <div class="detailName">申请来源：</div>
        <div class="details">
          {{
            detailForm.applySource
              ? applySourceMap[detailForm.applySource]
              : "暂无"
          }}
        </div>
      </div>
      <div class="top15">
        <div class="detailName">业务类型：</div>
        <div class="details">
          {{
            detailForm.bizType ? bussinessTypeMap[detailForm.bizType] : "暂无"
          }}
        </div>
      </div>
      <div class="top15" v-if="detailForm.registerAddress != ''">
        <div class="detailName">注册地址：</div>
        <div class="details">{{ detailForm.registerAddress }}</div>
      </div>
      <div class="top15" v-if="detailForm.registerTel != ''">
        <div class="detailName">注册电话：</div>
        <div class="details">{{ detailForm.registerTel }}</div>
      </div>
      <div class="top15" v-if="detailForm.openingBank != ''">
        <div class="detailName">开户银行：</div>
        <div class="details">{{ detailForm.openingBank }}</div>
      </div>
      <div class="top15" v-if="detailForm.openingAccount != ''">
        <div class="detailName">开户账号：</div>
        <div class="details">{{ detailForm.openingAccount }}</div>
      </div>
      <br />
      <p class="invoiceDetailTitle">开票详情</p>
      <div class="top15">
        <div class="detailName">发票状态：</div>
        <div class="details" v-if="detailForm.status == '0'">待开票</div>
        <div class="details" v-if="detailForm.status == '1'">已开票-寄送中</div>
        <div class="details" v-if="detailForm.status == '2'">已开票</div>
        <div class="details" v-if="detailForm.status == '3'">已取消</div>
        <div class="details" v-if="detailForm.status == '4'">已作废</div>
        <div class="details" v-if="detailForm.status == '5'">
          已开票（电子发票）
        </div>
      </div>
      <div class="top15">
        <div class="detailName">接受方式：</div>
        <div class="details" v-if="detailForm.invoiceType == '1'">
          电子邮箱({{ detailForm.email }})
        </div>
        <div class="details" v-if="detailForm.invoiceType == '2'">
          <p>
            邮寄 &nbsp;&nbsp;&nbsp;<Button
              type="primary"
              @click="toPost"
              v-if="detailForm.status == '0'"
            >
              录入单号
            </Button>
          </p>
          <p>收件人：{{ detailForm.recipient }}</p>
          <p>联系电话：{{ detailForm.mobile }}</p>
          <p>所在地区(省市区)：{{ detailForm.area }}</p>
          <p>详细地址：{{ detailForm.detailAddress }}</p>
        </div>
      </div>
      <div class="top15">
        <div
          class="detailName"
          v-if="detailForm.payType == '1' || detailForm.payType == '2'"
        >
          邮费：
        </div>
        <div class="details" v-if="detailForm.payType == '1'">到付</div>
        <div class="details" v-if="detailForm.payType == '2'">寄付</div>
      </div>
      <div class="top15">
        <div class="detailName">申请时间：</div>
        <div class="details">{{ detailForm.createTime }}</div>
      </div>
      <div
        class="top15"
        v-if="detailForm.status == '1' || detailForm.status == '2'"
      >
        <div class="detailName">快递单号：</div>
        <div class="details">{{ detailForm.logisticsOrderNo }}</div>
      </div>
      <div
        class="top15"
        v-if="detailForm.status == '1' || detailForm.status == '2'"
      >
        <div class="detailName">单号输入时间：</div>
        <div class="details">{{ detailForm.expressDate }}</div>
      </div>
      <p class="invoiceDetailTitle">相关订单</p>
      <Table border :columns="columnOrder" :data="oderData"></Table>
    </Modal>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
import { timeFormat } from "@/libs/util.js";
import {
  getCharteredOrderDetail,
  getCarPosition,
  getCarStatus
} from "_g/api/order.js";
import { orderLeftData, orderRightData, showMap, statusMap , VirtualOrder, DriverPrefix} from "../fields";
import {
  orderMainStatusMap,
  typeTimeMap,
  typeModuleMap,
  creatorTypeMap,
  cancelTypeMap,
  payTypeMap
} from "_g/config/status-map";
import CarDetail from "./detail-popview/car-detail.vue";
import CarMap from "./detail-popview/car-map.vue";
// import UpdatePrice from '_o/components/order-center/update-price.vue';
import PackageVersion from "../components/package-version";
import UpdateAccount from "_o/components/order-center/update-account.vue";
import UpdatePackage from '_o/components/order-center/update-package.vue';
import {
  applySourceMap,
  bussinessTypeMap,
  columnOrder,
  Columns,
  inputList
} from "_o/config";
import { getInvoiceDetail } from "_g/api/finance.js";
/* 包车订单的几个时间取不同字段
 * orderLeftData 在 fields.js中被多处引用，不能直接修改
 * orderLeftData 原时间的key对应到新的type
*/
const orderTimeToType = {
  receive_msg_time: "2", // 派单时间
  reply_msg_time: "3", // 接单时间	
  start_service_msg_time: "4", // 开始服务时间
  arrive_boarding_msg_time: "5", // 到达时间	
  aboard_msg_time: "6", // 乘客上车时间
  arrive_dest_msg_time: "8" // 到达时间
}
export default {
  components: { CarDetail, CarMap, PackageVersion, UpdateAccount, UpdatePackage },
  data() {
    return {
      orderCarStatus: {},
      popMap: false,
      popDetail: false,
      showMap,
      typeTimeMap,
      payTypeMap,
      creatorTypeMap,
      cancelTypeMap,
      typeModuleMap,
      orderLeftData: [],
      orderRightData: [],

      popPriceViewTitle: "套餐管理版本",
      popPriceViewStatus: false, // 乘客计费
      popDriverPriceViewStatus: false,  // 司机计费
      params: {},

      popPackageViewTitle: "套餐详情",
      popPackageViewStatus: false,

      popAccountViewTitle: "动态折扣版本",
      popAccountViewStatus: false,
      paramsDiscount: {},

      invoiceDetail: false,
      applySourceMap,
      bussinessTypeMap,
      detailForm: {},
      columnOrder: columnOrder(this),
      oderData: []
    };
  },
  watch: {
    "$route.params.id"() {
      this.orderLeftData = { ...orderLeftData };
      this.orderRightData = { ...orderRightData };
      this.getDetailInfo();
    }
  },
  mounted() {
    this.clearData();
    this.orderLeftData = { ...orderLeftData };
    this.orderRightData = { ...orderRightData };
    this.getDetailInfo();
  },
  methods: {
    // 获取整个详情信息
    getDetailInfo() {
      getCharteredOrderDetail({ routePlanId: this.$route.params.id }).then(
        res => {
          let temp = false; // 判断是否有开始服务字段
          let data = res.data.data || {};

          // 判断有责取消与无责取消
          if (data.mainStatus === 9) {
            if (
              data.orderCarHistoryStatusList &&
              data.orderCarHistoryStatusList.some(
                item => item.type === "arrive_boarding_msg"
              )
            ) {
              // 如果是取消订单并且到达上车地点有数据  则展示到达上车地点
              if (this.showMap[9].indexOf("arriveBoard") === -1) {
                this.showMap[9].push("arriveBoard");
              }
            } else {
              // 如果没有数据  则不展示到达上车地点
              for (
                let i = 0, length = this.showMap[9].length;
                i < length;
                i++
              ) {
                if (this.showMap[9][i] === "arriveBoard") {
                  this.showMap[9].splice(i, 1);
                }
              }
            }
          }

          let orderTableMap = this.showMap[data.mainStatus] || this.showMap[8];
          // let orderTableMap = this.showMap[8];
          let lengthLeft =
            (data.passingPointsList && data.passingPointsList.length) || 0; // 左侧途经点长度
          let lengthRight =
            (data.passingPointDtos && data.passingPointDtos.length) || 0; // 右侧途经点长度

          this.getTableColumns(orderTableMap); // 获取左侧table展示项
          let tempData = JSON.parse(JSON.stringify(this.orderRightData)); // 深度克隆（不可使用...数组解构）

          for (let i = 0; i < this.orderLeftData.length; i++) {
            if (this.orderLeftData[i].key === "passingPoints") {
              this.orderLeftData.splice(i + lengthLeft, 3 - lengthLeft); // 左侧删除空途经点
              break;
            }
          }

          tempData[0].value.forEach((item, index) => {
            if (item.key === "address0") {
              tempData[0].value.splice(index + lengthRight, 3 - lengthRight); // 右侧删除空途经点
            }
          });

          if (data.typeTime === 1 || data.typeTime === null) {
            // 实时用车
            // tempData[0].value.forEach((item, index) => {
            //   if (item.key === 'departTime') {
            //     tempData[0].value.splice(index, 1); // 右侧删除预约用车时间
            //   }
            // });
          }
          this.orderRightData = JSON.parse(JSON.stringify(tempData)); // 触发更新（不可使用...数组解构）

          // data.orderCarHistoryStatusList &&
          // data.orderCarHistoryStatusList.forEach(item => {
          //   // 检查是否有开始服务字段
          //   if (item.type === 'start_service_msg') temp = true; // 有开始服务字段
          // });
          // if (!temp) {
          //   // 若无开始服务字段
          //   this.orderLeftData.forEach((item, index) => {
          //     if (item.key === 'beginService')
          //       this.orderLeftData.splice(index, 1); // 左侧删除开始服务栏
          //   });
          // }

          // 行程取消的订单
          if (data.mainStatus === 9) {
            if (
              data.actualDriverUuid === null ||
              data.actualDriverUuid === ""
            ) {
              // 若司机未接过单(查询不到司机)
              for (let i = 0; i < this.orderLeftData.length; i++) {
                if (this.orderLeftData[i].key === "distributOrder") {
                  // 左侧删除派单栏
                  this.orderLeftData.splice(i, 1);
                  i--;
                }
                if (this.orderLeftData[i].key === "receiveOrder") {
                  this.orderLeftData.splice(i, 1); // 左侧删除接单栏
                  i--;
                }
              }
              this.orderRightData.forEach((item, index) => {
                if (item.key === "driverInfo")
                  this.orderRightData.splice(index, 1); // 右侧删除司机信息栏
              });
            }
          }

          // 途经点(右侧)处理
          this.orderRightData.forEach(item => {
            item.value &&
              item.value.forEach(cell => {
                data.passingPointDtos &&
                  data.passingPointDtos.forEach((atom, index) => {
                    if (cell.key === "address" + index) {
                      cell.value = atom.address;
                    }
                  });
              });
          });

          // 加入追评
          if (data.evaluate) {
            for (let i = 0; i < data.evaluate.length; i++) {
              if (data.evaluate[i].addType === 2) {
                orderLeftData.forEach(cell => {
                  if (cell.key === "secondEvaluate")
                    this.orderLeftData.push(cell);
                });
                break;
              }
            }
          }

          // 评价数据处理
          let driverUuid = data.actualDriverUuid;
          let obj = {
            1: "正面",
            2: "中性",
            3: "负面"
          };
          this.orderLeftData.forEach(item => {
            item.value.forEach(cell => {
              data.evaluate &&
                data.evaluate.forEach(atom => {
                  if (cell.key === "evaluateTime" + atom.addType)
                    cell.value = atom.createTime;
                  if (
                    cell.key ===
                    "evaluateStars" + atom.addType + atom.evaluateType
                  )
                    cell.value = atom.score || 0;
                  if (
                    cell.key ===
                    "evaluateTags" + atom.addType + atom.evaluateType
                  ) {
                    cell.value = atom.evaluateTag;
                    if (cell.value) {
                      cell.value = cell.value
                        .replace(/[，;；]/g, ",")
                        .split(",");
                    }
                  }
                  if (
                    cell.key ===
                    "evaluateContent" + atom.addType + atom.evaluateType
                  )
                    cell.value = atom.content;
                  if (
                    cell.key ===
                    "evaluateTime" + atom.addType + atom.evaluateType
                  )
                    cell.value = atom.createTime;
                  if (cell.key === "star" + atom.addType + atom.evaluateType)
                    cell.value = obj[atom.score];
                });
            });
          });

          // 车辆位置和时间处理
          this.orderLeftData.forEach(item => {
            item.value.forEach(cell => {
              // data.orderCarHistoryStatusList &&
              //   data.orderCarHistoryStatusList.forEach(atom => {
              //     if (cell.key === atom.type + "_time") cell.value = atom.time;
              //     // if(cell.key === atom.type + '_position') cell.value = atom
              //   });
              // data.passingPointsList &&
              //   data.passingPointsList.forEach((atom, index) => {
              //     if (cell.key === atom.type + "_time" + index)
              //       cell.value = atom.time;
              //     // if(cell.key === atom.type + '_position' + index) cell.value = atom
              //   });
              // 判断是不是时间的显示字段
              if (orderTimeToType[cell.key]) {
                // 接口变更后的时间处理
                const timeItem = data.routeKeyPointList && data.routeKeyPointList.find(atom => atom.type === orderTimeToType[cell.key]);
                if (timeItem) {
                  cell.value = timeFormat(new Date(timeItem.time));
                }
              }
            });
          });
        for (let key in data) {
          // driverItem重新调整数据格式
          if (key === "driverItem") {
            for (let driverKey in data["driverItem"]) {
              data[DriverPrefix + driverKey ] = data[key][driverKey];
            }
          }
        }          
          // 整体赋值
          for (let key in data) {          
            // 左侧
            this.orderLeftData.forEach(item => {
              item.value.forEach(cell => {
                if (cell.key === key) {
                  cell.value = data[key]; // 整体赋值
                  if (cell.key === "invoiceNo") {
                    cell.uuid = data.invoiceUuid;
                  }
                  if (typeof cell.adjust !== "undefined") {
                    // 修改后金额赋值
                    let upperCaseKey =
                      cell.key.substring(0, 1).toUpperCase() +
                      cell.key.substring(1);
                    cell.adjust = data["adjust" + upperCaseKey] || 0;
                  }

                  // 折扣字段处理
                  if (cell.value !== "" && cell.value !== null && cell.acount)
                    cell.value = data[key] + "折";

                  // 数字内容转实际含义
                  if (key === "payType" && cell.value.includes(",")) {
                    cell.value = "组合";
                  } else if (
                    key === "payType" &&
                    cell.value.indexOf(",") === -1
                  ) {
                    cell.value = payTypeMap[cell.value];
                  } else if (key === "billedStatus" && cell.value === 1) {
                    cell.value = "已开票";
                  } else if (key === "billedStatus" && cell.value === 0) {
                    cell.value = "待开票";
                  } else if (key === "invoiceType" && cell.value === 1) {
                    cell.value = "电子发票";
                  } else if (key === "invoiceType" && cell.value === 2) {
                    cell.value = "纸质发票";
                  }
                  if (
                    cell.value === "" ||
                    cell.value === null ||
                    (typeof cell.value === "undefined" &&
                      cell.type !== "number")
                  ) {
                    cell.value = "暂无";
                  }
                  if (
                    (cell.value === null || cell.value === "") &&
                    cell.type === "number"
                  )
                    cell.value = 0;
                }
              });
            });
            // 右侧 整体赋值
            this.orderRightData.forEach(item => {
              item.value.forEach(cell => {
                if (cell.key === key) {
                  cell.value = data[key];
                  if (key === "passengerName") cell.uuid = data.passengerUuid;
                  if (key === "actualDriverName") cell.uuid = data.driverUuid;
                  if (cell.key === "driverNo") {
                    cell.uuid = data.driverUuid;
                  }
                  if (cell.key === "passengerId") {
                    cell.uuid = data.passengerUuid;
                  }

                  // 数字内容转实际含义
                  if (key === "typeTime") cell.value = typeTimeMap[cell.value];
                  if (key === 'scene') cell.value = VirtualOrder(cell.value);
                  if (key === "typeModule")
                    cell.value = typeModuleMap[cell.value];
                  if (key === "parentMainStatus")
                    cell.value = statusMap[cell.value];
                  if (key === "mainStatus")
                    cell.value = [0, 1, 9].includes(cell.value)
                      ? "-"
                      : orderMainStatusMap[cell.value];
                  if (key === "creatorType")
                    cell.value = creatorTypeMap[cell.value];
                  if (key === "cancelType")
                    cell.value = cancelTypeMap[cell.value];
                }
                if (
                  cell.value === null ||
                  cell.value === "" ||
                  typeof cell.value === "undefined"
                )
                  cell.value = "暂无";
              });
            });
          }

          // 套餐管理版本
          let ruleVersion = data.fareRuleModelVo || {};
          // this.params.detailUuid = ruleVersion.uuid;
          // this.params.cityName = ruleVersion.city;
          // this.params.businessType = data.typeModule;

          // 动态折扣版本
          // let routeRuleVo = data.routeRuleVo || {};
          // this.paramsDiscount.detailUuid = routeRuleVo.uuid;
          // this.paramsDiscount.cityName = ruleVersion.city;
          // this.paramsDiscount.businessType = data.typeModule;

          this.orderLeftData.forEach(item => {
            // 车辆位置和时间处理
            item.value.forEach(cell => {
              let key = cell.key;
              if (key == "order_msg_position") {
                cell.value = {
                  vin: res.data.data.vin,
                  time: new Date(res.data.data.routePlanCreateTime).getTime()
                };
              } else if (key && key.indexOf("position") != -1) {
                let time = "";
                item.value.map(item => {
                  if (item.key == key.replace(/position/, "time")) {
                    time = item.value;
                  }
                });
                cell.value = {
                  vin: res.data.data.vin,
                  time: new Date(time).getTime()
                };
              } else if (key == "ruleVersion") {
                // 定价版本规则
                cell.value = ruleVersion.version;
              } else if (key == "discountVersion") {
                cell.value = data.routeRuleVo
                  ? data.routeRuleVo.versionNumber
                  : "暂无";
              }
              // 套餐管理版本
              else if (key == "wrapVersion") {
                cell.value = data.wrapVersion ? data.wrapVersion : "222";
              }
            });
          });
        }
      );
    },
    getTableColumns(map) {
      this.orderLeftData = [];
      this.orderRightData = [];
      orderLeftData.forEach(item => {
        map.forEach(cell => {
          if (item.key === cell) this.orderLeftData.push(item);
        });
      });
      orderRightData.forEach(item => {
        map.forEach(cell => {
          if (item.key === cell) this.orderRightData.push(item);
        });
      });
    },
    trunToPage(params) {
      // 点击vin码
      if (params.link === "vin") {
        if (params.value !== "暂无") {
          this.$router.push({
            name: "vehicle-detail",
            params: {
              id: params.value
            }
          });
        }
      } else if (params.link === "coupon") {
        // 点击优惠券编号
      } else if (params.link === "invoice") {
        // 点击发票编号
        // TODO: 待确定api返回发票uuid字段
        if (params.value === "暂无") {
          this.$Message.warning("暂无数据");
          return;
        }
        this.invoiceDetail = true;
        getInvoiceDetail({
          uuid: params.uuid
        }).then(res => {
          let data = res.data.data || {};
          this.detailForm = data;
          this.oderData = data.itineraryList;
        });
      } else if (params.link === "passenger") {
        // 点击下单人姓名
        if (!!params.uuid == false) {
          this.$Message.warning("暂无乘客信息");
        } else {
          this.$router.push({
            name: "customer-detail",
            params: {
              id: params.uuid
            }
          });
        }
      } else if (params.link === "driver") {
        // 司点击机姓名
        if (!!params.uuid == false) {
          console.log(params);
          this.$Message.warning("暂无司机信息");
        } else {
          this.$router.push({
            name: "staff-detail",
            params: {
              id: params.uuid
            }
          });
        }
      } else {
        console.log("通知前端！！");
      }
    },
    popMapView(params) {
      if (params.time == "暂无") {
        this.$Message.warning("暂无时间");
        return;
      }
      getCarPosition(params).then(res => {
        let data = res.data.data;
        this.popMap = true;
        this.orderCarStatus = data || {};
      });
    },
    popDetailView(params) {
      if (params.time == "暂无") {
        this.$Message.warning("暂无时间");
        return;
      }
      getCarStatus(params).then(res => {
        let data = res.data.data;
        this.popDetail = true;
        this.orderCarStatus = data || {};
      });
    },
    showRuletModal(cell) {
      if (cell.value == "暂无") {
        return;
      }
      this.popPriceViewStatus = true;
    },
    showDriverRuletModal(cell) {
      if (cell.value == "暂无") {
        return;
      }
      this.popDriverPriceViewStatus = true;
    },    
    showDiscountModal(cell) {
      if (cell.value == "暂无") {
        return;
      }
      this.popAccountViewStatus = true;
    },
    confirm() {},
    // orderLeftData有时会缓存数据导致数据显示有误，所以需要手动清空数据
    // orderRightData有时会缓存数据导致数据显示有误，所以需要手动清空数据
    clearData() {
      this.handleClearData(orderLeftData);
      this.handleClearData(orderRightData);
    },
    // 处理清空数据
    handleClearData(arr) {
      for (let i = 0, length = arr.length; i < length; i++) {
        // 判断arr[i].value存在且是数组的话 递归调用
        if (arr[i] && typeof arr[i] == "object") {
          if (
            arr[i].value &&
            typeof arr[i].value == "object" &&
            arr[i].value.length
          ) {
            this.handleClearData(arr[i].value);
          } else {
            if (typeof arr[i].value == "number") {
              arr[i].value = 0;
            } else {
              arr[i].value = "";
            }
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.order-detail-table {
  flex: 0.7;
  border-collapse: collapse;
}

.order-detail-table tr td {
  border: 1px solid #e8eaec;
  box-sizing: border-box;
}

.order-detail-table tr td:first-of-type {
  width: 100px;
  text-align: center;
}

.order-detail-table tr td:last-of-type {
  padding: 24px 0 0 20px;
}

.left-detail-content {
  display: inline-block;
  padding-right: 15px;
}

.link-position {
  display: inline-block;
  padding-right: 15px;
  color: #3399ff;
}

.link-position:hover {
  text-decoration: underline;
  cursor: pointer;
}

.link-content {
  color: #3399ff;
}

.link-content:hover {
  text-decoration: underline;
  cursor: pointer;
}

.right-detail-content {
  padding-right: 15px;
  line-height: 20px;
}

.evalute-tag {
  border: 1px solid #e3e3e3;
  padding: 1px 3px;
  border-radius: 5px;
  margin-right: 5px;
}

.invoiceDetailTitle {
  padding-left: 50px;
  line-height: 30px;
  margin-top: 20px;
  font-weight: bold;
}

.detailName {
  width: 135px;
  display: inline-block;
  padding-left: 50px;
  vertical-align: top;
}

.details {
  display: inline-block;
}
</style>
