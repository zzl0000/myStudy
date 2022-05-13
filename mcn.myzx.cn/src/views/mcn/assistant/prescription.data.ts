import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '处方编号',
    dataIndex: 'order_no',
    align: 'center',
    width: 150,
  },
  {
    title: '患者',
    dataIndex: 'patient_name',
    align: 'center',
    slots: { customRender: 'patientName' },
    width: 70,
  },
  {
    title: '患者手机号',
    dataIndex: 'patient_mobile',
    align: 'center',
    width: 110,
  },
  {
    title: '医生',
    dataIndex: 'doctor_name',
    align: 'center',
    width: 70,
  },
  {
    title: '订单金额',
    // dataIndex: 'total_fee',
    dataIndex: 'orderFeeGroup',
    align: 'center',
    width: 140,
    slots: { customRender: 'orderFeeGroup' },
  },
  {
    title: '支付时间',
    dataIndex: 'order.pay_time',
    align: 'center',
    width: 120,
  },
  {
    title: '药房',
    dataIndex: 'pharmacy.pharmacy_name',
    align: 'center',
    width: 80,
  },
  {
    title: '剂型',
    dataIndex: 'dosage_form',
    align: 'center',
    width: 80,
  },
  {
    title: '初/复诊',
    dataIndex: 'visit_des',
    align: 'center',
    width: 80,
  },
  {
    title: '订单状态',
    dataIndex: 'status_name',
    align: 'center',
    slots: { customRender: 'orderStatus' },
    width: 90,
  },
  {
    title: '订单时间',
    dataIndex: 'created_at',
    align: 'center',
    width: 120,
  },
  {
    title: '问诊编号',
    dataIndex: 'physician_sn',
    align: 'center',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'make',
    align: 'center',
    width: 60,
  },

  {
    title: '付款状态',
    dataIndex: 'pay_status_name',
    align: 'center',
    width: 90,
    slots: { customRender: 'payStatus' },
    fixed: 'right',
  },

  {
    title: '医助代付',
    dataIndex: 'payment',
    width: 90,
    slots: { customRender: 'payment' },
    align: 'center',
    fixed: 'right',
  },
  {
    title: '支付码',
    dataIndex: 'paycode',
    width: 90,
    slots: { customRender: 'paycode' },
    align: 'center',
    fixed: 'right',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'patient_name',
    label: '患者姓名',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'patient_mobile',
    label: '患者手机号',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    field: 'doctor_name',
    label: '医生姓名',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '开方医生的姓名',
    },
  },
  {
    field: 'order_no',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'pay_status',
    label: '支付状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        {
          label: '待付款',
          value: '1',
          key: '1',
        },
        {
          label: '已付款',
          value: '2',
          key: '2',
        },
        {
          label: '退款中',
          value: '3',
          key: '3',
        },
        {
          label: '已退款',
          value: '4',
          key: '4',
        },
        {
          label: '已完成',
          value: '5',
          key: '5',
        },
      ],
    },
  },
  {
    field: 'status',
    label: '订单状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        {
          label: '待初审',
          value: '9',
          key: '1',
        },
        {
          label: '初审通过（未支付）',
          value: '10',
          key: '2',
        },
        {
          label: '审核不通过',
          value: '12',
          key: '12',
        },
        {
          label: '待复审',
          value: '11',
          key: '3',
        },
        {
          label: '待发货',
          value: '6',
          key: '4',
        },
        {
          label: '已发货',
          value: '7',
          key: '5',
        },
        {
          label: '已收货',
          value: '8',
          key: '6',
        },
        {
          label: '已撤回',
          value: '13',
          key: '7',
        },
        {
          label: '退款中',
          value: '20',
          key: '8',
        },
        {
          label: '已退款',
          value: '21',
          key: '9',
        },
      ],
    },
  },
  {
    field: 'dosage_name',
    label: '剂型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        {
          label: '中药饮片',
          value: '中药饮片',
          key: '1',
        },
        {
          label: '颗粒剂',
          value: '颗粒剂',
          key: '2',
        },
        {
          label: '西药与中成药',
          value: '西药与中成药',
          key: '86',
        },
      ],
    },
  },
  {
    label: '创建时间',
    field: 'created_at',
    component: 'RangePicker',
  },
];
