<template>
  <n-layout style="margin: 20px">

    <n-grid :cols="12" :y-gap="10">

      <n-gi :span="12">
        <n-card>
          <n-form
              label-placement="top"
              :model="formModel"
              :size="'small'"
          >
            <n-grid :cols="12" :x-gap="4">

              <n-form-item-gi :span="6" label="变电站" path="substation">
                <n-select
                    v-model:value="formModel.substation"
                    placeholder="请选择变电站"
                    :options="substationOptions"
                    filterable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="6" label="间隔" path="interval">
                <n-select
                    v-model:value="formModel.interval"
                    placeholder="请选择间隔"
                    :options="intervalOptions"
                    filterable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="6" label="保护动作信息" path="proAct">
                <n-select
                    v-model:value="formModel.proAct"
                    placeholder="请选择保护动作信息"
                    :options="proActOptions"
                    filterable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="6" label="开关变位信息" path="switchPos">
                <n-select
                    v-model:value="formModel.switchPos"
                    placeholder="请选择开关变位信息"
                    :options="switchPosOptions"
                    filterable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-form-item-gi :span="6" label="重合闸动作信息" path="reclosingAct">
                <n-select
                    v-model:value="formModel.reclosingAct"
                    placeholder="请选择重合闸动作信息"
                    :options="reclosingActOptions"
                    filterable
                    :consistent-menu-width="false"
                />
              </n-form-item-gi>

              <n-gi :span="6">
                <n-input-group>
                  <n-grid :cols="12">
                    <n-form-item-gi :span="7" label="负荷变化" path="loadChange">
                      <n-select
                          v-model:value="formModel.loadChange"
                          placeholder="请选择负荷变化"
                          :options="loadChangeOptions"
                          filterable
                          :consistent-menu-width="false"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="5" label="功率负荷" path="powerLoadValue">
                      <n-input v-model:value="formModel.powerLoadValue" placeholder="负荷值">
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
        </n-card>
      </n-gi>
      <n-gi :span="12">

        <n-space justify="center">
          <n-button type="primary" style="width: 120px">生成</n-button>
        </n-space>

      </n-gi>

      <n-gi :span="12">
        <n-input type="textarea" placeholder="" v-model:value="resText"/>

      </n-gi>

    </n-grid>
  </n-layout>


</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

const substationOptions = ref([])
const intervalOptions = ref([])
const proActOptions = ref([])
const switchPosOptions = ref([])
const reclosingActOptions = ref([])
const loadChangeOptions = ref([])

const formModel = ref({
  substation: null,
  interval: null,
  proAct: null,
  switchPos: null,
  reclosingAct: null, // 重合闸动作
  loadChange: null, // 负荷变化
  powerLoadValue: null, // 负荷值
})

const resText = ref('')

onMounted(() => {
  substationOptions.value = [
    {
      label: '330kV胡杨变电站',
      value: '330kV胡杨变电站'
    },
    {
      label: '110kV河东里变电站',
      value: '110kV河东里变电站'
    }
  ]

  intervalOptions.value = [
    {
      label: '3310开关',
      value: '3310开关'
    },
    {
      label: '3321开关',
      value: '3321开关'
    }
  ]


  proActOptions.value = [
    {
      label: '3310断路器PSL-632UA保护动作',
      value: '3310断路器PSL-632UA保护动作'
    },
    {
      label: '3310断路器PSL-632UA保护死区保护动作',
      value: '3310断路器PSL-632UA保护死区保护动作'
    },
    {
      label: '3310断路器PRS-721AG保护死区保护动作',
      value: '3310断路器PRS-721AG保护死区保护动作'
    }
  ]

  switchPosOptions.value = [
    {
      label: '3310开关分位',
      value: '3310开关分位'
    },
    {
      label: '3310开关合位',
      value: '3310开关合位'
    },
    {
      label: '3310开关C相位置',
      value: '3310开关C相位置'
    }
  ]

  reclosingActOptions.value = [
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
  ]

  loadChangeOptions.value = [
    {
      label: '跳闸前负荷',
      value: '跳闸前负荷'
    },
    {
      label: '跳闸后负荷',
      value: '跳闸后负荷'
    },

  ]

})


const generate = () => {

    if (formModel.value)

  resText.value = `${formModel.value.substation}${formModel.value.interval}`
}


</script>

<style scoped>

</style>
