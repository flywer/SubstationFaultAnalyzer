<template>
  <n-layout class="m-2">

    <n-layout has-sider style="height: calc(100vh - 50px);">
      <n-layout-sider class=" bg-gray-50">

        <n-tree
            ref="tree"
            class="mt-2 pr-2"
            block-line
            expand-on-click
            :cancelable="false"
            selectable
            virtual-scroll
            style="height: calc(100vh - 50px);"

            :data="treeNodes"
            @load="handleLoad"

            :expanded-keys="expandedKeys"
            @update:expanded-keys="handleUpdateExpandedKeys"

            :selected-keys="selectedKeys"
            @update:selected-keys="handleUpdateSelectedKeys"
        />

      </n-layout-sider>
      <n-layout-content>

        <n-scrollbar class=" bg-gray-100" style="height: calc(100vh - 50px);" trigger="hover">
          <div class="m-2 pr-2">
            <div class="w-auto h-8 mb-2">
              <n-space inline class="float-right">
                <n-input
                    v-model:value="queryParam"
                    placeholder="搜索"
                    @update:value="handleSearch"
                    clearable
                    :readonly="isTableLoading"
                >
                  <template #prefix>
                    <n-icon>
                      <Search/>
                    </n-icon>
                  </template>
                </n-input>
                <n-button secondary type="info" @click="updateModalInit(1)">
                  新增
                  <template #icon>
                    <n-icon>
                      <Add24Regular/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button secondary type="info" @click="importByExcel">
                  导入
                  <template #icon>
                    <n-icon>
                      <ArrowUpload20Regular/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button secondary type="info" @click="downloadTemplate">
                  下载模板
                  <template #icon>
                    <n-icon>
                      <ArrowDownload20Regular/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button secondary strong @click="tableDataInit(queryParam)">
                  刷新
                  <template #icon>
                    <n-icon>
                      <Refresh/>
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </div>

            <n-data-table
                :key="(row) => row.id"
                class="mt-2 mb-2"
                :columns="columnsRef"
                :data="tableDataRef"
                :bordered="true"
                :size="'small'"
                :loading="isTableLoading"
                :striped="true"
            />

            <n-space class="mt-4" justify="end">
              <n-pagination
                  v-model:page="paginationReactive.page"
                  v-model:page-size="paginationReactive.pageSize"
                  :item-count="paginationReactive.itemCount"
                  :page-sizes="[10, 20, 30, 40]"
                  show-size-picker
                  @update:page="paginationReactive.onChange"
                  @update:page-size="paginationReactive.onUpdatePageSize"
              />
            </n-space>
          </div>
        </n-scrollbar>

      </n-layout-content>
    </n-layout>


  </n-layout>
</template>


<script setup lang="ts">
import {h, onMounted, reactive, ref, watch} from "vue";
import {DataTableColumns, FormInst, NButton, NIcon, NSpace, TreeInst, SelectGroupOption, TreeOption} from "naive-ui";
import {Refresh, Search} from "@vicons/ionicons5";
import {ArrowDownload20Regular, ArrowUpload20Regular, Add24Regular} from '@vicons/fluent'
import {import_by_excel} from "@render/api/faultData";
import {Filter, FilterOff, Focus2} from '@vicons/tabler'
import {find_all_substation} from "@render/api/substation";
import {find_all_proAct} from "@render/api/proAct";
import {FaultDataTableRow} from "@common/types/faultData.types";

onMounted(() => {
  treeNodesInit()
  tableDataInit()
})


// region 左侧树
const tree = ref<TreeInst | null>(null)

const treePattern = ref('')
const filterNode = ref(false)

const treeNodes = ref([])
const expandedKeys = ref([])
const selectedKeys = ref([])


const treeNodesInit = () => {
  treeNodes.value = [
    {
      label: '故障设备',
      key: 'root',
      isLeaf: false
    }
  ]
}

const handleUpdateExpandedKeys = (keys: Array<string>) => {
  expandedKeys.value = keys
}

const handleUpdateSelectedKeys = (keys: Array<string>) => {
  selectedKeys.value = keys

  tableDataInit()
}

const handleLoad = (node: TreeOption) => {
  return new Promise<void>(async (resolve) => {
    if (node.key === 'root') {
      // 获取所有变电站
      const result = await find_all_substation()
      if (result.success) {
        node.children = result.data.map((v) => ({
          label: v.substationName,
          key: `substation-${v.id}`,
          isLeaf: false
        }))

      } else {
        window.$notification.create({
          title: "数据获取失败",
          content: result.message,
          type: "error"
        })
      }
    } else {
      node.children = []
    }
    resolve()
  })

}

// endregion


// region 右侧表格


// endregion

const queryParam = ref('')

const tableDataRef = ref<FaultDataTableRow[]>([])
const isTableLoading = ref(false)

const handleSearch = (v: string) => {
  paginationReactive.page = 1
  tableDataInit(v)
}

const createColumns = (): DataTableColumns<FaultDataTableRow> => {
  return [
    {
      title: '数源单位名称',
      key: 'departName',
    },
    {
      title: '表类型',
      key: 'tableType',
    },
    {
      title: '编目名称',
      key: 'tableComment',
    },
    {
      title: '前置机表名',
      key: 'tableName',
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render(row) {
        return h(NSpace, {
          justify: 'center'
        }, [])
      }
    }
  ]
}
const columnsRef = ref(createColumns())
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page: number) => {
    paginationReactive.page = page
    tableDataInit(queryParam.value)
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    tableDataInit(queryParam.value)
  }
})


const tableDataInit = async (v?: string) => {
  const selectedKey = selectedKeys.value[0]
  tableDataRef.value = []

  if (selectedKey === 'root') {
    const result = await find_all_proAct()

    if (result.success) {

      console.log(result.data)

      /* tableDataRef.value = result.data.map(proAct => ({



       }))*/

    } else {
      window.$notification.create({
        title: "数据获取失败",
        content: result.message,
        type: "error"
      })
    }

  }

}

const updateModalInit = (type: 1 | 2) => {

}

const importByExcel = () => {
  import_by_excel().then(res => {
    if (res.success) {
      window.$message.success(res.message)
      tableDataInit(queryParam.value)
    } else {
      window.$notification.create({
        title: "数据导入失败",
        content: res.message,
        type: "error"
      })
    }
  })
}

const downloadTemplate = () => {

}

</script>

<style scoped>

</style>
