<template>
  <div class="app-container">
    <SearchList
      :inputList="this.inputList"
      :axiosFun="seachAxios"
      @on-search="search"
      @on-reset="search"
    />
    <div class="table-top-btn">
      <Button  @click="editOrAdd">新增</Button>
      <Button>删除</Button>
      <Button>启用</Button>
      <Button>停用</Button>
      <Button>模板预览</Button>
    </div>
    <a-table
      class="ant-table"
      :columns="columns"
      :data-source="tableData"
      :row-selection="rowSelection"
      :pagination="pagination"
      bordered
      size="small"
    >
      <span slot="action" slot-scope="text, record">
        <a  v-if="record.status === 1" @click="del(record)">删除</a>
        <a  v-else @click="editOrAdd('edit', record)">编辑</a>
        <a-divider  type="vertical" />
        <a  v-if="record.status === 1" @click="handleClick(record)">停用</a>
        <a  v-else @click="handleClick(record.status)">启用</a>
      </span> 
    </a-table>
    <Modal
      v-model="modal1"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel">
      <Steps :current="current">
        <Step title="步骤1"></Step>
        <Step title="步骤2"></Step>
        <div style="height:20px"></div>
        <Form :model="formItem" :label-width="80" ref="formValidate" :rules="ruleValidate" v-if="current == 0">
            <FormItem label="分类名称" prop="typeName">
                <Input v-model="formItem.typeName" :maxlength="10" show-word-limit  style="width: 200px" placeholder="请输入分类名称" />
            </FormItem>
            <FormItem label="处理流程">
                <Select v-model="formItem.handleProcess" style="width: 200px" placeholder="请选择处理流程">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="工单模板">
                <Select v-model="formItem.template" style="width: 200px" placeholder="请选择工单模板">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
        </Form>
        <Form :model="formItem" :label-width="100" ref="formValidate" :rules="ruleValidate" v-if="current == 1">
            <FormItem label="上级分类名称">
                <Input v-model="formItem.typeNameLevel1" readonly style="width: 200px" />
            </FormItem>
            <FormItem label="分类名称" prop="typeNameLevel2">
                <Input v-model="formItem.typeNameLevel2" :maxlength="10" show-word-limit  style="width: 200px" placeholder="请输入分类名称" />
            </FormItem>
            <FormItem label="处理流程">
                <Select v-model="formItem.handleProcess" style="width: 200px" placeholder="请选择处理流程">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="工单模板">
                <Select v-model="formItem.template" style="width: 200px" placeholder="请选择工单模板">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
        </Form>
      </Steps>
      <div slot="footer">
          <Button type="default" :loading="modal_loading" @click="cancel">关闭</Button>
          <!-- <Button type="primary" :loading="modal_loading2" @click="ok">保存</Button> -->
          <Button type="primary" @click="next">{{ current == 1 ? '保存' : '下一步'}}</Button>
      </div>
        </Modal>
  </div>
</template>

