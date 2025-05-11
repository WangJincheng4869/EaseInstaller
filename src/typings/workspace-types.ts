/** 工作空间数据对象，用于存储工作空间信息 */
export interface WorkspaceItem {
  /** 唯一 id  */
  id?: number;
  /** 显示名称 */
  name?: string;
  /** 数据源目录，也就是当前工作空间的模板文件存储目录。这个目录下会有多个文件夹，每个文件夹都是一个模板 */
  sourcePath?: string;
  /** 目标目录，会蒋源目录中的文件拷贝到这个目录下，或者根据源目录的文件删除这个目录中的内容 */
  targetPath?: string;
}

export interface SourceFolder {
  /** 文件夹名称 */
  name: string;
  /** 当前是否安装 */
  installed: boolean;
}
