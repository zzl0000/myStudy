import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'order_sn',
    align: 'left',
    width: 120,
  },
  {
    title: '问诊类型',
    dataIndex: 'type',
    align: 'left',
    width: 100,
  },
  {
    title: '预约时间',
    dataIndex: 'dial_time',
    align: 'left',
    width: 120,
  },
  {
    title: '订单状态',
    dataIndex: 'order_status',
    align: 'left',
    width: 80,
  },
  {
    title: '申请时间',
    dataIndex: 'apply_refund_time',
    align: 'left',
    width: 120,
  },
  {
    title: '医生姓名',
    dataIndex: 'doctor_name',
    align: 'left',
    width: 80,
  },
  {
    title: '医生科室',
    dataIndex: 'ks1name',
    align: 'left',
    width: 120,
  },
  {
    title: '患者姓名',
    dataIndex: 'patient_name',
    align: 'left',
    width: 80,
  },
  {
    title: '患者手机号',
    dataIndex: 'patient_phone',
    align: 'left',
    width: 100,
  },
  {
    title: '退款金额',
    dataIndex: 'pay_money',
    align: 'left',
    width: 80,
  },
  {
    title: '退款原因',
    dataIndex: 'refund_reason',
    align: 'left',
    width: 120,
  },
  {
    title: '审核状态',
    dataIndex: 'audit_status',
    align: 'left',
    width: 100,
  },
  {
    title: '退款状态',
    dataIndex: 'refund_status',
    align: 'left',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'patient_name',
    label: '患者姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'doctor_name',
    label: '医生姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '患者手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'order_sn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '申请退款时间',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
  {
    field: 'audit_status',
    label: '审核状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '待审核', value: '1' },
        { label: '审核不通过', value: '3' },
        { label: '审核通过', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
];
