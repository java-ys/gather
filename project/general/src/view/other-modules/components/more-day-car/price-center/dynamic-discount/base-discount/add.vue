<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="800px"
    :z-index="1"
    :mask-closable="false"
    @on-visible-change="modalChange"
  >
    <Form
      inline="inline"
      :model="formData"
      :label-width="85"
      :rules="formValidate"
      ref="form"
    >
      <FormItem label="策略名称:" prop="ruleName">
        <Input
          clearable="clearable"
          style="width: 300px"
          v-model="formData.ruleName"
          :maxlength="50"
        />
      </FormItem>
      <br />
      <FormItem label="产品线:" prop="businessType">
        <Select v-model="formData.businessType" clearable style="width: 300px">
          <Option :value="4">快享</Option>
          <Option :value="2">专享</Option>
        </Select>
      </FormItem>
      <br />
      <FormItem label="城市:" prop="cityCode">
        <Select
          v-model="formData.cityCode"
          style="width: 300px"
          filterable
          clearable
        >
          <Option
            v-for="(value, key, index) in cityList"
            :value="key"
            :key="key"
            >{{ value }}</Option
          >
        </Select>
      </FormItem>
      <br />
      <FormItem label="生效时间:" prop="effectiveTime">
        <DatePicker
          v-model="formData.effectiveTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placement="bottom-end"
          placeholder="请选择生效时间"
          style="width: 300px"
        ></DatePicker>
      </FormItem>
      <br />
      <FormItem label="折扣上限:" prop="cellingFare">
        <Input
          v-model="formData.cellingFare"
          clearable="clearable"
          style="width: 300px"
          :maxlength="12"
        />
      </FormItem>
      <br />
      <FormItem label="星期值:" prop="week">
        <div style="display: flex">
          <div class="xq-title">
            <div
              :class="[item.isChecked ? 'xq-item-checked' : 'xq-item']"
              v-for="(item, index) in weekFormData"
              :key="index"
              @click="checkedWeek(index)"
            >
              {{ item.weekName }}
              <Icon
                type="md-close-circle"
                class="closeIcon"
                size="18"
                @click="deleteWeek(index)"
              />
            </div>
          </div>
          <div class="xq-content">
            <Button
              :disabled="isCheckedAllWeek()"
              type="info"
              :ghost="true"
              style="margin-right: 10px; margin-left: 30px"
              @click="initCheckedWeek(1)"
              >添加星期值</Button
            >
            <Button
              v-show="weekFormData && weekFormData.length > 0"
              type="success"
              :ghost="true"
              @click="initCheckedWeek(2)"
              >编辑星期值</Button
            >
          </div>
        </div>
        <div
          v-show="!weekFormData || weekFormData.length === 0"
          style="color: red"
        >
          请先添加星期值
        </div>
      </FormItem>
      <br />
    </Form>
    <div
      v-for="(item, index) in weekFormData"
      :key="index"
      v-show="item.isChecked"
    >
      <Form
        :ref="'weekForm' + yIndex"
        :model="yItem"
        :rules="weekFormValidate"
        :label-width="100"
        v-for="(yItem, yIndex) in item.periodRules"
        :key="yIndex"
      >
        <FormItem
          :label="'折扣时段' + (yIndex + 1) + ':'"
          prop="periods"
          class="ml-50"
        >
          <div style="display: flex">
            <TimePicker
              v-model="yItem.periods"
              confirm
              type="timerange"
              placement="bottom-end"
              placeholder="请选择时间段"
              style="width: 168px"
            ></TimePicker>
            <div
              v-if="yItem.mileageRules && yItem.mileageRules.length > 0"
              class="addLc"
              @click="editLc({ index: index, yIndex: yIndex, data: yItem })"
            >
              编辑里程节点
            </div>
            <div
              v-else
              class="addLc"
              @click="addLc({ index: index, yIndex: yIndex })"
            >
              添加里程节点
            </div>

            <Icon
              type="ios-remove-circle-outline"
              size="30"
              style="cursor: pointer"
              color="red"
              @click="deleteDiscountTime(index, yIndex)"
            />
          </div>
        </FormItem>

        <FormItem
          v-if="yItem.mileageRules && yItem.mileageRules.length > 0"
          prop="mileageRules"
          :rules="{ required: true }"
        >
          <table class="table">
            <tr>
              <td>里程区间&nbsp;(&nbsp;公里&nbsp;)&nbsp;</td>
              <td>折扣系数</td>
            </tr>
            <tr v-for="(zItem, zIndex) in yItem.mileageRules" :key="zIndex">
              <td>
                {{
                  zIndex === yItem.mileageRules.length - 1
                    ? zItem.mileStart + "以上"
                    : zItem.mileStart + "-" + zItem.mileEnd
                }}
              </td>
              <td>
                <Form :model="zItem" :rules="lcValidate" :label-width="100">
                  <FormItem prop="discountRate">
                    <Input
                      v-model="zItem.discountRate"
                      clearable="clearable"
                      style="width: 130px"
                      :maxlength="12"
                    />
                  </FormItem>
                </Form>
              </td>
            </tr>
          </table>
        </FormItem>

        <FormItem label="折扣系数:" prop="discountRate" class="ml-50" v-else>
          <Input
            v-model="yItem.discountRate"
            clearable="clearable"
            style="width: 170px"
            :maxlength="12"
          />
        </FormItem>
      </Form>
      <Button
        type="dashed"
        @click="addDiscountTime(index)"
        icon="md-add"
        style="margin-left: 70px"
        >添加折扣时段</Button
      >
    </div>

    <div></div>
    <div slot="footer">
      <Button @click="showModal = false">取消</Button>
      <Button type="primary" v-lazy-click="saveData">保存</Button>
    </div>
    <checkedWeek ref="checkedWeek" @getWeekData="getWeekData" />
    <addMileage ref="addMileage" @getAddMileage="getAddMileage" />
  </Modal>
