<template>
  <div class="lease-project">
    <Row>
      <searchList :inputList="inputList" @on-search="handleSearch" @on-reset="reset">
      </searchList>
    </Row>
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
    >
    </VTable>
    <detailModal ref="detailModal" :detailData="detailData"></detailModal>
  </div>
</template>

<script>
import { inputList, parColumns } from "./config";
import VTable from "_a/v-table/v-table.vue";
import detailModal from "./components/detail.vue"
import { declarationQuery, queryAuthCo } from "_o/api/lease"
import { getProvinceCityAllList } from "_g/api/common.js";
export default {
  name: "withhold-declare-manage",
  components: {
    VTable,
    detailModal
  },
  data() {
    return {
      tableData: [],
      current: 1,
      pageSize: 20,
      isLoading: true,
      total: 0,
      parColumns: parColumns(this),
      inputList,
      type: 0, // 0 新增 1编辑
      detailData: {},
      authCoList: [],
      allCityList: []
    }
  },
  mounted() {
    this.init()
  },
 methods:{
    init() {
        this.getCityList();
    this.queryAuthCo();
      this.getList()
    },
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
          if (item.bind_key === "cityCode") {
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
    getList(val) {
      let params = {
        pageNum: this.current,
        pageSize: this.pageSize
      }
      params = Object.assign(params, val)
      console.log(params)
      declarationQuery(params).then(res => {
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

