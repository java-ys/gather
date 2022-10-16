<!--
 * @Descritption:
 * @Author: lvzhiyang
 * @Date: 2019-10-31 21:13:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-01 15:26:48
 -->
<!--操作页面主体-->
<template>
  <div class="package-manage">
    <Tabs v-model="tabType" type="line" @on-click="changeTab">
      <TabPane label="乘客套餐管理" name="1"></TabPane>
      <TabPane label="司机包车定价管理" name="2"></TabPane>
    </Tabs>
    <SearchList
      :inputList="PackageInputList"
      @on-search="search"
      @on-reset="reset"
    ></SearchList>
    <Button type="primary" @click="popView('add', {})">{{addBtnText}}</Button>
    <div style="display: flex; margin-top: 16px">
      <Card class="operation-left">
        <p class="city-name">{{params.cityName}}</p>
        <p class="province-name">{{params.provinceName}}</p>
        <p class="city-name" style="margin-top: 50px">包车</p>
        <p class="province-name">{{openStatusMap[params.openStatus]}}</p>
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
        <template slot="index" slot-scope="params">
          <span>{{(current - 1) * pageSize + params.data.index + 1}}</span>
        </template>
        <template slot="action" slot-scope="params">
          <Button
            ghost
            type="warning"
            size="small"
            style="margin-right: 15px"
            @click="popView('detail', params)"
          >
            详情
          </Button>
          <Button
            v-if="
              params.data.row.status === 1 &&
                +tabType === 2 &&
                !params.data.row.stopStrategyFlag
            "
            ghost
            type="error"
            size="small"
            @click="stop(params)"
          >
            停用
          </Button>
          <Button
            v-if="params.data.row.status === 0 && +tabType === 2"
            ghost
            type="error"
            size="small"
            @click="remove(params)"
          >
            删除
          </Button>
        </template>
      </VTable>
    </div>
    <Modal
      v-model="popPackageViewStatus"
      :closable="false"
      :mask-closable="false"
      :width="620"
      :title="popPackageViewTitle"
      :on-cancel="reset"
    >
      <UpdatePackage
        v-model="popPackageViewStatus"
        :parentParams="params"
        @on-confirm="confirm"
      >
      </UpdatePackage>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="popDriverPackageViewStatus"
      :width="800"
      :mask-closable="false"
      :title="popDriverPackageViewTitle"
      footer-hide
    >
      <UpdateDriverPackage
        v-model="popDriverPackageViewStatus"
        :parentParams="params"
        @on-confirm="confirm"
      >
      </UpdateDriverPackage>
    </Modal>
  </div>
</template>

<script>
import { packageDriverInputList, openStatusMap, PackageColumns, PackageDriverColumns, PackageInputList } from "./index"
import {
  queryPackageList,
  queryPackageDriverList,
  deletePackageDriverStrategy, stopPackageDriverStrategy
} from "_g/api/openCity"
import UpdatePackage from "./components/update-package.vue"
import UpdateDriverPackage from "./components/update-package-driver.vue"
import { mapState } from "vuex"

