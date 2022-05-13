<template>
  <div></div>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="540px"
    :height="600"
    :showOkBtn="false"
    cancelText="返回"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :scroll="{ x: 1300 }"
  >
    <div class="image-box">
      <div class="de">
        <CheckCircleTwoTone two-tone-color="#52c41a" /> {{ doctorName }}医生已为您定制
      </div>
      <div class="desc">整体治疗方案，请立即支付</div>
      <div class="desc" style="font-weight: 800" v-if="getDesc">{{ getDesc }}</div>
      <div v-if="patientName && type != 'behalf'" class="desc" style="font-weight: 800">
        {{ patientName }}的{{ paymentType == 1 ? '挂号' : '处方' }}二维码
      </div>

      <div
        style="
          width: 160px;
          height: 160px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-if="isShow"
      >
        <img
          src="../../../../assets/images/rtrc/img/loding-gif.gif"
          class="app-loading-logo"
          alt="loading"
          style="width: 70px; height: 70px"
        />
      </div>

      <a-image :width="160" :height="160" :src="src" v-else />
      <div
        class="msg"
        style="
          margin-top: 30px;
          color: #f9f871;
          font-weight: 300;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div><ScanOutlined style="font-size: 40px; margin: 0 5px 0 0" /></div>
        <div class="debottom" style="text-align: left"
          >请{{ expired_str ? expired_str : '30分钟' }}之内 <br />微信识别二维码完成支付</div
        >
      </div>
    </div>
    <!-- <Divider style="margin-top: 50px" /> -->
    <div class="box"> {{ getBottom }}</div>
    <div class="box" style="font-size: 20px; margin-top: 30px" v-if="ishows"
      >您也可直接复制支付链接发送给患者：</div
    >

    <p id="text" class="text" v-if="ishows">{{ url }}</p>
    <textarea id="input" class="id"></textarea>
    <div class="box" style="color: #0e31d7; cursor: pointer" @click="copyText" v-if="ishows"
      >复制链接</div
    >
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Image } from 'ant-design-vue';
  import { CheckCircleTwoTone, ScanOutlined } from '@ant-design/icons-vue';
  import { getPaymentQrcode } from '/@/api/sys/appointments';
  import { Divider } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register', 'cancel']);

  const type = ref(''),
    patientName = ref(''),
    amount = ref(),
    src = ref(''),
    doctorName = ref(''),
    keshiName = ref(''),
    expired_str = ref(''),
    paymentType = ref(''),
    isShow = ref(true);
  let url = ref('');
  let ishows = ref(true);
  let newurl = ref('');
  const { createMessage } = useMessage();
  const { error, info } = createMessage;

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data, 'datadatadatadatadatadata');
    type.value = data.type;

    url.value = '';
    paymentType.value = data.paymentType;
    patientName.value = data.patientName;
    let show = data?.paymentPayer;
    if (type.value == 'behalf') {
      ishows.value = false;
    } else {
      ishows.value = true;
    }
    const orderId = data.idOrOrderId ? data.record?.id : data.orderId;
    console.log(data, orderId, '-----');

    url.value =
      'https://cloud1-5g80ysht3e049128-1306117587.tcloudbaseapp.com/h5/jump-mp.html?sign=047e33b549a034725a9760fd3f5deebd&t=1644572774&mpUrl=';
    if (paymentType.value == '2') {
      newurl.value = encodeURIComponent(
        `/pages/my-center/drug-orders/newdetail/newdetail?id=${data.orderId}`
      );
    } else {
      newurl.value = encodeURIComponent(`/pages/pay/purchase-service?id=${data.orderId}`);
    }
    url.value = url.value + newurl.value;
    if (data.record) {
      amount.value = Number(data.record.amount);
    }
    if (data.expired_str) {
      expired_str.value = data.expired_str;
    } else {
      expired_str.value = '';
    }
    doctorName.value = data.record.doctor_name;
    keshiName.value = data.record.dept_name;

    if (data.showSrc) {
      src.value = data.showSrc;
      setTimeout(() => {
        isShow.value = false;
      }, 1000);
      return;
    }

    const params = {
      type: data?.paymentType,
      payer: data?.paymentPayer,
    };

    const payImageBase64 = data.record?.pay_image_base64;
    if (payImageBase64 === undefined || payImageBase64 === '') {
      getPaymentQrcode(orderId, params).then((response: any) => {
        if (response.data) {
          src.value = 'data:image/png;base64,' + response.data;
          isShow.value = false;
        }
      });
    } else {
      src.value = 'data:image/png;base64,' + payImageBase64;
      isShow.value = false;
    }
  });

  const handleCancel = () => {
    isShow.value = true;

    emit('cancel');
  };
  function copyText() {
    const text = document.getElementById('text')!.innerText; // 复制文本
    const input = document.getElementById('input')! as any; // 承载复制内容
    input.value = text; // 修改文本框的内容
    input.select(); // 选中文本
    document.execCommand('copy');
    info('复制成功');
    console.log(1);
  }

  const getTitle = computed(() => (unref(type.value) === 'behalf' ? '客服代付' : '订单二维码'));
  // const getTitle = computed(() => '订单二维码');
  const getDesc = computed(() => (unref(type.value) === 'behalf' ? '直接扫码支付即可' : ''));
  // unref(type.value) === 'behalf' ? '直接扫码支付即可' : `${patientName.value}的二维码`

  const getBottom = computed(() =>
    unref(type.value) === 'behalf'
      ? '扫码直接支付即可'
      : '截图二维码，将二维码发送给用户，用户扫码支付即可'
  );
  // const getDesc = computed(
  //   () =>
  //     unref(type.value) === 'behalf'
  //       ? '直接扫码支付即可'
  //       : amount.value > 0
  //       ? '将二维码发送给患者,患者识别二维码支付即可。'
  //       : '你可选择将二维码发送给患者，患者识别二维码确认信息'
  //   // unref(type.value) === 'behalf' ? '直接扫码支付即可' : `${patientName.value}的二维码`
  // );

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
    background-color: #1890ff;
    width: 320px;
    margin: 0 auto;
    min-height: 420px;
    border-radius: 5px;
    padding: 10px;
    text-align: center;
    .msg {
      margin-top: 40px;
    }
    .de {
      color: #fffafa;
      font-size: 16px;
      font-weight: 500;
      margin-top: 30px;
      margin-bottom: 5px;
      padding: 0 20px 0 20px;
      :deep(.anticon) {
        margin-right: 3px;
        font-size: 18px;
      }
    }
    .desc {
      font-size: 16px;
      color: #fff;
      padding: 0 30px 0 30px;
      margin-bottom: 20px;
    }
    .debottom {
      color: #f9f871;
      font-size: 14px;
    }
    :deep(.ant-image) {
      .ant-image-img {
        // border-radius: 50%;
      }
    }
  }
  .box {
    color: #171717;
    font-size: 16px;
    text-align: center;
    font-weight: 800;
    // margin-top: 30px;
  }
  .text {
    position: relative;
    color: #0e31d7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .id {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
  }
</style>
