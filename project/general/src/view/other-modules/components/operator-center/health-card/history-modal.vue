<template>
  <div>
    <Modal
      v-model="isShow"
      :width="700"
      :footer-hide="true"
      :mask-closable="false"
      class="history-modal"
      @on-cancel="closeModal('addVersionForm')">
      <div slot="header" class="head-box">
        <div>
          <span class="big-tit">{{driverInfo.driverName}}</span><span>{{driverInfo.mobile}}</span>
          <div>{{driverInfo.plateNumber}}</div>
        </div>
        
        <div class="info-box">
          <DatePicker type="month" v-model="nowMonth" @on-change="getList" style="width: 150px" :clearable="false"></DatePicker>
          <div v-if="dataList">
            <span class="item-label">累计已报备 / 未报备:</span>
            <span class="left20">{{info.submitCount}}次 / <span class="red">{{info.unSubmitCount}}次</span></span>
          </div>
        </div>
      </div>
      
      <Collapse simple v-model="panelVal" v-if="isPan && dataList">
        <Panel v-for="(item,index) in dataList" :key="item.driverUuid" :name="String(index+1)">
          <div class="flex-box">
            <strong class="item-label">{{item.createTime}}</strong>
            <span v-if="item.submitStatus===0" class="red">未报备</span>
            <span v-else >已报备</span>
          </div>
          <div slot="content">
            <div v-if="item.dayRecords.length>0">
              <div class="content-box" v-for="son in item.dayRecords" :key="son.recordId">
                <div class="flex-box">
                  <span class="item-label">状态：</span>
                  <span>{{auditsMap[son.auditStatus]}}</span>
                </div>
                <div class="flex-box">
                  <span class="item-label">体温：</span>
                  <span>{{son.temperature}}℃</span>
                </div>
                <div class="flex-box">
                  <span class="item-label">体温照片：</span>
                  <div v-if="son.temperatureImgs.length>0">
                    <img v-for="(img,i) in son.temperatureImgs" @click="openBigImg('体温照片',son.temperatureImgs,i)" :key="i" :src="img" alt="体温照片">
                  </div>
                  <span v-else>无数据</span>
                </div>
                <div class="flex-box">
                  <span class="item-label">健康码照片：</span>
                  <div v-if="son.disfectImgs.length>0">
                    <img v-for="(img,i) in son.disfectImgs" @click="openBigImg('健康码照片',son.disfectImgs,i)" :key="i" :src="img" alt="健康码照片">
                  </div>
                  <span v-else>无数据</span>
                </div>
                <div class="flex-box">
                  <span class="item-label">口罩照片：</span>
                  <div v-if="son.maskImges.length>0">
                    <img v-for="(img,i) in son.maskImges" @click="openBigImg('口罩照片',son.maskImges,i)" :key="i" :src="img" alt="口罩照片">
                  </div>
                  <span v-else>无数据</span>
                </div>
              </div>
            </div>
            <div v-else class="fontsize15 top15 text-center">
              无数据
            </div>
          </div>
        </Panel>
      </Collapse>
      <div v-if="!dataList" class="fontsize20 top30 text-center">
        暂无数据
      </div>
    </Modal>
    <carousel-modal 
      :show="isBigImg"
      :title="bigImgTit"
      :imgList="bigImgList"
      :indexVal="nowBig"
      @close="isBigImg=false">
    </carousel-modal>
  </div>
</template>
<script>
import {
  axiosHealthCardQueryHistory
} from "_o/api/operator-carrier";
import {auditsMap} from './fields'
import carouselModal from '_a/carousel-modal/index.vue'
export default {
  name: "history-modal",
  props: {
    show: {
      type: Boolean
    },
    driverInfo:{}
  },
  components: {
    carouselModal
  },
  data() {
    return {
      auditsMap,
      isShow: this.show,
      panelVal: "1",
      isAdd: false,
      isPan:false,
      dataList:[],
      info:{},
      nowMonth:'',
      isBigImg: false,
      bigImgTit: '查看图片',
      bigImgList: [],
      nowBig: 0
    };
  },
  methods: {
    getList(value){
      if(value){
        this.nowMonth = value
      }else{
        this.nowMonth = this.$moment(new Date()).format('YYYY-MM')
      }
      let month = this.nowMonth
      let params = {
        queryMonth: month,
        driverUuid:this.driverInfo.driverUuid
      }
      axiosHealthCardQueryHistory(params).then(res => {
        this.info = res.data.data||{}
        this.dataList = this.info.records
        this.isPan = true
      })
    },
    closeModal() {
      this.$emit("close");
    },
    openBigImg(tit,list,i){
      this.bigImgTit = tit
      this.bigImgList = list
      this.nowBig = i
      this.isBigImg = true
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.getList()
        this.panelVal = "1"
      }
    }
  }
};
</script>
<style lang="less">
.history-modal {
  .ivu-modal{
    top:35px;
  }
  .ivu-collapse-simple{
    border-top:none;
    font-size: 13px;
    color: #333;
  }
  .ivu-modal-header {
    border: none;
    padding-bottom: 0px;
  }
  .ivu-modal-body {
    min-height: 400px;
    max-height: 610px;
    overflow-y: scroll;
    padding: 5px 16px 30px 16px;
  }
  .ivu-collapse,.ivu-collapse-item{
    border-color:#afb6c3;  
  }
  .ivu-collapse-item {
    .ivu-collapse-header {
      position: relative;
      padding-left: 5px;
      .ivu-icon.ivu-icon-ios-arrow-forward {
        position: absolute;
        right: 0;
        margin-right: 0;
        top: 10px;
        font-size: 17px;
      }
    }
    .ivu-collapse-content {
      padding-left: 5px;
    }
  }
  .flex-box {
    display: flex;
    margin:4px 0 14px 0;
  }
  .item-label {
    min-width: 110px;
    color: #333;
  }
  .head-box{
    font-size: 16px;
    line-height: 34px;
    padding:4px 0;
    .big-tit{
      display: inline-block;
      color:#333;
      font-size: 22px;
      margin-right: 20px;
    }
  }
  .info-box{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height:32px;
    margin-top:8px;
    padding:8px 0;
    border-top: 1px solid #bbb;
    border-bottom: 1px dashed #efefef;
    .left20{
      display: inline-block;
      margin-left: 20px;
    }
  }
  .red{
    color:#ed4014;
  }
  .content-box{
    padding:8px;
    border-top:1px dashed #caced6;
    img{
      width:80px;
      height:55px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.big-img-modal{
  .ivu-carousel-item{
    text-align: center;
  }
  .img-out{
    width:600px;
    height:600px;
    background: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  img{
    max-width:100%;
    max-height:100%;
  }
}
</style>
