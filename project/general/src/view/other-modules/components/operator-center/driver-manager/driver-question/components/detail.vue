<template>
  <div>
    <Modal
      v-model="isShow"
      :width="750"
      :title="typeInfo.title"
      :mask-closable="false"
      :footer-hide="true"
      @on-cancel="formReset(true)">
      <div class="flex-box">
        <span class="item-label" v-if="type===2">建议描述：</span>
        <span class="item-label" v-else>反馈问题：</span>
        <div>
          <pre class="pre-text">{{info.feedbackName}}</pre>
        </div>
      </div>
      <div class="flex-box top30" v-if="type===2">
        <div class="flex-box">
          <span class="item-label">分类：</span>
          <span class="item-value short-width">{{proposalTypeMap[info.proposalType]}}</span>
        </div>
      </div>
      <div class="flex-box top30" v-else>
        <div class="flex-box">
          <span class="item-label">一级分类：</span>
          <span class="item-value short-width">{{info.firstCatalogName}}</span>
        </div>
        <div class="flex-box">
          <span class="item-label">二级分类：</span>
          <span class="item-value">{{info.secondCatalogName}}</span>
        </div>
      </div>
      <div class="flex-box top30">
        <div class="flex-box">
          <span class="item-label">提交人：</span>
          <span class="item-value short-width">{{info.driverName}}</span>
        </div>
        <div class="flex-box">
          <span class="item-label">提交人ID：</span>
          <span class="item-value">{{info.driverNo}}</span>
        </div>
        <div class="flex-box">
          <span class="item-label">手机号：</span>
          <span class="item-value">{{info.driverPhone}}</span>
        </div>
      </div>
      <div class="flex-box top30">
        <div class="flex-box">
          <span class="item-label">所属城市：</span>
          <span class="item-value short-width">{{info.cityName}}</span>
        </div>
        <div class="flex-box">
          <span class="item-label">所属运营商：</span>
          <span class="item-value">{{info.agentName}}</span>
        </div>
        <div class="flex-box">
          <span class="item-label">所属司管：</span>
          <span class="item-value">{{info.driverManagerName}}</span>
        </div>
      </div>
       <div class="flex-box top30">
        <span class="item-label">提交时间：</span>
        <span class="item-value">{{info.submitTime}}</span>
      </div>
      <div class="flex-box top15">
        <span class="item-label">图片：</span>
        <div v-if="info.imagesList && info.imagesList.length>0" class="flex-box">
          <img v-for="(img,i) in info.imagesList" @click="openBigImg(info.imagesList,i)" :key="i" :src="img" alt="图片">
        </div>
        <span v-else>无数据</span>
      </div>
      <div class="flex-box top15" v-if="type===1">
        <span class="item-label">视频：</span>
        <span v-if="info.videoList && info.videoList.length>0">
          <span v-for="(video,i) in info.videoList" :key="i" @click="openVideo(video)" class="video-item">视频{{1+i}}</span>
        </span>
        <span v-else>无数据</span>
      </div>
      <Divider />
      <div class="right-btn-box">
        <Button type="primary" v-if="!isEdit" class="right15" @click="isEdit=true;">编辑答复</Button>
        <Button class="right15" v-if="isEdit" @click="cancelAnswer()">取消</Button>
        <Button type="primary" v-if="isEdit" class="right15" @click="submitAnswer()">提交</Button>
      </div>
      <Form class="top15" ref="answerForm" :model="addData" :rules="ruleValidate" :label-width="90">
        <FormItem label="答复内容：" class="ivu-form-item-required" prop="replyDesc">
          <Input
            style="width:450px"
            v-model="addData.replyDesc"
            type="textarea"
            :maxlength="50"
            :readonly="!isEdit"
            :autosize="{minRows: 3,maxRows: 5}"
            placeholder="请输入协议内容"
          />
          <span class="counter">( {{ addData.replyDesc ? addData.replyDesc.length:0 }}/50 )</span>
        </FormItem>
        <FormItem label="上传图片：">
          <v-upload
            :params="uploadParams"
            :action="upLoadUrl"
            :maxSize="imgSize"
            :isDetail="!isEdit"
            :maxUpLoadCount="5"
            :defaultList="addData.replyImgList"
            @on-upsuccess="getAnswerImg"
          ></v-upload>
          <span v-if="!isEdit && addData.replyImgList && addData.replyImgList.length===0">无数据</span>

        </FormItem>
      </Form>
    </Modal>
    <carousel-modal
      :show="isBigImg"
      :imgList="bigImgList"
      :indexVal="nowBig"
      @close="isBigImg=false">
    </carousel-modal>
    <video-modal
      :show="isOpenVideo"
      :videoUrl="videoUrl"
      @close="isOpenVideo=false">
    </video-modal>
  </div>
