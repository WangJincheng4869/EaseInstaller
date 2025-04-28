<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
import ThemeButton from '@renderer/components/theme/ThemeButton.vue';
import { ElButton, ElIcon } from 'element-plus';

// 工具栏按钮组
defineOptions({
  name: 'ButtonGroup'
});
</script>

<template>
  <div class="flex items-center justify-end button-group">
    <ThemeButton />
    <ElButton :text="true" size="small" class="theme-button">
      <ElIcon><Setting /></ElIcon>
    </ElButton>
  </div>
</template>

<style scoped lang="scss">
.theme-button {
  font-size: 14px;
}
</style>
