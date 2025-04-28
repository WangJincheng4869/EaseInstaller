<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus';

// 工作空间选择器
defineOptions({
  name: 'WorkspaceSelector'
});
</script>

<template>
  <ElDropdown trigger="click">
    <ElButton :text="true" size="small"
      >黑神话悟空

      <ElIcon class="ml-1">
        <ArrowDown />
      </ElIcon>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>系统默认</ElDropdownItem>
        <ElDropdownItem>浅色</ElDropdownItem>
        <ElDropdownItem>深色</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss"></style>
