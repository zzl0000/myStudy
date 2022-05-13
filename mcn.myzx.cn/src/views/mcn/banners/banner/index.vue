<template>
  <PageWrapper title="专家文章列表">
    <!-- <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="default" class="ml-2">批量删除</a-button>
        <a-button type="primary" class="ml-2" @click="handleNews"><plus-outlined />新增</a-button>
      </template>

      <template #status="{ record }">
        <span v-if="record.status == 1" style="color: #70b603">正常</span>
        <span v-if="record.status == 0" style="color: #aaaaaa">下架</span>
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
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除菜单',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ExpertDrawerVue @register="registerDrawer" /> -->
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getExpertsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import ExpertDrawerVue from './expertDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { GetExperts } from '/@/api/sys/experts';
  import { ref } from 'vue';

  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    api: getExperts,
    columns: getExpertsColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['fieldTime', ['created_at_start', 'created_at_end'], 'YYYY-MM-DD']],
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
    rowSelection: {
      type: 'checkbox',
    },
    striped: false,
  });

  async function getExperts(params: any) {
    const data = await GetExperts(params);
    console.log(data);
    // data.created_at.splice('');
    // console.log(data.created_at);
    return data;
  }

  function handleNews() {
    openDrawer(true);
  }

  function handleEdit(record) {}

  function handleDelete(record) {}
</script>

<style></style>
