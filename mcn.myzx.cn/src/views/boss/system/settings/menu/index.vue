<template>
  <PageWrapper
    title="菜单管理"
    contentBackground
    content="创建用户菜单时会自动创建对应的权限，无须为用户菜单单独创建权限; 菜单仅支持二级菜单;"
  >
    <BasicTable @register="register">
      <template #icon="{ record }">
        <Icon :icon="record.icon" :style="{ fontSize: '18px' }" />
      </template>
      <template #toolbar>
        <a-button type="primary" class="mr-2" @click="handleCreate"> + 新增菜单 </a-button>
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
          v-if="record.component != ''"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getMenuColumns } from './data';
  import { PageWrapper } from '/@/components/Page';
  import { getMenuList, destroyMenu } from '/@/api/sys/menu';
  import { Icon } from '/@/components/Icon/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  export default defineComponent({
    name: 'SystemSettingsMenuList',
    components: { BasicTable, PageWrapper, Icon, TableAction, MenuDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { createMessage, createSuccessModal, createWarningModal } = useMessage();
      const { info, success, warning, error } = createMessage;
      const [register, { reload, expandAll, collapseAll }] = useTable({
        title: '',
        isTreeTable: true,
        //rowSelection: { type: 'checkbox' },
        api: getMenuList,
        columns: getMenuColumns(),
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
        defaultExpandAllRows: true,
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
        destroyMenu(record.id).then((response) => {
          success('菜单删除成功!');
          reload();
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        register,
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
