<template>
  <div class="time-progress">
    <div class="play" @click="changePlayStatus">
      <div class="play-stop" v-if="playStatus">
        <Icon type="ios-pause" :size="24"></Icon>
      </div>
      <div class="play-start" v-else>
        <Icon type="ios-play" :size="24"></Icon>
      </div>
    </div>
    <div class="slide-progress">
      <Slider
        v-model="value"
        @on-input="handleInput"
        :show-tip="showTip"
        :min="startTime"
        :max="endTime"
        :step="step"
        :tip-format="timeFormat"
        @on-change="changeSlide"
      ></Slider>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props:{
    startTime:{
      type:[String,Number],
      default(){
        return Date.now() - 30 *60*1000
      }
    },
    endTime:{
      type:[String,Number],
      default(){
        return Date.now() - 30*60*1000
      }
    },
    stageDuration:{
      type:[String,Number],
      default(){
        return 2000
      }
    }
  },
  data() {
    return {
      playStatus: false, // 播放状态
      dateNow: Date.now(),
      startRemain: 0, // 开始时间
      remain: 20 * 60 * 1000, // 结束时间
      showTip: "always",
      speed: (500 / 60) * 1000,
      rafId: null,
      // endTime: Date.now(), // 单位分钟
      // startTime: Date.now(), // 开始时间往前Y分钟
      value: Date.now() - 30 *60*1000,
      step: 60 * 1000,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initTime();
      this.start();
    },
    initTime() {
      this.remain = this.endTime - this.startTime;
        this.value = this.startTime;
    },
    changeSlide(v){
      this.$emit("timeUpdate", v);
    },
    timeFormat(v) {
      return moment(v).format("HH:mm");
    },
    changePlayStatus() {
      this.playStatus = !this.playStatus;
      if (this.playStatus) {
        this.macroTick();
      } else {
        this.resetTime();
      }
    },
    resetTime() {
      this.remain = this.endTime - this.startTime;
      this.pause();
    },
    start() {
      this.rafId && clearInterval(this.rafId);
      this.playStatus = true;
      this.macroTick();
    },
    getRemain() {
      return Math.max(this.endTime - this.value, 0);
    },
    pause() {
      this.playStatus = false;
      this.rafId && clearInterval(this.rafId);
      this.rafId = null;
    },
    macroTick() {
      this.rafId = setInterval(() => {
        this.value += 60 * 1000;
        if (moment(this.value).isSameOrAfter(moment(this.endTime),"minute")) {
            this.pause();
            setTimeout(()=>{
              this.value = this.startTime;
              this.$emit("timeUpdate", this.value);
            },this.stageDuration)
            this.value = this.endTime;
          return;
        }
        this.$emit("timeUpdate", this.value);
      }, this.stageDuration);
    },
    handleInput(v) {
      if (this.value < this.startTime) {
        this.value = this.startTime;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.time-progress {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.slide-progress {
  width: calc(~"100% - 80px");
  margin-left: 20px;
}
</style>
