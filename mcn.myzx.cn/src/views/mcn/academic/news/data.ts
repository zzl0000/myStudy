import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getNewsColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 40,
      slots: { customRender: 'status' },
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'title',
      label: '标题：',
      component: 'Input',
      colProps: { span: 10 },
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      field: 'fieldTime',
      label: '发布时间：',
      component: 'RangePicker',
      colProps: { span: 10 },
    },
  ];
}

export const expertFormSchema: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    required: true,
    label: '资讯标题',
    componentProps: {
      placeholder: '请输入资讯标题',
    },
  },
  {
    field: 'cover_img',
    component: 'Upload',
    label: '封面图',
    slot: 'UP',
    // required: true,
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {
          // console.log(rule, value, '0000000000000');
        },
      },
    ],
  },
  {
    field: 'source',
    component: 'Input',
    label: '来源',
    required: true,
    componentProps: {
      placeholder: '请输入文章来源',
    },
  },
  {
    field: 'view_count_basic',
    component: 'Input',
    label: '阅读人数',
    required: true,
    componentProps: {
      placeholder: '请输入阅读人数',
    },
  },
  {
    field: 'content',
    component: 'Input',
    required: true,
    label: '描述',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject('值不能为空');
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
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
    field: 'status',
    component: 'RadioGroup',
    required: true,
    label: '状态',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '下架', value: 2 },
      ],
    },
  },
  {
    field: 'is_recommend',
    component: 'RadioGroup',
    label: '推荐首页',
    required: true,
    componentProps: {
      options: [
        { label: '推荐', value: 1 },
        { label: '不推荐', value: 0 },
      ],
    },
  },
  {
    field: 'is_top',
    component: 'RadioGroup',
    label: '置顶',
    required: true,
    componentProps: {
      options: [
        { label: '置顶', value: 1 },
        { label: '不置顶', value: 0 },
      ],
    },
  },
];
