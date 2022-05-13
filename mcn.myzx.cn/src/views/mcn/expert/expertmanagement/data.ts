import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '患者姓名',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 40,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 50,
    },
    {
      title: '主要症状',
      dataIndex: 'symptom',
      width: 150,
    },
    {
      title: '提交医生',
      dataIndex: 'doctor_phone',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slots: { customRender: 'status' },
      // customRender: ({ text }) => {
      //   if (text.code === 0) {
      //     return '待审核';
      //   } else if (text.code === 1) {
      //     return '审核通过';
      //   } else if (text.code === -1) {
      //     return '审核拒绝';
      //   }
      //   return '';
      // },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 100,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'doctor_phone',
      label: '医生手机号',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入医生手机号',
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '待审核', value: 0 },
          { label: '申请通过', value: 1 },
          { label: '申请驳回', value: -1 },
        ],
      },
      colProps: { span: 4 },
    },
    {
      field: 'fieldTime',
      label: '创建时间',
      component: 'RangePicker',
      colProps: { span: 8 },
    },
  ];
}

export const expertFormSchema: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: '患者姓名',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'sex',
    component: 'Select',
    label: '性别',
    componentProps: {
      disabled: true,
      options: [
        { label: '女', value: 0 },
        { label: '男', value: 1 },
      ],
    },
  },
  {
    field: 'age',
    component: 'Input',
    label: '年龄',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'symptom',
    component: 'InputTextArea',
    label: '主要症状',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'doctor_phone',
    component: 'Input',
    label: '提交医生',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'created_at',
    component: 'Input',
    label: '申请时间',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'checklist',
    component: 'Input',
    label: '检查单',
    slot: 'picture',
    // componentProps: {
    //   disabled: true,
    // },
  },
  {
    field: 'status',
    component: 'Select',
    label: '状态',
    // required: true,
    // defaultValue: ,

    componentProps: {
      options: [
        { label: '申请通过', value: 1 },
        { label: '申请驳回', value: -1 },
      ],
    },
  },
  {
    field: 'reason',
    component: 'Input',
    label: '诊疗方案',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
  },
];
