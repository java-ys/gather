<template>
  <div>
    <Row :gutter="24">
      <Col span="3" style="max-width: 140px"
        ><p class="nn">
          {{ scheduleDetail.shiftName
          }}<span v-if="scheduleDetail.shiftTypeToStr"
            >({{ scheduleDetail.shiftTypeToStr }})</span
          >
        </p></Col
      >
      <Col span="3" style="max-width: 220px">
        <Select
          v-model="options.uid"
          style="width: 160px"
          @on-change="shiftTypeChange"
        >
          <Option
            v-for="item in classList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Col>
      <Col span="3" style="max-width: 220px" v-if="isDual">
        <Select
          v-model="options.dualUid"
          style="width: 160px"
          @on-change="dualTypeChange"
        >
          <Option
            v-for="item in dualList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Col>
    </Row>
    <div>
      <p class="m1">所属城市：{{ scheduleDetail.cityName }}</p>
      <div class="m1">
        <span class="mr-20"
          >排班时段：{{ scheduleDetail.shiftTime | numberFilter }}</span
        >
        <span class="mr-20"
          >高峰时段：{{ scheduleDetail.peakTime | numberFilter }}</span
        >
        <span class="mr-20"
          >生效时间点：{{ scheduleDetail.effectiveTime }}</span
        >
      </div>
      <p class="m1">时长要求：{{ scheduleDetail.timeClaim | numberFilter }}</p>
      <div class="m1">
        <span class="mr-20"
          >在班司机数：{{
            scheduleDetail.bindedCarDriverNumber | numberFilter
          }}</span
        >
      </div>
      <div class="date-t">
        <div>
          <DatePicker
            v-model="nowTime"
            format="yyyy-MM"
            type="month"
            placeholder="选择月"
            :options="opts"
            @on-change="dateChange"
          >
          </DatePicker>
          <Select
            v-model="options.agentId"
            @on-change="selectChange"
            style="width: 200px"
            class="agent-list"
          >
            <Option
              v-for="item in agentList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <div class="type-list">
          <div class="type1"><span class="dot1"></span><span>出勤</span></div>
          <div class="type2"><span class="dot2"></span><span>休息</span></div>
          <div class="type4"><span class="dot4"></span><span>请假</span></div>
          <div class="type3"><span class="dot3"></span><span>旷工</span></div>
        </div>
      </div>
    </div>
    <div class="contant-table">
      <div class="t-head">
        <div :key="index" v-for="(item, index) in weekList" class="t1">
          {{ item }}
        </div>
      </div>
      <div class="date-list clearfix">
        <div
          class="date-itm"
          :key="index"
          v-for="(item, index) in dateList"
          :class="[item.unuse ? 'unuse' : '', item.active ? 'active' : '']"
        >
          <p class="ss">
            {{ item.day }}
            <span class="festival-name" v-if="item.festivalName"
              >({{ item.festivalName }})</span
            >
          </p>
          <div class="mm">
            <p class="ty1" @click="goToDetail('name1', item.day, item.agentId)">{{ item.work }}</p>
            <p class="ty2" @click="goToDetail('name2', item.day, item.agentId)">{{ item.rest }}</p>
            <p class="ty3" @click="goToDetail('name3', item.day, item.agentId)">{{ item.leave }}</p>
            <p class="ty4" @click="goToDetail('name4', item.day, item.agentId)">{{ item.absent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAgentByCity } from "_g/api/configData";
import {
  dutySingularDetail,
  dutyDualDetail,
  shiftRuleService
} from "_o/api/m2-driver-api/schedule.js";
import { singleList, weekList } from "./fields";
import {
  zeroFill,
  isLeapYear,
  getTotalDays,
  getDayOfWeekFromYearAndMonth,
  getLastMonthDays,
  getNextMonthDays,
  getFestivalName
} from "./util";

// 默认显示6行7列
const calendarSum = 6 * 7;

export default {
  name: "class-calendar",
  filters: {
    numberFilter(n) {
      if (Array.isArray(n)) {
        return n.filter(Boolean).join(", ");
      }
      return n;
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to.name, from.name, to.query, from.query)
    if (to.name === from.name && to.query.shiftUuid !== from.query.shiftUuid) {
      this.init();
    }
    next();
  },
  data() {
    const ds = new Date();
    const year = ds.getFullYear();
    const month = ds.getMonth() + 1;
    const day = ds.getDate();
    return {
      opts: {
        // 2020-03
        disabledDate(date) {
          let noDdate = ds;
          let y = noDdate.getFullYear();
          let m = noDdate.getMonth() + 1;
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          if (year < 2020) {
            return true;
          } else if (year - 2020 === 0 && month < 3) {
            return true;
          }
          return false;
        }
      },
      classList: [], // 单班下拉列表
      dualList: [], // 双班班段下拉
      ruleList: [], // 所有排班列表
      isDual: false, // 双班
      isSingle: false, // 单班
      weekList,
      options: {
        uid: "", // 单班下拉uuid
        agentId: "0",
        dualUid: "" // 双班下拉uuid
      },
      dateList: [],
      calendarList: [],
      nowYear: year,
      nowMonth: month,
      nowDay: day,
      agentList: [],
      nowTime: `${year}-${zeroFill(month)}`,
      dateStr: `${year}-${zeroFill(month)}`,
      scheduleDetail: {}, // 排班基础信息
      cityCode: "",
      driverTag: ''
      // shiftUuid: "" //班次uuid
      // shiftRuleUuid: ""
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.getAgentList();
  },
  methods: {
    init() {
      console.log(this.$route.query)
      const { shiftType, shiftUuid, cityCode, shiftRuleUuid,driverTag } = this.$route.query;
      this.isSingle = shiftType && shiftType - 1 === 0;
      this.isDual = shiftType && shiftType - 2 === 0;
      this.cityCode = cityCode;
      // 默认选中列表的班次
      this.options.uid = shiftUuid;
      console.log(this.options.uid)
      this.options.dualUid = shiftRuleUuid;
      this.driverTag = driverTag;  // 双班默认第一个
      this.getShiftRuleList().getCalendarList();
    },
    // 获取所有排班列表
    getShiftRuleList() {
      const { shiftType, shiftUuid } = this.$route.query;
      shiftRuleService({ shiftType }).then(res => {
        if (res.data.success) {
          const list = res.data.data.list;
          this.ruleList = list;
          this.setClassList().setDualData(shiftUuid);
        }
      });
      return this;
    },
    getCalendarList() {
      const funcName = this.isSingle
        ? dutySingularDetail
        : this.isDual
        ? dutyDualDetail
        : "";
      if (!funcName) return;
      const { uid, agentId, dualUid } = this.options;
      let p = {
        uuid: uid,
        dutyDate: this.dateStr.split("-").join(""),
        agentId: agentId - 0 !== 0 ? agentId : "",
        cityCode: this.cityCode,
        shiftRuleUuid: dualUid,
        driverTag: this.driverTag
      };
      funcName(p).then(res => {
        console.log(res)
        if (res.data.success) {
          this.scheduleDetail = res.data.data;
          const { singularDetail, dualDetail } = res.data.data;
          this.calendarList = this.isSingle ? singularDetail : dualDetail;
          // this.shiftUuid = res.data.data.shiftUuid
          // this.shiftRuleUuid = res.data.data.shiftRuleVoList[0].shiftRuleUuid
          this.setDateList();
        }
      });
    },
    getAgentList() {
      if (!this.cityCode) return;
      getAgentByCity({ cityCode: this.cityCode }).then(res => {
        let list = res.data.data || [];
        list.forEach(item => {
          item.label = item.name;
          item.value = item.uuid;
        });
        list.unshift({ label: "全部", value: "0" });
        this.agentList = list;
      });
      return this;
    },
    selectChange(v) {
      this.getCalendarList();
    },
    dateChange(v, a) {
      if (!v) return;
      const [year, month] = v.split("-");
      this.dateStr = `${year}-${month}`;
      this.getCalendarList();
    },
    setDateList() {
      const [year, month] = this.dateStr.split("-");
      const totalDays = getTotalDays(year, month);
      const weekDays = getDayOfWeekFromYearAndMonth(year, month);
      // 大于等于当前天, 缺席数据不展示
      let isOver =
        year > this.nowYear ||
        (year - this.nowYear === 0 && month > this.nowMonth);
      let yearMonthEqual =
        year - this.nowYear === 0 && month - this.nowMonth === 0;

      const lastMonthDays = getLastMonthDays(year, month);

      // 补足42条数据, 上个月的数据
      let i = weekDays - 1;
      let arr = [];
      let lastDateStr =
        month < 12 ? `${year}${zeroFill(+month + 1)}` : `${year + 1}01`;
      while (--i >= 0) {
        let day = lastMonthDays - i;
        const {
          driverAttendCnt,
          driverRestCnt,
          driverLeaveCnt,
          driverAbsenteeismCnt,
          agentId
        } = this.getDataByDate(`${lastDateStr}${zeroFill(day)}`);
        arr[arr.length] = {
          day: day,
          work: driverAttendCnt,
          rest: driverRestCnt,
          leave: driverLeaveCnt,
          absent: driverAbsenteeismCnt,
          unuse: true,
          agentId
        };
      }

      // 当月数据
      i = 0;
      let nowDateStr = `${year}${month}`;
      while (++i <= totalDays) {
        const {
          driverAttendCnt,
          driverRestCnt,
          driverLeaveCnt,
          driverAbsenteeismCnt,
          agentId
        } = this.getDataByDate(`${nowDateStr}${zeroFill(i)}`);
        arr[arr.length] = {
          day: i,
          work: driverAttendCnt,
          rest: driverRestCnt,
          leave: driverLeaveCnt,
          absent: driverAbsenteeismCnt,
          festivalName: getFestivalName(year, month, i),
          active: yearMonthEqual && i - this.nowDay === 0,
          agentId
        };
      }

      // 补足42条数据, 下个月的数据
      let dv = calendarSum - arr.length;
      i = 0;
      let nextDateStr =
        month < 12 ? `${year}${zeroFill(+month + 1)}` : `${year + 1}01`;
      while (++i <= dv) {
        const {
          driverAttendCnt,
          driverRestCnt,
          driverLeaveCnt,
          agentId
        } = this.getDataByDate(`${nextDateStr}${zeroFill(i)}`);
        // console.log(this.getDataByDate(`${nextDateStr}${zeroFill(i)}`))
        // console.log(driverAbsenteeismCnt)

        arr[arr.length] = {
          day: i,
          work: driverAttendCnt,
          rest: driverRestCnt,
          leave: driverLeaveCnt,
          absent: '',
          unuse: true,
          agentId
        };
      }
       console.log(arr)
      this.dateList = arr;
    },
    shiftTypeChange(v) {
      this.setDualData(v);
      this.getCalendarList();
    },
    dualTypeChange(v) {
      this.dualList.forEach(it => {
        if(it.value == v) {
          this.driverTag = it.driverTag
        }
      })
      this.getCalendarList();
    },
    setClassList() {
      this.classList = this.ruleList.map(it => {
        return { label: it.shiftName, value: it.shiftUuid};
      });
      return this;
    },
    // 根据单班的shiftUuid, 获取双班的下拉列表数据
    setDualData(targetV) {

      const f = this.ruleList.find(it => it.shiftUuid === targetV);
      this.options.dualUid = f.shiftRuleDetailsDtoList[0].shiftRuleUuid;
      this.cityCode = f.cityCode;
      this.driverTag = f.shiftRuleDetailsDtoList[0].driverTag;
      this.getAgentList()
      if (!this.isDual) return;
      if (f) {
        const { shiftRuleDetailsDtoList: shiftL } = f;
        if (shiftL && shiftL.length) {

          this.driverTag = shiftL[0].driverTag;
          this.dualList = shiftL.map(it => {
            return { label: it.ruleName, value: it.shiftRuleUuid,driverTag: it.driverTag };
          });
        }
      }
    },
    // 20200101
    getDataByDate(dateStr) {
      const fi = this.calendarList.find(it => it.dutyDate === dateStr);
      if (fi) {
        const {
          driverAttendCnt,
          driverRestCnt,
          driverLeaveCnt,
          driverAbsenteeismCnt,
          agentId
        } = fi;
        return {
          driverAttendCnt,
          driverRestCnt,
          driverLeaveCnt,
          driverAbsenteeismCnt,
          agentId
        };
      }
      return {};
    },
    goToDetail(type, day, id) {
      let data = {
        actualDutyType: type,
        day,
        month: this.nowTime.getMonth()+1,
        year: this.nowTime.getFullYear(),
        shiftUuid: this.options.uid,
        uid: this.options.dualUid,
        agentId: id,
        driverTag: this.driverTag,
        cityCode: this.cityCode
      }
      this.$router.push({
        name: 'detail-manager',
        query: data
      })
    }
  }
};
</script>

<style scoped lang="less" src="./index.less"></style>
