<template>
  <n-layout class="m-2">
    <n-layout has-sider style="height: calc(100vh - 50px);">
      <n-layout-sider
          :width="230"
          class="bg-gray-50"
          content-style="padding: 8px 8px 8px 8px;overflow:hidden"
      >
        <n-grid :cols="8" :y-gap="4">
          <n-gi :span="8">
            <n-input
                id="searchInput"
                ref="searchInput"
                v-model:value="pattern"
                placeholder="搜索"
                style="height:30px;"
                clearable
            >
              <template #prefix>
                <n-icon>
                  <Search/>
                </n-icon>
              </template>
              <template #suffix>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button text type="default" ghost
                              @click="filterNode = !filterNode"
                    >
                      <n-icon>
                        <Filter v-show="filterNode"/>
                        <FilterOff v-show="!filterNode"/>
                      </n-icon>
                    </n-button>
                  </template>
                  是否过滤无关节点
                </n-tooltip>
              </template>
            </n-input>
          </n-gi>
          <n-gi :span="8">
            <n-space id="toolBtnBar" style="gap:2px">
              <n-button
                  quaternary
                  size="small"
                  @click="handleTreeNodeInit"
                  title="刷新"
              >
                <n-icon>
                  <ArrowRepeatAll24Regular/>
                </n-icon>
              </n-button>

              <n-divider vertical style="margin: 0 2px 0 2px"/>
              <n-button
                  quaternary
                  size="small"
                  @click="handleTreeFocusNode"
                  title="定位至当前节点"
              >
                <n-icon>
                  <Focus2/>
                </n-icon>
              </n-button>
              <n-button
                  quaternary
                  size="small"
                  @click="handleTreeCollapseAll"
                  title="全部收起"
              >
                <n-icon>
                  <ArrowMinimizeVertical24Regular/>
                </n-icon>
              </n-button>

              <n-divider vertical style="margin: 0 2px 0 2px"/>

            </n-space>
          </n-gi>
        </n-grid>
        <n-divider style="margin: 2px 0 0 0"/>

        <n-tree
            ref="tree"
            class="mt-1 pr-2"
            block-line
            :expand-on-click="false"
            :cancelable="false"
            selectable
            virtual-scroll

            style="height: calc(100vh - 130px);user-select: none"

            :data="treeNodes"
            @load="handleLoad"

            :pattern="pattern"
            :show-irrelevant-nodes="!filterNode"

            :expanded-keys="expandedKeys"
            @update:expanded-keys="handleUpdateExpandedKeys"

            :selected-keys="selectedKeys"
            @update:selected-keys="handleUpdateSelectedKeys"

            @focus="handleTreeFocus"

            :render-switcher-icon="renderSwitcherIcon"
        />

      </n-layout-sider>
      <n-layout-content>
        <n-scrollbar class=" bg-gray-100" style="height: calc(100vh - 50px);" trigger="hover">
          <div class="m-2 pr-2">
            <div class="w-auto h-8 mb-2">
              <n-space inline class="float-left">
                <n-button secondary type="primary" @click="exportModalInit">
                  导出
                  <template #icon>
                    <n-icon>
                      <ArrowExportUp20Regular/>
                    </n-icon>
                  </template>
                </n-button>
              </n-space>

              <n-space inline class="float-right">
                <n-input-group>
                  <n-input
                      v-model:value="queryParam"
                      placeholder="搜索"
                      clearable
                      :readonly="isTableLoading"
                      @keydown.enter="handleSearch"
                      style="width: 150px"
                  >
                    <template #prefix>
                      <n-icon>
                        <Search/>
                      </n-icon>
                    </template>
                  </n-input>
                  <n-button type="primary" ghost @click="handleSearch">
                    搜索
                  </n-button>
                </n-input-group>

                <n-button secondary type="info" @click="editModalInit(1)">
                  新增
                  <template #icon>
                    <n-icon>
                      <Add24Regular/>
                    </n-icon>
                  </template>
                </n-button>
                <n-button secondary type="info" @click="importByExcel" :loading="isImporting">
                  {{ isImporting ? '正在导入' : '导入' }}
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
                <n-button secondary strong @click="tableDataInit">
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
                id="faultDataTable"
                :key="(row:FaultDataTableRow) => `${row.faultType}-${row.faultId}`"
                class="mt-2 mb-2"
                :columns="columnsRef"
                :data="tableDataRef"
                :bordered="true"
                :size="'small'"
                :loading="isTableLoading"
                :striped="true"
                :pagination="paginationReactive"
                :max-height="590"
            />
          </div>
        </n-scrollbar>

      </n-layout-content>
    </n-layout>
  </n-layout>

  <n-modal
      v-model:show="showEditModalRef"
      :mask-closable="false"
      :closable="true"
      preset="dialog"
      role="dialog"
      :show-icon="false"
      :title="modalTitle"
      :size="'small'"
      style="width: 340px"
  >
    <n-scrollbar class="pr-2" style="max-height: 500px;" trigger="hover">
      <n-form
          class="mt-4"
          ref="editModalFormRef"
          :model="editModalModelRef"
          :rules="editModalFormRules"
          :size="'small'"
      >
        <n-grid :cols="10" :x-gap="4">
          <n-form-item-gi :span="10" label="变电站名称" path="substationName">
            <n-select v-model:value="editModalModelRef.substationName"
                      filterable tag :options="substationNameOptions"
                      :consistent-menu-width="false"
                      placeholder="请输入"
                      clearable
                      :disabled="isEdit"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="10" label="间隔名称" path="intervalName">
            <n-select v-model:value="editModalModelRef.intervalName"
                      filterable tag :options="intervalNameOptions"
                      :consistent-menu-width="false"
                      placeholder="请输入"
                      clearable
                      :disabled="isEdit"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="10" label="信息类型" path="faultType">
            <n-radio-group v-model:value="editModalModelRef.faultType" :disabled="isEdit">
              <n-radio-button
                  :key="1"
                  :value="1"
                  label="保护动作信息"
              />
              <n-radio-button
                  :key="2"
                  :value="2"
                  label="开关变位信息"
              />
            </n-radio-group>
          </n-form-item-gi>
          <n-form-item-gi :span="10" label="信息描述" path="faultName">
            <n-input v-model:value="editModalModelRef.faultName"
                     placeholder="请输入"
            />
          </n-form-item-gi>

        </n-grid>

      </n-form>

    </n-scrollbar>
    <template #action>
      <n-button type="primary" :size="'small'" @click="handleModalSave" :loading="isModalSaving">保存
      </n-button>
      <n-button :size="'small'" @click="showEditModalRef=!showEditModalRef">返回</n-button>
    </template>
  </n-modal>

  <n-modal
      v-model:show="showExportModalRef"
      :mask-closable="false"
      :closable="true"
      preset="dialog"
      role="dialog"
      :show-icon="false"
      title="文本导出"
      :size="'small'"
      style="width: 760px"
  >
    <n-scrollbar class="pr-4" style="max-height: 600px;" trigger="hover">
      <n-card :content-style="{paddingRight:'12px',paddingTop:0,paddingBottom:0}">
        <n-scrollbar class="pr-4" style="max-height: 400px;" trigger="hover">
          <n-form
              class="pt-4 pb-4"
              ref="exportModalFormRef"
              :model="exportModalFormModel"
              :rules="exportModalFormRules"
              :size="'small'"
              label-placement="top"
          >
            <n-grid :cols="12" :x-gap="4">
              <n-form-item-gi :span="12" label="变电站" path="substation">
                <n-select
                    v-model:value="exportModalFormModel.substation"
                    placeholder="请选择变电站"
                    :options="exportModalSubstationOptions"
                    filterable
                    multiple
                    clearable
                    :consistent-menu-width="false"
                    @update:value="handleExportSubstationUpdate"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="12" label="间隔" path="interval">
                <n-select
                    v-model:value="exportModalFormModel.interval"
                    :placeholder="isEmpty(exportModalFormModel.substation)?'请先选择变电站':'请选择间隔'"
                    :options="exportModalIntervalOptions"
                    filterable
                    multiple
                    clearable
                    :consistent-menu-width="false"
                    :disabled="isEmpty(exportModalFormModel.substation)"
                    @update:value="handleExportIntervalUpdate"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="12" label="保护动作信息" path="proAct">
                <n-select
                    v-model:value="exportModalFormModel.proAct"
                    :placeholder="exportModalFormModel.interval!=null && exportModalFormModel.interval.length>0?'请先选择间隔':'请选择保护动作信息'"
                    :options="exportModalProActOptions"
                    filterable
                    multiple
                    clearable
                    :consistent-menu-width="false"
                    :disabled="!(exportModalFormModel.interval!=null && exportModalFormModel.interval.length>0)"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="12" label="开关变位信息" path="switchPos">
                <n-select
                    v-model:value="exportModalFormModel.switchPos"
                    :placeholder="exportModalFormModel.interval!=null && exportModalFormModel.interval.length>0?'请先选择间隔':'请选择开关变位信息'"
                    :options="exportModalSwitchPosOptions"
                    filterable
                    multiple
                    clearable
                    :consistent-menu-width="false"
                    :disabled="!(exportModalFormModel.interval!=null && exportModalFormModel.interval.length>0)"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="12" label="重合闸动作信息" path="reclosingAct">
                <n-select
                    v-model:value="exportModalFormModel.reclosingAct"
                    placeholder="请选择重合闸动作信息"
                    :options="exportModalReclosingActOptions"
                    filterable
                    clearable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-gi :span="12">
                <n-input-group>
                  <n-grid :cols="12">
                    <n-form-item-gi :span="2" label="跳闸前负荷" label-placement="left">
                      <n-checkbox v-model:checked="exportModalFormModel.isLoadBeforeTripping"/>
                    </n-form-item-gi>
                    <n-form-item-gi :span="10" path="loadBeforeTrippingValue" label-placement="left">
                      <n-input v-model:value="exportModalFormModel.loadBeforeTrippingValue" placeholder="负荷值"
                               clearable>
                        <template #prefix>
                          <span style="font-size: 12px">P:</span>
                        </template>
                        <template #suffix>
                          <span style="font-size: 12px">MW</span>
                        </template>
                      </n-input>
                    </n-form-item-gi>

                    <n-form-item-gi :span="2" label="跳闸后负荷" label-placement="left">
                      <n-checkbox v-model:checked="exportModalFormModel.isLoadAfterTripping"/>
                    </n-form-item-gi>
                    <n-form-item-gi :span="10" path="loadAfterTrippingValue" label-placement="left">
                      <n-input v-model:value="exportModalFormModel.loadAfterTrippingValue" placeholder="负荷值"
                               clearable>
                        <template #prefix>
                          <span style="font-size: 12px">P:</span>
                        </template>
                        <template #suffix>
                          <span style="font-size: 12px">MW</span>
                        </template>
                      </n-input>
                    </n-form-item-gi>
                  </n-grid>

                </n-input-group>
              </n-gi>

            </n-grid>

          </n-form>
        </n-scrollbar>
      </n-card>

      <n-card :content-style="{paddingRight:'12px',paddingTop:0,paddingBottom:0}" class="mt-4"
              v-if="summaryText.length>0">
        <!--        <n-scrollbar class="pr-4" style="max-height: 200px;" trigger="hover">-->
        <n-input class="mt-4 mb-4" v-model:value="summaryText" type="textarea">
          <template #suffix>
            <n-button circle size="small" @click="copyText(summaryText)">
              <template #icon>
                <Copy24Regular/>
              </template>
            </n-button>
          </template>
        </n-input>
        <!--        </n-scrollbar>-->
      </n-card>
    </n-scrollbar>

    <template #action>
      <n-button quaternary type="info" :size="'small'" @click="modelReset">清空表单</n-button>
      <n-button type="primary" :size="'small'" @click="handleExportModalSave" :loading="isExportModalSaving">生成文本
      </n-button>
      <n-button :size="'small'" @click="showExportModalRef=!showExportModalRef">返回</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {h, onMounted, reactive, ref,} from "vue";
