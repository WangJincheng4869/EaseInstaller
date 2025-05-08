import { CommonToolkit } from '../ipc/common/types';
import { StorageToolkit } from '../ipc/storage/types';

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
  }
}
