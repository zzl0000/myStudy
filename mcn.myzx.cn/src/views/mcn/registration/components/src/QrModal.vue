<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="500px"
    :height="600"
    :showOkBtn="false"
    @ok="handleSubmit"
  >
    <div class="image-box">
      <p class="desc">{{ getDesc }}</p>
      <Image :width="200" :height="200" :src="src"></Image>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Image } from 'ant-design-vue';

  const emit = defineEmits(['success', 'register']);

  const src = ref('');
  const doctorName = ref('');

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    // console.log(data);
    src.value = `data:image/png;base64,${data.qrCode}`;
    doctorName.value = data.doctor_name;
  });

  const getTitle = computed(() => '您可将一下二维码截图发送给患者，邀请患者视频问诊');
  const getDesc = computed(() => `${doctorName.value}医生的医助邀请您开始视频问诊`);

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });
      // TODO custom api
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
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
