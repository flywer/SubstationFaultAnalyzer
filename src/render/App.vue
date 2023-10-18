<template>
  <n-config-provider
      class="h-full"
      :locale="zhCN"
      :date-locale="dateZhCN"
  >
    <naive-provider>
      <router-view/>
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {zhCN, dateZhCN} from 'naive-ui';
import NaiveProvider from "@render/components/common/NaiveProvider.vue"
import {useAppSettingsStore} from "@render/stores/appSettings";
import {get_app_settings} from "@render/api/app/basic.api";

const appSettings = useAppSettingsStore()

// 应用设置
get_app_settings().then(async res => {
  if (res.success) {
    if (res.data != null) {
      Object.assign(appSettings.setup, res.data)
    }
    // await updateTheme()
  } else {
    window.$message.error(res.message)
  }
})

</script>

<style scoped>

</style>
