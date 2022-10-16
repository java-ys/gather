<!--
 * @Descritption: 
 * @Author: wangzhenyu
 * @Date: 2021-01-05 14:37:52
 * @LastEditors: wangzhenyu
 * @LastEditTime: 2021-01-12 10:27:49
-->
<template>
  <div
    class="videoPlayer"
    :style="`height: ${height}px; width: ${width}px`"
    @click="fullScreen"
  >
    <template v-if="!isAlarm">
      <div class="videoforCar_text">{{ videoText }}</div>
      <div
        v-if="isflash || errorText"
        class="openFlash"
        :style="
          `width: ${width}px; height: ${height}px; line-height: ${height}px`
        "
      >
        <div v-if="errorText && false">{{ errorText }}</div>
      </div>
      <div
        v-if="loading"
        class="loading"
        :style="`width: ${width}px; height: ${height}px;`"
      ></div>
      <div :id="id"></div>
      <div v-if="!loading" class="srs-controls-panel">
        <div class="refreshPlayer" @click.stop="initPlayer"></div>
        <template>
          <Icon
            v-if="isPause"
            class="resumePlayer"
            @click.stop="resumePlayer"
            type="md-arrow-dropright"
          />
          <Icon
            v-else
            class="pausePlayer"
            @click.stop="pausePlayer"
            type="ios-pause"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div v-if="videoText" class="videoforCar_text">{{ videoText }}</div>
      <div class="video-wrap">
        <Dropdown placement="left-start" class="rate" @on-click="onChangeRate">
          <span class="text">{{ rate }}x</span>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in rates" :key="index" :name="item.value">{{ item.label }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <video
          ref="video"
          :src="src"
          preload="auto"
          autoplay
          muted
          controls
          class="video-content"
        ></video>
      </div>
    </template>
  </div>
</template>

<script>
// import Chimee from "chimee";
// import flv from "chimee-kernel-flv";
export default {
  name: "flv-player",
  props: {
    id: {
      type: String
    },
    src: {
      type: String,
      default: ""
    },
    videoText: {
      type: String,
      default: ""
    },
    isAlarm: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 437
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      loading: true,
      errorText: undefined,
      showControl: false,
      isPause: false,
      isflash: false, // 判读是否开启了flash
      player: null, // 视频实例
      timer: null,
      codeList: [],
      count: 0,
      rate: 1,
      rates: [
        { value: 5, label: "5x" },
        { value: 2, label: "2x" },
        { value: 1.5, label: "1.5x" },
        { value: 1, label: "1x" },
        { value: 0.5, label: "0.5x" },
      ]
    };
  },
  watch: {
    // codeList(val) {
    //   if (val.includes(404) && val[val.length -1] === undefined) {
    //     this.initPlayer()
    //   }
    // }
  },
  methods: {
    onChangeRate(val) {
      this.rate = val
      this.$refs["video"].playbackRate = val
    },
    /**
     * @description 初始化视频类
     * */
    initPlayer() {
      // this.loading = true;
      this.errorText = undefined;
      this.isPause = false;
      let that = this;
      if (this.player) {
        this.player.destroy();
      }
      this.player = new WasmPlayer(
        null,
        this.id,
        e => {
          this.codeList.push(e.code);
          if (e.code) {
            this.initPlayer();
          } else if (this.codeList.includes(404) && e === "play") {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.codeList = [];
              this.initPlayer();
            }, 8000);
          }
        },
        {
          HideKbs: true, // 是否隐藏实时转码率
          openAudio: true, // 是否打开音频
          BigPlay: false, // 是否开启大的播放按钮
          Height: true, // 播放器尺寸是否继承父盒子的
          autoplay: 1,
          cbUserPtr: that // 自定义指针(this的指向)
        }
      );
      this.loading = false;
      this.player.play(this.src, 1);
    },
    fullScreen() {
      if (this.player) {
        this.player.fullScreen();
      }
    },
    /**
     * @description 视频类
     * @param id {String} id
     * @param src {String} 视频地址
     * */
    SrsPlayerClass(id, src) {
      if (!src || this.isAlarm) return;
      let self = this;
      try {
        if (this.player) {
          this.player = null;
        }
        // eslint-disable-next-line no-undef
        this.player = new SrsPlayer(id, this.width, this.height);
        this.player.set_srs_player_url("srs_player.swf?v=1.0.0");
        this.player.on_player_ready = function() {
          self.player.set_bt(2);
          self.player.set_mbt(3);
          self.player.play(src);
          setTimeout(() => {
            self.loading = false;
          }, 500);
        };
        const restart = function() {
          $(self.$el)
            .find(".refreshPlayer")
            .trigger("click");
        };

        let count = 0;
        this.player.on_player_timer = function(
          time,
          buffer_length,
          kbps,
          fps,
          rtime
        ) {
          if (kbps > 0 && fps > 0) {
            count = 0;
          }
          if (kbps === 0 || fps === 0) {
            count++;
            if (count > 20) {
              count = 0;
              restart();
            }
          }
        };

        this.player.on_player_metadata = function(a, b, c, d) {
          self.player.set_fs("screen", 100);
          self.player.set_dar(-1, -1);
        };
        this.player.on_player_status = function(id, code) {
          if (["rejected", "closed", "failed"].indexOf(id) > -1) {
            if (id === "closed") {
              self.errorText = "获取视频失败，请检查播放链接是否有效";
              setTimeout(() => {
                $(self.$el)
                  .find(".refreshPlayer")
                  .trigger("click");
              }, 1000);
            } else if (id === "rejected") {
              self.errorText = "服务器拒绝连接";
            } else if (id === "failed") {
              self.errorText = "服务器连接失败";
            }
            self.player.stop();
            self.loading = false;
            self.$emit("closeVideo");
          }
          self.showControl = true;
        };
        this.player.start();
        return this.player;
      } catch (e) {
        this.$Message.error("SrsPlayer加载失败");
      }
    },
    pausePlayer() {
      this.player && this.player.pause && this.player.pause();
      this.isPause = true;
    },
    resumePlayer() {
      this.player && this.player.resume && this.player.resume();
      this.isPause = false;
    }
  },
  beforeDestroy() {
    if (this.player) {
      // this.player.stopLoad()
      this.player.destroy(); // // easyPlayer
      clearTimeout(this.timer);
      this.timer = null;
      this.codeList = [];
      this.count = 0;
    }
  },
  destroyed() {
    this.$emit("on-destroy");
  }
};
</script>

