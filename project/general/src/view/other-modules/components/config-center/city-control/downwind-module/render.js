export default {
  name: "priceLadder",
  functional: true,
  props: {
    render: Function,
    column: {
      type: Object,
      default: null
    },
    index: Number
  },
  render: (h, ctx) => {
    const params = {
      index: ctx.props.index
    };
    if (ctx.props.column) params.column = ctx.props.column;
    return ctx.props.render(h, params, ctx.scopedSlots);
  }
};
