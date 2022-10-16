<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="薪酬计算预警" :visible="salaryWarning" width="40%" @close="closeDialog">
    <div v-if="isShow" style="width:85%;margin-left:57px;">
      <p>{{warnForm.cityName}}{{warnForm.newWeek}},周奖励初始计算结果,总人数{{details.totalPersonNum}},工资总额{{details.totalSalary}}元,平均薪资{{details.averageSalary}}元</p>
      <div id="salaryChart" :style="{ height: '400px', margin: '30px 30px 30px 0' }"></div>
      <p>其中,有{{details.personNumOverAverage}}人本周周奖励高于三周平均薪资,超出额大于20%&nbsp;{{details.personNumOverTwentyPercent}}人,超出额大于50%&nbsp;{{details.personNumOverFiftyPercent}}人,超出额大于80%&nbsp;{{details.personNumOverEightyPercent}}人,具体可点击下载下方预警报表</p>
    </div>
    <div class="button-group" style="text-align:right;margin-top:35px;">
      <el-button type="primary" @click="exportExcel">下载预警报表</el-button>
      <el-button type="info" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getWeekSalaryWarning } from "_o/api/salary/salary";
import { downLoadWeekSalaryWarning } from "_o/api/salary/exportApi";
import { excelDownload } from "_o/common/common"
export default {
  name: "salaryWarning",
  props: {
    salaryWarning: {
      type: Boolean,
      default: false
    },
    warnForm: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      details: {
        totalPersonNum: "",
        totalSalary: "",
        averageSalary: "",
        personNumOverAverage: "",
        personNumOverTwentyPercent: "",
        personNumOverFiftyPercent: "",
        personNumOverEightyPercent: ""
      },
      isShow: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialogHandle", "salaryDetail");
    },
    // 司机薪酬分布
    getWeekData() {
      let params = { cityCode: this.warnForm.cityCode, queryWeek: this.warnForm.queryWeek };
      getWeekSalaryWarning(params).then((res) => {
        if (res.data.success) {
          this.details = res.data.data
          this.isShow = true;
          let data1 = ["0%", "5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%", "100%"]; let
            data2 = [];
          if (this.details.charts.length > 0) {
            // 首位加最大值
            data2.push(null);
            this.details.charts.forEach((item, index, array) => {
              data2.push(item.salaryNum);
            });
          }
          this.drawLine(data1, data2);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      })
    },
    exportExcel() {
      let params = { cityCode: this.warnForm.cityCode, queryWeek: this.warnForm.queryWeek };
      downLoadWeekSalaryWarning(params).then(res => {
        excelDownload(res.data, "周奖励预警报表数据信息");
      });
    },
    drawLine(data1, data2) {
      if (this.isShow) {
        this.$nextTick(() => {
          this.renderChart(data1, data2)
        })
      }
    },
    renderChart(data1, data2) {
      let sc = document.getElementById("salaryChart");
      if (sc) {
        let salaryChart = this.$echarts.init(sc);
        let option =  {
          grid: {
            right: "15%",
            left: "9%"
          },
          tooltip: {
            trigger: "axis",
            formatter(params) {
              for (let x in params) {
                if (params[x].data == null) {
                  params[x].data = "";
                  return String(params[x].data);
                } else {
                  return "周奖励:" + params[x].data;
                }
              }
            }
          },
          xAxis: {
            type: "category",
            data: data1,
            name: "司机薪酬分布",
            min: 0,
            interval: 10,
            boundaryGap: false
          },
          yAxis: {
            type: "value",
            name: "周奖励"
          },
          series: [
            {
              type: "line",
              data: data2,
              areaStyle: {}
            }
          ]
        }
        salaryChart.setOption(option, true);
      }
    }
  }
};
</script>

<style>
</style>
