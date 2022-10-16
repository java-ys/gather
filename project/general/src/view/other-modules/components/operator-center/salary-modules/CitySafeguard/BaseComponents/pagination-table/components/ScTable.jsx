import {
  defineComponent, ref, inject, onMounted,
} from '@vue/composition-api';
import ScTableColumn from './ScTableColumn';

export default defineComponent({
  name: 'ScTable',
  props: {
    columns: Array,
    footerRender: Function,
    emptyRender: Function,
    legacyProps: Object,
  },
  setup(props, ctx) {
    const tableRef = inject('tableRef');
    const table = ref(null);
    const listeners = {};
    [
      'select',
      'select-all',
      'selection-change',
      'cell-mouse-enter',
      'cell-mouse-leave',
      'cell-click',
      'cell-dblclick',
      'row-click',
      'row-contextmenu',
      'row-dblclick',
      'header-click',
      'header-contextmenu',
      'sort-change',
      'filter-change',
      'current-change',
      'header-dragend',
      'expand-change',
    ].forEach(name => {
      listeners[name] = (...args) => ctx.emit(name, ...args);
    });

    const callMethod = (name, ...args) => {
      tableRef.value[name](...args);
    };

    onMounted(() => {
      tableRef.value = table.value;
    });

    return {
      table,
      listeners,
      callMethod,
    };
  },
  render() {
    const {
      columns, legacyProps, footerRender, emptyRender, listeners,
    } = this;
    const columnsRender = () => columns.map(col => {
      const options = {
        props: col,
        scopedSlots: {},
      };
      if (col.render) {
        options.scopedSlots.default = ({ row, column, $index }) => col.render({ row, column, $index });
      }
      if (col.headerRender) {
        options.scopedSlots.header = ({ column, $index }) => col.headerRender({ column, $index });
      }
      return <ScTableColumn {...options} />;
    });

    return (
      <el-table
        ref="table"
        {...{
          props: legacyProps,
          on: listeners,
        }}
      >
        {columnsRender()}
        {footerRender && <template slot="append">{footerRender()}</template>}
        {emptyRender && <template slot="empty">{emptyRender()}</template>}
      </el-table>
    );
  },
});
