import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '星期',
    dataIndex: 'doctor_title',
    width: 120,
    slots: { customRender: 'doctor' },
  },
  {
    title: '一',
    dataIndex: 'monday',
    slots: { customRender: 'week' },
  },
  {
    title: '二',
    dataIndex: 'tuesday',
    slots: { customRender: 'week' },
  },
  {
    title: '三',
    dataIndex: 'wednesday',
    slots: { customRender: 'week' },
  },
  {
    title: '四',
    dataIndex: 'thursday',
    slots: { customRender: 'week' },
  },
  {
    title: '五',
    dataIndex: 'friday',
    slots: { customRender: 'week' },
  },
  {
    title: '六',
    dataIndex: 'saturday',
    slots: { customRender: 'week' },
  },
  {
    title: '日',
    dataIndex: 'sunday',
    slots: { customRender: 'week' },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'doctor_name',
    label: '医生姓名',
    component: 'Input',
    helpMessage: ['查找医生', '可通过医生姓名查找医生!'],
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'patient_name',
    label: '患者姓名',
    required: true,
    component: 'Input',
  },
  {
    field: 'phone',
    label: '患者手机号',
    required: true,
    component: 'Input',
    slot: 'phone'
  },
  {
    field: 'sex',
    label: '患者性别',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '男', value: '0' },
        { label: '女', value: '1' },
      ],
    },
  },
  {
    label: '用户年龄',
    field: 'age',
    required: true,
    component: 'Input',
  },
  {
    label: '用户身份证号',
    field: 'idcard',
    required: true,
    component: 'Input',
  },
  {
    label: '患者微信号',
    field: 'wixin',
    component: 'Input',
  },
  {
    label: '省市',
    field: 'age',
    component: 'Cascader',
    componentProps: {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
            },
            {
              value: 'hangzhou',
              label: 'Hangzhou',
            },
          ],
        },
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
            },
            {
              value: 'hangzhou',
              label: 'Hangzhou',
            },
          ],
        },
      ],
    },
  },
  {
    label: '媒体来源',
    field: 'source',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '111', value: '0' },
        { label: '222', value: '1' },
      ],
    },
  },
  {
    label: '下次沟通时间',
    field: 'time',
    component: 'DatePicker',
  },
  {
    label: '疾病 ',
    field: 'jb',
    component: 'InputTextArea',
  },
  {
    field: 'yibao',
    label: '是否医保',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
  },
  {
    field: 'type',
    label: '患者分类',
    component: 'RadioButtonGroup',
    defaultValue: 'A',
    componentProps: {
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
      ],
    },
  },
  {
    field: 'agree',
    label: '意向',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: '2',
    componentProps: {
      options: [
        { label: '成交', value: '1' },
        { label: '意向', value: '2' },
        { label: '考虑', value: '3' },
        { label: '无意向', value: '4' },
      ],
    },
  },
  {
    label: '预约日期',
    field: 'time',
    component: 'DatePicker',
  },
  {
    label: '意向医生',
    field: 'doctor',
    component: 'Select',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
