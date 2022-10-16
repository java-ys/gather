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
import {
  axiosAgentRewardHistory
} from "_o/api/operator-carrier";
export default {
  name: "agent-reward-history",
  props: {
    show: {
      type: Boolean
    },
    rewardCode: {}
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
          width: 90,
          align: "center"
        },
        {
          title: "操作人",
          key: "updater"
        },
        {
          title: "类型",
          key: "operateTypeDesc",
          render: (h, {row}) => {
            let desc = row.operateType===1?'奖励':'取消奖励'
            return h("span", desc);
          }
        },
        {
          title: "操作时间",
					key: "updateTime"
        }
      ]
    };
  },
  methods: {
		async getHistory(){
      let params = {
        rewardCode: this.rewardCode,
        pageSize: this.pageSize,
        currPage: this.current
      } 
			this.isLoading = true
			let res = await axiosAgentRewardHistory(params)
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
    }
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