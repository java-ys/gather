<!--开通城市内容页面-->
<template>
  <div class="container_box">
    <searchList
      :inputList="inputList"
      :resetTxt="'重置'"
      @on-search="queryList"
      @on-reset="handelReset"
      @cascade-change="cascadeChange"
    ></searchList>
    <div class="flex-row">
      <Button
        v-hasAuth="'opencity-control-add'"
        type="primary"
        @click="showAddModel"
      >
        新增城市
      </Button>
      <p class="label">重要提示：区县级开城出租车和快惠专可能会相互影响，请双方开城团队沟通好后再进行开城操作！</p>
    </div>

    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="cityColumns"
      :parTableData="cityData"
      style="margin-top: 20px"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <div class="addModal">
      <Modal v-model="addModal" title="开通城市" :mask-closable="false">
        <Form
          ref="addForm"
          :model="addCityForm"
          :label-width="120"
          :rules="addRules"
        >
          <FormItem label="行政区类型:" prop="levelType">
            <Select
              v-model="addCityForm.levelType"
              placeholder="请选择行政区类型"
              style="width: 200px"
            >
              <Option :value="1">市级</Option>
              <Option :value="2">区县级</Option>
            </Select>
          </FormItem>
          <FormItem label="城市:" prop="selectedCityL">
            <Cascader
              v-model="addCityForm.selectedCityL"
              trigger="hover"
              placeholder="请选择"
              :data="cityList"
              style="width: 200px"
              @on-change="
                (value, selectedData) => changeCity(value, selectedData)
              "
            ></Cascader>
          </FormItem>
          <FormItem
            v-if="addCityForm.levelType === 2"
            label="区县:"
            prop="areaCode"
          >
            <Select
              v-model="addCityForm.areaCode"
              placeholder="请选择区县"
              style="width: 200px"
              multiple
              label-in-value
              @on-change="changeArea"
            >
              <Option
                v-for="item in currentAreaList"
                :key="item.label"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="开通业务线:" prop="expandBizLine">
            <Select
              v-model="addCityForm.expandBizLine"
              placeholder="请选择业务线"
              style="width: 200px"
            >
              <Option
                v-for="item in businessGradeList"
                :key="item.label"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button v-lazy-click="handleSaveCity" type="primary">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { cpTranslate } from "@/libs/tools";
