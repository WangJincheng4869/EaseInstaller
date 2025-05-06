import { dialog, ipcMain, ipcRenderer } from 'electron';

const COMMON_SELECT_DIRECTORY = 'common:select-directory';

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
 * 目录选择注册机
 */
export class SelectDirectoryRegistrar {
  /**
   * 主线程 IPC 注册
   */
  static registerIpcMain(): void {
    ipcMain.handle(COMMON_SELECT_DIRECTORY, selectDirectory);
  }

  /**
   * 渲染线程 IPC 注册
   * @returns 选择后文件名路径
   */
  static registerIpcRenderer(): Promise<string> {
    return ipcRenderer.invoke(COMMON_SELECT_DIRECTORY);
  }
}
