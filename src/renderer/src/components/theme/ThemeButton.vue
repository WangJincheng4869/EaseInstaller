<script setup lang="ts">
import { colorMode } from '@renderer/config/theme';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import Shirt from '../../assets/shirt.svg';

// 主题切换按钮
defineOptions({
  name: 'ThemeButton'
});

const { store } = colorMode;
const switchTheme = (mode: 'auto' | 'light' | 'dark'): void => {
  store.value = mode;
};
</script>

<template>
  <ElDropdown
    trigger="click"
    :popper-options="{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [10, 10]
          }
        }
      ]
    }"
  >
    <ElButton :text="true" size="small" class="theme-button"><Shirt /></ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem :class="{ 'is-active': store === 'auto' }" @click="switchTheme('auto')"
          >系统默认</ElDropdownItem
        >
        <ElDropdownItem :class="{ 'is-active': store === 'light' }" @click="switchTheme('light')"
          >浅色</ElDropdownItem
        >
        <ElDropdownItem :class="{ 'is-active': store === 'dark' }" @click="switchTheme('dark')"
          >深色</ElDropdownItem
        >
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss">
.theme-button {
  font-size: 14px;

  svg {
    height: 1em;
    width: 1em;
    transition: transform var(--el-transition-duration);
  }
}
</style>
