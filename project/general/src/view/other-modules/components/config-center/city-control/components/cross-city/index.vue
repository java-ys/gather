<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <p>本页面用以配置司乘两侧跨城费的费用策略。</p>
    <Button class="top15" type="primary" @click="showModal('add', {})">
      新增跨城费策略
    </Button>

    <v-table
      class="top15"
      :currPage="current"
      :total="total"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="params">
        <Button
          ghost
          type="error"
          size="small"
          @click="showModal('edit', params.data.row)"
        >
          编辑
        </Button>
        <Button
          ghost
          type="success"
          size="small"
          @click="showModal('detail', params.data.row)"
        >
          详情
        </Button>
        <Button
          v-if="params.data.row.status === 1"
          size="small"
          @click="stopItem(params.data.row)"
        >
          停用
        </Button>
        <Button
          v-else
          ghost
          type="warning"
          size="small"
          @click="stopItem(params.data.row)"
        >
          启用
        </Button>
      </template>
    </v-table>

    <add-modal
      :show="openAddModal"
      :modalType="modalType"
      :parentParams="parentParams"
      :editInfo="editInfo"
      @close="closeAddModal"
    >
    </add-modal>
  </div>
</template>
<script>
import addModal from "./add-modal.vue";
import { parColumns, carLevelMap } from "./fields";
import {
  crossCityPageQuery,
  crossCityEnable,
  crossCityDisable,
} from "_g/api/openCity";
import { mapState, mapGetters } from "vuex"
export default {
  name: "real-name",
  components: {
    addModal,
  },
  props: {
    parentParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      parColumns: parColumns(this),
      inputList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      openAddModal: false,
      searchData: {},
      editInfo: {},
      isLoading: false,
      modalType: "detail"
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    paramsInfo() {
      return {
        cityCode: this.$route.query.cityId,
        bizType: "", // 产品线
      };
    },
  },
  mounted() {
    this.init()
    this.getTableList();
  },
  methods: {
    init() {
      this.businessGradeList.forEach(v => {
        v.children = v.children.map(vv => {
          const children = vv.levels.map(vvv => {
            return {
              ...vvv,
              value: vvv.vehicleLevel,
              label: vvv.vehicleName
            }
          })
          return {
            ...vv,
            label: vv.bizTypeName,
            value: vv.bizType,
            children: children
          }
        })
      })
      this.inputList = [
        {
          name: "cascader-input",
          bind_key: ["expandBizLine", "bizType", "carLevel"],
          placeholder: "请选择产品线/车型等级",
          value:[this.$route.query.expandBizLine ? Number(this.$route.query.expandBizLine):"","",""], // 绑定返回数据
          cascaderList: this.businessGradeList || [
          ], // 级联列表
          title: "业务线/产品线/车型等级：", // 展示的字段名
          titleWidth: 150,
          changeOnSelect: true,
        }
      ]
      this.searchData = this.$route.query.expandBizLine ? {expandBizLine: Number(this.$route.query.expandBizLine)}: {}
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
        ...this.paramsInfo,
        ...this.searchData
      };
      this.isLoading = true;
      crossCityPageQuery(params).then((res) => {
        let data = res.data.data || {};
        this.tableData = data.list || [];
        this.total = data.totalCount || 0;
        this.isLoading = false;
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
    showModal(type, item) {
      this.modalType = type;
      this.editInfo = item || {};
      this.openAddModal = true;
    },
    stopItem(item) {
      let axiosFun = item.status === 1 ? crossCityDisable : crossCityEnable;
      this.$Modal.confirm({
        title: `是否确认${item.status === 1 ? "停用" : "启用"}该策略？`,
        onOk: () => {
          axiosFun({ uuid: item.uuid }).then((res) => {
            this.$Message.success(`${item.status === 1 ? "停用" : "启用"}成功`);
            this.getTableList();
          });
        },
      });
    },
    closeAddModal(isReload) {
      this.openAddModal = false;
      isReload && this.getTableList();
    }
  },
};
</script>
<style lang="less">
.ivu-tooltip.lang-val {
  .ivu-tooltip-rel span {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    max-width: 226px;
  }
}
</style>
