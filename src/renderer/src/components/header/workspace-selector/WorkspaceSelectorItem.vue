<script setup lang="ts">
import { Delete, Edit } from '@element-plus/icons-vue';
import { ElIcon, ElLink, ElText } from 'element-plus';
import { WorkspaceItem } from 'src/typings/workspace-types';

// 工作空间选择器选项
defineOptions({
  name: 'WorkspaceSelectorItem'
});

defineProps<{
  workspace: WorkspaceItem;
}>();

defineEmits<{
  edit: [workspace: WorkspaceItem];
  delete: [workspace: WorkspaceItem];
}>();
</script>

<template>
  <div>
    <div class="flex items-center">
      <span>{{ workspace.name }}</span>
      <ElLink type="success" underline="never" class="ml-1" @click="$emit('edit', workspace)">
        <ElIcon><Edit /></ElIcon>
      </ElLink>
      <ElLink type="danger" underline="never" @click="$emit('delete', workspace)">
        <ElIcon><Delete /></ElIcon>
      </ElLink>
    </div>
    <ElText size="small" type="info">
      {{ workspace.targetPath }}
    </ElText>
  </div>
</template>

<style scoped lang="scss"></style>
