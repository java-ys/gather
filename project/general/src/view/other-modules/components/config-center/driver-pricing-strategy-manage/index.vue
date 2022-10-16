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
    <Button v-hasAuth="'driver-pricing-strategy-manage-add'" type="primary" @click="showAddModel">
      新增司机定价城市
    </Button>
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
        <Form ref="addForm" :model="addCityForm" :label-width="120" :rules="addRules">
          <FormItem label="行政区类型:" prop="areaType">
            <Select
              v-model="addCityForm.areaType"
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
              filterable
              style="width: 200px"
              @on-change="(value, selectedData) => changeCity(value, selectedData)"
            ></Cascader>
          </FormItem>
          <FormItem v-if="addCityForm.areaType === 2" label="区县:" prop="areaCode">
            <Select
              v-model="addCityForm.areaCode"
              placeholder="请选择区县"
              style="width: 200px"
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
          <!-- <FormItem label="开通业务线:" prop="expandBizLine">
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
          </FormItem> -->
        </Form>
        <div slot="footer">
          <Button v-lazy-click="handleSaveCity" type="primary">确定</Button>
        </div>
      </Modal>
    </div>
    <Modal v-model="openTimeModal" title="请设置开启时间" :mask-closable="false" @on-cancel="onClose">
      <Form v-if="openTimeModal" ref="openForm" :model="openTimeForm" :label-width="120" :rules="openRules">
        <FormItem label="开启时间:" prop="effectiveTime">
          <DatePicker v-model="openTimeForm.effectiveTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请设置时间" :options="openTimeOptions" style="width: 200px" @on-change="getOpenTime"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button v-lazy-click="handleSetTime" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { cpTranslate } from "@/libs/tools";
