<template>
  <PageWrapper title="专家文章列表">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="default" class="ml-2" @click="handlDeleteBatch">批量删除</a-button>
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
            {
              label: '复制',
              popConfirm: {
                title: '是否复制',
                confirm: handleCopy.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ExpertDrawerVue @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserSearchFormSchema, getExpertsColumns } from './data';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import ExpertDrawerVue from './expertDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { GetExperts, GetExpertsNewsDelete } from '/@/api/sys/experts';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { GetExpertsNews, GetPaperInfo } from '/@/api/sys/experts';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const { createMessage } = useMessage();
  const { success, error } = createMessage;

  const [registerTable, { reload, getSelectRows }] = useTable({
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
    clickToRowSelect: false,
  });

  async function getExperts(params: any) {
    const data = await GetExperts(params);
    return data;
  }

  function handleNews() {
    openDrawer(true, { isUpdate: true });
  }

  function handleEdit(record) {
    openDrawer(true, { isUpdate: false, record });
  }

  function handleDelete(record) {
    let params = {
      ids: record.id + '',
    };
    GetExpertsNewsDelete(params).then((res) => {
      success('删除成功!');
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
      GetExpertsNewsDelete(params).then((res) => {
        success('删除成功!');
        reload();
      });
    }
  }

  function handleCopy(record) {
    GetPaperInfo(record.id).then((res) => {
      const Info = res;
      console.log(Info);
      let params = {
        category_id: Info.category_id,
        title: Info.title,
        content: Info.content,
        doctor_id: Info.doctor_id,
        view_count_basic: Info.view_count_basic,
        status: Info.status,
        recommended: Info.recommended,
        toped: Info.toped,
        disease_id: Info.disease_id,
        department_1_id: Info.department_1_id,
        department_2_id: Info.department_2_id,
      };
      console.log(params);

      GetExpertsNews(params).then((res) => {
        if (res.id) {
          success('复制成功');
          reload();
        } else {
          error(res.message);
        }
      });
    });
  }

  function handleSuccess() {
    reload();
  }
</script>

<style></style>