import {
  DataTableColumns,
  NButton,
  NIcon,
  NSpace,
  SelectOption,
  FormInst,
  TreeInst,
  TreeOption,
  SelectGroupOption,
  NPopconfirm,
  FormItemRule
} from "naive-ui";
import {Refresh, Search} from "@vicons/ionicons5";
import {
  ArrowDownload20Regular,
  ArrowUpload20Regular,
  Add24Regular,
  ArrowRepeatAll24Regular,
  ArrowMinimizeVertical24Regular,
  ChevronRight24Regular,
  ArrowExportUp20Regular,
  Copy24Regular
} from '@vicons/fluent'
import {delete_fault_data, download_template, import_by_excel, save_fault_data} from "@render/api/faultData";
import {find_all_substation, find_by_substation_name, find_substation_by_id} from "@render/api/substation";
import {find_all_proAct} from "@render/api/proAct";
import {FaultDataTableRow, FaultSaveModel} from "@common/types/faultData.types";
import {find_all_switchPos} from "@render/api/switchPos";
import {find_all_interval, find_by_interval_id} from "@render/api/interval";
import {Filter, FilterOff, Focus2} from '@vicons/tabler'
import {getCNTimeString, getDayString} from "@common/utils/dateUtils";
import {isEmpty} from "lodash";
import {clipboard_write_text} from "@render/api/app/basic.api";