</template>
<script>
import carouselModal from '_a/carousel-modal/index.vue'
import videoModal from '_a/video-modal/index.vue'
import vUpload from "_a/v-upload/v-upload";
import {
  axiosDriverQuestionDetail,
  axiosDriverQuestionAddFeedback,
  axiosDriverProposalAddFeedback
} from "_o/api/operator-carrier";
import { proposalTypeMap } from '../../driver-suggest/fields'

let typeInfoMap = {
  1: {
    title: '问题详情',
    axiosFun: axiosDriverQuestionAddFeedback
  },
  2: {
    title: '建议详情',
    axiosFun: axiosDriverProposalAddFeedback
  }
}
export default {
  name: "driver-question-detail",
  props: {
    show: {
      type: Boolean
    },
    id: {},
    type: {
      default:1
    }
  },
  components: {
    carouselModal,
    videoModal,
    vUpload
  },
  data() {
    return {
      proposalTypeMap,
      isShow: this.show,
      info: {},
      addData: {
        replyDesc:'',
        replyImgList:[]
      },
      isBigImg: false,
      isOpenVideo: false,
      bigImgList:[],
      nowBig: 0,
      ruleValidate:{
        replyDesc: [{ required: true, message: '请填写答复内容', trigger: 'change' }]
      },
      videoUrl:'',
      isEdit: false,
      isReply: false,//是否回复了
      uploadParams: { imgType: 1 },
      upLoadUrl: this._baseUrl + '/common/uploadPics',
      imgSize: 200 // 200k
    };
  },
  computed: {
    typeInfo(){
      return typeInfoMap[this.type]
    }
  },
  methods: {
    getDetailInfo(){
      axiosDriverQuestionDetail({id:this.id}).then(res => {
        let data = res.data.data || {}
        data.replyImgList = []
        if(data.imgUrl) data.imagesList = data.imgUrl.split(',')
        if(data.videoUrl) data.videoList = data.videoUrl.split(',')
        if(data.replyImgUrl) data.replyImgUrl.split(',').forEach((item,i)=>{
          data.replyImgList.push({
            name: i,
            url:item
          })
        })
        this.info = data
        this.addData.replyDesc = data.replyDesc||''
        this.addData.replyImgList = [...data.replyImgList]
      })
    },
    openBigImg(list,i){
      this.bigImgList = list
      this.nowBig = i
      this.isBigImg = true
    },
    openVideo(video){
      this.isOpenVideo = true
      this.videoUrl = video
    },
    formReset(isBack=false) {
      this.$refs['answerForm'].resetFields();
      if(isBack){
        this.isEdit = false
        this.$emit('close',this.isReply)
      }
    },
    cancelAnswer(){
      this.isEdit=false
      this.formReset()
      this.addData.replyDesc = this.info.replyDesc||''
      this.addData.replyImgList = [...this.info.replyImgList]
    },
    submitAnswer(){
      this.$refs['answerForm'].validate(valid => {
        if (valid) {
          let params = {
            feedbackId: this.info.feedbackId,
            replyDesc: this.addData.replyDesc,
            replyImgUrl: this.addData.replyImgList.map(item=>item.url).join(',')
          }
          this.typeInfo.axiosFun(params).then(res => {
            this.$Message.success('答复保存成功')
            this.isEdit = false
            this.isReply = true
            this.getDetailInfo()
            this.formReset()
          })
        }
      })

    },
    // TODO /common/uploadPics改造
    getAnswerImg (res) {
      if (res.success) {
        let { picUrl: imgUrl } = res.data
        this.addData.replyImgList.push({
          name: this.addData.replyImgList.length,
          url: imgUrl
        })
      }
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if(this.isShow){
        this.isReply = false
        this.getDetailInfo()
      }
    }
  }
};
</script>
<style lang='less' src="../../style.less"></style>
<style lang="less" scoped>
  .flex-box {
    display: flex;
    img{
      width:100px;
      height:75px;
      margin-right: 15px;
    }
  }
  .item-label {
    min-width: 60px;
    font-weight: 600;
    color: #333;
  }
  .item-value {
    width: 180px;
    margin-right: 10px;
    &.short-width{
      width: 90px;
    }
  }
  .right-btn-box{
    display: flex;
    justify-content: flex-end;
  }
  .video-item{
    display: inline-block;
    margin-right: 15px;
    color: #2d8cf0;
    cursor: pointer;
    text-decoration: underline;
  }
</style>