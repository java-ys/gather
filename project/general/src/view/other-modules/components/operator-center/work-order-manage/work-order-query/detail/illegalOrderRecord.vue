<template>
  <div>
      <!-- <Card v-show="detailSnaps.valKey === 'CS'" class="card"> -->
      <Card class="card">
        <p slot="title">判责处理</p>
        <Row>
          <Col span="8"
            >判责结果：{{ tailInfo.length ? tailInfo[0].judgeResult === 1 ? "司机有责" : "司机无责" : "审核中" }}</Col
          >
        </Row>
        <template v-if="tailInfo.length">
          <br />
          <Row v-for="(item, index) in illegalLists" :key="index">
            <Col span="8">违规等级：{{ item.level }}</Col>
            <Col span="8">处罚金额：{{ item.forfeit }}元</Col>
            <br />
          </Row>
          <br />
          <Row>
            <Col>判责证据：</Col>
            <Col>
            <!-- 图片 -->
            <!-- <div v-for="(item, index) in temObj" :key="index">  -->
              <ViewPicture :data="temObj" class="view"></ViewPicture>
            <!-- </div> -->
            <!-- 音频 -->
              <ViewVideo :data="temObjVideo"></ViewVideo>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span="24">判责描述：{{ judgeDesc }}</Col>
          </Row>
        </template>
      </Card>
  </div>
</template>

<script>
import ViewPicture from "../components/ViewPicture";
import ViewVideo from "../components/ViewVideo";
import { judgeLabelMap } from "./fields.js";
import { fetchFilesUrl, fileToken } from "_o/api/work-order/common";
export default {
  components: {
    ViewPicture,
    ViewVideo
  },
  props: {
    tailInfo: {
      type: Array,
      default: () => []
    },
    recordInfo: {
      type: Array,
      default: () => []
    },
    illegalLists: {
      type: Array,
      default: () => []
    },
    picIdLists: {
      type: Array,
      default: () => []
    },
    videoIdLists: {
      type: Array,
      default: () => []
    },
    detailSnaps: {
      type: Object,
      default: () => ({})
    },
  },
  data(){
      return {
          judgeLabelMap,
          // detailSnap:{}
          judgeDesc:"",
          temObj:[],
          temObjVideo:[],
      }
  },
  watch:{
    detailSnaps(val) {
      let valJson = val?.valJson || {}
      this.init()
    }
  },
  methods: {
     init() {
      const recordInfo = this.detailSnaps.valJson
        var obj = JSON.parse(recordInfo);
        this.judgeDesc = obj.judgeDesc
        this.getFileLink()
        this.getVideoLink()
    },
// 拿Token
    async getFileToken() {
      let params = { doType: 2 }
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        return data;
      }
      return null;
    },
    // 图片
    async getFileLink() {
      let arr = [];
      let params = { doType: 2 }
      if(this.picIdLists.length == 0){
        return
      }
      try {
        const token = await this.getFileToken(params);
        if (token) {
          const params = { uuids: this.picIdLists };
          const {
            data: { data, success }
          } = await fetchFilesUrl(params, token);
          if (success && data) {
            for (let key in data) {
              const value = data[key];
              if (value) {
                arr.push({
                  key,
                  value
                });
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.temObj = arr.slice(0)
      // console.log(this.temObj)
      return arr;
    },
    // 视频
    async getVideoLink() {
      let arr = [];
      let params = { doType: 2 }
      if(this.videoIdLists.length == 0){
        return
      }
      try {
        const token = await this.getFileToken(params);
        if (token) {
          const params = { uuids: this.videoIdLists };
          const {
            data: { data, success }
          } = await fetchFilesUrl(params, token);
          if (success && data) {
            for (let key in data) {
              const value = data[key];
              if (value) {
                arr.push({
                  key,
                  value
                });
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.temObjVideo = arr.slice(0)
      return arr;
    },
  }
};
</script>

<style lang="less" scoped>
.card {
  margin: 0 0 25px;
}

.view {
  margin: 10px 0;
}
</style>
