<script setup lang="ts">
import Folder from '@renderer/assets/folder.svg';
import { useWorkspace } from '@renderer/store/workspace';
import { ElButton, ElMessage, ElText } from 'element-plus';
import { storeToRefs } from 'pinia';
import { SourceFolder } from 'src/typings/workspace-types';
import { computed, ref, toRaw } from 'vue';

// 文件夹列表项
defineOptions({
  name: 'FolderListItem'
});

const { item } = defineProps<{
  item: SourceFolder;
}>();
const workspaceStore = useWorkspace();
const { activatedWorkspace, loading } = storeToRefs(workspaceStore);

// 当前正则安装的文件夹名
const name = ref();

const isCurrent = computed(() => {
  return item.name === name.value;
});
const installHandler = (): void => {
  loading.value = true;
  name.value = item.name;
  window.sourceToolkit
    .install(toRaw(activatedWorkspace.value), toRaw(item.name))
    .then(() => {
      workspaceStore.loadFolders();
    })
    .catch(err => {
      console.error(err);
      ElMessage.error('安装失败');
    })
    .finally(() => {
      loading.value = false;
      name.value = '';
    });
};

// 当前正则卸载的文件夹名
const uninstallHandler = (): void => {
  name.value = item.name;
  loading.value = true;
  window.sourceToolkit
    .uninstall(toRaw(activatedWorkspace.value), toRaw(item.name))
    .then(() => {
      workspaceStore.loadFolders();
    })
    .catch(err => {
      console.error(err);
      ElMessage.error('卸载失败');
    })
    .finally(() => {
      loading.value = false;
      name.value = '';
    });
};
</script>

<template>
  <div class="folder-list-item flex items-center">
    <div class="icon pr-1 flex items-center">
      <Folder />
    </div>
    <ElText size="large" class="title grow" truncated>{{ item.name }}</ElText>
    <div class="flex items-center justify-center">
      <ElButton
        v-if="item.installed"
        type="danger"
        size="small"
        class="ml-3"
        plain
        round
        :disabled="loading && !isCurrent"
        :loading="loading && isCurrent"
        @click="uninstallHandler"
      >
        卸载
      </ElButton>
      <ElButton
        v-else
        type="primary"
        size="small"
        class="ml-3"
        plain
        round
        :disabled="loading && !isCurrent"
        :loading="loading && isCurrent"
        @click="installHandler"
        >安装</ElButton
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.folder-list-item {
  padding: 10px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .icon {
    flex-shrink: 0;
    font-size: 22px;
    line-height: 1;
  }

  .title {
    color: var(--el-text-color-primary);
    width: 100%;
  }
  .description {
    color: var(--el-text-color-secondary);
  }
}

.light {
  .folder-list-item {
    border-bottom: 1px solid var(--el-border-color);
  }
}
</style>