<script>
  import { mapToList } from '@/libs/util.js'
  import { seachAxios } from "_o/api/work-order/type-manage";

  let processNameMap = {
      0: '风控刷单处理流程',
      1: '风控处理流程',
      2: '风控申诉处理流程',
      3: '品控处理流程',
      4: '清退处理流程'
  }
  export const processNameList = mapToList(processNameMap)

  let templateMap = {
      0: '风控模版',
      1: '客诉模板',
      2: '大屏模板'
  }
  export const templateList = mapToList(templateMap)

  let statusMap = {
      0: '停用',
      1: '启用'
  }
  export const statusList = mapToList(statusMap)

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  export default {
    data () {
      return {
        title: "",
        current: 0,
        modal1: false,
        modal_loading: false,
        modal_loading2: false,
        formItem: {
          typeName: '',
          handleProcess: ''
        },
        ruleValidate: {
          typeName: [
            { required: true, message: '请检查必填项', trigger: 'blur' }
          ],
          typeNameLevel2: [
            { required: true, message: '请检查必填项', trigger: 'blur' }
          ],
        },
        rowSelection,
        seachAxios,
        inputList: [
          {
            name: 'text-input', // 输入框
            bind_key: 'typeName',
            placeholder: '请输入分类名称',
            value: '',
            title: '分类名称：',
            inputWidth: 180
          },
          {
            name: 'drop-input', // 下拉框
            bind_key: 'processName',
            placeholder: '请选择处理流程',
            value: '',
            dropList: processNameList,
            title: '流程名称：',
            inputWidth: 180
          },
          {
            name: 'drop-input', // 下拉框
            bind_key: 'template',
            placeholder: '请选择工单模板',
            value: '',
            dropList: templateList,
            title: '工单模板：',
            inputWidth: 180
          },
          {
            name: 'drop-input', // 下拉框
            bind_key: 'status',
            placeholder: '请选择工单状态',
            value: '',
            dropList: statusList,
            title: '状态：',
            inputWidth: 180,
            render:(h,params)=>{
              let tmpStr = '';
              if (params.row.status==0) {
                tmpStr='停用';
              } else {
                tmpStr='启用';
              }
              return h('span',{
                  style:{
                      color: (params.row.status==0)?"#ed3f14":(params.row.status==1?"#19be6b":"#2d8cf0")
                  }
              },tmpStr)
            }
           }
        ],
        pagination: {
          pageSizeOptions: ['10', '30', '50', '100'],
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `共${total}条记录`
        },
        columns: [
          { title: '分类名称', key: 'typeName', dataIndex: 'typeName', ellipsis: true },
          { title: '流程名称', key: 'processName', dataIndex: 'processName', ellipsis: true },
          { title: '工单模板', key: 'template', dataIndex: 'template', ellipsis: true },
          {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            customRender: text => {
                return text === 1 ? '启用' : '停用'
            }
          },
          { title: '操作人', key: 'operator', dataIndex: 'operator', ellipsis: true },
          { title: '操作',key: 'action', ellipsis: true, scopedSlots: { customRender: 'action' } }
        ],
        tableData: [
          {
            key: 1,
            typeName: '风控',
            processName: null,
            template: '模板1',
            status: 1,
            operator: '张三',
            children: [
              {
                key: 11,
                typeName: '监控工单',
                template: '模板2',
                processName: '',
                status: 1,
                operator: '李四'
              },
              {
                key: 12,
                typeName: '刷单',
                template: '模板3',
                processName: '风控刷单处理流程',
                status: 0,
                operator: '王二'
              },
              {
                key: 13,
                typeName: '挂时长',
                template: '模板4',
                processName: '风控挂时长处理流程',
                status: 1,
                operator: '高兴'
              },
              {
                key: 14,
                typeName: '安全监控',
                template: '模板5',
                processName: '风控安全监控处理流程',
                status: 1,
                operator: '开心',
                children: [
                  {
                    key: 141,
                    typeName: '申诉',
                    template: '模板6',
                    processName: '申诉处理流程',
                    status: 0,
                    operator: '李五'
                  }
                ]
              }
            ]
          },
          {
            key: 2,
            typeName: '品控',
            template: '模板7',
            processName: null,
            status: 0,
            operator: '张二',
          }
        ],
      }
    },
    methods: {
      search(data) {
        // this.current = 1;
        // this.searchData = data;
        // data.dateBegin && (this.searchData.dateBegin=this.$moment(data.dateBegin).format('YYYY-MM-DD'))
        // data.dateEnd && (this.searchData.dateEnd=this.$moment(data.dateEnd).format('YYYY-MM-DD'))
        // if(data.queryParam){
        //   let arr = data.queryParam.split('-')
        //   data.driverName = arr[0]
        //   data.mobile = arr[1]
        //   data.plateNumber = arr[2]
        // }
        // delete this.searchData.queryParam
        // this.getTableList();
      },
      getTableList() {
        // let params = {
        //   pageSize: this.pageSize,
        //   currPage: this.current,
        //   ...this.searchData
        // };
        // delete params.queryParam
        // this.isLoading = true
        // axiosHealthCardList(params).then(res => {
        //   this.isLoading = false
        //   let data = res.data.data || {};
        //   this.tableData = data.list || [];
        //   this.total = data.totalCount || 0;
        //   this.isExportBtn = this.tableData.length === 0 ? true : false;
        //   this.$store.commit("changeLoadingFlag", false);
        // }).catch(err => {
        //   this.isLoading = false
        //   this.total = 0
        //   this.tableData = []
        // });
      },
      next () {
        if (this.current == 1) {
          this.$Message.info('保存成功');
          this.modal1 = false;
          this.current = 0;
        } else {
            this.current += 1;
        }
      },
      ok () {
        this.$Message.info('Clicked ok');
      },
      cancel () {
        this.modal_loading = true;
        setTimeout(() => {
            this.modal_loading = false;
            this.modal1 = false;
            this.confirm();
        }, 200);
        this.current = 0;
      },
      confirm () {
        this.$Modal.confirm({
            title: '提示',
            content: '<p>关闭后页面数据将丢失，是否确定关闭？</p>',
            onOk: () => {
                this.$Message.info('Clicked ok');
            },
            onCancel: () => {
                this.$Message.info('Clicked cancel');
            }
        });
        this.current = 0;
      },
      handleClick(p) {
        if(p == 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>停用后将立即失效，是否确定停用？</p>',
            onOk: () => {
              this.$Message.info('停用啦 ok');
            },
            onCancel: () => {
              this.$Message.info('Clicked cancel');
            }
          });
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>停用后将立即失效，是否确定停用？</p>',
            onOk: () => {
              this.$Message.info('启用啦 ok');
            },
            onCancel: () => {
              this.$Message.info('Clicked cancel');
            }
          });
        }
      },
      editOrAdd(p1, p2) {
        if(p1 === 'edit') {
          this.title = '编辑分类';
          console.log(p2);
        } else {
          this.title = '新建分类';
        }
        this.modal1 = true;
      },
      del(p) {
        alert('删除成功')
      }
    }
  }
</script>

<style lang="less" scoped>
.table-top-btn{
  position: absolute;
  right: 2%;
}
.ant-table {
  margin-top: 2.5%;
}
</style>