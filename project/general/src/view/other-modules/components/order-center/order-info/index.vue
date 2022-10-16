<template>
  <div>
    <div class="order">
      <Row>
        <Form
          class="formQueryStyle"
          inline="inline"
          :model="searchData"
          :label-width="135"
        >
          <Col>
          <FormItem label="城市">
            <!-- <Cascader :data="cityData"  style="width:250px" @on-change="selectCity" v-model="citys"></Cascader> -->
            <Select
              v-model="searchData.cityCode"
              style="width:250px"
              placeholder="请选择"
            >
              <Option
                v-for="item in citys"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="下单人姓名">
            <Input
              v-model="searchData.orderOr"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem label="下单人手机号">
            <Input
              v-model="searchData.orderOrPhone"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="订单编号"
          >
            <Input
              v-model="searchData.orderNo"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <!--            <FormItem label="业务类型" v-show="isShowMore">-->
          <!--              <Select v-model="searchData.typeModule" style="width:250px" clearable>-->
          <!--                <Option value="1">出租车</Option>-->
          <!--                <Option value="2">专享</Option>-->
          <!--                &lt;!&ndash; <Option value="3">拼车</Option> &ndash;&gt;-->
          <!--                <Option value="4">快享</Option>-->
          <!--                &lt;!&ndash; <Option value="5">货的</Option> &ndash;&gt;-->
          <!--                &lt;!&ndash; <Option value="6">骑手</Option> &ndash;&gt;-->
          <!--                &lt;!&ndash; <Option value="7">搬家</Option> &ndash;&gt;-->
          <!--              </Select>-->
          <!--            </FormItem>-->
          <FormItem
            v-show="isShowMore"
            label="订单类型"
          >
            <Select
              v-model="searchData.orderType"
              style="width:250px"
              clearable
            >
              <Option value="1">
                实时
              </Option>
              <Option value="2">
                预约
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="车型等级"
          >
            <Select
              v-model="searchData.vehicleLevel"
              style="width:250px"
              clearable
            >
              <Option :value="1">
                快享
              </Option>
              <Option :value="2">
                舒适型
              </Option>
              <Option :value="3">
                行政型
              </Option>
              <Option :value="4">
                商务型
              </Option>
              <Option :value="5">
                尊贵型
              </Option>
              <Option :value="9">
                豪华型
              </Option>
              <Option :value="8">
                自动驾驶
              </Option>
              <Option :value="10">
                惠享
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="车牌号"
          >
            <Input
              v-model="searchData.plateNum"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="司机姓名"
          >
            <Input
              v-model="searchData.driverName"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="司机手机号"
          >
            <Input
              v-model="searchData.driverMobile"
              clearable="clearable"
              style="width:250px"
            />
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="订单状态"
          >
            <Select
              v-model="searchData.orderStatus"
              style="width:250px"
              clearable
            >
              <Option value="0">
                约车中
              </Option>
              <Option value="1">
                预约中
              </Option>
              <Option value="2">
                接乘中
              </Option>
              <Option value="3">
                已抵达接乘地
              </Option>
              <Option value="4">
                载乘中
              </Option>
              <Option value="5">
                已抵达目的地
              </Option>
              <Option value="6">
                待支付
              </Option>
              <Option value="7">
                待评价
              </Option>
              <Option value="8">
                行程结束
              </Option>
              <Option value="9">
                行程取消
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="下单时间"
          >
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

          <FormItem
            v-show="isShowMore"
            label="乘客对司机的评价星级"
          >
            <Select
              v-model="searchData.driverStar"
              style="width:250px"
              clearable
            >
              <Option value="1">
                1星
              </Option>
              <Option value="2">
                2星
              </Option>
              <Option value="3">
                3星
              </Option>
              <Option value="4">
                4星
              </Option>
              <Option value="5">
                5星
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="乘客对司机的评价标签" v-show="isShowMore">
              <Select v-model="searchData.driverEvaluteTag" style="width:250px" clearable>
                <Option v-for="(item, index) in tagList" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem> -->
          <FormItem
            v-show="isShowMore"
            label="乘客文本评价"
          >
            <Select
              v-model="searchData.estimate"
              style="width:250px"
              clearable
            >
              <Option value="1">
                有
              </Option>
              <Option value="0">
                无
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="取消方"
          >
            <Select
              v-model="searchData.cancelCreatorType"
              style="width:250px"
              clearable
            >
              <Option value="1">
                乘客APP
              </Option>
              <Option value="2">
                司机APP
              </Option>
              <Option value="3">
                呼叫中心
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="取消类型"
          >
            <Select
              v-model="searchData.cancelType"
              style="width:250px"
              clearable
            >
              <Option value="0">
                乘客无责取消
              </Option>
              <Option value="1">
                乘客政策免费取消
              </Option>
              <Option value="2">
                乘客使用免费次数取消
              </Option>
              <Option value="3">
                乘客付费取消
              </Option>
              <Option value="4">
                超时自动取消
              </Option>
              <Option value="5">
                客服关闭订单
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-show="isShowMore"
            label="取消原因"
          >
            <Select
              v-model="searchData.cancelReason"
              style="width:250px"
              clearable
            >
              <Option
                v-for="(item, index) in reasons"
                :key="index"
                :value="item"
              >
                {{ item }}
              </Option>
            </Select>
          </FormItem>
          <!-- 新增订单来源筛选 -->
          <FormItem
            v-show="isShowMore"
            label="订单来源"
          >
            <Select
              v-model="searchData.source"
              style="width:250px"
              clearable
            >
              <Option
                v-for="item in sourceList"
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
          </Col>
        </Form>
      </Row>
    </div>
    <!--
    <CustomColumns
      :selectedOriginList='tableColumnsChecked'
      :customList='customList'
      @changeColumns='changeTableTitle'
      @checkedColumns='storeTableHandle'>
    </CustomColumns>
    -->

    <!-- 新table -->
    <div class="table-wrap">
      <a-locale-provider :locale="zhCN">
        <a-table
          v-show="!isTableLoading"
          bordered
          :columns="tableColumns"
          :rowKey="record => record.uuid"
          :dataSource="tableData"
          :pagination="pageData"
          style="word-break: break-all"
          :scroll="{ x: 2620, y: 610 }"
          :locale="locale"
          @change="handlePageChange"
        >
          <span
            slot="action"
            slot-scope="text, record"
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

    <Modal
      v-model="isShow"
      :mask-closable="false"
    >
      <p class="cancleText">
        确定要取消订单吗？
      </p>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          long
          @click="cancel"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { fields, pageData } from "./fields"
