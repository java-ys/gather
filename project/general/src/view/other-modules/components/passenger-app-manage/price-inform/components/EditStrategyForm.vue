<!--
 * @Author: NapierPLUS
 * @Date: 2022-01-14 10:20:21
 * @LastEditors: NapierPLUS
 * @LastEditTime: 2022-03-17 18:18:24
 * @Description:
-->
<template>
  <div>
    <Row :gutter="12">
      <Form
        ref="strategyForm"
        :model="formData"
        :label-width="90"
        :rules="rules"
      >
        <FormItem label="城市:" prop="cityCode">
          <Select
            v-if="formData.cityCode!=='0'"
            v-model="formData.cityCode"
            class="width220"
            filterable
            clearable
            :disabled="!isEdit"
          >
            <Option
              v-for="value in states.cityList"
              :key="value.value"
              :value="value.value"
              >{{ value.label }}</Option
            >
          </Select>
          <span v-else>全国</span>
        </FormItem>
        <p class="card-title">多选费用概要说明</p>
        <br>
        <FormItem label="有高速费">
          <span v-if="!isEdit">{{formData.highSpeedFeeSummary}}</span>
          <Input
          v-else
            v-model="formData.highSpeedFeeSummary"
            clearable="clearable"
            class="width400"
          />
        </FormItem>
        <FormItem label="无高速费">
          <span v-if="!isEdit">{{formData.noHighSpeedFeeSummary}}</span>
          <Input
            v-else
            v-model="formData.noHighSpeedFeeSummary"
            clearable="clearable"
            class="width400"
          />
        </FormItem>
      </Form>
      <Tabs :value="tabIndex" @on-click="changeView">
        <Tab-pane
          v-for="(item, index) in tabForm"
          :key="item.value"
          :label="item.label"
          :name="item.value.toString()"
        >
          <Form
            :ref="`tabForm${item.value}`"
            :model="item"
            :label-width="90"
            :rules="rules"
          >
            <Button v-if="isEdit"  type="primary" @click="addCarLevel(index)">添加车型</Button>
            <Card
              v-for="(itemm, idx) in item.carLevelList"
              :key="'carLevelList' + index + idx"
              class="card-item"
            >
              <div slot="title">
                {{ itemm.label }}
                <Button v-if="isEdit" class="right-item" @click="deleteCarLevel(index, idx)"
                  >删除</Button
                >
              </div>
              <p class="card-title">单选费用概要说明</p>
              <FormItem label="有高速费">
                <span v-if="!isEdit">{{itemm.text1}}</span>
                <Input
                v-else
                  v-model="itemm.text1"
                  clearable="clearable"
                  class="width400"
                />
              </FormItem>
              <FormItem label="无高速费">
                <span v-if="!isEdit">{{itemm.text2}}</span>
                <Input
                  v-else
                  v-model="itemm.text2"
                  clearable="clearable"
                  class="width400"
                />
              </FormItem>
              <p class="card-title">费用详细描述(有高速费)</p>
              <Row :gutter="12" style="padding:10px">
                <Col span="4">
                  <Button v-if="isEdit" type="primary" @click="addRowTrue(index, idx)"
                    >添加标题和内容</Button
                  >
                </Col>
              </Row>
              <Row v-for="(ittem, iindex) in itemm.ruleList1" :key="'t'+iindex">
                <FormItem v-show="ittem.title !== null" label="标题">
                  <span v-if="!isEdit">{{ittem.title}}</span>
                  <Input
                  v-else
                    v-model="ittem.title"
                    clearable="clearable"
                    class="width400"
                  />
                  <Button
                  v-if="isEdit"
                    type="text"
                    @click="removeTitleTrue(index, idx, iindex)"
                    >移除</Button
                  >
                </FormItem>
                <FormItem v-show="ittem.content !== null" label="内容">
                  <span v-if="!isEdit">{{ittem.content}}</span>
                  <Input
                  v-else
                    v-model="ittem.content"
                    clearable="clearable"
                    class="width400"
                  />
                  <Button
                  v-if="isEdit"
                    type="text"
                    @click="removeContentTrue(index, idx, iindex)"
                    >移除</Button
                  >
                </FormItem>
              </Row>

              <p class="card-title">费用详细描述(无高速费)</p>
              <Row :gutter="12" style="padding:10px">
                <Col span="4">
                  <Button v-if="isEdit" type="primary" @click="addRowFalse(index, idx)"
                    >添加标题和内容</Button
                  >
                </Col>
              </Row>
              <Row v-for="(ittem, iindex) in itemm.ruleList2" :key="'f'+iindex">
                <FormItem v-show="ittem.title !== null" label="标题">
                  <span v-if="!isEdit">{{ittem.title}}</span>
                  <Input
                  v-else
                    v-model="ittem.title"
                    clearable="clearable"
                    class="width400"
                  />
                  <Button
                   v-if="isEdit"
                    type="text"
                    @click="removeTitleFalse(index, idx, iindex)"
                    >移除</Button
                  >
                </FormItem>
                <FormItem v-show="ittem.content !== null" label="内容">
                  <span v-if="!isEdit">{{ittem.content}}</span>
                  <Input
                  v-else
                    v-model="ittem.content"
                    clearable="clearable"
                    class="width400"
                  />
                  <Button
                   v-if="isEdit"
                    type="text"
                    @click="removeContentFalse(index, idx, iindex)"
                    >移除</Button
                  >
                </FormItem>
              </Row>
            </Card>
          </Form>
        </Tab-pane>
      </Tabs>
    </Row>
    <a-modal
      v-model="isVehicleModalVisible"
      :width="500"
      title="添加车型"
      :mask-closable="false"
    >
      <Form>
        <FormItem label="添加车型:" prop="cityCode">
          <Select
            v-model="bizType"
            class="width220"
            filterable
            clearable
            multiple
            label-in-value
            @on-change="changeCarLevel"
          >
            <Option
              v-for="value in states.bizCarLevelListFiltered"
              :key="value.value"
              :value="value.value"
            >{{ value.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="e => cancel()">关闭</Button>
        <Button type="primary" @click="e => comfirmCarList()">确定</Button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { computed, reactive, ref, watch } from "@vue/composition-api";
import Modal from "../../../work-shift-manager/attend-manager/leave-approval/components/modal.vue";
export default {
  name: "EditStrategyForm",
  components: { Modal },
  props: {
    remoteData: Object,
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  setup: (props, { root, refs }) => {
    const bizTypeList = ref([]);
    const carLevelList = ref([]);
    const formData = reactive({
      cityCode: undefined,
      highSpeedFeeSummary: undefined,
      noHighSpeedFeeSummary: undefined
    });
    // tab标签
    const tabIndex = ref("1");
    // store
    const state = root.$store.state;
    // 查询条件
    root.$store.dispatch("getAuthCityList");
    const states = reactive({
      // 获取 store 中的值
      cityList: computed(() => state.common.authCityList),
      bizTypeList: computed(() => state.common.bizTypeList),
      businessGradeList: computed(() => state.common.businessGradeList),
      // 产品线---车型等级 list
      bizCarLevelList: computed(() => {
        let bizTypeList = states.businessGradeList.find(it =>it.value === Number(tabIndex.value)).children
        let carList = [
          ...bizTypeList
            .map(it => {
              let list = it.levels.map(item => {
                return {
                  ...item,
                  bizType: it.bizType,
                  bizTypeName: it.bizTypeName,
                  value: `${it.value}#${item.vehicleLevel}`,
                  label: `${it.bizTypeName}-${item.vehicleName}`
                };
              });
              return list;
            })
            .flat()
        ];
        return carList;
      }),
      bizCarLevelListFiltered: computed(() => {
        let currList = tabForm.value.find(it => it.value === +tabIndex.value).carLevelList ||[]
        let currFilter = currList.map(it=>it.value).flat()
        return currList.length ? states.bizCarLevelList.filter(
          it => {
            // console.log(currFilter,it.value,currFilter.indexOf(it.value) === -1)
            return currFilter.indexOf(it.value) === -1
          }
        ):states.bizCarLevelList;
      })
    });
    const rules = reactive({
      cityCode: [{ required: true, message: "必选" }]
    });
    const getFormData = params => {
      let res = {
        cityCode: params.cityCode,
        highSpeedFeeSummary: params.highSpeedFeeSummary,
        noHighSpeedFeeSummary: params.noHighSpeedFeeSummary,
        specialExpensesNoticeRules: tabForm.value
          .filter(v => v.carLevelList && v.carLevelList.length)
          .map(it => {
            return {
              bizTypeCarLevelGroups: it.carLevelList.map(item => {
                return {
                  bizTypeCarLevels: item.bizTypeCarLevels,
                  configDetails: [
                    {
                      ruleList: item.ruleList1,
                      summary: item.text1,
                      type: 1
                    },
                    {
                      ruleList: item.ruleList2,
                      summary: item.text2,
                      type: 2
                    }
                  ]
                };
              }),
              expandBizLine: it.value
            };
          })
      };
      if (params.id) {
        res.id = params.id;
      }
      return res;
    };
    // 校验
    const callValidate = async () => {
      const res1 = await refs.strategyForm.validate();
      if (res1) {
        let params = JSON.parse(
          JSON.stringify({ ...formData, tabForm: tabForm.value })
        );
        return {
          formData: getFormData(params)
        };
      } else {
        return false;
      }
    };

    const changeView = val => {
      tabIndex.value = val;
    };
    // modal选中的车型列表
    const bizType = ref([]);
    const bizTypeObject = ref([]);
    // modal
    const isVehicleModalVisible = ref(false);
    const addCarLevel = index => {
      isVehicleModalVisible.value = true;
      // tabForm[index]
    };
    const deleteCarLevel = (index, idx) => {
      tabForm.value[index].carLevelList.splice(idx, 1);
    };
    const cancel = () => {
      isVehicleModalVisible.value = false;
      bizType.value = [];
    };
    const changeCarLevel = data => {
      if (data) {
        bizTypeObject.value = {
            ruleList1: [],
            ruleList2: [],
            text1: "",
            text2: "",
            value:data.map(it =>it.value),
            label:data.map(it =>it.label).join('、'),
            bizTypeCarLevels:data.map(it=>{
              return {
                bizType: it.value.split("#")[0],
                carLevel: it.value.split("#")[1]
              }
            })
        }
      }
    };
    const comfirmCarList = () => {
      isVehicleModalVisible.value = false;
      let currList = tabForm.value.find(it => it.value === +tabIndex.value)
      let currIndex = tabForm.value.findIndex(it => it.value === +tabIndex.value)
      let list = [
        ...currList.carLevelList,
        bizTypeObject.value
      ];
      root.$set(tabForm.value[currIndex], "carLevelList", list);
      bizType.value = [];
      bizTypeObject.value = [];
    };

    // card卡片
    const addRowTrue = (index, idx) => {
      tabForm.value[index].carLevelList[idx].ruleList1.push({
        content: "",
        title: ""
      });
    };
    const addRowFalse = (index, idx) => {
      tabForm.value[index].carLevelList[idx].ruleList2.push({
        content: "",
        title: ""
      });
    };
    const removeTitleTrue = (index, idx, iindex) => {
      tabForm.value[index].carLevelList[idx].ruleList1[iindex].title = null;
      if(tabForm.value[index].carLevelList[idx].ruleList1[iindex].content === null){
        tabForm.value[index].carLevelList[idx].ruleList1.splice(iindex,1)
      }
    };
    const removeContentTrue = (index, idx, iindex) => {
      tabForm.value[index].carLevelList[idx].ruleList1[iindex].content = null;
      if(tabForm.value[index].carLevelList[idx].ruleList1[iindex].title === null){
        tabForm.value[index].carLevelList[idx].ruleList1.splice(iindex,1)
      }
    };
    const removeTitleFalse = (index, idx, iindex) => {
      tabForm.value[index].carLevelList[idx].ruleList2[iindex].title = null;
      if(tabForm.value[index].carLevelList[idx].ruleList2[iindex].content === null){
        tabForm.value[index].carLevelList[idx].ruleList2.splice(iindex,1)
      }
    };
    const removeContentFalse = (index, idx, iindex) => {
      tabForm.value[index].carLevelList[idx].ruleList2[iindex].content = null;
      if(tabForm.value[index].carLevelList[idx].ruleList2[iindex].title === null){
        tabForm.value[index].carLevelList[idx].ruleList2.splice(iindex,1)
      }
    };
    // init
    const tabForm = ref([]);
    const init = isAdd => {
      if (isAdd) {
        tabForm.value = states.businessGradeList.map(it => {
          let item = formData.specialExpensesNoticeRules.find(
            v => v.expandBizLine === it.value
          );
          let res = {
            label: it.label,
            value: it.value
          };
          if (item) {
            res.carLevelList = (item.bizTypeCarLevelGroups || []).map(itt => {
              let item1 = itt.configDetails.filter(it=>it.type===1)
              let item2 = itt.configDetails.filter(it=>it.type===2)
              let label = []
              itt.bizTypeCarLevels.forEach(v=>{
                label.push(states.bizCarLevelList.find(it => it.value === `${v.bizType}#${v.carLevel}`).label)
              })
              return {
                value: itt.bizTypeCarLevels.map(ittt=>{
                  return `${ittt.bizType}#${ittt.carLevel}`
                }),
                ruleList1:itt.configDetails.filter(it=>it.type===1).map(it=>it.ruleList).flat(),
                ruleList2:itt.configDetails.filter(it=>it.type===2).map(it=>it.ruleList).flat(),
                text1:item1&&item1.length?item1[0].summary:"",
                text2:item2&&item2.length?item2[0].summary:"",
                label:label.join('、'),
                bizTypeCarLevels:itt.bizTypeCarLevels
              };
            });
          } else {
            res.carLevelList = [];
          }
          return {
            ...res
          };
        });
      } else {
        tabForm.value = states.businessGradeList.map(it => {
          return {
            label: it.label,
            value: it.value,
            carLevelList: []
          };
        });
      }
    };
    watch(
      () => props.remoteData,
      _v => {
        if (_v) {
          let v = { ..._v };
          Object.assign(formData, v);
        }
        init(_v);
        console.log(tabForm.value)
      },
      { immediate: true }
    );

    return {
      rules,
      formData,
      states,
      carLevelList,
      changeCarLevel,
      bizTypeList,
      callValidate,
      tabIndex,
      changeView,
      tabForm,
      bizType,
      addCarLevel,
      cancel,
      comfirmCarList,
      isVehicleModalVisible,
      deleteCarLevel,
      removeTitleTrue,
      removeContentTrue,
      removeTitleFalse,
      removeContentFalse,
      addRowTrue,
      addRowFalse
    };
  }
};
</script>
<style lang="less" scoped>
.width220 {
  width: 220px;
}
.width300 {
  width: 300px;
}
.width400 {
  width: 400px;
}

/deep/ .ivu-tooltip-inner {
  max-width: 360px;
}
.flex-content {
  display: flex;
  width: 200px;

  .flex-text {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
}
.card-item {
  margin-top: 12px;
  width: 650px;
  .right-item {
    position: absolute;
    right: 20px;
    top: 5px;
  }
}
.card-title {
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  margin: 32px 0;
  display: block;
  &::before{
    content: ' ';
    width: 3px!important;
    height: 18px;
    background: #515a6e;
    display: block;
    float: left;
    margin-right: 10px;
  }
}
</style>
