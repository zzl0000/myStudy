<template>
  <PageWrapper title="评论管理">
    <BasicTable @register="registerTable">
       <template #toolbar>
        <a-button type="default" class="ml-2" @click="handlDeleteBatch">批量删除</a-button>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
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
  </PageWrapper>
</template>

<script lang="ts" setup>
import { PageWrapper } from '/@/components/Page';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getUserSearchFormSchema, getExpertsColumns } from './data';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { getnews,deletes } from '/@/api/sys/commentlist';
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const userStore = useUserStoreWithOut();

const [registerTable, { reload ,getSelectRows}] = useTable({
  api: getnew,
  columns: getExpertsColumns(),
  formConfig: {
    labelWidth: 80,
    schemas: getUserSearchFormSchema(),
      fieldMapToTime: [['created_at', ['start', 'end'], 'YYYY-MM-DD']]

  },
  useSearchForm: true,
  // pagination: true,
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
     clickToRowSelect: false,

});

async function getnew(params: any) {
  const data = await getnews(params);
  //  const datas = data.data;
  data.total = Number(data.total)
  return data;
}

function handleDelete(record) {
   let params = {
      ids: record.id + '',
    };
    deletes(params).then((res) => {
      message.success('删除成功!');
      reload();
    });
}


  function handlDeleteBatch() {
    let data = getSelectRows();
    let Del = '';
    if (data.length > 0) {
      data.map((item) => {
        Del += item.id + ',';
      });
      let params = {
        ids: Del,
      };
      deletes(params).then((res) => {
        message.success('删除成功!');
        reload();
      });
    }
  }
</script>

<style></style>
