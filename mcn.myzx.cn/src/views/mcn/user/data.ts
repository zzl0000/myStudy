import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { editUser } from '/@/api/sys/user';

/**
 * @description: 员工列定义
 */
export function getUserColumns(): BasicColumn[] {
  async function setRoleStatus(id: number, status: number | string): Promise<any> {
    return await editUser(id, { status: parseInt(status) });
  }
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      align: 'left',
      width: 30,
      defaultHidden: true,
    },
    {
      title: '员工姓名',
      dataIndex: 'title',
      fixed: 'left',
      align: 'left',
      width: 55,
    },
    {
      title: '登录账号',
      dataIndex: 'mobile',
      fixed: 'left',
      align: 'left',
      width: 110,
    },
    {
      title: '角色',
      dataIndex: 'role_titles',
      fixed: 'left',
      align: 'left',
      width: 110,
    },
    {
      title: '关联医生',
      dataIndex: 'managed_doctor_title',
      fixed: 'left',
      align: 'left',
      width: 110,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingStatus')) {
          record.pendingStatus = false;
        }
        return h(Switch, {
          checked: String(record.status) === '0',
          checkedChildren: '已启用',
          unCheckedChildren: '已禁用',
          loading: record.pendingStatus,
          onChange(checked: boolean) {
            record.pendingStatus = true;
            const newStatus = checked ? 0 : 1;
            console.log(newStatus);
            const { createMessage } = useMessage();
            setRoleStatus(record.id, newStatus)
              .then(() => {
                record.status = newStatus;
                createMessage.success(`已成功修改角色状态`);
              })
              .catch(() => {
                createMessage.error('修改角色状态失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
        });
      },
    },
    {
      title: '最后一次操作时间',
      dataIndex: 'updated_at',
      fixed: 'left',
      align: 'left',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'operator_title',
      fixed: 'left',
      align: 'left',
      width: 80,
    },
    {
      title: '最后一次登录',
      dataIndex: 'last_login_at',
      fixed: 'left',
      align: 'left',
      width: 120,
      defaultHidden: true,
    },
  ];
}

export function getUserSearchFormSchema(): FormSchema[] {
  return [
    {
      field: 'keywords',
      label: '关键词',
      component: 'Input',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '员工名称, 登录账号',
      },
    },
    {
      field: 'role',
      slot: 'role',
      component: 'Input',
      label: '角色',
      colProps: { span: 8 },
      defaultValue: '',
    },
    /*{
      field: 'role',
      label: '角色',
      component: 'ApiSelect',
      colProps: { span: 8 },
      required: true,
      componentProps: {
        api: getr,
        // use name as label
        labelField: 'title',
        // use id as value
        valueField: 'id',
        // not request untill to select
        immediate: false,
      },
    },*/
  ];
}

const isCreate = (id: number) => id === 0;

const isSuperAdmin = (roleIds: number[]) => {
  roleIds = roleIds == undefined ? [] : JSON.parse(JSON.stringify(roleIds));
  for (let i = 0; i < roleIds.length; i++) {
    console.log(String(roleIds[i]));
    if (String(roleIds[i]) === '1') {
      return true;
    }
  }
  return false;
};

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'id:',
    component: 'Input',
    show: false,
    defaultValue: 0,
  },
  {
    field: 'title',
    label: '员工姓名',
    required: true,
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '停用', value: 1 },
      ],
    },
  },
  {
    field: 'mobile',
    label: '手机号',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '用于登录',
    },
  },
  {
    field: 'userEmail',
    label: 'E-MAIL',
    required: false,
    component: 'Input',
    componentProps: {
      autocomplete: false,
    },
  },
  {
    field: 'userPassword',
    label: '密码',
    // required: ({ values }) => isCreate(values.id),
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '编辑时,不填入则不更新',
      autocomplete: false,
    },
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    required: true,
    component: 'Input',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (values.userPassword && value !== values.userPassword) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    componentProps: {
      autocomplete: false,
    },
  },
  {
    field: 'role_ids',
    slot: 'roleIds',
    component: 'Input',
    required: true,
    label: '角色',
    componentProps: {
      autocomplete: false,
    },
  },
  {
    field: 'managed_doctor_ids',
    slot: 'managedDoctorIds',
    component: 'Input',
    required: ({ values }) => !isSuperAdmin(values.role_ids),
    label: '关联医生',
    ifShow: ({ values }) => !isSuperAdmin(values.role_ids),
    componentProps: {
      autocomplete: false,
    },
  },
];