</template>

<script>
import { validatorTime, validatorTimeDetail, getWeekName } from "./fields";
import { baseDiscountAdd } from "_o/api/more-day-car";
import checkedWeek from "./components/checkedWeek";
import addMileage from "./components/addMileage";

export default {
  name: "add",
  props: ["cityList"],
  components: {
    checkedWeek,
    addMileage,
  },
  data() {
    let self = this;
    return {
      showModal: false,
      title: "新增策略",
      formData: {}, // 简单表单数据
      formValidate: {
        // 简单表单数据校验
        ruleName: [
          {
            required: true,
            message: "必填",
            trigger: "change",
          },
          {
            pattern: /^[^\s]{1,50}$/,
            message: "不能输入空格且最多50位",
            trigger: "change",
          },
        ],
        businessType: [{ required: true, message: "必选" }],
        cityCode: [{ required: true, message: "必选" }],
        effectiveTime: [
          {
            required: true,
            validator: validatorTime,
          },
        ],
        cellingFare: [
          {
            pattern: /^(\d+|\d+\.\d{1,2})$/,
            message: "大于0的数字，最多2位小数",
            trigger: "change",
          },
        ],
        week: {
          required: true,
          message: "",
        },
      },

      weekFormData: [], // 星期值数据源
      weekFormValidate: {
        periods: [
          {
            required: true,
            validator: validatorTimeDetail,
          },
        ],

        discountRate: [
          {
            required: true,
            message: "必填",
          },
          {
            pattern: /^(0.[0-9]{1,2}|1)$/,
            message: "大于0且小于等于1的数字，最多输入两位小数",
            trigger: "change",
          },
        ],
      },
      lcValidate: {
        discountRate: [
          {
            required: true,
            message: "必填",
          },
          {
            pattern: /^(0.[0-9]{1,2}|1)$/,
            message: "大于0且小于等于1的数字，最多输入两位小数",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    init(val) {
      this.showModal = true;
      this.$refs.form.resetFields();
      // 新增
      if (!val) {
        this.formData = {
          ruleName: "", //策略名称
          businessType: 4, //业务类型。只能选择一项
          cityCode: "", //城市编码
          effectiveTime: "", //生效时间
          cellingFare: "", //折扣上限
          week: 1, // 星期值表单校验
        };
        this.weekFormData = [];
      }
      // 编辑
      else {
        let valData = JSON.parse(JSON.stringify(val));

        this.formData = {
          ruleName: valData.ruleName, //策略名称
          businessType: valData.businessType, //业务类型。只能选择一项
          cityCode: valData.cityCode, //城市编码
          effectiveTime: "", //生效时间
          cellingFare: valData.cellingFare, //折扣上限
          week: 1, // 星期值表单校验
        };
        valData.discountPeriods = JSON.parse(valData.content);
        valData.discountPeriods = valData.discountPeriods.map((item) => {
          item.periodRules = item.periodRules.map((yItem) => {
            yItem.periods = [yItem.periodBegin, yItem.periodEnd];
            return yItem;
          });
          return item;
        });
        console.log(valData.discountPeriods);
        this.weekFormData = valData.discountPeriods;
        this.weekFormData[0].isChecked = true;
        console.log(valData);
        // 将数字星期值转换成汉字显示
        this.weekFormData = this.weekFormData.map((item) => {
          let weekName = "";
          item.week.forEach((yItem) => {
            if (weekName) {
              weekName = weekName + "、" + getWeekName(yItem);
            } else {
              weekName = getWeekName(yItem);
            }
          });
          item.weekName = weekName;
          return item;
        });
      }
    },
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断星期值折扣是否填写完整
          let notWeekName = this.checkIsAllWeek();
          if (notWeekName) {
            this.$Modal.confirm({
              title: "确认保存",
              content: `未对星期${notWeekName}的折扣明细进行配置，是否保存？`,
              cancelText: "再看看",
              okText: "确认保存",
              closable: true,
              onOk: () => {
                this.submit();
              },
              onCancel: () => {},
            });
          } else {
            this.submit();
          }
        }
      });
    },
    // 判断哪些星期没有配置
    checkIsAllWeek() {
      let arr = [];
      let week = [1, 2, 3, 4, 5, 6, 7];
      let weekName = "";
      this.weekFormData.forEach((item) => {
        item.week.forEach((yItem) => {
          arr.push(yItem);
        });
      });
      week = week.filter((item) => !arr.some((e) => e === item));
      week.forEach((item) => {
        if (weekName) {
          weekName = weekName + "、" + getWeekName(item);
        } else {
          weekName = getWeekName(item);
        }
      });
      return weekName;
    },
    submit() {
      let params = {
        ruleName: this.formData.ruleName, //策略名称
        businessType: this.formData.businessType, //业务类型。只能选择一项
        cityCode: this.formData.cityCode, //城市编码
        effectiveTime: this.$moment(this.formData.effectiveTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ), //生效时间
        cellingFare: this.formData.cellingFare, //折扣上限
        discountPeriods: this.weekFormData,
      };
      console.log(params);
      baseDiscountAdd(params).then((res) => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    },
    checkedWeek(val) {
      this.weekFormData = this.weekFormData.map((item, index) => {
        if (index === val) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
        return item;
      });
    },
    // 添加折扣时段
    addDiscountTime(val) {
      if (this.weekFormData[val].periodRules.length >= 50) {
        this.$Message.warning("一个星期值区块下最多可添加50个时段");
      } else {
        this.weekFormData[val].periodRules.push({});
        this.weekFormData = JSON.parse(JSON.stringify(this.weekFormData));
      }
    },
    // 删除折扣时段
    deleteDiscountTime(index, yIndex) {
      this.weekFormData[index].periodRules.splice(yIndex, 1);
    },
    addLc(indexFlag) {
      this.$refs.addMileage.init(indexFlag);
    },

    editLc(val) {
      this.$refs.addMileage.edit(val);
    },
    // 获取里程节点数据
    getAddMileage(val) {
      let data = val.data;
      let indexFlag = val.indexFlag;
      this.weekFormData[indexFlag.index].periodRules[
        indexFlag.yIndex
      ].discountRate = "";
      this.weekFormData[indexFlag.index].periodRules[
        indexFlag.yIndex
      ].mileageRules = data;
      this.weekFormData = JSON.parse(JSON.stringify(this.weekFormData));
    },
    // 判断是否已经选中了所有星期
    isCheckedAllWeek() {
      let arr = [];
      this.weekFormData.forEach((item, index) => {
        arr = [...arr, ...item.week];
      });
      if (arr && arr.length === 7) {
        return true;
      } else {
        return false;
      }
    },
    // 获取星期数据
    getWeekData(val) {
      this.weekFormData = val;
      if (this.weekFormData.length === 1) {
        this.weekFormData[0].isChecked = true;
      }
    },
    // 星期值新增/编辑
    initCheckedWeek(val) {
      // 新增
      if (val === 1) {
        this.$refs.checkedWeek.addWeek(this.weekFormData);
      }
      // 编辑
      else {
        this.weekFormData.forEach((item, index) => {
          if (item.isChecked) {
            this.$refs.checkedWeek.getEditWeek({
              dataSource: this.weekFormData,
              currentData: item.week,
              index: index,
            });
          }
        });
      }
    },
    // 删除星期值
    deleteWeek(val) {
      this.weekFormData.splice(val, 1);
    },
    modalChange(val) {
      if (!val) {
        this.$emit("clearCopy");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ml-20 {
  margin-left: 20px;
}
.ml-50 {
  margin-left: 50px;
}
.mr-20 {
  margin-right: 20px;
}
.mt-10 {
  margin-top: 10px;
}
.resRate {
  display: inline-block;
  margin-left: -90px;
}
.xq-title {
  display: flex;
  margin-right: 30px;
  .xq-item,
  .xq-item-checked {
    text-align: center;
    height: 32px;
    line-height: 12px;
    padding: 10px;
    color: #000000;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 4px;
    font-weight: bold;
    position: relative;
    padding-right: 30px;
    padding-left: 30px;
  }
  .xq-item {
    font-weight: bold;
    background: #ffffff;
    border: 1px solid #dcdee2;
  }
  .xq-item-checked {
    color: #ffffff;
    background: #2d8cf0;
    border: none;
  }
  .closeIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.xq-content {
  margin-left: -30px;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.addDiscountTime {
  margin-bottom: 20px;
  margin-left: 70px;
  color: #2d8cf0;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.addLc {
  margin-left: 20px;
  margin-right: 20px;
  color: #2d8cf0;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}
.table {
  margin-top: 15px;
  border: 1px solid #999999;
  border-collapse: collapse;
  margin-bottom: 20px;
  td {
    border: 1px solid #999999;
    padding: 15px;

    text-align: center;
  }
}
</style>