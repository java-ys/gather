<template>
  <div class="view-video">
    <div class="head">
      <div class="time">
        <DatePicker
          type="date"
          placeholder="日期"
          style="width: 120px"
          v-model="extractDate"
        ></DatePicker>
        <div class="slider">
          <input
            id="js-range-slider"
            v-model="sliderVal"
            type="text"
            name="my_range"
            value
          />
        </div>
      </div>
      <div class="action">
        <RadioGroup
          class="video-type"
          v-model="videoType"
          @on-change="onChangeVideoType"
        >
          <Radio :label="1">车内</Radio>
          <Radio :label="2">车外</Radio>
        </RadioGroup>
        <div>
          <Button type="primary" @click="extractVideos">抽取</Button>
          <Button type="primary" @click="getVideos">刷新</Button>
          <Button type="primary" @click="openDownloadVideoModal">下载</Button>
        </div>
      </div>
    </div>
    <div class="videoPart">
      <div class="left" @click="playOnline">
        <wasm-player v-if="videoFormat=='h265'" :src="videoSrc" />
        <flv-player
          v-else
          id="online"
          ref="online"
          videoText
          :src="videoSrc"
          :onLine="false"
          :width="850"
          :height="500"
          :isAlarm="true"
        ></flv-player>
      </div>
      <div class="right">
        <div v-if="videos.length > 0" class="videoList">
          <CheckboxGroup v-model="videosCheck">
          <div v-for="(item, index) in videos" :key="index" class="item">
            <div @click="playVideo(item, index)">
              <Checkbox v-if="syncVideo" :label="item.videoId" class="checkbox" @click.native.stop="() => {}"><span></span></Checkbox>
              <img src="./assets/smallPic.png" alt />
            </div>
            <p class="time-range">{{ item.timeRange }}</p>
          </div>
          </CheckboxGroup>
        </div>
        <div v-else>暂无视频</div>
      </div>
    </div>
    <Modal
      v-model="isShowDownloadVideo"
      class="downloadModal"
      :width="1000"
      title="视频下载"
      @on-cancel="handleCancelModal"
    >
      <div class="selectAllAndReverse">
        <Checkbox v-model="selectAll">全选</Checkbox>
        <Checkbox v-model="selectReverse" @on-change="selectReverseFn"
          >反选</Checkbox
        >
      </div>
      <div class="allVideoWrap">
        <CheckboxGroup v-model="checkboxGroupData">
          <template v-for="(item, index) in videos">
            <Checkbox :key="index" :label="item.videoId" border>
              {{ item.startTime + " - " + item.endTime }}
            </Checkbox>
          </template>
        </CheckboxGroup>
      </div>
      <div class="downloadModal" style="margin-top: 20px;">
        <div class="checked">
          <span>共</span>
          <span>{{ videos.length }}</span>
          <span style="margin-right:15px">个</span>
          <span>已选</span>
          <span>{{ checkboxGroupData.length }}</span>
          <span style="margin-right:15px">个</span>
        </div>
      </div>
      <div class="downloadBtn" slot="footer">
        <Button size="large" type="text" @click="handleCancelModal"
          >取消</Button
        >
        <Button size="large" type="primary" @click="handleDownloadVideo"
          >确认</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import $ from "jquery";
import "ion-rangeslider";
import "ion-rangeslider/css/ion.rangeSlider.css";
import moment from "moment";
import FlvPlayer from "_c/flv-player";
import {
  fetchVideos,
  postExtractVideos
} from "_o/api/work-order/related-video";
import config from "@/config/config";
import http from "axios";
import {
  fileToken,
  fetchFilesUrl,
  fetchVideoUrl
} from "_o/api/work-order/common";
import fileDownload from "js-file-download";
import _ from "lodash";
import WasmPlayer from '@/components/wasm-player';
import { queryFileInfo } from "_o/api/work-order/wo-detail";

