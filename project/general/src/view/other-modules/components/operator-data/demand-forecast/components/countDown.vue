<template>
  <div class="count-down">
    <div v-if="countType"> 
      <span class="block">{{ timeData }}</span>
    </div>
    <div v-else>
      <span class="block">{{ timeData | timeFormate }}</span>
      <span class="colon"></span>
      <span class="block">{{ timeData.hours }}</span>
      <span class="colon">:</span>
      <span class="block">{{ timeData.minutes }}</span>
      <span class="colon">:</span>
      <span class="block">{{ timeData.seconds }}</span>
      <span class="colon"> 后到期 </span>
    </div>
    
  </div>
</template>
<script>
import { isSameSecond, parseTimeData, parseFormat ,raf, cancelRaf} from "./util";
import moment from "moment"
export default {
  props: {
    millisecond: Boolean,
    time: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: "HH:mm:ss",
    },
    autoStart: {
      type: Boolean,
      default: true,
    },
    countType:0, // 0:倒计时 1:正计时
    startRemain:{
      type:Number,
      default:0
    },
    endCount:{
      type:Number,
      default:0
    },
    timeEmitDistance:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      counting:false,
      finalRemain:0,// 缓存倒计时时间
      remain: 0,
      beginTime:Date.now(),
      endTime:Date.now()
    };
  },
  computed: {
    timeData() {
      // 定时emit更新外部数据
      // if(!this.counting){
      //   return 
      // }
      if(this.timeEmitDistance){
        if(this.finalRemain - this.remain >= this.timeEmitDistance){
          this.finalRemain = this.remain 
          this.$emit("timeUpdate",this.endTime - this.remain)
        }
      }
      if(!this.countType){
        return parseTimeData(this.remain,this.countType);
      }else{
        const time = new Date(this.endTime - this.remain)
        return moment(time).format("YYYY-MM-DD HH:mm:ss")
      }
    },

    formattedTime() {
      return parseFormat(this.format, this.timeData);
    },
  },

  // watch: {
  //   time: {
  //     immediate: true,
  //     handler: "reset",
  //   },
  // },

  beforeDestroy() {
    this.pause();
  },

  methods: {
    start() {
      if (this.counting) {
        return;
      }

      this.counting = true;
      this.tick();
    },

    pause() {
      this.counting = false;
      cancelRaf(this.rafId);
    },

    reset() {
      this.pause();
      this.remain = this.time;
      this.finalRemain = this.time;
      this.endTime = Date.now() + this.startRemain +  this.remain;
      this.start();
    },

    tick() {
      if (this.millisecond) {
        this.microTick();
      } else {
        this.macroTick();
      }
    },

    microTick() {
      this.rafId = raf(() => {
        this.setRemain(this.getRemain());

        if (this.remain !== 0) {
          this.microTick();
        }
      });
    },

    macroTick() {
      this.rafId = raf(() => {
        const remain = this.getRemain();
        if (!isSameSecond(remain, this.remain) || remain === 0) {
          this.setRemain(remain);
        }

        if (this.remain !== 0) {
          this.macroTick();
        }
      });
    },

    getRemain() {
      // 如果正计时
      // if(this.countType){
      //   return Date.now() - this.beginTime
      // }
      return Math.max(this.endTime - Date.now() - this.startRemain, 0);
    },

    setRemain(remain) {
      this.remain = remain;

      if (remain === 0) {
        this.pause();
        this.$emit("finish");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.block {
  display: inline-block;
  text-align: center;
  line-height: 18px;
  min-width: 18px;
  height: 18px;
  // background: #fa5a5a;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ff8533;
}
.colon {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 34, 34, 0.6);
}
</style>
