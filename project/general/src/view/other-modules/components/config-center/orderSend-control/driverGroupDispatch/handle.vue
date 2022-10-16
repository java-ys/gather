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
          label="规则名称："
          prop="ruleName"
          :rules="formValidate.ruleName"
        >
          <Input
            v-model="formData.ruleName"
            style="width: 200px"
            :disabled="fromSource === 3"
          />
        </FormItem>
        <FormItem
          v-if="fromSource !== 3"
          label="适用城市："
          prop="provinceCityCode"
          :rules="formValidate.provinceCityCode"
        >
          <Cascader
            v-model="formData.provinceCityCode"
            :data="provinceCityList"
            trigger="hover"
            filterable
            style="width: 200px; display: flex"
            :disabled="fromSource !== 1"
          ></Cascader>
        </FormItem>
        <FormItem v-else label="适用城市：">
          <div>{{ formData.provinceCityCodeName }}</div>
        </FormItem>
        <FormItem
          label="车辆优先级策略类型："
          prop="strategyData.strategyTypes"
          :rules="formValidate.ruleTypeList"
        >
          <Checkbox-group v-model="formData.strategyData.strategyTypes">
            <Checkbox :label="63" :disabled="fromSource === 3"
              >司机分群优先级</Checkbox
            >
            <Checkbox :label="64" :disabled="fromSource === 3"
              >司机高价格订单匹配优先级</Checkbox
            >             
          </Checkbox-group>                
        </FormItem>
      </Form>
      
      <!-- 司机分群优先级表单模块 -->
      <Form ref="subForm" :model="formData.strategyData.strategyList[0]">
        <div
          class="sub-form"
          v-if="formData.strategyData.strategyTypes.includes(63)"
        >
          <div class="subtitle lineH20">司机分群优先级</div>
          <div class="mb20">
            <Button type="primary" @click="addSubForm" v-if="fromSource !== 3">
              新增司机群策略
            </Button>
          </div>
          <div class="scroll-area">
            <div
              class="module"
              v-for="(item, index) in formData.strategyData.strategyList[0]
                .content"
              :key="index"
            >
              <FormItem
                :label="`司机群策略${index + 1}：`"
                :prop="'content.' + index + '.ruleName'"
                :rules="formValidate.ruleName"
              >
                <Input
                  v-model="item.ruleName"
                  clearable
                  style="width: 200px"
                  :disabled="fromSource === 3"
                />
                <div
                  v-if="fromSource !== 3 && index > 0"
                  class="delete_icon"
                  @click="removeTableData(index)"
                >
                  <Icon type="ios-remove-circle-outline" />
                </div>
              </FormItem>
              <FormItem
                label="司机群："
                :rules="formValidate.driverGroup"
                :prop="'content.' + index + '.tableData'"
              >
                <div>
                  <Button
                    v-if="fromSource !== 3"
                    type="primary"
                    @click="initchecked(index)"
                  >
                    新增司机群
                  </Button>
                </div>
                <div class="mt20">
                  <Table
                    border
                    :columns="fromSource === 3 ?realColumns(index,1,true): realColumns(index,1)"
                    :data="item.tableData"
                    style="margin: 0 auto 24px"
                  ></Table>
                </div>
              </FormItem>
              <!-- 新增需求星期添加 -->
              <FormItem
                label="星期值:"
                :rules="formValidate.strategyTimes"
                :prop="'content.' + index + '.strategyTimes'"
              >
                <div style="display: flex" class="topTo10">
                  <div class="xq-title">
                    <div
                      v-for="(item2, index2) in item.strategyTimes"
                      :key="
                        item2.circulateTimes.map((v) => weekMap[v]).join('、')
                      "
                      class="xq-primary"
                      :class="[item2.isChecked ? 'xq-item-checked' : 'xq-item']"
                      @click="checkedWeek(index, index2)"
                    >
                      {{
                        item2.circulateTimes.map((v) => weekMap[v]).join("、")
                      }}
                      <Icon
                        v-if="fromSource !== 3"
                        type="md-close-circle"
                        class="closeIcon"
                        size="18"
                        @click.stop="deleteWeek(index, index2)"
                      />
                    </div>
                  </div>
                  <div v-if="fromSource !== 3" class="xq-content">
                    <Button
                      :disabled="isCheckedAllWeek(index)"
                      type="info"
                      :ghost="true"
                      style="margin-right: 5px; margin-left: 5px"
                      @click="initCheckedWeek(index, 1, 'checkedWeek')"
                    >
                      添加星期值
                    </Button>
                    <Button
                      v-show="
                        item.strategyTimes && item.strategyTimes.length > 0
                      "
                      type="success"
                      :ghost="true"
                      @click="initCheckedWeek(index, 2, 'checkedWeek')"
                    >
                      编辑星期值
                    </Button>
                  </div>
                </div>
              </FormItem>

              <div
                v-for="(item2, index2) in item.strategyTimes"
                :key="item2.circulateTimes.map((v) => weekMap[v]).join('、')"
                v-show="item2.isChecked"
                class="timeDiv"
              >
                <Form
                  v-for="(yItem, yIndex) in item2.timeDtoList"
                  :ref="'timeForm_' + index + '_' + index2"
                  :key="yItem.id"
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
                            :editable = "false"
                            placement="bottom-end"
                            placeholder="请选择时间段"
                            style="width: 168px"                           
                          ></TimePicker>
                          <!-- <TimePicker
                            v-model="yItem.periods"
                            confirm                          
                            type="timerange"
                            :editable = "false"
                            placement="bottom-end"
                            placeholder="请选择时间段"
                            style="width: 168px"
                            @on-open-change="timePickerPosition($event,item2.timeDtoList,index,index2)"
                            @on-ok="clearOtherTime(item2.timeDtoList,index,index2)"
                            @on-clear="clearOtherTime(item2.timeDtoList,index,index2)"
                          ></TimePicker> -->
                        </div>
                        <div v-else>
                          {{ yItem.periods.join(" - ") }}
                        </div>
                      </FormItem>
                    </Col>

                    <Col span="12">
                      <FormItem
                        label="系数："
                        prop="coefficient"
                        class="dispatchLevel"
                      >                      
                       <div v-if="fromSource !== 3" style="display: flex"> 
                        <Input-number
                          :max="2"
                          :min="0.1"
                          :step="0.1"
                          v-model="yItem.coefficient"
                          @on-change="
                            checkNumber_1($event, index, index2, yIndex)
                          "
                          :disabled="fromSource === 3"
                        ></Input-number>
                       </div>
                        <div v-else>
                          {{ yItem.coefficient}}
                        </div>

                         <div
                          v-if="fromSource !== 3 && yIndex > 0"
                          class="delete_icon"
                          @click="deleteTime(index, index2, yIndex)"
                          style="margin-left: 5px"
                         >
                          <Icon type="ios-remove-circle-outline" />
                        </div>                       
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
                <div>
                  <Button
                    v-if="fromSource !== 3" 
                    type="info"
                    :ghost="true"
                    @click="addTime(index, index2)"
                  >
                    新增时段
                  </Button>
                </div>
              </div>             
            </div>
          </div>
        </div>
      </Form>

      <div class="cutLine" v-show="formData.strategyData.strategyTypes.includes(64) &&  formData.strategyData.strategyTypes.includes(63)">
         <hr/>
      </div>
      <!-- 司机高价格订单匹配优先级表单模块 -->
      <Form ref="subForm_prices" :model="formData.strategyData.strategyList[1]">
        <div
          class="sub-form"
          v-if="formData.strategyData.strategyTypes.includes(64)"
        >
          <div class="subtitle lineH20">司机高价格订单匹配优先级</div>
          <div class="mb20">
            <Button
              type="primary"
              @click="addSubForm(2)"
              v-if="fromSource !== 3"
            >
              新增司机群策略
            </Button>
          </div>
          <div class="scroll-area">
            <div
              class="module"
              v-for="(item, index) in formData.strategyData.strategyList[1]
                .content"
              :key="index"
            >
              <FormItem
                :label="`司机群策略${index + 1}：`"
                :prop="'content.' + index + '.ruleName'"
                :rules="formValidate.ruleName"
              >
                <Input
                  v-model="item.ruleName"
                  clearable
                  style="width: 200px"
                  :disabled="fromSource === 3"
                />
                <div
                  v-if="fromSource !== 3  && index > 0"
                  class="delete_icon"
                  @click="removeTableData(index, 2)"
                >
                  <Icon type="ios-remove-circle-outline" />
                </div>
              </FormItem>
              <FormItem
                label="司机群："
                :rules="formValidate.driverGroup"
                :prop="'content.' + index + '.tableData'"
              >
                <div>
                  <Button
                    v-if="fromSource !== 3"
                    type="primary"
                    @click="initchecked(index, 2)"
                  >
                    新增司机群
                  </Button>
                </div>
                <div class="mt20">
                  <Table
                    border
                    :columns="fromSource === 3 ?realColumns(index,2,true): realColumns(index,2)"
                    :data="item.tableData"
                    style="margin: 0 auto 24px"
                  ></Table>
                </div>
              </FormItem>

              <!-- 新增fph数据 -->
              <div class="strategyPrice">
                <div>
                  <FormItem
                    :prop="'content.' + index + '.fphTimes'"
                    :rules="formValidate.coefficient"
                     class="timePrice"
                  >
                    <span style="color: red">*</span>
                    <span>司机当日每小时平均流水金额(FPH)≤ </span>
                    <Input-number
                      :max="2"
                      :min="1"
                      :step="0.1"
                      v-model="item.fphTimes"
                      @on-change="checkNumber_2($event, index)"
                      :disabled="fromSource === 3"
                    ></Input-number>
                    <span>城市平均值时 </span>
                  </FormItem>

                  <FormItem
                    label="派单优先级："
                    :prop="'content.' + index + '.dispatchPriority'"
                    :rules="formValidate.coefficient"
                    class="dispatchLevel"
                  >
                    <div class="dispatchItem">
                      <div>高</div>
                      <div class="sliderItem">
                        <Slider
                          v-model="item.dispatchPriority"
                          :min="0.1"
                          :disabled="fromSource === 3"
                          :max="2.0"
                          :step="0.1"
                        ></Slider>
                      </div>
                      <div>低</div>
                      <span class="sliderTxt"
                        >派单系数：{{ item.dispatchPriority || 0.1 }}</span
                      >
                    </div>
                  </FormItem>
                </div>
              </div>              
            </div>
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
      <checked ref="checked" @updateDriverGroup="updateDriverGroupData" />
    </Modal>

    <checked-week ref="checkedWeek" @getWeekData="getWeekData" />
  </div>
