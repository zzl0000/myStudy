import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export function getExpertsColumns(): BasicColumn[] {
  return [
    {
      title: '文章ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '专家',
      dataIndex: 'doctor_name',
      width: 50,
    },
    {
      title: '类型',
      dataIndex: 'category_title',
      width: 80,
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
      field: 'keywords',
      label: '文章标题：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      field: 'id',
      label: '文章ID：',
      component: 'Input',
      colProps: { span: 6 },
      componentProps: {
        placeholder: '请输入文章ID',
      },
    },
    {
      field: 'category_id',
      label: '类型：',
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
    {
      field: 'fieldTime',
      label: '发布时间：',
      component: 'RangePicker',
      colProps: { span: 6 },
    },
  ];
}
