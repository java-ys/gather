import CommonIcon from "_c/common-icon";
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle(item) {
      return this.$config.useI18n
        ? this.$t(item.title)
        : (item.meta && item.meta.title) || item.title; // menu-item 文案
    },
    showChildren(item) { // 展示多级菜单
      return (
        item.children.length > 0
        // (item.children.length > 1 || (item.meta && item.meta.showAlways))
      );
    },
    getNameOrHref(item, children0) {
      return item.href
        ? `isTurnByHref_${item.href}`
        : children0
        ? item.children[0].name
        : item.name;
    }
  }
};