</template>

<script>
import {
  validatorTimeDetail,
  getPeriods,
  listColumns,
  getProvinceIdByCityUuid,
  getProvinceNameByCityUuid,
} from "./fields";
import checked from "./components/checked";
import checkedWeek from "../traffic-restriction/components/cheek-week-days.vue";
import { editAbsDetail, createAbsStrategy } from "_o/api/operationAdmin.js";

//星期转换
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
    checked,
    checkedWeek,
  },
  props: ["provinceCityList"],
  data() {
    return {
      weekMap,
      value1: 0,
      showModal: false,
      title: "新增车辆优先级策略",
      uuid: "",
      fromSource: "", // 1.新增 2.编辑 3.详情
      formData: {
        ruleName: "",
        cityCode: "",
        strategyData: {
          //车辆优先级策略
          strategyTypes: [], //车辆优先级策略选中数组
          strategyList: [
            {
              strategyType: 63,
              content: [], // //司机分群优先级数组
            },
            {
              strategyType: 64,
              content: [], //司机高价格订单匹配优先级数组
            },
          ],
        },
      },
      formValidate: {
        ruleName: [{ required: true, message: "规则名称必填" }],
        ruleName: [
          { required: true, message: "策略名称必填" },
          { max: 30, message: "策略名称长度不能超过30个字符" },
        ],
        // provinceCityCodeName: [{ required: true }],
        provinceCityCode: [
          { required: true, message: "省市必选", type: "array" },
        ],
        ruleTypeList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback("车辆优先级策略类型必选");
              } else {
                callback();
              }
            },
          },
        ],
        driverGroup: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback("司机群组必选");
              } else {
                callback();
              }
            },
          },
        ], 
        strategyTimes: [
          //星期数组
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
        periods: [
          {
            required: true,
            validator: validatorTimeDetail,
          },
        ],
        coefficient: [
          {
            required: true,
            message: "必选",
          },
        ],
      },
      columns: listColumns.driverColumn(this),
      tableData: [], // 司机群组列表数据
      timeDtoList: [getPeriods()], // 时段
      periodValidate: {
        periods: [
          {
            required: true,
            validator: validatorTimeDetail,
          },
        ],
        coefficient: [
          {
            required: true,
            message: "必选",
          },
        ],
      },
      //新增判断条件
      currentAddIndex: 0, //当前司机分群策略的第几个content
      currentEditWeekIndex: 0, //当前星期的索引
      //当前对星期的操作
      handleWeek: 1, //1:新增  2:编辑
      cureentAddCrowd: 1 //1:司机分群优先级 2:司机高价格订单匹配优先级
    };
  },
  methods: {
    init(val) {      
      console.log(val);
      this.showModal = true;
      // 新增
      if (!val) {
        this.title = "新建车辆优先级策略";
        this.fromSource = 1;
        this.formData = {
          cityName: "", // 策略名称
          cityUuid: [], // 城市编码，
          strategyData: {
            strategyTypes: [],
            strategyList: [
              {
                strategyType: 63,
                content: [{ ruleName: "", tableData: [], strategyTimes: [] }],
              },
              {
                strategyType: 64,
                content: [
                  {
                    ruleName: "",
                    tableData: [],
                    fphTimes: 1,
                    dispatchPriority: 0.1,
                  },
                ],
              },
            ],
          },
        };      
      } else {       
        // 编辑/详情     
        this.title = "编辑车辆优先级策略";
        this.fromSource = 2;
        this.uuid = val.uuid;
        const provinceId = getProvinceIdByCityUuid(
          val.cityCode,
          this.provinceCityList
        );
        const provinceName = getProvinceNameByCityUuid(
          val.cityCode,
          val.cityName,
          this.provinceCityList
        );
        //判断是否转换数据
        let newContent;    //司机分群优先级
        let newContent2;   //司机高价格匹配优先级

        if(val.strategyData.strategyTypes.includes(63)){
          let obj = val.strategyData.strategyList.find((item) => {
              return item.strategyType === 63;
          })
          const content = JSON.parse(obj.content);
           newContent = content.map((i) => {            
            return {
              ruleName: i.ruleName,
              tableData: i.driverGroupDetails,
              strategyTimes: i.strategyTimes.map((item,index) => {
                return {
                  circulateTimes: item.circulateTimes,
                  timeDtoList: item.strategyPeriods.map((item2, index) => {
                  return {
                    id: index,
                    periods: [item2.startTime, item2.endTime],
                    coefficient: item2.dispatchPriority,
                  };
                }),
                isChecked: index === 0 ? true: false

                }
              })            
            };
          });
        }else{
          newContent = [{ ruleName: "", tableData: [], strategyTimes: [] }];
        } 

        if(val.strategyData.strategyTypes.includes(64)){
          let obj2 = val.strategyData.strategyList.find((item) => {
              return item.strategyType === 64;
          })
          const content = JSON.parse(obj2.content);
          newContent2 = content.map((i) => {            
            return {
              ruleName: i.ruleName,
              tableData: i.driverGroupDetails,           
              fphTimes: i.fphTimes,
              dispatchPriority: i.dispatchPriority
            };
          });
        }else{
          newContent2 = [
                  {
                    ruleName: "",
                    tableData: [],
                    fphTimes: 1,
                    dispatchPriority: 0.1,
                  },
                ];
        }
       
        if (val.isDetail) {
          this.title = "车辆优先级策略详情";
          this.fromSource = 3;
        } else {
          this.fromSource = 2;
        }       
        this.formData = {
          ruleName: val.ruleName,
          provinceCityCodeName: provinceName + val.cityName,
          provinceCityCode: [provinceId, val.cityCode],
          strategyData: {
            strategyTypes: val.strategyData.strategyTypes,
            strategyList: [
              {
                strategyTypes: 63,
                content: newContent,
              },
              {
                strategyTypes: 64,
                content: newContent2,
              },
            ],
          },
        };
     
      if( this.$refs.subForm && this.$refs.subForm.length !== 0){
         this.$refs.subForm.resetFields()  
      }
      if( this.$refs.subForm_prices && this.$refs.subForm_prices.length !== 0){
         this.$refs.subForm_prices.resetFields()  
      }

      for( let key in this.$refs){     
        if(key.indexOf('timeForm') > -1){  
            this.$refs[key].forEach( (item) => {
             item.resetFields()
            })
        }       
      }

      }
      this.$refs.form.resetFields();
    

    },
    //司机群字段
    realColumns(index, flag,detailFlag) {
      let columns;           
        columns = listColumns.driverColumn(this, index, flag,detailFlag);      
      return columns;
    },

    //新增司机群策略
    addSubForm(flag) {
      if (flag === 2) {
        this.formData.strategyData.strategyList[1].content.push({
          ruleName: "",
          tableData: [],
          fphTimes: 1,
          dispatchPriority: 0.1,
        });
      }else {
        this.formData.strategyData.strategyList[0].content.push({
          tableData: [],
          strategyTimes: [],
          ruleName: "",
        });
      }
    },
    saveData() {
      const promises = [];     
     
      promises.push(this.$refs.form.validate());
      if(this.formData.strategyData.strategyTypes.includes(63)){
         promises.push(this.$refs.subForm.validate())
      }
      if(this.formData.strategyData.strategyTypes.includes(64)){
         promises.push(this.$refs.subForm_prices.validate()) 
      }

      for( let key in this.$refs){     
        if(key.indexOf('timeForm') > -1){  
            this.$refs[key].forEach( (item) => {
               promises.push(item.validate());
            })

        }       
      }        
      Promise.all(promises)
        .then((values) => {
          if (!values.includes(false)) {
            this.validateRangeJoin().then(res => {
              if (res.flag) {
                this.submit();
              } else {
                this.$Message.error({
                  content: `第${res.index_1 +1}个司机分群优先级中第${res.index_2 +1}个星期值时段有交叉`,                
                  duration:3
                })
              }
            });        
            // this.submit();
          }else{
            console.log('校验失败')
          }
        })
        .catch((err) => {
            console.log('校验失败')
          
          // do nothing
        });
    },
    submit() {
      let params = {
        ruleName: this.formData.ruleName,
        creator: this.getUserId(),
        cityCode: this.getCityUuid(),
        strategyData: {          
          strategyTypes: [],
          strategyList: [],                    
        },
      };
      // params.cityName = this.getCityName(params.cityCode);
      // 司机群组
      params.strategyData.strategyTypes =
        this.formData.strategyData.strategyTypes;    
      if( this.formData.strategyData.strategyTypes.includes(63)){
        //整合司机分群优先级数据
        let  strategyType = 63; 
        let content =
        this.formData.strategyData.strategyList[0].content.map((item) => {
          const driverGroupNos = item.tableData.map((t) => {
            return t.crowdCode;
          });
          const strategyTimes = item.strategyTimes.map( (item2) => {

          const strategyPeriods = item2.timeDtoList.map((time) => {
            return {
              startTime: time.periods[0],
              endTime: time.periods[1],
              dispatchPriority: time.coefficient,
            };
          });
            
            
            return {
               circulateTimes: item2.circulateTimes,              
               strategyPeriods: strategyPeriods
            }

          })         
          const i = {
            driverGroupNos,
            ruleName: item.ruleName,
            // strategyPeriods,
            strategyTimes,
          };
          return i;
        });
         params.strategyData.strategyList.push({
           strategyType,
           content
         })

      }      
     
        if(this.formData.strategyData.strategyTypes.includes(64)){
          
          //整合司机高价格订单匹配优先级
          let strategyType = 64; 
          let content =
          this.formData.strategyData.strategyList[1].content.map((item) => {
            const driverGroupNos = item.tableData.map((t) => {
              return t.crowdCode;
            });                  
            const i = {
              driverGroupNos,
              ruleName: item.ruleName,
              fphTimes:item.fphTimes,
              dispatchPriority: item.dispatchPriority             
            };
            return i;
          });

           params.strategyData.strategyList.push({
           strategyType,
           content
         })
        }
       

      console.log(params, this.formData.provinceCityCode);
      // 新增
      if (this.fromSource === 1) {    
         console.log('我的数据：',params)
        createAbsStrategy(params).then((res) => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      } else if (this.fromSource === 2) {
        // 编辑
        params.uuid = this.uuid;
        params.modifier = params.creator;
        params.creator = null;
        editAbsDetail(params).then((res) => {
          this.showModal = false;
          this.$emit("reload");
          this.$Message.success(res.data.msg);
        });
      }
    },
    // 添加时段
    addTime(index, index2) {
      const timeDtoList =
        this.formData.strategyData.strategyList[0].content[index].strategyTimes[
          index2
        ].timeDtoList;
      if (timeDtoList.length >= 50) {
        this.$Message.warning("最多可添加50个时段");
      } else {
        timeDtoList.push(getPeriods());      
      }
    },
    // 删除时段
    deleteTime(index, index2, yIndex) {
      const timeDtoList =
        this.formData.strategyData.strategyList[0].content[index].strategyTimes[
          index2
        ].timeDtoList;
      timeDtoList.splice(yIndex, 1);
    },

    // 更新司机群组
    updateDriverGroupData(val) {      
      let flag = this.cureentAddCrowd;

      const { index, selectedData } = val;
       
       if(flag === 2){
        this.formData.strategyData.strategyList[1].content[index].tableData = [
        ...selectedData,
        ...this.formData.strategyData.strategyList[1].content[index].tableData,
      ];
       this.$refs.subForm_prices.validateField( 'content.' + index + '.tableData');
       }else{
          this.formData.strategyData.strategyList[0].content[index].tableData = [
        ...selectedData,
        ...this.formData.strategyData.strategyList[0].content[index].tableData,
      ];
        this.$refs.subForm.validateField( 'content.' + index + '.tableData');

      }    
         
    },
    // 选择司机群组
    initchecked(index, flag) {
      let groupsNo;
      if (flag === 2) {
        this.cureentAddCrowd = 2;
        groupsNo = this.formData.strategyData.strategyList[1].content[
          index
        ].tableData.map((item) => item.crowdCode);
      } else {
        this.cureentAddCrowd = 1; 
        groupsNo = this.formData.strategyData.strategyList[0].content[
          index
        ].tableData.map((item) => item.crowdCode);
      }    
      this.$refs.checked.init(groupsNo, index);
    },
    // 删除司机群组
    deleteDriverGroup(subindex, index, flag) {     
      let tableData;
      if (flag === 2) {
        tableData =
          this.formData.strategyData.strategyList[1].content[index].tableData;
      } else {
        tableData =
          this.formData.strategyData.strategyList[0].content[index].tableData;
      }
     
      tableData.splice(subindex, 1);
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
      //校验
      let contentList = JSON.parse(JSON.stringify(this.formData.strategyData.strategyList[0].content));
      let info = {
       flag: true,
       index_1:null,
       index_2:null
      }           
      let flagOver = true;  
     contentList.forEach( (item,index) => {
          if(!flagOver){
              return Promise.resolve(info);
          }
          item.strategyTimes.forEach((item2,index2) => {
              if(!flagOver){
              return Promise.resolve(info);
            }
              if(item2.timeDtoList.length > 1){
                 const times = item2.timeDtoList.map((item3) => {
                  return {
                    min: parseInt(item3.periods[0].split(":").join(), 10),
                    max: parseInt(item3.periods[1].split(":").join(), 10),
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
                         index_2: index2
                      };
                      flagOver = false;
                    }
                  }
                });
              });
                
              }

          }) 

     })    
      return Promise.resolve(info);
    },

    removeTableData(index, flag) {
      if (flag === 2) {
        this.formData.strategyData.strategyList[1].content =
          this.formData.strategyData.strategyList[1].content.filter(
            (item, i) => i !== index
          );
      } else {
        this.formData.strategyData.strategyList[0].content =
          this.formData.strategyData.strategyList[0].content.filter(
            (item, i) => i !== index
          );
      }
    },

    //司机分群校验数组保留一位小数
    checkNumber_1(val, index, index2, yIndex) {
      //  console.log(e);
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1})?$/;
      let info =
        this.formData.strategyData.strategyList[0].content[index].strategyTimes[
          index2
        ].timeDtoList[yIndex];
      if (!reg.test(val) && val) {
        setTimeout(() => {
          info.coefficient = this.numberCut(val, 1);
        }, 0);
      } else {
        info.coefficient = val;
      }
    },

    //司机高价格数组保留一位小数
    checkNumber_2(val, index) {
      //  console.log(e);
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1})?$/;
      let info = this.formData.strategyData.strategyList[1].content[index];
      if (!reg.test(val) && val) {
        setTimeout(() => {
          info.fphTimes = this.numberCut(val, 1);
        }, 0);
      } else {
        info.fphTimes = val;
      }
    },

    numberCut(val, index) {
      let p = Math.pow(10, index);
      let result = Math.floor(val * p) / p;
      return result;
    },

    //todo
    //切换选中的效果
    checkedWeek(index1, index2) {
      //保存切换的索引
      this.currentEditWeekIndex = index2;
      this.formData.strategyData.strategyList[0].content[index1].strategyTimes =
        this.formData.strategyData.strategyList[0].content[
          index1
        ].strategyTimes.map((item, index) => {
          if (index === index2) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
          return item;
        });
    },

    // 删除星期值
    deleteWeek(index1, index2) {
      this.formData.strategyData.strategyList[0].content[
        index1
      ].strategyTimes.splice(index2, 1);
    },
    // 是否是详情
    isDetail() {
      return this.fromSource === 3;
    },

    // 判断是否已经选中了所有星期
    isCheckedAllWeek(index1) {
      let arr = [];
      let max = 7;
      this.formData.strategyData.strategyList[0].content[
        index1
      ].strategyTimes.forEach((item, index) => {
        arr = [...arr, ...item.circulateTimes];
      });
      if (arr && arr.length === max) {
        return true;
      } else {
        return false;
      }
    },

    // 星期值新增/编辑
    initCheckedWeek(index, val, refName) {
      this.currentAddIndex = index;
      let data =
        this.formData.strategyData.strategyList[0].content[index].strategyTimes;
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
      //index是当前content的索引
      let index = this.currentAddIndex;
      //index2是当前星期的索引
      let index2 = this.currentEditWeekIndex;
      // let index2 =
      console.log(this.currentAddIndex);
      console.log(val);
      console.log("我要添加东西");
      let length = val.length;
      let handleWeek = this.handleWeek;
      let data =
        this.formData.strategyData.strategyList[0].content[index].strategyTimes;
      //用于判断是新增还是编辑
      if (handleWeek === 1) {
        data.push({
          circulateTimes: val[length - 1].circulateTimes,
          isChecked: false,
          timeDtoList: [getPeriods()],
        });

        if (data.length === 1) {
          data[0].isChecked = true;
          //校验下表单
            this.$refs.subForm.validateField( 'content.' + index + '.strategyTimes');
        }
      
      } else if (handleWeek === 2) {      
        const selectInfo = val.filter((item) => item.isChecked === true)[0];
        this.formData.strategyData.strategyList[0].content[index].strategyTimes[
          index2
        ].circulateTimes = selectInfo.circulateTimes;

        console.log(selectInfo);
      }
    },
 
  },
};
</script>

<style lang="less" src="../traffic-restriction/components/week-style.less"></style>
<style lang="less" scoped>
/deep/ .ivu-table-tip {
  overflow: hidden;
}
.timeDiv {
  /deep/ .ivu-select-dropdown {
  left: 0 !important;
}
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
.scroll-area {
  max-height: 450px;
  overflow-y: auto;
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
</style>


