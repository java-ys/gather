<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <Button
      v-hasAuth="'app-advertising-add'"
      type="primary"
      @click="handleItem(1)"
    >
      新增广告
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
          v-hasAuth="'app-advertising-detail'"
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
          v-if="params.data.row.auditStatus===1 && params.data.row.status<3 && params.data.row.hasAuth===1"
          v-hasAuth="'app-advertising-update'"
          ghost
          type="success"
          size="small"
          class="tableBtn"
          @click="handleItem(2,params.data.row)"
        >
          编辑
        </Button>
        <Button
          v-if="params.data.row.auditStatus===1 && params.data.row.status<3"
          v-hasAuth="'app-advertising-close'"
          ghost
          type="error"
          size="small"
          @click="closeItem(params.data.row)"
        >
          关闭
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
import { inputList, parColumns } from "./fields";
import addModal from "./components/add-modal"
import {
  axiosAppAdgList,
  axiosAppAdgClose,
} from "_o/api/app-adg";
import { getCommonAppointedCityInAuth } from "_g/api/common.js"
import {  mapState } from "vuex";
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
      businessGradeList: state => state.common.businessGradeList,
      businessProductCarEnum: state => state.common.businessProductCarEnum,
    }),
  },
  watch: {
    businessGradeList: {
      handler: function() {
        this.inputList[5].cascaderList = this.businessGradeList
      },
      immediate: true,
    }
  },
  mounted() {
    /* let adUuid = this.$route.query.uuid,
        adType = this.$route.query.type || 12;
    if (adUuid) {
      this.openAddModal = true;
      this.handleType = 3;
      this.editInfo = {
        uuid: adUuid,
        type: adType
      }
    } */
    this.getCityList()
    this.getTableList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    // 根据产品线获取城市列表
    getCityList() {
      let params = {
        areaType: 1,
        businessLineList: [1, 4, 2, 6, 7]
      }
      getCommonAppointedCityInAuth(params).then(res => {
        let resData = res.data.data || {};
        let list = resData.openAreaConfigDtoList || []
        let transformData = list.map(item => {
          return {
            label: item.city,
            value: item.cityId
          }
        })
        let listCopy = JSON.parse(JSON.stringify(transformData))
        // 新增，只有有全国权限的用户，才能新增全部城市的数据
        if (resData.hasAllCountyAuth === 1) listCopy.unshift({ label: "全部城市", value: "1" })
        // 查询，只要有城市权限，就能看到全部城市的数据
        transformData.length > 0 && transformData.unshift({ label: "全部城市", value: "1" })
        this.inputList[4].dropList = transformData
        this.cityList = listCopy
      })
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData
      };
      this.isLoading = true
      axiosAppAdgList(params).then(res => {
        this.isLoading = false
        let data = res.data.data || {};
        this.tableData = data.list || [];
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
    closeItem(item) {
      let that = this
      this.$Modal.confirm({
        title: "是否确认关闭该广告？",
        onOk() {
          axiosAppAdgClose({ uuid: item.uuid }).then(res => {
            that.$Message.success("关闭成功")
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
