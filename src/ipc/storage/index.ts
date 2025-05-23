import { contextBridge } from 'electron';
import { StorageToolkit } from './types';
import {
  WorkspaceDatasourceIpcMainRegistrar,
  WorkspaceDatasourceIpcRendererRegistrar
} from './workspace';

/**
 * 通用工具 主线程 IPC 注册机
 */
export class StorageToolkitIpcMainRegistrar {
  /**
   * 主进程 IPC 注册
   */
  static register(): void {
    WorkspaceDatasourceIpcMainRegistrar.register();
  }
}

/**
 * 通用工具 渲染线程 IPC 注册机
 */
export class StorageToolkitIpcRendererRegistrar {
  private static registered = false;
  /**
   * 渲染器 IPC 注册
   */
  static register(): void {
    if (this.registered) {
      return;
    }
    this.registered = true;
    const storageToolkit: StorageToolkit = {
      workspace: {
        insert: WorkspaceDatasourceIpcRendererRegistrar.registerInsert,
        query: WorkspaceDatasourceIpcRendererRegistrar.registerQuery,
        update: WorkspaceDatasourceIpcRendererRegistrar.registerUpdate,
        delete: WorkspaceDatasourceIpcRendererRegistrar.registerDelete
      }
    };

    contextBridge.exposeInMainWorld('storageToolkit', storageToolkit);

    this.registered = true;
  }
}
