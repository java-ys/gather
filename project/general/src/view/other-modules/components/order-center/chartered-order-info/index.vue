<!-- 包车订单信息 -->
<template>
  <div>
    <!--search S-->
    <div class="order">
      <Row>
        <Form
          class="formQueryStyle"
          inline="inline"
          :model="searchData"
          :label-width="125"
        >
          <FormItem label="城市">
            <Cascader
              v-model="searchData.city"
              :data="cityList"
              style="width: 250px;"
            ></Cascader>
          </FormItem>
          <FormItem label="下单时间">
            <DatePicker
              v-model="searchData.createdTime"
              clearable="clearable"
              placeholder="请输入"
              type="datetimerange"
              style="width:250px"
              @on-change="createdTime"
            >
            </DatePicker>
          </FormItem>
          <FormItem label="订单编号">
            <Input
              v-model="searchData.orderNo"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-if="isShowMore"
            label="乘客ID"
          >
            <Input
              v-model="searchData.passengerId"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-if="isShowMore"
            label="司机ID"
          >
            <Input
              v-model="searchData.actualDriverId"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-if="isShowMore"
            label="车牌号"
          >
            <Input
              v-model="searchData.plateNum"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-if="isShowMore"
            label="车型等级"
          >
            <Select
              v-model="searchData.vehicleLevel"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in carTypeOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="isShowMore"
            label="订单状态"
          >
            <Select
              v-model="searchData.orderStatus"
              style="width:250px"
              clearable
              @on-change="changeOrderStatus"
            >
              <Option
                v-for="item in orderStatusOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="(searchData.orderStatus===2 || searchData.orderStatus===3) && isShowMore"
            label="订单子状态"
          >
            <Select
              v-if="searchData.orderStatus===2"
              v-model="searchData.orderSubStatus"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in childOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
            <Select
              v-if="searchData.orderStatus===3 && isShowMore"
              v-model="searchData.orderSubStatus"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in childOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="searchData.orderStatus===3 && isShowMore"
            label="乘客对司机评价星级"
          >
            <Select
              v-model="searchData.driverStar"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in 5"
                :key="item"
                :value="item"
              >
                {{ item }}星
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem
            v-if="searchData.orderStatus===3 && isShowMore" 
            label="乘客对司机评价标签"
          >
            <Select
              v-model="searchData.driverEvaluteTag" 
              style="width:250px"
              clearable
            >
              <Option
                v-for="(item,index) in tipList"
                :key="index"
                :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem> -->
          <FormItem
            v-if="searchData.orderStatus===3 && isShowMore"
            label="乘客文本评价"
          >
            <Select
              v-model="searchData.estimate"
              style="width:250px"
              clearable
            >
              <Option value="0">
                无
              </Option>
              <Option value="1">
                有
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="searchData.orderStatus===9 && isShowMore"
            label="取消方"
          >
            <Select
              v-model="searchData.cancelCreatorType"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in cancelCreatorTypeOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="searchData.orderStatus===9 && isShowMore"
            label="取消类型"
          >
            <Select
              v-model="searchData.cancelType"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in cancelTypeOpts"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="searchData.orderStatus===9 && isShowMore"
            label="取消原因"
          >
            <!--<Input clearable="clearable" v-model="searchData.cancelReason" style="width:250px"/>-->
            <Select
              v-model="searchData.cancelReason"
              style="width:250px"
            >
              <Option
                v-for="item in cancelReasonList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <div class="query-btn">
              <a
                class="show-more"
                @click="isShowMore = !isShowMore"
              >
                <Icon
                  v-show="isShowMore"
                  type="md-remove"
                />
                <Icon
                  v-show="!isShowMore"
                  type="md-add"
                />
                <span v-show="!isShowMore">查看更多</span>
                <span v-show="isShowMore">收起更多</span>
              </a>
              <Button @click="reset">
                清空
              </Button>
              <Button
                type="primary"
                style="margin-right:20px"
                @click="search"
              >
                查询
              </Button>
            </div>
          </FormItem>
        </Form>
      </Row>
    </div>
    <!--search E-->
    <!-- table S-->
    <div class="table-wrap">
      <a-locale-provider :locale="zhCN">
        <a-table
          v-show="!isTableLoading"
          bordered
          :columns="tableColumns"
          :rowKey="record => record.uuid"
          :dataSource="tableData"
          :pagination="pageData"
          :scroll="{ x: 2015, y: 610 }"
          :locale="locale"
          style="word-break: break-all"
          @change="handlePageChange"
        >
          <span
            slot="action"
            slot-scope="record"
          >
            <Button
              type="success"
              size="small"
              directives="detailDirective"
              ghost
              @click="handleGotoDetail(record)"
            >详情</Button>
          </span>
        </a-table>
      </a-locale-provider>
      <div
        v-show="isTableLoading"
        style="height: 600px"
        class="table-spin-wrap"
      >
        <Spin fix>
          <Icon
            type="ios-loading"
            size="20"
            class="table-spin-icon-load"
          ></Icon>
          <div style="margin-top: 5px;">
            加载中...
          </div>
        </Spin>
      </div>
    </div>
    <!-- table E-->
  </div>
</template>

<script>
import { fields, pageData, optsData } from "./fields";
import { CharteredOrderList } from "_o/api/passenger";
import { getAppointedProvinceCityInAuth } from "_g/api/common";
import { cpTranslate } from "@/libs/tools"
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { cancelReasonList } from "_o/api/company";

