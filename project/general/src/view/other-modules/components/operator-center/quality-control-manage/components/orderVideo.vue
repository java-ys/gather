<template>
  <div class="order-video">
    <search-list :inputList="inputList" @on-search="searchData" @on-reset="resetData"></search-list>
    <export-file exportUrl="/admin/driver/compliance/approvalWorkOrderVideo/export" btnText="批量导出" :queryData="searchParams"
      exportFileName="工单视频查看申请审批.xls" style="margin-bottom: 20px;" v-hasAuth="'order-video-export'"></export-file>
    <v-table :current="current" :page-size="pageSize" :total="total" :par-columns="columns" :par-table-data="tableData"
      @changePage="changePage" @changePageSize="changePageSize"></v-table>

    <Modal v-model="detailModal" title="视频详情" :width="800" class="video-wrap">
      <div class="content">
        <div class="content-item" v-for="(list, index) in videoList" :key="index">
          <video :src="list.customUrl" controls class="video-item"></video>
          <p>{{list.videoStartTime}} - {{list.videoEndTime}}</p>
        </div>
      </div>
      <div slot="footer" style="text-align: center;">
        <Button class="custom-button" @click="detailModal = false">确定</Button>
      </div>
    </Modal>
    <order-detail-modal ref="connectOrder"></order-detail-modal>
    <Modal v-model="failStatus" title="驳回原因" :mask-closable=false @on-cancel="cancelFailData">
      <Input v-model="rejectReason" placeholder="请输入驳回原因" :maxlength="100"></Input>
      <div slot="footer">
        <Button @click="cancelFailData">取消</Button>
        <Button type="primary" @click="saveFailData">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { orderVideo } from './fields';
import exportFile from '_a/export-file/exportFile.vue';
import orderDetailModal from './orderDetailModal';
import { mixins } from './fields';
import { toResult, getOrderVideoList, changeOrderVideoStatus, getVideoList, getAgentByCity } from '_o/api/quality-control.js';
import axios from 'axios';

const { inputList, columns } = orderVideo;
export default {
  name: 'orderVideo',
  components: { exportFile, orderDetailModal },
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
        cityList: 1,
        agentList: 2
      },
      searchParams: {},

      current: 1,
      pageSize: 10,
      total: 0,
      columns: columns(this),
      tableData: [],

      detailModal: false,
      videoList: [],

      failStatus: false,
      id: '',
      rejectReason: ''
    };
  },
  computed: {
    inputCityList() {
      return this.inputList[this.inputListMap['cityList']];
    }
  },
  mixins: [mixins],
  mounted() {
    this.getTableData();
  },
  methods: {
    async changeCity(value) {
      if (!value) return this.resetInputList({ agentList: [] });
      const [err, data] = await toResult(getAgentByCity({ cityId: value.split('-')[0] }));
      if (err) return this.resetInputList({ agentList: [] });
      if (!data) return this.resetInputList({ agentList: [] });
      this.resetInputList({
        agentList: data.map(item => {
          return {
            label: item.name,
            value: item.name
          };
        })
      });
    },
    searchData(params) {
      // 结束时间为当天的23:59:59
      params.applyEndTime && (params.applyEndTime = params.applyEndTime + 1000 * 60 * 60 * 23 + 1000 * 60 * 59 + 1000 * 59);
      params.cityName && (params.cityName = params.cityName.split('-')[1]);
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

      const [err, data] = await toResult(getOrderVideoList(conf));
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

    showConnectModal(params) {
      this.$refs.connectOrder.getData(params.orderId);
    },
    async passData(params) {
      let _this = this;
      this.$Modal.confirm({
        title: '是否确认通过？',
        onOk() {
          changeOrderVideoStatus({ id: params.id, approvalStatus: 1 }).then(res => {
            _this.$Message.success('通过成功');
            _this.getTableData();
          });
        }
      });
    },
    showFailModal(params) {
      this.failStatus = true;
      this.id = params.id;
    },
    cancelFailData() {
      this.failStatus = false;
      this.rejectReason = '';
    },
    async saveFailData() {
      if (!this.rejectReason) {
        this.$Message.warning('驳回原因不能为空');
        return;
      }
      const [err, data] = await toResult(changeOrderVideoStatus({ id: this.id, approvalStatus: 2, rejectReason: this.rejectReason }));
      if (err) return;
      this.$Message.success('驳回成功');
      this.cancelFailData();
      this.getTableData();
    },
    async showDetailModal(params) {
      const [err, data] = await toResult(getVideoList({ vin: params.vin, startTime: params.videoStartTime, endTime: params.videoEndTime }));
      if (err) {
        if(err.code === 9021) {
          this.$Message.warning('视频请求中，请稍等。');
          return
        }
      };
      if (!data.length) {
        this.$Message.warning('暂无数据');
        return;
      }

      this.videoList = [];
      for (let i = 0, length = data.length; i < length; i++) {
        let item = data[i];
        let [err, videoData] = await toResult(
          axios({
            url: `${this._uploadUrl}/file/view/media`,
            method: 'post',
            params: {
              uuid: item.fileId
            },
            headers: {
              token: item.token
            }
          })
        );
        item.customUrl = videoData;
        this.videoList.push(item);
      }
      this.detailModal = true;
    }
  },
  watch: {
    inputCityList: {
      handler(value) {
        this.changeCity(value.value);
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
.video-wrap {
  .content {
    padding: 0 50px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .content-item {
      width: 300px;

      .video-item {
        width: 100%;
        height: 200px;
      }
      p {
        text-align: center;
      }
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
