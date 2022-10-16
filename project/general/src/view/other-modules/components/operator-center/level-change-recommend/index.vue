<template>
  <div>
    <general-table
      ref="table"
      :input-list="inputList"
      :table-columns="tableColumns"
      :get-list-fn="queryRecommendList"
    >
      <div
        slot="search-suffix"
      >
        <Button
          v-has-auth="'add'"
          type="primary"
          @click="handleAddStrategy"
        >
          新增
        </Button>
      </div>
    </general-table>

    <Modal
      v-model="editVisible"
      width="750"
      :title="editTitle"
      @on-cancel="handleCloseEditStrategy"
    >
      <edit
        v-if="editVisible"
        ref="editRef"
        :city-list="cityList"
        :loading="detailLoading"
        :detail="detailInfo"
        :business-grade-list="businessGradeList"
      />
      <div
        slot="footer"
      >
        <Button
          :loading="submitLoading"
          type="primary"
          @click="handleSubmit"
        >
          确定
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="detailVisible"
      width="750"
      title="查看策略"
      @on-cancel="handleCloseDetail"
    >
      <detail
        v-if="detailVisible && detailInfo"
        :detail="detailInfo"
        :city-list="cityList"
        :city-map="cityMap"
        :loading="detailLoading"
      />
      <div
        slot="footer"
      >
        <Button
          type="primary"
          @click="handleEdit(detailInfo.uuid)"
        >
          编辑
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryOpenCityList } from "_o/api/task-manager"
import { mapState, mapGetters } from "vuex"

import generalTable from "./components/general-table"
import edit from "./components/edit"
import detail from "./components/detail"

import {
  queryAddStrategy, queryBindGift,
  queryChangeStatus,
  queryRecommendList, queryStrategyDetail,
  queryUpdateStrategy
} from "_o/api/operator-center/level-change-recommend"
import { getCarName } from "_o/components/operator-center/level-change-recommend/const"
import moment from "moment"

