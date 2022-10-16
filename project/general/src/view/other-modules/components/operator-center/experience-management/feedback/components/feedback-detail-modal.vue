<template>
  <Modal v-model="isModel" title="提报单详情" width="1000" @on-ok="close" @on-cancel="close">
    <Card>
      <Row>
        <Col span="24">
        <span>提报单类型: {{detail.feedbackTypeName}}</span>
        </Col>
        <Col span="24">
        <span>提报单描述/建议方案: {{detail.feedbackContent}}
          </span>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px">
      <Row>
        <Col span="24">
        <span>图片：</span>
        </Col>
        <Col span="24">
          <img :src="item.url" alt="" v-for="(item, index) in img" :key="index"  class="image" @click="viewImg(item.url)">
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px">
      <Row>
        <Col span="6">
        <span>手机号码：{{detail.userMobile}}</span>
        </Col>
        <Col span="10">
        <span>提交时间：{{detail.feedbackDate}}</span>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px">
      <Row>
        <Col span="5">
        <span>提报单状态：{{statusMap[detail.assessStatus]}}</span>
        </Col>
        <Col span="5">
        <span>评估等级：{{gradeMap[detail.assessLevel]}}</span>
        </Col>
        <Col span="5">
        <span>处理方式：{{modeMap[detail.assessHandle]}}</span>
        </Col>
        <Col span="5">
        <span>T币奖励：{{detail.assessCoin}}</span>
        </Col>
      </Row>
      <Row style="margin-top: 20px">
        <Col span="5">
        <span>评估人：{{detail.assessUserName}}</span>
        </Col>
        <Col span="10">
        <span>评估时间：{{detail.assessDate}}</span>
        </Col>
      </Row>
      <Row style="margin-top: 20px">
        <Col span="5">
        <span>解决人：{{detail.resolveUserName}}</span>
        </Col>
        <Col span="10">
        <span>解决时间：{{detail.resolveDate}}</span>
        </Col>
      </Row>
      <Row style="margin-top: 20px">
        <Col span="5">
        <span>T币发放人：{{detail.sendUserName}}</span>
        </Col>
        <Col span="10">
        <span>发放时间：{{detail.sendDate}}</span>
        </Col>
      </Row>
      <Row style="margin-top: 20px" v-show="detail.assessStatus==2">
          <Col span="24">
          <span>未采纳原因：{{detail.assessReason}}</span>
          </Col>
        </Row>
    </Card>
    <Modal title="查看图片" v-model="imgVisible "  :mask-closable= false >
      <img :src="imgUrl" v-if="imgVisible" style="width: 100%" id="viewimg">
      <Button type="primary" @click="rotate" style="margin-top: 15px">旋转</Button>
      <div slot="footer">
      </div>
   </Modal>
  </Modal>
</template>
<script>
  import { feedbackDetail} from '_o/api/experience.js';
  import {statusMap, gradeMap, modeMap,} from '../feedback-detail/fields.js'
  export default {
    props: {
      isDetailModal: {
        type: Boolean,
        default: false
      },
      params: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        isModel: false,
        detail:{},
        imgVisible:false,
        statusMap,
        gradeMap,
        modeMap,
        imgUrl:"",
        deg:90,
        img:[]
      };
    },
    created() {
      this.img = [];
    },
    methods: {
      close() {
        this.$emit("close");
      },
      viewImg(url){
        this.imgVisible=true;
        this.imgUrl=url;
        this.deg=0;
      },
      rotate(){
            this.deg += 90;
            document.getElementById("viewimg").style.transform = "rotate(" + this.deg + "deg)";
      },
      getInfo() {
        this.isLoading = true
        feedbackDetail(this.params).then(res => {
          if (res.data.success) {
            this.detail = res.data.data || {};
            if(this.detail.feedbackImgUrl){
              this.img = this.detail.feedbackImgUrl.split(',').map(itm=>{
                return {url:itm}
              })
            }
            this.isLoading = false
          } else {
            this.isLoading = false
            this.$Message.error('请求数据出错')
          }
        })
      }
    },
    watch: {
      isDetailModal(newVal) {
        this.isModel = newVal;
        if (newVal) {
          this.getInfo()
        }
      }
    }
  };
</script>
<style scoped>
 .image{
  width: 300px;
  height:200px;
  margin-right: 8px;
  border: 1px solid;
  cursor: pointer; 
 }
</style>