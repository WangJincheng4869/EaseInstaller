<script setup lang="ts">
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
import { ref } from 'vue';
import { WorkspaceItem } from './types';

// 工作空间表单对话框
defineOptions({
  name: 'WorkspaceFormDialog'
});

const dialogVisible = ref(true);

const form = ref<WorkspaceItem>({});
</script>

<template>
  <ElDialog v-model="dialogVisible" title="新增工作空间" draggable>
    <ElForm label-position="top">
      <ElFormItem label="空间名称" prop="name">
        <ElInput v-model="form.name" placeholder="请输入工作空间名称" />
      </ElFormItem>
      <ElFormItem label="工作目录" prop="targetPath">
        <ElInput v-model="form.targetPath" placeholder="请选择工作空间目录" readonly>
          <template #append>
            <ElButton>选择</ElButton>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="安装源目录" prop="sourcePath">
        <ElInput v-model="form.sourcePath" placeholder="请选择安装源目录" readonly>
          <template #append>
            <ElButton>选择</ElButton>
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">取消</ElButton>
      <ElButton type="primary" @click="dialogVisible = false">确定</ElButton>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss"></style>
