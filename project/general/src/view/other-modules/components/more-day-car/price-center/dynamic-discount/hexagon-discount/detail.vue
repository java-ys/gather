
<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      width="800"
    >
      <Form
        ref="form"
        inline="inline"
        :model="form"
        :label-width="85"
        :rules="validateForm"
      >
        <FormItem
          label="策略名称:"
          prop="ruleName"
        >
          <div>{{form.ruleName}}</div>
        </FormItem>
        <br />
        <FormItem
          label="产品线:"
          prop="businessType"
        >
          <div>{{form.businessType}}</div>
        </FormItem>
        <br />
        <FormItem
          label="城市:"
          prop="cityName"
        >
          <div>{{form.cityName}}</div>
        </FormItem>
        <br />
        <FormItem
          label="车型等级:"
          prop="carLevel"
        >
          <div>{{form.carLevel}}</div>
        </FormItem>
        <br />

        <FormItem
          label="生效时间:"
          prop="effectDate"
        >
          <DatePicker
            v-model="form.effectDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            placement="bottom-end"
            placeholder="请选择生效时间"
            style="width: 260px"
            @on-change="selectDate"
          ></DatePicker>
        </FormItem>
        <br />
        <div class="flex-box">
          <FormItem
            label="限定时段:"
            prop="effectPeriodType"
          >
            <Select
              v-model="form.effectPeriodType"
              placeholder="请选择"
              style="width:150px;"
            >
              <Option :value="1">
                不限时段
              </Option>
              <Option :value="2">
                限定时段
              </Option>
            </Select>
          </FormItem>
          <div v-if="form.effectPeriodType ===2">
            <Form
              v-for="(item,index) in limitTimeList"
              :ref="'timeForm'+index"
              :key="index-100"
              :model="item"
              :rules="validateForm"
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
        <br />
        <FormItem
          label="限定区域:"
          prop="sixData"
        >
          <div style="margin-top:20px">
            出发点六边形: &nbsp;&nbsp;<Button
              v-lazy-click="startAdd"
              type="primary"
            >
              选择
            </Button>&nbsp;&nbsp;&nbsp;&nbsp;已选择六边形数:
            {{departureHexagonList.length}}
          </div>
          <div style="margin-top:20px">
            目的地六边形: &nbsp;&nbsp;<Button
              v-lazy-click="endAdd"
              type="primary"
            >
              选择
            </Button>&nbsp;&nbsp;&nbsp;&nbsp;已选择六边形数:
            {{destinationHexagonList.length}}
          </div>
        </FormItem>
        <br />
        <FormItem
          label="折扣系数:"
          prop="discountRate"
        >
          <div>{{form.discountRate}}</div>
        </FormItem>
        <br />
        <FormItem
          label="折扣上限:"
          prop="discountUpLimit"
        >
          <div v-if="form.discountUpLimit">
            {{form.discountUpLimit}}元
          </div>
        </FormItem>
      </Form>
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
      <hexagonModal
        v-if="showSixModal"
        ref="hexagonModal"
        @getSixData="getSixData"
        @close="close"
      />
    </Modal>
  </div>
</template>

<script>
import {
  getServiceTypeName,
  getcarLevelName,
  validatorTimeDetail,
  validValue
} from "./fields";
import { hexagonDetail, hexagonEdit } from "_o/api/more-day-car";
import hexagonModal from "./hexagonModal";

