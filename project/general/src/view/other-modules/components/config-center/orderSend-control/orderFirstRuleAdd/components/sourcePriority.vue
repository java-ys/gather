<!--
 * @Author: Evil Cheng
 * @Date: 2021-11-04 17:31:53
 * @LastEditTime: 2022-04-22 16:36:00
 * @Description: 订单来源优先级策略
-->

<template>
  <div>
    <div class="sub-title">
      订单来源优先级策略
    </div>
    <div class="button_btn20">
      <Button v-if="fromSource !== 3" type="primary" @click="addOrderPlatform">
        新建渠道策略
      </Button>
    </div>
    <Form
      ref="tripartitePlatform"
      inline="inline"
      :model="tripartitePlatform"
      class="tripartitePlatform"
    >
      <div
        v-for="(item, index) in tripartitePlatform.tripartitePlatformVoList"
        :key="index"
        class="tripartitePlatform_container"
      >
        <div class="orderChannelSets">
          <FormItem
            label="订单渠道："
            :prop="'tripartitePlatformVoList.' + index + '.orderChannelSets'"
            :label-width="100"
            :rules="ruleValidate.orderChannelSets"
          >
            <Select
              v-model="
                tripartitePlatform.tripartitePlatformVoList[index]
                  .orderChannelSets
              "
              style="width: 200px"
              placeholder="请选择"
              multiple
              :max-tag-count="1"
              :disabled="fromSource === 3"
            >
              <Option
                v-for="item in channelOptionsNoAll"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
          <div
            v-if="index > 0"
            class="delete_icon"
            @click="removeOrderChannelSets(index)"
          >
            <Icon type="ios-remove-circle-outline" />
          </div>
        </div>
        <FormItem
          v-if="isShowWeek"
          label="星期值:"
          :prop="'tripartitePlatformVoList.' + index + '.orderChannelSets'"
          :label-width="100"
        >
          <div class="xqBlock">
            <div class="xq-title">
              <div
                v-for="(item, _index) in item.weekFormData"
                :key="_index"
                :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
                @click="checkedWeek(index, _index)"
              >
                {{item.weekName}}
                <Icon
                  v-if="fromSource !== 3"
                  type="md-close-circle"
                  class="closeIcon"
                  size="18"
                  @click="deleteWeek(index, _index)"
                />
              </div>
            </div>
            <div v-if="fromSource !== 3" class="xq-content">
              <Button
                v-if="fromSource !== 3"
                :disabled="isCheckedAllWeek()"
                type="info"
                :ghost="true"
                style="margin-right: 5px; margin-left: 5px"
                @click="initCheckedWeek(1, index)"
              >
                添加星期值
              </Button>
              <Button
                v-show="item.weekFormData && item.weekFormData.length > 0"
                v-if="fromSource !== 3"
                type="success"
                :ghost="true"
                @click="initCheckedWeek(2, index)"
              >
                编辑星期值
              </Button>
            </div>
          </div>
          <div
            v-show="!item.weekFormData || item.weekFormData.length === 0"
            style="color: red"
          >
            请先添加星期值
          </div>
        </FormItem>

        <!--  -->
        <div
          v-for="(itemT, xIndex) in item.weekFormData"
          v-show="itemT.isChecked"
          :key="xIndex"
          class="bottomForm"
        >
          <Form
            v-for="(yItem, yIndex) in itemT.timeDtoList"
            :ref="'weekForm' + yIndex"
            :key="yIndex"
            :model="yItem"
            :rules="weekFormValidate"
            :label-width="100"
          >
            <FormItem :label="'时段' + (yIndex + 1) + ':'" prop="periods">
              <div style="display: flex">
                <TimePicker
                  v-model="yItem.periods"
                  confirm
                  type="timerange"
                  placement="bottom-start"
                  placeholder="请选择时间段"
                  style="width: 168px"
                  :disabled="fromSource === 3"
                  @on-change="changeTime(index, xIndex, yIndex)"
                ></TimePicker>
              </div>
            </FormItem>
            <FormItem
              label="派单优先级:"
              prop="coefficient"
              class="ml-50 dispatchLevel"
            >
              <div class="dispatchItem" :disabled="fromSource === 3">
                <div>高</div>
                <div class="sliderItem">
                  <Slider
                    v-model="yItem.coefficient"
                    :disabled="fromSource === 3"
                    :min="0.1"
                    :max="2.0"
                    :step="0.1"
                  ></Slider>
                </div>
                <div>低</div>
                <span class="sliderTxt">派单系数：{{yItem.coefficient || 0.1}}</span>
              </div>

              <span
                v-if="fromSource !== 3"
                class="sliderRemove"
                @click="deleteWeekPeriod(index, xIndex, yIndex)"
              >删除</span>
            </FormItem>
          </Form>
          <Button
            v-if="fromSource !== 3"
            type="dashed"
            icon="md-add"
            style="margin-left: 70px"
            @click="addDiscountTime(index, xIndex)"
          >
            新增时段
          </Button>
        </div>
      </div>
    </Form>

    <checkedWeek ref="checkedWeek" @getWeekData="getWeekData" />
  </div>
