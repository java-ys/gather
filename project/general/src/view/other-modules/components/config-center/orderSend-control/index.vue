<!--
 * @Description:
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2021-12-07 10:52:47
 -->
<!--系统策略 1-->
<template>
  <div class="strategy-control">
    <Tabs
      :value="tabObj.tabNamePone"
      @on-click="tabschange"
    >
      <TabPane
        label="订单优先级策略"
        name="tacticTab"
      >
        <!-- <search-table
          v-if="tabObj.tabNamePone === 'tacticTab'"
          ref="tacticTable"
          tabNum="4"
          hasAuth="strategy_control-priorityAdd"
          @addnew="addNew('4')"
          @axiosDetail="axiosDetail"
          @axiosDelete="axiosDelete"
        ></search-table> -->
        <thirdStrategy v-if="tabObj.tabNamePone === 'tacticTab'" />
      </TabPane>
      <!-- <TabPane
        label="热区定向派单优先级策略"
        name="hotArea"
      >
        <search-table
          v-if="tabObj.tabNamePone === 'hotArea'"
          ref="hotAreaTable"
          tabNum="5"
          hasAuth="strategy_control-hotAreaAdd"
          @addnew="addNew('5')"
          @axiosDetail="axiosDetail"
          @axiosDelete="axiosDelete"
        ></search-table>
      </TabPane> -->
      <!-- <TabPane
        label="订单价值优先级派单策略"
        name="orderPriority"
      >
        <search-table
          v-if="tabObj.tabNamePone === 'orderPriority'"
          ref="orderPriorityTable"
          tabNum="6"
          hasAuth="strategy_control-orderPriorityAdd"
          @addnew="addNew('6')"
          @axiosDetail="axiosDetail"
          @axiosDelete="axiosDelete"
        ></search-table>
      </TabPane> -->
      <!-- <TabPane
        label="快享&出租车同时派单策略"
        name="user-same"
      >
        <userSame v-if="tabObj.tabNamePone === 'user-same'" />
      </TabPane> -->
      <TabPane
        label="用户群绝对优先级策略"
        name="user-preference"
      >
        <user-preference v-if="tabObj.tabNamePone === 'user-preference'" />
      </TabPane>
      <!-- <TabPane
        label="充电站定向优先级策略"
        name="powerbank-priority"
      >
        <PowerbankPriority v-if="tabObj.tabNamePone === 'powerbank-priority'"></PowerbankPriority>
      </TabPane> -->
      <TabPane
        label="派单距离管理"
        name="dispatch-distance"
      >
        <dispatch-distance v-if="tabObj.tabNamePone === 'dispatch-distance'"></dispatch-distance>
      </TabPane>
      <!-- <TabPane
        label="三方运力派单优先级策略"
        name="dispatch-priority"
      >
        <dispatch-priority v-if="tabObj.tabNamePone === 'dispatch-priority'"></dispatch-priority>
      </TabPane> -->
      <!-- <TabPane
        label="同时呼叫派单策略"
        name="call-together"
      >
        <call-together v-if="tabObj.tabNamePone === 'call-together'"></call-together>
      </TabPane> -->
      <TabPane
        label="限号限行管理"
        name="traffic-restriction"
      >
        <traffic-restriction v-if="tabObj.tabNamePone === 'traffic-restriction'"></traffic-restriction>
      </TabPane>

      <!-- 非号牌类限制策略 -->
      <TabPane
        label="非号牌类限制策略"
        name="non-license-strategy"
      >
        <non-license-strategy v-if="tabObj.tabNamePone === 'non-license-strategy'"></non-license-strategy>
      </TabPane>

      <!-- 司机分群派单优先级 -->
      <TabPane
        label="车辆优先级策略"
        name="driver-group-dispatch"
      >
        <DriverGroupDispatch v-if="tabObj.tabNamePone === 'driver-group-dispatch'"></DriverGroupDispatch>
      </TabPane>

      <!-- 业务线优先级策略 -->
      <TabPane
        label="业务线优先级策略"
        name="business-strategy"
      >
        <BusinessStrategy v-if="tabObj.tabNamePone === 'business-strategy'"></BusinessStrategy>
      </TabPane>
    </Tabs>

    <!-- 新增取消策略-->
    <modal
      v-model="cancelModal"
      :title="cancelTitle"
      :width="750"
      :mask-closable="false"
      @on-cancel="handleReset('cancelForm')"
    >
      <Form
        ref="cancelForm"
        :model="cancelModelData"
        :rules="cancelRules"
        :label-width="145"
      >
        <div class="twoinline">
          <FormItem
            label="产品线："
            prop="businessType"
          >
            <Select
              v-model="cancelModelData.businessType"
              :disabled="isCancelEdit"
              style="width:200px"
              placeholder="请选择产品线"
            >
              <Option :value="4">
                快享
              </Option>
              <Option :value="2">
                专享
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="车型等级："
            prop="carLevel"
          >
            <Select
              v-model="cancelModelData.carLevel"
              :disabled="!cancelModelData.businessType || isCancelEdit"
              style="width:200px"
              placeholder="请选择车型等级"
            >
            </Select>
          </FormItem>
        </div>
        <div class="twoinline">
          <FormItem
            label="订单类型："
            prop="typeTime"
          >
            <Select
              v-model="cancelModelData.typeTime"
              :disabled="isCancelEdit"
              style="width:200px"
              placeholder="请选择订单类型"
            >
              <Option :value="1">
                实时
              </Option>
              <Option :value="2">
                预约
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="适用城市："
            :prop="!isCancelEdit?'city':''"
          >
            <Cascader
              v-if="!isCancelEdit"
              v-model="cancelModelData.city"
              :disabled="isCancelEdit"
              :data="provinceCityList"
              trigger="hover"
              filterable
              style="width:200px;display: inline-block;"
            ></Cascader>
            <span v-else>
              {{ cancelModelData.cityName }}
            </span>
          </FormItem>
        </div>
        <div v-if="cancelModelData.typeTime===1||cancelModelData.typeTime===2">
          <div class="twoinline">
            <FormItem
              label="策略名称："
              prop="strategyName"
            >
              <Input
                v-model="cancelModelData.strategyName"
                placeholder="请输入策略名称"
                style="width: 200px"
              />
            </FormItem>
            <FormItem
              label="取消费(元)："
              prop="money"
            >
              <InputNumber
                v-model="cancelModelData.money"
                :min="0.1"
                :max="100"
                placeholder="请输入取消费"
                style="width:200px;"
                @on-blur="judgeMoney"
              ></InputNumber>
            </FormItem>
          </div>
          <FormItem
            label="生效时间："
            prop="effectiveTime"
          >
            <DatePicker
              v-if="cancelModal"
              v-model="cancelModelData.effectiveTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :options="dateOptions"
              placeholder="请选择日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <div v-if="cancelModelData.typeTime===1">
            <FormItem
              label="接单后免费取消时间："
              prop="freeCancleMinute"
            >
              <InputNumber
                v-model="cancelModelData.freeCancleMinute"
                :min="0"
                :max="60"
                placeholder="请输入"
                style="width:160px;"
              ></InputNumber>
              分钟
            </FormItem>
            <FormItem
              label="接单后超时取消时间："
              prop="outCancleMinute"
            >
              <InputNumber
                v-model="cancelModelData.outCancleMinute"
                :min="1"
                :max="60"
                placeholder="请输入"
                style="width:160px;"
              ></InputNumber>
              分钟
            </FormItem>
            <FormItem
              v-if="cancelModelData.businessType===4"
              label="连续取消次数限制："
            >
              <Checkbox v-model="cancelModelData.continuedCancelLimit">
                启用
              </Checkbox>
            </FormItem>
            <div
              v-if="cancelModelData.continuedCancelLimit"
              class="form-in-line"
            >
              <FormItem
                label="在"
                prop="continuedCancelMinute"
                class="left36"
                style="white-space:nowrap;"
              >
                <InputNumber
                  v-model="cancelModelData.continuedCancelMinute"
                  :min="1"
                  :max="60"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              分钟内连续主动取消
              <FormItem prop="continuedCancelNum">
                <InputNumber
                  v-model="cancelModelData.continuedCancelNum"
                  :min="1"
                  :max="100"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              次任意订单，禁止下单
              <FormItem prop="continuedCancelNoMinute">
                <InputNumber
                  v-model="cancelModelData.continuedCancelNoMinute"
                  :min="1"
                  :max="1440"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              分钟
            </div>
          </div>
          <div v-else>
            <FormItem
              label="无责取消时间："
              prop="noResponseCancelMinute"
            >
              <InputNumber
                v-model="cancelModelData.noResponseCancelMinute"
                :min="0"
                placeholder="请输入"
                style="width:160px;"
              ></InputNumber>
              分钟
            </FormItem>
            <FormItem
              label="司机可迟到时间："
              prop="driverLaterMinute"
            >
              <InputNumber
                v-model="cancelModelData.driverLaterMinute"
                :min="1"
                :max="60"
                placeholder="请输入"
                style="width:160px;"
              ></InputNumber>
              分钟
            </FormItem>
          </div>
          <div v-if="cancelModelData.businessType===4">
            <FormItem label="每日取消次数限制：">
              <Checkbox v-model="cancelModelData.dailyCancelLimit">
                启用
              </Checkbox>
            </FormItem>
            <div
              v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===1"
              class="form-in-line"
            >
              <FormItem
                label="每自然日在接单后"
                prop="dailyCancelMinute"
                class="left120"
                style="white-space:nowrap;min-width:235px;"
              >
                <InputNumber
                  v-model="cancelModelData.dailyCancelMinute"
                  :min="1"
                  :max="60"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              分钟内主动取消
              <FormItem prop="dailyCancelNum">
                <InputNumber
                  v-model="cancelModelData.dailyCancelNum"
                  :min="1"
                  :max="100"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              次实时单，
              <FormItem prop="dailyCancelNoMinute">
                <InputNumber
                  v-model="cancelModelData.dailyCancelNoMinute"
                  :min="1"
                  :max="1440"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              分钟内禁止下单
            </div>
            <div
              v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===2"
              class="form-in-line"
            >
              <FormItem
                label="每自然日内主动取消"
                prop="dailyCancelNum"
                class="left130"
              >
                <InputNumber
                  v-model="cancelModelData.dailyCancelNum"
                  :min="1"
                  :max="100"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              次预约单，
              <FormItem prop="dailyCancelNoMinute">
                <InputNumber
                  v-model="cancelModelData.dailyCancelNoMinute"
                  :min="1"
                  :max="1440"
                  placeholder="请输入"
                  style="width:100px;"
                ></InputNumber>
              </FormItem>
              分钟内禁止下单
            </div>
          </div>
          <h2
            v-if="cancelModelData.businessType==2"
            style="color:red;font-size: 16px"
          >
            {{ cancelModelData.typeTime==1?
              '使用快享-经济型取消策略中的连续取消次数限制及每日取消次数限制':
              '使用快享-经济型取消策略中的每日取消次数限制' }}
          </h2>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="cancelModal=false;handleReset('cancelForm')"
        >
          取消
        </Button>
        <Button
          v-lazy-click="{fn:cancelSubmit,params:{params:'cancelForm'}}"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>
    <!-- 司机取消订单新建 -->
    <modal
      v-model="deviateModal"
      :title="deviateTitle"
      :width="600"
      :mask-closable="false"
      @on-cancel="handleReset('deviateForm')"
    >
      <Form
        ref="deviateForm"
        :model="deviateModelData"
        :rules="deviateRules"
        :label-width="140"
      >
        <FormItem
          label="适用城市："
          prop="cityCode"
        >
          <input
            v-model="deviateModelData.cityCode"
            type="hidden"
          >
          <Cascader
            v-if="!isDeviateEdit"
            :data="provinceCityList"
            trigger="hover"
            filterable
            style="width:200px;display: inline-block;"
            @on-change="handleSelcetCity"
          ></Cascader>
          <span v-if="isDeviateEdit">
            {{ deviateModelData.cityName }}
          </span>
        </FormItem>
        <FormItem
          label="产品线："
          :prop="isDeviateEdit? 'businessType' : 'businessTypeList'"
        >
          <Select
            v-if="!isDeviateEdit"
            v-model="deviateModelData.businessTypeList"
            style="width:200px"
            multiple
            placeholder="请选择"
          >
            <Option
              v-for="item in businessTypeList2"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
          <span>{{ serviceTypeMapForDriverCancel[deviateModelData.businessType] }}</span>
        </FormItem>
        <FormItem
          label="策略名称："
          prop="ruleName"
        >
          <Input
            v-model="deviateModelData.ruleName"
            placeholder="请输入策略名称"
            style="width: 200px"
          />
        </FormItem>
        <FormItem
          label="生效时间："
          prop="effectiveTimes"
          :rules="cancelStg.timeValidating"
        >
          <DatePicker
            v-if="deviateModal"
            :value="deviateModelData.effectiveTimes"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :options="dateOptions"
            placeholder="请选择日期"
            style="width: 200px"
            @on-change="handleTimepick"
          ></DatePicker>
          <input
            v-model="deviateModelData.effectiveTimes"
            type="hidden"
          >
        </FormItem>
        <FormItem
          label="每日取消上限："
          prop="dailyCancelLimit"
          :rules="deviateModelData.dailyCancelLimitOn ? cancelStg.limitTime :null"
        >
          <Checkbox
            v-model="deviateModelData.dailyCancelLimitOn"
            :true-value="1"
            :false-value="0"
          >
            <span>启用</span>
            <InputNumber
              v-model="deviateModelData.dailyCancelLimit"
              :disabled="deviateModelData.dailyCancelLimitOn? false : true"
              placeholder="请输入"
              style="width:80px;"
            ></InputNumber>次
          </Checkbox>
        </FormItem>
        <FormItem
          label="总计取消上限："
          prop="totalCancelLimit"
          :rules="deviateModelData.totalCancelLimitType ? cancelStg.totalLimit :null"
        >
          <RadioGroup v-model="deviateModelData.totalCancelLimitType">
            <Radio :label="1">
              按自然周
            </Radio>
            <Radio :label="2">
              按自然月
            </Radio>
            <InputNumber
              v-model="deviateModelData.totalCancelLimit"
              placeholder="请输入"
              :disabled="deviateModelData.totalCancelLimitType? false : true"
              style="width:80px;"
            ></InputNumber>次
          </RadioGroup>
        </FormItem>
        <FormItem
          label="适用司机："
          prop="tags"
        >
          <CheckboxGroup v-model="deviateModelData.tags">
            <Checkbox label="A">
              A标签司机
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <Button
          type="default"
          @click="handleAddTimeRange"
        >
          添加时段策略
        </Button>
        <Card
          v-for="(item, index) in deviateModelData.rules"
          :key="index"
        >
          <FormItem
            :label="`时段${index+1}`"
            :rules="cancelStg.time"
            :prop="`rules.${index}.endTime`"
          >
            <TimePicker
              v-if="deviateModal"
              :value="[item.startTime,item.endTime]"
              type="timerange"
              format="HH:mm:ss"
              placeholder="请选择日期"
              style="width: 200px"
              @on-change="(val) => handleSelectTime(val,index)"
            ></TimePicker>
            <input
              v-model="deviateModelData.rules[index].endTime"
              type="hidden"
            >
            <Icon
              v-if="index > 0"
              type="md-close-circle"
              style="fontSize:20px;color:red;paddingLeft:10px;cursor:pointer"
              @click="handleRemoveTime(index)"
            />
          </FormItem>

          <FormItem
            label="有效等待范围：车辆距上车点"
            :label-width="250"
            :rules="cancelStg.digitsNumber"
            :prop="`rules.${index}.distance`"
          >
            <input
              v-model="deviateModelData.rules[index].distance"
              type="hidden"
            >
            <InputNumber
              v-model="deviateModelData.rules[index].distance"
              placeholder="请输入"
              style="width:80px;"
            ></InputNumber> 米以内
          </FormItem>
          <FormItem
            label="等待乘客上车时长：至少"
            :label-width="250"
            :rules="cancelStg.digitsNumber"
            :prop="`rules.${index}.waitTime`"
          >
            <InputNumber
              v-model="deviateModelData.rules[index].waitTime"
              placeholder="请输入"
              style="width:80px;"
            ></InputNumber> 分钟
          </FormItem>
          <FormItem
            label="拨打乘客电话未接通次数：至少"
            :label-width="250"
            :rules="cancelStg.digitsNumber"
            :prop="`rules.${index}.unconnectedCount`"
          >
            <InputNumber
              v-model="deviateModelData.rules[index].unconnectedCount"
              placeholder="请输入"
              style="width:80px;"
            ></InputNumber> 次
          </FormItem>
          <FormItem
            label="电话未接通判断标准：持续呼叫"
            :label-width="250"
            :rules="cancelStg.digitsNumber"
            :prop="`rules.${index}.unconnectedSecond`"
          >
            <InputNumber
              v-model="deviateModelData.rules[index].unconnectedSecond"
              placeholder="请输入"
              style="width:80px;"
            ></InputNumber> 秒未接通
          </FormItem>
        </Card>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="deviateModal=false;handleReset('deviateForm')"
        >
          取消
        </Button>
        <Button
          v-lazy-click="deviateSubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>
    <!-- 时间段及高峰策略 -->
    <modal
      v-model="timeModal"
      :title="timeTitle"
      :width="600"
      :mask-closable="false"
      @on-cancel="handleReset('timeForm')"
    >
      <Form
        ref="timeForm"
        :model="timeModelData"
        :rules="timeRules"
        :label-width="140"
      >
        <FormItem
          label="策略名称："
          prop="strategyName"
        >
          <Input
            v-model="timeModelData.strategyName"
            placeholder="请输入策略名称"
            style="width: 200px"
          />
        </FormItem>
        <FormItem
          v-if="!isTimeEdit"
          label="适用城市："
          prop="city"
        >
          <Cascader
            v-model="timeModelData.city"
            :disabled="isTimeEdit"
            :data="provinceCityList"
            trigger="hover"
            filterable
            style="width:200px;display: inline-block;"
          ></Cascader>
        </FormItem>
        <FormItem
          v-else
          label="适用城市："
        >
          <span>{{ timeModelData.cityName }}</span>
        </FormItem>
        <FormItem
          label="生效时间："
          prop="effectiveTime"
        >
          <DatePicker
            v-if="timeModal"
            v-model="timeModelData.effectiveTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :options="dateOptions"
            placeholder="请选择日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <div class="inline-form-item">
          <FormItem
            label="夜间服务时段："
            prop="nightServiceBeginTime"
          >
            <TimePicker
              v-model="timeModelData.nightServiceBeginTime"
              type="time"
              placeholder="开始时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem
            prop="nightServiceEndTime"
            class="no-left-margin"
          >
            <TimePicker
              v-model="timeModelData.nightServiceEndTime"
              type="time"
              placeholder="结束时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem
            label="早高峰时段："
            prop="morningPeakBeginTime"
          >
            <TimePicker
              v-model="timeModelData.morningPeakBeginTime"
              type="time"
              placeholder="开始时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem
            prop="morningPeakEndTime"
            class="no-left-margin"
          >
            <TimePicker
              v-model="timeModelData.morningPeakEndTime"
              type="time"
              placeholder="结束时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem
            label="晚高峰时段："
            prop="eveningPeakBeginTime"
          >
            <TimePicker
              v-model="timeModelData.eveningPeakBeginTime"
              type="time"
              placeholder="开始时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem
            prop="eveningPeakEndTime"
            class="no-left-margin"
          >
            <TimePicker
              v-model="timeModelData.eveningPeakEndTime"
              type="time"
              placeholder="结束时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="其他高峰时段：">
            <TimePicker
              v-model="timeModelData.otherPeakBeginTime"
              type="time"
              placeholder="开始时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem class="no-left-margin">
            <TimePicker
              v-model="timeModelData.otherPeakEndTime"
              type="time"
              placeholder="结束时间"
              style="width: 110px"
              format="HH:mm:ss"
            ></TimePicker>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="timeModal=false;handleReset('timeForm')"
        >
          取消
        </Button>
        <Button
          v-lazy-click="timeSubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>
    <!-- 产品线及订单来源优先级策略-新建模态框 -->
    <modal
      v-model="tacticModal"
      :title="tacticTitle"
      :width="600"
      :mask-closable="false"
      @on-cancel="handleReset('tacticForm')"
    >
      <Form
        ref="tacticForm"
        :model="tacticModelData"
        :rules="tacticRules"
        :label-width="230"
      >
        <FormItem
          v-if="!isTacticEdit"
          label="订单渠道："
          prop="channel"
        >
          <Select
            v-model="tacticModelData.channel"
            :disabled="isTacticEdit"
            style="width:140px"
            placeholder="请选择"
          >
            <Option
              v-for="item in channelDropList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          v-else
          label="订单渠道："
        >
          <span>{{ tacticModelData.channelName }}</span>
        </FormItem>
        <FormItem
          v-if="!isTacticEdit"
          label="适用城市："
          prop="city"
        >
          <Cascader
            v-model="tacticModelData.city"
            :data="provinceCityList"
            :disabled="isTacticEdit"
            trigger="hover"
            filterable
            style="width:140px;display: inline-block;"
          ></Cascader>
        </FormItem>
        <FormItem
          v-else
          label="适用城市："
        >
          <span>{{ tacticModelData.cityName }}</span>
        </FormItem>
        <FormItem
          label="系数："
          prop="ratio"
        >
          <Input
            v-model="tacticModelData.ratio"
            placeholder="请输入"
            style="width: 140px"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="tacticCancel"
        >
          取消
        </Button>
        <Button
          v-lazy-click="tacticSubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 热区定向派单优先级策略-新建编辑模态框 -->
    <modal
      v-model="hotAreaModal"
      :title="hotAreaTitle"
      :width="600"
      :mask-closable="false"
      @on-cancel="hotAreaCancel"
    >
      <Form
        ref="hotAreaForm"
        :model="hotAreaModelData"
      >
        <div class="line1">
          <!-- 城市表单 -->
          <FormItem
            v-if="!isHotAreaEdit"
            label="适用城市："
            prop="city"
            :rules="hotAreaRules.city"
          >
            <Cascader
              v-model="hotAreaModelData.city"
              :disabled="isHotAreaEdit"
              :data="provinceCityList"
              trigger="hover"
              filterable
              style="width:140px;display: inline-block;"
            ></Cascader>
          </FormItem>
          <!-- 编辑状态 城市只读-->
          <FormItem
            v-else
            label="适用城市："
            :rules="[]"
          >
            <span>{{ hotAreaModelData.cityName }}</span>
          </FormItem>
          <!-- 产品线表单 -->
          <FormItem
            v-if="!isHotAreaEdit"
            label="产品线："
            prop="serviceType"
            :rules="hotAreaRules.serviceType"
          >
            <Select
              v-model="hotAreaModelData.serviceType"
              :disabled="isHotAreaEdit"
              style="width:140px"
              placeholder="请选择"
            >
              <Option
                v-for="item in serviceTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <!-- 编辑状态 只读 -->
          <FormItem
            v-else
            label="产品线："
            :rules="[]"
            prop="serviceType"
          >
            <span>{{ hotAreaModelData.productLineName }}</span>
          </FormItem>
        </div>
        <!-- 热力值等级策略-区块-可动态增删 -->
        <Button
          type="primary"
          class="btn_addHeat"
          @click="addHeatLevel"
        >
          添加热力值等级策略
        </Button>
        <div style="border-bottom: 1px solid #ddd;height: 1px;margin-bottom: 16px;"></div>
        <div
          v-for="(item, index) in hotAreaModelData.levelData"
          :key="index"
          class="level_container"
        >
          <div class="left">
            <FormItem
              :label="`等级${(index + 1)}`"
              :prop="'levelData.' + index + '.level' + '.from'"
              :rules="hotAreaRules.levelData.level"
            >
              <Input
                v-model="hotAreaModelData.levelData[index].level.from"
                placeholder="请输入热力值"
                style="width: 120px"
              />
            </FormItem>
            <div style="line-height: 33px;height: 33px;margin-bottom:18px;margin-left: 5px;margin-right: 5px;">
              -
            </div>
            <FormItem
              label=""
              :prop="'levelData.'+ index + '.level' + '.to'"
              :rules="hotAreaRules.levelData.level"
            >
              <Input
                v-model="hotAreaModelData.levelData[index].level.to"
                placeholder="请输入热力值"
                style="width: 120px"
              />
            </FormItem>
          </div>
          <div class="right">
            <FormItem
              label="系数："
              :prop="'levelData.'+ index + '.coefficient'"
              :rules="hotAreaRules.levelData.coefficient"
            >
              <Input
                v-model="hotAreaModelData.levelData[index].coefficient"
                placeholder="请输入系数"
                style="width: 120px"
              />
            </FormItem>
            <div
              v-if="index > 0"
              class="delete_icon"
              @click="removeHeatLevel(index)"
            >
              <Icon type="ios-remove-circle-outline" />
            </div>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="hotAreaCancel"
        >
          取消
        </Button>
        <Button
          v-lazy-click="hotAreaSubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 订单价值优先级派单策略-新建编辑模态框 -->
    <modal
      v-model="orderPriorityModal"
      :title="orderPriorityTitle"
      :width="620"
      :mask-closable="false"
      @on-cancel="orderPriorityCancel"
    >
      <Form
        ref="orderPriorityForm"
        :model="orderPriorityModelData"
      >
        <div class="line1">
          <!-- 城市表单 -->
          <FormItem
            v-if="!isOrderPriorityEdit"
            label="适用城市："
            prop="city"
            :rules="orderPriorityRules.city"
          >
            <Cascader
              v-if="!isOrderPriorityEdit"
              v-model="orderPriorityModelData.city"
              :disabled="isOrderPriorityEdit"
              :data="provinceCityList"
              trigger="hover"
              style="width:140px;display: inline-block;"
            ></Cascader>
          </FormItem>
          <!-- 编辑状态 城市只读-->
          <FormItem
            v-else
            label="适用城市："
            :rules="[]"
          >
            <span>{{ orderPriorityModelData.cityName }}</span>
          </FormItem>
          <!-- 产品线表单 -->
          <FormItem
            v-if="!isOrderPriorityEdit"
            label="产品线："
            prop="serviceType"
            :rules="orderPriorityRules.serviceType"
          >
            <Select
              v-model="orderPriorityModelData.serviceType"
              :disabled="isOrderPriorityEdit"
              style="width:140px"
              placeholder="请选择"
            >
              <Option
                v-for="item in serviceTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <!-- 编辑状态 只读 -->
          <FormItem
            v-else
            label="产品线："
            :rules="[]"
          >
            <span>{{ orderPriorityModelData.productLineName }}</span>
          </FormItem>
        </div>
        <!-- 热力值等级策略-区块-可动态增删 -->
        <Button
          type="primary"
          class="btn_addHeat"
          @click="addOrderPriorityHeatLevel"
        >
          添加等级策略
        </Button>
        <div style="border-bottom: 1px solid #ddd;height: 1px;margin-bottom: 16px;"></div>
        <div
          v-for="(item, index) in orderPriorityModelData.levelData"
          :key="index"
          class="level_container order_level_container"
        >
          <div class="left">
            <FormItem
              :label="`等级${(index + 1)}`"
              :prop="'levelData.'+ index + '.level' + '.from'"
              :rules="orderPriorityRules.levelData.level"
            >
              <Input
                v-model="orderPriorityModelData.levelData[index].level.from"
                placeholder="请输入等级"
                style="width: 120px"
              />
              <span>&nbsp;元</span>
            </FormItem>
            <div style="line-height: 33px;height: 33px;margin-bottom:18px;margin-left: 5px;margin-right: 5px;">
              -
            </div>
            <FormItem
              label=""
              :prop="'levelData.'+ index + '.level' + '.to'"
              :rules="orderPriorityRules.levelData.level"
            >
              <Input
                v-model="orderPriorityModelData.levelData[index].level.to"
                placeholder="请输入等级"
                style="width: 120px"
              />
              <span>&nbsp;元</span>
            </FormItem>
          </div>
          <div class="right">
            <FormItem
              label="系数："
              :prop="'levelData.'+ index + '.coefficient'"
              :rules="orderPriorityRules.levelData.coefficient"
            >
              <Input
                v-model="orderPriorityModelData.levelData[index].coefficient"
                placeholder="请输入系数"
                style="width: 120px"
              />
            </FormItem>
            <div
              v-if="index > 0"
              class="delete_icon"
              @click="removeOrderPriorityHeatLevel(index)"
            >
              <Icon type="ios-remove-circle-outline" />
            </div>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="orderPriorityCancel"
        >
          取消
        </Button>
        <Button
          v-lazy-click="orderPrioritySubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 热区价值策略详情 -->
    <modal
      v-model="hotAreaDetailModal"
      title="策略详情"
      class="detail-modal-hotArea"
      :width="600"
      :mask-closable="false"
    >
      <Form
        :model="hotAreaModelData"
        :label-width="10"
      >
        <div class="line1">
          <div class="left">
            <!-- 只读-->
            <div>适用城市：</div>
            <span>{{ hotAreaModelData.cityName }}</span>
          </div>
          <div class="right">
            <!-- 只读 -->
            <div>产品线：</div>
            <span>{{ hotAreaModelData.productLineName }}</span>
          </div>
        </div>
        <!-- 热力值等级策略 -->
        <Button
          type="text"
          class="btn_addHeat"
          readonly
        >
          等级策略
        </Button>
        <div style="border-bottom: 1px solid #ddd;height: 1px;margin-bottom: 16px;"></div>
        <div
          v-for="(item, index) in hotAreaModelData.levelData"
          :key="index"
          class="level_container"
        >
          <div class="left">
            <div>等级{{ (index + 1) }}：&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <span>热力值：</span>
            <span>{{ hotAreaModelData.levelData[index].level.from }}</span>
            <div style="margin-left: 5px;margin-right: 5px;">
              -
            </div>
            <span>{{ hotAreaModelData.levelData[index].level.to }}</span>
          </div>
          <div class="right">
            <span>系数：</span>
            <span>{{ hotAreaModelData.levelData[index].coefficient }}</span>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="hotAreaDetailModal = false"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 订单价值策略详情 -->
    <modal
      v-model="orderPriorityDetailModal"
      title="策略详情"
      class="detail-modal-orderPriority"
      :width="600"
      :mask-closable="false"
    >
      <Form
        :model="orderPriorityModelData"
        :label-width="10"
      >
        <div class="line1">
          <div class="left">
            <!-- 只读-->
            <div>适用城市：</div>
            <span>{{ orderPriorityModelData.cityName }}</span>
          </div>
          <div class="right">
            <!-- 只读 -->
            <div>产品线：</div>
            <span>{{ orderPriorityModelData.productLineName }}</span>
          </div>
        </div>
        <!-- 热力值等级策略 -->
        <Button
          type="text"
          class="btn_addHeat"
          readonly
        >
          等级策略
        </Button>
        <div style="border-bottom: 1px solid #ddd;height: 1px;margin-bottom: 16px;"></div>
        <div
          v-for="(item, index) in orderPriorityModelData.levelData"
          :key="index"
          class="level_container"
        >
          <div class="left">
            <div>等级{{ (index + 1) }}：&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <span v-if="orderPriorityModelData.levelData[index].level.from >= 0 && orderPriorityModelData.levelData[index].level.to >= 0">
              {{ orderPriorityModelData.levelData[index].level.from }}元
            </span>
            <div
              v-if="orderPriorityModelData.levelData[index].level.from >= 0 && orderPriorityModelData.levelData[index].level.to >= 0"
              style="margin-left: 5px;margin-right: 5px;"
            >
              -
            </div>
            <span v-if="orderPriorityModelData.levelData[index].level.from >= 0 && orderPriorityModelData.levelData[index].level.to >= 0">
              {{ orderPriorityModelData.levelData[index].level.to }}元
            </span>
          </div>
          <div class="right">
            <span>系数：</span>
            <span>{{ orderPriorityModelData.levelData[index].coefficient }}</span>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="orderPriorityDetailModal = false"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 预约单改派策略-新建编辑 -->
    <modal
      v-model="bookingModal"
      :title="bookingTitle"
      :width="600"
      :mask-closable="false"
      @on-cancel="cancelBookingModal"
    >
      <Form
        ref="bookingForm"
        :model="bookingModelData"
        :label-width="140"
      >
        <FormItem
          v-if="!isBookingEdit"
          label="产品线："
          prop="businessType"
          :rules="bookingRules.businessType"
        >
          <Select
            v-model="bookingModelData.businessType"
            :disabled="isBookingEdit"
            style="width:140px"
            placeholder="请选择"
            @on-change="getCoopCityList"
          >
            <Option
              v-for="item in bookingLineList"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          v-else
          label="产品线："
          :rules="[]"
        >
          <span>{{ bookingLineMap[bookingModelData.businessType] }}</span>
        </FormItem>
        <FormItem
          v-if="!isBookingEdit"
          label="适用城市："
          prop="cityUuid"
          :rules="bookingRules.cityUuid"
        >
          <Select
            v-model="bookingModelData.cityUuid"
            :disabled="isBookingEdit"
            style="width:140px"
            placeholder="请选择"
          >
            <Option
              v-for="item in openCityList"
              :key="item.value"
              :disabled="item.disabled"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          v-else
          label="适用城市："
          :rules="[]"
        >
          <span>{{ bookingcityName }}</span>
        </FormItem>
        <FormItem
          label="改派时间限制："
          prop="reassignTimeLimit"
          :rules="bookingRules.reassignTimeLimit"
        >
          司机可在预约用车时间至少
          <InputNumber
            v-model="bookingModelData.reassignTimeLimit"
            style="width: 80px"
            :min="1"
            :precision="0"
            placeholder="请输入"
          ></InputNumber>
          分钟前，发起改派申请
        </FormItem>
        <FormItem
          label="每日改派次数上限："
          prop="reassignFrequencyLimit"
          :rules="bookingRules.reassignFrequencyLimit"
        >
          <InputNumber
            v-model="bookingModelData.reassignFrequencyLimit"
            style="width: 80px"
            :min="1"
            :precision="0"
            placeholder="请输入"
          ></InputNumber>
          次
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="cancelBookingModal"
        >
          取消
        </Button>
        <Button
          v-lazy-click="bookingSubmit"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>

    <!-- 取消策略详情 -->
    <modal
      v-model="cancelDetailModal"
      class="detail-modal"
      title="取消策略详情"
      :width="750"
      :mask-closable="false"
    >
      <Form
        :model="cancelModelData"
        :label-width="145"
      >
        <div class="twoinline">
          <FormItem label="产品线：">
            {{ cancelModelData.businessType?serviceTypeMap[cancelModelData.businessType]:'-' }}
            <!--{{cancelModelData.bussinessType===4?'快享':cancelModelData.bussinessType===2?'专享':'-'}}-->
          </FormItem>
          <FormItem label="车型等级：">
            {{ cancelModelData.carLevel?carTypeMap[cancelModelData.carLevel]:'-' }}
            <!--{{cancelModelData.bussinessType===4?'快享':cancelModelData.bussinessType===2?'专享':'-'}}-->
          </FormItem>
        </div>
        <div class="twoinline">
          <FormItem label="订单类型：">
            {{ cancelModelData.typeTime===1?'实时':'预约' }}
          </FormItem>
          <FormItem label="适用城市：">
            {{ cancelModelData.cityName }}
          </FormItem>
        </div>
        <div v-if="cancelModelData.typeTime===1||cancelModelData.typeTime===2">
          <div class="twoinline">
            <FormItem label="策略名称：">
              {{ cancelModelData.strategyName }}
            </FormItem>
            <FormItem label="取消费(元)：">
              {{ cancelModelData.money }}
            </FormItem>
          </div>
          <FormItem label="生效时间：">
            {{ cancelModelData.effectiveTime }}
          </FormItem>
          <div v-if="cancelModelData.typeTime===1">
            <FormItem label="接单后免费取消时间：">
              {{ cancelModelData.freeCancleMinute }} 分钟
            </FormItem>
            <FormItem label="接单后超时取消时间：">
              {{ cancelModelData.outCancleMinute }} 分钟
            </FormItem>
            <FormItem
              v-if="cancelModelData.businessType==4"
              label="连续取消次数限制："
            >
              {{ cancelModelData.continuedCancelLimit?'启用':'未启用' }}
            </FormItem>
            <div
              v-if="cancelModelData.continuedCancelLimit && cancelModelData.businessType==4"
              class="form-in-line"
            >
              在 {{ cancelModelData.continuedCancelMinute }} 分钟内连续主动取消 {{ cancelModelData.continuedCancelNum }} 次任意订单，禁止下单
              {{ cancelModelData.continuedCancelNoMinute }} 分钟
            </div>
          </div>
          <div v-else>
            <FormItem label="无责取消时间：">
              {{ cancelModelData.noResponseCancelMinute }} 分钟
            </FormItem>
            <FormItem label="司机可迟到时间：">
              {{ cancelModelData.driverLaterMinute }} 分钟
            </FormItem>
          </div>
          <div v-if="cancelModelData.businessType==4">
            <FormItem label="每日取消次数限制：">
              {{ cancelModelData.dailyCancelLimit ? '启用':'未启用' }}
            </FormItem>
            <div
              v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===1"
              class="form-in-line"
            >
              每自然日在接单后 {{ cancelModelData.dailyCancelMinute }} 分钟内主动取消 {{ cancelModelData.dailyCancelNum }}
              次实时单，{{ cancelModelData.dailyCancelNoMinute }} 分钟内禁止下单
            </div>
            <div
              v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===2"
              class="form-in-line"
            >
              每自然日内主动取消 {{ cancelModelData.dailyCancelNum }} 次预约单，{{ cancelModelData.dailyCancelNoMinute }} 分钟内禁止下单
            </div>
          </div>
          <h2
            v-if="cancelModelData.businessType==2"
            style="color:red;font-size: 16px"
          >
            {{ cancelModelData.typeTime==1?
              '使用快享-经济型取消策略中的连续取消次数限制及每日取消次数限制':
              '使用快享-经济型取消策略中的每日取消次数限制' }}
          </h2>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="cancelDetailModal=false"
        >
          确定
        </Button>
      </div>
    </modal>
    <!-- 司机取消策略详情 -->
    <modal
      v-model="deviateDetailModal"
      class="detail-modal"
      title="司机取消策略详情"
      :width="600"
      :mask-closable="false"
    >
      <Form
        :model="deviateModelData"
        :label-width="140"
      >
        <FormItem label="适用城市：">
          {{ deviateModelData.cityName }}
        </FormItem>
        <FormItem label="产品线：">
          <span>
            {{ serviceTypeMapForDriverCancel[deviateModelData.businessType] }}
          </span>
        </FormItem>
        <FormItem label="策略名称：">
          {{ deviateModelData.ruleName }}
        </FormItem>
        <FormItem label="生效时间：">
          {{ deviateModelData.effectiveTime }}
        </FormItem>
        <FormItem label="每日取消上限：">
          {{ deviateModelData.dailyCancelLimit }} 次
        </FormItem>
        <FormItem label="每日取消上限：">
          <span v-if="deviateModelData.totalCancelLimitType ===1">
            每周 {{ deviateModelData.totalCancelLimit }} 次
          </span>
          <span v-if="deviateModelData.totalCancelLimitType ===2">
            每月 {{ deviateModelData.totalCancelLimit }} 次
          </span>
        </FormItem>
        <FormItem label="适用司机：">
          <span>A标签司机</span>
        </FormItem>
        <Card
          v-for="(item, index) in deviateModelData.rules"
          :key="index"
        >
          <FormItem :label="`时段${index+1}`">
            {{ item.startTime }} - {{ item.endTime }}
          </FormItem>
          <FormItem label="有效等待范围：">
            车辆距上车点{{ item.distance }}米以内
          </FormItem>
          <FormItem label="等待乘客上车时长：">
            至少{{ item.waitTime }}分钟
          </FormItem>
          <FormItem label="拨打乘客未接通次数：">
            至少{{ item.unconnectedCount }}次
          </FormItem>
          <FormItem label="电话未接通标准：">
            持续时间{{ item.unconnectedSecond }}秒未接通
          </FormItem>
        </Card>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="deviateDetailModal=false;"
        >
          确定
        </Button>
      </div>
    </modal>
    <!-- 时间段及高峰策略 -->
    <modal
      v-model="timeDetailModal"
      class="detail-modal"
      title="时间段及高峰策略详情"
      :width="600"
      :mask-closable="false"
    >
      <Form
        :model="timeModelData"
        :label-width="140"
      >
        <FormItem
          label="策略名称："
          prop="strategyName"
        >
          {{ timeModelData.strategyName }}
        </FormItem>
        <FormItem
          label="适用城市："
          prop="city"
        >
          {{ timeModelData.cityName }}
        </FormItem>
        <FormItem
          label="生效时间："
          prop="effectiveTime"
        >
          {{ timeModelData.effectiveTime }}
        </FormItem>
        <div class="inline-form-item">
          <FormItem label="夜间服务时段：">
            {{ timeModelData.nightServiceBeginTime }}<span>至</span>{{ timeModelData.nightServiceEndTime }}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="早高峰时段：">
            {{ timeModelData.morningPeakBeginTime }}<span>至</span>{{ timeModelData.morningPeakEndTime }}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="晚高峰时段：">
            {{ timeModelData.eveningPeakBeginTime }}<span>至</span>{{ timeModelData.eveningPeakEndTime }}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="其他高峰时段：">
            {{ timeModelData.otherPeakBeginTime }}<span>至</span>{{ timeModelData.otherPeakEndTime }}
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="timeDetailModal=false"
        >
          确定
        </Button>
      </div>
    </modal>
  </div>
