import { ACTIVATED_WORKSPACE_ID_KEY } from '@renderer/constant/local-storage-key-consts';
import { useStorage } from '@vueuse/core';
import { isNil } from 'lodash';
import { defineStore } from 'pinia';
import { SourceFolder, WorkspaceItem } from 'src/typings/workspace-types';
import { computed, ref, toRaw, watch } from 'vue';

export const useWorkspace = defineStore(ACTIVATED_WORKSPACE_ID_KEY, () => {
  // 当活动的工作空间 ID
  const activatedWorkspaceId = useStorage<number>(ACTIVATED_WORKSPACE_ID_KEY, null);
  // 工作空间列表
  const workspaces = ref<WorkspaceItem[]>([]);
  // 当活动的工作空间
  const activatedWorkspace = computed<WorkspaceItem>(() => {
    return (
      workspaces.value.findLast(workspace => workspace.id === activatedWorkspaceId.value) ?? {}
    );
  });

  // 检索文件夹搜索关键字
  const searchFolderKey = ref('');
  // 当前工作空间中的文件夹
  const folderStore = ref<SourceFolder[]>([]);
  const folders = computed<SourceFolder[]>({
    set: value => {
      folderStore.value = value;
    },
    get: () => {
      if (searchFolderKey.value) {
        return folderStore.value.filter(folder => folder.name.includes(searchFolderKey.value));
      }
      return folderStore.value;
    }
  });

  // 监听当前激活的工作空间 id
  watch(activatedWorkspaceId, id => {
    if (isNil(id)) {
      folders.value = [];
    }
  });

  const loadFolders = (): void => {
    window.sourceToolkit.load(toRaw(activatedWorkspace.value)).then(result => {
      folders.value = result ?? [];
    });
  };

  // 当前工作空间是否正在加载中
  const loading = ref(false);

  return {
    /** 工作空间列表 */
    workspaces,
    /** 当活动的工作空间 ID */
    activatedWorkspaceId,
    /** 当活动的工作空间 */
    activatedWorkspace,
    /** 当前工作空间中的文件夹 */
    folders,
    /** 检索文件夹搜索关键字 */
    searchFolderKey,
    /** 加载文件夹列表 */
    loadFolders,
    /** 是否在加载中 */
    loading
  };
});
