<script setup lang="ts">
import { ElContainer, ElHeader, ElMain } from 'element-plus';
import ButtonGroup from './components/header/button-group/ButtonGroup.vue';
import WorkspaceSelector from './components/header/workspace-selector/WorkspaceSelector.vue';
import FileList from './components/main/file-list/FileList.vue';
import SearchBox from './components/header/search-box/SearchBox.vue';

// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <ElContainer class="h-full">
    <ElHeader height="36px" class="flex items-center justify-between ei-header">
      <WorkspaceSelector />
      <SearchBox />
      <ButtonGroup />
    </ElHeader>
    <ElMain class="!p-0">
      <FileList />
    </ElMain>
  </ElContainer>
</template>
