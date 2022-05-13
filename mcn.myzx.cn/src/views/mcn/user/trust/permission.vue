<template>
  <PageWrapper title="权限管理" contentBackground content="无限极权限">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" class="mr-2" @click="handleCreate"> + 新增权限 </a-button>
        <a-button type="default" @click="expandAll">展开全部</a-button>
        <a-button type="default" @click="collapseAll">折叠全部</a-button>
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
    <PermissionDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getPermissionColumns } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { getPermissionList, destroyPermission } from '/@/api/sys/permission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import PermissionDrawer from './PermissionDrawer.vue';

  export default defineComponent({
    name: 'SystemSettingsPermissionList',
    components: { BasicTable, PageWrapper, TableAction, PermissionDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { createMessage,createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;
      const [registerTable, {reload, expandAll, collapseAll }] = useTable({
        title: '',
        isTreeTable: true,
        //rowSelection: { type: 'checkbox' },
        api: getPermissionList,
        columns: getPermissionColumns(),
        rowKey: 'title',
        canResize: false,
        pagination: false,
        bordered: true,
        showTableSetting: true,
        striped: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

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
        destroyPermission(record.id).then((response) => {
          success('权限删除成功!');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        expandAll,
        collapseAll,
        registerDrawer,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleCreate,
      };
    },
  });
</script>