export default {
  components: {
    // CustomColumns
  },
  data() {
    return {
      ...pageData,
      ...optsData,
      cityList: [],
      // tipList: [],
      cancelReasonList: [],
      isShow: false, // 是否显示取消框
      isShowMore: false, // 是否显示更多搜索框
      orderId: String,
      resourceId: this.$router.currentRoute.name,
      pagination: {
        showSizeChanger: true
      },
      isTableLoading: false,
      detailDirective: [
        {
          name: "hasAuth",
          value: "order-info-detail"
        }
      ],
      zhCN,
      locale: {
        emptyText: '请输入搜索条件进行查询'
      }
    };
  },
  computed: {
    // 订单子状态
    childOpts() {
      // 行程中
      if (this.searchData.orderStatus === 2) {
        return this.orderChildStatusOpts1
      }
      // 已完成
      else if (this.searchData.orderStatus === 3) {
        return this.orderChildStatusOpts2
      } else {
        return []
      }
    }
  },
  mounted() {
    this.getCharteredCitys()
    this.getTableColumns();
    this.getCancelReasonList()
    let isReload = this.$store.state.cache["order-info"];
    if (isReload) {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = "";
        delete this.searchData[key];
      });
      // this.getList();
      this.$store.commit("switchCacheState", ["order-info", false]);
    } else {
      this.$store.commit("changeLoadingFlag", false);
      // this.tableData.length === 0 && this.getList();
    }
  },
  methods: {
    /* data相关 S */
    // 获取取消原因列表选项
    getCancelReasonList() {
      return cancelReasonList().then(res => {
        const arr = []
        res.data.data.map(item => {
          arr.push({
            label: item.content,
            value: item.content
          })
        })
        this.cancelReasonList = arr
      })
    },
    // // 获取司机标签
    // getTips() {
    //   passengerToDriverLabel().then(res => {
    //     this.tipList = res.data.data.map(res => {
    //       return {
    //         label: res.content,
    //         value: res.content
    //       }
    //     })
    //   })
    // },
    // 获取包车城市下拉选择列表
    getCharteredCitys() {
      let params = {
        areaType: 1,
        businessLineList: [8]
      }
      getAppointedProvinceCityInAuth(params).then(res => {
        let list = cpTranslate(res.data.data, "provinceID", "cityUuid")
        this.cityList = list
      })
    },
    createdTime(value) {
      if (value[0]) {
        this.searchData.orderBeginTime = value[0];
        this.searchData.orderEndTime = value[1];
      } else {
        this.searchData.orderBeginTime = null;
        this.searchData.orderEndTime = null;
      }
    },
    // 订单状态改变清空子状态
    changeOrderStatus() {
      delete this.searchData.orderSubStatus
      delete this.searchData.estimate
      delete this.searchData.driverStar
      delete this.searchData.cancelType
      delete this.searchData.cancelCreatorType
      delete this.searchData.cancelReason
    },
    /* data相关 E */

    /* 列表相关 S */
    getTableColumns() {
      let data = [];
      this.tableColumnsChecked.forEach(col => data.push(fields[col]));
      this.tableColumns = data;
    },
    getList() {
      let params = {
        currPage: this.pageData.current,
        pageSize: this.pageData.pageSize
      };
      if (this.searchData) {
        Object.assign(params, this.searchData);
      }
      delete params.city;
      delete params.createdTime;
      this.isTableLoading = true;
      CharteredOrderList(params).then(res => {
        if (res.data.success) {
          this.pageData.total = res.data.data.totalCount;
          this.tableData.splice(0, this.tableData.length);
          res.data.data.list.forEach(item => {
            this.tableData.push(item);
          });
        }
        if (this.tableData.length === 0) {
          this.locale = {
            emptyText: '暂无数据'
          }
        }
        this.isTableLoading = false;
      });
    },
    search: function () {
      this.searchData.cityUuid = this.searchData.city ? this.searchData.city[1] : ""
      for (let item in this.searchData) {
        if (this.searchData[item] === "" || this.searchData[item] === null) {
          delete this.searchData[item];
        }
      }
      this.pageData.current = 1;
      this.getList();
    },
    reset: function () {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = "";
        delete this.searchData[key];
      });
      this.pageData.current = 1;
      this.getList();
    },
    changePageSize(val) {
      this.pageData.pageSize = val;
      this.getList();
    },
    handlePageChange(pagination, filters, sorter) {
      const pager = { ...this.pageData };
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
      this.pageData = pager;
      this.getList();
    },
    changePage(val) {
      this.pageData.current = val;
      this.getList();
    },
    handleGotoDetail(record) {
      this.$store.commit("ADDWRAPDATA", record)
      sessionStorage.setItem("wrapData", JSON.stringify(record))
      this.$router.push({
        name: "chartered-order-detail",
        params: { id: record.uuid }
      });
    },
    /* 列表相关 E */
  }
};
</script>

<style lang="less">
  .cancleText {
    text-align: center;
    padding: 60px 0;
    font-size: 16px;
  }

  .table-wrap {
    position: relative;

    .ant-table-row:nth-child(2n) td {
      background-color: #f8f8f9;
    }

    .table-spin-wrap {
      position: relative;
      border: 1px solid #e8eaec;
    }

    .table-spin-icon-load {
      animation: ani-table-spin 1s linear infinite;
    }

    @keyframes ani-table-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>
