import m2Table from "_a/m2-table/v-table";

export const indexMixin = {
  components: { m2Table },
  data: () => ({
    current: 1,
    searchData: {},
    pageSize: 10,
    total: 0,
    list: [],
  }),
  created() {
    this.updateList();
  },
  methods: {
    search(data) {
      this.current = 1;
      this.searchData = data;
      this.updateList();
    },
    changePage(val) {
      this.current = val;
      this.updateList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.updateList();
    },
    request() {
      throw Error(`Component<${this.$options.name}>: methods缺少request方法`);
    },
    updateList() {
      this.request({
        ...this.searchData,
        currPage: this.current,
        pageSize: this.pageSize
      }).then(res => {
        this.list = res.list;
        this.total = res.totalCount;
      });
    }
  }
}

export const formMixin = {
  computed: {
    isDetail() {
      return !(this.$route.params.id === "create" || this.$route.query.type === "edit");
    }
  }
}