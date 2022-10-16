<template>
  <div>
    <!-- 判断是否流程（司机确认，超时自动确认，终审申诉结束）是结束，如果结束则不展示工单概览 -->
    <Card>
      <p slot="title">工单概览</p>
      <!-- <Button type="primary" slot="extra" @click.prevent="more = true">更多工单</Button> -->
      <Row :gutter="16">
        <Col span="5">
          <div class="top_showTitle">
            今日同类违规工单数
            <Tooltip
              content="该司机今日同类所有状态的违规工单数"
              placement="top"
            >
              <Icon type="md-help-circle" />
            </Tooltip>
          </div>
        </Col>
        <Col span="5">
          <div class="top_showTitle">
            本月同类违规工单数
            <Tooltip
              content="该司机本月同类所有状态的违规工单数"
              placement="top"
            >
              <Icon type="md-help-circle" />
            </Tooltip>
          </div>
        </Col>
        <Col span="5">
          <div class="top_showTitle">
            本周同类违规工单数
            <Tooltip
              content="该司机本周同类所有状态的违规工单数"
              placement="top"
            >
              <Icon type="md-help-circle" />
            </Tooltip>
          </div>
        </Col>
        <Col span="5">
          <div class="top_showTitle">
            今日违规工单数
            <Tooltip
              content="该司机今日所有类型及状态的违规工单数"
              placement="top"
            >
              <Icon type="md-help-circle" />
            </Tooltip>
          </div>
        </Col>
        <Col span="4">
          <div class="top_showTitle">
            本月违规工单数
            <Tooltip
              content="该司机本月所有类型及状态的违规工单数"
              placement="top"
            >
              <Icon type="md-help-circle" />
            </Tooltip>
          </div>
        </Col>
      </Row>
      <br />
      <Row :gutter="16">
        <Col span="5">
          <div class="top_showNum" @click="goMore(1)">
            {{ overviewNum.ilgOrdersDs }}
          </div>
        </Col>
        <Col span="5">
          <div class="top_showNum" @click="goMore(2)">
            {{ overviewNum.ilgOrdersMs }}
          </div>
        </Col>
        <Col span="5">
          <div class="top_showNum" @click="goMore(5)">
            {{ overviewNum.ilgOrdersWs }}
          </div>
        </Col>
        <Col span="5">
          <div class="top_showNum" @click="goMore(3)">
            {{ overviewNum.ilgOrdersD }}
          </div>
        </Col>
        <Col span="4">
          <div class="top_showNum" @click="goMore(4)">
            {{ overviewNum.ilgOrdersM }}
          </div>
        </Col>
      </Row>
    </Card>
    <Modal
      v-model="more"
      title="工单明细"
      width="60%"
      @on-ok="more = false"
      @on-cancel="more = false"
    >
      <Form :model="formItem" :label-width="80" :inline="true">
        <Row>
          <FormItem label="工单分类">
            <Cascader
              :data="woTypeList"
              v-model="formItem.woType"
              style="width:400px"
            ></Cascader>
          </FormItem>
          <FormItem label="判责类型">
            <Cascader
              :data="judgeTypeList"
              v-model="formItem.judgeType"
              style="width:400px"
            ></Cascader>
          </FormItem>
        </Row>
        <FormItem label="判责结果">
          <Select v-model="formItem.judgeResult" style="width:200px">
            <Option
              v-for="item in judgeResList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker
            v-model="formItem.startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker
            v-model="formItem.endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <Button @click="search" type="primary">查询</Button>
      </Form>
      <v-table
        :current="current"
        :total="total"
        :pageSize="pageSize"
        :parColumns="columns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      ></v-table>
    </Modal>
  </div>
</template>

<script>
import { orderHist, orderHistMore } from "_o/api/work-order/wo-detail.js";
import { listColumns } from "./over-view.js";

