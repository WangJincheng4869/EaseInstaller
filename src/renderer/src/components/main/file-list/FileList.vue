<script setup lang="ts">
import { ElScrollbar } from 'element-plus';
import FileListItem from './FileListItem.vue';

// 文件列表
defineOptions({
  name: 'FileList'
});
</script>

<template>
  <div class="h-full">
    <ElScrollbar>
      <FileListItem v-for="(item, index) in 10" :key="index" :item="item" />
    </ElScrollbar>
  </div>
</template>

<style scoped lang="scss"></style>
