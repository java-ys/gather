<template>
  <div>
    <Tabs v-model="tab" :value="tab" class="tabs" @on-click="onClickTabs">
      <Tab-pane
        v-for="(t, i) in tabs"
        :key="i"
        :label="t.label"
        :name="t.value"
      >
        <Form
          class="forms"
          ref="forms"
          :model="forms[tab]"
          :label-width="80"
          :rules="formsRules"
        >
          <div v-for="(item, index) in forms[tab].configs" :key="index">
            <FormItem
              :label="'星期值' + (index + 1)"
              :prop="'configs.' + index + '.weeks'"
            >
              <Row>
                <Col span="18">
                  <Select
                    v-model="item.weeks"
                    clearable
                    filterable
                    multiple
                    :disabled="forms[tab].type === 1"
                    style="width: 200px;"
                  >
                    <Option
                      v-for="(xItem, xIndex) in weekList"
                      :value="xItem.value"
                      :key="xIndex"
                      >{{ xItem.label }}</Option
                    >
                  </Select>
                </Col>
                <Col v-show="forms[tab].type !== 1" span="4" offset="1">
                  <Button v-if="index === 0" @click="handleAdd([index])"
                    >新增</Button
                  >
                  <Button v-else @click="handleRemove([index])">删除</Button>
                </Col>
              </Row>
            </FormItem>
<!--            城市-->
            <div
              v-for="(xItem, xIndex) in item.cityConfigs"
              :key="index + '-' + xIndex"
              style="margin-left: 45px;"
            >
              <FormItem
                :label="'城市' + (xIndex + 1)"
                :prop="'.cityConfigs' + xIndex + 'cities'"
              >
                <Row>
                  <Col span="18">
                    <Select
                      v-model="xItem.cities"
                      clearable
                      filterable
                      multiple
                      :disabled="forms[tab].type === 1"
                      @on-change="e => onChangeCity(e, [index, xIndex])"
                      style="width: 200px;"
                    >
                      <Option value="1">全选</Option>
                      <Option-group label="多选">
                        <Option
                          v-for="(yItem, yIndex) in cityList"
                          :value="yItem.value"
                          :key="yIndex"
                          >{{ yItem.label }}</Option
                        >
                      </Option-group>
                    </Select>
                  </Col>
                  <Col v-show="forms[tab].type !== 1" span="4" offset="1">
                    <Button
                      v-if="xIndex === 0"
                      @click="handleAdd([index, xIndex])"
                      >新增</Button
                    >
                    <Button v-else @click="handleRemove([index, xIndex])"
                      >删除</Button
                    >
                  </Col>
                </Row>
              </FormItem>
<!--              时段-->
              <div
                v-for="(yItem, yIndex) in xItem.timePeriodConfigs"
                :key="index + '-' + xIndex + '-' + yIndex"
                style="margin-left: 45px;"
              >
                <FormItem
                  :label="'时段' + (yIndex + 1)"
                  :prop="'timePeriodConfigs' + yIndex + 'timeRange'"
                >
                  <Row>
                    <Col span="18">
                      <Time-picker
                        v-model="yItem.timeRange[0]"
                        :disabled="forms[tab].type === 1"
                        :disabled-minutes="disabledStartMinutes"
                        hide-disabled-options
                        format="HH:mm"
                        placeholder="开始时间"
                        style="width: 100px;"
                      ></Time-picker>
                      <Time-picker
                        v-model="yItem.timeRange[1]"
                        :disabled="forms[tab].type === 1"
                        :disabled-minutes="disabledEndMinutes"
                        hide-disabled-options
                        format="HH:mm"
                        placeholder="结束时间"
                        style="width: 100px;"
                        @on-change="
                          e => onChangeEndTime(e, [index, xIndex, yIndex])
                        "
                      ></Time-picker>
                      <!-- <Time-picker
                        v-model="yItem.timeRange"
                        format="HH:mm"
                        :disabled-minutes="disabledMinutes"
                        hide-disabled-options
                        :disabled="forms[tab].type === 1"
                        type="timerange"
                        placement="bottom-end"
                        placeholder="选择时间"
                        style="width: 200px;"
                      ></Time-picker> -->
                    </Col>
                    <Col v-show="forms[tab].type !== 1" span="4" offset="1">
                      <Button
                        v-if="yIndex === 0"
                        @click="handleAdd([index, xIndex, yIndex])"
                        >新增</Button
                      >
                      <Button
                        v-else
                        @click="handleRemove([index, xIndex, yIndex])"
                        >删除</Button
                      >
                    </Col>
                  </Row>
                </FormItem>
                <FormItem
                  v-for="(zItem, zIndex) in groupMap[tab]"
                  :key="index + '-' + xIndex + '-' + yIndex + '-' + zIndex"
                  style="margin-left: 45px;"
                  :label="zItem.label"
                  :prop="
                    'timePeriodConfigs' +
                      yIndex +
                      'dutyConfigs' +
                      zIndex +
                      'users'
                  "
                >
                  <Row v-if="yItem.dutyConfigs[zIndex]">
                    <Col span="18">
                      <Select
                        v-model="yItem.dutyConfigs[zIndex].users"
                        clearable
                        filterable
                        multiple
                        :disabled="forms[tab].type === 1"
                        style="width: 200px;"
                      >
                        <Option
                          v-for="(item, index) in zItem.list"
                          :value="item.value"
                          :key="index"
                          >{{ item.label }}</Option
                        >
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            </div>
          </div>
          <Row type="flex" justify="end" class="action">
            <Col>
              <Button type="default" @click="handleCanlel" class="btn"
                >取消</Button
              >
            </Col>
            <Col>
              <Button
                type="primary"
                @click="handleSubimit(i)"
                v-hasAuth="'work-order-schedule-subimit'"
                >{{ forms[tab].type === 1 ? "编辑" : "确定" }}</Button
              >
            </Col>
          </Row>
        </Form>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import { APPID, formsRules } from "./fields";
