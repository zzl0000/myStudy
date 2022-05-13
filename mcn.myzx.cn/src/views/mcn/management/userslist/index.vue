<template>
  <PageWrapper title="用户列表">
    <BasicTable @register="registerTable">
      <template #toolbar> </template>

      <template #examine_status="{ record }">
        <span>
          {{ record.status_name }}
        </span>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '审核',
              onClick: handleDelete.bind(null, record),
              ifShow: record.examine_status == 0,
            },
            {
              label: '查看',
              onClick: handleEdit.bind(null, record),
              ifShow: record.examine_status != 0,
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserListDrawer @register="registerDrawer" />
  </PageWrapper>
</template>

<script lang="ts" setup>
import { PageWrapper } from '/@/components/Page';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getUserSearchFormSchema, getExpertsColumns } from './data';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { PlusOutlined } from '@ant-design/icons-vue';
import UserListDrawer from './userlistDrawer.vue';
import { useDrawer } from '/@/components/Drawer';
import { GetUserList, GetParams } from '/@/api/sys/userslist';
import { ref } from 'vue';

const userStore = useUserStoreWithOut();
const [registerDrawer, { openDrawer }] = useDrawer();

const [registerTable, { reload }] = useTable({
  api: getUserLists,
  columns: getExpertsColumns(),
  formConfig: {
    labelWidth: 80,
    schemas: getUserSearchFormSchema(),
    fieldMapToTime: [['fieldTime', ['created_at_start', 'created_at_end'], 'YYYY-MM-DD']],
  },
  canResize: false,
  useSearchForm: true,
  pagination: true,
  showTableSetting: true,
  showIndexColumn: false,
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  // rowSelection: {
  //   type: 'checkbox',
  // },
  // striped: false,
  // clickToRowSelect: false,
});

GetParams().then((res) => {});

async function getUserLists(params: any) {
   params['page'] = params.current_page;
    params['limit'] = params.per_page;
    delete params.current_page;
    delete params.per_page;

    const { data } = await GetUserList(params);
    data['data'] = data.rows;
    delete data.rows;

    return data;
}

function handleNews() {
  openDrawer(true, {
    isNew: true,
  });
}

function handleEdit(record) {
  openDrawer(true, {
    ischeck: true,
    record,
  });
}

function handleDelete(record) {
  openDrawer(true, {
    isUpdate: true,
    record,
  });
}
</script>

<style></style>
