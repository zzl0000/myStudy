<template>
  <div>
    <PageWrapper title="收费记录查询">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <span class="title">总金额：￥{{ total_monty }}</span>
          <span class="title">昨日收费：￥{{ yesterday_monty }}</span>
          <span class="title">今日收费：￥{{ today_monty }}</span>
        </template>
        <template #order_sn="{ record }">
          <span v-if="record.pay_status == '已退款' && record.order_sn == ''">暂无挂号</span>
          <span @click="goRelation(record)" v-else-if="record.order_sn == ''"
            >暂无挂号-<span style="color: #1890ff; cursor: pointer">去关联</span></span
          >
          <span v-else>{{ record.order_sn }}</span>
        </template>
        <template #doctor_info="{ record }">
          <span v-if="record.doctor_info == ''">--</span>
          <span v-else>{{ record.doctor_info }}</span>
        </template>
        <template #action="{ record }">
          <!--    快捷退款:  -->
          <!--    退款日志:  -->
          <!--    预约挂号:  -->
          <TableAction
            :actions="[
              {
                label: '快捷退款',
                icon: 'ant-design:rollback-outlined',
                onClick: handleRefund.bind(null, record),
                ifShow: record.pay_status == '已支付',
              },
              {
                label: '预约挂号',
                icon: 'ant-design:copy-filled',
                ifShow: record.pay_status == '已支付' && record.order_sn == '',
                onClick: handleAppointment.bind(null, record),
              },
              {
                label: '详情',
                icon: 'ant-design:appstore-outlined',
                ifShow: record.pay_status == '已支付' && record.order_sn != '',
                onClick: handleDetail.bind(null, record),
              },
              {
                label: '退款日志',
                icon: 'ant-design:appstore-outlined',
                onClick: handleRefundLog.bind(null, record),
                ifShow: record.pay_status == '已退款' || record.pay_status == '退款中',
              },
            ]"
          />
        </template>
      </BasicTable>
    </PageWrapper>

    <RegDrawer @register="registerDrawer" @success="handleSuccess" />
    <!-- 关联挂号订单 -->
    <a-modal
      v-model:visible="relationModal"
      title="关联挂号订单"
      :closable="false"
      width="450px"
      @cancel="relationModalCancel"
      @ok="relationModalOk"
    >
      <div style="padding: 20px; box-sizing: border-box; font-size: 16px">
        <span>挂号订单编号：</span>
        <a-input v-model:value="orderSnIpt" placeholder="请输入" style="width: 250px" />
      </div>
    </a-modal>
    <!-- 快捷退款 -->
    <a-modal
      v-model:visible="refundModal"
      title="快捷退款"
      :closable="true"
      width="550px"
      @cancel="refundModalCancel"
      @ok="refundModalOk"
      okText="确定退款"
    >
      <div style="padding: 20px 30px; box-sizing: border-box; font-size: 16px">
        <span>订单编号：</span>
        <span>{{ order_no }}</span>
        <div style="display: flex; margin-top: 10px">
          <span style="width: 101px">退款原因：</span>
          <a-textarea
            style="width: 100%"
            v-model:value="refund_reason"
            :showCount="true"
            placeholder="请填写退款原因"
            :rows="6"
          />
          <!-- <textarea class="ant-input" v-model="refund_reason" placeholder="请填写退款原因" rows="6">
          </textarea> -->
        </div>
      </div>
    </a-modal>
    <!-- 退款日志 -->
    <a-modal
      v-model:visible="refundLogModal"
      title="退款日志"
      :closable="true"
      width="500px"
      @cancel="refundLogModalOk"
      @ok="refundLogModalOk"
    >
      <div style="padding: 20px 30px; box-sizing: border-box; font-size: 16px">
        <div style="margin-bottom: 10px"
          >退款金额：<span>{{ refundLogObj.money }}</span></div
        >
        <div style="margin-bottom: 10px"
          >退款原因：<span>{{ refundLogObj.refund_reason }}</span></div
        >
        <div style="margin-bottom: 10px"
          >操作人：<span>{{ refundLogObj.refund_user }}</span></div
        >
        <div style="margin-bottom: 10px"
          >退款时间：<span>{{ refundLogObj.refund_time }}</span></div
        >
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction, FormSchema } from '/@/components/Table';
  import { columns, searchFormSchema } from './charge.data';
  import { getRegisterOrder, goTorelation, gpQuickrefund } from '/@/api/sys/register';
  import { getOrganizationDoctorList } from '/@/api/sys/doctor';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { onMounted, ref } from 'vue';
  import { message, Pagination } from 'ant-design-vue';
  import RegDrawer from './RegDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import moment from 'moment';

  const { createMessage, createErrorModal } = useMessage();
  const { success } = createMessage;
  const userStore = useUserStoreWithOut();
  const go = useGo();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '',
    api: getRegisterOrderList,
    columns,
    formConfig: {
      labelWidth: 90,
      schemas: searchFormSchema,
      fieldMapToTime: [['pay_time', ['pay_time_start', 'pay_time_end'], 'YYYY-MM-DD']],
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: false,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
      align: 'left',
    },
  });

  // const start = getMonth('s', 0);
  // const end = getMonth('e', 0);
  let end = moment(new Date()).format('yyyy-MM-DD');
  const date = new Date();
  const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const year = date.getFullYear();
  let start = year + '-' + month + '-' + '01';
  onMounted(() => {
    searchFormSchema.map((item) => {
      if (item.label == '支付时间') {
        item.defaultValue[0] = moment(start);
        item.defaultValue[1] = moment(end);
      }
    });
    getOrganizationDoctorList().then((res) => {
      doctorList = res.map((item) => {
        item.id = String(item.id);
        return item;
      });
    });
  });
  const tableLoading = ref(false);
  // 收费总金额
  let total_monty = ref('0');
  // 昨天收费总金额
  let yesterday_monty = ref('0');
  // 今天收费总金额
  let today_monty = ref('0');
  let searchObj = ref<any>({});
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({});

  async function getRegisterOrderList(params: any) {
    params['page_size'] = params.per_page;
    searchObj.value = params;
    // delete params.per_page;
    console.log(searchObj.value);
    // searchObj.value.page_size = params.per_page;
    const data = await getRegisterOrder(params);
    total_monty.value = data.total_monty;
    yesterday_monty.value = data.yesterday_monty;
    today_monty.value = data.today_monty;
    return data;
  }
  const current1 = ref<number>(1);
  // 退款日志
  const refundLogModal = ref(false);
  const refundLogObj = ref<any>({});
  function handleRefundLog(record: Recordable) {
    console.log(record);
    refundLogModal.value = true;
    refundLogObj.value = record;
  }
  function refundLogModalOk() {
    refundLogModal.value = false;
  }
  // 关联挂号订单编号
  const relationModal = ref(false);
  const orderSnIpt = ref();
  function relationModalCancel() {
    relationModal.value = false;
  }
  // 关联挂号订单
  function relationModalOk() {
    console.log();
    if (orderSnIpt.value.trim() == '') {
      message.error('请输入订单编号');
      return;
    }
    goTorelation({
      id: relationID.value,
      order_sn: orderSnIpt.value,
    }).then((res) => {
      console.log(res);
      if (res.code == 200) {
        relationModal.value = false;
        message.success('关联成功');
        // getRegisterOrderList(searchObj.value);
        reload();
      } else {
        relationModal.value = false;
        message.error(res.message);
      }
    });
  }
  const relationID = ref();
  function goRelation(row) {
    console.log(row);
    orderSnIpt.value = '';
    relationModal.value = true;
    relationID.value = row.id;
  }
  // 详情
  function handleDetail(record: Recordable) {
    const path = `/customer/service/appointments/detail?id=${record.wz_order_id}&patient_name=${
      record.patient.name
    }&patient_sex=${record.patient.sex === '1' ? '男' : '女'}&patient_age=${
      record.patient.age
    }&patient_mobile=${record.patient.phone}&title=预约挂号`;
    go(path);
  }
  //快捷退款
  const refundModal = ref(false);
  const order_no = ref();
  const id = ref();
  const refund_reason = ref();
  function handleRefund(record: Recordable) {
    order_no.value = record.order_no;
    id.value = record.id;
    refundModal.value = true;
    refund_reason.value = '';
  }
  function refundModalCancel() {
    refundModal.value = false;
  }
  function refundModalOk() {
    console.log(refund_reason.value.length);
    if (refund_reason.value.trim() == '') {
      message.error('请填写退款原因');
      return;
    }
    if (refund_reason.value.length > 100) {
      message.error('退款原因字符不得超过100，请重新填写');
      return;
    }
    gpQuickrefund({
      id: id.value,
      refund_reason: refund_reason.value,
    }).then((res) => {
      if (res.code == 200) {
        message.success('申请成功');
        refundModal.value = false;
        refund_reason.value = '';
      } else {
        refundModal.value = false;
        createErrorModal({ title: '错误提示', content: res.message });
      }
      setTimeout(() => {
        // console.log(params);
        // getRegisterOrderList(params);
        reload();
      }, 1500);
    });
  }
  //问诊之后传值函数
  function handleSuccess() {
    reload();
  }
  function handleSearch() {
    reload();
  }
  // 预约挂号
  let doctorList = [] as any[];
  function handleAppointment(record: Recordable) {
    record.patient.uname = record.patient.name;
    record.patient.mobile = record.patient.phone;
    record.patient.id_card = record.patient.idcard;
    record.amount = record.money;
    openDrawer(true, {
      isUpdate: true,
      doctorList,
      record: {
        ...record,
        time: '',
        money: record.amount,
      },
    });
  }

  function getMonth(type, months) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (Math.abs(months) > 12) {
      months = months % 12;
    }
    if (months != 0) {
      if (month + months > 12) {
        year++;
        month = (month + months) % 12;
      } else if (month + months < 1) {
        year--;
        month = 12 + month + months;
      } else {
        month = month + months;
      }
    }
    month = month < 10 ? '0' + month : month;
    var date = d.getDate();
    var firstday = year + '-' + month + '-' + '01';
    var lastday = '';
    if (
      month == '01' ||
      month == '03' ||
      month == '05' ||
      month == '07' ||
      month == '08' ||
      month == '10' ||
      month == '12'
    ) {
      lastday = year + '-' + month + '-' + 31;
    } else if (month == '02') {
      if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
        lastday = year + '-' + month + '-' + 29;
      } else {
        lastday = year + '-' + month + '-' + 28;
      }
    } else {
      lastday = year + '-' + month + '-' + 30;
    }
    var day = '';
    if (type == 's') {
      day = firstday;
    } else {
      day = lastday;
    }
    return day;
  }
</script>
<style scoped>
  .vben-basic-table-action.center {
    justify-content: left;
    flex-wrap: wrap;
  }
  .title {
    font-weight: 700;
    font-size: 20px;
    margin-right: 30px;
  }
</style>
