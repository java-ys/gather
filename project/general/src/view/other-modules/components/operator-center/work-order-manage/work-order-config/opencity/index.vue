<template>
  <div>
    <searchList
      ref="searchList"
      :inputList="inputList"
      @on-search="handleSearch"
      @on-reset="handleReset"
    >
    </searchList>
    <div class="action">
      <Button type="primary" @click="onCreate">新建</Button>
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
    <addModal ref="modal" :type="type" :cityList="cityList" :detailData="detailData" @confirmed="handleModalClose"></addModal>
  </div>
</template>

<script>
import { inputList, tableColumn, categoryMap, formRule, PATTERN_PHONE } from "./fields";
import addModal from "./components/add.vue"
import {
  getOpenAreaAll
} from "_o/api/work-order/common.js";
import { fetchCityList } from "_o/api/work-order/work-order-config";
import {
  likeAxios, detailAxios, deleteAxios
} from "_o/api/work-order/opencity.js";
export default {
  name: "crew",
  components: {
    addModal
  },
  data() {
    return {
      type: 0,  // 0 新增 1 编辑  2查看
      inputList: inputList(this),
      tableColumn: tableColumn(this),
      search: {},
      table: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableSelectRow: [],
      showModal: false,
      form: {},
      formRule: formRule(this),
      categoryMap,
      groupMap: [],
      user: {},
      cityList: [],
      detailData: {}
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.queryList();
      this.fetchOptions()
    },
    async fetchOptions() {
      // let [
      //   {
      //     data: { data: openAreaList }
      //   }
      // ] = await await Promise.all([getOpenAreaAll()]);
      // const cityInput = this.inputList.find(item => item.bind_key === "cityCode");
      // cityInput.dropList =[{
      //     value: "100000",
      //     label: "全国"
      //   },...openAreaList] ;
      // this.cityList = cityInput.dropList
      // 
       let param = {
        bizTypes:[1, 2, 4, 6, 7],
        showAllCity:1
      }
      const { data: { success, data } } = await fetchCityList(param);
      if (success) {
        this.cityList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        });
        const idx = this.inputList.findIndex(input => input.bind_key === 'cityCode')
        this.inputList[idx].dropList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        })
      }
    },
    async queryList() {
      this.$store.commit("changeLoadingFlag", true);
      const {
        search,
        table: { pageNum, pageSize }
      } = this;
      const params = {
        currPage: pageNum,
        pageSize,
        ...search
      };
      try {
        const {
          data: {
            success,
            data: { list, totalCount }
          }
        } = await likeAxios(params);
        if (success) {
          this.tableData = list;
          this.table.total = totalCount;
        }
      } catch (error) {
        console.log(error);
      }
      this.$store.commit("changeLoadingFlag", false);
    },

    handleSearch(val) {
      this.search = val;
      this.table.pageNum = 1;
      this.queryList();
    },

    handleReset() {
      this.search = {};
      this.table.pageNum = 1;
      this.queryList();
    },

    handleChangePage(val) {
      this.table.pageNum = val;
      this.queryList();
    },

    handleChangePageSize(val) {
      this.table.pageSize = val;
      this.queryList();
    },
    onChangeGroup(val) {
      if (val) {
        this.form.groupName = this.groupMap.find(item => item.value === val).label;
      }
    },

    onChangePhone(ev) {
      const { value } = ev.target
      if (!value || !PATTERN_PHONE.test(value)) {
        this.user.userName = "";
      } else {
        this.onBlurPhone();
      }
    },
    changeShowModal() {
      this.$refs.modal.changeShowModal();
    },
    onCreate() {
      this.type = 0;
      this.changeShowModal();
    },
    openEdit(row) {
      const {
        id
      } = row;
      this.type = 1;
      detailAxios({ id }).then(res => {
        if (res.data && res.data.success) {
          this.detailData = res.data.data
          this.type = 1;
          this.changeShowModal();
        }
      })
    },
    showDetail(row) {
      const {
        id
      } = row;
      this.type = 1;
      detailAxios({ id }).then(res => {
        if (res.data && res.data.success) {
          this.detailData = res.data.data
          this.type = 2;
          this.changeShowModal();
        }
      })
    },
    delData(row) {
      this.$Modal.confirm({
        title: "确定删除数据吗，删除后将无法恢复？",
        onOk: async () => {
          try {
            const { id } = row;
            const params = { id };
            const {
              data: { success }
            } = await deleteAxios(params);
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
