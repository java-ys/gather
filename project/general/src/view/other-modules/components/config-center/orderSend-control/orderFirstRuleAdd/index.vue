<template>
  <div>
    <div class="main-form">
      <div class="page_title">
        订单优先级策略
      </div>
      <div class="order_price_form hr pdtb20">
        <Form ref="form" inline="inline" :model="formData" class="topForm">
          <FormItem
            label="规则名称："
            prop="ruleName"
            :label-width="100"
            :rules="orderFirstRules.ruleName"
          >
            <Input v-model="formData.ruleName" :disabled="fromSource !== 1" type="text"></Input>
          </FormItem>
          <br />
          <FormItem
            label="适用城市："
            prop="provinceCityCode"
            :label-width="100"
            :rules="orderFirstRules.provinceCityCode"
          >
            <Cascader
              v-model="formData.provinceCityCode"
              :data="provinceCityList"
              trigger="hover"
              style="width: 200px; display: inline-block"
              :disabled="fromSource !== 1"
              @on-change="handleCityChange"
            ></Cascader>
          </FormItem>
          <br />
          <!-- 区县: 新增是多选，编辑是单选， 后端对多选做了拆分，存多条数据 -->
          <FormItem
            v-if="fromSource === 1"
            label="区县："
            prop="areaCodeList"
            :label-width="100"
            :rules="orderFirstRules.areaCodeList"
          >
            <Select
              v-model="formData.areaCodeList"
              style="width: 200px"
              placeholder="请选择区县"
              multiple
            >
              <Option
                v-for="item in areaList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="fromSource !== 1"
            label="区县："
            prop="areaCode"
            :label-width="100"
            :rules="orderFirstRules.areaCode"
          >
            <Select
              v-model="formData.areaCode"
              disabled
              style="width: 200px"
              placeholder="请选择区县"
            >
              <Option
                v-for="item in areaList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <br />
          <!-- 业务线 -->
          <FormItem
            label="业务线："
            prop="expandBizLine"
            :label-width="100"
            :rules="orderFirstRules.expandBizLine"
          >
            <Select
              v-model="formData.expandBizLine"
              style="width: 200px"
              placeholder="请选择"
              :max-tag-count="1"
              :disabled="fromSource !== 1"
              clearable
              @on-change="changeBusiness"
            >
              <Option
                v-for="item in businessGradeList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <br />
          <FormItem
            label="产品线："
            prop="productLine"
            :label-width="100"
            :rules="orderFirstRules.productLine"
          >
            <Select
              v-if="fromSource === 1"
              v-model="formData.productLine"
              style="width: 200px"
              placeholder="请选择"
              :max-tag-count="1"
              clearable
              @on-change="changeProduct"
            >
              <Option
                v-for="item in productLines"
                :key="item.bizType"
                :value="item.bizType"
              >
                {{item.bizTypeName}}
              </Option>
            </Select>
            <Select
              v-else
              v-model="formData.productLine"
              style="width: 200px"
              placeholder="请选择"
              :max-tag-count="1"
              disabled
              clearable
              @on-change="changeProduct"
            >
              <Option
                v-for="item in bizTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <br />
          <!-- 车型等级 -->
          <!-- 快享车型等级 -->
          <FormItem
            label="车型等级："
            prop="carLevels"
            :label-width="100"
            :rules="orderFirstRules.carLevels"
          >
            <Select
              v-model="formData.carLevels"
              multiple
              style="width:300px"
              placeholder="请选择车型等级"
              :disabled="!formData.productLine || fromSource !== 1"
            >
              <Option
                v-for="item in carLevelList"
                :key="item.vehicleLevel"
                :value="item.vehicleLevel"
              >
                {{item.vehicleName}}
              </Option>
            </Select>
          </FormItem>

          <!-- 车型等级end -->
          <FormItem
            label="订单优先级策略："
            :label-width="120"
            prop="ruleTypeList"
            :rules="orderFirstRules.ruleTypeList"
          >
            <Checkbox-group
              v-model="formData.ruleTypeList"
            >
              <Checkbox :label="11" :disabled="fromSource === 3">订单价值优先级</Checkbox>
              <Checkbox :label="33" :disabled="fromSource === 3">订单来源优先级</Checkbox>
              <Checkbox :label="35" :disabled="fromSource === 3">用户群相对优先派单</Checkbox>
            </Checkbox-group>
          </FormItem>
        </Form>
      </div>
      <!-- 订单价值优先级策略开始 -->
      <div v-show="ruleTypeListHas(11)" class="order_price_form hr pdtb20">
        <Form
          ref="orderPriceform"
          inline="inline"
          :model="orderPriceform"
          class="orderPriceform"
        >
          <div class="sub-title">
            订单价值优先级策略
          </div>
          <div class="button_btn20">
            <Button v-if="fromSource !== 3" type="primary" @click="addOrderPricePriority">
              添加等级策略
            </Button>
          </div>
          <div
            v-for="(item,index) in orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs"
            :key="index"
            class="level_container order_level_container"
          >
            <div class="left">
              <FormItem
                :label="`等级${index + 1}`"
                :prop="
                  'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' +
                    index +
                    '.levelValBegin'
                "
                :rules="orderFirstRules.orderPricePriorityStrategySaveReq.level"
              >
                <Input
                  v-model="
                    orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index]
                      .levelValBegin
                  "
                  placeholder="请输入等级"
                  style="width: 120px"
                  :disabled="fromSource === 3"
                />
                <span>&nbsp;元</span>
              </FormItem>
              <div
                style="line-height: 33px;height: 33px;margin-bottom:18px;margin-left: 5px;margin-right: 5px;"
              >
                -
              </div>
              <FormItem
                label=""
                :prop="
                  'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' + index + '.levelValEnd'
                "
                :rules="orderFirstRules.orderPricePriorityStrategySaveReq.level"
                :disabled="fromSource === 3"
              >
                <Input
                  v-model="
                    orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index]
                      .levelValEnd
                  "
                  placeholder="请输入等级"
                  style="width: 120px"
                  :disabled="fromSource === 3"
                />
                <span>&nbsp;元</span>
              </FormItem>
            </div>
            <div class="right">
              <FormItem
                label="系数："
                :prop="'orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.' + index + '.rate'"
                :rules="orderFirstRules.orderPricePriorityStrategySaveReq.rate"
              >
                <Input
                  v-model="
                    orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs[index].rate
                  "
                  placeholder="请输入系数"
                  style="width: 120px"
                  :disabled="fromSource === 3"
                />
              </FormItem>
              <div
                v-if="index > 0 && fromSource !== 3"
                class="delete_icon"
                @click="removeOrderPriorityHeatLevel(index)"
              >
                <Icon type="ios-remove-circle-outline" />
              </div>
            </div>
          </div>
        </Form>
      </div>
      <!-- 订单价值优先级策略结束 -->
      <!-- 订单来源优先级策略开始 -->
      <div
        v-show="ruleTypeListHas(33)"
        v-if="true"
        class="order_price_form hr pdtb20"
      >
        <div class="sub-title">
          订单来源优先级策略
        </div>
        <div class="button_btn20">
          <Button v-if="fromSource !== 3" type="primary" @click="addOrderPlatform">
            新建渠道策略
          </Button>
        </div>
        <Form
          ref="tripartitePlatform"
          inline="inline"
          :model="tripartitePlatform"
          class="tripartitePlatform"
        >
          <div
            v-for="(item, index) in tripartitePlatform.tripartitePlatformVoList"
            :key="index"
            class="tripartitePlatform_container"
          >
            <div class="orderChannelSets">
              <FormItem
                label="订单渠道："
                :prop="
                  'tripartitePlatformVoList.' + index + '.orderChannelSets'
                "
                :label-width="100"
                :rules="orderFirstRules.orderChannelSets"
              >
                <Select
                  v-model="
                    tripartitePlatform.tripartitePlatformVoList[index].orderChannelSets
                  "
                  style="width: 200px"
                  placeholder="请选择"
                  multiple
                  :max-tag-count="1"
                  :disabled="fromSource === 3"
                >
                  <Option
                    v-for="item in channelOptionsNoAll"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{item.label}}
                  </Option>
                </Select>
              </FormItem>
              <div
                v-if="index > 0"
                class="delete_icon"
                @click="removeOrderChannelSets(index)"
              >
                <Icon type="ios-remove-circle-outline" />
              </div>
            </div>
            <div></div>
            <FormItem
              v-if="isShowWeek"
              label="星期值:"
              :prop="'tripartitePlatformVoList.' + index + '.orderChannelSets'"
              :label-width="100"
            >
              <div class="xqBlock">
                <div class="xq-title">
                  <div
                    v-for="(item, _index) in item.weekFormData"
                    :key="_index"
                    :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
                    @click="checkedWeek(index, _index)"
                  >
                    {{item.weekName}}
                    <Icon
                      v-if="fromSource !== 3"
                      type="md-close-circle"
                      class="closeIcon"
                      size="18"
                      @click="deleteWeek(index, _index)"
                    />
                  </div>
                </div>
                <div v-if="fromSource !== 3" class="xq-content">
                  <Button
                    v-if="fromSource !== 3"
                    :disabled="isCheckedAllWeek()"
                    type="info"
                    :ghost="true"
                    style="margin-right: 5px; margin-left: 5px"
                    @click="initCheckedWeek(1, index)"
                  >
                    添加星期值
                  </Button>
                  <Button
                    v-show="item.weekFormData && item.weekFormData.length > 0"
                    v-if="fromSource !== 3"
                    type="success"
                    :ghost="true"
                    @click="initCheckedWeek(2, index)"
                  >
                    编辑星期值
                  </Button>
                </div>
              </div>
              <div
                v-show="!item.weekFormData || item.weekFormData.length === 0"
                style="color: red"
              >
                请先添加星期值
              </div>
            </FormItem>

            <!--  -->
            <div
              v-for="(itemT, xIndex) in item.weekFormData"
              v-show="itemT.isChecked"
              :key="xIndex"
              class="bottomForm"
            >
              <Form
                v-for="(yItem, yIndex) in itemT.timeDtoList"
                :ref="'weekForm' + yIndex"
                :key="yIndex"
                :model="yItem"
                :rules="orderFirstRules.weekFormValidate"
                :label-width="100"
              >
                <FormItem :label="'时段' + (yIndex + 1) + ':'" prop="periods">
                  <div style="display: flex">
                    <TimePicker
                      v-model="yItem.periods"
                      confirm
                      type="timerange"
                      placement="bottom-start"
                      placeholder="请选择时间段"
                      style="width: 168px"
                      :disabled="fromSource === 3"
                      @on-change="changeTime(index, xIndex, yIndex)"
                    ></TimePicker>
                  </div>
                </FormItem>
                <FormItem
                  label="派单优先级:"
                  prop="coefficient"
                  class="ml-50 dispatchLevel"
                >
                  <div class="dispatchItem" :disabled="fromSource === 3">
                    <div>高</div>
                    <div class="sliderItem">
                      <Slider
                        v-model="yItem.coefficient"
                        :disabled="fromSource === 3"
                        :min="0.1"
                        :max="2.0"
                        :step="0.1"
                      ></Slider>
                    </div>
                    <div>低</div>
                    <span class="sliderTxt">派单系数：{{yItem.coefficient || 0.1}}</span>
                  </div>

                  <span
                    v-if="fromSource !== 3"
                    class="sliderRemove"
                    @click="deleteWeekPeriod(index, xIndex, yIndex)"
                  >删除</span>
                </FormItem>
              </Form>
              <Button
                v-if="fromSource !== 3"
                type="dashed"
                icon="md-add"
                style="margin-left: 70px"
                @click="addDiscountTime(index, xIndex)"
              >
                新增时段
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <!-- 订单来源优先级策略结束 -->
      <!-- 用户群相对优先派单策略 -->
      <div
        v-show="ruleTypeListHas(35)"
        v-if="true"
        class="order_price_form hr pdtb20"
      >
        <div class="sub-title">
          用户群相对优先派单策略
        </div>
        <div class="button_btn20">
          <Button v-if="fromSource !== 3" type="primary" @click="addUserGroup">
            添加用户群策略
          </Button>
        </div>
        <m2-table
          v-if="tableData && tableData.length > 0"
          :isLoading="isLoading"
          :current="current"
          :total="total"
          :pageSize="pageSize"
          :parColumns="columns"
          :isShowPage="false"
          :height="300"
          :parTableData="tableData"
          @changePage="changePage"
          @changePageSize="changePageSize"
        ></m2-table>
      </div>
      <!-- 用户群相对优先 -->
    </div>
    <div v-if="fromSource !== 3" slot="footer" class="footer">
      <Button v-lazy-click="saveData" type="primary">
        确认
      </Button>
      <Button @click="goBack">
        取消
      </Button>
    </div>
    <div v-else slot="footer" class="footer">
      <Button v-lazy-click="goBack" type="primary">
        确认
      </Button>
    </div>
    <checkedWeek ref="checkedWeek" @getWeekData="getWeekData" />
    <userGroup ref="addFlock" @backData="getAddGroupData"></userGroup>
  </div>
