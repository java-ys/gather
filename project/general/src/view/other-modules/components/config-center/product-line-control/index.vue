<!--产品线管理-->
<template>
	<div class="carrier">
		<div class="carrier-header">
			<SearchList
				:inputList="inputList"
				@on-search="search"
				@on-reset="reset"
			></SearchList>
			<Button
				type="primary"
				@click="popView"
				v-hasAuth="'product_line_control-add'"
			>新增产品线
			</Button>
		</div>
		<div class="carrier-content">
			<VTable
				:total="total"
				:current="current"
				:pageSize="pageSize"
				:isLoading="isLoading"
				:parColumns="parColumns"
				:parTableData="tableData"
				@sort="sort"
				@selectObj="selectObj"
				@changePage="changePage"
				@changePageSize="changePageSize"
				style="margin-top: 25px;"
			></VTable>
			<Float
				:floatParams="floatParams"
				:cityUuid="cityUuid"
				:cityList="cityList"
				:optList='optList'
				:type="updateType"
				:title="title"
				:popView="isPop"
                :gradeInfo="gradeInfo"
				:invalidEditor="invalidEditor"
				@on-confirm="confirm"
				:width="500"
			></Float>
		</div>
	</div>
</template>

<script>
  import {returnFields, inputList, statusData, businessTypeData} from "./index";
  import {keys} from '@/libs/tools'
  import VTable from "_a/v-table/v-table";
  import Float from "./float";
  import SearchList from "_a/search-list/search-list";
  import {getProductLineList,updateProductLineStatus } from '_o/api/configData.js';
  import { getProvinceCityAllList } from "_g/api/common.js";
  import { cpTranslate } from "@/libs/tools";
  import { mapActions, mapState } from "vuex";
  export default {
    components: {
      VTable,
      SearchList,
      Float
    },
    data() {
      return {
        ...returnFields(this),
        inputList: JSON.parse(JSON.stringify(inputList)),
        title: "新建产品线管理策略",
        cityUuid: "",
        updateType: "",
        tableData: [],
        cityList: [],
        isPop: false,
        isLoading: true,
        pageSize: 10,
        currPage: 1,
        copy: false,
        floatParams: {
          carrierArea: [],
          businessType:'',
          carTypes: [],
          //status: 0
        },
        status: keys(statusData).map(key => ({
          value: key,
          label: statusData[key]
        })),
        // optList: keys(businessTypeData).map(key => ({
        //   value: key,
        //   label: businessTypeData[key]
        // })),
        optList:[],
        //optListQuick: keys(businessTypeData[0]).map(key => ({
        //  value: key,
        //  label: businessTypeData[key]
        //})),
        //optListSpec: keys(businessTypeData.shift()).map(key => ({
        //  value: key,
        //  label: businessTypeData[key]
        //})),
        invalidEditor: false,
        polygonPath: [],
        searchListParams: {} // 保存搜索条件参数
      };
    },
    computed:{
      ...mapState({
        gradeInfo: (state) => state.common.gradeList,
      }),
    },
    watch:{
        gradeInfo(newval){
          const usefulVal = newval.filter(it=>it.businessCode !== 8)
          this.inputList[1].dropList = usefulVal.map(it=>{
            return {
              value:it.businessCode,
              label:it.businessCodeDesc
            }
          })
          this.optList = this.inputList[1].dropList
        }
    },
    created(){
        this.getGradeList();
    },
    mounted() {
      this.getProvinceCityList();
      this.getTableList();
      //this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    //   this.inputList[1].dropList = this.optList

    },
    methods: {
      ...mapActions([
        "getGradeList"
      ]),
      getProvinceCityList() {
        getProvinceCityAllList().then(res => {
          // 获取已开通省、市级联列表
          let list = cpTranslate(res.data.data)
          this.provinceCityList = list
          this.inputList[0].cascaderList = list
          this.cityList = list
        });
      },
      getTableList() {
        const params = this.searchListParams
        // 获取表格数据
        params.pageSize = this.pageSize;
        params.currPage = this.current;
        if (params.cityId) params.cityCode = params.cityId
        if (params.provinceId) params.provinceCode = params.provinceId
        if (params.businessType) params.businessType = +params.businessType
        delete params.cityId
        delete params.provinceId
        getProductLineList(params).then(res => {
          this.tableData = (res.data.data && res.data.data.list) || [];
          this.total = (res.data.data && res.data.data.totalCount) || 0;
          this.$store.commit('changeLoadingFlag', false)
        });
      },
      popView() {
        this.isPop = true;
        this.title = "新建产品线管理策略";
        this.floatParams = {
          carrierArea: [],
          businessType:'',
          carTypes: [],
        }
        this.polygonPath = []
        this.invalidEditor = false
        this.updateType = "add";
      },
      confirm(data) {
        if (data) this.getTableList()
        this.isPop = false
      },
      search(data) {
        this.current = 1
        this.searchListParams = {...data}
        this.getTableList()
      },
      reset(data) {
        this.current = 1
        this.searchListParams = {}
        this.getTableList()
      },
      sort() {
      },
      selectObj(val) {
        this.current = val;
        this.getTableList();
      },
      changePage(val) {
        this.current = val;
        this.getTableList();
      },
      changePageSize(val) {
        this.pageSize = val;
        this.getTableList();
      },
      rowActive(row) {
        const {status, cityCode , businessType} = row,
        	params = { status: (status  === 0) ? 1 : 0, cityCode ,businessType}
        updateProductLineStatus(params).then(res => {
          if (res.data && res.data.success) {
            this.$Message.success('状态更新成功！')
            this.getTableList();
          } else {
            this.$Message.warning('状态更新失败！')
          }
        });
      }
    }
  };
</script>
<style scoped>
	.carrier-header {
		margin-top: 10px;
	}
</style>