export default {
  components: {
    UpdatePackage,      // 新建套餐/详情弹窗
    UpdateDriverPackage // 新增司机包车定价/详情弹窗
  },
  data() {
    return {
      hackReset: false,
      PackageInputList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      searchParams: {},
      columns: [],
      tableData: [],
      tabType: "1",       // 1: 包车套餐
      /*
				 * 新增/详情所要的参数
				 */
      params: {},
      addBtnText: "",                 // 新增按钮的文字
      popPackageViewStatus: false,       // 弹出套餐新建/详情弹窗
      popDriverPackageViewStatus: false,       // 弹出司机定价占比新建/详情弹窗
      popPackageViewTitle: "",           // 套餐弹窗标题
      popDriverPackageViewTitle: "",     // 司机定价占比弹窗标题
      openStatusMap,
      PackageColumns: [],
      PackageDriverColumns,
    }
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    })
  },
  watch: {
    "$route.query.uuid"() {
      this.tabType = this.$route.query.tabType
      this.init()
    }
  },
  mounted() {
    this.tabType = this.$route.query.tabType
    this.init()
  },
  methods: {
    init() {
      this.current = 1
      this.pageSize = 10
      this.searchParams = {}
      this.params.cityName = this.$route.query.city
      this.params.provinceName = this.$route.query.province
      this.params.openStatus = this.$route.query.status
      this.params.cityUuid = this.$route.query.cityUuid
      this.params.areaCode = this.$route.query.cityId
      if (this.tabType === "1") {
        this.columns = [...PackageColumns]
        this.addBtnText = "新建套餐"
        this.params.addViewStatus = true
        this.PackageInputList = JSON.parse(JSON.stringify(PackageInputList))
        this.bizTypeList.forEach(v => {
          v.children = v.children.map(vv => {
            return {
              ...vv,
              label: vv.vehicleName,
              value: vv.vehicleLevel,
            }
          })
        });
        this.PackageInputList[1].cascaderList = this.bizTypeList
      } else if (this.tabType === "2") {
        this.columns = [...PackageDriverColumns]
        this.addBtnText = "新建司机包车定价占比"
        this.params.addViewStatus = true
        this.PackageInputList = JSON.parse(JSON.stringify(packageDriverInputList))
      }
      this.getTableList()
    },
    changeTab(name) {
      this.init()
    },
    stop(params) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要停用该策略吗？</p>",
        onOk: () => {
          if (this.tabType === "2") {
            stopPackageDriverStrategy({ uuid: params.data.row.uuid }).then(res => {
              this.$Message.success("停用成功")
              this.getTableList()
            })
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
            if (this.tabType === "2") {
              deletePackageDriverStrategy({ uuid: params.data.row.uuid }).then(res => {
                this.$Message.success("删除成功")
                this.getTableList();
              })
            }
          }
        }
      })
    },
    popView(type, params) {
      this.params.wrapUuid = params.data && params.data.row && params.data.row.wrapUuid || null
      this.params.detailUuid = params.data && params.data.row && params.data.row.uuid || null
      if (this.tabType === "1") {
        this.hackReset = true
        this.popPackageViewStatus = true      // 弹出套餐弹窗
        if (type === "add") {
          this.params.addViewStatus = true
          this.popPackageViewTitle = "新增套餐"
        } else {
          this.params.addViewStatus = false
          this.popPackageViewTitle = "套餐详情"
        }
      } else if (this.tabType === "2") {
        this.hackReset = true
        this.popDriverPackageViewStatus = true      // 弹出套餐弹窗
        if (type === "add") {
          this.params.addViewStatus = true
          this.popDriverPackageViewTitle = "新增司机包车定价占比"
        } else {
          this.params.addViewStatus = false
          this.popDriverPackageViewTitle = "司机包车定价占比详情"
        }
      }
    },
    getTableList() {
      let params = { ...this.searchParams }
      // params = Object.assign(params, this.params)
      params.cityUuid = this.params.cityUuid
      params.pageSize = this.pageSize
      params.currPage = this.current
      this.$store.commit("changeLoadingFlag", true)
      if (this.tabType === "1") {
        queryPackageList(params).then(res => {
          let data = res.data.data || []
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.list || []
          this.total = data.list && data.totalCount || 0
        }).catch(() => {
        })
      } else {
        params.extendBizType = 2
        queryPackageDriverList(params).then(res => {
          let data = res.data.data
          this.$store.commit("changeLoadingFlag", false)
          this.tableData = data.list || []
          this.total = data.list && data.list.totalCount || 0
        }).catch(() => {
        })
      }
    },
    search(data) {
      this.current = 1
      this.searchParams = data
      this.getTableList()
    },
    reset(data) {
      this.current = 1
      this.searchParams = data
      this.getTableList()
      this.hackReset = false
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
    }
  }
}
</script>

<style>
.ivu-drawer {
  left: 30%;
}

.city-name {
  font-size: 22px;
  font-weight: bold;
}

.province-name {
  font-size: 16px;
}

.operation-left {
  width: 300px;
  height: 666px;
}
</style>
