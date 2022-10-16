<template>
  <Modal v-model="modalStatus" title="工单详情" :width="800">
    <Form>
      <Row>
        <Col v-for="(list, index) in detailData" :key="index" :span="list.span">
        <FormItem :label="list.label + '：'" v-if="list.show">
          <p class="detail-value" :class="[list.class]">{{list.render ? list.render(list) : list.value }}</p>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button type="primary" ghost class="custom-button" @click="modalStatus = false">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { getOrderDetail, toResult } from '_o/api/quality-control.js';
import { orderSource, translateLabel, urgencyDegree, processState } from './fields.js'
export default {
  name: 'orderDetailModal',
  props: ['id'],
  data() {
    return {
      modalStatus: false,
      detailData: [],
      detailDataTemplate: [
        { label: '工单号', key: 'sourceWorkOrder', value: '', span: 8 },
        { label: '来源渠道', key: 'source', value: '', span: 8, render(params) {
          return translateLabel(orderSource, params.value)
        } },
        { label: '投诉时间', key: 'complaintTime', value: '', span: 8 },
        { label: '一级工单类型', key: 'firstOrderName', value: '', span: 8 },
        { label: '二级工单类型', key: 'secondOrderName', value: '', span: 8 },
        { label: '三级工单类型', key: 'thirdOrderName', value: '', span: 8 },
        { label: '紧急程度', key: 'emergentLevel', value: '', span: 8, render(params) {
          return translateLabel(urgencyDegree, params.value);
        } },
        { label: '城市', key: 'cityName', value: '', span: 8 },
        { label: '关联订单编号', key: 'orderNo', value: '', span: 8 },
        { label: '司机ID', key: 'driverNo', value: '', span: 8 },
        { label: '司机姓名', key: 'driverName', value: '', span: 8 },
        { label: '运营商', key: 'agentName', value: '', span: 8 },
        { label: '问题描述', key: 'complaintContent', value: '', span: 24, class: 'wrap-class' },
        { label: '客服处理时间', key: 'uploadTime', value: '', span: 24 },
        { label: '客服处理结果', key: 'violationContent', value: '', span: 24, class: 'wrap-class' },
        { label: '处理状态', key: 'responsibilityStatus', value: '', span: 8, render(params) {
          let map = {
            0: '未处理',
            1: '已判责'
          }
          return map[params.value];
        } },
        { label: '处理时间', key: 'dealTime', value: '', span: 16 },
        { label: '处理耗时', key: 'handleTime', value: '', span: 8, render(params) {
          let times = params.value;
          if(!times) return;
          let str = '';
          let hour = Math.floor(times / 60);
          hour && (str = `${hour}小时`)
          return `${str}${times % 60}分`;
        } },
        { label: '定责类型', key: 'responsibilityType', value: '', span: 16, render(params) {
          return translateLabel(processState, params.value);
        } },
        { name: 'customField' },
        { label: '违规详情', key: 'violationDetail', value: '', span: 24, class: 'wrap-class' },
        { label: '处罚金额', key: 'forfeit', value: '', span: 24 },
        { label: '处理人', key: 'dealUserName', value: '', span: 8 },
        { label: '处理人手机号', key: 'dealUserPhone', value: '', span: 16 }
      ]
    };
  },
  methods: {
    async getData(id) {
      const [err, data] = await toResult(getOrderDetail({ orderId: id }));
      if (err) return
      if (!data) {
        this.$Message.warning('暂无数据');
        return;
      }
      let detailData = this.detailDataTemplate;
      this.detailData = detailData.map(item => {
        item.value = data[item.key];

        // 违规详情前加入违规级别和违规项
        let map = {
          1: '轻微',
          2: '一般',
          3: '严重',
          4: '特大'
        }
        let arr = [];
        data['responsibilityItems'].map(i => {
          arr.push({label: '违规项', key: '', value: i['violationItem'], span: 8, show: true});
          arr.push({label: '违规级别', key: '', value: map[i['violationLevel']], span: 16, show: true});
        })
        if(item.name === 'customField') {
          return [...arr]
        }

        if(item.key === 'violationDetail' && data['responsibility']) {
          item.value = data['responsibility'].describe
        }
        if(item.key === 'forfeit' && data['responsibility']) {
          item.value = data['responsibility'].forfeit
        }
        // 这几项只有在定责类型为有责时才展示
        let showList = ['responsibilityType', 'violationLevel', 'violationDetail', 'forfeit'];
        if(showList.includes(item.key)) {
          item.show = data.responsibilityType === 1;
        }else {
          item.show = true;
        }
        return item;
      }).flat();
      this.modalStatus = true;
    }
  }
};
</script>

<style scoped>
.detail-value:not(.wrap-class) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
</style>
