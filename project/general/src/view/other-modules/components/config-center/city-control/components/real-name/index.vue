<template>
  <div class="top15">
    <SearchList :inputList="inputList" :selectNumber="3" @on-search="search" @on-reset="search"></SearchList>
    <Button type="primary" @click="handleItem(true)">新增</Button>
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
      <template slot="action" slot-scope="params">
        <Button
          v-if="params.data.row.status === 1"
          ghost
          type="success"
          size="small"
          class="tableBtn"
          @click="handleItem(false,params.data.row)"
        >
          编辑
        </Button>
        <Button
          v-if="params.data.row.status === 1"
          ghost
          type="error"
          size="small"
          class="tableBtn"
          @click="stopItem(params.data.row)"
        >
          停用
        </Button>
      </template>
    </m2-table>
    <add-modal
      :show="openAddModal"
      :isNew="isNew"
      :editInfo="editInfo"
      @close="closeAddModal"
    >
    </add-modal>
  </div>
</template>
<script>
import m2Table from "_a/m2-table/v-table";
import addModal  from "./components/add-modal.vue";
import { parColumns, inputList } from "./fields";
import { axiosRealNameList, axiosRealNameUpdateStatus } from "_g/api/openCity"
import { mapState } from "vuex";
export default {
  name: "real-name",
  components: {
    m2Table,
    addModal
  },
  props: {
    isRealName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      parColumns:parColumns(this),
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      openAddModal: false,
      searchData: {},
      editInfo: {},
      isLoading: false,
      isNew: true
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
      businessGradeList: (state) => state.common.businessGradeList
    }),
    paramsInfo() {
      return {
        cityCode: this.$route.query.cityId,
        // businessLine: this.$route.query.expandBizLine
        //  原接口businessLine指产品线，expandBizLine位业务线 无法匹配，先传空查全部，待后续迭代版本优化。
      }
    }
  },
  created(){
    this.inputList[0].dropList = this.businessGradeList
    this.inputList[1].dropList = this.bizTypeList
  },
  watch:{
    businessGradeList(val) {
      this.inputList[0].dropList = val
      this.inputList[1].dropList = this.bizTypeList
    }
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    updatePage() {
      this.inputList.forEach(item => {
        item.value = ""
      })
      this.search({})
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current,
        ...this.searchData,
        ...this.paramsInfo
      };
      this.isLoading = true
      axiosRealNameList(params).then(res => {
        let data = res.data.data || {}
        this.tableData = data.list || []
        this.total = data.totalCount || 0
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.tableData = []
        this.total = 0
      })
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    formReset(name = "addForm") {
      this.$refs[name].resetFields();
    },
    // 1-新建，2-编辑
    handleItem(isNew, item) {
      this.isNew = isNew;
      this.editInfo = item || {}
      this.openAddModal = true;
    },
    stopItem(item) {
      let that = this
      this.$Modal.confirm({
        title: "确认",
        content: "<p>停用后将不可再次启用或者编辑，是否确定停用？</p>",
        onOk() {
          axiosRealNameUpdateStatus({ uuid: item.uuid }).then(res => {
            that.$Message.success("停用成功");
            that.getTableList();
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
<style lang="less">
  .ivu-tooltip.lang-val{
    .ivu-tooltip-rel span{
      text-overflow:ellipsis;
      white-space:nowrap;
      display: inline-block;
      overflow:hidden;
      max-width: 226px;
    }
  }
</style>