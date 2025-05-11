import path from 'path';
import { WorkspaceItem } from '../../typings/workspace-types';
import { copy, createFile, existsSync } from 'fs-extra';
import { INSTALLED_FILE_NAME } from './consts';
import { IpcMainInvokeEvent } from 'electron';
import { uninstall } from './uninstall';

/** 安装资源 IPC 事件名称 */
export const IPC_CHANNEL_SOURCE_INSTALL = 'source:install';

/**
 * 安装源文件
 * @param workspace 工作空间配置数据
 * @param folder 要安装的目录名
 * @param uninstallFolder 要卸载的目录名
 */
export const install = async (
  _event: IpcMainInvokeEvent,
  workspace: WorkspaceItem,
  folder: string,
  uninstallFolder?: string
): Promise<void> => {
  if (!workspace.sourcePath) {
    throw new Error('工作空间源目录不存在');
  }
  if (!workspace.targetPath) {
    throw new Error('工作空间目标目录不存在');
  }
  if (!folder) {
    throw new Error('资源名称不存在');
  }
  const sourcePath = path.join(workspace.sourcePath, folder);
  if (!existsSync(sourcePath)) {
    throw new Error(`资源不存在：${sourcePath}`);
  }
  if (!existsSync(workspace.targetPath)) {
    throw new Error(`目标目录不存在：${workspace.targetPath}`);
  }

  if (uninstallFolder) {
    // todo 卸载存在 bug 需要修复，无法正确删除文件
    await uninstall(_event, workspace, folder);
  }

  await copy(sourcePath, workspace.targetPath, { overwrite: true });

  await createFile(path.join(sourcePath, INSTALLED_FILE_NAME));
};
