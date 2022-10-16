<template>
  <div>
    <FormItem
      v-if="setting.isEffectTime"
      label="有效时间："
      prop="effectTime"
    >
      <span v-if="isDetail">
        {{ addData.effectTime.join(" 至 ") }}
      </span>
      <el-date-picker
        v-else
        v-model="addData.effectTime"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :clearable="false"
        :editable="false"
        size="small"
        style="width: 360px"
        align="left"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="chooseTime"
      />
    </FormItem>
    <!-- 在线时段配置项 -->
    <div
      v-if="setting.isLimitTime"
      class="flex-box"
    >
      <FormItem
        label="是否限定时段："
        prop="effectPeriodType"
      >
        <div v-if="isDetail">
          <span
            v-if="addData.effectPeriodType===1"
            class="right15"
          >不限时段</span>
          <span v-if="addData.effectPeriodType ===2">
            <span
              v-for="(item,i) in limitTimeList"
              :key="i"
            >{{ item.timeItem.join('至') }}{{ i === limitTimeList.length - 1 ? "" : " / " }}</span>
          </span>
        </div>
        <Select
          v-else
          v-model="addData.effectPeriodType"
          placeholder="请选择"
          style="width:150px;"
          @on-change="clearLimitList"
        >
          <!-- eslint-disable -->
          <Option :value="1">不限时段</Option>
          <Option :value="2">限定时段</Option>
          <!-- eslint-enable -->
        </Select>
      </FormItem>
      <div v-if="addData.effectPeriodType ===2 && !isDetail">
        <Form
          v-for="(item,index) in limitTimeList"
          :ref="'timeForm'+index"
          :key="index-100"
          :model="item"
          :rules="ruleValidate"
          :label-width="60"
          style="position:relative"
        >
          <FormItem prop="timeItem">
            <TimePicker
              v-model="item.timeItem"
              :editable="false"
              type="timerange"
              placement="bottom-start"
              placeholder="请选择限定时段"
              style="width: 200px"
            ></TimePicker>
          </FormItem>
          <Icon
            v-if="index>0"
            class="remove-icon"
            type="md-close-circle"
            @click="removeTime(index)"
          />
        </Form>
        <Icon
          v-if="limitTimeList.length<5"
          class="add-icon"
          type="md-add-circle"
          @click="addTimeItem"
        />
      </div>
    </div>
    <FormItem
      v-if="setting.isbusinessType"
      label="业务线："
      prop="businessLineArray"
    >
      <div v-if="isDetail">
        <span
          v-for="(val, index) in addData.businessLineArray"
          :key="val"
        >
          {{ businessProductCarEnum[val]
          }}{{ index === addData.businessLineArray.length - 1 ? "" : " / " }}
        </span>
      </div>
      <CheckboxGroup
        v-else
        v-model="addData.businessLineArray"
        @on-change="updateBusinessListFinal"
      >
        <Checkbox
          v-for="item in businessGradeList"
          :key="item.value"
          :label="item.value"
          style="margin-right: 15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
    </FormItem>
    <template
      v-if="setting.isbusinessType"
    >
      <FormItem
        v-for="(item, key) in addData.PLA"
        :key="`${key}`"
        :label="`${item.label}产品线：`"
        prop="productLineArray"
      >
        <div v-if="isDetail">
          <span v-show="addData.productLineType === 1">
            全部产品线
          </span>
          <span
            v-for="(val, index) in item.productLineArray"
            :key="val"
          >
            {{ businessProductCarEnum["#" + val]
            }}{{ index === item.productLineArray.length - 1 ? "" : " / " }}
          </span>
        </div>
        <CheckboxGroup
          v-else
          v-model="item.productLineArray"
          @on-change="(value) => handleProductLine(value, key)"
        >
          <Checkbox
            v-if="item.businessListFinal.length"
            :label="0"
            style="margin-right:15px;"
          >
            全选
          </Checkbox>
          <Checkbox
            v-for="item in item.businessListFinal"
            :key="item.value"
            :label="item.value"
            style="margin-right:15px;"
          >
            {{ item.label }}
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
    </template>
    <!-- 顺风车角色 乘客 & 车主 -->
    <FormItem
      v-if="showPickRideItem"
      label="顺风车角色："
      prop="checkedRoles"
    >
      <CheckboxGroup
        v-if="!isDetail"
        v-model="addData.checkedRoles"
      >
        <Checkbox
          v-for="item in pickrideRoles"
          :key="item.value"
          :label="item.value"
          style="margin-right:15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
      <span
        v-for="val in addData.checkedRoles"
        v-else
        :key="val"
      >
        {{ val | setPickRideRole }}
      </span>
    </FormItem>
    <!-- 出租车类型 网约 & 扬招 -->
    <FormItem
      v-if="showTaxiSignItem"
      label="出租车类型："
      prop="checkedTypes"
    >
      <CheckboxGroup
        v-if="!isDetail"
        v-model="addData.checkedTypes"
      >
        <Checkbox
          v-for="item in taxisignType"
          :key="item.value"
          :label="item.value"
          style="margin-right:15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
      <span
        v-for="val in addData.checkedTypes"
        v-else
        :key="val"
      >
        {{ val | setTaxisignType }}
      </span>
    </FormItem>
    <FormItem
      v-if="setting.isCity"
      label="针对城市："
      prop="cityArray"
    >
      <div v-if="isDetail">
        <span v-show="addData.cityType === 1">
          全部城市
        </span>
        <span v-show="addData.cityType === 2">
          {{
            addData.cityNameArray.join(" / ")
          }}
        </span>
      </div>
      <Select
        v-else
        v-model="addData.cityArray"
        filterable
        multiple
        clearable
        placeholder="请选择针对城市"
        style="width:300px;"
        @on-change="changeCity"
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
    <!-- APP版本 -->
    <div
      v-if="setting.isAppVersion"
      class="inline-form-item"
    >
      <FormItem
        label="APP版本："
        prop="appVersionType"
      >
        <span v-if="isDetail">
          {{ versionDetail }}
        </span>
        <Select
          v-else
          v-model="addData.appVersionType"
          placeholder="请选择"
          style="width:150px;"
          @on-change="addData.appVersionArray = ''"
        >
          <!-- eslint-disable -->
          <Option
            v-for="item in appVersionList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
          <!-- eslint-enable -->
        </Select>
      </FormItem>
      <FormItem
        v-if="
          !isDetail && addData.appVersionType && addData.appVersionType !== 1
        "
        prop="appVersionArray"
        class="no-left-margin"
      >
        <Input
          v-model="addData.appVersionArray"
          style="width:270px"
          :maxlength="50"
          placeholder="请输入版本号"
        />
        <span>
          (
          {{ (addData.appVersionArray && addData.appVersionArray.length) || 0 }}
          / 50 )
        </span>
      </FormItem>
    </div>
    <!-- 用户群 -->
    <div v-if="setting.isUserGroup">
      <FormItem
        label="用户群："
        prop="userGroupType"
      >
        <span v-if="isDetail">
          {{
            addData.userGroupType === 1
              ? "全部用户群"
              : addData.userGroupArray
                ? addData.userGroupArray.map(item => item.userGroupName).join(" / ")
                : "暂无"
          }}
        </span>
        <RadioGroup
          v-else
          v-model="addData.userGroupType"
          class="right15"
          @on-change="addData.userGroupArray.splice(0, 10)"
        >
          <Radio
            :label="1"
          >
            全部用户
          </Radio>
          <Radio
            :label="2"
          >
            选择用户群
          </Radio>
        </RadioGroup>
        <Button
          v-show="!isDetail && addData.userGroupType === 2"
          type="primary"
          size="small"
          @click="showUserGroupModdal = true"
        >
          查看用户群
        </Button>
      </FormItem>
      <FormItem
        v-if="!isDetail && addData.userGroupType === 2"
        prop="userGroupArray"
        class="no-left-margin table-item"
      >
        <Table
          width="700"
          size="small"
          border
          :columns="userGroupColumnsNew"
          :data="addData.userGroupArray"
        />
      </FormItem>
    </div>
    <!-- 用户类型 -->
    <div v-if="setting.isUserType">
      <FormItem
        :label="setting.userTypeLabel"
        prop="userType"
      >
        <span v-if="isDetail">
          {{ addData.userType | getUserType }}
        </span>
        <RadioGroup
          v-else
          v-model="addData.userType"
          class="right15"
        >
          <template v-if="setting.userTypeCoupon">
            <Radio
              :label="1"
            >
              未首单用户
            </Radio>
            <Radio
              :label="2"
            >
              已首单用户
            </Radio>
          </template>
          <template v-if="setting.userTypeLogin">
            <Radio
              :label="0"
            >
              未登录用户
            </Radio>
          </template>
        </RadioGroup>
      </FormItem>
    </div>
    <FormItem
      v-if="setting.isAdName"
      label="广告展示："
      prop="adName"
    >
      <div v-if="isDetail">
        {{ addData.adName }}
      </div>
      <div v-else>
        <Input
          v-model="addData.adName"
          style="width:200px"
          :maxlength="6"
        />
        <span class="iptfontnums">
          {{ addData.adName ? addData.adName.length : 0 }}/6
        </span>
      </div>
    </FormItem>
    <FormItem
      v-if="setting.isLogo"
      label="底部是否展示T3LOGO："
      prop="logoFlag"
      class="lang-label"
    >
      <span v-if="isDetail">
        {{
          addData.logoFlag === 0 ? "不展示" : "展示"
        }}
      </span>
      <RadioGroup
        v-else
        v-model="addData.logoFlag"
        class="right15"
        @on-change="changeLogeShow"
      >
        <Radio
          :label="1"
          style="margin-right:15px;"
        >
          展示
        </Radio>
        <Radio
          :label="0"
          style="margin-right:15px;"
        >
          不展示
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      v-if="setting.isOpenScreenType"
      label="开屏广告类型："
      prop="openScreenType"
      class="lang-label"
    >
      <span v-if="isDetail">
        {{
          addData.openScreenType === 0 ? "平台自运营" : "异业合作/置换"
        }}
      </span>
      <RadioGroup
        v-else
        v-model="addData.openScreenType"
        class="right15"
      >
        <Radio
          :label="0"
          style="margin-right:15px;"
        >
          平台自运营
        </Radio>
        <Radio
          :label="1"
          style="margin-right:15px;"
        >
          异业合作/置换
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      v-if="setting.isPopupAdType"
      label="弹窗类型："
      prop="popupAdType"
    >
      <span v-if="isDetail">
        {{
          addData.popupAdType === 0 ? "平台自运营" : "异业合作/置换"
        }}
      </span>
      <RadioGroup
        v-else
        v-model="addData.popupAdType"
        class="right15"
      >
        <Radio
          :label="0"
          style="margin-right:15px;"
        >
          平台自运营
        </Radio>
        <Radio
          :label="1"
          style="margin-right:15px;"
        >
          异业合作/置换
        </Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      v-if="setting.isImageUrl"
      :label="setting.imageLabel || '广告图：'"
      prop="imageUrl"
    >
      <img-upload
        :defaultImg="addData.imageUrl"
        :action="actionUrl"
        :params="{ imgType: 1 }"
        :isDetail="isDetail"
        :width="
          setting.isLogo && addData.logoFlag === 1
            ? imgInfo.logoWidth
            : imgInfo.width
        "
        :height="
          setting.isLogo && addData.logoFlag === 1
            ? imgInfo.logoHeight
            : imgInfo.height
        "
        :format="imgInfo.format"
        :maxSize="imgInfo.maxSize"
        :mixMsg="imgInfo.mixMsg"
        shape="width"
        :imgInfo="imgInfo"
        @on-change="getImgUrl"
      ></img-upload>
    </FormItem>
    <FormItem
      v-if="setting.isLinkReward"
      label="关联奖励："
      prop="grantRewardReqList"
    >
      <div class="reawardsRoot">
        <div class="linkRewards">
          <div
            v-for="(item, i) in addData.grantRewardReqList"
            :key="i"
            class="reward"
          >
            {{ i + 1 }}. {{ item.rewardName }}-{{ item.subRewardName }}
            <div
              v-if="!isDetail"
              class="deleteReward"
              @click="deleteReward(i)"
            >
              x
            </div>
          </div>
        </div>
        <Button
          v-if="!isDetail"
          class="linkRewardsButton"
          type="primary"
          @click="showRewardModal"
        >
          {{ linkRewardTxt }}
        </Button>
      </div>
    </FormItem>
    <FormItem
      v-if="setting.isBangImage"
      label="刘海屏广告："
      prop="imageBangUrl"
    >
      <img-upload
        :defaultImg="addData.imageBangUrl"
        :action="actionUrl"
        :params="{ imgType: 1 }"
        :isDetail="isDetail"
        :width="imgInfo.bangInfo.width"
        :height="imgInfo.bangInfo.height"
        :format="imgInfo.bangInfo.format"
        :maxSize="imgInfo.bangInfo.maxSize"
        :mixMsg="imgInfo.bangInfo.mixMsg"
        shape="width"
        :imgInfo="imgInfo.bangInfo"
        @on-change="getImgBangUrl"
      ></img-upload>
    </FormItem>
    <FormItem
      v-if="setting.isLink"
      label="跳转链接："
      prop="adUrl"
    >
      <span v-if="isDetail">
        {{ addData.adUrl || "暂无" }}
      </span>
      <Input
        v-else
        v-model="addData.adUrl"
        style="width:450px"
        placeholder="请输入跳转链接"
        @on-blur="formatUrl(addData.adUrl,'adUrl')"
      />
    </FormItem>
    <!-- 弹出频率 -->
    <div
      v-if="setting.isRate"
      class="inline-form-item"
    >
      <FormItem
        label="弹出频率："
        prop="frequencyType"
      >
        <span v-if="isDetail">
          {{
            addData.frequencyType === 4
              ? "无限制"
              : `${addData.frequencyVal}次/${frequencyMap[addData.frequencyType]}`
          }}
        </span>
        <RadioGroup
          v-else
          v-model="addData.frequencyType"
          class="right15"
          @on-change="changeRate"
        >
          <Radio
            v-for="item in frequencyList"
            :key="item.value"
            :label="item.value"
            style="margin-right:15px;"
          >
            {{ item.label }}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="!isDetail && addData.frequencyType && addData.frequencyType !== 4"
        prop="frequencyVal"
        class="no-left-margin"
      >
        <InputNumber
          v-model="addData.frequencyVal"
          :precision="0"
          :min="1"
          placeholder="请输入次数"
          style="width:150px;"
        ></InputNumber>
      </FormItem>
    </div>
    <FormItem
      v-if="setting.isShowTime"
      label="展示时长："
    >
      <span v-if="isDetail">
        {{
          addData.showTime ? addData.showTime + "秒" : "暂无"
        }}
      </span>
      <InputNumber
        v-else
        v-model="addData.showTime"
        :precision="0"
        :min="2"
        :max="10"
        placeholder="请输入展示的秒数(2-10s)"
        style="width:150px;"
      ></InputNumber>
    </FormItem>
    <FormItem
      v-if="setting.isH5Url"
      label="H5链接："
      prop="h5Url"
    >
      <span v-if="isDetail">
        {{ addData.h5Url || "暂无" }}
      </span>
      <Input
        v-else
        v-model="addData.h5Url"
        style="width:450px"
        placeholder="请输入跳转链接"
        @on-blur="formatUrl(addData.h5Url,'h5Url')"
      />
    </FormItem>
    <FormItem
      v-if="setting.isTitle"
      label="标题文案："
      prop="title"
    >
      <span v-if="isDetail">
        {{ addData.title || "暂无" }}
      </span>
      <Input
        v-else
        v-model="addData.title"
        style="width:450px"
        placeholder="请输入标题文案"
        :maxlength="6"
      />
    </FormItem>
    <FormItem
      v-if="setting.isMoreUrl"
      label="更多链接："
      prop="moreUrl"
    >
      <span v-if="isDetail">
        {{ addData.moreUrl || "暂无" }}
      </span>
      <Input
        v-else
        v-model="addData.moreUrl"
        style="width:450px"
        placeholder="请输入链接"
        @on-blur="formatUrl(addData.adUrl,'moreUrl')"
      />
    </FormItem>
    <FormItem
      v-if="setting.isProductTypeArray"
      label="商品类型："
      prop="productTypeArray"
    >
      <div v-if="isDetail">
        <span v-show="addData.productType === 1">
          全部产品线
        </span>
        <span
          v-for="(val, index) in addData.productTypeArray"
          :key="val"
        >
          {{ goodTypeMap[val]
          }}{{ index === addData.productTypeArray.length - 1 ? "" : " / " }}
        </span>
      </div>
      <CheckboxGroup
        v-else
        v-model="addData.productTypeArray"
        @on-change="handleGoodType"
      >
        <Checkbox
          :label="0"
          style="margin-right:15px;"
        >
          全选
        </Checkbox>
        <Checkbox
          v-for="item in goodTypeList"
          :key="item.value"
          :label="item.value"
          style="margin-right:15px;"
        >
          {{ item.label }}
        </Checkbox>
      </CheckboxGroup>
    </FormItem>
    <FormItem
      v-if="setting.isProductSelectType"
      label="选品方式："
      prop="productSelectType"
    >
      <span v-if="isDetail">
        {{
          addData.productSelectType === 1 ? "人工选品" : addData.productSelectType === 2?"按销量自动选品":"按上架时间自动选品"
        }}
      </span>
      <RadioGroup
        v-else
        v-model="addData.productSelectType"
        @on-change="changeSelectShopType"
      >
        <Radio :label="1">
          人工选品
        </Radio>
        <!-- <Radio
          :label="2"
        >
          按销量自动选品
        </Radio>    -->
        <Radio :label="3">
          按上架时间自动选品
        </Radio>
      </RadioGroup>
      <div v-if="addData.productSelectType===1 && addData.selectGoods && addData.selectGoods.length>0">
        <div>已选择商品数量:&nbsp;{{ addData.selectGoods.length }}</div>
        <Button
          type="primary"
          @click="lookGoods"
        >
          查看商品
        </Button>
      </div>
    </FormItem>
    <FormItem
      v-if="setting.isShopMaxNum"
      label="最大展示数量："
      prop="shopMaxNum"
    >
      <span v-if="isDetail">
        {{ addData.shopMaxNum }}
      </span>
      <InputNumber
        v-else
        v-model="addData.shopMaxNum"
        :precision="0"
        :min="1"
        :max="8"
        placeholder="请输入1-8的整数"
        style="width:150px;"
      ></InputNumber>
    </FormItem>
    <FormItem
      v-if="setting.isUnitId"
      label="广告编码(unit-id)："
      prop="unitId"
    >
      <pre
        v-if="isDetail"
        class="pre-text"
      >{{ addData.unitId }}</pre>
      <Input
        v-else
        v-model="addData.unitId"
        style="width:450px"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 4}"
        :maxlength="100"
        placeholder="请输入广告编码"
      />
      <span
        v-if="!isDetail"
        class="counter"
      >( {{ addData.unitId ? addData.unitId.length:0 }}/100 )</span>
    </FormItem>
    <!-- 选择新用户群弹窗 -->
    <Modal
      v-model="showUserGroupModdal"
      width="80%"
      footer-hide
      title="查看新用户群"
    >
      <new-user-group-modal
        v-if="!isDetail && setting.isUserGroup && addData.userGroupType===2"
        :isShow="showUserGroupModdal"
        :list="addData.userGroupArray"
        :limitNumber="15"
        :newUserGroupType="addData.newUserGroupType || 1"
        @close="showUserGroupModdal = false"
        @selectDown="selectUserGroupDown"
      />
    </Modal>
    <!-- 选择商品 -->
    <selectGoodModal
      ref="selectGoodModal"
      @select-good="selectGoodBack"
    >
    </selectGoodModal>
    <Modal
      v-model="showReward"
      class="coupon-modal"
      width="80%"
      title="选择奖励"
      footer-hide
    >
      <selectRewards
        v-if="showReward"
        @close="selectDownReward"
      ></selectRewards>
    </Modal>
  </div>
