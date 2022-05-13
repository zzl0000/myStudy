import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '内容ID',
      dataIndex: 'context_id',
      width: 40,
    },
    {
      title: '内容标题',
      dataIndex: 'context_title',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'context',
      width: 50,
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      width: 80,
    },
    {
      title: '评论人',
      dataIndex: 'author',
      width: 100,
    },
    {
      title: '评论时间',
      dataIndex: 'created_at',
      width: 100,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'keywords',
      label: '内容标题：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入内容标题',
      },
    },
    {
      field: 'context_id',
      label: '文章ID：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入文章ID',
      },
    },
    {
      field: 'context',
      label: '内容类型：',
      component: 'Select',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '状态',
        options: [
          { label: '学术活动', value: 1 },
          { label: '论文精选', value: 2 },
          { label: ' 百家讲坛', value: 3 },
          { label: ' 病案分享', value: 4 },
          { label: ' 专家文章', value: 5 },
          { label: ' 新闻资讯', value: 6},
          { label: ' 科普视频', value: 7 },
        ],
      },
    },
    {
      field: 'created_at',
      label: '评论时间：',
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
}
