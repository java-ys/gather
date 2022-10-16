<template>
  <div class="pay-content pr">
    <span class="aster" style="top: 4px;left: 78px">*</span>
    <div class="mt-40 tit">未支付时间</div>
    <div class="radio-c flex-r pr">
      <RadioGroup v-model="typeOuter" style="width: 100%" @on-change="typeOuterChange">
        <div class="flex-r mt-80">
          <div>
            <Radio :label="4"><span>动态时间</span></Radio>
          </div>
        </div>

        <div class="flex-r date-c">
          <Radio :label="3"><span>选定日期</span></Radio>
          <span class="mr-20">未支付起止日期</span>
          <DatePicker
            v-model="dateTime"
            type="datetimerange"
            class="item-width-d"
            placeholder="请选择起止日期"
            :editable="false"
          ></DatePicker>
        </div>
      </RadioGroup>
      <div class="flex-1 ab-1">
        <RadioGroup v-model="typeSub" vertical style="width: 100%" @on-change="typeSubChange">
          <div class="flex-r mb-10">
            <Radio :label="1"><span>未支付时间</span></Radio>
            <Input
              v-model="startHour"
              class="item-width"
              :maxlength="15"
              placeholder="输入时间"
              @on-keyup="toNumber(startHour, 'startHour')"
            ></Input
            ><span class="unit">小时</span><span class="gap">——</span>
            <Input
              v-model="endHour"
              class="item-width"
              :maxlength="15"
              placeholder="输入时间"
              @on-keyup="toNumber(endHour, 'endHour')"
            ></Input
            ><span class="unit">小时</span>
          </div>
          <div class="flex-r">
            <Radio :label="2"><span>未支付天数</span></Radio>
            <Input
              v-model="startDay"
              class="item-width"
              :maxlength="15"
              placeholder="输入时间"
              @on-keyup="toNumber(startDay, 'startDay')"
            ></Input
            ><span class="unit">天</span><span class="gap">——</span>
            <Input
              v-model="endDay"
              class="item-width"
              :maxlength="15"
              placeholder="输入时间"
              @on-keyup="toNumber(endDay, 'endDay')"
            ></Input
            ><span class="unit">天</span>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
</template>

<script>
const dataKeyList = ['typeOuter', 'typeSub', 'startHour', 'endHour', 'startDay', 'endDay', 'dateTime']
// 支付时间设置
export default {
  data() {
    return {
      typeOuter: "", // 动态时间4 选定日期3
      typeSub: "", // 未支付时间1 未支付天数2
      startHour: "", // 未支付时间开始小时
      endHour: "", // 未支付时间结束小时
      startDay: "", // 未支付天数开始天
      endDay: "", // 未支付天数结束天
      dateTime: "",
    };
  },
  methods: {
    init(p) {
      if(!p) return
      const { filterType,startHour,endHour,startDay,endDay,filterStartTime, filterEndTime } = p || {}
      if(filterType > 2) {
        this.typeOuter = filterType
      } else {
        this.typeOuter = 4
        this.typeSub = filterType
      }
      this.startHour = startHour
      this.endHour = endHour
      this.startDay = startDay
      this.endDay = endDay
      this.dateTime = [filterStartTime, filterEndTime]
    },
    restore() {
      dataKeyList.forEach(k => {
        this[k] = ""
      })
    },
    toNumber(val, key) {
      let v = `${val}`.replace(/[^\d\.]/g, "");
      let vArr = v.split(".");
      if (vArr.length > 2) {
        v = vArr.slice(0, 2).join(".");
      }
      if (vArr[1] && vArr[1].length > 2) {
        v = (+v).toFixed(2);
      }
      this[key] = v;
    },
    typeSubChange(v) {
      this.typeOuter = 4
      this.typeSub = v
    },
    typeOuterChange(v) {
      if(v - 3 === 0) {
        this.typeSub = ""
      }
    }
  },
};
</script>

<style scoped lang="less">
.pay-content {
  margin-bottom: 20px;
}
.radio-c {
  margin-left: 120px;
}
.tit {
  margin-left: 90px;
}
.flex-r {
  display: flex;
  flex-direction: row;
}
.mt-40 {
  margin-bottom: 40px;
}
.mt-80 {
  margin-bottom: 80px;
}
.mr-20 {
  margin-right: 20px;
}
.mb-10 {
  margin-bottom: 10px;
}
.flex-1 {
  flex: 1;
  span {
    line-height: 32px;
  }
}
.date-c {
  line-height: 32px;
}
.item-width {
  width: 160px;
}
.item-width-d {
  width: 320px;
}
.gap {
  margin: 0 20px;
}
.unit {
  display: inline-block;
  width: 30px;
  margin-left: 10px;
}

.ab-1 {
  position: absolute;
  left: 100px;
  top: 4px;
}
</style>