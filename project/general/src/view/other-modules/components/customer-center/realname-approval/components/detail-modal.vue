<template>
 <div>
    <Modal
      v-model="isShow"
      :width="900"
      title="实名认证详情"
      class="new-ue detail-modal"
      :mask-closable="false"
      @on-cancel="cancelFun"
    >
      <Form :model="formData" ref="formData">
        <Row>
          <Col span="8">
            <FormItem label="乘客手机号：">
              <span>{{formData.passengerMobile}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="乘客姓名：">
              <span>{{formData.certifiedName}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="证件类型：">
              <span>{{cardMap[formData.certificateType]}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="证件编号：">
              <span>{{formData.certifiedNumber}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="出生日期：">
              <span>{{formData.certifiedBirthday}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row class="img-box">
          <Col span="12">
            <FormItem label="证件照片：">
              <img class="card-img" @click="showBigImg(0)" :src="formData.photo.certificatePicture" alt="证件照片">
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="手持证件照片：">
              <img class="card-img" @click="showBigImg(1)" :src="formData.photo.holdCertificatePicture" alt="手持证件照片">
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formData.reviewStatus!==1">
          <Col span="8">
            <FormItem label="审核结果：">
              <span>{{formData.reviewStatus===2?'审核通过':'审核不通过'}}</span>
            </FormItem>
          </Col>
          <Col span="8" v-if="formData.reviewStatus===3">
            <FormItem label="驳回原因：">
              <span>{{formData.reason}}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancelFun">关闭</Button>
      </div>
    </Modal>
    <big-img-modal 
      :show="isBigImg"
      :imgList="bigImgList"
      :indexVal="nowBig"
      @close="isBigImg=false">
    </big-img-modal>
  </div>
</template>
<script>
import { certificateDetail } from "_o/api/passenger.js";
import { reasonMap,cardMap } from'../fields'
import bigImgModal from '_a/carousel-modal/index.vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {},
  },
  components: {
    bigImgModal
  },
  data() {
    return {
      isShow: this.show,
      reasonMap,
      cardMap,
      formData: {
        photo:{
          certificatePicture:'',
          holdCertificatePicture:''
        }
      },
      addLoading: false,
      isBigImg: false,
      bigImgList:[],
      nowBig:0

    };
  },
  mounted() {
  },
  methods: {
    cancelFun(){
      this.formData={
        photo:{
          certificatePicture:'',
          holdCertificatePicture:''
        }
      }
      this.$emit('close')
    },
    getDetail(){
      certificateDetail({uuid:this.info.uuid	}).then(res => {
        this.formData=res.data.data
        this.formData.photo=JSON.parse(this.formData.attachmentJson)
        this.bigImgList=[this.formData.photo.certificatePicture,this.formData.photo.holdCertificatePicture]
      })
    },
    showBigImg(index){
      this.nowBig = 0
      if(index==0){
        this.bigImgList=[this.formData.photo.certificatePicture,this.formData.photo.holdCertificatePicture]
      }else{
        this.bigImgList=[this.formData.photo.holdCertificatePicture,this.formData.photo.certificatePicture]
      }
      this.isBigImg = true
    }
  },
  watch: {
    show(newVal) {
      this.isShow = this.show;
      console.log(this.show)
      this.isShow && this.getDetail()
    }
  }
};
</script>
<style lang="less" scoped>
.img-box{
  min-height:250px;
}
.card-img{
  width:280px;
  height:180px;
  cursor: pointer;
}
</style>
