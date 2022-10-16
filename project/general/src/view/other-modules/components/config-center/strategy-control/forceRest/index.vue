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
          <p class="block-title">基础策略</p>
          <RestWrap :rest-model-data="restModelData"
                    :rest-disabled="restDisabled"
          />
          <p class="block-title">细分司机人群策略<span v-if="!restDisabled" class="add" @click="addRestRule">添加</span></p>
          <p class="tips">可针对细分司机群体做特殊配置，细分人群外司机仍使用基础策略</p>
          <div class="force-rest-detail">
            <div v-for="(item, index) in forceRestList" :key="item.vuekey" class="force-rest-list">
              <p class="block-title">策略{{index + 1}}：<span v-if="!restDisabled" class="remove" @click="removeRestRule">删除</span></p>
              <p class="tips">请勿对相同目标群体配置多条策略</p>
              <Form
                :ref="`restForm_${index}`"
                :model="item"
                :rules="restInfoRules"
                :label-width="100"
                inline
              >
                <FormItem
                  label="司机类型"
                  prop="driverType"
                  class="driverType"
                >
                  <Select
                    v-model="item.driverType"
                    :disabled="restDisabled"
                    multiple
                  >
                    <Option v-for="(item, key) in DriverTypeMap" :key="key" :label="item" :value="key"></Option>
                  </Select>
                </FormItem>
                <FormItem
                  label="司机年龄"
                  prop="ageType"
                  class="ageType"
                >
                  <Select
                    v-model="item.ageType"
                    :disabled="restDisabled"
                    multiple
                    @on-change="(val) => changeAge(val, item)"
                  >
                    <Option v-for="(age, key) in DriverAgeMap" :key="key" :label="age" :value="key"
                            :disabled="item.ageType.indexOf('0') > -1 && key !== '0'"
                    ></Option>
                  </Select>
                </FormItem>
                <RestWrap :rest-model-data="item"
                          :rest-disabled="restDisabled"
                />
              </Form>
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
import {
  REST_DETAIL_DEFAULT,
  REST_STATUS_MAP,
  inputDataList,
  restRules,
  REST_DETAIL_INFO_DEFAULT,
  restInfoRules, DriverTypeMap, DriverAgeMap
} from "./restMap";
import RestWrap from "./resetWrap";
// import restModal from "./restModal";

/**
 * @Desc: m2-web-general
 * @Author: zhangke
 * @CreateTime: 2020/5/22 20:11
 */