</template>

<script>
import searchTable from "./components/search-table.vue"
import forceRest from "./forceRest/index";
import {
  getProvinceCityList as getProvinceCityListApi,
  axiosSetCityList,
  getWholeRegion
} from "_g/api/common.js"
import {
  homeData,
  carTypeMap,
  serviceTypeMap,
  serviceTypeMapForDriverCancel,
  cityObj,
  cancelData,
  bookingData,
  deviateData,
  timeData,
  tacticData,
  hotAreaData,
  orderPriorityData
} from "./components/fields"
import { timeFormat } from "@/libs/util"
import { cpTranslate } from "@/libs/tools"
import userPreference from "./userPreference"
import {
  axiosCancelStrategySave,
  axiosDriverCancelStrategyAdd,
  axiosTimeStrategySave,
  axiosTimeStrategyUpdate,
  axiosCancelStrategyInfo,
  axiosDriverCancelStrategyDetail,
  axiosTimeStrategyInfo,
  axiosAlarmStrategyDelete,
  axiosTimeStrategyDelete,
  axiosPriorityStrategyDelete,
  axiosPriorityStrategyUpdate,
  axiosPriorityStrategySave,
  // 热区价值
  axiosHotAreaStrategyDelete,
  axiosHotAreaStrategyUpdate,
  axiosHotAreaStrategySave,
  axiosHotAreaStrategyInfo,
  // 订单价值
  axiosOrderPriorityStrategyDelete,
  axiosOrderPriorityStrategyUpdate,
  axiosOrderPriorityStrategySave,
  axiosOrderPriorityStrategyInfo,
  // 预约单改派
  axiosBookingStrategyEdit,
  axiosBookingStrategyShift,
  axiosBookingStrategyDetail,
  // 司机强制休息
  // axiosRestUpdate,
  // axiosRestAdd,
  // getRest as getRestApi,
  // 是否向司机派发用车时间不在其当班时间的预约单
  axiosDriverScheduleUpdate,
  axiosDriverSchedule
} from "_o/api/configData.js"
import dispatchDistance from "_o/components/config-center/dispatch-distance/index.vue";
import userSame from "_o/components/config-center/user-same/index.vue";
import PowerbankPriority  from "_o/components/config-center/orderSend-control/src/powerbank-priority";
import callTogether from "_o/components/config-center/orderSend-control/src/call-together";
import dispatchPriority from "_o/components/config-center/orderSend-control/src/dispatch-priority";
import thirdStrategy from "./thirdStrategy/index"
import trafficRestriction from "./traffic-restriction/index.vue"
import nonLicenseStrategy from "_o/components/config-center/orderSend-control/src/non-license-strategy";
import DriverGroupDispatch from "_o/components/config-center/orderSend-control/driverGroupDispatch";
import BusinessStrategy from "_o/components/config-center/orderSend-control/businessStrategy";

