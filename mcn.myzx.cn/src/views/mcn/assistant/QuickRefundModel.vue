<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="快捷退款"
    width="540px"
    :height="580"
    :showOkBtn="true"
    :showCancelBtn="false"
    :okText="currentState === 2 ? '确认退款' : '确认退款 ￥' + refundMoney"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template v-if="currentState === 2">
      <Row>
        <Col span="5" style="text-align: right; padding-right: 20px"> 订单编号: </Col>
        <Col span="18">
          {{ orderNo }}
        </Col>
      </Row>
      <Row style="margin-top: 15px">
        <Col span="5" style="text-align: right; padding-right: 20px"> 退款原因: </Col>
        <Col span="18">
          <textarea class="ant-input" v-model="reason" placeholder="请填写退款原因" rows="6">
          </textarea>
        </Col> </Row
    ></template>
    <template v-else>
      <a-form :model="form" :labelCol="{ span: 4 }">
        <a-form-item label="处方编号：">
          <a-input v-model:value="form.cfbh" :disabled="true" />
        </a-form-item>
        <a-form-item label="患者：">
          <a-input v-model:value="form.name" :disabled="true" />
        </a-form-item>
        <a-form-item label="手机号：">
          <a-input v-model:value="form.phone" :disabled="true" />
        </a-form-item>
        <a-form-item label="退款类型：" required>
          <!-- <a-radio v-model:value="form.radio" label="1" @change="tk" :disabled="qbtk"
          >全部退款 ￥{{ ze }}</a-radio
        >
        <a-radio v-model:value="form.radio" label="2" @change="bftk">部分退款</a-radio> -->
          <a-radio-group v-model:value="form.radio">
            <a-radio value="1" @change="tk" :disabled="qbtk">全部退款 ￥{{ ze }}</a-radio>
            <a-radio value="2" @change="bftk" v-if="isShow">部分退款</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="" v-if="isyf">
          <a-checkbox-group v-model:value="form.checkList">
            <a-row>
              <a-col :span="8" :offset="4">
                <a-checkbox value="1" :disabled="yf"
                  >退药费 ￥{{ tks.info.medical_fee }}</a-checkbox
                >
              </a-col>
              <a-col :span="8">
                <a-checkbox value="2" :disabled="express"
                  >退运费 ￥{{ tks.info.express_fee }}</a-checkbox
                >
              </a-col>
              <a-col :span="8" :offset="4">
                <a-checkbox value="3" :disabled="qbjgftk"
                  >退加工费 ￥{{ tks.info.process_fee }}</a-checkbox
                >
              </a-col>
              <a-col :span="8">
                <a-checkbox value="4" :disabled="zj"
                  >退诊金 ￥{{ tks.info.consultation_fee }}</a-checkbox
                >
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="退款原因" required>
          <a-textarea v-model:value="form.textarea2" show-count :maxlength="100" />
        </a-form-item>
      </a-form>
      <!-- <div class="dialog-footer">
      <el-button @click="esc">取 消</el-button>
      <el-button type="primary" @click="close">确定退款{{ '￥' + refundMoney }}</el-button>
    </div> -->
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Row, Col, message } from 'ant-design-vue';
  import {
    createPrescriptRefund,
    createAppointmentsRefund,
    drugOrderDetails,
    mergerefund,
  } from '/@/api/sys/appointments';

  const orderNo = ref<string>('');
  const reason = ref<string>('');

  const form = ref({
    cfbh: '',
    name: '',
    phone: '',
    radio: '1',
    checkList: [],
    textarea2: '',
  });
  const tks = ref({}),
    objs = ref({}),
    isyf = ref(false),
    qbtk = ref(false),
    ze = ref(),
    yf = ref(false),
    express = ref(false),
    qbjgftk = ref(false),
    zj = ref(false),
    orderDetail = ref({}),
    isShow = ref('');

  //部分退款
  const partRefund = ref({
    refundRrug: '0',
    refundExpress: '0',
    refundProcess: '0',
    refundConsultation: '0',
  });

  const refundMoney = computed(() => {
    let refundAll = 0.0;
    if (form.value.radio == '2') {
      if (form.value.checkList.length <= 0) {
        refundAll = 0.0;
      } else {
        form.value.checkList.map((item) => {
          if (item == 1) {
            refundAll += Number(partRefund.value.refundRrug);
          } else if (item == 2) {
            refundAll += Number(partRefund.value.refundExpress);
          } else if (item == 3) {
            refundAll += Number(partRefund.value.refundProcess);
          } else if (item == 4) {
            refundAll += Number(partRefund.value.refundConsultation);
          }
        });
      }
    }
    return form.value.radio == '1' ? ze.value : refundAll.toFixed(2);
  });

  let currentId = ref(),
    currentState = ref();
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    reason.value = '';
    currentId.value = '';
    currentState.value = '';
    orderNo.value = '';
    console.log(data, '555555555555555555');

    // state 1为处方订单退款 2为预约挂号退款
    currentState.value = data.state;
    if (currentState.value === 2) {
      orderNo.value = data.order_no;
      currentId.value = data.id;
    }

    if (currentState.value === 1) {
      orderDetail.value = await drugOrderDetails({ order_no: data.order_no });

      form.value.cfbh = data.record.prescript_no;
      form.value.name = data.record.patient_name;
      form.value.phone = data.record.patient_mobile;
      form.value.textarea2 = orderDetail.value.info.reason;
      tks.value = orderDetail.value;
      ze.value = orderDetail.value.info.total_fee;
      // console.log(, '---');
      isShow.value = orderDetail.value.info.is_old == false ? false : true;
      if (orderDetail.value.info.refund_type === 2) {
        form.value.radio = '2';
        qbtk.value = true;
        isyf.value = true;
      } else {
        form.value.radio = '1';
      }
      if (
        orderDetail.value.info.medical_fee == '0.00' ||
        orderDetail.value.info.refund_drug != '0.00'
      ) {
        yf.value = true;
        partRefund.value.refundRrug = '0';
      } else {
        partRefund.value.refundRrug = orderDetail.value.info.medical_fee;
      }
      if (
        orderDetail.value.info.express_fee == '0.00' ||
        orderDetail.value.info.refund_express != '0.00'
      ) {
        express.value = true;
        partRefund.value.refundExpress = '0';
      } else {
        partRefund.value.refundExpress = orderDetail.value.info.express_fee;
      }
      if (
        orderDetail.value.info.process_fee == '0.00' ||
        orderDetail.value.info.refund_process != '0.00'
      ) {
        qbjgftk.value = true;
        partRefund.value.refundProcess = '0';
      } else {
        partRefund.value.refundProcess = orderDetail.value.info.process_fee;
      }
      if (
        orderDetail.value.info.consultation_fee == '0.00' ||
        orderDetail.value.info.refund_consultation != '0.00'
      ) {
        zj.value = true;
        partRefund.value.refundConsultation = '0';
      } else {
        partRefund.value.refundConsultation = orderDetail.value.info.consultation_fee;
      }
    }
  });

  const emit = defineEmits(['success', 'register']);

  function tk() {
    isyf.value = false;
  }
  function bftk() {
    isyf.value = true;
  }

  function handleCancel() {
    form.value.radio = '1';
    form.value.checkList = [];
    form.value.textarea2 = '';
    isyf.value = false;
    qbtk.value = false;
    yf.value = false;
    express.value = false;
    qbjgftk.value = false;
    zj.value = false;
    closeModal();
  }

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });

      if (currentState.value === 1) {
        const zf = form.value.checkList.sort().toString();
        let params = {
          order_no: orderDetail.value.info.order_no,
          reason: form.value.textarea2,
          type: form.value.radio,
          part_type: form.value.radio == '1' ? 0 : zf,
          allmoney: ze.value,
        };
        const sort = form.value.checkList.sort();
        if (form.value.radio == '2') {
          if (sort.length <= 0) {
            message.error('请最少选择一个退款项！');
            return;
          }
        }

        if (form.value.textarea2 == '') {
          message.error('请填写退款原因！');
          return;
        }

        const a = sort.includes('1');
        const b = sort.includes('2');
        const c = sort.includes('3');
        const d = sort.includes('4');
        if (form.value.radio == '2') {
          delete params.allmoney;
        }

        if (a) {
          params.refund_drug = tks.value.info.medical_fee;
        }
        if (b) {
          params.refund_express = tks.value.info.express_fee;
        }
        if (c) {
          params.refund_process = tks.value.info.process_fee;
        }
        if (d) {
          params.refund_consultation = tks.value.info.consultation_fee;
        }
        await mergerefund(params);
        form.value.radio = '1';
        form.value.checkList = [];
        form.value.textarea2 = '';
        isyf.value = false;
        qbtk.value = false;
        yf.value = false;
        express.value = false;
        qbjgftk.value = false;
        zj.value = false;
        // await createPrescriptRefund(currentId, reason.value);
      }
      if (currentState.value === 2) {
        createAppointmentsRefund(currentId.value, reason.value);
      }
      // TODO custom api
      setTimeout(() => {
        emit('success');
        closeModal();
      }, 2000);
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