onMounted(() => {
  treeNodesInit()
  tableDataInit()
})

// region 左侧树
const tree = ref<TreeInst | null>(null)
const treeNodes = ref([])
const expandedKeys = ref(['root'])
const selectedKeys = ref(['root'])

// region 节点搜索
const searchInput = ref(null)
const pattern = ref()
const filterNode = ref(false)

const handleTreeFocus = () => {
  searchInput.value.focus()
}
// endregion

// region 按钮栏

// 树刷新
const handleTreeNodeInit = () => {
  treeNodesInit()
}

// 滚动聚焦至当前选中节点
const handleTreeFocusNode = () => {
  const opt = nTreeFindOptionByKey(treeNodes.value, selectedKeys.value[0])
  pattern.value = opt.label
  tree.value.scrollTo({key: selectedKeys.value[0]})
}

const nTreeFindOptionByKey = (treeOptions: TreeOption[], key: any): TreeOption => {
  for (const option of treeOptions) {
    if (option.key as string === key) {
      return option
    }
    if (option.children) {
      // 继续递归查找子节点
      const opt = nTreeFindOptionByKey(option.children, key);
      if (opt) {
        return opt
      }
    }
  }
}

// 树全部收起
const handleTreeCollapseAll = () => {
  expandedKeys.value = []
}

