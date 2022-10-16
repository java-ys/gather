<template>
  <div>
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <export-file exportUrl="/admin/driver/compliance/appealWorkOrderList/export" btnText="批量导出" :queryData="searchParams"
      exportFileName="申诉工单明细.xls" style="margin-bottom: 20px;" v-hasAuth="'appeal-order-detail-export'"></export-file>
    <v-table :current="current" :page-size="pageSize" :total="total" :par-columns="columns" :par-table-data="tableData"
      @changePage="changePage" @changePageSize="changePageSize"></v-table>

    <Modal v-model="detailModal" title="申诉工单详情" :width="800">
      <Form>
        <Row>
          <Col v-for="(list, index) in detailData" :key="index" :span="list.span">
          <FormItem :label="list.label + '：'" v-if="list.show">
            <!--关联订单号-->
            <span v-if="list.link" class="operate-span"
              @click="showConnectOrderModal(list)">{{list.link}}</span>
            <!--附件: 图片-->
            <template v-if="list.imgList">
              <span v-for="(item, i) in list.imgList" :key="i" class="operate-span" @click="showBigImg(item, 'img')"
                style="margin-right: 5px;">图片{{i + 1}}</span>
            </template>
            <!--附件: 视频-->
            <template v-if="list.videoList">
              <span v-for="(item, i) in list.videoList" :key="i" class="operate-span" @click="showBigImg(item, 'video')"
                style="margin-right: 5px;">视频{{i + 1}}</span>
            </template>
            <p class="detail-value">{{list.value}}</p>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" ghost class="custom-button" @click="detailModal = false">确定</Button>
      </div>
    </Modal>
    <order-detail-modal ref="connectOrder"></order-detail-modal>
    <Modal v-model="bigImgStatus" title="附件详情">
      <img :src="bigImgSrc" style="width: 100%;height: 100%" alt="" v-if="bigImgStatus && fileType === 'img'">
      <video :src="bigImgSrc" style="width: 100%;height: 100%" controls v-if="bigImgStatus && fileType === 'video'"></video>
      <div slot="footer" style="text-align: center;">
        <Button type="primary" ghost class="custom-button" @click="bigImgStatus = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { appealOrderDetail } from './fields';
import orderDetailModal from './orderDetailModal';
import exportFile from '_a/export-file/exportFile.vue';
import { mixins, orderSource, translateLabel, urgencyDegree, processState, complaintResult } from './fields';
import { toResult, getAppealOrderDetailList, getAppealOrderDetail } from '_o/api/quality-control.js';

const { inputList, columns } = appealOrderDetail;
export default {
  name: 'appealOrderDetail',
  components: { orderDetailModal, exportFile },
  props: {
    cityList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      inputList: JSON.parse(JSON.stringify(inputList)),
      inputListMap: {
        cityList: 1
      },
      searchParams: {},

      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: [],

      detailModal: false,
      detailData: [
        // { label: '', value: '', key: '', span: 8},
        { label: '来源渠道', value: '', key: 'source', span: 8, render(data) {
          this.value = translateLabel(orderSource, data[this.key])
        }},
        { label: '创建时间', value: '', key: 'createTime', span: 8 },
        { label: '城市', value: '', key: 'cityName', span: 8 },
        { label: '关联工单号', value: '', key: 'sourceWorkOrder', span: 16, render(data) {
          this.orderId = data['orderId']
          this.link = data[this.key]
        } },
        { label: '司机ID', value: '', key: 'driverNo', span: 8 },
        { label: '司机姓名', value: '', key: 'driverName', span: 8 },
        { label: '运营商', value: '', key: 'agentName', span: 8 },
        { label: '申诉描述', value: '', key: 'describe', span: 24 },
        { label: '附件', value: '', key: 'imageList', span: 24, render(data) {
          this.imgList = data[this.key];
        } },
        { label: '附件', value: '', key: 'videoList', span: 24, render(data) {
          this.videoList = data[this.key];
        } },
        { label: '处理状态', value: '', key: 'dealStatus', span: 8, render(data) {
          let map = {
            1: '已处理',
            2: '未处理'
          }
          this.value = map[data[this.key]]
        } },
        { label: '申诉结果', value: '', key: 'result', span: 16, render(data) {
          this.value = translateLabel(complaintResult, data[this.key])
        } },
        { label: '处理时间', value: '', key: 'handleTime', span: 24, render(data) {
          let times = data[this.key];
          if(!times) return;
          let str = '';
          let hour = Math.floor(times / 60);
          hour && (str = `${hour}小时`)

          this.value = `${str}${times % 60}分`
        } },
        { label: '处理人', value: '', key: 'approvalName', span: 8 },
        { label: '处理人手机号', value: '', key: 'mobile', span: 8 }
      ],
      bigImgStatus: false,
      bigImgSrc: '',
      fileType: 'img'
    };
  },
  mixins: [mixins],
  mounted() {
    this.getTableData();
  },
  methods: {
    searchData(params) {
      params.cityName && (params.cityName = params.cityName.split('-')[1]);
      // 结束时间为当天的23:59:59
      params.createEndTime && (params.createEndTime = params.createEndTime + 1000 * 60 * 60 * 23 + 1000 * 60 * 59 + 1000 * 59);
      this.searchParams = params;
      this.current = 1;
      this.getTableData();
    },
    resetData() {
      this.searchParams = {};
      this.current = 1;
      this.getTableData();
    },

    async getTableData() {
      let conf = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      Object.assign(conf, this.searchParams);
      this.$store.commit('changeLoadingFlag', false);

      const [err, data] = await toResult(getAppealOrderDetailList(conf));
      if (err) return;
      this.tableData = data.list;
      this.total = data.totalCount;
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    changePageSize(pageSize) {
      this.current = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },

    async showDetailModal(params) {
      const [err, data] = await toResult(getAppealOrderDetail({ orderId: params.orderId }));
      if (err) return;
      this.detailData = this.detailData.map(item => {
        if(item.render) {
          item.render.call(item, data)
        }else {
          item.value = data[item.key]
        }
        let hideList = ['result', 'dealTime', 'approvalName', 'mobile']
        if(hideList.includes(item.key) && data.dealStatus === 2) {
          item.show = false;
        }else {
          item.show = true;
        }
        return item;
      });
      this.detailModal = true;
    },
    showConnectOrderModal(params) {
      let id = params.orderId;
      this.$refs.connectOrder.getData(id);
    },
    showBigImg(url, fileType) {
      this.bigImgStatus = true;
      this.fileType = fileType;
      this.bigImgSrc = url;
    }
  }
};
</script>

<style scoped>
.detail-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
</style>
