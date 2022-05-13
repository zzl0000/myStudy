import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getUserColumns(): BasicColumn[] {
  return [
    {
      title: '编号',
      dataIndex: 'did',
      align: 'left',
      width: 40,
    },
    {
      title: '医生姓名',
      dataIndex: 'name',
      align: 'left',
      width: 50,
    },
    {
      title: '注册电话',
      dataIndex: 'phone',
      align: 'left',
      width: 80,
    },
    {
      title: '科室',
      dataIndex: 'dept_name',
      align: 'left',
      width: 80,
    },
    {
      title: '医院',
      dataIndex: 'hospital_name',
      align: 'left',
      width: 100,
    },
    {
      title: '职称',
      dataIndex: 'tid_name',
      align: 'left',
      width: 60,
    },
    {
      title: '地区',
      dataIndex: 'region',
      align: 'left',
      width: 100,
    },
    {
      title: '注册时间',
      dataIndex: 'add_time',
      align: 'left',
      width: 80,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'keywords',
      label: '医生信息',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '姓名/手机号',
      },
    },
    {
      field: 'kid2',
      label: '科室',
      component: 'ApiSelect',
      colProps: { span: 6 },
      slot: 'keshi',
    },

    {
      field: 'hospital_name',
      label: '医院',
      component: 'ApiSelect',
      colProps: { span: 6 },
      slot: 'hospital',
    },
    {
      field: 'tid',
      label: '职称',
      component: 'ApiSelect',
      colProps: { span: 6 },
      slot: 'tid',
    },
  ];
}

export const userFormSchema: FormSchema[] = [
  {
    field: 'pharmacyName',
    component: 'Select',
    slot: 'pharmacy',
    required: true,
    label: '可见药房',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'defaultpharmacyName',
    label: '默认药房',
    slot: 'defaultsPharmacys',
    component: 'Select',
    required: true,
    colProps: {
      span: 20,
    },
  },
  {
    field: 'video',
    label: '',
    component: 'Input',
    slot: 'wenzhen',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'videoSwitch',
    label: '视频问诊',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      size: 'small',
      options: [
        { label: '开', value: 1 },
        { label: '关', value: -1 },
      ],
    },
    colProps: {
      span: 6,
    },
  },
  {
    field: 'videoPrice',
    label: '问诊金额',
    // required: true,
    component: 'Input',
    colProps: {
      span: 14,
    },
    componentProps: {
      maxLength: 6,
    },
  },
  {
    field: 'callSwitch',
    label: '电话问诊',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      size: 'small',
      options: [
        { label: '开', value: 1 },
        { label: '关', value: -1 },
      ],
    },
    colProps: {
      span: 6,
    },
  },
  {
    field: 'callPrice',
    label: '问诊金额',
    // required: true,
    component: 'Input',
    colProps: {
      span: 14,
    },
    componentProps: {
      maxLength: 6,
    },
  },
  {
    field: 'viewSwitch',
    label: '图文问诊',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      size: 'small',
      options: [
        { label: '开', value: 1 },
        { label: '关', value: -1 },
      ],
    },
    colProps: {
      span: 6,
    },
  },
  {
    field: 'viewPrice',
    label: '问诊金额',
    // required: true,
    component: 'Input',
    colProps: {
      span: 14,
    },
    componentProps: {
      maxLength: 6,
    },
  },
  {
    field: 'free',
    component: 'Switch',
    label: '',
    slot: 'switch',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'freeDeliveryLimit',
    label: '快递设置',
    component: 'Input',
    colProps: {
      span: 18,
    },
    renderComponentContent: () => {
      return {
        prefix: () => '药费满  ',
        suffix: () => '元包邮',
      };
    },
    componentProps: {
      maxLength: 6,
    },
    suffix: '注：该医生开具的处方药费满足设置的金额，患者支付处方可免运费。',
  },
];
