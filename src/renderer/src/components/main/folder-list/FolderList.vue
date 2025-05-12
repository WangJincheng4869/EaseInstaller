<script setup lang="ts">
import { useWorkspace } from '@renderer/store/workspace';
import { ElScrollbar } from 'element-plus';
import { storeToRefs } from 'pinia';
import FolderListItem from './FolderListItem.vue';

// 文件夹列表
defineOptions({
  name: 'FolderList'
});

const { folders } = storeToRefs(useWorkspace());
</script>

<template>
  <div class="h-full">
    <ElScrollbar>
      <FolderListItem v-for="folder in folders" :key="folder.name" :item="folder" />
    </ElScrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