export default {
  name: "forceRest",
  components: {
    RestWrap,
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
      restRules,
      restInfoRules: {
        driverType: [{
          required: true,
          type: "array",
          message: "请选择司机类型"
        }],
        ageType: [{
          required: true,
          type: "array",
          message: "请选择年龄类型"
        }],
        ...restInfoRules
      },
      DriverTypeMap,
      DriverAgeMap,
      // 特殊限制策略。
      forceRestList: []
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
    changeAge(val, item) {
      // 如果是不限，则不允许选其余的类型
      if (val && val.indexOf("0") > -1) {
        item.ageType.splice(0)
        item.ageType.push("0")
      }
      // console.log(val)
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
    getRandomKey() {
      return Math.random() * 10000000 + "_random";
    },
    addRestRule() {
      this.forceRestList.push({
        vuekey: this.getRandomKey(),
        ...REST_DETAIL_INFO_DEFAULT,
        driverType: "",
        ageType: ""
      })
    },
    removeRestRule(index) {
      this.forceRestList.splice(index, 1)
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
                  // eslint-disable-next-line max-nested-callbacks
                  return city.nodes.some(item => {
                    if (item.cityUuid === cityUuid) {
                      this.restModelData.cityUuid.push(item.provinceID);
                      this.restModelData.cityUuid.push(item.cityID);
                      return true;
                    }
                    return false;
                  });
                }

                return false;
              })
              return;
            }
            this.restModelData[item] = resData[item];
          });
          this.forceRestList.splice(0);
          if (resData.forceRestList && resData.forceRestList.length) {
            resData.forceRestList.forEach(item => {
              this.forceRestList.push({
                ...item,
                ageType: item.ageType.map(item => String(item)),
                driverType: item.driverType.map(item => String(item)),
                vuekey: this.getRandomKey()
              })
            })
          }
          this.restModelUuid = resData.uuid;
        } else {
          this.$Message.error(res.data.msg || "出错")
        }
      })
    },
    validateAllData(cb) {
      let validAll = true;
      Object.keys(this.$refs).forEach(key => {
        if (key.match("restForm")) {
          let form = this.$refs[key];
          // form 可能为数据
          if (form instanceof Array) {
            form = this.$refs[key][0]
          }
          if (!form) {
            return;
          }
          form.validate(valid => {
            // 只要有一个false，就不需要继续赋值了
            if (validAll) {
              validAll = valid
            }
          })
        }
      });
      if (validAll) {
        validAll = this.validateRestConfig(this.restModelData)
      }
      if (validAll && this.forceRestList.length) {
        validAll = this.forceRestList.some((item, index) => {
          return this.validateRestConfig(item, index)
        })
      }
      cb(validAll)
    },
    validateRestConfig(restConfigData, index) {
      let preText = ""
      if (index !== undefined) {
        preText += "细分策略" + (index + 1) + "："
      }
      console.log(restConfigData)
      if (restConfigData.servAlarmQuota - restConfigData.servOfflineQuota >= 0) {
        this.$Message.error(preText + "短时策略中，触发提醒的小时数必须小于触发强制下线的小时数。");
        this.resetModalLoading();
        return false;
      }
      if (restConfigData.servAlarmInterval * restConfigData.servAlarmTimes >= (restConfigData.servOfflineQuota - restConfigData.servAlarmQuota) * 60) {
        this.$Message.error(preText + "短时策略中，“提醒间隔分钟*提醒次数”必须小于“触发强制下线的小时数-触发提醒的小时数");
        this.resetModalLoading();
        return false;
      }
      if (restConfigData.servOfflineDura - restConfigData.servResetQuota < 0) {
        this.$Message.error(preText + "短时策略中，强制下线时间需大于服务时长重新计算时间");
        this.resetModalLoading();
        return false;
      }
      if (restConfigData.chargeOfflineDura - restConfigData.chargeResetQuota < 0) {
        this.$Message.error(preText + "长时策略中，强制下线时间需大于计费时长重新计算时间");
        this.resetModalLoading();
        return false;
      }
      return true;
    },
    resetModalLoading() {
      this.modalLoading = false;
      this.$nextTick(() => {
        this.modalLoading = true;
      })
    },
    handleConfirmRest() {
      this.validateAllData(valid => {
        // 增加一些特殊的校验，例如cityUuid是否选中到城市
        if (this.restModelData.cityUuid && this.restModelData.cityUuid.length < 2) {
          this.$Message.error("请选择正确的城市");
          this.resetModalLoading();
          return false;
        }
        if (valid) {
          let requestApi = axiosRestAdd
          let requestParams = {
            ...this.restModelData
          }
          requestParams.cityUuid = this.restModelDataCityUuid;
          requestParams.effectiveTime = moment(requestParams.effectiveTime).format("YYYY-MM-DD HH:mm:ss")
          console.log(requestParams.effectiveTime);
          requestParams.forceRestList = this.forceRestList;
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
              this.resetModalLoading();
              this.$Message.error(res.data.msg || "操作失败")
            }
          }).catch(err => {
            console.log(err);
            this.resetModalLoading();
          });
        } else {
          this.resetModalLoading();
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

<style scoped lang="less">
.force-rest-detail {

  .force-rest-list {
    .block-title {
      margin-left: 30px;
    }

    .tips {
      margin-left: 30px;
    }

    .remove {
      float: right;
      color: red;
      font-weight: normal;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.block-title {
  font-weight: bold;
  font-size: 18px;
  color: #333;

  &::before {
    content: " ";
    display: inline-block;
    width: 4px;
    background: #333;
    line-height: 27px;
    height: 27px;
    vertical-align: bottom;
    margin-right: 8px;
  }

  .add {
    float: right;
    color: #00a0e9;
    font-weight: normal;
    font-size: 14px;
    cursor: pointer;
  }
}

.tips {
  font-size: 14px;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  color: #666;
}

.driverType {
  width: 300px;
}

.ageType {
  width: 300px;
}
</style>
