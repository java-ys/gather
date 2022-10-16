<template>
  <div>
    <searchList
      :inputList="inputDataList"
      @on-search="queryList"
      @on-reset="handelReset"
      @cascade-change="handleCascadeChange"
      @clear-cascade="handleClearCascade"
    ></searchList>
    <Button
      type="primary"
      @click="addNew"
    >
      新建策略
    </Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      class="top10"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <modal
      v-model="restModal"
      :title="restTitle"
      width="75%"
      :loading="modalLoading"
      :mask-closable="false"
      :footer-hide="restDisabled"
      @on-cancel="handleResetRest"
      @on-ok="handleConfirmRest"
    >
      <div class="forceRest_wrap">
        <Form
          ref="restForm"
          :model="restModelData"
          :rules="restRules"
          :label-width="100"
        >
          <div class="restline rowline">
            <FormItem
              label="策略名称"
              prop="ruleName"
              class="ruleName"
              required
            >
              <Input
                v-model="restModelData.ruleName"
                :disabled="restDisabled"
                placeholder="请输入策略名称"
                style="width: 200px"
              />
            </FormItem>
            <FormItem
              label="城市"
              prop="cityUuid"
              class="cityUuid"
              required
            >
              <Cascader
                v-model="restModelData.cityUuid"
                trigger="hover"
                class="search-input"
                placeholder="请选择城市"
                style="width: 200px"
                :data="cityList"
                filterable
                changeOnSelect
                :disabled="restDisabled || !!restModelUuid"
                @on-change="editCascaderChange"
                @on-clear="clearCascader"
              />
            </FormItem>
            <FormItem
              label="生效时间"
              prop="effectiveTime"
              class="effectiveTime"
              required
            >
              <DatePicker
                v-model="restModelData.effectiveTime"
                :disabled="restDisabled"
                type="datetime"
                placeholder="请选择生效时间"
                style="width: 200px"
              />
            </FormItem>
          </div>
          <div class="forceRest_wrap_inner">
            <p class="modal-p-title">
              <span class="red">*</span>短时策略
            </p>
            <div class="restline">
              <span style="margin-right: 8px;">
                累计服务时长满
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servOfflineQuota"
              >
                <Input
                  v-model="restModelData.servOfflineQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时，则强制下线
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servOfflineDura"
              >
                <Input
                  v-model="restModelData.servOfflineDura"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                分钟。
              </span>
            </div>
            <div class="restline">
              <span style="margin-right: 8px;">
                累计服务时长满
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servAlarmQuota"
              >
                <Input
                  v-model="restModelData.servAlarmQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时，则每
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servAlarmInterval"
              >
                <Input
                  v-model="restModelData.servAlarmInterval"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>                <span style="margin-left: 8px;">
                分钟推送一次强制下线提醒，共计推送
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servAlarmTimes"
              >
                <Input
                  v-model="restModelData.servAlarmTimes"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                次
              </span>
            </div>
            <div class="restline">
              <span style="margin-right: 8px;">
                服务间隔时长满
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="servResetQuota"
              >
                <Input
                  v-model="restModelData.servResetQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                分钟，累计服务时长重新计算。
              </span>
            </div>
            <br />
            <p class="modal-p-title">
              <span class="red">*</span>长时策略
            </p>
            <div class="restline">
              <span style="margin-right: 8px;">
                累计计费时长满
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="chargeOfflineQuota"
              >
                <Input
                  v-model="restModelData.chargeOfflineQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时，则强制下线
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="chargeOfflineDura"
              >
                <Input
                  v-model="restModelData.chargeOfflineDura"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时。
              </span>
            </div>
            <div class="restline">
              <span style="margin-right: 8px;">
                单次下线时间满
              </span>
              <FormItem
                label=""
                :label-width="0"
                prop="chargeResetQuota"
              >
                <Input
                  v-model="restModelData.chargeResetQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数分钟数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时，累计计费时长重新计算。
              </span>
            </div>
            <p class="modal-p-title">
              <span class="red">*</span>周策略
            </p>
            <div class="restline">
              <span style="margin-right: 8px;">
                当周累计计费时长满
              </span>
              <FormItem
                label=""
                prop="weekOfflineQuota"
                :label-width="0"
              >
                <Input
                  v-model="restModelData.weekOfflineQuota"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                小时，则当周强制下线。强制下线前
              </span><FormItem
              label=""
              prop="weekOfflineDura"
              :label-width="0"
            >
                <Input
                  v-model="restModelData.weekOfflineDura"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                分钟，系统推送强制下线提醒。
              </span>
            </div>
            <p class="modal-p-title">
              <span class="red">*</span>预约单冲突策略
            </p>
            <div class="restline">
              <span style="margin-right: 8px;">
                如司机有预约用车时间在未来
              </span><FormItem
              label=""
              prop="reserveThreVal"
              :label-width="0"
            >
                <Input
                  v-model="restModelData.reserveThreVal"
                  :disabled="restDisabled"
                  placeholder="请输入整数"
                  style="width: 100px"
                />
              </FormItem>
              <span style="margin-left: 8px;">
                分钟内的预约单，则不强制下线。
              </span>
            </div>
          </div>
        </Form>
      </div>
    </modal>
  </div>
