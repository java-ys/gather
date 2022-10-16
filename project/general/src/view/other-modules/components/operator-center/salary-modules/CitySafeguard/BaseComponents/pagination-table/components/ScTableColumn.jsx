import { defineComponent } from '@vue/composition-api';

const ScTableColumn = defineComponent({
  name: 'ScTableColumn',
  props: {
    type: String,
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: [String, Boolean],
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: Boolean,
    context: {},
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: Boolean,
    index: [Number, Function],
    sortOrders: Array,
    render: Function,
    headerRender: Function,
    children: {
      type: Array,
      default: () => [],
    },
  },
  render() {
    const {
      render, headerRender, children, ...props
    } = this.$props;
    const scopedSlots = {};
    if (headerRender) {
      scopedSlots.header = ({ column, $index }) => headerRender({ column, $index });
    }
    if (children.length > 0) {
      return (
        <el-table-column
          {...{
            props,
            scopedSlots,
          }}
        >
          {children.map(p => (
            <ScTableColumn {...{ props: p }} />
          ))}
        </el-table-column>
      );
    }
    if (render) {
      scopedSlots.default = ({ row, column, $index }) => render({ row, column, $index });
    }
    return (
      <el-table-column
        {...{
          props,
          scopedSlots,
        }}
      />
    );
  },
});

export default ScTableColumn;
