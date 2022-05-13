<template>
  <PageWrapper title="角色管理" contentBackground content="超级管理员角色不可管理">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              label: '编辑',
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
              label: '删除',
            },
          ]"
          v-if="record.organization_id > 0"
        />
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getRoles, destroyRole } from '/@/api/sys/role';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';

  import { getRoleColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'Role',
    components: { BasicTable, TableAction, RoleDrawer, PageWrapper },
    setup() {
      const userStore = useUserStoreWithOut();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { createMessage, createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;

      const [registerTable, { reload }] = useTable({
        title: '',
        api: getRolesAction,
        columns: getRoleColumns(),
        canResize: false,
        pagination: false,
        showTableSetting: true,
        bordered: false,
        showIndexColumn: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      async function getRolesAction() {
        const data = await getRoles();
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
        destroyRole(record.id).then((response) => {
          success('权限删除成功!');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
