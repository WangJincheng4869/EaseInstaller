<script setup lang="ts">
import { ElContainer, ElHeader, ElMain } from 'element-plus';
import ButtonGroup from './components/header/button-group/ButtonGroup.vue';
import WorkspaceSelector from './components/header/workspace-selector/WorkspaceSelector.vue';
import FileList from './components/main/file-list/FileList.vue';

// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <ElContainer class="h-full">
    <ElHeader height="36px" class="flex items-center justify-between">
      <WorkspaceSelector />
      <ButtonGroup />
    </ElHeader>
    <ElMain class="!p-0">
      <FileList />
    </ElMain>
  </ElContainer>
</template>
