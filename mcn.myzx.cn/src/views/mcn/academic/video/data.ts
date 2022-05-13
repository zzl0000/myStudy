import { number } from 'vue-types';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '视频ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '医生姓名',
      dataIndex: 'author',
      width: 50,
    },
    {
      title: '科室',
      dataIndex: 'kid_name',
      width: 80,
    },
    {
      title: '视频类型',
      dataIndex: 'specification',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      width: 40,
      // slots: { customRender: 'status' },
    },
    {
      title: '发布时间',
      dataIndex: 'release_time',
      width: 100,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'title',
      label: '视频标题：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入关键字',
      },
    },
    {
      field: 'id',
      label: '视频ID：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入视频ID',
      },
    },
    {
      field: 'name',
      label: '医生姓名：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入医生姓名',
      },
    },
    {
      field: 'fieldTime',
      label: '发布时间：',
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
}

export const expertFormSchema: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    required: true,
    label: '视频标题',
    componentProps: {
      placeholder: '请输入视频标题',
    },
    slot: 'title',
  },
  {
    field: 'img',
    component: 'Input',
    // required: true,
    slot: 'Picture',
    label: '视频封面',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {
          //   if (!value) {
          //     return Promise.reject('值不能为空');
          //   }
          //   if (value) {
          //     return Promise.reject('');
          //   }
          //   return Promise.resolve();
        },
        // trigger: 'blur',
      },
    ],
  },
  {
    field: 'url',
    component: 'Input',
    // required: true,
    slot: 'video',
    label: '视频文件',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {},
      },
    ],
  },
  {
    field: 'author',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {},
      },
    ],
    slot: 'Author',
    label: '视频医生',
  },
  {
    field: 'description',
    component: 'InputTextArea',
    required: true,
    label: '视频描述',
  },
  {
    field: 'kid',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {},
      },
    ],
    slot: 'kid',
    label: '视频所属科室',
  },
  {
    field: 'main_tag_id',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {},
      },
    ],
    slot: 'main_tag_id',
    label: '主标签',
  },
  {
    field: 'tags_ids',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {},
      },
    ],
    slot: 'tags_ids',
    label: '副标签',
  },
  {
    field: 'dname',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: async (rule, value) => {},
      },
    ],
    slot: 'dname',
    label: '疾病',
  },
  {
    field: 'type',
    component: 'Select',
    required: true,
    label: '视频类型',
    componentProps: {
      options: [
        { label: '竖屏', value: 1 },
        { label: '横屏', value: 0 },
      ],
    },
  },
  {
    field: 'status',
    component: 'Select',
    required: true,
    label: '视频状态',
    componentProps: {
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 },
      ],
    },
  },
  {
    field: 'is_app_recommend',
    component: 'RadioGroup',
    label: '推荐首页',
    required: true,
    componentProps: {
      options: [
        { label: '推荐', value: 2 },
        { label: '不推荐', value: 1 },
      ],
    },
  },
  {
    field: 'is_app_top',
    component: 'RadioGroup',
    label: '置顶',
    required: true,
    componentProps: {
      options: [
        { label: '置顶', value: 2 },
        { label: '不置顶', value: 1 },
      ],
    },
  },
];
