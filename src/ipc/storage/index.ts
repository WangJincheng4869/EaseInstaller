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
  /**
   * 渲染器 IPC 注册
   */
  static register(): void {
    const storageToolkit: StorageToolkit = {
      workspace: {
        insert: WorkspaceDatasourceIpcRendererRegistrar.registerInsert,
        query: WorkspaceDatasourceIpcRendererRegistrar.registerQuery
      }
    };

    contextBridge.exposeInMainWorld('storageToolkit', storageToolkit);
  }
}