<style scoped lang="less">
.videoPlayer {
  padding: 10px;
  position: relative;
  background-color: black;
  .videoforCar_text {
    z-index: 101;
    font-size: 14px;
    color: #dbebf5;
    text-shadow: 0 0 2px #0d7ab0;
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .openFlash {
    z-index: 100;
    text-align: center;
    background-color: black;
    font-size: 14px;
    color: #ff4500;
    > a {
      color: #ff4500;
    }
  }
  .video-content {
    width: 100%;
    height: 100%;
    background: black;
    object-fit: fill;
  }
  .loading {
    z-index: 100;
    position: absolute;
    background-image: url("./img/videoBg.png");
    background-size: 100% 100%;
  }
  .srs-controls-panel {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 16px;
    height: 3em;
    z-index: 1000;

    /deep/.refreshPlayer,
    /deep/.resumePlayer,
    /deep/.pausePlayer {
      float: right;
      cursor: pointer;
      z-index: 1001;
      position: relative;
    }
    /deep/.refreshPlayer {
      width: 3em;
      height: 3em;
      background: url("./img/refreshPlayer.png") no-repeat center;
      background-size: 18px 18px;
      font-size: 12px !important;
      margin-top: 6px;
    }
    /deep/.resumePlayer,
    /deep/.pausePlayer {
      width: 26px;
      height: 20px;
      margin-top: 8px;
      color: white;
      font-size: 30px !important;
    }
    /deep/.pausePlayer {
      width: 20px;
      height: 20px;
      color: white;
      margin-top: 13px;
      font-size: 20px !important;
    }
  }
}

.video-wrap {
  position: relative;
  .text {
    padding: 0 0 0 10px;
  }
  .rate {
    position: absolute;
    top: 10px;
    right: 15px;
    color: white;
    z-index: 1;
  }
  /deep/ .ivu-dropdown-menu {
    min-width: auto;
  }
}
</style>