// endregion

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
  paginationReactive.page = 1
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

const renderSwitcherIcon = () => {
  return h(NIcon, null, {default: () => h(ChevronRight24Regular)})
}

// endregion

// region 右侧表格
const tableDataRef = ref<FaultDataTableRow[]>([])
const isTableLoading = ref(false)

// region 工具栏

// 查询
const queryParam = ref('')
const tableDataRefBackUp = ref<FaultDataTableRow[]>([])

const handleSearch = () => {

  isTableLoading.value = true

  if (queryParam.value != null) {
    tableDataRef.value = tableDataRefBackUp.value.filter(data => {
      return data.substationName.includes(queryParam.value.trim()) ||
          data.intervalName.includes(queryParam.value.trim()) ||
          data.faultName.includes(queryParam.value.trim());
    })
  } else {
    tableDataRef.value = tableDataRefBackUp.value
  }


  setTimeout(() => {
    isTableLoading.value = false
  }, randomNumber(10, 300))

}

// 导入
const isImporting = ref(false)

const importByExcel = () => {
  isImporting.value = true
  import_by_excel().then(res => {
    if (res.success) {
      window.$message.success(res.message)
      treeNodesInit()
      tableDataInit()
    } else {
      if (res.message === '未选择文件') {
        window.$message.warning(res.message)
      } else {
        window.$notification.create({
          title: "数据导入失败",
          content: res.message,
          type: "error"
        })
      }


    }
  }).finally(() => isImporting.value = false)
}

