<template>
  <div>
    <search-list
      :inputList="inputList"
      @on-search="searchData"
      @on-reset="resetData"
    />

    <div>
      <Button v-has-auth="'addStrategy'" type="primary" @click="openEditModal">
        新增
      </Button>
    </div>

    <v-table
      style="margin-top: 20px"
      class="task-table-container"
      :total="total"
      :current="current"
      :isLoading="isLoading"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    />

    <EditConfig
      :visible="editVisible"
      :city-list="cityList"
      :car-type-list="carTypeList"
      :loading="modalLoading"
      :detail="editDetail"
      :week-list="weekList"
      @close="closeEditModal"
      @submit="configSubmit"
    />
    <Detail
      :visible="detailVisible"
      :detail="editDetail"
      :city-map="cityMap"
      :city-list="cityList"
      :car-type-list="carTypeList"
      :week-list="weekList"
      :loading="modalLoading"
      @close="closeDetailModal"
      @edit="handleEdit"
    />
  </div>
</template>

<script>
import { queryOpenCityList } from "_o/api/task-manager";
import {
  addUpgradeConfig,
  disableUpgradeStrategy,
  editUpgradeConfig,
  getUpgradeConfigDetail,
  getUpgradeConfigList
} from "_o/api/upgradeConfig";
import EditConfig from "./components/EditConfig";
import Detail from "./components/Detail";
import { weekList, inputList } from "./fields"
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    EditConfig,
    Detail
  },
  data() {
    return {
      cityList: [],
      cityMap: {},
      inputList: JSON.parse(JSON.stringify(inputList)),
      current: 1,
      pageSize: 20,
      total: 0,
      isLoading: false,
      tableColumns: [
        {
          title: "名称",
          key: "upCarLevelStrategyName",
          width: 140
        },
        {
          title: "城市",
          key: "cityCode",
          width: 100,
          render: (h, params) => {
            const city = params.row.cityCode.split(",");
            const result = [];
            city.forEach(code => {
              result.push(this.cityMap[code]);
            });

            return h("span", result.join(","));
          }
        },
        {
          title: "业务线",
          key: "cityCode",
          width: 100,
          render: (h, params) => {
            const {
              row: { expandBizLine }
            } = params;
            const { businessKeyValue } = this.businessGradeName;
            return h("span", businessKeyValue[expandBizLine]);
          }
        },
        {
          title: "下单车型",
          width: 220,
          render: (h, params) => {
            const {
              row: { upCarLevelPeriods }
            } = params;
            const { carLevelKeyValue, productKeyValue } = this.businessGradeName;
            let r = []
            upCarLevelPeriods.forEach(item => {
              let ll = item.oldCarLevel.split(",")
              ll.forEach(it => {
                const [productKey, key] = it.split("#");
                let produceLineName = productKeyValue[productKey]; // 产品线
                let carTypeName = '' // 车型
                let carList = this.bizTypeList.find(it => it.value - productKey === 0)
                if(carList?.children?.length) {
                  let f = carList.children.find(it => it.value - key === 0)
                  carTypeName = f ? f.label : ''
                }
                r.push(`${produceLineName}-${carTypeName}`)
              })
            });
            return h("span", r.join(", "));
          }
        },
        {
          title: "目标车型",
          width: 220,
          render: (h, params) => {
            const {
              row: { upCarLevelPeriods }
            } = params;
            const { carLevelKeyValue, productCarKeyValue } = this.businessGradeName;
            let r = []
            upCarLevelPeriods.forEach(item => {
              let ll = item.newCarLevel.split(",")
              ll.forEach(it => {
                // const key = it.split("#");
                // r.push(carLevelKeyValue[key[key.length - 1]])
                r.push(productCarKeyValue[it])
              })
            });
            return h("span", r.join(", "));
          }
        },
        {
          title: "生效时间",
          key: "effectiveTimeStart",
          minWidth: 320,
          render: (h, params) => {
            return h(
              "span",
              `${params.row.effectiveTimeStart} - ${params.row.effectiveTimeEnd}`
            );
          }
        },
        {
          title: "状态",
          key: "strategyStatus",
          width: 150,
          render: (h, params) => {
            const obj = {
              0: "未生效",
              1: "生效中",
              "-1": "已失效",
              "-2": "已失效"
            };
            return h("span", obj[params.row.strategyStatus]);
          }
        },
        {
          title: "操作",
          width: 250,
          fixed: "right",
          render: (h, params) => {
            return (
              <ButtonGroup>
                {params.row.strategyStatus !== -2 ? (
                  <Button
                    v-hasAuth={"disabledStrtegy"}
                    type="error"
                    vOn:click={() => this.handleClickDisable(params.row.uuid)}
                  >
                    停用
                  </Button>
                ) : null}
                {params.row.strategyStatus !== -2 ? (
                  <Button
                    v-hasAuth={"edit"}
                    type="primary"
                    vOn:click={() => this.handleEdit(params.row.uuid)}
                  >
                    编辑
                  </Button>
                ) : null}
                <Button
                  v-hasAuth={"check"}
                  type="default"
                  vOn:click={() => this.openDetailModal(params.row.uuid)}
                >
                  查看
                </Button>
              </ButtonGroup>
            );
          }
        }
      ],
      weekList,
      tableData: [],
      query: {},
      carTypeList: [],
      carTypeMap: {},
      // 编辑弹窗
      editVisible: false,
      submitLoading: false,
      modalLoading: false,
      detailVisible: false,
      editDetail: null
    };
  },
  computed: {
    ...mapState({
      bizTypeList: state => state.common.bizTypeList,
      businessGradeList: state => state.common.businessGradeList
    }),
    ...mapGetters({
      businessGradeName: "getBusinessGradeName"
    })
  },
  mounted() {
    this.getCityList();
    this.getCarType();
    this.getList();
    // this.openEditModal();
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
        this.cityList = res.data.data.map(item => {
          this.cityMap[item.cityId] = item.city;
          return {
            value: item.cityId,
            label: item.city
          };
        });
        this.inputList[0].dropList = this.cityList;
        // console.log("cityList", this.cityList);
      } else {
        this.cityList = [];
        this.$Message.error(res.data.msg);
      }
    },
    // 获取产品线-车型等级映射list
    getCarType() {
      this.carList = [
        ...this.bizTypeList
          .map(it => {
            let list = it.children.map(item => {
              return {
                ...item,
                value: `${it.bizType}#${item.value}`,
                label: `${it.label}-${item.label}`
              };
            });
            return list;
          })
          .flat()
      ];
      this.inputList[3].dropList = this.inputList[4].dropList = this.carList;
      for (let item of this.inputList) {
        if (item.key === "expandBizLine") {
          item.dropList = this.businessGradeList;
          break;
        }
      }
    },
    // 获取表格
    async getList() {
      this.isLoading = true;
      try {
        const res = await getUpgradeConfigList({
          ...this.query,
          currPage: this.current,
          pageSize: this.pageSize
        });
        if (res.data.success) {
          this.tableData = res.data.data.list || [];
          this.total = res.data.data.totalCount || 0;
        }
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
      }
    },
    changePage(page) {
      this.current = page;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    searchData(query) {
      this.query = query;
      this.getList();
    },
    resetData() {
      this.query = {};
      this.getList();
    },
    // 停用
    handleClickDisable(uuid) {
      let loading = true;
      this.$Modal.confirm({
        title: "确定停用该策略？",
        loading,
        onOk: async () => {
          const res = await disableUpgradeStrategy({
            uuid
          });

          if (res.data.success) {
            this.$Message.info("策略已停用");
            this.$Modal.remove();
            await this.getList();
          } else {
            loading = false;
          }
        }
      });
    },
    // 新增
    async configSubmit(params) {
      this.submitLoading = true;

      try {
        const res = this.editDetail
          ? await editUpgradeConfig(params)
          : await addUpgradeConfig(params);
        if (res.data.success) {
          this.$Message.success(this.editDetail ? "策略更新成功" : "策略添加成功");
          this.closeEditModal();
          await this.getList();
        } else {
          this.$Message.error(res.data.msg);
        }

        this.submitLoading = true;
      } catch (e) {
        this.submitLoading = true;
      }
    },
    // 打开编辑弹窗
    openEditModal() {
      this.editDetail = null;
      this.editVisible = true;
    },
    closeEditModal() {
      this.editVisible = false;
    },
    async openDetailModal(uuid) {
      this.closeDetailModal();
      this.detailVisible = true;
      await this.getItemDetail(uuid);
    },
    closeDetailModal() {
      this.detailVisible = false;
    },
    // 编辑详情
    async handleEdit(uuid) {
      this.closeDetailModal();
      this.openEditModal();
      await this.getItemDetail(uuid);
    },
    async getItemDetail(uuid) {
      this.modalLoading = true;
      try {
        const res = await getUpgradeConfigDetail({
          uuid
        });
        if (res.data.success) {
          // 对车型做个处理
          const result = res.data.data;
          // const upCarLevelPeriods = result.upCarLevelPeriods || []
          // upCarLevelPeriods.forEach(v => {
          //   const newArr = v.newCarLevel.split("#")
          //   const oldArr = v.oldCarLevel.split("#")
          //   v.newCarLevel = newArr[newArr.length - 1]
          //   v.oldCarLevel = oldArr[oldArr.length - 1]
          // })
          this.editDetail = result;
        }
        this.modalLoading = false;
      } catch (e) {
        this.modalLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.handle-btn {
  margin-right: 10px;
}
</style>