import {
  fetchCommonConfig,
  fetchGroupList,
  fetchCityList,
  fetchScheduleConfig,
  pullAddScheduleConfig,
  pullEditScheduleConfig
} from "_o/api/work-order/work-order-config";
import { deepCopy } from "@/libs/tools";

const NATIONWIDE_CODE = "100000";
const SELECT_ALL = "1";

export default {
  name: "schedule",
  data() {
    return {
      tab: "",
      tabs: [],
      forms: {},
      groupMap: {},
      weekList: [],
      cityList: [],
      userList: [],
      formsRules: formsRules(this),
      disabledMinutes: [...Array(59)].map((item, i) => i + 1),
      disabledStartMinutes: [...Array(59)].map((item, i) => i + 1),
      disabledEndMinutes: [...Array(59)].map((item, i) => i),
    };
  },

  watch: {},

  created() {
    this.init();
  },

  methods: {
    async init() {
      this.queryCityList();
      await this.queryOptions();
    },

    async queryOptions() {
      try {
        const {
          data: {
            success,
            data: { weeks, groups }
          }
        } = await fetchCommonConfig();
        if (success) {
          this.weekList = weeks.map(item => ({
            label: item.desc,
            value: item.code
          }));
          let map = new Map();
          let groupMap = {};
          groups.forEach(item => {
            const {
              categoryCode,
              groupCode,
              groupName,
              classCode,
              className
            } = item;
            if (!map.has(categoryCode)) {
              map.set(categoryCode, item);
            }
            if (!groupMap.hasOwnProperty(categoryCode)) {
              groupMap[categoryCode] = [];
            }
            groupMap[categoryCode].push({
              label: groupName,
              value: groupCode,
              classCode,
              className,
              list: [],
              users: []
            });
          });
          const tabs = [...map.values()].map(item => ({
            label: item.categoryName,
            value: item.categoryCode
          }));
          const initTabVal = tabs[0].value;
          tabs.forEach(item => {
            this.forms[item.value] = {
              configs: []
            };
          });
          this.tabs = tabs;
          this.tab = initTabVal;
          this.groupMap = groupMap;
          this.onClickTabs(initTabVal);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async queryCityList() {
      try {
        let param = {
          bizTypes:[1, 2, 4, 6, 7],
          showAllCity: 1
        }
        const {
          data: { success, data }
        } = await fetchCityList(param);
        if (success) {
          this.cityList = data.map(it => {
            return {
              label:it.cityName,
              value:it.cityCode
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleAdd(arr) {
      const len = arr.length;
      const [index, xIndex] = arr;
      const { tab, groupMap } = this;
      const groups = deepCopy(groupMap[tab]);
      switch (len) {
        case 1:
          this.forms[tab].configs.push({
            weeks: [],
            cityConfigs: [
              {
                cities: [],
                timePeriodConfigs: [
                  {
                    timeRange: [],
                    dutyConfigs: groups
                  }
                ]
              }
            ]
          });
          break;
        case 2:
          this.forms[tab].configs[index].cityConfigs.push({
            cities: [],
            timePeriodConfigs: [
              {
                timeRange: [],
                dutyConfigs: groups
              }
            ]
          });
          break;
        case 3:
          this.forms[tab].configs[index].cityConfigs[
            xIndex
          ].timePeriodConfigs.push({
            timeRange: [],
            dutyConfigs: groups
          });
          break;
      }
      this.$forceUpdate();
    },

    handleRemove(arr) {
      const { tab } = this;
      const len = arr.length;
      const [index, xIndex, yIndex] = arr;
      switch (len) {
        case 1:
          this.forms[tab].configs.splice(index, 1);
          break;
        case 2:
          this.forms[tab].configs[index].cityConfigs.splice(xIndex, 1);
          break;
        case 3:
          this.forms[tab].configs[index].cityConfigs[
            xIndex
          ].timePeriodConfigs.splice(yIndex, 1);
          break;
      }
      this.$forceUpdate();
    },

    async onClickTabs(val, type) {
      const { forms, groupMap } = this;
      if (!forms[val].configs.length) {
        try {
          const { tab } = this;
          const params = {
            appId: APPID,
            categoryCode: tab
          };
          const {
            data: { success, data }
          } = await fetchScheduleConfig(params);
          if (success) {
            const source = JSON.parse(data).map(item => JSON.parse(item));
            console.log(source)
            if (source.length) {
              const [item] = source;
              if (type === undefined) {
                item.type = 1;
              } else {
                item.type = type;
              }
              item.configs.forEach(x => {
                x.cityConfigs.forEach(y => {
                  y.timePeriodConfigs.forEach(z => {
                    const { start, end } = z.timePeriod;
                    z.timeRange = [start, end];
                    z.dutyConfigs.forEach(d => {
                      d.users = d?.duties?.length ? d.duties.map(d2 => d2.code) : [];
                    });
                  });
                });
              });
              this.forms[item.categoryCode] = item;
              this.$forceUpdate();
            } else {
              this.handleAdd([0]);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (!groupMap[val][0].list.length) {
        this.queryGroupUsers(
          val,
          groupMap[val].map(item => item.value)
        );
      }
    },

    onChangeCity(list, arr) {
      const { tab, cityList } = this;
      const [index, xIndex] = arr;
      if (list[list.length - 1] === NATIONWIDE_CODE) {
        this.forms[tab].configs[index].cityConfigs[xIndex].cities = [
          NATIONWIDE_CODE
        ];
      } else if (list[list.length - 1] === SELECT_ALL) {
        this.forms[tab].configs[index].cityConfigs[
          xIndex
        ].cities = cityList
          .filter(item => item.value !== NATIONWIDE_CODE)
          .map(item => item.value);
      } else {
        this.forms[tab].configs[index].cityConfigs[xIndex].cities = list.filter(
          item => item !== NATIONWIDE_CODE
        );
      }
      this.$forceUpdate();
    },

    onChangeEndTime(val, arr) {
      const { tab } = this;
      const [index, xIndex, yIndex] = arr;
      if (val) {
        this.forms[tab].configs[index].cityConfigs[xIndex].timePeriodConfigs[
          yIndex
        ].timeRange[1] = `${val.split(":")[0]}:59`;
      } else {
        this.forms[tab].configs[index].cityConfigs[xIndex].timePeriodConfigs[
          yIndex
        ].timeRange[1] = "";
      }
      this.$forceUpdate();
    },

    async queryGroupUsers(type, list) {
      try {
        list.forEach(async (item, index) => {
          const params = {
            currPage: 1,
            pageSize: 1000,
            groupCode: item
          };
          const {
            data: {
              success,
              data: { list }
            }
          } = await fetchGroupList(params);
          if (success) {
            this.groupMap[type][index].list = list.map(item => ({
              label: `${item.userName} ${item.userPhone}`,
              value: item.userId,
              userName: item.userName
            }));
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    async handleSubimit(index) {
      const { tab, groupMap } = this;
      const form = this.forms[tab];
      if (form.type === 1) {
        this.forms[tab].type = 2;
        this.$forceUpdate();
        return;
      }
      let params = {
        appId: APPID,
        categoryCode: tab,
        ...form
      };
      // console.log(JSON.stringify(params, null, 2))

      params.configs.forEach(item => {
        item.cityConfigs.forEach(x => {
          x.timePeriodConfigs.forEach(y => {
            const [start, end] = y.timeRange;
            y.timePeriod = { start, end };
            y.dutyConfigs.forEach(z => {
              const { label, value } = z;
              const e = groupMap[tab].find(item => item.value === value);
              if (e) {
                z.groupCode = value;
                z.groupName = label;
                z.classCode = e.classCode;
                z.className = e.className;
              }
              let duties = [];
              z.users.forEach(d => {
                let arr = [];
                groupMap[tab].forEach(d2 => {
                  arr = arr.concat(d2.list);
                });
                arr.every(d2 => {
                  if (d2.value === d) {
                    duties.push({
                      code: d2.value,
                      desc: d2.userName
                    });
                  }
                  return d2.value !== d;
                });
              });
              z.duties = duties;
            });
          });
        });
      });
      // console.log(JSON.stringify(params, null, 2))
      // return
      try {
        const {
          data: { success }
        } = params.id
          ? await pullEditScheduleConfig(params)
          : await pullAddScheduleConfig(params);
        if (success) {
          this.$Message.success("添加成功");
          if (!params.id) {
            this.forms[tab].configs = [];
            this.onClickTabs(tab, 2);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleCanlel() {
      this.$Modal.confirm({
        title: "确定取消吗？",
        onOk: () => {
          this.$router.push({ name: "work-order-query" });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.tabs {
  width: 800px;
  padding: 30px 0 100px 50px;
  .forms {
    margin: 30px 0 0;
  }
}

.action {
  padding: 50px 0;
  .btn {
    margin: 0 20px;
  }
}
</style>
