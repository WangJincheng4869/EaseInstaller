import { CommonToolkitIpcRendererRegistrar } from '../ipc/common';
import { StorageToolkitIpcRendererRegistrar } from '../ipc/storage';

try {
  // 注册通用工具
  CommonToolkitIpcRendererRegistrar.register();
  // 注册存储工具
  StorageToolkitIpcRendererRegistrar.register();
} catch (error) {
  console.error(error);
}