export default {
  components: {
    FlvPlayer,
    WasmPlayer
  },

  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    const downloadUrl =
      (process.env.NODE_ENV === "development"
        ? config.uploadUrl.dev
        : config.uploadUrl.pro) + "/file/download/view";
    return {
      downloadUrl,
      videoType: 1,
      isShowVideoModal: false,
      isShowDownloadVideo: false,
      selectReverse: false,
      sliderVal: "",
      videoSrc: "",
      videoFormat: '',
      extractDate: "",
      rangeTime: [],
      videos: [
      ],
      checkboxGroupData: [], // 已选中的值
      videosCheck: [],
      syncVideo: false
    };
  },

  computed: {
    selectAll: {
      get() {
        return this.checkboxGroupData.length === this.videos.length;
      },
      set(val) {
        this.checkboxGroupData = val
          ? this.videos.map(item => item.videoId)
          : [];
        val && (this.selectReverse = false);
      }
    }
  },

  watch: {
    basicInfo(val) {
      const { taskId } = this.$route.query
      const { woCode, bizState } = val;
      if (woCode) {
        let audit = false
        switch(bizState) {
          case "CS":
          case "ZS":
          case "SJ_CS_SS":
          case "SJ_ZS_SS":
            audit = true
            break;
        }
        if (audit && taskId) {
          this.syncVideo = true
        }
        this.videoSrc = ""
        this.init();
      }
    },

    videosCheck(newVal, oldVal) {
      if (newVal.length > oldVal.length) {
        this.busEvents.$emit("syncVideo", {
          type: 1,
          data: newVal[newVal.length - 1]
        })
      } else {
        this.busEvents.$emit("syncVideo", {
          type: 0,
          data: _.difference(oldVal, newVal)[0],
          isList: true
        })
      }
    },
  },

  created() {
    this.busEvents.$on("delSyncVideo", val => {
      this.videosCheck.splice(this.videosCheck.indexOf(val), 1)
    })
  },

  mounted() {},

  methods: {
    init() {
      this.$nextTick(() => {
        this.initSlider();
      });
      this.getVideos();
    },
    async getVideos(emit) {
      const {
        videoType,
        basicInfo: { woCode },
        _uploadUrl
      } = this;
      const params = {
        woCode,
        videoType
      };
      try {
        const {
          data: { success, data }
        } = await fetchVideos(params);
        if (success) {
          if (emit) {
            this.$Message.success("刷新成功");
          }
          const { videoResList } = data;
          this.videos = videoResList.map(item => {
            const { videoId, startTime, endTime } = item;
            const date = moment(startTime).format("YYYY-MM-DD")
            const x = {
              videoId,
              startTime,
              endTime,
              timeRange: `${date} ${moment(startTime).format("HH:mm:ss")}-${moment(endTime).format("HH:mm:ss")}`
            };
            return x
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getFileToken(params) {
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        return data;
      }
      return null;
    },

    async getFileLink(ids, params) {
      let arr = [];
      try {
        const token = await this.getFileToken(params);
        if (token) {
          const params = { uuids: ids };
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
        console.log(error)
      }
      return arr;
    },

    async extractVideos() {
      const {
        videoType,
        basicInfo: { carVin, woCode },
        extractDate,
        rangeTime: [startTime, endTime]
      } = this;
      const date = moment(extractDate).format("YYYY-MM-DD");
      const startDate = `${date} ${startTime?startTime:'00:00'}:00`;
      const endDate = `${date} ${endTime?endTime:'02:00'}:00`;
      const params = {
        vin: carVin,
        eventUuid: woCode,
        videoType,
        startTime: startDate,
        endTime: endDate
      };
      try {
        const {
          data: { success }
        } = await postExtractVideos(params);
        if (success) {
          this.$Message.success("成功");
        }
      } catch (error) {
        console.log(error);
      }
    },

    initSlider() {
      const {
        basicInfo: { slideStartTime, slideEndTime }
      } = this;

      // this.extractDate = moment(illegalTime).format("YYYY-MM-DD");
      // const dateTimestamp = moment(illegalTime).format("x");
      // const todayTimestamp = moment(illegalTime)
      //   .startOf("day")
      //   .format("x");
      //   let from = 0,
      //   to = 120;
      // if (dateTimestamp - todayTimestamp > 5 * 60 * 1000) {
      //   const leadTime = moment(illegalTime)
      //     .subtract(5, "m")
      //     .format("YYYY-MM-DD HH:mm:ss");
      //   from = moment(leadTime).hours() * 60 + moment(leadTime).minute();
      //   const delayTime = moment(leadTime)
      //     .add(2, "h")
      //     .format("YYYY-MM-DD HH:mm:ss");
      //   to =
      //     moment(leadTime).hours() >= 22
      //       ? 1440
      //       : moment(delayTime).hours() * 60 + moment(delayTime).minute();
      // }

      this.extractDate = moment(slideStartTime).format("YYYY-MM-DD");
      const from = moment(slideStartTime).hours() * 60 + moment(slideStartTime).minute() || 0;
      const to = moment(slideEndTime).hours() * 60 + moment(slideEndTime).minute() || 120;
     // 初始化起止时间、如不返回默认 00:00 ~ 02:00
      if(slideStartTime && slideEndTime){
          this.rangeTime = [ moment(slideStartTime).format('HH:mm'),moment(slideEndTime).format('HH:mm')]
      } else{
          this.rangeTime = ['00:00','02:00']
      }
      if (this.rangeSlider) {
        this.rangeSlider.update({from, to})
      } else {
        let _this = this;
        $("#js-range-slider").ionRangeSlider({
          skin: "modern",
          type: "double",
          step: 1,
          // grid_snap: true,
          grid: true,
          min: 0,
          grid_num: 24, // 调整网格的间隔
          // max: 24,
          max: 1440, // 24小时的分钟数
          // values: [0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1300, 1440],
          from,
          to,
          hide_min_max: true,
          drag_interval: true,
          max_interval: 120,
          decorate_both: true,
          prettify_enabled: true,
          prettify_separator: ",",
          prettify: _this.prettifyGrid,
          onFinish: _this.changeGridVal,
          onStart: _this.changeGridVal
        });
        this.rangeSlider = $("#js-range-slider").data("ionRangeSlider");
      }
    },

    prettifyGrid(data) {
      let hour = parseInt(data / 60, 10);
      let minute = 0;
      if (hour > 0) {
        minute = data - hour * 60;
      } else {
        minute = data;
      }
      function isPreZero(val) {
        let val2 = null;
        if (Number(val) < 10) {
          val2 = "0" + val;
        } else {
          val2 = String(val);
        }
        return val2;
      }
      let result;
      if (isPreZero(hour) + ":" + isPreZero(minute) === "24:00") {
        result = "23:59";
      } else {
        result = isPreZero(hour) + ":" + isPreZero(minute);
      }
      return result;
    },

    changeGridVal(e) {
      const { from_pretty, to_pretty } = e;
      this.rangeTime = [from_pretty, to_pretty];
    },

    onChangeViewVideo() {
      this.isShowVideoModal = !this.isShowVideoModal;
    },

    async playVideo(item, index) {
      const { videoId } = item;
      const {
        data: { success, msg, data }
      } = await queryFileInfo({uuid: videoId});
      if (success) {
        if (data) {
          this.videoSrc = data.url;
          this.videos[index].url = data.url;
          this.videoFormat = data.videoProtocal;
        } else {
          this.$Message.info(msg);
        }
      }
    },

    playOnline() {
      // this.$refs["online"].initPlayer();
    },

    openDownloadVideoModal() {
      this.isShowDownloadVideo = true;
    },

    selectReverseFn(val) {
      this.selectReverse = val;
      // 获取选中的值
      this.checkboxGroupData = this.videos
        .filter(item => this.checkboxGroupData.indexOf(item.videoId) < 0)
        .map(item => item.videoId);
    },

    handleCancelModal() {
      this.checkboxGroupData = [];
      this.isShowDownloadVideo = false;
    },

    async handleDownloadVideo() {
      if (!this.checkboxGroupData.length) {
        this.$Message.info("请选择视频");
        return false;
      }
      const token = await this.getFileToken({ doType: 1 });
      if (!token) return;
      this.$Message.warning("下载中，请稍后");
      this.checkboxGroupData.forEach(async item => {
        let url = this.downloadUrl + "/" + item;
        http({
          url: url,
          method: "get",
          headers: {
            token
          },
          responseType: "arraybuffer"
        }).then(res => {
          const index = this.videos.findIndex(x => x.videoId === item);
          const { startTime, endTime } = this.videos[index];
          fileDownload(res.data, startTime + " - " + endTime + ".mp4");
        });
      });
    },

    async getFileToken(params) {
      const {
        data: { data, success }
      } = await fileToken(params);
      if (success) {
        return data;
      }
      return null;
    },

    onChangeVideoType() {
      this.videos = [];
      this.getVideos(true);
    }
  }
};
</script>

<style lang="less" scoped>
.view-video {
  width: 1130px;
  padding: 20px;
}
.related-video {
  background-color: #091751;
  color: #028ef3;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.head {
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;
  .slider {
    flex: 0 0 80%;
    margin: 0 0 0 30px;
  }
  .time {
    display: flex;
    align-items: center;
    flex: 0 0 78%;
    margin: 0 2% 0 0;
  }
  .action {
    flex: 0 0 20%;
    .video-type {
      margin: 0 0 15px;
    }
  }
}

.modal-header {
  width: 100%;
  height: 30px;
  position: relative;

  img {
    position: absolute;
    top: 5px;
    right: 3%;
    color: #2adcea;
    cursor: pointer;
  }
}

.videoPart {
  display: flex;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;

  .left {
    width: 78%;
    // height: 558px;
    // float: left;
  }

  .empty-video {
    text-align: center;
  }
  .right {
    width: 20%;
    // height: 558px;
    // background-color: yellow;
    // float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 506px;

    .videoList {
      width: 100%;
      height: 100%;
      overflow-y: scroll;

      .item {
        width: 100%;
        margin-bottom: 10px;
        position: relative;

        .time-range {
          margin: 10px 0 0;
          font-size: 12px;
        }

        .checkbox {
          position: absolute;
          top: 8px;
          right: 0px;;
        }

        div {
          width: 100%;
          cursor: pointer;

          video {
            width: 100%;

            // margin-bottom: 10px;
          }

          img {
            width: 100%;
          }
        }

        // video {
        //   width: 100%;

        //   // margin-bottom: 10px;
        // }

      }
    }

    .videoList::-webkit-scrollbar {
      // display: none;
    }
  }
}

.downloadModal {
  /deep/ .ivu-modal-wrap {
    z-index: 9999;

    .ivu-modal-content {
      // height: 600px;
    }

    /deep/ .ivu-modal-header-inner {
      height: 34px;
      line-height: 34px;
      // color: #15c2fa;
      font-size: 16px;
    }

    .selectAllAndReverse {
      .ivu-checkbox-default {
        font-size: 14px;
        // color: #15c2fa;
        margin-right: 20px;
      }

      margin-bottom: 15px;
    }

    .allVideoWrap {
      width: 100%;
      height: 556px;
      overflow: auto;

      .ivu-checkbox-default {
        width: 100%;
      }

      .ivu-checkbox-group-item {
        height: 52px;
        // width: 373px;
        width: 32.3%;
        line-height: 52px;
        box-sizing: border-box;
        padding-left: 20px;
        border: 1px solid #028ef3;
        border-radius: 4px;
        margin-bottom: 10px;

        .ivu-checkbox {
          margin-right: 10px;
        }
      }
    }

    .allVideoWrap::-webkit-scrollbar {
      display: none;
    }
  }

  // /deep/ .ivu-checkbox-inner {
  //   background-color: #182054;
  //   border: 1px solid #0064b9;
  // }

  // /deep/ .ivu-checkbox-checked {
  //   background-color: #219ffb;
  // }
}
</style>
