<template>
  <Modal
    v-model="showModal"
    :title="title"
    width="800"
    draggable
  >
    <Form
      ref="form"
      inline="inline"
      :model="form.data"
      :label-width="85"
      :rules="form.validate"
    >
      <FormItem
        label="策略名称:"
        prop="strategyName"
      >
        <Input
          v-model="form.data.strategyName"
          clearable="clearable"
          style="width:300px"
          :maxlength="50"
        />
      </FormItem>
      <br />
      <FormItem
        label="业务线:"
        prop="expandBizLine"
      >
        <Select
          v-model="form.data.expandBizLine"
          clearable
          style="width:300px"
          @on-change="changeBusiness"
        >
          <Option
            v-for="(m, index) in businessGradeList"
            :key="index"
            :value="m.value"
          >
            {{m.label}}
          </Option>
        </Select>
      </FormItem>
      <br />
      <FormItem
        label="产品线:"
        prop="serviceType"
      >
        <Select
          v-model="form.data.serviceType"
          clearable
          style="width:300px"
          @on-change="changeProduct"
        >
          <Option
            v-for="(m, index) in prodoctLines"
            :key="index"
            :value="m.bizType"
          >
            {{m.bizTypeName}}
          </Option>
        </Select>
      </FormItem>
      <br />
      <FormItem
        label="车型等级:"
        prop="carLevelList"
      >
        <CheckboxGroup v-model="form.data.carLevelList">
          <Checkbox
            v-for="(item, index) in gradeListType"
            :key="index"
            :label="item.vehicleLevel"
          >
            {{item.vehicleName}}
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <br />
      <FormItem
        label="城市:"
        prop="cityCode"
      >
        <Select
          v-model="form.data.cityCode"
          style="width:300px"
          filterable
          clearable
          @on-change="hangleChangeCity"
        >
          <Option
            v-for="(value, key, index) in cityList"
            :key="key"
            :value="key"
          >
            {{value}}
          </Option>
        </Select>
      </FormItem>
      <br />
       <!-- 行政区域开始 -->
      <template v-if="form.data.cityCode">
        <FormItem label="行政区类型:" prop="areaType" >
          <Select
            v-model="form.data.areaType"
            style="width:300px"
            filterable
            clearable
          ><Option
              v-for="(item, index) in areaTypeList"
              :key="item.key"
              :value="item.key"
            >{{item.value}}</Option></Select>
        </FormItem>
        <br />
      </template>
      <template v-if="form.data.areaType===2">
        <FormItem  label="行政区:" prop="areaCode" >
          <Select
            v-model="form.data.areaCode"
            style="width:300px"
            filterable
            clearable
          >
            <Option
              v-for="(item, index) in districtList"
              :key="item.orgCode"
              :value="item.orgCode"
            >{{item.orgName}}</Option>
          </Select>
        </FormItem>
        <br />
      </template>
      <!-- 行政区域结束 -->
      <FormItem
        label="生效时间:"
        prop="effectDate"
      >
        <DatePicker
          v-model="form.data.effectDate"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm:ss"
          placement="bottom-end"
          placeholder="请选择生效时间"
          style="width: 300px"
          :editable="false"
        ></DatePicker>
      </FormItem>

      <br />
    </Form>
    <!-- 循环表单 -->
    <Form
      v-for="(item, index) in detailForm.data"
      :ref="'detailForm' + index"
      :key="index"
      :model="item"
      :rules="detailForm.validate"
      :label-width="100"
    >
      <div class="ml-20">
        {{"策略明细" + (index + 1)}}
      </div>
      <FormItem>
        <Button
          type="primary"
          class="mr-20"
          :disabled="index === 0"
          @click="upGo(detailForm.data, index)"
        >
          上移
        </Button>
        <Button
          type="primary"
          class="mr-20"
          :disabled="index === detailForm.data.length - 1"
          @click="downGo(detailForm.data, index)"
        >
          下移
        </Button>
        <Button
          type="primary"
          :disabled="index === 0 && detailForm.data.length === 1"
          @click="deleteGo(index)"
        >
          删除
        </Button>
      </FormItem>

      <FormItem
        label="时间段:"
        prop="dateTime"
        class="ml-50"
      >
        <TimePicker
          v-model="item.dateTime"
          confirm
          type="timerange"
          placement="bottom-end"
          placeholder="请选择时间段"
          style="width: 168px"
        ></TimePicker>
      </FormItem>

      <FormItem
        label="应答率:"
        prop="resRateFrom"
        class="ml-50"
        style="display:inline-block"
      >
        <Input
          v-model="item.resRateFrom"
          clearable="clearable"
          style="width:70px"
        />&nbsp;%
      </FormItem>
      <FormItem
        prop="resRateFromInclude"
        class="resRate"
      >
        <Checkbox
          v-model="item.resRateFromInclude"
        >
          包含&nbsp;&nbsp;&nbsp;&nbsp;至
        </Checkbox>
      </FormItem>
      <FormItem
        prop="resRateTo"
        class="resRate"
      >
        <Input
          v-model="item.resRateTo"
          clearable="clearable"
          style="width:70px"
        />&nbsp;%
      </FormItem>
      <FormItem
        prop="resRateToInclude"
        class="resRate"
      >
        <Checkbox v-model="item.resRateToInclude">
          包含
        </Checkbox>
      </FormItem>

      <FormItem
        label="最低呼叫数:"
        prop="minNum"
        class="ml-50"
        style="margin-top:5px"
      >
        <Input
          v-model="item.minNum"
          clearable="clearable"
          style="width:300px"
          :maxlength="14"
        />
      </FormItem>
      <FormItem
        label="浮动折扣系数:"
        prop="rate"
        class="ml-50"
      >
        <Input
          v-model="item.rate"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入0-10，最多支持2位小数"
        />
      </FormItem>
      <FormItem
        label="加价系数上限:"
        prop="markupRateTo"
        class="ml-50"
      >
        <Input
          v-model="item.markupRateTo"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入0-50，最多支持2位小数"
        />
        <span>%</span>
        <div>
          1、加价金额不超过封顶金额，浮动折扣系数*基础折扣（或六边形临时折扣）＞加价系数上限的情况下，使用加价系数定价，即行程费用=基础定价*(1+加价系数上限)<br>
          2、加价上限不得超过基础定价的50%。
        </div>
      </FormItem>
      <FormItem
        label="加价封顶金额:"
        prop="markupFareTo"
        class="ml-50"
      >
        <Input
          v-model="item.markupFareTo"
          clearable="clearable"
          style="width:300px"
          placeholder="请输入0-30，最多支持2位小数"
        />
        <span>元</span>
        <div>
          1、行程费用＞基础定价+加价封顶金额，使用加价封顶金额，即行程费用=基础定价+加价封顶金额<br>
          2、加价封顶金额最高不得超过30元。
        </div>
      </FormItem>
    </Form>
    <Button
      type="primary"
      @click="addDetail"
    >
      添加策略明细
    </Button>

    <div slot="footer">
      <Button @click="showModal = false">
        取消
      </Button>
      <Button
        v-lazy-click="saveData"
        type="primary"
      >
        保存
      </Button>
    </div>
  </Modal>
