import { app, ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { ensureFile, readJSON, writeJSON } from 'fs-extra';
import { isArray, isNumber } from 'lodash-es';
import path from 'path';
import { WorkspaceItem } from '../../../../typings/workspace-types';
import { WorkspaceDatasource } from './types';

// 定义 insert 工作空间数据 IPC 事件
const COMMON_WORKSPACE_DATASOURCE_INSERT = 'common:data:workspace:insert';

/** 获取文件路径 */
const getFilePath = (): string => {
  const userDataPath = app.getPath('userData');
  // 定义文件路径
  return path.join(userDataPath, 'data/storage/workspace.json');
};

/**
 * 插入工作空间数据
 * @param _event 主线程 IPC 事件
 * @param workspace 工作空间数据对象
 * @returns 新增数据的 id
 */
const insert = async (_event: IpcMainInvokeEvent, workspace: WorkspaceItem): Promise<number> => {
  const filePath = getFilePath();
  // 目录不存在责创建
  await ensureFile(filePath);

  const data: WorkspaceDatasource = (await readJSON(filePath, { throws: false })) ?? {
    increment: 0,
    workspaces: []
  };

  // 初始化数据
  if (!isNumber(data.increment)) {
    data.increment = 0;
  }
  if (!isArray(data.workspaces)) {
    data.workspaces = [];
  }

  // id 自增
  const id = data.increment++;
  data.increment = id;
  // 插入数据
  data.workspaces.push({
    ...workspace,
    id
  });

  // 写入文件
  writeJSON(filePath, data, { spaces: 2 });

  // 返回 id
  return id;
};

/**
 * 工作空间数据源主线程 IPC 注册
 */
export class WorkspaceDatasourceIpcMainRegistrar {
  /**
   * 主线程 IPC 注册
   */
  static register(): void {
    ipcMain.handle(COMMON_WORKSPACE_DATASOURCE_INSERT, insert);
  }
}

/**
 * 工作空间数据源渲染线程 IPC 注册
 */
export class WorkspaceDatasourceIpcRendererRegistrar {
  /**
   * 渲染线程 insert 方法 IPC 注册
   * @returns 选择后文件名路径
   */
  static registerInsert(): Promise<number> {
    return ipcRenderer.invoke(COMMON_WORKSPACE_DATASOURCE_INSERT);
  }
}
