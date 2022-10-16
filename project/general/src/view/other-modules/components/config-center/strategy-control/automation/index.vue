<template>
  <div>
    <Form
      :model="serachPrams"
      :label-width="80"
    >
      <Row>
        <Col
          span="6"
          style="max-width:250px"
        >
        <FormItem label="适用城市">
          <Select
            v-model="serachPrams.cityCode"
            style="width:140px"
            label-in-value
            placeholder="请选择"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in openCityList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        </Col>

        <Col
          span="6"
          style="max-width:250px"
        >
        <FormItem label="产品线">
          <Select
            v-model="serachPrams.productLine"
            style="width:140px"
            label-in-value
            placeholder="请选择"
          >
            <!-- eslint-disable -->
            <Option
              v-for="item in gradeInfo"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
            <!-- eslint-enable -->
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem>
          <Button
            type="primary"
            @click="searchTap"
          >
            搜索
          </Button>
          <Button
            style="margin-left: 8px"
            @click="resetTap"
          >
            清空
          </Button>
        </FormItem>
        </Col>
      </row>
    </Form>

    <Button
      type="primary"
      @click="addNew"
    >
      新建策略
    </Button>
    <Table
      style="margin-top:20px"
      border
      :columns="tableColumns"
      :data="tableData"
    >
      <template
        slot="action"
        slot-scope="{ row }"
      >
        <Button
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="buttonClick('details',row)"
        >
          详情
        </Button>
        <Button
          ghost
          type="success"
          size="small"
          class="tableBtn"
          style="margin-right: 5px"
          @click="buttonClick('edit',row)"
        >
          编辑
        </Button>
      </template>
    </Table>
    <Page
      :total="total"
      show-elevator
      show-sizer
      show-total
      style="float:right;margin-top:20px"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    />
    <!-- 进线自动化策略-新建编辑 fullscreen-->
    <modal
      v-model="automationModal"
      :title="automationTitle"
      :width="1000"
      :mask-closable="false"
      @on-cancel="cancelAutomationModal"
    >
      <Form
        v-if="isAutomationAdd"
        ref="automationForm"
        :rules="ruleValidate"
        :model="automationModelData"
        :label-width="100"
      >
        <Row>
          <Col span="6">

          <FormItem
            label="适用城市："
            prop="cityCode"
          >
            <Select
              v-model="automationModelData.cityCode"
              style="width:140px"
              label-in-value
              placeholder="请选择"
              @on-change="automationCityChange"
            >
              <!-- eslint-disable -->
              <Option
                v-for="item in openCityList"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</Option>
              <!-- eslint-enable -->
            </Select>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem
            label="产品线："
            prop="productLines"
          >
            <Select
              v-model="automationModelData.productLines"
              style="width:140px"
              placeholder="请选择"
              multiple
            >
              <!-- eslint-disable -->
              <Option
                v-for="item in gradeInfo"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</Option>
              <!-- eslint-enable -->
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <Row
        v-else
        style="margin:0 0 25px 15px"
      >
        <Col span="6">
        <div>
          <span class="label">适用城市：</span>
          <span>{{ bookingcityName }}</span>
        </div>
        </Col>
        <Col span="7">
        <div>
          <span class="label">产品线：</span>
          <span>{{ (gradeInfo.find(it => it.value === Number(automationModelData.productLines))||{}).label||"" }}</span>
        </div>
        </Col>
      </Row>
      <p style="padding-bottom:10px;padding-left:15px">
        <span
          class="start"
        >*</span>场景策略配置</span>
      </p>
      <Table
        border
        :columns="automationEditTableLabel"
        :data="automationData"
      >
        <template
          slot="level"
          slot-scope="{ row }"
        >
          <div v-if="row.key !== 'ComplaintP' && row.key !== 'PickLostBelongs'">
            <Input
              v-if="!isAutomationEdit"
              v-model="row.level"
              :maxlength="2"
              style="width:80px"
              size="small"
              placeholder="请输入"
              @on-change="levelChange(row)"
            />
            <template v-else>
              {{ row.level }}
            </template>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="{ row }"
        >
          <div>
            自订单时间
            <Input
              v-if="!isAutomationEdit"
              v-model="row.value"
              style="width:80px"
              size="small"
              placeholder="请输入"
              @on-change="automationChange(row)"
            />
            <template v-else>
              {{ row.value }}
            </template>
            日内可投诉
          </div>
        </template>
      </Table>
      <div slot="footer">
        <Button
          v-if="!isAutomationEdit"
          type="text"
          @click="cancelAutomationModal"
        >
          取消
        </Button>
        <Button
          v-lazy-click="automationSubmit"
          :loading="loading"
          type="primary"
        >
          确定
        </Button>
      </div>
    </modal>
  </div>
</template>