</template>

<script>
import { validatorTime, gradeListByType } from "./fields";
import { floatAdd } from "_o/api/priceCenter";
import { mapState } from "vuex";
import {getAreaInfoByCityCode} from '_o/api/configData.js'
export default {
  name: "add",
  props: ["cityList"],
  data() {
    return {
      showModal: false,
      showSixModal: false,
      title: "新增策略",
      gradeListType: [], // 车型等级数据源
      form: {
        data: {
          strategyName: "", // 策略名称
          expandBizLine: "", // 业务线
          serviceType: "", // 产品线
          cityCode: "", // 城市code
          carLevelList: [], // 车型等级
          effectDate: [] // 生效时间
        },
        validate: {
          strategyName: [
            {
              required: true,
              message: "必填",
              trigger: "change"
            },
            {
              pattern: /^[^\s]{1,50}$/,
              message: "不能输入空格且最多50位",
              trigger: "change"
            }
          ],
          expandBizLine: [{ required: true, message: "必选" }],
          serviceType: [{ required: true, message: "必选" }],
          carLevelList: [{ required: true, message: "必选" }],
          cityCode: [{ required: true, message: "必选" }],
          areaCode:[{ required: true, message: "必选" }],
          effectDate: [
            {
              required: true,
              validator: validatorTime
            }
          ]
        }
      },
      detailForm: {
        // 表单数据
        data: [
          {
            dateTime: ""
          },
          {
            dateTime: ""
          }
        ],
        // 表单校验规则
        validate: {
          dateTime: [
            {
              required: true,
              validator: validatorTime
            }
          ],
          resRateFrom: [
            {
              required: true,
              validator: this.validatorResRate
            }
          ],
          resRateTo: [
            {
              required: true,
              validator: this.validatorResRate
            }
          ],
          minNum: [
            {
              required: true,
              message: "必填"
            },
            {
              pattern: /^(0|[1-9][0-9]*)$/,
              message: "不小于0的整数",
              trigger: "change"
            }
          ],
          rate: [
            {
              required: true,
              message: "必填"
            },
            {
              pattern: /^([0-9].[0-9]{1,2}|[1-9]|10|10.0|10.00)$/,
              message: "0~10之间，最多两位小数",
              trigger: "change"
            }
          ],
          markupRateTo: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请输入加价系数上限"))
                }
                if (value < 0 || value > 50) {
                  callback(new Error("请输入0-50之间的数字"))
                } else if (!/^(([1-9]\d*)|(0))(\.\d{1,2})?$/.test(value)) {
                  callback(new Error("请输入最多两位小数的数字"))
                }
                callback()
              }
            },
          ],
          markupFareTo: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error("请输入加价封顶金额"))
                }
                if (value < 0 || value > 30) {
                  callback(new Error("请输入0-30之间的数字"))
                } else if (!/^(([1-9]\d*)|(0))(\.\d{1,2})?$/.test(value)) {
                  callback(new Error("请输入最多两位小数的数字"))
                }
                callback()
              }
            },
          ]
        }
      },
      prodoctLines: [], // 产品线
      areaTypeList:[
        {
          key:1,
          value:"市级"
        },
        {
          key:2,
          value:"区县级"
        }
      ], // 行政区类型
      districtList:[]  // 区县集合
    };
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList
    })
  },
  mounted() {},
  methods: {
    init() {
      this.$refs.form.resetFields();
      this.detailForm.data.forEach((item, index) => {
        let detailForm = "detailForm" + index;
        this.$refs[detailForm][0].resetFields();
      });
      this.showModal = true;
      this.form.data = {
        strategyName: "", // 策略名称
        serviceType: "4", // 业务类型。只能选择一项
        cityCode: "", // 城市编码
        carLevelList: [], // 车级类型
        effectDate: [] // 生效时间
      };
      this.gradeListType = []
      this.detailForm.data = [
        {
          dateTime: ["00:00:00", "23:59:59"],
          resRateFrom: "",
          resRateFromInclude: false,
          resRateTo: "",
          resRateToInclude: false,
          minNum: "",
          rate: "",
          markupRateTo: "",
          markupFareTo: ""
        }
      ];
    },
    hangleChangeCity(v){
      if(!v){
        this.districtList=[];
        return
      }
      const cityCode = v;
      getAreaInfoByCityCode({cityCode}).then(res=>{
        if(res.data.success){
          this.districtList = res.data.data
        }else{
          this.districtList=[];
        }
      })
    },
    addDetail() {
      if (this.detailForm.data.length === 50) {
        return;
      }
      this.detailForm.data.push({
        dateTime: ["00:00:00", "23:59:59"],
        resRateFrom: "",
        resRateFromInclude: false,
        resRateTo: "",
        resRateToInclude: false,
        minNum: "",
        rate: "",
        markupRateTo: "",
        markupFareTo: ""
      });
    },
    // selectServiceType(t) {
    //   this.form.data.carLevelList = [];
    //   this.gradeListType = gradeListByType(Number(t))
    // },
    saveData() {
      let formValid = false;
      this.$refs.form.validate(valid => {
        let flag = 0;
        let length = this.detailForm.data.length;
        // 循环表单判断
        this.detailForm.data.forEach((item, index) => {
          let detailForm = "detailForm" + index;
          this.$refs[detailForm][0].validate(detailFormValid => {
            if (detailFormValid) {
              flag++;
            }
            if (flag === length && valid) {
              // 校验成功
              this.addData();
            }
          });
        });
      });
    },
    addData() {
      // 增加sort字段
      let flag = true;
      this.detailForm.data = this.detailForm.data.map((item, index) => {
        item.sort = index + 1;
        item.startTime = item.dateTime[0];
        item.endTime = item.dateTime[1];
        if (Number(item.resRateFrom) > Number(item.resRateTo)) {
          flag = false;
        }
        return item;
      });
      if (!flag) {
        this.$Message.warning("应答率下限值不能大于应答率上限值");
        return;
      }
      const selectArea = this.districtList.find(item => item.orgCode  === this.form.data.areaCode);
      let params = {
        strategyName: this.form.data.strategyName,
        serviceType: Number(this.form.data.serviceType),
        cityCode: this.form.data.cityCode,
        carLevelList: this.form.data.carLevelList,
        effectiveTimeBegin: this.form.data.effectDate[0],
        effectiveTimeEnd: this.form.data.effectDate[1],
        strategyInfoReqList: this.detailForm.data,
        areaCode: this.form.data.areaCode,
        areaType: this.form.data.areaType,
        areaName: selectArea?selectArea.orgName:"",
        expandBizLine: this.form.data.expandBizLine
      };
      floatAdd(params).then(res => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    },
    deleteGo(index) {
      this.detailForm.data.splice(index, 1);
    },
    upGo(fieldData, index) {
      if (index != 0) {
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
      } else {
        fieldData.push(fieldData.shift());
      }
    },
    downGo(fieldData, index) {
      if (index != fieldData.length - 1) {
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
      } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
      }
    },
    // 校验应答率
    validatorResRate(rule, value, callback) {
      if (!value) {
        callback(new Error("必填"));
      } else {
        let reg = /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/;
        if (!reg.test(value)) {
          callback(new Error("0~100之间，最多2位小数"));
        } else {
          callback();
        }
      }
    },
    // 变更业务线下拉
    changeBusiness(value) {
      const business = this.businessGradeList.find(v => v.value === value)
      this.$nextTick(() => {
        this.form.data.serviceType = "" // 清空下级
        this.gradeListType = []
        this.prodoctLines = business.children || [] // 赋值产品线
      })
    },
    // 产品线下拉
    changeProduct(val) {
      const product = this.prodoctLines.find(v => v.bizType === val)
      this.$nextTick(() => {
        this.form.data.carLevelList = [] // 清空下级
        this.gradeListType = product.levels || [] // 赋值车型等级
      })
    }
  }
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
</style>
