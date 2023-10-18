<template>
  <n-scrollbar style="height: calc(100vh - 111px);" trigger="hover">
    <n-layout class="pl-2 pr-2 tab-background-color">
      <n-grid :cols="1" :y-gap="12">
        <n-gi>
          <open-at-login-item/>
        </n-gi>
        <n-gi>
          <enable-sys-tray-item/>
        </n-gi>
        <n-gi>
          <close-as-hidden-item/>
        </n-gi>
        <n-gi>
          <grid-item-divider/>
        </n-gi>
        <n-gi>
          <release-address-item/>
        </n-gi>
        <n-gi>
          <grid-item-divider/>
        </n-gi>
        <n-gi>
          <hardware-acceleration-item/>
        </n-gi>
      </n-grid>
    </n-layout>
  </n-scrollbar>
</template>

<script setup lang="ts">
import CloseAsHiddenItem from "@render/views/settings/commonSetting/closeAsHiddenItem.vue";
import EnableSysTrayItem from "@render/views/settings/commonSetting/enableSysTrayItem.vue"
import HardwareAccelerationItem from "@render/views/settings/commonSetting/hardwareAccelerationItem.vue";
import OpenAtLoginItem from "@render/views/settings/commonSetting/openAtLoginItem.vue"
import ReleaseAddressItem from "@render/views/settings/commonSetting/releaseAddressItem.vue";
import GridItemDivider from "@render/views/settings/components/gridItemDivider.vue";
</script>

<style>

</style>
