<template>
  <PageWrapper :title="title">
    <BasicTable @register="registerTable">
      <template #form-custom="{ model, field }">
        <a-select
          :options="options"
          size="default"
          v-model:value="model[field]"
          placeholder="请选择"
      /></template>

      <template #patientName="{ record }">
        <span v-if="record.wechat_name && record.wechat_name != ''">
          <sapn>{{ record.patient.uname }}</sapn>
          <span style="color: red">{{ '(' + record.wechat_name + ')' }}</span>
        </span>
        <span v-else>{{ record.patient.uname }}</span>
      </template>
      <template #dial_time="{ record }">
        <span v-if="(record.type == 1 || record.type == 2) && record.pay_time">{{
          record.pay_time
        }}</span>
        <span v-else-if="record.type == 3 || record.type == 4">{{ record.dial_time }}</span>
        <span v-else>--</span>
      </template>

      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="assistant === 0">
          新增预约挂号
        </a-button>
        <a-button type="primary" @click="handleExportSC" v-if="assistant != 0">
          导出看诊清单
        </a-button>
        <!-- style="display: none" -->
        <a-button type="primary" @click="handleExport"> 导出 </a-button>
      </template>
      <template #category="{ record }">
        <span v-if="record.type == 1">图文</span>
        <span v-if="record.type == 2">图文</span>
        <span v-if="record.type == 3">电话</span>
        <span v-if="record.type == 4">视频</span>
      </template>
      <template #expire="{ record }">
        <span v-if="record.status == '已结束' || record.status == '已退款'">剩余0分钟</span>
        <span v-else-if="record.expire != -1 && record.status == '问诊中'"
          >{{ formExpireDate(record.expire) }}
        </span>
        <span v-else>未知</span>
      </template>

      <template #payStatus="{ record }">
        <span v-if="record.pay_status === 1" style="color: green">已支付</span>
        <span v-if="record.pay_status === 0" style="color: red">未支付</span>
      </template>
      <template #status="{ record }">
        {{ record.status == '' ? '已结束' : record.status }}
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '客服代付码',
              onClick: handlePayment.bind(null, record, 'behalf', 1, 2),
              ifShow:
                record.order_status == '未支付' &&
                record.status != '已取消' &&
                record.status != '已失效',
            },
            {
              label: '患者支付码',
              onClick: handlePayment.bind(null, record, 'myself', 1, 1),
              ifShow:
                record.order_status == '未支付' &&
                record.status != '已取消' &&
                record.status != '已取消',
            },
            {
              icon: 'ant-design:appstore-outlined',
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              icon: 'ant-design:copy-filled',
              label: '复诊挂号',
              onClick: handleAgain.bind(null, record),
              ifShow: assistant === 0,
            },
            {
              icon: 'ant-design:rollback-outlined',
              label: '快捷退款',
              onClick: handleRefund.bind(null, record),
              ifShow:
                record.order_status == '已支付' &&
                record.status !== '退款中' &&
                record.status !== '已退款' &&
                record.amount !== '0.00',
            },
            {
              icon: 'ant-design:appstore-outlined',
              label: '退款日志',
              onClick: handleRefundLog.bind(null, record),
              ifShow: record.status == '已退款',
            },
          ]"
        />
      </template>
    </BasicTable>
    <RegDrawer @register="registerDrawer" @success="handleSuccess" />
    <RegModal @register="registerQrcodeModal" ref="ModelReg" />
    <RefundModal @register="registerRefundModal" @success="handleSuccess" />
    <RefundLogModal @register="registerRefundLogModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import RegDrawer from './RegDrawer.vue';
  import RegModal from './RegModal.vue';
  import { columns, searchFormSchema } from './reg.data';
  import { useRouter } from 'vue-router';
  import {
    getAppointmentsList,
    getQRCode,
    getPaymentQrcode,
    GetExport,
  } from '/@/api/sys/appointments';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useGo } from '/@/hooks/web/usePage';
  import RefundModal from '../../assistant/QuickRefundModel.vue';
  import RefundLogModal from '../../assistant/RefundLogMode.vue';
  import { onMounted, ref, unref } from 'vue';
  import { getOrganizationDoctorList } from '/@/api/sys/doctor';
  import { getUserList } from '/@/api/sys/user';
  import { downloadByUrl } from '/@/utils/file/download';

  const userStore = useUserStoreWithOut();
  const go = useGo();
  const options = ref([]);

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerQrcodeModal, { openModal: openQrcodeModal }] = useModal();
  const [registerRefundModal, { openModal: openRefundModal }] = useModal();
  const [registerRefundLogModal, { openModal: openRefundLogModal }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    title: '',
    api: getAppointmentsListAction,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: false,
    showIndexColumn: false,
    actionColumn: {
      width: 460,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
      align: 'center',
    },
  });
  const router = useRouter();
  const ModelReg = ref(null);

  const assistant = router.currentRoute.value.name == 'AssistantStationRegistration' ? 1 : 0;
  const title =
    router.currentRoute.value.name == 'AssistantStationRegistration' ? '挂号订单' : '预约挂号';
  const { currentRoute } = useRouter();

  async function getAppointmentsListAction(params: any) {
    const orgId = userStore.getUserInfo.organization_id;
    params.quick = assistant === 1 ? 0 : 1;
    if (params.dial_time) {
      params.dial_time_begin = params.dial_time[0];
      params.dial_time_end = params.dial_time[1];
      delete params.dial_time;
    }

    const data = await getAppointmentsList(orgId, params);
    data.data.map((item) => {
      if (item.advance_money && item.advance_money != '') {
        item.advance_money = item.advance_money;
      } else {
        item.advance_money = '--';
      }
      if (item.register_order_no && item.register_order_no != '') {
        item.register_order_no = item.register_order_no;
      } else {
        item.register_order_no = '--';
      }
    });
    return data;
  }

  let doctorList = [] as any[];
  let params = {
    current_page: 1,
    per_page: 20,
  };

  onMounted(() => {
    getOrganizationDoctorList().then((res) => {
      doctorList = res.map((item) => {
        item.id = String(item.id);
        return item;
      });
    });

    getUserList(userStore.getUserInfo.organization_id, params).then((res) => {
      res.data.map((item) => {
        options.value.push({
          value: item.id,
          label: item.title,
        });
      });
    });
    // var { query } = unref(currentRoute);
  });
  function hadleJump(record) {
    openDrawer(true, {
      isUpdate: true,
      doctorList,
      record: {
        ...record,
        time: '',
        money: '',
      },
    });
  }
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      doctorList,
    });
  }

  function formExpireDate(times) {
    let time: any = parseInt(times);
    // let h =
    //   Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    // let m =
    //   Math.floor((result / 60) % 60) < 10
    //     ? '0' + Math.floor((result / 60) % 60)
    //     : Math.floor((result / 60) % 60);
    let res = '剩余';

    if (null != time && '' != time) {
      if (time > 60 && time < 60 * 60) {
        time = parseInt(time / 60.0) + '分钟';
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        time =
          parseInt(time / 3600.0) +
          '小时' +
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
          '分钟';
      } else if (time >= 60 * 60 * 24) {
        time =
          parseInt(time / 3600.0 / 24) +
          '天' +
          parseInt((parseFloat(time / 3600.0 / 24) - parseInt(time / 3600.0 / 24)) * 24) +
          '小时' +
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
          '分钟';
      } else {
        time = parseInt(time) + '秒';
      }
    }
    res += `${time}`;
    return res;
  }

  async function handleExportSC() {
    // console.log(getForm().getFieldsValue());
    let params = getForm().getFieldsValue();
    let token = localStorage.getItem('NOT_TYPE_TOKEN');

    const apiUrl = import.meta.env.VITE_GLOB_API_URL;
    const viteProxy = JSON.parse(import.meta.env.VITE_PROXY);
    // https://mcnadm.myzx.cn/api
    let hostUrl = '';
    for (let i = 0; i < viteProxy.length; i++) {
      console.log(viteProxy[i], viteProxy[i][0], viteProxy[i][1], '采蘑菇的小姑娘');
      if (viteProxy[i][0] === apiUrl) {
        hostUrl = viteProxy[i][1];
        break;
      }
    }
    params.quick = assistant === 1 ? 0 : 1;
    if (params.dial_time) {
      params.dial_time_begin = params.dial_time[0];
      params.dial_time_end = params.dial_time[1];
      delete params.dial_time;
    }
    downloadByUrl({
      url: `${hostUrl}/organization/appointments/export?_t=1643003393235&token=${token}${getParams(
        params
      )}`,
      target: '_self',
    });
  }

  function getParams(obj) {
    let result = '';
    let item;
    for (item in obj) {
      if (obj[item] && String(obj[item])) {
        result += `&${item}=${obj[item]}`;
      }
    }
    if (result) {
      result = '&' + result.slice(1);
    }
    return result;
  }
  function build_query(obj, num_prefix, temp_key) {
    let item;
    var output_string = [];
    Object.keys(obj).forEach(function (val) {
      var key = val;

      num_prefix && !isNaN(key) ? (key = num_prefix + key) : '';

      var key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
      temp_key ? (key = temp_key + '[' + key + ']') : '';

      if (typeof obj[val] === 'object') {
        var query = build_query(obj[val], null, key);
        output_string.push(query);
      } else {
        // var value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
        var value = obj[val];
        output_string.push(key + '=' + value);
      }
    });

    return output_string.join('&');
  }
  function handleExport() {
    const orgId = userStore.getUserInfo.organization_id;
    let params = getForm().getFieldsValue();
    let token = localStorage.getItem('NOT_TYPE_TOKEN');

    const apiUrl = import.meta.env.VITE_GLOB_API_URL;
    const viteProxy = JSON.parse(import.meta.env.VITE_PROXY);
    let hostUrl = 'https://mcnadm.myzx.cn/api';
    // for (let i = 0; i < viteProxy.length; i++) {
    //   console.log(viteProxy[i], viteProxy[i][0], viteProxy[i][1], '采蘑菇的小姑娘');
    //   if (viteProxy[i][0] === apiUrl) {
    //     hostUrl = viteProxy[i][1];
    //     break;
    //   }
    // }
    viteProxy.map((item) => {
      if (item[0] == '/api') {
        hostUrl = item[1];
      }
    });
    params.is_export = 1;
    console.log(params);

    let result = build_query(params);
    downloadByUrl({
      url: `${hostUrl}/organization/${orgId}/appointments?_t=1643003393235&token=${token}&${result}`,
      target: '_self',
    });
  }

  function handlePayment(
    record: Recordable,
    type: string,
    paymentType: number,
    paymentPayer: number
  ) {
    console.log(record, type, paymentType, paymentPayer);

    // const RefProxy: any = ModelReg.value;
    // console.log(RefProxy.$el, '00000000000000000');
    // RefProxy.$el.style.borderRadius = '0';
    const params = {
      did: record.did,
      orderId: record.id,
    };
    if (Number(paymentPayer) === 2) {
      getPaymentQrcode(record.id, { type: 1, payer: 2 }).then((res: any) => {
        openQrcodeModal(true, {
          type: type,
          paymentType: paymentType,
          paymentPayer: paymentPayer,
          orderId: record.id,
          record,
          // doctorName: record.doctor_name,
          showSrc: 'data:image/png;base64,' + res.data,
          patientName: record.patient.uname,
        });
      });
    } else {
      console.log(paymentType);
      getQRCode(record.id, params).then(function (response) {
        console.log(record.id, response);
        openQrcodeModal(true, {
          type: type,
          paymentType: paymentType,
          paymentPayer: paymentPayer,
          orderId: record.id,
          record,
          // doctorName: record.doctor_name,
          showSrc: response.payCode,
          patientName: record.patient.uname,
          expired_str: response.expired_str,
        });
      });
    }
  }

  function handleDetail(record: Recordable) {
    let path = '/customer/service/appointments/detail',
      params: string[] = [];
    if (assistant === 1) {
      path = '/assistant/station/registration/detail';
      //params.push('title=预约挂号');
    }
    params.push('id=' + record.id);
    params.push('assistant=' + assistant);
    params.push('paid=' + record.patient.paid);
    params.push('patient_name=' + record.patient.uname);
    params.push('patient_sex=' + (record.patient.sex === 1 ? '男' : '女'));
    params.push('patient_age=' + record.patient.age);
    params.push('patient_mobile=' + record.patient.mobile);
    params.push('order_sn=' + record.order_sn);
    params.push('title=' + title);
    params.push('doctor_id=' + record.doctor_id);
    params.push('doctor_name=' + record.doctor_name);
    params.push('dept_id=' + record.dept_id);
    params.push('dept_name=' + record.dept_name);

    go(path + '?' + params.join('&'));
    /*router.push({
        path: 'regDetail',
        query: {id: record.id}
      })*/
  }

  function handleRefundLog(record: Recordable) {
    console.log(record);
    openRefundLogModal(true, {
      order: record,
      reason: record?.refund_reason,
      admin_name: record?.refund_user,
      refund_time: record?.refund_time,
      state: 2,
    });
  }

  function handleRefund(record: Recordable) {
    openRefundModal(true, {
      order_no: record.order_sn,
      id: record.id,
      state: 2,
    });
  }

  function handleAgain(record: Recordable) {
    console.log(record);
    console.log(doctorList);
    openDrawer(true, {
      isUpdate: true,
      doctorList,
      record: {
        ...record,
        time: '',
        money: '',
      },
    });
  }

  function handleSuccess() {
    reload();
  }
</script>

<style type="text/css">
  .vben-basic-table-form-container {
    padding: 0 !important;
  }
  .vben-basic-form .ant-form-item {
    margin-bottom: 10px !important;
  }
</style>
