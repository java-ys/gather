<template>
	<div>
		<Modal
			v-model="isShow"
			:width="820"
			title="处理记录"
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
    <m2-carousel-modal
      :show="isCarousel"
      title="查看附件"
      imgName="保证书"
      :imgList="editImgList"
      @close="isCarousel=false"
    ></m2-carousel-modal>
	</div>
</template>
<script>
import { axiosSafeScoreHandleList } from "_o/api/driver.js";
import t3CarouselModal from "_a/m2-carousel-modal/index"

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
    let that = this
    return {
			isShow: false,
			total: 0,
      current: 1,
			pageSize: 10,
			isLoading: true,
      tableData: [],
      isCarousel: false,
      editImgList: [],
      historyColumns: [
        {
          title: "序号",
          type: "index",
          width: 67,
          align: "center"
        },
        {
          title: "处理时间",
					key: "updateTime",
					width: 170
        },
        {
          title: "处理人",
          key: "updater"
        },
        {
          title: "处罚项",
          key: "opType",
          render: (h, { row }) => {
            let val = row.opType===1?'签订保证书':row.opType===2?'劝退':'清退'
            return h('span',val)
          }
        },
        {
          title: "附件",
          key: "beforeValue",
          render: (h, { row }) => {
            if(row.dealImages && row.dealImages.length>0){
              return h('span',{
                class: {
                  textBtn: true
                },
                on: {
                  click() {
                    that.editImgList = row.dealImages
                    that.isCarousel = true
                  }
                }
              }, '查看附件');
            }
          }
        },
        {
          title: "邮件接收人邮箱",
          key: "email"
        }
      ]
    };
  },
  components: {
    t3CarouselModal
  },
  methods: {
		async getHistory(){
      let params = {
        uuid: this.uuid,
        pageSize: this.pageSize,
        currPage: this.current
      }
      this.isLoading = true
			let res = await axiosSafeScoreHandleList(params)
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