</template>

<script>
import {
  validateArr,
  getWeekName,
  isAlabo,
  getReverseWeekName,
  validatorTimeDetail
} from "../fields";
import checkedWeek from "./checkedWeek";
import { deepClone } from "@/libs/util";
import { queryChannel } from "_g/api/common.js";

export default {
  components: {
    checkedWeek
  },
  props: {
    infoData: {
      type: Object
    }
  },
  data() {
    return {
      channelOptionsNoAll: [],
      fromSource: 1, // 新增 、编辑、详情
      // 订单来源优先级
      tripartitePlatform: {
        tripartitePlatformVoList: []
      },
      isShowWeek: true,
      weekFormData: [],
      ruleValidate: {
        orderChannelSets: [
          {
            required: true,
            message: "订单渠道不能为空"
          },
          {
            trigger: "blur",
            validator: validateArr("订单渠道不能为空")
          }
        ]
      },
      weekFormValidate: {
        periods: [
          {
            required: true,
            validator: validatorTimeDetail
          }
        ],
        coefficient: [
          {
            required: true,
            message: "必选"
          }
        ]
      }
    };
  },
  watch: {
    infoData: {
      handler: function(obj) {
        const newObj = deepClone({}, obj)
        // 用详情更新表单数据
        // 将数字星期值转换成汉字显示
        const tripartitePlatformVoList = newObj.tripartitePlatformVoList || []
        for (const tripartitePlatformVo of tripartitePlatformVoList) {
          const weekFormData = tripartitePlatformVo.contentDtoList
          weekFormData.forEach(item => {
            let weekName = "";
            item.weekList = item.weekList.map((yItem, index) => {
              let tempweekName = yItem;
              if (isAlabo(yItem)) {
                tempweekName = getWeekName(yItem);
              } else {
                yItem = getReverseWeekName(yItem);
              }
              if (weekName) {
                weekName = weekName + "、" + tempweekName;
              } else {
                weekName = tempweekName;
              }
              return yItem;
            });
            // 转换时间
            item.timeDtoList.forEach(yItem => {
              yItem.periods = [yItem.startTime, yItem.endTime];
            });
            item.weekName = weekName;
          });
          if (weekFormData[0]) {
            weekFormData[0].isChecked = true;
          }
          tripartitePlatformVo.weekFormData = weekFormData
        }
        this.tripartitePlatform = Object.assign(this.tripartitePlatform, { tripartitePlatformVoList });
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    queryChannel().then(res => {
      if (res.data.success) {
        this.channelOptionsNoAll = res.data.data.map(m => {
          return {
            label: m.sourseName,
            value: m.sourseValue
          }
        })
      }
    });
  },
  methods: {
    // 新增
    addOrderPlatform() {
      this.tripartitePlatform.tripartitePlatformVoList.push({
        orderChannelSets: [],
        contentDtoList: [],
        weekFormData: []
      });
    },
    // 移除订单渠道
    removeOrderChannelSets(index) {
      this.tripartitePlatform.tripartitePlatformVoList = this.tripartitePlatform.tripartitePlatformVoList.filter((item, i) => i !== index);
    },
    checkedWeek(supIndex, subIndex) {
      const { weekFormData }  = this.tripartitePlatform.tripartitePlatformVoList[
        supIndex
      ];
      const newWeekFormData = weekFormData.map((item, index) => {
        if (index === subIndex) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        return item;
      });
      this.tripartitePlatform.tripartitePlatformVoList[
        supIndex
      ].weekFormData = newWeekFormData
    },
    // 删除星期值
    deleteWeek(index, subIndex) {
      const weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData;
      weekFormData.splice(subIndex, 1);
    },
    // 判断是否已经选中了所有星期
    isCheckedAllWeek() {
      let arr = [];
      this.weekFormData.forEach((item, index) => {
        arr = [...arr, ...item.weekList];
      });
      if (arr && arr.length === 7) {
        return true;
      } else {
        return false;
      }
    },
    // 星期值新增/编辑
    initCheckedWeek(val, index) {
      // 新增
      const weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData;
      if (val === 1) {
        this.$refs.checkedWeek.addWeek({
          weekFormData,
          index
        });
      }
      // 编辑
      else {
        const checkedIndex = weekFormData.findIndex(v => v.isChecked)
        if (checkedIndex > -1) {
          const checktItem = weekFormData[checkedIndex]
          this.$refs.checkedWeek.getEditWeek({
            dataSource: weekFormData,
            currentData: checktItem.weekList.map(v => `${v}`),
            index: index,
            editIndex: checkedIndex
          });
        }
      }
    },
    // 获取星期数据
    getWeekData(val) {
      const index = val.index;
      this.tripartitePlatform.tripartitePlatformVoList[index].weekFormData =
        val.dataSource;
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      if (weekFormData.length === 1) {
        weekFormData[0].isChecked = true;
      }
    },
    deleteWeekPeriod(index, xIndex, yIndex) {
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      weekFormData[xIndex].timeDtoList.splice(yIndex, 1);
    },
    changeTime(index, xIndex, yIndex) {
      const weekFormData = this.tripartitePlatform.tripartitePlatformVoList[
        index
      ].weekFormData;
      let periods = weekFormData[xIndex].timeDtoList[yIndex].periods;
      weekFormData[xIndex].timeDtoList[yIndex].startTime = periods[0];
      weekFormData[xIndex].timeDtoList[yIndex].endTime = periods[1];
    },
    weekErrorMessage(data) {
      let flag = true;
      if (data.length === 0) {
        flag = false;
        this.$Message.warning("请添加星期值");
      } else {
        try {
          data.forEach(item => {
            if (item.timeDtoList.length === 0) {
              flag = false;
              this.$Message.warning("请新增时段");
              throw new Error("errorMsg");
            } else {
              item.timeDtoList.forEach(yItem => {
                if (!yItem.startTime) {
                  flag = false;
                  this.$Message.warning("请选择时段");
                  throw new Error("errorMsg");
                }
                if (!yItem.coefficient) {
                  // flag = false;
                  // this.$Message.warning("请选择系数");
                  // throw new Error("errorMsg");
                  yItem.coefficient = 0.1;
                }
              });
            }
          });
        } catch (e) {
          if (e.message !== "errorMsg") {
            throw e;
          }
        }
      }
      return flag;
    },
    // 添加折扣时段
    addDiscountTime(index, xIndex) {
      let weekFormData = this.tripartitePlatform.tripartitePlatformVoList[index]
        .weekFormData;
      if (weekFormData[xIndex].timeDtoList.length >= 50) {
        this.$Message.warning("一个星期值区块下最多可添加50个时段");
      } else {
        weekFormData[xIndex].timeDtoList.push({
          // startTime: "",
          // endTime: "",
          // coefficient: "",
          // periods:[]
        });
        weekFormData = JSON.parse(JSON.stringify(weekFormData));
        this.tripartitePlatform.tripartitePlatformVoList[
          index
        ].weekFormData = weekFormData;
      }
    },
    // 删除折扣时段
    deleteDiscountTime(index, yIndex) {
      this.weekFormData[index].timeDtoList.splice(yIndex, 1);
    },
    getFormData() {
      return new Promise((resolve, reject) => {
        if (
          this.tripartitePlatform.tripartitePlatformVoList &&
          !this.tripartitePlatform.tripartitePlatformVoList.length
        ) {
          this.$Message.warning("订单来源优先级策略不能为空");
          resolve(null);
        }
        this.$refs.tripartitePlatform.validate(valide => {
          if (valide) {
            for (const i of this.tripartitePlatform.tripartitePlatformVoList) {
              let flag = this.weekErrorMessage(i.weekFormData);
              if (!flag) {
                resolve(null);
                break;
              }
              i.contentDtoList = i.weekFormData.map(item => {
                item.weekList = item.weekList.map(yItem => {
                  if (isAlabo(yItem)) {
                    yItem = getWeekName(yItem);
                  }
                  return yItem;
                });
                return item;
              });
            }
            resolve(this.tripartitePlatform);
          } else {
            resolve(null);
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
