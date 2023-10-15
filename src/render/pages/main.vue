<template>
  <WindowBar
      :show-bg-color="true"
      :show-title="true"
      :show-window-min="true"
      :show-window-max="true"
      :show-window-close="true"
      :show-pin="true"
  />
  <MainLayout/>
</template>

<script setup lang="ts">
import WindowBar from "@render/components/base/WindowBar.vue";
import MainLayout from "@render/components/base/MainLayout.vue";
</script>

<style scoped>

</style>