export default {
  name: "over-view",
  props: {
    basicInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    let { columns } = listColumns;
    return {
      more: false,
      columns: columns(this),
      tableData: [],
      current: 1,
      total: 0,
      pageSize: 10,
      formItem: {
        woType: [
          "categoryFirst",
          "categorySecond",
          "categoryThird",
          "categoryFourth"
        ],
        judgeType: [],
        judgeResult: "",
        startTime: "",
        endTime: ""
      },
      judgeResList: [
        {
          value: "1",
          label: "司机有责"
        },
        {
          value: "2",
          label: "司机无责"
        }
      ],
      judgeTypeList: [],
      woTypeList: [
        {
          value: "categoryFirst",
          label: "一级工单分类",
          children: [
            {
              value: "categorySecond",
              label: "二级工单分类",
              children: [
                {
                  value: "categoryThird",
                  label: "三级工单分类",
                  children: [
                    {
                      value: "categoryFourth",
                      label: "四级工单分类"
                    }
                  ]
                },
                {
                  value: "tiantan",
                  label: "天坛"
                },
                {
                  value: "wangfujing",
                  label: "王府井"
                }
              ]
            },
            {
              value: "categoryFirstSecond",
              label: "一级工单分类二",
              children: [
                {
                  value: "categorySecondSec",
                  label: "二级工单分类二",
                  children: [
                    {
                      value: "fuzimiao",
                      label: "夫子庙"
                    }
                  ]
                },
                {
                  value: "suzhou",
                  label: "苏州",
                  children: [
                    {
                      value: "zhuozhengyuan",
                      label: "拙政园"
                    },
                    {
                      value: "shizilin",
                      label: "狮子林"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      overviewNum: {}
    };
  },

  watch: {
    basicInfo(val) {
      if (val) {
        this.getOverViewNum();
      }
    }
  },

  mounted() {},
  methods: {
    getOverViewNum() {
      const {
        basicInfo: { categoryFirst, categorySecond, driverId }
      } = this;
      let query = {
        // driverId: this.params.driverId,
        // categoryFirst: this.params.categoryFirst,
        // categorySecond: this.params.categorySecond,
        // categoryThird: this.params.categoryThird,
        // categoryFourth: this.params.categoryFourth,
        categoryFirst,
        categorySecond,
        driverId
      };
      orderHist(query)
        .then(res => {
          this.overviewNum = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(p) {
      if (p) {
        orderHistMore(p)
          .then(res => {
            let data = res.data.data || {};
            this.tableData = data.list;
            this.total = data.totalCount;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        let query = {
          ...this.formItem,
          driverId: "",
          currentPage: 1,
          pageSize: 10
        };
        orderHistMore(query)
          .then(res => {
            let data = res.data.data || {};
            this.tableData = data.list;
            this.total = data.totalCount;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    changePage(page) {
      this.current = page;
      this.search();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.search();
    },
    goMore(type) {
      return;
      this.more = true;
      let date = new Date();
      let year = date.getFullYear() + "";
      let month = date.getMonth() + 1 + "";
      let nowDateEnd =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      let nowDateStart =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        "00:00:00"; // 本月第一天日期
      let begin = year + "-" + month + "-01 00:00:00"; // 本月最后一天日期
      let lastDateOfCurrentMonth = new Date(year, month, 0);
      let end =
        year +
        "-" +
        month +
        "-" +
        lastDateOfCurrentMonth.getDate() +
        " 59:59:59";
      switch (type) {
        case 1: //今日同类
          var params = {
            currPage: 1,
            pageSize: 10,
            driverId: this.params.driverId,
            categoryFirst: this.params.categoryFirst,
            categorySecond: this.params.categorySecond,
            categoryThird: this.params.categoryThird,
            categoryFourth: this.params.categoryFourth,
            judgeType: this.params.judgeType,
            judgeResult: this.params.judgeResult,
            startTime: nowDateStart,
            endTime: nowDateEnd
          };
          break;
        case 2: // 本月同类
          var params = {
            currPage: 1,
            pageSize: 10,
            driverId: this.params.driverId,
            categoryFirst: this.params.categoryFirst,
            categorySecond: this.params.categorySecond,
            categoryThird: this.params.categoryThird,
            categoryFourth: this.params.categoryFourth,
            judgeType: this.params.judgeType,
            judgeResult: this.params.judgeResult,
            startTime: begin,
            endTime: end
          };
          break;
        case 3: // 今天
          var params = {
            currentPage: 1,
            pageSize: 10,
            startTime: nowDateStart,
            endTime: nowDateEnd,
            driverId: this.params.driverId
          };
          break;
        case 4: // 本月
          var params = {
            currentPage: 1,
            pageSize: 10,
            startTime: begin,
            endTime: end,
            driverId: this.params.driverId
          };
          break;
      }
      this.search(params);
    }
  }
};
</script>

<style lang="less" scoped>
.top_showNum {
  // color: #02a7f0;
  font-size: 18px;
  cursor: pointer;
  text-align: center;
}
.top_showTitle {
  text-align: center;
}
</style>
