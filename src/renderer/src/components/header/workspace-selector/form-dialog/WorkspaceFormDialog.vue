<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  FormInstance,
  FormRules
} from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { WorkspaceItem } from 'src/typings/workspace-types';
import { ref, toRaw } from 'vue';

// 工作空间表单对话框
defineOptions({
  name: 'WorkspaceFormDialog'
});

const dialogVisible = ref(false);
const form = ref<WorkspaceItem>({});
const formRef = ref<FormInstance>();
// 当前是否为修改操作
const isEdit = ref(false);

const formRules: FormRules<WorkspaceItem> = {
  name: [
    { required: true, message: '请输入工作空间名称', trigger: 'change' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
  ],
  targetPath: [
    { required: true, message: '请选择工作空间路径', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value === form.value.sourcePath) {
          callback(new Error('工作目录不能与源目录相同'));
        } else {
          // 源目录存在时，校验目标目录是否为源目录的子目录
          if (form.value.sourcePath) {
            formRef.value?.validateField('sourcePath');
          }
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  sourcePath: [
    { required: true, message: '请选择工作空间路径', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value === form.value.targetPath) {
          callback(new Error('工作目录不能与源目录相同'));
        } else {
          // 如果目标目录已经填写，则需要校验目标目录是否是源目录的子目录
          if (form.value.targetPath) {
            formRef.value?.validateField('targetPath');
          }
          callback();
        }
      },
      trigger: 'change'
    }
  ]
};

const emit = defineEmits<{
  success: [];
}>();

/** 选择工作空间目录 */
const selectTargetPathHandler = (): void => {
  window.commonToolkit.file.selectDirectory().then(path => {
    form.value.targetPath = path;
  });
};

/** 选择安装源目录 */
const selectSourcePathHandler = (): void => {
  window.commonToolkit.file.selectDirectory().then(path => {
    form.value.sourcePath = path;
  });
};

/** 提交表单 */
const submitHandler = async (formEl?: FormInstance): Promise<void> => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (isEdit.value) {
        window.storageToolkit.workspace.update(toRaw(form.value)).then(() => {
          dialogVisible.value = false;
          isEdit.value = false;
          form.value = {};
          ElMessage.success('修改成功');
          emit('success');
        });
        return;
      }
      window.storageToolkit.workspace.insert(toRaw(form.value)).then(() => {
        dialogVisible.value = false;
        isEdit.value = false;
        formRef.value?.resetFields();
        ElMessage.success('添加成功');
        emit('success');
      });
    }
  });
};
/** 打开面板 */
const open = (workspace?: WorkspaceItem): void => {
  if (workspace) {
    isEdit.value = true;
    form.value = cloneDeep(workspace);
  } else {
    isEdit.value = false;
    form.value = {};
  }
  formRef.value?.clearValidate();
  dialogVisible.value = true;
};

defineExpose({
  open
});
</script>

<template>
  <ElDialog v-model="dialogVisible" title="新增工作空间" draggable>
    <ElForm ref="formRef" :model="form" :rules="formRules" label-position="top">
      <ElFormItem label="空间名称" prop="name" :required="true">
        <ElInput v-model="form.name" placeholder="请输入工作空间名称" />
      </ElFormItem>
      <ElFormItem label="工作目录" prop="targetPath">
        <ElInput v-model="form.targetPath" placeholder="请选择工作空间目录" readonly>
          <template #append>
            <ElButton @click="selectTargetPathHandler">选择</ElButton>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="安装源目录" prop="sourcePath">
        <ElInput v-model="form.sourcePath" placeholder="请选择安装源目录" readonly>
          <template #append>
            <ElButton @click="selectSourcePathHandler">选择</ElButton>
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="submitHandler(formRef)">确定</ElButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss"></style>
