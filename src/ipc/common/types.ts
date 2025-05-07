import { CommonDataToolkit } from '../data/types';
import { CommonFileToolkit } from './file/types';

export interface CommonToolkit {
  /** 文件相关工具 */
  file: CommonFileToolkit;

  /** 数据相关工具 */
  data: CommonDataToolkit;
}
