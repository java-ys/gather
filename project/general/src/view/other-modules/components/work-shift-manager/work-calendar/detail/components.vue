<template>
  <div>
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
import { tableColumns,tableColumns2,tableColumns3,tableColumns4, pageData } from "./index.js";
import { calDetailList } from "_o/api/rest.js";
export default {
	props: {
		attedType: {
			type: Number,
			default: '1'
		}
	},
	data() {
		return {
			tableColumns: [],
			...pageData,
			params: {},
			agentId: this.$route.query.agentId,
			driverTag: this.$route.query.driverTag,
			cityCode: this.$route.query.cityCode,
		}
	},
	mounted() {
		switch(this.attedType) {
			case 1:
				this.tableColumns = tableColumns(this)
				break
			case 2:
				this.tableColumns = tableColumns2(this)
				break
			case 3:
				this.tableColumns = tableColumns3(this)
				break
			case 6:
				this.tableColumns = tableColumns4(this)
				break
		}
		// this.getList()
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
			const { day, month, year, shiftUuid, uid, agentId,driverTag,cityCode } = this.$route.query;
			console.log(this.$route.query)
			let days = day&&day.toString().length == 2 ? day : "0"+day
			let months = month&&month.toString().length == 2 ? month : "0"+month
			let params = Object.assign(this.params,{
				currPage: this.pageData.currPage,
				pageSize:this.pageData.pageSize,
				actualDutyType: this.attedType,
				dutyDate: year + months +  days,
				shiftUuid,
				shiftRuleUuid: uid,
				agentId,
				driverTag,
				cityCode
			})
			calDetailList(params).then((res) =>{
				// console.log(res)
				if(res.data.success) {
					console.log(res)
					this.tableData = res.data.data.list;
					this.pageData.total = res.data.data.totalCount
				}
			})
		},
		searchChil(data) {
			console.log(data)
			this.pageData.currPage = 1
			this.pageData.pageSize = 10
			this.params = data;
			this.getList()
		},
		resetChil() {
			this.pageData.currPage = 1
			this.pageData.pageSize = 10
			this.params = {};
			this.getList()
		}
	}
}
</script>