// 下载模板
const downloadTemplate = () => {
  download_template().then(res => {
    if (res.success) {
      window.$message.success(res.message)
    } else {
      window.$message.error(res.message)
    }
  })
}

// endregion


const createColumns = (): DataTableColumns<FaultDataTableRow> => {
  return [
    {
      title: '变电站名称',
      key: 'substationName',
      width: 15,
      sorter: 'default',
      ellipsis: {tooltip: true},
    },
    {
      title: '间隔名称',
      key: 'intervalName',
      width: 10,
      sorter: 'default',
      ellipsis: {tooltip: true},
    },
    {
      title: '信息描述',
      key: 'faultName',
      width: 30,
      sorter: 'default',
      ellipsis: {tooltip: true},
    },
    {
      title: '信息分类',
      key: 'faultType',
      width: 10,
      ellipsis: {tooltip: true},
      defaultFilterOptionValues: ['保护动作信息', '开关变位信息'],
      filterOptions: [
        {
          label: '保护动作信息',
          value: '保护动作信息'
        },
        {
          label: '开关变位信息',
          value: '开关变位信息'
        }
      ],
      render(row) {
        if (row.faultType == 1)
          return '保护动作信息'
        else {
          return '开关变位信息'
        }
      },
      filter(value, row) {
        if (row.faultType == 1)
          return value === '保护动作信息'
        else {
          return value === '开关变位信息'
        }
      }
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 12,
      render(row) {
        return h(NSpace, {
          justify: 'center'
        }, [
          showButton('编辑', () => {
            editModalInit(2, row)
          }),
          showConfirmation('删除', () => {
            deleteFaultData(row)
          })
        ])
      }
    }
  ]
}
const columnsRef = ref(createColumns())
const paginationReactive = reactive({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [20, 40, 60],
  onChange: async (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})

const showButton = (text: string, onClick: () => any) => {
  return h(NButton, {
        size: 'small',
        onClick: async () => {
          await onClick()
        }
      },
      {default: () => text})
}
const showConfirmation = (text: string, onPositiveClick: () => any) => {
  return h(NPopconfirm, {
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await onPositiveClick();
    },
  }, {
    trigger: () => {
      return h(NButton, {size: 'small'}, {default: () => text})
    },
    default: () => `确定要${text}吗？`
  });
}

// 表格更新
const tableDataInit = async () => {

  isTableLoading.value = true

  queryParam.value = ''

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

  tableDataRefBackUp.value = tableDataRef.value

  isTableLoading.value = false
}

const deleteFaultData = (row: FaultDataTableRow) => {
  delete_fault_data(row.faultType, row.faultId).then(res => {
    if (res.success) {
      window.$message.success(res.message)
      tableDataInit()
    } else {
      window.$notification.create({
        title: "数据删除失败",
        content: res.message,
        type: "error"
      })
    }
  })
}
// endregion

// region 新增更新弹出框
const showEditModalRef = ref(false)
const modalTitle = ref('编辑')
const isEdit = ref(false)

