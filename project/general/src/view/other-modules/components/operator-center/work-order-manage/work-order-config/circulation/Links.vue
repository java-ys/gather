<template>
  <div>
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
        <Button style="margin-right: 10px;" @click="onLook(row)">查看</Button>
        <Button type="primary" @click="onEdit(row)">关联</Button>
      </template>
    </m2-table>
    <ModalWrap v-model="showModal" :title="disabled?'详情':'关联'" :width="1000" :foot-hide="disabled" @on-ok="onConfirm">
      <Form label-position="right" :label-width="105">
        <Row>
          <Col span="8">
            <FormItem label="一级分类：">{{info.categoryFirstName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="二级分类：">{{info.categorySecondName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="三级分类：">{{info.categoryThirdName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="四级分类：">{{info.categoryFourthName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="处理总时长：">{{info.totalProcessTime}}分钟</FormItem>
          </Col>
          <Col span="4">
            <FormItem label="处理层级：">{{info.seq}}</FormItem>
          </Col>
          <Col span="4">
            <FormItem label="转派确认时间：">{{info.tranConfirTime}}分钟</FormItem>
          </Col>
        </Row>
        <Row v-for="(v,i) of info.detail" :key="i">
          <Col span="8">
            <Form ref="subForms" :model="v" label-position="right" :label-width="105">
              <FormItem :label="v.seq+'级'+(v.type==1?'处理':'升级')+'部门：'" prop="partId">
                <span v-if="disabled||v.disabled">{{v.partName||'暂无'}}</span>
                <Select v-else v-model="v.partId" :placeholder="v.partName||'请选择'"  @on-change="id => onDepartmentChange(id, i, v.labelId)">
                  <Option v-for="o of departments[v.labelId]" :key="o.id" :value="o.id">{{o.designation}}</Option>
                </Select>
              </FormItem>
            </Form>
          </Col>
          <Col span="4">
            <FormItem label="处理时长：">{{v.time}}分钟</FormItem>
          </Col>
          <Col span="4">
            <FormItem label="处理预警：">{{v.warningTime}}分钟</FormItem>
          </Col>
          <Col v-if="v.workHour" span="8">
            <FormItem label="工作时间：">{{v.workHour}}-{{v.rushHour}}({{v.isRemoHolidays?'不':''}}含周末)</FormItem>
          </Col>
        </Row>
      </Form>
    </ModalWrap>
  </div>
</template>

<script>
import { queryLinkList, queryLink, queryAllLabelList, putLink } from "_o/api/work-order/work-order-config";
import { listMixin } from "./mixin";
export default {
  name: "Links",
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
        title: "处理总时长",
        key: "totalProcessTime",
        minWidth: 100
      },
      {
        title: "层级处理",
        key: "seq",
        minWidth: 100
      },
      {
        title: "操作",
        key: "action",
        fixed: "right",
        width: 245,
        slot: "action"
      }
    ],
    disabled: false,
    info: {},
    rules: {
      partId: {required: true, message: '请选择部门', type: 'number', trigger: 'change'},
    },
    departments: {},
  }),
  watch: {
    showModal(v) {
      if(!v) {
        this.info = {};
        this.disabled = false;
      }
    },
    'info.detail'(list) {
      if(!list || !list.length) return;
      list.forEach(v => {
        if (this.info.labelIds.every(id => id !== v.labelId)) {
          this.$set(v, 'disabled', true);
        }
      });
      const ids = list.reduce((res, v) => (!v.disabled && res.add(v.labelId), res), new Set())
      ids.size && queryAllLabelList({labelType:0, ids: [...ids]}).then(response => {
        this.departments = response.reduce((res, v) => (res[v.id] = v.partList||[], res),{})
      })
    }
  },
  methods: {
    requestList: queryLinkList,
    onLook(row) {
      this.onEdit(row);
      this.disabled = true;
    },
    onEdit(row) {
      queryLink({id: row.id}).then(res => {
        this.info = res;
        this.showModal = true;
      }).catch(this.responseError);
    },
    onDepartmentChange(id, index, labelId) {
      const item = this.departments[labelId].find(v => v.id === id);
      Object.assign(this.info.detail[index], {
        partName: item.designation,
        workHour: item.workHour,
        rushHour: item.rushHour,
        isRemoHolidays: item.isRemoHolidays,
      })
    },
    onConfirm() {
      putLink(this.info).then(() => {
        this.$Message.success('提交成功');
        this.showModal = false;
        this.updateList();
      }).catch(this.responseError)
    },
    checkForm() {
      return new Promise((resolve, reject) => {
        const forms = this.$refs.subForms;
        const checkOneByOne = i => {
          if(forms.length<=i) return resolve();
          forms[i].validate(valid => valid ? checkOneByOne(i+1) : reject());
        }
        checkOneByOne(0);
      })
    }
  }
};
</script>

<style lang="less" scoped>

</style>