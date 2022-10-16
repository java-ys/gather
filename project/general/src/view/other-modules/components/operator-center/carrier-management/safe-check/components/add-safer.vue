<!--
 * @Description: 新增安全员
 * @Author: sunqianqian
 * @Date: 2022-04-19 09:38:05
 * @LastEditors: sunqianqian
 * @LastEditTime: 2022-05-05 15:08:21
-->
<template>
  <Modal
    v-model="visible"
    title="新增"
    width="1100px"
    :mask-closable="false"
  >
    <SearchList
      :inputList="inputListArr"
      :axiosFun="remoteMethod"
      @on-search="handleSearch"
      @on-reset="handleReset"
      @on-change="selectOrInput"
    ></SearchList>
    <m2-table
      :height="460"
      class="top15"
      v-bind="tableProps"
      @changePage="changePage"
      @changePageSize="changePageSize"
      @selectHandle="selectSafer"
    >
    </m2-table>
    <div slot="footer">
      <Button @click="cancelModal">取消</Button>
      <Button type="primary" @click="okModal">确定</Button>
    </div>
  </Modal>

</template>

<script>
import { ref, reactive } from "@vue/composition-api"
import { inputList, tableCols } from "../fields.js"
import m2Table from "_a/m2-table/v-table";
import { queryAllSafer, addSafer, getComponiesList } from "_o/api/operator-check";


export default {
  name: "AddSafer",
  components: { m2Table },
  setup(props, { root, refs, emit }) {

    const visible = ref(false)

    let inputListArr = reactive([...inputList])

    const remoteMethod = function(params) { // 输入框模糊搜索
      return getComponiesList({ ...params, _silence: 1 })
    }


    // 查询函数
    const handleReset = async () => {
      root.$store.commit("changeLoadingFlag", false)
      Object.keys(form).forEach(keys => {
        form[keys] = undefined
      })
      await queryList();
    };

    const handleSearch = async (data) => {
      root.$store.commit("changeLoadingFlag", false)
      Object.keys(form).forEach(keys => {
        if (data[keys] !== "-1") { form[keys] = data[keys] }
        else {
          form[keys] = undefined
          delete data[keys]
        }
      })
      tableProps.current = 1
      tableProps.pageSize = 10
      await queryList(data);
    };

    let ids = reactive([])
    const tableProps = reactive({
      isLoading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      parColumns: tableCols(),
      parTableData: []
    })
    const form = reactive({
      cityCode: undefined,
      phone: undefined,
      name: undefined,
      organId: undefined,
    })


    /** 刷新列表当前页 */
    const reloadPage = () => {
      tableProps.current = 1
      tableProps.pageSize = 10
      queryList()
    }
    /** 设置table的loading状态 */
    const toggleLoading = v => {
      tableProps.isLoading = v;
    }
    const changePage = (currPage) => {
      tableProps.current = currPage
      queryList({ currPage, ...form });
    }
    const changePageSize = (pageSize) => {
      tableProps.pageSize = pageSize
      queryList({ pageSize, ...form });
    }
    const selectOrInput = (a, b, c) => {
      console.log(a, b, c)
    }

    const selectSafer = (data) => {
      ids = data.map(t => t.id)
    }

    const cancelModal = () => {
      visible.value = false
    }

    const okModal = () => {
      if (ids && ids.length) {
        addSafer({ ids }).then((res) => {
          reloadPage();
          cancelModal();
          emit("on-reload")
        });
      } else {
        root.$Message.warning("请先选择要添加的安全员")
      }
    }
    // 获取安全员列表
    const queryList = (data = {}) => {
      const pagination = {
        currPage: tableProps.current,
        pageSize: tableProps.pageSize
      }
      toggleLoading(true)
      queryAllSafer({ ...form, ...pagination, ...data, _silence: 1 }).then(res => {
        if (res && res.data.data) {
          const { list, totalCount } = res.data.data
          tableProps.parTableData = list
          tableProps.total = totalCount
          ids = [];
          toggleLoading(false)
        }
      }).catch(e => { console.log(e) }).finally(() => {
        toggleLoading(false)
      })
    }
    queryList();

    return {
      visible,
      inputListArr,
      handleReset,
      handleSearch,
      tableProps,
      changePage,
      changePageSize,
      selectOrInput,
      selectSafer,
      cancelModal,
      okModal,
      reloadPage,
      remoteMethod,
    }
  }
}
</script>

<style lang="" scoped>

</style>