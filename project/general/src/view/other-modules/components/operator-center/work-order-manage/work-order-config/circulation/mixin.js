import m2Table from "_a/m2-table/v-table";
import ModalWrap from "./ModalWrap.vue"
export const listMixin = {
  components: { m2Table, ModalWrap },
  data: () => ({
    query: {
      currPage: 1,
      pageSize: 20,
    },
    list: [],
    total: 0,
  }),
  created() {
    this.updateList();
  },
  methods: {
    updateList() {
      if (!this.requestList) throw Error("请实现requestList方法");
      this.requestList(this.query).then(res => {
        this.list = res.list;
        this.total = res.totalCount;
      }).catch(err => this.$Message.error(err.msg));
    },
    changePage(val) {
      this.query.currPage = val;
      this.updateList();
    },
    changePageSize(val) {
      this.query.pageSize = val;
      this.updateList();
    },
    responseError(err) {
      if (!err) return;
      this.$Message.error(err.msg);
    }
  }
}