<template>
  <PageWrapper title="学术活动">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="default" class="ml-2" @click="handlDeleteBatch">批量删除</a-button>

        <a-button type="primary" class="ml-2" @click="handleCreate"> + 新增活动 </a-button>
      </template>
      <!-- <template #address="{ record }">
        {{ record.meeting_time_start + '     ' + record.meeting_time_end }}
      </template> -->
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
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除菜单',
                confirm: handleDelete.bind(null, record),
              },
            },
            {
              icon: 'clarity:note-edit-line',
              label: '报名信息',
              onClick: goTips.bind(null, record),
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
import { getList, deleteList, deleteList } from '/@/api/sys/academicactivities';
import { useMessage } from '/@/hooks/web/useMessage';
import { useDrawer } from '/@/components/Drawer';
import { useUserStoreWithOut } from '/@/store/modules/user';
import UserDrawer from './UserDrawer.vue';
import { ApiSelect } from '/@/components/Form/index';
import { getRoles } from '/@/api/sys/role';
import { RoleModel } from '/@/api/sys/model/roleModel';
import recordVue from '../../assistant/prescription/record.vue';
import { useGo } from '/@/hooks/web/usePage';

export default defineComponent({
  name: 'User',
  components: { BasicTable, PageWrapper, TableAction, UserDrawer, ApiSelect },
  setup() {
    const go = useGo();

    const [registerDrawer, { openDrawer }] = useDrawer();
    const { createMessage, createSuccessModal, createWarningModal } = useMessage();
    const { info, success, warning, error } = createMessage;
    const userStore = useUserStoreWithOut();

    const [registerTable, { reload, getSelectRows }] = useTable({
      title: '',
      api: getHuoDongList,
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
      },
      formConfig: {
        labelWidth: 60,
        schemas: getUserSearchFormSchema(),
        fieldMapToTime: [['meettime', ['meeting_time_start', 'meeting_time_end'], 'YYYY-MM-DD']],
      },
      useSearchForm: true,
      rowSelection: {
        type: 'checkbox',
        columnWidth:20,
      },
      striped: false,
      clickToRowSelect: false,
    });

    // const roles = ref<RoleModel[]>([]);
    // getRoles().then((response) => {
    //   roles.value = response;
    // });

    async function getHuoDongList(params: any) {
      params['page_size'] = params.per_page;
      delete params.per_page;

      const data = await getList(params);
      const datas = data.data;
      datas['data'] = datas.list;
      delete datas.list;
      return datas;
    }

    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      console.log(record, 'recordrecord');
      openDrawer(true, {
        record,
        isUpdate: true,
      });
    }
    function goTips(record: Recordable) {
      const path = `signup?id=${record.id}`;
      go(path);
    }

    function handleDelete(record: Recordable) {
      deleteList(record.id).then((response) => {
        success('删除成功!');
        reload();
      });
    }

    function handleSuccess() {
      reload();
    }

    function handlDeleteBatch() {
      let data = getSelectRows();
      let Del = '';
      if (data.length > 0) {
        data.map((item) => {
          Del += item.id + ',';
        });
        // let params = {
        //   : Del,
        // };
        deleteList(Del).then((res) => {
          success('删除成功!');
          reload();
        });
      }
    }

    return {
      registerTable,
      registerDrawer,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleCreate,
      goTips,
      handlDeleteBatch,
      deleteList,
      // roles,
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
