<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-02 18:18:53
 * @Description:
-->
<template>
  <div>
    <Row :gutter="12">
      <Form
        ref="strategyForm"
        :model="formData"
        :label-width="150"
        :rules="rules"
      >
        <!-- 详情 -->
        <template v-if="!isEdit">
          <FormItem label="车型组" prop="groupName">
            <span>{{ formData.groupName }}</span>
          </FormItem>
          <FormItem label="别名" prop="aliasName">
            <span>{{ formData.aliasName }}</span>
          </FormItem>
          <FormItem label="包含车型" prop="groupVehicleList">
            <span>{{ formData.groupVehicleListStr }}</span>
          </FormItem>
          <FormItem label="是否弹出升舱弹窗" prop="isPopup">
            <span>{{ formData.isPopup  === 1 ? "是" : "否" }}</span>
          </FormItem>
          <div class="posirelative" v-if="formData.isPopup  === 1">
             <FormItem
                label="当接驾车辆为"
                prop="popUpLevels"
              >
                <span>{{ formData.popUpLevelsStr }}</span>
              </FormItem>
             <div class="tipsdeiv">弹出升舱提醒</div>
          </div>
          <div class="flex" v-if="formData.isPopup  === 1">
            <div class="width450">
              <FormItem label="乘客端升舱弹窗提醒文案" prop="popUpMsg">
                <div>{{ formData.popUpMsg[0] ? formData.popUpMsg[0] : '' }}</div>
                <div>{{ formData.popUpMsg[1] ? formData.popUpMsg[1] : '' }}</div>
                <div>{{ formData.popUpMsg[2] ? formData.popUpMsg[2] : '' }}</div>
              </FormItem>
            </div>
            <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="tipimg"
                fit="cover"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
          </div>
          <FormItem prop="groupStrategyList">
            <span slot="label"
              >车型组策略
              <Tooltip
                placement="top"
                content="即执行哪一车型的策略生效,包含除司机定价策略外的所有策略"
              >
                <Icon type="md-help-circle" size="14"></Icon
              ></Tooltip>
            </span>
            <span>{{ formData.groupStrategyListStr }}</span>
          </FormItem>
          <FormItem label="车型组图标" prop="iconUrl">
            <div class="flex-content">
              <img :src="formData.iconUrl" alt="" />
              <div class="flex-text">
                <span>格式：png</span>
                <span>图片分辨率：84*84</span>
              </div>
            </div>
          </FormItem>
        </template>
        <!-- 新增 -->
        <template v-if="isEdit && !formData.id">
          <FormItem label="车型组" prop="groupName">
            <Input
              v-model="formData.groupName"
              :maxlength="20"
              placeholder="请输入车型组名称，限20字"
              class="width220"
              @on-blur="validateName"
            />
          </FormItem>
          <FormItem label="别名" prop="aliasName">
            <Input
              v-model="formData.aliasName"
              :maxlength="10"
              placeholder="请输入前端露出名称，限10字"
              class="width220"
            />
          </FormItem>
          <FormItem label="包含车型" prop="groupVehicleList">
            <Select
              v-model="formData.groupVehicleList"
              multiple
              class="width300"
              placeholder="请选择包含的车型"
              @on-change="changeGroupVehicle"
            >
              <Option
                v-for="item in states.bizCarLevelList"
                :key="'group' + item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="是否弹出升舱弹窗" prop="isPopup">
            <RadioGroup v-model="formData.isPopup ">
              <Radio :label="it.value" v-for="(it,index) in isPopupList" :key="index">{{it.label}}</Radio>
            </RadioGroup>
          </FormItem>
          <div class="posirelative" v-if="formData.isPopup  === 1">
            <FormItem
              label="当接驾车辆为"
              prop="popUpLevels"
            >
              <Select
                v-model="formData.popUpLevels"
                multiple
                class="width300"
                placeholder="请选择车型,可多选"
              >
                <Option
                  v-for="item in states.bizCarLevelListFiltered"
                  :key="'group' + item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <div class="tipsdeiv">弹出升舱提醒</div>
          </div>
          <div class="flex" v-if="formData.isPopup  === 1">
            <div class="width450">
              <FormItem label="乘客端升舱弹窗提醒文案" prop="popUpMsg">
                <Input
                  v-model="formData.popUpMsg[0]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                  class="text-input"
                />
                <Input
                  v-model="formData.popUpMsg[1]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                  class="text-input"
                />
                <Input
                  v-model="formData.popUpMsg[2]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                />
              </FormItem>
            </div>
            <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="tipimg"
                fit="cover"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
          </div>
          <FormItem prop="groupStrategyList">
            <span slot="label"
              >车型组策略
              <Tooltip
                placement="top"
                content="即执行哪一车型的策略生效,包含除司机定价策略外的所有策略"
              >
                <Icon type="md-help-circle" size="14"></Icon
              ></Tooltip>
            </span>
            <Select
              v-model="formData.groupStrategyList"
              class="width300"
              placeholder="请选择该车型组适用的策略"
            >
              <Option
                v-for="item in states.bizCarLevelListFiltered"
                :key="'group' + item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="车型组图标" prop="iconUrl">
            <div class="flex-content">
              <img-upload
                v-model="formData.iconUrl"
                :width="84"
                :height="84"
                :format="['png']"
              />
              <div class="flex-text">
                <span>格式：png</span>
                <span>图片分辨率：84*84</span>
              </div>
            </div>
          </FormItem>
        </template>
         <!-- 编辑 -->
        <template v-if="isEdit && formData.id">
          <FormItem label="车型组" prop="groupName">
            <span>{{ formData.groupName }}</span>
          </FormItem>
          <FormItem label="别名" prop="aliasName">
            <span>{{ formData.aliasName }}</span>
          </FormItem>
          <FormItem label="包含车型" prop="groupVehicleList">
            <span>{{ formData.groupVehicleListStr }}</span>
          </FormItem>
          <FormItem label="是否弹出升舱弹窗" prop="isPopup">
            <RadioGroup v-model="formData.isPopup ">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <div class="posirelative" v-if="formData.isPopup  === 1">
            <FormItem
              label="当接驾车辆为"
              prop="popUpLevels"
            >
              <Select
                v-model="formData.popUpLevels"
                multiple
                class="width300"
                placeholder="请选择车型,可多选"
              >
                <Option
                  v-for="item in states.bizCarLevelListFiltered"
                  :key="'group' + item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <div class="tipsdeiv">弹出升舱提醒</div>
          </div>
          <div class="flex" v-if="formData.isPopup  === 1">
            <div class="width450">
              <FormItem label="乘客端升舱弹窗提醒文案" prop="popUpMsg">
                <Input
                  v-model="formData.popUpMsg[0]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                  class="text-input"
                />
                <Input
                  v-model="formData.popUpMsg[1]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                  class="text-input"
                />
                <Input
                  v-model="formData.popUpMsg[2]"
                  :maxlength="13"
                  placeholder="请输入乘客端升舱弹窗提醒文案"
                />
              </FormItem>
            </div>
            <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="tipimg"
                fit="cover"
                :preview-src-list="srcList"
              >
              </el-image>
            </div>
          </div>
          <FormItem prop="groupStrategyList">
            <span slot="label"
              >车型组策略
              <Tooltip
                placement="top"
                content="即执行哪一车型的策略生效,包含除司机定价策略外的所有策略"
              >
                <Icon type="md-help-circle" size="14"></Icon
              ></Tooltip>
            </span>
            <span>{{ formData.groupStrategyListStr }}</span>
          </FormItem>
          <FormItem label="车型组图标" prop="defaultImg">
            <div class="flex">
               <div class="flex-content">
                <img-upload
                  v-model="formData.iconUrl"
                  :width="84"
                  :height="84"
                  :format="['png']"
                />
                <div class="flex-text">
                  <span>格式：png</span>
                  <span>图片分辨率：84*84</span>
                </div>
               
              </div>
              <div class="flex-text marginlf10" v-if="formData.defaultImg">
                  <el-image
                    style="width: 58px; height: 58px"
                    :src="formData.defaultImg"
                    fit="cover"
                    :preview-src-list="[remoteData.defaultImg]"
                  >
                  </el-image>
              </div>
            </div>
           
          </FormItem>
        </template>
      </Form>
    </Row>
  </div>