</template>

<script>
import {
  orderFirstRules,
  getWeekName,
  getReverseWeekName,
  coefficientArr,
  isAlabo,
  userColumns,
  getCityObjByCityCode,
  getProvinceNameByCityUuid
} from "./fields";
import checkedWeek from "./components/checkedWeek";
import m2Table from "_a/m2-table/v-table";
import userGroup from "./components/userGroup";
import {
  addStrategySave,
  updataStrategy,
  getInfoStrategy,
  getAreaInfoByCityCode
} from "_o/api/configData.js";
import { getWholeRegion, queryChannel } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  name: "add",
  components: {
    checkedWeek,
    m2Table,
    userGroup
  },
  data() {
    return {
      columns: userColumns.columns(this),
      orderFirstRules,
      channelOptionsNoAll: [],
      showModal: false,
      title: "新增策略",
      coefficientArr,
      uuid: "",
      editCityCode: "",
      fromSource: "", // 1.新增 2.编辑 3.详情
      // 简单表单数据
      formData: {
        provinceCityCode: [],
        areaCodeList: [],
        cityCode: "",
        areaCode: "",
        provinceCode: "",
        provinceName: "",
        expandBizLine: "",
        productLine: "",
        carLevels: [],
        ruleTypeList: [] // 三方：33，用户群：35，订单价值：11,
      },
      // 订单价值表单
      orderPriceform: {
        orderPricePriorityStrategySaveReq: {
          priceLevelStrategyReqs: []
        }
      },
      // 订单来源优先级
      tripartitePlatform: {
        tripartitePlatformVoList: []
      },
      // 用户群相对优先策略
      GroupOrderSaveOrUpdateReq: {
        dispatchGroupDtos: []
      },
      formValidate: {
        productline: [{ required: true, message: "必选" }],
        orderChannel: [{ required: true, message: "必选" }],
        provinceCityCode: [{ required: true, message: "必选", type: "array" }],
        provinceCityCodeName: [{ required: true }],
        week: {
          required: true,
          message: ""
        }
      },

      provinceCityList: [],
      isShowWeek: true,
      weekFormData: [],
      // table加载
      isLoading: false,
      current: 1,
      total: 0,
      pageSize: 10,
      // 用户群优先策略序号
      currentIndex: 0,
      formDataValid: false,
      orderPriceformValid: false,
      tripartitePlatformValid: true,
      groupOrderformValid: true,
      carLevelList: [], // 车型等级
      areaList: [], // 区县列表
      productLines: [] // 产品线
    };
  },
  computed: {
    ...mapState({
      gradeInfo: state => state.common.gradeList,
      businessGradeList: (state) => state.common.businessGradeList,
      bizTypeList: (state) => state.common.bizTypeList
    }),
    tableData() {
      if (
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos &&
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.length > 0
      ) {
        let arr = JSON.parse(JSON.stringify(this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos));
        let data = arr.filter(item => {
          if (item.onlineStatus != 2) {
            return item;
          }
        });
        return data;
      } else {
        return [];
      }
    }
  },
  created() {
    this.fromSource = Number(this.$route.query.fromSource);
    this.uuid = this.$route.query.uuid;
    this.getGradeList();
  },
  mounted() {
    this.getDictList();
    this.init();
  },
  methods: {
    ...mapActions(["getGradeList"]),
    getInfoStrategy(params) {
      getInfoStrategy(params).then(res => {
        if (res.data.success) {
          const data = res.data.data;
          this.formData = {
            ruleName: data.ruleName,
            expandBizLine: data.expandBizLine,
            cityCode: data.cityCode,
            areaCode: data.areaCode,
            carLevels: [data.carlevel],
            productLine: data.productLine,
            provinceCityCode: [data.provinceCode, data.cityCode],
            ruleTypeList: data.ruleTypeList
          };
          this.getAreaByCityCode(data.cityCode)
          const product = this.bizTypeList.find(v => v.value === data.productLine)
          this.$nextTick(() => {
            this.carLevelList = product ? product.children || [] : [] // 赋值车型等级
          })
          this.tripartitePlatform = {
            tripartitePlatformVoList: data.tripartitePlatformDto ? data.tripartitePlatformDto : []
          };
          this.orderPriceform = {
            orderPricePriorityStrategySaveReq: {
              uuid: data.orderPriceStrategyStrategyVo?.uuid,
              priceLevelStrategyReqs: data.orderPriceStrategyStrategyVo ? data.orderPriceStrategyStrategyVo.priceLevelStrategyVos : []
            }
          };
          this.GroupOrderSaveOrUpdateReq = {
            dispatchGroupDtos: data.dispatchGroupDtoList
          };
          // 将数字星期值转换成汉字显示
          for (const tripartitePlatformVo of this.tripartitePlatform.tripartitePlatformVoList) {
            for (const contentDto of tripartitePlatformVo.contentDtoList) {
              contentDto.isChecked = false;
            }
            this.$set(tripartitePlatformVo, "weekFormData", tripartitePlatformVo.contentDtoList)
            tripartitePlatformVo.weekFormData[0].isChecked = true;
            tripartitePlatformVo.weekFormData.map((item) => {
              let weekName = "";
              item.weekList = item.weekList.map((yItem, index) => {
                let tempweekName = yItem;
                if (isAlabo(yItem)) {
                  tempweekName = getWeekName(yItem);
                } else {
                  yItem = getReverseWeekName(yItem);
                }
                if (weekName) {
                  weekName = weekName + "、" + tempweekName;
                } else {
                  weekName = tempweekName;
                }
                return yItem;
              });
              // 转换时间
              item.timeDtoList.forEach(yItem => {
                yItem.periods = [yItem.startTime, yItem.endTime];
              });
              item.weekName = weekName;
              return item;
            });
          }
        }
      });
    },
    changePage(page) {},
    changePageSize(pageSize) {},
    addUserGroup() {
      this.$refs.addFlock.init({
        isAdd: true,
        tableData: this.tableData
      });
    },
    getAddGroupData(val) {
      this.$refs.form.validate();
      if (val.flag === "add") {
        delete val.flag;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.push(val);
      } else {
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].groupId =
          val.groupId;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].groupName =
          val.groupName;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[
          this.currentIndex
        ].dispatchWeight = val.dispatchWeight;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].onlineStatus =
          val.onlineStatus;
        this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos[this.currentIndex].nearbyDispatch =
          val.nearbyDispatch;
      }
    },
    goEdit(val) {
      this.currentIndex = val._index;
      val.isHomeEdit = !this.isAdd;
      val.tableData = this.tableData;
      this.$refs.addFlock.init(val);
    },
    deleteItem(val) {
      this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos = this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.map(item => {
        if (
          item.groupId === val.groupId &&
          item.groupName === val.groupName
        ) {
          item.onlineStatus = 2;
        }
        return item;
      });
    },
    ruleTypeListHas(type) {
      const has = this.formData.ruleTypeList.find(i => i === type);
      return has;
    },
    addOrderPricePriority() {
      this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.push({
        levelValBegin: "",
        levelValEnd: "",
        rate: ""
      });
    },
    addOrderPlatform() {
      this.tripartitePlatform.tripartitePlatformVoList.push({
        orderChannelSets: [],
        contentDtoList: [],
        weekFormData: []
      });
    },
    // 移除等级策略表单
    removeOrderPriorityHeatLevel(index) {
      this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs = this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.filter((item, i) => i !== index);
    },

    // 移除订单渠道
    removeOrderChannelSets(index) {
      this.tripartitePlatform.tripartitePlatformVoList = this.tripartitePlatform.tripartitePlatformVoList.filter((item, i) => i !== index);
    },
    // 获取城市数据
    getDictList() {
      getWholeRegion({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list));
          this.provinceCityList = listCopy;
        }
      });
      queryChannel().then(res => {
        if (res.data.success) {
          this.channelOptionsNoAll = res.data.data.map(m => {
            return {
              label: m.sourseName,
              value: m.sourseValue
            }
          })
        }
      });
    },
    deleteWeekPeriod(index, xIndex, yIndex) {
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      weekFormData[xIndex].timeDtoList.splice(yIndex, 1);
    },
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.weekFormData = [];
      this.isShowWeek = true;
      // 新增
      if (this.fromSource === 1) {
        this.title = "新建订单优先级策略";
        this.formData = {
          // uuid: "",
          cityCode: "",
          cityUuid: "",
          provinceCode: "",
          provinceName: "",
          productLine: "",
          carLevels: [],
          ruleTypeList: [] // 三方：33，用户群：35，订单价值：11,
        };
        (this.orderPriceform = {
          orderPricePriorityStrategySaveReq: {
            priceLevelStrategyReqs: []
          }
        });
        this.tripartitePlatform = {
          tripartitePlatformVoList: []
        };
      }
      // 编辑/详情
      else {
        this.title =
          this.fromSource === 2 ? "编辑订单优先级策略" : "订单优先级策略详情";
        this.getInfoStrategy({ uuid: this.uuid });
        this.formData["week"] = 1; // 星期值表单校验
        // 处理老数据问题 TODO
        // if (!val.contentDtoList || val.contentDtoList.length === 0) {
        //   if (this.fromSource === 3) {
        //     this.isShowWeek = false;
        //   }
        //   return;
        // }
      }
    },
    // type 1：保存时同步到BI，2：提交时线上生效
    saveData(type) {
      let formDataValid = false;
      let orderPriceformValid = false;
      let tripartitePlatformValid = true;
      let groupOrderformValid = true;
      const {
        formData,
        orderPriceform,
        tripartitePlatform,
        GroupOrderSaveOrUpdateReq
      } = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          // 星期下面的参数校验
          // let flag = this.weekErrorMessage(this.weekFormData);
          // if (!flag) {
          //   return;
          // }
          // 判断星期值折扣是否填写完整
          formDataValid = true;
          // if (notWeekName) {
          //   this.$Modal.confirm({
          //     title: "确认保存",
          //     content: `未对星期${notWeekName}的折扣明细进行配置，是否保存？`,
          //     cancelText: "再看看",
          //     okText: "确认保存",
          //     closable: true,
          //     onOk: () => {
          //       this.submit();
          //     },
          //     onCancel: () => {}
          //   });
          // } else {
          //   this.submit();
          // }
        }
      });
      if (this.checkedRuleTypeList(11)) {
        this.$refs.orderPriceform.validate(valid => {
          if (valid) {
            orderPriceformValid = true;
          }
        });
        if (this.orderPriceform.orderPricePriorityStrategySaveReq && !this.orderPriceform.orderPricePriorityStrategySaveReq.priceLevelStrategyReqs.length) {
          this.$Message.warning("订单价值优先级策略不能为空")
        }
      } else {
        orderPriceformValid = true;
      }
      if (this.checkedRuleTypeList(33)) {
        this.$refs.tripartitePlatform.validate(valid => {
          if (valid) {
            tripartitePlatformValid = true;
            // 订单来源数据改造
            const params2 = {
              tripartitePlatformVoList: []
            };
            for (const i of tripartitePlatform.tripartitePlatformVoList) {
              let flag = this.weekErrorMessage(i.weekFormData);
              if (!flag) {
                tripartitePlatformValid = false;
                break;
              }
              i.contentDtoList = i.weekFormData.map(item => {
                item.weekList = item.weekList.map(yItem => {
                  if (isAlabo(yItem)) {
                    yItem = getWeekName(yItem);
                  }
                  return yItem;
                });
                return item;
              });
            }
          }
        });
        if (this.tripartitePlatform.tripartitePlatformVoList && !this.tripartitePlatform.tripartitePlatformVoList.length) {
          this.$Message.warning("订单来源优先级策略不能为空")
        }
      } else {
        tripartitePlatformValid = true;
      }
      if (this.checkedRuleTypeList(35)) {
        if (this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos && !this.GroupOrderSaveOrUpdateReq.dispatchGroupDtos.length) {
          this.$Message.warning("用户群相对优先级策略不能为空")
        }
      }
      const { provinceCityCode, ...params1 } = formData;
      if (formData.provinceCityCode[1]) {
        params1.cityCode = this.formData.provinceCityCode[1];
        params1.provinceCode = this.formData.provinceCityCode[0];
        const cityObj = getCityObjByCityCode(params1.provinceCode, params1.cityCode, this.provinceCityList)
        params1.cityName = cityObj.city;
        params1.cityUuid = cityObj.uuid;
        params1.provinceName = getProvinceNameByCityUuid(
          params1.cityCode,
          this.provinceCityList
        );
      } else {
        params1.cityCode = this.formData.provinceCityCode[0];
        params1.provinceCode = this.formData.provinceCityCode[0];
        params1.provinceName = this.formData.provinceCityCode[1];
      }
      // end
      if (
        orderPriceformValid &&
        formDataValid &&
        tripartitePlatformValid &&
        groupOrderformValid
      ) {
        const mainForm = {
          ...params1,
          ...orderPriceform,
          ...tripartitePlatform,
          GroupOrderSaveOrUpdateReq,
        };
        if (this.fromSource === 1) {
          mainForm.GroupOrderSaveOrUpdateReq = GroupOrderSaveOrUpdateReq
        } else {
          mainForm.GroupMemberSaveOrUpdateReq = GroupOrderSaveOrUpdateReq
        }
        this.submit(mainForm);
      }
    },
    checkedRuleTypeList(type) {
      return this.formData.ruleTypeList.includes(type);
    },
    weekErrorMessage(data) {
      let flag = true;
      if (data.length === 0) {
        flag = false;
        this.$Message.warning("请添加星期值");
      } else {
        try {
          data.forEach(item => {
            if (item.timeDtoList.length === 0) {
              flag = false;
              this.$Message.warning("请新增时段");
              throw new Error("errorMsg");
            } else {
              item.timeDtoList.forEach(yItem => {
                if (!yItem.startTime) {
                  flag = false;
                  this.$Message.warning("请选择时段");
                  throw new Error("errorMsg");
                }
                if (!yItem.coefficient) {
                  // flag = false;
                  // this.$Message.warning("请选择系数");
                  // throw new Error("errorMsg");
                  yItem.coefficient = 0.1;
                }
              });
            }
          });
        } catch (e) {
          if (e.message != "errorMsg") {
            throw e;
          }
        }
      }

      return flag;
    },
    // 判断哪些星期没有配置
    checkIsAllWeek() {
      let arr = [];
      let week = [1, 2, 3, 4, 5, 6, 7];
      let weekName = "";
      this.weekFormData.forEach(item => {
        item.weekList.forEach(yItem => {
          arr.push(yItem);
        });
      });
      week = week.filter(item => !arr.some(e => e === item));
      week.forEach(item => {
        if (weekName) {
          weekName = weekName + "、" + getWeekName(item);
        } else {
          weekName = getWeekName(item);
        }
      });
      return weekName;
    },
    formatArrNum(list) {
      // 数字类型数组
      let arr = list.map(item => Number(item));
      return arr;
    },
    formatArrStr(list) {
      // 数字类型数组
      let arr = list.map(item => String(item));
      return arr;
    },
    submit(params) {
      if (this.fromSource === 1) {
        // 新增
        addStrategySave(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
          this.$router.push({
            path: "/configCenter/orderSend_control",
          })
        });
      }
      if (this.fromSource === 2) {
        params.uuid = this.uuid;
        updataStrategy(params).then(res => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);

          this.$router.push({
            path: "/configCenter/orderSend_control",
          })
        });
      }
    },
    goBack() {
      this.$router.push({
        path: "/configCenter/orderSend_control",
      })
    },
    checkedWeek(supIndex, subIndex) {
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        supIndex
      ].weekFormData;
      const newData = weekFormData.map((item, index) => {
        if (index === subIndex) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        return item;
      });
      this.tripartitePlatform.tripartitePlatformVoList[supIndex].weekFormData = newData;
    },
    // 添加折扣时段
    addDiscountTime(index, xIndex) {
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      if (weekFormData[xIndex].timeDtoList.length >= 50) {
        this.$Message.warning("一个星期值区块下最多可添加50个时段");
      } else {
        weekFormData[xIndex].timeDtoList.push({
          // startTime: "",
          // endTime: "",
          // coefficient: "",
          // periods:[]
        });
        weekFormData = JSON.parse(JSON.stringify(weekFormData));
        this.tripartitePlatform.tripartitePlatformVoList[
          index
        ].weekFormData = weekFormData;
      }
    },
    // 删除折扣时段
    deleteDiscountTime(index, yIndex) {
      this.weekFormData[index].timeDtoList.splice(yIndex, 1);
    },
    // 判断是否已经选中了所有星期
    isCheckedAllWeek() {
      let arr = [];
      this.weekFormData.forEach((item, index) => {
        arr = [...arr, ...item.weekList];
      });
      if (arr && arr.length === 7) {
        return true;
      } else {
        return false;
      }
    },
    // 获取星期数据
    getWeekData(val) {
      const index = val.index;
      this.tripartitePlatform.tripartitePlatformVoList[index].weekFormData =
        val.dataSource;
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      if (weekFormData.length === 1) {
        weekFormData[0].isChecked = true;
      }
    },
    // 星期值新增/编辑
    initCheckedWeek(val, index) {
      // 新增
      const weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData;
      if (val === 1) {
        this.$refs.checkedWeek.addWeek({
          weekFormData,
          index
        });
      }
      // 编辑
      else {
        const checkedIndex = weekFormData.findIndex(v => v.isChecked)
        if (checkedIndex > -1) {
          const checktItem = weekFormData[checkedIndex]
          this.$refs.checkedWeek.getEditWeek({
            dataSource: weekFormData,
            currentData: checktItem.weekList.map(v => `${v}`),
            index: index,
            editIndex: checkedIndex
          });
        }
      }
    },
    // 删除星期值
    deleteWeek(index, subIndex) {
      this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData.splice(subIndex, 1);

    },
    changeTime(index, xIndex, yIndex) {
      const weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData;
      let periods = weekFormData[xIndex].timeDtoList[yIndex].periods;
      weekFormData[xIndex].timeDtoList[yIndex].startTime = periods[0];
      weekFormData[xIndex].timeDtoList[yIndex].endTime = periods[1];
    },
    // productLineChange() {
    //   this.formData.carLevels = [];
    // }
    // 城市变更
    handleCityChange(val) {
      const cityCode = val[1]
      this.getAreaByCityCode(cityCode)
    },
    // 获取区县
    async getAreaByCityCode(val) {
      const res = await getAreaInfoByCityCode({ cityCode: val })
      if (res.data.success) {
        // 清空已选值
        this.formData.areaCodeList = []
        const list = res.data.data.map(it => {
          return {
            label: it.orgName,
            value: it.orgCode
          };
        })
        this.$nextTick(() => {
          this.areaList = list
        })
      }

    },
    // 业务线下拉
    changeBusiness(val) {
      const business = this.businessGradeList.find(v => v.value === val)
      this.$nextTick(() => {
        // 清空下级
        this.formData.productLine = ""
        this.formData.carLevels = []
        this.carLevelList = []
        this.productLines = business ? business.children || [] : [] // 赋值车型等级
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.productLines.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.formData.carLevels = []; // 清空下级
        this.carLevelList = product ? product.levels || [] : [] // 赋值车型等级
      })

    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
