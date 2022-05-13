<template>
  <div class="container">
    <PageWrapper contentBackground>
      <template #title>
        <div class="custom-title-group">
          <span class="mr-3">患者姓名：{{ patientInfo.patient_name || '无' }}</span>
          <span class="mr-3">{{ patientInfo.patient_sex == 0 ? '女' : '男' }}</span>
          <span class="mr-3">{{ patientInfo.patient_age || '无' }}</span
          >&nbsp;&nbsp;&nbsp;
          <span class="mr-3">联系方式：{{ patientInfo.patient_mobile || '无' }}</span
          >&nbsp;&nbsp;&nbsp;

          <span class="mr-3">医生姓名：{{ doctorInfo.doctor_name || '无' }}</span>
          <span class="mr-3">{{ doctorInfo.ks2name || '无' }}</span
          >&nbsp;&nbsp;&nbsp;
          <span class="mr-3">职称：{{ doctorInfo.doctor_title || '无' }}</span>
          <!-- doctorInfo -->
        </div>
      </template>
      <template #footer>
        <a-tabs :activeKey="activeKey" @change="tabClick">
          <template v-for="item in achieveList" :key="item.component">
            <a-tabPane :tab="item.name" />
          </template>
        </a-tabs>
        <!-- <component :is="activeKey" :id="orderId" @changeTab="tabClick" /> -->
        <CaseItem v-if="activeKey == 'CaseItem'" :id="orderId" @changeTab="tabClick" />
        <OrderDetail v-if="activeKey == 'OrderDetail'" :id="orderId" @changeTab="tabClick" />
        <Consultation v-if="activeKey == 'Consultation'" :id="orderId" @changeTab="tabClick" />
        <Prescription v-if="activeKey == 'Prescription'" :id="orderId" @changeTab="tabClick" />
        <ChatsItem v-if="activeKey == 'ChatsItem'" :id="orderId" @changeTab="tabClick" />
        <TranscribePrescriptionItem
          v-if="activeKey == 'TranscribePrescriptionItem'"
          :id="orderId"
          @changeTab="tabClick"
        />
        <div :class="activeKey != 'TrtcInterrogation' ? 'u-active' : ''">
          <TrtcInterrogation :id="orderSn" :doctorId="doctorInfo.doctor_id" @changeTab="tabClick" />
        </div>
      </template>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { defineComponent, ref, computed } from 'vue';
  import { useClinicalReceptionStore } from '/@/store/modules/clinical-reception';
  import {
    CaseItem,
    OrderDetail,
    Consultation,
    Prescription,
    ChatsItem,
    TranscribePrescriptionItem,
    TrtcInterrogation,
  } from '../../components/';

  export default defineComponent({
    components: {
      PageWrapper,
      CaseItem,
      OrderDetail,
      Consultation,
      Prescription,
      ChatsItem,
      TranscribePrescriptionItem,
      TrtcInterrogation,
    },
    setup() {
      const activeKey = ref('TrtcInterrogation');
      let achieveList = [
        { name: '写病历', key: 1, component: 'CaseItem' },
        { name: '视频接诊', key: 0, component: 'TrtcInterrogation' },
        { name: '处方', key: 2, component: 'TranscribePrescriptionItem' },
        { name: '问诊资料', key: 3, component: 'Consultation' },
        { name: '聊天记录', key: 4, component: 'ChatsItem' },
        { name: '处方记录', key: 5, component: 'Prescription' },
        { name: '订单详情', key: 6, component: 'OrderDetail' },
      ];

      const patientInfo = computed(() => useClinicalReceptionStore().patientStore);
      const doctorInfo = computed(() => useClinicalReceptionStore().doctoreStore);
      const orderId = computed(() => useClinicalReceptionStore().orderId);
      const orderSn = computed(() => useClinicalReceptionStore().orderSn);

      const tabClick = (val) => {
        activeKey.value = val;
        // videoStore.setVideoTabKeyActions(val);
      };

      return {
        patientInfo,
        doctorInfo,
        activeKey,
        achieveList,
        tabClick,
        orderId,
        orderSn,
      };
    },
  });
</script>

<style lang="less">
  .container {
    height: calc(100vh - 100px);
    overflow: scroll;
  }
  .custom-title-group {
    font-size: 16px;
    font-weight: bold;
  }
  .u-active {
    position: fixed;
    left: 10000px;
  }
</style>
