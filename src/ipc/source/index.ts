import { contextBridge, ipcMain, ipcRenderer } from 'electron';
import { WorkspaceItem } from '../../typings/workspace-types';
import { install, IPC_CHANNEL_SOURCE_INSTALL } from './install';
import { IPC_CHANNEL_SOURCE_LOAD, load } from './load-folders';
import { SourceToolkit } from './types';
import { IPC_CHANNEL_SOURCE_UNINSTALL, uninstall } from './uninstall';

/**
 * 安装源管理工具，用于读取，安装、卸载等操作。 主线程 IPC 注册机
 */
export class SourceToolkitIpcMainRegistrar {
  /**
   * 主进程 IPC 注册
   */
  static register(): void {
    ipcMain.handle(IPC_CHANNEL_SOURCE_LOAD, load);
    ipcMain.handle(IPC_CHANNEL_SOURCE_INSTALL, install);
    ipcMain.handle(IPC_CHANNEL_SOURCE_UNINSTALL, uninstall);
  }
}

/**
 * 安装源管理工具，用于读取，安装、卸载等操作。 渲染线程 IPC 注册机
 */
export class SourceToolkitIpcRendererRegistrar {
  private static registered = false;
  /**
   * 渲染器 IPC 注册
   */
  static register(): void {
    if (this.registered) {
      return;
    }
    const sourceToolkit: SourceToolkit = {
      load: (workspace: WorkspaceItem) => {
        return ipcRenderer.invoke(IPC_CHANNEL_SOURCE_LOAD, workspace);
      },
      install: (workspace: WorkspaceItem, folder: string) => {
        return ipcRenderer.invoke(IPC_CHANNEL_SOURCE_INSTALL, workspace, folder);
      },
      uninstall: (workspace: WorkspaceItem, folder: string) => {
        return ipcRenderer.invoke(IPC_CHANNEL_SOURCE_UNINSTALL, workspace, folder);
      }
    };

    contextBridge.exposeInMainWorld('sourceToolkit', sourceToolkit);

    this.registered = true;
  }
}
