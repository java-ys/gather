<template>
  <div>
    <ul class="wrapper">
      <li>
        <div class="title">司机姓名：</div>
        <div>{{ detailObj.driverName }}</div>
      </li>
      <li>
        <div class="title">手机号：</div>
        <div>{{ detailObj.mobilePhone }}</div>
      </li>
      <li>
        <div class="title">申请时间：</div>
        <div>{{ detailObj.apply }}</div>
      </li>
      <li>
        <div class="title">补偿时长：</div>
        <div>{{ detailObj.duration }}</div>
      </li>

      <li>
        <div class="title">图片：</div>
        <!-- 根據picList渲染多個圖片 -->
        <div v-for="(item,index) of imgList" :key="index">
          <a href="#" @click.prevent="handleImgOpen(index)">
            <img v-if="item ==='' ? false: true" :src="item" alt="点击展示更多图片" />
          </a>        
        </div>
        <span v-if="imgList.length === 0 ? true : false">没有更多的图片哦~</span>
      </li>

      <li>
        <div class="title">视频：</div>
        <div v-for="(item,index) of videoUrlList" :key="index">
          <a href="#" @click.prevent="handleVideo(index)">
            <video v-if="item ==='' ? false : true" :src="item" width="148px" height="85px"></video>
          </a>
        </div>
        <span v-if="videoUrlList.length === 0 ? true : false">没有更多的视频哦~</span>
      </li>
      <li>
        <div class="title">说明：</div>
        <div>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
      </li>
      <li>
        <div class="title">
          <i style="color:red;">*</i> 备注：
        </div>
        <div>
          <i-input
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            size="large"
            style="width:400px;"
          ></i-input>
        </div>
      </li>
    </ul>

    <Modal
      v-model="isShowImgModal"
      title="图片详情"
      footer-hide
      width="60%"
    >
      <img :src="imgList[imgIndex]" width="100%" alt="">
    </Modal>

    <video-modal :show="isOpenVideo" :videoUrl="videoUrlList[videoIndex]" @close="isOpenVideo=false"></video-modal>
  </div>
</template>

<script>
import videoModal from "_a/video-modal/index.vue";
export default {
  components: {
    videoModal,
  },
  props: {
    detailObj: {
      type: Object,
      default: ""
    }
  },
  data() {
    return {
      isOpenVideo: false,
      videoUrlList: ["http://www.w3school.com.cn/i/movie.mp4", "http://www.w3school.com.cn/i/movie.mp4"],
      nowBig: 0,
      isShowImgModal: false,
      imgIndex: null,
      videoIndex: null,
      isVideoShow: false,
      imgList: [
        "https://i1.mifile.cn/a4/xmad_15535933141925_ulkYv.jpg",
        "https://i1.mifile.cn/a4/xmad_15532384207972_iJXSx.jpg",
        "https://i1.mifile.cn/a4/xmad_15517939170939_oiXCK.jpg"
      ],
    };
  },
  methods: {
    // 弹出模态框，展示图片轮播
    handleImgOpen(index) {
      this.imgIndex = index;
      this.isShowImgModal = true;
    },
    handleVideo(index) {
      this.videoIndex = index;
      this.isOpenVideo = true;
    }
  },
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
      margin-right: 10px;
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