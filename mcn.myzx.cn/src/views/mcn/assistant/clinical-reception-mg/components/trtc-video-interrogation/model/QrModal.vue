<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="患者视频邀请码"
    width="500px"
    :height="600"
    :showOkBtn="false"
    @ok="handleSubmit"
  >
    <div class="title-group">
      我们已给{{ patientName }}患者发送了视频接诊通知，如果患者还没有进入诊室
      <br />
      您可将以下二维码截图发送给患者，邀请患者视频问诊
    </div>
    <div class="image-box">
      <p class="desc">{{ getDesc }}</p>
      <a-image :width="200" :height="200" :src="src"></a-image>
    </div>
    <div class="box" style="font-size: 20px; margin-top: 30px"
      >您也可直接复制进入诊室链接发送给患者：</div
    >

    <p id="text" class="text">{{ url }}</p>
    <textarea id="input" class="id"></textarea>
    <div class="box" style="color: #0e31d7; cursor: pointer" @click="copyText">复制链接</div>
  </BasicModal>
</template>
<script lang="ts">
  import { ref, computed, unref, defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  // import { Image } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicModal },
    emits: ['success', 'register'],
    setup({ emit }) {
      const src = ref('');
      const doctorName = ref('');
      const patientName = ref('');
      let newurl = ref('');
      let url = ref('');
      const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
        console.log(data);
        url.value = '';
        src.value = `data:image/png;base64,${data.qrCode}`;
        doctorName.value = data.doctor_name;
        patientName.value = data.patient_name;
        url.value =
          'https://cloud1-5g80ysht3e049128-1306117587.tcloudbaseapp.com/h5/jump-mp.html?sign=047e33b549a034725a9760fd3f5deebd&t=1644572774&mpUrl=';
        newurl.value = encodeURIComponent(
          `/pages/inquiry/inquiry/inquiry?order_sn=${data.order_sn}`
        );
        // url.value = data.a;
        url.value = url.value + newurl.value;
      });
      const { createMessage } = useMessage();
      const { error, info } = createMessage;
      const getDesc = computed(() => `${doctorName.value}医生的医助邀请您开始视频问诊`);
      function copyText() {
        const text = document.getElementById('text')!.innerText; // 复制文本
        const input = document.getElementById('input')! as any; // 承载复制内容
        input.value = text; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand('copy');
        info('复制成功');
      }
      const handleSubmit = async () => {
        try {
          setModalProps({ confirmLoading: true });
          // TODO custom api
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      };
      return {
        getDesc,
        doctorName,
        patientName,
        src,
        registerModal,
        handleSubmit,
        url,
        copyText,
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
  .box {
    color: #171717;
    font-size: 16px;
    text-align: center;
    font-weight: 800;
    margin-top: 30px;
  }
  .text {
    position: relative;
    color: #0e31d7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .id {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
  }
</style>
