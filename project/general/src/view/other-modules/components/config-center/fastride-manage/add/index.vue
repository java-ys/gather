<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      width="860"
      :mask-closable="false"
      :closable="false"
      @on-cancel="cancelAdd"
    >
      <Form
        ref="form"
        :model="addForm"
        :label-width="110"
        :rules="validateRules"
      >
        <Row>
          <Col span="12">
            <FormItem label="策略名称：" prop="ruleName">
              <Input
                v-model="addForm.ruleName"
                placeholder="请输入策略名称"
                :maxlength="20"
                style="width: 290px"
                :disabled="isDetail"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <!-- <FormItem label="策略命中城市：" prop="cityList">
              <Select
                v-model="addForm.cityList"
                multiple
                labelInValue
                filterable
                clearable
                style="width:260px"
                @on-change="getCityChange"
              >
                <Option label="全部" :value="'all'">全部</Option>
                <Option
                  v-for="value in cityList"
                  :key="value.cityID"
                  :value="value.cityID"
                  :disabled="selectedAll"
                  :label="value.city"
                >
                </Option>
              </Select>
            </FormItem> -->
            <FormItem label="策略命中城市：" prop="cityCode">
              <Select
                v-model="addForm.cityCode"
                labelInValue
                filterable
                clearable
                style="width: 290px"
                :disabled="isEdit || isDetail"
              >
                <Option
                  v-for="value in cityList"
                  :key="value.cityID"
                  :value="value.cityID"
                  :label="value.city"
                >
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="策略生效日期：" prop="dateTimeValue">
              <DatePicker
                v-model="addForm.dateTimeValue"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择日期"
                :disabled="isEdit || isDetail"
                style="width: 290px"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="业务线：" prop="expandBizLine">
              <Select
                v-model="addForm.expandBizLine"
                style="width: 290px"
                :disabled="isDetail"
                @on-change="changeBusinessLineList"
              >
                <Option
                  v-for="item in businessLineList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </Select>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="服务权益:" prop="benefit">
              <Select v-model="addForm.benefit" clearable style="width:260px">
                <Option :value="'峰必达派单权益'" :label="'峰必达派单权益'" />
              </Select>
            </FormItem>
          </Col> -->
        </Row>
        <div v-for="(item, index) in addForm.groupDtoList" :key="addForm.expandBizLine + '-' + index" class="set-content">
          <div class="item-tit">配置{{index + 1}}</div>
          <div class="item-set">
            <Row>
              <Col span="22">
                <FormItem :label-width="180" label="策略时间段：" :prop="'groupDtoList.' + index + '.startTime'" :rules="[{ required: true, message: '请选择' }]">
                  <TimePicker v-model="item.startTime" type="time" placeholder="开始时间" :editable="false" format="HH:mm:ss" style="width: 120px" :disabled="isDetail"></TimePicker>
                  <span class="inline-box margin5"> 至 </span>
                  <FormItem class="inline-box" :prop="'groupDtoList.' + index + '.endTime'" :rules="[{ required: true, message: '请选择' }]">
                    <TimePicker v-model="item.endTime" type="time" placeholder="结束时间" :editable="false" format="HH:mm:ss" style="width: 120px" :disabled="isDetail"></TimePicker>
                  </FormItem>
                </FormItem>
                <FormItem :label-width="180" label="重复机制：" :prop="'groupDtoList.' + index + '.workRestDayType'" :rules="[{ required: true, message: '请选择' }]" class="tit">
                  <Select v-model="item.workRestDayType" multiple clearable style="width:260px" :disabled="isDetail">
                    <Option :value="1" label="工作日" />
                    <Option :value="2" label="休息日" />
                  </Select>
                </FormItem>
                <!-- <FormItem :label-width="140" label="业务线露出用户群：" :prop="'groupDtoList.' + index + '.groups'" :rules="[{ required: true, message: '请选择' }]" class="tit">
                  <Select v-model="item.groups" multiple clearable style="width:260px">
                    <Option v-for="(item, index) in weekList" :key="index" :value="item.value" :label="item.label" />
                  </Select>
                </FormItem> -->
                <!-- 用户群 -->
                <div @click="getDelGroupIndex(index)">
                  <FormItem
                    :label-width="180"
                    label="业务线露出用户群："
                    :prop="'groupDtoList.' + index + '.userGroupType'"
                    :rules="[{ required: true, message: '请选择' }]"
                  >
                    <RadioGroup
                      v-model="item.userGroupType"
                      class="right15"
                      @on-change="item.userGroupArray.splice(0, 10)"
                    >
                      <Radio
                        :label="1"
                        :disabled="isDetail"
                      >
                        全部用户
                      </Radio>
                      <Radio
                        :label="2"
                        :disabled="isDetail"
                      >
                        选择用户群
                      </Radio>
                    </RadioGroup>
                    <Button
                      v-show="item.userGroupType === 2 && !isDetail"
                      type="primary"
                      size="small"
                      @click="viewGroup(index)"
                    >
                      查看用户群
                    </Button>
                  </FormItem>
                  <FormItem
                    v-if="item.userGroupType === 2"
                    prop="userGroupArray"
                    class="no-left-margin table-item"
                  >
                    <Table
                      width="700"
                      size="small"
                      border
                      :columns="userGroupColumnsNew"
                      :data="item.userGroupArray"
                    />
                  </FormItem>
                </div>
                <Row v-if="isSpecialOffer">
                  <Col span="12">
                    <FormItem :label-width="180" label="订单里程下限(包含该数值)：" :prop="'groupDtoList.' + index + '.orderMileStart'">
                      <Input-number
                        v-model="item.orderMileStart"
                        placeholder="请输入"
                        :min="0"
                        :disabled="isDetail"
                        style="width: 120px; margin-right: 6px"
                      />Km
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem :label-width="180" label="订单里程上限(包含该数值)：" :prop="'groupDtoList.' + index + '.orderMileEnd'">
                      <Input-number
                        v-model="item.orderMileEnd"
                        placeholder="请输入"
                        :min="1"
                        :disabled="isDetail"
                        style="width: 120px; margin-right: 6px"
                      />Km
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="2">
                <Button v-if="!isDetail" type="error" size="small" @click.native="delSetItem(index)">删除</Button>
              </Col>
            </Row>
          </div>
        </div>
        <Button v-if="!isDetail" type="primary" size="small" @click.native="addSetItem">新增配置</Button>
      </Form>
      <div slot="footer">
        <Button
          size="large"
          type="text"
          style="margin-right: 8px;"
          @click="cancelAdd"
        >
          取消
        </Button>
        <Button
          v-if="!isDetail"
          v-lazy-click="confirmAdd"
          size="large"
          type="primary"
        >
          确定
        </Button>
      </div>
    </Modal>
    <!-- 选择新用户群弹窗 -->
    <Modal
      v-model="showUserGroupModdal"
      width="80%"
      footer-hide
      title="查看新用户群"
    >
      <new-user-group-modal
        v-if="addForm.groupDtoList[nowGroupIndex] && addForm.groupDtoList[nowGroupIndex].userGroupType === 2"
        :isShow="showUserGroupModdal"
        :list="addForm.groupDtoList[nowGroupIndex].userGroupArray"
        @close="showUserGroupModdal = false"
        @selectDown="selectUserGroupDown"
      />
    </Modal>
  </div>
