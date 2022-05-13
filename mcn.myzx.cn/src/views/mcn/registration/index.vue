<template>
  <PageWrapper contentBackground>
    <template #title>
      <div class="custom-title-group">
        <span>姓名：{{ query.patient_name }}</span>
        <span>性别：{{ query.patient_sex }}</span>
        <span>年龄：{{ query.patient_age }}</span>
        <span>联系方式：{{ query.patient_mobile }}</span>
      </div>
    </template>
    <template #footer>
      <Tabs :activeKey="activeKey" @change="tabClick">
        <template v-for="item in achieveList" :key="item.component">
          <TabPane :tab="item.name" />
        </template>
      </Tabs>
      <component :is="activeKey" @changeTab="tabClick" />
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, reactive, provide } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useRouter } from 'vue-router';
  import { Divider, Card, Empty, Descriptions, Steps, Tabs } from 'ant-design-vue';
  import {
    CaseItem,
    OrderDetail,
    Consultation,
    Prescription,
    ChatsItem,
    TranscribePrescriptionItem,
  } from './components';

  import { useVideoStore } from '/@/store/modules/video';

  //import { refundTimeTableSchema, refundTimeTableData } from './data';
  export default defineComponent({
    name: 'Registration',
    components: {
      PageWrapper,
      [Divider.name]: Divider,
      [Card.name]: Card,
      Empty,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      Tabs,
      TabPane: Tabs.TabPane,
      ref,
      unref,
      CaseItem, // 病历收集
      OrderDetail, // 订单详情
      Consultation, // 问诊资料
      Prescription,
      ChatsItem,
      TranscribePrescriptionItem, // 抄录处方
    },
    props: ['treatmentData'],
    setup(props) {
      const { currentRoute } = useRouter();
      const videoStore = useVideoStore();
      const activeKey = ref('TrtcInterrogation');
      var { query } = unref(currentRoute);
      console.log(query);
      if (props?.treatmentData?.id !== undefined) {
        let patientSex = props.treatmentData.patient_sex;
        if (patientSex !== '男' && patientSex !== '女') {
          patientSex = parseInt(patientSex) === 1 ? '男' : '女';
        }
        query = unref(props.treatmentData);
        query.patient_sex = patientSex;
        // console.log(query);
        activeKey.value = videoStore.videoTabKey || 'TrtcInterrogation';
        provide('record', { query: { ...query }, action: 'videoReception' });
      }

      let achieveList = [
        // { name: '视频接诊', key: 0, component: 'TrtcInterrogation' },
        { name: '病例收集', key: 1, component: 'CaseItem' },
        { name: '抄录处方', key: 2, component: 'TranscribePrescriptionItem' },
        { name: '问诊资料', key: 3, component: 'Consultation' },
        { name: '聊天记录', key: 4, component: 'ChatsItem' },
        { name: '处方记录', key: 5, component: 'Prescription' },
        { name: '订单详情', key: 6, component: 'OrderDetail' },
      ];

      if (query.title == '预约挂号') {
        activeKey.value = 'CaseItem';
        achieveList = [
          { name: '病例收集', key: 1, component: 'CaseItem' },
          { name: '问诊资料', key: 3, component: 'Consultation' },
          { name: '聊天记录', key: 4, component: 'ChatsItem' },
          { name: '处方记录', key: 5, component: 'Prescription' },
          { name: '订单详情', key: 6, component: 'OrderDetail' },
        ];
      } else if (query.title == '挂号订单') {
        // const activeKey = ref('TrtcInterrogation');
        activeKey.value = 'Consultation';
        achieveList = [
          { name: '问诊资料', key: 3, component: 'Consultation' },
          { name: '聊天记录', key: 4, component: 'ChatsItem' },
          { name: '处方记录', key: 5, component: 'Prescription' },
          { name: '订单详情', key: 6, component: 'OrderDetail' },
        ];
      }

      console.log(query.title);

      const pps = reactive({
        data: {
          ...query,
        },
      });
      provide('data', pps.data);

      const tabClick = (val) => {
        activeKey.value = val;
        videoStore.setVideoTabKeyActions(val);
      };

      return {
        tabClick,
        activeKey,
        achieveList,
        query,
      };
    },
  });
</script>

<style lang="less" scoped>
  .custom-title-group {
    span {
      font-weight: 500;
      padding-right: 25px;
      font-size: 18px;
    }
  }
</style>
