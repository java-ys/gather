<template>
  <div>
    <Modal
      v-model="isShow"
      :width="800"
      :title="modalTitle"
      :mask-closable="false"
      class="add-trafic"
      @on-cancel="formReset"
    >
      <Form
        ref="adForm"
        class="top15"
        :model="addData"
        :rules="ruleValidate"
        :label-width="110"
      >
        <!-- 城市 -->
        <FormItem label="城市：" prop="cityCode">
          <span v-if="!isAdd">{{addData.cityName}}</span>
          <Select
            v-else
            v-model="addData.cityCode"
            placeholder="请选择城市"
            :clearable="false"
            filterable
            class="width300"
            @on-change="getFenceList"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in cityList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <!-- 产品线 -->
        <FormItem v-if="isAdd" key="addBusi" label="产品线：" prop="businessTypeList">
          <Select
            v-model="addData.businessTypeList"
            multiple
            placeholder="请选择产品线"
            class="width300"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in bizTypeList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem v-else key="detailBusi" label="产品线：">
          <span>{{getProductName(addData.businessType)}}</span>
        </FormItem>
      </Form>
      <Form
        ref="dtoForm"
        :model="addData.trafficRestrictionDto"
        :rules="ruleValidate"
        :label-width="110"
      >
        <!-- 限行类型 -->
        <FormItem label="限行类型：" prop="restrictionType">
          <span v-if="isDetail">{{["", "尾号限行", "头号限行"][addData.trafficRestrictionDto.restrictionType]}}</span>
          <Select
            v-else
            v-model="addData.trafficRestrictionDto.restrictionType"
            placeholder="请选择尾号类型"
            class="width300"
            @on-change="changeRestrictionType"
          >
            <Option :value="1">尾号限行</Option>
            <Option :value="2">头号限行</Option>
          </Select>
        </FormItem>
        <!-- 尾号类型 -->
        <FormItem :label="addData.trafficRestrictionDto.restrictionType === 1 ? '尾号类型：' : '头号类型：'" prop="tailNumType">
          <span v-if="isDetail">{{addData.trafficRestrictionDto.tailNumType === 1 ? '星期循环' : '日期循环'}}</span>
          <Select
            v-else
            v-model="addData.trafficRestrictionDto.tailNumType"
            placeholder="请选择尾号类型"
            class="width300"
            @on-change="changeEndType"
          >
            <Option :value="1">星期循环</Option>
            <Option :value="2">日期循环</Option>
          </Select>
        </FormItem>
        <!-- 星期值 -->
        <div v-if="addData.trafficRestrictionDto.tailNumType === 1">
          <FormItem v-if="addData.trafficRestrictionDto.tailNumType === 1" label="星期值:" prop="weekList">
            <div style="display: flex" class="topTo10">
              <div class="xq-title">
                <div
                  v-for="(item, index) in addData.trafficRestrictionDto.weekList"
                  :key="item.circulateTimes.join('、')"
                  :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
                  @click="checkedWeek(index,'weekList')"
                >
                  {{item.circulateTimes.map(v => weekMap[v]).join('、')}}
                  <Icon
                    v-if="!isDetail"
                    type="md-close-circle"
                    class="closeIcon"
                    size="18"
                    @click.stop="deleteWeek(index,'weekList')"
                  />
                </div>
              </div>
              <div
                v-if="!isDetail"
                class="xq-content"
              >
                <Button
                  :disabled="isCheckedAllWeek('weekList')"
                  type="info"
                  :ghost="true"
                  style="margin-right: 5px; margin-left: 5px"
                  @click="initCheckedWeek(1,'weekList','checkedWeek')"
                >
                  添加星期值
                </Button>
                <Button
                  v-show="addData.trafficRestrictionDto.weekList && addData.trafficRestrictionDto.weekList.length > 0"
                  type="success"
                  :ghost="true"
                  @click="initCheckedWeek(2,'weekList','checkedWeek')"
                >
                  编辑星期值
                </Button>
              </div>
            </div>
          </FormItem>
          <div v-for="(item, index) in addData.trafficRestrictionDto.weekList" v-show="item.isChecked" :key="index">
            <Form
              v-if="addData.trafficRestrictionDto.restrictionType === 1"
              :ref="`weekForm${index}`"
              :model="item"
              :rules="ruleValidate"
              :label-width="110"
            >
              <FormItem label="限制尾号:" prop="limitTailNums">
                <span v-if="isDetail">{{item.limitTailNums.join(' , ')}}</span>
                <Select
                  v-else
                  v-model="item.limitTailNums"
                  multiple
                  placeholder="请选择限制尾号"
                  class="width300"
                >
                  <Option
                    v-for="num in 10"
                    :key="num"
                    :value="num - 1"
                  >
                    {{num - 1}}
                  </Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
        <!-- 每月日期 -->
        <div v-if="addData.trafficRestrictionDto.tailNumType === 2">
          <FormItem label="每月日期:" prop="daysList">
            <div class="days-box topTo10">
              <div class="xq-title inline-box">
                <div
                  v-for="(item, index) in addData.trafficRestrictionDto.daysList"
                  :key="item.circulateTimes.join('、')"
                  class="inline-box"
                  :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
                  @click="checkedWeek(index,'daysList')"
                >
                  {{item.circulateTimes.join('、')}}
                  <Icon
                    v-if="!isDetail"
                    type="md-close-circle"
                    class="closeIcon"
                    size="18"
                    @click.stop="deleteWeek(index,'daysList')"
                  />
                </div>
                <div v-if="!isDetail" class="inline-box top10">
                  <Button
                    :disabled="isCheckedAllWeek('daysList')"
                    type="info"
                    :ghost="true"
                    style="margin-right: 5px; margin-left: 5px"
                    @click="initCheckedWeek(1,'daysList','checkedDays')"
                  >
                    添加每月日期
                  </Button>
                  <Button
                    v-show="addData.trafficRestrictionDto.daysList && addData.trafficRestrictionDto.daysList.length > 0"
                    type="success"
                    :ghost="true"
                    @click="initCheckedWeek(2,'daysList','checkedDays')"
                  >
                    编辑每月日期
                  </Button>
                </div>
              </div>
            </div>
          </FormItem>
          <div v-for="(item, index) in addData.trafficRestrictionDto.daysList" v-show="item.isChecked" :key="index + 100">
            <Form
              v-if="addData.trafficRestrictionDto.restrictionType === 1"
              :ref="`daysForm${index}`"
              :model="item"
              :rules="ruleValidate"
              :label-width="110"
            >
              <FormItem label="限制尾号:" prop="limitTailNums">
                <span v-if="isDetail">{{item.limitTailNums.join(' , ')}}</span>
                <Select
                  v-else
                  v-model="item.limitTailNums"
                  multiple
                  placeholder="请选择限制尾号"
                  class="width300"
                >
                  <Option
                    v-for="num in 10"
                    :key="num"
                    :value="num - 1"
                  >
                    {{num - 1}}
                  </Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
        <!-- 头号限行 -->
        <div>
          <Form
            v-if="addData.trafficRestrictionDto.restrictionType === 2"
            ref="header"
            :model="addData.trafficRestrictionDto"
            :rules="ruleValidate"
            :label-width="110"
          >
            <FormItem label="限制头号:" prop="limitTailNums">
              <span v-if="isDetail">{{addData.trafficRestrictionDto["limitTailNums"].join(' , ')}}</span>
              <Select
                v-else
                v-model="addData.trafficRestrictionDto.limitTailNums"
                multiple
                placeholder="请选择限制头号"
                class="width300"
              >
                <Option
                  v-for="item in arr_header"
                  :key="item.value"
                  :value="item.value"
                >
                  {{item.key}}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <!-- 限制时段 -->
        <div>
          <Form
            v-for="(item,index) in addData.trafficRestrictionDto.timeDtos"
            :ref="'timeForm' + index"
            :key="index - 100"
            :model="item"
            :rules="ruleValidate"
            :label-width="110"
            style="position:relative"
          >
            <FormItem label="限制时段：" prop="timeItem">
              <span v-if="isDetail">{{item.timeItem[0]}} - {{item.timeItem[1]}}</span>
              <TimePicker
                v-else
                v-model="item.timeItem"
                :editable="false"
                type="timerange"
                placement="bottom-start"
                placeholder="请选择限定时段"
                class="width300"
              ></TimePicker>
            </FormItem>
            <Icon
              v-if="addData.trafficRestrictionDto.timeDtos.length > 1 && !isDetail"
              class="remove-icon"
              type="ios-trash-outline"
              @click="removeTime(index)"
            />
          </Form>
          <Button v-if="!isDetail" type="primary" class="add-icon" @click="addTimeItem">添加时段</Button>
        </div>
        <!-- 是否指定日期不限号 -->
        <div>
          <FormItem prop="whetherOpen" class="inline-box" :label-width="45">
            <Checkbox
              v-model="addData.trafficRestrictionDto.whetherOpen"
              :disabled="isDetail"
              @on-change="addData.trafficRestrictionDto.selectedDates = []"
            >
              是否启用指定日期不限号
            </Checkbox>
          </FormItem>
          <FormItem v-if="addData.trafficRestrictionDto.whetherOpen" class="inline-box" :label-width="10">
            <span v-if="isDetail">{{addData.trafficRestrictionDto.selectedDates.join(' , ')}}</span>
            <DatePicker
              v-else
              v-model="addData.trafficRestrictionDto.selectedDates"
              type="date"
              :editable="false"
              multiple
              placeholder="请选择日期"
              :options="options"
              style="width: 500px"
            ></DatePicker>
          </FormItem>
        </div>
        <!-- 燃料类型 -->
        <FormItem label="燃料类型：" prop="fuelTypes">
          <span v-if="isDetail">{{addData.trafficRestrictionDto.fuelTypes.map(f => fuelMap[f]).join(' , ')}}</span>
          <Select
            v-else
            v-model="addData.trafficRestrictionDto.fuelTypes"
            placeholder="请选择燃料类型"
            multiple
            class="width300"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in fuelList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <!-- 电子围栏 -->
        <FormItem label="电子围栏：" prop="fenceUuid">
          <span v-if="isDetail">{{addData.trafficRestrictionDto.fenceName}}</span>
          <Select
            v-else
            v-model="addData.trafficRestrictionDto.fenceUuid"
            placeholder="请选择电子围栏"
            class="width300"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in fenceList"
              :key="item.uuid"
              :value="item.uuid"
              :disabled="item.disabled"
            >{{ item.name }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        <FormItem v-if="isDetail" class="btn-look">
          <span @click="showMapModal = true">查看地图</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="addSubmit"
        >
          确定
        </Button>
        <Button
          v-if="handleType !== 3"
          type="text"
          @click="formReset"
        >
          取消
        </Button>
      </div>
    </Modal>
    <checked-week
      ref="checkedWeek"
      @getWeekData="getWeekData"
    />
    <checked-days
      ref="checkedDays"
      type="2"
      @getWeekData="getDaysData"
    />
    <fence-modal
      :show="showMapModal"
      :uuid="fenceUuid"
      @close="showMapModal = false"
    ></fence-modal>
  </div>
</template>
<script>
import {
  ruleValidate,
  businessInfo,
  fuelList,
  fuelMap
} from "./fields.js"
import checkedWeek from "./components/cheek-week-days.vue";
import checkedDays from "./components/cheek-week-days.vue";
import {
  getElefenServiceSelectAll,
  axiosTrafficAdd,
  axiosTrafficEdit,
  axiosTrafficDetail
} from "_o/api/configData.js";
import { getHeaderNumber } from "_o/api/trafficRestrict.js";
import { setTimeout } from "timers";
import { validEmptyArray } from "@/libs/validate"
import { hasTimesection } from "@/libs/tools.js"
import fenceModal from "_a/fence-modal/index"
import { mapState, mapGetters } from "vuex"

const weekMap = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日"
}

