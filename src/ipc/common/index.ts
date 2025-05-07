import { contextBridge } from 'electron';
import { CommonToolkit } from './types';
import {
  WorkspaceDatasourceIpcMainRegistrar,
  WorkspaceDatasourceIpcRendererRegistrar
} from '../data/storage/workspace';
import {
  SelectDirectoryIpcMainRegistrar,
  SelectDirectoryIpcRendererRegistrar
} from './file/select-directory';

/**
 * 通用工具 主线程 IPC 注册机
 */
export class CommonToolkitIpcMainRegistrar {
  /**
   * 主进程 IPC 注册
   */
  static register(): void {
    SelectDirectoryIpcMainRegistrar.register();
    WorkspaceDatasourceIpcMainRegistrar.register();
  }
}

/**
 * 通用工具 渲染线程 IPC 注册机
 */
export class CommonToolkitIpcRendererRegistrar {
  /**
   * 渲染器 IPC 注册
   */
  static register(): void {
    const commonToolkit: CommonToolkit = {
      file: {
        selectDirectory: SelectDirectoryIpcRendererRegistrar.register
      },
      // TODO 这里应该从通用中拆出数据工具
      data: {
        storage: {
          workspace: {
            insert: WorkspaceDatasourceIpcRendererRegistrar.registerInsert
          }
        }
      }
    };

    contextBridge.exposeInMainWorld('commonToolkit', commonToolkit);
  }
}
