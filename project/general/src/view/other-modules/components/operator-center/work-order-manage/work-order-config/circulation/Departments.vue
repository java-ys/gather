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
      <template slot="action" slot-scope="{data:{row}}" v-if="row.labelId!=2">
        <Button type="primary" style="margin-right: 10px;" @click="onEdit(row)">编辑</Button>
        <Button type="error" @click="onDelete(row)">删除</Button>
      </template>
    </m2-table>
    <ModalWrap v-model="showModal" :title="info.id?'编辑':'新增'" width="900" @on-ok="onConfirm">
      <Form ref="form" :model="info" :rules="rules" label-position="right" :label-width="120">
        <Row>
          <FormItem label="部门名称：" prop="designation">
            <Input v-model.trim="info.designation" />
          </FormItem>
        </Row>
        <Row :gutter="10">
          <Col span="8">
            <FormItem label="关联标签：" prop="labelId">
              <Select v-model="info.labelId">
                <Option v-for="v of labels" :key="v.id" :value="v.id">{{v.designation}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col v-if="info.labelId==3||info.labelId==4" span="8">
            <FormItem label="区域：" prop="regionCode">
              <Select v-model="info.regionCode">
                <Option v-for="v of areas" :key="v.id" :value="v.regionCode">{{v.regionName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col v-if="info.labelId==4" span="8">
            <FormItem label="城市：" prop="cityCode">
              <Select v-model="info.cityCode">
                <Option v-for="v of cities" :key="v.id" :value="v.cityCode">{{v.cityName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="部门人员：" prop="userList">
            <Input v-model="phone" search enter-button="查询并插入" placeholder="输入手机号" style="width: 30%" @on-search="onSearchUser" />
            <div>
              <Tag v-for="(v,i) of info.userList" :key="v.userId" closable @on-close="onDeleteUser(i)">{{v.designation}}</Tag>
            </div>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="工作时间：" prop="times">
            <TimePicker v-model="info.times" format="HH:mm" type="timerange" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="是否去除周末：" prop="isRemoHolidays">
            <RadioGroup v-model="info.isRemoHolidays">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
      </Form>
    </ModalWrap>
  </div>
</template>

<script>
/* eslint-disable quotes,space-infix-ops */
import { queryDepartmentList, queryDepartment, postDepartment, putDepartment, queryAllLabelList, deleteDepartment, queryUserByPhone, queryAreaList } from "_o/api/work-order/work-order-config";
import { listMixin } from "./mixin";
import {createRule} from './util';
export default {
  name: "Departments",
  mixins: [listMixin],
  data: () => ({
    showModal: false,
    columns: [
      {
        title: "部门名称",
        key: "designation",
        minWidth: 120
      },
      {
        title: "部门人员",
        key: "userNames",
        minWidth: 120
      },
      {
        title: "工作时间",
        key: "workHour",
        minWidth: 120,
        render: (h, {row}) => h('span', row.workHour+'-'+row.rushHour)
      },
      {
        title: "是否去除周末",
        key: "isRemoHolidays",
        minWidth: 120,
        render: (h, {row}) => h('span', row.isRemoHolidays ? '是' : '否')
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 245,
        slot: "action"
      }
    ],
    info: { labelId: '',regionCode: '',cityCode: '', userList: [] },
    rules: {
      designation: createRule('请输入部门名称'),
      labelId: createRule('请选择关联标签', 'number', 'change'),
      times: createRule('请选择工作时间', 'array', 'change'),
      isRemoHolidays: createRule('请选择是否去除节假日', 'number', 'change'),
      regionCode: createRule('请选择区域', 'string', 'change'),
      cityCode: createRule('请选择城市', 'string', 'change'),
    },
    labels: [],
    areas: [],
    phone: '',
    query: {partType: 0},
  }),
  computed: {
    cities() {
      return this.info.regionCode ? this.areas.find(v => v.regionCode == this.info.regionCode).cityDTOList || [] : []
    }
  },
  watch: {
    'info.times'(v=[]) {
      this.info.workHour = v[0] || '';
      this.info.rushHour = v[1] || '';
    },
    showModal(v) {
      if(!v) {
        this.info = {labelId: '',regionCode: '',cityCode: '', userList: []};
        this.$refs.form.resetFields();
        this.phone = '';
      }
    },
    'info.labelId'(v) {
      if((v == 3 || v == 4) && !this.areas.length) {
        queryAreaList({}).then(res => this.areas = res || []);
      }
      if(v != 4) {
        this.info.cityCode = '';
        if(v != 3) this.info.regionCode = '';
      }
    }
  },
  created() {
    queryAllLabelList({labelType: 0}).then(res => this.labels = res);
  },
  methods: {
    requestList: queryDepartmentList,
    onEdit(row) {
      queryDepartment({id: row.id}).then(res => {
        res.times = [res.workHour, res.rushHour];
        this.info = res;
        this.showModal = true;
      })
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if(!valid) return;
        (this.info.id ? putDepartment : postDepartment)(this.info)
          .then(() => {
            this.$Message.success('提交成功');
            this.showModal = false;
            this.updateList();
          }).catch(this.responseError)
      })
    },
    onDelete(row) {
      this.$Modal.confirm({
        title: '确定删除？',
        onOk: () => deleteDepartment({id: row.id}).then(() => {
          this.$Message.success('已删除');
          this.updateList();
        }).catch(this.responseError),
      })
    },
    onSearchUser(telephone) {
      const {userList} = this.info
      if(userList.some(v => v.phone === telephone)) return this.$Message.warning('该人员已添加');
      queryUserByPhone({telephone}).then(res => {
        if(!res) return Promise.reject({msg: '该手机号不存在'});
        userList.push({
          userId: res.accountId,
          designation: res.name,
          phone: res.phone,
        });
        this.phone = '';
      }).catch(this.responseError);
    },
    onDeleteUser(i) {
      this.info.userList.splice(i, 1);
    }
  }
};
</script>

<style lang="less" scoped>

</style>