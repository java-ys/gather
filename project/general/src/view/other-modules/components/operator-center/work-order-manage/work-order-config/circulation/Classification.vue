<template>
  <div>
    <Button type="primary" style="margin-bottom: 20px;" @click="showModal = true">新增</Button>
    <m2-table
      :total="total"
      :current="query.currPage"
      :pageSize="query.pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot="action" slot-scope="{data:{row}}">
        <Button type="primary" @click="onEdit(row)">编辑</Button>
      </template>
    </m2-table>
    <ModalWrap v-model="showModal" :title="info.id?'编辑':'新增'" width="900" @on-ok="onConfirm">
      <Form ref="form" :model="info" :rules="rules" label-position="right" :label-width="110">
        <Row>
          <Col span="12">
            <FormItem label="一级分类：" prop="categoryFirst">
              <Select v-model="info.categoryFirst">
                <Option v-for="v of classes1" :key="v.id" :value="v.uuid">{{v.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="二级分类：" prop="categorySecond">
              <Select v-model="info.categorySecond" :placeholder="!info.categoryFirst?'请先选择一级分类':'请选择'">
                <Option v-for="v of classes2" :key="v.id" :value="v.uuid">{{v.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="三级分类：" prop="categoryThird">
              <Select v-model="info.categoryThird" :placeholder="!info.categorySecond?'请先选择二级分类':'请选择'">
                <Option v-for="v of classes3" :key="v.id" :value="v.uuid">{{v.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="四级分类：" prop="categoryFourth">
              <Select v-model="info.categoryFourth" :placeholder="!info.categoryThird?'请先选择三级分类':'请选择'">
                <Option v-for="v of classes4" :key="v.id" :value="v.uuid">{{v.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row style="margin-bottom: 20px;border-bottom: 1px solid #e8eaec" :gutter="10">
          <Col span="8">
            <FormItem label="处理总时长：" prop="totalProcessTime">
              <InputNumber v-model="info.totalProcessTime" :min="1" :precision="0" />&nbsp;分钟
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="往返次数：" prop="numOfRoundTrips">
              <InputNumber v-model="info.numOfRoundTrips" :min="0" :precision="0" />&nbsp;次
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="转派确认时间：" prop="tranConfirTime">
              <InputNumber v-model="info.tranConfirTime" :min="1" :precision="0" />&nbsp;分钟
            </FormItem>
          </Col>
        </Row>
        <Form
          v-for="(v,i) of info.detail"
          :key="v.key+'-'+v.type"
          ref="subForms"
          :model="v"
          :rules="subRule"
          label-position="right"
          :label-width="110"
          :style="i%2?'margin-bottom: 20px;border-bottom: 1px solid #e8eaec':''"
        >
          <Row :gutter="10">
            <Col span="8">
              <FormItem :label="(v.type === 2 ? '升级' : '') + '处理时长：'" prop="time">
                <InputNumber v-model="v.time" :min="1" :precision="0" />&nbsp;分钟
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem :label="(v.type === 2 ? '升级' : '') + '处理预警：'" prop="warningTime">
                <InputNumber v-model="v.warningTime" :min="1" :precision="0" />&nbsp;分钟
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem v-if="!(i % 2)" label="部门标签：" prop="labelId">
                <Select v-model="v.labelId">
                  <Option v-for="v of departments" :key="v.id" :value="v.id">{{v.designation}}</Option>
                </Select>
              </FormItem>
              <Button v-else-if="info.detail.length>2||i>1" type="error" @click="onDeleteItem(i)">删除节点</Button>
            </Col>
          </Row>
        </Form>
        <Row><span style="font-weight:bold" @click="onAddDetailItem">增加一个节点<Icon type="ios-add-circle-outline" size="20" /></span></Row>
      </Form>
    </ModalWrap>
  </div>
</template>

<script>
/* eslint-disable no-return-assign */
import { queryClassificationList, queryClassification, postClassification, putClassification,queryAllLabelList,queryClassOptions } from "_o/api/work-order/work-order-config";
import { listMixin } from "./mixin";
import {createRule} from './util';

const DEFAULT_FORM_DATA = {
  categoryFirst: null,
  categorySecond: null,
  categoryThird: null,
  categoryFourth: null,
  totalProcessTime: null,
  numOfRoundTrips: null,
  tranConfirTime: null,
  detail: [],
};

export default {
  name: "Classification",
  mixins: [listMixin],
  data: () => ({
    showModal: false,
    columns: [
      {
        title: "一级分类",
        key: "categoryFirstName",
        minWidth: 120
      },
      {
        title: "二级分类",
        key: "categorySecondName",
        minWidth: 120
      },
      {
        title: "三级分类",
        key: "categoryThirdName",
        minWidth: 120
      },
      {
        title: "四级分类",
        key: "categoryFourthName",
        minWidth: 120
      },
      {
        title: "处理人层级",
        key: "seq",
        width: 100
      },
      {
        title: "总处理时长",
        key: "totalProcessTime",
        width: 100
      },
      {
        title: "部门标签",
        key: "handleLabelName",
        minWidth: 120
      },
      {
        title: "往返次数",
        key: "numOfRoundTrips",
        width: 100
      },
      {
        title: "配置人",
        key: "creator",
        minWidth: 100
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 100,
        slot: "action"
      }
    ],
    info: JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)),
    rules: {
      categoryFirst: createRule('请选择一级分类', 'string', 'change'),
      categorySecond: createRule('请选择二级分类', 'string', 'change'),
      categoryThird: createRule('请选择三级分类', 'string', 'change'),
      categoryFourth: createRule('请选择四级分类', 'string', 'change'),
      totalProcessTime: createRule('请输入总处理时长', 'number'),
      numOfRoundTrips: createRule('请输入往返次数', 'number'),
      tranConfirTime: createRule('请输入转派确认时间', 'number'),
    },
    subRule: {
      time: createRule('请输入处理时长','number'),
      warningTime: createRule('请输入处理预警','number'),
      labelId: createRule('请选择标签','number'),
    },
    departments: [],
    classes1: [],
    classes2: [],
    classes3: [],
    classes4: [],
    lock: false,
  }),
  watch: {
    "info.categoryFirst"(v) {
      this.onCategoryChange(1, v);
    },
    "info.categorySecond"(v) {
      this.onCategoryChange(2, v);
    },
    "info.categoryThird"(v) {
      this.onCategoryChange(3, v);
    },
    showModal(v) {
      if(!v) {
        setTimeout(() => {
          this.info = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
          this.onAddDetailItem();
          this.$nextTick(() => {
            this.$refs.subForms.concat(this.$refs.form).forEach(form => form.resetFields());
          })
        },300)
      }
    }
  },
  created() {
    this.updateClasses(1);
    this.onAddDetailItem();
    queryAllLabelList({}).then(res => this.departments = res);
  },
  methods: {
    requestList: queryClassificationList,
    onCategoryChange(level, value) {
      if(!this.lock) this.info['category' + ['Second','Third','Fourth'][level-1]] = "";
      this['classes'+(level+1)] = [];
      value && this.updateClasses(level+1, value);
    },
    onEdit(row) {
      queryClassification({ id: row.id }).then(res => {
        res.detail.forEach((v,i) => v.key = i);
        this.lock = true;
        this.info = res;
        this.showModal = true;
        this.$nextTick(() => this.lock = false);
      })
    },
    updateClasses(level, parent = "") {
      queryClassOptions({ appId: "31f937c72b80474a86c4c5e8c4a9971d", parentUuid: parent, level: level-1, classStatus: 1 }).then(res => {
        this[`classes${level}`] = res;
      });
    },
    onAddDetailItem() {
      const item = {
        seq: 1 + (this.info.detail.length / 2 | 0),
        time: null,
        warningTime: null,
        labelId: null,
        key: this.info.detail.reduce((res, v) => Math.max(res, v.key), 0)+1,
      };
      this.info.detail.push({ ...item, type: 1 }, { ...item, type: 2 });
    },
    onDeleteItem(i) {
      this.info.detail.splice(i-1, 2);
      this.info.detail.forEach((v,i) => v.seq = 1+(i/2|0));
    },
    onConfirm() {
      this.checkForm().then(() => {
        this.info.detail.forEach((v,i,arr) => i%2 && (v.labelId = arr[i-1].labelId));
        (this.info.id ? putClassification : postClassification)(this.info).then(() => {
          this.$Message.success('提交成功');
          this.updateList();
          this.showModal = false;
        }).catch(this.responseError)
      });
    },
    checkForm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if(!valid) return reject();
          const checkOneByOne = i => {
            const subForms = this.$refs.subForms;
            if(subForms.length-1 < i) return resolve();
            subForms[i].validate(valid =>  valid ? checkOneByOne(i+1) : reject());
          };
          checkOneByOne(0);
        })
      })
    }
  }
};
</script>

<style lang="less" scoped>

</style>