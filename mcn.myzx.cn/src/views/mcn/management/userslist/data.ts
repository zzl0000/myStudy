import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'did',
      width: 40,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 70,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 50,
    },
    {
      title: '职称',
      dataIndex: 'title',
      width: 80,
    },
    {
      title: '医院',
      dataIndex: 'hospital_name',
      width: 140,
    },
    {
      title: '审核状态',
      dataIndex: 'status_name',
      width: 70,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'phone',
      label: '手机号',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      field: 'name',
      label: '用户姓名',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入医生姓名',
      },
    },
    {
      field: 'examine_status',
      label: '审核状态',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: [
          { label: '未提交', value: 3 },
          { label: '待审核', value: 0 },
          { label: '审核通过', value: 1 },
          { label: '审核失败', value: 2 },
        ],
      },
    },
  ];
}

export const expertFormSchema: FormSchema[] = [
  {
    field: 'phone',
    component: 'Input',
    required: true,
    label: '注册手机号',
    slot:'phones',

    componentProps: {
      placeholder: '请输入注册手机号',
    },
  },
  {
    field: 'name',
    component: 'Input',
    required: true,
    label: '医生姓名',
    slot:'names',

    componentProps: {
      placeholder: '请输入医生姓名',
    },
    colProps: {
      span: 14,
    },
  },
  {
    field: 'sex',
    component: 'Select',
    required: true,
    label: '性别',
    slot:'sexs',

    componentProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
  },
  {
    field: 'selfie',
    component: 'Input',
    // required: true,
    label: '头像/半身照',
    slot: 'UP',
  },
  {
    field: 'tid',
    label: '医生职称',
    component: 'Select',
    required: true,
    slot:'tids',

    componentProps: {
      options: [
        { label: '主任医师 ', value: 22 },
        { label: '副主任医师', value: 72 },
        { label: '主治医师', value: 48 },
        { label: '住院医师', value: 62 },
        { label: '其他', value: 68 },
      ],
    },
  },
  {
    field: 'hospital_id',
    component: 'Select',
    required: true,
    label: '医院及科室',
    slot: 'hospital_id',
    colProps: {
      span: 14,
    },
  },
  {
    field: 'kid1',
    component: 'Input',
    required: true,
    slot: 'kid1',
    label: '',
    colProps: {
      span: 7,
    },
  },
  {
    field: 'id_card_z',
    component: 'Input',
    // required: true,
    label: '身份证正反面',
    slot: 'sfz',

  },
  {
    field: 'cop_img1',
    component: 'Input',
    // required: true,
    label: '医师执业证书',
    slot: 'zy',

  },
  {
    field: 'seniority1',
    component: 'Input',
    // required: true,
    label: '医师资格证书',
    slot: 'zg',

  },
  {
    field: 'title_img',
    component: 'Input',
    // required: true,
    slot: 'zs',
    label: '职称证书',
  },
  {
    field: 'id_card',
    component: 'Input',
    // required: true,
    label: '身份证号',
    slot:'id_card',
    componentProps: {
      placeholder: '请输入身份证号',
    },
  },
  {
    field: 'zigecard_number',
    component: 'Input',
    // required: true,
    label: '医师资格证号',
    slot:'zigecard_number',

    componentProps: {
      placeholder: '请输入医师资格证号',
    },
  },
  {
    field: 'disease_pro',
    component: 'Input',
    slot:'disease_pros',

    label: '擅长疾病',
    componentProps: {
      placeholder: '请输入擅长疾病',
    },
  },
  {
    field: 'disease',
    component: 'InputTextArea',
    slot:'diseases',

    label: '医生擅长',
  },
  {
    field: 'desc',
    slot:'descs',

    component: 'InputTextArea',
    label: '医生简介',
  },
  {
    field: 'examine_status',
    label: '审核状态',
    component: 'Select',
    colProps: { span: 6 },
    slot:'selectstatus',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '审核通过', value: 1 },
        { label: '审核失败', value: 2 },
      ],
    },
  },
  {
    field: 'audit_status_reason',
    component: 'InputTextArea',
    label: '拒绝原因',
    slot:'text',
  },
];