</template>
<script>
import imgUpload from "_a/img-upload/index.vue";
import newUserGroupModal from "_a/new-user-group-modal/index.vue";
import {
  // businessInfo,
  pickrideRoles,
  PICKRIDE,
  taxisignType,
  TAXISIGN,
  TAXI_ONLINE_VALUE,
  TAXI_YZ_VALUE,
  PASSENGER_VALUE,
  OWNER_VALUE,
  needTaxiPositionArr,
  // taxiProductLine,
} from "../fields";
import {
  appVersionList,
  userGroupColumnsNew,
  frequencyList,
  frequencyMap,
  ruleValidate,
  goodTypeList,
  goodTypeMap
} from "./fields";
import selectGoodModal from "./selectGoodModal"
import selectRewards from "./selectRewards"

import { tools } from "./mixin-tools";
// import { beige } from "color-name";
import { getChildList } from "@/libs/tools";

// const businessList = businessInfo.list.map(item => {
//   if (item.value === "5") { // 5 为原始的顺风车value, 改为新值
//     item.value = PICKRIDE
//   }
//   if (item.value === "1") // 1 为原始的出租车value, 改为新值
//   {
//     item.value = TAXISIGN
//   }
//   return item
// })

// const businessMap = {
//   ...businessInfo.map,
//   ...{
//     [PICKRIDE]: "顺风车"
//   },
//   ...{
//     [TAXISIGN]: "出租车"
//   }
// }

