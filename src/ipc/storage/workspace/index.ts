import { app, ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import { ensureFile, readJSON, writeJSON } from 'fs-extra';
import { cloneDeep, isArray, isNil, isNumber } from 'lodash-es';
import path from 'path';
import { WorkspaceDatasource } from './types';
import { WorkspaceItem } from '../../../typings/workspace-types';

// 缓存 WorkspaceDatasource 数据
let data: WorkspaceDatasource;
// 缓存文件路径
let filePath: string;

// 定义 insert 工作空间数据 IPC 事件
const COMMON_WORKSPACE_DATASOURCE_INSERT = 'storage:workspace:insert';

/** 获取文件路径 */
const getFilePath = (): string => {
  if (filePath) {
    return filePath;
  }
  const userDataPath = app.getPath('userData');
  // 定义文件路径
  filePath = path.join(userDataPath, 'data/storage/workspace.json');
  return filePath;
};

/**
 * 将数据提交到文件
 * @param data 数据源
 */
const commit = async (data: WorkspaceDatasource): Promise<void> => {
  // 写入文件
  await writeJSON(getFilePath(), data, { spaces: 2 });
};

/**
 * 加载缓存
 * @returns 返回文件路径
 */
const loadCache = async (): Promise<string> => {
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
  return filePath;
};

/**
 * 插入工作空间数据
 * @param _event 主线程 IPC 事件
 * @param workspace 工作空间数据对象
 * @returns 新增数据的 id
 */
const insert = async (_event: IpcMainInvokeEvent, workspace: WorkspaceItem): Promise<number> => {
  // 优先从缓存中获取
  await loadCache();

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
  commit(data);

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

// 修改命名空间方法
const COMMON_WORKSPACE_DATASOURCE_UPDATE = 'storage:workspace:update';

/**
 * 修改工作空间数据
 * @param _event 主线程 IPC 事件
 * @param workspace 工作空间数据对象
 */
const update = async (_event: IpcMainInvokeEvent, workspace: WorkspaceItem): Promise<void> => {
  await loadCache();
  // 将数据缓存
  const cacheData = cloneDeep(data);
  const item = cacheData.workspaces.findLast(item => item.id === workspace.id);
  if (item) {
    item.name = workspace.name;
    item.sourcePath = workspace.sourcePath;
    item.targetPath = workspace.targetPath;
  }

  // 写入文件
  commit(cacheData);
  // 提交到文件之后再修改本地缓存
  data = cacheData;
};

// 删除命名空间方法
const COMMON_WORKSPACE_DATASOURCE_DELETE = 'storage:workspace:delete';

/**
 * 删除工作空间数据
 * @param _event 主线程 IPC 事件
 * @param id 工作空间 id
 */
const deleteWorkspace = async (_event: IpcMainInvokeEvent, id: number): Promise<void> => {
  await loadCache();
  const cacheData = data.workspaces.filter(item => item.id !== id);
  commit(data);
  data.workspaces = cacheData;
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
    ipcMain.handle(COMMON_WORKSPACE_DATASOURCE_UPDATE, update);
    ipcMain.handle(COMMON_WORKSPACE_DATASOURCE_DELETE, deleteWorkspace);
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

  /**
   * 渲染线程 update 方法 IPC 注册
   * @param workspace 工作空间数据对象
   * @returns 修改是否成功
   */
  static registerUpdate(workspace: WorkspaceItem): Promise<void> {
    return ipcRenderer.invoke(COMMON_WORKSPACE_DATASOURCE_UPDATE, workspace);
  }

  /**
   * 渲染线程 delete 方法 IPC 注册
   * @param id 工作空间 id
   * @returns 修改是否成功
   */
  static registerDelete(id: number): Promise<void> {
    return ipcRenderer.invoke(COMMON_WORKSPACE_DATASOURCE_DELETE, id);
  }
}
