<script setup lang="ts">
import { ElContainer, ElHeader, ElMain } from 'element-plus';
import ButtonGroup from './components/header/button-group/ButtonGroup.vue';
import SearchBox from './components/header/search-box/SearchBox.vue';
import WorkspaceSelector from './components/header/workspace-selector/WorkspaceSelector.vue';
import FolderList from './components/main/folder-list/FolderList.vue';
</script>

<template>
  <ElContainer class="h-full">
    <ElHeader height="36px" class="flex items-center justify-between ei-header">
      <WorkspaceSelector />
      <SearchBox />
      <ButtonGroup />
    </ElHeader>
    <ElMain class="!p-0">
      <FolderList />
    </ElMain>
  </ElContainer>
</template>
