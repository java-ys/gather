<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      width="850px"
      :mask-closable="false"
    >
      <Form ref="form" :model="formData">
        <FormItem
          v-if="fromSource === 1"
          label="适用城市："
          :label-width="100"
          prop="provinceCityCode"
          :rules="formValidate.provinceCityCode"
        >
          <Cascader
            v-model="formData.provinceCityCode"
            :data="provinceCityList"
            trigger="hover"
            filterable
            :clearable="false"
            style="width: 200px; display: flex"
            :disabled="fromSource !== 1"
            @on-change="handleCityChange"
          ></Cascader>
        </FormItem>
        <FormItem v-else label="适用城市：" :label-width="100">
          <div>{{formData.provinceCityCodeName}}</div>
        </FormItem>
        <FormItem
          v-if="fromSource === 1"
          label="区县："
          prop="areaCode"
          :label-width="100"
        >
          <Select
            v-model="formData.areaCode"
            style="width: 200px"
            placeholder="请选择区县"
          >
            <Option
              v-for="item in areaList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem v-else label="区县：" :label-width="100">
          <div>{{formData.areaName}}</div>
        </FormItem>
        <div class="line"></div>


        <!-- 新增需求星期添加 -->
        <FormItem
          label="星期值:"
          :rules="formValidate.strategyTimes"
          prop="strategy"
          :label-width="100"
        >
          <div style="display: flex" class="topTo10">
            <div class="xq-title">
              <div
                v-for="({ circulateTimes,isChecked }, index) in formData.strategy"
                :key="
                  circulateTimes.map(v => weekMap[v]).join('、')
                "
                class="xq-primary"
                :class="[isChecked ? 'xq-item-checked' : 'xq-item']"
                @click="checkedWeek(index)"
              >
                {{circulateTimes.map(v => weekMap[v]).join("、")}}
                <Icon
                  v-if="fromSource !== 3"
                  type="md-close-circle"
                  class="closeIcon"
                  size="18"
                  @click.stop="deleteWeek(index)"
                />
              </div>
            </div>
            <div v-if="fromSource !== 3" class="xq-content">
              <Button
                :disabled="isCheckedAllWeek()"
                type="info"
                :ghost="true"
                style="margin-right: 5px; margin-left: 5px"
                @click="initCheckedWeek(1, 'checkedWeek')"
              >
                添加星期值
              </Button>
              <Button
                v-show="
                  formData.strategy && formData.strategy.length > 0
                "
                type="success"
                :ghost="true"
                @click="initCheckedWeek(2, 'checkedWeek')"
              >
                编辑星期值
              </Button>
            </div>
          </div>
        </FormItem>
        <!-- 这边是时间和优先级 -->
        <div
          v-for="({ circulateTimes,isChecked,timeConf }, index) in formData.strategy"
          v-show="isChecked"
          :key="circulateTimes.map((v) => weekMap[v]).join('、')"
          class="timeDiv"
        >
          <Form
            v-for="(yItem, yIndex) in timeConf"
            :ref="'timeForm_' + index + '_' + yIndex"
            :key="yIndex"
            :model="yItem"
            :label-width="100"
            label-position="left"
            :rules="periodValidate"
          >
            <Row>
              <Col span="12">
                <FormItem
                  :label="'时段' + (yIndex + 1) + '：'"
                  prop="periods"
                >
                  <div v-if="fromSource !== 3" style="display: flex">
                    <TimePicker
                      v-model="yItem.periods"
                      confirm
                      type="timerange"
                      :editable="false"
                      placement="bottom-end"
                      placeholder="请选择时间段"
                      style="width: 168px"
                    ></TimePicker>
                    <div
                      v-if="fromSource !== 3 && yIndex > 0"
                      class="delete_icon"
                      style="margin-left: 5px"
                      @click="deleteTime(index, yIndex)"
                    >
                      <Icon type="ios-remove-circle-outline" />
                    </div>
                  </div>
                  <div v-else>
                    {{yItem.periods.join(" - ")}}
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem
                  :label="'业务线优先级：'"
                  prop="biz"
                  :label-width="100"
                >
                  <!-- 这里是排序 -->
                  <template v-if="yItem.biz.length > 0">
                    <transition-group
                      name="drag"
                      class="list"
                      tag="ul"
                    >
                      <li
                        v-for="({ bizTypeName,bizType }, bIndex) in yItem.biz"
                        :key="bizType"
                        :draggable="fromSource !== 3"
                        class="list-item"
                        @dragenter="dragenter($event,index,yIndex,bIndex)"
                        @dragover="dragover($event, bIndex)"
                        @dragstart="dragstart(bIndex)"
                      >
                        <div class="myIndex">{{bIndex + 1}}</div>
                        {{bizTypeName}}
                      </li>
                    </transition-group>
                  </template>
                  <template v-else>
                    <span>无</span>
                  </template>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div>
            <Button
              v-if="fromSource !== 3"
              type="info"
              :ghost="true"
              @click="addTime(index)"
            >
              新增时段
            </Button>
          </div>
        </div>
      </Form>

      <div v-if="fromSource === 3" slot="footer">
        <Button type="primary" @click="showModal = false"> 确定 </Button>
      </div>
      <div v-else slot="footer">
        <Button @click="showModal = false"> 取消 </Button>
        <Button v-lazy-click="saveData" type="primary"> 保存 </Button>
      </div>
    </Modal>
    <checked-week ref="checkedWeek" @getWeekData="getWeekData" />
  </div>
