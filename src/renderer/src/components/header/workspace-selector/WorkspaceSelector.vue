<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useWorkspace } from '@renderer/store/workspace';
import { useWindowSize } from '@vueuse/core';
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { isEmpty, isNil } from 'lodash-es';
import { storeToRefs } from 'pinia';
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
const workspaceStore = useWorkspace();
const { activatedWorkspaceId, workspaces, activatedWorkspace } = storeToRefs(workspaceStore);

/** 查询工作空间数据 */
const queryWorkspaces = (): void => {
  window.storageToolkit.workspace.query().then(result => {
    // 没有任何结果需要重置激活的工作空间
    if (isEmpty(result)) {
      activatedWorkspaceId.value = null;
    } else {
      // 如果当前没有默认选中的工作空间，责默认选择第一个工作空间
      if (isNil(activatedWorkspaceId.value)) {
        selectHandler(result[0]);
      }

      // 判断当前工作空闲的有效性
      if (
        result.findLastIndex(
          item =>
            !isNil(item.id) &&
            !isNil(activatedWorkspaceId.value) &&
            item.id === activatedWorkspaceId.value
        ) === -1
      ) {
        activatedWorkspaceId.value = null;
      }

      workspaces.value = result;

      console.log('workspaces', workspaces.value);
    }
  });
};

// 默认执行查询
queryWorkspaces();

/** 编辑工作空间 */
const editHandler = (workspace: WorkspaceItem): void => {
  workspaceFormDialogRef.value?.open(workspace);
};

/** 删除工作空间 */
const deleteHandler = (workspace: WorkspaceItem): void => {
  if (isNil(workspace.id)) {
    return;
  }
  ElMessageBox.confirm(`确定要删除「${workspace.name}」吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    window.storageToolkit.workspace.delete(workspace.id!).then(() => {
      ElMessage.success('删除成功');
      queryWorkspaces();
    });
  });
};

/** 选择工作空间 */
const selectHandler = (workspace: WorkspaceItem): void => {
  activatedWorkspaceId.value = workspace.id!;
  workspaceStore.loadFolders();
};

const { height } = useWindowSize();
</script>

<template>
  <ElDropdown trigger="click" :max-height="height - 100">
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
            <WorkspaceSelectorItem
              :workspace="activatedWorkspace"
              @edit="editHandler(activatedWorkspace)"
              @delete="deleteHandler(activatedWorkspace)"
            />
          </ElDropdownItem>
        </template>
        <template v-if="!isEmpty(workspaces)">
          <ElDropdownItem :disabled="true" divided>全部工作空间</ElDropdownItem>
          <template v-for="workspace in workspaces" :key="workspace.id">
            <ElDropdownItem
              v-if="workspace.id !== activatedWorkspace.id"
              @click="selectHandler(workspace)"
            >
              <WorkspaceSelectorItem
                :workspace
                @edit="editHandler(workspace)"
                @delete="deleteHandler(workspace)"
              />
            </ElDropdownItem>
          </template>
        </template>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <WorkspaceFormDialog ref="workspaceFormDialogRef" @success="queryWorkspaces" />
</template>

<style scoped lang="scss"></style>