const editModalFormRef = ref<FormInst | null>(null)
const editModalModelRef = ref<FaultSaveModel>({
  substationName: null,
  intervalName: null,
  faultType: 1,
  faultId: null,
  faultName: null,
})
const editModalFormRules = ref({
  substationName: {
    required: true,
    trigger: ['input', 'change'],
    message: '请输入变电站名称'
  },
  intervalName: {
    required: true,
    trigger: ['input', 'change'],
    message: '请输入间隔名称'
  },
  faultType: {
    type: 'number',
    required: true,
    trigger: ['change'],
    message: '请选择信息类型'
  },
})

const uuid = getDayString(false)
const substationNameOptions = ref<Array<SelectOption>>()
const intervalNameOptions = ref<Array<SelectOption>>()

/**
 *  弹出框初始化
 * @param type  1：新增 2：更新
 * @param data
 */
const editModalInit = (type: 1 | 2, data?: FaultDataTableRow) => {
  substationNameOptionsInit()
  intervalNameOptionsInit()

  if (type == 1) {
    modalTitle.value = '新增'
    isEdit.value = false

    editModalModelRef.value.substationName = null
    editModalModelRef.value.intervalName = null
    editModalModelRef.value.faultType = 1
    editModalModelRef.value.faultId = null
    editModalModelRef.value.faultName = null

  } else {
    modalTitle.value = '编辑'
    isEdit.value = true

    editModalModelRef.value.substationName = data.substationName
    editModalModelRef.value.intervalName = data.intervalName
    editModalModelRef.value.faultType = data.faultType
    editModalModelRef.value.faultId = data.faultId
    editModalModelRef.value.faultName = data.faultName
  }

  showEditModalRef.value = true
}

const isModalSaving = ref(false)
const handleModalSave = () => {

  editModalFormRef.value.validate(errors => {
    if (!errors) {
      isModalSaving.value = true
      save_fault_data(editModalModelRef.value)
          .then(res => {
            if (res.success) {
              window.$message.success(res.message)
              showEditModalRef.value = false
              treeNodesInit()
              tableDataInit()
            } else {
              window.$notification.create({
                title: "数据保存失败",
                content: res.message,
                type: "error"
              })
            }
          })
          .finally(() => isModalSaving.value = false)

    }
  })

}

const substationNameOptionsInit = async () => {
  const substations = (await find_all_substation()).data

  substationNameOptions.value = substations.map((v) => ({
    label: v.substationName,
    value: v.substationName,
  }))
}

const intervalNameOptionsInit = async () => {
  const intervals = (await find_all_interval()).data

  intervalNameOptions.value = intervals.map((v) => ({
    label: v.intervalName,
    value: v.intervalName
  }))
}

// endregion

// region 导出
const showExportModalRef = ref(false)

const exportModalFormRef = ref<FormInst | null>(null)
const exportModalFormModel = ref({
  substation: null,
  interval: null as string[],
  proAct: null as string[],
  switchPos: null as string[],
  reclosingAct: null, // 重合闸动作

  isLoadBeforeTripping: false,// 跳闸前负荷
  loadBeforeTrippingValue: null,// 跳闸前负荷值

  isLoadAfterTripping: false,// 跳闸后负荷
  loadAfterTrippingValue: null,// 跳闸后负荷值
})

const exportModalFormRules = ref({
  substation: {
    type: 'array',
    required: true,
    trigger: ['change'],
    message: '请选择变电站'
  },
  interval: {
    type: 'array',
    required: true,
    trigger: ['change'],
    message: '请选择间隔'
  },
  proAct: {
    type: 'array',
    required: true,
    trigger: ['change'],
    message: '请选择保护动作信息'
  },
  switchPos: {
    type: 'array',
    required: true,
    trigger: ['change'],
    message: '请选择开关变位信息'
  },
  reclosingAct: {
    required: true,
    trigger: ['change'],
    message: '请选择重合闸动作'
  },
  loadBeforeTrippingValue: {
    validator(rule: FormItemRule, value: string) {
      if (exportModalFormModel.value.isLoadBeforeTripping && isEmpty(value)) {
        return new Error('跳闸前负荷不能为空')
      } else {
        return true
      }
    },
    trigger: ['input', 'blur']
  },
  loadAfterTrippingValue: {
    validator(rule: FormItemRule, value: string) {
      if (exportModalFormModel.value.isLoadAfterTripping && isEmpty(value)) {
        return new Error('跳闸后负荷不能为空')
      } else {
        return true
      }
    },
    trigger: ['input', 'blur']
  },
})

