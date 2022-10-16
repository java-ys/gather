
<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      width="800"
      :z-index="1"
      :mask-closable="false"
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
          <Input
            v-model="form.ruleName"
            clearable="clearable"
            style="width:300px"
            :maxlength="50"
          />
        </FormItem>
        <br />
        <FormItem
          label="产品线:"
          prop="businessType"
        >
          <Select
            v-model="form.businessType"
            style="width:300px"
            @on-change="selectbusinessType"
          >
            <Option :value="4">
              快享
            </Option>
            <Option :value="2">
              专享
            </Option>
          </Select>
        </FormItem>
        <br />

        <FormItem
          label="城市:"
          prop="cityCode"
        >
          <Select
            v-model="form.cityCode"
            style="width:300px"
            filterable
            clearable
            @on-change="cityOnchange"
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
        <FormItem
          label="车型等级:"
          prop="carLevelList"
        >
          <CheckboxGroup v-model="form.carLevelList">
            <Checkbox
              v-if="form.businessType === 4"
              :label="1"
            >
              快享
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 2"
              :label="2"
            >
              舒适型
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 2"
              :label="3"
            >
              行政型
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 2"
              :label="4"
            >
              商务型
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 2"
              :label="5"
            >
              尊贵型
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 2"
              :label="9"
            >
              豪华型
            </Checkbox>
            <Checkbox
              v-if="form.businessType === 4"
              :label="10"
            >
              惠享
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <br />

        <FormItem
          label="生效时间:"
          prop="effectDate"
        >
          <DatePicker
            v-model="form.effectDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            placement="bottom-end"
            placeholder="请选择生效时间"
            style="width: 300px"
            :editable="false"
          ></DatePicker>
        </FormItem>
        <br />
        <div class="flex-box-hexagon-discount">
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
          <div v-if="form.effectPeriodType === 2">
            <Form
              v-for="(item,index) in limitTimeList"
              :ref="'timeForm' + index"
              :key="index - 100"
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
                v-if="index > 0"
                class="remove-icon"
                type="md-close-circle"
                @click="removeTime(index)"
              />
            </Form>
            <Icon
              v-if="limitTimeList.length < 5"
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
          <Input
            v-model="form.discountRate"
            clearable="clearable"
            style="width:300px"
          />
        </FormItem>
        <br />
        <FormItem
          label="折扣上限:"
          prop="discountUpLimit"
        >
          <Input
            v-model="form.discountUpLimit"
            clearable="clearable"
            style="width:300px"
          />&nbsp;元
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
import { validatorTime, validValue } from "./fields";
import { hexagonAdd } from "_o/api/more-day-car";
import hexagonModal from "./hexagonModal";
import { mapActions, mapState } from "vuex";

export default {
  name: "add",
  components: {
    hexagonModal
  },
  props: ["cityList"],
  data() {
    return {
      showModal: false,
      showSixModal: false,
      title: "新增策略",
      form: {},
      limitTimeList: [
        { timeItem: [] },
      ],
      cityUuid: "",
      departureHexagonList: [], // 六边形出发点集合
      destinationHexagonList: [], // 目的地出发点集合
      validateForm: {
        ruleName: [
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
        businessType: [{ required: true, message: "必选" }],
        cityCode: [{ required: true, message: "必选" }],
        carLevelList: [{ required: true, message: "必选" }],
        effectPeriodType: [{ required: true, message: "必选" }],
        effectDate: [
          {
            required: true,
            validator: validatorTime
          }
        ],
        sixData: [
          { required: true, message: "出发点和目的地六边形至少选择一个" }
        ],
        discountRate: [
          {
            required: true,
            message: "必填"
          },
          {
            pattern: /^(0.[0-9]{1,2}|1)$/,
            message: "0~1之间，最多两位小数",
            trigger: "change"
          }
        ],
        discountUpLimit: [
          {
            pattern: /^(\d+|\d+\.\d{1,2})$/,
            message: "大于0的数字，最多2位小数",
            trigger: "change"
          }
        ],
        timeItem: [
          { required: true, type: "array", min: 2, message: "请选择限定时段", trigger: "change" },
          { trigger: "change", validator: validValue }
        ]
      },
    };
  },
  computed: mapState({
    authCityList: state => state.common.authCityList
  }),
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
    init() {
      this.$refs.form.resetFields();
      this.showModal = true;
      this.form = {
        ruleName: "", // 策略名称
        businessType: 4, // 业务类型。只能选择一项
        cityCode: "", // 城市编码
        carLevelList: [], // 车级类型
        effectDate: [], // 生效时间
        sixData: "",
        discountRate: "", // 折扣系数
        discountUpLimit: "", // 折扣上限
        effectPeriodType: 1,  // 是否限定时段
      };
      this.cityUuid = ""
      this.limitTimeList = [{ timeItem: [] }]
      this.departureHexagonList = []; // 六边形出发点集合
      this.destinationHexagonList = []; // 目的地出发点集合
    },
    // 用于接收选择六边形页面传回的数据
    getSixData(val) {
      if (val.flag === 1) {
        this.departureHexagonList = val.data;
      } else {
        this.destinationHexagonList = val.data;
      }
    },
    selectbusinessType() {
      this.form.carLevelList = [];
    },
    async saveData() {
      let status = true
      let timeList = []
      let time = {}
      if (this.form.effectPeriodType === 2) {
        await this.limitTimeList.forEach((item, index) => {
          time = {
            startTime: item.timeItem[0],
            endTime: item.timeItem[1]
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
    cityOnchange() {
      this.departureHexagonList = []; // 六边形出发点集合
      this.destinationHexagonList = []; // 目的地出发点集合
      this.authCityList.forEach((item, index) => {
        if (item.value === this.form.cityCode) {
          this.cityUuid = item.id
        }
      })
    },
    startAdd() {
      if (!this.form.cityCode) {
        this.$Message.warning("请先选择城市");
        return;
      }
      this.showSixModal = true;
      this.$nextTick(() => {
        this.$refs.hexagonModal.init({
          flag: 1,
          cityCode: this.form.cityCode,
          cityName: this.cityList[this.form.cityCode],
          data: this.departureHexagonList,
          cityUuid: this.cityUuid
        });
      });
    },
    endAdd() {
      if (!this.form.cityCode) {
        this.$Message.warning("请先选择城市");
        return;
      }
      this.showSixModal = true;
      this.$nextTick(() => {
        this.$refs.hexagonModal.init({
          flag: 2,
          cityCode: this.form.cityCode,
          cityName: this.cityList[this.form.cityCode],
          data: this.destinationHexagonList,
          cityUuid: this.cityUuid
        });
      });
    },
    addData(timeList) {
      let params = {
        ruleName: this.form.ruleName,
        businessType: Number(this.form.businessType),
        cityCode: this.form.cityCode,
        carLevelList: this.form.carLevelList,
        effectiveTime: this.form.effectDate[0],
        failureTime: this.form.effectDate[1],
        departureHexagonList: this.departureHexagonList,
        destinationHexagonList: this.destinationHexagonList,
        discountRate: this.form.discountRate,
        discountUpLimit: this.form.discountUpLimit,
      };
      if (this.form.effectPeriodType === 2) {
        params.timeRangeDtos = timeList
      }
      hexagonAdd(params).then(res => {
        this.showModal = false;
        this.$emit("reload");
        this.$Message.success(res.data.msg);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.flex-box-hexagon-discount{
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

