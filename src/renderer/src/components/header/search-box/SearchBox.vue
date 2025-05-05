<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ElInput } from 'element-plus';

// 搜索框组件
defineOptions({
  name: 'SearchBox'
});
</script>

<template>
  <div class="search-box">
    <ElInput size="small" placeholder="搜索" :prefix-icon="Search" />
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  width: 33%;
}
</style>
