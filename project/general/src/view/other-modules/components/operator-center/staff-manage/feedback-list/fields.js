export const tableTitle = {
  cityOrigin:{
    title: '所属城市',
    key: 'cityOrigin',
    tooltip: true,
    minWidth: 100,
    fixed: 'left'
  },
  operator:{
    title: '所属运营商',
    key: 'operator',
    tooltip: true,
    minWidth: 150
  },
  name:{
    title: '司机姓名',
    key: 'name',
    tooltip: true,
    minWidth: 150
  },
  title: {
    title: '问题标签',
    key: 'title',
    tooltip: true,
    minWidth: 150
  },
  content: {
    title: '问题描述',
    key: 'content',
    tooltip: true,
    minWidth: 150
  },
  contactName: {
    title: '联系人',
    key: 'contactName',
    tooltip: true,
    minWidth: 150
  },
  contactPhone: {
    title: '联系电话',
    key: 'contactPhone',
    tooltip: true,
    minWidth: 150
  },
  createTime: {
    title: '提交时间',
    key: 'createTime',
    tooltip: true,
    minWidth: 150
  },
  telephone: {
    title: '司机手机号',
    key: 'telephone',
    ellipsis: true,
    tooltip: true,
    minWidth: 150
  }
}
export const pageData = {
  validTime: '',//提交时间
  isShowMore:false,//是否显示更多搜索条件
  isShowMain: true,//是否显示列表页
  isHasImg: false,//是否显示凭证图片
  isShowModal: false,//详情弹窗
  searchData: {},
  imgurl: '',
  isShowViewImgModal: false,//查看图片弹窗
  queryAjaxPramas: {},
  detailData: {},//详情信息
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  tableColumnsChecked: Object.keys(tableTitle)
}