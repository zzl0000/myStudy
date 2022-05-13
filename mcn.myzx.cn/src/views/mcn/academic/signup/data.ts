import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '姓名',
      dataIndex: 'doctor_name',
      width: 40,
    },
    {
      title: '手机号码',
      dataIndex: 'doctor_phone',
      width: 150,
    },
    {
      title: '就职医院',
      dataIndex: 'hospital_name',
      width: 50,
    },
    {
      title: '报名费',
      dataIndex: 'enter_fee',
      width: 80,
    },
    {
      title: '报名时间',
      dataIndex: 'created_at',
      width: 100,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '姓名',
      component: 'Input',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      field: 'mobile',
      label: '手机号码',
      component: 'Input',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '请输入手机号码',
      },
    },
    {
      field: 'fieldTime',
      label: '报名时间',
      component: 'RangePicker',
      colProps: { span: 8 },
    },
  ];
}