<template>
  <div class="punish-con">
    <form ref="_extra" v-model="formData" :rules="rules" :label-width="120">
      <FormItem label="违规次数统计：" prop="">
        <RadioGroup v-model="formData.statisticType">
          <Radio :label="1">
            按自然月
          </Radio>
          <Radio :label="2">
            按自然周
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="扣除订单流水：" prop="deductOrderFlow">
        <RadioGroup v-model="formData.deductOrderFlow">
          <Radio :label="1">
            是
          </Radio>
          <Radio :label="0">
            否
          </Radio>
        </RadioGroup>
      </FormItem>
    </form>
  <Card class="ladder-content form-con" :key="index" v-for="(form, index) in ladderConfigs">
    <Form :ref="`form_${index}`" :model="form" :rules="rules" :label-width="120" >
      <div class="pr">
        <div class="icon-c">
          <Icon
            class="icon-handle"
            :size="30"
            type="ios-remove-circle-outline"
            @click="deleteConfig(index)"
            v-if="ladderConfigs.length > 1"
          />
          <Icon
            class="icon-handle"
            type="ios-add-circle-outline"
            :size="30"
            @click="addConfig"
          />
        </div>
        <FormItem label="城市：" prop="cityCodes">
<!--          <TreeInput-->
<!--            :data="cityList"-->
<!--            placeholder="请选择城市"-->
<!--            v-model="form.cityCodes"-->
<!--            inputWidth="400px"-->
<!--            inputHeight="100px"-->
<!--            @on-change="selectCity"-->
<!--          ></TreeInput>-->
          <Select
            v-model="form.cityCodes"
            clearable
            multiple
            class="city-se"
            @on-change="v => onCityChange(v, form)"
          >
            <Option
              v-for="(item, index) in cityList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <Card :key="ix" class="to-con pr" v-for="(it, ix) in form.ladderCityConfigs">
          <div class="icon-c icon-c-sub">
            <Icon
              class="icon-handle sub-add"
              type="ios-remove"
              :size="30"
              @click="deleteSubConfig(ix, form.ladderCityConfigs)"
              v-if="form.ladderCityConfigs.length > 1"
            />
            <Icon
              class="icon-handle sub-add"
              type="ios-add"
              :size="30"
              @click="addSubConfig(form.ladderCityConfigs)"
            />
          </div>
          <FormItem label="违规次数：" prop="">
            <Input
              v-model="it.violationCount"
              clearable
              placeholder="请输入"
              style="width: 200px;"
              :maxlength="10"
            ></Input>
          </FormItem>
        <FormItem label="处罚类型：" prop="punishTypes">
          <Select
            v-model="it.punishTypes"
            clearable
            multiple
            style="width: 200px"
          >
            <Option
              v-for="(item, index) in punishTypeList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
          <FormItem label="违规等级：" prop="">
            <Select
              v-model="it.violationLevel"
              clearable
              filterable
              style="width: 200px"
            >
              <Option
                v-for="(item, index) in violationLevelList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="服务分：" prop="" v-if="it.punishTypes.includes(2)">
            <Select v-model="it.serviceScore"
                    clearable
                    filterable
                    label-in-value
                    style="width: 200px"
                    @on-change="e=>serviceScoreChange(e, it)">
              <Option
                v-for="(item, index) in serviceScoreList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="课程学习："
                    prop=""
                    v-if="it.punishTypes.includes(3)">
            <Select v-model="it.courseType"
                    clearable
                    style="width: 70px;"
                    @on-change="e=>changeCourseType(e, it, ix, form.ladderCityConfigs)"
            >
              <Option
                v-for="(item, index) in courseTypeList"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option
              >
            </Select>
            <Select v-model="it.course"
                    clearable
                    filterable
                    label-in-value
                    style="width: 126px;"
                    >
              <Option
                v-for="(item, index) in (it.courseType - 1 === 0 ? courseList : examList)"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="处罚金额：" prop="forfeit" v-if="it.punishTypes.includes(1)">
            <Input
              v-model="it.forfeit"
              clearable
              placeholder="请输入"
              style="width: 200px;"
              :maxlength="10"
            ></Input>
          </FormItem>
        </Card>
      </div>
    </Form>
  </Card>
  </div>
</template>

<script>

import {
  violationLevelList,
  punishTypeList
} from "../fields";
import {
  getCitys
} from "_o/api/configData.js"
import TreeInput from "_a/tree-input/tree-input.vue";
import { freeze, deepCopy } from "@/mixins/base";
import { baseMixin } from "../ladder";
import { fetchCityList } from "_o/api/work-order/work-order-config";

const value_sep = "_"; // 分隔符

const default_sub_config = {
  "violationCount":"",
  "punishTypes": [],
  "forfeit": "",
  "serviceScore": "",
  _serviceScore: {},
  "course": "",
  _course: {}
}
const default_config = {
  "cityCodes":[],
  ladderCityConfigs: [
    deepCopy({}, default_sub_config)
  ],
}