const PAGE_DATA = {
  "type1": { title: "新建取消策略", editTitle: "编辑取消策略" },
  "type2": {
    deleteFunc: axiosAlarmStrategyDelete,
    tableName: "deviateTable",
    title: "新建司机取消策略",
    editTitle: "编辑司机取消策略"
  },
  "type3": {
    deleteFunc: axiosTimeStrategyDelete,
    tableName: "timeTable",
    title: "新建时间段及高峰策略",
    editTitle: "编辑时间段及高峰策略"
  },
  "type4": {
    deleteFunc: axiosPriorityStrategyDelete,
    tableName: "tacticTable",
    title: "新建产品线及订单来源优先级策略",
    editTitle: "新建产品线及订单来源优先级策略"
  },
  "type5": {
    deleteFunc: axiosHotAreaStrategyDelete,
    tableName: "hotAreaTable",
    title: "热区定向派单优先级策略",
    editTitle: "热区定向派单优先级策略"
  },
  "type6": {
    deleteFunc: axiosOrderPriorityStrategyDelete,
    tableName: "orderPriorityTable",
    title: "订单价值优先级派单策略",
    editTitle: "订单价值优先级派单策略"
  },
  "type7": {
    deleteFunc: axiosOrderPriorityStrategyDelete,
    tableName: "orderPriorityTable",
    title: "订单价值优先级派单策略",
    editTitle: "订单价值优先级派单策略"
  }
}
const validLast = (rule, val, callback) => {
  let reg = /^\+?[1-9]\d*$/;
  if (!val) {
    callback(new Error("限制输入1及1以上整数"));
  } else if (!reg.test(val)) {
    callback(new Error("限制输入1及1以上整数"));
  } else {
    callback();
  }
}
export default {
  name: "agreementControl",
  components: {
    searchTable,
    PowerbankPriority,
    dispatchDistance,
    userSame,
    userPreference,
    callTogether,
    dispatchPriority,
    thirdStrategy,
    trafficRestriction,
    nonLicenseStrategy,
    DriverGroupDispatch,
    BusinessStrategy
  },
  data() {
    const validTime = (rule, val, callback) => {
      if (this.invalidTimeFlag) {
        callback(new Error("输入时间段不可重叠！"));
      } else {
        callback();
      }
    }
    // 日期大于当前日校验
    const validNowTime2 = (rule, value, callback) => {
      let now = new Date()
      let dataTime = new Date(this.deviateModelData.effectiveTimes)
      if (dataTime < now) {
        callback(new Error("选择时间不能小于当前时间"))
      } else {
        callback()
      }
    }
    const validTotal = (rule, val, callback) => {
      let reg = /^\+?[1-9]\d*$/;
      if (!val) {
        callback(new Error("限制输入1及1以上整数"));
      } else if (!reg.test(val)) {
        callback(new Error("限制输入1及1以上整数"));
      } else if (this.deviateModelData.totalCancelLimit < this.deviateModelData.dailyCancelLimit) {
        callback(new Error("总计次数需要大于或等于每日次数"));
      } else {
        callback();
      }
    }
    return {
      ...homeData, // tab
      carTypeMap,
      activeRest: false, // 激活强制休息tab时的变量
      serviceTypeMap,
      serviceTypeMapForDriverCancel,
      cancelModal: false, // 新建取消策略
      deviateModal: false, // 新建司机取消订单策略
      timeModal: false, // 新建时间段策略
      tacticModal: false, // 第三方平台新建策略
      hotAreaModal: false, // 订单热区价值
      bookingModal: false,
      orderPriorityModal: false, // 订单热区价值
      detailModalTitle: "",
      detailModal: false,
      detailObj: {},
      dateOptions: {}, // 时间选择器禁用'
      isCancelEdit: false,
      isDeviateEdit: false,
      isTimeEdit: false,
      isTacticEdit: false,
      isBookingEdit: false,
      isHotAreaEdit: false, // 订单热区价值是否是编辑状态
      isOrderPriorityEdit: false,
      cancelDetailModal: false,
      deviateDetailModal: false,
      timeDetailModal: false,
      hotAreaDetailModal: false, // 订单热区价值详情modal
      orderPriorityDetailModal: false,
      bookingDetailModal: false,
      provinceCityList: [],
      cancelTitle: PAGE_DATA.type1.title,
      deviateTitle: PAGE_DATA.type2.title,
      timeTitle: PAGE_DATA.type3.title,
      tacticTitle: PAGE_DATA.type4.title,
      // 热区定向价值标题
      hotAreaTitle: PAGE_DATA.type5.title,
      orderPriorityTitle: PAGE_DATA.type6.title,
      cancelStg: {
        time: [
          { required: true, message: "不能为空", trigger: "change" },
          { validator: validTime, trigger: "change" }

        ],
        digitsNumber: [
          { required: true, type: "number", message: "不能为空", trigger: "change" },
          { validator: validLast, trigger: "change" }
        ],
        totalLimit: [
          { validator: validTotal, trigger: "change" }
        ],
        limitTime: [
          { validator: validLast, trigger: "change" }
        ],
        timeValidating: [
          { trigger: "change", validator: validNowTime2 },
        ]
      },
      invalidTimeRange: [], // 时间池，
      invalidTimeFlag: false, // 是否重合标识
      bookingTitle: PAGE_DATA.type7.title,
      openCityList: [
        { label: "请先选择产品线", value: 0, disabled: true }
      ],
      bookingcityName: ""
    }
  },
  watch: {
    "hotAreaModelData.city"(newVal) {
      console.log(newVal)
    }
  },
  mounted() {
    this.setDisabedTime()
    this.getCityListForTab("tacticTab")
    if(this.$route.query.tabName === 'dispatch-distance'){
        this.tabschange('dispatch-distance')
    }
  },
  beforeDestroy() {
    let tabName = this.tabObj.tabNamePone
    if (tabName !== "tacticTab") {
      this.tabObj.tabNamePone = "tacticTab"
    }
    cityObj.value = []
    let allDataList = [cancelData, deviateData, timeData, tacticData, hotAreaData, orderPriorityData, bookingData]
    let copyDataList = this.originData
    allDataList.forEach((data, index) => {
      data.searchData = {}
      data.tableData = []
      let demoInputList = copyDataList[index].inputList
      data.inputList && data.inputList.forEach((input, idx) => {
        input.value = demoInputList[idx].value
      })
    })
  },
  methods: {
    getDriverSchedule() {
      axiosDriverSchedule().then(res => {
        if (res.data.success) {
          this.driverScheduleTabModelData.status = String(res.data.data && res.data.data.status)
          this.driverScheduleUuid = res.data.data && res.data.data.uuid
          this.driverScheduleOriginStatus = String(res.data.data && res.data.data.status)
          // this.$Message.success(res.data.msg)
        } else {
          // this.$Message.error(res.data.msg)
        }
      })
    },
    handleResetDriverSchedule() {
      this.$refs["restForm"].resetFields()
      this.driverScheduleTabModelData = null
      this.driverScheduleTabModelData = {
        status: this.driverScheduleOriginStatus || "-2",
      }
    },
    handleConfirmDriverSchedule() {
      this.$refs["driverScheduleForm"].validate(valid => {
        console.log("form valid", valid)
        if (valid) {
          let requestApi = axiosDriverScheduleUpdate
          let requestParams = {
            ...this.driverScheduleTabModelData
          }
          if (this.driverScheduleUuid) {
            requestApi = axiosDriverScheduleUpdate
            requestParams = {
              ...requestParams,
              uuid: this.driverScheduleUuid
            }
          }

          // 如果有数据，并且当前选择和之前不一样，就提示，不然直接调用接口
          if (this.driverScheduleUuid
            && this.driverScheduleTabModelData.status !== this.driverScheduleOriginStatus
          ) {
            this.$Modal.confirm({
              title: "确认执行操作？",
              okText: "确认",
              cancelText: "放弃",
              onOk: () => {
                requestApi({ ...requestParams }).then(res => {
                  if (res.data.success) {
                    this.getDriverSchedule()
                    this.$Message.success(requestParams.status === "1" ? "向司机派发用车时间不在其当班时间的预约单已生效" : "已取消")
                  } else {
                    this.$Message.error(res.data.msg || "操作失败")
                  }
                })
              },
              onCancel: () => {
              }
            })
          } else {
            requestApi({ ...requestParams }).then(res => {
              if (res.data.success) {
                this.getDriverSchedule()
                this.$Message.success(requestParams.status === "1" ? "向司机派发用车时间不在其当班时间的预约单已生效" : "已取消")
              } else {
                this.$Message.error(res.data.msg || "操作失败")
              }
            })
          }
        }
      })
    },
    radioChange(status) {
      console.log(status)
    },

    getCityListForTab(name) {
      if (name === "hotArea"
        || name === "orderPriority"
        || name === "bookingTab") {
        console.log("getProvinceCityList")
        this.getProvinceCityList(name)
      } else {
        this.getCityList(name)
      }
    },
    // 获取已开通省市列表
    getProvinceCityList(name) {
      getProvinceCityListApi().then(res => {
        let list = cpTranslate(res.data.data)
        const currentTabName = name
        if (currentTabName === "hotArea") {
          cityObj.cascaderList.splice(0, cityObj.cascaderList.length)
          list.map(item => ({
            ...item,
            cityCode: item.cityID
          }))
          cityObj.cascaderList.push(...list)
        }
        if (currentTabName === "orderPriority") {
          cityObj.cascaderList.splice(0, cityObj.cascaderList.length)
          list.map(item => ({
            ...item,
            cityCode: item.cityID
          }))
          cityObj.cascaderList.push(...list)
        }
        if (currentTabName === "bookingTab") {
          cityObj.cascaderList.splice(0, cityObj.cascaderList.length)
          list.map(item => ({
            ...item,
            cityUuid: item.cityUuid
          }))
          cityObj.cascaderList.push(...list)
        }
        this.tabObj.tabNamePone = name
      }).catch((errorMsg) => {
        console.log("errorMsg", errorMsg)
        this.tabObj.tabNamePone = name
      })
    },
    // 添加等级策略表单
    addHeatLevel() {
      this.hotAreaModelData.levelData.push({
        level: {
          from: "",
          to: ""
        },
        coefficient: ""
      })
    },
    // 移除等级策略表单
    removeHeatLevel(index) {
      this.hotAreaModelData.levelData = this.hotAreaModelData.levelData.filter((item, i) => i !== index)
      console.log(this.hotAreaModelData.levelData)
    },
    // 添加等级策略表单
    addOrderPriorityHeatLevel() {
      this.orderPriorityModelData.levelData.push({
        level: {
          from: "",
          to: ""
        },
        coefficient: ""
      })
    },
    // 移除等级策略表单
    removeOrderPriorityHeatLevel(index) {
      this.orderPriorityModelData.levelData = this.orderPriorityModelData.levelData.filter((item, i) => i !== index)
      console.log(this.orderPriorityModelData.levelData)
    },
    addNew(type) {
      if (type === "1") {
        this.cancelTitle = "新建取消策略"
        this.cancelModal = true
        this.isCancelEdit = false
        this.cancelModelData = {
          // 免费取消新增策略
          businessType: "", // 产品线
          carLevel: "", // 车型等级
          typeTime: "", // 订单类型
          strategyName: "", // 策略名称
          city: [], // 适用城市
          money: null, // 取消费
          effectiveTime: "",
          freeCancleMinute: null, // 接单后免费取消时间
          outCancleMinute: null, // 接单后超时取消时间
          continuedCancelLimit: false, // 连续取消次数限制
          dailyCancelLimit: false, // 每日取消次数限制
          continuedCancelMinute: null, // 连续取消次数限制-几分钟内
          continuedCancelNum: null, // 连续取消次数限制-主动取消次数
          continuedCancelNoMinute: null, // 连续取消次数限制-禁止下单分钟
          dailyCancelMinute: null, // 每日取消次数限制-几分钟内
          dailyCancelNum: null, // 每日取消次数限制-主动取消次数
          dailyCancelNoMinute: null, // 每日取消次数限制-禁止下单分钟
          noResponseCancelMinute: null, // 无责取消时间
          driverLaterMinute: null // 司机可迟到时间
        }
        this.handleReset("cancelForm")
      } else if (type === "2") {
        this.deviateTitle = "新建司机取消策略"
        this.deviateModelData.remark = ""
        this.deviateModal = true
        this.isDeviateEdit = false
        this.invalidTimeRange = []
        this.deviateModelData = {
          ruleName: "", // 名称
          businessTypeList: "", // 业务线
          dailyCancelLimitOn: 0, // 是否启用每日取消上限, 0: 否, 1: 是
          dailyCancelLimit: null, // 每日取消上限次数, 当dailyCancelLimitOn = 1时生效
          totalCancelLimitType: null, // 总计取消上限类型（1：按自然周；2，按自然月）
          totalCancelLimit: null, // 总计取消上限值
          tags: [], // 司机标签
          creater: "", // 创建人
          cityCode: "", // 适用城市
          effectiveTimes: "",
          rules: [
            {
              startTime: "",
              endTime: "",
              distance: null,
              unconnectedCount: null,
              unconnectedSecond: null,
              waitTime: null
            }
          ]
        }
        this.handleReset("deviateForm")
      } else if (type === "3") {
        this.timeTitle = "新建时间段及高峰策略"
        this.timeModelData.otherPeakBeginTime = ""
        this.timeModelData.otherPeakEndTime = ""
        this.timeModal = true
        this.isTimeEdit = false
        this.handleReset("timeForm")
      } else if (type === "4") {
        this.tacticTitle = "新建产品线及订单来源优先级策略"
        this.tacticModal = true
        this.isTacticEdit = false
        this.tacticModelData.channel = null
        this.tacticModelData.city = []
        this.tacticModelData.ratio = ""
        // this.handleReset('tacticForm')
      } else if (type === "5") {
        this.hotAreaTitle = "热区定向派单优先级策略"
        this.hotAreaModal = true
        this.isHotAreaEdit = false
        // this.hotAreaModelData.serviceType = null
        this.hotAreaModelData.productLineName = null
        this.hotAreaModelData.cityName = null
        // this.hotAreaModelData.city = null
        this.hotAreaModelData.heatLevelStrategyVos = null
        this.hotAreaModelData.levelData = null
        this.$nextTick(() => {
          this.hotAreaModelData.serviceType = ""
          this.hotAreaModelData.productLineName = ""
          this.hotAreaModelData.cityName = ""
          this.hotAreaModelData.city = []
          this.hotAreaModelData.heatLevelStrategyVos = []
          this.hotAreaModelData.levelData = [
            {
              level: { from: "", to: "" },
              coefficient: ""
            }
          ]
        })
      } else if (type === "6") {
        this.orderPriorityTitle = "订单价值优先级派单策略"
        this.orderPriorityModal = true
        this.isOrderPriorityEdit = false
        // this.orderPriorityModelData.serviceType = null
        this.orderPriorityModelData.productLineName = null
        this.orderPriorityModelData.cityName = null
        // this.orderPriorityModelData.city = null
        this.orderPriorityModelData.priceLevelStrategyVos = null
        this.orderPriorityModelData.levelData = null
        this.$nextTick(() => {
          this.orderPriorityModelData.serviceType = ""
          this.orderPriorityModelData.productLineName = ""
          this.orderPriorityModelData.cityName = ""
          this.orderPriorityModelData.city = []
          this.orderPriorityModelData.priceLevelStrategyVos = []
          this.orderPriorityModelData.levelData = [
            {
              level: { from: "", to: "" },
              coefficient: ""
            }
          ]
        })
      } else if (type === "7") {
        this.bookingTitle = "新建预约单改派策略"
        this.bookingModal = true
        this.isBookingEdit = false
        this.$nextTick(() => {
          this.bookingModelData = null
          this.bookingModelData = JSON.parse(JSON.stringify(this.defaultBookingModalData))
          this.openCityList = [
            { label: "请先选择产品线", value: 0, disabled: true }
          ]
          this.bookingModelData.uuid = ""
          this.bookingModelData.businessType = ""
          this.bookingModelData.cityUuid = ""
          this.bookingModelData.reassignTimeLimit = null
          this.bookingModelData.reassignFrequencyLimit = null
        })
      }
    },
    cancelBookingModal() {
      if (this.$refs.bookingForm
        && "resetFields" in this.$refs.bookingForm
        && typeof this.$refs.bookingForm.resetFields === "function") {
        console.log("reset bookingForm fields")
        this.bookingModal = false
        this.$refs.bookingForm.resetFields()
        this.$nextTick(() => {
          this.bookingModelData = null
          this.bookingModelData = JSON.parse(JSON.stringify(this.defaultBookingModalData))
          this.bookingModelData.uuid = ""
          this.bookingModelData.businessType = ""
          this.bookingModelData.cityUuid = ""
          this.bookingModelData.reassignTimeLimit = null
          this.bookingModelData.reassignFrequencyLimit = null
        })
      }
    },
    // 获取城市列表
    getCityList(name) {
      this.tabObj.tabNamePone = name
      cityObj.cascaderList.splice(0, cityObj.cascaderList.length)
      // 优先从local中获取数据
      let cityList = localStorage.getItem("codeProvinceCityList")
      if (cityList) {
        let list = JSON.parse(cityList)
        list.forEach(item => {
          item.children.unshift({
            label: "全部",
            value: ""
          })
        })
        cityObj.cascaderList.push(...list)
        this.provinceCityList = JSON.parse(cityList)
        return false
      }
      getWholeRegion({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys")
          let listCopy = JSON.parse(JSON.stringify(list))
          list.forEach(item => {
            item.children.unshift({
              label: "全部",
              value: ""
            })
          })
          cityObj.cascaderList.push(...list)
          this.provinceCityList = listCopy
          // 因列表获取数据较多且不会变动，存入本地
          localStorage.setItem("codeProvinceCityList", JSON.stringify(listCopy))
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 取消策略-新增-金额-保留小数点后两位
    judgeMoney() {
      let money = this.cancelModelData.money
      let small = money && money.toString().split(".")[1]
      if (small && small.length > 1) {
        this.$set(this.cancelModelData, "money", Number(money.toFixed(1)))
      }
    },
    // 今天之前的时间禁用
    setDisabedTime() {
      let nowDate = new Date()
      let nowY = nowDate.getFullYear()
      let nowM = nowDate.getMonth() + 1
      let nowD = nowDate.getDate()
      this.dateOptions = {
        disabledDate(date) {
          let yy = date.getFullYear()
          let mm = date.getMonth() + 1
          let dd = date.getDate()
          return (
            yy < nowY ||
            (yy === nowY && mm < nowM) ||
            (yy === nowY && mm === nowM && dd < nowD)
          )
        }
      }
    },
    // 获取已开城城市列表
    getCoopCityList(value) {
      if (value) {
        axiosSetCityList({ businessType: value }).then(res => {
          let list = res.data.data || [];
          this.openCityList = list.map(item => {
            return {
              label: item.city,
              value: item.cityUuid,
              disabled: false
            }
          })
          // 产品线更换时，开城城市重置为空
          this.bookingModelData.cityUuid = ""
        });
      }
    },
    // 取消策略-新增-编辑-提交
    /*
      *产品提的需求-王栋确认，编辑也是新增，调用新增接口
      */
    cancelSubmit(name) {
      if (typeof name === "object" && name.params) {
        name = name.params
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = { ...this.cancelModelData }
          if (!this.isCancelEdit) {
            params.cityCode = params.city[1]
            delete params.city
          } else {
            delete params.uuid
            delete params.updater
            delete params.versionNumber
          }
          params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")
          // 可选项
          if (!params.continuedCancelLimit) {
            delete params.continuedCancelMinute
            delete params.continuedCancelNum
            delete params.continuedCancelNoMinute
          }
          if (!params.dailyCancelLimit) {
            delete params.dailyCancelMinute
            delete params.dailyCancelNum
            delete params.dailyCancelNoMinute
          }
          // let axiosFun = this.isCancelEdit?axiosCancelStrategyUpdate:axiosCancelStrategySave
          let axiosFun = axiosCancelStrategySave

          axiosFun(params).then(res => {
            if (res.data.success) {
              this.cancelModal = false
              this.handleReset(name)
              this.$refs.cancelTable.judgeGetList(false, true)
              this.$Message.success(res.data.msg || "保存成功")
            } else {
              this.$Message.error(res.data.msg || "操作失败")
            }
          })
        }
      })
    },
    // 司机取消策略-新增-编辑-提交
    deviateSubmit() {
      this.$refs.deviateForm.validate(valid => {
        if (valid) {
          let params = { ...this.deviateModelData }
          if (this.isDeviateEdit) {
            params.businessTypeList = params.businessType

          }
          // params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")

          // let axiosFun = this.isDeviateEdit ? axiosDriverCancelStrategyUpdate : axiosDriverCancelStrategyAdd

          let axiosFun = axiosDriverCancelStrategyAdd
          axiosFun(params).then(res => {
            if (res.data.success) {
              this.deviateModal = false;
              this.handleReset("deviateForm");
              this.$refs.deviateTable.judgeGetList(false, true);
              this.$Message.success(res.data.msg || "保存成功")
            } else {
              this.$Message.error(res.data.msg || "操作失败")
            }
          });
        }
      });
    },
    // 时间段及高峰-新增-提交
    timeSubmit() {
      this.$refs.timeForm.validate(valid => {
        if (valid) {
          let params = { ...this.timeModelData }
          if (!this.isTimeEdit) {
            params.cityCode = params.city[1]
            delete params.city
          }
          params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")

          let axiosFun = this.isDeviateEdit ? axiosTimeStrategyUpdate : axiosTimeStrategySave

          axiosFun(params).then(res => {
            if (res.data.success) {
              this.timeModal = false
              this.handleReset("timeForm")
              this.$refs.timeTable.judgeGetList(false, true)
              this.$Message.success(res.data.msg || "保存成功")
            } else {
              this.$Message.error(res.data.msg || "操作失败")
            }
          })
        }
      })
    },
    // 提交三方平台优先级
    tacticSubmit() {
      this.$refs.tacticForm.validate(valid => {
        if (valid) {
          let { channel, city, ratio, rowData } = this.tacticModelData
          let params = {}
          if (this.isTacticEdit && rowData) {
            let { orderChannel, cityCode, uuid } = rowData
            params = { orderChannel, cityCode, coefficient: `${ratio}`, uuid }
          } else {
            params = { orderChannel: channel, cityCode: `${city[1]}`, coefficient: `${ratio}` }
          }
          let axiosFun = this.isTacticEdit ? axiosPriorityStrategyUpdate : axiosPriorityStrategySave
          axiosFun(params).then(res => {
            let { data } = res
            if (data.success) {
              this.tacticModal = false
              this.$refs.tacticTable.judgeGetList(false, true)
              this.$Message.success(data.msg || "保存成功")
              // this.handleReset('tacticForm');
            } else {
              this.$Message.error(data.msg || "操作失败")
            }
          })
        }
      })
    },
    // 热区订单价值提交策略
    hotAreaSubmit() {
      this.$refs.hotAreaForm.validate(valid => {
        console.log(this.hotAreaModelData)
        if (valid) {
          let { rowData, levelData, city, serviceType } = this.hotAreaModelData
          let params = {}
          const heatLevelStrategyReqs = levelData.map((item, index) => ({
            hotValBegin: item.level.from,
            hotValEnd: item.level.to,
            rate: item.coefficient
          }))
          // 编辑
          if (this.isHotAreaEdit && rowData) {
            let { uuid } = rowData
            params = {
              heatLevelStrategyReqs,
              uuid
            }
          } else {
            // 新增
            params = { serviceType, cityCode: `${city[1]}`, heatLevelStrategyReqs }
          }
          let axiosFun = this.isHotAreaEdit ? axiosHotAreaStrategyUpdate : axiosHotAreaStrategySave
          axiosFun(params).then(res => {
            let { data } = res
            if (data.success) {
              // this.$refs.hotAreaForm.resetFields()
              this.hotAreaModal = false
              this.$refs.hotAreaTable.judgeGetList(false, true)
              this.$Message.success(data.msg || "保存成功")
            } else {
              this.$Message.error(data.msg || "操作失败")
            }
          })
        }
      })
    },
    // 热区订单价值提交策略
    orderPrioritySubmit() {
      this.$refs.orderPriorityForm.validate(valid => {
        console.log(this.orderPriorityModelData)
        if (valid) {
          let { serviceType, city, rowData, levelData } = this.orderPriorityModelData
          let params = {}
          const priceLevelStrategyReqs = levelData.map((item, index) => ({
            levelValBegin: item.level.from,
            levelValEnd: item.level.to,
            rate: item.coefficient
          }))
          // 编辑
          if (this.isOrderPriorityEdit && rowData) {
            let { uuid } = rowData
            params = {
              priceLevelStrategyReqs,
              uuid
            }
          } else {
            // 新增
            params = { serviceType, cityCode: `${city[1]}`, priceLevelStrategyReqs }
          }
          let axiosFun = this.isOrderPriorityEdit ? axiosOrderPriorityStrategyUpdate : axiosOrderPriorityStrategySave
          axiosFun(params).then(res => {
            let { data } = res
            if (data.success) {
              // this.$refs.orderPriorityForm.resetFields()
              this.orderPriorityModal = false
              this.$refs.orderPriorityTable.judgeGetList(false, true)
              this.$Message.success(data.msg || "保存成功")
            } else {
              this.$Message.error(data.msg || "操作失败")
            }
          })
        }
      })
    },
    bookingSubmit() {
      this.$refs.bookingForm.validate(valid => {
        if (valid) {
          let params = {}
          for (let key in this.defaultBookingModalData) {
            params[key] = this.bookingModelData[key]
          }
          this.isBookingEdit && (params.uuid = this.bookingModelData.uuid)
          axiosBookingStrategyEdit({
            uuid: params.uuid || null,
            cityUuid: params.cityUuid,
            businessType: params.businessType,
            reassignTimeLimit: params.reassignTimeLimit,
            reassignFrequencyLimit: params.reassignFrequencyLimit
          }).then(res => {
            if (res.data && res.data.success) {
              this.bookingModal = false
              this.bookingModelData = JSON.parse(JSON.stringify(this.defaultBookingModalData))
              this.$refs.bookingTable.judgeGetList(false, true)
              this.$Message.success(res.data.msg || "保存成功")
            } else {
              this.$Message.error(res.data.msg || "保存失败")
            }
          });
        }
      })
    },
    // 取消新增
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    tabschange(name) {
      this.getCityListForTab(name)
      if (name === "forceRest") {
        this.activeRest = true;
      } else {
        this.activeRest = false;
      }
      if (name === "driverScheduleTab") {
        this.getDriverSchedule()
      }
    },
    // 新增取消策略时间段
    handleAddTimeRange() {
      let obj = {
        startTime: "",
        endTime: "",
        distance: null,
        unconnectedCount: null,
        unconnectedSecond: null,
        waitTime: null
      }
      if (this.deviateModelData.rules.length < 8) {
        this.deviateModelData.rules.push(obj)
      } else {
        this.$Message.error("限制8条以内时间段")
      }

    },
    // 选择城市
    handleSelcetCity(val) {
      this.deviateModelData.cityCode = val[1]
    },
    handleTimepick(val) {
      this.deviateModelData.effectiveTimes = val
      this.$refs["deviateForm"].validateField("effectiveTimes")
    },
    // 删除司机取消测率时间段
    handleRemoveTime(nowIndex) {
      let arr = this.deviateModelData.rules
      this.deviateModelData.rules = arr.filter((item, index) => index !== nowIndex)
      this.handleTimePoor(this.deviateModelData.rules)
    },
    // // 转化为秒
    transferTosec(str) {
      let hm = str.split(":")
      let secSum = Number(hm[0]) * 3600 + Number(hm[1]) * 60
      return secSum
    },
    // 选择取消策略时间
    handleSelectTime(val, index) {

      this.deviateModelData.rules[index].startTime = val[0]
      this.deviateModelData.rules[index].endTime = val[1]
      let obj = { start: this.transferTosec(val[0]), end: this.transferTosec(val[1]) }
      if (val[0] == val[1]) {
        this.invalidTimeFlag = true
        return
      }
      this.invalidTimeRange[index] = obj
      this.validateRepeat()
    },
    // 校验是否时间存在重合情况
    validateRepeat() {
      this.invalidTimeFlag = false
      let timeArray = JSON.parse(JSON.stringify(this.invalidTimeRange))
      let temp
      for (var i = 0; i < timeArray.length - 1; i++) {
        for (let j = i + 1; j < timeArray.length; j++) {
          if (timeArray[i].start > timeArray[j].start) {
            temp = timeArray[i]
            timeArray[i] = timeArray[j]
            timeArray[j] = temp
          }
        }
      }
      // 校验
      for (var i = 0; i < timeArray.length - 1; i++) {
        if (timeArray[i].end < timeArray[i + 1].start) {
          this.invalidTimeFlag = false
        } else if (timeArray[i].end === timeArray[i + 1].start) {
          this.invalidTimeFlag = false
        } else {
          this.invalidTimeFlag = true
        }
      }
    },
    // 详情
    axiosDetail(obj) {
      let uuid = obj.uuid
      let type = obj.type
      let isEdit = obj.isEdit
      let params = {
        uuid: uuid
      }
      if (type === "1") {
        this.cancelTitle = "编辑取消策略"
        this.cancelDetail(params, isEdit)
      } else if (type === "2") {
        this.deviateTitle = "编辑司机取消策略"
        this.alarmDetail(params, isEdit)
      } else if (type === "3") {
        this.timeTitle = "编辑时间段及高峰策略"
        this.timeDetail(params, isEdit)
      } else if (type === "4") {
        this.tacticTitle = "编辑产品线及订单来源优先级策略"
        this.tacticDetail({ ...params, rowData: obj.rowData }, isEdit)
      } else if (type === "5") {
        this.tacticTitle = "热区定向派单优先级策略"
        this.hotAreaDetail({ ...params, rowData: obj.rowData }, isEdit)
      } else if (type === "6") {
        this.tacticTitle = "订单价值优先级派单策略"
        this.orderPriorityDetail({ ...params, rowData: obj.rowData }, isEdit)
      } else if (type === "7") {
        // 这里只有编辑，没有详情
        // 但是需要获取详情
        this.bookingTitle = "编辑预约单改派策略"
        this.bookingDetail({
          uuid: uuid
        })
      }
    },
    // 预约单改派策略详情
    bookingDetail(params) {
      axiosBookingStrategyDetail(params).then(res => {
        if (res.data.success) {
          const detail = res.data.data || {}
          const {
            uuid,
            businessType,
            cityUuid,
            reassignTimeLimit,
            reassignFrequencyLimit,
            cityName
          } = detail
          //  将每一个字段取出来再塞进model里的目的是：form表单在resetFields时，会遍历model的所有字段，然后进行逐一的resetField,
          // 如果model里有多余的字段，并没有rules
          // 那么resetFileds会直接报错
          this.bookingModelData = {
            uuid,
            businessType,
            cityUuid,
            reassignTimeLimit,
            reassignFrequencyLimit
          }
          this.bookingcityName = cityName
          this.isBookingEdit = true
          this.bookingModal = true
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
          this.isBookingEdit = false
          this.bookingModal = false
          this.bookingcityName = ""
        }
      })
    },
    cancelDetail(params, isEdit) {
      axiosCancelStrategyInfo(params).then(res => {
        if (res.data.success) {
          this.cancelModelData = res.data.data || {}
          if (isEdit) {
            this.isCancelEdit = true
            this.cancelModal = true
          } else {
            this.cancelDetailModal = true
          }
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
        }
      })
    },
    alarmDetail(params, isEdit) {
      axiosDriverCancelStrategyDetail(params).then(res => {
        if (res.data.success) {
          this.deviateModelData = res.data.data || {}
          this.handleTimePoor(this.deviateModelData.rules)
          if (isEdit) {
            this.isDeviateEdit = true
            this.deviateModelData.effectiveTimes = JSON.parse(JSON.stringify(res.data.data.effectiveTime))
            this.deviateModal = true
          } else {
            this.deviateDetailModal = true
          }
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
        }
      });
    },
    // 丢放时间池
    handleTimePoor(arr) {
      this.invalidTimeRange = []
      arr.forEach((item, index) => {
        let obj = { start: this.transferTosec(item.startTime), end: this.transferTosec(item.endTime) }
        this.invalidTimeRange[index] = obj
      });
    },
    timeDetail(params, isEdit) {
      axiosTimeStrategyInfo(params).then(res => {
        if (res.data.success) {
          this.timeModelData = res.data.data || {}
          if (isEdit) {
            this.isTimeEdit = true
            this.timeModal = true
          } else {
            this.timeDetailModal = true
          }
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
        }
      })
    },
    // 获取订单热区价值详情页面接口数据
    getHotAreaDetail(params, isEdit) {
      axiosHotAreaStrategyInfo({
        uuid: params.rowData.uuid
      }).then(res => {
        if (res && res.data && res.data.success) {
          const resData = res.data.data || {}
          this.hotAreaModelData = {
            ...params,
            ...res.data.data,
            levelData: resData.heatLevelStrategyVos ? resData.heatLevelStrategyVos.map(item => ({
              level: {
                from: item.hotValBegin,
                to: item.hotValEnd
              },
              coefficient: item.rate
            })) : []
          }
          this.hotAreaDetailModal = true
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
        }
      })
    },
    hotAreaDetail(params, isEdit) {
      let { rowData } = params
      let productLineData = this.serviceTypeList.find(it => it.value - rowData.serviceType === 0)
      console.log("productLineData", productLineData)
      console.log("productLineData.label", productLineData.label)
      this.hotAreaModelData = {
        productLineName: productLineData ? productLineData.label : "",
        serviceType: rowData.serviceType,
        cityName: rowData.cityName,
        rowData
      }
      if (isEdit) {
        // 编辑弹窗
        this.hotAreaModal = true
        this.isHotAreaEdit = true
        this.$nextTick(() => {
          const copyData = JSON.parse(JSON.stringify(this.hotAreaModelData))
          this.hotAreaModelData = null
          this.hotAreaModelData = {
            ...copyData,
            levelData: rowData.heatLevelStrategyVos ? rowData.heatLevelStrategyVos.map(item => ({
              level: {
                from: item.hotValBegin,
                to: item.hotValEnd
              },
              coefficient: item.rate
            })) : []
          }
        })
      } else {
        // 详情弹窗
        this.isHotAreaEdit = false
        this.getHotAreaDetail(this.hotAreaModelData, isEdit)
      }
    },
    axiosShift(params) {
      axiosBookingStrategyShift(params).then(res => {
        this.$refs.bookingTable.judgeGetList(false, true);
        this.$Message.success("操作成功")
      });
    },
    hotAreaCancel() {
      if (this.$refs.hotAreaForm
        && "resetFields" in this.$refs.hotAreaForm
        && typeof this.$refs.hotAreaForm.resetFields === "function") {
        console.log("reset hotAreaForm fields")
        this.hotAreaModal = false
        this.$refs.hotAreaForm.resetFields()
      }
      // this.$refs.hotAreaForm.resetFields()
      // this.handleReset('tacticForm')
    },
    // 获取订单热区价值详情页面接口数据
    getOrderPriorityDetail(params, isEdit) {
      axiosOrderPriorityStrategyInfo({
        uuid: params.rowData.uuid
      }).then(res => {
        if (res && res.data && res.data.success) {
          const resData = res.data.data || {}
          this.orderPriorityModelData = {
            ...params,
            ...res.data.data,
            levelData: resData.priceLevelStrategyVos ? resData.priceLevelStrategyVos.map(item => ({
              level: {
                from: item.levelValBegin,
                to: item.levelValEnd
              },
              coefficient: item.rate
            })) : []
          }
          this.orderPriorityDetailModal = true
        } else {
          this.$Message.error(res.data.msg || "请求策略详情出错")
        }
      })
    },
    orderPriorityDetail(params, isEdit) {
      let { rowData } = params
      let productLineData = this.serviceTypeList.find(it => it.value - rowData.serviceType === 0)
      this.orderPriorityModelData = {
        productLineName: productLineData ? productLineData.label : "",
        serviceType: rowData.serviceType,
        cityName: rowData.cityName,
        rowData
      }
      if (isEdit) {
        // 编辑弹窗
        this.orderPriorityModal = true
        this.isOrderPriorityEdit = true
        this.$nextTick(() => {
          const copyData = JSON.parse(JSON.stringify(this.orderPriorityModelData))
          this.orderPriorityModelData = null
          this.orderPriorityModelData = {
            ...copyData,
            levelData: rowData.priceLevelStrategyVos ? rowData.priceLevelStrategyVos.map(item => ({
              level: {
                from: item.levelValBegin,
                to: item.levelValEnd
              },
              coefficient: item.rate
            })) : []
          }
        })
      } else {
        // 详情弹窗
        this.isOrderPriorityEdit = false
        this.getOrderPriorityDetail(this.orderPriorityModelData, isEdit)
      }
    },
    orderPriorityCancel() {
      if (this.$refs.orderPriorityForm
        && "resetFields" in this.$refs.orderPriorityForm
        && typeof this.$refs.orderPriorityForm.resetFields === "function") {
        console.log("reset orderPriorityForm fields")
        this.orderPriorityModal = false
        this.$refs.orderPriorityForm.resetFields()
      }
      // this.$refs.orderPriorityForm.resetFields()
      // this.handleReset('tacticForm')
    },
    tacticDetail(params, isEdit) {
      let { rowData } = params
      let channelData = this.channelDropList.find(it => it.value - rowData.orderChannel === 0)
      this.tacticModelData = {
        channelName: channelData ? channelData.label : "",
        cityName: rowData.cityName,
        ratio: rowData.coefficient,
        rowData
      }
      if (isEdit) {
        this.tacticModal = true
        this.isTacticEdit = true
      } else {
        this.isTacticEdit = false
      }
    },
    tacticCancel() {
      this.tacticModal = false
      // this.handleReset('tacticForm')
    },
    axiosDelete(obj) {
      this.$Modal.confirm({
        title: "确认删除该策略？",
        onOk: () => {
          let option = PAGE_DATA[`type${obj.type}`]
          let axiosDeleteFun = option.deleteFunc
          let resName = option.tableName
          axiosDeleteFun({ uuid: obj.uuid }).then(res => {
            if (res.data.success) {
              this.$refs[resName].judgeGetList(false, true)
              this.$Message.success(res.data.msg || "删除成功")
            } else {
              this.$Message.error(res.data.msg || "操作失败")
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.strategy-control {
  .ivu-tabs {
    overflow: inherit;
  }
}

.restline {
  /deep/ .ivu-form-item-content {
    margin-left: 10px !important;
  }
}

.radioline {
  /deep/ .ivu-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: -30px !important;
  }

  /deep/ .ivu-form-item-content {
    margin-left: 0px !important;
  }

  /deep/ .ivu-radio-group {
    margin-top: -5px;
  }
}

.rowline {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}

.line-driverSchedule {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 32px;
  flex-direction: row;
  margin-top: 16px;
}

.line-driverSchedule-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  // margin-bottom: 32px;
  flex-direction: column;
}

.restThreVal_read {
  /deep/ input {
    border: 0;
    width: 40px;
    outline: none;
  }
}

/deep/ .ivu-table-cell {
  div {
    white-space: nowrap;
  }
}

.line1,
.level_container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
}

.line1 {
  /deep/ .ivu-form-item:last-child {
    margin-left: 20%;
  }
}

.line1,
.level_container {
  /deep/ .ivu-form-item {
    width: 50%;
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-wrap: nowrap;

    /deep/ .ivu-form-item-label {
      width: auto !important;
    }

    /deep/ .ivu-form-item-content {
      margin-left: 0px !important;
    }
  }
}

.level_container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  .left {
    width: 65%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
  }

  .right {
    width: 35%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-left: -15px;

    .delete_icon {
      cursor: pointer;

      /deep/ .ivu-icon {
        margin-bottom: 20px;
        margin-right: -10px;
        font-size: 20px;
        color: red;
        font-weight: 600;
      }
    }
  }
}

.order_level_container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  .left {
    width: 68%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
  }

  .right {
    width: 32%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-left: -15px;

    .delete_icon {
      cursor: pointer;

      /deep/ .ivu-icon {
        margin-bottom: 20px;
        margin-right: -15px;
        font-size: 20px;
        color: red;
        font-weight: 600;
      }
    }
  }
}

.btn_addHeat {
  margin-bottom: 16px;
}

/deep/ .ivu-input-number-input-wrap input {
  vertical-align: top;
}

.inline-form-item {
  /deep/ .ivu-form-item {
    display: inline-block;
  }

  span {
    display: inline-block;
    margin: 0 8px;
  }
}

.no-left-margin {
  /deep/ .ivu-form-item-content {
    margin-left: 0 !important;
  }
}

.detail-modal {
  /deep/ .ivu-form-item {
    margin-bottom: 10px;
  }

  /deep/ .ivu-form-item-label {
    color: #333;
  }

  .form-in-line {
    padding-left: 145px;
  }
}

.detail-modal-hotArea,
.detail-modal-orderPriority {
  .line1 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 32px;

    .left {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .btn_addHeat {
    margin-left: -16px;
    margin-bottom: 0px;
  }

  .level_container {
    margin-bottom: 16px;
  }
}

.twoinline {
  display: flex;

  /deep/ .ivu-form-item {
    width: 50%;
  }
}

.form-in-line {
  line-height: 32px;
  padding-left: 25px;

  /deep/ .ivu-form-item {
    display: inline-block;

    .ivu-form-item-label {
      width: auto !important;
    }

    .ivu-form-item-content {
      margin-left: 0px !important;
    }

    &.left36 .ivu-form-item-content {
      margin-left: 36px !important;
    }

    &.left120 .ivu-form-item-content {
      margin-left: 120px !important;
    }

    &.left130 .ivu-form-item-content {
      margin-left: 130px !important;
    }
  }
}
</style>
