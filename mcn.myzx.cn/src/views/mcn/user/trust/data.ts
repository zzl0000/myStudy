import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Table';

/**
 * @description: 权限列定义
 */
export function getPermissionColumns(): BasicColumn[] {
  return [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      align: 'left',
      width: 300,
    },
    {
      title: '方法',
      dataIndex: 'method',
      fixed: 'left',
      align: 'left',
      width: 60,
    },
    {
      title: '路径',
      dataIndex: 'path',
      fixed: 'left',
      align: 'left',
      width: 220,
    },
    {
      title: '描述',
      dataIndex: 'description',
      fixed: 'left',
      align: 'left',
      width: 220,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      fixed: 'left',
      align: 'left',
      width: 120,
    },
    {
      title: '最后编辑',
      dataIndex: 'updated_at',
      fixed: 'left',
      align: 'left',
      width: 120,
      defaultHidden: true,
    },
  ];
}

/**
 * @description: 权限表单定义
 */
export const permissionFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id:',
    component: 'Input',
    show: false,
    defaultValue: 0,
  },
  {
    field: 'title',
    label: '权限名称:',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '上级权限:',
    component: 'TreeSelect',
    defaultValue: 0,
    componentProps: {
      replaceFields: {
        title: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'method',
    label: '请求方法',
    component: 'RadioButtonGroup',
    defaultValue: 'get',
    componentProps: {
      options: [
        { label: 'Get', value: 'get' },
        { label: 'Post', value: 'post' },
        { label: 'Put', value: 'put' },
        { label: 'Delete', value: 'delete' },
        { label: 'Patch', value: 'patch' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'path',
    label: '请求路径:',
    component: 'Input',
    required: true,
    defaultValue: '',
  },
  {
    field: 'description',
    label: '权限描述:',
    component: 'InputTextArea',
    required: false,
  },
  {
    field: 'organization_types',
    component: 'CheckboxGroup',
    label: '菜单隶属:',
    componentProps: {
      options: [
        {
          label: '公共',
          value: '0',
        },
        {
          label: '普通MCN',
          value: '1',
        },
        {
          label: '联科MCN',
          value: '2',
        },
      ],
    },
  },
];

export function getRoleColumns(): BasicColumn[] {
  return [
    {
      title: '角色名称',
      dataIndex: 'title',
      key: 'title',
      align: 'left',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'left',
      width: 180,
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      align: 'left',
      key: 'updated_at',
      width: 180,
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'left',
      key: 'description',
      width: 300,
    },
  ];
}

export const roleFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id:',
    component: 'Input',
    show: false,
    defaultValue: 0,
  },
  {
    field: 'title',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'description',
    label: '描述',
    required: false,
    component: 'InputTextArea',
  },
  {
    label: '权限',
    field: 'permissions',
    slot: 'permissions',
    component: 'Input',
  },
];

