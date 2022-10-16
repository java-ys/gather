<template>
  <div class="lease-project">
    <Row>
      <searchList ref="searchList" :inputList="inputList" @on-search="handleSearch" @on-reset="reset">
        <template slot="extendInput">
          <span
            class="title-name"
            :style="{ width: '100px' }"
          >品牌车系车型：</span>
          <CarLevelCode
            ref="searchCarCode"
            :input-width="380"
            changeImmediate
            @on-change="handleCarLevel"
          >
          </CarLevelCode>
        </template>
      </searchList>
    </Row>
    <export-file
      exportUrl="/api/assets/v1/rentStatementsManager/exportStatements"
      baseUrlKey="_base4Asset"
      exportFileName="对账单导出.xlsx"
      :queryData="searchData"
      btnText="导出"
      style="margin-bottom:20px"
    ></export-file>
    <VTable
      class="staff-table-container"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="getCurrentRowData"
    >
    </VTable>
  </div>
</template>

<script>
import { inputList, parColumns } from "./config";
import VTable from "_a/v-table/v-table.vue";
import { getProvinceCityAllList } from "_g/api/common.js";
import CarLevelCode from "_o/components/operator-center/lease-schema/components/CarLevelCode/CarLevelCode.vue";
import { rentStatementsQuery, queryAuthCo } from "_o/api/lease"
import exportFile from "_a/export-file/exportFile";
export default {
  name: "check-bill-manage",
  components: {
    VTable,
    CarLevelCode,
    exportFile
  },
  data() {
    return {
      tableData: [],
      current: 1,
      pageSize: 10,
      isLoading: false,
      total: 10,
      parColumns: parColumns(this),
      inputList,
      type: 0, // 0 新增 1编辑
      detailData: {},
      authCoList: [],
      allCityList: [],
      searchData: {}
    }
  },
  mounted() {
    this.getCityList();
    this.queryAuthCo();
    this.init()
  },
  methods: {
    // 获取租赁城市
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          this.setAllCityList(res.data.data);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    setAllCityList(data) {
      if (data.length) {
        data.forEach(e => {
          if (e.nodes.length) {
            e.nodes.forEach(ele => {
              this.allCityList.push({
                cityName: ele.city,
                cityCode: ele.cityID
              });
            });
          }
        });
        this.inputList.forEach((item, index) => {
          if (item.bind_key === "cityUuid") {
            item.dropList = this.allCityList.map(it => {
              return {
                value: it.cityCode,
                label: it.cityName
              }
            });
          }
        })
      }
    },
    // 获取资产公司
    queryAuthCo(val) {
      queryAuthCo({
        companyName: val || "",
        currPage: 1,
        pageSize: 100
      }).then(res => {
        if (
          res &&
          res.data &&
          res.data.success &&
          res.data.data.list &&
          res.data.data.list.length
        ) {
          this.authCoList = res.data.data.list;
          this.inputList.forEach((item, index) => {
            if (item.bind_key === "authCo") {
              item.dropList = this.authCoList.map(it => {
                return {
                  value: it.authCo,
                  label: it.companyName
                }
              });
            }
          })
        } else {
          this.authCoList = [];
        }
      });
    },
    init() {
      this.getList()
    },
    getList(val) {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      params = {
        ...params,
        ...val
      }
      this.searchData = params
      rentStatementsQuery(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.list || []
          this.total = res.data.data.totalCount
        }
      })
    },
    handleSearch(val) {
      this.getList(val)
    },
    getDetail(row) {
      this.detailId = row.id
      this.detailData = row
      this.$refs.detailModal.changeShowModal();
    },
    reset() {
      this.$refs.searchCarCode.clearValue()
      this.getList()
    },
    changePage(val) { // 列表换页
      this.current = val;
      this.getList()
    },
    changePageSize(val) { // 设置列表行数
      this.pageSize = val;
      this.getList()
    },
    handleCarLevel(data) {
      data && this.$refs.searchList.selectCarLevel(data)
    },
    getCurrentRowData(row) {
      // 选择列表数据
      let uuids = []
      if (row.length > 0) {
        // eslint-disable-next-line array-callback-return
        row.map(item => {
          uuids.push(item.statementsNo);
        });
      }
      this.searchData.statementsNos = uuids;
    },
  }
}
</script>

<style lang="less" scoped>
.clickFiles,
.clickFiles:hover {
  color: #ff8533;
  border: 1px solid #ff8533;
}
 .addBut{
    background: #FF8533;
    color: #fff;
    margin:10px 0;
 }
</style>

