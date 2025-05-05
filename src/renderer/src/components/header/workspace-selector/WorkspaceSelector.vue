<script setup lang="ts">
import { ArrowDown, Delete, Edit } from '@element-plus/icons-vue';
import { WORKSPACE_ITEMS } from '@renderer/constant/local-storage-key-consts';
import { useStorage } from '@vueuse/core';
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElLink,
  ElText
} from 'element-plus';
import { WorkspaceItem } from './types';
import WorkspaceFormDialog from './WorkspaceFormDialog.vue';

// 工作空间选择器
defineOptions({
  name: 'WorkspaceSelector'
});

const workspaceItems = useStorage<WorkspaceItem[]>(WORKSPACE_ITEMS, []);
console.log(workspaceItems);
</script>

<template>
  <ElDropdown trigger="click">
    <ElButton :text="true" size="small">
      黑神话悟空
      <ElIcon class="ml-1">
        <ArrowDown />
      </ElIcon>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div>
            <div class="flex items-center">
              <span>黑神话悟空</span>
              <ElLink type="success" underline="never" class="ml-1">
                <ElIcon><Edit /></ElIcon>
              </ElLink>
              <ElLink type="danger" underline="never">
                <ElIcon><Delete /></ElIcon>
              </ElLink>
            </div>
            <ElText size="small" type="info">
              D:\Users\AppData\Roaming\npm\node_modules\pnpm\bin
            </ElText>
          </div>
        </ElDropdownItem>
        <ElDropdownItem divided>新建工作空间</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <WorkspaceFormDialog />
</template>

<style scoped lang="scss"></style>