</template>
<script>
import { validateRules, weekList, userGroupColumnsNew } from "./fields.js";
import { businessLineList } from "../index.js"
import { mapActions, mapState } from "vuex";
import { timeFormat } from "@/libs/util";
import {
  fastCarAdd, fastCarEdit
} from "_o/api/fast-car.js";
import newUserGroupModal from "_a/new-user-group-modal/index.vue";

const Max_Num = 1000; // 最大可设置*个配置内容
const Min_Num = 1; // 最少需设置1个配置内容

export default {
  components: {
    newUserGroupModal,
  },
  props: {
  },
  data() {
    return {
      title: "",
      showModal: false,
      validateRules,
      addForm: {
        ruleName: "",
        // cityList: [],
        cityCode: "",
        dateTimeValue: [],
        expandBizLine: 11,
        // benefit: "",
        groupDtoList: [
          {
            startTime: "",
            endTime: "",
            groups: [],
            userGroupType: "",
            // allGroups: false,  // 是否选全部用户群true/false
            userGroupArray: [],
            workRestDayType: [],
            orderMileStart: null,
            orderMileEnd: null
          }
        ]
      },
      nowGroupIndex: 0,
      delGroupIndex: 0,
      weekList,
      userGroupColumnsNew: userGroupColumnsNew(this),
      showUserGroupModdal: false,
      businessLineList,
      editData: {}
    };
  },
  computed: {
    // selectedAll() {
    //   if (this.addForm.cityList && this.addForm.cityList.length > 0)
    //   { return this.addForm.cityList.some(item => item === "all"); }
    // },
    ...mapState({
      cityList: (state) => state.common.cityList || [],
    }),
    isEdit() {
      return this.title === "编辑";
    },
    isDetail() {
      return this.title === "详情";
    },
    isSpecialOffer() {
      return this.addForm.expandBizLine === 11
    }
  },
  watch: {
  },
  mounted() {
    if (!this.cityList || !this.cityList.length) {
      this.getCityList();
    }
  },
  methods: {
    ...mapActions(["getCityList"]),
    changeBusinessLineList(value) {
      this.addForm.groupDtoList = [
        {
          startTime: "",
          endTime: "",
          groups: [],
          userGroupType: "",
          userGroupArray: [],
          workRestDayType: [],
          orderMileStart: null,
          orderMileEnd: null
        }
      ]
      if (this.title !== "新建" && this.editData.expandBizLine === value) {
        this.addForm.groupDtoList = this.handleDetailGroupList(this.editData.groupDtoList);
      }
    },
    getCityChange(cityItem, init) {
      this.addForm.cityList = [];
      let hasAll = cityItem.some(item => item.value === "all")
      if (hasAll) {
        this.addForm.cityList = [];
        this.addForm.cityList.push("all");
        this.addForm.cityCodes = []
      } else {
        Array.prototype.push.apply(this.addForm.cityList, cityItem.map(item => item.value));
        this.addForm.cityCodes = this.addForm.cityList;
      }
    },
    init(val, title) {
      this.showModal = true;
      this.$refs.form.resetFields();
      this.title = title;
      // 新增
      if (title === "新建") {
        this.addForm.groupDtoList = [
          {
            startTime: "",
            endTime: "",
            groups: [],
            userGroupType: "",
            userGroupArray: [],
            workRestDayType: [],
            orderMileStart: null,
            orderMileEnd: null
          }
        ]
        // this.addForm.groupDtoList = this.addForm.groupDtoList.slice(0, 1)
      } else { // 编辑、详情、复制
        const { uuid, ruleName, cityCode, effectiveTime, failureTime, groupDtoList, expandBizLine } = val;
        this.editData = JSON.parse(JSON.stringify(val))
        this.addForm.uuid = uuid;
        this.addForm.ruleName = ruleName;
        this.addForm.cityCode = cityCode;
        this.addForm.dateTimeValue[0] = effectiveTime;
        this.addForm.dateTimeValue[1] = failureTime;
        this.addForm.expandBizLine = expandBizLine;
        this.addForm.groupDtoList = this.handleDetailGroupList(groupDtoList);
      }
    },
    handleDetailGroupList(list) {
      let newList = []
      list.forEach(item => {
        let userGroupArray = []
        item.groups.forEach(i => {
          userGroupArray.push({
            userGroupCode: i.groupId,
            userGroupName: i.desc,
            uuid: i.groupId,
          })
        })
        newList.push({
          startTime: item.startTime,
          endTime: item.endTime,
          userGroupType: item.allGroups ? 1 : 2,
          userGroupArray: userGroupArray,
          workRestDayType: item.workRestDayType,
          orderMileStart: item.orderMileStart,
          orderMileEnd: item.orderMileEnd
        })
      });
      return newList
    },
    // 取消新增
    cancelAdd() {
      if (!this.isDetail) {
        this.$Modal.confirm({
          title: "是否确认取消矩阵策略管理配置？",
          onOk: () => {
            this.showModal = false;
            this.$refs.form.resetFields();
          },
        });
      } else {
        this.showModal = false;
        this.$refs.form.resetFields();
      }
    },
    // 提交
    confirmAdd() {
      let _this = this;
      _this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        let effectiveTime = timeFormat(new Date(_this.addForm.dateTimeValue[0]).getTime(), "yyyy-mm-dd");
        let failureTime = timeFormat(new Date(_this.addForm.dateTimeValue[1]).getTime(), "yyyy-mm-dd");
        let params = {};
        params = {
          ruleName: _this.addForm.ruleName,
          cityCode: _this.addForm.cityCode,
          effectiveTime: effectiveTime,
          failureTime: failureTime,
          expandBizLine: _this.addForm.expandBizLine,
          // benefit: this.addForm.benefit,
          GroupDtoList: _this.handleGroupList(_this.addForm.groupDtoList),
        };
        console.log("params", params)
        // if (new Date(this.addForm.dateTimeValue[0]).getTime() < Date.now()) {
        //   this.$Message.error("策略生效日期必须大于当前时间");
        //   return;
        // }
        for (let i = 0; i < _this.addForm.groupDtoList.length; i++) {
          let item = _this.addForm.groupDtoList[i]
          const startTime = new Date(`2000-01-10 ${item.startTime}`).getTime();
          const endTime = new Date(`2000-01-10 ${item.endTime}`).getTime();

          if (startTime >= endTime) {
            _this.$Message.error("策略时间段结束时间必须大于开始时间");
            return
          }
          if (item.userGroupType === 2 && item.userGroupArray && !item.userGroupArray.length) {
            _this.$Message.error("请选择用户群");
            return
          }
          if ((item.orderMileStart !== null) && (item.orderMileEnd !== null) && (item.orderMileStart >= item.orderMileEnd)) {
            _this.$Message.error("订单里程上限必须大于里程下限");
            return
          }
          if (i < _this.addForm.groupDtoList.length - 1) {
            for (let j = i + 1; j < _this.addForm.groupDtoList.length; j++) {
              let item1 = _this.addForm.groupDtoList[j];
              const startTime1 = new Date(`2000-01-10 ${item1.startTime}`).getTime();
              const endTime1 = new Date(`2000-01-10 ${item1.endTime}`).getTime();
              if ((startTime1 >= startTime && startTime1 <= endTime) || (endTime1 >= startTime && endTime1 <= endTime)) {
                let key = "workRestDayType"
                let allWeekDay_length = Array.from(new Set(item[key].concat(item1[key]))).length
                console.log(allWeekDay_length, item[key].length + item1[key].length)
                if (allWeekDay_length !== item[key].length + item1[key].length) {
                  this.$Message.error("各配置项策略时间段不能重复");
                  return
                }
              }
            }
          }
        }
        // 发送保存请求
        if (this.title === "编辑" || this.title === "复制") {
          params.uuid = this.addForm.uuid;
          this.submitLoading = true;
          this.commit(params);
        } else {
          this.submitLoading = true;
          this.commit(params);
        }
      });
    },
    handleGroupList(list) {
      let newList = []
      list.forEach(item => {
        let groups = []
        item.userGroupArray.forEach(i => {
          groups.push({
            groupId: i.userGroupCode,
            desc: i.userGroupName,
          })
        })
        const diffParams = this.isSpecialOffer
          ? {
            orderMileStart: item.orderMileStart,
            orderMileEnd: item.orderMileEnd,
          }
          : null
        newList.push({
          startTime: item.startTime,
          endTime: item.endTime,
          allGroups: item.userGroupType === 1,
          groups: groups,
          workRestDayType: item.workRestDayType,
          ...diffParams
        })
      });
      return newList
    },
    commit(params) {
      let commitFastCar = null;
      if (this.title === "编辑") {
        commitFastCar = fastCarEdit;
      } else {
        commitFastCar = fastCarAdd;
      }
      commitFastCar(params).then(res => {
        this.submitLoading = false;
        if (res.data.success) {
          this.$Message.success(res.data.msg || "保存成功");
          this.$refs.form.resetFields();
          this.showModal = false;
          this.$emit("confirmAdd");
        } else {
          this.$Message.warning(res.data.msg);
        }
      }).catch(err => {
        this.submitLoading = false;
        console.log(err);
      });
    },
    // 删除配置
    delSetItem(i) {
      this.$Modal.confirm({
        title: "确认删除该配置？",
        onOk: () => {
          const { groupDtoList } = this.addForm;
          if (groupDtoList.length > Min_Num) {
            groupDtoList.splice(i, 1);
          } else {
            this.$Message.error(`最少需设置${Min_Num}个配置内容`);
          }
        },
      });
    },
    // 新增配置
    addSetItem() {
      const { groupDtoList } = this.addForm;
      if (groupDtoList.length < Max_Num) {
        groupDtoList.push({
          startTime: "",
          endTime: "",
          userGroupType: "",
          userGroupArray: [],
          workRestDayType: [],
          orderMileStart: null,
          orderMileEnd: null
        });
      } else {
        this.$Message.error(`最多可设置${Max_Num}个配置内容`);
      }
    },
    viewGroup(index) {
      this.showUserGroupModdal = true;
      this.nowGroupIndex = index
    },
    // 选择用户群
    selectUserGroupDown(list) {
      let selectCopy = JSON.parse(JSON.stringify(this.addForm.groupDtoList[this.nowGroupIndex].userGroupArray));
      this.addForm.groupDtoList[this.nowGroupIndex].userGroupArray.splice(
        0,
        this.addForm.groupDtoList[this.nowGroupIndex].userGroupArray.length
      );
      let selectHash = {};
      selectCopy.forEach((item, index) => {
        selectHash[item.uuid] = String(index);
      });
      let addList = [];
      list.forEach(item => {
        let index = selectHash[item.uuid];
        if (index) {
          this.addForm.groupDtoList[this.nowGroupIndex].userGroupArray.push(selectCopy[index]);
        } else {
          addList.push(item);
        }
      });
      this.addForm.groupDtoList[this.nowGroupIndex].userGroupArray.push(...addList);
    },
    getDelGroupIndex(index) {
      this.delGroupIndex = index
    }
  }
};
</script>
<style scoped lang="less">
.set-content {
  margin-bottom: 24px;
  .item-tit{
    padding-left:12px;
    font-size: 14px;
    line-height: 32px;
    font-weight: bold;
  }
  .item-set {
    width: 96%;
    padding: 12px 0 12px;
    box-sizing: border-box;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin-bottom: 12px;
  }
  /deep/ .ivu-form-item-label {
    font-weight: bold;
  }
}
</style>