import { cpTranslate } from "@/libs/tools";
import { orderList, orderCancel, getCancelReason } from "_o/api/passenger"
import { getPassengerTags } from "_o/api/passenger"
import { getWholeRegion } from "_g/api/common.js";
import {  getAppointedCityInAuth } from "_g/api/common.js"
import {
  sourceList
} from "_g/config/status-map";
// import { getTableTitle, setTableTitle } from '@/api/common.js'
// import CustomColumns from '_a/custom-columns/custom-columns.vue'
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN"

export default {
  components: {
    // CustomColumns
  },
  data() {
    return {
      ...pageData,
      citys: [],
      reasons: [], // 取消原因
      tagList: [], // 乘客评价标签
      isShow: false, // 是否显示取消框
      isShowMore: false, // 是否显示更多搜索框
      orderId: String,
      resourceId: this.$router.currentRoute.name,
      pagination: {
        showSizeChanger: true
      },
      sourceList,
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
    }
  },
  mounted() {
    this.getTableColumns()
    this.getReasonOptions()
    this.getAllCitys()
    // this.getTags()
    let isReload = this.$store.state.cache["order-info"]
    if (isReload) {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = ""
        delete this.searchData[key]
      })
      // this.getList()
      this.$store.commit("switchCacheState", ["order-info", false])
    } else {
      this.$store.commit("changeLoadingFlag", false)
      // this.searchData = {}
      // this.tableData.length === 0 && this.getList()
    }
  },
  methods: {
    // 获取城市
    getAllCitys() {
      let params = {
        areaType: 1,
        businessLineList: [4]
      }
      getAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        this.citys = transformData
      })
    },
    // 获取取消原因
    getReasonOptions() {
      let params = {}
      getCancelReason(params).then(res => {
        let arr = res.data.data.contents
        this.reasons = arr
      })
    },
    // 获取乘客评价标签
    getTags() {
      let params = { businessType: 4 }
      getPassengerTags(params).then(res => {
        let arr = res.data.data.contents
        this.tagList = arr
      })
    },
    // 选择城市
    selectCity(val) {
      this.searchData.cityCode = val[1]
    },
    handleGotoDetail(record) {
      this.$router.push({
        name: "order-detail",
        params: { id: record.uuid }
      })
    },
    search: function () {
      this.searchData.createdTime = this.searchData.createdTime || ["", ""]
      for (let item in this.searchData) {
        if (this.searchData[item] === "" || this.searchData[item] === null) {
          delete this.searchData[item]
        }
      }
      if (this.searchData.createdTime[0] === "" || this.searchData.createdTime[1] === "") {
        delete this.searchData.createdTime
      }
      this.pageData.current = 1
      this.getList()
    },
    reset: function () {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = ""
        delete this.searchData[key]
      })
      this.pageData.current = 1
      this.getList()
    },
    getList() {
      let params = {
        currPage: this.pageData.current,
        pageSize: this.pageData.pageSize,
        // typeModule : 4
        businessType: 4
      }
      if (this.searchData) {
        Object.assign(params, this.searchData)
      }
      this.isTableLoading = true
      // this.$store.commit('changeLoadingFlag', true)
      orderList(params).then(res => {
        if (res.data.success) {
          this.pageData.total = res.data.data.totalCount
          this.tableData.splice(0, this.tableData.length)
          res.data.data.list.forEach(item => {
            this.tableData.push(item)
          })
          // this.tableData = res.data.data.list;
        }
        if (this.tableData.length === 0) {
          this.locale = {
            emptyText: '暂无数据'
          }
        }
        this.isTableLoading = false
        // this.$store.commit('changeLoadingFlag', false)
      })
    },
    // changeTableTitle(data) {
    //   this.tableColumnsChecked = data;
    //   this.getTableColumns();
    // },
    getTableColumns() {
      let data = []
      this.tableColumnsChecked.forEach(col => data.push(fields[col]))
      this.tableColumns = data
    },
    changePageSize(val) {
      this.pageData.pageSize = val
      this.getList()
    },
    handlePageChange(pagination, filters, sorter) {
      const pager = { ...this.pageData }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.pageData = pager
      this.getList()
    },
    changePage(val) {
      this.pageData.current = val
      this.getList()
    },
    createdTime(value) {
      if (value[0]) {
        this.searchData.orderBeginTime = value[0]
        this.searchData.orderEndTime = value[1]
      } else {
        this.searchData.orderBeginTime = null
        this.searchData.orderEndTime = null
      }
    },
    cancel() { // 取消订单
      orderCancel({ orderUuid: this.orderId }).then(res => {
        this.isShow = false
        this.$Message.success("操作成功")
        this.getList()
      })
    }
    /* storeTableHandle(data) {//将选择的表头发送到云端
      let params = {
        resourceId: this.resourceId,
        tableColumns: data
      }
      setTableTitle(params).then(res => {
        if (res.data.success) {
          this.$Message.success('表头设置成功!')
          this.getTableColumns();
        }else {
          let errorMsg=res.data.errorMsg || '表头设置失败！'
          this.$Message.error(errorMsg)
        }
      })
    } */
  }
}
</script>

<style lang="less">
.cancleText{
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
}
.table-wrap {
  position: relative;
  .ant-table-row:nth-child(2n) td{
    background-color: #f8f8f9;
  }

  .table-spin-wrap{
        position: relative;
        border: 1px solid #e8eaec;
    }
    .table-spin-icon-load{
        animation: ani-table-spin 1s linear infinite;
    }
    @keyframes ani-table-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
}
</style>
