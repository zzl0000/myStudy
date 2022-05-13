<template>
  <PageWrapper title="科普视频">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="default" class="ml-2" @click="handleDelete">批量删除</a-button> -->
        <a-button type="primary" class="ml-2" @click="handleNews"><plus-outlined />新增</a-button>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '下架',
              color: 'error',
              popConfirm: {
                title: '是否下架本条视频',
                confirm: handleSoldOut.bind(null, record),
              },
              ifShow: record.status_name !== '下架',
            },
          ]"
        />
      </template>
    </BasicTable>
    <VideoDrawer @register="registerDrawer" @success="handelSeccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getExpertsColumns } from './data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import VideoDrawer from './videoDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { GetVideo, GetVideoCancel } from '/@/api/sys/video';
  import { ref } from 'vue';

  // const userStore = useUserStoreWithOut();
  // console.log(userStore.getToken);
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows }] = useTable({
    api: getVideo,
    columns: getExpertsColumns(),
    formConfig: {
      labelWidth: 80,
      schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['fieldTime', ['release_time_start', 'release_time_end'], 'YYYY-MM-DD']],
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
    clickToRowSelect: false,
    striped: false,
  });

  console.log(import.meta.env.VITE_PROXY);

  async function getVideo(params: any) {
    params['page'] = params.current_page;
    params['limit'] = params.per_page;
    delete params.current_page;
    delete params.per_page;

    const { data } = await GetVideo(params);
    data['data'] = data.row;
    delete data.row;

    console.log(data);
    return data;
  }

  function handleNews() {
    openDrawer(true, {
      isUpdate: true,
    });
  }

  function handleEdit(record) {
    openDrawer(true, {
      isUpdate: false,
      record,
    });
  }

  function handleSoldOut(record) {
    GetVideoCancel({ id: record.id }).then((res) => {
      reload();
    });
  }

  function handleDelete() {
    // let data = getSelectRows();
    // let Del = '';
    // if (data.length > 0) {
    //   data.map((item) => {
    //     Del += item.id + ',';
    //   });
    //   let params = {
    //     ids: Del,
    //   };
    //   GetExpertsNewsDelete(params).then((res) => {
    //     success('删除成功!');
    //     reload();
    //   });
    // }
  }

  function handelSeccess() {
    reload();
  }
</script>

<style></style>