export default {
  name: "detail",
  components: {
    hexagonModal
  },
  data() {
    return {
      showModal: false,
      showSixModal: false,
      limitTimeList: [],
      uuid: "",
      title: "策略详情",
      cityUuid:'',
      form: {
        ruleName: "", // 策略名称
        businessType: "", // 业务类型。只能选择一项
        cityName: "", // 城市编码
        carLevel: "", // 车级类型
        effectDate: [], // 生效时间
        discountRate: "", // 折扣系数
        discountUpLimit: "" // 折扣上限
      },
      validateForm: {
        ruleName: [{ required: true }],
        businessType: [{ required: true }],
        cityName: [{ required: true }],
        carLevel: [{ required: true }],
        effectDate: [
          {
            required: true,
            validator: validatorTimeDetail
          }
        ],
        sixData: [
          { required: true, message: "出发点和目的地六边形至少选择一个" }
        ],
        discountRate: [{ required: true }],
        timeItem: [
          { required: true, type: "array", min: 2, message: "请选择限定时段", trigger: "change" },
          { trigger: "change", validator: validValue }
        ]
      },
      cityCode: "",
      departureHexagonList: [], // 六边形出发点集合
      destinationHexagonList: [] // 目的地出发点集合
    };
  },
  methods: {
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
    close() {
      this.showSixModal = false;
    },
    init(val) {
      this.showModal = true;
      this.uuid = val.uuid;
      this.cityCode = val.cityCode;
      this.cityUuid=val.cityId
      this.form = {
        ruleName: val.ruleName, // 策略名称
        businessType: getServiceTypeName(val.businessType), // 业务类型
        cityName: val.cityName, // 城市
        carLevel: getcarLevelName(val.carLevel), // 车级类型
        effectDate: [val.effectiveTime, val.failureTime], // 生效时间
        discountRate: val.discountRate, // 折扣系数
        discountUpLimit: val.discountUpLimit, // 折扣上限
        effectPeriodType: 1,  // 是否分时段
      };
      this.form.effectPeriodType= val.timeRangeDtos.length===0 ? 1 : 2
      this.limitTimeList= val.timeRangeDtos.length===0 ? [{ timeItem: [] }] : []
      val.timeRangeDtos.forEach((item, index) => {
        var time={timeItem:[]}
        time.timeItem[0]=item.startTime
        time.timeItem[1]=item.endTime
        this.limitTimeList.push(time)
      })
      this.departureHexagonList = val.departureHexagonList; // 六边形出发点集合
      this.destinationHexagonList = val.destinationHexagonList; // 目的地出发点集合
    },
    selectDate(date) {
      this.form.effectDate = date;
    },
    async saveData() {
      let status = true
      let timeList=[]
      let time={}
      if(this.form.effectPeriodType==2){
        await this.limitTimeList.forEach((item, index) => {
          time={
            startTime:item.timeItem[0],
            endTime:item.timeItem[1]
          }
          timeList.push(time)
          let key = "timeForm" + index
          this.$refs[key][0].validate(vaild => {
            if (!vaild) {
              status = false
            }
          })
        })
      }
      if (
        this.departureHexagonList.length > 0 ||
        this.destinationHexagonList.length > 0
      ) {
        this.form.sixData = 1;
      }
      this.$refs.form.validate(valid => {
        if (valid && status) {
          this.addData(timeList);
        }
      });
    },
    // 获取六边形集合数据
    getSixData(val) {
      if (val.flag === 1) {
        this.departureHexagonList = val.data;
      } else {
        this.destinationHexagonList = val.data;
      }
    },
    startAdd() {
      this.showSixModal = true;
      this.$nextTick(() => {
        this.$refs.hexagonModal.init({
          flag: 1,
          cityName: this.form.cityName,
          cityCode: this.cityCode,
          data: this.departureHexagonList,
          cityUuid:this.cityUuid
        });
      });
    },
    endAdd() {
      this.showSixModal = true;
      this.$nextTick(() => {
        this.$refs.hexagonModal.init({
          flag: 2,
          cityName: this.form.cityName,
          cityCode: this.cityCode,
          data: this.destinationHexagonList,
          cityUuid:this.cityUuid
        });
      });
    },
    addData(timeList) {
      let params = {
        uuid: this.uuid,
        effectiveTime: this.form.effectDate[0],
        failureTime: this.form.effectDate[1],
        departureHexagonList: this.departureHexagonList,
        destinationHexagonList: this.destinationHexagonList,
        discountRate: this.form.discountRate,
        discountUpLimit: this.form.discountUpLimit
      };

      if(this.form.effectPeriodType===2){
        params.timeRangeDtos=timeList
      }
      hexagonEdit(params).then(res => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    }
  }
};
</script>
<style lang="less">
.ivu-modal-no-mask {
  pointer-events: auto;
}
.flex-box{
  display: flex;
  justify-content: flex-start;
}
.remove-icon{
  position: absolute;
  left:280px;
  top:7px;
  font-size: 20px;
  color: #f55932;
  cursor: pointer;
}
.add-icon{
  font-size: 20px;
  color: #19be6b;
  margin-left:60px;
  position: relative;
  top:-6px;
}
</style>

