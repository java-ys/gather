<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      title="详情"
      class="safe-score-detail-modal"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="$emit('close')">
      <div class="detail-item">
        <div>
          <div class="item-tit">司机姓名：</div>
          <div>{{info.driverName}}</div>
        </div>
        <div>
          <div class="item-tit">安全分违规类型：</div>
          <div>{{info.violationType}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">分值：</div>
          <div>{{info.value}}</div>
        </div>
        <div>
          <div class="item-tit">计分类型：</div>
          <div>{{scoreTypeMap[info.gradeTye]}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">状态：</div>
          <div>{{statusMap[info.status]}}</div>
        </div>
        <div>
          <div class="item-tit">工单标题：</div>
          <div>{{info.woTitle}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">工单ID：</div>
          <div>{{info.woId}}</div>
        </div>
        <div>
          <div class="item-tit">报警ID：</div>
          <div>{{info.alarmId}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">报警时间：</div>
          <div>{{info.alarmTime}}</div>
        </div>
        <div>
          <div class="item-tit">订单号：</div>
          <div>{{info.orderNo}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">事件分级：</div>
          <div>{{info.occurLevel}}</div>
        </div>
        <div>
          <div class="item-tit">案件编码：</div>
          <div>{{info.occurNo}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">事发日期：</div>
          <div>{{info.occurDate}}</div>
        </div>
        <div>
          <div class="item-tit">事发地点：</div>
          <div>{{info.occurAddress}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">交通事故责任：</div>
          <div>{{info.determine}}</div>
        </div>
        <div>
          <div class="item-tit">违章扣分：</div>
          <div>{{info.pecScore}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">违章时间：</div>
          <div>{{info.pecTime}}</div>
        </div>
        <div>
          <div class="item-tit">处理人：</div>
          <div>{{info.operator}}</div>
        </div>
      </div>
      <div class="detail-item">
        <div>
          <div class="item-tit">处理时间：</div>
          <div>{{info.opTime}}</div>
        </div>
        <div>
          <div class="item-tit">事件简述：</div>
          <div>{{info.occurText}}</div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  axiosSafeScoreRecordDetail
} from "_o/api/driver.js";
import { scoreTypeMap,statusMap } from "./fields.js"
export default {
  name: "safe-score-record-detail",
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
      scoreTypeMap,
      statusMap,
      isShow: false,
      info: {}
    };
  },
  methods: {
    getDetail(){
      axiosSafeScoreRecordDetail({uuid: this.uuid}).then(res => {
        this.info = res.data.data||{}
      })
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      this.isShow && this.getDetail()
    }
  }
};
</script>
<style lang="less" scoped>
.safe-score-detail-modal{
  color:#222;
  /deep/ .ivu-modal-body{
    padding-left: 30px;
  }
}
.detail-item{
  display: flex;
  margin-bottom:14px;
  font-size: 13px;
  line-height: 1.8;
  &>div{
    width: 370px;
    div{
      min-height:23px;
    }
  }
}
.item-tit{
  color: #999;
}
</style>