const exportModalSubstationOptions = ref<Array<SelectOption | SelectGroupOption>>()
const exportModalIntervalOptions = ref<Array<SelectOption | SelectGroupOption>>()
const exportModalProActOptions = ref<Array<SelectOption | SelectGroupOption>>()
const exportModalSwitchPosOptions = ref<Array<SelectOption | SelectGroupOption>>()
const exportModalReclosingActOptions = ref<Array<SelectOption | SelectGroupOption>>([
  {
    label: '重合闸动作成功',
    value: '重合闸动作成功'
  },
  {
    label: '重合闸动作不成功',
    value: '重合闸动作不成功'
  },
  {
    label: '重合闸未投',
    value: '重合闸未投'
  },
  {
    label: '重合闸未动作',
    value: '重合闸未动作'
  }
])

const exportModalSubstationOptionsInit = async () => {
  const substations = (await find_all_substation()).data

  exportModalSubstationOptions.value = substations.map((v) => ({
    label: v.substationName,
    value: v.substationName,
  }))
}

const handleExportSubstationUpdate = async (subsNames: string[]) => {

  exportModalIntervalOptions.value = []

  for (const subsName of subsNames) {
    const substation = (await find_by_substation_name(subsName)).data

    exportModalIntervalOptions.value.push(...substation.interval.map((interval) => ({
      label: `${substation.substationName}：${interval.intervalName}`,
      value: interval.id.toString()
    })))
  }

  if (!isEmpty(exportModalFormModel.value.interval)) {
    exportModalFormModel.value.interval = exportModalFormModel.value.interval.filter(id => exportModalIntervalOptions.value.map(opt => opt.value).includes(id))
  }

}

const handleExportIntervalUpdate = async (intervalIds: string[]) => {

  exportModalProActOptions.value = []
  exportModalSwitchPosOptions.value = []

  for (const intervalId of intervalIds) {
    const interval = (await find_by_interval_id(parseInt(intervalId))).data

    exportModalProActOptions.value.push(...interval.proAct.map((v) => ({
      label: `${interval.intervalName}：${v.proActName}`,
      value: v.id.toString()
    })))

    exportModalSwitchPosOptions.value.push(...interval.switchPos.map((v) => ({
      label: `${interval.intervalName}：${v.switchPosName}`,
      value: v.id.toString()
    })))

  }

  if (!isEmpty(exportModalFormModel.value.proAct)) {
    exportModalFormModel.value.proAct = exportModalFormModel.value.proAct.filter(id => exportModalProActOptions.value.map(opt => opt.value).includes(id))
  }

  if (!isEmpty(exportModalFormModel.value.switchPos)) {
    exportModalFormModel.value.switchPos = exportModalFormModel.value.switchPos.filter(id => exportModalSwitchPosOptions.value.map(opt => opt.value).includes(id))
  }

}

const exportModalInit = () => {
  exportModalSubstationOptionsInit()

  showExportModalRef.value = true
}

