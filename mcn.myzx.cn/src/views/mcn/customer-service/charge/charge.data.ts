import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '缴费编号',
    dataIndex: 'order_no',
    align: 'left',
    width: 180,
  },
  {
    title: '患者信息',
    dataIndex: 'patient.name',
    align: 'left',
    width: 100,
  },
  {
    title: '手机号',
    dataIndex: 'patient.phone',
    align: 'left',
    width: 120,
  },
  {
    title: '订单金额',
    dataIndex: 'money',
    align: 'left',
    width: 100,
  },
  {
    title: '支付时间',
    dataIndex: 'pay_time',
    align: 'left',
    width: 160,
  },
  {
    title: '客服',
    dataIndex: 'waiter_name',
    align: 'left',
    width: 95,
  },
  {
    title: '支付状态',
    dataIndex: 'pay_status',
    align: 'left',
    width: 80,
  },
  {
    title: '医生',
    dataIndex: 'doctor_info',
    align: 'left',
    width: 140,
  },
  {
    title: '挂号订单',
    dataIndex: 'order_sn',
    slots: { customRender: 'order_sn' },
    align: 'left',
    width: 140,
    fixed: 'right',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'pay_time',
    label: '支付时间',
    component: 'RangePicker',
    colProps: { span: 8 },
    defaultValue: [],
  },
  {
    field: 'doctor_name',
    label: '医生姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'patient_name',
    label: '患者姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'patient_phone',
    label: '患者手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'order_no',
    label: '缴费编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'waiter_name',
    label: '客服姓名',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    field: 'pay_status',
    label: '支付状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        // { label: '未支付', value: '0' },
        { label: '已支付', value: '1' },
        { label: '已退款', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
];
