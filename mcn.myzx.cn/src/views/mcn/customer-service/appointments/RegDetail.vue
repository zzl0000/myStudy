<template>
  <PageWrapper title="挂号详情">
    <template #headerContent>
      <Space :size="40">
        <span>姓名：Luck</span>
        <span>性别：女</span>
        <span>年龄：24岁</span>
        <span>联系方式：13800000000</span>
      </Space>
    </template>
    <Card>

    </Card>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { Space,ard } from 'ant-design-vue';
  import { ref } from 'vue';
  const activeKey = ref('1');
</script>
