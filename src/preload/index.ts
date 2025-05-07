import { CommonToolkitIpcRendererRegistrar } from '../ipc/common';

try {
  // 注册通用工具
  CommonToolkitIpcRendererRegistrar.register();
} catch (error) {
  console.error(error);
}
