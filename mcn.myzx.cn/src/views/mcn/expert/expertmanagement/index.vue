<template>
  <PageWrapper title="专家预约">
    <BasicTable @register="registerTable">
      <template #status="{ record }">
        <span v-if="record.status.code == 1" style="color:#70b603">申请通过</span>
        <span v-if="record.status.code == 0" style="color:#aaaaaa">待审核</span>
        <span v-if="record.status.code == -1" style="color:red">申请驳回</span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '审核',
              onClick: handleEdit.bind(null, record),
               ifShow: record.status.code == 0
            },
            {
              label: '查看',
              onClick: handleDelete.bind(null, record),
               ifShow: record.status.code != 0
            },
          ]"
        />
      </template>
    ></BasicTable>
    <Expertmanagement @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getExpertsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { GetExpertManagement } from '/@/api/sys/expertmanagement';
  import Expertmanagement from './expertmanagement.vue';
  import { useDrawer } from '/@/components/Drawer';

  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    api: GetExpertManagements,
    columns: getExpertsColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [
        ['fieldTime', ['created_at_begin', 'created_at_end'], 'YYYY-MM-DD 00:00:00'],
      ],
    },
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
    striped: false,
    bordered: true,
  });

  async function GetExpertManagements(params: any) {
    params['page_size'] = params.per_page;
    delete params.per_page;
    let data = [];
    await GetExpertManagement(params).then((res) => {
      data = res.data;
      data['data'] = data.list;
      delete data.list;
    });
    return data;
  }

  function handleEdit(record) {
    openDrawer(true, { record, isUpdate: true });
  }

  function handleDelete(record) {
     openDrawer(true, { record, isUpdate: false });
  }

  function handleSuccess() {
    reload();
  }
</script>

<style></style>
