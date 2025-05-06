export interface CommonFileToolkit {
  /**
   * 选择文件夹
   * @returns 选择后的文件名路径
   */
  selectDirectory: () => Promise<string>;
}
