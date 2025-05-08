import { FormRules } from 'element-plus';
import { WorkspaceItem } from 'src/typings/workspace-types';

export const formRules: FormRules<WorkspaceItem> = {
  name: [
    { required: true, message: '请输入工作空间名称', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  targetPath: [{ required: true, message: '请选择工作空间路径', trigger: 'blur' }],
  sourcePath: [{ required: true, message: '请选择工作空间路径', trigger: 'blur' }]
};
