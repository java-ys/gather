<template>
	<div>
		<Modal
			v-model="isShow"
			:width="820"
			title="操作日志"
			:mask-closable="false"
			:footer-hide="true"
			@on-cancel="$emit('close')"
		>

			<Table
				border
				stripe
				highlight-row
				ref="vtable"
				:loading ="isLoading"
				:columns="historyColumns"
				:data="tableData"
			></Table>
			<div class="page-box right-flex">
				<Page
					show-total
					show-elevator
					:show-sizer="true"
					:total="total"
					:current="current"
					:page-size="pageSize"
					@on-change="changePage"
					@on-page-size-change="changePageSize"
				>
				</Page>
			</div>
			
		</Modal>
	</div>
</template>
<script>
import { axiosSafeScoreImportLog } from "_o/api/driver.js";
export default {
  name: "safe-score-history",
  props: {
    show: {
      type: Boolean
    },
    uuid: {
      type: String
    }
  },
  data() {
    return {
			isShow: false,
			total: 0,
      current: 1,
			pageSize: 10,
			isLoading: true,
      tableData: [],
      historyColumns: [
        {
          title: "序号",
          type: "index",
          width: 67,
          align: "center"
        },
        {
          title: "操作时间",
					key: "updateTime",
					width: 170
        },
        {
          title: "操作人",
          key: "updater"
        },
        {
          title: "操作项",
          key: "field"
        },
        {
          title: "操作前内容",
          key: "oldValue"
        },
        {
          title: "操作后内容",
          key: "newValue"
        }
      ]
    };
  },
  methods: {
		async getHistory(){
      let params = {
        uuid: this.uuid,
        pageSize: this.pageSize,
        currPage: this.current
      }
			this.isLoading = true
			let res = await axiosSafeScoreImportLog(params)
			this.isLoading = false
			let data = res.data.data || {}
			this.tableData = data.list || []
			this.total = data.totalCount || 0;
		},
		changePage(val) {
      this.current = val;
      this.getHistory();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getHistory();
    },
	},
  watch: {
    show() {
			this.isShow = this.show;
			this.isShow && this.getHistory()
    }
  }
};
</script>
<style scoped lang="less">
.page-box{
	padding-top: 15px;
}
</style>