export default {
  name: "ladder-punishment",
  components: {TreeInput},
  mixins: [baseMixin],
  props: {
    cData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    refresh: {
      type: Boolean
    }
  },
  data() {
    return {
      formData: {
        statisticType: "",
        deductOrderFlow: ""
      },
      cityList: [],
      rules: {},
      ladderConfigs: [
        JSON.parse(JSON.stringify(default_config))
      ],
      violationLevelList: freeze(violationLevelList),
      punishTypeList: freeze(punishTypeList)
    }
  },
  watch: {
    refresh(bo) {
      if(!bo) return
      if(Object.keys(this.cData).length) {
        let { statisticType, deductOrderFlow, ladderConfigs } = this.cData
        this.formData.statisticType = statisticType
        this.formData.deductOrderFlow = deductOrderFlow ? 1 : 0
        this.ladderConfigs = deepCopy([], ladderConfigs);
        this.ladderConfigs.forEach(it => {
          it.ladderCityConfigs.forEach(itm => {
            // 反写 课程 服务分字段
            if(itm.serviceScore) {
              let s = `${itm.serviceScore.uuid}${value_sep}${itm.serviceScore.value}${value_sep}${itm.serviceScore.name}`
              itm._serviceScore = {...itm.serviceScore}
              itm.serviceScore = s
            }
            if(itm.course) {
              let { type, id, name } = itm.course
              itm.courseType = type;
              itm.course = id + value_sep + name
            }
          })
        })
        this.getScoreList();
        this.getCourseList()
        this.getExamList()
      }
    }
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    selectCity() {},
    courseChange(v, it) {
      if(!v) return
      it._course = {
        name: v.label,
        id: v.value,
        type: it.courseType
      }
    },
    serviceScoreChange(v, it) {
      if(!v) return
      let [uuid, value] = v.value.split(value_sep)
      it._serviceScore = {
        name: v.label,uuid, value
      }
    },
    addConfig() {
      if(this.ladderConfigs.length > 4) {
        this.$Message.error("最多添加5个阶梯规则")
        return
      }
      this.ladderConfigs.push(deepCopy({}, default_config));
    },
    deleteConfig(index) {
      this.ladderConfigs.splice(index, 1)
    },
    addSubConfig(list) {
      if(list.length > 4) {
        this.$Message.error("最多添加5个")
        return
      }
      list.push(deepCopy({}, default_sub_config))
    },
    deleteSubConfig(index, list) {
      list.splice(index, 1)
    },
    // getCityList() {
    //   getCitys({}).then(res => {
    //     let list = res.data.data||[]
    //     if(list.length>0){
    //       list.forEach(function (item, index) {
    //         item.title = item.province
    //         item.value = item.provinceID
    //         item.children = item.citys
    //         item.children.forEach(function (_item, _index) {
    //           _item.title = _item.city
    //           _item.value = _item.cityID
    //         })
    //       })
    //       this.cityList = [
    //         {
    //           value: '1',
    //           title: '全选',
    //           expand: true,
    //           children: list
    //         }
    //       ]
    //     }
    //   })
    // },
    async getCityList() {
      const { data: { success, data } } = await fetchCityList({
        bizTypes:[1, 2, 4, 6, 7],
        showAllCity:1
      });
      if (success) {
        this.cityList = data.map(it => {
          return {
            label: it.cityName,
            value: it.cityCode
          }
        });
      }
    },
    onCityChange(e, item) {
      const idx = e.indexOf('100000')
      if (idx === -1) return
      if (e[e.length - 1] === '100000') {
        item.cityCodes = ['100000']
      } else {
        let arr = e.slice()
        arr.splice(idx, 1)
        item.cityCodes = arr
      }
    },
    getComponentParams() {
      let ladderConfigs = this.ladderConfigs.map(config => {
        let {cityCodes, ladderCityConfigs} = config
        let pa = { cityCodes }
        pa.ladderCityConfigs = ladderCityConfigs?.map(con => {
          let { violationCount, punishTypes, forfeit, serviceScore, course, _course, courseType, _serviceScore, violationLevel} = con
          let p = {
            violationCount,
            violationLevel,
            punishTypes
          };
          if(con.punishTypes.includes(1)) {
            p.forfeit = forfeit
          }
          if (con.punishTypes.includes(2)) {
            let [uuid, value, name] = serviceScore.split(value_sep)
            p.serviceScore = {
              uuid, value, name
            }
          }
          if (con.punishTypes.includes(3)) {
            let [id, name] = course.split(value_sep)
            p.course = {
              type: courseType,
              id, name
            }
          }
          return p
        })
        return pa
      });
      return {
        ladderPunish: {
          ...this.formData,
          ladderConfigs
        }
      }
    },
    clear() {
      this.formData = {
        statisticType: "",
        deductOrderFlow: ""
      }
      this.ladderConfigs = [
        JSON.parse(JSON.stringify(default_config))
      ]
    },
    changeCourseType(v, it, ix, list) {
      it.courseType = v
      this.$set(list, ix, it);
      it.course = ""
      if(v) this.courseTypeChange(v)
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .city-se .ivu-select-selection {
  height: 80px;
  width: 400px;
}
.city-se {
  height: 80px;
  width: 400px;
}
.punish-con {
  margin-left: 80px;
}
.form-con {
  background-color: #F7F7F7;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 20px 0;
}
.to-con {
  margin-left: 40px;
  margin-bottom: 6px;
}
.icon-c {
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 99;
  .icon-handle {
    cursor: pointer;
    &:hover {
      color: #2d8cf0;
    }
  }
  &.icon-c-sub {
    top: 18px;
    right: 20px;
  }
}

.item-width {
  width: 260px;
}
</style>
