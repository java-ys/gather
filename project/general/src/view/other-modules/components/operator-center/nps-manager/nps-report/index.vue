<template>
  <div>
    <Form
      inline="inline"
      :label-width="80"
    >
      <FormItem label="人群">
        <Select
          v-model="form.userType"
          style="width:120px"
          @on-change="form.titleTag = ''"
        >
          <Option
            v-for="(value, key) in personGroupMap"
            :key="key"
            :value="Number(key)"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="城市">
        <Cascader
          v-model="form.cityCodes"
          :data="cityList"
          style="width: 120px;"
          filterable
          clearable
          @on-clear="clearCascader"
        ></Cascader>
      </FormItem>
      <FormItem label="题型分层">
        <Select
          v-model="form.titleTag"
          clearable
          style="width:120px"
        >
          <Option
            v-for="(value, key) in titleTagMap[form.userType]"
            :key="key"
            :value="Number(key)"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="生效时间">
        <DatePicker
          v-model="form.dateTimeValue"
          confirm
          type="datetimerange"
          format="yyyy-MM-dd"
          :editable="false"
          placeholder="请选择日期"
          style="width: 240px"
          @on-change="changeUserType"
        ></DatePicker>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          style="margin-right:20px;width:100px"
          @click="search"
        >
          查询
        </Button>
        <Button
          type="default"
          style="width:100px"
          @click="reset"
        >
          清空
        </Button>
      </FormItem>
    </Form>
    <div
      id="myChart"
      :style="{ width: '100%', height: '500px' }"
    />
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getPersonGroup,
  personGroupMap,
  titleTagMap
} from "../fields";
import { getProvinceCityList } from "_g/api/common";
import { cpTranslate } from "@/libs/tools";

import { getReportData } from "_o/api/nps/app.js";

export default {

  data() {
    return {
      form: {
        userType: 1,
        titleTag: 0,
        cityCodes: ["320000", "320100"],
        endDay: "",
        startDay: "",
        dateTimeValue: ["", ""]
      },
      titleData: [],
      allData: [],
      personGroupMap,
      titleTagMap,
      cityList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getPersonGroup,
    getCityList() {
      // let params = {
      //   areaType: 2, //已开启城市
      //   businessLineList: [1, 2, 4] //快车、专车、出租车
      // };
      getProvinceCityList().then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data || []);
          this.cityList = list;
        }
      });
    },
    clearCascader() {
      this.form.cityCode = "";
      this.cityList = [];
    },
    changeUserType() {
      // this.search();
    },

    init() {
      this.form.dateTimeValue = [this.$moment(new Date()).subtract(7, "days").format("YYYY-MM-DD"), this.$moment(new Date()).format("YYYY-MM-DD")]
      this.getCityList();
      this.search();
    },
    getCityCode() {
      let tmpLength = this.form.cityCodes.length
      let tmpCode = ""
      if (tmpLength > 0) {
        tmpCode = this.form.cityCodes[tmpLength - 1]
      }
      return tmpCode
    },
    search() {
      this.form.cityCode = this.getCityCode()
      let tmpForm = JSON.parse(JSON.stringify(this.form))
      delete tmpForm.cityCodes
      let params = {
        ...tmpForm,
        startDay: this.form.dateTimeValue[0] ? `${this.$moment(this.form.dateTimeValue[0]).format("YYYYMMDD")}` : "",
        endDay: this.form.dateTimeValue[0] ? `${this.$moment(this.form.dateTimeValue[1]).format("YYYYMMDD")}` : "",
      };
      delete params.dateTimeValue
      getReportData(params).then(res => {
        if (res.data.success) {
          let resData = res.data.data || [];
          let titleData = [];
          let allData = [];

          for (let i = 0; i < resData.length; i++) {
            let item = resData[i]
            titleData[i] = `${this.$moment(item["submitTime"]).format("YYYY-MM-DD")}`
            allData[i] = item.nps
          }
          this.titleData = titleData
          this.allData = allData
          this.drawLine();
        }
      });
    },

    drawLine() {

      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "3%",
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.titleData
        },
        yAxis: {
          type: "value"
        },
        dataZoom: [{
          type: "inside",
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100
        }],
        series: [
          {
            name: "NPS",
            type: "line",
            data: this.allData,
            smooth: true,
            // animationEasing: 'quadraticIn',
            // animationDuration: 1000,
            itemStyle: {
              normal: {
                color: "#6cb041",
                lineStyle: {
                  width: 3 // 设置线条粗细
                }
              }
            }
          }
        ]
      });
    },
    reset() {
      this.form = {
        userType: 1,
        titleTag: "",
        cityCode: "",
        endDay: "",
        startDay: "",
        dateTimeValue: [this.$moment(new Date()).subtract(7, "days").format("YYYY-MM-DD"), this.$moment(new Date()).format("YYYY-MM-DD")]
      }
      this.search();
    }
  }
};
</script>

<style scoped></style>