<script>
import {
  axiosSetCityList,
} from "_g/api/common.js"
import {
  automationInitData
} from "../components/fields"
import {
  addAutoWOrderConfig,
  editAutoWOrderConfig,
  getAutoWOrderConfigList
} from "_o/api/configData.js"
import { mapState } from "vuex";
import { deepClone } from "@/libs/util"
export default {
  data() {
    return {
      automationEditTableLabel: [
        {
          title: "场景名称",
          key: "name"
        },
        {
          title: "分类",
          key: "type"
        },
        {
          title: "行程卡片优先级",
          key: "level",
          slot: "level",
          width: 130,
          align: "center"
        },
        {
          title: "追溯限制",
          slot: "action",
          width: 300,
          align: "center"
        }
      ],
      tableColumns: [
        {
          title: "适用城市",
          key: "cityName"
        },
        {
          title: "产品线",
          key: "productLineDoec",
          render: (h, params) => {
            return h("span", (this.gradeInfo.find(it => it.value === Number(params.row.productLine))||{}).label||"")
          }
        },
        {
          title: "更新时间",
          key: "updateTime"
        },
        {
          title: "操作人",
          key: "updater"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      serviceTypeMap: {
        1: "出租车",
        2: "专享",
        4: "快享",
        5: "顺风车",
        8: "包车",
        11: "企业用车"
      },
      automationBusinessValue: {
        LostBelongings: "",
        BillDoubt: "",
        DriverCycleRoad: "",
        BillNoService: "",
        DriverBadManner: "",
        RefundProblem: "",
        DriverRefuseSer: "",
        DCarNoMatch: "",
        DriverHarass: "",
        PreCharge: "",
        MoreExtraFare: "",
        PickLostBelongs: "",
        ComplaintP: "",
      },
      orderValue: {},
      ruleValidate: {
        cityCode: [
          { required: true, message: "请选择城市", trigger: "change" }
        ],
        productLines: [
          { required: true, type: "array", message: "请选择产品线", trigger: "change" }
        ],
      },
      tableData: [],
      pageParams: {
        pageSize: 10,
        currPage: 1
      },
      automationModelData: {},
      isAutomationEdit: false,
      automationModal: false,
      automationData: deepClone([], automationInitData),
      openCityList: [],
      automationTitle: "",
      bookingcityName: "",
      loading: false,
      total: 0,
      serachPrams: {
        cityCode: "",
        productLines: ""
      },
      isAutomationAdd: true
    }
  },
  computed:{
    ...mapState({
      gradeInfo: state => state.common.bizTypeList
    }),
  },
  mounted() {
    this.getCoopCityList();
    this.getList()
  },
  methods: {
    buttonClick(type, row) {
      this.getAutomationDetail(row);
      this.isAutomationEdit = type === "details";
      this.automationTitle = type === "details" ? "进线自动化策略详情" : "编辑进线自动化策略";
    },
    getAutomationDetail(res) {
      let dataContent = JSON.parse(res.dataContent);
      let orderValue = res.orderValue ? JSON.parse(res.orderValue) : {};
      orderValue.LostBelongings = orderValue.LostBelongings ? orderValue.LostBelongings : 50;
      orderValue.BillDoubt = orderValue.BillDoubt ? orderValue.BillDoubt : 45;
      orderValue.DriverCycleRoad = orderValue.DriverCycleRoad ? orderValue.DriverCycleRoad : 40;
      orderValue.DriverBadManner = orderValue.DriverBadManner ? orderValue.DriverBadManner : 35;
      for (let item of this.automationData) {
        Object.keys(dataContent).forEach((key) => {
          if (item.key === key) {
            item.value = dataContent[key]
          }
          this.automationBusinessValue[key] = Number(dataContent[key])

        })
        Object.keys(orderValue).forEach((key) => {
          if (item.key === key) {
            item.level = orderValue[key]
          }
          this.orderValue[key] = Number(orderValue[key])
        })
      }
      this.automationModelData.productLines = res.productLine;
      this.automationModelData.productLine = res.productLine;
      this.automationModelData.uuid = res.uuid;
      this.bookingcityName = res.cityName;
      this.automationModelData.cityCode = res.cityCode;
      this.automationModelData.cityName = res.cityName;
      this.automationModal = true;
      this.isAutomationEdit = true;
      this.isAutomationAdd = false;
    },
    // 客户进线自动化-城市选择
    automationCityChange(e) {
      if (e) {
        this.automationModelData.cityCode = e.value;
        this.automationModelData.cityName = e.label;
      }
    },
    addNew() {
      this.automationTitle = "新建进线自动化策略";
      for (let item of this.automationData) {
        switch (item.key) {
          case "LostBelongings":
            item.level = 50;
            this.orderValue.LostBelongings = 50
            break;
          case "BillDoubt":
            item.level = 45;
            this.orderValue.BillDoubt = 45
            break;
          case "DriverCycleRoad":
            item.level = 40;
            this.orderValue.DriverCycleRoad = 40
            break;
          case "DriverBadManner":
            item.level = 35;
            this.orderValue.DriverBadManner = 35
            break;
        }
      }
      let obj = {
        LostBelongings: "",
        BillDoubt: "",
        DriverCycleRoad: "",
        BillNoService: "",
        DriverBadManner: "",
        RefundProblem: "",
        DriverRefuseSer: "",
        DCarNoMatch: "",
        DriverHarass: "",
        PreCharge: "",
        MoreExtraFare: "",
        PickLostBelongs: "",
        ComplaintP: "",
      }
      this.automationBusinessValue = obj;
      this.orderValue = {
        LostBelongings: 50,
        BillDoubt: 45,
        DriverCycleRoad: 40,
        DriverBadManner: 35
      };
      this.automationModal = true;
      this.isAutomationAdd = true;
      this.isAutomationEdit = false;
    },
    cancelAutomationModal() {
      this.loading = false;
      this.automationModal = false;
      this.automationData = deepClone([], automationInitData)
      this.automationModelData = {};
      this.automationBusinessValue = {};
      this.orderValue = {};
    },
    searchTap() {
      this.pageParams.currPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        ...this.pageParams,
      }
      Object.keys(this.serachPrams).forEach((key) => {
        if (this.serachPrams[key]) {
          params[key] = this.serachPrams[key]
        }
      })
      getAutoWOrderConfigList(params).then(res => {
        if (res.data.code === 200) {
          let list = res.data.data;
          for (let item of list) {
            item.productLineDoec = this.serviceTypeMap[item.productLine]
          }
          this.tableData = list;
          this.total = res.data.totalSize;
        }
      });
    },

    automationChange(e) {
      this.automationBusinessValue[e.key] = Number(e.value);
    },
    levelChange(e) {
      this.orderValue[e.key] = e.level !== "" ? Number(e.level) : "";
    },
    resetTap() {
      this.serachPrams = {};
      this.getList();
    },
    changePage(val) {
      this.pageParams.currPage = val
      this.getList()
    },
    changePageSize(val) {
      this.pageParams.pageSize = val
      this.getList()
    },
    // 客户进线自动化策略-新增-编辑-提交
    Submit(type) {
      let params = {
        businessValue: this.automationBusinessValue,
        orderValue: this.orderValue,
        ...this.automationModelData,
      }
      console.log(this.orderValue)
      for (let key in this.orderValue) {
        if (!this.IsCheckOrderValue(this.orderValue[key])) {
          return false;
        }
      }
      for (let key in this.automationBusinessValue) {
        if (!this.IsChkStrPlusValue(this.automationBusinessValue[key])) {
          return false;
        }
      }
      this.loading = true;
      if (this.isAutomationAdd) {
        addAutoWOrderConfig(params).then(res => {
          if (res.data.code === 200) {
            this.cancelAutomationModal();
            this.pageParams.currPage = 1;
            this.getList();
            this.automationModal = false;
            this.$Message.success("新增成功")
          } else {
            this.loading = false;
            this.$Message.error(res.data.msg || "操作失败")
          }
        });
      } else {
        editAutoWOrderConfig(params).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.cancelAutomationModal();
            this.pageParams.currPage = 1;
            this.getList();
            this.automationModal = false;
            this.$Message.success("编辑成功")
          } else {
            this.$Message.error(res.data.msg || "操作失败")
          }
        });
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    },
    // 提交按钮点击
    automationSubmit() {
      if (!this.isAutomationEdit) {
        if (this.isAutomationAdd) {
          this.$refs.automationForm.validate((valid) => {
            if (valid) {
              this.Submit("add")
            }
          })
        } else {
          this.Submit("edit")
        }

      } else {
        this.automationModal = false;
      }
    },
    // 获取已开城市列表
    getCoopCityList(value) {
      axiosSetCityList({ businessType: value }).then(res => {
        let list = res.data.data || [];
        this.openCityList = list.map(item => {
          return {
            label: item.city,
            value: item.cityUuid
          }
        })
      });
    },
    IsChkStrPlusValue(str) {
      let regexp = /^[1-9]\d*$/;
      if (!regexp.test(str)) {
        this.$Message.error({ content: "天数必须为大于0的正整数", duration: 10 });
        return false;
      }
      return true;
    },
    IsCheckOrderValue(str) {
      if (str !== "") {
        let regexp = /^[1-9]\d*$/;
        if (!regexp.test(str)) {
          this.$Message.error({ content: "优先级必须为1~99的正整数", duration: 10 });
          return false;
        }
        return true;
      } else {
        return true;
      }
    },
  }
}
</script>

<style scoped>
.start{
  color:#ed4014;
  font-size:16px;
  position: absolute;
  left: 20px;
}
.label{
  width: 100px;
}
</style>
