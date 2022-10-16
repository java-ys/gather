/*
 * @Author: Evil Cheng
 * @Date: 2021-11-18 10:16:34
 * @LastEditTime: 2021-11-22 10:01:13
 * @Description:
 */
import { validNumber, effectiveTime } from "../../validate"
import { mapState } from "vuex";
export default {
  data() {
    return {
      DatePickerOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      timeRangeValidate: (item) => (rule, value, callback) => {
        if (!value && value !== 0) {
          callback(new Error("时间范围不能为空"));
        }
        if (item.minHour && item.maxHour && item.minHour >= item.maxHour) {
          callback(new Error("时间范围结束数值不能大于或者等于起始数值"));
        }
        callback();
      },
      validNumber: [
        { type: "number", required: true, message: "司机报价系数不能为空", trigger: "blur" },
        { validator: validNumber, trigger: "blur" }
      ], // 重新赋值到data里，这样动态可以直接用
      formRules: {
        ruleName: [{ required: true, message: "策略名称不能为空", trigger: "blur" }],
        provinceCityCode: [
          { type: "array", required: true, message: "请选择城市", trigger: "change" }
        ],
        extendBizType: [
          { type: "number", required: true, message: "请选择业务线", trigger: "change" }
        ],
        businessType: [
          { type: "number", required: true, message: "请选择产品线", trigger: "change" }
        ],
        carLevelList: [
          { type: "array", required: true, message: "请选择车型等级", trigger: "change" }
        ],
        source: [
          { type: "number", required: true, message: "请选择渠道", trigger: "change" }
        ],
        typeTime: [
          { type: "number", required: true, message: "请选择订单类型", trigger: "change" }
        ],
        effectiveTime: [
          { type: "date", required: true, message: "生效时间不能为空", trigger: "change" },
          { validator: effectiveTime, trigger: "change" }
        ],
      },
    }
  },
  computed: {
    ...mapState({
      channelList: state => state.common.channel,
      businessGradeList: state => state.common.businessGradeList
    }),
    businessList() {
      // 业务线： 过滤接送机业务线
      const list = this.businessGradeList.filter(v => v.expandBizLine === 8 || v.expandBizLine === 9);
      return list;
    }
  },
  methods: {
    deleteDispatch(type, item, index) {
      // 删除播单
      switch (type) {
        case 1:
          // 优质
          this.formData.highDispatch.splice(index, 1);
          break;
        case 2:
          // 全城
          this.formData.wholeCityDispatch.splice(index, 1);
          break;
        case 3:
          // 直接
          this.formData.directDispatch.splice(index, 1);
          break;
        case 4:
          // 人工
          this.formData.workDispatch.splice(index, 1);
          break;
        default:
          break;
      }
    },
    addDispatch(type) {
      // 新增播单
      const item = {
        minHour: null,
        maxHour: null,
        driverRate: null
      };
      switch (type) {
        case 1:
          // 优质
          this.formData.highDispatch.push(item);
          break;
        case 2:
          // 全城
          this.formData.wholeCityDispatch.push(item);
          break;
        case 3:
          // 直接
          this.formData.directDispatch.push(item);
          break;
        case 4:
          // 人工
          this.formData.workDispatch.push(item);
          break;
        default:
          break;
      }
    },
    encodeDispatchList(formData) {
      formData.dispatchList = [];
      // 就是一个方法
      const repeatTool = (prop, type) => {
        const list = formData[prop] || [];
        list.forEach(item => {
          formData.dispatchList.push({
            ...item,
            type
          });
        });
      }

      repeatTool("highDispatch", 1);
      repeatTool("wholeCityDispatch", 2);
      repeatTool("directDispatch", 3);
      repeatTool("workDispatch", 4);
    },
    decodeDispathList(data) {
      if (!data.dispatchList) {
        return
      }
      data.highDispatch = [];
      data.wholeCityDispatch = [];
      data.directDispatch = [];
      data.workDispatch = [];
      data.dispatchList.forEach(item => {
        switch (item.type) {
          case 1:
            // 优质
            data.highDispatch.push(item);
            break;
          case 2:
            // 全城
            data.wholeCityDispatch.push(item);
            break;
          case 3:
            // 直接
            data.directDispatch.push(item);
            break;
          case 4:
            // 人工
            data.workDispatch.push(item);
            break;
          default:
            break;
        }
      })
    }
  },
}
