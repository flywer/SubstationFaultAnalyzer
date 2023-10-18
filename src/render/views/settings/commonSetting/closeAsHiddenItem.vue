<template>
  <n-card size="small" :style="{borderRadius:'6px',borderColor:'rgb(224 224 233)'}">
    <n-grid :cols="3">
      <n-gi :span="2">
        <div class="select-none leading-8">
          <span>关闭时最小化到托盘</span>
          <n-text depth="3" class="ml-3">启用此项需先启用系统托盘，禁用此项后关闭主窗口将直接退出程序</n-text>
        </div>
      </n-gi>
      <n-gi :span="1">
        <n-space class="h-full" justify="end" align="center">
          <n-switch
              :disabled="!appSettings.setup.enableSysTray "
              :rubber-band="false"
              :value="appSettings.setup.closeAsHidden"
              :loading="loading"
              @update:value="handleUpdateValue"
          />
        </n-space>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import {useAppSettingsStore} from "@render/stores/appSettings";
import {ref} from 'vue'
import {set_app_settings} from "@render/api/app/basic.api";

const appSettings = useAppSettingsStore()

const loading = ref(false)

const handleUpdateValue = (v: boolean) => {
  loading.value = true
  set_app_settings({
    closeAsHidden: v
  })
      .then(res => {
        appSettings.setup.closeAsHidden = v
        if (!res.success) {
          appSettings.setup.closeAsHidden = !v
          window.$message.error(res.message)
        }
      })
      .catch(res => {
        window.$message.error(res)
      })
      .finally(() => loading.value = false)
}

</script>

<style scoped>

</style>
