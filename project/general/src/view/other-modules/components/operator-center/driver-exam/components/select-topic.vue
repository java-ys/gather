<template>
  <div>
    <Modal v-model="show" width="80%" :mask-closable="false" @on-cancel="cancel">
      <div class="pls"></div>
      <Form :model="formItem" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="题目类别：" prop="categoryId">
                <!--:disabled="formItem.isRandom"-->
              <Select
                v-model="formItem.categoryId"
                clearable
                class="item-style"
                :label-in-value="true"
                @on-change="getCategory"
              >
                <Option
                  v-for="item in optionList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex" justify="start" align="middle" style="margin-bottom: 24px; margin-left: -28px;">
          <Col span="2" offset="1">
            <!--<FormItem prop="isRandom">-->
              <Checkbox v-model="formItem.isRandom" @on-change="handleCheckboxChange">一键随机出题</Checkbox>
            <!--</FormItem>-->
          </Col>

          <Col span="3">
            <!--<FormItem prop="randomCount">-->
              <InputNumber v-model="formItem.randomCount" style="width: 150px" :max="200" :min="0" placeholder="请输入题目数" :disabled="!formItem.isRandom" :precision="0"></InputNumber>
            <!--</FormItem>-->
          </Col>

          <Col span="4">
            <!--<FormItem prop="singleOnePercent">-->
              <InputNumber v-model="formItem.singleOnePercent" style="width: 160px" :max="100" :min="0" placeholder="请输入单选题比例百分数" :disabled="!formItem.isRandom" :precision="0"></InputNumber> %
            <!--</FormItem>-->
          </Col>
        </Row>
      </Form>

      <m2-table
        v-if="!formItem.isRandom"
        ref="_t3_table"
        class="mt-20"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @on-select="onSelect"
        @select-cancel="selectCancel"
        @select-all="selectAll"
        @select-all-cancel="selectAll"
      ></m2-table>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-lazy-click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import m2Table from "_a/m2-table/v-table";
import { tool } from "_o/api/baseMixin.js";
import common from "../common";
import { selectTitle } from "../fields";
import s from "_o/api/study-exam";
import { store, mutations, SelectedQuestions } from "./store";

const Max_Num = 200; // 最多200个题目

export default {
  name: "selectTopic",
  props: {
    visible: Boolean,
    modalData: Object,
    selectedQuestions: {
      type: SelectedQuestions,
      default: () => new SelectedQuestions([])
    },
  },
  components: { m2Table },
  mixins: [tool, common],
  data() {
    return {
      show: this.visible,
      formItem: {
        categoryId: "",
        isRandom: false,
        randomCount: null,
        singleOnePercent: null,
      },
      optionList: [], // 题目类别列表
      tableColumns: selectTitle(this),
      tableData: [],
      topicSelectedList: new SelectedQuestions([]),
      snapshotList: new SelectedQuestions([]),
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
      if (this.show) {
        this.topicSelectedList = new SelectedQuestions(this.selectedQuestions.list) // 当前已经选择的数据
        this.snapshotList = new SelectedQuestions(this.selectedQuestions.list)
        this.func = s.questionList;
        this.getList();
        this.getCategoryList();
      } else {
        this.initData();
      }
    },
  },
  computed: {
  },
  methods: {
    async handleCheckboxChange(v) {
      if (v) {
        this.topicSelectedList = new SelectedQuestions(this.snapshotList.list)
      } else {
        this.getList()
      }
    },
    async getCategoryList() {
      const [err, data] = await this.toResult(s.questionCategoryList({}));
      if (err) {
        return;
      }
      this.optionList = this.formatData(data.list);
    },
    formatData(v) {
      return [ { value: '', label: '全部'}, ...(v || []).map((it) => ({
        value: it.categoryId,
        label: it.categoryName,
      })) ];
    },
    async cancel() {
      this.$emit("close", this.selectedQuestions.list); // 把传来的传回去保持不变
    },
    async save() {
      const { categoryId, isRandom, randomCount, singleOnePercent } = this.formItem

      if (!!isRandom) {
        if(!randomCount) {
          this.$Message.error("请输入出题数");
          return
        }
        if(!singleOnePercent) {
          this.$Message.error("请输入单选题比例");
          return
        }
      }

      if (!!isRandom) {
        const [err, data] = await this.toResult(s.questionRandomList({ categoryId, randomCount, singleOnePercent, ids: this.topicSelectedList.ids() }));
        if (err) { return }
        data.list.forEach(async item => await this.topicSelectedList.addItem(item))
      }
      if (this.topicSelectedList.count() > Max_Num)
        return this.$Message.error(`最多只能添加${Max_Num}个题目`);

      this.$emit("close", this.topicSelectedList.list)
    },
    initData() {
      this.optionList = [];
      this.formItem.isRandom = false;
      this.formItem.categoryId = "";
      this.formItem.randomCount = null
      this.formItem.singleOnePercent = null
      this.searchData.categoryId = "";
      this.current = 1;
    },
    getCategory(v) {
      this.searchData.categoryId = v ? v.value : "";
      this.current = 1;
      if (this.formItem.isRandom) return
      this.getList();
    },
    listSuccess() {
      this.setChecked();
    },
    getTableRef() {
      const sel = this.$refs._t3_table;
      if (sel && sel.$refs && sel.$refs.vtable) {
        return sel.$refs.vtable;
      }
    },
    /*
      取消选择:
        1. 点击选中项
        2. 当前页全部取消
      新增选择:
        1. 点击未选中项
        2. 当前页全部选中
    */
    // 点击选中
    async onSelect(selection, row) {
      this.topicSelectedList.addItem(row)
    },
    // 取消选中
    selectCancel(selection, row) {
      this.topicSelectedList.delItem(row.id)
    },
    selectAll(selection) {
      if (!this.getTableRef()) return;
      // 当前页全部取消
      if (selection && selection.length === 0) {
        //  若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
        // 当前页的table数据
        // let data = this.getTableRef().data;
        let data = this.tableData;

        data.forEach(item => {
          if (this.topicSelectedList.has(item.id))
            this.topicSelectedList.delItem(item.id)
        })
      } else {
        // 当前页全部选中
        selection.forEach(item => this.topicSelectedList.addItem(item))
      }
    },
    // selectAllCancel(selection) {
    //   console.log(selection, "select-all-cancel");
    // },
    // 每次获取数据判断是否有选中
    setChecked() {
      console.log('setChecked')
      const ids = this.topicSelectedList.ids()

      this.tableData.forEach(row => {
        if (~ids.indexOf(row.id))
          row._checked = true
        else
          row._checked = false
      })
    },
  },
};
</script>

<style scoped lang="less">
.item-style {
  width: 250px;
}
.pls {
  width: 100%;
  height: 20px;
}
</style>
