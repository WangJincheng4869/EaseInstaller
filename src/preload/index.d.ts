import { CommonToolkit } from '../ipc/common/types';
import { StorageToolkit } from '../ipc/storage/types';
import { SourceToolkit } from '../ipc/source/types';

export {};

declare global {
  interface Window {
    /**
     * 通用工具库
     */
    commonToolkit: CommonToolkit;
    /**
     * 存储工具库
     */
    storageToolkit: StorageToolkit;
    /**
     * 资源管理工具库
     */
    sourceToolkit: SourceToolkit;
  }
}
