<template>
  <a-card class="physical">
    <div class="title"> 物流轨迹 </div>
    <div v-if="physicalInfo?.list?.length" class="mt-5">
      <a-steps progress-dot :current="physicalInfo.deliverystatus" direction="vertical">
        <a-step
          v-for="(item, index) in physicalInfo.list"
          :key="index"
          :title="item.status"
          :description="item.time"
        />
      </a-steps>
    </div>
    <div v-else class="mt-5">
      <a-steps progress-dot :current="1" direction="vertical">
        <a-step title="" description="暂无物流信息" />
      </a-steps>
    </div>
  </a-card>
</template>

<script setup>
  defineProps({
    physicalInfo: {
      type: Object,
      default: () => {
        return {list: []}
      }
    }
  })
</script>

<style lang="less" scoped>
  .title {
    font-size: 24px;
    font-weight: 700;
  }
  .physical ::v-deep(.ant-steps-dot .ant-steps-item-content) {
    width: 80%;
  }
</style>
