<template>
  <n-card size="small" :style="{borderRadius:'6px',borderColor:'rgb(224 224 233)'}">
    <n-grid :cols="2">
      <n-gi>
        <div class="select-none leading-8">
          <span>使用GPU渲染界面（硬件加速）</span>
          <n-text depth="3" class="ml-3"></n-text>
        </div>
      </n-gi>
      <n-gi>
        <n-space class="h-full" justify="end" align="center">
          <n-switch
              :disabled="true"
              :rubber-band="false"
              :value="appSettings.setup.hardwareAcceleration"
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
    hardwareAcceleration: v
  })
      .then(res => {
        appSettings.setup.hardwareAcceleration = v
        if (!res.success) {
          appSettings.setup.hardwareAcceleration = !v
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
