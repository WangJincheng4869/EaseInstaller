<script setup lang="ts">
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, FormInstance } from 'element-plus';
import { WorkspaceItem } from 'src/typings/workspace-types';
import { ref, toRaw } from 'vue';
import { formRules } from './workspace-form-dialog';

// 工作空间表单对话框
defineOptions({
  name: 'WorkspaceFormDialog'
});

const dialogVisible = ref(false);
const form = ref<WorkspaceItem>({});
const formRef = ref<FormInstance>();

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
      window.storageToolkit.workspace.insert(toRaw(form.value)).then(() => {
        dialogVisible.value = false;
        formRef.value?.resetFields();
        emit('success');
      });
    }
  });
};

/** 打开面板 */
const open = (): void => {
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
