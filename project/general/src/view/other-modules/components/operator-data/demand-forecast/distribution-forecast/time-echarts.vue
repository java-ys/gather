<template>
  <div class="time-echarts" ref="timeEcharts"></div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";
import { option as op } from "./options";
export default {
  data() {
    return {
      echartsEl: null,
      startTime: new Date("2022-04-25 00:00:00").getTime(),
      endTime: new Date("2022-04-25 23:59:00").getTime(),
      dataList: {
        xData: [],
        dataSource1: [],
        dataSource2: [],
        dataSource3: [],
        dataSource4: [],
        dataSource5: [],
        dataSource6: [],
      },
      options: op,
    };
  },
  mounted() {
    // this.init();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    init(data) {
      this.initData(data);
      window.addEventListener("resize", this.handleResize);
    },
    handleResize() {
      this.echartsEl.resize();
    },
    initData(data) {
      let dataSouces = data;
      this.options.series.map((k, index) => {
        if (index == 0) {
          k.data = dataSouces.callCntList;
        }
        if (index == 1) {
          k.data = dataSouces.predictCallCntList;
        }
        if (index == 2) {
          k.data = dataSouces.FreeCarList;
        }
        if (index == 3) {
          k.data = dataSouces.predictionFreeCarList;
        }

        if (index == 4) {
          k.data = dataSouces.gapList;
        }
        if (index == 5) {
          k.data = dataSouces.predictGapList;
        }
      });
      this.options.xAxis.map((k) => {
        k.data = dataSouces.timeData;
      });
      this.createEcharts();
    },
    createEcharts() {
      console.log("createEcharts");
      this.$nextTick(() => {
        const echartEl = this.$refs.timeEcharts;
        this.echartsEl = echarts.init(echartEl, {
          width: "auto",
        });
        this.options && this.echartsEl.setOption(this.options);
        this.echartsEl.on("legendselectchanged", (params) => {
          let callCarShow = true;
          let carSuplyShow = true;
          let diffShow = true;
          if (
            !params.selected["需求实际值"] &&
            !params.selected["需求预测值"]
          ) {
            callCarShow = false;
          }
          if (
            !params.selected["运力实际值"] &&
            !params.selected["运力预测值"]
          ) {
            carSuplyShow = false;
          }
          if (
            !params.selected["供需差实际值"] &&
            !params.selected["供需差预测值"]
          ) {
            diffShow = false;
          }
          // 需求数据不展示
          if (!callCarShow) {
            this.options.yAxis[0].min = 0;
            this.options.yAxis[0].max = 150;
          }else{
            this.options.yAxis[0].min = 'dataMin';
            this.options.yAxis[0].max = 'dataMax';;
          }
          if(!carSuplyShow){
            this.options.yAxis[1].min = 0;
            this.options.yAxis[1].max = 150;

          }else{
            this.options.yAxis[1].min = 'dataMin';
            this.options.yAxis[1].max = 'dataMax';;
          }
          if(!diffShow){
            this.options.yAxis[2].min = 0;
            this.options.yAxis[2].max = 150;
          }else{
            this.options.yAxis[2].min = 'dataMin';
            this.options.yAxis[2].max = 'dataMax';;
          }
          
          this.echartsEl.setOption(this.options);
          console.log(params, "legendselectchanged");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.time-echarts {
  position: relative;
  height: 600px;
  // padding: 20px;
  // margin: auto;
  // box-sizing: border-box;
}
</style>
