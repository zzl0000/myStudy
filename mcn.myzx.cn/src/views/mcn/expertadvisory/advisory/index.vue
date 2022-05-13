<template>
  <PageWrapper title="专家顾问团列表">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="default" class="ml-2" @click="handlDeleteBatch">批量删除</a-button> -->
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
    <ExpertDrawerVue @register="registerDrawer" @success="handleSeccess" />
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
  import { GetExpertAdvis, deletes } from '/@/api/sys/expertadvisory';
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const { success } = createMessage;
  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows }] = useTable({
    api: getExpertAdvis,
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
    // rowSelection: {
    //   type: 'checkbox',
    // },
    striped: false,
    clickToRowSelect: false,
  });

  async function getExpertAdvis(params: any) {
    params['page'] = params.current_page;
    params['limit'] = params.per_page;
    delete params.per_page;
    delete params.current_page;

    const { data } = await GetExpertAdvis(params);
    data['data'] = data.rows;
    delete data.rows;

    return data;
  }

  function handleNews() {
    openDrawer(true, {
      isUpdate: true,
    });
  }

  function handleEdit(record) {
    openDrawer(true, {
      record,
      isUpdate: false,
    });
  }

  function handleDelete(record) {
    console.log(record.id);
    let params = {
      id: record.id,
    };
    // (params).then()
    deletes(params).then((res) => {
      if (res.code == 200) {
        success('删除成功!');
        reload();
      }
    });
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
      deletes(Del).then((res) => {
        if (res.code == 200) {
          success('删除成功!');
          reload();
        }
      });
    }
  }
  function handleSeccess() {
    reload();
  }
</script>

<style></style>
