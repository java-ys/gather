<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <Button
      v-hasAuth="'trafficLimit-add'"
      type="primary"
      @click="handleItem(1)"
    >
      新增
    </Button>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template
        slot="action"
        slot-scope="params"
      >
        <Button
          v-hasAuth="'trafficLimit-detail'"
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="handleItem(3,params.data.row)"
        >
          详情
        </Button>
        <!-- 数据的所有城市都在权限内，才能编辑 -->
        <Button
          v-hasAuth="'trafficLimit-edit'"
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="handleItem(2,params.data.row)"
        >
          编辑
        </Button>
        <Button
          v-hasAuth="'trafficLimit-delete'"
          ghost
          type="error"
          size="small"
          @click="deleteItem(params.data.row)"
        >
          删除
        </Button>
      </template>
    </m2-table>
    <add-modal
      :show="openAddModal"
      :handleType="handleType"
      :uuid="editInfo.uuid"
      :type="editInfo.type"
      :cityList="cityList"
      @close="closeAddModal"
    >
    </add-modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns, BusinessArr } from "./fields";
import addModal from "./add-modal"
import { mapState, mapGetters } from "vuex"
import {
  axiosTrafficList,
  axiosTrafficDelete,
} from "_o/api/configData.js";
import { getAppointedCityList } from "_g/api/common.js";
import { cpTranslate } from "@/libs/tools"

export default {
  name: "",
  components: {
    m2Table,
    addModal
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: JSON.parse(JSON.stringify(inputList)),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      searchData: {},
      openAddModal: false,
      handleType: 1, // 1-新增，2-编辑，3-详情
      editInfo: "",
      isLoading: true,
      cityList: []
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.getCityList()
    this.getTableList();
    this.inputList[1].dropList = this.bizTypeList
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    // 根据产品线获取城市列表
    getCityList() {
      getAppointedCityList({ businessLineList: BusinessArr }).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        this.inputList[0].dropList = transformData
        this.cityList = transformData
      });
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      this.isLoading = true
      axiosTrafficList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        let list = data.list || [];
        this.tableData = list.map(v => {
          return {
            ...v,
            fenceName: v.trafficRestrictionDto?.fenceName || ""
          }
        })
        this.total = data.totalCount || 0;
      }).catch(err => {
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // type，同 handleType：2-编辑，3-详情
    handleItem(type, item) {
      this.handleType = type
      this.editInfo = item || {}
      this.openAddModal = true
    },
    deleteItem(item) {
      let that = this
      this.$Modal.confirm({
        title: "提示",
        content: "请再次确认要执行该 删除 操作！",
        onOk() {
          axiosTrafficDelete({ uuid: item.uuid }).then(res => {
            that.$Message.success("删除成功")
            that.getTableList()
          });
        }
      });
    },
    closeAddModal(isReload) {
      this.openAddModal = false
      isReload && this.getTableList();
    }
  }
};
</script>
<style scoped lang='less'>
</style>
