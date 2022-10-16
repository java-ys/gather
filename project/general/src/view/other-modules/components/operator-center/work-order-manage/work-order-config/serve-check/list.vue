<template>
  <div>
    <!-- <searchList
      ref="searchList"
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="handleReset"
    >
    </searchList> -->
    <div class="action">
      <Button v-hasAuth="'serve-check-add'" type="primary" @click="onCreate">新建</Button>
    </div>
    <VTable
      :total="table.total"
      :current="table.pageNum"
      :pageSize="table.pageSize"
      :parColumns="tableColumn"
      :parTableData="tableData"
      @changePage="handleChangePage"
      @changePageSize="handleChangePageSize"
    >
    </VTable>
    <addModal ref="modal" :detailData="detailData" :cityList="cityList" @confirmed="handleModalClose" @update-list="queryList"></addModal>
    <!-- <addModal ref="modal" :type="type" :cityList="cityList" :detailData="detailData" @confirmed="handleModalClose"></addModal> -->
  </div>
</template>

<script>
import { tableColumn } from "./fields";
import addModal from "./index.vue"
import { fetchCityList } from "_o/api/work-order/work-order-config";
import { cityQueryAgentListService } from "_o/api/city-check";
import {
  hjListService,
  hjDetailService,
  hjUpdateService
} from "_o/api/work-order/serve-check.js";
import { tool } from "@/mixins/base";
export default {
  name: "service-check-order-config",
  components: {
    addModal
  },
  mixins: [tool],
  data() {
    return {
      type: 0,  // 0 新增 1 编辑  2 查看
      tableColumn: tableColumn(this),
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      showModal: false,
      cityList: [],
      agentList: [],
      detailData: {}
    };
  },
  created() {
    this.getCityList()
  },
  methods: {
    async getAgentListByCityCode() {
      let p = { cityCodeList: [] };
      const [err, data = []] = await this.toResult(cityQueryAgentListService(p));
      this.agentList = data;
      this.init();
    },
    async getCityList() {
      let param = {
        bizTypes: [1, 2, 4, 6, 7],
        showAllCity: 1
      }
      const [err, data] = await this.toResult(fetchCityList(param));
      if (err) {
        return;
      }

      let fAllIndex = data.findIndex(it => it.cityName === "全国")
      let list = data;
      if (fAllIndex > -1) {
        list = [...data.splice(fAllIndex, 1), ...data]; // 全国选项放在第一个
      }
      this.cityList = list.map(it => {
        return {
          label: it.cityName,
          value: it.cityCode
        }
      });
      this.getAgentListByCityCode()
    },
    init() {
      this.queryList();
    },
    async queryList() {
      this.$store.commit("changeLoadingFlag", true);
      const {
        table: { pageNum, pageSize }
      } = this;
      const params = {
        currPage: pageNum,
        pageSize
      };
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await hjListService(params);
        if (success) {
          this.tableData = list;
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("changeLoadingFlag", false);
    },
    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    },
    changeShowModal() {
      this.$refs.modal.changeShowModal();
    },
    onCreate() {
      this.detailData = null
      this.type = 0;
      this.changeShowModal();
    },
    onDetailModal(row) {
      const {
        id
      } = row;
      this.type = 1;
      hjDetailService({ id }).then(res => {
        if (res.data && res.data.success) {
          this.detailData = res.data.data
          this.type = 2;
          this.changeShowModal();
        }
      })
    },
    onChangeStatus(row) {
      console.log(row, "0000")
      const tips = row.openCheckConfig === 0 ? "开启" : "关闭"
      this.$Modal.confirm({
        title: `确定${tips}吗？`,
        onOk: async () => {
          try {
            const { id } = row;
            const params = { id, openCheckConfig: row.openCheckConfig === 0 ? 1 : 0 };
            const {
              data: { success }
            } = await hjUpdateService(params);
            if (success) {
              this.$Message.success("成功");
              this.queryList();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    handleModalClose() {
      this.queryList()
    }
  }
};
</script>

<style lang="less" scoped>
.action {
  margin: 0 0 15px;
}
</style>
