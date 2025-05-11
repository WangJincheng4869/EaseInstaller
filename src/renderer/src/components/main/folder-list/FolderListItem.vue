<script setup lang="ts">
import { ElButton, ElText } from 'element-plus';
import Folder from '@renderer/assets/folder.svg';
import { SourceFolder } from 'src/typings/workspace-types';
import { useWorkspace } from '@renderer/store/workspace';
import { storeToRefs } from 'pinia';
import { ref, toRaw } from 'vue';

// 文件夹列表项
defineOptions({
  name: 'FolderListItem'
});

const { item } = defineProps<{
  item: SourceFolder;
}>();
const workspaceStore = useWorkspace();
const { activatedWorkspace } = storeToRefs(workspaceStore);

const installing = ref(false);
const installHandler = (): void => {
  installing.value = true;
  window.sourceToolkit.install(toRaw(activatedWorkspace.value), toRaw(item.name)).then(() => {
    workspaceStore.loadFolders();
    installing.value = false;
  });
};

const uninstallHandler = (): void => {
  window.sourceToolkit.uninstall(toRaw(activatedWorkspace.value), toRaw(item.name)).then(() => {
    workspaceStore.loadFolders();
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
        :loading="installing"
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
