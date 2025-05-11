import { CommonToolkitIpcRendererRegistrar } from '../ipc/common';
import { SourceToolkitIpcRendererRegistrar } from '../ipc/source';
import { StorageToolkitIpcRendererRegistrar } from '../ipc/storage';

try {
  // 注册通用工具
  CommonToolkitIpcRendererRegistrar.register();
  // 注册存储工具
  StorageToolkitIpcRendererRegistrar.register();
  // 注册资源管理工具
  SourceToolkitIpcRendererRegistrar.register();
} catch (error) {
  console.error(error);
}
