import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '专家ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '专家',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '职称',
      dataIndex: 'title',
      width: 50,
    },
    {
      title: '所属医院',
      dataIndex: 'hospital_name',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'expert_type_name',
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '专家姓名：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入专家姓名',
      },
    },
    {
      field: 'tid',
      label: '职称：',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: [
          { label: '主任医师', value: 22 },
          { label: '副主任医师', value: 72 },
          { label: '主治医师', value: 48 },
          { label: '住院医师', value: 62 },
          { label: '其他', value: 68 },
        ],
      },
    },
    {
      field: 'hospital_name',
      label: '所属医院：',
      component: 'Input',
      colProps: { span: 6 },
    },
    {
      field: 'expert_type_id',
      label: '类型：',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: [
          { label: '顾问', value: 1 },
          { label: '专家', value: 2 },
        ],
      },
    },
  ];
}

export let num = '';
const isOtherMedium = (apprentice: number) => apprentice === 1;
export const expertFormSchema: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    required: true,
    label: '专家姓名',
    componentProps: {
      placeholder: '请输入专家姓名',
    },
  },
  {
    field: 'sex',
    component: 'Select',
    required: true,
    label: '性别',
    componentProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
      ],
      onChange: (e: any) => {
        num = e;
      },
    },
    colProps: {
      span: 14,
    },
  },
  {
    field: 'avatar',
    component: 'AutoComplete',
    required: true,

    slot: 'pictor',
    label: '头像/半身照',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {},
      },
    ],
  },
  {
    field: 'hid',
    component: 'Input',
    required: true,
    slot: 'hid',
    label: '所属医院',
    //  rules: [
    //   {
    //     required: true,
    //     // @ts-ignore
    //     validator: async (rule, value) => {},
    //   },
    // ],
  },
  {
    field: 'department_1_id',
    component: 'Input',
    required: true,
    label: '科室',
    slot: 'department_1_id',
  },
  {
    field: 'tid',
    component: 'Select',
    required: true,
    label: '职称',
    // slot: 'disease',
    componentProps: {
      options: [
        { label: '主任医师', value: 22 },
        { label: '副主任医师', value: 72 },
        { label: '主治医师', value: 48 },
        { label: '住院医师', value: 62 },
        { label: '其他', value: 68 },
      ],
    },
  },
  {
    field: 'expert_type_id',
    component: 'Select',
    label: '专家类型',
    required: true,
    componentProps: {
      options: [
        { label: '顾问', value: 1 },
        { label: '专家', value: 2 },
      ],
    },
  },
  {
    field: 'disease',
    component: 'Input',
    required: true,
    label: '擅长疾病',
  },
  {
    field: 'tags',
    component: 'Input',
    required: true,
    label: '专家标签',
    suffix: '多个标签用逗号隔开',
  },
  {
    field: 'good_at',
    component: 'InputTextArea',
    required: true,
    label: '专家擅长',
  },
  {
    field: 'desc',
    component: 'InputTextArea',
    required: true,
    label: '专家简介',
  },
  {
    field: 'scientific_result',
    component: 'InputTextArea',
    label: '科研成果',
  },
  {
    field: 'honor',
    component: 'InputTextArea',
    label: '荣誉表彰',
  },
  {
    field: 'apprentice',
    component: 'Select',
    label: '是否授徒',
    required: true,

    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    field: 'apprentice_topic',
    component: 'Input',
    label: '师承授徒专题页',
    ifShow: ({ values }) => isOtherMedium(values.apprentice),
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
      });
    },
    colProps: {},
  },
  {
    field: 'reco',
    component: 'RadioGroup',
    label: '是否推荐',
    required: true,
    componentProps: {
      options: [
        { label: '推荐', value: 1 },
        { label: '不推荐', value: 0 },
      ],
    },
  },
  {
    field: 'sort',
    required: true,

    component: 'Input',
    label: '排序',
  },
];
