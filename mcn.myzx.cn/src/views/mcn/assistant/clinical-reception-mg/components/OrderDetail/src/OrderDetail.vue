<template>
  <Row style="padding: 0 20px 40px 20px">
    <Col span="12" style="font-size: 16px"> 订单状态 </Col>
    <Col span="12" style="text-align: right">
      <a-button type="default" @click="changeRemark"> 备注订单 </a-button>
    </Col>
    <Col span="24" style="font-size: 16px; font-weight: 600; color: indianred">
      {{ detail?.order_status }}
    </Col>
    <Col span="24" style="margin-top: 20px">
      <table style="width: 100%" border="1" id="order-detail">
        <tr style="background-color: #f5f7fa">
          <td style="font-weight: 600">订单编号</td>
          <td style="font-weight: 600">患者</td>
          <td style="font-weight: 600">手机号</td>
          <td style="font-weight: 600">支付时间</td>
          <td style="font-weight: 600">预约时间</td>
        </tr>
        <tr style="background-color: #fff">
          <td>{{ detail?.order_sn }}</td>
          <td>{{ detail?.patient?.uname }}</td>
          <td>{{ detail?.patient?.mobile }}</td>
          <td>{{ detail?.pay_time }}</td>
          <td>{{ detail?.dial_time }}</td>
        </tr>
        <tr style="background-color: #f5f7fa">
          <td style="font-weight: 600">医生</td>
          <td style="font-weight: 600">问诊类型</td>
          <td style="font-weight: 600">患者来源</td>
          <td style="font-weight: 600">付款状态</td>
          <td style="font-weight: 600"></td>
        </tr>
        <tr style="background-color: #fff">
          <td>{{ detail?.doctor_name }}</td>
          <td>{{ detail?.type_name }}</td>
          <td>{{ detail?.source }}</td>
          <td>{{ detail.pay_status ? '已' : '未' }}支付</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="5" style="padding: 0; text-align: right">
            <textarea
              :disabled="!remarkable"
              v-model="remark"
              class="ant-input"
              style="width: 100%; text-align: left"
              placeholder="备注"
            >
            </textarea>
            <a-button type="default" @click="remarkable = !remarkable" v-show="remarkable">
              取消
            </a-button>
            <a-button type="primary" @click="handleSubmit" v-show="remarkable"> 提交 </a-button>
          </td>
        </tr>
      </table>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getAppointment, editConsultation } from '/@/api/sys/appointments';
  import { Row, Col } from 'ant-design-vue';

  export default defineComponent({
    emits: ['changeTab'],
    props: {
      id: Number,
    },
    components: { Row, Col },
    setup(props) {
      const detail = ref<any>({});
      const remarkable = ref(false);
      const remark = ref<string>('');

      watch(
        () => {
          return props.id;
        },
        (state) => {
          if (state) {
            nextTick(() => {
              getAppointmentSync(props.id);
            });
          }
        },
        {
          immediate: true,
          deep: true,
        }
      );

      const getAppointmentSync = (id) => {
        getAppointment(id).then((response) => {
          detail.value = response;
          remark.value = response?.order_desc;
        });
      };

      const { createMessage } = useMessage();

      function changeRemark() {
        remarkable.value = !remarkable.value;
      }

      function handleSubmit() {
        if (remark.value == '') {
          createMessage.error('请填写备注!');
          return;
        }
        const params = {
          order_id: props.id,
          order_desc: remark.value,
        };
        editConsultation(props.id, params).then(() => {
          createMessage.success('备注修改成功!');
          remarkable.value = false;
        });
      }

      return {
        detail,
        remark,
        remarkable,
        changeRemark,
        handleSubmit,
        getAppointmentSync,
      };
    },
  });
</script>

<style type="text/css">
  #order-detail {
    border-top: solid 1px #ddd;
    border-left: solid 1px #ddd;
  }
  #order-detail td {
    border-bottom: solid 1px #ddd;
    border-right: solid 1px #ddd;
    padding: 8px 5px;
    text-align: center;
  }
</style>
