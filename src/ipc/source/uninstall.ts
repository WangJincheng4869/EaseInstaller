import { IpcMainInvokeEvent } from 'electron';
import { existsSync, readdirSync, rmdirSync, rmSync } from 'fs-extra';
import path from 'path';
import { WorkspaceItem } from '../../typings/workspace-types';
import { INSTALLED_FILE_NAME } from './consts';

/** 安装资源 IPC 事件名称 */
export const IPC_CHANNEL_SOURCE_UNINSTALL = 'source:uninstall';
/** 卸载进度 */
export const IPC_CHANNEL_SOURCE_UNINSTALL_PROGRESS = 'source:uninstall:progress';

/**
 * 卸载资源
 * @param _event IPC 事件
 * @param workspace 当前工作空间
 * @param folder 要卸载的文件夹名称
 */
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

  // 防止 targetPath 是 sourcePath 的父目录
  const normalizedSource = path.resolve(sourcePath);
  const normalizedTarget = path.resolve(workspace.targetPath);
  if (normalizedTarget.startsWith(normalizedSource)) {
    throw new Error('目标目录不能是源目录的子目录');
  }

  // 新增逻辑：遍历 sourcePath 并删除与 targetPath 中同名的文件
  const { files, paths } = walkSync(sourcePath);

  for (const sourceFilePath of files) {
    const relativePath = path.relative(sourcePath, sourceFilePath);
    const targetFilePath = path.join(workspace.targetPath, relativePath);
    if (existsSync(targetFilePath)) {
      // 删除 targetFilePath 中的文件
      rmSync(targetFilePath);
    }
  }

  // 清理空目录
  for (const dir of paths) {
    const relativePath = path.relative(sourcePath, dir);
    const targetDir = path.join(workspace.targetPath, relativePath);
    const files = readdirSync(targetDir);
    // 如果目录中没有了内容，则删除当前目录
    if (files.length === 0) {
      rmdirSync(targetDir);
    }
  }

  // 删除已安装的标识
  rmSync(path.join(sourcePath, INSTALLED_FILE_NAME));
};

/**
 * 同步递归遍历目录，返回所有文件路径
 * @param dir 目录
 * @returns 当前目录中的全部文件的完整路径
 */
function walkSync(dir: string): { files: string[]; paths: string[] } {
  let files: string[] = [];
  let paths: string[] = [];
  const list = readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // 如果是文件夹则保存起来
      paths.push(fullPath);
      const temp = walkSync(fullPath);
      files = files.concat(temp.files);
      paths = paths.concat(temp.paths);
    } else {
      files.push(fullPath);
    }
  }

  // 层级最深的在前
  paths = paths.sort((a, b) => b.split('\\').length - a.split('\\').length);
  return { files, paths };
}