</template>
<script>
import { computed, reactive, ref, watch } from "@vue/composition-api";
import imgUpload from "_g/components/img-upload/img-upload";
import { vehicleGroupList } from "../api";
import tipimg from "_o/assets/tips.png";

import { isPopupList } from "../fields";

export default {
  name: "EditStrategyForm",
  components: {
    imgUpload,
  },
  props: {
    remoteData: Object,
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  setup: (props, { root, refs }) => {
    const bizTypeList = ref([]);
    const carLevelList = ref([]);
    const srcList = ref([tipimg]);
    const formData = reactive({
      groupVehicleList: [],
      groupStrategyList: undefined,
      iconUrl: undefined,
      groupName: undefined,
      aliasName: undefined,
      isPopup: 0,
      popUpLevels: [],
      popUpMsg: [],
      id: undefined,
      defaultImg: ""
    });
    // const srcList2 = ref([props.remoteData.defaultImg]);

    // store
    const state = root.$store.state;
    const states = reactive({
      // 获取 store 中的值
      bizTypeList: computed(() => state.common.bizTypeList),
      // 产品线---车型等级 list
      bizCarLevelList: computed(() => {
        let carList = [
          ...states.bizTypeList
            .map((it) => {
              let list = it.levels.map((item) => {
                return {
                  ...item,
                  bizType: it.bizType,
                  bizTypeName: it.bizTypeName,
                  value: `${it.value}#${item.vehicleLevel}`,
                  label: `${it.bizTypeName}-${item.vehicleName}`,
                };
              });
              return list;
            })
            .flat(),
        ];
        return carList;
      }),
      bizCarLevelListFiltered: computed(() => {
        return states.bizCarLevelList.filter(
          (it) => formData.groupVehicleList.indexOf(it.value) > -1
        );
      }),
    });

    const changeGroupVehicle = (val) => {
      // console.log(states.bizCarLevelList.filter(it => formData.groupVehicleList.indexOf(it.value) > -1))
    };

    const rules = reactive({
      groupName: [{ required: true, message: "必填" }],
      aliasName: [{ required: true, message: "必填" }],
      iconUrl: [{ required: true, message: "必填" }],
      groupVehicleList: [{ required: true, message: "必选" }],
      groupStrategyList: [{ required: true, message: "必选" }],
      isPopup: [{ required: true, message: "必选" }],
      popUpLevels: [{ required: true, message: "必选" }],
    });

    // 校验
    const callValidate = async () => {
      const res1 = await refs.strategyForm.validate();
      if (res1) {
        let params = JSON.parse(JSON.stringify(formData));
        return {
          formData: getFormData(params),
        };
      } else {
        return false;
      }
    };
    // 按接口格式组装json
    const generateParamsJson = (bizlist, targetList) => {
      return states.bizTypeList
        .filter((it) => bizlist.indexOf(it.bizType) > -1)
        .map((item) => {
          let levels = targetList
            .filter((v) => v.bizType === item.bizType)
            .map((itemm) => {
              let { tipMsg, iconUrl, vehicleAias, vehicleName, vehicleLevel } =
                itemm;
              return {
                tipMsg,
                iconUrl,
                vehicleAias,
                vehicleName,
                vehicleLevel,
              };
            });
          return {
            bizTypeName: item.bizTypeName,
            bizType: item.bizType,
            levels,
          };
        });
    };
    // 组装表单提交数据
    const getFormData = (params) => {
      let {
        groupName,
        aliasName,
        iconUrl,
        groupVehicleList,
        isPopup,
        popUpLevels,
        popUpMsg,
        groupStrategyList,
        id,
        defaultImg
      } = params;
      let bizCarLevelList = states.bizCarLevelList;
      let groupVehicleListFilter = bizCarLevelList.filter(
        (it) => groupVehicleList.indexOf(it.value) > -1
      );
      let popUpLevelsFilter = bizCarLevelList.filter(
        (it) => popUpLevels.indexOf(it.value) > -1
      );
      
      let [...groupVehicleBiz] = new Set(
        groupVehicleListFilter.map((it) => it.bizType)
      );
      let [...popUpLevelsBiz] = new Set(
        popUpLevelsFilter.map((it) => it.bizType)
      );
      let groupStrategyListFilter = bizCarLevelList.filter(
        (it) => groupStrategyList.indexOf(it.value) > -1
      );
      let [...groupStrategyBiz] = new Set(
        groupStrategyListFilter.map((it) => it.bizType)
      );
      let groupVehicle_JSON = generateParamsJson(
        groupVehicleBiz,
        groupVehicleListFilter
      );
      let groupStrategy_JSON = generateParamsJson(
        groupStrategyBiz,
        groupStrategyListFilter
      );
      let popUpLevels_JSON = generateParamsJson(
        popUpLevelsBiz,
        popUpLevelsFilter
      );
      let upgrades = JSON.stringify({
            isPopup: isPopup,
            popUpLevels: popUpLevels_JSON,
            popUpMsg: popUpMsg
          })
      let formData = id? {
        iconUrl: iconUrl[0]? iconUrl[0] : defaultImg,
        upgrades,
        id
      } : {
        groupName,
        aliasName,
        iconUrl: iconUrl[0],
        groupVehicleList: groupVehicle_JSON,
        groupStrategyList: groupStrategy_JSON,
        upgrades,
      }
      return formData;
    };

    // 校验车型组唯一性
    const validateName = () => {
      vehicleGroupList({
        currPage: 1,
        pageSize: 10,
        groupName: formData.groupName,
      }).then((res) => {
        if (res) {
          const { totalCount } = res?.data?.data;
          if (totalCount > 0) {
            root.$Message.error("该车型组名称已存在");
            formData.groupName = "";
          }
        }
      });
    };
    watch(
      () => props.remoteData,
      (_v) => {
        if (_v) {
          let v = { ..._v };
          Object.assign(formData, v);
          if (!props.isEdit) {
            formData.groupVehicleListStr = v.groupVehicleListStr;
            formData.groupStrategyListStr = v.groupStrategyListStr;
          }
        }
      },
      { immediate: true }
    );

    return {
      rules,
      formData,
      states,
      carLevelList,
      bizTypeList,
      callValidate,
      changeGroupVehicle,
      validateName,
      srcList,
      tipimg,
      isPopupList
    };
  },
};
</script>
<style lang="less" scoped>
.width220 {
  width: 220px;
}
.width300 {
  width: 300px;
}
/deep/ .ivu-tooltip-inner {
  max-width: 360px;
}
.flex-content {
  display: flex;
  width: 170px;

  .flex-text {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    margin-left: 10px;
  }
}
.flex {
  display: flex;
  .flex1 {
    flex: 1;
  }
}
.width450{
  width: 450px;
  margin-right: 10px;
}
.marginlf10{
  margin-left: 20px;
}
.posirelative{
  position: relative;
  .tipsdeiv{
    position: absolute;
    top: 0;
    right: 230px;
    line-height: 32px;
    font-size: 12px;
  }
}
</style>
