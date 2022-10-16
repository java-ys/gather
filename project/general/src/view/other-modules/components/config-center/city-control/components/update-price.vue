<template>
  <div>
    <Form
      ref="formValidate"
      :model="params"
      :rules="ruleValidate"
      :label-width="160"
    >
      <div class="flex-box">
        <FormItem label="所选2城市 :">{{parentParams.cityName}}</FormItem>
        <FormItem label="业务线 :">
          {{getBusinessName(expandBizLine)}}
        </FormItem>
      </div>
      <!-- 乘客定价策略增加行政区 -->
      <div
        v-if="+parentParams.consumerType === 1 && params.areaType"
        class="flex-box"
      >
        <FormItem label="行政区类型 :" prop="areaType">
          <Select
            v-if="addViewStatus"
            v-model="params.areaType"
            style="width: 200px"
            :max-tag-count="2"
          >
            <Option
              v-for="item in areaTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
          <span v-else>{{Number(params.areaType) === 2 ? "区县级" : "市级"}}</span>
        </FormItem>
        <FormItem
          v-if="Number(params.areaType) === 2"
          label="行政区 :"
          prop="areaCode"
          :label-width="140"
        >
          <Select
            v-if="addViewStatus"
            v-model="params.areaCodes"
            style="width: 200px"
            :max-tag-count="4"
            multiple
            @on-change="setAreaName"
          >
            <Option
              v-for="item in areaInfoByCodeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </Select>
          <span v-else>{{params.areaName}}</span>
        </FormItem>
      </div>
      <div v-if="+parentParams.consumerType === 2" class="flex-box">
        <FormItem label="运营模式 :" prop="operationMode">
          UP模式
          <!--          <Select v-if="addViewStatus" v-model="params.operationMode" style="width: 200px" disabled>-->
          <!--            <Option label="UP模式" value="2"></Option>-->
          <!--          </Select>-->
        </FormItem>
        <FormItem label="司机类型 :" prop="driverTypes">
          <Select
            v-if="addViewStatus"
            v-model="params.driverTypes"
            style="width: 300px"
            :max-tag-count="2"
          >
            <Option
              v-for="item in driverTypeList"
              :key="item.driverType"
              :value="item.driverType"
              :label="item.desc"
            />
          </Select>
          <span v-else>{{driverTypeName}}</span>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="产品线 :" prop="businessType">
          <span v-if="!addViewStatus">{{params.businessType
            ? getProductName(params.businessType)
            : "暂无"}}</span>
          <Select
            v-if="addViewStatus"
            v-model="params.businessType"
            placeholder="请选择产品线"
            style="width: 200px"
            @on-change="changeProduct"
          >
            <Option
              v-for="(m, index) in bizTypeList"
              :key="index"
              :value="m.value"
            >
              {{m.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="车型等级 :" prop="carLevel">
          <span v-if="!addViewStatus">{{params.carLevel
            ? getCarLevelName(params.carLevel, params.businessType)
            : "暂无"}}</span>
          <Select
            v-if="addViewStatus"
            v-model="params.carLevel"
            placeholder="请选择车型等级"
            style="width: 200px"
            @on-change="validatePassenger"
          >
            <Option
              v-for="(m, index) in carLevelList"
              :key="index"
              :value="m.vehicleLevel"
            >
              {{m.vehicleName}}
            </Option>
          </Select>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="订单类型 :" prop="typeTime">
          <span v-if="!addViewStatus">{{typeTimeMap[params.typeTime]}}</span>
          <Select
            v-if="addViewStatus"
            v-model="params.typeTime"
            placeholder="请选择订单类型"
            style="width: 200px"
            @on-change="validatePassenger"
          >
            <Option :value="1">实时</Option>
            <Option :value="2">预约</Option>
          </Select>
        </FormItem>
        <FormItem v-if="expandBizLine !== 13" label="是否一口价:" prop="fixedPriceFlag">
          <RadioGroup v-model="params.fixedPriceFlag">
            <Radio :label="1" :disabled="!addViewStatus">是</Radio>
            <Radio :label="0" :disabled="!addViewStatus">否</Radio>
          </RadioGroup>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="策略名称 :" prop="fareTypeNote">
          <span
            v-if="!addViewStatus"
            style="width: 160px; display: inline-block"
          >{{params.fareTypeNote}}</span>
          <Input
            v-if="addViewStatus"
            v-model="params.fareTypeNote"
            :maxlength="20"
            placeholder="请输入策略名称"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem label="生效时间 :" prop="effectiveTime" :label-width="140">
          <span v-if="!addViewStatus" class="width200">{{params.effectiveTime}}</span>
          <DatePicker
            v-if="addViewStatus"
            v-model="params.effectiveTime"
            type="datetime"
            :editable="false"
            placeholder="请选择生效时间"
            style="width: 200px"
            @on-change="selectDate"
          ></DatePicker>
        </FormItem>
      </div>
      <div class="flex-box">
        <FormItem label="定价适用时段 :" prop="workRestDayList">
          <CheckboxGroup
            v-model="params.workRestDayList"
          >
            <Checkbox
              :label="1"
              style="margin-right:15px;"
              :disabled="!addViewStatus"
            >
              工作日
            </Checkbox>
            <Checkbox
              :label="2"
              :disabled="!addViewStatus"
            >
              休息日
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </div>
      <!-- 起步费 -->
      <div>
        <FormItem
          v-if="addViewStatus || params.startFareStatus"
          :label-width="80"
        >
          <Checkbox
            v-model="params.startFareStatus"
            :disabled="!addViewStatus || params.passengerViewStatus"
          >
            起步费
          </Checkbox>
        </FormItem>
        <div v-if="params.startFareStatus" class="flex-box">
          <FormItem
            label="起步里程（公里） :"
            prop="startTrip"
            :label-width="150"
          >
            <span v-if="!addViewStatus" class="width100">{{params.startTrip}}</span>
            <InputNumber
              v-if="addViewStatus"
              v-model="params.startTrip"
              style="width: 80px"
              :min="0"
              :max="999.9"
              :disabled="params.passengerViewStatus"
              placeholder="请输入"
              @on-blur="FormatNumber(params.startTrip, 'startTrip', 1)"
            ></InputNumber>
          </FormItem>
          <FormItem
            label="起步时长（分钟） :"
            prop="startDuration"
            :label-width="150"
          >
            <span v-if="!addViewStatus" class="width100">{{params.startDuration}}</span>
            <InputNumber
              v-if="addViewStatus"
              v-model="params.startDuration"
              style="width: 80px"
              :min="0"
              :max="999"
              :precision="0"
              :disabled="params.passengerViewStatus"
              placeholder="请输入"
            ></InputNumber>
          </FormItem>
          <FormItem v-if="params.startFare && !addViewStatus" label="起步费(元):" prop="startFare" :label-width="180">
            <span v-if="!addViewStatus" class="width100">{{params.startFare}}</span>
          </FormItem>
        </div>

        <div v-if="params.startFareStatus">
          <Form
            v-for="(item,index) in params.startFares"
            :ref="'startFares' + index"
            :key="index - 100"
            class="flex-box pr"
            :model="item"
            :rules="fareValidate"
            :label-width="160"
          >
            <FormItem :label="'起步费时段' + (index + 1) + ' ：'" prop="time">
              <span v-if="!addViewStatus" class="width200">{{item.startTime + "-" + item.endTime}}</span>
              <TimePicker
                v-if="addViewStatus"
                v-model="item.time"
                class="right30"
                :editable="true"
                type="timerange"
                placeholder="请选择时段"
                style="width: 168px"
                @on-change="startFareTimeChange($event,index)"
              >
              </TimePicker>
            </FormItem>
            <FormItem label="起步费(元):" prop="unitPrice" :label-width="180">
              <span v-if="!addViewStatus" class="width100">{{item.unitPrice}}</span>
              <InputNumber
                v-if="addViewStatus"
                v-model="item.unitPrice"
                class="right30"
                style="width: 80px"
                :min="0"
                :max="999.99"
                placeholder="请输入"
                @on-blur="FormatNumber(item.startFare, 'startFares,' + index + ',unitPrice')"
              ></InputNumber>
            </FormItem>

            <Icon
              v-if="index > 0 && addViewStatus"
              class="remove-icon"
              type="ios-remove-circle-outline"
              @click="removestartFareTime(index)"
            />
          </Form>
          <Button
            v-if="addViewStatus"
            type="primary"
            size="small"
            style="margin: 0 0 20px 160px"
            @click="addstartFareItem"
          >
            新增起步费时段
          </Button>
        </div>
      </div>
      <!-- 基础费 -->
      <div>
        <FormItem
          v-if="addViewStatus || params.lowestFareStatus"
          :label-width="80"
        >
          <Checkbox
            v-model="params.lowestFareStatus"
            :disabled="!addViewStatus"
            @on-change="changeLowestFareStatusBox"
          >
            基础费
          </Checkbox>
        </FormItem>
        <div v-if="params.lowestFareStatus">
          <Form
            v-for="(item,index) in params.basicFare"
            :ref="'basicFare' + index"
            :key="index - 100"
            class="flex-box pr"
            :model="item"
            :rules="basicFareValidate"
            :label-width="160"
          >
            <FormItem :label="'基础费时段' + (index + 1) + ' ：'" prop="time">
              <span v-if="!addViewStatus" class="width200">{{item.startTime + "-" + item.endTime}}</span>
              <TimePicker
                v-if="addViewStatus"
                v-model="item.time"
                class="right30"
                :editable="true"
                type="timerange"
                placeholder="请选择时段"
                style="width: 168px"
                @on-change="basicFareTimeChange($event,index)"
              >
              </TimePicker>
            </FormItem>
            <FormItem label="基础费(元):" prop="unitPrice" :label-width="190">
              <span v-if="!addViewStatus" class="width200">{{item.unitPrice}}</span>
              <InputNumber
                v-if="addViewStatus"
                v-model="item.unitPrice"
                style="width: 80px"
                :min="0"
                :max="999.99"
                placeholder="请输入"
                @on-blur="FormatNumber(item.unitPrice, 'unitPrice')"
              ></InputNumber>
            </FormItem>
            <Icon
              v-if="index > 0 && addViewStatus"
              class="remove-icon"
              type="ios-remove-circle-outline"
              @click="removebasicFareTime(index)"
            />
          </Form>
          <Button
            v-if="addViewStatus"
            type="primary"
            size="small"
            style="margin: 0 0 20px 160px"
            @click="addBasicFareItem"
          >
            新增基础费时段
          </Button>
        </div>
        <!-- <div v-if="params.lowestFareStatus" class="flex-box">

          <FormItem label="基础费(元):" prop="lowestFare" :label-width="190">
            <span v-if="!addViewStatus" class="width200">{{params.lowestFare}}</span>
            <InputNumber
              v-if="addViewStatus"
              v-model="params.lowestFare"
              style="width: 80px"
              :min="0"
              :max="999.99"
              placeholder="请输入"
              @on-blur="FormatNumber(params.lowestFare, 'lowestFare')"
            ></InputNumber>
          </FormItem> -->
        <!--     司机没有动态折扣，所以页面不显示此选项，但是后端需要默认值，不要更改默认值     -->
        <!-- <FormItem
            v-if="+parentParams.consumerType === 1"
            label="基础费计算节点 :"
            prop="model"
            :label-width="150"
          >
            <span v-if="!addViewStatus" class="width200">{{params.model == 1
              ? "计算折扣矩阵前"
              : params.model == 2
                ? "计算折扣矩阵后"
                : ""}}</span>
            <Select
              v-if="addViewStatus"
              v-model="params.model"
              placeholder="请选择"
              style="width: 200px"
            >
              <Option :value="1">计算折扣矩阵前</Option>
              <Option :value="2">计算折扣矩阵后</Option>
            </Select>
          </FormItem>
        </div> -->
      </div>
      <!-- 里程时段 -->

      <Form
        v-for="(item, index) in params.tripFare"
        :ref="'tripFare' + index"
        :key="index - 100"
        class="flex-box pr"
        :model="item"
        :rules="tripValidate"
        :label-width="160"
      >
        <FormItem :label="'里程时段' + (index + 1) + ' ：'" prop="time">
          <span v-if="!addViewStatus" class="width200">{{item.startTime + "-" + item.endTime}}</span>
          <TimePicker
            v-if="addViewStatus"
            v-model="item.time"
            class="right30"
            :editable="true"
            type="timerange"
            placeholder="请选择时段"
            style="width: 168px"
            @on-change="tripTimeChange($event,index)"
          >
          </TimePicker>
        </FormItem>
        <FormItem label="里程费（元/公里）：" prop="fare" :label-width="160">
          <span v-if="!addViewStatus" class="width200">{{item.fare}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="item.fare"
            style="width: 150px"
            :min="0"
            :max="999.99"
            :step="0.01"
            placeholder="请输入里程费"
            @on-blur="FormatNumber(item.fare, 'tripFare,' + index + ',fare')"
          ></InputNumber>
        </FormItem>
        <Icon
          v-if="index > 0 && addViewStatus"
          class="remove-icon"
          type="ios-remove-circle-outline"
          @click="removeTrip(index)"
        />
      </Form>
      <Button
        v-if="addViewStatus"
        type="primary"
        size="small"
        style="margin: 0 0 20px 160px"
        @click="addTripItem"
      >
        新增时段里程费
      </Button>
      <Button v-if="hasTripCopy" type="warning" size="small" style="margin: 0 0 20px 20px" @click="copyStartFeeDurition('tripFare')">复制起步费时段</Button>
      <!-- 时长时段 -->
      <Form
        v-for="(item, index) in params.timeFare"
        :ref="'timeFare' + index"
        :key="index"
        class="flex-box pr"
        :model="item"
        :rules="timeValidate"
        :label-width="160"
      >
        <FormItem :label="'时长时段' + (index + 1) + ' ：'" prop="time">
          <span v-if="!addViewStatus" class="width200">{{item.startTime + "-" + item.endTime}}</span>
          <TimePicker
            v-if="addViewStatus"
            v-model="item.time"
            class="right30"
            :editable="true"
            type="timerange"
            placeholder="请选择时段"
            style="width: 168px"
            @on-change="timeTimeChange($event,index)"
          >
          </TimePicker>
        </FormItem>
        <FormItem label="时长费（元/分钟）：" prop="fare" :label-width="160">
          <span v-if="!addViewStatus" class="width200">{{item.fare}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="item.fare"
            style="width: 150px"
            :min="0"
            :max="999.99"
            :step="0.01"
            placeholder="请输入时长费"
            @on-blur="FormatNumber(item.fare, 'timeFare,' + index + ',fare')"
          ></InputNumber>
        </FormItem>
        <Icon
          v-if="index > 0 && addViewStatus"
          class="remove-icon"
          type="ios-remove-circle-outline"
          @click="removeTime(index)"
        />
      </Form>
      <Button
        v-if="addViewStatus"
        type="primary"
        size="small"
        style="margin: 0 0 20px 160px"
        @click="addTimeItem"
      >
        新增时段时长费
      </Button>
      <Button v-if="hasTimeCopy" type="warning" size="small" style="margin: 0 0 20px 20px" @click="copyStartFeeDurition('timeFare')">复制起步费时段</Button>
      <!-- 远途分段 -->
      <Form
        v-for="(item, index) in params.capacityRuleDetails"
        :ref="'capacityRuleDetails' + index"
        :key="index + 100"
        :model="item"
        :rules="capacityValidate"
        :label-width="160"
        class="ivu-form-item-required"
      >
        <label class="ivu-form-item-label" style="width: 120px">
          远途分段 {{index + 1}}：</label>
        <div class="flex-box pr">
          <FormItem
            key="startCapacity"
            label="分段起始："
            :label-width="90"
            prop="startCapacity"
          >
            <p v-if="!addViewStatus" style="width: 60px">
              {{item.startCapacity}}公里
            </p>
            <Select
              v-if="addViewStatus"
              v-model="item.startCapacity"
              style="width: 70px"
              placeholder="请选择"
            >
              <Option v-for="item in capacityMap" :key="item" :value="item">
                {{item + "公里"}}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            key="endCapacity"
            label="分段结束："
            :label-width="90"
            prop="endCapacity"
          >
            <p v-if="!addViewStatus" style="width: 100px">
              {{(item.endCapacity > 100 || item.endCapacity === null)
                ? "及以上"
                : item.endCapacity + "公里"}}
            </p>
            <Select
              v-if="addViewStatus"
              v-model="item.endCapacity"
              style="width: 70px"
              placeholder="请选择"
            >
              <Option v-for="item in capacityMap" :key="item" :value="item">
                {{item + "公里"}}
              </Option>
              <Option :value="10000"> 及以上 </Option>
            </Select>
          </FormItem>
          <FormItem label="远途里程费（元/公里）：" :label-width="170" prop="unitPrice">
            <p v-if="!addViewStatus" style="width: 80px">
              {{item.unitPrice}}
            </p>
            <InputNumber
              v-else
              v-model="item.unitPrice"
              :min="0"
              :max="999.99"
              style="width: 70px"
              width="70"
              :step="0.01"
              placeholder="请输入"
              @on-blur="
                FormatNumber(
                  item.unitPrice,
                  'capacityRuleDetails,' + index + ',unitPrice'
                )
              "
            ></InputNumber>
          </FormItem>
          <Icon
            v-if="index > 0 && addViewStatus"
            class="remove-icon"
            style="right: 25px"
            type="ios-remove-circle-outline"
            @click="removeCapacity(index)"
          />
        </div>
      </Form>
      <!-- 夜间时段 -->
      <Button
        v-if="addViewStatus && (params.capacityRuleDetails || []).length < 10"
        type="primary"
        size="small"
        style="margin: 0 0 20px 160px"
        @click="addCapacityItem"
      >
        新增分段
      </Button>
      <!-- 底部其他 -->
      <!-- 夜间时段 -->
      <div>
        <!-- <FormItem
          label="夜间费"
        >
        </FormItem> -->
        <FormItem :label="'夜间服务时段 ：'" required>
          <span v-if="!addViewStatus" class="width200">{{params.nightTimeFare[0].startTime + "-" + params.nightTimeFare[0].endTime}}</span>
          <TimePicker
            v-if="addViewStatus"
            v-model="params.nightTimeFare[0].startTime"
            type="time"
            placeholder="开始时间"
            style="width: 110px"
            format="HH:mm:ss"
          ></TimePicker>
          <span v-if="addViewStatus">至</span>
          <TimePicker
            v-if="addViewStatus"
            v-model="params.nightTimeFare[0].endTime"
            type="time"
            placeholder="结束时间"
            style="width: 110px"
            format="HH:mm:ss"
          ></TimePicker>
        </FormItem>
        <FormItem
          key="nightTripFare"
          label="夜间费（元/公里） :"
          prop="nightTripFare"
        >
          <span v-if="!addViewStatus" class="width200">{{params.nightTripFare}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="params.nightTripFare"
            style="width: 200px"
            :min="0"
            :step="0.01"
            :max="999.99"
            placeholder="请输入夜间费"
            @on-blur="FormatNumber(params.nightTripFare, 'nightTripFare')"
          ></InputNumber>
        </FormItem>
      </div>

      <div class="flex-box">
        <FormItem label="免费等待时长（分钟） :" prop="freeWaitTime">
          <span v-if="!addViewStatus" class="width200">{{params.freeWaitTime}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="params.freeWaitTime"
            style="width: 200px"
            :min="0"
            :max="999"
            :precision="0"
            :disabled="params.passengerViewStatus"
            placeholder="请输入免费等待时长"
          ></InputNumber>
        </FormItem>
        <FormItem v-if="expandBizLine !== 13" label="超时等待费（元/分钟） :" prop="beyondWaitFare">
          <span v-if="!addViewStatus" class="width200">{{params.beyondWaitFare}}</span>
          <InputNumber
            v-if="addViewStatus"
            v-model="params.beyondWaitFare"
            style="width: 150px"
            :min="0"
            :max="999.99"
            :step="0.01"
            placeholder="请输入超时等待费"
            @on-blur="FormatNumber(params.beyondWaitFare, 'beyondWaitFare')"
          ></InputNumber>
        </FormItem>
      </div>
    </Form>
    <div class="popView-footer-wrap">
      <Button
        size="large"
        type="text"
        style="margin-right: 8px"
        @click="commit(0)"
      >
        取消
      </Button>
      <Button
        v-if="addViewStatus"
        size="large"
        type="primary"
        @click="commitBefore(1)"
      >
        确定
      </Button>
      <Button v-else size="large" type="primary" @click="commit(0)">
        确定
      </Button>
    </div>
  </div>
</template>

<script>
import {
  addPriceStrategy,
  getPriceStrategyList,
  priceStrategyDetail,
} from "_g/api/openCity";
import {
  typeTimeMap,
  typeModuleMap,
  carTypeMapAll,
} from "_g/config/status-map";
import { hasTimesection } from "@/libs/tools.js";
import "@/styles/cyk-style.css";
import { areaTypeList, capacityMap } from "../index.js";
import { listToMap } from "@/libs/util.js";
// import BusinessProduct from "../businessProduct.mixins"
import { mapState, mapGetters } from "vuex";

export default {
  props: [
    "value",
    "parentParams",
    "driverTypeList",
    "driverTypeMap",
    "areaInfoByCodeList",
    "type",
  ],
  data() {
    const effectiveTime = (rule, value, callback) => {
      let date = value || null;
      if (date === null) {
        callback(new Error("请选择生效时间"));
      } else {
        let timestamp = new Date(date).getTime();
        if (timestamp < Date.now()) {
          callback(new Error("生效时间不得小于当前时间"));
        } else {
          callback();
        }
      }
    };
    const validateNum = (rule, value, callback) => {
      if (value === null) callback(new Error("请填写内容"));
      else callback();
    };
    const timeListValidate = (rule, value, callback) => {
      let res = value.every((item) => {
        return item;
      });
      if (!res || value.length !== 2) {
        callback(new Error("请输入内容"));
      } else if (value[0] == value[1]) {
        callback(new Error("开始时段不可等于结束时段"));
      } else {
        // 时间交叉
        let timeList = this.params.timeFare;
        // let temp = true
        let num = 0;
        for (let i = 0; i < timeList.length; i++) {
          if (!hasTimesection(value, timeList[i].time)) {
            num++;
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"));
        } else {
          callback();
        }
      }
    };
    const tripListValidate = (rule, value, callback) => {
      let res = value.every((item) => {
        return item;
      });
      if (!res || value.length !== 2) {
        callback(new Error("请输入内容"));
      } else if (value[0] == value[1]) {
        callback(new Error("开始时段不可等于结束时段"));
      } else {
        // 时间交叉
        let tripList = this.params.tripFare;
        // let temp = true
        let num = 0;
        for (let i = 0; i < tripList.length; i++) {
          if (!hasTimesection(value, tripList[i].time)) {
            num++;
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"));
        } else {
          callback();
        }
      }
    };
    const fareListValidate = (rule, value, callback) => {
      let res = value.every((item) => {
        return item;
      });
      if (!res || value.length !== 2) {
        callback(new Error("请输入内容"));
      } else if (value[0] == value[1]) {
        callback(new Error("开始时段不可等于结束时段"));
      } else {
        // 时间交叉
        let tripList = this.params.startFares;
        // let temp = true
        let num = 0;
        for (let i = 0; i < tripList.length; i++) {
          if (!hasTimesection(value, tripList[i].time)) {
            num++;
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"));
        } else {
          callback();
        }
      }
    };
    const basicareListValidate = (rule, value, callback) => {
      let res = value.every((item) => {
        return item;
      });
      if (!res || value.length !== 2) {
        callback(new Error("请输入内容"));
      } else if (value[0] == value[1]) {
        callback(new Error("开始时段不可等于结束时段"));
      } else {
        // 时间交叉
        let tripList = this.params.basicFare;
        // let temp = true
        let num = 0;
        for (let i = 0; i < tripList.length; i++) {
          if (!hasTimesection(value, tripList[i].time)) {
            num++;
          }
        }
        if (num > 1) {
          callback(new Error("时段不可交叉"));
        } else {
          callback();
        }
      }
    }
    return {
      typeTimeMap,
      capacityMap,
      areaTypeList,
      typeModuleMap,
      carTypeMapAll,
      carLevelList: [], // 车型等级配置列表
      addViewStatus: false, // true：新增  false：详情
      params: {
        nightTimeFare: [{
          "fare": null,
          "time": ["", ""],
          "startTime": "",
          "endTime": ""
        }]
      }, // 定价策略参数
      initParams: {
        passengerViewStatus: false, // true：乘客未配置起步费  false：乘客配置起步费
        allowAddStatus: true, // 是否允许新增
        operationMode: null, // 运营模式 2: UP模式
        driverTypes: null, // 司机类型支持多选。  50:UP司机
        areaType: 1, // 行政区类型
        carLevel: "", // 车型等级
        typeTime: "", // 订单类型
        fixedPriceFlag: 0, // 是否一口价
        fareTypeNote: "", // 策略名称
        effectiveTime: "", // 生效时间
        startFareStatus: false, // 是否有起步费
        lowestFareStatus: false, // 是否有基础费
        // startFare: null, // 起步费
        workRestDayList: [],
        startFares: [{
          "unitPrice": null,
          "time": ["", ""],
          "startTime": "",
          "endTime": ""
        }],
        basicFare: [{
          "unitPrice": null,
          "time": ["", ""],
          "startTime": "",
          "endTime": ""
        }],
        nightTimeFare: [{
          "fare": null,
          "time": ["", ""],
          "startTime": "",
          "endTime": ""
        }],
        startTrip: null, // 起步里程
        startDuration: null, // 起步时长
        lowestFare: null, // 基础费
        model: 1, // 基础费计算节点
        tripFare: [
          {
            fare: null,
            time: "",
          },
        ],
        timeFare: [
          {
            fare: null,
            time: "",
          },
        ],
        capacityRuleDetails: [
          {
            startCapacity: null,
            endCapacity: null,
            unitPrice: null,
          },
        ],
        beyondWaitFare: null,
        freeWaitTime: null,
        nightTripFare: null,
        // basicInformationFee: null
      },
      timeValidate: {
        time: [
          {
            required: true,
            type: "array",
            message: "请填写内容",
            trigger: "blur",
          },
          { required: true, validator: timeListValidate, trigger: "change" },
        ],
        fare: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
      },
      tripValidate: {
        time: [
          {
            required: true,
            type: "array",
            message: "请填写内容",
            trigger: "blur",
          },
          { required: true, validator: tripListValidate, trigger: "change" },
        ],
        fare: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        unitPrice: [
          {
            required: true,
            message: "请填写内容",
          },
        ],
      },
      fareValidate: {
        time: [
          {
            required: true,
            type: "array",
            message: "请填写内容",
            trigger: "blur",
          },
          { required: true, validator: fareListValidate, trigger: "change" },
        ],
        fare: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        unitPrice: [
          {
            required: true,
            message: "请填写内容",
          },
        ],
      },
      basicFareValidate: {
        time: [
          {
            required: true,
            type: "array",
            message: "请填写内容",
            trigger: "blur",
          },
          { required: true, validator: basicareListValidate, trigger: "change" },
        ],
        unitPrice: [
          {
            required: true,
            message: "请填写内容",
          },
        ],
      },
      capacityValidate: {
        startCapacity: [
          {
            required: true,
            type: "number",
            message: "请添加",
            trigger: "change",
          },
        ],
        endCapacity: [
          {
            required: true,
            type: "number",
            message: "请添加",
            trigger: "change",
          },
        ],
        unitPrice: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
      },
      ruleValidate: {
        fareTypeNote: [
          { required: true, message: "请输入定价策略名称", trigger: "change" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
            message: "仅支持中文英文和数字",
            trigger: "blur",
          },
        ],
        driverTypes: [
          {
            required: true,
            message: "请选择司机类型",
          },
        ],
        areaCodes: [
          {
            required: true,
            message: "请选择行政区",
          },
        ],
        effectiveTime: [
          { required: true, validator: effectiveTime, trigger: "change" },
        ],
        businessType: [
          {
            required: true,
            type: "number",
            message: "请选择产品线",
            trigger: "change",
          },
        ],
        carLevel: [
          {
            required: true,
            type: "number",
            message: "请选择车型等级",
            trigger: "change",
          },
        ],
        typeTime: [
          {
            required: true,
            type: "number",
            message: "请选择订单类型",
            trigger: "change",
          },
        ],
        workRestDayList: [
          {
            required: true,
            message: "请选择",
          },
        ],
        nightTripFare: [
          {
            required: true,
            message: "请填写内容",
          },
        ],
        startFare: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        lowestFare: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        startTrip: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        model: [
          {
            required: true,
            type: "number",
            message: "请选择基础费计算节点",
            trigger: "blur",
          },
        ],
        startDuration: [
          {
            required: true,
            type: "number",
            message: "请填写内容",
            trigger: "blur",
          },
        ],
        startDuratio: [
          { required: true, validator: validateNum, trigger: "change" },
        ],
        beyondWaitFare: [
          { required: true, validator: validateNum, trigger: "change" },
        ],
        freeWaitTime: [
          { required: true, validator: validateNum, trigger: "change" },
        ],
        premiumOneRate: [
          { required: true, validator: validateNum, trigger: "change" },
        ],
        premiumTwoRate: [
          { required: true, validator: validateNum, trigger: "change" },
        ],
        fixedPriceFlag: [
          { required: true, type: "number", message: "请选择", trigger: "change" },
        ]
      },
      // expandBizLine:
      // prodoctLines: [
      // ] // 产品线
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    driverTypeName() {
      if (!this.params.driverTypes) return "";
      return this.params.driverTypes
        .map((item) => this.driverTypeMap[item])
        .join(",");
    },
    areaInfoMap() {
      return listToMap(this.areaInfoByCodeList);
    },
    expandBizLine() {
      return this.$route.query.expandBizLine // 业务线
    },
    hasTripCopy() {
      return this.addViewStatus && this.params.startFareStatus && this.params.startFares && this.params.startFares[0].time && this.params.startFares[0].time[0] && this.params.tripFare.length === 1 && (!this.params.tripFare[0].time || !this.params.tripFare[0].time[0]);
    },
    hasTimeCopy() {
      return this.addViewStatus && this.params.startFareStatus && this.params.startFares && this.params.startFares[0].time && this.params.startFares[0].time[0] && this.params.timeFare.length === 1 && (!this.params.timeFare[0].time || !this.params.timeFare[0].time[0]);
    }
  },
  watch: {
    value() {
      if (this.value) {
        if (this.parentParams.detailUuid === null || this.type === "add") {
          // 新增定价
          this.addViewStatus = true;
          this.params = JSON.parse(JSON.stringify(this.initParams));
          this.resetForm();
        } else if (this.type === "detail") {
          // 定价详情
          this.addViewStatus = false;
          this.resetForm();
          this.getDetail();
        } else if (this.type === "copy") {
          // 复制
          this.addViewStatus = true;
          this.resetForm();
          this.getDetail();
        }
      }
    },
  },
  methods: {
    copyStartFeeDurition(key) {
      this.params[key] = this.params.startFares.map(t => {
        return {
          endTime: t.endTime,
          fare: null,
          startTime: t.startTime,
          time: [...t.time],
        }
      });
    },
    /*
     *@description: 格式化-保留一位小数
     *@modifyContent: 起步费起步里程由正整数，修改为保留一位小数
     *@author: wuxuan
     *@date: 2019-08-21 17:01:23
     */
    FormatNumber(VauleNumber, keyName, fixNum = 2) {
      if (VauleNumber) {
        let newVal = parseFloat(VauleNumber.toFixed(fixNum));
        if (keyName.indexOf(",") > -1) {
          let k = keyName.split(",");
          let k0 = k[0];
          let k1 = k[1];
          let k2 = k[2];
          this.$set(this.params[k0][k1], k2, newVal);
        } else {
          this.$set(this.params, keyName, newVal);
        }
      }
    },
    removeTrip(index) {
      this.params.tripFare.splice(index, 1);
    },
    removestartFareTime(index) {
      this.params.startFares.splice(index, 1);
    },
    removebasicFareTime(index) {
      this.params.basicFare.splice(index, 1);
    },
    removeTime(index) {
      this.params.timeFare.splice(index, 1);
    },
    removeCapacity(index) {
      this.params.capacityRuleDetails.splice(index, 1);
    },
    resetForm() {
      try {
        this.$refs &&
          this.$refs.formValidate &&
          this.$refs.formValidate.resetFields();
      } catch (error) {}
      this.$refs.timeFare0 &&
        this.$refs.timeFare0[0] &&
        this.$refs.timeFare0[0].resetFields();
      this.$refs.tripFare0 &&
        this.$refs.tripFare0[0] &&
        this.$refs.tripFare0[0].resetFields();
      this.$refs.capacityRuleDetails0 &&
        this.$refs.capacityRuleDetails0[0] &&
        this.$refs.capacityRuleDetails0[0].resetFields();
      this.carLevelList = [];
    },
    addTripItem() {
      this.params.tripFare.push({
        fare: null,
        time: "",
      });
    },
    addstartFareItem() {
      this.params.startFares.push({
        unitPrice: null,
        time: "",
      });
    },
    addBasicFareItem() {
      this.params.basicFare.push({
        unitPrice: null,
        time: "",
      });
    },
    addTimeItem() {
      this.params.timeFare.push({
        fare: null,
        time: "",
      });
    },
    addCapacityItem() {
      this.params.capacityRuleDetails.push({
        startCapacity: null,
        endCapacity: null,
        unitPrice: null,
      });
    },
    getDetail() {
      // 获取详情信息
      priceStrategyDetail({ uuid: this.parentParams.detailUuid }).then((res) => {
        let params = { ...res.data.data };
        const { timeFare, longTripFareRuleDto = {}, workRestDayType, basicFare, nightTimeFare } = params;
        params = {
          ...params,
          timeFare: timeFare.map((item) => (item.time = { ...item, time: [item.startTime, item.endTime] })),
          timeFare: timeFare.map((item) => (item.time = { ...item, time: [item.startTime, item.endTime] })),
          basicFare: basicFare.map((item) => (item.time = { ...item, time: [item.startTime, item.endTime] })),
          capacityRuleDetails: longTripFareRuleDto.capacityRuleDetails || [],
          workRestDayList: workRestDayType ? [workRestDayType] : [1, 2],
          lowestFareStatus: basicFare.length > 0,
          nightTimeFare: nightTimeFare.length ? nightTimeFare : [{
            "fare": null,
            "time": ["", ""],
            "startTime": "",
            "endTime": ""
          }],
          areaCodes: [params.areaCode],
          fixedPriceFlag: params.onePriceFlag ? 1 : 0,
        };
        if (this.type === "copy") {

          params = {
            ...params,
            fareTypeNote: "",
            effectiveTime: "",
            areaType: params.areaType || 1,
          };
          // 如果是编辑/复制，需要根据传入的产品线，拿到车型等级
          const { businessType } = params
          const product = this.bizTypeList.find(v => v.value === businessType) || {}
          this.$nextTick(() => {
            this.carLevelList = product ? product.children || [] : []
          })
          delete params.startFare // 起步费改为分段 此字段废弃（老数据仍有值  删掉
          if (!params.startFares) {
            params.startFares = []
          } else {
            params.startFares = params.startFares.map(it => {
              return {
                ...it,
                time: [it.startTime, it.endTime]
              }
            })
          }
        }
        delete params.areaCode
        this.params = params;
        this.setAreaName(params.areaCodes)
        if (this.type === "copy" && params.capacityRuleDetails.length === 0) {
          this.addCapacityItem();
        }
      });
    },
    selectDate(date) {
      this.params.effectiveTime = date;
    },
    validatePassenger() {
      console.log(this.parentParams, "parentParamsparentParamsparentParams")
      // 司机定价规则需要校验是否有生效中的乘客定价规则
      if (Number(this.parentParams.consumerType) === 2) {
        if (!this.params.typeTime || !this.params.carLevel) {
          return;
        }
        // 获取当前生效中的乘客定价规则
        getPriceStrategyList({
          cityUuid: this.parentParams.cityUuid,
          businessType: this.parentParams.businessType,
          typeTime: this.params.typeTime,
          carLevel: this.params.carLevel,
          consumerType: 1,
          areaType: 1,
          status: 1,
        }).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            const item = data.pageResult && data.pageResult.list[0];
            // const item = res.data.data.pageResult.list[0];
            this.params.passengerViewStatus = true;
            if (item) {
              if (item.startTrip && item.startDuration) {
                this.params.startTrip = item.startTrip;
                this.params.startDuration = item.startDuration;
                this.params.startFareStatus = true;
              } else {
                this.params.startTrip = null;
                this.params.startDuration = null;
                this.params.startFareStatus = false;
              }
              this.params.freeWaitTime = item.freeWaitTime;
            } else {
              this.$Message.error("请先配置乘客定价策略");
              return false;
            }
          } else {
            this.$Message.error("请先配置乘客定价策略");
            return false;
          }
        });
      }
    },
    tripTimeChange(e, index) {
      this.$set(this.params.tripFare[index], "time", e)
      let time = this.params.tripFare[index].time;
      this.params.tripFare[index].startTime = time[0];
      this.params.tripFare[index].endTime = time[1];
    },
    startFareTimeChange(e, index) {
      this.$set(this.params.startFares[index], "time", e)
      let time = this.params.startFares[index].time;
      this.params.startFares[index].startTime = time[0];
      this.params.startFares[index].endTime = time[1];
    },
    basicFareTimeChange(e, index) {
      this.$set(this.params.basicFare[index], "time", e)
      let time = this.params.basicFare[index].time;
      this.params.basicFare[index].startTime = time[0];
      this.params.basicFare[index].endTime = time[1];
    },
    nightFareTimeChange(index) {
      let time = this.params.nightTimeFare[index].time;
      this.params.nightTimeFare[index].startTime = time[0];
      this.params.nightTimeFare[index].endTime = time[1];
    },
    timeTimeChange(e, index) {
      this.$set(this.params.timeFare[index], "time", e)
      let time = this.params.timeFare[index].time;
      this.params.timeFare[index].startTime = time[0];
      this.params.timeFare[index].endTime = time[1];
    },
    setAreaName(code) {
      if (code) {
        this.params.areas = code.map(it => {
          return {
            areaCode: it,
            areaName: this.areaInfoMap[it]
          }
        });
      } else {
        this.params.areas = []
      }
      console.log(this.params.areas)
    },
    validateTime(list, msg) {
      let message = msg + "时段必须组成完整的00:00:00至23:59:59";
      // let len = list.length
      let isStart = false;
      let isEnd = false;
      let startHash = {};
      let endHash = {};
      list.forEach((item) => {
        if (item.startTime == "00:00:00") {
          isStart = true;
        }
        if (item.endTime == "23:59:59") {
          isEnd = true;
        }
        startHash[item.startTime] = item.startTime;
        endHash[item.endTime] = item.endTime;
      });
      if (!isStart || !isEnd) {
        this.$Message.warning(message);
        return false;
      }
      if (list.length === 1) {
        return true;
      }
      let isFull = true;
      list.forEach((item, index) => {
        let startTime = item.startTime;
        if (startTime != "00:00:00") {
          if (!endHash[startTime]) {
            isFull = false;
          }
        }
      });
      if (isFull) {
        return true;
      } else {
        this.$Message.warning(message);
        return false;
      }
    },
    // 检查分段没有断层，检查分段是“及以上”结尾
    validateCapacity(list) {
      //  是否 有 及以上
      const isEnd = list.map((m) => m.endCapacity).indexOf(10000) !== -1;
      if (list.length === 1) {
        return isEnd;
      }
      // 排序
      const capList = list.sort((m1, m2) => m1.startCapacity - m2.startCapacity);
      for (let i = 1; i < capList.length; i++) {
        const elPre = capList[i - 1];
        const elNext = capList[i];
        if (elNext.startCapacity !== elPre.endCapacity) {
          return false;
        }
      }
      return isEnd;
    },
    commitBefore(temp) {
      console.log(this.params)
      // 新增乘客策略（市级）需要校验是否有生效的司机策略
      if (
        Number(this.parentParams.consumerType) === 1 &&
        this.params.typeTime &&
        this.params.carLevel &&
        this.params.areaType === 1 &&
        (Number(this.parentParams.businessType) === 4 ||
          Number(this.parentParams.businessType) === 2)
      ) {
        // 获取当前生效中的司机定价规则
        getPriceStrategyList({
          cityUuid: this.parentParams.cityUuid,
          businessType: this.parentParams.businessType,
          typeTime: this.params.typeTime,
          carLevel: this.params.carLevel,
          consumerType: 2,
          status: 1,
          expandBizLine: this.parentParams.expandBizLine
        }).then((res) => {
          if (res.data.success) {
            let data = res.data.data;
            const item = data.pageResult && data.pageResult.list[0];
            if (item) {
              this.$Modal.warning({
                title: "提示",
                content:
                  "当前存在已生效的司机计费策略，请先停用后再新建乘客计费策略和关联的司机计费策略",
              });
              this.params.allowAddStatus = false;
              return false;
            } else {
              this.commit(temp);
            }
          } else {
            this.$Modal.warning({
              title: "提示",
              content:
                "当前存在已生效的司机计费策略，请先停用后再新建乘客计费策略和关联的司机计费策略",
            });
            this.params.allowAddStatus = false;
            return false;
          }
        });
      } else {
        this.commit(temp);
      }
    },
    commit(temp) {
      if (temp) {
        let startFareList = this.params.startFares;
        let tripList = this.params.tripFare;
        let timeList = this.params.timeFare;
        let basicFare = this.params.basicFare;
        let nightTimeFare = this.params.nightTimeFare;
        let capacityRuleDetails = this.params.capacityRuleDetails;
        let [isSuccess1, isSuccess2] = [false, true];
        this.$refs.formValidate
          .validate()
          .then((status) => {
            isSuccess1 = status;
            return new Promise((resolve) => {
              resolve();
            });
          })
          .then(() => {
            // add 如果勾选了起步费
            if (this.params.startFareStatus) {
              startFareList.forEach((item, index) => {
                let key = "startFares" + index;
                this.$refs[key] && this.$refs[key][0].validate().then((status) => {
                  if (!status) {
                    isSuccess2 = false;
                  }
                });
                // 校验时段
                const completeTime = this.judgePeriod(startFareList)
                if (!completeTime) {
                  this.$Message.warning("起步费时段必须覆盖00:00:00至23:59:59");
                  isSuccess2 = false;
                }
              });
            }

            // add 如果勾选了基础费
            if (this.params.lowestFareStatus) {
              basicFare.forEach((item, index) => {
                let key = "basicFare" + index;
                this.$refs[key] && this.$refs[key][0].validate().then((status) => {
                  if (!status) {
                    isSuccess2 = false;
                  }
                });
                // 校验时段
                const completeTime = this.judgePeriod(basicFare)
                if (!completeTime) {
                  this.$Message.warning("基础费时段必须覆盖00:00:00至23:59:59");
                  isSuccess2 = false;
                }
              });
            }
            tripList.forEach((item, index) => {
              let key = "tripFare" + index;
              this.$refs[key][0].validate().then((status) => {
                if (!status) {
                  isSuccess2 = false;
                }
              });
            });
            timeList.forEach((item, index) => {
              let key = "timeFare" + index;
              this.$refs[key][0].validate().then((status) => {
                if (!status) {
                  isSuccess2 = false;
                }
              });
            });


            capacityRuleDetails.forEach((item, index) => {
              let key = "capacityRuleDetails" + index;
              this.$refs[key][0].validate().then((status) => {
                if (!status) {
                  isSuccess2 = false;
                }
              });
            });

            // 夜间
            for (let itemm of nightTimeFare) {
              if (itemm.startTime === "" || itemm.endTime === "") {
                this.$Message.warning("请输入夜间费时段");
                isSuccess2 = false;
              }
            }
            return new Promise((resolve) => {
              resolve();
            });
          })
          .then(() => {
            if (isSuccess1 && isSuccess2) {
              let isTripSuccess = this.validateTime(tripList, "里程");
              if (!isTripSuccess) {
                return false;
              }
              let isTimeSuccess = this.validateTime(timeList, "时长");
              if (!isTimeSuccess) {
                return false;
              }
              let isCapacitySuccess =
                this.validateCapacity(capacityRuleDetails);
              if (!isCapacitySuccess) {
                this.$Modal.confirm({
                  title: "提示",
                  content: `两个分段之间不能有间隔<br>
                      分段结束最后一条是：及以上 <br>
                      请参考例子：30-40公里:40元，40公里及以上80元`,
                });
                return false;
              }
              if (!this.params.lowestFareStatus) {
                this.params.lowestFare = null;
                this.params.model = null;
                this.params.basicFare = []
              }
              if (!this.params.startFareStatus) {
                this.params.startFare = null;
                this.params.startTrip = null;
                this.params.startDuration = null;
              }
              let params = {
                ...this.params,
                longTripFareRuleDto: {
                  capacityRuleDetails: this.params.capacityRuleDetails,
                },
              };
              params = Object.assign(params, this.parentParams);
              params.typeTime = Number(params.typeTime);
              params.businessType = Number(this.params.businessType);
              params.onePriceFlag = params.fixedPriceFlag ? true : false;
              if (Number(this.parentParams.consumerType) === 2) {
                params.operationMode = 2;
                params.driverTypes = [params.driverTypes];
              }
              if (Number(params.areaType) === 1) {
                params.areaName = "";
                params.areaCodes = [];
                params.areas = []
              }
              params.expandBizLine = this.$route.query.expandBizLine
              // 夜间费
              params.nightTimeFare = params.nightTimeFare.map(it => {
                return {
                  ...it,
                  fare: params.nightTripFare,
                  time: [it.startTime, it.endTime]
                }
              })
              console.log(params);
              addPriceStrategy(params).then((res) => {
                this.$Message.success("新建成功");
                this.$emit("input", false);
                this.$emit("on-confirm");
              });
            }
          });
      } else {
        this.addViewStatus = false
        this.$emit("input", false);
      }
    },
    // 变更业务线下拉
    changeProduct(value) {
      const product = this.bizTypeList.find(v => v.value === value) || {}
      this.$nextTick(() => {
        this.params.carLevel = ""
        this.carLevelList = product.children || []
      })
    },
    getCarLevelName(val, bizType) {
      const { productCarKeyValue } = this.businessGradeName
      return productCarKeyValue[`${bizType}#${val}`] || ""
    },
    getProductName(val) {
      const { productKeyValue } = this.businessGradeName
      return productKeyValue[val] || ""
    },
    getBusinessName() {
      const { businessKeyValue } = this.businessGradeName
      return businessKeyValue[this.expandBizLine] || ""
    },
    changeLowestFareStatusBox(val) {
      if (val) {
        this.params.model = 2
      }
    },
    // 判断时段
    judgePeriod(list) {
      const set = new Set();
      for (let item of list) {
        item.time[0] && set.add(item.time[0]);
        item.time[1] && set.add(item.time[1]);
      }
      set.add("00:00:00");
      set.add("23:59:59");
      return set.size === list.length + 1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.remove-icon {
  position: absolute;
  right: 45px;
  top: 7px;
  font-size: 20px;
  color: #e61f10;
  font-weight: bold;
  cursor: pointer;
}
</style>
