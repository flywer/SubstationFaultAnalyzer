<template>
  <n-layout class="m-2">
    <n-layout has-sider style="height: calc(100vh - 50px);">
      <n-layout-sider
          :width="230"
          class="bg-gray-50">

        <n-tree
            ref="tree"
            class="mt-2 pr-2"
            block-line
            :expand-on-click="false"
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
                :pagination="paginationReactive"
            />

            <!--            <n-space class="mt-4" justify="end">
                          <n-pagination
                              v-model:page="paginationReactive.page"
                              v-model:page-size="paginationReactive.pageSize"
                              :item-count="paginationReactive.itemCount"
                              :page-sizes="[10, 20, 30, 40]"
                              show-size-picker
                              @update:page="paginationReactive.onChange"
                              @update:page-size="paginationReactive.onUpdatePageSize"
                          />
                        </n-space>-->
          </div>
        </n-scrollbar>

      </n-layout-content>
    </n-layout>


  </n-layout>
</template>


<script setup lang="ts">
import {h, onMounted, reactive, ref,} from "vue";
import {DataTableColumns, NButton, NIcon, NSpace, TreeInst, TreeOption} from "naive-ui";
import {Refresh, Search} from "@vicons/ionicons5";
import {ArrowDownload20Regular, ArrowUpload20Regular, Add24Regular} from '@vicons/fluent'
import {import_by_excel} from "@render/api/faultData";
import {find_all_substation, find_substation_by_id, find_substation_by_interval_id} from "@render/api/substation";
import {find_all_proAct} from "@render/api/proAct";
import {FaultDataTableRow} from "@common/types/faultData.types";
import {find_all_switchPos} from "@render/api/switchPos";
import {find_by_interval_id} from "@render/api/interval";

onMounted(() => {
  treeNodesInit()
  tableDataInit()
})


// region 左侧树
const tree = ref<TreeInst | null>(null)

const treePattern = ref('')
const filterNode = ref(false)

const treeNodes = ref([])
const expandedKeys = ref(['root'])
const selectedKeys = ref(['root'])


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
    } else if (node.key.toString().startsWith('substation-')) {

      const result = await find_substation_by_id(node.key.toString().split('-')[1])

      if (result.success) {
        node.children = result.data.interval.map((v) => ({
          label: v.intervalName,
          key: `interval-${v.id}`,
          isLeaf: true
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
      title: '变电站名称',
      key: 'substationName',
    },
    {
      title: '间隔名称',
      key: 'intervalName',
    },
    {
      title: '信息描述',
      key: 'faultName',
    },
    {
      title: '信息分类',
      key: 'faultType',
      render(row) {
        if (row.faultType == 1)
          return '保护动作信息'
        else {
          return '开关变位信息'
        }
      }
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
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 30, 60],
  onChange: async (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})


const tableDataInit = async (v?: string) => {
  const selectedKey = selectedKeys.value[0] as string
  tableDataRef.value = []

  if (selectedKey === 'root') {
    const substations = (await find_all_substation()).data

    const proActResult = await find_all_proAct()
    if (proActResult.success) {

      const data = proActResult.data.map((proAct): FaultDataTableRow => ({
        substationId: substations.find(substation => substation.interval.some(interval => interval.id == proAct.interval.id)).id,
        substationName: substations.find(substation => substation.interval.some(interval => interval.id == proAct.interval.id)).substationName,
        intervalId: proAct.interval.id,
        intervalName: proAct.interval.intervalName,
        faultId: proAct.id,
        faultName: proAct.proActName,
        faultType: 1
      }))

      tableDataRef.value.push(...data)

    } else {
      window.$notification.create({
        title: "数据获取失败",
        content: proActResult.message,
        type: "error"
      })
    }

    const switchPosResult = await find_all_switchPos()
    if (switchPosResult.success) {

      const data = switchPosResult.data.map((switchPos): FaultDataTableRow => ({
        substationId: substations.find(substation => substation.interval.some(interval => interval.id == switchPos.interval.id)).id,
        substationName: substations.find(substation => substation.interval.some(interval => interval.id == switchPos.interval.id)).substationName,
        intervalId: switchPos.interval.id,
        intervalName: switchPos.interval.intervalName,
        faultId: switchPos.id,
        faultName: switchPos.switchPosName,
        faultType: 2
      }))

      tableDataRef.value.push(...data)

    } else {
      window.$notification.create({
        title: "数据获取失败",
        content: proActResult.message,
        type: "error"
      })
    }

  } else if (selectedKey.startsWith('substation-')) {
    const result = await find_substation_by_id(selectedKey.split('-')[1])

    for (const interval of result.data.interval) {
      const res = await find_by_interval_id(interval.id)

      res.data.proAct.forEach(proAct => {
        tableDataRef.value.push({
          substationId: result.data.id,
          substationName: result.data.substationName,
          intervalId: interval.id,
          intervalName: interval.intervalName,
          faultId: proAct.id,
          faultName: proAct.proActName,
          faultType: 1
        })
      })

      res.data.switchPos.forEach(switchPos => {
        tableDataRef.value.push({
          substationId: result.data.id,
          substationName: result.data.substationName,
          intervalId: interval.id,
          intervalName: interval.intervalName,
          faultId: switchPos.id,
          faultName: switchPos.switchPosName,
          faultType: 2
        })
      })

    }
  } else if (selectedKey.startsWith('interval-')) {
    const intervalResult = await find_by_interval_id(parseInt(selectedKey.split('-')[1]))
    if (intervalResult.success) {
      const substation = (await find_substation_by_id(intervalResult.data.substation.id)).data

      intervalResult.data.proAct.forEach(proAct => {
        tableDataRef.value.push({
          substationId: substation.id,
          substationName: substation.substationName,
          intervalId: intervalResult.data.id,
          intervalName: intervalResult.data.intervalName,
          faultId: proAct.id,
          faultName: proAct.proActName,
          faultType: 1
        })
      })

      intervalResult.data.switchPos.forEach(switchPos => {
        tableDataRef.value.push({
          substationId: substation.id,
          substationName: substation.substationName,
          intervalId: intervalResult.data.id,
          intervalName: intervalResult.data.intervalName,
          faultId: switchPos.id,
          faultName: switchPos.switchPosName,
          faultType: 2
        })
      })

    } else {
      window.$notification.create({
        title: "数据获取失败",
        content: intervalResult.message,
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
