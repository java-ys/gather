import {
  defineComponent, reactive, watch, computed,
} from '@vue/composition-api';

export default defineComponent({
  name: 'ScPagination',
  props: {
    currentPage: Number,
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40],
    },
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, total, sizes',
    },
    total: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function,
    },
    props: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const { emit: $emit } = ctx;
    const paginationProps = reactive({
      ...props.props,
      currentPage: props.currentPage,
      pageSize: props.pageSize,
      pageSizes: computed(() => props.pageSizes),
      layout: computed(() => props.layout),
      total: computed(() => props.total),
      disabled: computed(() => props.disabled),
    });

    const callOnChange = ({ pageSize, currentPage }) => {
      const _pageSize = pageSize || paginationProps.pageSize;
      const _currentPage = currentPage || paginationProps.currentPage;
      const { total } = paginationProps;
      if (total >= _pageSize * (_currentPage - 1) && props.onChange) {
        props.onChange({
          pageSize: _pageSize,
          currentPage: _currentPage,
        });
      }
    };

    const paginationEvents = {
      'size-change': val => {
        callOnChange({ pageSize: val });
        $emit('update:pageSize', val);
      },
      'current-change': val => {
        callOnChange({ currentPage: val });
        $emit('update:currentPage', val);
      },
      'update:pageSize': val => {
        paginationProps.pageSize = val;
      },
      'update:currentPage': val => {
        paginationProps.currentPage = val;
      },
    };
    const onUpdate = () => {
      ['currentPage', 'pageSize'].forEach(k => {
        paginationProps[k] = props[k];
      });
    };
    watch(
      () => `${props.currentPage}:${props.pageSize}`,
      onUpdate,
      { immediate: false },
    );

    return {
      paginationProps,
      paginationEvents,
    };
  },
  render() {
    const { props, paginationProps, paginationEvents } = this;
    return (
      <el-pagination
        {...{
          props: {
            ...props,
            ...paginationProps,
          },
          on: paginationEvents,
        }}
      />
    );
  },
});
