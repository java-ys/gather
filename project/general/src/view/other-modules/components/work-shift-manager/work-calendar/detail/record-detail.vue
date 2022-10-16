<template>
  <div>
	<div style="margin-bottom: 20px">
		<Date-picker 
			:value="dateSearch" format="yyyy-MM-dd" 
			type="daterange" placement="bottom-end" 
			placeholder="选择日期" style="width: 200px"
			@on-change="search"
		></Date-picker>
		累计<span v-if="type==1">出勤</span><span v-if="type==2">休息</span><span v-if="type==3">请假</span><span v-if="type==4">旷工</span>{{pageData.total}}个工作日
	</div>
    <VTable
      :total="pageData.total"
      :current="pageData.currPage"
      :pageSize="pageData.pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
  </div>
</template>
<script>
import { detailColumns,detailColumns2,detailColumns3,detailColumns4, detailPageData } from "./index.js";
import { hisDetailList } from "_o/api/rest.js";
export default {

	data() {
		return {
			tableColumns: [],
			...detailPageData,
			params: {},
			dateSearch: [],
			type: this.$route.query.attedType,
			
		}
	},
	created() {
		this.pageData.currPage = 1;
		this.pageData.pageSize = 10;
		this.pageData.total = 0
	},
	mounted() {
		switch(this.$route.query.attedType) {
			case 1:
                this.tableColumns = detailColumns(this)
				break
			case 2:
				this.tableColumns = detailColumns2(this)
				break
			case 3:
				this.tableColumns = detailColumns3(this)
				break
			case 4:
				this.tableColumns = detailColumns4(this)
				break
		}
		this.getList()
	},
	methods: {
		changePage(val) {
			this.pageData.currPage = val;
			this.getList();
		},
		changePageSize(val) {
			this.pageData.pageSize = val;
			this.getList();
		},
		getList() {
			const { uuid, attedType, shiftRuleUuid, shiftUuid, agentId,driverTag } = this.$route.query;
			let params = Object.assign(this.params,{
				currPage: this.pageData.currPage,
				pageSize:this.pageData.pageSize,
				actualDutyType: attedType,
				driverUuid: uuid,
				agentId,
				driverTag
			})
	
			hisDetailList(params).then((res) =>{
				if(res.data.success) {
					this.tableData = res.data.data.list;
					this.pageData.total = res.data.data.totalCount
				}
			})
		},
		search(value){
			this.params = {
				beginDate: value[0].replace(/\-/ig, ""),
				endDate: value[1].replace(/\-/ig, "")
			}
			this.getList()
		}
	}
}
</script>