const isExportModalSaving = ref(false)
const summaryText = ref('')
const handleExportModalSave = async () => {

  exportModalFormRef.value?.validate(async errors => {
    if (!errors) {
      summaryText.value = `酒泉集控站监控汇报：${getCNTimeString()}\n`

      for (const intervalId of exportModalFormModel.value.interval) {
        const interval = (await find_by_interval_id(parseInt(intervalId))).data

        let proActText = ''

        exportModalFormModel.value.proAct.forEach(proActId => {
          if (interval.proAct.map(p => p.id).includes(parseInt(proActId))) {
            const proAct = interval.proAct.find(p => p.id == parseInt(proActId))
            if (proAct.proActName.startsWith(interval.intervalName)) {
              proActText += proAct.proActName.substring(interval.intervalName.length) + '、'
            } else {
              proActText += proAct.proActName + '、'
            }
          }
        })

        if (isEmpty(proActText.slice(0, -1))) {
          proActText = ''
        } else {
          proActText = `${proActText.slice(0, -1)}，`
        }

        let switchPosText = ''
        exportModalFormModel.value.switchPos.forEach(switchPosId => {
          if (interval.switchPos.map(p => p.id).includes(parseInt(switchPosId))) {
            const switchPos = interval.switchPos.find(p => p.id == parseInt(switchPosId))
            switchPosText += switchPos.switchPosName + '、'
          }
        })

        if (isEmpty(switchPosText.slice(0, -1))) {
          switchPosText = ''
        } else {
          switchPosText = `${switchPosText.slice(0, -1)}，`
        }

        if (summaryText.value.includes(interval.substation.substationName)) {
          summaryText.value += `${interval.intervalName}${isEmpty(proActText) && isEmpty(switchPosText) ? '' : '，'}${proActText}${switchPosText}${exportModalFormModel.value.reclosingAct}；\n`
        } else {
          summaryText.value += `${interval.substation.substationName}${interval.intervalName}${isEmpty(proActText) && isEmpty(switchPosText) ? '' : '，'}${proActText}${switchPosText}${exportModalFormModel.value.reclosingAct}；\n`
        }

      }

      if (!exportModalFormModel.value.isLoadBeforeTripping && !exportModalFormModel.value.isLoadAfterTripping) {
        summaryText.value = `${summaryText.value.slice(0, -2)}。`
      } else if (exportModalFormModel.value.isLoadBeforeTripping && !exportModalFormModel.value.isLoadAfterTripping) {
        summaryText.value += `跳闸前负荷P:${exportModalFormModel.value.loadBeforeTrippingValue}MW。`
      } else if (exportModalFormModel.value.isLoadAfterTripping && !exportModalFormModel.value.isLoadBeforeTripping) {
        summaryText.value += `跳闸后负荷P:${exportModalFormModel.value.loadAfterTrippingValue}MW。`
      } else if (exportModalFormModel.value.isLoadBeforeTripping && exportModalFormModel.value.isLoadAfterTripping) {
        summaryText.value += `跳闸前负荷P:${exportModalFormModel.value.loadBeforeTrippingValue}MW` +
            `，跳闸后负荷P:${exportModalFormModel.value.loadAfterTrippingValue}MW。`
      }

    }
  })


}

// endregion
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const copyText = (text: string) => {
  clipboard_write_text(text).then(() => {
    window.$message.success('复制成功')
  })
}

const modelReset = () => {
  exportModalFormModel.value = {
    substation: null,
    interval: null as string[],
    proAct: null as string[],
    switchPos: null as string[],
    reclosingAct: null, // 重合闸动作

    isLoadBeforeTripping: false,// 跳闸前负荷
    loadBeforeTrippingValue: null,// 跳闸前负荷值

    isLoadAfterTripping: false,// 跳闸后负荷
    loadAfterTrippingValue: null,// 跳闸后负荷值
  }

  summaryText.value = ''
}

</script>

<style scoped>
:deep(#searchInput .n-input-wrapper) {
  padding-left: 8px;
  padding-right: 8px;

}

:deep(#searchInput .n-input__input-el) {
  height: 30px;
  line-height: 30px;
}

:deep(#toolBtnBar .n-button) {
  padding-left: 6px;
  padding-right: 6px;
  font-size: 18px;
}

:deep(#faultDataTable .n-data-table-th) {
  user-select: none;
}
</style>