import { addRules, openRules } from "./index.js";
import { mapActions, mapState } from "vuex";
import {
  getCitys,
  getAreaInfoByCityCode,
  getDriverFareListData,
  addDriverFare,
  driverFareEnable
} from "_o/api/configData.js";
import { typeModuleMap } from "_g/config/status-map";
const titleWidth = 100;
export default {
  name: "express",
  props: {
    tabName: String,
  },
  data() {
    return {
      typeModuleMap,
      inputList: [
        {
          name: "drop-input", // 文本输入框名
          bind_key: "areaType", // 返回数据的key名
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
          filterable: true,
          changeOnSelect: false,
        },
        {
          name: "drop-input", // 文本输入框名
          bind_key: "areaCode", // 返回数据的key名
          placeholder: "请输入",
          dropList: [],
          value: "", // 绑定返回数据
          title: "区县：", // 展示的字段名
          filterable: true,
          titleWidth,
        },
        // {
        //   name: "drop-input", // 文本输入框名
        //   bind_key: "expandBizLine", // 返回数据的key名
        //   dropList: [],
        //   placeholder: "请输入",
        //   value: "", // 绑定返回数据
        //   title: "业务线：", // 展示的字段名
        //   titleWidth,
        // },
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
          key: "areaType",
          render: (h, params) => {
            if (params.row.areaType === 1) return h("span", "市级");
            if (params.row.areaType === 2) return h("span", "区县级");
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
          key: "content",
          ellipsis: true,
          tooltip: true
          // render: (h, { row }) => {
          //   let rowGradeObj =
          //     that.businessGradeList.find((it) => Number(it.value) === row.expandBizLine) || {};
          //   return h("span", rowGradeObj.label || "");
          // },
        },
        {
          title: "开通状态",
          key: "status",
          minWidth: 160,
          render: (h, params) => {
            if (params.row.status === 0) return h("span", "未开通");
            if (params.row.status === 1) return h("span", "已开启");
          },
        },
        {
          title: "开启时间",
          key: "effectiveTime",
          minWidth: 160
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
          key: "updater",
          minWidth: 160,
          render: (h, params) => {
            if (!params.row.updater) return h("span", params.row.creator);
            else return h("span", params.row.updater);
          },
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 180,
          render: (h, params) => {
            return (
              h("div"),
              [
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
                        value: "driver-pricing-strategy-manage-jump",
                      },
                    ],
                    style: {
                      marginLeft: "10px"
                    },
                    on: {
                      click: () => {
                        // if (!params.row.bizTypeList.length && !params.row.webGroupVehicleDtoList.length) {
                        //   this.$Message.error("请先完成该业务线对应的车型等级配置");
                        //   return;
                        // }
                        this.$router.push({
                          name: "driver_pricing_strategy",
                          query: {
                            city: params.row.cityName,
                            province: params.row.provinceName,
                            status: params.row.status,
                            uuid: params.row.uuid,
                            cityId: params.row.cityCode,
                            cityUuid: params.row.cityUuid,
                            areaCode: params.row.areaCode,
                            areaName: params.row.areaName,
                            areaType: params.row.areaType,
                            // expandBizLine: params.row.expandBizLine,
                          },
                        });
                      },
                    },
                  },
                  "定价策略"
                ),
                params.row.status === 1 ?
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
                          value: "driver-pricing-strategy-manage-close",
                        },
                      ],
                      style: {
                        marginLeft: "10px",
                      },
                      on: {
                        click: () => {
                          let info = params.row;
                          this.switchStra(info);
                        },
                      },
                    },
                    "关闭"
                  ) : h(
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
                          value: "driver-pricing-strategy-manage-open",
                        },
                      ],
                      style: {
                        marginLeft: "10px",
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
      openRules,
      searchData: {},
      openTimeModal: false,
      openTimeForm: {},
      currentOpenTarget: null,
      openTimeOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList,
    }),
  },
  async created() {
    this.getSavedCity();
    if(this.inputList[3]?.dropList) {
      this.inputList[3].dropList = this.businessGradeList;
    }
  },
  mounted() {
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
        const {
          areaCode,
          areaType,
          selectedCityL,
          areaNames,
        } = this.addCityForm;
        let data = {
          cityCode: selectedCityL[1],
          areaType,
        };
        if (areaType === 2) {
          data.areaCode = areaCode;
          data.areaName = areaNames;
        }
        this.$Modal.confirm({
          title: "开通城市",
          content: "确认开通吗",
          onOk: () => {
            addDriverFare(data).then((res) => {
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
      getDriverFareListData(data).then((res) => {
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
      if (data.areaType === 1) {
        delete data.areaCode
      }
      this.searchData = res;
      this.$store.commit("changeLoadingFlag", true);
      getDriverFareListData(data).then((res) => {
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
        uuid: info.uuid,
        state: info.status === 0 ? 1 : 0, // 状态(1：开通、0：未开通,-1:删除)
      };
      this.$Modal.confirm({
        title: "提示",
        content:
          info.status === 0 ? "<p>确认开启此城市？</p>" : "<p>确认关闭此城市？</p>",
        onOk: () => {
          if (info.status === 0) {
            this.openTimeModal = true
            this.currentOpenTarget = info
          } else if (info.status === 1) {
            // 关闭
            driverFareEnable(data).then((res) => {
              if (res.data.success) {
                this.$Message.success(res.data.msg);
                this.getList();
                this.getSavedCity();
              } else {
                this.$Message.error(res.data.msg);
              }
            });
          }
        },
      });
    },
    onClose() {
      this.openTimeForm.effectiveTime = null
      this.openTimeModal = false
    },
    async handleSetTime() {
      const res = await this.$refs.openForm.validate();
      if (res) {
        let data = {
          uuid: this.currentOpenTarget.uuid,
          // effectiveTime: this.openTimeForm.effectiveTime,
          state: 1 // 状态(1：开通、0：未开通,-1:删除)
        };
        driverFareEnable(data).then((res) => {
          if (res.data.success) {
            addDriverFare({
              uuid: this.currentOpenTarget.uuid,
              effectiveTime: this.openTimeForm.effectiveTime,
            }).then(res => {
              if (res.data.success) {
                this.$Message.success(res.data.msg);
                this.getList();
                this.getSavedCity();
                this.openTimeModal = false
                this.openTimeForm.effectiveTime = null
              } else {
                this.$Message.error(res.data.msg);
              }
            })
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      } else {
        return
      }
    },
    getOpenTime(val) {
      console.log(val);
      this.openTimeForm.effectiveTime = val
    },
    changeArea(value) {
      this.addCityForm.areaNames = value.label
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
</style>
