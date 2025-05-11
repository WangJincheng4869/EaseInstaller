<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { useWorkspace } from '@renderer/store/workspace';
import { ElInput } from 'element-plus';
import { storeToRefs } from 'pinia';

// 搜索框组件
defineOptions({
  name: 'SearchBox'
});

const { searchFolderKey } = storeToRefs(useWorkspace());
</script>

<template>
  <div class="search-box">
    <ElInput v-model="searchFolderKey" size="small" placeholder="搜索" :prefix-icon="Search" />
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  width: 33%;
}
</style>
