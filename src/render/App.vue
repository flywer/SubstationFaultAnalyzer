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
</script>

<style scoped>

</style>
