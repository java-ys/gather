<template>
  <div class="app-container">
    <div class="pandect">
      <div class="title-warp">
        <div class="title-color"></div>
        <div style="width:10px"></div>
        <div class="title-text">工单总览<Button v-if="isLZOrder" v-hasAuth="'circulation-order-add'" type="primary" style="margin-left: 10px;" @click="$refs.add.init({from: 'my'})">新建工单</Button></div>
      </div>
      <div style="height:20px"></div>
      <div class="type-container">
        <!-- <Card class="box-card" :class="isChecked4 ? 'checked' : 'unCheak'">
          <div class="type-warp" @click="getList(4)"  >
            <span class="type-top">全部</span>
            <br>
            <span class="type-bottom">{{ parseFloat(typeData.type1).toLocaleString() }}</span>
          </div>
        </Card> -->
        <!--<Card-->
          <!--class="box-card"-->
          <!--:class="isChecked1 ? 'checked' : 'unCheak'"-->
          <!--@click.native="selectType(1)"-->
        <!--&gt;-->
          <!--<div class="type-warp">-->
            <!--<span class="type-top">我发起的工单</span>-->
            <!--<br />-->
             <!--<span class="type-bottom">{{ parseFloat(typeData.type1).toLocaleString() }}</span>-->
          <!--</div>-->
        <!--</Card>-->
        <Card
          class="box-card"
          :class="isChecked2 ? 'checked' : 'unCheak'"
          @click.native="selectType(2)"
        >
          <div class="type-warp">
            <span class="type-top">待我处理的工单</span>
            <br />
            <!-- <span class="type-bottom">{{ parseFloat(typeData.type2).toLocaleString() }}</span> -->
          </div>
        </Card>
        <Card
          class="box-card"
          :class="isChecked3 ? 'checked' : 'unCheak'"
          @click.native="selectType(3)"
        >
          <div class="type-warp">
            <div class="type-warp">
              <span class="type-top">我已处理的工单</span>
              <br />
              <!-- <span class="type-bottom">{{ parseFloat(typeData.type3).toLocaleString() }}</span> -->
            </div>
          </div>
        </Card>
        <Card
          v-if="isLZOrder"
          class="box-card"
          :class="isChecked4 ? 'checked' : 'unCheak'"
          @click.native="selectType(4)"
        >
          <div class="type-warp">
            <span class="type-top">我创建的工单</span>
            <br />
            <!-- <span class="type-bottom">{{ parseFloat(typeData.type2).toLocaleString() }}</span> -->
          </div>
        </Card>
      </div>
    </div>
    <searchList
      v-show="type === 2 || isLZOrder"
      ref="searchList"
      :inputList="inputListStay"
      @on-change="changetype"
      @on-search="onSearchStay"
      @on-reset="onResetStay"
      @loadData="loadData"
    >
    </searchList>
    <searchList
      v-show="type === 3 && !isLZOrder"
      ref="searchList"
      :inputList="inputListAlready"
      @on-search="onSearchAlready"
      @on-reset="onResetAlready"
    >
    </searchList>
    <VTable
      v-if="!hideTable"
      class="table"
      :total="table.total"
      :current="table.pageCurrent"
      :pageSize="table.pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
    <Add ref="add" fromLZ @reload="getList" />
  </div>
</template>

