import { WorkspaceItem } from '../../typings/workspace-types';

export interface SourceToolkit {
  /**
   * 加载工作空间数据
   * @param workspace 工作空间配置数据
   */
  load: (workspace: WorkspaceItem) => Promise<void>;

  /**
   * 安装源文件
   * @param workspace 工作空间配置数据
   * @param folder 要安装的目录名
   * @param uninstallFolder 要卸载的目录名
   */
  install: (workspace: WorkspaceItem, folder: string, uninstallFolder?: string) => Promise<void>;

  /**
   * 卸载源文件
   * @param workspace 工作空间配置数据
   * @param folder 要卸载的目录名
   */
  uninstall: (workspace: WorkspaceItem, folder: string) => Promise<void>;
}
