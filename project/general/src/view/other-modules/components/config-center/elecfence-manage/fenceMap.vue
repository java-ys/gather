<template>
  <div>
    <Modal
      v-model="popViewMap"
      :closable="drawerFormStatus === ''"
      :footer-hide="true"
      :class-name="'fenceMap'"
      @on-cancel="back"
    >
      <!-- loading加载 -->
      <Spin v-if="spinShow" size="large" fix>
        <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        <div style="font-size: 14px">加载中...</div>
      </Spin>

      <!-- 状态复选框    -->
      <div v-if="drawerFormStatus === ''" style="display: flex">
        <Checkbox
          :indeterminate="indeterminate"
          :value="checkAll"
          :style="{ 'margin-right': 20 + 'px' }"
          :disabled="drawerFormStatus !== ''"
          @click.prevent.native="handleCheckAll"
        >全部状态</Checkbox>
        <Checkbox-group
          v-model="checkAllGroup"
          @on-change="checkAllGroupChange"
        >
          <Checkbox
            v-for="(item, index) in fenceStatusList"
            :key="item.value"
            :label="item.value"
            :disabled="drawerFormStatus !== ''"
          >{{item.label}}</Checkbox>
        </Checkbox-group>
      </div>
      <!-- 地图功能 -->
      <div
        id="fence-map"
        :style="{
          width: '100%',
          height: drawerFormStatus === '' ? '100%' : 'calc(100% + 21px)',
          position: 'relative',
        }"
      >
        <!-- 围栏的legend -->
        <div v-if="drawerFormStatus === ''" class="fenceLegend">
          <div
            v-for="(item, index) in legendList"
            :key="item.railType"
            class="legend-item"
            @click="changeLegend(item)"
          >
            <div
              :class="{
                [`${item.railColorClass}`]: item.selected,
                'legend-gay': !item.selected,
              }"
              class="com-legend"
            ></div>
            <span :class="{ 'font-gay': !item.selected }">{{item.railTypeName}}</span>
          </div>
        </div>
        <!-- 显示隐藏边界 -->
        <FenceBoundary ref="fenceboundary" :map="map" />
        <!-- 地图搜索栏 -->
        <div v-if="this.drawerFormStatus !== 'detail'" class="map-query">
          <!-- 地址搜索 -->
          <el-amap-search-box
            ref="serachbox"
            class="search-box-qqb"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
        </div>
        <!-- 绘制地图的撤销和恢复  -->
        <div
          v-if="
            this.drawerFormStatus !== 'detail' &&
              this.drawerFormStatus !== '' &&
              this.floatParams.selectScope === 1
          "
          class="polygon-hander"
        >
          <!-- 按钮 -->
          <Button
            class="right15"
            :disabled="!undoStateList.length"
            @click="preState"
          >
            撤销
          </Button>
          <Button :disabled="!recoverStateList.length" @click="recoverState">
            恢复
          </Button>
        </div>
      </div>
    </Modal>

    <!-- 这里是抽屉弹框 -->
    <Drawer
      v-model="drawerInfo.visable"
      :title="drawerInfo.title"
      :closable="true"
      width="510"
      :mask-closable="false"
      :mask="false"
      :scrollable="true"
      :styles="drawerInfo.styles"
      :class-name="'formDrawer'"
      @on-close="backForm"
    >
      <Form
        ref="formValidate"
        :model="floatParams"
        :rules="ruleUser"
        :label-width="120"
      >
        <FormItem label="名称：" prop="name">
          <Input
            v-model="floatParams.name"
            :maxlength="40"
            :readonly="invalidEditor"
            placeholder="请输入名称"
            style="width: 300px"
          />
        </FormItem>
        <FormItem label="城市：" prop="carrierArea">
          <Cascader
            v-model="floatParams.carrierArea"
            :data="cityList"
            :clearable="false"
            :disabled="invalidEditor"
            :filterable="true"
            style="width: 300px"
            placeholder="请选择城市"
            @on-change="getCityByForm"
          >
          </Cascader>
        </FormItem>
        <FormItem label="围栏类型：" prop="railType">
          <Select
            v-model="floatParams.railType"
            style="width: 300px"
            placeholder="请选择围栏类型"
            :disabled="invalidEditor"
            @on-change="typeChangeFence"
          >
            <Option
              v-for="item in railTypeList"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
          <!-- todo 开始 -->
          <Alert v-if="floatParams.railType === 2" show-icon>配置完成后请前往司机管理平台配置相关围栏的奖励规则</Alert>
          <Alert v-if="floatParams.railType === 3" show-icon>围栏内的乘客方可参加指定营销活动</Alert>
          <Alert v-if="floatParams.railType === 4" show-icon>在围栏范围内进行乘客上车点人工采点</Alert>
          <Alert v-if="floatParams.railType === 7" show-icon>在围栏范围内进行乘客下车点人工采点</Alert>
          <Alert v-if="floatParams.railType === 23" show-icon>车辆定位进入禁止接单围栏时，将会停止听单</Alert>
        </FormItem>
        <FormItem
          v-if="isRailTypeLimitStop"
          label="限停时长："
          prop="parkingTime"
        >
          <Input
            v-model="floatParams.parkingTime"
            style="width: 300px"
            type="number"
            class="no-arrow"
            :disabled="invalidEditor"
            @on-keyup="parkingTimeChange"
          ></Input><span style="margin-left: 4px">(分钟)</span>
        </FormItem>
        <!-- todo 结束 -->
        <template v-if="!isRailTypeLimitStop">
          <FormItem
            v-if="!isAllServiceType"
            key="serviceType"
            label="产品线："
            prop="serviceType"
          >
            <Select
              v-model="floatParams.serviceType"
              style="width: 300px"
              :disabled="invalidEditor"
              @on-change="changeServiceType"
            >
              <Option
                v-for="(item, index) in optList"
                :key="index"
                :value="item.value"
              >
                {{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="floatParams.railType !== 22 && !isAllServiceType"
            label="车型等级："
            :rules="{}"
          >
            <Select
              v-model="floatParams.carLevelList"
              multiple
              :disabled="invalidEditor"
              style="width: 300px"
              placeholder="为空默认该产品线下全部车型"
            >
              <Option
                v-for="item in carLevelList"
                :key="item.value"
                :value="item.value"
              >
                {{item.label}}
              </Option>
            </Select>
          </FormItem>
        </template>
        <!-- todo 开始 -->
        <FormItem
          v-if="floatParams.railType === 22"
          label="车型等级："
          prop="useLevelTypeList"
        >
          <Select
            v-model="floatParams.useLevelTypeList"
            multiple
            :disabled="invalidEditor"
            style="width: 300px"
            placeholder="请选择车型等级"
          >
            <Option
              v-for="item in carLevelList"
              :key="item.value"
              :value="item.value"
            >
              {{item.label}}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          v-if="floatParams.railType === 6"
          key="tripDistance"
          label="派单最小里程："
          prop="tripDistance"
        >
          <InputNumber
            v-model="floatParams.tripDistance"
            :min="0.1"
            :readonly="invalidEditor"
            placeholder="请输入"
            style="width: 150px; vertical-align: top"
          ></InputNumber>
          公里
        </FormItem>
        <!-- todo 结束 -->
        <FormItem
          v-if="floatParams.railType === 1"
          label="正向/逆向："
          prop="direction"
        >
          <RadioGroup
            v-model="floatParams.direction"
            @on-change="targetChange(false)"
          >
            <Radio
              v-for="item in directionList"
              :key="item.value"
              :label="item.value"
              :disabled="invalidEditor"
            >
              {{item.label}}
            </Radio>
          </RadioGroup>
          <Alert
            v-if="floatParams.direction === 1"
            style="width: 300px; margin-bottom: 0"
            type="error"
          >正向围栏范围内向乘客提供叫车服务</Alert>
          <Alert
            v-if="floatParams.direction === 2"
            style="width: 300px; margin-bottom: 0"
            type="error"
          >逆向围栏范围内禁止向乘客提供叫车服务，或向特定类型司机派单</Alert>
        </FormItem>

        <FormItem
          v-if="floatParams.railType === 28"
          label="正向/逆向："
          :rules="{}"
        >
          <span>逆向</span>
          <Alert
            v-if="floatParams.direction === 2"
            style="width: 300px; margin-bottom: 0"
            type="error"
          >逆向围栏范围内禁止向乘客提供叫车服务，或向特定类型司机派单</Alert>
        </FormItem>

        <FormItem
          v-if="floatParams.railType === 1 || floatParams.railType === 28"
          label="出发地/目的地："
          prop="addressTypeList"
        >
          <CheckboxGroup
            v-model="floatParams.addressTypeList"
            style="width: 300px"
            @on-change="targetChange(true)"
          >
            <Checkbox
              :label="1"
              :disabled="
                invalidEditor || floatParams.addressTypeList.includes(3)
              "
            >出发地</Checkbox>
            <Checkbox
              :label="2"
              :disabled="
                invalidEditor || floatParams.addressTypeList.includes(3)
              "
            >目的地</Checkbox>
            <Checkbox
              v-if="
                floatParams.serviceType === 7 && floatParams.direction === 1
              "
              :label="3"
              :disabled="invalidEditor"
            >出发地或目的地</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem
          v-if="floatParams.railType === 1"
          label="过滤类型："
          prop="filterType"
        >
          <RadioGroup
            v-model="floatParams.filterType"
            @on-change="changeFilterType"
          >
            <Radio :label="1" :disabled="invalidEditor">乘客可见</Radio>
            <Radio :label="2" :disabled="invalidEditor">乘客不可见</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem
          v-if="floatParams.railType === 28"
          label="过滤类型："
          :rules="{}"
        >
          <span>司机/车辆过滤</span>
        </FormItem>

        <FormItem
          v-if="floatParams.railType === 28"
          label="过滤标签："
          prop="filterTagList"
        >
          <CheckboxGroup
            v-model="floatParams.filterTagList"
            style="width: 300px"
          >
            <Checkbox :label="1" :disabled="invalidEditor">无人证</Checkbox>
            <Checkbox :label="2" :disabled="invalidEditor">无车证</Checkbox>
            <Checkbox :label="3" :disabled="invalidEditor">未接种疫苗</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <!-- todo  开始 -->
        <FormItem
          v-if="floatParams.railType === 20"
          label="导航坐标："
          class="ivu-form-item-required"
        >
          <div class="navCoord">
            <Button
              type="primary"
              :disabled="invalidEditor"
              @click="handlerAddNavCoords"
            >
              新增导航坐标
            </Button>
            <div class="navCoordList">
              <div
                v-for="(item, index) in floatParams.navCoords"
                :key="index"
                class="navCoordItem"
              >
                <FormItem
                  :label="`导航坐标经度${index + 1}：`"
                  :prop="`navCoords.${index}.lng`"
                  :rules="{
                    required: true,
                    validator: validatorLngLat_2,
                    trigger: 'change',
                  }"
                >
                  <Input
                    v-model="item.lng"
                    :maxlength="40"
                    :readonly="invalidEditor"
                    placeholder="请输入导航坐标经度"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  :label="`导航坐标纬度${index + 1}：`"
                  :prop="`navCoords.${index}.lat`"
                  :rules="{
                    required: true,
                    validator: validatorLngLat_2,
                    trigger: 'change',
                  }"
                >
                  <Input
                    v-model="item.lat"
                    :maxlength="40"
                    :readonly="invalidEditor"
                    placeholder="请输入导航坐标纬度"
                    style="width: 300px"
                  />
                </FormItem>
                <Button
                  v-if="floatParams.navCoords.length > 1 && !invalidEditor"
                  type="error"
                  ghost
                  size="small"
                  @click="() => handleremoveItem('navCoords', index)"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem
          v-if="floatParams.railType === 20"
          label="策略时段："
          class="ivu-form-item-required"
        >
          <div class="navCoord">
            <Button
              type="primary"
              :disabled="invalidEditor"
              @click="handlerAddTimeRanges"
            >
              新增时段
            </Button>
            <div class="navCoordList">
              <div
                v-for="(item, index) in floatParams.timeRanges"
                :key="index"
                class="navCoordItem time"
              >
                <FormItem
                  :label="`时段${index + 1}：`"
                  :prop="`timeRanges.${index}.effectiveTime`"
                  :rules="{
                    type: 'array',
                    required: true,
                    validator: validatorEffectiveTime,
                    trigger: 'change',
                  }"
                >
                  <TimePicker
                    v-model="item.effectiveTime"
                    type="timerange"
                    format="HH:mm"
                    placeholder="请选择时段"
                    style="width: 300px"
                    :readonly="invalidEditor"
                  ></TimePicker>
                </FormItem>
                <Button
                  v-if="floatParams.timeRanges.length > 1 && !invalidEditor"
                  type="error"
                  ghost
                  size="small"
                  @click="() => handleremoveItem('timeRanges', index)"
                >
                  删除
                </Button>
              </div>
            </div>
          </div>
        </FormItem>

        <!-- todo   结束 -->

        <!-- 围栏范围新改造 -->
        <FormItem label="范围：" prop="scopes">
          <div v-if="!invalidEditor" class="drawDiv">
            <RadioGroup
              v-model="floatParams.selectScope"
              style="width: 300px"
              @on-change="changeSign"
            >
              <Radio :label="1">地图选择</Radio>
              <Radio :label="2">坐标输入</Radio>
            </RadioGroup>
            <p v-if="floatParams.selectScope === 1" class="titleTip">
              请在左侧地图上编辑范围
            </p>
            <div v-if="floatParams.selectScope === 1">
              <Button type="info" @click="initMouseTool">开始绘制</Button>
              <!-- todo开始 -->
              <Button
                v-if="floatParams.railType === 15"
                type="primary"
                @click="editMarker"
              >{{isEditMarker ? "结束编辑中心点" : "开始编辑中心点"}}</Button>
              <!-- todo结束  -->
              <Button type="primary" @click="eitorPolygon">{{btnTitle}}</Button>
              <Button
                v-if="drawingPolygons.length > 0"
                type="error"
                @click="clearChoiceMap"
              >清除围栏</Button>
            </div>
            <p v-if="floatParams.selectScope === 2" class="titleTip">
              经纬度支持6位小数，坐标点之间请用英文分号“;”隔开
            </p>
            <div v-if="floatParams.selectScope === 2" class="coordinatesInput">
              <Form
                ref="coordinatesForm"
                :model="coordinatesForm"
                :label-width="80"
              >
                <FormItem
                  v-for="(item, index) in coordinatesForm.coordinates"
                  :key="item.id"
                  :label="'坐标串' + (index + 1)"
                  :style="{ display: 'flex', 'margin-bottom': `${20}px` }"
                  :prop="'coordinates.' + index + '.value'"
                  :rules="{ validator: validatorLngLat, trigger: 'blur' }"
                >
                  <Row>
                    <Col span="20">
                      <Input
                        v-model="item.value"
                        placeholder="请输入字符串"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3 }"
                        style="width: 200px"
                      ></Input>
                    </Col>
                    <Col span="2" offset="1">
                      <div
                        v-if="index > 0"
                        class="delete_icon"
                        @click="handleRemove(index)"
                      >
                        <Icon type="ios-remove-circle-outline" />
                      </div>
                    </Col>
                  </Row>
                </FormItem>

                <div :style="{ 'margin-top': `${5}px` }">
                  <Row>
                    <Col span="24">
                      <Button type="info" @click="coordinatesAdd">新增坐标串</Button>
                      <Button type="info" @click="submitHandAddFence">保存预览</Button>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
          <div v-if="invalidEditor" class="drawDiv">
            <Input
              v-model="floatParams.scope"
              type="textarea"
              style="width: 300px"
              class="hidethisipt"
              readonly
            />
          </div>
        </FormItem>

        <!-- 地址类型围栏开始todo -->
        <FormItem
          v-if="floatParams.railType === 26"
          label="场景："
          prop="sceneCode"
        >
          <Cascader
            v-model="floatParams.sceneCode"
            :data="sceneList"
            placeholder="请选择场景"
            :disabled="invalidEditor"
            style="width: 300px"
          >
          </Cascader>
        </FormItem>
        <!-- 地址类型围栏结束todo -->

        <FormItem label="生效时间：" prop="effectiveTime">
          <DatePicker
            v-model="floatParams.effectiveTime"
            type="date"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择生效时间"
            style="width: 300px"
            :readonly="invalidEditor"
            :options="options"
            @on-change="geteffectiveTime"
          ></DatePicker>
        </FormItem>
        <FormItem label="失效时间：" prop="failureTime">
          <DatePicker
            v-model="floatParams.failureTime"
            type="date"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择失效时间"
            style="width: 300px"
            :readonly="invalidEditor"
            @on-change="getfailureTime"
          ></DatePicker>
        </FormItem>
        <!-- 新增的不可到达时间段s -->
        <FormItem
          v-if="
            floatParams.direction === 2 &&
              JSON.stringify(floatParams.addressTypeList) === '[2]'
          "
          label="不可到达时间段："
          class="ivu-form-item-required limit-time-range"
        >
          <div class="flex">
            <RadioGroup
              v-model="floatParams.timeRangeType"
              @on-change="handleLimitTimeonChange"
            >
              <Radio :label="0" :disabled="invalidEditor">全天</Radio>
              <Radio :label="1" :disabled="invalidEditor">部分</Radio>
            </RadioGroup>
            <div v-if="floatParams.timeRangeType === 1">
              <Button
                class="part-time-range"
                type="primary"
                :disabled="invalidEditor"
                @click="handlerAddLimitTimeRanges"
              >
                添加
              </Button>
            </div>
          </div>

          <div v-if="floatParams.timeRangeType === 1">
            <div class="navCoordList">
              <div
                v-for="(item, index) in floatParams.limitTimeList"
                :key="index"
                class="navCoordItem time"
              >
                <FormItem
                  :label="`时段${index + 1}：`"
                  :prop="`limitTimeList.${index}.limitTime`"
                  :rules="{
                    type: 'array',
                    required: true,
                    validator: validatorLimitRangeTime,
                    trigger: 'change',
                  }"
                >
                  <Row style="display: flex">
                    <Col :span="22">
                      <TimePicker
                        v-model="item.limitTime"
                        type="timerange"
                        format="HH:mm:ss"
                        placeholder="请选择不可到达时段"
                        style="width: 250px"
                        :readonly="invalidEditor"
                        :clearable="false"
                      ></TimePicker>
                    </Col>
                    <Col :span="2">
                      <Button
                        v-if="index > 0 && !invalidEditor"
                        type="error"
                        ghost
                        size="small"
                        @click="() => handleRemoveItemTimeRanges(item, index)"
                      >
                        删除
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            </div>
          </div>
        </FormItem>
        <!-- 新增的不可到达时间段e -->

        <FormItem label="备注：" prop="remark">
          <Input
            v-model="floatParams.remark"
            autosize
            :maxlength="200"
            :readonly="invalidEditor"
            type="textarea"
            placeholder="请填写备注"
            style="width: 300px"
          />
        </FormItem>
        <FormItem
          v-show="floatParams.railType === 1 && floatParams.direction === 2"
          label="原因："
          prop="reasonType"
          class="ivu-form-item-required"
        >
          <RadioGroup v-model="floatParams.reasonType">
            <Radio :label="0" :disabled="invalidEditor"> 无 </Radio>
            <Radio :label="1" :disabled="invalidEditor"> 有 </Radio>
          </RadioGroup>
          <Input
            v-model="floatParams.reason"
            autosize
            :disabled="floatParams.reasonType == 0"
            :maxlength="9"
            :readonly="invalidEditor"
            type="textarea"
            placeholder="请输入原因"
            style="width: 300px"
            @on-change="normalReason"
          />
        </FormItem>

        <!-- todo 开始 -->
        <FormItem
          v-show="floatParams.railType === 22"
          label="提示语录入："
          prop="voiceDoc"
        >
          <Input
            v-model="floatParams.voiceDoc"
            autosize
            :maxlength="200"
            :readonly="invalidEditor"
            type="textarea"
            placeholder="请填写提示语"
            style="width: 300px"
          />
        </FormItem>
        <!-- todo 结束 -->
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="backForm">取消</Button>
        <Button v-if="invalidEditor === false" type="primary" @click="saveFence">保存</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
