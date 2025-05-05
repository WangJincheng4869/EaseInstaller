<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue';
import { ElButton, ElIcon, ElImage, ElText } from 'element-plus';
import WuKong from '../../../assets/wu-kong.png';

// 文件列表项
defineOptions({
  name: 'FileListItem'
});
</script>

<template>
  <div class="file-list-item flex">
    <ElImage :src="WuKong" fit="cover" class="icon border-rounded">
      <template #error>
        <div class="flex items-center justify-center h-full w-full">
          <ElIcon>
            <Picture />
          </ElIcon>
        </div>
      </template>
    </ElImage>
    <div class="grow pl-3">
      <ElText size="large" class="title" truncated>这是一个标题</ElText>
      <ElText line-clamp="2" class="description">
        这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息，这里可以自定义一些描述信息
      </ElText>
    </div>
    <div class="flex items-center justify-center">
      <ElButton type="primary" size="small" class="ml-3" plain round>安装</ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-list-item {
  padding: 10px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .icon {
    width: 50px;
    height: 88px;
    flex-shrink: 0;
  }

  .title {
    color: var(--el-text-color-primary);
  }
  .description {
    color: var(--el-text-color-secondary);
  }
}

.light {
  .file-list-item {
    border-bottom: 1px solid var(--el-border-color);
  }
}
</style>
