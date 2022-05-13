<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="短信支付"
    width="540px"
    :height="600"
    :showOkBtn="true"
    cancelText="取消"
    okText="发送短信"
    @ok="handleSendMsg"
    @cancel="handleCancel"
  >
    <div class="container">
      <div>
        <span>患者姓名: {{ sendData.patient_name }}</span>
        <span class="ml-5">{{ sendData.patient_phone }}</span>
      </div>
      <div>
        <span>预约医生: {{ sendData.doctor_name }}</span>
      </div>
      <div>
        <span>预约时间: {{ sendData.dial_time }}</span>
      </div>
      <div>
        <span> <b>【名医在线】</b>{{ sms_template }}</span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, defineEmits } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { SendMsg } from '/@/api/sys/appointments';

  export default defineComponent({
    components: { BasicModal },
    props: {},
    emits: ['cancel', 'success'],
    setup(props, { emit }) {
      const sendData = ref({});
      const sms_template = ref('');
      const order_id = ref();
      const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
        // console.log(data);
        sendData.value = data.order;
        order_id.value = data.order.order_id;
        sms_template.value = data.sms_template;
      });

      const handleCancel = () => {
        emit('cancel');
      };

      async function handleSendMsg() {
        try {
          setModalProps({ confirmLoading: true });
          const data = await SendMsg(order_id.value);
          // TODO custom api
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return {
        sendData,
        sms_template,
        registerModal,
        handleCancel,
        handleSendMsg,
      };
    },
  });
</script>
<style lang="less" scoped>
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    .desc {
      color: #666;
      font-size: 14px;
      padding: 40px 0 0;
    }
  }
</style>