</template>

<script>
import {
  validatorTimeDetail,
  getPeriods,
  getProvinceIdByCityUuid,
} from "./fields";
import checkedWeek from "../traffic-restriction/components/cheek-week-days.vue";
import { bizAdd, bizEdit, getbizByCityArea } from "_o/api/operationAdmin.js";
import { getAreaInfoByCityCode } from "_o/api/configData.js";

// 星期转换
const weekMap = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日",
};

export default {
  name: "add",
  components: {
    checkedWeek,
  },
  props: ["provinceCityList"],
  data() {
    return {
      weekMap,
      showModal: false,
      title: "新增业务优先级策略",
      id: "",
      areaList: [], // 区县数据
      cityCode: "", // 城市code
      fromSource: "", // 1.新增 2.编辑 3.详情
      formData: {
        provinceCityCode: [], // 省市
        areaCode: "", // 区县code
        strategy: []
      },
      formValidate: {
        provinceCityCode: [
          { required: true, message: "省市必选", type: "array" },
        ],
        strategyTimes: [
          // 星期数组
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback("星期值必选");
              } else {
                callback();
              }
            },
          },
        ],
      },
      // timeDtoList: [getPeriods(this)], // 时段
      periodValidate: {
        periods: [
          {
            required: true,
            validator: validatorTimeDetail,
          },
        ],
      },
      // 新增判断条件
      currentEditWeekIndex: 0, // 当前星期的索引
      // 当前对星期的操作
      handleWeek: 1, // 1:新增  2:编辑
      bizTypeList: [] // 根据城市和区县更改业务线
    };
  },

  watch: {
    "formData.provinceCityCode": {
      deep: true,
      immediate: true,
      handler(newValue) {
        console.log(newValue);
        if (newValue && newValue.length !== 0) {
          const cityCode = newValue[1];
          this.$nextTick(() => {
            this.getNewBiz(1, cityCode);
          })
        }
      }
    },

    "formData.areaCode": {
      handler(newValue) {
        if (newValue) {
          const areaCode = newValue;
          this.$nextTick(() => {
            this.getNewBiz(2, areaCode);
          })
        }
      }
    },

  },
  methods: {
    // 城市变更
    handleCityChange(val) {
      if (val.length === 0) {
        this.areaCode = "";
        this.areaList = [];
        return;
      }
      const areaCode = val[1];
      this.getAreaByCityCode(areaCode);
    },
    // 获取区县
    async getAreaByCityCode(val) {
      const res = await getAreaInfoByCityCode({ cityCode: val });
      if (res.data.success) {
        // 清空已选值
        this.formData.areaCode = "";
        const list = res.data.data.map((it) => {
          return {
            label: it.orgName,
            value: it.orgCode,
          };
        });
        this.$nextTick(() => {
          this.areaList = list;
        });
      }
    },
    // 新增时 切换城市或者区县重新替换biz  type:1 城市 type:2 县区
    getNewBiz(type, code) {
      const params = {
        openStatus: 1,
      };
      if (type === 1) {
        params.cityCode = code;
      } else if (type === 2) {
        params.cityCode = this.formData.provinceCityCode[1] || this.cityCode;
        params.areaCode = code;
      }
      getbizByCityArea(params).then(res => {
        const data = res.data.data || [];
        this.bizTypeList = data.length > 0 ? JSON.parse(JSON.stringify(data)) : [];
        console.log()
        // 判断新增时是否已存在时间段策略有就更新
        if (this.fromSource === 1) {
          let strategy = this.formData.strategy;
          strategy && strategy.forEach(({ timeConf }) => {
            timeConf && timeConf.forEach(item => {
              item.biz = data.length > 0 ? JSON.parse(JSON.stringify(data)) : [];
            })
          });
          this.$forceUpdate();
          console.log("haha:", this.formData.strategy)
        }
      })
    },
    // 重置表单
    resetForm() {
      this.formData = {
        provinceCityCode: [], // 省市
        areaCode: "", // 区县code
        strategy: []
      }
    },
    // 初始化操作
    init(val) {
      console.log(val);
      this.showModal = true;
      this.areaList = [];
      // 新增
      if (!val) {
        this.title = "新建业务优先级策略";
        this.fromSource = 1;
        this.resetForm();
      } else {
        // 表单重置
        for (let key in this.$refs) {
          if (key.indexOf("timeForm") > -1) {
            this.$refs[key].forEach((item) => {
              item.resetFields();
            });
          }
        }
        this.$refs.form.resetFields();
        let { id, provinceName, cityName, areaName, cityCode, areaCode, strategy } = val;
        // 获取编辑时的产品线
        // 编辑/详情
        this.title = "编辑业务优先级策略";
        this.fromSource = 2;
        this.id = id;
        this.cityCode = cityCode;
        const provinceId = getProvinceIdByCityUuid(
          cityCode,
          this.provinceCityList
        );

        if (areaCode) {
          this.formData.areaCode = areaCode;
        } else {
          this.formData.provinceCityCode = [provinceId, cityCode];
        }
        // 判断是否转换数据
        // 转化 strategy 为页面展示内容
        this.formData.strategy = strategy.map(({ week, timeConf }, index) => {
          const timeConfNew = timeConf.map(({ startTime, stopTime, biz }) => {
            return {
              periods: [startTime, stopTime],
              biz,
            };
          });
          const i = {
            circulateTimes: week,
            timeConf: timeConfNew,
            isChecked: index === 0 ? true : false,
          };
          return i;
        });
        // 编辑和详情的区县展示
        this.formData.provinceCityCodeName = `${provinceName}/${cityName}`
        this.formData.areaName = areaName || "-";
        // 再次判断是编辑还是详情
        if (val.isDetail) {
          this.title = "车辆优先级策略详情";
          this.fromSource = 3;
        } else {
          this.fromSource = 2;
        }
      }
    },
    // 保存事件
    saveData() {
      const promises = [];
      promises.push(this.$refs.form.validate());
      for (let key in this.$refs) {
        if (key.indexOf("timeForm") > -1) {
          this.$refs[key].forEach(item => {
            promises.push(item.validate());
          });
        }
      }
      Promise.all(promises)
        .then(values => {
          if (!values.includes(false)) {
            this.validateRangeJoin().then((res) => {
              if (res.flag) {
                this.submit();
              } else {
                this.$Message.error({
                  content: `第${
                    res.index_1 + 1
                  }个星期值时段有交叉`,
                  duration: 3,
                });
              }
            });
            // this.submit();
          } else {
            console.log("校验失败");
          }
        })
        .catch((err) => {
          console.log("校验失败:", err);
        });
    },
    // 整合规则中的数据变为提交时的格式
    formatStrategy(strategy) {
      const list = strategy.map(({ circulateTimes, timeConf }) => {
        const timeConfNew = timeConf.map(({ periods, biz }) => {
          return {
            startTime: periods[0],
            stopTime: periods[1],
            biz,
          };
        });
        const i = {
          week: circulateTimes,
          timeConf: timeConfNew,
        };
        return i;
      });
      return list || []
    },
    // 业务线排序校验
    // businessOrderCheck() {
    //   let flag = false;
    //   const data = this.formData.strategy;
    //   data && data.forEach(({ timeConf }, index) => {
    //     if (flag) return true;
    //     timeConf && timeConf.forEach(({ biz }, index2) => {
    //       if (flag) return true;
    //       const bizNew = biz.map(({ bizType }) => bizType) || [];
    //       if (bizNew.includes(1) && bizNew.includes(12) && bizNew.indexOf(1) < bizNew.indexOf(12)) {
    //         this.$Message.warning({ content: `第${index + 1}个星期值中第${index2 + 1}时间段：业务线新享特选必须排在普通运营前面`, duration: 3 });
    //         flag = true;
    //       }
    //     })
    //   })
    //   return flag
    // },
    // 校验成功后调接口
    submit() {
      // if (this.businessOrderCheck()) return;
      let { areaCode, strategy } = this.formData;
      let params = {
        cityCode: this.getCityUuid(),
        areaCode,
        strategy: this.formatStrategy(JSON.parse(JSON.stringify(strategy)))
      };
      // 新增
      if (this.fromSource === 1) {
        bizAdd(params).then((res) => {
          const data = res.data;
          if (data.code === 200) {
            this.showModal = false;
            this.$emit("reload");
            this.$Message.success(`新增${res.data.msg}`);
          } else {
            this.$Message.error(res.data.msg);
          }

        });
      } else if (this.fromSource === 2) {
        // 编辑
        delete params.cityCode;
        delete params.areaCode;
        params.id = this.id;
        bizEdit(params).then((res) => {
          const data = res.data;
          if (data.code === 200) {
            this.showModal = false;
            this.$emit("reload");
            this.$Message.success(`更新${res.data.msg}`);
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      }
    },

    // 添加时段
    addTime(index) {
      const timeDtoList = this.formData.strategy[index].timeConf;
      if (timeDtoList.length >= 50) {
        this.$Message.warning("最多可添加50个时段");
      } else {
        timeDtoList.push(getPeriods(this));
      }
    },
    // 删除时段
    deleteTime(index, yIndex) {
      const timeDtoList = this.formData.strategy[index].timeConf;
      timeDtoList.splice(yIndex, 1);
    },

    // 获取城市名
    getCityName(cityid) {
      const provinceCityList = this.provinceCityList;
      let cityName = "";
      provinceCityList.forEach((item) => {
        if (item.children) {
          item.children.forEach((it) => {
            if (it.value === cityid) {
              cityName = it.label;
            }
          });
        }
      });
      return cityName;
    },
    // 获取用户id
    getUserId() {
      return (
        JSON.parse(localStorage.getItem("login-info-dash")) ||
        JSON.parse(localStorage.getItem("loginInfo")) ||
        {}
      ).userId;
    },
    // 获取城市Id
    getCityUuid() {
      return this.formData.provinceCityCode[1]
        ? this.formData.provinceCityCode[1]
        : this.formData.provinceCityCode[0];
    },
    // 检测时段是否相交
    validateRangeJoin() {
      // 校验
      let contentList = JSON.parse(JSON.stringify(this.formData.strategy));
      let info = {
        flag: true,
        index_1: null,
      };
      let flagOver = true;
      contentList.forEach(({ timeConf }, index) => {
        if (!flagOver) {
          return Promise.resolve(info);
        }
        timeConf && timeConf.forEach(({ periods }, index2) => {
          if (!flagOver) {
            return Promise.resolve(info);
          }
          if (timeConf.length > 1) {
            const times = timeConf.map(({ periods }) => {
              return {
                min: parseInt(periods[0].split(":").join(), 10),
                max: parseInt(periods[1].split(":").join(), 10),
              };
            });

            times.forEach((itOne, indexOne) => {
              times.forEach((it, idx) => {
                if (idx > indexOne) {
                  if (
                    (it.min >= itOne.min && it.min < itOne.max) ||
                    (it.max > itOne.min && it.max <= itOne.max) ||
                    (it.min <= itOne.min && it.max >= itOne.max)
                  ) {
                    info = {
                      flag: false,
                      index_1: index,
                    };
                    flagOver = false;
                  }
                }
              });
            });
          }
        });
      });
      return Promise.resolve(info);
    },
    // todo
    // 切换星期选中
    checkedWeek(_index) {
      // 保存切换的索引
      this.currentEditWeekIndex = _index;
      this.formData.strategy.map((item, index) => {
        if (index === _index) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      });
    },

    // 删除星期值
    deleteWeek(_index) {
      this.formData.strategy.splice(_index, 1);
    },
    // 是否是详情
    isDetail() {
      return this.fromSource === 3;
    },

    // 判断是否已经选中了所有星期
    isCheckedAllWeek() {
      let arr = [];
      let max = 7;
      this.formData.strategy && this.formData.strategy.forEach((item, index) => {
        arr = [...arr, ...item.circulateTimes];
      });
      if (arr && arr.length === max) {
        return true;
      } else {
        return false;
      }
    },

    // 星期值新增/编辑   val  1：添加 2：编辑
    initCheckedWeek(val, refName) {
      // 校验城市
      if (this.formData.provinceCityCode.length === 0) {
        this.$Message.warning("城市必填，否则无法显示业务线！");
        return;
      }
      let data = this.formData.strategy;
      // 新增
      if (val === 1) {
        this.handleWeek = 1;
        this.$refs[refName].addWeek(data);
      }
      // 编辑
      else {
        this.handleWeek = 2;
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

    // 获取星期数据
    getWeekData(val) {
      // index是当前星期的索引
      let index = this.currentEditWeekIndex;
      console.log(val);
      console.log("我要添加东西");
      let length = val.length;
      let handleWeek = this.handleWeek;
      let data = this.formData.strategy;
      // 用于判断是新增还是编辑
      if (handleWeek === 1) {
        data.push({
          circulateTimes: val[length - 1].circulateTimes,
          isChecked: false,
          timeConf: [getPeriods(this)],
        });
        if (data.length === 1) {
          data[0].isChecked = true;
          // 校验下表单
          // this.$refs.subForm.validateField(
          //   "content." + index + ".strategyTimes"
          // );
        }
      } else if (handleWeek === 2) {
        const selectInfo = val.filter((item) => item.isChecked === true)[0];
        data[index].circulateTimes = selectInfo.circulateTimes;
        console.log(selectInfo);
      }
    },
    // 拖拽的方法
    // 拖拽开始方法
    dragstart(index) {
      this.dragIndex = index;
    },
    // 拖拽结束 index:星期数据索引 yIndex：时间段索引  bIndex：拖拽的list索引
    dragenter(e, index, yIndex, bIndex) {
      e.preventDefault();
      // 避免源对象触发自身的dragenter事件
      if (this.dragIndex !== bIndex) {
        const list = this.formData.strategy[index].timeConf[yIndex].biz;
        const moving = list[this.dragIndex];
        list.splice(this.dragIndex, 1);
        list.splice(bIndex, 0, moving);
        // 排序变化后目标对象的索引变成源对象的索引
        this.dragIndex = bIndex;
      }
    },
    dragover(e, index) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="less" src="../traffic-restriction/components/week-style.less"></style>
<style lang="less" scoped>
.line {
  height: 0.5px;
  width: 100%;
  border-color: #eee;
  background-color: #eee;
  margin-bottom: 20px;
}
/deep/ .ivu-table-tip {
  overflow: hidden;
}
.timeDiv {
  /deep/ .ivu-select-dropdown {
    left: 0 !important;
  }
  max-height: 450px;
  overflow: auto;
}

.lineH20 {
  line-height: 20px;
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.mt20 {
  margin: 20px 0;
}
.mb20 {
  margin: 20px 0;
}
.dispatchLevel {
  /deep/ .ivu-form-item-content {
    display: flex;
  }

  .dispatchItem {
    display: flex;
    width: 400px;
    padding: 0px 10px;
    .sliderItem {
      width: 200px;
      margin: 0 15px;
    }
    .sliderTxt {
      margin-left: 15px;
    }
  }
  .sliderRemove {
    font-size: 14px;
    color: red;
    margin-left: 16px;
    cursor: pointer;
  }
}

  .delete_icon {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    /deep/ .ivu-icon {
      margin-right: -15px;
      font-size: 20px;
      color: red;
      font-weight: 600;
    }
}
// todo
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
.btn-look {
  margin-top: -25px;
  color: #2d8cf0;
  text-decoration: underline;
  cursor: pointer;
}

.xq-title {
  display: flex;
  margin-right: 30px;
  .xq-primary {
    text-align: center;
    line-height: 18px;
    padding: 7px;
    // color: #000000;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 4px;
    font-weight: bold;
    position: relative;
    padding-right: 28px;
    padding-left: 28px;
  }
  .xq-item-checked {
    color: #ffffff;
    background: #2d8cf0;
    border: none;
  }
  .xq-item {
    color: #000000;
    background: #ffffff;
    border: 1px solid #dcdee2;
  }
  .closeIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.strategyPrice {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
}

.timePrice {
  span {
    font-size: 18px;
  }
}

.cutLine {
  padding: 20px 0;
  width: 100%;
  border: 0;
}

// 拖拽样式
.list {
  list-style: none;
  .drag-move {
    transition: transform .3s;
  }
  .list-item {
    position: relative;
    cursor: move;
    width: 300px;
    background: #EA6E59;
    border-radius: 4px;
    color: #FFF;
    margin-bottom: 6px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .myIndex {
    position: absolute;
    left: 5px;
  }
}
</style>