export default {
  components: {
    generalTable,
    edit,
    detail
  },
  data() {
    const statusMap = {
      "-2": "已失效",
      "1": "生效中",
      "0": "未生效",
    }
    const statusList = Object.keys(statusMap).map(key => ({
      label: statusMap[key],
      value: Number(key)
    }))
    return {
      queryRecommendList,
      inputList: [
        {
          name: "drop-input", // 文本输入框名
          bind_key: "cityCodes", // 返回数据的key名
          placeholder: "请选择",
          value: "", // 用于数据绑定
          title: "城市：", // 展示的字段名
          dropList: [],
          filterable: true,
          multiple: true
        },
        {
          name: "drop-input", // 文本输入框名
          bind_key: "status", // 返回数据的key名
          placeholder: "请选择",
          value: "", // 用于数据绑定
          title: "状态：", // 展示的字段名
          dropList: statusList
        },
        {
          name: "drop-input", // 文本输入框名
          bind_key: "expandBizLine", // 返回数据的key名
          placeholder: "请选择",
          value: "", // 用于数据绑定
          title: "业务线：", // 展示的字段名
          dropList: [],
          titleWidth: 100
        },
      ],
      tableColumns: [
        {
          key: "ruleName",
          title: "名称"
        },
        {
          key: "cityName",
          title: "城市",
        },
        {
          title: "业务线",
          key: "expandBizLine",
          render: (h, params) => {
            return (
              <span>{this.businessGradeList.find(item => params.row.expandBizLine === item.value).label}</span>
            )
          }
        },
        {
          title: "触发推荐车型",
          render: (h, params) => {
            return (
              <span>{this.getCarName(params.row.ruleDetails, "triggerVehicleLevels", params.row.expandBizLine)}</span>
            )
          }
        },
        {
          title: "推荐车型",
          render: (h, params) => {
            return (
              <span>{this.getCarName(params.row.ruleDetails, "recommendationVehicleLevel", params.row.expandBizLine)}</span>
            )
          }
        },
        {
          title: "生效日期",
          render: (h, params) => {
            return (
              <span>{moment(params.row.effectiveTime).format("YYYY-MM-DD")} ~ {moment(params.row.failureTime).format("YYYY-MM-DD")}</span>
            )
          }
        },
        {
          title: "状态",
          render: (h, params) => {
            return (
              <span>{statusMap[params.row.status]}</span>
            )
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          render: (h, params) => {
            return (
              <div class="action-group">
                {
                  params.row.status !== -2 ? (
                    <a
                      v-hasAuth={"disable"}
                      class="action-btn"
                      href="javascript:void 0;"
                      onClick={() => this.handleDisable(params.row.uuid)}
                    >停用</a>
                  ) : null
                }

                {
                  params.row.status !== -2 ? (
                    <a
                      v-hasAuth={"edit"}
                      class="action-btn"
                      href="javascript:void 0;"
                      onClick={() => this.handleEdit(params.row.uuid)}
                    >编辑</a>
                  ) : null
                }

                <a
                  v-hasAuth={"check"}
                  class="action-btn"
                  href="javascript:void 0;"
                  onClick={() => this.handleCheckDetail(params.row.uuid)}
                >查看</a>
              </div>
            )
          }
        }
      ],
      cityMap: {},
      cityList: [],
      // 编辑弹窗显示控制
      editVisible: false,
      detailVisible: false,
      submitLoading: false,
      detailInfo: null,
      detailLoading: false,
      giftIdList: []
    }
  },
  computed: {
    ...mapState({
      businessGradeList: (state) => state.common.businessGradeList.map(item => ({
        label: item.label,
        value: item.value,
        children: item.children
      }))
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    }),
    editTitle() {
      return "添加车型推荐策略"
    }
  },
  watch: {
    businessGradeList(val) {
      this.inputList[2].dropList = val
    }
  },
  mounted() {
    this.getCityList()
  },
  methods: {
    // 获取城市列表
    async getCityList() {
      const res = await queryOpenCityList({});
      if (!res) {
        this.cityList = [];
        this.$Message.error("获取城市失败");
        return false;
      }
      if (res.data && res.data.data && res.data.success) {
        this.cityList = res.data.data.map((item) => {
          this.cityMap[item.cityId] = item.city
          return {
            value: item.cityId,
            label: item.city,
          }
        });
        this.inputList[0].dropList = this.cityList;
      } else {
        this.cityList = [];
        this.$Message.error(res.data.msg);
      }
    },
    handleAddStrategy() {
      this.editVisible = true
    },
    handleCloseEditStrategy() {
      this.editVisible = false
      this.detailInfo = null
    },
    handleCloseDetail() {
      this.detailVisible = false
      this.detailInfo = null
    },
    handleDisable(uuid) {
      const self = this
      this.$Modal.confirm({
        title: "确认停用该策略？",
        loading: true,
        async onOk() {
          try {
            const res = await queryChangeStatus({
              uuid,
              status: -2
            })

            if (res.data.success) {
              self.$Message.success("策略已停用")
              self.$Modal.remove()
              await self.$refs.table.getList()
            } else {
              this.buttonLoading = false
            }
          } catch (e) {
            this.buttonLoading = false
          }
        }
      })
    },
    // 获取详情
    async getDetailInfo(uuid) {
      try {
        this.detailLoading = true
        const res = await queryStrategyDetail({
          uuid
        })
        if (res.data.success) {
          const { ruleName, uuid, status, cityCode, expandBizLine, effectiveTime, failureTime, ruleDetails } = res.data.data
          this.detailInfo = {
            ruleName, uuid, status, cityCode, expandBizLine, effectiveTime, failureTime, ruleDetails
          }
          this.giftIdList = ruleDetails.map(item => {
            return item.recommendationCouponId
          })
        }
        this.detailLoading = false
      } catch (e) {
        this.detailLoading = false
      }
    },
    async handleEdit(uuid) {
      this.handleCloseDetail()
      this.editVisible = true
      await this.getDetailInfo(uuid)
    },
    async handleCheckDetail(uuid) {
      this.detailVisible = true
      await this.getDetailInfo(uuid)
    },
    async handleSubmit() {
      if (this.submitLoading) return
      const params = this.$refs.editRef.handleSubmit()
      const queryUpdate = async () => {
        try {
          const res = params.uuid ? await queryUpdateStrategy(params) : await queryAddStrategy(params)
          if (res.data.success) {
            this.$Message.success(params.uuid ? "策略更新成功" : "新增策略成功")
            await this.$refs.table.getList()
            this.handleCloseEditStrategy()
          }
          this.submitLoading = false
        } catch (e) {
          this.submitLoading = false
        }
      }
      if (params) {
        this.submitLoading = true
        const rewardList = params.ruleDetails.filter(item => {
          return item.recommendationCouponId && this.giftIdList.indexOf(item.recommendationCouponId) === -1
        }).map(item => ({
          uuid: item.recommendationCouponId,
          businessCode: 1,
          bingdingType: 1,
          businessUuid: 1,
          beginTime: moment(params.effectiveTime).valueOf(),
          endTime: moment(params.failureTime).valueOf()
        }))
        if (rewardList.length) {
          try {
            const result = await queryBindGift(rewardList)

            if (result.data.success) {
              await queryUpdate()
            } else {
              this.submitLoading = false
            }
          } catch (e) {
            this.submitLoading = false
          }
        } else {
          await queryUpdate()
        }
      }
    },
    getCarName(ruleDetails, key, id) {
      return ruleDetails.map(item => {
        let value = item[key]
        try {
          value = JSON.parse(value)
        } catch (e) {}
        if (value instanceof Array) {
          return value.map(code => getCarName(code, id)).join("、")
        }
        return getCarName(value, id)
      }).join("、")
    },
  },
}
</script>

<style scoped lang="less">
/deep/.action-group {
  white-space: nowrap;
}
/deep/.action-btn {
  margin: 0 4px;
}
</style>
