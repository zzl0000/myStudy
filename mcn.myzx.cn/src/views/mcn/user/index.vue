<template>
  <PageWrapper title="员工管理">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" class="ml-2" @click="handleCreate"> + 新增员工 </a-button>
      </template>
      <template #form-role="{ model, field }">
        <select class="ant-input" v-model="model[field]">
          <option value="">请选择</option>
          <option v-for="item in roles" :key="item" :value="item.id">{{ item.title }}</option>
        </select>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除菜单',
                label: '删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserColumns, getUserSearchFormSchema } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { getUserList, destroyUser } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import UserDrawer from './UserDrawer.vue';
  import { ApiSelect } from '/@/components/Form/index';
  import { getRoles } from '/@/api/sys/role';
  import { RoleModel } from '/@/api/sys/model/roleModel';

  export default defineComponent({
    name: 'User',
    components: { BasicTable, PageWrapper, TableAction, UserDrawer, ApiSelect },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { createMessage, createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;
      const userStore = useUserStoreWithOut();

      const [registerTable, { reload }] = useTable({
        title: '',
        api: getUserListAction,
        columns: getUserColumns(),
        canResize: false,
        pagination: true,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        formConfig: {
          labelWidth: 60,
          schemas: getUserSearchFormSchema(),
        },
        useSearchForm: true,
      });

      const roles = ref<RoleModel[]>([]);
      getRoles().then((response) => {
        roles.value = response;
      });

      async function getUserListAction(params: any) {
        const data = await getUserList(userStore.getUserInfo.organization_id, params);
        return data;
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        destroyUser(record.id).then((response) => {
          success('员工删除成功!');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleCreate,
        roles,
      };
    },
  });
</script>

<style type="text/css">
  .vben-basic-table-form-container {
    padding: 0 !important;
  }
  .vben-basic-form .ant-form-item {
    margin-bottom: 10px !important;
  }
</style>
