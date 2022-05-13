import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
export function getUserColumns(): BasicColumn[] {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      align: 'left',
      width: 40,
    },
    {
      title: '活动标题',
      dataIndex: 'title',
      align: 'left',
      width: 120,
    },
    // {
    //   title: '主讲专家',
    //   dataIndex: 'doctor.name',
    //   align: 'left',
    //   width: 80,
    // },
    {
      title: '地点',
      dataIndex: 'abstract_address',
      align: 'left',
      width: 60,
    },
    {
      title: '活动时间',
      dataIndex: 'meeting_time',
      // slots: { customRender: 'address' },
      align: 'left',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'meeting_status',
      align: 'left',
      width: 40,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'title',
      label: '活动标题',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入活动标题',
      },
    },
    {
      field: 'id',
      label: '活动ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入文章ID',
      },
      colProps: { span: 6 },
    },
    {
      field: 'meeting_status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: [
          { label: '报名中', value: 1 },
          { label: '进行中', value: 2 },
          { label: '已结束', value: 3 },
        ],
      },
      colProps: { span: 6 },
    },
    {
      field: 'meettime',
      label: '活动时间',
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
}

export const userFormSchema: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: '会议名称',
    required: true,
    componentProps: {
      placeholder: '请输入会议名称',
    },
  },
  {
    field: 'cover_img',
    label: `封面图`,
    slot: 'Picture',
    component: 'Input',
    // required: true,
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {},
      },
    ],
  },

  // {
  //   field: 'doctor',
  //   label: '主讲专家',
  //   // required: true,
  //   component: 'Input',
  //   slot: 'doctor_id',
  // },

  {
    field: 'address',
    label: '会议地点',
    required: true,
    slot: 'adress',
    component: 'Input',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {
          console.log(value)
        },
      },
    ],
  },

  // {
  //   field: 'meeting_status',
  //   label: '会议状态',
  //   required: true,
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '报名中', value: 1 },
  //       { label: '进行中', value: 2 },
  //       { label: '已结束', value: 3 },
  //     ],
  //     placeholder: '请选择会议状态',
  //   },
  // },
  {
    field: 'enter_time_end',
    label: '报名截止',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {
          console.log(value)
        },
      },
    ],
    slot: 'timestart',
    component: 'Input',
  },
  {
    field: 'meeting_time_starts',
    label: '会议时间',
    rules: [
      {
        required: true,
        // @ts-ignore
        validator: async (rule, value) => {
          console.log(value)
        },
      },
    ],
    slot: 'meetstart',
    component: 'RangePicker',
  },
  {
    field: 'enter_fee',
    label: '报名费',
    component: 'Input',
    required: true,
    slot: 'money',
  },

  {
    field: 'member_limit',
    label: '报名名额',
    component: 'Input',
    required: true,
  },
  {
    field: 'comment',
    component: 'Input',
    required: true,
    label: '会议介绍',
    // slot:'textarea',

    // rules: [{ required: true }],
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
    field: 'zb_url',
    label: '直播地址',
    componentProps: {
      placeholder: '请输入直播平台地址',
    },
    component: 'Input',
  },
  {
    field: 'video_url',
    label: '回放视频',
    component: 'Input',
    slot: 'videos',
  },
  {
    field: 'recommend',
    component: 'RadioGroup',
    label: '推荐首页',
    required: true,
    componentProps: {
      options: [
        { label: '推荐', value: 1 },
        { label: '不推荐', value: 2 },
      ],
    },
  },
  {
    field: 'sort',
    component: 'RadioGroup',
    label: '置顶',
    required: true,
    componentProps: {
      options: [
        { label: '置顶', value: 1 },
        { label: '不置顶', value: 2 },
      ],
    },
  },
];
