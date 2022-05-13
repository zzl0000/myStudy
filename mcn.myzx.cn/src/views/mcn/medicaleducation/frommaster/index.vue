<template>
  <PageWrapper title="拜师申请">
    <BasicTable @register="registerTable">
      <template #toolbar> </template>

      <template #status="{ record }">
        <span v-if="record.status == 1" style="color: #70b603">审核通过</span>
        <span v-if="record.status == 0" style="color: #aaaaaa">待审核</span>
        <span v-if="record.status == -1" style="color: red">拒绝</span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '审核',
              onClick: handleEdit.bind(null, record),
              ifShow: record.status == 0,
            },
            {
              label: '查看',
              onClick: handleDelete.bind(null, record),
              ifShow: record.status != 0,
            },
          ]"
        />
      </template>
    </BasicTable>
    <NewsDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getNewsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import NewsDrawer from './newsDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { GetFromMaster } from '/@/api/sys/frommaster';
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const { success } = createMessage;

  const userStore = useUserStoreWithOut();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows }] = useTable({
    api: GetFromMasters,
    columns: getNewsColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['start_dates', ['start_date', 'end_date'], 'YYYY-MM-DD']],
    },
    useSearchForm: true,
    pagination: true,
    showTableSetting: true,
    showIndexColumn: false,
     clickToRowSelect: false,

    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  async function GetFromMasters(params: any) {
    params['page'] = params.current_page;
    params['limit'] = params.per_page;

    delete params.per_page;
    delete params.current_page;
    if (params.title == 1) {
      params.title = '主任医师';
    } else if (params.title == 2) {
      params.title = '副主任医师';
    } else if (params.title == 3) {
      params.title = '主治医师';
    } else if (params.title == 4) {
      params.title = '医师';
    }
    // let data = [];

    const { data } = await GetFromMaster(params);
    console.log(data)
    data['total'] = data.rows
    data['data'] = data.items;
    delete data.items;
    delete data.rows;
   
    return data;
  }

  function handleNews() {
    openDrawer(true, {
      isUpdate: false,
    });
  }
  //审核
  function handleEdit(record) {
    openDrawer(true, {
      isUpdate: true,
      record,
    });
  }

  function handleDelete(record) {
    openDrawer(true, {
      isUpdate: false,
      record,
    });
  }

  function handlDeleteBatch() {
    let data = getSelectRows();
    let id = '';
    if (data.length > 0) {
      data.map((item) => {
        id += item.id + ',';
      });

      console.log(id);
      GetNewsDelete(id).then((res) => {
        if (res.code == 200) {
          success('新闻资讯删除成功!');
          reload();
        }
      });
    }
  }

  function handleSuccess() {
    reload();
  }
</script>

<style></style>
