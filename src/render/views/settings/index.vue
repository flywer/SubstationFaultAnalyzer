<template>
  <n-layout class="m-2">
    <n-tabs type="line" animated>
      <n-tab-pane class="tab-background-color" name="2" tab="通用设置">
        <common-setting-tab/>
      </n-tab-pane>
    </n-tabs>
  </n-layout>
</template>

<script setup lang="ts">
import CommonSettingTab from "@render/views/settings/commonSetting/commonSettingTab.vue";
</script>

<style>
</style>
