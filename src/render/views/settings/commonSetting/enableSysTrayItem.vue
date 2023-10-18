<template>
  <n-card size="small" :style="{borderRadius:'6px',borderColor:'rgb(224 224 233)'}">
    <n-grid :cols="2">
      <n-gi>
        <div class="select-none leading-8">
          <span>启用系统托盘</span>
        </div>
      </n-gi>
      <n-gi>
        <n-space class="h-full" justify="end" align="center">
          <n-switch
              :rubber-band="false"
              :value="appSettings.setup.enableSysTray"
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
import {AppSetup} from "@common/types/app.types";

const appSettings = useAppSettingsStore()

const loading = ref(false)

const handleUpdateValue = (v: boolean) => {
  loading.value = true
  let setup: AppSetup
  if (v) {
    setup = {
      enableSysTray: v
    }
  } else {
    setup = {
      enableSysTray: v,
      closeAsHidden: false
    }
  }

  set_app_settings(setup)
      .then(res => {
        appSettings.setup.enableSysTray = v
        appSettings.setup.closeAsHidden = setup.closeAsHidden
        if (!res.success) {
          appSettings.setup.enableSysTray = !setup.enableSysTray
          appSettings.setup.closeAsHidden = !setup.closeAsHidden
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
