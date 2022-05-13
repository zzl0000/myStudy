<template>
  <PageWrapper>
    <a-row class="page">
      <a-col style="width: 250px">
        <!-- 患者模块 -->
        <PatientModel />
      </a-col>
      <a-col style="width: calc(100% - 250px)">
        <!-- 诊室模块  -->
        <ConsultingRoomModel v-if="isLoad" />
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { PatientModel, ConsultingRoomModel } from './model';
  import { PageWrapper } from '/@/components/Page';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';

  export default defineComponent({
    components: { PageWrapper, PatientModel, ConsultingRoomModel },
    setup() {
      // 患者基础数据   动态更新的
      const patinetBaseData = computed(() => {});
      //诊室基础数据   动态更新的
      const ConsultingRoomBaseData = computed(() => {});

      // 初始化接诊管理模块
      const init = () => {};

      const isLoad = computed(() => useClinicalReceptionStore().isLoad);

      // 患者模块需要处理更新的逻辑
      // 诊室模块模块需要处理更新的逻辑

      return {
        init,
        patinetBaseData,
        ConsultingRoomBaseData,
        isLoad,
      };
    },
  });
</script>

<style lang="less">
  .page {
    background: #fff;
  }
</style>
