<template>
  <div>
    <ul class="wrapper">
      <li>
        <div class="title">司机姓名：</div>
        <div>{{ detailObj.driverName }}</div>
      </li>
      <li>
        <div class="title">手机号：</div>
        <div>{{ detailObj.driverMobile  }}</div>
      </li>
      <li>
        <div class="title">申请时间：</div>
        <div>{{ detailObj.applyTime }}</div>
      </li>
      <li>
        <div class="title">补偿类型：</div>
        <div>{{ detailObj.subRecoupName }}</div>
      </li>
      <li>
        <div class="title">补偿时段：</div>
        <div>{{ detailObj.applyStartTime + ' - ' + detailObj.applyEndTime }}</div>
      </li>
      <li>
        <div class="title">补偿时长：</div>
        <div>{{ detailObj.applyTimes + " 小时" }}</div>
      </li>
      <li>
        <div class="title">图片：</div>
        <div>
          <a href="#" v-if="detailObj.imageList.length === 0 ? false : true" @click.prevent="handleCarousel">
            <img 
              
              :src="detailObj.imageList[0]"
            />
            
          </a>
          <span v-else style="color:red"> 没有更多的图片哦~ </span>
        </div>
      </li>
      <li>
        <div class="title">视频：</div>
        <div>
          <a href="#"  v-if="detailObj.videoList.length === 0 ? false: true" @click.prevent="handleVideo">
            <video :src="detailObj.videoList[0]" style="width:148px; height:85px;"></video>
          </a>
           <span v-else style="color:red"> 没有更多的视频哦~ </span>
        </div>
      </li>
      <li>
        <div class="title">说明：</div>
        <div>{{detailObj.reason }}</div>
      </li>
      <li>
        <div class="title">
          <i style="color:red;">*</i> 备注：
        </div>
        <div>
          <i-input
            v-model="isShowRemark"
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            size="large"
            style="width:400px;"
            :disabled="isDetailOrCancel === 1 ? true : false"
            @on-blur="sendMsgToParent"
          ></i-input>
        </div>
      </li>
    </ul>

    <carousel-modal
      :show="isCarouselShow"
      :imgList="detailObj.imageList"
      :indexVal="nowBig"
      @close="isCarouselShow=false"
    ></carousel-modal>

    <video-modal :show="isOpenVideo" :videoUrl="detailObj.videoList[0]" @close="isOpenVideo=false"></video-modal>
  </div>
</template>

<script>
import carouselModal from "_a/carousel-modal/index.vue";
import videoModal from "_a/video-modal/index.vue";
export default {
  components: {
    videoModal,
    carouselModal
  },
  props: {
    detailObj: {
      type: Object
    },
    isDetailOrCancel: {
      type: Number
    }
  },
  data() {
    return {
      isOpenVideo: false,
      nowBig: 0,
      isCarouselShow: false,
      isVideoShow: false,
      cancelRemark: ""
    };
  },
  created() {
    this.cancelRemark = "";
  },
  methods: {
    // 弹出模态框，展示图片轮播
    handleCarousel() {
      console.log(111);
      this.isCarouselShow = true;
    },
    handleVideo() {
      this.isOpenVideo = true;
    },
    sendMsgToParent() {
      console.log("失去焦点");
      console.log(this.cancelRemark);
      this.busEvents.$emit("sendRemarkMsg", this.cancelRemark)
      // this.cancelRemark = ""
    }
  },
  computed: {
    isShowRemark: {
      get() {
        return this.isDetailOrCancel === 1
          ? this.detailObj.remark
          : this.cancelRemark;
      },
      set(val) {
        this.cancelRemark = val;
        return;
      }
    }
  }
};
</script>


<style lang="less" scoped>
.wrapper {
  padding: 0 0px;

  color: #333333;

  li {
    overflow: hidden;
    margin-bottom: 15px;
    div {
      float: left;
    }
    .title {
      width: 80px;
      text-align: right;
    }

    img {
      width: 148px;
      height: 85px;
    }
  }
}

.banner {
  width: 100%;

  background-color: pink;
  position: relative;
  .page {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    ul {
      overflow: hidden;
      li {
        float: left;
        width: 20px;
      }
    }
  }
}

.currentPage {
  color: red;
}
</style>