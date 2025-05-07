import { dialog, ipcMain, ipcRenderer } from 'electron';

const COMMON_SELECT_DIRECTORY = 'common:file:select-directory';

const selectDirectory = (): Promise<string> => {
  return dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then(result => {
      return result.filePaths[0];
    });
};

/**
 * 目录选择 主线程 注册机
 */
export class SelectDirectoryIpcMainRegistrar {
  /**
   * 主线程 IPC 注册
   */
  static register(): void {
    ipcMain.handle(COMMON_SELECT_DIRECTORY, selectDirectory);
  }
}
/**
 * 目录选择 渲染线程 注册机
 */
export class SelectDirectoryIpcRendererRegistrar {
  /**
   * 渲染线程 IPC 注册
   * @returns 选择后文件名路径
   */
  static register(): Promise<string> {
    return ipcRenderer.invoke(COMMON_SELECT_DIRECTORY);
  }
}
