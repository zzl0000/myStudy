import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from "/@/components/Form";

export function getMenuColumns(): BasicColumn[] {
  return [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      align: 'left',
      width: 200,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      fixed: 'left',
      align: 'left',
      width: 40,
      slots: { customRender: 'icon' },
    },
    {
      title: '路径',
      dataIndex: 'full_path',
      key: 'full_path',
      fixed: 'left',
      align: 'left',
      width: 200,
    },
    {
      title: '组件',
      dataIndex: 'component',
      key: 'component',
      fixed: 'left',
      align: 'left',
      width: 200,
    },
    {
      title: '跳转',
      dataIndex: 'redirect',
      key: 'redirect',
      fixed: 'left',
      align: 'left',
      width: 200,
    },
  ];
}

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id:',
    component: 'Input',
    show: false,
    defaultValue: 0,
  },
  {
    field: 'title',
    label: '菜单名称(中文):',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '上级菜单:',
    component: 'TreeSelect',
    componentProps: {
      replaceFields: {
        title: 'title',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    defaultValue: -1,
    required: true,
  },
  {
    field: 'icon',
    label: '图标:',
    component: 'IconPicker',
    required: false,
    defaultValue: '',
  },
  {
    field: 'sort',
    label: '排序:',
    component: 'InputNumber',
    required: false,
    defaultValue: 0,
  },
  {
    field: 'full_path',
    label: '路由地址:',
    component: 'Input',
    required: true,
    defaultValue: '/',
  },
  {
    field: 'component',
    label: '组件路径:',
    component: 'Input',
    defaultValue: 'LAYOUT',
    required: true,
  },
  {
    field: 'redirect',
    label: '跳转路径:',
    component: 'Input',
    defaultValue: '',
  },
  {
    field: 'hide_menu',
    label: '状态:',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '显示', value: 0 },
        { label: '隐藏', value: 1 },
      ],
    },
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
