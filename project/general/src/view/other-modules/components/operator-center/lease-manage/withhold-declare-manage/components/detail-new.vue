<template>
  <div>
    <Row class="info-row">
      <Col span="6">代扣月份：{{withholdDate}}</Col>
      <Col span="6">需代扣租金：{{rent}}</Col>
      <Col span="6">扣款总额：{{totalDeductions}}</Col>
      <Col span="6">余量总额：{{totalResidue}}</Col>
    </Row>
   <VTable
      :isLoading="isLoading"
      :parColumns="columns"
      :parTableData="tableData"
      :height="300"
      :isShowPage="false"
    >
    </VTable>
    <Modal v-model="visible" title="View Image" :width="800">
      <img v-if="visible" :src="imgUrl" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { queryDeductionRunning } from "_o/api/lease.js"
import { getImgUrl} from "_o/api/work-order/common.js"
import VTable from "_a/v-table/v-table.vue"
import moment from "moment";
export default {
  name: "detail",
  components:{
      VTable
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      columns: [
        {
          title: "扣款方式",
          width: 150,
          renderHeader: h => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    fontSize: "12px",
                    marginRight: "5px"
                  }
                },
                "扣款方式"
              ),
            ]);
          },
          render: (j, params) => {
            let typeText = ""
            if (params.row.payType === 1) {
              typeText = "线上代扣"
            } else if (params.row.payType === 2) {
              //   typeText = "线下追缴"
              typeText = "线下收款"
            } else if (params.row.payType === 3) {
              typeText = "退款"
            }
            return j("span", typeText)
          }
        },
        {
          title: "扣款金额（元）",
          width: 150,
          key: "received",
          render(h, { row }) {
            return h("span", {}, (Number(row.received) || 0).toFixed(2));
          }
        },
        // {
        //   title: "余量（元）",
        //   width: 150,
        //   key: "notReceived",
        //   render(h, { row }) {
        //     return h("span", {}, (Number(row.notReceived) || 0).toFixed(2));
        //   }
        // },
        {
          title: "时间",
          width: 160,
          key: "updateTime",
           render(h, { row }) {
               console.log(row.updateTime)
            return h("span", {}, moment(row.updateTime).format("YYYY-MM-DD"));
          }
        },
        {
          title: "操作人",
          width: 160,
          key: "creatorName"
        },
      ],
      tableData: [],
      isLoading: true,
      current: 1,
      pageSize: 5,
      total: 0,
      imgUrl: "",
      visible: false,
      rent:'',
      totalDeductions:'',
      totalResidue:'',
      withholdDate:''
    }
  },
  watch: {
    id(newval) {
      if (newval.length) {
        this.getDetail()
      }else{
          this.resetData()
      }
    }
  },
  methods: {
    getDetail() {
      let params = {
        billId: this.id,
        payType: 1
      }
      queryDeductionRunning(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.listRunningDto || []
          const { rent,totalDeductions,totalResidue,withholdDate} =  res.data.data
          this.rent = rent
          this.totalDeductions = totalDeductions
          this.totalResidue = totalResidue
          this.withholdDate = withholdDate
        }
      })
    },
    seeDetail(val) {
      getImgUrl({ attachmentUrlUuid: val }).then(res => {
        if (res.data.success) {
          this.visible = true
          this.imgUrl = res.data.data.attachmentUrl
        } else {
          this.$Message.error("加载失败")
        }
      })
    },
    resetData(){
        this.tableData =  []
          this.rent = ''
          this.totalDeductions = ''
          this.totalResidue = ''
          this.withholdDate = ''
    }
  }
}
</script>

<style lang="less" scoped>
    .info-row{
        padding:10px;
        font-size:14px;

    }
</style>
