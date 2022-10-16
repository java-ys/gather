import {
  defineComponent, computed, watch, ref, provide,
} from '@vue/composition-api';
import $style from './style.scss';
import ScTable from './components/ScTable';
import ScPagination from './components/ScPagination';
import createTableStore from './tableStore';

const propsBoolean = defaultVal => ({ type: Boolean, default: defaultVal });

const DEFAULT_LOADING_OPTIONS = () => ({
  spinning: false,
  text: '数据加载中',
  spinner: 'el-icon-loading',
  background: '',
});

export default defineComponent({
  name: 'PaginationTable',
  props: {
    /** loading标识，支持true/false和自定义样式 */
    loading: {
      type: [Boolean, Object],
    },
    /** 分页相关属性 */
    pagination: {
      type: [Boolean, Object],
      validator(val) {
        return val === false || typeof val === 'object';
      },
    },
    /** 列表列渲染数组 */
    columns: {
      type: Array,
    },
    footerRender: {
      type: Function,
    },
    /** 对应的empty slot */
    emptyRender: {
      type: Function,
    },
    data: {
      type: Array,
    },
    height: {
      type: [String, Number],
    },
    maxHeight: {
      type: [String, Number],
    },
    stripe: propsBoolean(false),
    border: propsBoolean(false),
    size: {
      type: String,
    },
    fit: propsBoolean(true),
    showHeader: propsBoolean(true),
    highlightCurrentRow: propsBoolean(false),
    hasHoverStyle: propsBoolean(true),
    currentRowKey: {
      type: [String, Number],
    },
    rowClassName: {
      type: [Function, String],
    },
    rowStyle: {
      type: [Function, Object],
    },
    cellClassName: {
      type: [Function, String],
    },
    cellStyle: {
      type: [Function, Object],
    },
    headerRowClassName: {
      type: [Function, String],
    },
    headerRowStyle: {
      type: [Function, Object],
    },
    headerCellClassName: {
      type: [Function, String],
    },
    headerCellStyle: {
      type: [Function, Object],
    },
    rowKey: {
      type: [Function, String],
    },
    defaultExpandAll: propsBoolean(false),
    expandRowKeys: {
      type: Array,
    },
    defaultSort: {
      type: Object,
    },
    tooltipEffect: {
      type: String,
    },
    showSummary: propsBoolean(false),
    sumText: {
      type: String,
    },
    summaryMethod: {
      type: Function,
    },
    summaryClassMethod: {
      type: Function,
    },
    summarySpanMethod: {
      type: Function,
    },
    spanMethod: {
      type: Function,
    },
    selectOnIndeterminate: propsBoolean(true),
  },
  setup(props) {
    const tableRef = ref(null);
    provide('tableRef', tableRef);
    const $store = createTableStore({
      pagination: props.pagination || {},
      loading: typeof props.loading === 'boolean' ? DEFAULT_LOADING_OPTIONS() : ({ ...DEFAULT_LOADING_OPTIONS(), ...props.loading }),
    });
    const { pagination: sPagination, loading: sLoading } = $store;

    watch(
      () => props.loading,
      val => {
        const newVal = typeof val === 'boolean' ? ({ ...DEFAULT_LOADING_OPTIONS(), spinning: val }) : val;
        Object.keys(newVal).forEach(k => {
          sLoading[k] = newVal[k];
        });
      },
      { immediate: false, deep: true },
    );

    const tableColumns = computed(() => props.columns || []);
    const tableLegacyProps = computed(() => ({
      data: props.data,
      height: props.height,
      maxHeight: props.maxHeight,
      stripe: props.stripe,
      border: props.border,
      size: props.size,
      fit: props.fit,
      showHeader: props.showHeader,
      highlightCurrentRow: props.highlightCurrentRow,
      hasHoverStyle: props.hasHoverStyle,
      currentRowKey: props.currentRowKey,
      rowClassName: props.rowClassName,
      rowStyle: props.rowStyle,
      cellClassName: props.cellClassName,
      cellStyle: props.cellStyle,
      headerRowClassName: props.headerRowClassName,
      headerRowStyle: props.headerRowStyle,
      headerCellClassName: props.headerCellClassName,
      headerCellStyle: props.headerCellStyle,
      rowKey: props.rowKey,
      defaultExpandAll: props.defaultExpandAll,
      expandRowKeys: props.expandRowKeys,
      defaultSort: props.defaultSort,
      tooltipEffect: props.tooltipEffect,
      showSummary: props.showSummary,
      sumText: props.sumText,
      summaryMethod: props.summaryMethod,
      summaryClassMethod: props.summaryClassMethod,
      summarySpanMethod: props.summarySpanMethod,
      spanMethod: props.spanMethod,
      selectOnIndeterminate: props.selectOnIndeterminate,
    }));

    const outerMethods = {};
    ['clearSelection',
      'toggleRowSelection',
      'toggleAllSelection',
      'toggleRowExpansion',
      'setCurrentRow',
      'clearSort',
      'clearFilter',
      'doLayout',
      'sort',
    ].forEach(name => {
      outerMethods[name] = function (...args) {
        tableRef.value[name](...args);
      };
    });

    return {
      sPagination,
      tableColumns,
      tableLegacyProps,
      sLoading,
      ...outerMethods,
    };
  },
  render() {
    const {
      tableLegacyProps, sLoading, tableColumns, sPagination, $listeners,
    } = this;
    return (
      <div
        element-loading-text={sLoading.text}
        element-loading-spinner={sLoading.spinner}
        element-loading-background={sLoading.background}
        element-loading-transition={sLoading.transition}
        {...{
          directives: [{ name: 'loading', value: sLoading.spinning }],
        }}
      >
        <ScTable
          ref="table"
          {...{
            props: {
              legacyProps: tableLegacyProps,
              columns: tableColumns,
              footerRender: this.footerRender,
              emptyRender: this.emptyRender,
            },
            on: $listeners,
          }}
        />
        {this.pagination && (
          <ScPagination
            class={$style.pagination}
            {...{
              props: {
                currentPage: sPagination.currentPage,
                pageSize: sPagination.pageSize,
                pageSizes: sPagination.pageSizes,
                layout: sPagination.layout,
                total: sPagination.total,
                onChange: sPagination.onChange,
                props: sPagination.props,
              },
              on: {
                'update:currentPage': val => {
                  sPagination.currentPage = val;
                },
                'update:pageSize': val => {
                  sPagination.pageSize = val;
                },
              },
            }}
          />
        )}
      </div>
    );
  },
});
