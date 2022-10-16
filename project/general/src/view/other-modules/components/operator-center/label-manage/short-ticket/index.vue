<!--
 * @description: 评价管理-短问卷管理
 * @author: wuxuan
 * @date: 2019-09-16 14:48:35
 * @后台人员: 曹东风
!-->
<template>
  <div>
    <SearchList
      :inputList="inputList"
      @on-search="search"
      @on-reset="search"
    ></SearchList>
    <Button
      v-hasAuth="'short-ticket-history'"
      class="pull-right"
      type="success"
      @click="openHistory(true)"
    >
      操作记录
    </Button>
    <Button
      v-hasAuth="'short-ticket-add'"
      type="primary"
      @click="addNew"
    >
      新建短问卷
    </Button>
    <m2-table
      class="top15"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :isLoading="isLoading"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <!-- 列表按钮 -->
      <template
        slot="action"
        slot-scope="params"
      >
        <Button
          v-hasAuth="'short-ticket-detail'"
          ghost
          type="info"
          size="small"
          class="tableBtn"
          @click="openDetail(params.data.row)"
        >
          详情
        </Button>
        <Button
          v-if="params.data.row.status === 0"
          v-hasAuth="'short-ticket-on'"
          ghost
          type="success"
          size="small"
          class="tableBtn"
          @click="axiosSwitchStatus(params.data.row,1)"
        >
          启用
        </Button>
        <Button
          v-else
          v-hasAuth="'short-ticket-off'"
          ghost
          type="warning"
          size="small"
          class="tableBtn"
          @click="switchStatus(params.data.row,2)"
        >
          停用
        </Button>
        <Button
          v-hasAuth="'short-ticket-delete'"
          ghost
          type="error"
          size="small"
          @click="switchStatus(params.data.row,3)"
        >
          删除
        </Button>
      </template>
    </m2-table>
    <!-- 新建问卷 -->
    <Modal
      v-model="addModal"
      :width="600"
      title="新建短问卷"
      :mask-closable="false"
      @on-cancel="formReset('addForm')"
    >
      <Form
        ref="addForm"
        :model="addData"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="问题："
          prop="name"
        >
          <Input
            v-model="addData.name"
            :maxlength="20"
            placeholder="请输入"
            class="width200"
          ></Input>
          <span class="counter">( {{ addData.name?addData.name.length:0 }}/20 )</span>
        </FormItem>
        <FormItem
          label="业务线："
          prop="businessType"
        >
          <CheckboxGroup v-model="addData.businessType">
            <Checkbox
              v-for="item in businessCarList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem
          v-if="addData.businessType.includes(5)"
          label="目标用户："
          prop="targetUsers"
        >
          <CheckboxGroup v-model="addData.targetUsers">
            <Checkbox :label="1">
              司机
            </Checkbox>
            <Checkbox :label="0">
              乘客
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <!-- eslint-disable -->
        <FormItem
          label="评价标签："
          prop="tagId"
        >
          <Select
            v-model="addData.tagId"
            filterable
            placeholder="请选择"
            class="width200"
          >
            <Option
              v-for="item in allLabelList"
              :key="item.uuid"
              class="max-width"
              :value="item.uuid"
            >{{ item.labelName }}</Option>
          </Select>
        </FormItem>
        <!-- eslint-enable -->
        <Form
          v-for="(item,index) in addData.surveyOptionResDtoList"
          :ref="'options'+index"
          :key="index-100"
          :model="item"
          :rules="ruleValidate"
          :label-width="120"
        >
          <FormItem
            :label="'选项'+(++index)+'：'"
            prop="name"
          >
            <Input
              v-model="item.name"
              :maxlength="3"
              placeholder="请输入"
              class="width200"
            ></Input>
            <span class="counter">( {{ item.name?item.name.length:0 }}/3 )</span>
          </FormItem>
          <!-- eslint-disable -->
          <FormItem
            label="图标："
            prop="picture"
          >
            <Select
              v-model="item.picture"
              filterable
              placeholder="请选择"
              class="width200 right15"
            >
              <Option value="icon_adopted">满意</Option>
              <Option value="icon_noadopted">不满意</Option>
            </Select>
            <img
              v-if="item.picture==='icon_adopted'"
              src="@/view/other-modules/assets/images/operator/yes.png"
              alt="满意"
            />
            <img
              v-if="item.picture==='icon_noadopted'"
              src="@/view/other-modules/assets/images/operator/no.png"
              alt="满意"
            />
          </FormItem>
          <!-- eslint-enable -->
          <FormItem
            label="是否拍照"
            prop="takePicture"
          >
            <RadioGroup
              v-model="item.takePicture"
              @on-change="changeTakePhoto"
            >
              <Radio
                label="1"
              >
                是
              </Radio>
              <Radio
                label="0"
              >
                否
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <!-- eslint-disable -->
        <!-- 增加推送节点 -->
        <FormItem
          label="推送节点："
          prop="pushNode"
        >
          <Select
            v-model="addData.pushNode"
            filterable
            placeholder="请选择"
            class="width200"
          >
            <Option
              v-for="item in pushNodeList"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <!-- eslint-enable -->
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="addModal = false;formReset('addForm')"
        >
          取消
        </Button>
        <Button
          type="primary"
          @click="addSubmit('addForm')"
        >
          确认
        </Button>
      </div>
    </Modal>
    <!-- 问卷详情 -->
    <Modal
      v-model="detailModal"
      :width="600"
      title="短问卷详情"
      :mask-closable="false"
    >
      <Form :label-width="120">
        <FormItem label="问题：">
          {{ detailInfo.name }}
        </FormItem>
        <FormItem label="业务线：">
          {{ detailInfo.businessType }}
        </FormItem>
        <FormItem
          v-if="detailInfo.targetUser"
          label="目标用户："
        >
          {{ detailInfo.targetUser }}
        </FormItem>
        <FormItem label="评价标签：">
          <span v-if="detailInfo.surveyTagResDtoList && detailInfo.surveyTagResDtoList.length>0">
            <span
              v-for="item in detailInfo.surveyTagResDtoList"
              :key="item.tagId"
            >{{ item.tagName }}</span>
          </span>
          <span v-else>未设置</span>
        </FormItem>
        <div
          v-for="(item,index) in detailInfo.surveyOptionResDtoList"
          :key="index"
        >
          <FormItem :label="'选项'+(index+1)+'：'">
            {{ item.name }}
          </FormItem>
          <FormItem :label="'反馈'+(index+1)+'：'">
            {{ item.feedback }}
          </FormItem>
          <FormItem label="图标：">
            <div v-if="item.picture==='icon_adopted'">
              <span class="right30">满意</span>
              <img
                src="@/view/other-modules/assets/images/operator/yes.png"
                alt="满意"
              />
            </div>
            <div v-if="item.picture==='icon_noadopted'">
              <span class="right30">不满意</span>
              <img
                src="@/view/other-modules/assets/images/operator/no.png"
                alt="不满意"
              />
            </div>
            <span v-if="!item.picture">未设置</span>
          </FormItem>
          <FormItem
            label="是否拍照"
            prop="takePicture"
          >
            <RadioGroup
              v-model="item.takePicture"
            >
              <Radio
                label="1"
                disabled
              >
                是
              </Radio>
              <Radio
                label="0"
                disabled
              >
                否
              </Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <FormItem
          v-if="detailInfo.pushNode+''"
          label="推荐节点："
        >
          {{ detailInfo.pushNodeLabel }}
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          @click="detailModal=false"
        >
          确认
        </Button>
      </div>
    </Modal>
    <!-- 操作记录 -->
    <Modal
      v-model="historyModal"
      :width="1130"
      title="操作记录"
      :mask-closable="false"
    >
      <v-table
        :total="hisObj.total"
        :current="hisObj.current"
        :pageSize="hisObj.pageSize"
        :parColumns="hisObj.tableColumns"
        :parTableData="hisObj.tableData"
        @changePage="changeHisPage"
        @changePageSize="changeHisPageSize"
      >
      </v-table>
      <div slot="footer">
        <Button
          type="primary"
          @click="historyModal=false"
        >
          确认
        </Button>
      </div>
    </Modal>

    <!-- 问卷详情 -->
    <questionDetail
      v-if="viewFeedbackDetail"
      :detail="detail"
      :visible="viewFeedbackDetail"
      @update:visible="toggleFeedbackDetail"
    ></questionDetail>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import m2Table from "_a/m2-table/v-table";