</template>

<script type="text/jsx">
import {
  axiosRestAdd,
  axiosRestUpdate,
  getRest as getRestApi,
  getRestListData
} from "_o/api/configData";
import VTable from "_a/v-table/v-table"
import {
  getProvinceCityList as getProvinceCityListApi
} from "_g/api/common";
import {
  cpTranslate
} from "@/libs/tools";
import moment from "moment";
import { REST_DETAIL_DEFAULT, REST_STATUS_MAP, inputDataList, restRules } from "./restMap";
// import restModal from "./restModal";

/**
 * @Desc: m2-web-general
 * @Author: zhangke
 * @CreateTime: 2020/5/22 20:11
 */
export default {
  name: "forceRest",
  components: {
    VTable,
    // todo 拆分出modal框
    // restModal
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cityList: [],
      restDisabled: false,
      tableColumns: [],
      tableData: [],
      pageObj: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      modalLoading: true,
      isLoading: false,
      searchCityUuid: "",
      inputDataList,
      restModal: false,
      restTitle: "强制休息",
      restModelData: JSON.parse(JSON.stringify(REST_DETAIL_DEFAULT)),
      restModelUuid: "",
      restModelDataCityUuid: "",
      restModelOriginStatus: "",
      restRules
    }
  },
  watch: {
    active(value) {
      if (value) {
        if (!this.searchData) {
          this.searchData = {};
        }
        this.getRestList();
      }
    }
  },
  created() {
    this.tableColumns.push(...this.getTableCol());
  },
  mounted() {
    getProvinceCityListApi().then(res => {
      let list = cpTranslate(res.data.data);
      this.inputDataList.some(item => {
        if (item.name === "cascader-input") {
          item.cascaderList.push(...list);
          this.cityList.push(...list);
          return true;
        }
        return false;
      })
    });
  },
  methods: {
    getTableCol() {
      return [
        {
          title: "策略名称",
          key: "ruleName"
        }, {
          title: "城市",
          key: "cityName",
        }, {
          title: "生效时间",
          key: "effectiveTime",
        }, {
          title: "状态",
          key: "status",
          render(h, {
            row
          }) {
            return <div>
              {REST_STATUS_MAP[row.status]}
            </div>
          }
        }, {
          title: "创建时间",
          key: "createTime",
        }, {
          title: "创建人",
          key: "creator",
        }, {
          title: "版本号",
          key: "version",
        }, {
          title: "操作",
          key: "edit",
          render: (h, params) => {
            let uuid = params.row.uuid;
            return <div>
              <button
                class="ivu-btn ivu-btn-info ivu-btn-small ivu-btn-ghost tableBtn"
                onClick={() => this.showModal(uuid, 3)}>详情</button>
              <button
                class="ivu-btn ivu-btn-success ivu-btn-small ivu-btn-ghost tableBtn"
                onClick={() => this.showModal(uuid, 2)}>编辑</button>
            </div>;
          },
        }
      ];
      // if (keyArr && keyArr instanceof Array) {
      //   originCol = originCol.filter(item => keyArr.indexOf(item) !== -1);
      // }
      // return originCol;
    },
    /**
     * 显示弹框
     * @param uuid 该条数据的uuid
     * @param type 打开的类型，1表示新增，2表示编辑，3表示查看
     */
    showModal(uuid, type) {
      this.restModelUuid = uuid;
      if (uuid) {
        this.restModelUuid = uuid;
        this.getRest();
      } else {
        this.restModelUuid = "";
        this.restModal = true;
      }
      if (type === 3) {
        this.restTitle = "查看策略";
        this.restDisabled = true;
      } else if (type === 2) {
        this.restDisabled = false;
        this.restTitle = "编辑策略";
      } else {
        // 默认都为新增
        this.restDisabled = false;
        this.restTitle = "新增策略";
      }
    },
    addNew() {
      this.showModal("", 1);
    },
    queryList(data) {
      this.searchData = data;
      this.getRestList();
    },
    handelReset() {
      this.searchData = {};
      this.searchCityUuid = "";
      // 清空是否要重新加载列表
      this.getRestList();
    },
    selectObj() {
      console.log(arguments, "selectObj")
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getRestList();
      console.log(val, "changePageSize")
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getRestList();
      console.log(val, "changePage")
    },
    clearCascader() {
      this.restModelData.cityUuid = [];
      this.restModelDataCityUuid = "";
    },
    editCascaderChange(value, selectedData) {
      if (value && value.length) {
        this.restModelDataCityUuid = selectedData[selectedData.length - 1]["cityUuid"];
      } else {
        this.restModelDataCityUuid = "";
      }
    },
    handleCascadeChange(value, selectedData, item) {
      if (value && value.length) {
        this.searchCityUuid = selectedData[selectedData.length - 1]["cityUuid"];
      } else {
        this.searchCityUuid = "";
      }
    },
    handleClearCascade(item) {
      this.searchCityUuid = "";
      console.log(item, "handleClearCascade")
    },
    getRestList() {
      let params = {
        currPage: this.pageObj.current || 1,
        pageSize: this.pageObj.pageSize || 10
      };
      if (this.searchCityUuid) {
        params.cityUuidList = [this.searchCityUuid]
      }
      if (this.searchData.beginTime) {
        params.beginTime = moment(this.searchData.beginTime).format("YYYY-MM-DD")
      }
      if (this.searchData.endTime) {
        params.endTime = moment(this.searchData.endTime).format("YYYY-MM-DD")
      }
      if (this.searchData.ruleName) {
        params.ruleName = this.searchData.ruleName
      }
      if (typeof this.searchData.status !== "undefined") {
        params.status = this.searchData.status;
      }
      console.log(params);
      getRestListData(params).then(res => {
        this.$store.commit("changeLoadingFlag", false);
        if (res.data.success) {
          let data = res.data.data;
          // this.pageObj.current = data.currPage;
          // this.pageObj.pageSize = data.pageSize;
          this.pageObj.total = data.totalCount;
          this.tableData.splice(0);
          if (data && data.list && data.list.length) {
            this.tableData.push(...data.list);
          }
          // console.log(res);
          // uuid   string   唯一标识
          // cityName   String   城市名称
          // effectiveTime   Date   生效时间
          // ruleName   String   规则名称
          // status   Integer   状态 0-未生效；1-已生效；2-已失效
          // createTime   Date   创建时间
          // creator   String   创建人
          // version   String   版本号
        }
      }).catch(err => {
        console.log(err);
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    getRest() {
      getRestApi({
        uuid: this.restModelUuid
      }).then(res => {
        if (res.data.success) {
          this.restModal = true;
          const resData = res.data.data || {}
          Object.keys(REST_DETAIL_DEFAULT).forEach(item => {
            if (item === "cityUuid") {
              // 城市需要特殊处理
              let cityUuid = resData[item];
              this.restModelDataCityUuid = cityUuid;
              this.cityList.some(city => {
                if (city.nodes && city.nodes.length) {
                  return city.nodes.some(item => {
                    if (item.cityUuid === cityUuid) {
                      this.restModelData.cityUuid.push(item.provinceID);
                      this.restModelData.cityUuid.push(item.cityID);
                      return true;
                    }
                  });
                }

                return false;
              })
              return;
            }
            this.restModelData[item] = resData[item];
          });
          this.restModelUuid = resData.uuid;
        } else {
          this.$Message.error(res.data.msg || "出错")
        }
      })
    },
    handleConfirmRest() {
      this.$refs["restForm"].validate(valid => {
        console.log("form valid", valid)
        // 增加一些特殊的校验，例如cityUuid是否选中到城市
        if (this.restModelData.cityUuid && this.restModelData.cityUuid.length < 2) {
          this.$Message.error("请选择正确的城市");
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          return false;
        }
        if (this.restModelData.servAlarmQuota - this.restModelData.servOfflineQuota >= 0) {
          this.$Message.error("短时策略中，触发提醒的小时数必须小于触发强制下线的小时数。");
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          return false;
        }
        if (this.restModelData.servAlarmInterval * this.restModelData.servAlarmTimes >= (this.restModelData.servOfflineQuota - this.restModelData.servAlarmQuota) * 60) {
          this.$Message.error("短时策略中，“提醒间隔分钟*提醒次数”必须小于“触发强制下线的小时数-触发提醒的小时数");
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          return false;
        }
        if (this.restModelData.servOfflineDura - this.restModelData.servResetQuota < 0) {
          this.$Message.error("短时策略中，强制下线时间需大于服务时长重新计算时间");
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          return false;
        }
        if (this.restModelData.chargeOfflineDura - this.restModelData.chargeResetQuota < 0) {
          this.$Message.error("长时策略中，强制下线时间需大于计费时长重新计算时间");
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          return false;
        }

        console.log(this.restModelData);
        if (valid) {
          let requestApi = axiosRestAdd
          let requestParams = {
            ...this.restModelData
          }
          requestParams.cityUuid = this.restModelDataCityUuid;
          requestParams.effectiveTime = moment(requestParams.effectiveTime).format("YYYY-MM-DD HH:mm:ss")
          console.log(requestParams.effectiveTime);
          if (this.restModelUuid) {
            requestApi = axiosRestUpdate;
            requestParams["uuid"] = this.restModelUuid;
          }
          requestApi(requestParams).then(res => {
            if (res.status === 200 && res.data.success) {
              this.getRestList(this.searchData);
              this.$Message.success("策略" + (this.restModelUuid ? "编辑" : "新增") + "成功");
              this.restModal = false;
              this.handleResetRest();
            } else {
              this.modalLoading = false;
              this.$nextTick(() => {
                this.modalLoading = true;
              })
              this.$Message.error(res.data.msg || "操作失败")
            }
          }).catch(err => {
            console.log(err);
            this.modalLoading = false;
            this.$nextTick(() => {
              this.modalLoading = true;
            })
          });
        } else {
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          // 如果是特殊规则校验失败，则优先展示特殊规则校验的问题。
          this.$Message.error("数据填写不正确，请检查");
        }
      })
    },
    handleResetRest() {
      console.log("cancel")
      this.$refs["restForm"].resetFields()
      // this.restModelData = null
      this.restModelUuid = "";
      this.restModelDataCityUuid = "";
      Object.keys(REST_DETAIL_DEFAULT).forEach(item => {
        this.restModelData[item] = REST_DETAIL_DEFAULT[item];
      })
      this.restModelData.cityUuid.splice(0);
      // this.restModelData = JSON.parse(JSON.stringify(REST_DETAIL_DEFAULT));
      // this.restModelUuid = ''
    },
  }
}
</script>

<style scoped>

.modal-p-title {
  width: 100px;
  padding-right: 10px;
  text-align: right;
}

.modal-p-title .red {
  color: red;
  font-weight: bold;
}

.forceRest_wrap_inner .ivu-form-item {
  display: inline-block;
}

.forceRest_wrap_inner .restline {
  line-height: 34px;
  margin-left: 100px;
}

</style>
