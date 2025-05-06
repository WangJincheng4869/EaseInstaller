import { CommonToolkit } from '../ipc/common/types';

export {};

declare global {
  interface Window {
    commonToolkit: CommonToolkit;
  }
}
