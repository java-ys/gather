export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
    detail: {
      type: Object,
      default: () => ({}),
    }
  },
};
