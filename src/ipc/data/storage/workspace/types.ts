import { WorkspaceItem } from '../../../../typings/workspace-types';

/** 工作空间数据源结构 */
export interface WorkspaceDatasource {
  /** 当主键 id 的增量 */
  increment: number;
  /** 工作空间列表 */
  workspaces: WorkspaceItem[];
}

export interface CommonDataStorageWorkspaceToolkit {
  /** 读取工作空间数据 */
  query?: () => Promise<WorkspaceDatasource>;
  /**
   * 插入工作空间数据
   * @param workspace 工作空间数据
   * @returns 返回工作空间 id
   */
  insert: (workspace: WorkspaceItem) => Promise<number>;
  /** 更新工作空间数据 */
  update?: (workspace: WorkspaceItem) => Promise<void>;
  /** 删除工作空间数据 */
  delete?: (id: number) => Promise<void>;
}
