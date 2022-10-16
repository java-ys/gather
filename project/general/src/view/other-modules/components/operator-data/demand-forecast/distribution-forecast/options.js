import moment from "moment";

let option = {
  tooltip: {
    trigger: "axis",
    renderMode: "html",
    formatter: (value) => {
      if (value.length) {
        let MM = `${value[0].axisValue}`.substring(4,6);
        let DD = `${value[0].axisValue}`.substring(6,8);
        let HH = `${value[0].axisValue}`.substring(8,10);
        let mm = `${value[0].axisValue}`.substring(10,12);
        const callCntList = value.find(k=>k.seriesId==='callCntList');
        const predictCallCntList = value.find(k=>k.seriesId==='predictCallCntList');
        const FreeCarList = value.find(k=>k.seriesId==='FreeCarList');
        const predictionFreeCarList = value.find(k=>k.seriesId==='predictionFreeCarList');
        const gapList = value.find(k=>k.seriesId==='gapList');
        const predictGapList = value.find(k=>k.seriesId==='predictGapList');

        let str1 = ''
        if(predictCallCntList){
          str1+=`预测值${predictCallCntList.value}`
        }
        if(callCntList){
          if(str1){
            str1+=`/ 实际值${callCntList.value}`
          }else{
            str1+=`实际值${callCntList.value}`
          }
        }
       
        let str2 ='';
        if(predictionFreeCarList){
          str2+=`预测值${predictionFreeCarList.value}`
        }
        if(FreeCarList){
          if(str2){
            str2+=`/ 实际值${FreeCarList.value}`
          }else{
            str2+=`实际值${FreeCarList.value}`
          }
        }
        let str3 ='';
        if(predictGapList){
          str3+=`预测值${predictGapList.value}`
        }
        if(gapList){
          if(str3){
            str3+=`/ 实际值${gapList.value}`
          }else{
            str3+=`实际值${gapList.value}`
          }
        }
        if(str1){
          str1 = `<div>呼叫：${str1}</div>`
        }
        if(str2){
          str2 = `<div>空闲车辆：${str2}</div>`
        }
        if(str3){
          str3 = `<div>供需差：${str3}</div>`
        }
        return `<div>
        <div>
          开始时间：${MM}-${DD} ${HH}:${mm}
        </div>
        <div>
        ${str1}${str2}${str3}
        </div>
        </div>`;
      }
      return "";
    },
  },
  legend: {
    selectedMode: true,
    data: [
      {
        name: "需求实际值",
        lineStyle: {
          type: "dashed",
        },
      },
      {
        name: "需求预测值",
        lineStyle: {
          color: "#fff",
          borderType: "dashed",
          type: "dashed",
        },
        itemStyle: {
          color: "#fff",
          borderType: "dashed",
        },
      },
      {
        name: "运力实际值",
        lineStyle: {
          type: "dashed",
        },
      },
      {
        name: "运力预测值",
        lineStyle: {
          type: "dashed",
        },
      },
      {
        name: "供需差实际值",
        lineStyle: {
          type: "dashed",
        },
      },
      {
        name: "供需差预测值",
        lineStyle: {
          type: "dashed",
        },
      },
    ],
    // left: 10,
    // left:0,
    left: 10,
    // orient:'vertical',
    top: 10,
  },
  // toolbox: {
  //   feature: {
  //     dataZoom: {
  //       yAxisIndex: "none",
  //     },
  //     restore: {},
  //     saveAsImage: {},
  //   },
  // },
  axisPointer: {
    link: [
      {
        xAxisIndex: "all",
      },
    ],
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
      xAxisIndex: [0, 1, 2],
    },
    {
      realtime: true,
      start: 0,
      end: 100,
      xAxisIndex: [0, 1, 2],
    },
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
      xAxisIndex: [0, 1, 2],
    },
  ],
  grid: [
    {
      left: 60,
      right: 50,
      top: "15%",
      height: "20%",
    },
    {
      left: 60,
      right: 50,
      top: "35%",
      height: "20%",
    },
    {
      left: 60,
      right: 50,
      top: "58%",
      height: "30%",
    },
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      axisLine: { onZero: true },
      data: [],
      show: false,
      // axisPointer: {
      //   label: {
      //     formatter: function (params) {
      //       console.log("xAxis params",params);
      //       return 1
      //     }
      //   }
      // }
    },
    {
      gridIndex: 1,
      type: "category",
      boundaryGap: true,
      axisLine: { onZero: true },
      data: [],
      position: "top",
      show: false,
      axisPointer: {
        label: {
          show: false,
        },
      },
    },
    {
      gridIndex: 2,
      type: "category",
      boundaryGap: true,
      axisLine: { onZero: true },
      data: [],
      axisLabel: {
        formatter: function (value, index) {
          let MM = `${value}`.substring(4,6);
          let DD = `${value}`.substring(6,8);
          let HH = `${value}`.substring(8,10);
          let mm = `${value}`.substring(10,12);
          if (`${HH}:${mm}` == "00:00") {
            return `${MM}-${DD} ${HH}:${mm}`
          }
          return `${HH}:${mm}`
        },
        rotate: 30,
      },
      axisPointer: {
        label: {
          show: false,
        },
      },
    },
  ],
  yAxis: [
    {
      gridIndex: 0,
      type: "value",
    },
    {
      gridIndex: 1,
      type: "value",
      inverse: true,
    },
    {
      gridIndex: 2,
      name: "",
      type: "value",
    },
  ],
  series: [
    {
      name: "需求实际值",
      type: "bar",
      large: true,
      symbolSize: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      hoverAnimation: false,
      itemStyle: {
        color: "#4F6A80",
        opacity: 0.5,
      },
      data: [],
      id:'callCntList'
      
    },
    {
      name: "需求预测值",
      type: "line",
      large: true,
      symbolSize: 0,
      hoverAnimation: false,
      lineStyle: {
        color: "#4F6A80",
        width: 1,
        type: "dashed",
        opacity: 1,
      },
      itemStyle: {
        color: "#4F6A80",
        borderType: "dashed",
      },
      showAllSymbol: false,
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: [],
      id:'predictCallCntList'
    },
    {
      name: "运力实际值",
      type: "bar",
      large: true,
      hoverAnimation: false,
      xAxisIndex: 1,
      yAxisIndex: 1,
      symbolSize: 8,
      itemStyle: {
        color: "#f67a37",
        opacity: 0.5,
      },
      data: [],
      id:'FreeCarList'
    },
    {
      name: "运力预测值",
      type: "line",
      large: true,
      symbolSize: 0,
      hoverAnimation: false,
      lineStyle: {
        color: "#f67a37",
        width: 1,
        type: "dashed",
        opacity: 1,
      },
      itemStyle: {
        color: "#f67a37",
        borderType: "dashed",
      },
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [],
      id:'predictionFreeCarList'
    },
    {
      name: "供需差实际值",
      type: "bar",
      large: true,
      hoverAnimation: false,
      symbolSize: 8,
      xAxisIndex: 2,
      yAxisIndex: 2,
      itemStyle: {
        color: "#f4d9d2",
        opacity: 1,
      },
      data: [],
      id:'gapList'
    },
    {
      name: "供需差预测值",
      type: "line",
      large: true,
      symbolSize: 0,
      hoverAnimation: false,
      lineStyle: {
        color: "#f4d9d2",
        width: 1,
        type: "dashed",
        opacity: 1,
      },
      itemStyle: {
        color: "#f4d9d2",
        borderType: "dashed",
      },
      xAxisIndex: 2,
      yAxisIndex: 2,
      // prettier-ignore
      data: [],
      id:'predictGapList'
    },
  ],
};
export { option };
