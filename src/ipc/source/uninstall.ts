import { IpcMainInvokeEvent } from 'electron';
import { existsSync, readdirSync, rmdirSync, rmSync, statSync } from 'fs-extra';
import path from 'path';
import { WorkspaceItem } from '../../typings/workspace-types';
import { INSTALLED_FILE_NAME } from './consts';

/** 安装资源 IPC 事件名称 */
export const IPC_CHANNEL_SOURCE_UNINSTALL = 'source:uninstall';

// todo 卸载存在 bug 需要修复，无法正确删除文件
export const uninstall = async (
  _event: IpcMainInvokeEvent,
  workspace: WorkspaceItem,
  folder: string
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

  // 新增逻辑：遍历 sourcePath 并删除与 targetPath 中同名的文件
  const sourceFiles = walkSync(sourcePath);
  for (const sourceFilePath of sourceFiles) {
    const relativePath = path.relative(sourcePath, sourceFilePath);
    const targetFilePath = path.join(workspace.targetPath, relativePath);
    if (existsSync(targetFilePath)) {
      // 删除 sourcePath 中的文件
      rmSync(targetFilePath);
      // 清理空目录
      let currentDir = path.dirname(targetFilePath);
      while (true) {
        try {
          rmdirSync(currentDir);
          currentDir = path.dirname(currentDir);
          if (currentDir === sourcePath) break; // 停止在 sourcePath 根目录
        } catch {
          break;
        }
      }
    }
  }

  // 删除已安装的标识
  rmSync(path.join(sourcePath, INSTALLED_FILE_NAME));
};

// 同步递归遍历目录，返回所有文件路径
function walkSync(dir: string): string[] {
  let results: string[] = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walkSync(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}