export default {
  name: "common-inner",
  components: {
    imgUpload,
    newUserGroupModal,
    selectGoodModal,
    selectRewards
  },
  filters: {
    getUserType(val) {
      let label = ""
      switch (val) {
        case 0:
          label = "未登录用户"
          break
        case 1:
          label = "未首单用户"
          break
        case 2:
          label = "已首单用户"
          break
      }
      return label
    },
    setPickRideRole(val) {
      let role
      switch (val) {
        case PICKRIDE: {
          role = ""
          break
        }
        case PASSENGER_VALUE: {
          role = "乘客"
          break
        }
        case OWNER_VALUE: {
          role = "车主"
          break
        }
      }
      return role
    },
    setTaxisignType(val) {
      let role
      switch (val) {
        case TAXISIGN: {
          role = ""
          break
        }
        case TAXI_ONLINE_VALUE: {
          role = "网约"
          break
        }
        case TAXI_YZ_VALUE: {
          role = "扬招"
          break
        }
      }
      return role
    }
  },
  mixins: [tools],
  props: {
    // 新增data
    addData: {},
    // 配置，需要哪些formItem
    setting: {},
    // 是否正在使用common-inner组件，模态框更新校验
    isShow: {
      default: false
    },
    // 1-新增，2-编辑，3-详情
    handleType: {
      default: 1
    },
    imgInfo: {
      // 用到图片上传组件比传参数
      default: () => {
        return {
          width: 0,
          height: 0,
          format: [],
          maxSize: 0
        };
      }
    },
    cityList: {},
    businessGradeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    businessProductCarEnum: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // 版本号校验，如果类型选择版本号，可以输入英文逗号，点，数字，否则，点和数字，
    const validVersion = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入APP版本号"));
      }
      if (this.addData.appVersionType === 2) {
        if (value.includes("，")) {
          return callback(new Error("请使用英文逗号隔开多版本号"));
        } else if (/^[0-9.,]+$/.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的版本号(仅限数字和.)"));
        }
      } else if (
        this.addData.appVersionType === 3 ||
        this.addData.appVersionType === 4
      ) {
        if (value.includes(",")) {
          return callback(new Error("版本之前和版本之后,只需要填写一个版本号"));
        } else if (/^[0-9.]+$/.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的版本号(仅限数字和.)"));
        }
      }
    };
    return {
      frequencyMap,
      appVersionList,
      frequencyList,
      // businessMap,
      goodTypeList,
      goodTypeMap,
      ruleValidate: ruleValidate(this),
      userGroupColumnsNew: userGroupColumnsNew(this),
      showUserGroupModdal: false,
      actionUrl: this._baseUrl + "/common/uploadFile",
      versionRule: { trigger: "change", validator: validVersion },
      pickrideRoles,
      taxisignType,
      limitTimeList: [
        { timeItem: [] },
      ],
      showReward: false, // 展示奖励
      linkRewardTxt: "关联奖励",
      businessListFinal: []
    };
  },
  computed: {
    // 是否详情
    isDetail() {
      return this.handleType === 3;
    },
    // 版本号详情
    versionDetail() {
      let res = "";
      let appVersionType = this.addData.appVersionType;
      let appVersionArray = this.addData.appVersionArray;

      if (appVersionType === 1) {
        res = "全部版本";
      } else if (appVersionType === 2) {
        res = appVersionArray.replace(/,/gi, " / ");
      } else if (appVersionType === 3) {
        res = `${appVersionArray}之前`;
      } else if (appVersionType === 4) {
        res = `${appVersionArray}之后`;
      }
      return res;
    },
    // 是否显示顺风车角色
    showPickRideItem() {
      const data = this.addData.businessLineArray
      return data ? data.includes(4) : false
    },
    // 是否显示出租车角色
    showTaxiSignItem() {
      let data = [];
      Object.keys(this.addData.PLA || {}).forEach(k => {
        data = data.concat(this.addData.PLA[k].productLineArray)
      });
      // 单选 出租车
      if (data.includes(1)) {
        return true
      }
      // else if (data.includes(0) && this.productList.find(item => item.value === 1)) {
      // 全选 && productList 里面有出租车
      //   return true
      // }
      return false
    },
    productList() {
      return getChildList(this.businessGradeList, this.addData.businessLine);
    }
  },
  watch: {
    "addData.position": {
      handler(newValue) {
        this.updateBusinessListFinal()
      },
      immediate: false
    },
    isShow() {
      if (this.isShow) {
        this.updateShow();
      }
    }
  },
  mounted() {
    this.updateShow();
  },
  methods: {
    // 非需要出租车的广告位置去掉出租车产品线
    updateBusinessListFinal() {
      const position = Number(this.addData.position);
      const businessLineArray = this.addData.businessLineArray || [];
      this.$set(this.addData, "PLA", {});
      businessLineArray.forEach(k => {
        let Obj;
        const list = getChildList(this.businessGradeList, k).filter(item => {
          if (needTaxiPositionArr.includes(position)) {
            return true;
          } else {
            return item.value !== 1;
          }
        });
        Obj = {
          label: (this.businessGradeList.find(it => it.value === k) || {}).label,
          businessListFinal: list,
          productLineArray: []
        };
        this.$set(this.addData.PLA, k, Obj);
      });
    },
    /**
     * 删除选中奖励
     */
    deleteReward(index) {
      this.addData.grantRewardReqList.splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 选择奖励
     */
    selectDownReward(reward) {
      console.log("选择奖励------", reward);
      if (!this.addData.grantRewardReqList) this.addData.grantRewardReqList = [];
      let isLinked = false;
      this.addData.grantRewardReqList.forEach(linkReward => {
        if (linkReward.subRewardId === reward.subRewardId) {
          isLinked = true;
        }
      });
      if (isLinked) {
        this.$Message.warning("此奖励已经被关联，请重新选择");
        return;
      }
      if (!this.addData.effectTime) {
        this.$Message.warning("请先填写广告有效时间");
        return;
      }
      // 奖励时间周期必须大于活动时间周期
      if (reward.begin <= this.addData.effectTime[0] && reward.end >= this.addData.effectTime[1]) {
        this.showReward = false;
        this.addData.grantRewardReqList.push(reward);
      } else {
        this.$Message.warning("奖励有效期必须大于活动有效期");
      }
    },
    /**
     * 展示奖励列表
     */
    showRewardModal() {
      let linkRewards = this.addData.grantRewardReqList || [];
      if (linkRewards.length === 10) {
        this.$Message.warning("最多关联10个奖励");
        return;
      }
      this.showReward = true;
    },
    formatUrl(value, key) {
      console.log("formatUrl", value, key)
      this.addData[key] = value.replace(/(^\s*)|(\s*$)/g, "");
    },
    updateShow() {
      // 更新数组类型数据展示，和版本号校验
      this.ruleValidate.appVersionArray.splice(1, 1, this.versionRule);
      this.addData.cityArray &&
        this.addData.cityArray.length > 0 &&
        this.addData.cityArray.splice(0, 1, this.addData.cityArray[0]);

      let effectTimeList = this.addData.adEffectTimeList
      if (effectTimeList) {
        let list = []
        effectTimeList.forEach(item => {
          list.push({ timeItem: [item.startPeriod, item.endPeriod] })
        })
        this.limitTimeList = list
      }
    },

    // 选择用户群
    selectUserGroupDown(list) {
      let selectCopy = JSON.parse(JSON.stringify(this.addData.userGroupArray));
      let selectHash = {};
      let addList = [];
      // 清空原来的选择
      this.addData.userGroupArray.splice(0, 15);
      // 记录原来的选择
      selectCopy.forEach((item, index) => {
        selectHash[item.uuid] = String(index);
      });
      // 判断如果原来也选了，放到相同的位置，没选加进去
      list.forEach(item => {
        let index = selectHash[item.uuid];
        if (index) {
          this.addData.userGroupArray.push(selectCopy[index]);
        } else {
          addList.push(item);
        }
      });
      this.addData.userGroupArray.push(...addList);
    },
    // 获取广告图
    getImgUrl(url, data) {
      this.addData.imageUrl = data.fileUrl || "";
    },
    // 获取刘海屏广告图
    getImgBangUrl(url, data) {
      this.addData.imageBangUrl = data.fileUrl || "";
    },
    // 弹出频率变更
    changeRate(val) {
      if (val === 4) {
        this.addData.frequencyVal = null;
      }
    },
    // 切换是否展示logo，清空图片，因为尺寸不一样
    changeLogeShow(val) {
      this.addData.imageUrl = null;
    },
    // 删除定时时间
    removeTime(index) {
      this.limitTimeList.splice(index, 1)
    },
    // 添加定时时间
    addTimeItem() {
      this.limitTimeList.push({
        timeItem: ""
      })
    },
    clearLimitList() {
      this.limitTimeList.splice(0, 5, { timeItem: [] })
    },
    async validTime() {
      let result = true
      // 限定时段
      if (this.addData.effectPeriodType === 2) {
        await this.limitTimeList.forEach((item, index) => {
          let key = "timeForm" + index
          this.$refs[key][0].validate().then(status => {
            if (!status) {
              result = false
            }
          })
        })
      }
      this.addData.adEffectTimeList = this.limitTimeList.map(item => {
        return {
          startPeriod: item.timeItem[0],
          endPeriod: item.timeItem[1]
        }

      })
      return result
    },
    changeSelectShopType(val) {
      if (this.addData.productTypeArray.length === 0) {
        this.addData.productSelectType = []
        this.$Message.error("请先选择商品类型");
      }
      else {
        if (val && val === 1) {
          if (!this.addData.selectGoods || this.addData.selectGoods.length == 0) {
            this.$refs.selectGoodModal.init({
              data: [],
              typeArray: this.addData.productTypeArray
            })
          }
        }
      }

    },
    selectGoodBack(val) {
      this.$set(this.addData, "selectGoods", JSON.parse(JSON.stringify(val)))
      this.addData.productIds = []
      this.addData.selectGoods.forEach(item => {
        this.addData.productIds.push(item.skuCode)
      })
    },
    lookGoods() {
      this.$refs.selectGoodModal.init({
        data: this.addData.selectGoods,
        typeArray: this.addData.productTypeArray,
        isDetail: this.isDetail
      })
    },
  }
};
</script>
<style scoped lang="less">
.no-left-margin {
  /deep/ .ivu-form-item-content {
    margin-left: 25px !important;
  }
  &.table-item {
    margin-left: 60px !important;
    margin-top: -15px;
  }
}
.inline-form-item {
  /deep/ .ivu-form-item {
    display: inline-block;
  }
}
.lang-label {
  /deep/ .ivu-form-item-label {
    width: 157px !important;
  }
}
.remove-icon {
  position: absolute;
  left: 280px;
  top: 7px;
  font-size: 20px;
  color: #f55932;
  cursor: pointer;
}
.add-icon {
  font-size: 20px;
  color: #19be6b;
  margin-left: 60px;
  position: relative;
  top: -6px;
}
.flex-box {
  display: flex;
  justify-content: flex-start;
}
.pre-text{
  max-width:450px;
}
.reawardsRoot {
  width: auto;
  display: flex;
  .linkRewards {
    width: auto;
    height: 30px;
    display: flex;
    flex-flow: row wrap;
    margin-right: 10px;

    .reward {
      width: auto;
      margin: 0 3px 0 3px;
      padding: 0 3px 0 3px;
      border-radius: 10px;

      .deleteReward {
        float: right;
        margin-top: -5px;
        cursor: pointer;
      }
    }
  }
}
</style>
