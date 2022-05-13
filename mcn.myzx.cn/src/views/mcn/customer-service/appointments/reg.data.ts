import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '患者信息',
    dataIndex: 'patient.uname',
    slots: { customRender: 'patientName' },
    align: 'center',
    width: 140,
  },
  {
    title: '手机号',
    dataIndex: 'patient.mobile',
    align: 'center',
    width: 120,
  },
  {
    title: '医生',
    dataIndex: 'doctor_name',
    align: 'center',
    width: 120,
  },
  {
    title: '问诊科室',
    dataIndex: 'ks2name',
    align: 'center',
    width: 120,
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
    align: 'center',
    width: 120,
  },
  {
    title: '预收款',
    dataIndex: 'advance_money',
    align: 'center',
    width: 120,
  },
  {
    title: '缴费编号',
    dataIndex: 'register_order_no',
    align: 'center',
    width: 120,
  },
  {
    title: '预约时间',
    dataIndex: 'dial_time',
    align: 'center',
    width: 120,
    slots: { customRender: 'dial_time' },
  },
  {
    title: '问诊类型',
    dataIndex: 'type',
    slots: { customRender: 'category' },
    align: 'center',
    width: 100,
  },
  {
    title: '支付时间',
    dataIndex: 'pay_time',
    align: 'center',
    width: 120,
  },

  {
    title: '患者来源',
    dataIndex: 'dp_relation',
    align: 'center',
    width: 100,
  },

  {
    title: '初诊/复诊',
    dataIndex: 'patient.visit',
    align: 'center',
    width: 100,
  },
  {
    title: '订单编号',
    dataIndex: 'order_sn',
    align: 'center',
    width: 120,
  },
  {
    title: '订单状态',
    // dataIndex: 'order_status',
    dataIndex: 'status',
    align: 'center',
    slots: { customRender: 'status' },
    width: 100,
  },
  {
    title: '开方状态',
    dataIndex: 'prescription',
    align: 'center',
    width: 100,
  },

  {
    title: '是否购药',
    dataIndex: 'buy_medicine',
    align: 'center',
    width: 100,
  },
  {
    title: '剩余问诊时长',
    dataIndex: 'expire',
    align: 'center',
    slots: { customRender: 'expire' },
    width: 160,
  },
  {
    title: '订单来源',
    dataIndex: 'source',
    align: 'center',
    width: 160,
  },
  {
    title: '客服',
    dataIndex: 'mcn_user',
    align: 'left',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'order_desc',
    align: 'center',
    width: 160,
  },
  {
    title: '付款状态',
    dataIndex: 'pay_status',
    align: 'center',
    slots: { customRender: 'payStatus' },
    width: 100,
    fixed: 'right',
  },
  // {
  //   title: '客服代付',
  //   dataIndex: 'payment',
  //   width: 100,
  //   slots: { customRender: 'payment' },
  //   align: 'center',
  //   fixed: 'right',
  //   // defaultHidden:true,
  // },
  // {
  //   title: '支付码',
  //   dataIndex: 'paycode',
  //   width: 100,
  //   slots: { customRender: 'paycode' },
  //   align: 'center',
  //   fixed: 'right',
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'patient_u',
    label: '患者姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'doctor_key',
    label: '医生姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'patient_m',
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
    field: 'created_at',
    label: '创建时间',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '订单状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '未开始', value: '1' },
        { label: '待看诊', value: '2' },
        { label: '问诊中', value: '3' },
        { label: '已结束', value: '4' },
        { label: '退款中', value: '5' },
        { label: '已退款', value: '6' },
        { label: '待支付', value: '7' },
        { label: '已取消', value: '8' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'pay_status',
    label: '付款状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已支付', value: '1' },
        { label: '未支付', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'source',
    label: '患者来源',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '线上(自主关注)', value: '1' },
        { label: '医带患', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'source1',
    label: '订单来源',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '自主预约', value: '1' },
        { label: '客服创建', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'prescription',
    label: '开方状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已开方', value: '1' },
        { label: '未开方', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'buy_medicine',
    label: '是否购药',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已购药', value: '1' },
        { label: '未购药', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
  // {
  //   field: 'preliminary_data',
  //   label: '是否完善病例',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '全部', value: '' },
  //       { label: '是', value: '1' },
  //       { label: '否', value: '0' },
  //     ],
  //   },
  //   colProps: { span: 6 },
  // },
  {
    field: 'mcn_user_id',
    label: '客服',
    component: 'Input',
    // componentProps: {
    //   options: [
    //     { label: '全部', value: '' },
    //     { label: '是', value: '1' },
    //     { label: '否', value: '0' },
    //   ],
    // },
    colProps: { span: 6 },
    slot: 'custom',
  },
  {
    field: 'dial_time',
    label: '就诊时间',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'patient_name',
    label: '就诊人',
    required: true,
    component: 'Select',
  },
  {
    field: 'patient_phone',
    label: '手机号',
    required: true,
    component: 'Input',
  },
  {
    field: 'patient_age',
    label: '年龄',
    required: true,
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 150,
    },
  },
  {
    field: 'patient_sex',
    label: '性别',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '男', value: '1' },
        { label: '女', value: '0' },
      ],
    },
  },
  {
    label: '预约医生',
    field: 'doctor_name',
    required: true,
    component: 'Input',
  },
  {
    label: '就诊类型',
    field: 'type',
    component: 'RadioButtonGroup',
    defaultValue: '5',
    componentProps: {
      options: [
        { label: '视频问诊', value: '6' },
        { label: '图文问诊', value: '1' },
        { label: '电话问诊', value: '5' },
      ],
    },
  },
  {
    label: '金额',
    field: 'amount',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      disabled: true,
      style: 'border: none;',
    },
  },
  {
    label: '挂号时间',
    field: 'time',
    required: true,
    component: 'DatePicker',
    slot: 'time',
  },
  {
    label: '备注',
    field: 'desc',
    component: 'InputTextArea',
  },
  {
    field: 'callback_type',
    label: '有效时长',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '30分钟', value: 'qrcode' },
        { label: '8小时', value: '2' },
        { label: '24小时', value: '3' },
        { label: '72小时', value: '4' },
      ],
    },
  },
  {
    field: 'callback_type',
    label: '发送方式',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '生成二维码发送给患者(患者在微信内识别二维码关注公众号)', value: 'qrcode' },
        { label: '给患者手机号发送短信(短信链接引导患者关注公众号支付)', value: '2' },
        { label: '直接生成支付二维码(患者识别二维码后直接支付)', value: '3' },
      ],
    },
  },
];