import { inputList, parColumns, ruleValidate, businessCarList, hisColumns, pushNodeList } from "./fields";
import {
  axiosAddSurveyQuestion,
  axiosListSurveyTag,
  axiosQuerySurveyInfo,
  axiosSurveyQuestionPage,
  axiosUpdateSurveyQuestion,
  axiosShortTicketHistory,
  axiosShortTicketAllLabel
} from "_o/api/operator-carrier";
import questionDetail from "./question-detail"

export default {
  name: "short-ticket",
  components: {
    VTable,
    m2Table,
    questionDetail
  },
  data() {
    return {
      detail: {},
      viewFeedbackDetail: false,
      ruleValidate,
      tableColumns: parColumns(this),
      businessCarList,
      inputList: JSON.parse(JSON.stringify(inputList)),
      searchData: {},
      total: 0,
      current: 1,
      pageSize: 10,
      tableData: [],
      hisObj: {
        total: 0,
        current: 1,
        pageSize: 10,
        tableData: [],
        tableColumns: hisColumns
      },
      // 以下为新增部分
      addModal: false,
      addData: {
        name: "",
        businessType: [],
        targetUsers: [],
        tagId: "",
        choiceNumber: 1,
        surveyOptionResDtoList: [
          {
            name: "",
            inputChoice: 1,
            picture: "",
            takePicture: "0"
          },
          {
            name: "",
            inputChoice: 1,
            picture: "",
            takePicture: "0"
          }
        ],
        // 推送节点
        pushNode: ""
      },
      allLabelList: [], // 所有标签列表
      // 推送节点列表
      pushNodeList,
      detailModal: false, // 详情弹窗
      detailInfo: {}, // 详情信息
      historyModal: false, // 操作记录弹窗
      isLoading: false, // 列表加载状态
      // isSubmitLoading: false // 新增提交状态
    };
  },
  mounted() {
    // 获取列表数据
    this.getTableList();
    // 获取列表中已配置的评价标签
    this.getLabelList();
  },
  methods: {
    changeTakePhoto(...args) {
      console.log(args)
    },
    // 查看车牌号
    handleViewFeedbackDetail() {
      this.viewFeedbackDetail = true
    },
    toggleFeedbackDetail() {
      this.viewFeedbackDetail = false
    },
    // 问卷详情
    goAnswerDetail(params) {
      console.log(params)
      this.viewFeedbackDetail = true
      this.detail = {
        ...params
      }
    },
    /*
     *@description: 筛选项评价标签列表获取，备选项为列表中所有已设置的评价标签
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    getLabelList() {
      let that = this
      axiosListSurveyTag({}).then(res => {
        let list = res.data.data
        list.forEach(item => {
          item.label = item.tagName
          item.value = item.tagId
        })
        that.inputList[1].dropList = list
      })
    },
    /*
     *@description: 从【乘客评价标签】标签池中选择的所有标签，用作新增选择
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    getAllLabelList() {
      axiosShortTicketAllLabel({}).then(res => {
        this.allLabelList = res.data.data
      })
    },
    /*
     *@description: 停用二次确认，调用接口改变状态，停用，删除
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    switchStatus(item, status) {
      let that = this;
      let msg = status === 3 ? "删除" : "停用"
      this.$Modal.confirm({
        title: `确定${msg}该短问卷？`,
        onOk: () => {
          that.axiosSwitchStatus(item, status);
        }
      });
    },
    /*
     *@description: 停用启用,s删除操作，调用接口改变状态，获取最新列表
     *@params: status-停用启用状态，想要停用，传停用状态，停2，启1，删除3
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    axiosSwitchStatus(item, status) {
      let params = {
        id: item.id,
        updateType: status,
        name: item.name
      }
      axiosUpdateSurveyQuestion(params).then(res => {
        this.getTableList()
        let msgMap = {
          1: "启用成功！",
          2: "停用成功！",
          3: "删除成功！"
        }
        this.$Message.success(msgMap[status])
        // 删除需要重新获取label
        status === 3 && this.getLabelList()
      })
    },
    /*
     *@description: 点击详情按钮，获取详情信息，打开弹窗
     *@params: 行信息
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    openDetail(item) {
      let that = this
      axiosQuerySurveyInfo({ id: item.id }).then(res => {
        let data = res.data.data;
        let map = {
          0: "乘客",
          1: "司机",
          2: "乘客，司机"
        }
        data.targetUser && (data.targetUser = map[data.targetUser])
        that.detailInfo = data;
        const pushNodeLabel = (this.pushNodeList.find(item => String(item.value) === String(data.pushNode)) || {}).label
        that.detailInfo = {
          ...that.detailInfo,
          pushNodeLabel
        }
        that.detailInfo.surveyOptionResDtoList.forEach((item, index) => {
          if (item) {
            let obj = item
            item.feedback = obj.usageQuantity + " / " + obj.percentage + "%"
            // 是否拍照，默认否
            item.takePicture = (obj.takePicture === null || obj.takePicture === "" || obj.takePicture === undefined) ? "0" : String(obj.takePicture)
          }
        });
        // 标签名称
        that.detailInfo.tagName = item.surveyTagResDtoList[0] ? item.surveyTagResDtoList[0].tagName : ""
        that.detailModal = true
      })
    },
    /*
     *@description: 点击操作记录按钮，获取操作记录列表，打开弹窗
     *@author: wuxuan
     *@date: 2019-09-16 16:04:15
     */
    openHistory(isOpen) {
      let that = this
      let params = {
        pageSize: isOpen ? 10 : this.hisObj.pageSize,
        currPage: isOpen ? 1 : this.hisObj.current
      }
      axiosShortTicketHistory(params).then(res => {
        let data = res.data.data;
        let listData = (data && data.list) || [];
        that.hisObj.tableData = listData
        that.hisObj.total = (data && data.totalCount) || 0;
        isOpen && (that.historyModal = true)
      })
    },
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.getTableList();
    },
    /*
     *@description: 根据查询条件获取短问卷列表
     *@author: wuxuan
     *@date: 2019-09-20 09:53:17
     */
    getTableList() {
      let params = {
        pageSize: this.pageSize,
        currPage: this.current
      };
      params = Object.assign(this.searchData, params);
      this.isLoading = true
      axiosSurveyQuestionPage(params).then(res => {
        this.isLoading = false
        let data = res.data.data;
        let listData = (data && data.list) || [];
        this.tableData = listData
        this.total = data.totalCount || 0;
      }).catch(err => {
        console.log("err", err)
        this.isLoading = false
        this.total = 0
        this.tableData = []
      });
    },
    changePage(val) {
      this.current = val;
      this.getTableList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getTableList();
    },
    // 修改操作记录的分页信息
    changeHisPage(val) {
      this.hisObj.current = val;
      this.openHistory();
    },
    changeHisPageSize(val) {
      this.hisObj.pageSize = val;
      this.openHistory();
    },
    // 以下为新增部分fun，不用可删
    addNew() {
      this.addModal = true;
      // 获取所有label数据
      this.getAllLabelList();
    },
    formReset(name) {
      this.$refs[name].resetFields();
      this.$refs["options0"][0].resetFields();
      this.$refs["options1"][0].resetFields();
    },
    addSubmit(name) {
      let that = this;
      let [isTopSuccess, isBottomSuccess] = [false, true]

      // 上半部分，addData校验
      that.$refs[name].validate(valid => {
        isTopSuccess = valid
        return new Promise((resolve) => { resolve() })
      }).then(() => {
        // 下半部分，选项校验
        let list = that.addData.surveyOptionResDtoList
        list.forEach((item, index) => {
          let key = "options" + index
          that.$refs[key][0].validate().then(status => {
            if (!status) {
              isBottomSuccess = false
            }
          });
        })
        return new Promise((resolve) => { resolve() })

      }).then(() => {
        // that.isSubmitLoading = true
        // 上下校验都通过，请求接口保存
        if (isTopSuccess && isBottomSuccess) {
          let params = { ...that.addData }
          // 为满足操作记录显示标签名，此处需要传标签名：tagName
          that.allLabelList.forEach(item => {
            if (item.uuid === params.tagId) {
              params.tagName = [item.labelName]
            }
          })
          params.tagId = [params.tagId]
          axiosAddSurveyQuestion(params).then(res => {
            // 刷新列表
            that.getTableList();
            // 刷新评价标签筛选项
            that.getLabelList();
            // 关闭弹窗
            that.addModal = false;
            // 清空填写信息
            that.formReset(name);
            // 提示成功
            that.$Message.success("新建成功!");
            // that.isSubmitLoading = false
          });
        }
      })
    }
  }
};
</script>
<style scoped lang='less'>
.pull-right {
  float: right;
}
</style>
