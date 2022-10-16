<template>
  <div id="wasmWrap" class="wasm-wrap">
    <div id="fullscreenWrap" class="fullscreen-wrap">
      <div :id="'loading' + canvasId" class="loadEffect" style="display:none;">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <canvas :id="canvasId" :width="playerWidth" :height="playerHeight" :style="{ 'transform-origin': 'top left', transform: 'scaleX(' + scaleX + ') scaleY(' + scaleY +')' }"></canvas>
      <div class="control-warp">
        <Icon v-if="playerStatus === 0 || playerStatus === 2" class="no-padding" type="md-play" @click="playVideo(true)" />
        <Icon v-if="playerStatus === 1" class="no-padding" type="md-pause" @click="playVideo(false)" />
        <Icon class="no-padding" type="md-square" @click="stopVideo" />
        <span class="track-padding">
        </span>
        <input id="timeTrack" type="range" :value="duration" style="display:none;">
        <Slider v-model="currentPlayTime" :min="0" :max="duration" style="flex:1;margin-left:10px;" @on-change="handleSliderChange"></Slider>
        <span id="timeLabel" class="time-label">
          00:00:00/00:00:00
        </span>
        <Icon v-if="!isFullscreen" class="no-padding" type="md-expand" @click="fullscreen(true)" />
        <Icon v-else type="md-contract" class="no-padding" @click="fullscreen(false)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "wasm-players",
  props: {
    src: {
      type: String,
      default: ""
    },
    protocol: {
      type: String,
      default: "http"
    },
    canvasId: {
      type: String,
      default: "playCanvas"
    }
  },
  data() {
    return {
      playerWidth: 0,
      playerHeight: 0,
      defaultProtos: {
        http: {
          waitLength: 524288,
          stream: false,
        },
        ws: {
          waitLength: 512 * 1024,
          stream: false,
        },
        httpFlv: {
          waitLength: 512 * 1024,
          stream: true,
        }
      },
      player: null,
      playerStatus: 0,
      isFullscreen: false,
      duration: 0,
      containerWidth: 0,
      currentPlayTime: 0, // 当前播放时间
      scaleX: 1, // 设置canvas缩放等级
      scaleY: 1
    }
  },
  watch: {
    src: function(val) {
      if (val) {
        this.reloadVideo()
      }
    }
  },
  created() {
    this.player = new Player()
    if(this.src) this.reloadVideo();
  },
  beforeDestroy() {
    this.player.stop();
    this.player = null;
    ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"].forEach((item, index) => {
      window.removeEventListener(item, this.fullscreenChange)
    });
    window.removeEventListener("resize", this.resize)
  },
  mounted() {
    this.initEvent()
    // 获取wasm-wrap 宽高设置canvas宽高
    let wasmWrap = document.getElementById("fullscreenWrap")
    this.playerWidth = wasmWrap.offsetWidth
    this.playerHeight = wasmWrap.offsetHeight
    // this.initUI()
  },
  methods: {
    initEvent() {
      ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange"].forEach((item, index) => {
        window.addEventListener(item, this.fullscreenChange)
      });
      window.addEventListener("resize", this.resize)
    },
    fullscreenChange() {
      let isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      if (!isFullscreen) {
        this.scaleX = 1
        this.scaleY = 1
        this.isFullscreen = false
      }
    },
    resize() {
      let wasmWrap = document.getElementById("wasmWrap")
      this.playerWidth = wasmWrap.offsetWidth
      this.playerHeight = wasmWrap.offsetHeight
      this.initUI()
    },
    initUI() {
      // 获取wasm-wrap 宽高设置canvas宽高
      // let wasmWrap = document.getElementById("fullscreenWrap")
      // this.playerWidth = wasmWrap.offsetWidth
      // this.playerHeight = wasmWrap.offsetHeight
      // 动态获取
      if (this.isFullscreen) {
        let innerWidth = window.innerWidth
        let innerHeight = window.innerHeight
        this.scaleX = innerWidth / this.playerWidth
        this.scaleY = innerHeight / this.playerHeight
      }
    },
    initPlayer() {
      let loadingDiv = document.getElementById("loading" + this.canvasId);
      this.player.setLoadingDiv(loadingDiv);
      let currentState = this.player.getState();
      console.log(currentState, "当前播放状态")
      if (this.playerStatus === 0 || this.playerStatus === 2) {
        this.playerStatus = 1
      }

      let canvas = document.getElementById(this.canvasId);
      this.player.play(this, this.src, canvas, function (e) {
        console.log("play error " + e.error + " status " + e.status + ".");
        if (e.error === 1) {
          console.log("Finished.");
        }
      }, this.defaultProtos[this.protocol].waitLength, this.defaultProtos[this.protocol].stream);
      let timeTrack = document.getElementById("timeTrack");
      let timeLabel = document.getElementById("timeLabel");
      this.player.setTrack(timeTrack, timeLabel);
    },
    handleSliderChange(val) {
      this.player.seekTo(val * 1000)
      this.playerStatus = 1
    },
    reloadVideo() {
      this.player.stop()
      setTimeout(() => {
        this.initPlayer()
      }, 500)
    },
    playVideo(tag) {
      if (tag) {
        this.initPlayer()
      } else {
        this.player.pause()
        this.playerStatus = 2
      }
    },
    stopVideo() {
      this.player.stop()
      this.playerStatus = 0
    },
    playEnd() {
      this.playerStatus = 0
      this.$emit("play-end")
    },
    fullscreen(tag) {
      if (tag) {
        let wasmWrap = document.getElementById("fullscreenWrap")
        if (wasmWrap.RequestFullScreen) {
          wasmWrap.RequestFullScreen();
        } else if (wasmWrap.webkitRequestFullScreen) {
          wasmWrap.webkitRequestFullScreen();
        } else if (wasmWrap.mozRequestFullScreen) {
          wasmWrap.mozRequestFullScreen();
        } else if (wasmWrap.msRequestFullscreen) {
          wasmWrap.msRequestFullscreen();
        } else {
          alert("This browser doesn't supporter fullscreen");
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else {
          alert("Exit fullscreen doesn't work");
        }
      }
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style lang="less" scoped>
.wasm-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .fullscreen-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .loadEffect {
        width: 120px;
        height: 120px;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0; 
        z-index: 999;
      }

      .loadEffect span{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: lightgreen;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
      }
      
      @-webkit-keyframes load{
        0%{
          opacity: 1;
        }
        100%{
          opacity: 0.2;
        }
      }
      .loadEffect span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.13s;
      }
      .loadEffect span:nth-child(2){
        left: 14px;
        top: 14px;
        -webkit-animation-delay:0.26s;
      }
      .loadEffect span:nth-child(3){
        left: 50%;
        top: 0;
        margin-left: -8px;
        -webkit-animation-delay:0.39s;
      }
      .loadEffect span:nth-child(4){
        top: 14px;
        right:14px;
        -webkit-animation-delay:0.52s;
      }
      .loadEffect span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-8px;
        -webkit-animation-delay:0.65s;
      }
      .loadEffect span:nth-child(6){
        right: 14px;
        bottom:14px;
        -webkit-animation-delay:0.78s;
      }
      .loadEffect span:nth-child(7){
        bottom: 0;
        left: 50%;
        margin-left: -8px;
        -webkit-animation-delay:0.91s;
      }
      .loadEffect span:nth-child(8){
        bottom: 14px;
        left: 14px;
        -webkit-animation-delay:1.04s;
      }
  }
  .control-warp {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 36px;
    line-height: 36px;
    background-color: rgba(0, 0, 0, 0.3);
    display: none;
    vertical-align: middle;
    padding: 0 5px;
    .no-padding {
      height: 36px;
      line-height: 36px;
      font-size: 20px;
      color: #FFFFFF;
      padding: 0 5px 0 0;
    }
    .time-label {
      font-size: 15px;
      height: 36px;
      line-height: 36px;
      padding: 0 10px;
      color: #FFFFFF;
    }
  }
  &:hover .control-warp{
    display: flex;
  }
}
</style>