<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="退款信息"
    width="360px"
    :height="300"
    :showOkBtn="true"
    @ok="handleSubmit"
  >
    <a-row>
      <a-col span="5" style="text-align: left"> 原因： </a-col>
      <a-col span="18"> {{ reason }} </a-col>
    </a-row>
    <a-row>
      <a-col span="5" style="text-align: left"> 操作人： </a-col>
      <a-col span="18"> {{ admin_name }} </a-col>
    </a-row>

    <a-row>
      <a-col span="5" style="text-align: left"> 时间： </a-col>
      <a-col span="18"> {{ refund_time }} </a-col>
    </a-row>

    <a-row v-if="order.refund_type == 1">
      <a-col span="6" style="text-align: left"> 全额退款： </a-col>
      <a-col span="18" style="font-weight: 700"> {{ '￥' + order.reason_amount }} </a-col>
    </a-row>

    <a-row v-if="order.refund_type == 2 && order.refund_drug !== '0.00'">
      <a-col span="6" style="text-align: left"> 退药费： </a-col>
      <a-col span="18" style="font-weight: 700"> {{ '￥' + order.refund_drug }} </a-col>
    </a-row>

    <a-row v-if="order.refund_type == 2 && order.refund_express !== '0.00'">
      <a-col span="6" style="text-align: left"> 退快递费： </a-col>
      <a-col span="18" style="font-weight: 700"> {{ '￥' + order.refund_express }} </a-col>
    </a-row>

    <a-row v-if="order.refund_type == 2 && order.refund_process !== '0.00'">
      <a-col span="6" style="text-align: left"> 退加工费： </a-col>
      <a-col span="18" style="font-weight: 700"> {{ '￥' + order.refund_process }} </a-col>
    </a-row>

    <a-row v-if="order.refund_type == 2 && order.refund_consultation !== '0.00'">
      <a-col span="6" style="text-align: left"> 退诊金： </a-col>
      <a-col span="18" style="font-weight: 700"> {{ '￥' + order.refund_consultation }} </a-col>
    </a-row>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const admin_name = ref<string>('');
  const reason = ref<string>('');
  const refund_time = ref<string>('');
  const order = ref({});
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data, '000000000000000000000000000000');
    order.value = data.order;
    reason.value = data.reason;
    admin_name.value = data.admin_name;
    refund_time.value = data.refund_time;
  });

  const emit = defineEmits(['success', 'register']);

  function handleSubmit() {
    closeModal();
  }
</script>
<style lang="less" scoped>
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: a-column;
    .desc {
      a-color: #666;
      font-size: 14px;
      padding: 40px 0 0;
    }
  }
</style>
