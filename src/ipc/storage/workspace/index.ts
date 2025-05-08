import { app, ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { ensureFile, readJSON, writeJSON } from 'fs-extra';
import { isArray, isNil, isNumber } from 'lodash-es';
import path from 'path';
import { WorkspaceDatasource } from './types';
import { WorkspaceItem } from '../../../typings/workspace-types';

// 缓存 WorkspaceDatasource 数据
let data: WorkspaceDatasource;

// 定义 insert 工作空间数据 IPC 事件
const COMMON_WORKSPACE_DATASOURCE_INSERT = 'storage:workspace:insert';

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

  // 只有缓存中没有数据时才从文件读取
  if (isNil(data)) {
    // 目录不存在责创建
    await ensureFile(filePath);

    data = (await readJSON(filePath, { throws: false })) ?? {
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
  }
  // id 自增
  const id = ++data.increment;
  data.increment = id;
  // 插入数据
  data.workspaces.push({
    ...workspace,
    id
  });

  console.log('写入数据：', data);

  // 写入文件
  writeJSON(filePath, data, { spaces: 2 });

  // 返回 id
  return id;
};

// 查询全部命名空间方法
const COMMON_WORKSPACE_DATASOURCE_QUERY = 'storage:workspace:query';
/** 查询全部工作空间数据 */
const query = async (): Promise<WorkspaceItem[]> => {
  // 优先从缓存中获取
  if (!isNil(data)) {
    return data.workspaces;
  }

  const filePath = getFilePath();
  // 目录不存在责创建
  await ensureFile(filePath);

  data = (await readJSON(filePath, { throws: false })) ?? {
    increment: 0,
    workspaces: []
  };

  return data.workspaces ?? [];
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
    ipcMain.handle(COMMON_WORKSPACE_DATASOURCE_QUERY, query);
  }
}

/**
 * 工作空间数据源渲染线程 IPC 注册
 */
export class WorkspaceDatasourceIpcRendererRegistrar {
  /**
   * 渲染线程 insert 方法 IPC 注册
   * @param workspace 工作空间数据对象
   * @returns 选择后文件名路径
   */
  static registerInsert(workspace: WorkspaceItem): Promise<number> {
    return ipcRenderer.invoke(COMMON_WORKSPACE_DATASOURCE_INSERT, workspace);
  }
  /**
   * 渲染线程 query 方法 IPC 注册
   * @returns 选择后文件名路径
   */
  static registerQuery(): Promise<WorkspaceItem[]> {
    return ipcRenderer.invoke(COMMON_WORKSPACE_DATASOURCE_QUERY);
  }
}
