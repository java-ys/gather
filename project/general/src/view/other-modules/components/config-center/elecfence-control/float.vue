<template>
  <div
    class="popView"
    v-show="popView"
  >
    <div class="ivu-modal-mask"></div>
    <div
      class="popView-wrap"
      :style="{'top': top + 'px'}"
    >
      <div
        class="popView-content"
        :style="{'width': width + 'px'}"
      >
        <div
          class="popView-title-wrap"
          :style="{'width': width + 'px','top': top + 'px'}"
        >
          <span class="popView-title">{{title}}</span>
          <div class="popView-icon">
            <Icon
              class="close-icon"
              type="md-close"
              @click="commit(0)"
            />
          </div>
        </div>
        <router-view></router-view>
        <div class="popView-body-wrap policemodalstyle">
          <Form
            ref="formValidate"
            :model="floatParams"
            :rules="ruleUser"
            :label-width="130"
          >
            <FormItem
              label="名称："
              prop="name"
            >
              <Input
                :maxlength="40"
                :readonly="invalidEditor"
                v-model="floatParams.name"
                placeholder="请输入名称"
                style="width: 300px"
              />
            </FormItem>
            <FormItem
              label="城市："
              prop="carrierArea"
            >
              <Cascader
                :data="cityList"
                :clearable="false"
                v-model="floatParams.carrierArea"
                @on-change="getCity"
                :disabled="invalidEditor"
                :filterable="true"
                style="width: 300px"
                placeholder="请选择城市"
              >
              </Cascader>
            </FormItem>
            <FormItem label="围栏类型：" prop="railType">
              <!-- <span>{{ railType }}</span> -->
              <Select
                v-model="floatParams.railType"
                style="width:300px"
                placeholder="请选择围栏类型"
                :filterable="true"
                @on-change="typeChange"
                :disabled="invalidEditor">
                <Option
                  v-for="item in railTypeMap"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Alert
                v-if="floatParams.railType === 2"
                show-icon
              >配置完成后请前往司机管理平台配置相关围栏的奖励规则</Alert>
              <Alert
                v-if="floatParams.railType === 3"
                show-icon
              >围栏内的乘客方可参加指定营销活动</Alert>
              <Alert
                v-if="floatParams.railType === 4"
                show-icon
              >在围栏范围内进行乘客上车点人工采点</Alert>
              <Alert
                v-if="floatParams.railType === 7"
                show-icon
              >在围栏范围内进行乘客下车点人工采点</Alert>
              <Alert
                v-if="floatParams.railType === 23"
                show-icon
              >车辆定位进入禁止接单围栏时，将会停止听单</Alert>
            </FormItem>
            <FormItem v-if="isLimitStop" label="限停时长：" prop="parkingTime" >
              <Input
                v-model="floatParams.parkingTime"
                style="width:300px"
                type="number"
                class="no-arrow"
                :readonly="invalidEditor"
                @on-keyup="parkingTimeChange"
              ></Input><span style="margin-left: 4px;">(分钟)</span>
            </FormItem>
            <FormItem
              key="serviceType"
              v-if="!isAllServiceType"
              label="产品线："
              prop="serviceType">
              <Select
                v-model="floatParams.serviceType"
                style="width:300px"
                :disabled="invalidEditor"
                @on-change="changeServiceType"
              >
                <Option
                  v-for="(item, index) in optList"
                  :value="item.value"
                  :key="index"
                >
                  {{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem
              label="车型等级："
              v-if="floatParams.railType !== 22 && !isAllServiceType"
              :rules="{}"
            >
              <Select
                v-model="floatParams.carLevelList"
                multiple
                :disabled="invalidEditor"
                style="width:300px"
                placeholder="为空默认该产品线下全部车型"

              >
                <Option
                  v-for="item in carLevelList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              label="车型等级："
              prop="useLevelTypeList"
              v-if="floatParams.railType === 22"
            >
              <Select
                v-model="floatParams.useLevelTypeList"
                multiple
                :disabled="invalidEditor"
                style="width:300px"
                placeholder="请选择车型等级"

              >
                <Option
                  v-for="item in carLevelList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              key="tripDistance"
              v-if="floatParams.railType === 6"
              label="派单最小里程："
              prop="tripDistance">
              <InputNumber
                :min="0.1"
                v-model="floatParams.tripDistance"
                :readonly="invalidEditor"
                placeholder="请输入"
                style="width:150px;vertical-align:top;"
              ></InputNumber>
              公里
            </FormItem>
            <FormItem
              v-if="floatParams.railType === 1"
              label="正向/逆向："
              prop="direction">
              <RadioGroup v-model="floatParams.direction" @on-change="targetChange(false)">
                <Radio v-for="item in directionList" :key="item.value" :label="item.value" :disabled="invalidEditor">
                  {{item.label}}
                </Radio>
              </RadioGroup>
              <Alert v-if="floatParams.direction === 1" style="width:300px;margin-bottom:0;" type="error">正向围栏范围内向乘客提供叫车服务</Alert>
              <Alert v-if="floatParams.direction === 2" style="width:300px;margin-bottom:0;" type="error">逆向围栏范围内禁止向乘客提供叫车服务，或向特定类型司机派单</Alert>
            </FormItem>
            <FormItem
              v-if="floatParams.railType === 1"
              label="出发地/目的地："
              prop="addressTypeList">
              <CheckboxGroup v-model="floatParams.addressTypeList" style="width:300px" @on-change="targetChange(true)">
                <Checkbox :label="1" :disabled="invalidEditor">出发地</Checkbox>
                <Checkbox :label="2" :disabled="invalidEditor">目的地</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem
              v-if="floatParams.railType === 1 && floatParams.direction === 2"
              label="过滤类型："
              prop="filterType">
              <RadioGroup v-model="floatParams.filterType" @on-change="changeFilterType">
                <Radio :label="1" :disabled="invalidEditor">乘客可见</Radio>
                <Radio :label="2" :disabled="invalidEditor">乘客不可见</Radio>
                <Radio :label="3" :disabled="invalidEditor">司机/车辆过滤</Radio>
                <!-- <Radio :label="4" :disabled="invalidEditor">司机可见</Radio>
                <Radio :label="5" :disabled="invalidEditor">司机不可见</Radio> -->
              </RadioGroup>
            </FormItem>
            <FormItem
              v-if="floatParams.railType === 1 && floatParams.filterType === 3"
              label="过滤标签："
              prop="filterTagList">
              <CheckboxGroup v-model="floatParams.filterTagList" style="width:300px">
                <Checkbox :label="1" :disabled="invalidEditor">无人证</Checkbox>
                <Checkbox :label="2" :disabled="invalidEditor">无车证</Checkbox>
                <Checkbox :label="3" :disabled="invalidEditor">未接种疫苗</Checkbox>
              </CheckboxGroup>
            </FormItem>
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
                      :label="`导航坐标经度${index+1}：`"
                      :prop="`navCoords.${index}.lng`"
                      :rules="{ required: true, validator: validatorLngLat, trigger: 'change' }"
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
                      :label="`导航坐标纬度${index+1}：`"
                      :prop="`navCoords.${index}.lat`"
                      :rules="{ required: true, validator: validatorLngLat, trigger: 'change' }"
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
                    class="navCoordItem"
                  >
                    <FormItem
                      :label="`时段${index+1}：`"
                      :prop="`timeRanges.${index}.effectiveTime`"
                      :rules="{ type: 'array', required: true, validator: validatorEffectiveTime, trigger: 'change' }"
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
            <FormItem label="范围：" prop="scopes">
              <div class="fonttitle">
                <span
                  class="mapchoice"
                  @click="fencechoice"
                  v-if="!invalidEditor"
                >地图选择</span>
                <span
                  class="mapchoice"
                  @click="signtPenScope"
                  v-if="invalidEditor"
                >查看围栏</span>
                <div class="latandlng">
                  <div class="upfonts">{{floatParams.scopes}}</div>
                  <Input
                    v-model="floatParams.scopes"
                    type="textarea"
                    style="width: 300px"
                    class="hidethisipt"
                  />
                </div>
              </div>
            </FormItem>
            <FormItem label="生效时间：" prop="effectiveTime">
              <DatePicker
                type="date"
                @on-change="geteffectiveTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择生效时间"
                style="width: 300px"
                :readonly="invalidEditor"
                :options="options"
                v-model="floatParams.effectiveTime"
              ></DatePicker>
            </FormItem>
            <FormItem
              label="失效时间："
              prop="failureTime">
              <DatePicker
                type="date"
                @on-change="getfailureTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择失效时间"
                style="width: 300px"
                :readonly="invalidEditor"
                v-model="floatParams.failureTime"
              ></DatePicker>
            </FormItem>
            <FormItem
              label="备注："
              prop="remark">
              <Input
                autosize
                :maxlength="200"
                :readonly="invalidEditor"
                type="textarea"
                placeholder="请填写备注"
                v-model="floatParams.remark"
                style="width: 300px;"
              />
            </FormItem>
            <FormItem
              v-if="floatParams.railType === 1 && floatParams.direction === 2"
              label="原因："
              prop="reasonType"
              class="ivu-form-item-required"
            >
              <RadioGroup v-model="floatParams.reasonType">
                <Radio :label="0" :disabled="invalidEditor">
                  无
                </Radio>
                <Radio :label="1" :disabled="invalidEditor">
                  有
                </Radio>
              </RadioGroup>
              <Input
                autosize
                :disabled="floatParams.reasonType == 0"
                :maxlength="9"
                :readonly="invalidEditor"
                type="textarea"
                placeholder="请输入原因"
                v-model="floatParams.reason"
                style="width: 300px;"
                @on-change="normalReason"
              />
            </FormItem>
            <FormItem
              label="提示语录入：" v-if="floatParams.railType === 22">
              <Input
                autosize
                :maxlength="200"
                :readonly="invalidEditor"
                type="textarea"
                placeholder="请填写提示语"
                v-model="floatParams.voiceDoc"
                style="width: 300px;"
              />
            </FormItem>
          </Form>
          <div
            class="popView-footer-wrap"
            v-if="!invalidEditor">
            <Button
              size="large"
              type="text"
              @click="commit(0)"
              style="margin-right: 8px;"
            >取消</Button>
            <Button
              size="large"
              type="primary"
              v-lazy-click="{fn:commit,params:{params:1}}"
            >确定</Button>
          </div>
        </div>
      </div>
    </div>
    <!-- 地图围栏的展示弹框 -->
    <div
      class="shadowFloat"
      :style="{'opacity':mapmodal? '1': '0','z-index': mapmodal? '1010': '-1'}"
      ref="mapmodaledraw">
      <div
        class="cancenlbtn"
        style="width: 100%;"
      >
        <span class="popView-title">{{title}}</span>
        <div class="popView-icon">
          <Icon
            class="close-icon"
            type="md-close"
            @click="cancel(false)"
          />
        </div>
      </div>
      <div class="elecfencechoice">
        <div
          class="someOptBtn"
          v-if="sightmapScope"
        >
          <div class="mapOpt">
            <div class="form-list">
              <!-- 行政区划 TODO -->
              <Form
                inline="inline"
                :label-width="15"
              >
                <!-- <FormItem
                  prop="city"

                >
                <Cascader
                  v-model="provinceCityCode"
                  :data="cityList"
                  placeholder="请选择城市"
                  trigger="hover"
                  filterable
                  style="width: 150px; display: inline-block"
                  @on-change="handleCityChange"
                ></Cascader>
                </FormItem>
                <FormItem
                  prop="areaCode"
                >
                  <Select
                    v-model="areaCode"
                    style="width: 120px"
                    placeholder="请选择区县"
                    @on-change="handleAreaChange"
                  >
                    <Option
                      v-for="item in areaList"
                      :key="item.orgCode"
                      :value="item.orgCode"
                    >
                      {{item.orgName}}
                    </Option>
                  </Select>
                </FormItem> -->
                <!-- <FormItem>
                    <Button type="info" @click="setPolygon">设置围栏</Button>
                </FormItem>
                <FormItem> -->
                  <mapSearch :search-option="searchOption" ref="serachbox" :on-search-result="onSearchResult" />
                 <!-- <el-amap-search-box ref="serachbox" class="search-box-qqb" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
                </FormItem>
                </Form>
            </div>
          </div>
          <!-- <div class="action-groups">
            
          </div> -->
          <div class="deleteaclear">
            <Button class="right15" @click="preState" :disabled="!undoStateList.length">
              撤销
            </Button>
            <Button class="right15" @click="recoverState" :disabled="!recoverStateList.length">
              恢复
            </Button>
            <Button
              v-if="floatParams.railType===15"
              type="primary"
              class="right15"
              @click="editMarker"
            >{{isEditMarker?'隐藏编辑点中心点':'开始编辑中心点'}}</Button>
            <Button
              type="primary"
              @click="eitorPolygon"
            >{{btnTitle}}</Button>
            <Button
              type="primary"
              @click="clearChoiceMap"
              class="btndislance"
            >清除围栏</Button>
          </div>
        </div>
        <el-amap
          ref="map"
          vid="amapDemo"
          :events="mapData.events"
          :center="mapData.center"
          :zoom="mapData.zoom"
          class="amap-demo"
        ></el-amap>
      </div>

      <div
        class="popView-footer-wrap"
        v-if="!invalidEditor"
      >
      <div class="tips-footer">
        点击地图上任意一点即可开始绘制围栏
      </div>
      <div class="fr">
        <Button
          size="large"
          type="text"
          @click="cancel(false)"
          style="margin-right: 8px;"
        >取消</Button>
        <Button
          size="large"
          type="primary"
          @click="cancel(true)"
        >确定</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import '@/styles/cyk-style.css'
import {savePen,getCityList,getAreaInfoByCityCode} from '_o/api/configData.js'
import {railTypeMap, directionList, targetAreaList, carTypeOptions} from './index.js'
import {timeFormat} from '@/libs/util'
import centerIcon from '_o/assets/images/icons/center.png'
import {RAIL_TYPE__UPLOAD_HEALTH_CODE, railMap} from "_g/config/status-map"
import mapSearch from "./map-search.vue"
import {mapState} from "vuex";
// 只能绘制一个围栏的类型
const onePathList = [6, 15]
export default {
  props: {
    popView: Boolean,
    width: Number,
    top: {
      default: 100,
      type: Number
    },
    title: {
      default: '新建弹窗',
      type: String
    },
    type: String,
    uuid: {
      default: '',
      type: String
    },
    cityList: {
      default: () => {
        return []
      },
      type: Array
    },
    polygonPath: {
      default: () => {
        return []
      },
      type: Array
    },
    optList: {
      default: () => {
        return []
      },
      type: Array
    },
    invalidEditor: {
      default: false,
      type: Boolean
    },
    floatParams: {}
  },
  data() {
    let self = this
    const carrierArea = (rule, value, callback) => {
      if (this.floatParams.carrierArea.length > 0) callback()
      else callback(new Error('城市区域不能为空'))
    }
    const serviceType = (rule, value, callback) => {
      if (this.floatParams.serviceType) callback()
      else callback(new Error('产品线不能为空'))
    }
    const railType = (rule, value, callback) => {
      if (this.floatParams.railType || this.floatParams.railType === 0) {
        callback()
      } else callback(new Error('围栏类型不能为空'))
    }
    const oneDecimal = (rule, value, callback) => {
      let point = String(value).indexOf('.') + 1
      let count = String(value).length - point
      if (point > 0 && count > 1) {
        callback(new Error('最多保留一位小数'))
      }
      callback()
    }
    const effectiveTime = (rule, value, callback) => {
      if (this.floatParams.effectiveTime) {
        let getTime = new Date(
          this.floatParams.effectiveTime
        ).getTime()
        if (this.floatParams.failureTime) {
          if (
            getTime >
            new Date(this.floatParams.failureTime).getTime()
          ) {
            callback(new Error('生效日期不能大于失效日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback(new Error('生效时间不能为空'))
      }
    }
    const failureTime = (rule, value, callback) => {
      if (this.floatParams.failureTime) {
        let getTime = new Date(this.floatParams.failureTime).getTime()
        if (this.floatParams.effectiveTime) {
          if (
            getTime <
            new Date(this.floatParams.effectiveTime).getTime()
          ) {
            callback(new Error('失效日期不能小于生效日期'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback(new Error('失效时间不能为空'))
      }
    }
    const getpathData = (rule, value, callback) => {
      if (this.floatParams.getpathData.length) callback()
      else callback(new Error('围栏位置范围不能为空'))
    }
    const validatorLngLat = (rule, value, callback) => {
      const reg = /^\-?\d{2,3}(\.\d{3,6})$/
      const index = parseInt(rule.field.split(".")[1], 10)
      const navCoords = this.floatParams.navCoords
      let isSame = false
      if (navCoords.length > 1) {
        navCoords.forEach((item, idx) => {
          if ((JSON.stringify(navCoords[index]) === JSON.stringify(item)) && (index !== idx)) {
            isSame = true
          }
        })
      }
      if (!reg.test(value)) {
        callback("必须输入2~3位数字和3~6位小数")
      } else if (isSame) {
        callback("生效时段重复")
      } else {
        callback()
      }
    }
    const validatorEffectiveTime = (rule, value, callback) => {
      const index = parseInt(rule.field.split(".")[1], 10)
      const timeRanges = this.floatParams.timeRanges
      let isSame = false
      if (timeRanges.length > 1) {
        timeRanges.forEach((item, idx) => {
          if ((JSON.stringify(timeRanges[index]) === JSON.stringify(item)) && (index !== idx)) {
            isSame = true
          }
        })
      }
      value && value.forEach(item => {
        if (item === "") {
          callback(new Error("请选择生效时段"))
        } else if (value[0] === value[1]) {
          callback(new Error("起止时间不能相同"))
        } else if (isSame) {
          callback("生效时段重复")
        } else {
          callback()
        }
      }) || callback(new Error("请选择生效时间段"))
    }
    // const useLevelTypeList = (rule, value, callback) => {
    //   if (this.floatParams.useLevelTypeList.length) { callback(); }
    //   else { callback(new Error("车型等级不能为空")); }
    // };
    const reasonTypeValidator = (rule, value, callback) => {
      const { reasonType, reason } = this.floatParams
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
    return {
      directionList,
      targetAreaList,
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      params: {
        name: '',
        carrierArea: [],
        serviceType: '',
        railType: '',
        scopes: '',
        getpathData: [],
        effectiveTime: '',
        failureTime: '',
        remark: '',
        voiceDoc: '',
        useLevelTypeList: [],
        status: 1,
        tripDistance: null,
        direction: null,
        directionCopy: null,
        addressTypeList: [],
        filterTagList: [],
        targetAreaCopy: [],
        filterType: null,
        reasonType: 0,
        reason: '',
        carLevelList:[]
      },
      validatorLngLat: validatorLngLat,
      validatorEffectiveTime: validatorEffectiveTime,
      ruleUser: {
        name: [
          {
            required: true,
            trigger: 'change',
            message: '电子围栏名称不能为空'
          }
        ],
        serviceType: [
          {
            required: true,
            trigger: 'change',
            validator: serviceType
          }
        ],
        railType: [
          {
            required: true,
            trigger: 'change',
            validator: railType
          }
        ],
        parkingTime: [
          {
            required: true,
            message: '限停时间不能为空'
          }
        ],
        carrierArea: [
          {
            required: true,
            trigger: 'change',
            validator: carrierArea
          }
        ],
        scopes: [
          {
            required: true,
            trigger: 'change',
            validator: getpathData
          }
        ],
        effectiveTime: [
          {
            required: true,
            trigger: 'change',
            validator: effectiveTime
          }
        ],
        failureTime: [
          {
            required: true,
            trigger: 'change',
            validator: failureTime
          }
        ],
        remark: [
          {
            required: false,
            trigger: 'change',
            message: '备注不能为空'
          }
        ],
        tripDistance: [
          {required: true, type: 'number', message: '请输入派单最小里程', trigger: 'blur'},
          {trigger: 'blur', validator: oneDecimal}
        ],
        direction: [
          {required: true, type: 'number', message: '请选择正向/逆向', trigger: 'blur'}
        ],
        addressTypeList: [
          {required: true, type: 'array', message: '请选择出发地/目的地', trigger: 'blur'}
        ],
        filterTagList: [
          {required: true, type: 'array', message: '请选择过滤标签', trigger: 'blur'}
        ],
        filterType: [
          {required: true, type: 'number', message: '请选择过滤类型', trigger: 'blur'}
        ],
        useLevelTypeList: [
          {
            required: true,
            type: 'array',
            message: '请选择车型等级',
            trigger: "change"
          }
        ],
        reasonType: [
          {
            // required: true,
            validator: reasonTypeValidator
          }
        ]
      },
      mapmodal: false,
      mapData: {
        // zoom: 4, // 地图显示级别//全国范围
        center: [116.286278, 34.22237],
        zoom: 11, // 地图显示级别//全国范围
        markers: [],
        markerRefs: [],
        events: {
          init(o) {
            self.maps = self.$refs.map.$$getInstance()
          }
        }
      },
      maps: null,
      penType: true,
      MouseTool: null,
      overlays: [],
      titileStatus: true,
      btnTitle: '展示编辑点',
      polygonEditor: [],
      rectangleEditor: null,
      circleEditor: null,
      cityCode: '',
      sightmapScope: true,
      maptitle: '围栏范围选择',
      polygon: null,
      railTypeMap,
      isEditMarker: false,
      centerMarker: null,
      carLevelList:[],
      scope:[],//储存矢量图信息
      selectedOverlays:[],//选中的围栏
      selectedOverlaysEdit:[],//选中的围栏点击对象
      provinceCityCode:[],
      areaList:[], // 区县
      areaCode:"", // 区县编码
      street:"",
      stagePolygons:[], // 暂存未设定的行政区划围栏
      stageMarkers:[],
      undoStateList:[], // 撤销状态维护
      recoverStateList:[], // 恢复状态维护
      streetList:[],
      selectedTip:0
    }
  },
  components:{
    mapSearch
  },
  computed: {
    ...mapState({
      bizTypeList: (state) => state.common.bizTypeList,
    }),
    // 是否为全部产品线
    isAllServiceType() {
      let arr = [4, 6, 7, 8, 12, 15, 17, 18, 19, 20, RAIL_TYPE__UPLOAD_HEALTH_CODE]
      return arr.includes(this.floatParams.railType)
    },
    // 是限停围栏, 必填限停时间
    isLimitStop({floatParams}) {
      return floatParams.railType - 25 === 0
    },
    searchOption(){
        const {areaCode,provinceCityCode} = this;
        const code = areaCode?areaCode:provinceCityCode[1]?provinceCityCode[1]:provinceCityCode[0];
        return {
          city :code|| "南京",
          citylimit:false
        }
    }
  },
  watch: {
    mapmodal(newVal){
      if(this.$refs.serachbox){
        this.$refs.serachbox.keyword="";
      }
      if(!newVal){
        let maps = this.$refs.map.$$getInstance();
        if(maps){
          // 清空撤销恢复栈
          this.recoverStateList = [];
          this.undoStateList = [];
          // 需要清空MouseTool注册事件以及地图点击事件
          // this.MouseTool.off('draw',this.MouseToolDraw)
          // maps.off("click",this.MouseAction);
          // this.MouseTool = null;
        }
      }
    },
    popView: function (newVal) {
      this.$refs.formValidate.resetFields();
      if (this.type === 'add') {
        this.params = {
          carrierArea: []
        }
      } else {
        this.setCopy()
        this.floatParams.getpathDataEdit = [...this.floatParams.getpathData]
      }
      if (newVal) {
        let centerPoint = this.floatParams.centerPoint
        if (centerPoint && typeof (centerPoint) === 'string') {
          this.floatParams.centerPoint = JSON.parse(centerPoint)
        }
      }
      this.$forceUpdate()
    },
    stageMarkers(markers,oldv){
      console.log(markers,oldv);
        let maps = this.$refs.map.$$getInstance();
        maps.remove(oldv)
        maps.add(markers)
    },
  },
  mounted() {
    let that = this
    that.calcModalWidth();
    window.onresize = function () {
      that.calcModalWidth()
    }
  },
  methods: {    
    // 撤销处理
    handleBack(action){
      let maps = this.$refs.map.$$getInstance();
      const states = Array.isArray(action.state)?action.state:[action.state];
      if(!this.titileStatus){
        this.titileStatus = true;
        this.btnTitle = '展示编辑点'
        this.polygonEditor.length && this.polygonEditor.forEach(item => {
          item.close()
        });
        this.polygonEditor = [];
      }
      if(action.type){
          states.map(state=>{
            maps.remove(state);
            const path = state.getPath().join(";");
            const index = this.overlays.findIndex(layer=>layer===state);
            const index_1 = this.floatParams.getpathDataEdit.findIndex(layer=>layer===path)
            this.overlays.splice(index,1);
            this.floatParams.getpathDataEdit.splice(index_1,1)
          })
      }else{
          states.map(state=>{
            const path = state.getPath().join(";");
            // 选中状态
            if(state.selected === true){
              console.log(state,"state");
              state.setOptions({
                fillColor: '#DC143C'
              })
              this.selectedOverlays.push(state);
            }
            maps.add(state);
            this.overlays.push(state);
            this.floatParams.getpathDataEdit.push(path)
          })
      };      
    },
    // 恢复处理
    handleRecover(action){
      console.log("handleRecover",action);
      let maps = this.$refs.map.$$getInstance()
      const states = Array.isArray(action.state)?action.state:[action.state]
      if(!action.type){
        states.map(state=>{
          maps.remove(state);
          const path = state.getPath().join(";");
          const index = this.overlays.findIndex(layer=>layer===state);
          const index_1 = this.floatParams.getpathDataEdit.findIndex(layer=>layer===path)
          this.overlays.splice(index,1);
          this.floatParams.getpathDataEdit.splice(index_1,1)
        })
      }else{
        console.log("add",states);
        states.map(state=>{
          const path = state.getPath().join(";");
          maps.add(state);
          this.overlays.push(state);
          this.floatParams.getpathDataEdit.push(path)
        })
      }
    },
    /**
     * 可撤销操作入栈
     * action:{type:0|1,state:array}
     * type:1添加，0:删除
     */
    preAction(state){
      this.undoStateList.push(state);
      console.log(state,"pushPreAction");
    },
    // 撤销操作
    preState(){
      const popStatus = this.undoStateList.pop();
      this.recoverStateList.push(popStatus);
      console.log(popStatus,"popStatus");
      this.handleBack(popStatus)
    },
    // 恢复操作
    recoverState(){
      console.log("recoverStateList",this.recoverStateList);
      const popStatus = this.recoverStateList.pop();
      this.undoStateList.push(popStatus);
      this.handleRecover(popStatus);
    },
    // 清空恢复栈（增删操作时）
    clearRecoverList(){
      this.recoverStateList = [];
    },
    onSearchResult(pois){
      let lngSum = 0;
      let latSum = 0;
      pois.forEach(pos=>{
          let {lng,lat} = pos;
          lngSum +=lng;
          latSum +=lat;
      })
      let center = {
          lng:lngSum/pois.length,
          lat:latSum/pois.length
      }
      this.mapData.center = [center.lng,center.lat];
      let searchMarker = new AMap.Marker({
          position: [center.lng,center.lat],
      });
      this.stageMarkers = [searchMarker];
    },
    handleCityChange(v){
      this.provinceCityCode = v;
      this.areaCode = "";
      this.stagePolygons = [];
      this.searchPolygon();
      getAreaInfoByCityCode({cityCode:this.provinceCityCode[1]}).then(res=>{
        this.areaList =res.data.data
      })
    },
    handleAreaChange(){
      this.searchPolygon()
    },
    // 格式化围栏
    formatePolygon(polygins){
        const newArr = []
        polygins.map(ply=>{
          let i = [];
          for (let index = 0; index < ply.length; index++) {
            const element = ply[index];
            i.push(`${element.lng},${element.lat}`)
          }
          newArr.push(i.join(";"))
        })
        return newArr 
    },
    // 查询行政围栏
    searchPolygon(){
     let map = this.$refs.map.$$getInstance();
      AMap.plugin('AMap.DistrictSearch', ()=> {
        const {provinceCityCode,areaCode} = this;
        let districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: 'district',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 3,
          extensions:"all"
        })
        const code = areaCode?areaCode:provinceCityCode[1]?provinceCityCode[1]:provinceCityCode[0];
        // 搜索所有省/直辖市信息
        districtSearch.search(code, (status, result)=> {
          let bounds = result.districtList[0].boundaries;
          console.log(result,"result");
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              let ply = new AMap.Polygon({
                map: map,
                strokeWeight: 1,
                strokeColor: '#0091ea',
                strokeStyle:'dashed',
                fillColor: '#80d8ff',
                fillOpacity: 0.2,
                path: bounds[i],
                extData:{
                  isBounds:true,
                }
              });
              this.stagePolygons= [];
              this.stagePolygons.push(ply);
              // 格式化围栏
              console.log("ply",ply);
            }
            const plys = this.formatePolygon(bounds);
            console.log(plys,"plys");
            this.floatParams.getpathDataEdit.push(...plys)
            map.setFitView();
          }
        })
      })
    },
    setPolygon(){
      this.stagePolygons.map(ply=>{
        this.overlays.push(ply)
      })
    },
    // 在“正向/逆向”字段选中“正向”的情况下，在勾选“出发地/目的地”字段的“目的地”选项时，此时界面出现确认弹窗
    targetChange(isTarget) {
      let isConfirm = false
      if (this.floatParams.targetAreaCopy === undefined) this.floatParams.targetAreaCopy = []
      if (this.floatParams.directionCopy === undefined) this.floatParams.directionCopy = null
      if (isTarget) {
        //出发地目的地变更
        if (this.floatParams.direction === 1 &&
          (!this.floatParams.targetAreaCopy || this.floatParams.targetAreaCopy.indexOf(2) === -1) &&
          this.floatParams.addressTypeList &&
          this.floatParams.addressTypeList.indexOf(2) > -1) {
          isConfirm = true
        }
      } else {
        // 正向逆向
        if (this.floatParams.direction === 1 &&
          this.floatParams.addressTypeList &&
          this.floatParams.addressTypeList.indexOf(2) > -1) {
          isConfirm = true
        }
        if (this.floatParams.direction === 1) {
          this.floatParams.filterType = null
          this.floatParams.filterTagList && this.floatParams.filterTagList.splice(0, 3)
        }
      }
      // 如果正向 & 目的地
      if (isConfirm) {
        this.$Modal.confirm({
          title: '请确认',
          width: 520,
          content: '设置正向目的地围栏后，该城市下订单仅当目的地在正向目的地围栏范围内时向乘客提供叫车服务，目的地在围栏范围以外的区域则禁止下单。确定创建？',
          onCancel: () => {
            if (isTarget) {
              this.floatParams.addressTypeList.splice(0, 5, ...this.floatParams.targetAreaCopy)
            } else {
              this.floatParams.direction = this.floatParams.directionCopy
            }
            this.setCopy()
          },
          onOk: () => {
            this.setCopy()
          }
        });
      } else {
        this.setCopy()
      }
    },
    setCopy() {
      this.floatParams.directionCopy = this.floatParams.direction
      this.floatParams.targetAreaCopy = this.floatParams.addressTypeList
    },
    changeFilterType(value) {
      if (value !== 3) {
        this.floatParams.filterTagList && this.floatParams.filterTagList.splice(0, 3)
      }
    },
    // 切围栏类型，切换到全部产品线的，默认全部产品线，切换到选择产品线的，如果是全部产品线，清空选项
    typeChange(value) {
      if (this.isAllServiceType) {
        this.floatParams.serviceType = 5
      } else if (this.floatParams.serviceType == '5') this.floatParams.serviceType = null
      this.floatParams.centerPoint = null
      this.$forceUpdate()
    },
    calcModalWidth() {
      let mapdrapEle = this.$refs.mapmodaledraw
      if (mapdrapEle == void 0) {
        return false
      }
      if (document.body.clientWidth <= 1280) {
        mapdrapEle.style.width = 590 + 'px'
        mapdrapEle.style.height = 600 + 'px'
      } else if (
        document.body.clientWidth > 1281 &&
        document.body.clientWidth <= 1440
      ) {
        mapdrapEle.style.width = 800 + 'px'
        mapdrapEle.style.height = 600 + 'px'
      } else if (document.body.clientWidth > 1440) {
        mapdrapEle.style.width = 1000 + 'px'
        mapdrapEle.style.height = 600 + 'px'
        if (document.body.clientHeight < 640) {
          mapdrapEle.style.height = 600 + 'px'
        }
      }
    },
    signtPenScope() {
      let that = this
      let maps = this.$refs.map.$$getInstance()
      let polygons = maps.getAllOverlays('polygon')
      polygons.length && maps.remove(polygons)
      this.overlays.length &&
      this.overlays.forEach(item => {
        maps.remove(item)
      })
      let splitArray = that.floatParams.getpathData
      let objArray = []
      let newArray = []
      splitArray.forEach(item => {
        newArray.push(item.split(';'))
      })
      newArray.forEach(item => {
        let arraybox = []
        item.forEach(iitem => {
          arraybox.push(iitem.split(','))
        })
        objArray.push(arraybox)
      })
      if (!this.overlays.length) {
        objArray.forEach(item => {
          this.overlays.push(
            new AMap.Polygon({
              path: item,
              fillColor: '#00b0ff',
              strokeColor: '#019be0',
              strokeWeight: 2,
              strokeOpacity: 1,
              fillOpacity: 0.4,
              zIndex: 50
            })
          )
        })
      }
      this.overlays.length &&
      this.overlays.forEach((item, index) => {
        item.setPath(objArray[index])
      })
      this.overlays.length &&
      this.overlays.forEach(item => {
        item.setMap(maps)
      })
      // 缩放地图到合适的视野级别
      this.overlays.length && maps.setFitView([this.overlays[0]])
      this.sightmapScope = false
      this.maptitle = '围栏范围查看'
      this.isEditMarker === true && this.editMarker()
      this.mapmodal = true
      let centerP = this.floatParams.centerPoint
      this.centerMarker = null
      if (this.floatParams.railType === 15 && centerP?.lng) {
        this.setEditMarker(centerP.lng, centerP.lat, false)
      }
      this.MouseTool && this.MouseTool.close();
      maps.on('click',this.MouseAction)
    },
    MouseAction(e){
      const that = this;
      this.stageMarkers = []
        let lnglat = e.lnglat;
        if(that.overlays.length){
            let result = true;
            that.overlays.forEach(item=>{
                let isPointInRing = AMap.GeometryUtil.isPointInRing(lnglat,item.getPath());
                if(isPointInRing){
                    result = false;
                }
            })
            if(!result){
                that.MouseTool && that.MouseTool.close(false) // 关闭，并清除覆盖物
                that.MouseTool = null;
                setTimeout(()=>{
                    that.initMouseTool();
                },100)
            }
        }
    },
    getCity(data, value) {
      const [provinceCode, cityCode] = data
      // 选择的城市code发生变化, 重置电子围栏
      if (cityCode !== this.floatParams.cityCode) {
        this.resetChoiceMap()
      }
      let maps = this.$refs.map.$$getInstance()
      this.cityCode = data.length > 1 ? data[1] : data[0]
      this.floatParams.city = value[1].province + value[1].city
      maps.setCity(this.cityCode)
    },
    // 初始化MouseTool
    initMouseTool(){
      let that = this;
      let maps = this.$refs.map.$$getInstance();
      that.MouseTool = new AMap.MouseTool(maps)
      that.MouseTool.polygon({
        fillColor: '#00b0ff',
        strokeColor: '#019be0',
      })
      that.MouseTool.on('draw',this.MouseToolDraw)
    },
    //todo
    fencechoice() {
      // if(!this.floatParams.railType){
      //     this.$Message.error('请先选择围栏类型')
      //     return false
      // }
      let that = this
      let maps = this.$refs.map.$$getInstance()
      that.floatParams.getpathDataEdit = [...that.floatParams.getpathData]
      // 清除原来的围栏
      maps.clearMap()
      let polygons = maps.getAllOverlays('polygon')
      polygons.length && maps.remove(polygons)
      this.overlays.length &&
      this.overlays.forEach(item => {
        maps.remove(item)
      })

      this.MouseTool && this.MouseTool.close(true) // 关闭，并清除覆盖物
      this.MouseTool = null

      this.MouseTool = new AMap.MouseTool(maps)
      maps.on("click",this.MouseAction);
      this.MouseTool.polygon({
        fillColor: '#00b0ff',
        strokeColor: '#019be0',
        zIndex: 50
      })
      this.MouseTool.on('draw',this.MouseToolDraw)
      if (that.floatParams.getpathDataEdit.length) {
        let newArray = []
        let splitArray = that.floatParams.getpathDataEdit
        let objArray = []
        splitArray.forEach(item => {
          newArray.push(item.split(';'))
        })
        newArray.forEach(item => {
          let arraybox = []
          item.forEach(iitem => {
            arraybox.push(iitem.split(','))
          })
          objArray.push(arraybox)
        })
        if (!this.overlays.length) {
          objArray.forEach(item => {
            this.overlays.push(
              new AMap.Polygon({
                path: item,
                fillColor: '#00b0ff',
                strokeColor: '#019be0',
                strokeWeight: 2,
                strokeOpacity: 1,
                fillOpacity: 0.4,
                zIndex: 50
              })
            )
          })
        }
      let overlayLen = this.overlays.length
        overlayLen &&
        this.overlays.forEach((item, index) => {
          item.setPath(objArray[index]);
          item.setMap(maps);
          item.selectScopeIndex = index;
          item.on('click',function(e){
              console.log(`我点的是第${index+1}块区域`);
              if(item.selected){
                  item.selected = false;
                  item.setOptions({
                      fillColor:'#00b0ff'
                  })
                  let index = that.selectedOverlays.indexOf(item);
                  that.selectedOverlays.splice(index,1)
              }else {
                  item.selected = true;
                  item.setOptions({
                      fillColor: '#DC143C'
                  })
                  that.selectedOverlays.push(item);
              }
            })
        })
        overlayLen && maps.setFitView([this.overlays[0]])
      }
      this.sightmapScope = true
      this.maptitle = '围栏范围选择'
      this.isEditMarker === true && this.editMarker()
      this.mapmodal = true

      let centerP = this.floatParams.centerPoint
      this.centerMarker = null
      if (this.floatParams.railType === 15) {
        if (centerP?.lng) {
          this.setEditMarker(centerP.lng, centerP.lat, false)
        }
        if (this.overlays.length) {
          this.overlays[0].on('click', this.overlayClick);
        }
      }
    },
    MouseToolDraw(e){
      const that = this;
        this.stageMarkers=[]
        let newarray = []
        that.overlays.push(e.obj);
        const action = {
          type:1,
          state:e.obj
        }
        // 添加可撤销栈
        this.preAction(action)
        let item = e.obj;
        e.obj && e.obj.getPath().forEach(item => {
          let latlng = `${item.lng},${item.lat}`
          newarray.push(latlng);
        })
        console.log("MouseToolDraw",newarray);
        that.floatParams.getpathDataEdit.push(newarray.join(';'))
        //
        that.scope.push(newarray);//获取路径经纬度
        let selectScopeIndex = that.scope.indexOf(newarray);
        item.on('click',function(e){
          item.selectScopeIndex = selectScopeIndex;//把scope对应的索引放在item上，在删除的时候使用
          if(item.selected){
              item.selected = false;
              item.setOptions({
                fillColor:'#00b0ff'
              })
              let index = that.selectedOverlays.indexOf(item);
              that.selectedOverlays.splice(index,1)
          }else {
              item.selected = true;
              item.setOptions({
                  fillColor:'#DC143C'
              })
              that.selectedOverlays.push(item);
          }
        })
    },
    eitorPolygon() {
      let that = this
      if (!this.overlays.length) {
        this.$Message.warning('无可编辑围栏')
        return
      }
      let maps = this.$refs.map.$$getInstance()
      if (this.titileStatus) {
        console.log(1);
        let polygonEditor = this.polygonEditor || []
        if (!this.polygonEditor.length) {
          this.overlays &&
          this.overlays.forEach(item => {
            polygonEditor.push(new AMap.PolyEditor(maps, item))
          })
        }
        polygonEditor.length &&
        polygonEditor.forEach(item => {
          item.open()
        })
        this.polygonEditor = polygonEditor
        polygonEditor.forEach((item, index) => {
          item.on('end', function (e) {
            let newarray = []
            that.overlays[index] = e.target
            e.target &&
            e.target.getPath().forEach(items => {
              let latlng = `${items.lng},${items.lat}`
              newarray.push(latlng)
            })
            that.floatParams.getpathDataEdit[index] = newarray.join(';')
          })
        })
      } else {
        this.polygonEditor.length &&
        this.polygonEditor.forEach(item => {
          item.close()
        })
        this.polygonEditor = []
      }
      this.titileStatus = !this.titileStatus
      this.btnTitle = this.titileStatus ? '展示编辑点' : '隐藏编辑点'
    },
    clearChoiceMap() {
      if (!this.overlays.length) {
        this.$Message.warning('无可清除围栏')
        return
      }
      let maps = this.$refs.map.$$getInstance()
      // -----------清除围栏开始
      let msg = this.selectedOverlays.length?'是否清除围栏':'存在多个区域围栏,是否全部清除';
      this.$Modal.confirm({
        title: msg,
        onOk: () => {
          this.polygonEditor.length &&
          this.polygonEditor.forEach(item => {
            item.close()
          })
          this.titileStatus = false
          this.btnTitle = '展示编辑点'
          if (!this.overlays.length) {
            this.$Message.warning('无可清除围栏')
            return
          }
          if(this.selectedOverlays.length){
            let removeIndexList = [];
            this.selectedOverlays.forEach((item,index_1) => {
              maps.remove(item);
              this.floatParams.getpathDataEdit.splice(index_1,1);
              let index = this.overlays.indexOf(item);
              this.overlays.splice(index,1);
              let selectScopeIndex = item.selectScopeIndex;
              if(selectScopeIndex>=0){
                  removeIndexList.push(selectScopeIndex)
                  //this.scope.splice(selectScopeIndex,1);
              }
            })
            //先排序
            removeIndexList.sort((a,b)=>{
                return b-a
            })
            //从后往前删
            removeIndexList.forEach(item=>{
                this.scope.splice(item,1);
            });
            // 添加可撤销状态
            const action = {
              type:0,
              state:this.selectedOverlays || []
            }
            this.preAction(action);
            this.clearRecoverList()
            console.log(this.selectedOverlays,"this.selectedOverlays");

            this.selectedOverlays = [];
            this.polygonEditor = [];
          }else if(this.overlays.length){
            this.overlays.forEach(item => {
              maps.remove(item)
            });
            const action = {
              type:0,
              state:this.overlays
            }
            this.preAction(action);
            this.clearRecoverList()
            this.overlays = [];
            this.selectedOverlays = [];
            this.polygonEditor = []
            this.scope = [];
            this.floatParams.getpathDataEdit = []
          }
          this.titileStatus = true
        }
      });

    },
    resetChoiceMap() {
      this.titileStatus = false
      this.btnTitle = '展示编辑点'
      if (this.polygonEditor.length) {
        this.polygonEditor.forEach(item => {
          item.close()
        })
      }
      let maps = this.$refs.map.$$getInstance()
      let polygons = maps.getAllOverlays('polygon')
      polygons.length && maps.remove(polygons)
      if (this.overlays.length) {
        this.overlays.forEach(item => {
          maps.remove(item)
        })
      }
      this.overlays = []
      this.floatParams.getpathData = []
      this.floatParams.getpathDataEdit = []
      this.polygonEditor = []
      this.floatParams.scopes = ''
      this.titileStatus = true
    },
    cancel(isSubmit) {
       //如果有编辑状态，先结束获取最新的围栏
       if (!this.titileStatus) {
        this.polygonEditor.length &&
        this.polygonEditor.forEach(item => {
          item.close()
        })
        this.polygonEditor = []
        this.titileStatus = true
      }
       // 交通枢纽围栏只能绘制一个区域
      if (isSubmit) {
        let editPathList = this.getPathData(this.floatParams.getpathDataEdit)
        if (editPathList.length > 1 && !this.onePathSuccess()) {
          return false
        }
        // 调度类型围栏，校验点标记
        if (this.floatParams.railType === 15) {
          if (!this.centerMarker) {
            this.$Message.error('调度围栏需选择中心点')
            return false
          } else {
            if (!editPathList.length) {
              this.$Message.error('请绘画调度围栏')
              return false
            }
            if (!this.computeInner(this)) {
              return false
            }
          }
          let centerLnglat = this.centerMarker.getPosition()
          this.floatParams.centerPoint = {
            lng: centerLnglat.lng,
            lat: centerLnglat.lat
          }
        }
      }
      this.mapmodal = false
      this.centerMarker = null

      if (!this.sightmapScope) {
        return
      }
      if (isSubmit) {
         //判断是否有更新的围栏
        this.floatParams.getpathData = this.getPathData(this.floatParams.getpathDataEdit)
        this.floatParams.scopes = this.floatParams.getpathData.join('|')
      }
      // if (!this.titileStatus) {
      //   this.polygonEditor.length &&
      //   this.polygonEditor.forEach(item => {
      //     item.close()
      //   })
      //   this.polygonEditor = []
      //   this.titileStatus = true
      // }
      let maps = this.$refs.map.$$getInstance()
      let polygons = maps.getAllOverlays('polygon')
      polygons.length && maps.remove(polygons)
      this.overlays.length &&
      this.overlays.forEach(item => {
        maps.remove(item)
      })
      // this.MouseTool && this.MouseTool.close(true)//关闭，并清除覆盖物
      // this.MouseTool = null
      this.overlays = []
      this.polygonEditor = []
      this.isChoiceType = ''
      this.btnTitle = '展示编辑点'
      this.titileStatus = true
    },
    getPathData(data) {
      let res = []
      data.forEach(item => {
        if (item) {
          let arr = item.split(';')
          let isTrue = true
          arr.forEach(latlng => {
            let latlngArr = latlng.split(',')
            if (!latlngArr[0] || !latlngArr[1]) {
              isTrue = false
            }
          })
          isTrue && res.push(item)
        }
      })
      return res
    },
    geteffectiveTime(val) {
    },
    getfailureTime(val) {
    },
    commit(temp) {
      console.log("commit",temp);
      if (typeof temp === 'object' && temp.params) {
        temp = temp.params
      }
      if (temp) {
        this.$refs.formValidate.validate().then(res => {
          if (res) {
            // 只能画一个围栏校验
            if (this.floatParams.getpathDataEdit.length > 1 && !this.onePathSuccess()) {
              return false
            }
            if (this.floatParams.railType === 15) {
              if (!this.floatParams.centerPoint || !this.floatParams.centerPoint?.lat) {
                this.$Message.error('调度围栏需选择中心点')
                return false
              }
            } else {
              this.floatParams.centerPoint = null
            }
            let data = JSON.parse(JSON.stringify(this.floatParams))
            let begintime = new Date(
              this.floatParams.effectiveTime
            ).getTime()
            let endtime = new Date(
              this.floatParams.failureTime
            ).getTime()
            let currentTime = new Date().getTime()
            let newJSON = {}
            newJSON.serviceType = data.serviceType
            newJSON.name = data.name
            newJSON.scope = this.getPathData(data.getpathData).join('&')
            newJSON.railType = data.railType
            newJSON.provinceCode = data.carrierArea[0]
            newJSON.cityCode = data.carrierArea[1]
            newJSON.effectiveTime = timeFormat(begintime)
            newJSON.failureTime = timeFormat(endtime)
            newJSON.remark = data.remark
            if (newJSON.railType === 15) newJSON.centerPoint = data.centerPoint
            if (newJSON.railType === 6) newJSON.tripDistance = data.tripDistance
            if (newJSON.railType === 1) newJSON.direction = data.direction
            if (newJSON.railType === 1) newJSON.addressTypeList = data.addressTypeList
            if (newJSON.railType === 1 && newJSON.direction === 2) newJSON.filterType = data.filterType
            if (newJSON.railType === 1 && newJSON.filterType === 3) newJSON.filterTagList = data.filterTagList
            if(this.isLimitStop) { // 限停围栏
              newJSON.parkingTime = data.parkingTime
            }
            if (currentTime < begintime) {
              newJSON.status = 2
            } else if (
              currentTime > begintime &&
              currentTime < endtime
            ) {
              newJSON.status = 1
            } else if (currentTime > endtime) {
              newJSON.status = 3
            } else {
              newJSON.status = 1
            }
            if (this.type === 'edit') {
              newJSON.uuid = this.uuid
            }
            // 围栏类型为T3上车点围栏，T3下车点围栏，或交通枢纽围栏, serviceType固定为5
            if (this.isAllServiceType) {
              newJSON.serviceType = '5'
            }
            if (newJSON.railType === 20) {
              const extAttr = {}
              extAttr.centerPoints = data.navCoords
              extAttr.effectTimes = data.timeRanges.map(item => ({
                startTime: item.effectiveTime[0],
                endTime: item.effectiveTime[1]
              }))
              newJSON.extAttr = JSON.stringify(extAttr)
            }
            if (newJSON.railType === 22) {
              newJSON.extAttr = JSON.stringify({voiceDoc: data.voiceDoc, useLevelTypeList: data.useLevelTypeList})
            } else if(data.carLevelList && data.carLevelList.length){
              newJSON.carLevelList = data.carLevelList
            }
            if (newJSON.railType === 1 && newJSON.direction === 2) {
              newJSON.reason = data.reasonType === 0 ? '' : data.reason
            }
            if (data.copy) {
              delete newJSON.uuid
            }
            savePen(newJSON).then(res => {
              this.$emit('on-confirm', true)
              this.$Message.success(res.data.msg)
            }).catch(err => {
            })
          }
        })
      } else {
        this.$emit('on-confirm', false)
      }
    },
    onePathSuccess() {
      let type = this.floatParams.railType
      if (onePathList.includes(type)) {
        this.$Message.error(`${railMap[type]}只能绘制一个区域`)
        return false
      }
      return true
    },
    // 编辑点标记
    editMarker() {
      this.isEditMarker = !this.isEditMarker
      let map = this.$refs.map.$$getInstance()
      if (this.isEditMarker) {
        // 开始编辑中心点
        this.MouseTool.close();
        map.on('click', this.setMarker);
      } else {
        // 隐藏编辑点中心点
        map.off('click', this.setMarker);
        this.MouseTool.polygon({
          fillColor: '#00b0ff',
          strokeColor: '#019be0'
        })
      }
      if (this.centerMarker) {
        this.centerMarker.setDraggable(this.isEditMarker)
        this.centerMarker.setCursor(this.isEditMarker ? 'move' : 'grab')
      }

    },
    overlayClick(e) {
      if (this.isEditMarker) {
        this.setMarker(e)
      }
    },
    // 点击设置点标记
    setMarker(e) {
      // if(this.centerMarker){
      //   return false
      // }
      this.stageMarkers=[]
      this.setEditMarker(e.lnglat.getLng(), e.lnglat.getLat())

    },
    // 绘画点标记
    setEditMarker(lng, lat, isDrag = true) {
      let that = this
      let map = this.$refs.map.$$getInstance()
      this.centerMarker && map.remove(this.centerMarker)
      this.centerMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        icon: centerIcon,
        offset: new AMap.Pixel(-17, -33),
        draggable: isDrag,
        cursor: isDrag ? 'move' : 'grab',
      });
      this.centerMarker.on("dragend", function (e) {
        that.computeInner(that)
      })
      map.add(this.centerMarker)
      that.computeInner(that)
    },
    // 计算点是否在面内
    computeInner(that) {
      let point = that.centerMarker.getPosition();
      let editPathList = this.getPathData(this.floatParams.getpathDataEdit)
      if (!editPathList.length) {
        return false
      }
      let path = editPathList[0].split(';').map(v => v.split(','))
      let isPointInRing = AMap.GeometryUtil.isPointInRing(point, path);
      !isPointInRing && this.$Message.error('中心点需移至围栏范围内')
      return isPointInRing
    },
    handlerAddNavCoords() {
      this.floatParams.navCoords.push({
        lng: "",
        lat: ""
      })
    },
    handlerAddTimeRanges() {
      this.floatParams.timeRanges.push({
        effectiveTime: null
      })
    },
    handleremoveItem(key, index) {
      this.floatParams[key].splice(index, 1)
    },
    // 原因输入框内最多支持输入9个字符，支持输入中文、英文、数字
    normalReason() {
      const reg = /[^\u4e00-\u9fa5|\d|a-z|A-Z]/g
      const text = (this.floatParams.reason || '').replace(reg, '').replace('|', '')
      this.$nextTick(() => {
        this.floatParams.reason = text.slice(0, 9)
      })
    },
    parkingTimeChange() {
      let v = +this.floatParams.parkingTime
      if(!isNaN(v) && v > 0) {
        this.floatParams.parkingTime = parseInt(v, 10)
      }
    },
    changeServiceType(val) {
      this.floatParams.useLevelTypeList=[]
      this.floatParams.carLevelList = []
      let carTypes = this.bizTypeList.find(it => it.value === val) || {}
      this.carLevelList = carTypes.children || []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

/deep/ .no-arrow input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.popView-content{
    max-height: 75%;
}
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.mobile-wrap:last-child {
  margin-bottom: 0;
}

.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  text-align: center;
}

.real-number {
  width: 200px;
}

.area-number {
  width: 100px;
}

.fonttitle {
  font-size: 14px;
  // margin-bottom: 10px;
}

.fonttitle span:first-child {
  display: inline-block;
  width: 100px;
  text-align: left;
}

.mapchoice {
  color: royalblue;
  text-decoration: underline;
  cursor: pointer;
}

.iptwraper {
  display: inline-block;
}

.elecfencechoice {
  position: relative;
  width: 100%;
  height: 500px;

  .someOptBtn {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    padding: 15px;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .action-groups,
    .deleteaclear {
      opacity: 0.8;
      // margin-bottom: 24px;
    }
  }
}

.btndislance {
  margin: 0 0 0 15px;
}

.latandlng {
  margin-top: 10px;
  max-width: 300px;
  position: relative;

  .upfonts {
    max-height: 60px;
    overflow-y: scroll;
  }

  .hidethisipt {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -1;
  }
}

.shadowFloat {
  position: fixed;
  top: 10%;
  left: 25%;
  padding: 20px;
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  background: #fff;

  .cancenlbtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}

.navCoordList {
  margin-top: 24px;
  margin-left: -130px;

  .navCoordItem {
    position: relative;

    .ivu-btn {
      position: absolute;
      right: 130px;
      top: 7px;
    }
  }

  .navCoordItem:not(:last-child) .ivu-form-item {
    margin-bottom: 24px;
  }

  .navCoordItem .ivu-form-item + .ivu-form-item {
    margin-top: 24px;
  }

  /deep/ .ivu-form-item-error-tip {
    margin-left: 130px;
  }
}

.ivu-alert.ivu-alert-with-icon {
  margin: 10px 0 0 0;
  width: 300px;
}
.popView-footer-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-vue-search-box-container{
  width: 200px;
}

// .policemodalstyle{
//     .ivu-form-item{
//         margin-bottom: 10px;
//     }
// }
// .popView-body-wrap{
//     &::-webkit-scrollbar {
//       background-color: transparent;
//     }
// }
</style>
