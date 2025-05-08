<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { ACTIVATED_WORKSPACE_KEY } from '@renderer/constant/local-storage-key-consts';
import { useStorage } from '@vueuse/core';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus';
import { isEmpty, isEqual } from 'lodash-es';
import { WorkspaceItem } from 'src/typings/workspace-types';
import { ref } from 'vue';
import { WorkspaceFormDialogInstance } from './form-dialog/types';
import WorkspaceFormDialog from './form-dialog/WorkspaceFormDialog.vue';
import WorkspaceSelectorItem from './WorkspaceSelectorItem.vue';

// 工作空间选择器
defineOptions({
  name: 'WorkspaceSelector'
});

const workspaceFormDialogRef = ref<WorkspaceFormDialogInstance>();
const workspaces = ref<WorkspaceItem[]>([]);

// 当活动的工作空间
const activatedWorkspace = useStorage<WorkspaceItem>(ACTIVATED_WORKSPACE_KEY, {});

/** 查询工作空间数据 */
const queryWorkspaces = (): void => {
  window.storageToolkit.workspace.query().then(result => {
    console.log('result', result);
    // 没有任何结果需要重置激活的工作空间
    if (isEmpty(result)) {
      activatedWorkspace.value = {};
    } else {
      // 如果当前没有默认选中的工作空间，责默认选择第一个工作空间
      if (isEmpty(activatedWorkspace.value)) {
        activatedWorkspace.value = result[0];
      }

      // 判断当前工作空闲的有效性
      if (result.findLastIndex(item => isEqual(item, activatedWorkspace.value)) === -1) {
        activatedWorkspace.value = {};
      }

      // 移除当前激活的工作空间
      workspaces.value = result.filter(item => item.id !== activatedWorkspace.value.id);

      console.log('workspaces', workspaces.value);
    }
  });
};

// 默认执行查询
queryWorkspaces();
</script>

<template>
  <ElDropdown trigger="click">
    <ElButton :text="true" size="small">
      {{ activatedWorkspace?.name ?? '请选择工作空间' }}
      <ElIcon class="ml-1">
        <ArrowDown />
      </ElIcon>
    </ElButton>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="workspaceFormDialogRef?.open()"> 新建工作空间 </ElDropdownItem>
        <template v-if="!isEmpty(activatedWorkspace)">
          <ElDropdownItem :disabled="true" divided>打开的空间</ElDropdownItem>
          <ElDropdownItem>
            <WorkspaceSelectorItem :workspace="activatedWorkspace" />
          </ElDropdownItem>
        </template>
        <template v-if="!isEmpty(workspaces)">
          <ElDropdownItem :disabled="true" divided>全部工作空间</ElDropdownItem>
          <ElDropdownItem v-for="workspace in workspaces" :key="workspace.id">
            <WorkspaceSelectorItem :workspace />
          </ElDropdownItem>
        </template>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <WorkspaceFormDialog ref="workspaceFormDialogRef" @success="queryWorkspaces" />
</template>

<style scoped lang="scss"></style>
