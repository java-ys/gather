import { queryCacService } from "_o/api/car-desc";

export default {
  props: {
    modalData: {
      type: Object,
      default: {},
    },
    mold: {
      type: Number,
      default: 1, // 1 新建 2 编辑 3详情
    },
  },
  computed: {
    isAdd({ mold }) {
      return mold - 1 === 0;
    },
    isEdit({ mold }) {
      return mold - 2 === 0;
    },
    isDetail({ mold }) {
      return mold - 3 === 0;
    },
  },
  data() {
    return {
      tabType: "", // 当前业务线
      tabList: [], // 业务线list
      tabItem: {}, // 业务线对应的车型
    };
  },
  methods: {
    async queryCarLine(p) {
      const [err, data] = await queryCacService(p);
      if (err) return;
      let arr =
        data?.data?.expandBizLineList.map((it) => {
          this.setTabData(it);
          return {
            label: it.expandBizLineName,
            value: `${it.expandBizLine}`,
          };
        }) || [];
      let index = arr.findIndex((it) => it.label === "普通运营");
      if (index > -1) {
        let del = arr.splice(index, 1);
        arr.splice(0, 0, del[0]);
      }
      this.tabList = arr;
      this.tabType = this.tabList[0].value || ""; // 默认第一个tab
    },
    setTabData(it) {
      if (it?.bizTypeList?.length) {
        // 单一车型
        this.tabItem[it.expandBizLine] = it.bizTypeList;
      }
      if (it?.vehicleGroupList?.length) {
        // 车型组
        let _list = it.vehicleGroupList.map((item) => ({
          tipMsg: item.tipMsg,
          aliasName: item.aliasName,
          groupID: item.groupID,
        }));
        if (this.tabItem[it.expandBizLine]) {
          //单一车型和车型组同时存在
          this.tabItem[it.expandBizLine] =
            this.tabItem[it.expandBizLine].concat(_list);
        } else {
          this.tabItem[it.expandBizLine] = _list;
        }
      }
    },
  },
};
