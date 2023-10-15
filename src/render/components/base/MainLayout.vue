<template>
  <n-layout has-sider class="mt-8">
    <n-layout-sider
        class="select-none"
        collapse-mode="width"
        :collapsed-width="64"
        :width="145"
        :collapsed="collapsed"
        :show-trigger="false"
        @collapse="collapsed = true"
        @expand="collapsed = false"
    >
      <n-scrollbar style="height: calc(100vh - 32px);" trigger="hover">
        <n-menu
            ref="menuInstRef"
            v-model:value="selectedKey"
            :collapsed="collapsed"
            :collapsed-width="74"
            :collapsed-icon-size="22"
            :options="menuOptions"
        />
      </n-scrollbar>
    </n-layout-sider>

    <n-layout class="h-full">
      <router-view/>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {routeName} from "@render/router";
import {h, ref, onMounted} from 'vue'
import type {MenuOption, MenuInst} from 'naive-ui'
import {RouterLink, useRouter} from "vue-router";
import {HomeOutlined} from '@vicons/antd'
import {renderIcon} from "@render/utils/common/renderIcon";

const router = useRouter()

// 菜单项
const menuOptions: MenuOption[] = [
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: routeName.faultInfoMgt,
              }
            },
            {default: () => '故障信息'}
        ),
    key: routeName.faultInfoMgt,
    icon: renderIcon(HomeOutlined)
  }/*,
  {
    label: () =>
        h(
            RouterLink,
            {
              to: {
                name: routeName.view2,
              }
            },
            {default: () => '页面'}
        ),
    key: routeName.view2,
    icon: renderIcon(AccessibleIcon)
  }*/
]

// 菜单实例
const menuInstRef = ref<MenuInst | null>(null)
// 默认选中的菜单
const selectedKey = ref(routeName.faultInfoMgt)
// 菜单是否折叠
const collapsed = ref(false)

onMounted(() => {
  router.push({name: routeName.faultInfoMgt});
})

</script>

<style scoped lang="less">

</style>
