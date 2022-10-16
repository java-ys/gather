<template>
  <div>
    <Form inline>
      <FormItem label="城市：" :label-width="50">
        <Select v-model="query.cityCode" clearable style="width: 140px;">
          <Option v-for="v of searchCities" :key="v.cityCode" :value="v.cityCode">{{v.cityName}}</Option>
        </Select>
      </FormItem>
      <Button type="primary" style="margin: 0 10px;" @click="updateList">搜索</Button>
      <Button @click="(query.cityCode = '', updateList())">重置</Button>
    </Form>
    <Button type="primary" style="margin-bottom: 20px;" v-hasAuth="'auto-ban-add'" @click="showModal = true">新增</Button>
    <m2-table
      :total="total"
      :current="query.currPage"
      :pageSize="query.pageSize"
      :parColumns="columns"
      :parTableData="list"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
      <template slot-scope="{data:{row}}" slot="action">
        <Button v-if="row.state!=1" v-hasAuth="'auto-ban-edit'" type="primary" style="margin-right: 10px;" @click="onEdit(row)">修改</Button>
        <Button
          v-hasAuth="'auto-ban-enable'"
          :type="row.state==1?'warning':'success'"
          style="margin-right: 10px;"
          @click="onToggleEnable(row)"
        >{{row.state==1?'禁用':'启用'}}</Button>
        <Button v-hasAuth="'auto-ban-delete'" type="error" @click="onDelete(row)">删除</Button>
      </template>
    </m2-table>
    <Modal v-model="showModal" :title="info.id?'编辑':'新增'">
      <Form ref="form" :model="info" :rules="rules" :label-width="100">
        <Row>
          <FormItem label="封禁工单类型：">风控工单</FormItem>
        </Row>
        <Row>
          <FormItem label="生效城市：" prop="cityCodeList">
            <Select v-model="info.cityCodeList" multiple>
              <Option
                v-for="v of cities"
                :key="v.cityCode"
                :value="v.cityCode"
                :disabled="v.checked || (v.cityCode==='100000' ? !!info.cityCodeList.length : includeAllCity)"
              >{{v.cityName}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="生效条件：" prop="illegalAmount" required>
            <p>违规金额&gt;<InputNumber v-model="info.illegalAmount" :min="0" :max="999999999" @on-blur="() => info.illegalAmount = +info.illegalAmount.toFixed(2)"  />&nbsp;元</p>
            <p style="margin-top: 10px;">违规次数&gt;<InputNumber v-model="info.illegalTimes" :min="1" :max="999999999" :precision="0" />&nbsp;次</p>
          </FormItem>
        </Row>
        <Row v-if="info.illegalAmount>0 && info.illegalTimes>0">
          <FormItem label="生效关系：" prop="relation" required>
            <RadioGroup v-model="info.relation">
              <Radio label="&&">且</Radio>
              <Radio label="||">或</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="处罚方式：" prop="punishType">
            <RadioGroup v-model="info.punishType">
              <Radio :label="1">封禁</Radio>
              <Radio :label="2">冻结</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="处罚措施：" prop="banType">
            <RadioGroup v-model="info.banType">
              <Radio :label="1">短期</Radio>
              <Radio v-if="info.punishType==1" :label="2">长期</Radio>
            </RadioGroup>
          </FormItem>
        </Row>
        <Row v-if="info.banType==1">
          <FormItem :label="(info.punishType==1?'封禁':'冻结')+'天数：'" prop="days" required>
            <InputNumber v-model="info.days" :min="1" :precision="0" />&nbsp;天
          </FormItem>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="showModal = false">取消</Button>
        <Button type="primary" @click="onConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
/* eslint-disable no-confusing-arrow, no-return-assign, object-curly-newline, object-shorthand */
import {
  queryOrderList, queryCityList, enableOrder, disableOrder,
  deleteOrder, submitOrder, queryOrder,
} from "_o/api/work-order/auto-ban";
import m2Table from '_a/m2-table/v-table.vue';

export default {
  name: 'AutoBan',
  components: { m2Table },
  data() {
    return {

      showModal: false,
      columns: [
        {
          title: '生效城市',
          key: 'cityName',
          minWidth: 100,
        },
        {
          title: '生效条件',
          key: 'ruleContent',
          minWidth: 100,
        },
        {
          title: '处罚措施',
          key: 'desc',
          minWidth: 100,
        },
        {
          title: '配置时间',
          key: 'updateTime',
          width: 160,
        },
        {
          title: '配置人',
          key: 'updaterName',
          minWidth: 100,
        },
        {
          title: '是否生效',
          key: 'state',
          width: 100,
          render: (h, param) => h('span', param.row.state === 1 ? '是' : '否'),
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          fixed: 'right',
          width: 240,
        },
      ],
      query: {
        currPage: 1,
        pageSize: 20,
        cityCode: '',
      },
      total: 0,
      list: [],
      cities: [],
      info: {
        state: 0,
        illegalAmount: null,
        illegalTimes: null,
        days: null,
        punishType: null,
        banType: null,
        relation: '',
        cityCodeList: [],
      },
      rules: {
        cityCodeList: { required: true, message: '请选择城市', type: 'array', trigger: 'change' },
        punishType: { required: true, message: '请选择处罚类型', type: 'number', trigger: 'change' },
        banType: { required: true, message: '请选择处罚时效', type: 'number', trigger: 'change' },
        days: { required: true, message: '请输入封禁天数', type: 'number', trigger: 'blur' },
        relation: { required: true, message: '请选择生效关系', type: 'string', trigger: 'change' },
        illegalAmount: { validator: (_, value, cb) => (value !== null && !Number.isNaN(parseFloat(value))) || !Number.isNaN(this.info.illegalTimes) ? cb() : cb(new Error('至少一个生效条件')) },
      },
      searchCities: [],
    };
  },
  computed: {
    includeAllCity() {
      return this.info.cityCodeList.some(v => v === '100000');
    },
  },
  watch: {
    'info.cityCodeList'(codes) {
      if (!codes) return;
      const set = new Set(codes);
      this.info.cityMap = this.cities.reduce((res, v) => {
        if (set.has(v.cityCode)) {
          res[v.cityCode] = v.cityName;
        }
        return res;
      }, {});
    },
    'info.punishType'(v, old) {
      if (old === 2 && v === 1) this.info.banType = 1;
    },
    'info.illegalAmount'() {
      this.$refs.form.validateField('illegalAmount');
    },
    'info.illegalTimes'() {
      this.$refs.form.validateField('illegalAmount');
    },
    showModal(v) {
      if (v) {
        queryCityList().then(res => this.cities = res || []);
      } else {
        this.info = {
          state: 0,
          illegalAmount: null,
          illegalTimes: null,
          days: null,
          punishType: null,
          banType: null,
          relation: '',
          cityCodeList: [],
        };
        this.$refs.form.resetFields();
      }
    },
  },
  created() {
    queryCityList().then(res => this.searchCities = (res || []).filter(v => v.cityCode !== '100000'));
    this.updateList();
  },
  methods: {
    updateList() {
      queryOrderList(this.query).then(res => {
        this.total = res ? res.totalCount : 0;
        this.list = res ? res.list : [];
      }).catch(this.responseError);
    },
    changePage(val) {
      this.query.currPage = val;
      this.updateList();
    },
    changePageSize(val) {
      this.query.pageSize = val;
      this.updateList();
    },
    onEdit(row) {
      queryOrder({ id: row.id }).then(res => {
        res.cityCodeList = Object.keys(res.cityMap);
        this.info = res;
        this.showModal = true;
      }).catch(this.responseError);
    },
    onDelete(row) {
      this.$Modal.confirm({
        title: '确定删除?',
        onOk: () => deleteOrder({ id: row.id }).then(() => {
          this.$Message.success('已删除');
          this.updateList();
        }).catch(this.responseError),
      });
    },
    onToggleEnable(row) {
      (row.state === 1 ? disableOrder : enableOrder)({ id: row.id }).then(() => {
        this.$Message.success(`已${row.state === 1 ? '禁用' : '启用'}`);
        this.updateList();
      }).catch(this.responseError);
    },
    responseError(err) {
      this.$Message.error(err.msg);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        submitOrder(this.info).then(() => {
          this.$Message.success('已提交');
          this.updateList();
          this.showModal = false;
        }).catch(this.responseError);
      });
    },
  },
};
</script>

<style lang="less" scoped>

</style>
