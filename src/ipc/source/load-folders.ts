import { IpcMainInvokeEvent } from 'electron';
import { SourceFolder, WorkspaceItem } from '../../typings/workspace-types';
import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { INSTALLED_FILE_NAME } from './consts';

/** 加载工作空间数据 IPC 事件名称 */
export const IPC_CHANNEL_SOURCE_LOAD = 'source:load';

/**
 * 加载工作空间数据
 * @param workspace 工作空间配置数据
 */
export const load = async (
  _event: IpcMainInvokeEvent,
  workspace: WorkspaceItem
): Promise<SourceFolder[]> => {
  if (!workspace.sourcePath) {
    return [];
  }
  const result: SourceFolder[] = [];
  // 读取目录内容
  const folders = await readdirSync(workspace.sourcePath, {
    encoding: 'utf-8',
    withFileTypes: true
  });

  folders
    .filter(folder => folder.isDirectory())
    .forEach(folder => {
      result.push({
        name: folder.name,
        installed: existsSync(path.join(folder.parentPath, folder.name, INSTALLED_FILE_NAME))
      });
    });

  return result;
};
