import { ComponentProps } from './../../../../components/Tree/src/TreeIcon';
import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: 'id',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
    },
    {
      title: '图片',
      dataIndex: 'img',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40,
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      width: 100,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'title',
      label: '标题：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入标题',
      },
    },
    {
      field: 'status',
      label: '状态：',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        options: [
          { label: '论文精选', value: 1 },
          { label: '百家讲坛', value: 2 },
          { label: '病案分享', value: 3 },
        ],
      },
    },
    
  ];
}

export let num = '';

export const expertFormSchema: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    required: true,
    label: '文章标题',
    componentProps: {
      placeholder: '请输入文章标题',
    },
  },
  {
    field: 'category_id',
    component: 'Select',
    required: true,
    label: '类型',
    componentProps: {
      options: [
        { label: '论文精选', value: 1 },
        { label: '百家讲坛', value: 2 },
        { label: '病案分享', value: 3 },
        { label: '专家文章', value: 4 },
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
    field: 'doctor_id',
    component: 'AutoComplete',
    required: true,
    label: '主讲专家',
    componentProps: {
      placeholder: '请输入专家姓名',
    },
  },
  {
    field: 'content',
    component: 'Input',
    required: true,
    label: '内容描述',
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
  {
    field: 'department_1_id',
    component: 'Input',
    required: true,
    label: '关联科室',
    slot: 'department',
    componentProps: {
      placeholder: ' 请输入文章关联的科室',
    },
  },
  {
    field: 'disease_id',
    component: 'Input',
    required: true,
    label: '关联疾病',
    slot: 'disease',
    componentProps: {
      placeholder: '请输入文章关联的疾病名称',
    },
  },
  {
    field: 'view_count_basic',
    component: 'Input',
    label: '阅读人数',
    componentProps: {
      placeholder: '请输入阅读人数',
    },
  },
  {
    field: 'status',
    component: 'RadioGroup',
    required: true,
    label: '状态',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '下架', value: 0 },
      ],
    },
  },
  {
    field: 'recommended',
    component: 'RadioGroup',
    label: '推荐首页',
    componentProps: {
      options: [
        { label: '推荐', value: 1 },
        { label: '不推荐', value: 0 },
      ],
    },
  },
  {
    field: 'toped',
    component: 'RadioGroup',
    label: '置顶',
    componentProps: {
      options: [
        { label: '置顶', value: 1 },
        { label: '不置顶', value: 0 },
      ],
    },
  },
];
