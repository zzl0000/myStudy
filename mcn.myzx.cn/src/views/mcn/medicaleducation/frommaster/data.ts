import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getNewsColumns(): BasicColumn[] {
  return [
    {
      title: '医生姓名',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 50,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 50,
    },
    {
      title: '医院',
      dataIndex: 'hospital_name',
      width: 100,
    },
    {
      title: '科室',
      dataIndex: 'ksname',
      width: 100,
    },
    {
      title: '职称',
      dataIndex: 'job_title',
      width: 100,
    },
    {
      title: '拜师',
      dataIndex: 'doctor_name',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40,
      slots: { customRender: 'status' },
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
      field: 'doctorname',
      label: '医生姓名',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入医生姓名',
      },
    },
    {
      field: 'title',
      label: '医生职称',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: [
          { label: '主任医师', value: 1 },
          { label: '副主任医师', value: 2 },
          { label: '主治医师', value: 3 },
          { label: '医师', value: 4 },
        ],
      },
      colProps: { span: 6 },
    },
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: [
          { label: '待审核', value: 0 },
          { label: '审核通过', value: 1 },
          { label: '审核拒绝', value: -1 },
        ],
      },
      colProps: { span: 6 },
    },
    {
      field: 'start_dates',
      label: '创建时间',
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
}

export const expertFormSchema: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    componentProps: {
      disabled: true,
    },

    label: '姓名',
  },
  {
    field: 'sex',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    label: '性别',
  },
  {
    field: 'age',
    component: 'Input',
    componentProps: {
      disabled: true,
    },

    label: '年龄',
  },
  {
    field: 'hospital_name',
    component: 'Input',
    componentProps: {
      disabled: true,
    },

    label: '医院',
  },
  {
    field: 'ksname',
    component: 'Input',
    componentProps: {
      disabled: true,
    },

    label: '科室',
  },
  {
    field: 'job_title',
    component: 'Input',
    componentProps: {
      disabled: true,
    },

    label: '职称',
  },
  {
    field: 'created_at',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    label: '申请时间',
  },

  {
    field: 'status',
    component: 'Select',
    label: '状态',
    required:true,

    componentProps: {
      options: [
        { label: '待审核', value: 0 },
        { label: '审核通过', value: 1 },
        { label: '审核拒绝', value: -1 },
      ],
    },
  },

  {
    field: 'reason',
    component: 'InputTextArea',
    label: '原因',
    required:true
  },
];