/* eslint-disable */
import "@/styles/cyk-style.css";
import { savePen, selectPenView, getAllScene } from "_o/api/configData.js";
import {
  railTypeMap,
  directionList,
  targetAreaList,
  statusData,
  railTypeList,
  arrRailList,
  legendList,
  updateCoordsAndTimeRange,
  emptyFloatParams,
} from "./index.js";
import { timeFormat, listToMap } from "@/libs/util";
import centerIcon from "_o/assets/images/icons/center.png";
import {
  RAIL_TYPE__LIMIT_STOP,
  RAIL_TYPE__UPLOAD_HEALTH_CODE,
  railMap,
} from "_g/config/status-map";
import { mapState } from "vuex";
import { handleLimitStopRailTypeSubmitData } from "_o/components/config-center/elecfence-manage/biz";
import FenceBoundary from "./components/FenceBoundary";
import moment from "moment";
// 只能绘制一个围栏的类型
const onePathList = [6, 15];
export default {
  props: {
    uuid: {
      default: "",
      type: String,
    },
    cityList: {
      default: () => [],
      type: Array,
    },
    optList: {
      default: () => [],
      type: Array,
    },
    fenceStatusList: {
      default: () => [],
      type: Array,
    },
    provinceCityCodeMap: {
      default: () => [],
      type: Array,
    },
  },
  components: {
    FenceBoundary,
  },
  data() {
    let self = this;
    const carrierArea = (rule, value, callback) => {
      if (this.floatParams.carrierArea.length > 0) callback();
      else callback(new Error("城市区域不能为空"));
    };
    const serviceType = (rule, value, callback) => {
      if (this.floatParams.serviceType !== "") callback();
      else callback(new Error("产品线不能为空"));
    };
    const railType = (rule, value, callback) => {
      if (this.floatParams.railType || this.floatParams.railType === 0) {
        callback();
      } else callback(new Error("围栏类型不能为空"));
    };
    const oneDecimal = (rule, value, callback) => {
      let point = String(value).indexOf(".") + 1;
      let count = String(value).length - point;
      if (point > 0 && count > 1) {
        callback(new Error("最多保留一位小数"));
      }
      callback();
    };
    const effectiveTime = (rule, value, callback) => {
      if (this.floatParams.effectiveTime) {
        let getTime = new Date(this.floatParams.effectiveTime).getTime();
        if (this.floatParams.failureTime) {
          if (getTime > new Date(this.floatParams.failureTime).getTime()) {
            callback(new Error("生效日期不能大于失效日期"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("生效时间不能为空"));
      }
    };
    const failureTime = (rule, value, callback) => {
      if (this.floatParams.failureTime) {
        let getTime = new Date(this.floatParams.failureTime).getTime();
        if (this.floatParams.effectiveTime) {
          if (getTime < new Date(this.floatParams.effectiveTime).getTime()) {
            callback(new Error("失效日期不能小于生效日期"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("失效时间不能为空"));
      }
    };
    const getpathData = (rule, value, callback) => {
      if (this.drawingPolygons.length) callback();
      else callback(new Error("围栏位置范围不能为空"));
    };
    //校验经纬度
    const validatorLngLat = (rule, value, callback) => {
      if (value === "") callback(new Error("字符串围栏不能为空"));
      const reg =
        /^(\d{2,3}\.\d{3,6}\,\d{2,3}\.\d{3,6})(\;\d{2,3}\.\d{3,6}\,\d{2,3}\.\d{3,6}){2,}$/;
      const coordinates = this.coordinatesForm.coordinates;
      let isSame = false;
      if (coordinates.length > 1) {
        let num = 0;
        coordinates.forEach((item, idx) => {
          if (item.value === value) {
            num++;
          }
        });
        if (num > 1) {
          callback(new Error("该经纬度字符串已存在"));
        }
      }

      if (!reg.test(value)) {
        callback(new Error("该经纬度字符串格式不正确"));
      } else {
        callback();
      }
    };
    //导航坐标校验
    const validatorLngLat_2 = (rule, value, callback) => {
      const reg = /^\-?\d{2,3}(\.\d{3,6})$/;
      const index = parseInt(rule.field.split(".")[1], 10);
      const navCoords = this.floatParams.navCoords;
      let isSame = false;
      if (navCoords.length > 1) {
        navCoords.forEach((item, idx) => {
          if (
            JSON.stringify(navCoords[index]) === JSON.stringify(item) &&
            index !== idx
          ) {
            isSame = true;
          }
        });
      }
      if (!reg.test(value)) {
        callback("必须输入2~3位数字和3~6位小数");
      } else if (isSame) {
        callback("生效时段重复");
      } else {
        callback();
      }
    };
    //校验策略时段
    const validatorEffectiveTime = (rule, value, callback) => {
      const index = parseInt(rule.field.split(".")[1], 10);
      const timeRanges = this.floatParams.timeRanges;
      let isSame = false;
      if (timeRanges.length > 1) {
        timeRanges.forEach((item, idx) => {
          if (
            JSON.stringify(timeRanges[index]) === JSON.stringify(item) &&
            index !== idx
          ) {
            isSame = true;
          }
        });
      }
      (value &&
        value.forEach((item) => {
          if (item === "") {
            callback(new Error("请选择生效时段"));
          } else if (value[0] === value[1]) {
            callback(new Error("起止时间不能相同"));
          } else if (isSame) {
            callback("生效时段重复");
          } else {
            callback();
          }
        })) ||
        callback(new Error("请选择生效时间段"));
    };

    //校验不可到达时段
    const validatorLimitRangeTime = (rule, value, callback) => {
      const index = parseInt(rule.field.split(".")[1], 10);
      const timeRanges = this.floatParams.limitTimeList;
      const showTimeDurationsJudge = (durations) => {
        let judgeResult = true;
        if (durations && durations.length > 1) {
          for (let i = 0; i < durations.length - 1; i++) {
            for (let j = i + 1; j < durations.length; j++) {
              console.log(
                durations[i].limitTime,
                durations[j].limitTime,
                "998"
              );
              if (durations[j].limitTime[0] != "") {
                judgeResult =
                  judgeResult &&
                  judge(durations[i].limitTime, durations[j].limitTime);
              }
            }
          }
        }
        return judgeResult;
      };

      const judge = (a1, a2) => {
        let result = false;
        const start1 = moment(a1[0], "HH:mm:ss").valueOf();
        const end1 = moment(a1[1], "HH:mm:ss").valueOf();
        const start2 = moment(a2[0], "HH:mm:ss").valueOf();
        const end2 = moment(a2[1], "HH:mm:ss").valueOf();
        if (start1 == start2) {
          return false;
        } else if (start1 > start2) {
          result = start1 > end2;
        } else {
          result = end1 < start2;
        }
        return result;
      };
      this.limitTimeVerifyFlag = false;
      if (value.toString() === ",") {
        callback(new Error("请选择显示时间段"));
      } else if (value[0] === value[1]) {
        callback(new Error("起止时间不能相同"));
      } else if (!showTimeDurationsJudge(this.floatParams.limitTimeList)) {
        callback(new Error("时间段不可重复"));
      } else {
        this.limitTimeVerifyFlag = true;
        callback();
      }
    };

    const reasonTypeValidator = (rule, value, callback) => {
      const { reasonType, reason } = this.floatParams;
      if (reasonType === 1) {
        if (!reason) {
          callback(new Error("请输入原因"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    //场景校验
    const sceneCode = (rule, value, callback) => {
      if (this.floatParams.sceneCode && this.floatParams.sceneCode.length > 0) {
        callback();
      } else callback(new Error("请选择场景"));
    };
    return {
      spinShow: false, //页面加载flag
      railTypeList, //围栏类型数组
      arrRailList, //围栏数组形式
      popViewMap: false, //地图弹框flag
      indeterminate: true,
      checkAll: false, //是否全选
      checkAllGroup: [], //已选中的状态
      map: "", //地图对象
      // mapSearch: {
      //   //地图中的城市搜索参数   备注:默认是南京
      //   cityCode: ["320000", "320100"]
      // },
      //高德自带搜索条件
      searchOption: {
        city: "320100",
        citylimit: true,
      },
      stageMarkers: [], //查询标记点数组
      polygonAll: [], //全部围栏数据
      polygonAllInMap: [], //地图上所有围栏图形数组
      // filterPolygonInMap:[],  //状态过滤后的图形数组

      legendOprationflag: false, //运营围栏的legend
      legendPensonCarflag: false, //人车证过滤围栏的legend
      //todo  优化legend为动态
      legendList, //地图图例的数组
      infoWindow: "", //地图信息窗对象
      drawerInfo: {
        //右侧抽屉弹框对象
        title: "新增电子围栏",
        visable: false,
        styles: {
          height: "calc(100% - 55px)",
          overflow: "auto",
          paddingBottom: "53px",
          position: "static",
        },
      },
      floatParams: {
        //form表单数据
        addressTypeList: [], //出发地目的地数组
        provinceCode: "", //省code码
        cityCode: "", // 城市code码
        direction: null, //正逆向
        effectiveTime: "", //有效时间
        failureTime: "", //失效时间
        filterType: null, //过滤的类型
        name: "", //围栏名称
        railType: "", //围栏类型
        reason: "", //原因描述
        reasonType: 0, //原因类型
        remark: "", //备注
        scope: "", //围栏的path(string类型)
        serviceType: "", //产品线类型
        status: 1, //围栏的状态
        uuid: "", //唯一标识
        filterTagList: [], //过滤标签
        selectScope: 1, //范围选择 1:地图选择 2:手动填写
        carrierArea: [], //省市数组
        carLevelList: [], //车型等级数组
        // todo
        useLevelTypeList: [], //车型等级数组，可多选
        parkingTime: null, //限停时间
        tripDistance: null, //派单最小里程
        voiceDoc: "", //语音播报内容
        navCoords: [
          //导航坐标数组
          {
            lng: "",
            lat: "",
          },
        ],
        timeRanges: [
          //策略时段数据
          {
            effectiveTime: null,
          },
        ],
        extAttr: "", //额外的属性
        centerPoint: "", //调度中心点
        sceneCode: [], //选中场景
        limitTimeList: [
          {
            limitTime: null,
          },
        ],
        timeRangeType: 0, // 0:全天, 1:部分
      },
      invalidEditor: false, //是否限制编辑
      carLevelList: [], //联动下的车型等级
      ruleUser: {
        //form表单中的校验

        name: [
          {
            required: true,
            trigger: "change",
            message: "电子围栏名称不能为空",
          },
        ],
        serviceType: [
          {
            required: true,
            trigger: "change",
            validator: serviceType,
          },
        ],
        railType: [
          {
            required: true,
            trigger: "change",
            validator: railType,
          },
        ],
        parkingTime: [
          {
            required: true,
            message: "限停时间不能为空",
          },
        ],
        carrierArea: [
          {
            required: true,
            trigger: "change",
            validator: carrierArea,
          },
        ],
        scopes: [
          {
            required: true,
            trigger: "change",
            validator: getpathData,
          },
        ],
        effectiveTime: [
          {
            required: true,
            trigger: "change",
            validator: effectiveTime,
          },
        ],
        failureTime: [
          {
            required: true,
            trigger: "change",
            validator: failureTime,
          },
        ],
        remark: [
          {
            required: false,
            trigger: "change",
            message: "备注不能为空",
          },
        ],
        tripDistance: [
          {
            required: true,
            type: "number",
            message: "请输入派单最小里程",
            trigger: "blur",
          },
          { trigger: "blur", validator: oneDecimal },
        ],
        direction: [
          {
            required: true,
            type: "number",
            message: "请选择正向/逆向",
            trigger: "blur",
          },
        ],
        addressTypeList: [
          {
            required: true,
            type: "array",
            message: "请选择出发地/目的地",
            trigger: "blur",
          },
        ],
        filterTagList: [
          {
            required: true,
            type: "array",
            message: "请选择过滤标签",
            trigger: "blur",
          },
        ],
        filterType: [
          {
            required: true,
            type: "number",
            message: "请选择过滤类型",
            trigger: "blur",
          },
        ],
        useLevelTypeList: [
          {
            required: true,
            type: "array",
            message: "请选择车型等级",
            trigger: "change",
          },
        ],
        reasonType: [
          {
            validator: reasonTypeValidator,
          },
        ],
        sceneCode: [
          {
            required: true,
            trigger: "change",
            validator: sceneCode,
          },
        ],
      },
      drawerFormStatus: "", //add:新增状态 edit: 编辑状态  detail: 详情状态 copy: 复制状态
      directionList, //正逆向数组
      options: {
        //限制选择时间
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      coordinatesForm: {
        //手动添加坐标数据
        coordinates: [
          {
            value: "",
            id: "1",
          },
        ],
      },
      drawingPolygons: [], //正在绘制或者编辑的围栏数组
      MouseTool: null, //地图绘制工具对象
      titileStatus: true, //polygon的title状态
      btnTitle: "展示编辑点", //polygon的编辑按钮title
      polyEditorList: [], //编辑的单个多边形数组
      selectedOverlays: [], //选中的编辑或者绘制围栏
      queryParams: {
        //可视化页面中的查询条件
        statusList: [],
        railTypes: [],
      },
      mapData: {
        // zoom: 4, // 地图显示级别//全国范围
        center: [116.286278, 34.22237],
        zoom: 11, // 地图显示级别//全国范围
        markers: [],
        markerRefs: [],
        events: {
          init(o) {
            self.maps = self.$refs.map.$$getInstance();
          },
        },
      },
      //todo
      maps: null,
      validatorLngLat, //经纬度校验
      validatorLngLat_2, //导航坐标校验
      validatorEffectiveTime, //策略时段校验
      validatorLimitRangeTime, //不可到达时间段校验
      undoStateList: [], // 撤销状态维护
      recoverStateList: [], // 恢复状态维护
      isEditMarker: false, //是否编辑中心点
      centerMarker: null, //中心点
      sceneList: [], //场景树
      limitTimeVerifyFlag: false,
    };
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
    }),
    isRailTypeLimitStop() {
      return this.floatParams.railType === RAIL_TYPE__LIMIT_STOP;
    },
    // 是否为全部产品线
    isAllServiceType() {
      let arr = [
        4,
        6,
        7,
        8,
        12,
        15,
        17,
        18,
        19,
        20,
        RAIL_TYPE__UPLOAD_HEALTH_CODE,
      ];
      return arr.includes(this.floatParams.railType);
    },
  },
  watch: {
    popViewMap(newVal) {
      if (newVal) {
        setTimeout(() => {
          if (!this.drawerFormStatus) {
            this.map.setFitView(this.polygonAllInMap);
          } else {
            if (this.drawerFormStatus === "add") {
              // this.map.setCity(this.mapSearch.cityCode[1]);
            } else {
              this.map.setFitView(this.drawingPolygons);
            }
          }
        }, 0);
      }
    },
    //监听抽屉弹框
    "drawerInfo.visable"(newVal) {
      if (newVal) {
        this.$forceUpdate();
        // 清空撤销恢复栈
        this.recoverStateList = [];
        this.undoStateList = [];
      } else {
        this.$nextTick(() => {
          //重置隐藏的表单数据
          this.floatParams = JSON.parse(JSON.stringify(emptyFloatParams));
          //重置表单
          this.$refs.formValidate.resetFields();
        });
      }
    },

    //监听围栏状态数组
    checkAllGroup: {
      deep: true, //深度监听
      immediate: true,
      handler: function (newValue, oldValue) {
        // 这边用于可视化页面查询
        if (
          oldValue !== undefined &&
          this.popViewMap === true &&
          this.drawerFormStatus === ""
        ) {
          //  页面初始化不加载
          this.clearAllMapPolygon();
          this.queryParams.statusList = newValue;
          let flag = false;
          if (
            this.queryParams.statusList.length === 0 ||
            this.queryParams.railTypes.length === 0
          ) {
            flag = true;
          }
          this.viewMapAllPolygon(this.queryParams, flag);
        }
      },
    },
  },
  mounted() {
    //地图加载
    this.map = new AMap.Map("fence-map", {
      resizeEnable: true,
      zoom: 10,
    });
    // 获取树数据
    this.getSceneList();
  },
  methods: {
    //初始化执行
    init(type, paramData, queryParams) {
      if (this.$refs.serachbox) {
        this.$refs.serachbox.keyword = "";
      }
      this.clearMarkers();
      this.centerMarker = null;
      //清空编辑可能的polygon
      this.clearSignbyHand();
      this.clearSignbyMap();
      type ? (this.drawerFormStatus = type) : (this.drawerFormStatus = "");
      //清空所有城市查询的围栏
      this.clearAllMapPolygon();
      this.legendList.map((item) => {
        item.selected = false;
      });
      //清空可视化边界
      this.$refs.fenceboundary.handleClearModle();
      //关闭地图绘制
      this.MouseTool && this.MouseTool.close();
      this.MouseTool = "";
      //如果有抽屉form表单
      if (type) {
        //清空围栏状态的值
        this.checkAll = false;
        this.checkAllGroup = [];
        //清空搜索的条件
        this.queryParams = {
          statusList: [],
          railTypes: [],
        };
      } else {
        //type :'' 可视化页面
        //这里是可视化的配置
        this.queryParams = JSON.parse(JSON.stringify(queryParams));
        if (this.queryParams.statusList.length === 0) {
          this.queryParams.statusList = ["1", "2", "3", "4"];
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }

        if (this.queryParams.railTypes.length === 0) {
          this.queryParams.railTypes = JSON.parse(
            JSON.stringify(this.arrRailList)
          );
        }
        //初始化显示legend
        this.queryParams.railTypes.map((item, index) => {
          this.legendList.some((item2, index2) => {
            if (item === item2.railType) {
              item2.selected = true;
            }
            return item === item2.railType;
          });
        });
        this.viewMapAllPolygon(this.queryParams);
      }

      //编辑、详情、复制的统一操作
      if (paramData) {
        let { provinceCode, cityCode, scope, reason, serviceType, sceneCode } =
          paramData;
        //整合车型等级的数组
        this.changeServiceType(serviceType);
        //整合数据
        for (let key in this.floatParams) {
          if (paramData[key]) this.floatParams[key] = paramData[key];
        }
        //整合时间和经纬度
        updateCoordsAndTimeRange(this.floatParams);
        this.floatParams.selectScope = 1; //默认地图选择
        if (paramData.reason == null) {
          this.floatParams.reason = "";
          this.floatParams.reasonType = 0;
        } else {
          this.floatParams.reason = reason;
          this.floatParams.reasonType = reason ? 1 : 0;
        }
        //处理城市数据
        this.floatParams.carrierArea = [provinceCode, cityCode];
        // this.mapSearch.cityCode = [provinceCode,cityCode];
        this.searchOption.city = cityCode;
        this.searchOption.citylimit = true;
        //绘制编辑的围栏
        let paths = this.getPathDataMap(this.getScopePath(scope));
        this.handDrawPolygon(paths, 1);

        //如果是调度围栏要绘制中心点
        if (this.floatParams.railType === 15) {
          if (this.floatParams.centerPoint) {
            this.floatParams.centerPoint = JSON.parse(
              this.floatParams.centerPoint
            );
            let centerPoint = this.floatParams.centerPoint;
            this.setEditMarker(centerPoint.lng, centerPoint.lat, false);
            this.isEditMarker = false;
          }
        }
        //地址类型围栏
        if (this.floatParams.railType === 26) {
          this.floatParams.sceneCode = [
            sceneCode.substring(0, 3),
            sceneCode.substring(0, 6),
            sceneCode,
          ];
        }
        if (
          this.floatParams.railType === 1 ||
          this.floatParams.railType === 28
        ) {
          this.floatParams.timeRangeType = paramData.timeRangeType;
          let tempDateList = paramData.limitTimeList;
          let tempList = [];
          if (this.floatParams.timeRangeType === 0) {
            tempList = [{ limitTime: null }];
          } else if (this.floatParams.timeRangeType === 1) {
            tempDateList.map((item) => {
              let params = {};
              params["limitTime"] = item.startTime
                ? [item.startTime, item.endTime]
                : null;
              tempList.push(params);
            });
          }
          this.floatParams.limitTimeList = tempList;
        }
      }
      //根据data来判断 编辑：edit、详情：detail、 复制:copy
      switch (type) {
        case "add":
          //操作
          this.$Message.success("你点击了新增");
          this.drawerInfo.title = "新增电子围栏";
          //默认
          this.$nextTick(() => {
            this.floatParams.selectScope = 1;
            this.floatParams.carrierArea = [];
            this.floatParams.addressTypeList = [];
            this.floatParams.filterType = null;
            this.floatParams.parkingTime = null;
            this.floatParams.sceneCode = [];
            this.$forceUpdate();
          });
          // this.mapSearch.cityCode = ["320000", "320100"];
          this.searchOption.city = "全国";
          this.searchOption.citylimit = false;
          break;
        case "edit":
          //操作
          this.$Message.success("你点击了编辑");
          this.drawerInfo.title = "编辑电子围栏";
          break;
        case "detail":
          //操作
          this.$Message.success("你点击了详情");
          this.drawerInfo.title = "查看电子围栏";
          break;
        case "copy":
          //操作
          this.$Message.success("你点击了复制");
          this.drawerInfo.title = "复制电子围栏";
          break;
        default:
        //操作
      }
      //限制编辑
      type === "detail"
        ? (this.invalidEditor = true)
        : (this.invalidEditor = false);
      if (type) {
        this.popViewMap = true;
      }
      type
        ? (this.drawerInfo.visable = true)
        : (this.drawerInfo.visable = false);
      console.log("城市", this.floatParams.carrierArea);
    },

    //清除绘制的所有围栏
    clearAllMapPolygon() {
      if (this.polygonAllInMap) {
        this.map.remove(this.polygonAllInMap);
        this.polygonAllInMap = [];
        this.polygonAll = [];
      }
    },
    //可视化分析
    viewMapAllPolygon(queryParams, flag) {
      this.spinShow = true;
      this.checkAllGroup = queryParams.statusList || [];
      // this.mapSearch.cityCode = newValue;
      this.searchOption.city = queryParams.cityCode;
      //调接口查询城市的围栏数据
      selectPenView(queryParams).then((res) => {
        let data = res.data.data || [];
        if (flag) {
          data = [];
        }
        // 过滤营销围栏
        // this.tableData = this.tableData.filter(item => item.railType === 3)
        console.log("围栏数据", data);
        //过滤没用的经纬度
        let reg =
          /^(&?(\d{2,3}\.\d{3,6}\,\d{2,3}\.\d{3,6})(\;\d{2,3}\.\d{3,6}\,\d{2,3}\.\d{3,6}){2,})+$/;
        data =
          data &&
          data.filter((item) => {
            return reg.test(item.scope);
          });
        data &&
          data.forEach((item, index) => {
            item.statusName = statusData[item.status];
            item.railTypeName = listToMap(railTypeList)[item.railType];
            item.paths = this.getPathDataMap(this.getScopePath(item.scope));
          });
        this.polygonAll = data;
        console.log("围栏数据:", this.polygonAll);
        //绘制围栏
        this.drawPolygon();
        this.$emit("over-load", true);
        this.popViewMap = true;
      });
    },

    //返回操作
    back() {
      this.popViewMap = false;
    },
    //全选操作
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ["1", "2", "3", "4"];
      } else {
        this.checkAllGroup = [];
      }
    },
    //复选框组选择
    checkAllGroupChange(data) {
      if (data.length === 4) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //清楚地图中的marker
    clearMarkers() {
      if (this.stageMarkers && this.stageMarkers.length !== 0) {
        this.map.remove(this.stageMarkers);
        this.stageMarkers = [];
      }
      //清除中心点
      if (this.centerMarker) {
        this.map.remove(this.centerMarker);
        this.centerMarker = null;
      }
    },

    //scope字符串转数组
    getScopePath(scope) {
      let list = [];
      if (scope.indexOf("&") !== -1) {
        list = scope.split("&");
      } else {
        list = [scope];
      }
      return list;
    },

    //获取路径
    getPathDataMap(data) {
      let res = [];
      data.forEach((item) => {
        if (item) {
          let arr = item.split(";");
          let newArr = arr.map((item2) => [
            item2.split(",")[0],
            item2.split(",")[1],
          ]);
          res.push(newArr);
        }
      });
      return res;
    },

    //绘制所有的多边形围栏
    drawPolygon() {
      let data = this.polygonAll;
      this.polygonAllInMap = [];
      data.forEach((item) => {
        //根据条件获取多边形的填充颜色及边框样式
        let { strokeColor, fillColor, strokeStyle, strokeDasharray } =
          this.selectColor(item);
        item.paths.forEach((item2) => {
          let polygon = {};
          polygon = new AMap.Polygon({
            path: item2,
            strokeColor: strokeColor,
            strokeWeight: 2,
            strokeOpacity: 1,
            fillOpacity: 0.3,
            fillColor: fillColor,
            strokeStyle: strokeStyle,
            strokeDasharray: strokeDasharray,
            extData: {
              id: item.uuid,
              name: item.name,
              status: item.status,
              statusName: item.statusName,
              railType: item.railType,
            },
          });
          //添加点击事件
          polygon.on("click", (e) => {
            console.log(e);
            let lnglat = [e.lnglat.lng, e.lnglat.lat];
            let polygon = e.target;
            //map弹信息窗
            this.infoWindowMap(lnglat, polygon);
          });
          //鼠标移入事件
          polygon.on("mouseover", (e) => {
            let polygon = e.target;
            polygon.setOptions({
              fillOpacity: 0.6,
            });
          });
          //鼠标移出事件
          polygon.on("mouseout", (e) => {
            let polygon = e.target;
            polygon.setOptions({
              fillOpacity: 0.3,
            });
          });

          this.polygonAllInMap.push(polygon);
        });
      });

      this.map.add(this.polygonAllInMap);
      if (!this.drawerFormStatus) {
        this.map.setFitView();
      }

      this.spinShow = false;
    },

    //信息窗弹框
    infoWindowMap(lnglat, polygon) {
      let name = polygon.getExtData()["name"];
      let statusName = polygon.getExtData()["statusName"];

      let content = `
      <div class='input-card content-window-card'>
        <div class="window-item">
            <span>围栏名称：</span>
            <span>${name}</span>
        </div>
        <div class="window-item">
            <span>围栏状态：</span>
            <span>${statusName}</span>
        </div>
      </div>
      `;
      this.clearInfoWindow();
      this.infoWindow = new AMap.InfoWindow({
        content: content, //使用默认信息窗体框样式，显示信息内容
      });
      this.infoWindow.open(this.map, lnglat);
    },

    //清除信息窗弹框
    clearInfoWindow() {
      if (this.infoWindow) {
        this.infoWindow.close();
        this.infoWindow = "";
      }
    },

    // 颜色选取
    selectColor(data) {
      let obj = {
        strokeColor: "",
        fillColor: "",
        strokeStyle: "",
        strokeDasharray: "",
      };
      //围栏判断   1:运营围栏 28:人车证过滤围栏
      switch (data.railType) {
        case 1:
          obj.strokeColor = "#83C7F4";
          obj.fillColor = "#83C7F4";
          break;
        case 2:
          obj.strokeColor = "#CD2D3A";
          obj.fillColor = "#CD2D3A";
          break;
        case 4:
          obj.strokeColor = "#00B6CA";
          obj.fillColor = "#00B6CA";
          break;
        case 5:
          obj.strokeColor = "#DB6FE9";
          obj.fillColor = "#DB6FE9";
          break;
        case 6:
          obj.strokeColor = "#F4D950";
          obj.fillColor = "#F4D950";
          break;
        case 7:
          obj.strokeColor = "#FF8292";
          obj.fillColor = "#FF8292";
          break;
        case 8:
          obj.strokeColor = "#006AB9";
          obj.fillColor = "#006AB9";
          break;
        case 12:
          obj.strokeColor = "#96F0E6";
          obj.fillColor = "#96F0E6";
          break;
        case 14:
          obj.strokeColor = "#B17572";
          obj.fillColor = "#B17572";
          break;
        case 15:
          obj.strokeColor = "#D6BCF2";
          obj.fillColor = "#D6BCF2";
          break;
        case 17:
          obj.strokeColor = "#EB5C1E";
          obj.fillColor = "#EB5C1E";
          break;
        case 18:
          obj.strokeColor = "#B11A41";
          obj.fillColor = "#B11A41";
          break;
        case 19:
          obj.strokeColor = "#F4BDE5";
          obj.fillColor = "#F4BDE5";
          break;
        case 20:
          obj.strokeColor = "#0047FF";
          obj.fillColor = "#0047FF";
          break;
        case 21:
          obj.strokeColor = "#2F007C";
          obj.fillColor = "#2F007C";
          break;
        case 22:
          obj.strokeColor = "#FF9276";
          obj.fillColor = "#FF9276";
          break;
        case 23:
          obj.strokeColor = "#00C299";
          obj.fillColor = "#00C299";
          break;
        case 24:
          obj.strokeColor = "#61639D";
          obj.fillColor = "#61639D";
          break;
        case RAIL_TYPE__LIMIT_STOP:
          obj.strokeColor = "#3F8C0C";
          obj.fillColor = "#3F8C0C";
          break;
        case 26:
          obj.strokeColor = "#9C629E";
          obj.fillColor = "#9C629E";
          break;
        case 27:
          obj.strokeColor = "#F2BDBD";
          obj.fillColor = "#F2BDBD";
          break;
        case 28:
          obj.strokeColor = "#FF914D";
          obj.fillColor = "#FF914D";
          break;
      }
      //状态判断  1:正常 2:未生效 3:失效 4:停用
      switch (data.status) {
        case 1:
          obj.strokeStyle = "solid";
          obj.strokeDasharray = [0, 0, 0];
          break;
        case 2:
          obj.strokeStyle = "dashed";
          obj.strokeDasharray = [10, 10];
          break;
        default:
          obj.strokeStyle = "dashed";
          obj.strokeDasharray = [10, 2, 10];
      }

      return obj;
    },

    //legend选择事件
    changeLegend(legendInfo) {
      //信息窗清除
      this.clearInfoWindow();
      let { railType: type, selected } = legendInfo;
      if (this.queryParams.railTypes.includes(type)) {
        this.queryParams.railTypes.splice(
          this.queryParams.railTypes.indexOf(type),
          1
        );
      } else {
        this.queryParams.railTypes.push(type);
      }
      legendInfo.selected = !legendInfo.selected;

      //再次调用查询接口
      this.clearAllMapPolygon();
      let flag = false;
      if (
        this.queryParams.statusList.length === 0 ||
        this.queryParams.railTypes.length === 0
      ) {
        flag = true;
      }
      this.viewMapAllPolygon(this.queryParams, flag);
    },

    //todo  高德的搜索结果
    onSearchResult(pois) {
      //删除已有的覆盖物
      this.clearMarkers();
      let lngSum = 0;
      let latSum = 0;
      pois.forEach((pos) => {
        let { lng, lat } = pos;
        lngSum += lng;
        latSum += lat;
      });
      let center = {
        lng: lngSum / pois.length,
        lat: latSum / pois.length,
      };
      // this.mapData.center = [center.lng, center.lat];
      let searchMarker = new AMap.Marker({
        position: [center.lng, center.lat],
      });
      this.stageMarkers = [searchMarker];
      this.map.add(this.stageMarkers);
      this.map.setFitView(this.stageMarkers);
    },

    // 在“正向/逆向”字段选中“正向”的情况下，在勾选“出发地/目的地”字段的“目的地”选项时，此时界面出现确认弹窗
    targetChange(isTarget) {
      let isConfirm = false;
      if (this.floatParams.targetAreaCopy === undefined)
        this.floatParams.targetAreaCopy = [];
      if (this.floatParams.directionCopy === undefined)
        this.floatParams.directionCopy = null;
      if (isTarget) {
        //出发地目的地变更
        if (
          this.floatParams.direction === 1 &&
          (!this.floatParams.targetAreaCopy ||
            this.floatParams.targetAreaCopy.indexOf(2) === -1) &&
          this.floatParams.addressTypeList &&
          this.floatParams.addressTypeList.indexOf(2) > -1
        ) {
          isConfirm = true;
        }
        //添加出发地或目的地逻辑
        if (this.floatParams.addressTypeList.includes(3)) {
          this.floatParams.addressTypeList = [3];
        }
      } else {
        // 正向逆向
        if (
          this.floatParams.direction === 1 &&
          this.floatParams.addressTypeList &&
          this.floatParams.addressTypeList.indexOf(2) > -1
        ) {
          isConfirm = true;
        }
        if (this.floatParams.direction === 1) {
          this.floatParams.filterType = null;
          this.floatParams.filterTagList &&
            this.floatParams.filterTagList.splice(0, 3);
        }
      }
      // 如果正向 & 目的地
      if (isConfirm) {
        this.$Modal.confirm({
          title: "请确认",
          width: 520,
          content:
            "设置正向目的地围栏后，该城市下订单仅当目的地在正向目的地围栏范围内时向乘客提供叫车服务，目的地在围栏范围以外的区域则禁止下单。确定创建？",
          onCancel: () => {
            if (isTarget) {
              this.floatParams.addressTypeList.splice(
                0,
                5,
                ...this.floatParams.targetAreaCopy
              );
            } else {
              this.floatParams.direction = this.floatParams.directionCopy;
            }
            this.setCopy();
          },
          onOk: () => {
            this.setCopy();
          },
        });
      } else {
        this.setCopy();
      }
    },
    setCopy() {
      this.floatParams.directionCopy = this.floatParams.direction;
      this.floatParams.targetAreaCopy = this.floatParams.addressTypeList;
    },
    //运营时的过滤切换事件
    changeFilterType(value) {},
    // 切围栏类型，切换到全部产品线的，默认全部产品线，切换到选择产品线的，如果是全部产品线，清空选项
    typeChangeFence(value) {
      //其他联动
      this.$nextTick(() => {
        this.clearMarkers();
        if (this.isAllServiceType) {
          this.floatParams.serviceType = 5;
        } else if (this.floatParams.serviceType == "5")
          this.floatParams.serviceType = null;
        switch (value) {
          case 1:
            this.floatParams.direction = null;
            this.floatParams.filterTagList = [];
            break;
          case 26:
            this.floatParams.sceneCode = [];
            break;
          case 28:
            this.floatParams.direction = 2;
            this.floatParams.filterType = 3;
            this.floatParams.addressTypeList = [];
            break;
        }
        this.$forceUpdate();
      });
    },

    // form表单中的城市切换
    getCityByForm(data, value) {
      //清除原有的地图绘制数据和手动绘制数据、
      this.clearSignbyMap();
      this.clearSignbyHand();
      // 清空撤销恢复栈
      this.recoverStateList = [];
      this.undoStateList = [];
      //联动地图上的城市
      const [provinceCode, cityCode] = data;
      this.searchOption.city = cityCode;
      this.searchOption.citylimit = true;
      if (this.$refs.serachbox) {
        this.$refs.serachbox.keyword = "";
      }
      this.map.setCity(cityCode);
    },

    //开始绘制多边形
    initMouseTool() {
      if (!this.MouseTool) {
        this.MouseTool = "";
        this.MouseTool = new AMap.MouseTool(this.map);
        this.MouseTool.polygon({
          fillColor: "#00b0ff",
          strokeColor: "#019be0",
          strokeWeight: 2,
          fillOpacity: 0.4,
        });
        this.$Message.success("开始绘制");
        this.MouseTool.on("draw", this.MouseToolDraw);
      }
    },

    // 绘制的回调函数
    MouseToolDraw(e) {
      console.log("数据：", e.obj);
      console.log("围栏：", e.obj.getPath());
      let polygon = e.obj;
      polygon.on("click", (e) => {
        let item = e.target;
        if (item.selected) {
          item.selected = false;
          item.setOptions({
            fillColor: "#00b0ff",
          });
          let index = this.selectedOverlays.indexOf(item);
          this.selectedOverlays.splice(index, 1);
        } else {
          item.selected = true;
          item.setOptions({
            fillColor: "#DC143C",
          });
          this.selectedOverlays.push(item);
        }
      });
      this.drawingPolygons.push(polygon);
      //添加可撤销栈

      const action = {
        type: 1,
        state: polygon,
      };
      // 添加可撤销栈
      this.preAction(action);
      this.clearRecoverList();
      //重新校验下范围字段
      this.$refs.formValidate.validateField("scopes");
    },
    //多边形编辑和隐藏事件
    eitorPolygon() {
      if (this.drawingPolygons.length === 0) {
        this.$Message.warning("无可编辑围栏");
        return;
      }

      let polygonEditor = this.drawingPolygons;

      if (this.titileStatus) {
        this.polyEditorList = [];
        polygonEditor.length &&
          polygonEditor.forEach((item) => {
            let singlepoly = new AMap.PolyEditor(this.map, item);
            this.polyEditorList.push(singlepoly);
            singlepoly.open();
          });
      } else {
        this.polyEditorList &&
          this.polyEditorList.forEach((item) => {
            item.close();
          });
        this.polyEditorList = [];
      }
      //结束编辑重新替换多边形对象
      this.polyEditorList &&
        this.polyEditorList.forEach((item, index) => {
          item.on("end", (e) => {
            this.drawingPolygons[index] = e.target;
          });
        });

      this.titileStatus = !this.titileStatus;
      this.btnTitle = this.titileStatus ? "展示编辑点" : "隐藏编辑点";
    },

    //清除围栏功能
    clearChoiceMap() {
      if (!this.drawingPolygons.length) {
        this.$Message.warning("无可清除围栏");
        return;
      }
      // -----------清除围栏开始
      let msg = this.selectedOverlays.length
        ? "是否清除围栏"
        : "存在多个区域围栏,是否全部清除";
      this.$Modal.confirm({
        title: msg,
        onOk: () => {
          this.polyEditorList.length &&
            this.polyEditorList.forEach((item) => {
              item.close();
            });
          this.titileStatus = false;
          this.btnTitle = "展示编辑点";
          this.polyEditorList = [];

          if (this.selectedOverlays && this.selectedOverlays.length > 0) {
            console.log("删除", this.selectedOverlays);
            this.selectedOverlays.forEach((item) => {
              this.map.remove(item);
              let index = this.drawingPolygons.indexOf(item);
              this.drawingPolygons.splice(index, 1);
            });
            // 添加可撤销状态
            const action = {
              type: 0,
              state: this.selectedOverlays || [],
            };
            this.preAction(action);
            this.clearRecoverList();
            this.selectedOverlays = [];
            this.polygonEditor = [];
          } else {
            this.drawingPolygons &&
              this.drawingPolygons.forEach((item) => {
                this.map.remove(item);
              });
            const action = {
              type: 0,
              state: this.drawingPolygons,
            };
            this.preAction(action);
            this.clearRecoverList();

            this.drawingPolygons = [];
            this.selectedOverlays = [];
          }
          this.titileStatus = true;
          //校验下范围
          this.$refs.formValidate.validateField("scopes");
        },
      });
    },

    //todo生效，失效
    geteffectiveTime(val) {},
    getfailureTime(val) {},

    //整合map上的polygon 为scope
    fetchScope() {
      let data = this.drawingPolygons;
      let scopeList = [];
      data &&
        data.forEach((item) => {
          let list = [];
          item.getPath().forEach((item2) => {
            let latlng = `${item2.lng},${item2.lat}`;
            list.push(latlng);
          });
          list = list.join(";");
          scopeList.push(list);
        });

      console.log("测试数据", scopeList.join("&"));
      return scopeList.join("&");
    },

    //绘制一个围栏的校验
    onePathSuccess() {
      let type = this.floatParams.railType;
      if (onePathList.includes(type)) {
        this.$Message.error(`${railMap[type]}只能绘制一个区域`);
        return false;
      }
      return true;
    },

    //form表单提交
    saveFence() {
      //实验
      // this.fetchScope();
      const promises = [];
      promises.push(this.$refs.formValidate.validate());

      if (this.floatParams.selectScope === 2) {
        promises.push(this.$refs.coordinatesForm.validate());
      }
      Promise.all(promises).then((values) => {
        if (!values.includes(false)) {
          //判断是否有编辑状态的绘制图
          if (this.polyEditorList && this.polyEditorList.length > 0) {
            this.eitorPolygon();
          }
          // //判断是否是坐标输入，是坐标输入，强制执行预览保存生成最新的围栏点
          // if(this.floatParams.selectScope === 2){
          //   this.submitHandAddFence();
          // }
          // 只能画一个围栏校验
          if (this.drawingPolygons.length > 1 && !this.onePathSuccess()) {
            return false;
          }
          // 调度类型围栏，校验点标记
          if (this.floatParams.railType === 15) {
            if (!this.centerMarker) {
              this.$Message.error("调度围栏需选择中心点");
              return false;
            } else {
              if (!this.drawingPolygons.length) {
                this.$Message.error("请绘画调度围栏");
                return false;
              }
              if (!this.computeInner(this)) {
                return false;
              }
            }
            let centerLnglat = this.centerMarker.getPosition();
            this.floatParams.centerPoint = {
              lng: centerLnglat.lng,
              lat: centerLnglat.lat,
            };
            //关闭地图点击事件
            this.map.off("click", this.setMarker);
          } else {
            this.floatParams.centerPoint = null;
          }
          // //校验围栏点数不超过1000个点
          //   if(this.checkPointNum()){
          //      this.$Message.warning('围栏经纬度点总和不得超过1000个');
          //      return  false
          //   }
          let data = JSON.parse(JSON.stringify(this.floatParams));
          let begintime = new Date(this.floatParams.effectiveTime).getTime();
          let endtime = new Date(this.floatParams.failureTime).getTime();
          let currentTime = new Date().getTime();
          let newJSON = {};
          newJSON.serviceType = data.serviceType;
          newJSON.name = data.name;
          //整合scope
          let myScope = this.fetchScope();
          newJSON.scope = myScope;
          newJSON.railType = data.railType;
          newJSON.provinceCode = data.carrierArea[0];
          newJSON.cityCode = data.carrierArea[1];
          newJSON.effectiveTime = timeFormat(begintime);
          newJSON.failureTime = timeFormat(endtime);
          newJSON.remark = data.remark;

          // newJSON.direction = data.direction;
          // newJSON.addressTypeList = data.addressTypeList;
          // newJSON.filterType = data.filterType;
          if (newJSON.railType === 1 || newJSON.railType === 28) {
            newJSON.direction = data.direction;
            newJSON.addressTypeList = data.addressTypeList;
            newJSON.filterType = data.filterType;
            newJSON.timeRangeType = data.timeRangeType;
            let tempDateList = data.limitTimeList;
            let dateInfo = [];
            tempDateList.map((item) => {
              let params = {};
              params.startTime = (item.limitTime && item.limitTime[0]) || "";
              params.endTime = (item.limitTime && item.limitTime[1]) || "";
              dateInfo.push(params);
            });
            newJSON.limitTimeList = newJSON.timeRangeType === 0 ? [] : dateInfo;
          }
          // todo 新的操作开始
          if (newJSON.railType === 15) newJSON.centerPoint = data.centerPoint;
          if (newJSON.railType === 6) newJSON.tripDistance = data.tripDistance;
          if (newJSON.railType === RAIL_TYPE__LIMIT_STOP) {
            // 限停围栏
            newJSON.parkingTime = data.parkingTime;
          }
          if (newJSON.railType === 26) {
            // 地址类型围栏
            newJSON.sceneCode = data.sceneCode[data.sceneCode.length - 1];
          }
          if (newJSON.railType === 20) {
            const extAttr = {};
            extAttr.centerPoints = data.navCoords;
            extAttr.effectTimes = data.timeRanges.map((item) => ({
              startTime: item.effectiveTime[0],
              endTime: item.effectiveTime[1],
            }));
            newJSON.extAttr = JSON.stringify(extAttr);
          }

          if (newJSON.railType === 22) {
            newJSON.extAttr = JSON.stringify({
              voiceDoc: data.voiceDoc,
              useLevelTypeList: data.useLevelTypeList,
            });
          } else if (data.carLevelList && data.carLevelList.length) {
            newJSON.carLevelList = data.carLevelList;
          }

          //todo 新的操作结束
          if (newJSON.railType === 28)
            newJSON.filterTagList = data.filterTagList;

          if (currentTime < begintime) {
            newJSON.status = 2;
          } else if (currentTime > begintime && currentTime < endtime) {
            newJSON.status = 1;
          } else if (currentTime > endtime) {
            newJSON.status = 3;
          } else {
            newJSON.status = 1;
          }
          if (this.drawerFormStatus === "edit") {
            newJSON.uuid = this.floatParams.uuid;
          }
          //  if (data.carLevelList && data.carLevelList.length) {
          //     newJSON.carLevelList = data.carLevelList;
          //  }
          if (newJSON.railType === 1 && newJSON.direction === 2) {
            newJSON.reason = data.reasonType === 0 ? "" : data.reason;
          }
          if (this.drawerFormStatus === "copy") {
            delete newJSON.uuid;
          }
          if (newJSON.railType === RAIL_TYPE__LIMIT_STOP) {
            handleLimitStopRailTypeSubmitData(newJSON);
          }
          savePen(newJSON)
            .then((res) => {
              if (res.data.code === 200) {
                //其他操作
                this.popViewMap = false;
                this.drawerInfo.visable = false;
                this.$emit("on-success", true);
              }
              this.$Message.success(res.data.msg);
            })
            .catch((err) => {
              this.$Message.error(err);
            });
        }
      });
    },

    //校验点数
    // checkPointNum(){
    //   let data = this.drawingPolygons;
    //   let num = 0;
    //   let result = false;
    //    data && data.forEach(item => {
    //      num += item.getPath().length
    //    })
    //    if(num > 10){
    //     result = true;
    //   }
    //   return result
    // },

    // 原因输入框内最多支持输入9个字符，支持输入中文、英文、数字
    normalReason() {
      const reg = /[^\u4e00-\u9fa5|\d|a-z|A-Z]/g;
      const text = (this.floatParams.reason || "")
        .replace(reg, "")
        .replace("|", "");
      this.$nextTick(() => {
        this.floatParams.reason = text.slice(0, 9);
      });
    },
    //todo form中产品线的选择
    changeServiceType(val) {
      this.floatParams.useLevelTypeList = [];
      this.floatParams.carLevelList = [];
      let carTypes = this.bizTypeList.find((it) => it.value === val) || {};
      this.carLevelList = carTypes.children || [];
    },

    //退出到form表单
    backForm() {
      // 如果有编辑状态，先结束编辑状态
      if (this.polyEditorList && this.polyEditorList.length > 0) {
        this.eitorPolygon();
      }
      this.$refs.fenceboundary.handleClearModle();
      this.drawerInfo.visable = false;
      this.popViewMap = false;
    },
    //坐标点删除
    handleRemove(index) {
      let data = this.coordinatesForm.coordinates;
      data.splice(index, 1);
    },
    //坐标点添加
    coordinatesAdd() {
      let data = this.coordinatesForm.coordinates;
      if (data.length > 4) {
        this.$Message.error("新增最多只能5条坐标串");
        return;
      }
      data.push({ id: Math.random().toString().slice(2), value: "" });
    },

    //地图选择切换
    //todo
    changeSign(data) {
      console.log(data);
      if (data === 1) {
        // this.MouseTool && this.MouseTool.close();
        // this.clearSignbyHand();
      } else if (data === 2) {
        //判断是否有编辑状态的绘制图
        if (this.polyEditorList && this.polyEditorList.length > 0) {
          this.eitorPolygon();
        }
        //关闭地图绘制
        this.MouseTool && this.MouseTool.close();
        this.MouseTool = "";
        //将图形转换成坐标字符串
        if (this.drawingPolygons && this.drawingPolygons.length > 0) {
          this.coordinatesForm.coordinates = this.drawingPolygons.map(
            (item, index) => {
              let scope = "";
              let list = [];
              item.getPath().forEach((item2) => {
                let latlng = `${item2.lng},${item2.lat}`;
                list.push(latlng);
              });
              scope = list.join(";");
              return {
                value: scope,
                id: index === 0 ? "1" : Math.random().toString().slice(2),
              };
            }
          );
        }
        // this.clearSignbyMap();
      }
    },
    //清空地图选择的数据
    clearSignbyMap() {
      this.drawingPolygons &&
        this.drawingPolygons.forEach((item) => {
          this.map.remove(item);
        });
      this.drawingPolygons = [];
      this.polyEditorList = [];
      this.selectedOverlays = [];
    },
    //清空手动选择的数据
    clearSignbyHand() {
      let infoList = [{ value: "", id: "1" }];
      this.coordinatesForm.coordinates = infoList;

      this.drawingPolygons &&
        this.drawingPolygons.forEach((item) => {
          this.map.remove(item);
        });
      this.drawingPolygons = [];
    },

    //手动提交坐标串
    submitHandAddFence() {
      this.$refs.coordinatesForm.validate().then((value) => {
        if (value) {
          //执行
          let data = this.coordinatesForm.coordinates;
          let list = [];
          data.forEach((item) => {
            list.push(item.value);
          });
          let path = this.getPathDataMap(list);
          console.log(path);

          //绘制手动添加的围栏
          this.handDrawPolygon(path);
        }
      });
    },

    //手动绘制
    handDrawPolygon(path, hasClick) {
      //如果之前有绘制的图，先清除
      this.drawingPolygons &&
        this.drawingPolygons.forEach((item) => {
          this.map.remove(item);
        });
      this.drawingPolygons = [];
      path.forEach((item) => {
        let polygon = {};
        polygon = new AMap.Polygon({
          path: item,
          fillColor: "#00b0ff",
          strokeColor: "#019be0",
          strokeWeight: 2,
          fillOpacity: 0.4,
        });
        //编辑时用
        if (hasClick) {
          polygon.on("click", (e) => {
            // item.selectScopeIndex = selectScopeIndex; //把scope对应的索引放在item上，在删除的时候使用
            let item = e.target;
            if (item.selected) {
              item.selected = false;
              item.setOptions({
                fillColor: "#00b0ff",
              });
              let index = this.selectedOverlays.indexOf(item);
              this.selectedOverlays.splice(index, 1);
            } else {
              item.selected = true;
              item.setOptions({
                fillColor: "#DC143C",
              });
              this.selectedOverlays.push(item);
            }
          });
        }
        this.drawingPolygons.push(polygon);
      });

      this.map.add(this.drawingPolygons);
      this.map.setFitView(this.drawingPolygons);
    },

    //抽屉退出
    backDrawer() {
      this.popViewMap = false;
    },

    /**
     * 可撤销操作入栈
     * action:{type:0|1,state:array}
     * type:1添加，0:删除
     */
    preAction(state) {
      this.undoStateList.push(state);
      console.log(state, "pushPreAction");
    },
    // 撤销操作
    preState() {
      const popStatus = this.undoStateList.pop();
      this.recoverStateList.push(popStatus);
      console.log(popStatus, "popStatus");
      this.handlePolygon(popStatus, 1);
    },
    // 恢复操作
    recoverState() {
      console.log("recoverStateList", this.recoverStateList);
      const popStatus = this.recoverStateList.pop();
      this.undoStateList.push(popStatus);
      this.handlePolygon(popStatus, 2);
    },
    // 清空恢复栈（增删操作时）
    clearRecoverList() {
      this.recoverStateList = [];
    },

    //恢复撤销操作  flag ==1是撤销操作，flag ==2  是恢复操作
    handlePolygon(action, flag) {
      this.polyEditorList.length &&
        this.polyEditorList.forEach((item) => {
          item.close();
        });
      this.titileStatus = false;
      this.btnTitle = "展示编辑点";
      this.polyEditorList = [];
      //把状态统一整合成数组
      const states = Array.isArray(action.state)
        ? action.state
        : [action.state];
      if ((action.type && flag === 1) || (!action.type && flag === 2)) {
        //删除操作
        states.map((state) => {
          this.map.remove(state);
          const index = this.drawingPolygons.findIndex(
            (layer) => layer["_amap_id"] === state["_amap_id"]
          );
          this.drawingPolygons.splice(index, 1);
          console.log("撤回", this.selectedOverlays);
          //这边要注意不能改条件，防止撤销时，两边多边形对象不相等出现bug，建议用唯一id判断
          const index_1 = this.selectedOverlays.findIndex(
            (layer) => layer["_amap_id"] === state["_amap_id"]
          );
          if (index_1 !== -1) {
            this.selectedOverlays.splice(index_1, 1);
          }
        });
      } else {
        //新增操作
        states.map((state) => {
          // 选中状态
          if (state.selected === true) {
            this.selectedOverlays.push(state);
          }

          this.map.add(state);
          this.drawingPolygons.push(state);
        });
      }

      //校验下范围
      this.$refs.formValidate.validateField("scopes");
    },

    //todo  开始
    //限停时间输入转化
    parkingTimeChange() {
      let v = +this.floatParams.parkingTime;
      if (!isNaN(v) && v > 0) {
        this.floatParams.parkingTime = parseInt(v, 10);
      }
    },

    // 编辑点标记
    editMarker() {
      this.isEditMarker = !this.isEditMarker;
      // let map = this.$refs.map.$$getInstance()
      if (this.isEditMarker) {
        // 开始编辑中心点
        if (this.MouseTool) {
          this.MouseTool.close();
          this.MouseTool = "";
        }
        this.map.on("click", this.setMarker);
      } else {
        // 隐藏编辑点中心点
        this.map.off("click", this.setMarker);
      }
      if (this.centerMarker) {
        this.centerMarker.setDraggable(this.isEditMarker);
        this.centerMarker.setCursor(this.isEditMarker ? "move" : "grab");
      }
    },

    // 点击设置点标记
    setMarker(e) {
      if (this.centerMarker) {
        return false;
      }
      this.stageMarkers = [];
      this.setEditMarker(e.lnglat.getLng(), e.lnglat.getLat());
    },
    // 绘画点标记
    setEditMarker(lng, lat, isDrag = true) {
      let that = this;
      // let map = this.$refs.map.$$getInstance()
      this.centerMarker && this.map.remove(this.centerMarker);
      this.centerMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        icon: centerIcon,
        offset: new AMap.Pixel(-17, -33),
        draggable: isDrag,
        cursor: isDrag ? "move" : "grab",
      });
      this.centerMarker.on("dragend", function (e) {
        that.computeInner(that);
      });
      this.map.add(this.centerMarker);
      that.computeInner(that);
    },
    // 计算点是否在面内
    computeInner(that) {
      let point = that.centerMarker.getPosition();
      let editPathList = this.drawingPolygons;

      if (!editPathList.length) {
        return false;
      }

      let path = editPathList[0].getPath();
      let isPointInRing = AMap.GeometryUtil.isPointInRing(point, path);
      !isPointInRing && this.$Message.error("中心点需移至围栏范围内");
      return isPointInRing;
    },
    //新增导航坐标
    handlerAddNavCoords() {
      this.floatParams.navCoords.push({
        lng: "",
        lat: "",
      });
    },
    handlerAddTimeRanges() {
      this.floatParams.timeRanges.push({
        effectiveTime: null,
      });
    },
    handleremoveItem(key, index) {
      this.floatParams[key].splice(index, 1);
    },

    //todo
    getSceneList() {
      //调用接口
      const params = {
        railType: 26,
      };
      getAllScene(params)
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data;
            // this.SceneList = data.data;
            // console.log('场景树',this.SceneList);
            //树数据转成级联形式
            this.getTree(data.data);
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },

    //换树的属性
    getTree(list) {
      let index = 0;
      const mapTree = (org) => {
        const haveChildren = Array.isArray(org.child) && org.child.length > 0;
        index++;
        return {
          value: org.sceneCode,
          label: org.sceneName,
          sortLabel: index,
          children: haveChildren
            ? org.child.map((child) => mapTree(child))
            : [],
        };
      };
      this.sceneList = list.map((org) => mapTree(org));
      console.log("场景树", this.sceneList);
    },
    //不可到达时段切换全天和部分
    handleLimitTimeonChange(v) {
      if (v === 0) {
        this.floatParams.limitTimeList = [
          {
            limitTime: null,
          },
        ];
      }
    },
    //添加不可到达时段
    handlerAddLimitTimeRanges() {
      if (!this.limitTimeVerifyFlag) {
        this.$Message.error("请输入正确的时间段");
        return false;
      }
      let isEmptyflag = true;
      this.floatParams.limitTimeList.map((item) => {
        if (item.limitTime[0] === "") {
          this.$Message.error("请输入正确的时间段");
          isEmptyflag = false;
        }
      });
      if (!isEmptyflag) return;
      this.floatParams.limitTimeList.push({
        limitTime: null,
      });
    },
    //删除不可到达时段
    handleRemoveItemTimeRanges(key, index) {
      this.floatParams.limitTimeList.splice(index, 1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/deep/ .fenceMap .ivu-modal {
  height: 100%;
  width: 100% !important;
  top: 0;
}
//加载的样式
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 隐藏高德图标
/deep/ .amap-logo {
  display: none !important;
}

/deep/ .amap-copyright {
  display: none !important;
}

/deep/ .fenceMap .ivu-modal-content {
  height: 100%;
  width: 100%;
  border-radius: 0;
}

/deep/ .fenceMap .ivu-modal-content .ivu-modal-body {
  height: 100%;
}

/deep/ .formDrawer {
  z-index: 999999 !important;
}

.map-query {
  position: absolute;
  display: flex;
  top: 10px;
  left: 200px;
  z-index: 99999;

  /deep/ .el-vue-search-box-container {
    height: 32px;
    width: 250px;
    margin-left: 20px;
  }
}

.polygon-hander {
  position: absolute;
  display: flex;
  top: 10px;
  right: 500px;
  z-index: 99999;
}

.fenceLegend {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 10px;
  left: 10px;
  z-index: 2;
  .legend-item {
    display: flex;
    cursor: pointer;
    margin-bottom: 5px;
    // 下面的数字就是围栏枚举值
    .rectangle-1 {
      border: 1px solid rgba(131, 199, 244, 1);
      background-color: rgba(131, 199, 244, 0.6);
    }
    .rectangle-28 {
      border: 1px solid #ff914d;
      background-color: rgba(255, 145, 77, 0.6);
    }
    .rectangle-2 {
      border: 1px solid rgba(205, 45, 58, 1);
      background-color: rgba(205, 45, 58, 0.6);
    }
    .rectangle-4 {
      border: 1px solid rgba(0, 182, 202, 1);
      background-color: rgba(0, 182, 202, 0.6);
    }
    .rectangle-5 {
      border: 1px solid rgba(219, 111, 233, 1);
      background-color: rgba(219, 111, 233, 0.6);
    }
    .rectangle-6 {
      border: 1px solid rgba(244, 217, 80, 1);
      background-color: rgba(244, 217, 80, 0.6);
    }
    .rectangle-7 {
      border: 1px solid rgba(255, 130, 146, 1);
      background-color: rgba(255, 130, 146, 0.6);
    }
    .rectangle-8 {
      border: 1px solid rgba(0, 106, 185, 1);
      background-color: rgba(0, 106, 185, 0.6);
    }
    .rectangle-12 {
      border: 1px solid rgba(150, 240, 230, 1);
      background-color: rgba(150, 240, 230, 0.6);
    }
    .rectangle-14 {
      border: 1px solid rgba(177, 117, 114, 1);
      background-color: rgba(177, 117, 114, 0.6);
    }
    .rectangle-15 {
      border: 1px solid rgba(214, 188, 242, 1);
      background-color: rgba(214, 188, 242, 0.6);
    }
    .rectangle-17 {
      border: 1px solid rgba(235, 92, 30, 1);
      background-color: rgba(235, 92, 30, 0.6);
    }
    .rectangle-18 {
      border: 1px solid rgba(177, 26, 65, 1);
      background-color: rgba(177, 26, 65, 0.6);
    }
    .rectangle-19 {
      border: 1px solid rgba(244, 189, 229, 1);
      background-color: rgba(244, 189, 229, 0.6);
    }
    .rectangle-20 {
      border: 1px solid rgba(0, 71, 255, 1);
      background-color: rgba(0, 71, 255, 0.6);
    }
    .rectangle-21 {
      border: 1px solid rgba(47, 0, 124, 1);
      background-color: rgba(47, 0, 124, 0.6);
    }
    .rectangle-22 {
      border: 1px solid rgba(255, 146, 118, 1);
      background-color: rgba(255, 146, 118, 0.6);
    }
    .rectangle-23 {
      border: 1px solid rgba(0, 194, 153, 1);
      background-color: rgba(0, 194, 153, 0.6);
    }
    .rectangle-24 {
      border: 1px solid rgba(97, 99, 157, 1);
      background-color: rgba(97, 99, 157, 0.6);
    }
    .rectangle-25 {
      border: 1px solid rgba(63, 140, 12, 1);
      background-color: rgba(63, 140, 12, 0.6);
    }
    .rectangle-26 {
      border: 1px solid rgba(156, 98, 158, 1);
      background-color: rgba(156, 98, 158, 0.6);
    }
    .rectangle-27 {
      border: 1px solid rgba(242, 189, 189, 1);
      background-color: rgba(242, 189, 189, 0.6);
    }
    .legend-gay {
      border: 1px solid #ccc;
      background-color: #ccc;
    }
    .com-legend {
      width: 20px;
      height: 12px;
      border-radius: 2px;
      margin-right: 5px;
      position: relative;
      top: 4px;
    }
    .font-gay {
      color: #ccc;
    }
  }
}

/deep/ .content-window-card {
  min-width: 100px;
  margin-top: 10px;
  .window-item {
    display: flex;
    justify-content: space-between;
    span:nth-child(1) {
      color: #999;
    }
  }
}

.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  background: #fff;
}

.delete_icon {
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  /deep/ .ivu-icon {
    margin-left: 8px;
    font-size: 20px;
    color: red;
    font-weight: 600;
  }
}
.titleTip {
  color: #999;
  font-size: 14px;
}

// todo

.navCoordList {
  margin-top: 24px;
  margin-left: -106px;

  .navCoordItem {
    position: relative;

    .ivu-btn {
      position: absolute;
      right: 8px;
      top: 7px;
    }
  }

  .navCoordItem:not(:last-child) .ivu-form-item {
    margin-bottom: 14px;
  }

  .navCoordItem .ivu-form-item + .ivu-form-item {
    margin-top: 14px;
  }

  .time:not(:last-child) .ivu-form-item {
    margin-bottom: 24px !important;
  }

  .time .ivu-form-item + .ivu-form-item {
    margin-top: 24px !important;
  }

  /deep/ .ivu-form-item-error-tip {
    margin-left: 106px;
  }
}

.ivu-alert.ivu-alert-with-icon {
  margin: 10px 0 0 0;
  width: 300px;
}
.limit-time-range {
  position: relative;
  .part-time-range {
    position: absolute;
    left: 110px;
    top: 3px;
  }
}
.flex {
  display: flex;
}
</style>
