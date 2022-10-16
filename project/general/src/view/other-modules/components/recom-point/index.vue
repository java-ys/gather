<template>
  <div>
    <div class="customer">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
    </div>
    <div class="mb-20">
      <Button type="primary" @click="addNew">新建</Button>
    </div>
    <div>
      <VTable
        :total="pageData.total"
        :current="pageData.currPage"
        :pageSize="pageData.pageSize"
        :parColumns="tableColumns(this)"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </VTable>

      <Modal v-model="modalShow" :title="restModal" width="70%" :mask-closable="false" :footer-hide="true">
        <edit
          ref="addref"
          :item="item"
          :modal="modalShow"
          @closeChange="closeChange"
          @submitChange="submitChange"
        ></edit>
      </Modal>
    </div>
  </div>
</template>
<script>
import { inputList, tableColumns, pageData, undef } from "./index.js";
import edit from './edit.vue'
import { recomPointList } from "_o/api/recom-point.js";
import { getProvinceCityAllList } from '_g/api/common.js';
import {cpTranslate} from '@/libs/tools';

export default {
  components:{
		edit,
	},
  data() {
    return {
      restModal: '编辑推荐点',
			inputList,
			...pageData,
			tableColumns,
			modalShow: false,
      params: {}, // 搜索参数
      item: {} // 编辑时的行数据
    };
  },
  watch: {
    modalShow(v) {
      if(!v) {
        this.restModal = "编辑推荐点"
        this.item.new = false
      }
    }
  },
  mounted() {
    this.getList()
    this.getCityList()
  },
  methods: {
    // 获取城市列表
    getCityList() {
      getProvinceCityAllList({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data)
          this.inputList[0].cascaderList = list
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 记载表格数据
    getList() {
      let p = {
        currPage: this.pageData.currPage,
        pageSize:this.pageData.pageSize
      }

      let params = Object.assign(this.params, p)
      recomPointList(params).then((res) =>{
        if(res.data.success) {
          this.tableData = res.data.data.list || []
          this.pageData.total = res.data.data.totalCount || 0
        }
      })
    },
    changePage(val) {
      this.pageData.currPage = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageData.currPage = 1
      this.pageData.pageSize = val;
			this.getList();
    },
    closeChange() {
      this.modalShow = false;
    },
    submitChange(val) {
      this.modalShow = false;
      this.getList();
    },

		search(data) {
      this.pageData.currPage = 1;
      this.params = {...data}
      if(!undef(this.params.disable)) {
        this.params.disable = !!this.params.disable // 转为bool值
      }
      if(this.params.cityCode) {
        this.params.cityCodeList = [this.params.cityCode];
        delete this.params.cityCode
      }
      this.getList()
    },
    reset() {
      this.pageData.currPage = 1
      this.params = {};
      this.getList()
    },
    addNew() {
      this.restModal = "新建编辑点"
      this.item.new = true
      this.modalShow = true
    }
  }
};
</script>
<style lang="less" lang="less">

.mb-20 {
  margin-bottom: 20px;
}
</style>
