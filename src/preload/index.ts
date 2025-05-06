import { CommonToolkitRegistrar } from '../ipc/common';

try {
  // 注册通用工具
  CommonToolkitRegistrar.registerIpcRenderer();
} catch (error) {
  console.error(error);
}
