<template>
  <n-card size="small" :style="{borderRadius:'6px',borderColor:'rgb(224 224 233)'}">
    <n-grid :cols="2">
      <n-gi>
        <div class="select-none leading-8">
          <span>开机自启</span>
        </div>
      </n-gi>
      <n-gi>
        <n-space class="h-full" justify="end" align="center">
          <n-switch
              :rubber-band="false"
              :value="appSettings.setup.openAtLogin"
              :loading="loading"
              @update:value="handleUpdateValue"
          />
        </n-space>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import {set_app_settings} from "@render/api/app/basic.api";
import {useAppSettingsStore} from "@render/stores/appSettings";
import {ref} from 'vue'

const appSettings = useAppSettingsStore()

const loading = ref(false)

const handleUpdateValue = (v: boolean) => {
  loading.value = true
  set_app_settings({
    openAtLogin: v
  })
      .then(res => {
        appSettings.setup.openAtLogin = v
        if (!res.success) {
          appSettings.setup.openAtLogin = !v
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