<script>
import { orderYyList, orderYyListOfDb } from "_o/api/work-order/dashboard.js";
import { fetchCityList, queryDriverType } from "_o/api/work-order/work-order-config";
import { getBizState } from "_o/api/work-order/common.js";
import baseMixin from '@/mixins/orderMixin'
import { inputListStay, inputListAlready, driverTypeMap } from "./fields"
import woType from "../work-order-manage/mixins/woType.js";
import { mapState } from "vuex";
import Add from "../work-order-manage/work-order-query/add.vue";
export default {
  name: "partner-workorder",
  mixins:[baseMixin,woType],
  components: { Add },
  data() {
    return {
      hideTable: true,
      isLZOrder: this.$route.name === "circulation_order", // 是否是流转工单
      temLabel:[],
      driverTypes: [],
      cityList: [],
      scrollId: '',
      type: 2,
      table: {
        total: null,
        pageCurrent: 1,
        pageSize: 10
      },
      isChecked1: false,
      isChecked2: true,
      isChecked3: false,
      isChecked4: false,
      // isChecked4: false,
      tableData: [],
      typeData: {
        type1: "12345",
        type2: "23456789",
        type3: "345678",
        type4: "4567890"
      },
      tableColumns: [
        {
          title: "工单编号",
          key: "woCode",
          tooltip: true,
          minWidth: 250,
          fixed: "left",
          render: (h, params) => {
            const _this = this;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    ghost: true,
                    size: "small"
                  },
                  style: { color: "#2d8cf0" },
                  on: {
                    click() {
                      const { taskId, woCode, bizState } = params.row;
                      const query = taskId ? { taskId, woCode } : { woCode };
                      let name = "work-order-detail"
                      if(bizState === "SJ_CITY") { // 城市审核和详情用违规工单明细
                        name = "city-order-detail"
                      }
                      _this.$router.push({
                        name,
                        query: {
                          ...query,
                          isLZ: _this.isLZOrder ? 1 : ""
                        }
                      });
                    }
                  }
                },
                params.row.woCode
              )
            ]);
          }
        },
        {
          title: "一级工单分类",
          tooltip: true,
          key: "categoryFirstDesc",
          minWidth: 150,
          // render: (h, params) => {
          //   const { categoryFirst } = params.row;
          //   let text = "";
          //   if (categoryFirst === "SJGL") {
          //     text = "司机管理";
          //   }
          //   return h("span", text);
          // }
        },
        {
          title: "二级工单分类",
          key: "categorySecondDesc",
          tooltip: true,
          minWidth: 150,
          // render: (h, params) => {
          //   const { categorySecond } = params.row;
          //   let text = "";
          //   if (categorySecond === "FKGD") {
          //     text = "风控工单";
          //   } else if (categorySecond === "KSGD") {
          //     text = "客诉工单";
          //   } else if (categorySecond === "WGGD") {
          //     text = "违规工单";
          //   }
          //   return h("span", text);
          // }
        },
        {
          title: "司机类型",
          tooltip: true,
          key: "driverType",
          minWidth: 150,
          render: (h, params) => {
            const { driverType } = params.row;
            return driverType ? h("span", driverTypeMap[driverType]) : null;
          }
        },
        // {
        //   title: '三级工单分类',
        //   key: 'categoryThird',
        //   tooltip: true,
        //   minWidth: 150,
        // },
        // {
        //   title: '四级工单分类',
        //   key: 'fourthType',
        //   tooltip: true,
        //   minWidth: 150,
        // },
        {
          title: "申请人",
          key: "creatorName",
          tooltip: true,
          minWidth: 150
        },
        {
          title: "创建时间",
          key: "createTime",
          tooltip: true,
          minWidth: 150
        },
        {
          title: "任务指派时间",
          key: "createdTime",
          tooltip: true,
          minWidth: 150
        },
        {
          title: "结束时间",
          key: "updateTime",
          tooltip: true,
          minWidth: 150,
          render: (h, params) => {
            const { runState, updateTime } = params.row;
            let text = runState === "FINISH" ? updateTime : "";
            return h("span", text);
          }
        },
        {
          title: "工单状态",
          tooltip: true,
          minWidth: 150,
          key: "bizState",
          render:(h, { row }) =>{
            let { bizState } = row;
             const text = this.runStateLabelMap[bizState] ||""
            return h("span", text);
          }
        },
        {
          title: "当前处理人",
          key: "updaterName",
          tooltip: true,
          minWidth: 150
        }
      ],

      inputListStay: inputListStay(this),
      inputListAlready: inputListAlready(this),
      searchStay: {},
      searchAlready: {},
      prevPage: ""
    };
  },

  watch: {
    $route(to,from) {
      if (to.name !== "circulation_order" && to.name !== "partner-workorder") return;
      this.isLZOrder = to.name === "circulation_order";
      if (this.prevPage !== to.name) {
        this.inputListStay.forEach(v => v.value = "")
        this.onResetStay()
      } else {
        if ((this.type === 4 && !this.isLZOrder)) {
          this.selectType(2);
        } else {
          this.getList();
        }
      }
      this.prevPage = to.name;
    },
    isLZOrder: {
      handler(v) {
        const cols = this.tableColumns;
        const secondIndex = cols.findIndex(v => v.key === "categorySecondDesc");
        const hasThird = cols[secondIndex + 1].key === "categoryThirdDesc";
        this.hideTable = true;
        if (v) {
          if (!hasThird) {
            cols.splice(secondIndex + 1, 0, {
              ...cols[secondIndex],
              title: "三级工单分类",
              key: "categoryThirdDesc"
            }, {
              ...cols[secondIndex],
              title: "四级工单分类",
              key: "categoryFourthDesc"
            })
          }
        } else if (hasThird) {
          cols.splice(secondIndex + 1, 2)
        }
        /* eslint-disable no-return-assign */
        // v-table组件watch了columns并赋值给iview,iview内部也watch，如果不移除table组件会导致watch调用过多报错
        this.$nextTick(() => this.hideTable = false);
        this.fetchOptions({appId: v ? "31f937c72b80474a86c4c5e8c4a9971d" : "520315b4d7524001a27a3bde5d052c51"}).then(list => {
          this.inputListStay.find(item => item.bind_key === "dealStatus").dropList = list;
        })
      },
      immediate: true,
    }
  },
  computed:{
    ...mapState({
      businessGradeList: state => state.common.businessGradeList,
      bizTypeList: state => state.common.bizTypeList
    }),
  },

  async mounted() {
    await this.queryOptions()
    await this.queryDriverTypes()
    // await this.fetchOptions()
    this.inputIndex = 9
    this.inputListKEY = 'inputListStay'
    this.getList();
    this.loadData(null,()=>{},true);
  },
  methods: {
    changetype(val,val1){
      if(val1==='expandBizLine'){
         this.inputListStay[13].dropList = (this.businessGradeList.find(it => it.value === val)||{}).children||[]
      }
    },
    async queryDriverTypes() {
      const { data: { success, data } } = await queryDriverType();
      if (success) {
        this.driverTypes = data.map(({ driverType, driverTypeDesc }) => ({ label: driverTypeDesc, value: driverType }))
        const idx = this.inputListStay.findIndex(input => input.bind_key === 'driverType')
        this.inputListStay[idx].dropList = this.driverTypes
      }
    },
    async queryOptions() {
      let param = {
        bizTypes:[1, 2, 4, 6, 7]
      }
      const { data: { success, data } } = await fetchCityList(param);
      if (success) {
        this.cityList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        });
        const idx = this.inputListStay.findIndex(input => input.bind_key === 'cityCode')
        this.inputListStay[idx].dropList = data.map(it => {
          return {
            label:it.cityName,
            value:it.cityCode
          }
        })
      }
    },
    selectType(type) {
      switch (type) {
        case 1:
          this.isChecked1 = true;
          this.isChecked2 = false;
          this.isChecked3 = false;
          this.isChecked4 = false;
          break;
        case 2:
          this.isChecked2 = true;
          this.isChecked1 = false;
          this.isChecked3 = false;
          this.isChecked4 = false;
          break;
        case 3:
          this.isChecked3 = true;
          this.isChecked1 = false;
          this.isChecked2 = false;
          this.isChecked4 = false;
          break;
        case 4:
          this.isChecked4 = true;
          this.isChecked1 = false;
          this.isChecked2 = false;
          this.isChecked3 = false;
          break;
      }
      this.type = type;
      this.table.pageCurrent = 1;
      this.getList();
    },
    getKustIfDb() {
      this.$store.commit("changeLoadingFlag", false);
      const { table: { pageCurrent, pageSize }, scrollId, searchStay } = this
      const search = searchStay
      const query = {
        scrollId,
        category: 'workorder',
        appId: this.isLZOrder ? '31f937c72b80474a86c4c5e8c4a9971d' : '520315b4d7524001a27a3bde5d052c51',
        currPage: pageCurrent,
        pageSize: pageSize,
        ...search,
      };
      orderYyListOfDb(query)
        .then(res => {
          this.tableData = res.data.data.list || [];
          this.table.total = res.data.data.totalCount;
          this.scrollId = res.data.data.scrollId || ''
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList() {
      if (this.type === 2) return this.getKustIfDb();
      this.$store.commit("changeLoadingFlag", false);
      const { type, searchStay, searchAlready, table: { pageCurrent, pageSize } } = this
      const search = type === 2 || this.isLZOrder ? searchStay : type === 3 ? searchAlready : {}
      const query = {
        index: type === 4 ? 1 : type,
        currPage: pageCurrent,
        pageSize: pageSize,
        ...search,
        appId: this.isLZOrder ? '31f937c72b80474a86c4c5e8c4a9971d' : '520315b4d7524001a27a3bde5d052c51',
      };
      orderYyList(query)
        .then(res => {
          this.tableData = res.data.data.list;
          this.table.total = res.data.data.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changePage(val) {
      this.table.pageCurrent = val;
      this.getList();
    },
    changePageSize(val) {
      this.table.pageSize = val;
      this.getList();
    },

    onSearchStay(val) {
      const { createdTimeStart, createdTimeEnd, assignTimeEnd, assignTimeStart } = val
      if (createdTimeStart) {
        val.createdTimeStart = this.$moment(createdTimeStart).format("YYYY-MM-DD HH:mm:ss")
      }
      if (createdTimeEnd) {
        val.createdTimeEnd = this.$moment(createdTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }
      if (assignTimeStart) {
        val.assignTimeStart = this.$moment(assignTimeStart).format("YYYY-MM-DD HH:mm:ss")
      }
      if (assignTimeEnd) {
        val.assignTimeEnd = this.$moment(assignTimeEnd).format("YYYY-MM-DD HH:mm:ss")
      }
      this.searchStay = val
      this.table.pageCurrent = 1;
      this.getList()
    },

    onResetStay() {
      console.log('onreset')
      this.searchStay = {}
      this.inputListStay[12].dropList = this.businessGradeList
      this.table.pageCurrent = 1;
      this.getList()
    },

    onSearchAlready(val) {
      this.searchAlready= val
      this.table.pageCurrent = 1;
      this.getList()
    },

    onResetAlready() {
      this.searchAlready = {}
      this.table.pageCurrent = 1;
      this.getList()
    },
  }
};
</script>

<style lang="less" scoped>
.title-warp {
  height: 32px;
  line-height: 32px;
  display: flex;
  .title-color {
    width: 6px;
    height: 32px;
    background: #4b9cf0;
  }
  .title-text {
    line-height: 32px;
    font-size: 18px;
  }
}
.type-container {
  display: flex;
  justify-content: space-around;
  /deep/.Card__body {
    padding: 10px !important;
  }
  .box-card {
    width: 250px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .type-warp {
      text-align: center;
      .type-top {
        font-size: 16px;
      }
      .type-bottom {
        font-size: 22px;
      }
    }
  }
  .checked {
    background-color: #4eaff5;
    color: #fff;
  }
  .unCheak {
    background-color: #fff;
    color: #000;
  }
}

.pandect {
  margin: 0 0 50px;
}

.table {
  margin: 50px 0 0;
}
</style>
