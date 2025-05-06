import { contextBridge } from 'electron';
import { SelectDirectoryRegistrar } from './file/select-directory';
import { CommonToolkit } from './types';

/**
 * 通用工具注册机
 */
export class CommonToolkitRegistrar {
  /**
   * 主进程 IPC 注册
   */
  static registerIpcMain(): void {
    SelectDirectoryRegistrar.registerIpcMain();
  }

  /**
   * 渲染器 IPC 注册
   */
  static registerIpcRenderer(): void {
    const commonToolkit: CommonToolkit = {
      file: {
        selectDirectory: SelectDirectoryRegistrar.registerIpcRenderer
      }
    };

    contextBridge.exposeInMainWorld('commonToolkit', commonToolkit);
  }
}