import { addRules } from "./index.js";
import { mapActions, mapState } from "vuex";
import {
  packageOpenCityStatus,
  getOpencityListData,
  getCitys,
  getAreaInfoByCityCode,
  addOpenCity,
  switchCityStatus,
} from "_o/api/configData.js";
import { typeModuleMap } from "_g/config/status-map";
const titleWidth = 100;
export default {
  name: "open-city-express",
  props: {
    tabName: String,
  },
  data() {
    let that = this;
    return {
      typeModuleMap,
      inputList: [
        {
          name: "drop-input", // 文本输入框名
          bind_key: "levelType", // 返回数据的key名
          placeholder: "请选择行政区类型",
          value: "", // 绑定返回数据
          title: "行政区类型：", // 展示的字段名
          dropList: [
            {
              value: 1,
              label: "市级",
            },
            {
              value: 2,
              label: "区县级",
            },
          ],
          titleWidth,
        },
        {
          name: "cascader-input", // 文本输入框名
          bind_key: ["provinceID", "cityCode"], // 返回数据的key名
          placeholder: "请选择",
          value: [], // 绑定返回数据
          cascaderList: [], // 级联列表
          title: "城市：", // 展示的字段名
          changeOnSelect: false,
        },
        {
          name: "drop-input", // 文本输入框名
          bind_key: "areaCode", // 返回数据的key名
          placeholder: "请输入",
          dropList: [],
          value: "", // 绑定返回数据
          title: "区县：", // 展示的字段名
          titleWidth,
        },
        {
          name: "drop-input", // 文本输入框名
          bind_key: "expandBizLine", // 返回数据的key名
          dropList: [],
          placeholder: "请输入",
          value: "", // 绑定返回数据
          title: "业务线：", // 展示的字段名
          titleWidth,
        },
      ],
      selectedCityL: [],
      currentAreaList: [],
      addModal: false, // 弹出开通城市弹窗
      addCityForm: {
        selectedCityL: [],
      },
      cityColumns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: "行政区域类型",
          minWidth: 120,
          key: "levelType",
          render: (h, params) => {
            if (params.row.levelType === 1) return h("span", "市级");
            if (params.row.levelType === 2) return h("span", "区县级");
          },
        },
        {
          title: "城市",
          minWidth: 160,
          key: "cityName",
        },
        {
          title: "区县",
          minWidth: 160,
          key: "areaName",
        },
        {
          title: "开通业务线",
          minWidth: 160,
          key: "expandBizLine",
          render: (h, { row }) => {
            let rowGradeObj =
              that.businessGradeList.find((it) => Number(it.value) === row.expandBizLine) || {};
            return h("span", rowGradeObj.label || "");
          },
        },
        {
          title: "开通状态",
          key: "openStatus",
          minWidth: 160,
          render: (h, params) => {
            if (params.row.openStatus === 0) return h("span", "未开通");
            if (params.row.openStatus === 1) return h("span", "已开启");
          },
        },
        {
          title: "操作时间",
          key: "updateTime",
          minWidth: 160,
          render: (h, params) => {
            let x = params.row.updateTime;
            x = this.$moment(x).format("YYYY-MM-DD HH:mm:ss");
            return h("span", x);
          },
        },
        {
          title: "操作人",
          key: "updator",
          minWidth: 160,
          render: (h, params) => h("span", params.row.updator || params.row.creator)
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 360,
          render: (h, params) => {
            return (
              h("div"),
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-control-switch",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.openStatus === 1 ? "inline-block" : "none",
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.switchStra(info);
                      },
                    },
                  },
                  "关闭"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-control-switch",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.openStatus === 0 ? "inline-block" : "none",
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.switchStra(info);
                      },
                    },
                  },
                  "开启"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-level",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem("biz_opened", "false");
                        this.$router.push({
                          name: "bizline-vehicle-control",
                          params: {
                            provinceCode: params.row.provinceCode,
                            cityCode: params.row.cityCode,
                            areaCode: params.row.areaCode,
                            expandBizLine: params.row.expandBizLine,
                            levelType: params.row.levelType,
                            from: "opencity",
                            bizTypeList: JSON.stringify(params.row.bizTypeList),
                            carGroups: params.row.webGroupVehicleDtoList.map((v) => v.groupID),
                            webGroupVehicleDtoList:params.row.webGroupVehicleDtoList
                          },
                        });
                      },
                    },
                  },
                  "配置车型等级"
                ),
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       ghost: true,
                //       size: "small"
                //     },
                //     directives: [
                //       {
                //         name: "hasAuth",
                //         value: "opencity-jump-strategy"
                //       }
                //     ],
                //     style: {
                //       marginLeft: "10px",
                //       display: params.row.expandBizLine === 4 ? "none" : "inline-block"
                //     },
                //     on: {
                //       click: () => {
                //         this.$router.push({
                //           name: params.row.expandBizLine === 2 ? "city_package_control" : "city_control_operation",
                //           query: {
                //             city: params.row.cityName,
                //             province: params.row.provinceName,
                //             status: params.row.openStatus,
                //             // businessType: params.row.expandBizLine,
                //             uuid: params.row.uuid,
                //             cityId: params.row.cityCode,
                //             cityUuid: params.row.cityUuid,
                //             areaCode:params.row.areaCode,
                //             areaName:params.row.areaName,
                //             expandBizLine: params.row.expandBizLine
                //           }
                //         });
                //       }
                //     }
                //   },
                //   "配置开城策略"
                // ),
                // h("Button", {
                //   props: {
                //     type: "primary",
                //     ghost: true,
                //     size: "small"
                //   },
                //   directives: [{
                //     name: "hasAuth",
                //     value: "opencity-jump-strategy"
                //   }],
                //   style: {
                //     marginLeft: "10px",
                //     display: (params.row.expandBizLine === 4 || params.row.expandBizLine === 2)? "none" : "inline-block"
                //   },
                //   on: {
                //     click: () => {
                //         if(!params.row.bizTypeList.length){
                //             this.$Message.error('请先完成该业务线对应的车型等级配置')
                //             return
                //         }
                //         this.$router.push({
                //           name: "base-discount",
                //           query: {
                //             expandBizLine: params.row.expandBizLine,
                //             cityId: params.row.cityCode,
                //           }
                //         })
                //     }
                //   }
                // }, "基础折扣"),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name: "strategy_control",
                          query: {
                            expandBizLine: params.row.expandBizLine,
                            cityId: params.row.cityCode,
                          },
                        });
                      },
                    },
                  },
                  "乘客取消策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name: "orderSend_control",
                          query: {
                            expandBizLine: params.row.expandBizLine,
                            cityId: params.row.cityCode,
                            tabName: "dispatch-distance",
                          },
                        });
                      },
                    },
                  },
                  "派单距离管理"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        let href =
                          window.location.origin +
                          "/m2-web-expressAndPrivate/#/safe/drive-safeRule-management";
                        window.open(href, "_blank");
                        // this.$router.push({
                        //   name: "strategy_control",
                        //   query: {
                        //     expandBizLine: params.row.expandBizLine,
                        //     cityId: params.row.cityCode,
                        //     tabName:'dispatch-distance'
                        //   }
                        // })
                      },
                    },
                  },
                  "偏移报警"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name: "strategy_control",
                          query: {
                            expandBizLine: params.row.expandBizLine,
                            cityId: params.row.cityCode,
                            tabName: "timeTab",
                          },
                        });
                      },
                    },
                  },
                  "高峰及夜间时间策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name:
                            params.row.expandBizLine === 2
                              ? "city_package_control"
                              : "city_control_operation",
                          query: {
                            city: params.row.cityName,
                            province: params.row.provinceName,
                            status: params.row.openStatus,
                            // businessType: params.row.expandBizLine,
                            uuid: params.row.uuid,
                            cityId: params.row.cityCode,
                            cityUuid: params.row.cityUuid,
                            areaCode: params.row.areaCode,
                            areaName: params.row.areaName,
                            expandBizLine: params.row.expandBizLine,
                            tabType: "8",
                          },
                        });
                      },
                    },
                  },
                  "异地车辆策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name:
                            params.row.expandBizLine === 2
                              ? "city_package_control"
                              : "city_control_operation",
                          query: {
                            city: params.row.cityName,
                            province: params.row.provinceName,
                            status: params.row.openStatus,
                            // businessType: params.row.expandBizLine,
                            uuid: params.row.uuid,
                            cityId: params.row.cityCode,
                            cityUuid: params.row.cityUuid,
                            areaCode: params.row.areaCode,
                            areaName: params.row.areaName,
                            expandBizLine: params.row.expandBizLine,
                            tabType: "2",
                          },
                        });
                      },
                    },
                  },
                  "坏账策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 4 ||
                        params.row.expandBizLine === 2
                          ? "none"
                          : "inline-block",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name:
                            params.row.expandBizLine === 2
                              ? "city_package_control"
                              : "city_control_operation",
                          query: {
                            city: params.row.cityName,
                            province: params.row.provinceName,
                            status: params.row.openStatus,
                            // businessType: params.row.expandBizLine,
                            uuid: params.row.uuid,
                            cityId: params.row.cityCode,
                            cityUuid: params.row.cityUuid,
                            areaCode: params.row.areaCode,
                            areaName: params.row.areaName,
                            expandBizLine: params.row.expandBizLine,
                            tabType: "7",
                            driverOpenType: params.row.driverOpenType,
                          },
                        });
                      },
                    },
                  },
                  "定价策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      ghost: true,
                      size: "small",
                    },
                    directives: [
                      {
                        name: "hasAuth",
                        value: "opencity-jump-strategy",
                      },
                    ],
                    style: {
                      marginLeft: "10px",
                      display:
                        params.row.expandBizLine === 2
                          ? "inline-block"
                          : "none",
                    },
                    on: {
                      click: () => {
                        if (
                          !params.row.bizTypeList.length &&
                          !params.row.webGroupVehicleDtoList.length
                        ) {
                          this.$Message.error("请先完成该业务线对应的车型等级配置");
                          return;
                        }
                        this.$router.push({
                          name:
                            params.row.expandBizLine === 2
                              ? "city_package_control"
                              : "city_control_operation",
                          query: {
                            city: params.row.cityName,
                            province: params.row.provinceName,
                            status: params.row.openStatus,
                            // businessType: params.row.expandBizLine,
                            uuid: params.row.uuid,
                            cityId: params.row.cityCode,
                            cityUuid: params.row.cityUuid,
                            areaCode: params.row.areaCode,
                            areaName: params.row.areaName,
                            expandBizLine: params.row.expandBizLine,
                            tabType: "1",
                          },
                        });
                      },
                    },
                  },
                  "乘客套餐管理"
                ),
              ]
            );
          },
        },
      ],
      cityData: [],
      totalCount: "",
      pageSize: 10,
      current: 1,
      total: null,
      cityList: [],
      addRules,
      searchData: {},
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList,
    }),
  },
  watch: {
    "$route"() {
      this.getList();
    }
  },
  created() {
    this.getSavedCity();
    this.inputList[3].dropList = this.businessGradeList;
    this.getList();
  },
  methods: {
    ...mapActions(["getBusinessGradeProductList"]),
    showAddModel() {
      this.selectedCityL = []; // 清空绑定的数据
      //   this.$refs.alCascader.select = [] // 清空页面上的展示数据
      this.addCityForm = {
        selectedCityL: [],
      };
      this.addModal = true;
    },
    async handleSaveCity() {
      // 开通城市
      const res = await this.$refs.addForm.validate();
      if (res) {
        const { areaCode, expandBizLine, levelType, selectedCityL, areaNames } =
          this.addCityForm;
        let data = {
          expandBizLine,
          cityCode: selectedCityL[1],
          levelType,
        };
        if (levelType === 2) {
          data.areaCode = areaCode.join(",");
          data.areaName = areaNames.join(",");
        }
        this.$Modal.confirm({
          title: "开通城市",
          content: "确认开通吗",
          onOk: () => {
            addOpenCity(data).then((res) => {
              if (res.data.success) {
                this.$Message.success("开通成功！");
                this.getList();
                this.getSavedCity();
                this.addModal = false;
              } else {
                this.$Message.error(res.data.msg);
              }
            });
          },
        });
      } else {
        return;
      }
    },
    handelReset() {
      // 重置
      this.current = 1;
      this.getList();
    },
    getList() {
      // 获取分页List
      this.$store.commit("changeLoadingFlag", true);
      let data = { currPage: this.current, pageSize: this.pageSize };
      getOpencityListData(data).then((res) => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    getSavedCity() {
      getCitys().then((res) => {
        let list = cpTranslate(res.data.data);
        this.inputList[1].cascaderList = list;
        this.cityList = list;
      });
    },
    cascadeChange(p) {
      if (p && p.length > 1) {
        this.queryArea(p[1], "1");
      }
    },
    changeCity(p) {
      if (p && p.length > 1) {
        this.queryArea(p[1], "2");
      }
    },
    queryArea(val, type) {
      getAreaInfoByCityCode({ cityCode: val }).then((res) => {
        if (res.data.success) {
          const list = res.data.data.map((it) => {
            return {
              label: it.orgName,
              value: it.orgCode,
            };
          });
          type === "1"
            ? (this.inputList[2].dropList = list)
            : (this.currentAreaList = list);
        }
      });
    },
    queryList(res) {
      let data = {
        ...res,
        currPage: this.current,
        pageSize: this.pageSize,
      };
      this.searchData = res;
      this.$store.commit("changeLoadingFlag", true);
      getOpencityListData(data).then((res) => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    changePageSize(val) {
      this.pageSize = val;
      this.queryList(this.searchData);
    },
    changePage(val) {
      this.current = val;
      this.queryList(this.searchData);
    },
    switchStra(info) {
      let data = {
        cityCode: info.cityCode,
        areaCode: info.areaCode,
        expandBizLine: info.expandBizLine,
        levelType: info.levelType,
        openStatus: info.openStatus === 0 ? 1 : 0, // 状态(1：开通、0：未开通,-1:删除)
      };
      this.$Modal.confirm({
        title: "提示",
        content:
          info.openStatus === 0
            ? "<p>确认开启此城市？</p>"
            : "<p>确认关闭此城市？</p>",
        onOk: () => {
          switchCityStatus(data).then((res) => {
            if (res.data.success) {
              this.$Message.success(res.data.msg);
              this.getList();
              this.getSavedCity();
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        },
      });
    },
    changeArea(value) {
      this.addCityForm.areaNames = value.map((it) => it.label);
    },
  },
};
</script>

<style lang="less">
.container_box {
  .mid {
    vertical-align: middle;
  }

  .fl-lt {
    float: left;
  }

  .fakeA {
    color: blueviolet;
  }
}
.flex-row{
  display:flex;
  align-items: center;
  .label{
    padding-left:20px;
    font-size:14px;
    color:red;
  }

}
</style>
