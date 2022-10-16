import {
  queryServiceScore,
  queryExamStudyList,
  queryExamTaskList
} from "_o/api/work-order/work-order-config";
import {
  punishTypeList,
  courseTypeList,
} from "./fields";
import { freeze } from "@/mixins/base";
export const value_sep = "_"; // 分隔符

export const baseMixin = {
  data() {
    return {
      courseType: "", // 1-学习，2-考试
      serviceScoreList: [], // 服务分列表
      courseList: [], // 课程列表
      examList: [],
      punishTypeList: freeze(punishTypeList),
      courseTypeList: freeze(courseTypeList),
    }
  },
  created() {
    this.getScoreList()
  },
  methods: {
    // 学习列表
    async getCourseList() {
      const { data: {data, success}} = await queryExamStudyList({currPage: 1, pageSize: 2000, _silence: 1,})
      if(success) {
        this.courseList = data.list.map(it => ({label: it.learningTaskName, value: it.id + value_sep + it.learningTaskName}))
      }
    },
    // 考试列表
    async getExamList() {
      const { data: {data, success}} = await queryExamTaskList({currPage: 1, pageSize: 2000, _silence: 1,})
      if(success) {
        this.examList = data.list.map(it => ({label: it.examTaskName, value: it.id + value_sep + it.examTaskName}))
      }
    },
    // 服务分列表
    async getScoreList() {
      if(this.serviceScoreList.length) return
      const { data: {data, success}} = await queryServiceScore({currPage: 1, pageSize: 2000, _silence: 1,})
      if(success) {
        this.serviceScoreList = data.list.map(it => {
          let name  = it.ruleName
          let value = it.value ? `(${it.value})` : ""
          return {
            label: `${name}${value}`,
            value: `${it.uuid}${value_sep}${it.value}${value_sep}${name}`
          }
          }
        )
      }
    },
    courseTypeChange(v) {
      const func = [null, this.getCourseList, this.getExamList]; // 1 学习 2 考试
      func[v] && func[v]()
    }
  }
};

export default {
  mixins: [baseMixin],
  data() {
    return {
      serviceScore: {
        // "uuid":"" // 唯一id
        // "name":"" // 服务分的名称
        // "value":15.2 // 分数，需要扣除的分数
      },
      course: {
        // "type":1 // 课程类型1-学习，2-考试
        // "id":1 // 课程id
        // "name":"" // 课程的名称
      },
      courseType: "", // 1-学习，2-考试
    }
  },
  watch: {
    "form.punishTypes": {
      async handler(v) {
        if (v?.includes(2)) {
          // await this.getScoreList();
        }
      }
    }
  },
  methods: {
    serviceScoreChange(v) {
      console.log(v, 'v11')
      if(!v) return
      let [uuid, value] = v.value.split(value_sep)
      this.serviceScore = {
        name: v.label,uuid, value
      }
    },
    courseChange(v) {
      if(!v) return
      this.course = {
        name: v.label,
        id: v.value,
        type: this.form.courseType
      }
    },
    getBasicParams() {
      const {
        woType,
        judgeName,
        deductOrderFlow,
        openLadderPunish,
        violationLevel
      } = this.form;
      return {
        woType,
        driverType:[999],
        judgeName,
        violationLevel,
        deductOrderFlow: !!deductOrderFlow,
        openLadderPunish
      }
    },
    getBasePunishParams() {
      const {punishTypes, forfeit, violationLevel, serviceScore, course,  courseType} = this.form;
      let p = {
        basicPunish: {
          punishTypes,
          violationLevel
        }
      }
      if(punishTypes.includes(2)) {
        let [uuid, value, name] = serviceScore.split(value_sep)
        p.basicPunish.serviceScore = {
          uuid,
          name,
          value
        }
      }
      if (punishTypes.includes(3)) {
        let [id, name] = course.split(value_sep)
        p.basicPunish.course = {
          type: courseType,
          id,
          name
        }
      }
      if(punishTypes.includes(1)) {
        p.basicPunish.forfeit = forfeit
      }
      return p
    },
    getLadderPunishParams() {
      let { openLadderPunish } = this.form;
      return openLadderPunish ? this.$refs._ladderPunishment?.getComponentParams() : {}
    },
    // 编辑或添加子类 回写数据
    restoreForm(row) {
      const {
        id,
        driverType,
        woType,
        judgeName,
        deductOrderFlow,
        openLadderPunish,
        judgeLevel,
        basicPunish,
        ladderPunish
      } = row;
      let { punishTypes=[], forfeit, serviceScore, course, violationLevel } = basicPunish || {}

      let p = {
        id,
        driverType: JSON.parse(driverType),
        woType,
        judgeName,
        violationLevel,
        openLadderPunish,
        forfeit,
        deductOrderFlow:deductOrderFlow? 1:0,
        punishTypes,
        judgeLevel,
        ladderPunish,
        course: course?.id,
        courseType: course?.type,
        serviceScore: serviceScore?.uuid
      };
      // if(p.course) {
      //   this.courseTypeChange(p.courseType)
      // }
      // if(p.serviceScore) {
      //   this.getScoreList()
      // }
      return p
    }
  },
}