const handleTypeMap = {
  1: {
    title: "新增限号限行策略",
    type: "新增"
  },
  2: {
    title: "编辑限号限行策略",
    type: "编辑"
  },
  3: {
    title: "限号限行策略详情",
    type: "详情"
  }
};

const defaultFance = [{
  uuid: "0",
  disabled: true,
  name: "请先选择城市"
}]

const defaultAddData = {
  cityCode: "",
  businessTypeList: [],
  trafficRestrictionDto: {
    restrictionType: 1,
    plateType: 1,
    tailNumType: null,
    whetherOpen: false,
    selectedDates: [],
    fuelTypes: [],
    fenceUuid: null,
    weekList: [],
    daysList: [],
    timeDtos: [
      { timeItem: [] }
    ]
  }
}

export default {
  name: "traffic-modal",
  components: {
    checkedWeek,
    checkedDays,
    fenceModal
  },
  props: {
    show: {
      type: Boolean
    },
    uuid: {},
    type: {},
    handleType: {
      default: 1
    },
    cityList: {},
    infoData: {}// 审批详情的详情数据
  },
  data() {
    const timeValid = (rule, value, callback) => {
      let res = value.every(item => {
        return item
      })
      if (!res) {
        callback(new Error("请选择时间"));
      } else if (value[0] == value[1]) {
        callback(new Error("结束时间要大于开始时间"))
      } else {
        // 时间交叉
        let timeList = this.addData.trafficRestrictionDto.timeDtos
        let num = 0
        for (let i = 0; i < timeList.length; i++) {
          let it = timeList[i].timeItem
          if (it[0] && !hasTimesection(value, it)) {
            num++
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"))
        } else {
          callback()
        }
      }
    }
    return {
      weekMap,
      fuelList,
      fuelMap,
      isShow: this.show, // 新增弹窗是否显示
      arr_header: [],
      ruleValidate: {
        ...ruleValidate,
        timeItem: [
          { required: true, type: "array", min: 2, message: "请选择限定时段", trigger: "change" },
          { trigger: "change", msg: "请选择限定时段", validator: validEmptyArray },
          { required: true, validator: timeValid, trigger: "change" }
        ]
      },
      businessInfo,
      addData: JSON.parse(JSON.stringify(defaultAddData)),
      fenceList: [...defaultFance],
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      showMapModal: false,
      fenceUuid: null
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    // 是否是详情
    isDetail() {
      return this.handleType === 3;
    },
    // 是否是新增
    isAdd() {
      return this.handleType === 1;
    },
    // 弹窗标题
    modalTitle() {
      return handleTypeMap[this.handleType].title;
    },
    // ruleValidate(){
    //   if(this.isDetail){
    //     return {}
    //   }else{
    //     return this.rule
    //   }
    // }
  },
  watch: {
    show() {
      this.isShow = this.show;
      if (this.isShow) {
        if (this.handleType === 1) {
          // 新增
          this.addData = JSON.parse(JSON.stringify(defaultAddData))
        } else {
          this.getDetail();
        }
      }
    },
  },
  methods: {
    getHeaderNumber() {
      if (this.handleType === 1) {
        let obj = { ...this.addData.trafficRestrictionDto };
        obj.limitTailNums = [];
        this.addData.trafficRestrictionDto = { ...obj };
      }
      this.arr_header = [];
      if (this.addData.cityCode) {
        getHeaderNumber({ cityCode: this.addData.cityCode }).then(res => {
          if (res && res.data && res.data.data) {
            this.arr_header = res.data.data.map(item => {
              return { key: item, value: item }
            })
          }
        })
      }
    },
    checkedWeek(val, key) {
      this.addData.trafficRestrictionDto[key] = this.addData.trafficRestrictionDto[key].map((item, index) => {
        if (index === val) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        return item;
      });
    },
    // 判断是否已经选中了所有星期
    isCheckedAllWeek(key) {
      let arr = [];
      let max = this.addData.trafficRestrictionDto.tailNumType === 1 ? 7 : 31
      this.addData.trafficRestrictionDto[key].forEach((item, index) => {
        arr = [...arr, ...item.circulateTimes];
      });
      if (arr && arr.length === max) {
        return true;
      } else {
        return false;
      }
    },
    // 获取星期数据
    getWeekData(val) {
      this.getSelectData(val, "weekList")
    },
    // 获取星期数据
    getDaysData(val) {
      this.getSelectData(val, "daysList")
    },
    getSelectData(val, key) {
      this.addData.trafficRestrictionDto[key] = val;
      let data = this.addData.trafficRestrictionDto[key]
      if (data.length === 1) {
        data[0].isChecked = true;
      }
      this.$refs.dtoForm.validateField(key);
    },
    // 星期值新增/编辑
    initCheckedWeek(val, key, refName) {
      let data = this.addData.trafficRestrictionDto[key]
      // 新增
      if (val === 1) {
        this.$refs[refName].addWeek(data);
      }
      // 编辑
      else {
        data.forEach((item, index) => {
          if (item.isChecked) {
            this.$refs[refName].getEditWeek({
              dataSource: data,
              currentData: item.circulateTimes,
              index: index,
            });
          }
        });
      }
    },
    // 删除星期值
    deleteWeek(val, key) {
      this.addData.trafficRestrictionDto[key].splice(val, 1);
      this.$refs.dtoForm.validateField(key);
    },
    changeRestrictionType() {
      let obj = { ...this.addData.trafficRestrictionDto };
      obj.tailNumType = "";
      obj.limitTailNums = [];
      this.addData.trafficRestrictionDto = { ...obj };
    },
    changeEndType(value) {
      this.addData.trafficRestrictionDto.weekList.splice(0, 50)
      this.addData.trafficRestrictionDto.daysList.splice(0, 50)
    },
    getDetail() {
      axiosTrafficDetail({ uuid: this.uuid }).then(res => {
        let data = res.data.data || {}
        let dtoData = data.trafficRestrictionDto

        if (dtoData.restrictionType === 2) {
          dtoData.limitTailNums = dtoData.tailNumDataDtos[0]["limitTailNums"];
        }
        // 星期、日期
        let tailNumDataDtosKey = dtoData.tailNumType === 1 ? "weekList" : "daysList"
        dtoData.tailNumDataDtos = this.formatNum(dtoData.tailNumDataDtos)
        dtoData.weekList = []
        dtoData.daysList = []
        dtoData[tailNumDataDtosKey] = dtoData.tailNumDataDtos
        // 限制时段
        dtoData.timeDtos = dtoData.timeDtos.map(t => {
          return {
            timeItem: [t.startTime, t.endTime]
          }
        })

        this.fenceUuid = dtoData.fenceUuid
        this.addData = data
        console.log("this.addData", this.addData)
        this.getFenceList()
      })
    },
    formatNum(list) {
      list.forEach((v, i) => {
        v.circulateTimes = v.circulateTimes.map(c => Number(c))
        v.limitTailNums = v.limitTailNums.map(l => Number(l))
        i === 0 && (v.isChecked = true)
      })
      return list
    },

    // 新增&编辑-提交
    async addSubmit() {
      if (this.isDetail) {
        this.formReset();
        return false;
      }
      // adForm校验
      let adFormValid = await this.$refs["adForm"].validate()
      // dtoForm校验
      let dtoFormValid = await this.$refs["dtoForm"].validate()

      // 星期/日期校验
      let params = JSON.parse(JSON.stringify(this.addData))
      let dtoData = params.trafficRestrictionDto
      let forList = []
      let formName = ""
      let typeName = ""
      if (dtoData.tailNumType === 1) {
        forList = dtoData.weekList
        delete dtoData.weekList
        formName = "weekForm"
        typeName = "星期"
      } else if (dtoData.tailNumType === 2) {
        forList = dtoData.daysList
        delete dtoData.daysList
        formName = "daysForm"
        typeName = "日期"
      }

      let isLimitSuccess = true
      if (dtoData.restrictionType === 1) {
        await forList.forEach((item, index) => {
          let key = formName + index
          this.$refs[key][0].validate().then(status => {
            if (!status) {
              isLimitSuccess = false
            }
          });
        })
        !isLimitSuccess && this.$Message.error(`请将所有${typeName}下的限制尾号填写完整`)
      }

      // 限制时段校验
      let timeFormValid = true
      await dtoData.timeDtos.forEach((item, index) => {
        let key = "timeForm" + index
        this.$refs[key][0].validate(vaild => {
          if (!vaild) {
            timeFormValid = false
          }
        })
      })

      if (adFormValid && dtoFormValid && isLimitSuccess && timeFormValid) {
        // 校验通过
        // 不限号日期格式化
        dtoData.selectedDates = dtoData.selectedDates.map(t => this.$moment(t).format("YYYY-MM-DD"))
        // 星期/日期
        dtoData.tailNumDataDtos = forList
        if (dtoData.restrictionType === 2) {
          dtoData.tailNumDataDtos[0]["limitTailNums"] = dtoData.limitTailNums;
        }
        // 电子围栏名字
        dtoData.fenceName = this.fenceList.filter(v => v.uuid === dtoData.fenceUuid)[0].name
        // 限制时段
        dtoData.timeDtos = dtoData.timeDtos.map(t => {
          return {
            startTime: t.timeItem[0],
            endTime: t.timeItem[1]
          }
        })
        this.axiosSubmit(params)
      }
    },
    // 发送保存请求
    axiosSubmit(params) {
      let axiosFun = this.isAdd ? axiosTrafficAdd : axiosTrafficEdit

      axiosFun(params).then(res => {
        this.$Message.success(`${handleTypeMap[this.handleType].type}成功！`);
        this.formReset(true);
      })
    },
    // isReload：是否重新加载列表页面数据
    formReset(isReload, closeFlag = true) {
      this.$refs["adForm"].resetFields();
      this.$refs["dtoForm"].resetFields();
      for (let i = 0; i < 20; i++) {
        let timei = this.$refs[`timeForm${i}`]
        if (timei) {
          timei[0] && timei[0].resetFields()
        } else {
          break
        }
      }
      closeFlag && this.$emit("close", isReload);
    },
    // 获取该城市下“限号限行围栏”类型的电子围栏
    getFenceList(value) {
      this.getHeaderNumber();
      let cityCode = value || this.addData.cityCode
      if (!cityCode) {
        this.fenceList = [...defaultFance]
      } else {
        // todo电子围栏接口已加权限，需要另行提供接口
        getElefenServiceSelectAll({
          cityCode: cityCode,
          railType: 18, // 限号限行围栏
          status: 1// 生效中状态的电子围栏
        }).then(res => {
          this.fenceList = res.data.data || [];
          let uuid = this.addData.trafficRestrictionDto.fenceUuid
          if (uuid) {
            let isUuid = this.fenceList.filter(v => v.uuid === uuid).length
            if (!isUuid) {
              this.addData.trafficRestrictionDto.fenceUuid = null
            }
          }

        })
      }
    },
    // 添加定时时间
    addTimeItem() {
      this.addData.trafficRestrictionDto.timeDtos.push({
        timeItem: []
      })
    },
    // 删除定时时间
    removeTime(index) {
      this.addData.trafficRestrictionDto.timeDtos.splice(index, 1)
    },
    getProductName(val) {
      // 处理产品线名称
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    }
  }
};
</script>
<style lang="less" src="./components/week-style.less"></style>
<style lang="less" scoped>
.remove-icon {
  position: absolute;
  left: 430px;
  top: 4px;
  font-size: 30px;
  color: #f55932;
  cursor: pointer;
  font-weight: bold;
}
.add-icon {
  margin: 0 0 24px 110px;
}
.btn-look{
  margin-top:-25px;
  color:#2d8cf0;
  text-decoration: underline;
  cursor: pointer;
}
</style>

